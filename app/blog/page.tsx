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
  List,
  Menu
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

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
        <div className="pt-20 sm:pt-32 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4">
              <Loader2 className="w-6 h-6 m-auto" />
            </div>
            <p className="text-base sm:text-lg text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* Hero Background Image */}
          <div className="relative h-full w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/hero_section/blogs.jpg`}
              alt="Shanti Himalaya Resort - Luxury Himalayan Retreat"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 hero-gradient opacity-60" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 sm:mb-6 text-sm sm:text-xl bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Stories & Insights
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white font-display font-bold mb-3 sm:mb-6">
              Travel
              <span className="block text-luxury mt-1 sm:mt-0">Stories</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white/90 leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              This space is dedicated to stories from the mountains themselves. Our blog features journeys, memories, and travel experiences written by Himalayan wanderers —guides, villagers, storytellers, and travel experts who call these landscapes home. Through their words, discover the Himalayas as lived and felt: intimate trails, quiet traditions, personal encounters, and timeless wisdom shaped by life in the mountains.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter Bar - Mobile Responsive */}
      <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 lg:px-10 py-2 sm:py-4">
          <div className="flex flex-col gap-3">
            {/* Mobile Header */}
            <div className="flex items-center justify-between lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {selectedCategory !== "All Posts" && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    1
                  </Badge>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                {/* Mobile Search Toggle */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowSearch(!showSearch)}
                  className="lg:hidden"
                >
                  <Search className="w-4 h-4" />
                </Button>
                
                {/* View Toggle */}
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="grid" className="h-7 w-7 p-0">
                      <Grid3X3 className="w-3 h-3" />
                    </TabsTrigger>
                    <TabsTrigger value="list" className="h-7 w-7 p-0">
                      <List className="w-3 h-3" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Search Bar - Mobile */}
            <AnimatePresence>
              {(showSearch || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full lg:hidden"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full text-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Search */}
            <div className="hidden lg:block w-full md:w-auto relative">
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

            {/* Categories - Mobile */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden"
                >
                  <div className="flex flex-wrap gap-2 py-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowMobileFilters(false);
                        }}
                        className={cn(
                          "text-xs",
                          selectedCategory === category && "shadow-md"
                        )}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categories - Desktop */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
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

            {/* Desktop View Toggle */}
            <div className="hidden lg:flex items-center gap-2">
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
      <section className="py-8 sm:py-12 px-3 sm:px-4 lg:px-24">
        <div className="container mx-auto">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold">
                {selectedCategory === "All Posts" ? "Voices of the Himalayas" : selectedCategory}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredPosts.length} articles found
              </p>
            </div>
            <Badge variant="outline" className="text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Latest First
            </Badge>
          </div>

          {filteredPosts.length > 0 ? (
            <div className={cn(
              "gap-4 sm:gap-6",
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "space-y-4 sm:space-y-6"
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
                    viewMode === "list" && "flex flex-col sm:flex-row"
                  )}>
                    {/* Image */}
                    <div className={cn(
                      "relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10",
                      viewMode === "list" 
                        ? "sm:w-64 sm:h-auto h-40 sm:h-auto" 
                        : "h-40 sm:h-48"
                    )}>
                      {post.image_url ? (
                        <img
                          src={post.image_url || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-10 h-10 sm:w-16 sm:h-16 text-primary/30" />
                        </div>
                      )}
                      {post.is_featured && (
                        <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                          <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 text-foreground text-xs">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <CardContent className={cn(
                      "p-3 sm:p-6 flex flex-col",
                      viewMode === "list" && "flex-1"
                    )}>
                      <div className="flex-1">
                        <Link href={`/blog/${post.slug}`} onClick={() => handlePostClick(post.id)}>
                          <h3 className="text-base sm:text-lg lg:text-xl font-display font-semibold mb-2 sm:mb-3 line-clamp-2 hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 gap-2">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{post.read_time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{post.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{post.likes || 0}</span>
                          </div>
                        </div>
                        <span className="text-xs">
                          {new Date(post.published_date).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Author & Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleLike(post.id)}
                            className={cn(
                              "h-7 w-7 sm:h-8 sm:w-8",
                              isLiked[post.id] && "text-red-500 hover:text-red-600"
                            )}
                          >
                            <Heart className={cn(
                              "w-3 h-3 sm:w-4 sm:h-4",
                              isLiked[post.id] && "fill-current"
                            )} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleBookmark(post.id)}
                            className={cn(
                              "h-7 w-7 sm:h-8 sm:w-8",
                              isBookmarked[post.id] && "text-primary hover:text-primary"
                            )}
                          >
                            <BookmarkPlus className={cn(
                              "w-3 h-3 sm:w-4 sm:h-4",
                              isBookmarked[post.id] && "fill-current"
                            )} />
                          </Button>
                          <Link href={`/blog/${post.slug}`} onClick={() => handlePostClick(post.id)}>
                            <Button size="sm" className="h-7 sm:h-8 text-xs sm:text-sm gap-1">
                              Read
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
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
            <Card className="text-center py-8 sm:py-16 border-dashed">
              <CardContent>
                <BookOpen className="w-12 h-12 sm:w-20 sm:h-20 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
                <h3 className="text-lg sm:text-2xl font-semibold text-muted-foreground mb-2">
                  No articles found
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Try adjusting your search term or category filter
                </p>
                <Button
                  variant="outline"
                  size="sm"
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
        <section className="py-10 sm:py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="text-center mb-6 sm:mb-10">
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-2 sm:mb-3">
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500" />
                <h2 className="text-xl sm:text-2xl lg:text-4xl font-display font-bold text-foreground">
                  Featured Stories
                </h2>
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
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
                  <Card className="overflow-hidden shadow-xl sm:shadow-2xl border-2 border-primary/30">
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0">
                      {/* Image Side */}
                      <div className="relative h-48 sm:h-64 lg:h-auto">
                        {featuredPosts[featuredIndex].image_url ? (
                          <img
                            src={featuredPosts[featuredIndex].image_url || "/placeholder.svg"}
                            alt={featuredPosts[featuredIndex].title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <BookOpen className="w-12 h-12 sm:w-24 sm:h-24 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:hidden" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/70 lg:via-black/40 lg:to-transparent" />
                        <Badge className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                          {featuredPosts[featuredIndex].category}
                        </Badge>
                        <Badge className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                          Featured
                        </Badge>
                      </div>

                      {/* Content Side */}
                      <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12 bg-gradient-to-br from-background to-primary/5 flex flex-col justify-center">
                        <div>
                          <Badge variant="outline" className="mb-2 sm:mb-4 text-xs">
                            Featured Story {featuredIndex + 1} of {featuredPosts.length}
                          </Badge>
                          <Link href={`/blog/${featuredPosts[featuredIndex].slug}`} onClick={() => handlePostClick(featuredPosts[featuredIndex].id)}>
                            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-display font-bold mb-2 sm:mb-4 hover:text-primary transition-colors line-clamp-2">
                              {featuredPosts[featuredIndex].title}
                            </h3>
                          </Link>
                          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-6 line-clamp-3 sm:line-clamp-4">
                            {featuredPosts[featuredIndex].excerpt}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-8">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <User className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="line-clamp-1">{featuredPosts[featuredIndex].author}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{featuredPosts[featuredIndex].read_time}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{featuredPosts[featuredIndex].views || 0} views</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <Link href={`/blog/${featuredPosts[featuredIndex].slug}`} onClick={() => handlePostClick(featuredPosts[featuredIndex].id)} className="w-full sm:w-auto">
                              <Button size="sm" className="w-full sm:w-auto gap-1 sm:gap-2 text-sm">
                                Read Full Story
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </Link>
                            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleLike(featuredPosts[featuredIndex].id)}
                                className={cn(
                                  "h-8 w-8 sm:h-9 sm:w-9",
                                  isLiked[featuredPosts[featuredIndex].id] && "text-red-500 border-red-200"
                                )}
                              >
                                <Heart className={cn(
                                  "w-4 h-4 sm:w-5 sm:h-5",
                                  isLiked[featuredPosts[featuredIndex].id] && "fill-current"
                                )} />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleBookmark(featuredPosts[featuredIndex].id)}
                                className="h-8 w-8 sm:h-9 sm:w-9"
                              >
                                <BookmarkPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows - Hidden on mobile */}
              <Button
                size="icon"
                variant="outline"
                className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm z-10"
                onClick={prevFeatured}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm z-10"
                onClick={nextFeatured}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {/* Featured Posts Thumbnails */}
              <div className="flex justify-center gap-1.5 sm:gap-3 mt-4 sm:mt-6">
                {featuredPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFeaturedIndex(index)}
                    className={cn(
                      "h-2 sm:h-3 rounded-full transition-all",
                      index === featuredIndex
                        ? "bg-primary w-4 sm:w-8"
                        : "bg-primary/30 w-2 sm:w-3 hover:bg-primary/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sidebar Content Below */}
      <section className="py-10 sm:py-16 px-3 sm:px-4 lg:px-24 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Popular This Month */}
            <Card className="shadow-xl border-primary/20">
              <CardHeader className="bg-primary/5 pb-2 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span>Popular This Month</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                {popularPosts.map((post: any, index: number) => (
                  <div key={post.id} className="group">
                    <Link href={`/blog/${post.slug}`} onClick={() => handlePostClick(post.id)}>
                      <div className="flex space-x-2 sm:space-x-3 cursor-pointer items-start">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0">
                          {post.image_url ? (
                            <img
                              src={post.image_url || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                            <Eye className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span>{post.views || 0} views</span>
                            <span className="hidden xs:inline">•</span>
                            <span className="hidden xs:inline">{post.read_time}</span>
                          </div>
                        </div>
                      </div>
                      {index < popularPosts.length - 1 && (
                        <Separator className="mt-2 sm:mt-3" />
                      )}
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card className="shadow-xl border-accent/20">
              <CardHeader className="bg-accent/5 pb-2 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  <span>Top Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  {categories.slice(1).map((category: any) => {
                    const count = blogPosts.filter((post: any) => post.category === category).length;
                    const categoryPosts = blogPosts.filter((post: any) => post.category === category);
                    const topPost = categoryPosts.sort((a: any, b: any) => (b.views || 0) - (a.views || 0))[0];

                    return (
                      <div key={category} className="group">
                        <div
                          className="flex items-center justify-between cursor-pointer p-1 sm:p-2 rounded-lg hover:bg-primary/5 transition-colors"
                          onClick={() => {
                            setSelectedCategory(category);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">{count}</span>
                            </div>
                            <span className="text-xs sm:text-sm font-medium hover:text-primary transition-colors">
                              {category}
                            </span>
                          </div>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        {topPost && (
                          <div className="pl-8 sm:pl-11 pr-2 pb-1 sm:pb-2">
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              Top: {topPost.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {topPost.views || 0} views
                            </p>
                          </div>
                        )}
                        {category !== categories[categories.length - 1] && (
                          <Separator className="mt-1 sm:mt-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <Card className="shadow-xl sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 flex items-center">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-primary" />
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {popularTags.map((tag: any) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-primary hover:text-white transition-colors border-primary/30 px-2 py-0.5 sm:px-2.5 sm:py-1"
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