import { Hero } from "@/components/homepage/hero";
import { ArtGalleryShowcase } from "@/components/homepage/art-gallery-showcase";
import { DigitalToPhysicalShowcase } from "@/components/homepage/digital-to-physical-showcase";
import { SimpleJourney } from "@/components/homepage/simple-journey";
import { GiftMemorialScenarios } from "@/components/homepage/gift-memorial-scenarios";
import { SocialProofUnified } from "@/components/homepage/social-proof-testimonials";
import { CallToAction } from "@/components/homepage/call-to-action";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Turn Your Pet Into Art They Deserve - AI Pet Art & Custom Products",
  description:
    "Transform cherished pet photos into museum-quality artwork and custom keepsakes. Van Gogh, anime, and 50+ AI art styles. Create canvas prints, mugs, apparel in 30 seconds. Perfect for gifts, memorials, and treasured home decor.",
  keywords: [
    "pet art creator",
    "AI pet portraits",
    "custom pet keepsakes",
    "pet memorial gifts",
    "pet canvas prints",
    "pet mugs",
    "pet t-shirts",
    "Van Gogh pet art",
    "anime pet art",
    "museum quality pet art",
    "pet wall art",
    "personalized pet products",
    "pet photo to art",
    "custom pet merchandise",
    "treasured pet memories",
  ],
  openGraph: {
    title: "Turn Your Pet Into Art They Deserve - DuckyShot",
    description:
      "Transform pet photos into museum-quality artwork and custom keepsakes. 50+ AI art styles, professional printing, fast shipping.",
  },
  twitter: {
    title: "Turn Your Pet Into Art They Deserve - DuckyShot",
    description:
      "Transform pet photos into museum-quality artwork and custom keepsakes. 50+ AI art styles, professional printing, fast shipping.",
  },
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ArtGalleryShowcase />
      <DigitalToPhysicalShowcase />
      <SimpleJourney />
      <GiftMemorialScenarios />
      <SocialProofUnified />
      <CallToAction />
    </>
  );
}
