import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Menu, User } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Get Involved", href: "/volunteer" },
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    return href !== "/" && location.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Heart className="h-8 w-8 text-primary-pink mr-2" />
              <span className="text-2xl font-bold text-primary-pink">PadHer with Love</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={`text-sm font-medium transition-colors hover:text-primary-pink ${
                    isActive(item.href)
                      ? "text-primary-pink border-b-2 border-primary-pink pb-1"
                      : "text-text-dark"
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            
            <Link href="/donate">
              <Button className="btn-primary">
                <Heart className="mr-2 h-4 w-4" />
                Donate Now
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="flex items-center pb-4 border-b">
                    <Heart className="h-6 w-6 text-primary-pink mr-2" />
                    <span className="text-lg font-bold text-primary-pink">PadHer with Love</span>
                  </div>
                  
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a
                        className={`block py-2 px-3 rounded-md text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-primary-pink text-white"
                            : "text-text-dark hover:bg-accent-pink hover:text-primary-pink"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  
                  <div className="pt-4 space-y-3">
                    <Link href="/donate">
                      <Button className="w-full btn-primary" onClick={() => setMobileMenuOpen(false)}>
                        <Heart className="mr-2 h-4 w-4" />
                        Donate Now
                      </Button>
                    </Link>
                    
                    <Link href="/login">
                      <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
