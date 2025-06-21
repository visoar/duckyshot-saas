import React from "react";

import { 
  Headphones,
} from "lucide-react";
import { createMetadata } from "@/lib/metadata";
import { ContactMethods } from "./contact-methods";
import { COMPANY_NAME } from "@/constants";
import { BackgroundPattern } from "@/components/ui/background-pattern";

export const metadata = createMetadata({
  title: "Contact Us",
  description: `Get in touch with our team. We are here to help with any questions about ${COMPANY_NAME}.`,
});

export default function ContactPage() {

  return (
    <>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-24">
          <BackgroundPattern />
          
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm backdrop-blur-sm mb-6">
                <Headphones className="mr-2 h-3 w-3 text-primary" />
                <span className="text-muted-foreground">We&apos;re here to help</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                Contact <span className="text-primary">Us</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Have questions about {COMPANY_NAME}? Need help getting started? 
                Our team is ready to assist you every step of the way.
              </p>
            </div>
          </div>
        </section>

        <ContactMethods />
    </>
  );
}