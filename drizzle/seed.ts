import { db } from "../db";

import {
  blogPosts,
  volunteerOpportunities,
  events,
  impactStats,
} from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  // Seed Impact Stats
  await db.insert(impactStats).values({
    girlsHelped: 15420,
    padsDistributed: 89350,
    schoolsReached: 234,
    volunteers: 1200,
    updatedAt: new Date(),
  });

  // Seed Volunteer Opportunities
  await db.insert(volunteerOpportunities).values([
    {
      title: "Community Outreach",
      description:
        "Join our field teams to distribute pads and conduct educational workshops in underserved communities.",
      type: "community-outreach",
      timeCommitment: "5-10 hours/week",
      location: "Field work required",
      requirements: ["Passion for helping others", "Good communication skills"],
      isActive: true,
      createdAt: new Date(),
    },
    {
      title: "Education & Training",
      description:
        "Lead workshops on menstrual hygiene and reproductive health in schools and community centers.",
      type: "education",
      timeCommitment: "3-5 hours/week",
      location: "Schools and community centers",
      requirements: ["Teaching experience preferred", "Training provided"],
      isActive: true,
      createdAt: new Date(),
    },
    {
      title: "Digital Advocacy",
      description:
        "Help us spread awareness through social media, content creation, and digital campaigns.",
      type: "digital-advocacy",
      timeCommitment: "2-4 hours/week",
      location: "Remote work",
      requirements: ["Social media experience", "Content creation skills"],
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  // Seed Blog Posts
  await db.insert(blogPosts).values([
    {
      title: "Understanding Your Menstrual Cycle: A Complete Guide",
      slug: "understanding-menstrual-cycle-guide",
      excerpt:
        "Learn about the menstrual cycle, what's normal, and how to maintain good hygiene practices during your period.",
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
      title: "Breaking the Silence: Maria's Story",
      slug: "breaking-silence-maria-story",
      excerpt:
        "Discover how access to menstrual products changed Maria's life and kept her in school to pursue her dreams.",
      content: "Maria's inspiring story content here...",
      category: "Impact Stories",
      author: "PadHer Team",
      imageUrl:
        "https://pixabay.com/get/g938fec19899ffe58dc104cf116231fe6149786d120a3302e1865af7c9e38f3cf5f65f464d15a8462e1ddb6f8fbd860d091e5db2ea8f1323be26e9f955d0b7d81_1280.jpg",
      readTime: 3,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Safe Practices: Choosing the Right Products",
      slug: "safe-practices-choosing-products",
      excerpt:
        "Learn about different menstrual products, their benefits, and how to use them safely and effectively.",
      content: "Product safety guide content here...",
      category: "Hygiene Tips",
      author: "Dr. Emily Carter",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      readTime: 4,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Seed Events
  await db.insert(events).values([
    {
      title: "Menstrual Health Workshop for Teens",
      description:
        "Educational workshop covering menstrual health basics, hygiene practices, and product usage.",
      type: "workshop",
      date: new Date(2024, 11, 15, 14, 0),
      time: "2:00 PM - 4:00 PM",
      location: "Community Center, Lagos",
      maxAttendees: 50,
      currentAttendees: 25,
      isActive: true,
      createdAt: new Date(),
    },
    {
      title: "School Distribution Drive",
      description:
        "Distribute sanitary pads and educational materials to students at local schools.",
      type: "outreach",
      date: new Date(2024, 11, 22, 9, 0),
      time: "9:00 AM - 12:00 PM",
      location: "St. Mary's Secondary School",
      maxAttendees: 20,
      currentAttendees: 12,
      isActive: true,
      createdAt: new Date(),
    },
    {
      title: "Online Q&A: Myths & Facts",
      description:
        "Virtual session addressing common myths and providing factual information about menstruation.",
      type: "virtual",
      date: new Date(2024, 11, 28, 19, 0),
      time: "7:00 PM - 8:30 PM",
      location: "Online Event",
      maxAttendees: 100,
      currentAttendees: 45,
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  console.log("✅ Seed complete");
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
