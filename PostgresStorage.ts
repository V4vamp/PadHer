import { db } from "./db";
import {
  users,
  donations,
  volunteers,
  volunteerOpportunities,
  blogPosts,
  events,
  eventRegistrations,
  impactStats,
} from "./shared/schema";
import {
  type InsertUser,
  type InsertDonation,
  type InsertVolunteer,
  type InsertVolunteerOpportunity,
  type InsertBlogPost,
  type InsertEvent,
  type InsertEventRegistration,
  type InsertImpactStats, IStorage
} from "./shared/schema";
import { eq } from "drizzle-orm";

export class PostgresStorage implements IStorage {
  async getUser(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(data: InsertUser) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  }

  async updateUser(id: number, data: Partial<InsertUser>) {
    const result = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async createDonation(data: InsertDonation) {
    const result = await db.insert(donations).values(data).returning();
    return result[0];
  }

  async getDonations() {
    return db.select().from(donations);
  }

  async getDonationsByUser(userId: number) {
    return db.select().from(donations).where(eq(donations.userId, userId));
  }

  async updateDonation(id: number, data: Partial<InsertDonation>) {
    const result = await db
      .update(donations)
      .set(data)
      .where(eq(donations.id, id))
      .returning();
    return result[0];
  }

  async createVolunteer(data: InsertVolunteer) {
    const result = await db.insert(volunteers).values(data).returning();
    return result[0];
  }

  async getVolunteers() {
    return db.select().from(volunteers);
  }

  async updateVolunteerStatus(id: number, status: string) {
    const result = await db
      .update(volunteers)
      .set({ status })
      .where(eq(volunteers.id, id))
      .returning();
    return result[0];
  }

  async getVolunteerOpportunities() {
    return db
      .select()
      .from(volunteerOpportunities)
      .where(eq(volunteerOpportunities.isActive, true));
  }

  async createVolunteerOpportunity(data: InsertVolunteerOpportunity) {
    const result = await db
      .insert(volunteerOpportunities)
      .values(data)
      .returning();
    return result[0];
  }

  async updateVolunteerOpportunity(
    id: number,
    data: Partial<InsertVolunteerOpportunity>
  ) {
    const result = await db
      .update(volunteerOpportunities)
      .set(data)
      .where(eq(volunteerOpportunities.id, id))
      .returning();
    return result[0];
  }

  async getBlogPosts() {
    return db.select().from(blogPosts);
  }

  async getPublishedBlogPosts() {
    return db.select().from(blogPosts).where(eq(blogPosts.isPublished, true));
  }

  async getBlogPost(id: number) {
    const result = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return result[0];
  }

  async getBlogPostBySlug(slug: string) {
    const result = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return result[0];
  }

  async createBlogPost(data: InsertBlogPost) {
    const result = await db.insert(blogPosts).values(data).returning();
    return result[0];
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
    const result = await db
      .update(blogPosts)
      .set(data)
      .where(eq(blogPosts.id, id))
      .returning();
    return result[0];
  }

  async getEvents() {
    return db.select().from(events);
  }

  async getActiveEvents() {
    return db.select().from(events).where(eq(events.isActive, true));
  }

  async getEvent(id: number) {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async createEvent(data: InsertEvent) {
    const result = await db.insert(events).values(data).returning();
    return result[0];
  }

  async updateEvent(id: number, data: Partial<InsertEvent>) {
    const result = await db
      .update(events)
      .set(data)
      .where(eq(events.id, id))
      .returning();
    return result[0];
  }

  async createEventRegistration(data: InsertEventRegistration) {
    const result = await db.insert(eventRegistrations).values(data).returning();
    return result[0];
  }

  async getEventRegistrations(eventId: number) {
    return db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId));
  }

  async getUserEventRegistrations(userId: number) {
    return db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.userId, userId));
  }

  async getImpactStats() {
    const result = await db.select().from(impactStats);
    return result[0];
  }

  async updateImpactStats(data: Partial<InsertImpactStats>) {
    const result = await db.update(impactStats).set(data).returning();
    return result[0];
  }
}
