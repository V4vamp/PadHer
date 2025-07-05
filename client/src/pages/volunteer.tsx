import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import VolunteerCard from "@/components/volunteer-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Heart, Clock, MapPin } from "lucide-react";
import type { VolunteerOpportunity } from "@shared/schema";

const volunteerFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability: z.string().optional(),
  opportunityId: z.number().optional(),
});

type VolunteerFormData = z.infer<typeof volunteerFormSchema>;

export default function Volunteer() {
  const { toast } = useToast();

  const { data: opportunities, isLoading } = useQuery<VolunteerOpportunity[]>({
    queryKey: ["/api/volunteer-opportunities"],
  });

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      skills: [],
      availability: "",
    },
  });

  const volunteerMutation = useMutation({
    mutationFn: async (data: VolunteerFormData) => {
      const response = await apiRequest("POST", "/api/volunteers", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in volunteering. We'll be in touch soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VolunteerFormData) => {
    volunteerMutation.mutate(data);
  };

  const skillOptions = [
    "Teaching/Education",
    "Healthcare",
    "Social Media/Marketing",
    "Event Planning",
    "Translation",
    "Photography",
    "Fundraising",
    "Community Outreach",
  ];

  if (isLoading) {
    return <div className="min-h-screen pt-16 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-pink to-secondary-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Join Our <span className="text-accent-pink">Volunteer Community</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Be part of the change. Help us empower young girls and break the cycle of period poverty through community action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center text-lg">
              <Users className="mr-2 h-6 w-6" />
              <span>1,200+ Active Volunteers</span>
            </div>
            <div className="flex items-center text-lg">
              <Heart className="mr-2 h-6 w-6" />
              <span>15,420 Girls Helped</span>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">Volunteer Opportunities</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              Choose from various volunteer roles that match your skills, interests, and availability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities?.map((opportunity) => (
              <VolunteerCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-dark mb-6">Apply to Volunteer</h2>
            <p className="text-xl text-text-light">
              Fill out the form below to join our volunteer community. We'll match you with opportunities that fit your skills and availability.
            </p>
          </div>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-text-dark">Volunteer Application</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
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
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
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
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="opportunityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Opportunity</FormLabel>
                        <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a volunteer opportunity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Any opportunity</SelectItem>
                            {opportunities?.map((opportunity) => (
                              <SelectItem key={opportunity.id} value={opportunity.id.toString()}>
                                {opportunity.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={() => (
                      <FormItem>
                        <FormLabel>Skills & Interests</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {skillOptions.map((skill) => (
                            <FormField
                              key={skill}
                              control={form.control}
                              name="skills"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(skill)}
                                      onCheckedChange={(checked) => {
                                        const updatedSkills = checked
                                          ? [...(field.value || []), skill]
                                          : field.value?.filter((value) => value !== skill) || [];
                                        field.onChange(updatedSkills);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {skill}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability & Additional Information</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your availability, experience, and why you want to volunteer with us..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full btn-primary" 
                    disabled={volunteerMutation.isPending}
                  >
                    {volunteerMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-20 bg-accent-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-dark mb-6">Why Volunteer with Us?</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              Join a community of passionate individuals making a real difference in girls' lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-shadow text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mb-2">Make Impact</h3>
                <p className="text-text-light text-sm">
                  Directly impact young girls' lives and help break the cycle of period poverty.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mb-2">Build Community</h3>
                <p className="text-text-light text-sm">
                  Connect with like-minded individuals passionate about social change.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mb-2">Flexible Schedule</h3>
                <p className="text-text-light text-sm">
                  Choose volunteer opportunities that fit your schedule and availability.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mb-2">Local & Remote</h3>
                <p className="text-text-light text-sm">
                  Volunteer both in-person and remotely, depending on your preference.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
