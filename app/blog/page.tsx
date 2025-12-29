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
        BookOpen
} from "lucide-react";
import Link from "next/link";;
import React from "react";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
        const [blogPosts, setBlogPosts] = React.useState<Tables<"packages">[]>([]);
        const [loading, setLoading] = React.useState(true);
        const [categories, setCategories] = React.useState(["All Posts"]);
        const [selectedCategory, setSelectedCategory] = React.useState("All Posts");

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
                } catch (error) {
                        console.error('Error fetching blog posts:', error);
                } finally {
                        setLoading(false);
                }
        };

        if (loading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Header />
                                <div className="pt-32 pb-16 text-center">
                                        <p className="text-lg text-muted-foreground">Loading blog posts...</p>
                                </div>
                                <Footer />
                        </div>
                );
        }

        const featuredPosts = blogPosts.filter((post: any) => post.featured);
        const recentPosts = blogPosts.slice(0, 5);
        const popularTags = [...new Set(blogPosts.flatMap((post: any) => post.tags || []))].slice(0, 8);

        const filteredPosts = selectedCategory === "All Posts"
                ? blogPosts
                : blogPosts.filter((post: any) => post.category === selectedCategory);

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section */}
                        <section className="pt-32 pb-16 hero-gradient text-white">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto text-center">
                                                <Badge className="mb-6 bg-white/20 text-white border-white/30">
                                                        Stories & Insights
                                                </Badge>
                                                <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                                                        Travel
                                                        <span className="block text-luxury">Stories</span>
                                                </h1>
                                                <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8">
                                                        Discover insider tips, cultural insights, and inspiring stories from the heart of the Himalayas.
                                                        Your guide to authentic Nepal experiences.
                                                </p>

                                                {/* Search Bar */}
                                                <div className="max-w-md mx-auto">
                                                        <div className="relative">
                                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                                                                <Input
                                                                        placeholder="Search articles..."
                                                                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                                                                />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Featured Articles */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        Featured Stories
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Our most popular and insightful articles, handpicked by our editorial team
                                                        for their value to Nepal travelers and culture enthusiasts.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {featuredPosts.map((post: any) => (
                                                        <Card key={post.id} className="shadow-card hover-lift overflow-hidden">
                                                                <div className="relative h-48 bg-gradient-to-br from-primary to-accent">
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                                <BookOpen className="w-16 h-16 text-white/20" />
                                                                        </div>
                                                                        <Badge className="absolute top-4 left-4 bg-white/20 text-white border-white/30">
                                                                                {post.category}
                                                                        </Badge>
                                                                        <Badge className="absolute top-4 right-4 bg-gold text-white">
                                                                                Featured
                                                                        </Badge>
                                                                </div>

                                                                <CardContent className="p-6">
                                                                        <h3 className="text-xl font-display font-semibold mb-3 line-clamp-2">
                                                                                {post.title}
                                                                        </h3>
                                                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                                                                {post.excerpt}
                                                                        </p>

                                                                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                                                                <div className="flex items-center space-x-4">
                                                                                        <div className="flex items-center space-x-1">
                                                                                                <User className="w-4 h-4" />
                                                                                                <span>{post.author}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-1">
                                                                                                <Calendar className="w-4 h-4" />
                                                                                                <span>{post.published_date ? new Date(post.published_date).toLocaleDateString() : 'N/A'}</span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>

                                                                        <div className="flex items-center justify-between">
                                                                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                                                        <div className="flex items-center space-x-1">
                                                                                                <Clock className="w-3 h-3" />
                                                                                                <span>{post.read_time}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-1">
                                                                                                <Eye className="w-3 h-3" />
                                                                                                <span>{post.views}</span>
                                                                                        </div>
                                                                                </div>
                                                                                <Link href={`/blog/${post.id}`}>
                                                                                        <Button variant="outline" size="sm">
                                                                                                Read More
                                                                                                <ArrowRight className="w-4 h-4 ml-1" />
                                                                                        </Button>
                                                                                </Link>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* Main Content Grid */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {/* Articles List */}
                                                <div className="lg:col-span-2 space-y-8">
                                                        <div className="flex items-center justify-between">
                                                                <h2 className="text-3xl font-display font-bold text-foreground">
                                                                        Latest Articles
                                                                </h2>

                                                                {/* Category Filter */}
                                                                <div className="flex flex-wrap gap-2">
                                                                        {categories.slice(0, 4).map((category: any) => (
                                                                                <Button
                                                                                        key={category}
                                                                                        variant={category === selectedCategory ? "default" : "outline"}
                                                                                        size="sm"
                                                                                        onClick={() => setSelectedCategory(category)}
                                                                                        className={category === selectedCategory ? "hero-gradient" : ""}
                                                                                >
                                                                                        {category}
                                                                                </Button>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                                {filteredPosts.map((post: any) => (
                                                                        <Card key={post.id} className="shadow-card hover-lift overflow-hidden">
                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                                                                        <div className="relative h-48 md:h-auto bg-gradient-to-br from-primary/20 to-accent/20">
                                                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                                                        <BookOpen className="w-12 h-12 text-primary/30" />
                                                                                                </div>
                                                                                                {post.featured && (
                                                                                                        <Badge className="absolute top-2 right-2 bg-gold text-white text-xs">
                                                                                                                Featured
                                                                                                        </Badge>
                                                                                                )}
                                                                                        </div>

                                                                                        <div className="md:col-span-2 p-6">
                                                                                                <div className="flex items-center space-x-2 mb-2">
                                                                                                        <Badge variant="outline" className="text-xs">
                                                                                                                {post.category}
                                                                                                        </Badge>
                                                                                                        <span className="text-xs text-muted-foreground">
                                                                                                                {post.published_date ? new Date(post.published_date).toLocaleDateString() : 'N/A'}
                                                                                                        </span>
                                                                                                </div>

                                                                                                <h3 className="text-lg font-display font-semibold mb-2 line-clamp-2">
                                                                                                        {post.title}
                                                                                                </h3>

                                                                                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                                                                        {post.excerpt}
                                                                                                </p>

                                                                                                <div className="flex items-center justify-between">
                                                                                                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                                                                                <span>{post.author}</span>
                                                                                                                <span>{post.read_time}</span>
                                                                                                                <div className="flex items-center space-x-1">
                                                                                                                        <Eye className="w-3 h-3" />
                                                                                                                        <span>{post.views}</span>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                        <Link href={`/blog/${post.id}`}>
                                                                                                                <Button variant="outline" size="sm">
                                                                                                                        Read More
                                                                                                                </Button>
                                                                                                        </Link>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </Card>
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Sidebar */}
                                                <div className="space-y-8">
                                                        {/* Popular Posts */}
                                                        <Card className="shadow-card">
                                                                <CardHeader>
                                                                        <CardTitle className="flex items-center space-x-2">
                                                                                <TrendingUp className="w-5 h-5 text-primary" />
                                                                                <span>Popular This Month</span>
                                                                        </CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        {recentPosts.slice(0, 4).map((post: any, index: number) => (
                                                                                <div key={post.id} className="flex space-x-3">
                                                                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                                                                {index + 1}
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                                <Link href={`/blog/${post.id}`}>
                                                                                                        <h4 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                                                                                                                {post.title}
                                                                                                        </h4>
                                                                                                </Link>
                                                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                                                        {post.views} views
                                                                                                </p>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </CardContent>
                                                        </Card>

                                                        {/* Categories */}
                                                        <Card className="shadow-card">
                                                                <CardHeader>
                                                                        <CardTitle className="flex items-center space-x-2">
                                                                                <Tag className="w-5 h-5 text-accent" />
                                                                                <span>Categories</span>
                                                                        </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                        <div className="space-y-2">
                                                                                {categories.slice(1).map((category: any) => {
                                                                                        const count = blogPosts.filter((post: any) => post.category === category).length;
                                                                                        return (
                                                                                                <div key={category} className="flex items-center justify-between">
                                                                                                        <span
                                                                                                                className="text-sm hover:text-primary cursor-pointer transition-colors"
                                                                                                                onClick={() => setSelectedCategory(category)}
                                                                                                        >
                                                                                                                {category}
                                                                                                        </span>
                                                                                                        <Badge variant="secondary" className="text-xs">
                                                                                                                {count}
                                                                                                        </Badge>
                                                                                                </div>
                                                                                        );
                                                                                })}
                                                                        </div>
                                                                </CardContent>
                                                        </Card>

                                                        {/* Popular Tags */}
                                                        <Card className="shadow-card">
                                                                <CardHeader>
                                                                        <CardTitle>Popular Tags</CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                        <div className="flex flex-wrap gap-2">
                                                                                {popularTags.map((tag: any) => (
                                                                                        <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary hover:text-white transition-colors">
                                                                                                {tag}
                                                                                        </Badge>
                                                                                ))}
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        );
};

export default Blog;
