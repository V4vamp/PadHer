import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
  onVolunteer?: () => void;
}

const getEventTypeConfig = (type: string) => {
  switch (type) {
    case "workshop":
      return {
        color: "bg-primary-pink text-white",
        icon: Users,
        action: "Register Now",
      };
    case "outreach":
      return {
        color: "bg-secondary-purple text-white",
        icon: Users,
        action: "Volunteer",
      };
    case "virtual":
      return {
        color: "bg-primary-pink text-white",
        icon: Video,
        action: "Join Online",
      };
    default:
      return {
        color: "bg-gray-500 text-white",
        icon: Users,
        action: "Register",
      };
  }
};

export default function EventCard({ event, onRegister, onVolunteer }: EventCardProps) {
  const typeConfig = getEventTypeConfig(event.type);
  const eventDate = new Date(event.date);
  const isOutreach = event.type === "outreach";
  
  const handleAction = () => {
    if (isOutreach && onVolunteer) {
      onVolunteer();
    } else if (onRegister) {
      onRegister();
    }
  };

  return (
    <Card className="bg-white rounded-2xl card-shadow hover:transform hover:scale-105 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge className={typeConfig.color}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold text-text-dark">
              {eventDate.getDate()}
            </div>
            <div className="text-sm text-text-light">
              {eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-text-dark mb-3">
          {event.title}
        </h3>
        
        <p className="text-text-light mb-4 text-sm leading-relaxed">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-6">
          {event.time && (
            <div className="flex items-center text-sm text-text-light">
              <Clock className="h-4 w-4 text-primary-pink mr-2 flex-shrink-0" />
              <span>{event.time}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-text-light">
            <MapPin className="h-4 w-4 text-primary-pink mr-2 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-text-light">
            {event.type === "outreach" ? (
              <>
                <Users className="h-4 w-4 text-primary-pink mr-2 flex-shrink-0" />
                <span>Volunteers needed</span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4 text-primary-pink mr-2 flex-shrink-0" />
                <span>
                  {event.maxAttendees 
                    ? `${event.maxAttendees - event.currentAttendees} spots available`
                    : "Open to all"
                  }
                </span>
              </>
            )}
          </div>
        </div>
        
        <Button 
          className="w-full btn-primary"
          onClick={handleAction}
          disabled={event.maxAttendees !== null && event.currentAttendees >= event.maxAttendees && !isOutreach}
        >
          <typeConfig.icon className="mr-2 h-4 w-4" />
          {event.maxAttendees !== null && event.currentAttendees >= event.maxAttendees && !isOutreach
            ? "Event Full"
            : typeConfig.action
          }
        </Button>
      </CardContent>
    </Card>
  );
}
