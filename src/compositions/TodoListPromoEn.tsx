import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  random,
} from 'remotion';

// --- Enhanced Cursor Component with different states and animation effects --- //
const Cursor: React.FC<{ 
    isClicking?: boolean; 
    isTyping?: boolean; 
    glowColor?: string;
    size?: number;
}> = ({ 
    isClicking = false, 
    isTyping = false, 
    glowColor = 'rgba(56, 189, 248, 0.8)',
    size = 40 
}) => {
    const frame = useCurrentFrame();
    const pulseScale = isClicking ? 1.2 + Math.sin(frame * 0.5) * 0.1 : 1;
    const glowIntensity = isTyping ? 0.8 + Math.sin(frame * 0.3) * 0.4 : 0.6;

    return (
        <div style={{
            position: 'relative',
            width: size,
            height: size,
            transform: `scale(${pulseScale})`,
            filter: `drop-shadow(0 0 ${8 + glowIntensity * 12}px ${glowColor}) drop-shadow(2px 2px 8px rgba(0,0,0,0.6))`,
            transition: 'transform 0.2s ease',
        }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="#FFFFFF"
                style={{
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <path d="M7.5,2C7.5,2 8.5,2.25 9,3L14.5,13L18.5,11.5C18.5,11.5 19.5,11.25 20,12C20.5,12.75 20,14 20,14L18,16L21.5,19.5C21.5,19.5 22.25,20.5 21.5,21C20.75,21.5 19.5,21.5 19.5,21.5L16,18L14,20C14,20 12.75,20.5 12,20C11.25,19.5 11.5,18.5 11.5,18.5L13,14.5L3,9C3,8.5 2.25,7.5 2,7.5C1.75,7.5 2,8.5 2,8.5L7.5,2Z" />
            </svg>
            {/* Glow effect */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: size * 1.5,
                height: size * 1.5,
                background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: glowIntensity * 0.6,
                zIndex: 1,
            }} />
        </div>
    );
};

// --- Scene 1: Problem Presentation (Enhanced Version) --- //
const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Multi-layer flashing effect
  const flashOpacity = interpolate(frame, [0, 15, 30, 45, 60], [1, 0.3, 1, 0.5, 1], {
    extrapolateRight: 'clamp',
  });

  const chaosScale = spring({
    frame,
    fps,
    config: { stiffness: 50, damping: 10 },
  });

  // Enhanced shake effect
  const shakeIntensity = Math.min(frame / (fps * 1.2), 1);
  const shakeX = Math.sin(frame / 3) * 20 * shakeIntensity + Math.cos(frame / 7) * 8;
  const shakeY = Math.cos(frame / 5) * 15 * shakeIntensity + Math.sin(frame / 9) * 6;
  const rotationShake = Math.sin(frame / 8) * 2 * shakeIntensity;
  
  // Dynamic color changes
  const hueRotate = interpolate(frame, [0, fps * 6], [0, 60]);
  const gradientShift = interpolate(frame, [0, fps * 6], [0, 100]);
  const saturationBoost = 100 + Math.sin(frame / 15) * 30;

  // More complex calendar generation
  const calendarColors = useMemo(() => {
    const colors = ['#ff6b6b', '#ff8e53', '#ff6b9d', '#c44569', '#f5f5f5', '#e8e8e8'];
    return Array.from({ length: 21 }, (_, i) => {
      const stress = random(`calendar-${i}`) > 0.6;
      return stress ? colors[Math.floor(random(`color-${i}`) * 4)] : colors[4 + Math.floor(random(`neutral-${i}`) * 2)];
    });
  }, []);

  return (
    <AbsoluteFill
      style={{
        background: `
          linear-gradient(45deg, 
            hsl(${hueRotate}, ${saturationBoost}%, 8%) 0%, 
            hsl(${hueRotate + 30}, ${saturationBoost}%, 12%) 100%
          )
        `,
        transform: `translate(${shakeX}px, ${shakeY}px) rotate(${rotationShake}deg)`,
        opacity: flashOpacity,
      }}
    >
      {/* Multi-layer background patterns */}
      <AbsoluteFill style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 142, 83, 0.3) 0%, transparent 50%),
          repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.03) 35px, rgba(255,255,255,0.03) 70px)
        `,
        transform: `translateX(${gradientShift}px) rotate(${frame}deg)`,
        opacity: 0.6,
      }} />

      {/* Cluttered desktop - enhanced chaos */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        right: '5%',
        height: '80%',
        transform: `scale(${chaosScale})`,
        opacity: flashOpacity,
      }}>
        {/* Messy calendar - enhanced version */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '8%',
          width: '35%',
          height: '65%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '20px',
          transform: `rotate(${-8 + rotationShake}deg) scale(${0.9 + Math.sin(frame / 20) * 0.1})`,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.5)`,
          border: '2px solid rgba(255, 107, 107, 0.3)',
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#2d3436',
            textAlign: 'center',
            borderBottom: '2px solid #ff6b6b',
            paddingBottom: '8px',
          }}>
            SCHEDULE CHAOS
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px',
            fontSize: '12px',
          }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} style={{ textAlign: 'center', fontWeight: 'bold', color: '#636e72' }}>
                {day}
              </div>
            ))}
            {calendarColors.map((color, i) => (
              <div key={i} style={{
                backgroundColor: color,
                height: '28px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: random(`weight-${i}`) > 0.5 ? 'bold' : 'normal',
                color: color.includes('#f5f5f5') ? '#2d3436' : '#ffffff',
                transform: random(`transform-${i}`) > 0.7 ? `rotate(${random(`rotate-${i}`) * 10 - 5}deg)` : 'none',
                border: color.includes('#ff') ? '2px solid rgba(255,255,255,0.4)' : 'none',
              }}>
                {i + 1 <= 21 ? i + 1 : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Notification chaos - enhanced */}
        <div style={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '40%',
          height: '25%',
          backgroundColor: 'rgba(255, 59, 48, 0.95)',
          borderRadius: '20px',
          padding: '25px',
          transform: `rotate(${5 + rotationShake}deg)`,
          boxShadow: '0 25px 80px rgba(255, 59, 48, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          border: '3px solid rgba(255, 255, 255, 0.3)',
        }}>
          <div style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            lineHeight: '1.4',
          }}>
          📧 99+ Unread<br/>📋 15 Tasks<br/>⏰ 5 Overdue
          </div>
        </div>

        {/* Scattered sticky notes - enhanced */}
        {[
          { top: '45%', left: '12%', rotate: -15, color: '#fff3cd', text: 'Call client!' },
          { top: '52%', left: '28%', rotate: 8, color: '#d1ecf1', text: 'Meeting 3PM' },
          { top: '40%', left: '45%', rotate: -12, color: '#f8d7da', text: 'Report due!' },
          { top: '65%', left: '15%', rotate: 18, color: '#d4edda', text: 'Buy groceries' },
          { top: '58%', left: '60%', rotate: -8, color: '#e2e3e5', text: 'Doctor appointment' },
          { top: '35%', left: '70%', rotate: 25, color: '#fff3cd', text: 'Pay bills!!!' },
        ].map((note, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: note.top,
            left: note.left,
            width: '120px',
            height: '120px',
            backgroundColor: note.color,
            borderRadius: '8px',
            padding: '15px',
            transform: `rotate(${note.rotate + rotationShake}deg) scale(${0.9 + Math.sin((frame + i * 30) / 25) * 0.2})`,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.5)',
            fontSize: '13px',
            fontWeight: '600',
            color: '#2d3436',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.1)',
          }}>
            {note.text}
          </div>
        ))}

        {/* Animated stress indicators */}
        <div style={{
          position: 'absolute',
          top: '75%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '48px',
          animation: 'bounce 0.5s infinite alternate',
        }}>
          😵‍💫💻📱⏰
        </div>
      </div>

      {/* Problem statement - enhanced */}
      <div style={{
        position: 'absolute',
        bottom: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: 'white',
        fontSize: '42px',
        fontWeight: '800',
        textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(255,59,48,0.4)',
        letterSpacing: '2px',
        opacity: interpolate(frame, [fps * 2, fps * 4], [0, 1]),
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: `hue-rotate(${Math.sin(frame / 20) * 30}deg)`,
        }}>
            Too many tasks, complete chaos?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Logo reveal with powerful brand presentation --- //
const Scene2Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth entrance animation
  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { stiffness: 100, damping: 15 },
  });

  const logoOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const textAppear = interpolate(frame, [40, 70], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const glowIntensity = interpolate(frame, [0, fps * 2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      background: `
        radial-gradient(circle at center, #0f0f23 0%, #000 100%),
        linear-gradient(45deg, rgba(56, 189, 248, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)
      `,
    }}>
      {/* Dynamic background particles */}
      <AbsoluteFill>
        {Array.from({ length: 50 }, (_, i) => {
          const x = random(`particle-x-${i}`) * 100;
          const y = random(`particle-y-${i}`) * 100;
          const size = random(`particle-size-${i}`) * 4 + 1;
          const speed = random(`particle-speed-${i}`) * 0.5 + 0.1;
          const animatedY = (y + (frame * speed) % 100) % 100;
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${animatedY}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: `rgba(56, 189, 248, ${0.3 + Math.sin(frame / 30 + i) * 0.2})`,
                borderRadius: '50%',
                filter: 'blur(1px)',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Main logo container */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${logoScale})`,
        opacity: logoOpacity,
        textAlign: 'center',
      }}>
        {/* Logo circle with enhanced effects */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `
            linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #8b5cf6 100%),
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 40px',
          position: 'relative',
          filter: `drop-shadow(0 20px 60px rgba(56, 189, 248, ${0.6 * glowIntensity}))`,
          animation: frame > 60 ? 'pulse 2s infinite' : 'none',
        }}>
          {/* Logo icon */}
          <svg width="100" height="100" viewBox="0 0 24 24" fill="white">
            <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19Z" />
            <path d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9" />
          </svg>
          
          {/* Rotating border effect */}
          <div style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            background: `conic-gradient(from ${frame * 2}deg, transparent, #38bdf8, transparent)`,
            padding: '10px',
            opacity: glowIntensity * 0.8,
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#0f0f23',
            }} />
          </div>
        </div>

        {/* Brand name with enhanced typography */}
        <div style={{
          opacity: textAppear,
          transform: `translateY(${interpolate(textAppear, [0, 1], [30, 0])}px)`,
        }}>
          <h1 style={{
            fontSize: '64px',
            fontWeight: '900',
            margin: '0 0 20px 0',
            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(56, 189, 248, 0.3)',
            letterSpacing: '3px',
          }}>
                        AnixOps TodoList
          </h1>
          
          <p style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#94a3b8',
            margin: '0',
            letterSpacing: '1px',
            opacity: interpolate(frame, [80, 110], [0, 1]),
          }}>
                        Redefining Task Management
          </p>
          
          <div style={{
            marginTop: '30px',
            fontSize: '18px',
            color: '#64748b',
            fontWeight: '500',
            letterSpacing: '0.5px',
            opacity: interpolate(frame, [100, 130], [0, 1]),
          }}>
                        Every detail is crafted to make your work
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700',
            }}>
              more efficient and organized
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: Core features demonstration --- //
const Scene3Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Animation control
  const phoneScale = spring({
    frame: frame - 20,
    fps,
    config: { stiffness: 80, damping: 20 },
  });

  const interfaceOpacity = interpolate(frame, [40, 80], [0, 1]);
  const cursorAppear = interpolate(frame, [100, 130], [0, 1]);

  // Cursor movement animation
  const cursorX = interpolate(frame, [130, 200, 270, 340], [width * 0.3, width * 0.55, width * 0.45, width * 0.6], {
    easing: Easing.inOut(Easing.cubic),
  });
  const cursorY = interpolate(frame, [130, 200, 270, 340], [height * 0.35, height * 0.45, height * 0.6, height * 0.4], {
    easing: Easing.inOut(Easing.cubic),
  });

  // Task completion animation
  const tasksCompleted = Math.min(Math.floor((frame - 200) / 30), 3);

  return (
    <AbsoluteFill style={{
      background: `
        linear-gradient(135deg, #667eea 0%, #764ba2 100%),
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
      `,
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: 0.3,
      }} />

      {/* Phone mockup container */}
      <div style={{
        position: 'absolute',
        left: '15%',
        top: '50%',
        transform: `translateY(-50%) scale(${phoneScale})`,
        opacity: phoneScale,
      }}>
        {/* Phone frame */}
        <div style={{
          width: '340px',
          height: '640px',
          backgroundColor: '#1f2937',
          borderRadius: '45px',
          padding: '25px',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          position: 'relative',
        }}>
          {/* Screen */}
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '35px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* App interface */}
            <div style={{ opacity: interfaceOpacity }}>
              {/* Header */}
              <div style={{
                height: '80px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 25px',
                color: 'white',
              }}>
                <div style={{ fontSize: '22px', fontWeight: '700' }}>TodoList</div>
                <div style={{ fontSize: '16px', opacity: 0.9 }}>⚙️</div>
              </div>

              {/* Quick stats */}
              <div style={{
                padding: '25px',
                background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                }}>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#475569' }}>
                                    Today's Tasks
                  </span>
                  <span style={{
                    backgroundColor: '#22c55e',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                                    5 tasks
                  </span>
                </div>
                            {/* Task list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { text: 'Review project proposal', priority: 'high', completed: tasksCompleted > 0 },
                    { text: 'Call client about meeting', priority: 'medium', completed: tasksCompleted > 1 },
                    { text: 'Update documentation', priority: 'low', completed: tasksCompleted > 2 },
                    { text: 'Prepare presentation slides', priority: 'medium', completed: false },
                    { text: 'Send weekly report', priority: 'high', completed: false },
                  ].map((task, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: task.completed ? '#f0fdf4' : '#ffffff',
                      borderRadius: '12px',
                      border: `2px solid ${task.completed ? '#22c55e' : '#e2e8f0'}`,
                      transform: task.completed ? 'scale(0.98)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: task.completed ? '#22c55e' : '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                      }}>
                        {task.completed ? '✓' : ''}
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: task.completed ? '#166534' : '#475569',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        flex: 1,
                      }}>
                        {task.text}
                      </span>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: task.priority === 'high' ? '#ef4444' : 
                                       task.priority === 'medium' ? '#f59e0b' : '#22c55e',
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side feature highlights */}
      <div style={{
        position: 'absolute',
        right: '8%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '45%',
      }}>
        <h2 style={{
          fontSize: '48px',
          fontWeight: '900',
          color: 'white',
          marginBottom: '40px',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          opacity: interpolate(frame, [60, 100], [0, 1]),
        }}>
                Task Management
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
                Unlimited Possibilities
          </span>
        </h2>

        {/* Feature list */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          opacity: interpolate(frame, [80, 120], [0, 1]),
        }}>
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Instant sync across all devices' },
            { icon: '🎯', title: 'Smart Priorities', desc: 'AI-powered task organization' },
            { icon: '📊', title: 'Progress Tracking', desc: 'Detailed analytics and insights' },
            { icon: '🌐', title: 'Seamless Offline', desc: 'Work anywhere, anytime' },
          ].map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transform: `translateX(${interpolate(frame, [120 + i * 10, 150 + i * 10], [50, 0])}px)`,
            }}>
              <div style={{
                fontSize: '32px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
              }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'white',
                  margin: '0 0 5px 0',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action hint */}
        <div style={{
          marginTop: '40px',
          fontSize: '18px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: '500',
          opacity: interpolate(frame, [200, 240], [0, 1]),
        }}>
                Whether desktop, tablet, or mobile, TodoList seamlessly collaborates with you.
        </div>
      </div>

      {/* Interactive cursor */}
      {cursorAppear > 0 && (
        <div style={{
          position: 'absolute',
          left: cursorX,
          top: cursorY,
          opacity: cursorAppear,
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          <Cursor 
            isClicking={frame > 180 && frame < 220} 
            isTyping={frame > 250 && frame < 290}
            glowColor="rgba(34, 197, 94, 0.8)"
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// --- Scene 4: Multi-platform demonstration --- //
const Scene4MultiPlatform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const devicesScale = spring({
    frame: frame - 30,
    fps,
    config: { stiffness: 60, damping: 20 },
  });

  const syncAnimation = interpolate(frame, [100, 200], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{
      background: `
        linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%),
        radial-gradient(circle at 30% 70%, rgba(56, 189, 248, 0.2) 0%, transparent 50%)
      `,
    }}>
      {/* Background elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: interpolate(frame, [0, 40], [0, 1]),
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '900',
          color: 'white',
          margin: '0',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          Cross-Platform
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Perfect Sync
          </span>
        </h1>
      </div>

      {/* Devices showcase */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${devicesScale})`,
        display: 'flex',
        alignItems: 'center',
        gap: '60px',
        opacity: devicesScale,
      }}>
        {/* Desktop */}
        <div style={{
          transform: `translateY(${interpolate(frame, [60, 120], [-20, 0])}px)`,
        }}>
          <div style={{
            width: '280px',
            height: '180px',
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            padding: '8px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '30px',
                background: 'linear-gradient(135deg, #1e3a8a, #3730a3)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '12px',
                color: 'white',
                fontWeight: '600',
              }}>
                TodoList Desktop
              </div>
              <div style={{
                padding: '12px',
                fontSize: '10px',
                lineHeight: '1.4',
              }}>
                <div style={{ marginBottom: '8px', fontWeight: '600' }}>Project Tasks</div>
                {['Design mockups', 'Code review', 'Client meeting'].map((task, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                    opacity: syncAnimation > i * 0.3 ? 1 : 0.3,
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: syncAnimation > i * 0.3 ? '#22c55e' : '#e5e7eb',
                      borderRadius: '50%',
                    }} />
                    <span style={{ fontSize: '9px' }}>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{
            width: '300px',
            height: '20px',
            backgroundColor: '#374151',
            borderRadius: '0 0 20px 20px',
            margin: '0 auto',
          }} />
        </div>

        {/* Tablet */}
        <div style={{
          transform: `translateY(${interpolate(frame, [80, 140], [-15, 0])}px)`,
        }}>
          <div style={{
            width: '200px',
            height: '260px',
            backgroundColor: '#1f2937',
            borderRadius: '25px',
            padding: '15px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              borderRadius: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '40px',
                background: 'linear-gradient(135deg, #1e3a8a, #3730a3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: 'white',
                fontWeight: '600',
              }}>
                TodoList
              </div>
              <div style={{
                padding: '15px',
                fontSize: '11px',
              }}>
                <div style={{ marginBottom: '10px', fontWeight: '600' }}>Quick Actions</div>
                {['Add new task', 'Set reminder', 'Share project'].map((action, i) => (
                  <div key={i} style={{
                    padding: '8px',
                    backgroundColor: syncAnimation > (i + 1) * 0.25 ? '#f0f9ff' : '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    border: `1px solid ${syncAnimation > (i + 1) * 0.25 ? '#38bdf8' : '#e5e7eb'}`,
                    fontSize: '10px',
                  }}>
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div style={{
          transform: `translateY(${interpolate(frame, [100, 160], [-10, 0])}px)`,
        }}>
          <div style={{
            width: '140px',
            height: '260px',
            backgroundColor: '#1f2937',
            borderRadius: '30px',
            padding: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              borderRadius: '25px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '35px',
                background: 'linear-gradient(135deg, #1e3a8a, #3730a3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white',
                fontWeight: '600',
              }}>
                TodoList
              </div>
              <div style={{
                padding: '12px',
                fontSize: '9px',
              }}>
                <div style={{ marginBottom: '8px', fontWeight: '600' }}>On the Go</div>
                {['Voice note', 'Quick add', 'Location task'].map((feature, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                    padding: '6px',
                    backgroundColor: syncAnimation > (i + 2) * 0.2 ? '#ecfdf5' : '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '8px',
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: syncAnimation > (i + 2) * 0.2 ? '#10b981' : '#d1d5db',
                      borderRadius: '50%',
                    }} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync visualization */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        opacity: interpolate(frame, [160, 200], [0, 1]),
      }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#38bdf8',
            borderRadius: '50%',
            opacity: Math.sin((frame - i * 10) / 20) * 0.5 + 0.5,
            transform: `scale(${Math.sin((frame - i * 10) / 15) * 0.3 + 1})`,
          }} />
        ))}
      </div>

      {/* Bottom text */}
      <div style={{
        position: 'absolute',
        bottom: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: '600',
        opacity: interpolate(frame, [180, 220], [0, 1]),
      }}>
        Real-time sync • Instant updates • Seamless experience
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 5: Final call to action --- //
const Scene5CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoAppear = spring({
    frame: frame - 20,
    fps,
    config: { stiffness: 100, damping: 15 },
  });

  const textSlideUp = interpolate(frame, [40, 80], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const finalGlow = interpolate(frame, [100, fps * 6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Particle system for celebration
  const particles = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      x: random(`final-x-${i}`) * 100,
      y: random(`final-y-${i}`) * 100,
      size: random(`final-size-${i}`) * 6 + 2,
      speed: random(`final-speed-${i}`) * 2 + 0.5,
      color: ['#38bdf8', '#8b5cf6', '#22c55e', '#f59e0b'][Math.floor(random(`final-color-${i}`) * 4)],
    }));
  }, []);

  return (
    <AbsoluteFill style={{
      background: `
        radial-gradient(circle at center, #0c0c0c 0%, #000000 100%),
        linear-gradient(45deg, rgba(56, 189, 248, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)
      `,
    }}>
      {/* Animated particles */}
      <AbsoluteFill>
        {particles.map((particle, i) => {
          const animatedY = (particle.y + (frame * particle.speed * 0.5) % 100) % 100;
          const opacity = Math.sin((frame + i * 10) / 30) * 0.3 + 0.7;
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${animatedY}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                borderRadius: '50%',
                opacity: opacity * finalGlow,
                filter: 'blur(1px)',
                animation: frame > 120 ? 'pulse 3s infinite' : 'none',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Main content container */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${logoAppear})`,
        textAlign: 'center',
        opacity: logoAppear,
      }}>
        {/* Logo with enhanced effects */}
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `
            linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%),
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          position: 'relative',
          filter: `drop-shadow(0 0 ${30 + finalGlow * 40}px rgba(56, 189, 248, 0.8))`,
        }}>
          <svg width="70" height="70" viewBox="0 0 24 24" fill="white">
            <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19Z" />
            <path d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9" />
          </svg>

          {/* Rotating rings */}
          {[1, 2, 3].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              inset: `-${20 + i * 15}px`,
              borderRadius: '50%',
              border: `2px solid rgba(56, 189, 248, ${0.3 - i * 0.1})`,
              transform: `rotate(${frame * (1 + i * 0.5)}deg)`,
              opacity: finalGlow,
            }} />
          ))}
        </div>

        {/* Brand name and tagline */}
        <div style={{
          transform: `translateY(${textSlideUp}px)`,
          opacity: interpolate(frame, [40, 80], [0, 1]),
        }}>
          <h1 style={{
            fontSize: '52px',
            fontWeight: '900',
            margin: '0 0 15px 0',
            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
            filter: `drop-shadow(0 4px 20px rgba(56, 189, 248, ${0.3 * finalGlow}))`,
          }}>
            <span style={{
              display: 'inline-block',
              transform: `rotate(${Math.sin(frame / 60) * 2}deg)`,
            }}>TodoList</span> · 
          </h1>
          
          <p style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 40px 0',
            letterSpacing: '1px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            opacity: interpolate(frame, [60, 100], [0, 1]),
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>AnixOps Studio</span> — Building Smart Workflows with You ✅✨
          </p>

          {/* Call to action buttons */}
          <div style={{
            display: 'flex',
            gap: '25px',
            justifyContent: 'center',
            opacity: interpolate(frame, [100, 140], [0, 1]),
            transform: `translateY(${interpolate(frame, [100, 140], [30, 0])}px)`,
          }}>
            <button style={{
              padding: '18px 35px',
              fontSize: '20px',
              fontWeight: '700',
              backgroundColor: '#38bdf8',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              boxShadow: `0 10px 30px rgba(56, 189, 248, ${0.4 * finalGlow})`,
              transform: `scale(${1 + Math.sin(frame / 30) * 0.05})`,
              transition: 'all 0.3s ease',
            }}>
              Get Started Free
            </button>
            
            <button style={{
              padding: '18px 35px',
              fontSize: '20px',
              fontWeight: '700',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '15px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}>
              Learn More
            </button>
          </div>

          {/* Final tagline */}
          <div style={{
            marginTop: '50px',
            fontSize: '18px',
            color: '#94a3b8',
            fontWeight: '500',
            letterSpacing: '0.5px',
            opacity: interpolate(frame, [160, 200], [0, 1]),
          }}>
            Transform your productivity • One task at a time
          </div>
        </div>
      </div>

      {/* Subtle background animation */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `conic-gradient(from ${frame}deg, transparent, rgba(56, 189, 248, 0.1), transparent)`,
        opacity: finalGlow * 0.3,
      }} />
    </AbsoluteFill>
  );
};

// --- Main composition export --- //
export const TodoListPromoEn: React.FC = () => {
  const { fps } = useVideoConfig();
  
  // Scene timing (in frames)
  const sceneDurations = {
    problem: fps * 6,        // 6 seconds - problem presentation
    logo: fps * 5,           // 5 seconds - logo reveal  
    features: fps * 12,      // 12 seconds - features demo
    multiPlatform: fps * 8,  // 8 seconds - multi-platform
    callToAction: fps * 9,   // 9 seconds - final CTA
  };

  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {/* Scene 1: Problem presentation */}
      <Sequence from={currentFrame} durationInFrames={sceneDurations.problem}>
        <Scene1Problem />
      </Sequence>
      
      {/* Scene 2: Logo reveal */}
      <Sequence from={currentFrame += sceneDurations.problem} durationInFrames={sceneDurations.logo}>
        <Scene2Logo />
      </Sequence>
      
      {/* Scene 3: Features demonstration */}
      <Sequence from={currentFrame += sceneDurations.logo} durationInFrames={sceneDurations.features}>
        <Scene3Features />
      </Sequence>
      
      {/* Scene 4: Multi-platform showcase */}
      <Sequence from={currentFrame += sceneDurations.features} durationInFrames={sceneDurations.multiPlatform}>
        <Scene4MultiPlatform />
      </Sequence>
      
      {/* Scene 5: Call to action */}
      <Sequence from={currentFrame += sceneDurations.multiPlatform} durationInFrames={sceneDurations.callToAction}>
        <Scene5CallToAction />
      </Sequence>
    </AbsoluteFill>
  );
};