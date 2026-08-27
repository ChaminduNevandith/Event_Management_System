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
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0C4A6E',
            backgroundImage: 'linear-gradient(to bottom right, #0EA5E9, #0C4A6E)',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '60px',
              borderRadius: '30px',
              width: '100%',
              height: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            <h1
              style={{
                fontSize: '80px',
                fontWeight: '900',
                color: '#0C4A6E',
                marginBottom: '20px',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '40px',
                color: '#486581',
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '30px',
                  backgroundColor: '#0EA5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: '20px',
                }}
              >
                {members}
              </div>
              <span>Travelers in this crew</span>
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
