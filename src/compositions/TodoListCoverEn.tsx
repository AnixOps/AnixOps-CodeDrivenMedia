import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

/**
 * TodoList English Version Cover Component
 * Inspired by Apple's design style - simple, elegant, and professional
 */
export const TodoListCoverEn: React.FC = () => {
  const frame = useCurrentFrame();

  // Animation timing handler to ensure content remains visible after the animation ends
  const fadeIn = frame >= 70 ? 1 : interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const slideUp = frame >= 70 ? 0 : interpolate(frame, [0, 45], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const scaleIn = frame >= 70 ? 1 : interpolate(frame, [0, 60], [0.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Apple-style gradient background */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(0, 122, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(52, 199, 89, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 149, 0, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #1c1c1e 100%)
          `,
          opacity: fadeIn,
        }}
      />

      {/* Grid background - Apple style */}
      <AbsoluteFill>
        <svg
          width="100%"
          height="100%"
          style={{
            opacity: fadeIn * 0.03,
            transform: `scale(${scaleIn})`,
          }}
        >
          <defs>
            <pattern
              id="grid-en" // ID updated for the English version
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-en)" />
        </svg>
      </AbsoluteFill>

      {/* Main content area */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 120,
          transform: `translateY(${slideUp}px)`,
          opacity: fadeIn,
        }}
      >
        {/* Logo area - simplified version */}
        <div 
          style={{ 
            marginBottom: 80,
            transform: `scale(${scaleIn})`,
            width: 120,
            height: 120,
            borderRadius: '24px',
            backgroundColor: '#007AFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 20px 40px rgba(0, 122, 255, 0.3)',
          }}
        >
          📝
        </div>

        {/* Main title - Apple style */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 40,
            transform: `scale(${scaleIn})`,
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.0,
              background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 20px rgba(255,255,255,0.1)',
            }}
          >
            AnixOps-TodoList
          </h1>
        </div>

        {/* Product positioning - Apple-style concise description */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 60,
            opacity: interpolate(frame, [30, 60], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <h2
            style={{
              fontSize: 32,
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              letterSpacing: '0.01em',
              lineHeight: 1.3,
            }}
          >
            The ultimate productivity companion.
          </h2>
        </div>

        {/* Core features - Apple-style icon display */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 80,
            marginBottom: 80,
          }}
        >
          {[
            { icon: '✓', text: 'Smart Lists', color: '#007AFF' },
            { icon: '⚡', text: 'AI Insights (Coming Soon)', color: '#34C759' },
            { icon: '☁', text: 'Cross-Platform Sync', color: '#FF9500' },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: interpolate(frame, [20 + index * 8, 60 + index * 8], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                transform: `translateY(${interpolate(frame, [20 + index * 8, 60 + index * 8], [30, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })})`,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  backgroundColor: feature.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  marginBottom: 16,
                  boxShadow: `0 8px 32px ${feature.color}40`,
                }}
              >
                {feature.icon}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                {feature.text}
              </div>
            </div>
          ))}
        </div>

        {/* Platform support - Apple style */}
        <div
          style={{
            textAlign: 'center',
            opacity: interpolate(frame, [50, 80], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
              fontWeight: 400,
            }}
          >
            Available on iPhone, iPad, Mac (Coming Soon), and the Web
          </p>
        </div>
      </AbsoluteFill>

      {/* Branding - bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          fontSize: 14,
          fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
          color: 'rgba(255, 255, 255, 0.4)',
          opacity: fadeIn * 0.8,
        }}
      >
        AnixOps-Studio
      </div>

      {/* Ambient light effect */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.1) 100%)
          `,
          opacity: fadeIn * 0.5,
        }}
      />
    </AbsoluteFill>
  );
};