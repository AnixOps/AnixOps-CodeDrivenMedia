import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { TextAnimatedProps } from '../../types';
import { TYPOGRAPHY, COLORS } from '../../constants/theme';
import { DURATIONS } from '../../constants/animation';

export const AnimatedText: React.FC<TextAnimatedProps> = ({
  text,
  variant = 'body',
  animationType = 'fadeIn',
  speed = 50,
  animate = true,
  animationConfig = {},
  className = '',
  style = {}
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  
  // 文本样式映射
  const variantStyles = {
    h1: {
      fontSize: TYPOGRAPHY.fontSize['5xl'],
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      lineHeight: TYPOGRAPHY.lineHeight.tight
    },
    h2: {
      fontSize: TYPOGRAPHY.fontSize['4xl'],
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      lineHeight: TYPOGRAPHY.lineHeight.tight
    },
    h3: {
      fontSize: TYPOGRAPHY.fontSize['3xl'],
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      lineHeight: TYPOGRAPHY.lineHeight.normal
    },
    body: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.normal,
      lineHeight: TYPOGRAPHY.lineHeight.normal
    },
    caption: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.normal,
      lineHeight: TYPOGRAPHY.lineHeight.normal
    }
  };
  
  // 动画计算
  const getAnimationValue = () => {
    if (!animate) return { opacity: 1, transform: 'none', width: 'auto' };
    
    const duration = animationConfig?.duration || DURATIONS.normal;
    const progress = interpolate(frame, [0, duration / (1000 / fps)], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    
    switch (animationType) {
      case 'typewriter':
        const charCount = Math.floor(progress * text.length);
        const visibleText = text.slice(0, charCount);
        return {
          opacity: 1,
          transform: 'none',
          content: visibleText,
          borderRight: charCount < text.length ? '2px solid currentColor' : 'none'
        };
      
      case 'slideIn':
        return {
          opacity: progress,
          transform: `translateY(${(1 - progress) * 30}px)`,
          width: 'auto'
        };
      
      case 'scaleIn':
        return {
          opacity: progress,
          transform: `scale(${0.8 + progress * 0.2})`,
          width: 'auto'
        };
      
      case 'fadeIn':
      default:
        return {
          opacity: progress,
          transform: 'none',
          width: 'auto'
        };
    }
  };
  
  const animationValues = getAnimationValue();
  
  // 组合样式
  const textStyle: React.CSSProperties = {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    color: COLORS.gray[900],
    margin: 0,
    padding: 0,
    ...variantStyles[variant as keyof typeof variantStyles],
    ...animationValues,
    ...style
  };
  
  // 渲染正确的HTML标签
  const renderTag = () => {
    const content = animationType === 'typewriter' && animationValues.content 
      ? animationValues.content 
      : text;
    
    const commonProps = {
      className: `animated-text ${className}`,
      style: textStyle
    };
    
    switch (variant) {
      case 'h1':
        return <h1 {...commonProps}>{content}</h1>;
      case 'h2':
        return <h2 {...commonProps}>{content}</h2>;
      case 'h3':
        return <h3 {...commonProps}>{content}</h3>;
      case 'caption':
        return <small {...commonProps}>{content}</small>;
      case 'body':
      default:
        return <p {...commonProps}>{content}</p>;
    }
  };
  
  return renderTag();
};