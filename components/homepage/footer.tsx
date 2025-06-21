"use client";

import React from "react";
import { Link } from "next-view-transitions";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/logo";
import { APP_NAME, APP_DESCRIPTION, COMPANY_NAME, COMPANY_TAGLINE, GITHUB_URL, TWITTERACCOUNT, CONTACT_EMAIL } from "@/constants";
import { 
  Github, 
  Twitter, 
  Mail, 
  Heart
} from "lucide-react";

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterSocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Documentation", href: "/docs" },
      { name: "Changelog", href: "/changelog" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "Templates", href: "/templates" }
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" }
    ]
  }
];

const socialLinks: FooterSocialLink[] = [
  {
    name: "GitHub",
    href: GITHUB_URL,
    icon: Github
  },
  {
    name: "Twitter",
    href: `https://twitter.com/${TWITTERACCOUNT.replace('@', '')}`,
    icon: Twitter
  },
  {
    name: "Email",
    href: `mailto:${CONTACT_EMAIL}`,
    icon: Mail
  }
];

function FooterLinkComponent({ link }: { link: FooterLink }) {
  const linkClasses = "text-sm text-muted-foreground transition-colors hover:text-foreground";
  
  if (link.external) {
    return (
      <a 
        href={link.href} 
        className={linkClasses}
        target="_blank" 
        rel="noopener noreferrer"
      >
        {link.name}
      </a>
    );
  }
  
  return (
    <Link href={link.href} className={linkClasses}>
      {link.name}
    </Link>
  );
}

function FooterSocialLinkComponent({ social }: { social: FooterSocialLink }) {
  const IconComponent = social.icon;
  
  return (
    <a
      href={social.href}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground hover:border-border/80"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.name}
    >
      <IconComponent className="h-4 w-4" />
    </a>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Logo className="h-6 w-6 text-primary" variant="icon-only" />
                <span className="text-xl font-bold text-foreground">{APP_NAME}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                {APP_DESCRIPTION}
              </p>
              
              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <FooterSocialLinkComponent key={social.name} social={social} />
                ))}
                <div className="h-6 w-px bg-border mx-1" />
                <ModeToggle variant="outline" size="icon" />
              </div>
            </div>
            
            {/* Links sections */}
            <div className="lg:col-span-4">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                {footerSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-semibold text-foreground mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <FooterLinkComponent link={link} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Bottom section */}
        <div className="py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} {COMPANY_NAME}. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>{COMPANY_TAGLINE}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
