import { createMetadata } from "@/lib/metadata";
import { DashboardPageWrapper } from "../_components/dashboard-page-wrapper";
import { ArtworksGallery } from "@/components/artworks/artworks-gallery-simple";

export const metadata = createMetadata({
  title: "My Artworks",
  description: "View and manage all your AI-generated pet artworks",
});

export default function ArtworksPage() {
  return (
    <DashboardPageWrapper 
      title="My Artworks" 
      description="View, download, and create merchandise from your AI-generated pet art"
    >
      <ArtworksGallery />
    </DashboardPageWrapper>
  );
}