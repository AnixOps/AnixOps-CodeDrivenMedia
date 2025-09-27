/**
 * Remotion configuration file
 * See https://www.remotion.dev/docs/config for more information
 */

// 简化的配置文件，专注于基本功能
export const Config = {
  // 视频输出格式
  videoImageFormat: 'jpeg' as const,
  pixelFormat: 'yuv420p' as const,
  codec: 'h264' as const,
  
  // 开发环境配置
  ...(process.env.NODE_ENV === 'development' && {
    quality: 50,
    crf: 28,
    scale: 0.5,
  }),
  
  // 生产环境配置
  ...(process.env.NODE_ENV === 'production' && {
    quality: 100,
    crf: 18,
    scale: 1,
  }),
  
  // 并发设置
  concurrency: process.env.REMOTION_CONCURRENCY 
    ? parseInt(process.env.REMOTION_CONCURRENCY) 
    : undefined,
};

// 导出配置
export default Config;