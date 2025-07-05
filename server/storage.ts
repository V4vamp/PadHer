import { 
  users, volunteers, volunteerOpportunities, blogPosts, events, 
  eventRegistrations, donations, impactStats,
  type User, type InsertUser, type Volunteer, type InsertVolunteer,
  type VolunteerOpportunity, type InsertVolunteerOpportunity,
  type BlogPost, type InsertBlogPost, type Event, type InsertEvent,
  type EventRegistration, type InsertEventRegistration,
  type Donation, type InsertDonation, type ImpactStats, type InsertImpactStats
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Donations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  getDonationsByUser(userId: number): Promise<Donation[]>;
  updateDonation(id: number, donation: Partial<InsertDonation>): Promise<Donation | undefined>;

  // Volunteers
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;
  getVolunteers(): Promise<Volunteer[]>;
  updateVolunteerStatus(id: number, status: string): Promise<Volunteer | undefined>;

  // Volunteer Opportunities
  getVolunteerOpportunities(): Promise<VolunteerOpportunity[]>;
  createVolunteerOpportunity(opportunity: InsertVolunteerOpportunity): Promise<VolunteerOpportunity>;
  updateVolunteerOpportunity(id: number, opportunity: Partial<InsertVolunteerOpportunity>): Promise<VolunteerOpportunity | undefined>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;

  // Events
  getEvents(): Promise<Event[]>;
  getActiveEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;

  // Event Registrations
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  getEventRegistrations(eventId: number): Promise<EventRegistration[]>;
  getUserEventRegistrations(userId: number): Promise<EventRegistration[]>;

  // Impact Stats
  getImpactStats(): Promise<ImpactStats | undefined>;
  updateImpactStats(stats: Partial<InsertImpactStats>): Promise<ImpactStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private donations: Map<number, Donation> = new Map();
  private volunteers: Map<number, Volunteer> = new Map();
  private volunteerOpportunities: Map<number, VolunteerOpportunity> = new Map();
  private blogPosts: Map<number, BlogPost> = new Map();
  private events: Map<number, Event> = new Map();
  private eventRegistrations: Map<number, EventRegistration> = new Map();
  private impactStatsData: ImpactStats | undefined;
  
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed initial impact stats
    this.impactStatsData = {
      id: 1,
      girlsHelped: 15420,
      padsDistributed: 89350,
      schoolsReached: 234,
      volunteers: 1200,
      updatedAt: new Date(),
    };

    // Seed volunteer opportunities
    const opportunities = [
      {
        id: 1,
        title: "Community Outreach",
        description: "Join our field teams to distribute pads and conduct educational workshops in underserved communities.",
        type: "community-outreach",
        timeCommitment: "5-10 hours/week",
        location: "Field work required",
        requirements: ["Passion for helping others", "Good communication skills"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Education & Training",
        description: "Lead workshops on menstrual hygiene and reproductive health in schools and community centers.",
        type: "education",
        timeCommitment: "3-5 hours/week",
        location: "Schools and community centers",
        requirements: ["Teaching experience preferred", "Training provided"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 3,
        title: "Digital Advocacy",
        description: "Help us spread awareness through social media, content creation, and digital campaigns.",
        type: "digital-advocacy",
        timeCommitment: "2-4 hours/week",
        location: "Remote work",
        requirements: ["Social media experience", "Content creation skills"],
        isActive: true,
        createdAt: new Date(),
      },
    ];

    opportunities.forEach(opp => this.volunteerOpportunities.set(opp.id, opp));

    // Seed blog posts
    const posts = [
      {
        id: 1,
        title: "Understanding Your Menstrual Cycle: A Complete Guide",
        slug: "understanding-menstrual-cycle-guide",
        excerpt: "Learn about the menstrual cycle, what's normal, and how to maintain good hygiene practices during your period.",
        content: "Comprehensive guide content here...",
        category: "Menstrual Health",
        author: "Dr. Sarah Johnson",
        imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
        readTime: 5,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "Breaking the Silence: Maria's Story",
        slug: "breaking-silence-maria-story",
        excerpt: "Discover how access to menstrual products changed Maria's life and kept her in school to pursue her dreams.",
        content: "Maria's inspiring story content here...",
        category: "Impact Stories",
        author: "PadHer Team",
        imageUrl: "https://pixabay.com/get/g938fec19899ffe58dc104cf116231fe6149786d120a3302e1865af7c9e38f3cf5f65f464d15a8462e1ddb6f8fbd860d091e5db2ea8f1323be26e9f955d0b7d81_1280.jpg",
        readTime: 3,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        title: "Safe Practices: Choosing the Right Products",
        slug: "safe-practices-choosing-products",
        excerpt: "Learn about different menstrual products, their benefits, and how to use them safely and effectively.",
        content: "Product safety guide content here...",
        category: "Hygiene Tips",
        author: "Dr. Emily Carter",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        readTime: 4,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    posts.forEach(post => this.blogPosts.set(post.id, post));

    // Seed events
    const eventList = [
      {
        id: 1,
        title: "Menstrual Health Workshop for Teens",
        description: "Educational workshop covering menstrual health basics, hygiene practices, and product usage.",
        type: "workshop",
        date: new Date(2024, 11, 15, 14, 0), // Dec 15, 2024 2:00 PM
        time: "2:00 PM - 4:00 PM",
        location: "Community Center, Lagos",
        maxAttendees: 50,
        currentAttendees: 25,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "School Distribution Drive",
        description: "Distribute sanitary pads and educational materials to students at local schools.",
        type: "outreach",
        date: new Date(2024, 11, 22, 9, 0), // Dec 22, 2024 9:00 AM
        time: "9:00 AM - 12:00 PM",
        location: "St. Mary's Secondary School",
        maxAttendees: 20,
        currentAttendees: 12,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 3,
        title: "Online Q&A: Myths & Facts",
        description: "Virtual session addressing common myths and providing factual information about menstruation.",
        type: "virtual",
        date: new Date(2024, 11, 28, 19, 0), // Dec 28, 2024 7:00 PM
        time: "7:00 PM - 8:30 PM",
        location: "Online Event",
        maxAttendees: 100,
        currentAttendees: 45,
        isActive: true,
        createdAt: new Date(),
      },
    ];

    eventList.forEach(event => this.events.set(event.id, event));
    this.currentId = 4;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "user",
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Donations
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.currentId++;
    const donation: Donation = {
      ...insertDonation,
      id,
      status: insertDonation.status || "pending",
      currency: insertDonation.currency || "USD",
      userId: insertDonation.userId || null,
      paystackReference: insertDonation.paystackReference || null,
      donorEmail: insertDonation.donorEmail || null,
      donorName: insertDonation.donorName || null,
      createdAt: new Date(),
    };
    this.donations.set(id, donation);
    return donation;
  }

  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }

  async getDonationsByUser(userId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(d => d.userId === userId);
  }

  async updateDonation(id: number, updateData: Partial<InsertDonation>): Promise<Donation | undefined> {
    const donation = this.donations.get(id);
    if (!donation) return undefined;
    
    const updatedDonation = { ...donation, ...updateData };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  // Volunteers
  async createVolunteer(insertVolunteer: InsertVolunteer): Promise<Volunteer> {
    const id = this.currentId++;
    const volunteer: Volunteer = {
      ...insertVolunteer,
      id,
      status: insertVolunteer.status || "pending",
      userId: insertVolunteer.userId || null,
      phone: insertVolunteer.phone || null,
      skills: insertVolunteer.skills || null,
      availability: insertVolunteer.availability || null,
      opportunityId: insertVolunteer.opportunityId || null,
      createdAt: new Date(),
    };
    this.volunteers.set(id, volunteer);
    return volunteer;
  }

  async getVolunteers(): Promise<Volunteer[]> {
    return Array.from(this.volunteers.values());
  }

  async updateVolunteerStatus(id: number, status: string): Promise<Volunteer | undefined> {
    const volunteer = this.volunteers.get(id);
    if (!volunteer) return undefined;
    
    const updatedVolunteer = { ...volunteer, status };
    this.volunteers.set(id, updatedVolunteer);
    return updatedVolunteer;
  }

  // Volunteer Opportunities
  async getVolunteerOpportunities(): Promise<VolunteerOpportunity[]> {
    return Array.from(this.volunteerOpportunities.values()).filter(opp => opp.isActive);
  }

  async createVolunteerOpportunity(insertOpportunity: InsertVolunteerOpportunity): Promise<VolunteerOpportunity> {
    const id = this.currentId++;
    const opportunity: VolunteerOpportunity = {
      ...insertOpportunity,
      id,
      location: insertOpportunity.location || null,
      timeCommitment: insertOpportunity.timeCommitment || null,
      requirements: insertOpportunity.requirements || null,
      isActive: insertOpportunity.isActive !== undefined ? insertOpportunity.isActive : true,
      createdAt: new Date(),
    };
    this.volunteerOpportunities.set(id, opportunity);
    return opportunity;
  }

  async updateVolunteerOpportunity(id: number, updateData: Partial<InsertVolunteerOpportunity>): Promise<VolunteerOpportunity | undefined> {
    const opportunity = this.volunteerOpportunities.get(id);
    if (!opportunity) return undefined;
    
    const updatedOpportunity = { ...opportunity, ...updateData };
    this.volunteerOpportunities.set(id, updatedOpportunity);
    return updatedOpportunity;
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(post => post.isPublished);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentId++;
    const post: BlogPost = {
      ...insertPost,
      id,
      excerpt: insertPost.excerpt || null,
      imageUrl: insertPost.imageUrl || null,
      readTime: insertPost.readTime || null,
      isPublished: insertPost.isPublished !== undefined ? insertPost.isPublished : false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updateData, updatedAt: new Date() };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getActiveEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.isActive);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentId++;
    const event: Event = {
      ...insertEvent,
      id,
      time: insertEvent.time || null,
      location: insertEvent.location || null,
      isActive: insertEvent.isActive !== undefined ? insertEvent.isActive : true,
      maxAttendees: insertEvent.maxAttendees || null,
      currentAttendees: insertEvent.currentAttendees || 0,
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, updateData: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updateData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  // Event Registrations
  async createEventRegistration(insertRegistration: InsertEventRegistration): Promise<EventRegistration> {
    const id = this.currentId++;
    const registration: EventRegistration = {
      ...insertRegistration,
      id,
      status: insertRegistration.status || "confirmed",
      userId: insertRegistration.userId || null,
      phone: insertRegistration.phone || null,
      createdAt: new Date(),
    };
    this.eventRegistrations.set(id, registration);
    
    // Update event attendee count
    const event = this.events.get(insertRegistration.eventId);
    if (event) {
      event.currentAttendees++;
      this.events.set(event.id, event);
    }
    
    return registration;
  }

  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    return Array.from(this.eventRegistrations.values()).filter(reg => reg.eventId === eventId);
  }

  async getUserEventRegistrations(userId: number): Promise<EventRegistration[]> {
    return Array.from(this.eventRegistrations.values()).filter(reg => reg.userId === userId);
  }

  // Impact Stats
  async getImpactStats(): Promise<ImpactStats | undefined> {
    return this.impactStatsData;
  }

  async updateImpactStats(updateData: Partial<InsertImpactStats>): Promise<ImpactStats> {
    if (!this.impactStatsData) {
      this.impactStatsData = {
        id: 1,
        girlsHelped: 0,
        padsDistributed: 0,
        schoolsReached: 0,
        volunteers: 0,
        updatedAt: new Date(),
      };
    }
    
    this.impactStatsData = {
      ...this.impactStatsData,
      ...updateData,
      updatedAt: new Date(),
    };
    
    return this.impactStatsData;
  }
}

export const storage = new MemStorage();
