import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DonationForm from "@/components/donation-form";
import ImpactStats from "@/components/impact-stats";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, CreditCard, Users, BookOpen, Droplets } from "lucide-react";
import type { Donation } from "@shared/schema";

export default function Donate() {
  const { data: recentDonations } = useQuery<Donation[]>({
    queryKey: ["/api/donations"],
  });

  return (
    <div className="w-full pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-pink to-secondary-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Donation <span className="text-accent-pink">Saves Lives</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Every dollar you donate provides essential menstrual products and education to girls who need them most. Your generosity breaks barriers and builds futures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center text-lg">
              <Heart className="mr-2 h-6 w-6" />
              <span>100% Secure Donations</span>
            </div>
            <div className="flex items-center text-lg">
              <Shield className="mr-2 h-6 w-6" />
              <span>Transparent Impact Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-dark mb-6">Make Your Donation</h2>
            <p className="text-xl text-text-light">
              Choose an amount that works for you. Every contribution makes a meaningful difference.
            </p>
          </div>
          <DonationForm />
        </div>
      </section>

      {/* Impact Statistics */}
      <ImpactStats />

      {/* Impact Breakdown */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-dark mb-6">Your Impact in Action</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              See exactly how your donation translates into real change for girls and communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-shadow hover:transform hover:scale-105 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-6">
                  <Droplets className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">$25</h3>
                <p className="text-text-light mb-4">
                  Provides a 6-month supply of sanitary pads for one girl, ensuring she never misses school due to her period.
                </p>
                <Badge className="bg-accent-pink text-primary-pink">Basic Support</Badge>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:transform hover:scale-105 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-secondary-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">$50</h3>
                <p className="text-text-light mb-4">
                  Funds educational workshops for 20 girls, providing crucial knowledge about menstrual health and hygiene.
                </p>
                <Badge className="bg-accent-pink text-secondary-purple">Education Package</Badge>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:transform hover:scale-105 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">$100</h3>
                <p className="text-text-light mb-4">
                  Supports a complete community outreach program, reaching 50+ girls with products and education.
                </p>
                <Badge className="bg-accent-pink text-primary-pink">Community Impact</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-20 bg-accent-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-dark mb-6">Why Your Donation Matters</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              Period poverty is a real issue affecting millions of girls worldwide. Your support helps us tackle this problem head-on.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-pink rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-dark mb-2">Breaking Educational Barriers</h3>
                  <p className="text-text-light">
                    1 in 4 girls miss school during their period due to lack of access to menstrual products. Your donation keeps girls in school.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-secondary-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-dark mb-2">Reducing Stigma</h3>
                  <p className="text-text-light">
                    Our education programs help normalize menstruation and break down harmful myths and taboos in communities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-pink rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-dark mb-2">Building Confidence</h3>
                  <p className="text-text-light">
                    Access to proper menstrual products and education gives girls the confidence to pursue their dreams without interruption.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Girls smiling and confident"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-dark mb-6">Complete Transparency</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              We believe in full transparency. Here's exactly how your donations are used to create maximum impact.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary-pink mb-2">75%</div>
                  <h3 className="font-bold text-text-dark mb-2">Direct Programs</h3>
                  <p className="text-sm text-text-light">
                    Product procurement, distribution, and educational workshops
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-secondary-purple mb-2">15%</div>
                  <h3 className="font-bold text-text-dark mb-2">Operations</h3>
                  <p className="text-sm text-text-light">
                    Staff salaries, office expenses, and program coordination
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary-pink mb-2">10%</div>
                  <h3 className="font-bold text-text-dark mb-2">Fundraising</h3>
                  <p className="text-sm text-text-light">
                    Marketing, events, and donor engagement activities
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="flex items-center justify-center space-x-2 text-text-light">
                <Shield className="h-5 w-5" />
                <span>All donations are secured with SSL encryption</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-text-light mt-2">
                <CreditCard className="h-5 w-5" />
                <span>Processed securely through Paystack</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Donations */}
      {recentDonations && recentDonations.length > 0 && (
        <section className="py-16 bg-accent-pink">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-dark mb-4">Recent Supporters</h2>
              <p className="text-text-light">
                Join these generous donors who are making a difference
              </p>
            </div>

            <div className="space-y-4">
              {recentDonations.slice(0, 5).map((donation) => (
                <Card key={donation.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-pink rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-text-dark">
                            {donation.donorName || "Anonymous Donor"}
                          </div>
                          <div className="text-sm text-text-light">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary-pink">
                          ${(donation.amount / 100).toFixed(2)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {donation.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
