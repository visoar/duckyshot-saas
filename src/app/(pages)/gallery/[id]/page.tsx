import React from "react";
import { PublicArtworkDetail } from "./_components/public-artwork-detail";

interface PublicArtworkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PublicArtworkPage({
  params,
}: PublicArtworkPageProps) {
  const { id } = await params;
  return <PublicArtworkDetail artworkId={id} />;
}
