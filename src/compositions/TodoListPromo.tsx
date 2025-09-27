import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  interpolateColors,
  spring,
  Easing,
  random,
} from 'remotion';

// --- 增强光标组件，支持不同状态和动画效果 --- //
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
            {/* 光环效果 */}
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

// --- 场景1：痛点呈现（增强版） --- //
const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 多层次闪烁效果
  const flashOpacity = interpolate(frame, [0, 15, 30, 45, 60], [1, 0.3, 1, 0.5, 1], {
    extrapolateRight: 'clamp',
  });

  const chaosScale = spring({
    frame,
    fps,
    config: { stiffness: 50, damping: 10 },
  });

  // 增强的震动效果
  const shakeIntensity = Math.min(frame / (fps * 1.2), 1);
  const shakeX = Math.sin(frame / 3) * 20 * shakeIntensity + Math.cos(frame / 7) * 8;
  const shakeY = Math.cos(frame / 5) * 15 * shakeIntensity + Math.sin(frame / 9) * 6;
  const rotationShake = Math.sin(frame / 8) * 2 * shakeIntensity;
  
  // 动态颜色变化
  const hueRotate = interpolate(frame, [0, fps * 6], [0, 60]);
  const gradientShift = interpolate(frame, [0, fps * 6], [0, 100]);
  const saturationBoost = 100 + Math.sin(frame / 15) * 30;

  // 更复杂的日历生成
  const calendarColors = useMemo(() => {
    const colors = ['#ff6b6b', '#ff8e53', '#ff6b9d', '#c44569', '#f5f5f5', '#e8e8e8'];
    return Array.from({ length: 21 }, (_, i) => {
      const stress = random(`calendar-${i}`) > 0.6;
      return stress ? colors[Math.floor(random(`color-${i}`) * 4)] : colors[4 + Math.floor(random(`neutral-${i}`) * 2)];
    });
  }, []);

  // 动态故障效果
  const glitchOffset = Math.sin(frame / 6) * 3;
  const glitchIntensity = interpolate(frame, [fps * 1, fps * 2], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #ff6b6b, #ffa500, #ff4757)`,
        backgroundSize: '180% 180%',
        backgroundPosition: `${gradientShift}% ${gradientShift}%`,
        opacity: flashOpacity,
        transform: `scale(${interpolate(chaosScale, [0, 1], [1.1, 1])}) translate(${shakeX}px, ${shakeY}px) rotate(${rotationShake}deg)`,
        filter: `hue-rotate(${hueRotate}deg) saturate(${saturationBoost}%) contrast(1.1)`,
      }}
    >
      {/* 增强粒子效果 */}
      <ParticleField count={35} color="rgba(255, 255, 255, 0.8)" opacity={0.4} blur={20} speed={0.025} amplitude={22} />
      <ParticleField count={20} color="rgba(255, 107, 107, 0.6)" opacity={0.3} blur={35} speed={0.015} amplitude={15} />
      
      {/* 故障效果层 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)`,
        opacity: glitchIntensity * 0.3,
        transform: `translateX(${glitchOffset}px)`,
        mixBlendMode: 'overlay'
      }} />

      {/* 便签纸 - 增强动画 */}
      <div style={{ 
        position: 'absolute', 
        top: '15%', 
        left: '10%', 
        transform: `rotate(${-15 + Math.sin(frame / 20) * 5}deg) scale(${1 + Math.sin(frame / 15) * 0.05})` 
      }}>
        <div style={{ 
          fontSize: 64, 
          backgroundColor: '#ffeb3b', 
          padding: '25px', 
          boxShadow: `5px 5px 20px rgba(0,0,0,0.3), 0 0 ${15 + Math.sin(frame / 12) * 10}px rgba(255, 235, 59, 0.5)`,
          border: '2px solid rgba(255, 193, 7, 0.8)',
          borderRadius: '8px',
          fontWeight: 'bold',
          color: '#d84315'
        }}>
          买菜 🛒<br/>开会 💼<br/>...
        </div>
      </div>

      {/* 通知栏 - 增强效果 */}
      <div style={{ 
        position: 'absolute', 
        top: '40%', 
        right: '10%', 
        transform: `rotate(${10 + Math.cos(frame / 18) * 3}deg) scale(${1 + Math.cos(frame / 12) * 0.04})` 
      }}>
        <div style={{ 
          fontSize: 56, 
          backgroundColor: '#2c3e50', 
          color: '#ecf0f1', 
          padding: '25px', 
          border: '3px solid #34495e',
          borderRadius: '12px',
          boxShadow: `8px 8px 25px rgba(0,0,0,0.4), 0 0 ${20 + Math.cos(frame / 10) * 15}px rgba(231, 76, 60, 0.4)`,
          fontWeight: 'bold'
        }}>
          📧 99+ 未读<br/>📋 15个待办<br/>⏰ 5个逾期
        </div>
      </div>

      {/* 日历 - 动态颜色 */}
      <div style={{ 
        position: 'absolute', 
        bottom: '10%', 
        left: '20%', 
        width: '450px', 
        transform: `rotate(${5 + Math.sin(frame / 25) * 2}deg) scale(${1 + Math.sin(frame / 20) * 0.03})` 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '3px', 
          backgroundColor: '#fff', 
          padding: '8px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '2px solid #e0e0e0'
        }}>
          {calendarColors.map((color, i) => (
            <div key={i} style={{ 
              backgroundColor: color, 
              height: '60px',
              borderRadius: '4px',
              transform: color !== '#f5f5f5' && color !== '#e8e8e8' ? `scale(${1 + Math.sin((frame + i * 10) / 8) * 0.1})` : 'scale(1)',
              transition: 'transform 0.3s ease',
              boxShadow: color !== '#f5f5f5' && color !== '#e8e8e8' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }} />
          ))}
        </div>
      </div>

      <Sequence from={fps * 2.5}>
        <AbsoluteFill style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            fontSize: '240px',
            transform: `scale(${spring({ frame: frame - fps * 2.5, fps })})`,
          }}>
            😵‍💫
          </div>
          <div style={{
            color: '#ffffff',
            fontSize: '56px',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            marginTop: '25px',
            opacity: interpolate(frame, [fps * 3, fps * 3.5], [0, 1]),
          }}>
            任务繁多，杂乱无章？
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// --- 场景2：解决方案介绍（增强版） --- //
const Scene2Solution: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoScale = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 120 },
    });

    const textOpacity = (delay: number) => interpolate(
        frame,
        [delay, delay + fps / 2],
        [0, 1],
        { extrapolateRight: 'clamp' }
    );

    // 增强的动画效果
    const waveMotion = Math.sin(frame / 25) * 25 + Math.cos(frame / 35) * 8;
    const neonPulse = 0.8 + Math.sin(frame / 12) * 0.4;
    const accentRotation = interpolate(frame, [0, fps * 7], [0, 150]);
    const logoRotation = Math.sin(frame / 40) * 5;
    
    // 多层次光效
    const primaryGlow = 40 + neonPulse * 50;
    const secondaryGlow = 20 + Math.sin(frame / 18) * 20;
    const backgroundShimmer = Math.sin(frame / 30) * 0.3;

    // 文字动画增强
    const titleScale = 1 + Math.sin(frame / 20) * 0.02;
    const subtitleWave = Math.sin(frame / 15) * 2;

    return (
        <AbsoluteFill style={{
            background: `
                radial-gradient(circle at 20% 20%, rgba(255,255,255,${0.25 + backgroundShimmer}), transparent 50%), 
                radial-gradient(circle at 80% 80%, rgba(139, 69, 255, 0.3), transparent 60%),
                linear-gradient(135deg, #4c6ef5, #845ef7, #7c3aed)
            `,
            filter: `hue-rotate(${accentRotation}deg) brightness(1.1)`,
        }}>
            {/* 多层粒子系统 */}
            <ParticleField count={40} color="rgba(255,255,255,0.5)" opacity={0.35} speed={0.02} amplitude={25} blur={25} />
            <ParticleField count={25} color="rgba(139, 69, 255, 0.6)" opacity={0.25} speed={0.015} amplitude={18} blur={35} />
            <ParticleField count={15} color="rgba(76, 110, 245, 0.7)" opacity={0.2} speed={0.012} amplitude={30} blur={40} />
            
            {/* 背景光束效果 */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `conic-gradient(from ${frame * 2}deg at 50% 50%, transparent, rgba(255,255,255,0.1), transparent)`,
                opacity: 0.4,
                mixBlendMode: 'overlay'
            }} />

            <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '35px' }}>
                {/* 增强Logo设计 */}
                <div style={{
                    position: 'relative',
                    width: '260px',
                    height: '260px',
                    borderRadius: '35px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '150px',
                    boxShadow: `
                        0 25px 60px rgba(0,0,0,0.4), 
                        0 0 ${primaryGlow}px rgba(255, 255, 255, ${0.3 + neonPulse * 0.3}),
                        0 0 ${secondaryGlow}px rgba(76, 110, 245, 0.4),
                        inset 0 1px 0 rgba(255,255,255,0.8)
                    `,
                    transform: `scale(${logoScale * (1 + neonPulse * 0.05)}) translateY(${waveMotion}px) rotate(${logoRotation}deg)`,
                    border: '3px solid rgba(255,255,255,0.2)',
                    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                }}>
                    <div style={{
                        filter: `drop-shadow(0 4px 8px rgba(76, 110, 245, 0.3))`,
                        transform: `scale(${1 + Math.sin(frame / 15) * 0.03})`
                    }}>
                        ✅
                    </div>
                    
                    {/* Logo周围的光环 */}
                    <div style={{
                        position: 'absolute',
                        inset: '-20px',
                        borderRadius: '50px',
                        background: `conic-gradient(from ${frame * 3}deg, transparent, rgba(76, 110, 245, 0.2), transparent, rgba(132, 94, 247, 0.2), transparent)`,
                        opacity: neonPulse * 0.6,
                        zIndex: -1,
                    }} />
                </div>

                {/* 苹果风格开场标题 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    {/* 苹果式前导词 */}
                    <div style={{
                        color: '#ffffff',
                        fontSize: '48px',
                        fontWeight: '300',
                        textAlign: 'center',
                        opacity: textOpacity(fps * 0.3),
                        transform: `translateY(${interpolate(frame, [fps * 0.3, fps * 0.8], [30, 0], { easing: Easing.out(Easing.cubic) })}px)`,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                    }}>
                        今天，我们很高兴向大家介绍
                    </div>
                    
                    {/* 主标题 - 苹果风格 */}
                    <div style={{
                        color: '#ffffff',
                        fontSize: '96px',
                        fontWeight: '700',
                        textAlign: 'center',
                        opacity: textOpacity(fps * 0.5),
                        transform: `translateY(${interpolate(frame, [fps * 0.5, fps * 1.5], [50, 0], { easing: Easing.out(Easing.cubic) })}px) scale(${titleScale})`,
                        textShadow: `
                            0 4px 8px rgba(0,0,0,0.5),
                            0 0 ${30 + neonPulse * 20}px rgba(255,255,255,0.6),
                            0 0 ${80 + neonPulse * 40}px rgba(76, 110, 245, 0.5)
                        `,
                        background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 50%, #ffffff 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        letterSpacing: '-0.02em',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                    }}>
                        AnixOps TodoList
                    </div>
                    
                    {/* 苹果式产品定位 */}
                    <div style={{
                        color: '#e8f4fd',
                        fontSize: '42px',
                        fontWeight: '400',
                        textAlign: 'center',
                        opacity: textOpacity(fps * 0.8),
                        transform: `translateY(${interpolate(frame, [fps * 0.8, fps * 1.3], [30, 0], { easing: Easing.out(Easing.cubic) })}px)`,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '0.01em',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                    }}>
                        重新定义任务管理
                    </div>
                </div>

                {/* 苹果风格产品描述 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px',
                    opacity: textOpacity(fps * 1),
                    transform: `translateY(${subtitleWave}px)`
                }}>
                    <div style={{
                        color: '#e8f4fd',
                        fontSize: '38px',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        fontWeight: '300',
                        letterSpacing: '0.02em',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                        lineHeight: '1.3'
                    }}>
                        每一个细节，都为了让您的工作
                    </div>
                    <div style={{
                        color: '#fbbf24',
                        fontSize: '44px',
                        textAlign: 'center',
                        textShadow: `0 0 ${20 + neonPulse * 10}px rgba(251, 191, 36, 0.8)`,
                        fontWeight: '600',
                        letterSpacing: '-0.01em',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                    }}>
                        更加专注、高效、优雅
                    </div>
                </div>

                {/* 苹果风格产品亮点 */}
                <Sequence from={fps * 1.5}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '25px',
                        opacity: textOpacity(fps * 1.5),
                        transform: `translateY(${interpolate(frame, [fps * 1.5, fps * 2.5], [30, 0], { easing: Easing.out(Easing.cubic) })}px)`
                    }}>
                        {/* 核心特性展示 */}
                        <div style={{
                            display: 'flex',
                            gap: '30px',
                            marginTop: '20px'
                        }}>
                            {[
                                { icon: '⚡', title: '闪电般快速', desc: '毫秒级响应' },
                                { icon: '🎯', title: '专注驱动', desc: '零干扰设计' },
                                { icon: '✨', title: '优雅体验', desc: '每个像素都完美' }
                            ].map((feature, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '20px 25px',
                                    background: 'rgba(255,255,255,0.12)',
                                    borderRadius: '20px',
                                    color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: `
                                        0 12px 30px rgba(0,0,0,0.3), 
                                        0 0 ${20 + Math.sin((frame + i * 25) / 15) * 15}px rgba(255,255,255,0.4),
                                        inset 0 1px 0 rgba(255,255,255,0.3)
                                    `,
                                    transform: `translateY(${Math.sin((frame + i * 30) / 20) * 4}px) scale(${1 + Math.sin((frame + i * 20) / 18) * 0.03})`,
                                    width: '200px'
                                }}>
                                    <div style={{
                                        fontSize: '40px',
                                        marginBottom: '8px',
                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                    }}>{feature.icon}</div>
                                    <div style={{
                                        fontSize: '22px',
                                        fontWeight: '600',
                                        marginBottom: '4px',
                                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                                        textAlign: 'center'
                                    }}>{feature.title}</div>
                                    <div style={{
                                        fontSize: '16px',
                                        opacity: 0.8,
                                        fontWeight: '400',
                                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                                        textAlign: 'center'
                                    }}>{feature.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Sequence>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};


// --- 场景3：核心功能演示 (已修复) --- //
const Scene3Features: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const toFrame = (seconds: number) => seconds * fps;

    const themeProgress = spring({ frame: frame - toFrame(3.6), fps, config: { stiffness: 40 } });

    // 使用 interpolateColors 修复颜色动画
    const bgColor = interpolateColors(themeProgress, [0, 1], ['#0f172a', '#f8f9fb']);
    const componentBgColor = interpolateColors(themeProgress, [0, 1], ['#1e293b', '#ffffff']);
    const textColor = interpolateColors(themeProgress, [0, 1], ['#f8fafc', '#1f2937']);
    const mutedTextColor = interpolateColors(themeProgress, [0, 1], ['#94a3b8', '#6b7280']);
    const borderColor = interpolateColors(themeProgress, [0, 1], ['#334155', '#d1d5db']);
    const taskBorderColor = interpolateColors(themeProgress, [0, 1], ['#475569', '#cbd5f5']);

    const cursorTimeline = [
        { time: 0.4, x: 860, y: 780 },
        { time: 1.1, x: 260, y: 160 },
        { time: 2.2, x: 520, y: 320 },
        { time: 3.2, x: 820, y: 640 },
        { time: 4.5, x: 520, y: 520 },
        { time: 5.6, x: 540, y: 300 },
        { time: 6.8, x: 540, y: 430 },
        { time: 8.2, x: 540, y: 430 },
        { time: 9.6, x: 830, y: 120 },
        { time: 10.8, x: 900, y: 80 }
    ];

    const cursorTimes = cursorTimeline.map((step) => toFrame(step.time));
    const cursorX = interpolate(
        frame,
        cursorTimes,
        cursorTimeline.map((step) => step.x),
        { easing: Easing.inOut(Easing.ease), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const cursorY = interpolate(
        frame,
        cursorTimes,
        cursorTimeline.map((step) => step.y),
        { easing: Easing.inOut(Easing.ease), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const modalOpacity = interpolate(
        frame,
        [toFrame(1.0), toFrame(1.3), toFrame(2.1), toFrame(2.4)],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const eventCreated = frame >= toFrame(2.5);
    const task1Added = frame >= toFrame(4.4);
    const task2Added = frame >= toFrame(6.4);
    const task2Completed = frame >= toFrame(8.9);

    const accentGlow = Math.max(0, Math.sin((frame - toFrame(4.2)) / 18)) * 0.55;
    const panelLift = Math.sin(frame / 18) * 5;

    return (
        <AbsoluteFill style={{ backgroundColor: bgColor, color: textColor, transition: 'background-color 0.5s, color 0.5s', overflow: 'hidden' }}>
            <ParticleField count={30} color="rgba(94, 234, 212, 0.35)" opacity={0.25} speed={0.012} amplitude={14} />
            {/* 顶部导航栏 */}
            <header style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '70px',
                backgroundColor: componentBgColor,
                display: 'flex', alignItems: 'center',
                padding: '0 30px',
                borderBottom: `1px solid ${borderColor}`,
                boxShadow: '0 20px 35px rgba(15, 23, 42, 0.25)',
                backdropFilter: 'blur(6px)'
            }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>📋 Todo List</div>
                <div style={{ marginLeft: '15px', padding: '5px 12px', background: 'linear-gradient(135deg, #38bdf8, #6366f1)', color: '#fff', borderRadius: '999px', fontSize: '13px', boxShadow: '0 0 15px rgba(99,102,241,0.45)' }}>Offline Mode</div>
                <div style={{ flexGrow: 1 }} />
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button style={{ background: 'none', border: '1px solid #888', color: 'inherit', padding: '8px 12px', borderRadius: '8px' }}>🌐 English</button>
                    <button style={{ background: 'none', border: '1px solid #888', color: 'inherit', padding: '8px', borderRadius: '8px' }}>
                        {frame > toFrame(6.8) ? '☀️' : '🌙'}
                    </button>
                    <button style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px' }}>Export Data</button>
                    <button style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px' }}>Import Data</button>
                    <button style={{ backgroundColor: '#0dcaf0', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px' }}>Login</button>
                </div>
            </header>

            {/* 主体内容区 */}
            <main style={{ display: 'flex', paddingTop: '70px', height: '100%', backdropFilter: 'blur(4px)' }}>
                {/* 左侧事件列表 */}
                <div style={{
                    width: '30%', borderRight: `1px solid ${borderColor}`,
                    padding: '20px',
                    transform: `translateY(${panelLift}px)`,
                    transition: 'transform 0.4s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '28px' }}>My Events</h2>
                        <button style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '16px' }}>+ Create Event</button>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        {eventCreated ? (
                             <div style={{ padding: '18px', background: 'linear-gradient(145deg, rgba(59,130,246,0.15), transparent)', borderRadius: '12px', border: `1px solid ${borderColor}`, boxShadow: '0 15px 30px rgba(96, 165, 250, 0.25)' }}>Project Phoenix</div>
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: '100px', color: mutedTextColor }}>
                                <div style={{ fontSize: '80px' }}>📄</div>
                                <h3>No events yet</h3>
                                <p>Create your first event to start managing tasks!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧任务列表 */}
                <div style={{ width: '70%', padding: '20px', position: 'relative', transform: `translateY(${panelLift * -1}px)`, transition: 'transform 0.4s ease' }}>
                    {!eventCreated ? (
                        <div style={{ textAlign: 'center', marginTop: '100px', color: mutedTextColor }}>
                            <div style={{ fontSize: '80px' }}>📋</div>
                            <h3>Select an Event</h3>
                            <p>Click on an event on the left to view and manage tasks</p>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ fontSize: '36px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                Project Phoenix
                                <span style={{ fontSize: '16px', color: '#38bdf8', letterSpacing: '0.3em', textTransform: 'uppercase' }}>LIVE</span>
                            </h2>
                            <div style={{ marginTop: '20px', fontSize: '18px' }}>
                                {task1Added && <div style={{padding: '14px', border: `1px solid ${taskBorderColor}`, borderRadius: '12px', marginBottom: '12px', boxShadow: accentGlow > 0.1 ? `0 0 ${25 + accentGlow * 35}px rgba(56, 189, 248, 0.35)` : undefined, background: 'rgba(15, 23, 42, 0.05)' }}>
                                    ⚪️ Design new logo
                                </div>}
                                {task2Added && <div style={{padding: '14px', border: `1px solid ${taskBorderColor}`, borderRadius: '12px', marginBottom: '12px',
                                    textDecoration: task2Completed ? 'line-through' : 'none', color: task2Completed ? mutedTextColor : textColor,
                                    boxShadow: task2Completed ? `0 0 ${20 + accentGlow * 30}px rgba(74, 222, 128, 0.3)` : `0 0 ${18 + accentGlow * 24}px rgba(129, 140, 248, 0.25)`,
                                    background: task2Completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99,102,241,0.08)'}}>
                                    {task2Completed ? '✅' : '⚪️'} Develop homepage
                                </div>}
                            </div>
                            <input type="text" placeholder="Enter a new task..." readOnly style={{
                                position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                                backgroundColor: componentBgColor, color: textColor,
                                border: `1px solid ${taskBorderColor}`,
                                padding: '16px', borderRadius: '12px', fontSize: '16px',
                                boxShadow: `0 0 ${18 + accentGlow * 22}px rgba(129, 140, 248, 0.25)`
                            }}/>
                        </div>
                    )}
                </div>
            </main>

            {/* 创建事件 Modal */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: modalOpacity
            }}>
                <div style={{ backgroundColor: componentBgColor, padding: '30px', borderRadius: '12px', width: '400px' }}>
                    <h3 style={{ fontSize: '24px', marginTop: 0 }}>Create New Event</h3>
                    <input type="text" value="Project Phoenix" readOnly style={{ width: '100%', padding: '10px', fontSize: '16px', marginTop: '10px' }} />
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '16px', marginRight: '10px' }}>Cancel</button>
                        <button style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '16px' }}>Create</button>
                    </div>
                </div>
            </div>

            {/* 增强模拟光标 */}
            <div style={{ 
                position: 'absolute', 
                left: cursorX, 
                top: cursorY, 
                transform: 'translate(-5px, -5px)', 
                opacity: interpolate(frame, [0, fps], [0, 1]),
                zIndex: 1000
            }}>
                <Cursor 
                    isClicking={frame >= toFrame(1.0) && frame <= toFrame(1.2) || frame >= toFrame(2.3) && frame <= toFrame(2.5) || frame >= toFrame(4.2) && frame <= toFrame(4.6) || frame >= toFrame(6.2) && frame <= toFrame(6.6) || frame >= toFrame(8.8) && frame <= toFrame(9.2)}
                    isTyping={frame >= toFrame(4.8) && frame <= toFrame(6.0) || frame >= toFrame(6.8) && frame <= toFrame(8.0)}
                    glowColor={frame > toFrame(6.8) ? 'rgba(251, 191, 36, 0.8)' : 'rgba(56, 189, 248, 0.8)'}
                    size={45}
                />
            </div>
            
            {/* 点击波纹效果 */}
            {[
                { time: toFrame(1.1), x: 260, y: 160 },
                { time: toFrame(2.4), x: 860, y: 780 },
                { time: toFrame(4.4), x: 520, y: 320 },
                { time: toFrame(6.4), x: 820, y: 640 },
                { time: toFrame(9.0), x: 540, y: 430 }
            ].map((click, i) => (
                frame >= click.time && frame <= click.time + 30 && (
                    <div key={i} style={{
                        position: 'absolute',
                        left: click.x,
                        top: click.y,
                        transform: 'translate(-50%, -50%)',
                        width: interpolate(frame, [click.time, click.time + 30], [0, 80]),
                        height: interpolate(frame, [click.time, click.time + 30], [0, 80]),
                        borderRadius: '50%',
                        border: `2px solid rgba(56, 189, 248, ${interpolate(frame, [click.time, click.time + 30], [0.8, 0])})`,
                        pointerEvents: 'none',
                        zIndex: 999
                    }} />
                )
            ))}
        </AbsoluteFill>
    );
};

// --- 苹果风格产品特写演示场景 --- //
const AppleStyleProductDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    // 苹果风格动画参数
    const elegantScale = spring({
        frame: frame - 30,
        fps,
        config: { damping: 20, stiffness: 60, mass: 1.5 }
    });
    
    const floatingMotion = Math.sin(frame / 40) * 8;
    const breathingGlow = 0.7 + Math.sin(frame / 25) * 0.3;
    const rotationAngle = interpolate(frame, [0, fps * 8], [0, 360], { 
        easing: Easing.bezier(0.4, 0, 0.2, 1) 
    });

    return (
        <AbsoluteFill style={{
            background: `
                radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), transparent 70%),
                radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.2), transparent 60%),
                linear-gradient(135deg, #f8fafc, #e2e8f0, #cbd5e1)
            `,
        }}>
            {/* 苹果风格背景光效 */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `conic-gradient(from ${rotationAngle}deg at 50% 50%, transparent, rgba(255,255,255,0.1), transparent, rgba(99,102,241,0.08), transparent)`,
                opacity: breathingGlow * 0.6
            }} />
            
            {/* 主要内容区域 */}
            <AbsoluteFill style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '40px'
            }}>
                {/* 苹果风格主标题 */}
                <div style={{
                    textAlign: 'center',
                    opacity: interpolate(frame, [0, 60], [0, 1], { easing: Easing.out(Easing.cubic) }),
                    transform: `translateY(${interpolate(frame, [0, 60], [30, 0], { easing: Easing.out(Easing.cubic) })}px)`
                }}>
                    <div style={{
                        fontSize: '72px',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '20px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                        letterSpacing: '-0.02em'
                    }}>
                        重新想象
                    </div>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: '300',
                        color: '#475569',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                        letterSpacing: '0.02em'
                    }}>
                        任务管理的无限可能
                    </div>
                </div>

                {/* 苹果风格产品展示 */}
                <div style={{
                    position: 'relative',
                    transform: `scale(${elegantScale}) translateY(${floatingMotion}px)`,
                    opacity: interpolate(frame, [60, 120], [0, 1], { easing: Easing.out(Easing.cubic) })
                }}>
                    {/* 主产品界面 */}
                    <div style={{
                        width: '600px',
                        height: '400px',
                        background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                        borderRadius: '24px',
                        padding: '40px',
                        boxShadow: `
                            0 40px 80px rgba(15, 23, 42, 0.25),
                            0 0 ${60 + breathingGlow * 40}px rgba(255, 255, 255, 0.8),
                            inset 0 1px 0 rgba(255, 255, 255, 0.9)
                        `,
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        position: 'relative'
                    }}>
                        {/* 界面内容 */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'space-between'
                        }}>
                            {/* 顶部标题栏 */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '30px'
                            }}>
                                <div style={{
                                    fontSize: '32px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                                }}>
                                    今日任务
                                </div>
                                <div style={{
                                    fontSize: '18px',
                                    color: '#64748b',
                                    padding: '8px 16px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '20px',
                                    fontWeight: '500'
                                }}>
                                    5 项待办
                                </div>
                            </div>

                            {/* 任务列表 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                                {[
                                    { text: '完成产品演示视频', status: 'completed', delay: 120 },
                                    { text: '优化用户界面设计', status: 'active', delay: 150 },
                                    { text: '准备发布会材料', status: 'pending', delay: 180 }
                                ].map((task, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px 20px',
                                        background: task.status === 'completed' ? 
                                            'rgba(34, 197, 94, 0.1)' : 
                                            task.status === 'active' ? 
                                            'rgba(99, 102, 241, 0.1)' : 
                                            'rgba(148, 163, 184, 0.1)',
                                        borderRadius: '16px',
                                        border: `1px solid ${
                                            task.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' : 
                                            task.status === 'active' ? 'rgba(99, 102, 241, 0.2)' : 
                                            'rgba(148, 163, 184, 0.2)'
                                        }`,
                                        opacity: interpolate(frame, [task.delay, task.delay + 30], [0, 1]),
                                        transform: `translateX(${interpolate(frame, [task.delay, task.delay + 30], [-20, 0])}px)`,
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                    }}>
                                        <div style={{
                                            fontSize: '24px',
                                            marginRight: '16px',
                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                        }}>
                                            {task.status === 'completed' ? '✅' : 
                                             task.status === 'active' ? '🔄' : '⭕'}
                                        </div>
                                        <div style={{
                                            fontSize: '18px',
                                            color: '#334155',
                                            fontWeight: '500',
                                            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                            opacity: task.status === 'completed' ? 0.7 : 1
                                        }}>
                                            {task.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 产品光环效果 */}
                        {[...Array(2)].map((_, i) => (
                            <div key={i} style={{
                                position: 'absolute',
                                inset: `-${30 + i * 20}px`,
                                borderRadius: `${30 + i * 8}px`,
                                background: `conic-gradient(from ${frame * (1 + i * 0.5)}deg, transparent, rgba(99, 102, 241, ${0.1 + breathingGlow * 0.08}), transparent)`,
                                opacity: breathingGlow * (0.8 - i * 0.3),
                                zIndex: -1 - i,
                            }} />
                        ))}
                    </div>
                </div>

                {/* 底部特性描述 */}
                <div style={{
                    textAlign: 'center',
                    opacity: interpolate(frame, [180, 240], [0, 1]),
                    transform: `translateY(${interpolate(frame, [180, 240], [20, 0])}px)`
                }}>
                    <div style={{
                        fontSize: '28px',
                        color: '#475569',
                        fontWeight: '400',
                        lineHeight: '1.4',
                        maxWidth: '600px',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                    }}>
                        每一个细节都经过精心雕琢，<br />
                        只为给您带来 <span style={{ 
                            color: '#6366f1', 
                            fontWeight: '600',
                            textShadow: `0 0 ${15 + breathingGlow * 10}px rgba(99, 102, 241, 0.4)`
                        }}>无与伦比</span> 的使用体验
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};


// --- 场景4：苹果风格跨平台演示 --- //
const Scene4CrossPlatform: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 苹果风格的优雅动画
    const deviceAnimation = (delay: number) => spring({
        frame: frame - delay,
        fps,
        config: { stiffness: 80, damping: 18, mass: 1.2 },
    });
    
    // 苹果风格的文字动画
    const textReveal = (delay: number) => interpolate(
        frame - delay, 
        [0, 30], 
        [0, 1], 
        { easing: Easing.bezier(0.4, 0, 0.2, 1) }
    );
    
    // 产品光环效果
    const haloIntensity = 0.6 + Math.sin(frame / 20) * 0.4;

    const getDeviceStyle = (delay: number, rotation: number, glowColor: string, scale: number): React.CSSProperties => {
        const progress = deviceAnimation(delay);
        const float = interpolate(progress, [0, 1], [30, -30]);
        const tilt = Math.sin((frame + delay) / 30) * rotation;
        const pulse = 0.4 + Math.sin((frame + delay) / 18) * 0.3;

        return {
            position: 'absolute',
            background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.35), rgba(59, 130, 246, 0.6))',
            border: '4px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${float}px) rotate(${tilt}deg) scale(${scale})`,
            boxShadow: `0 35px 55px rgba(3, 7, 18, 0.4), 0 0 ${65 + pulse * 60}px ${glowColor}`,
            backdropFilter: 'blur(6px)',
        };
    };

    const hueShift = interpolate(frame, [0, fps * 7], [0, 90]);

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #0ea5e9, #312e81)',
            filter: `hue-rotate(${hueShift}deg)`
        }}>
            {/* 苹果风格标题区域 */}
            <div style={{
                position: 'absolute',
                top: '8%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                zIndex: 100
            }}>
                <div style={{
                    color: '#ffffff',
                    fontSize: '56px',
                    fontWeight: '300',
                    marginBottom: '10px',
                    opacity: textReveal(0),
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '0.05em',
                    fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                }}>
                    为每一个重要时刻而设计
                </div>
                <div style={{
                    color: '#e8f4fd',
                    fontSize: '38px',
                    fontWeight: '600',
                    opacity: textReveal(30),
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '-0.01em',
                    fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                }}>
                    <span style={{ color: '#fbbf24' }}>无缝</span> · <span style={{ color: '#22d3ee' }}>同步</span> · <span style={{ color: '#4ade80' }}>高效</span>
                </div>
            </div>
            
            <ParticleField count={34} color="rgba(165, 243, 252, 0.5)" opacity={0.3} speed={0.02} amplitude={22} />
            {/* 桌面设备 */}
            <div style={{ 
                ...getDeviceStyle(0, 4, 'rgba(165, 243, 252, 0.4)', 1.08), 
                left: '16%', 
                top: '35%', 
                width: '380px', 
                height: '240px', 
                borderRadius: '20px', 
                fontSize: '160px',
                background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.4), rgba(59, 130, 246, 0.7))',
                border: '4px solid rgba(255,255,255,0.25)',
            }}>
                <div style={{
                    position: 'relative',
                    filter: `drop-shadow(0 6px 12px rgba(14, 165, 233, 0.4))`
                }}>
                    🖥️
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '16px',
                        color: '#fff',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        桌面端
                    </div>
                </div>
            </div>

            {/* 平板设备 */}
            <div style={{ 
                ...getDeviceStyle(24, 8, 'rgba(134, 239, 172, 0.4)', 1.02), 
                left: '44%', 
                top: '42%', 
                width: '260px', 
                height: '320px', 
                borderRadius: '30px', 
                fontSize: '120px',
                background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.4), rgba(74, 222, 128, 0.6))',
                border: '4px solid rgba(255,255,255,0.25)',
            }}>
                <div style={{
                    position: 'relative',
                    filter: `drop-shadow(0 6px 12px rgba(34, 197, 94, 0.4))`
                }}>
                    📟
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '16px',
                        color: '#fff',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        平板端
                    </div>
                </div>
            </div>

            {/* 移动设备 */}
            <div style={{ 
                ...getDeviceStyle(48, 12, 'rgba(248, 250, 252, 0.5)', 0.98), 
                left: '72%', 
                top: '30%', 
                width: '180px', 
                height: '330px', 
                borderRadius: '38px', 
                fontSize: '120px',
                background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.6))',
                border: '4px solid rgba(255,255,255,0.25)',
            }}>
                <div style={{
                    position: 'relative',
                    filter: `drop-shadow(0 6px 12px rgba(99, 102, 241, 0.4))`
                }}>
                    📱
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '16px',
                        color: '#fff',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        移动端
                    </div>
                </div>
            </div>

            <Sequence from={fps * 2.2}>
                <div style={{ position: 'absolute', left: '22%', top: '20%', backgroundColor: 'rgba(255,255,255,0.9)', padding: '18px 28px', borderRadius: '18px', fontSize: '26px', color: '#0f172a', boxShadow: '0 18px 40px rgba(2, 6, 23, 0.25)', transform: `translateY(${Math.sin(frame / 12) * 6}px)` }}>
                    📲 一键安装 PWA
                </div>
            </Sequence>
            <Sequence from={fps * 3.4}>
                <div style={{ position: 'absolute', right: '12%', top: '22%', backgroundColor: 'rgba(74, 222, 128, 0.95)', color: '#022c22', padding: '18px 28px', borderRadius: '18px', fontSize: '26px', boxShadow: '0 18px 40px rgba(22, 101, 52, 0.35)', transform: `translateY(${Math.cos(frame / 14) * 6}px)` }}>
                    🌐 离线无缝工作
                </div>
            </Sequence>

            <div style={{
                position: 'absolute',
                bottom: '9%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#ffffff',
                fontSize: '32px',
                textAlign: 'center',
                maxWidth: '900px',
                lineHeight: '1.6',
                opacity: interpolate(frame, [fps * 0.8, fps * 1.6], [0, 1]),
                textShadow: '0 8px 24px rgba(15, 23, 42, 0.55)'
            }}>
                全端体验，极速响应，PWA 与离线能力全面开启。
                <br />
                无论电脑、平板还是手机，TodoList 都能与你无缝协作。
            </div>
        </AbsoluteFill>
    );
};

// --- 场景5：品牌展示（增强版） --- //
const Scene5Brand: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoScale = spring({
        frame,
        fps,
        config: { damping: 10, stiffness: 100 },
    });
    
    const textOpacity = (delay: number) => interpolate(frame, [delay, delay + 30], [0, 1]);
    const haloPulse = 0.9 + Math.sin(frame / 18) * 0.3;
    const glowShift = interpolate(frame, [0, fps * 6], [0, 150]);
    const logoRotation = Math.sin(frame / 60) * 2;
    
    // 增强的动画效果
    const brandFloat = Math.sin(frame / 35) * 8;
    const wordWave = (index: number) => Math.sin((frame + index * 20) / 25) * 4;
    const sparkleIntensity = 0.5 + Math.sin(frame / 15) * 0.4;

    return (
        <AbsoluteFill style={{ 
            background: `
                radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.15), transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.15), transparent 50%),
                linear-gradient(160deg, #1e293b, #0f172a 40%, #1e293b, #334155)
            `
        }}>
            {/* 多层粒子系统 */}
            <ParticleField count={45} color="rgba(99, 102, 241, 0.6)" opacity={0.3} speed={0.018} amplitude={18} blur={30} />
            <ParticleField count={30} color="rgba(56, 189, 248, 0.5)" opacity={0.25} speed={0.014} amplitude={22} blur={35} />
            <ParticleField count={20} color="rgba(139, 92, 246, 0.4)" opacity={0.2} speed={0.012} amplitude={15} blur={40} />
            
            {/* 动态光束背景 */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `conic-gradient(from ${frame * 1.5}deg at 50% 50%, transparent, rgba(99, 102, 241, 0.1), transparent, rgba(56, 189, 248, 0.1), transparent)`,
                opacity: 0.6,
                mixBlendMode: 'overlay'
            }} />

            <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '60px' }}>
                {/* 增强Logo设计 */}
                <div style={{
                    position: 'relative',
                    transform: `scale(${logoScale * haloPulse}) translateY(${brandFloat}px) rotate(${logoRotation}deg)`,
                    padding: '40px 80px',
                    background: 'linear-gradient(145deg, #ffffff, #f8fafc, #e2e8f0)',
                    borderRadius: '30px',
                    fontSize: '64px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    boxShadow: `
                        0 30px 70px rgba(15, 23, 42, 0.5), 
                        0 0 ${60 + haloPulse * 80}px rgba(56, 189, 248, ${0.4 + sparkleIntensity * 0.3}),
                        0 0 ${40 + haloPulse * 50}px rgba(99, 102, 241, 0.3),
                        inset 0 1px 0 rgba(255,255,255,0.9),
                        inset 0 -1px 0 rgba(0,0,0,0.1)
                    `,
                    letterSpacing: '0.1em',
                    border: '2px solid rgba(255,255,255,0.3)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b, #334155, #475569)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        AnixOps Studio
                    </div>
                    
                    {/* Logo光环效果 */}
                    {[...Array(3)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            inset: `-${20 + i * 15}px`,
                            borderRadius: `${35 + i * 10}px`,
                            background: `conic-gradient(from ${frame * (2 + i)}deg, transparent, rgba(${i === 0 ? '56,189,248' : i === 1 ? '99,102,241' : '139,92,246'}, ${0.1 + sparkleIntensity * 0.2}), transparent)`,
                            opacity: sparkleIntensity * (0.8 - i * 0.2),
                            zIndex: -1 - i,
                        }} />
                    ))}
                </div>

                {/* 增强特性词组 */}
                <div style={{ display: 'flex', gap: '80px', fontSize: '42px', fontWeight: 'bold' }}>
                    {[
                        { text: '创新', color: '#38bdf8', delay: fps * 2 },
                        { text: '质量', color: '#f87171', delay: fps * 2.5 },
                        { text: '卓越', color: '#4ade80', delay: fps * 3 }
                    ].map((item, i) => (
                        <div key={i} style={{ 
                            color: item.color, 
                            opacity: textOpacity(item.delay),
                            textShadow: `
                                0 0 ${25 + haloPulse * 15}px ${item.color}aa,
                                0 4px 8px rgba(0,0,0,0.3)
                            `,
                            transform: `translateY(${wordWave(i)}px) scale(${1 + Math.sin((frame + i * 30) / 20) * 0.03})`,
                            position: 'relative'
                        }}>
                            {item.text}
                            {/* 字体下划线效果 */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: `${interpolate(frame, [item.delay, item.delay + 60], [0, 100])}%`,
                                height: '3px',
                                background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                                borderRadius: '2px',
                                opacity: 0.8
                            }} />
                        </div>
                    ))}
                </div>

                {/* 增强描述文字 */}
                <div style={{
                    color: '#e2e8f0',
                    fontSize: '32px',
                    textAlign: 'center',
                    maxWidth: '900px',
                    lineHeight: '1.8',
                    opacity: textOpacity(fps * 1),
                    textShadow: `
                        0 8px 40px rgba(15, 23, 42, 0.6),
                        0 0 ${20 + sparkleIntensity * 15}px rgba(226, 232, 240, 0.3)
                    `,
                    transform: `translateY(${Math.sin(frame / 30) * 3}px)`,
                    fontWeight: '500',
                    letterSpacing: '0.02em'
                }}>
                    由 <span style={{ 
                        color: '#38bdf8',
                        fontWeight: 'bold',
                        textShadow: `0 0 ${15 + sparkleIntensity * 10}px rgba(56, 189, 248, 0.6)`
                    }}>AnixOps Studio</span> 精心打造，<br />
                    我们致力于用创新技术，为您创造无限可能。
                </div>

                {/* 增强装饰元素 */}
                <Sequence from={fps * 1.5}>
                    <div style={{
                        display: 'flex',
                        gap: '40px',
                        opacity: textOpacity(fps * 1.5),
                        transform: `translateY(${interpolate(frame, [fps * 1.5, fps * 2.5], [30, 0], { easing: Easing.out(Easing.cubic) })}px)`
                    }}>
                        {['⚡', '🎯', '✨', '🚀'].map((icon, i) => (
                            <div key={i} style={{
                                fontSize: '36px',
                                opacity: 0.8,
                                transform: `translateY(${Math.sin((frame + i * 25) / 20) * 5}px) scale(${1 + Math.sin((frame + i * 15) / 18) * 0.1})`,
                                filter: `drop-shadow(0 0 ${10 + Math.sin((frame + i * 20) / 15) * 8}px rgba(255,255,255,0.5))`
                            }}>
                                {icon}
                            </div>
                        ))}
                    </div>
                </Sequence>
            </AbsoluteFill>
            
            {/* 增强背景光效 */}
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: `
                    radial-gradient(circle at 80% 20%, rgba(56,189,248,${0.3 + sparkleIntensity * 0.2}), transparent 60%),
                    radial-gradient(circle at 20% 80%, rgba(99,102,241,${0.25 + sparkleIntensity * 0.15}), transparent 55%)
                `, 
                mixBlendMode: 'screen', 
                filter: `hue-rotate(${glowShift}deg)` 
            }} />
        </AbsoluteFill>
    );
};

// --- 场景6：行动号召 (CTA) 增强版 --- //
const Scene6CTA: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 增强的动画效果
    const pulseScale = 1 + spring({
        frame: frame - fps * 2,
        fps,
        config: { damping: 8, stiffness: 120, mass: 0.8 },
    }) * 0.08;

    const buttonHover = 1 + Math.sin(frame / 20) * 0.03;
    const buttonGlow = 0.7 + Math.sin(frame / 15) * 0.4;

    // 打字机效果增强
    const urlText = 'todo.anixops.com/todo';
    const typewriterProgress = interpolate(frame, [fps, fps * 4], [0, urlText.length], { 
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic)
    });
    const displayText = urlText.slice(0, Math.round(typewriterProgress));

    // 背景动画增强
    const gradientWave = interpolate(frame, [0, fps * 6], [0, 180]);
    const shimmer = Math.sin(frame / 12) * 10 + Math.cos(frame / 18) * 5;
    const breathingEffect = 1 + Math.sin(frame / 35) * 0.02;

    // 新增效果
    const sparkleIntensity = 0.4 + Math.sin(frame / 18) * 0.3;
    const titleWave = Math.sin(frame / 25) * 3;
    const urlGlow = 0.8 + Math.sin(frame / 10) * 0.4;

    return (
        <AbsoluteFill style={{
            background: `
                radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.4), transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(99, 102, 241, 0.3), transparent 60%),
                linear-gradient(135deg, #6366f1, #7c3aed, #8b5cf6)
            `,
            transform: `scale(${breathingEffect})`,
        }}>
            {/* 增强背景层 */}
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: `
                    radial-gradient(circle at 20% 30%, rgba(196,181,253,${0.4 + sparkleIntensity * 0.2}), transparent 55%), 
                    radial-gradient(circle at 80% 70%, rgba(129,140,248,${0.5 + sparkleIntensity * 0.3}), transparent 60%)
                `, 
                transform: `translateY(${shimmer}px) rotate(${frame * 0.1}deg)` 
            }} />
            
            {/* 多层粒子系统 */}
            <ParticleField count={55} color="rgba(255,255,255,0.6)" opacity={0.35} speed={0.025} amplitude={28} blur={25} />
            <ParticleField count={35} color="rgba(139, 92, 246, 0.5)" opacity={0.25} speed={0.018} amplitude={22} blur={35} />
            <ParticleField count={25} color="rgba(99, 102, 241, 0.4)" opacity={0.2} speed={0.015} amplitude={18} blur={40} />
            
            {/* 动态光束 */}
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: `
                    conic-gradient(from ${frame * 2}deg at 50% 50%, transparent, rgba(255,255,255,0.15), transparent, rgba(196,181,253,0.1), transparent),
                    linear-gradient(120deg, rgba(255,255,255,0.15), transparent 65%)
                `, 
                mixBlendMode: 'screen', 
                filter: `hue-rotate(${gradientWave}deg)` 
            }} />

            <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '45px' }}>
                {/* 苹果风格结尾标题 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '25px',
                    textAlign: 'center',
                    opacity: interpolate(frame, [0, fps], [0, 1]),
                    transform: `translateY(${titleWave}px)`
                }}>
                    <div style={{ 
                        fontSize: '38px', 
                        color: '#e8f4fd', 
                        fontWeight: '300',
                        letterSpacing: '0.05em',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        现在，是时候体验
                    </div>
                    
                    <div style={{ 
                        fontSize: '64px', 
                        color: '#ffffff', 
                        fontWeight: '700',
                        textShadow: `
                            0 4px 8px rgba(0,0,0,0.3),
                            0 0 ${35 + sparkleIntensity * 25}px rgba(255,255,255,0.5)
                        `,
                        letterSpacing: '-0.02em',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                    }}>
                        真正的 <span style={{
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fb923c)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: `0 0 ${20 + sparkleIntensity * 15}px rgba(251, 191, 36, 0.7)`
                        }}>生产力</span>
                    </div>
                    
                    <div style={{
                        fontSize: '28px',
                        color: '#cbd5e1',
                        fontWeight: '400',
                        maxWidth: '800px',
                        lineHeight: '1.4',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        由 <strong style={{ color: '#fbbf24' }}>AnixOps Studio</strong> 匠心打造<br />
                        专为追求卓越的您而设计
                    </div>
                </div>

                {/* 苹果风格CTA按钮 */}
                <div style={{ 
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <a href="https://todo.anixops.com/todo" target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-block',
                        fontSize: '32px',
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8)',
                        padding: '24px 60px',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: `
                            0 20px 50px rgba(15, 23, 42, 0.4), 
                            0 0 ${35 + buttonGlow * 40}px rgba(59, 130, 246, ${0.7 + buttonGlow * 0.3}),
                            0 0 ${15 + buttonGlow * 25}px rgba(96, 165, 250, 0.5),
                            inset 0 1px 0 rgba(255,255,255,0.25),
                            inset 0 -1px 0 rgba(0,0,0,0.1)
                        `,
                        textDecoration: 'none',
                        transform: `scale(${pulseScale * buttonHover})`,
                        letterSpacing: '0.02em',
                        fontWeight: '600',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                    }}>
                        立即体验
                    </a>
                    
                    {/* 辅助说明文字 */}
                    <div style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: '400',
                        textAlign: 'center',
                        fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                    }}>
                        免费使用，无需注册
                    </div>
                    
                    {/* 按钮光环效果 */}
                    {[...Array(3)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            inset: `-${15 + i * 12}px`,
                            borderRadius: `${65 + i * 8}px`,
                            background: `conic-gradient(from ${frame * (3 + i)}deg, transparent, rgba(59, 130, 246, ${0.1 + buttonGlow * 0.15}), transparent)`,
                            opacity: buttonGlow * (0.7 - i * 0.2),
                            zIndex: -1 - i,
                        }} />
                    ))}
                </div>

                {/* 增强URL显示 */}
                <div style={{
                    position: 'relative',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    fontSize: '32px',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    padding: '18px 32px',
                    borderRadius: '16px',
                    color: '#fff',
                    boxShadow: `
                        0 15px 35px rgba(15, 23, 42, 0.4),
                        0 0 ${25 + urlGlow * 30}px rgba(34, 197, 94, ${0.5 + urlGlow * 0.3}),
                        inset 0 1px 0 rgba(255,255,255,0.1)
                    `,
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    letterSpacing: '0.05em'
                }}>
                    <span style={{ 
                        color: '#22c55e',
                        textShadow: `0 0 ${15 + urlGlow * 12}px rgba(34, 197, 94, 0.8)`
                    }}>
                        {displayText}
                    </span>
                    <span style={{ 
                        animation: `blink 1s step-end infinite`,
                        color: '#fbbf24',
                        textShadow: `0 0 ${10 + urlGlow * 8}px rgba(251, 191, 36, 0.8)`
                    }}>|</span>
                    
                    {/* URL光效 */}
                    <div style={{
                        position: 'absolute',
                        inset: '-2px',
                        borderRadius: '18px',
                        background: `linear-gradient(135deg, rgba(34, 197, 94, ${0.2 + urlGlow * 0.2}), transparent, rgba(251, 191, 36, ${0.1 + urlGlow * 0.15}))`,
                        zIndex: -1,
                        opacity: urlGlow
                    }} />
                </div>

                {/* 增强底部信息 */}
                <div style={{
                    position: 'absolute',
                    bottom: '6%',
                    color: '#e2e8f0',
                    fontSize: '28px',
                    textAlign: 'center',
                    fontWeight: '500',
                    lineHeight: 1.6,
                    opacity: interpolate(frame, [fps*4.5, fps*5.5], [0, 1]),
                    textShadow: `
                        0 8px 24px rgba(30, 64, 175, 0.6),
                        0 0 ${20 + sparkleIntensity * 15}px rgba(226, 232, 240, 0.4)
                    `,
                    transform: `translateY(${Math.sin(frame / 28) * 2}px)`,
                    maxWidth: '1000px',
                    letterSpacing: '0.02em'
                }}>
                    <div style={{ marginBottom: '8px' }}>
                        <span style={{ 
                            color: '#fbbf24',
                            fontWeight: 'bold',
                            textShadow: `0 0 ${15 + sparkleIntensity * 10}px rgba(251, 191, 36, 0.6)`
                        }}>TodoList</span> · 
                        <span style={{ 
                            fontFamily: 'Monaco, monospace',
                            color: '#22c55e',
                            textShadow: `0 0 ${12 + sparkleIntensity * 8}px rgba(34, 197, 94, 0.6)`
                        }}>todo.anixops.com/todo</span>
                    </div>
                    <div>
                        <span style={{ 
                            color: '#38bdf8',
                            fontWeight: 'bold',
                            textShadow: `0 0 ${15 + sparkleIntensity * 10}px rgba(56, 189, 248, 0.6)`
                        }}>AnixOps Studio</span> — 与您并肩打造智能工作流 ✅✨
                    </div>
                </div>

                {/* 装饰性图标 */}
                <Sequence from={fps * 2}>
                    <div style={{
                        position: 'absolute',
                        top: '15%',
                        right: '8%',
                        fontSize: '48px',
                        opacity: 0.6,
                        transform: `rotate(${frame * 2}deg) scale(${1 + Math.sin(frame / 15) * 0.1})`,
                        filter: `drop-shadow(0 0 ${20 + sparkleIntensity * 15}px rgba(251, 191, 36, 0.8))`
                    }}>
                        ⭐
                    </div>
                </Sequence>
                
                <Sequence from={fps * 2.5}>
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '12%',
                        fontSize: '40px',
                        opacity: 0.7,
                        transform: `rotate(${-frame * 1.5}deg) scale(${1 + Math.cos(frame / 18) * 0.08})`,
                        filter: `drop-shadow(0 0 ${18 + sparkleIntensity * 12}px rgba(34, 197, 94, 0.8))`
                    }}>
                        ✨
                    </div>
                </Sequence>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};


// --- 主组件 --- //
export const TodoListPromo: React.FC = () => {
    const { fps } = useVideoConfig();

    const secondsToFrames = (seconds: number) => Math.round(seconds * fps);

    const scene1Start = 0;
        const scene1Duration = secondsToFrames(6);

    const scene2Start = scene1Start + scene1Duration;
        const scene2Duration = secondsToFrames(7);

    const scene3Start = scene2Start + scene2Duration;
        const scene3Duration = secondsToFrames(12);

    // 苹果风格产品演示场景
    const appleSceneStart = scene3Start + scene3Duration;
        const appleSceneDuration = secondsToFrames(8);

    const scene4Start = appleSceneStart + appleSceneDuration;
        const scene4Duration = secondsToFrames(7);

    const scene5Start = scene4Start + scene4Duration;
        const scene5Duration = secondsToFrames(6);

    const scene6Start = scene5Start + scene5Duration;
        const scene6Duration = secondsToFrames(7);

  return (
    <>
      <Sequence from={scene1Start} durationInFrames={scene1Duration}>
        <Scene1Problem />
      </Sequence>
      
      <Sequence from={scene2Start} durationInFrames={scene2Duration}>
        <Scene2Solution />
      </Sequence>
      
      <Sequence from={scene3Start} durationInFrames={scene3Duration}>
        <Scene3Features />
      </Sequence>
      
      <Sequence from={appleSceneStart} durationInFrames={appleSceneDuration}>
        <AppleStyleProductDemo />
      </Sequence>
      
      <Sequence from={scene4Start} durationInFrames={scene4Duration}>
        <Scene4CrossPlatform />
      </Sequence>
      
      <Sequence from={scene5Start} durationInFrames={scene5Duration}>
        <Scene5Brand />
      </Sequence>
      
      <Sequence from={scene6Start} durationInFrames={scene6Duration}>
        <Scene6CTA />
      </Sequence>
      
      <style>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

type Particle = {
    x: number;
    y: number;
    size: number;
    drift: number;
    speed: number;
};

const ParticleField: React.FC<{
    count?: number;
    color?: string;
    opacity?: number;
    blur?: number;
    speed?: number;
    amplitude?: number;
}> = ({
    count = 32,
    color = 'rgba(82, 196, 255, 0.8)',
    opacity = 0.6,
    blur = 30,
    speed = 0.015,
    amplitude = 12,
}) => {
    const frame = useCurrentFrame();

    const particles = useMemo<Particle[]>(() => {
        return Array.from({ length: count }, () => ({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 45 + 15,
            drift: Math.random() * 1000,
            speed: (Math.random() + 0.3) * speed,
        }));
    }, [count, speed]);

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
            {particles.map((particle, index) => {
                const xOffset = Math.sin((frame + particle.drift) * particle.speed) * amplitude;
                const yOffset = Math.cos((frame + particle.drift) * particle.speed) * amplitude * 0.8;
                const scale = 0.9 + Math.sin((frame + particle.drift) * particle.speed * 2) * 0.25;

                return (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: `${particle.x * 100}%`,
                            top: `${particle.y * 100}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            background: color,
                            borderRadius: '50%',
                            opacity,
                              filter: `blur(${blur}px)`,
                            transform: `translate(-50%, -50%) translate(${xOffset}px, ${yOffset}px) scale(${scale})`,
                            mixBlendMode: 'screen',
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};