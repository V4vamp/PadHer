import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BlogCard from "@/components/blog-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  // Filter posts based on search and category
  const filteredPosts = blogPosts?.filter((post) => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = blogPosts ? [...new Set(blogPosts.map(post => post.category))] : [];

  if (isLoading) {
    return <div className="min-h-screen pt-16 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-pink to-secondary-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Education & <span className="text-accent-pink">Awareness</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Comprehensive resources on menstrual health, hygiene practices, and reproductive wellness to empower girls and break stigmas.
          </p>
          <div className="flex items-center justify-center text-lg">
            <BookOpen className="mr-2 h-6 w-6" />
            <span>{blogPosts?.length || 0} Educational Articles</span>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-primary-pink" : ""}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary-pink" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {filteredPosts && filteredPosts.length > 0 && (
        <section className="py-16 bg-accent-pink">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Badge className="bg-primary-pink text-white mb-4">Featured Article</Badge>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl card-shadow overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={filteredPosts[0].imageUrl || "https://images.unsplash.com/photo-1559757175-0eb30cd8c063"}
                      alt={filteredPosts[0].title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <Badge className="bg-secondary-purple text-white mb-4">
                      {filteredPosts[0].category}
                    </Badge>
                    <h2 className="text-3xl font-bold text-text-dark mb-4">
                      {filteredPosts[0].title}
                    </h2>
                    <p className="text-text-light mb-6 leading-relaxed">
                      {filteredPosts[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-text-light">
                        <span className="font-medium">{filteredPosts[0].author}</span>
                        <span className="mx-2">•</span>
                        <span>{filteredPosts[0].readTime} min read</span>
                      </div>
                      <Button className="btn-primary">Read More</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts && filteredPosts.length > 1 ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-text-dark mb-4">All Articles</h2>
                <p className="text-xl text-text-light">
                  {filteredPosts.length - 1} more article{filteredPosts.length - 1 !== 1 ? 's' : ''} to explore
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(1).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : filteredPosts?.length === 1 ? (
            <div className="text-center py-12">
              <p className="text-xl text-text-light">
                Check out our featured article above!
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-text-dark mb-2">No articles found</h3>
              <p className="text-text-light">
                {searchTerm || selectedCategory 
                  ? "Try adjusting your search or filter criteria." 
                  : "Articles will appear here once published."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-secondary-purple">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Informed</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for the latest articles on menstrual health and updates from our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white text-text-dark border-0"
            />
            <Button className="bg-white text-primary-pink hover:bg-accent-pink whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
