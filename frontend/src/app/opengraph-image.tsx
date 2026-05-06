import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'VibeOpenClaw — Host AI Agents in One Click';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'radial-gradient(circle at 30% 30%, #1a0a1a 0%, #050810 60%)',
          color: '#f0f4ff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 32 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            <path
              d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z"
              fill="url(#g)"
            />
            <path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z" fill="url(#g)" />
            <path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z" fill="url(#g)" />
            <circle cx="45" cy="35" r="6" fill="#050810" />
            <circle cx="75" cy="35" r="6" fill="#050810" />
            <circle cx="46" cy="34" r="2.5" fill="#00e5cc" />
            <circle cx="76" cy="34" r="2.5" fill="#00e5cc" />
          </svg>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -3,
              backgroundImage: 'linear-gradient(135deg, #ff4d4d 0%, #00e5cc 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            VibeOpenClaw
          </div>
        </div>
        <div style={{ fontSize: 36, color: '#8892b0', fontWeight: 500, textAlign: 'center', marginBottom: 16 }}>
          Host AI Agents in One Click
        </div>
        <div style={{ fontSize: 22, color: '#5a6480', textAlign: 'center', maxWidth: 900 }}>
          Managed hosting for OpenClaw &amp; Hermes — BYOK, Docker-isolated, 13 LLM providers, instant HTTPS
        </div>
        <div style={{ display: 'flex', gap: 36, marginTop: 48, fontSize: 18, color: '#5a6480' }}>
          <span>● Docker Isolated</span>
          <span>● BYOK Keys</span>
          <span>● HTTPS Included</span>
        </div>
      </div>
    ),
    size,
  );
}
