"use client";

import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Calendar,
  User,
  Eye,
  ArrowRight,
  Clock,
  Tag,
  TrendingUp,
  BookOpen,
  X,
  Loader2,
  Sparkles,
  Heart,
  BookmarkPlus,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Grid3X3,
  List
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const Blog = () => {
  const [blogPosts, setBlogPosts] = React.useState<Tables<"packages">[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categories, setCategories] = React.useState(["All Posts"]);
  const [selectedCategory, setSelectedCategory] = React.useState("All Posts");
  const [isBookmarked, setIsBookmarked] = React.useState<Record<string, boolean>>({});
  const [isLiked, setIsLiked] = React.useState<Record<string, boolean>>({});
  const [showSearch, setShowSearch] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [featuredIndex, setFeaturedIndex] = React.useState(0);

  React.useEffect(() => {
    fetchBlogPosts();

    const channel = supabase
      .channel('packages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, () => {
        fetchBlogPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;

      setBlogPosts(data || []);

      // Extract unique categories
      const uniqueCategories = ["All Posts", ...new Set(data?.map((post: any) => post.category) || [])];
      setCategories(uniqueCategories);

      // Initialize bookmarks and likes from localStorage
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarked_posts') || '{}');
      const savedLikes = JSON.parse(localStorage.getItem('liked_posts') || '{}');
      setIsBookmarked(savedBookmarks);
      setIsLiked(savedLikes);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (postId: string) => {
    try {
      // Get current post
      const post = blogPosts.find(p => p.id === postId);
      if (!post) return;

      // Check if user has viewed this post in current session
      const viewedPosts = JSON.parse(sessionStorage.getItem('viewed_posts') || '[]');
      if (viewedPosts.includes(postId)) return;

      // Update views count
      const { error } = await supabase
        .from('packages')
        .update({ views: (post.views || 0) + 1 })
        .eq('id', postId);

      if (error) throw error;

      // Mark as viewed in session storage
      sessionStorage.setItem('viewed_posts', JSON.stringify([...viewedPosts, postId]));

      // Update local state
      setBlogPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, views: (p.views || 0) + 1 } : p
      ));
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handlePostClick = async (postId: string) => {
    await incrementViews(postId);
  };

  const handleBookmark = (postId: string) => {
    const newBookmarked = { ...isBookmarked, [postId]: !isBookmarked[postId] };
    setIsBookmarked(newBookmarked);
    localStorage.setItem('bookmarked_posts', JSON.stringify(newBookmarked));
  };

  const handleLike = async (postId: string) => {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    const newLiked = { ...isLiked, [postId]: !isLiked[postId] };
    setIsLiked(newLiked);
    localStorage.setItem('liked_posts', JSON.stringify(newLiked));

    // Update likes count in database
    const newLikes = isLiked[postId] ? (post.likes || 0) - 1 : (post.likes || 0) + 1;
    
    try {
      const { error } = await supabase
        .from('packages')
        .update({ likes: newLikes })
        .eq('id', postId);

      if (error) throw error;

      // Update local state
      setBlogPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, likes: newLikes } : p
      ));
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get featured posts (is_featured = true)
  const featuredPosts = blogPosts.filter((post: any) => post.is_featured === true);
  
  // Get popular posts for sidebar (sort by views)
  const popularPosts = [...blogPosts].sort((a: any, b: any) => 
    (b.views || 0) - (a.views || 0)
  ).slice(0, 5);
  
  // Get recent posts
  const recentPosts = [...blogPosts].slice(0, 12);

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const popularTags = [...new Set(blogPosts.flatMap((post: any) => post.tags || []))].slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4">
              <Loader2 className="w-6 h-6 m-auto" />
            </div>
            <p className="text-lg text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Stories & Insights
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Travel
              <span className="block text-luxury">Stories</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8">
              Discover insider tips, cultural insights, and inspiring stories from the heart of the Himalayas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter Bar */}
      <section className="sticky px-24 top-16 z-40 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-10 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="w-full md:w-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "whitespace-nowrap",
                    selectedCategory === category && "shadow-md"
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList>
                  <TabsTrigger value="grid" className="h-9 w-9 p-0">
                    <Grid3X3 className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="h-9 w-9 p-0">
                    <List className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="py-12 px-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-display font-bold">
                {selectedCategory === "All Posts" ? "All Stories" : selectedCategory}
              </h2>
              <p className="text-muted-foreground">
                {filteredPosts.length} articles found
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Latest First
            </Badge>
          </div>

          {filteredPosts.length > 0 ? (
            <div className={cn(
              "gap-6",
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-6"
            )}>
              {filteredPosts.map((post: any) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={cn(
                    "h-full shadow-lg hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 overflow-hidden group",
                    viewMode === "list" && "flex md:flex-row"
                  )}>
                    {/* Image */}
                    <div className={cn(
                      "relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10",
                      viewMode === "list" ? "md:w-64 md:h-auto h-48" : "h-48"
                    )}>
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-primary/30" />
                        </div>
                      )}
                      {post.is_featured && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <CardContent className={cn(
                      "p-6 flex flex-col",
                      viewMode === "list" && "flex-1"
                    )}>
                      <div className="flex-1">
                        <Link href={`/blog/${post.id}`} onClick={() => handlePostClick(post.id)}>
                          <h3 className="text-xl font-display font-semibold mb-3 line-clamp-2 hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.read_time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes || 0}</span>
                          </div>
                        </div>
                        <span className="text-sm">
                          {new Date(post.published_date).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Author & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleLike(post.id)}
                            className={cn(
                              "h-8 w-8",
                              isLiked[post.id] && "text-red-500 hover:text-red-600"
                            )}
                          >
                            <Heart className={cn(
                              "w-4 h-4",
                              isLiked[post.id] && "fill-current"
                            )} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleBookmark(post.id)}
                            className={cn(
                              "h-8 w-8",
                              isBookmarked[post.id] && "text-primary hover:text-primary"
                            )}
                          >
                            <BookmarkPlus className={cn(
                              "w-4 h-4",
                              isBookmarked[post.id] && "fill-current"
                            )} />
                          </Button>
                          <Link href={`/blog/${post.id}`} onClick={() => handlePostClick(post.id)}>
                            <Button size="sm" className="gap-1">
                              Read
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 border-dashed">
              <CardContent>
                <BookOpen className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-semibold text-muted-foreground mb-2">
                  No articles found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search term or category filter
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Posts');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Featured Posts Carousel - Full Width */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <h2 className="text-4xl font-display font-bold text-foreground">
                  Featured Stories
                </h2>
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handpicked articles that offer exceptional insights and travel experiences
              </p>
            </div>

            <div className="relative">
              {/* Featured Post */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <Card className="overflow-hidden shadow-2xl border-2 border-primary/30">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Image Side */}
                      <div className="relative h-80 lg:h-auto">
                        {featuredPosts[featuredIndex].image_url ? (
                          <img
                            src={featuredPosts[featuredIndex].image_url}
                            alt={featuredPosts[featuredIndex].title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <BookOpen className="w-24 h-24 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:hidden" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/70 lg:via-black/40 lg:to-transparent" />
                        <Badge className="absolute top-4 left-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          {featuredPosts[featuredIndex].category}
                        </Badge>
                        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          Featured
                        </Badge>
                      </div>

                      {/* Content Side */}
                      <CardContent className="p-8 lg:p-12 bg-gradient-to-br from-background to-primary/5 flex flex-col justify-center">
                        <div>
                          <Badge variant="outline" className="mb-4">
                            Featured Story {featuredIndex + 1} of {featuredPosts.length}
                          </Badge>
                          <Link href={`/blog/${featuredPosts[featuredIndex].id}`} onClick={() => handlePostClick(featuredPosts[featuredIndex].id)}>
                            <h3 className="text-3xl lg:text-4xl font-display font-bold mb-4 hover:text-primary transition-colors">
                              {featuredPosts[featuredIndex].title}
                            </h3>
                          </Link>
                          <p className="text-lg text-muted-foreground mb-6 line-clamp-4">
                            {featuredPosts[featuredIndex].excerpt}
                          </p>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{featuredPosts[featuredIndex].author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{featuredPosts[featuredIndex].read_time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span>{featuredPosts[featuredIndex].views || 0} views</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Link href={`/blog/${featuredPosts[featuredIndex].id}`} onClick={() => handlePostClick(featuredPosts[featuredIndex].id)}>
                              <Button size="lg" className="gap-2">
                                Read Full Story
                                <ArrowRight className="w-5 h-5" />
                              </Button>
                            </Link>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleLike(featuredPosts[featuredIndex].id)}
                                className={cn(
                                  isLiked[featuredPosts[featuredIndex].id] && "text-red-500 border-red-200"
                                )}
                              >
                                <Heart className={cn(
                                  "w-5 h-5",
                                  isLiked[featuredPosts[featuredIndex].id] && "fill-current"
                                )} />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleBookmark(featuredPosts[featuredIndex].id)}
                              >
                                <BookmarkPlus className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <Button
                size="icon"
                variant="outline"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm z-10"
                onClick={prevFeatured}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm z-10"
                onClick={nextFeatured}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Featured Posts Thumbnails */}
              <div className="flex justify-center gap-3 mt-6">
                {featuredPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFeaturedIndex(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      index === featuredIndex 
                        ? "bg-primary w-8" 
                        : "bg-primary/30 hover:bg-primary/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sidebar Content Below */}
      <section className="py-16 px-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Popular This Month */}
            <Card className="shadow-xl border-primary/20">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-lg">Popular This Month</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularPosts.map((post: any, index: number) => (
                  <div key={post.id} className="group">
                    <Link href={`/blog/${post.id}`} onClick={() => handlePostClick(post.id)}>
                      <div className="flex space-x-3 cursor-pointer items-start">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          {post.image_url ? (
                            <img 
                              src={post.image_url} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            <span>{post.views || 0} views</span>
                            <span>•</span>
                            <span>{post.read_time}</span>
                          </div>
                        </div>
                      </div>
                      {index < popularPosts.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card className="shadow-xl border-accent/20">
              <CardHeader className="bg-accent/5 pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-accent" />
                  <span className="text-lg">Top Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(1).map((category: any) => {
                    const count = blogPosts.filter((post: any) => post.category === category).length;
                    const categoryPosts = blogPosts.filter((post: any) => post.category === category);
                    const topPost = categoryPosts.sort((a: any, b: any) => (b.views || 0) - (a.views || 0))[0];
                    
                    return (
                      <div key={category} className="group">
                        <div 
                          className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-primary/5 transition-colors"
                          onClick={() => setSelectedCategory(category)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">{count}</span>
                            </div>
                            <span className="text-sm font-medium hover:text-primary transition-colors">
                              {category}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        {topPost && (
                          <div className="pl-11 pr-2 pb-2">
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              Top: {topPost.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {topPost.views || 0} views
                            </p>
                          </div>
                        )}
                        {category !== categories[categories.length - 1] && (
                          <Separator className="mt-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <Card className="shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-primary" />
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag: any) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-sm cursor-pointer hover:bg-primary hover:text-white transition-colors border-primary/30"
                        onClick={() => setSearchQuery(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;