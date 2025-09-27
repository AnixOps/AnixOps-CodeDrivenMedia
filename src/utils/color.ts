// 颜色工具函数
export class ColorUtils {
  /**
   * HEX转RGB
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }
  
  /**
   * RGB转HEX
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')}`;
  }
  
  /**
   * HSL转RGB
   */
  static hslToRgb(
    h: number,
    s: number,
    l: number
  ): { r: number; g: number; b: number } {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    if (s === 0) {
      const gray = Math.round(l * 255);
      return { r: gray, g: gray, b: gray };
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    };
  }
  
  /**
   * RGB转HSL
   */
  static rgbToHsl(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
  
  /**
   * 颜色混合
   */
  static mix(
    color1: string,
    color2: string,
    ratio: number = 0.5
  ): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
    
    return this.rgbToHex(r, g, b);
  }
  
  /**
   * 颜色亮度调整
   */
  static lighten(color: string, amount: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;
    
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.min(100, hsl.l + amount);
    
    const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }
  
  /**
   * 颜色深度调整
   */
  static darken(color: string, amount: number): string {
    return this.lighten(color, -amount);
  }
  
  /**
   * 颜色饱和度调整
   */
  static saturate(color: string, amount: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;
    
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.s = Math.min(100, Math.max(0, hsl.s + amount));
    
    const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }
  
  /**
   * 获取颜色对比度
   */
  static getContrast(color1: string, color2: string): number {
    const getLuminance = (color: string): number => {
      const rgb = this.hexToRgb(color);
      if (!rgb) return 0;
      
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }
  
  /**
   * 获取可读性最佳文本颜色
   */
  static getBestTextColor(
    backgroundColor: string,
    lightColor: string = '#FFFFFF',
    darkColor: string = '#000000'
  ): string {
    const lightContrast = this.getContrast(backgroundColor, lightColor);
    const darkContrast = this.getContrast(backgroundColor, darkColor);
    
    return lightContrast > darkContrast ? lightColor : darkColor;
  }
  
  /**
   * 生成调色板
   */
  static generatePalette(
    baseColor: string,
    count: number = 5
  ): string[] {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return [baseColor];
    
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const palette: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const newHsl = {
        h: (hsl.h + (360 / count) * i) % 360,
        s: hsl.s,
        l: hsl.l
      };
      
      const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      palette.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return palette;
  }
  
  /**
   * 创建渐变色
   */
  static createGradient(
    colors: string[],
    direction: string = 'to right'
  ): string {
    if (colors.length < 2) return colors[0] || '#000000';
    
    const colorStops = colors.join(', ');
    return `linear-gradient(${direction}, ${colorStops})`;
  }
  
  /**
   * 颜色动画插值
   */
  static animateColor(
    startColor: string,
    endColor: string,
    progress: number
  ): string {
    const rgb1 = this.hexToRgb(startColor);
    const rgb2 = this.hexToRgb(endColor);
    
    if (!rgb1 || !rgb2) return startColor;
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);
    
    return this.rgbToHex(r, g, b);
  }
}