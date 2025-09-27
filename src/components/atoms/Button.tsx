import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { BaseComponentProps } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  href,
  disabled = false,
  animate = true,
  animationConfig = {},
  className = '',
  style = {}
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  
  // 尺寸映射
  const sizeMap = {
    sm: {
      padding: `${SPACING[2]} ${SPACING[4]}`,
      fontSize: TYPOGRAPHY.fontSize.sm,
      height: '36px'
    },
    md: {
      padding: `${SPACING[3]} ${SPACING[6]}`,
      fontSize: TYPOGRAPHY.fontSize.base,
      height: '44px'
    },
    lg: {
      padding: `${SPACING[4]} ${SPACING[8]}`,
      fontSize: TYPOGRAPHY.fontSize.lg,
      height: '52px'
    }
  };
  
  // 变体样式映射
  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      border: `2px solid ${COLORS.primary}`,
      boxShadow: `0 4px 12px ${COLORS.alpha.black20}`
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      color: COLORS.white,
      border: `2px solid ${COLORS.secondary}`,
      boxShadow: `0 4px 12px ${COLORS.alpha.black20}`
    },
    outline: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      border: `2px solid ${COLORS.primary}`,
      boxShadow: 'none'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      border: '2px solid transparent',
      boxShadow: 'none'
    }
  };
  
  // 动画计算
  const animationProgress = animate ? spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 300
    }
  }) : 1;
  
  const buttonOpacity = interpolate(animationProgress, [0, 1], [0, 1]);
  const buttonScale = interpolate(animationProgress, [0, 1], [0.95, 1]);
  
  // 组合样式
  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING[2],
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textDecoration: 'none',
    outline: 'none',
    opacity: disabled ? 0.5 : buttonOpacity,
    transform: `scale(${buttonScale})`,
    ...sizeMap[size as keyof typeof sizeMap],
    ...variantStyles[variant as keyof typeof variantStyles],
    ...style
  };
  
  const content = (
    <>
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
    </>
  );
  
  // 渲染为链接或按钮
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={`button button-${variant} button-${size} ${className}`}
        style={buttonStyle}
      >
        {content}
      </a>
    );
  }
  
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      style={buttonStyle}
      disabled={disabled}
    >
      {content}
    </button>
  );
};