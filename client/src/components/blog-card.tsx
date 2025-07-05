import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
  onReadMore?: () => void;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "menstrual health":
      return "bg-primary-pink text-white";
    case "impact stories":
      return "bg-secondary-purple text-white";
    case "hygiene tips":
      return "bg-primary-pink text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function BlogCard({ post, onReadMore }: BlogCardProps) {
  return (
    <Card className="bg-white rounded-2xl card-shadow overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={post.imageUrl || "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
          <Badge className={`absolute top-4 left-4 ${getCategoryColor(post.category)}`}>
            {post.category}
          </Badge>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-text-dark mb-3 line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-text-light mb-4 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-text-light">
              <span className="font-medium">{post.author}</span>
              {post.readTime && (
                <>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime} min read</span>
                </>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-pink hover:text-secondary-purple transition-colors p-0"
              onClick={onReadMore}
            >
              Read More
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
