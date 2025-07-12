import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, insertDonationSchema, insertVolunteerSchema,
  insertBlogPostSchema, insertEventSchema, insertEventRegistrationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth middleware (simplified for demo)
  const authenticateUser = (req: any, res: any, next: any) => {
    // TODO: Implement proper JWT authentication
    req.user = { id: 1, role: "admin" }; // Mock user for development
    next();
  };

  // Users / Auth
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // TODO: Generate JWT token
      res.json({ user: { ...user, password: undefined }, token: "mock-jwt-token" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Donations
  app.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      
      // TODO: Integrate with Paystack API
      const paystackResponse = {
        reference: `PAY_${Date.now()}`,
        status: "success"
      };
      
      const donation = await storage.createDonation({
        ...donationData,
        paystackReference: paystackResponse.reference,
        status: paystackResponse.status === "success" ? "completed" : "failed"
      });
      
      res.json(donation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/donations/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const donations = await storage.getDonationsByUser(userId);
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Volunteers
  app.post("/api/volunteers", async (req, res) => {
    try {
      const volunteerData = insertVolunteerSchema.parse(req.body);
      const volunteer = await storage.createVolunteer(volunteerData);
      
      // TODO: Send confirmation email
      
      res.json(volunteer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/volunteers", authenticateUser, async (req, res) => {
    try {
      const volunteers = await storage.getVolunteers();
      res.json(volunteers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/volunteers/:id/status", authenticateUser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const volunteer = await storage.updateVolunteerStatus(id, status);
      
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
      
      res.json(volunteer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Volunteer Opportunities
  app.get("/api/volunteer-opportunities", async (req, res) => {
    try {
      const opportunities = await storage.getVolunteerOpportunities();
      res.json(opportunities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Blog Posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/blog-posts", authenticateUser, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getActiveEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/events", authenticateUser, async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Event Registrations
  app.post("/api/event-registrations", async (req, res) => {
    try {
      const registrationData = insertEventRegistrationSchema.parse(req.body);
      
      // Check if event has capacity
      const event = await storage.getEvent(registrationData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
        return res.status(400).json({ message: "Event is full" });
      }
      
      const registration = await storage.createEventRegistration(registrationData);
      
      // TODO: Send confirmation email
      
      res.json(registration);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/event-registrations/event/:eventId", authenticateUser, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const registrations = await storage.getEventRegistrations(eventId);
      res.json(registrations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Impact Stats
  app.get("/api/impact-stats", async (req: Request, res: Response) => {
  try {
    const stats = await storage.getImpactStats();

    if (!stats) {
      return res.status(404).json({ message: "Impact stats not found" });
    }

    return res.status(200).json(stats);
  } catch (error: any) {
    console.error("Error fetching impact stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

  app.patch("/api/impact-stats", authenticateUser, async (req, res) => {
    try {
      const statsData = req.body;
      const stats = await storage.updateImpactStats(statsData);
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
