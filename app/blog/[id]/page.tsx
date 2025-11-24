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
        Share2,
        BookmarkPlus,
        ArrowLeft,
        Tag
} from "lucide-react";
import { useParams } from "next/navigation"; import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

const BlogPost = () => {
        const params = useParams();
        const id = Array.isArray(params.id) ? params.id[0] : params.id;;
        const [blogPost, setBlogPost] = React.useState<Tables<"packages"> | null>(null);
        const [relatedPosts, setRelatedPosts] = React.useState<Tables<"packages">[]>([]);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
                if (id) {
                        fetchBlogPost();
                        fetchRelatedPosts();
                }
        }, [id]);

        const fetchBlogPost = async () => {
                try {
                        const { data, error } = await supabase
                                .from('packages')
                                .select('*')
                                .eq("id", id as string)
                                .maybeSingle();

                        if (error) throw error;
                        setBlogPost(data);
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
                                .limit(3)
                                .order('published_date', { ascending: false });

                        if (error) throw error;
                        setRelatedPosts(data || []);
                } catch (error) {
                        console.error('Error fetching related posts:', error);
                }
        };

        if (loading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Header />
                                <div className="pt-32 pb-16 text-center">
                                        <p className="text-lg text-muted-foreground">Loading blog post...</p>
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
                                        <h1 className="text-4xl font-bold text-foreground mb-4">Blog Post Not Found</h1>
                                        <Link href="/blog">
                                                <Button>Back to Blog</Button>
                                        </Link>
                                </div>
                                <Footer />
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Breadcrumb */}
                        <section className="pt-32 pb-8 bg-muted/30">
                                <div className="container mx-auto px-4">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                                                <span>/</span>
                                                <span className="text-foreground">{blogPost.title}</span>
                                        </div>
                                </div>
                        </section>

                        {/* Article Header */}
                        <section className="py-12 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto">
                                                <div className="mb-8">
                                                        <Link href="/blog" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6">
                                                                <ArrowLeft className="w-4 h-4" />
                                                                <span>Back to Blog</span>
                                                        </Link>

                                                        <Badge className="mb-4">{blogPost.category}</Badge>

                                                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground leading-tight">
                                                                {blogPost.title}
                                                        </h1>

                                                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                                                {blogPost.excerpt}
                                                        </p>

                                                        {/* Author and Meta */}
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-y border-border">
                                                                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                                                <User className="w-6 h-6 text-white" />
                                                                        </div>
                                                                        <div>
                                                                                <h3 className="font-semibold">{blogPost.author}</h3>
                                                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                                                        <div className="flex items-center space-x-1">
                                                                                                <Calendar className="w-4 h-4" />
                                                                                                <span>{blogPost.published_date ? new Date(blogPost.published_date).toLocaleDateString() : 'N/A'}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-1">
                                                                                                <Clock className="w-4 h-4" />
                                                                                                <span>{blogPost.read_time}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-1">
                                                                                                <Eye className="w-4 h-4" />
                                                                                                <span>{blogPost.views} views</span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                        <Button variant="outline" size="sm">
                                                                                <BookmarkPlus className="w-4 h-4 mr-2" />
                                                                                Save
                                                                        </Button>
                                                                        <Button variant="outline" size="sm">
                                                                                <Share2 className="w-4 h-4 mr-2" />
                                                                                Share
                                                                        </Button>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Featured Image */}
                                                <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary to-accent rounded-2xl mb-12 overflow-hidden">
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="text-white/20 text-6xl">📷</div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Article Content */}
                        <section className="py-12 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
                                                {/* Main Content */}
                                                <div className="lg:col-span-3">
                                                        <article className="prose prose-lg max-w-none">
                                                                <div
                                                                        className="text-foreground leading-relaxed"
                                                                        dangerouslySetInnerHTML={{ __html: blogPost.content }}
                                                                />
                                                        </article>

                                                        {/* Tags */}
                                                        <div className="mt-12 pt-8 border-t border-border">
                                                                <h3 className="font-semibold mb-4 flex items-center">
                                                                        <Tag className="w-5 h-5 mr-2 text-muted-foreground" />
                                                                        Tags
                                                                </h3>
                                                                <div className="flex flex-wrap gap-2">
                                                                        {blogPost.tags && blogPost.tags.map((tag: any) => (
                                                                                <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                                                                                        {tag}
                                                                                </Badge>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        {/* Author Bio */}
                                                        {blogPost.author_bio && (
                                                                <Card className="mt-12 shadow-card">
                                                                        <CardContent className="p-6">
                                                                                <div className="flex items-start space-x-4">
                                                                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                                                                                <User className="w-8 h-8 text-white" />
                                                                                        </div>
                                                                                        <div>
                                                                                                <h3 className="font-display font-semibold text-lg mb-2">About {blogPost.author}</h3>
                                                                                                <p className="text-muted-foreground leading-relaxed">
                                                                                                        {blogPost.author_bio}
                                                                                                </p>
                                                                                        </div>
                                                                                </div>
                                                                        </CardContent>
                                                                </Card>
                                                        )}
                                                </div>

                                                {/* Sidebar */}
                                                <div className="lg:col-span-1">
                                                        <div className="sticky top-32 space-y-8">
                                                                {/* Related Posts */}
                                                                <Card className="shadow-card">
                                                                        <CardContent className="p-6">
                                                                                <h3 className="font-semibold mb-4">Related Articles</h3>
                                                                                <div className="space-y-4">
                                                                                        {relatedPosts.map((post: any) => (
                                                                                                <div key={post.id}>
                                                                                                        <Link href={`/blog/${post.id}`}>
                                                                                                                <h4 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors mb-1">
                                                                                                                        {post.title}
                                                                                                                </h4>
                                                                                                        </Link>
                                                                                                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                                                                                                {post.excerpt}
                                                                                                        </p>
                                                                                                        <p className="text-xs text-muted-foreground">{post.read_time}</p>
                                                                                                        <Separator className="mt-3" />
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                        </CardContent>
                                                                </Card>

                                                                {/* CTA */}
                                                                <Card className="shadow-card bg-primary text-white">
                                                                        <CardContent className="p-6 text-center">
                                                                                <h3 className="font-display font-semibold mb-3">
                                                                                        Ready for Your Adventure?
                                                                                </h3>
                                                                                <p className="text-sm text-primary-foreground/80 mb-4">
                                                                                        Let our experts help you plan your perfect Nepal experience.
                                                                                </p>
                                                                                <Button className="w-full bg-white text-primary hover:bg-white/90">
                                                                                        Contact Us
                                                                                </Button>
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
