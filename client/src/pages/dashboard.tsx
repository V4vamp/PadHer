import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, Heart, Calendar, FileText, Settings, Plus, 
  TrendingUp, DollarSign, BookOpen, UserCheck
} from "lucide-react";
import type { 
  Donation, Volunteer, Event, BlogPost, ImpactStats,
  InsertEvent, InsertBlogPost, InsertImpactStats
} from "@shared/schema";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["workshop", "outreach", "virtual"]),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  maxAttendees: z.number().min(1, "Max attendees must be at least 1"),
});

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  imageUrl: z.string().url().optional(),
  readTime: z.number().min(1, "Read time must be at least 1 minute"),
  isPublished: z.boolean().default(false),
});

const statsFormSchema = z.object({
  girlsHelped: z.number().min(0),
  padsDistributed: z.number().min(0),
  schoolsReached: z.number().min(0),
  volunteers: z.number().min(0),
});

type EventFormData = z.infer<typeof eventFormSchema>;
type BlogFormData = z.infer<typeof blogFormSchema>;
type StatsFormData = z.infer<typeof statsFormSchema>;

export default function Dashboard() {
  const { toast } = useToast();
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);

  // Queries
  const { data: donations } = useQuery<Donation[]>({
    queryKey: ["/api/donations"],
  });

  const { data: volunteers } = useQuery<Volunteer[]>({
    queryKey: ["/api/volunteers"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const { data: impactStats } = useQuery<ImpactStats>({
    queryKey: ["/api/impact-stats"],
  });

  // Forms
  const eventForm = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "workshop",
      date: "",
      time: "",
      location: "",
      maxAttendees: 50,
    },
  });

  const blogForm = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      author: "",
      imageUrl: "",
      readTime: 5,
      isPublished: false,
    },
  });

  const statsForm = useForm<StatsFormData>({
    resolver: zodResolver(statsFormSchema),
    defaultValues: {
      girlsHelped: impactStats?.girlsHelped || 0,
      padsDistributed: impactStats?.padsDistributed || 0,
      schoolsReached: impactStats?.schoolsReached || 0,
      volunteers: impactStats?.volunteers || 0,
    },
  });

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const eventData: InsertEvent = {
        ...data,
        date: new Date(data.date),
        currentAttendees: 0,
        isActive: true,
      };
      const response = await apiRequest("POST", "/api/events", eventData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Event created successfully!" });
      setEventDialogOpen(false);
      eventForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: () => {
      toast({ title: "Failed to create event", variant: "destructive" });
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const response = await apiRequest("POST", "/api/blog-posts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Blog post created successfully!" });
      setBlogDialogOpen(false);
      blogForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
    },
    onError: () => {
      toast({ title: "Failed to create blog post", variant: "destructive" });
    },
  });

  const updateStatsMutation = useMutation({
    mutationFn: async (data: StatsFormData) => {
      const response = await apiRequest("PATCH", "/api/impact-stats", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Impact stats updated successfully!" });
      setStatsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/impact-stats"] });
    },
    onError: () => {
      toast({ title: "Failed to update stats", variant: "destructive" });
    },
  });

  const approveVolunteerMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/volunteers/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Volunteer status updated!" });
      queryClient.invalidateQueries({ queryKey: ["/api/volunteers"] });
    },
    onError: () => {
      toast({ title: "Failed to update volunteer status", variant: "destructive" });
    },
  });

  // Stats calculations
  const totalDonations = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
  const pendingVolunteers = volunteers?.filter(v => v.status === "pending").length || 0;
  const upcomingEvents = events?.filter(e => new Date(e.date) > new Date()).length || 0;
  const publishedPosts = blogPosts?.filter(p => p.isPublished).length || 0;

  return (
    <div className="w-full pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-dark">Admin Dashboard</h1>
          <p className="text-text-light">Manage your organization's activities and track impact</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light">Total Donations</p>
                  <p className="text-2xl font-bold text-text-dark">
                    ${(totalDonations / 100).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary-pink" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light">Pending Volunteers</p>
                  <p className="text-2xl font-bold text-text-dark">{pendingVolunteers}</p>
                </div>
                <Users className="h-8 w-8 text-secondary-purple" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light">Upcoming Events</p>
                  <p className="text-2xl font-bold text-text-dark">{upcomingEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary-pink" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light">Published Posts</p>
                  <p className="text-2xl font-bold text-text-dark">{publishedPosts}</p>
                </div>
                <BookOpen className="h-8 w-8 text-secondary-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="volunteers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Volunteers Tab */}
          <TabsContent value="volunteers">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {volunteers?.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell>
                          {volunteer.firstName} {volunteer.lastName}
                        </TableCell>
                        <TableCell>{volunteer.email}</TableCell>
                        <TableCell>{volunteer.phone || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              volunteer.status === "approved"
                                ? "default"
                                : volunteer.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {volunteer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {volunteer.status === "pending" && (
                            <div className="space-x-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  approveVolunteerMutation.mutate({
                                    id: volunteer.id,
                                    status: "approved",
                                  })
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  approveVolunteerMutation.mutate({
                                    id: volunteer.id,
                                    status: "rejected",
                                  })
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations?.slice(0, 10).map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          {donation.donorName || donation.donorEmail || "Anonymous"}
                        </TableCell>
                        <TableCell>${(donation.amount / 100).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{donation.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              donation.status === "completed"
                                ? "default"
                                : donation.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {donation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Events Management</CardTitle>
                <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Event</DialogTitle>
                    </DialogHeader>
                    <Form {...eventForm}>
                      <form
                        onSubmit={eventForm.handleSubmit((data) =>
                          createEventMutation.mutate(data)
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={eventForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={eventForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={eventForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="workshop">Workshop</SelectItem>
                                  <SelectItem value="outreach">Outreach</SelectItem>
                                  <SelectItem value="virtual">Virtual</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={eventForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={eventForm.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                  <Input placeholder="2:00 PM - 4:00 PM" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={eventForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={eventForm.control}
                          name="maxAttendees"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Attendees</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full btn-primary"
                          disabled={createEventMutation.isPending}
                        >
                          {createEventMutation.isPending
                            ? "Creating..."
                            : "Create Event"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events?.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {event.currentAttendees}/{event.maxAttendees}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={event.isActive ? "default" : "secondary"}
                          >
                            {event.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blog Management</CardTitle>
                <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Blog Post</DialogTitle>
                    </DialogHeader>
                    <Form {...blogForm}>
                      <form
                        onSubmit={blogForm.handleSubmit((data) =>
                          createBlogMutation.mutate(data)
                        )}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={blogForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={blogForm.control}
                            name="slug"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={blogForm.control}
                          name="excerpt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Excerpt</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={blogForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="min-h-[200px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={blogForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={blogForm.control}
                            name="author"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={blogForm.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={blogForm.control}
                            name="readTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Read Time (minutes)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full btn-primary"
                          disabled={createBlogMutation.isPending}
                        >
                          {createBlogMutation.isPending
                            ? "Creating..."
                            : "Create Post"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts?.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.category}</Badge>
                        </TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>
                          <Badge
                            variant={post.isPublished ? "default" : "secondary"}
                          >
                            {post.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Impact Statistics</CardTitle>
                <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-primary">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Stats
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Update Impact Statistics</DialogTitle>
                    </DialogHeader>
                    <Form {...statsForm}>
                      <form
                        onSubmit={statsForm.handleSubmit((data) =>
                          updateStatsMutation.mutate(data)
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={statsForm.control}
                          name="girlsHelped"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Girls Helped</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statsForm.control}
                          name="padsDistributed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pads Distributed</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statsForm.control}
                          name="schoolsReached"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Schools Reached</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statsForm.control}
                          name="volunteers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Active Volunteers</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full btn-primary"
                          disabled={updateStatsMutation.isPending}
                        >
                          {updateStatsMutation.isPending
                            ? "Updating..."
                            : "Update Statistics"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {impactStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-pink mb-2">
                        {impactStats.girlsHelped.toLocaleString()}
                      </div>
                      <div className="text-text-light">Girls Helped</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary-purple mb-2">
                        {impactStats.padsDistributed.toLocaleString()}
                      </div>
                      <div className="text-text-light">Pads Distributed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-pink mb-2">
                        {impactStats.schoolsReached.toLocaleString()}
                      </div>
                      <div className="text-text-light">Schools Reached</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary-purple mb-2">
                        {impactStats.volunteers.toLocaleString()}
                      </div>
                      <div className="text-text-light">Active Volunteers</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
