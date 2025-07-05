import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Heart } from "lucide-react";
import type { VolunteerOpportunity } from "@shared/schema";

interface VolunteerCardProps {
  opportunity: VolunteerOpportunity;
  onApply?: () => void;
}

const getOpportunityImage = (type: string) => {
  switch (type) {
    case "community-outreach":
      return "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";
    case "education":
      return "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";
    case "digital-advocacy":
      return "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";
    default:
      return "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "community-outreach":
      return "bg-primary-pink text-white";
    case "education":
      return "bg-secondary-purple text-white";
    case "digital-advocacy":
      return "bg-primary-pink text-white";
    default:
      return "bg-primary-pink text-white";
  }
};

export default function VolunteerCard({ opportunity, onApply }: VolunteerCardProps) {
  return (
    <Card className="bg-white rounded-2xl card-shadow hover:transform hover:scale-105 transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={getOpportunityImage(opportunity.type)}
            alt={opportunity.title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <Badge className={`absolute top-4 left-4 ${getTypeColor(opportunity.type)}`}>
            {opportunity.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-text-dark mb-4">
            {opportunity.title}
          </h3>
          
          <p className="text-text-light mb-6 leading-relaxed">
            {opportunity.description}
          </p>
          
          <div className="space-y-3 mb-6">
            {opportunity.timeCommitment && (
              <div className="flex items-center text-sm text-text-light">
                <Clock className="h-4 w-4 text-primary-pink mr-2 flex-shrink-0" />
                <span>{opportunity.timeCommitment}</span>
              </div>
            )}
            
            {opportunity.location && (
              <div className="flex items-center text-sm text-text-light">
                <MapPin className="h-4 w-4 text-primary-pink mr-2 flex-shrink-0" />
                <span>{opportunity.location}</span>
              </div>
            )}
            
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <div className="flex items-start text-sm text-text-light">
                <Users className="h-4 w-4 text-primary-pink mr-2 flex-shrink-0 mt-0.5" />
                <span>{opportunity.requirements.join(", ")}</span>
              </div>
            )}
          </div>
          
          <Button 
            className="w-full btn-primary"
            onClick={onApply}
          >
            <Heart className="mr-2 h-4 w-4" />
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
