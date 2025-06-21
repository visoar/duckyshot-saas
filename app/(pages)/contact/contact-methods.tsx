import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONTACT_EMAIL } from "@/constants";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help from our support team",
    contact: CONTACT_EMAIL,
    availability: "24/7 response within 4 hours"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our team",
    contact: "+1 (555) 123-4567",
    availability: "Mon-Fri, 9AM-6PM EST"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Instant help when you need it",
    contact: "Available in dashboard",
    availability: "Mon-Fri, 9AM-6PM EST"
  },
  {
    icon: MapPin,
    title: "Office Address",
    description: "Visit us in person",
    contact: "123 Tech Street, San Francisco, CA 94105",
    availability: "By appointment only"
  }
];

export function ContactMethods() {
  return (
    <>
      {/* Contact Methods */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Choose the best way to reach us
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{method.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                      <p className="text-sm font-medium mb-2">{method.contact}</p>
                      <Badge variant="secondary" className="text-xs">
                        {method.availability}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}