import { Metadata } from 'next';

type Props = {
  params: { shareId: string }
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  try {
    const res = await fetch(`${baseUrl}/public-trips/share/${params.shareId}`, { next: { revalidate: 0 } });
    if (!res.ok) {
      return { title: 'Trip Not Found' };
    }
    
    const trip = await res.json();
    
    const ogImageUrl = `${appUrl}/api/og?title=${encodeURIComponent(trip.title)}&members=${trip.members?.length || 1}`;

    return {
      title: `${trip.title} - RoamCrew`,
      description: trip.description || 'Check out our trip itinerary on RoamCrew.',
      openGraph: {
        title: `${trip.title} - RoamCrew`,
        description: trip.description || 'Check out our trip itinerary on RoamCrew.',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: trip.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${trip.title} - RoamCrew`,
        description: trip.description || 'Check out our trip itinerary on RoamCrew.',
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    return { title: 'Trip - RoamCrew' };
  }
}

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
