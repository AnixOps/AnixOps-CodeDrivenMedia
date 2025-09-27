import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img
} from 'remotion';
import { AnimatedText } from '../components/atoms/AnimatedText';
import { Button } from '../components/atoms/Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { AnimationHelper } from '../utils/animation';
import { MathUtils } from '../utils/math';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  demoUrl?: string;
  color: string;
}

interface FeatureDemoProps {
  features?: Feature[];
  transitionDuration?: number;
}

const defaultFeatures: Feature[] = [
  {
    id: 'code-driven',
    title: 'Code-Driven Animation',
    description: 'Create stunning animations using familiar programming concepts and real-time preview.',
    color: COLORS.primary,
    icon: '🎬'
  },
  {
    id: 'real-time',
    title: 'Real-time Preview',
    description: 'See your changes instantly with hot-reload and interactive timeline scrubbing.',
    color: COLORS.secondary,
    icon: '⚡'
  },
  {
    id: 'scalable',
    title: 'Scalable Architecture',
    description: 'Built with modern tech stack for enterprise-level video production workflows.',
    color: COLORS.accent,
    icon: '🏗️'
  },
  {
    id: 'export',
    title: 'Multiple Export Formats',
    description: 'Export to MP4, WebM, GIF or even render individual frames for maximum flexibility.',
    color: '#FF6B6B',
    icon: '📤'
  }
];

export const FeatureDemo: React.FC<FeatureDemoProps> = ({
  features = defaultFeatures,
  transitionDuration = 3
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  
  const transitionFrames = fps * transitionDuration;
  const totalFeatures = features.length;
  const featureDuration = Math.floor(durationInFrames / totalFeatures);
  
  // 获取当前显示的功能索引
  const getCurrentFeatureIndex = () => {
    return Math.floor(frame / featureDuration) % totalFeatures;
  };
  
  const currentFeatureIndex = getCurrentFeatureIndex();
  const currentFeature = features[currentFeatureIndex];
  const nextFeatureIndex = (currentFeatureIndex + 1) % totalFeatures;
  const nextFeature = features[nextFeatureIndex];
  
  // 计算功能切换进度
  const featureProgress = (frame % featureDuration) / featureDuration;
  const isTransitioning = featureProgress > 0.8;
  const transitionProgress = isTransitioning ? (featureProgress - 0.8) / 0.2 : 0;
  
  // 背景动画
  const backgroundOpacity = interpolate(
    Math.sin(frame * 0.01),
    [-1, 1],
    [0.3, 0.7]
  );
  
  // 3D卡片动画
  const cardRotationY = interpolate(
    frame,
    [0, fps * 2],
    [0, 360],
    { extrapolateRight: 'extend' }
  );
  
  const cardScale = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [0.95, 1.05]
  );
  
  // 粒子效果
  const particlePositions = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2 + frame * 0.01;
    const radius = 100 + Math.sin(frame * 0.005 + i) * 30;
    const x = width / 2 + Math.cos(angle) * radius;
    const y = height / 2 + Math.sin(angle) * radius;
    
    return {
      x,
      y,
      opacity: interpolate(
        Math.sin(frame * 0.03 + i),
        [-1, 1],
        [0.2, 0.8]
      ),
      size: interpolate(
        Math.sin(frame * 0.02 + i * 0.5),
        [-1, 1],
        [2, 6]
      )
    };
  });
  
  // 文字动画
  const titleAnimation = {
    opacity: interpolate(
      featureProgress,
      [0, 0.1, 0.8, 0.9],
      [0, 1, 1, 0]
    ),
    transform: `translateY(${
      interpolate(
        featureProgress,
        [0, 0.1, 0.8, 0.9],
        [30, 0, 0, -30]
      )
    }px)`
  };
  
  const descriptionAnimation = {
    opacity: interpolate(
      featureProgress,
      [0.1, 0.2, 0.7, 0.8],
      [0, 1, 1, 0]
    ),
    transform: `translateY(${
      interpolate(
        featureProgress,
        [0.1, 0.2, 0.7, 0.8],
        [20, 0, 0, -20]
      )
    }px)`
  };
  
  // 图标动画
  const iconRotation = AnimationHelper.createRotationAnimation(
    frame,
    0.5,
    'clockwise'
  );
  
  const iconScale = AnimationHelper.createPulseAnimation(
    frame,
    2,
    0.2
  ) + 0.8;
  
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.background}, ${COLORS.gray[50]})`,
        overflow: 'hidden'
      }}
    >
      {/* 动态背景 */}
      <AbsoluteFill>
        <div
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentFeature.color}20, transparent 70%)`,
            opacity: backgroundOpacity,
            transform: `scale(${1 + Math.sin(frame * 0.005) * 0.1})`
          }}
        />
      </AbsoluteFill>
      
      {/* 粒子系统 */}
      <AbsoluteFill>
        {particlePositions.map((particle, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: currentFeature.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${currentFeature.color}`
            }}
          />
        ))}
      </AbsoluteFill>
      
      {/* 主要内容区域 */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: SPACING[10]
        }}
      >
        {/* 功能卡片 */}
        <div
          style={{
            maxWidth: '800px',
            width: '100%',
            perspective: '1000px'
          }}
        >
          <div
            style={{
              transform: `rotateY(${cardRotationY * 0.1}deg) scale(${cardScale})`,
              transformStyle: 'preserve-3d',
              background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.gray[50]})`,
              borderRadius: '24px',
              padding: SPACING[12],
              boxShadow: `
                0 20px 40px ${COLORS.alpha.black10},
                0 0 0 1px ${COLORS.alpha.white20},
                inset 0 1px 0 ${COLORS.alpha.white40}
              `,
              backdropFilter: 'blur(20px)',
              border: `2px solid ${currentFeature.color}30`
            }}
          >
            {/* 功能图标 */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: SPACING[8]
              }}
            >
              <div
                style={{
                  fontSize: '4rem',
                  transform: `rotate(${iconRotation}deg) scale(${iconScale})`,
                  display: 'inline-block',
                  filter: `drop-shadow(0 4px 8px ${currentFeature.color}40)`
                }}
              >
                {currentFeature.icon}
              </div>
            </div>
            
            {/* 功能标题 */}
            <div
              style={{
                ...titleAnimation,
                textAlign: 'center',
                marginBottom: SPACING[6]
              }}
            >
              <AnimatedText
                text={currentFeature.title}
                variant="h2"
                animate={false}
                style={{
                  color: currentFeature.color,
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  textShadow: `0 2px 4px ${COLORS.alpha.black10}`
                }}
              />
            </div>
            
            {/* 功能描述 */}
            <div
              style={{
                ...descriptionAnimation,
                textAlign: 'center',
                marginBottom: SPACING[8]
              }}
            >
              <AnimatedText
                text={currentFeature.description}
                variant="body"
                animate={false}
                style={{
                  color: COLORS.text.secondary,
                  fontSize: '1.25rem',
                  lineHeight: 1.6,
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              />
            </div>
            
            {/* 进度指示器 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: SPACING[2],
                marginBottom: SPACING[6]
              }}
            >
              {features.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: index === currentFeatureIndex 
                      ? currentFeature.color 
                      : COLORS.gray[300],
                    transform: index === currentFeatureIndex ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    boxShadow: index === currentFeatureIndex 
                      ? `0 0 10px ${currentFeature.color}` 
                      : 'none'
                  }}
                />
              ))}
            </div>
            
            {/* CTA按钮 */}
            <div
              style={{
                textAlign: 'center',
                opacity: interpolate(
                  featureProgress,
                  [0.3, 0.4, 0.6, 0.7],
                  [0, 1, 1, 0]
                )
              }}
            >
              <Button
                variant="primary"
                size="lg"
                animate={false}
                style={{
                  backgroundColor: currentFeature.color,
                  borderColor: currentFeature.color,
                  boxShadow: `0 8px 24px ${currentFeature.color}40`
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      
      {/* 下一个功能预览 */}
      {isTransitioning && (
        <AbsoluteFill
          style={{
            opacity: transitionProgress,
            transform: `translateX(${(1 - transitionProgress) * 100}px)`
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: SPACING[6],
              right: SPACING[6],
              background: `linear-gradient(135deg, ${nextFeature.color}, ${nextFeature.color}80)`,
              borderRadius: '16px',
              padding: SPACING[4],
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: `0 8px 16px ${nextFeature.color}40`
            }}
          >
            Next: {nextFeature.title}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default FeatureDemo;