import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // dynamic params
    const title = searchParams.get('title') || 'Trip Itinerary';
    const members = searchParams.get('members') || '1';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#020617',
            backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Decorative Top-Right abstract shape */}
          <div
            style={{
              position: 'absolute',
              top: '-150px',
              right: '-150px',
              width: '600px',
              height: '600px',
              background: 'linear-gradient(135deg, rgba(14,165,233,0.3) 0%, rgba(255,255,255,0) 100%)',
              borderRadius: '300px',
            }}
          />
          
          {/* Decorative Bottom-Left abstract shape */}
          <div
            style={{
              position: 'absolute',
              bottom: '-200px',
              left: '-100px',
              width: '500px',
              height: '500px',
              background: 'linear-gradient(45deg, rgba(139,92,246,0.2) 0%, rgba(255,255,255,0) 100%)',
              borderRadius: '250px',
            }}
          />

          {/* Glass Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '60px',
              borderRadius: '40px',
              width: '100%',
              height: '100%',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '24px',
                  marginRight: '16px',
                  boxShadow: '0 4px 12px rgba(14,165,233,0.4)',
                }}
              >
                R
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '22px', fontWeight: 700, letterSpacing: '4px' }}>
                ROAMCREW
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: title.length > 25 ? '72px' : '90px',
                fontWeight: '900',
                color: 'white',
                lineHeight: 1.1,
                letterSpacing: '-2px',
                marginBottom: '40px',
              }}
            >
              {title}
            </h1>

            {/* Meta tags at the bottom */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(14, 165, 233, 0.15)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  padding: '16px 32px',
                  borderRadius: '100px',
                  marginRight: '20px',
                }}
              >
                <span style={{ color: '#38bdf8', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                  {members} Traveler{parseInt(members) !== 1 ? 's' : ''}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '16px 32px',
                  borderRadius: '100px',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                  Live Itinerary
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
