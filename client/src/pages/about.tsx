import { useQuery } from "@tanstack/react-query";
import ImpactStats from "@/components/impact-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, BookOpen, Award } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="w-full pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-pink to-secondary-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            About <span className="text-accent-pink">PadHer with Love</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Dedicated to breaking the cycle of period poverty through education, empowerment, and accessible menstrual hygiene solutions.
          </p>
        </div>
      </section>

      {/* Impact Statistics */}
      <ImpactStats />

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-text-dark mb-6">Our Mission</h2>
                <p className="text-lg text-text-light leading-relaxed">
                  To eliminate period poverty by ensuring every girl has access to quality menstrual hygiene products and comprehensive education about reproductive health. We strive to create a world where menstruation is never a barrier to education, opportunity, or dignity.
                </p>
              </div>
              
              <div>
                <h2 className="text-4xl font-bold text-text-dark mb-6">Our Vision</h2>
                <p className="text-lg text-text-light leading-relaxed">
                  A world where every girl can manage her menstruation with confidence, knowledge, and access to safe, affordable products. We envision communities where menstrual health is normalized, stigma is eliminated, and girls can pursue their dreams without interruption.
                </p>
              </div>

              <Link href="/donate">
                <Button className="btn-primary">
                  <Heart className="mr-2 h-5 w-5" />
                  Support Our Mission
                </Button>
              </Link>
            </div>
            
            <div className="space-y-6">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Community outreach program"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-accent-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">Our Approach</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              We tackle period poverty through a comprehensive, multi-faceted approach that addresses both immediate needs and long-term systemic change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-shadow hover:transform hover:scale-105 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-4">Product Distribution</h3>
                <p className="text-text-light">
                  Providing free sanitary pads and menstrual products to girls and women in underserved communities.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:transform hover:scale-105 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-4">Education & Awareness</h3>
                <p className="text-text-light">
                  Comprehensive menstrual health education programs in schools and communities to break taboos and myths.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:transform hover:scale-105 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-4">Community Engagement</h3>
                <p className="text-text-light">
                  Building partnerships with local organizations, schools, and community leaders to create lasting change.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:transform hover:scale-105 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-4">Advocacy & Policy</h3>
                <p className="text-text-light">
                  Advocating for policy changes that ensure access to menstrual products and comprehensive health education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://pixabay.com/get/g938fec19899ffe58dc104cf116231fe6149786d120a3302e1865af7c9e38f3cf5f65f464d15a8462e1ddb6f8fbd860d091e5db2ea8f1323be26e9f955d0b7d81_1280.jpg"
                alt="Girls in rural community"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-text-dark">
                Our <span className="text-primary-pink">Story</span>
              </h2>
              <p className="text-lg text-text-light leading-relaxed">
                PadHer with Love was founded in 2019 when our founder witnessed firsthand how period poverty was preventing girls in her community from attending school. What started as a small initiative to provide sanitary pads to a local school has grown into a comprehensive program reaching thousands of girls across multiple regions.
              </p>
              <p className="text-lg text-text-light leading-relaxed">
                Today, we work with schools, communities, and partner organizations to ensure that no girl misses school because of her period. Through our programs, we've not only provided essential products but also created safe spaces for girls to learn about their bodies and reproductive health.
              </p>
              <div className="flex space-x-4">
                <Link href="/volunteer">
                  <Button className="btn-primary">Join Our Team</Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" className="border-2 border-primary-pink text-primary-pink hover:bg-primary-pink hover:text-white">
                    Read Our Blog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-secondary-purple to-primary-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of supporters who are helping us break the cycle of period poverty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="bg-white text-primary-pink hover:bg-accent-pink text-lg px-8 py-4">
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-pink text-lg px-8 py-4">
                <Users className="mr-2 h-5 w-5" />
                Volunteer Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
