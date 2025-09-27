import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate
} from 'remotion';
import { Logo } from '../components/atoms/Logo';
import { AnimatedText } from '../components/atoms/AnimatedText';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { AnimationHelper } from '../utils/animation';
import { MathUtils } from '../utils/math';

interface BrandAnimationProps {
  brandName?: string;
  tagline?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const BrandAnimation: React.FC<BrandAnimationProps> = ({
  brandName = "AnixOps",
  tagline = "Code-Driven Media Solutions",
  colors = {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent
  }
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  
  // 时间轴定义
  const timing = {
    particlesStart: 0,
    logoReveal: fps * 1,
    textReveal: fps * 2.5,
    brandShow: fps * 4,
    taglineShow: fps * 5.5,
    finalComposition: fps * 7,
    fadeOut: durationInFrames - fps * 1.5
  };
  
  // 粒子系统
  const particleCount = 50;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 200 + Math.sin(i * 0.5) * 50;
    const speed = 0.5 + Math.random() * 0.5;
    
    return {
      id: i,
      startX: width / 2 + Math.cos(angle) * radius,
      startY: height / 2 + Math.sin(angle) * radius,
      targetX: width / 2 + Math.cos(angle) * 100,
      targetY: height / 2 + Math.sin(angle) * 100,
      speed,
      color: [colors.primary, colors.secondary, colors.accent][i % 3]
    };
  });
  
  // 粒子动画
  const getParticlePosition = (particle: typeof particles[0], currentFrame: number) => {
    const progress = AnimationHelper.getFrameProgress(
      currentFrame,
      timing.particlesStart,
      fps * 3
    );
    
    const easedProgress = MathUtils.smoothstep(0, 1, progress);
    
    const x = MathUtils.lerp(particle.startX, particle.targetX, easedProgress);
    const y = MathUtils.lerp(particle.startY, particle.targetY, easedProgress);
    
    // 添加波动效果
    const wave = AnimationHelper.createWaveAnimation(currentFrame, particle.id, 10, 0.02);
    
    return {
      x: x + wave,
      y: y + Math.sin(currentFrame * 0.01 + particle.id) * 5,
      opacity: interpolate(
        currentFrame,
        [timing.particlesStart, timing.particlesStart + fps * 0.5, timing.logoReveal],
        [0, 1, 0.3]
      )
    };
  };
  
  // Logo变形动画
  const logoProgress = AnimationHelper.createSpringAnimation(
    frame - timing.logoReveal,
    fps,
    { damping: 20, stiffness: 400 }
  );
  
  const logoScale = interpolate(
    logoProgress,
    [0, 0.5, 1],
    [0, 1.2, 1]
  );
  
  const logoRotation = interpolate(
    frame,
    [timing.logoReveal, timing.textReveal],
    [360, 0]
  );
  
  // 文字浮现动画
  const textOpacity = interpolate(
    frame,
    [timing.textReveal, timing.textReveal + fps * 0.8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  // 品牌名称打字机效果
  const brandProgress = AnimationHelper.getFrameProgress(
    frame,
    timing.brandShow,
    fps * 1.5
  );
  
  const visibleBrandChars = Math.floor(brandProgress * brandName.length);
  const displayedBrand = brandName.slice(0, visibleBrandChars);
  
  // 标语淡入效果
  const taglineOpacity = interpolate(
    frame,
    [timing.taglineShow, timing.taglineShow + fps * 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  // 最终合成动画
  const finalScale = interpolate(
    frame,
    [timing.finalComposition, timing.finalComposition + fps * 1],
    [1, 0.8],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const finalOpacity = interpolate(
    frame,
    [timing.fadeOut, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* 粒子背景 */}
      <AbsoluteFill>
        {particles.map((particle) => {
          const pos = getParticlePosition(particle, frame);
          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: pos.x - 2,
                top: pos.y - 2,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: particle.color,
                opacity: pos.opacity,
                boxShadow: `0 0 10px ${particle.color}`
              }}
            />
          );
        })}
      </AbsoluteFill>
      
      {/* 动态背景网格 */}
      <AbsoluteFill>
        <svg width="100%" height="100%" style={{ opacity: 0.1 }}>
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke={colors.primary}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </AbsoluteFill>
      
      {/* 主要内容 */}
      <div
        style={{
          opacity: finalOpacity,
          transform: `scale(${finalScale})`,
          textAlign: 'center',
          zIndex: 10
        }}
      >
        {/* Logo动画 */}
        <Sequence from={timing.logoReveal} durationInFrames={durationInFrames}>
          <div
            style={{
              transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
              marginBottom: SPACING[8],
              filter: `drop-shadow(0 0 20px ${colors.primary})`
            }}
          >
            <Logo variant="full" size="xl" animate={false} color={colors.primary} />
          </div>
        </Sequence>
        
        {/* 品牌名称 */}
        <Sequence from={timing.brandShow} durationInFrames={durationInFrames}>
          <div
            style={{
              marginBottom: SPACING[4]
            }}
          >
            <span
              style={{
                fontFamily: TYPOGRAPHY.fontFamily.primary,
                fontSize: '4rem',
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
                backgroundSize: '200% 200%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                animation: 'gradient 3s ease infinite',
                textShadow: `0 0 30px ${colors.primary}50`
              }}
            >
              {displayedBrand}
              {visibleBrandChars < brandName.length && (
                <span
                  style={{
                    borderRight: `3px solid ${colors.primary}`,
                    animation: 'blink 1s infinite'
                  }}
                />
              )}
            </span>
          </div>
        </Sequence>
        
        {/* 标语 */}
        <Sequence from={timing.taglineShow} durationInFrames={durationInFrames}>
          <div
            style={{
              opacity: taglineOpacity
            }}
          >
            <AnimatedText
              text={tagline}
              variant="h3"
              animate={false}
              style={{
                color: colors.secondary,
                fontSize: '1.5rem',
                fontWeight: '300',
                letterSpacing: '0.1em',
                textShadow: `0 0 10px ${colors.secondary}30`
              }}
            />
          </div>
        </Sequence>
      </div>
      
      {/* CSS动画样式 */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </AbsoluteFill>
  );
};

export default BrandAnimation;