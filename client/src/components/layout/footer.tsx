import { Link } from "wouter";
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Get Involved", href: "/volunteer" },
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
    { name: "Impact Report", href: "/about" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-text-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-primary-pink mr-2" />
              <span className="text-2xl font-bold text-primary-pink">PadHer with Love</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering young girls through menstrual hygiene education and access to sanitary products. 
              Together, we can break the cycle of period poverty.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-300 hover:text-primary-pink transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <a className="block text-gray-300 hover:text-primary-pink transition-colors">
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 text-primary-pink mr-3 flex-shrink-0" />
                <span>hello@padherwithlove.org</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 text-primary-pink mr-3 flex-shrink-0" />
                <span>+234 123 456 7890</span>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin className="h-5 w-5 text-primary-pink mr-3 flex-shrink-0 mt-1" />
                <span>123 Hope Street, Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for impact stories and updates
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md text-text-dark border-0 focus:outline-none focus:ring-2 focus:ring-primary-pink"
              />
              <button className="bg-primary-pink text-white px-6 py-2 rounded-md hover:bg-secondary-purple transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>
            &copy; 2024 PadHer with Love. All rights reserved. | 
            <span className="ml-2">
              <a href="#" className="hover:text-primary-pink transition-colors">Privacy Policy</a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-primary-pink transition-colors">Terms of Service</a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
