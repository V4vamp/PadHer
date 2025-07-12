import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // user, admin, content_manager
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull().default("USD"),
  type: text("type").notNull(), // one-time, recurring
  status: text("status").notNull().default("pending"), // pending, completed, failed
  paystackReference: text("paystack_reference"),
  donorEmail: text("donor_email"),
  donorName: text("donor_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  skills: text("skills").array(),
  availability: text("availability"), // JSON string
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  opportunityId: integer("opportunity_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const volunteerOpportunities = pgTable("volunteer_opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // community-outreach, education, digital-advocacy
  timeCommitment: text("time_commitment"),
  location: text("location"),
  requirements: text("requirements").array(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  imageUrl: text("image_url"),
  readTime: integer("read_time"), // in minutes
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // workshop, outreach, virtual
  date: timestamp("date").notNull(),
  time: text("time"),
  location: text("location"),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id"),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default("registered"), // registered, attended, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const impactStats = pgTable("impact_stats", {
  id: serial("id").primaryKey(),
  girlsHelped: integer("girls_helped").notNull().default(0),
  padsDistributed: integer("pads_distributed").notNull().default(0),
  schoolsReached: integer("schools_reached").notNull().default(0),
  volunteers: integer("volunteers").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertVolunteerSchema = createInsertSchema(volunteers).omit({
  id: true,
  createdAt: true,
});

export const insertVolunteerOpportunitySchema = createInsertSchema(volunteerOpportunities).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({
  id: true,
  createdAt: true,
});

export const insertImpactStatsSchema = createInsertSchema(impactStats).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Volunteer = typeof volunteers.$inferSelect;
export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;
export type VolunteerOpportunity = typeof volunteerOpportunities.$inferSelect;
export type InsertVolunteerOpportunity = z.infer<typeof insertVolunteerOpportunitySchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type ImpactStats = typeof impactStats.$inferSelect;
export type InsertImpactStats = z.infer<typeof insertImpactStatsSchema>;
