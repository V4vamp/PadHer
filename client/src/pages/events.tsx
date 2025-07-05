import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import type { Event } from "@shared/schema";

const registrationFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationFormSchema>;

export default function Events() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData & { eventId: number }) => {
      const response = await apiRequest("POST", "/api/event-registrations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "You've been registered for the event. We'll send you a confirmation email.",
      });
      setRegistrationOpen(false);
      setSelectedEvent(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    if (selectedEvent) {
      registerMutation.mutate({ ...data, eventId: selectedEvent.id });
    }
  };

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setRegistrationOpen(true);
  };

  // Group events by type
  const groupedEvents = events?.reduce((acc, event) => {
    if (!acc[event.type]) {
      acc[event.type] = [];
    }
    acc[event.type].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  if (isLoading) {
    return <div className="min-h-screen pt-16 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-pink to-secondary-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Upcoming <span className="text-accent-pink">Events</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Join us at our workshops, community outreach programs, and educational events to make a difference in girls' lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center text-lg">
              <Calendar className="mr-2 h-6 w-6" />
              <span>{events?.length || 0} Upcoming Events</span>
            </div>
            <div className="flex items-center text-lg">
              <Users className="mr-2 h-6 w-6" />
              <span>Open to All</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Navigation */}
      {groupedEvents && Object.keys(groupedEvents).length > 0 && (
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.entries(groupedEvents).map(([type, events]) => (
                <Badge
                  key={type}
                  variant="outline"
                  className="text-primary-pink border-primary-pink hover:bg-primary-pink hover:text-white cursor-pointer transition-colors px-4 py-2"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({events.length})
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events by Category */}
      {groupedEvents && Object.keys(groupedEvents).length > 0 ? (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {Object.entries(groupedEvents).map(([type, typeEvents]) => (
              <div key={type}>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-text-dark mb-4 capitalize">
                    {type === "workshop" && "Workshops & Training"}
                    {type === "outreach" && "Community Outreach"}
                    {type === "virtual" && "Virtual Events"}
                    {!["workshop", "outreach", "virtual"].includes(type) && type}
                  </h2>
                  <p className="text-xl text-text-light max-w-2xl mx-auto">
                    {type === "workshop" && "Educational sessions focused on menstrual health and hygiene practices."}
                    {type === "outreach" && "Direct community engagement and product distribution programs."}
                    {type === "virtual" && "Online events accessible from anywhere with internet connection."}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {typeEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRegister={() => handleRegister(event)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-text-dark mb-4">No Events Scheduled</h2>
            <p className="text-xl text-text-light mb-8">
              We're currently planning our next events. Check back soon or subscribe to our newsletter to stay updated.
            </p>
            <Button className="btn-primary">Subscribe to Updates</Button>
          </div>
        </section>
      )}

      {/* Why Attend */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-dark mb-6">Why Attend Our Events?</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              Our events are designed to educate, empower, and create lasting change in communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-shadow text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mb-2">Expert-Led Sessions</h3>
                <p className="text-text-light text-sm">
                  Learn from healthcare professionals and experienced educators in the field.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mb-2">Interactive Learning</h3>
                <p className="text-text-light text-sm">
                  Participate in hands-on activities and Q&A sessions for deeper understanding.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mb-2">Community Building</h3>
                <p className="text-text-light text-sm">
                  Connect with like-minded individuals passionate about menstrual health advocacy.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mb-2">Free Resources</h3>
                <p className="text-text-light text-sm">
                  Take home educational materials and resources to share with your community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="bg-accent-pink p-4 rounded-lg">
                <h3 className="font-bold text-text-dark">{selectedEvent.title}</h3>
                <div className="flex items-center text-sm text-text-light mt-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center text-sm text-text-light mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full btn-primary" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Registering..." : "Register Now"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
