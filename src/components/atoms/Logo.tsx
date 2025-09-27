import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { LogoProps } from '../../types';
import { COLORS, TYPOGRAPHY } from '../../constants/theme';
import { DURATIONS, EASINGS } from '../../constants/animation';

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  color = COLORS.primary,
  animate = true,
  animationConfig = {},
  className = '',
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = {fps: 30}; // 使用默认值
  
  // 尺寸映射
  const sizeMap = {
    sm: { width: 120, height: 40, fontSize: '1.2rem' },
    md: { width: 180, height: 60, fontSize: '1.8rem' },
    lg: { width: 240, height: 80, fontSize: '2.4rem' },
    xl: { width: 320, height: 120, fontSize: '3.2rem' }
  };
  
  const dimensions = sizeMap[size as keyof typeof sizeMap];
  
  // 动画计算
  const animationProgress = animate ? spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 200,
      mass: 0.5
    }
  }) : 1;
  
  // Logo 显示动画
  const logoOpacity = interpolate(animationProgress, [0, 1], [0, 1]);
  const logoScale = interpolate(animationProgress, [0, 1], [0.8, 1]);
  
  // 样式计算
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dimensions.width,
    height: dimensions.height,
    opacity: logoOpacity,
    transform: `scale(${logoScale})`,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color,
    ...style
  };
  
  // 渲染不同变体
  const renderVariant = () => {
    switch (variant) {
      case 'icon':
        return (
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${color}, ${COLORS.accent})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            A
          </div>
        );
      
      case 'text':
        return (
          <span style={{
            fontSize: dimensions.fontSize,
            letterSpacing: '-0.02em'
          }}>
            AnixOps
          </span>
        );
      
      case 'full':
      default:
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${color}, ${COLORS.accent})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              A
            </div>
            <span style={{
              fontSize: dimensions.fontSize,
              letterSpacing: '-0.02em'
            }}>
              AnixOps
            </span>
          </div>
        );
    }
  };
  
  return (
    <div 
      className={`logo ${className}`}
      style={containerStyle}
    >
      {renderVariant()}
    </div>
  );
};