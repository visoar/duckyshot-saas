import React from "react";
import { ArtworkDetail } from "./_components/artwork-detail";

interface ArtworkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { id } = await params;
  return <ArtworkDetail artworkId={id} />;
}
