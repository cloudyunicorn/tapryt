import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { 
  QrCodeIcon,
  ShareIcon,
  ChartBarIcon,
  PaintBrushIcon,
  CloudIcon,
  UserGroupIcon,
  CheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { LeafIcon } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: QrCodeIcon,
      title: "Smart QR Codes",
      description: "Generate dynamic QR codes that instantly share your contact information with a simple scan.",
      gradient: "from-[hsl(var(--brand-blue))] to-[hsl(var(--brand-cyan))]"
    },
    {
      icon: PaintBrushIcon,
      title: "Custom Designs",
      description: "Choose from hundreds of professional templates or create your own unique digital card design.",
      gradient: "from-[hsl(var(--brand-purple))] to-[hsl(var(--brand-pink))]"
    },
    {
      icon: ChartBarIcon,
      title: "Analytics & Insights",
      description: "Track who viewed your card, when they contacted you, and measure your networking success.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: ShareIcon,
      title: "Instant Sharing",
      description: "Share your digital card via text, email, social media, or NFC with just one tap.",
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      icon: CloudIcon,
      title: "Real-time Updates",
      description: "Update your information once and everyone who has your card gets the latest details instantly.",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: UserGroupIcon,
      title: "Contact Management",
      description: "Organize and manage all your business contacts in one place with smart categorization.",
      gradient: "from-[hsl(var(--brand-purple))] to-[hsl(var(--brand-blue))]"
    }
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Sales Director at InnovateX",
      content: "TapRyt has transformed my networking game. I've doubled my meaningful connections since switching to digital cards. The analytics help me follow up at the perfect time.",
      avatar: "AT",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Entrepreneur & Consultant",
      content: "Never running out of business cards again! The real-time updates are a lifesaver when I change my contact info. Professional and eco-friendly.",
      avatar: "MS",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Marketing Manager",
      content: "The custom designs and QR codes make such a great first impression. I love seeing the analytics of who's engaging with my card.",
      avatar: "DK",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Personal",
      price: "$9",
      description: "Perfect for professionals and entrepreneurs",
      features: [
        "1 digital business card",
        "Basic templates",
        "QR code generation",
        "Basic analytics",
        "Social media links"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$19",
      description: "Ideal for active networkers and sales teams",
      features: [
        "5 digital business cards",
        "Premium templates",
        "Custom branding",
        "Advanced analytics",
        "Contact management",
        "NFC support",
        "Lead capture forms"
      ],
      popular: true
    },
    {
      name: "Business",
      price: "$49",
      description: "For teams and growing organizations",
      features: [
        "Unlimited digital cards",
        "Team management",
        "Custom domains",
        "API integrations",
        "CRM sync",
        "Advanced reporting",
        "Priority support"
      ],
      popular: false
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TR</span>
            </div>
            <span className="text-xl font-bold text-brand-gradient">
              TapRyt
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-slate-600 dark:text-slate-300 hover:text-brand-blue transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-brand-purple transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-brand-blue transition-colors">
              Testimonials
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--brand-blue))]/10 to-[hsl(var(--brand-purple))]/10 dark:from-[hsl(var(--brand-blue))]/5 dark:to-[hsl(var(--brand-purple))]/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-brand-purple/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-8">
            <LeafIcon className="w-4 h-4" />
            100% Eco-Friendly Networking
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
            Your
            <span className="text-brand-gradient">
              {" "}Digital Business Card{" "}
            </span>
            Revolution
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
            Create stunning digital visiting cards that make lasting impressions. Share instantly, track engagement, and never run out of cards again.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <AuthButton />
            <button className="px-8 py-3 border-2 border-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              View Demo Card
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-500" />
              Free card forever
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-500" />
              No setup fees
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-500" />
              Works on all devices
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-2">50K+</div>
              <div className="text-slate-600 dark:text-slate-400">Digital Cards Created</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-brand-purple mb-2">2M+</div>
              <div className="text-slate-600 dark:text-slate-400">Contacts Shared</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">10K</div>
              <div className="text-slate-600 dark:text-slate-400">Trees Saved</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-slate-600 dark:text-slate-400">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need for
              <span className="text-brand-gradient">
                {" "}Smart Networking
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300">
              Powerful features that make networking effortless, trackable, and environmentally friendly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-[hsl(var(--brand-blue))]/10 transition-all duration-300 hover:-translate-y-2">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white dark:bg-slate-900 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Get Started in
              <span className="text-brand-gradient">
                {" "}3 Simple Steps
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[hsl(var(--brand-blue))] to-[hsl(var(--brand-cyan))] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Card</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Choose a template and add your contact information, social links, and professional details in minutes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[hsl(var(--brand-purple))] to-[hsl(var(--brand-pink))] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Share Instantly</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Share your card via QR code, NFC, link, or directly through messaging apps and social media.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Track & Connect</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Monitor card views, manage new contacts, and build meaningful professional relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Trusted by
              <span className="text-brand-gradient">
                {" "}Professionals Worldwide
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300">
              Join thousands of professionals who&apos;ve upgraded their networking game.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-gradient rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white dark:bg-slate-900 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Choose Your
              <span className="text-brand-gradient">
                {" "}Perfect Plan
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300">
              Start free and upgrade as you grow. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-brand-gradient text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-extrabold mb-2">
                    {plan.price}
                    {plan.price !== "Custom" && <span className="text-lg text-slate-500">/month</span>}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-brand-gradient text-white hover:opacity-90'
                    : 'border-2 border-primary hover:bg-primary/10'
                }`}>
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="text-brand-gradient">
              {" "}Networking Game?
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Join thousands of professionals who&apos;ve already made the switch to smart, sustainable networking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <AuthButton />
            <button className="px-8 py-3 border-2 border-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-t-foreground/10 py-12 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TR</span>
                </div>
                <span className="text-xl font-bold text-brand-gradient">
                  TapRyt
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                The future of professional networking is here.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Templates</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Analytics</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><Link href="#" className="hover:text-brand-purple transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-brand-purple transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-brand-purple transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-brand-purple transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8 text-sm text-slate-500 dark:text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} TapRyt — Built with{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-brand-blue transition-colors"
              >
                Supabase
              </a>{" "}
              &{" "}
              <Link
                href="https://nextjs.org"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-brand-purple transition-colors"
              >
                Next.js
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
