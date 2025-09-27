import { interpolate, spring } from 'remotion';
import { DURATIONS, EASINGS } from '../constants/animation';

// 动画辅助函数
export class AnimationHelper {
  /**
   * 创建弹性动画
   */
  static createSpringAnimation(
    frame: number,
    fps: number,
    config: {
      damping?: number;
      stiffness?: number;
      mass?: number;
    } = {}
  ) {
    return spring({
      frame,
      fps,
      config: {
        damping: 12,
        stiffness: 200,
        mass: 0.5,
        ...config
      }
    });
  }
  
  /**
   * 创建错开动画
   */
  static createStaggeredAnimation(
    frame: number,
    index: number,
    totalItems: number,
    duration: number,
    staggerDelay: number = 0.1
  ) {
    const startFrame = index * staggerDelay * 30; // 30fps
    const endFrame = startFrame + duration;
    
    return interpolate(
      frame,
      [startFrame, endFrame],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    );
  }
  
  /**
   * 创建波浪动画
   */
  static createWaveAnimation(
    frame: number,
    index: number,
    amplitude: number = 20,
    frequency: number = 0.02,
    phase: number = 0
  ) {
    return Math.sin((frame * frequency) + (index * phase)) * amplitude;
  }
  
  /**
   * 创建路径动画
   */
  static createPathAnimation(
    progress: number,
    pathPoints: Array<{ x: number, y: number }>
  ) {
    if (pathPoints.length < 2) return { x: 0, y: 0 };
    
    const segmentLength = 1 / (pathPoints.length - 1);
    const segmentIndex = Math.floor(progress / segmentLength);
    const segmentProgress = (progress % segmentLength) / segmentLength;
    
    const startPoint = pathPoints[Math.min(segmentIndex, pathPoints.length - 2)];
    const endPoint = pathPoints[Math.min(segmentIndex + 1, pathPoints.length - 1)];
    
    return {
      x: interpolate(segmentProgress, [0, 1], [startPoint.x, endPoint.x]),
      y: interpolate(segmentProgress, [0, 1], [startPoint.y, endPoint.y])
    };
  }
  
  /**
   * 创建缓动动画
   */
  static createEaseAnimation(
    frame: number,
    startFrame: number,
    duration: number,
    easing: keyof typeof EASINGS = 'easeOut'
  ) {
    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    );
    
    // 简化的缓动函数实现
    switch (easing) {
      case 'easeIn':
        return progress * progress;
      case 'easeOut':
        return 1 - Math.pow(1 - progress, 2);
      case 'easeInOut':
        return progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'anixBounce':
        return 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * 2);
      default:
        return progress;
    }
  }
  
  /**
   * 创建粒子动画
   */
  static createParticleAnimation(
    frame: number,
    particleIndex: number,
    config: {
      lifetime: number;
      startPosition: { x: number, y: number };
      velocity: { x: number, y: number };
      gravity?: number;
    }
  ) {
    const { lifetime, startPosition, velocity, gravity = 0.5 } = config;
    const t = frame / 30; // 转为秒
    
    if (t > lifetime) {
      return {
        x: startPosition.x,
        y: startPosition.y,
        opacity: 0,
        scale: 0
      };
    }
    
    const x = startPosition.x + velocity.x * t;
    const y = startPosition.y + velocity.y * t + 0.5 * gravity * t * t;
    const opacity = interpolate(t, [0, lifetime], [1, 0]);
    const scale = interpolate(t, [0, lifetime * 0.1, lifetime], [0, 1, 0.5]);
    
    return { x, y, opacity, scale };
  }
  
  /**
   * 创建旋转动画
   */
  static createRotationAnimation(
    frame: number,
    rotationsPerSecond: number = 1,
    direction: 'clockwise' | 'counterclockwise' = 'clockwise'
  ) {
    const rotation = (frame / 30) * 360 * rotationsPerSecond;
    return direction === 'clockwise' ? rotation : -rotation;
  }
  
  /**
   * 创建脉冲动画
   */
  static createPulseAnimation(
    frame: number,
    frequency: number = 1,
    amplitude: number = 0.1
  ) {
    const pulse = Math.sin(frame * frequency * Math.PI / 30) * amplitude;
    return 1 + pulse;
  }
  
  /**
   * 获取帧数进度
   */
  static getFrameProgress(
    frame: number,
    startFrame: number,
    duration: number
  ): number {
    return interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    );
  }
  
  /**
   * 创建复合动画
   */
  static combineAnimations(
    ...animations: Array<{ progress: number, weight?: number }>
  ) {
    const totalWeight = animations.reduce((sum, anim) => sum + (anim.weight || 1), 0);
    return animations.reduce((sum, anim) => {
      const weight = (anim.weight || 1) / totalWeight;
      return sum + anim.progress * weight;
    }, 0);
  }
}