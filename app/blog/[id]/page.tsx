"use client";

import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Calendar,
  User,
  Eye,
  Clock,
  Mail,
  Share2,
  BookmarkPlus,
  ArrowLeft,
  Tag,
  Heart,
  MessageCircle,
  BookOpen,
  Mountain,
  ChevronRight,
  Link as LinkIcon,
  Copy,
  Check,
  TrendingUp,
  Star,
  Sparkles,
  MapPin,
  Camera,
  Map,
  Compass,
  Navigation,
  ExternalLink
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const BlogPost = () => {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [blogPost, setBlogPost] = React.useState<Tables<"packages"> | null>(null);
  const [relatedPosts, setRelatedPosts] = React.useState<Tables<"packages">[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [showShareTooltip, setShowShareTooltip] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchBlogPost();
      fetchRelatedPosts();
    }
  }, [id]);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.pageYOffset > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq("id", id as string)
        .maybeSingle();

      if (error) throw error;
      setBlogPost(data);
      setLikeCount(data?.likes || 0);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .neq('id', id)
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRelatedPosts(data || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    // Update in database
    try {
      await supabase
        .from('packages')
        .update({ likes: isLiked ? likeCount - 1 : likeCount + 1 })
        .eq('id', id);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <Header />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-primary/90 transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 rotate-270" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section - Reduced height */}
      <section className="relative pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Navigation */}
            <div className="mb-6">
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>

            {/* Category and Featured Badge */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm">
                  {blogPost.category}
                </Badge>
              </motion.div>
              {blogPost.is_featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1.5 text-sm">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight text-foreground"
            >
              {blogPost.title}
            </motion.h1>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl"
            >
              {blogPost.excerpt}
            </motion.p>

            {/* Author and Meta - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between py-4"
            >
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center overflow-hidden border-2 border-background shadow-lg">
                    {blogPost.author_avatar ? (
                      <img
                        src={blogPost.author_avatar}
                        alt={blogPost.author}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{blogPost.author}</h3>
                  <div className="flex items-center flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{blogPost.published_date ? new Date(blogPost.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{blogPost.read_time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Like Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`gap-2 ${isLiked ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : ''}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{likeCount} Likes</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image - Reduced margin */}
      {blogPost.image_url && (
        <section className="container mx-auto px-4 max-w-6xl mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={blogPost.image_url}
              alt={blogPost.title}
              className="w-full h-[400px] md:h-[450px] object-cover"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/80">
              <Camera className="w-4 h-4" />
              <span className="text-sm">Featured Image</span>
            </div>
          </motion.div>
        </section>
      )}

      {/* Main Content - Moved closer to image */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Article */}
            <div className="lg:col-span-3">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="prose prose-lg max-w-none"
              >
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-border">
                  <div
                    className="text-foreground leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                  />
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Related Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags?.map((tag: string, index: number) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge
                          variant="outline"
                          className="px-3 py-1.5 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                          onClick={() => router.push(`/blog?tag=${tag}`)}
                        >
                          #{tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Author Bio */}
                {blogPost.author_bio && (
                  <Card className="mt-8 shadow-lg border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center overflow-hidden border-3 border-background">
                            {blogPost.author_avatar ? (
                              <img
                                src={blogPost.author_avatar}
                                alt={blogPost.author}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">About {blogPost.author}</h3>
                            <Badge className="bg-primary/10 text-primary text-xs">
                              Author
                            </Badge>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            {blogPost.author_bio}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.article>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                {/* Related Posts - Previous design */}
                <Card className="shadow-lg border-primary/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Mountain className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Related Adventures</h3>
                    </div>
                    <div className="space-y-4">
                      {relatedPosts.map((post: any, index: number) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link href={`/blog/${post.id}`}>
                            <div className="group cursor-pointer">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                  {post.image_url ? (
                                    <img
                                      src={post.image_url}
                                      alt={post.title}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                      <BookOpen className="w-5 h-5 text-white/60" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors mb-1 whitespace-normal">
                                    {post.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{post.read_time}</span>
                                  </div>
                                </div>
                              </div>
                              <Separator className="mt-3 group-hover:bg-primary/30 transition-colors" />
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;