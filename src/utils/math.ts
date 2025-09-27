// 数学工具函数
export class MathUtils {
  /**
   * 线性插值
   */
  static lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }
  
  /**
   * 限制数值范围
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
  
  /**
   * 数值映射
   */
  static map(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
  
  /**
   * 平滑步函数
   */
  static smoothstep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }
  
  /**
   * 距离计算
   */
  static distance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * 角度转弧度
   */
  static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
  /**
   * 弧度转角度
   */
  static radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }
  
  /**
   * 生成随机数
   */
  static random(min: number = 0, max: number = 1): number {
    return Math.random() * (max - min) + min;
  }
  
  /**
   * 生成随机整数
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(this.random(min, max + 1));
  }
  
  /**
   * 贝塞尔曲线
   */
  static bezier(
    t: number,
    p0: number,
    p1: number,
    p2: number,
    p3: number
  ): number {
    const invT = 1 - t;
    return (
      invT * invT * invT * p0 +
      3 * invT * invT * t * p1 +
      3 * invT * t * t * p2 +
      t * t * t * p3
    );
  }
  
  /**
   * 正弦波动画
   */
  static wave(
    time: number,
    amplitude: number = 1,
    frequency: number = 1,
    phase: number = 0
  ): number {
    return amplitude * Math.sin(2 * Math.PI * frequency * time + phase);
  }
  
  /**
   * 弹性动画
   */
  static easeElastic(
    t: number,
    amplitude: number = 1,
    period: number = 0.3
  ): number {
    if (t === 0) return 0;
    if (t === 1) return 1;
    
    const s = period / 4;
    return (
      amplitude *
      Math.pow(2, -10 * t) *
      Math.sin(((t - s) * (2 * Math.PI)) / period) +
      1
    );
  }
  
  /**
   * 弹跳动画
   */
  static easeBounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
  
  /**
   * 频率映射到颜色
   */
  static frequencyToColor(
    frequency: number,
    minFreq: number = 20,
    maxFreq: number = 20000
  ): string {
    const normalized = this.clamp(
      (frequency - minFreq) / (maxFreq - minFreq),
      0,
      1
    );
    
    // 使用HSL颜色空间映射频率
    const hue = normalized * 300; // 0-300度（从红到紫）
    return `hsl(${hue}, 70%, 50%)`;
  }
  
  /**
   * 生成噪声
   */
  static noise(x: number, y: number = 0): number {
    // 简化的Perlin噪声实现
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }
  
  /**
   * 计算两点间的角度
   */
  static angle(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
  }
  
  /**
   * 旋转点
   */
  static rotatePoint(
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    angle: number
  ): { x: number; y: number } {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = x - centerX;
    const dy = y - centerY;
    
    return {
      x: centerX + dx * cos - dy * sin,
      y: centerY + dx * sin + dy * cos
    };
  }
}