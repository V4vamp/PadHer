import { useQuery } from "@tanstack/react-query";
import HeroSlider from "@/components/hero-slider";
import ImpactStats from "@/components/impact-stats";
import VolunteerCard from "@/components/volunteer-card";
import BlogCard from "@/components/blog-card";
import EventCard from "@/components/event-card";
import DonationForm from "@/components/donation-form";
import { Button } from "@/components/ui/button";
import { Heart, HandHeart } from "lucide-react";
import { Link } from "wouter";
import type { VolunteerOpportunity, BlogPost, Event } from "@shared/schema";

export default function Home() {
  const { data: opportunities } = useQuery<VolunteerOpportunity[]>({
    queryKey: ["/api/volunteer-opportunities"],
  });

  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSlider />

      {/* Impact Statistics */}
      <ImpactStats />

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Young girls in classroom learning"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-text-dark">
                Breaking Barriers,
                <span className="text-primary-pink"> Building Futures</span>
              </h2>
              <p className="text-lg text-text-light leading-relaxed">
                Period poverty affects millions of girls worldwide, keeping them out of school and limiting their potential. At PadHer with Love, we believe every girl deserves access to menstrual hygiene products and education.
              </p>
              <p className="text-lg text-text-light leading-relaxed">
                Through our comprehensive programs, we provide sanitary pads, education workshops, and ongoing support to ensure girls can attend school with confidence and dignity.
              </p>
              <div className="flex space-x-4">
                <Link href="/about">
                  <Button className="btn-primary">Our Impact</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-2 border-primary-pink text-primary-pink hover:bg-primary-pink hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 bg-gradient-to-br from-primary-pink to-secondary-purple">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Make a Difference Today</h2>
          <p className="text-xl mb-10 opacity-90">
            Your donation directly impacts young girls' lives. Choose an amount that works for you.
          </p>
          <DonationForm />
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">Join Our Volunteer Community</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              Be part of the change. Our volunteers are the heart of our mission, helping us reach more girls and communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {opportunities?.slice(0, 3).map((opportunity) => (
              <VolunteerCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/volunteer">
              <Button className="btn-primary">
                <HandHeart className="mr-2 h-5 w-5" />
                View All Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">Education & Awareness</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              Access comprehensive resources on menstrual health, hygiene practices, and reproductive wellness.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts?.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button className="btn-primary">View All Articles</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-accent-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">Upcoming Events</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              Join us at our upcoming workshops, community outreach programs, and educational events.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events?.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <Button className="btn-primary">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
