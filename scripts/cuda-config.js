/**
 * CUDA 硬件加速配置
 * 针对 NVIDIA GPU 优化的 Remotion 渲染设置
 */

// CUDA 设备信息检测
function getCudaDeviceInfo() {
  const { execSync } = require('child_process');
  try {
    // 首先检查 nvidia-smi 是否可用
    execSync('nvidia-smi', { stdio: 'pipe' });
    
    // 获取 GPU 基本信息
    const output = execSync('nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits', { encoding: 'utf8' });
    const lines = output.trim().split('\n');
    
    return lines.map(line => {
      const parts = line.split(',').map(s => s.trim());
      const name = parts[0];
      const memory = parseInt(parts[1]) || 0;
      
      return {
        name: name,
        memory: memory,
        cudaVersion: '13.0' // 从 nvidia-smi 输出中看到的版本
      };
    });
  } catch (error) {
    // 如果命令失败，返回空数组
    return [];
  }
}

// 根据 GPU 内存自动配置渲染参数
function getOptimalCudaConfig() {
  const devices = getCudaDeviceInfo();
  if (devices.length === 0) {
    return null;
  }

  const primaryGpu = devices[0];
  const memoryGB = Math.floor(primaryGpu.memory / 1024);

  // 根据显存大小调整配置
  if (memoryGB >= 12) {
    // 12GB+ 显存 (RTX 3080 Ti, RTX 4070 Ti, RTX 4080, RTX 4090 等)
    return {
      concurrency: 6,
      maxMemoryUsage: 8192,
      batchSize: 4,
      preset: 'p4', // 平衡质量和速度
      profile: 'high',
      rcMode: 'vbr', // 可变码率
      quality: 'ultra'
    };
  } else if (memoryGB >= 10) {
    // 10-12GB 显存 (RTX 3080, RTX 4060 Ti 16GB 等)
    return {
      concurrency: 4,
      maxMemoryUsage: 6144,
      batchSize: 3,
      preset: 'p5',
      profile: 'main',
      rcMode: 'vbr',
      quality: 'high'
    };
  } else if (memoryGB >= 8) {
    // 8-10GB 显存 (RTX 3070, RTX 4060 Ti 8GB, RTX 2080 Ti 等)
    return {
      concurrency: 3,
      maxMemoryUsage: 4096,
      batchSize: 2,
      preset: 'p6',
      profile: 'main',
      rcMode: 'cbr', // 固定码率
      quality: 'high'
    };
  } else if (memoryGB >= 6) {
    // 6-8GB 显存 (RTX 3060, RTX 4060, RTX 2070 等)
    return {
      concurrency: 2,
      maxMemoryUsage: 3072,
      batchSize: 2,
      preset: 'p7',
      profile: 'main',
      rcMode: 'cbr',
      quality: 'medium'
    };
  } else {
    // 6GB 以下显存 (GTX 1660, RTX 3050 等)
    return {
      concurrency: 1,
      maxMemoryUsage: 2048,
      batchSize: 1,
      preset: 'p7',
      profile: 'baseline',
      rcMode: 'cbr',
      quality: 'medium'
    };
  }
}

// NVENC 编码器配置
const NVENC_PRESETS = {
  p1: 'fastest', // 最快速度，质量最低
  p2: 'faster',
  p3: 'fast',
  p4: 'medium',  // 推荐：平衡质量和速度
  p5: 'slow',
  p6: 'slower',
  p7: 'slowest'  // 最高质量，速度最慢
};

// 质量配置映射
const CUDA_QUALITY_CONFIGS = {
  low: {
    crf: 28,
    preset: 'p7',
    profile: 'baseline',
    bitrate: '2M',
    maxrate: '4M',
    bufsize: '4M'
  },
  medium: {
    crf: 23,
    preset: 'p5',
    profile: 'main',
    bitrate: '5M',
    maxrate: '8M',
    bufsize: '8M'
  },
  high: {
    crf: 18,
    preset: 'p4',
    profile: 'high',
    bitrate: '8M',
    maxrate: '12M',
    bufsize: '12M'
  },
  ultra: {
    crf: 15,
    preset: 'p3',
    profile: 'high',
    bitrate: '15M',
    maxrate: '20M',
    bufsize: '20M'
  }
};

// 生成 CUDA 优化的 FFmpeg 参数 (Windows兼容版本)
function generateCudaFfmpegArgs(quality = 'high') {
  const config = CUDA_QUALITY_CONFIGS[quality] || CUDA_QUALITY_CONFIGS.high;
  const optimalConfig = getOptimalCudaConfig();
  
  if (!optimalConfig) {
    return [];
  }

  // Windows系统下简化的CUDA参数，确保兼容性
  return [
    // CUDA 硬件加速
    '-hwaccel', 'cuda',
    '-hwaccel_output_format', 'cuda',
    
    // NVENC 编码器
    '-c:v', 'h264_nvenc',
    
    // NVENC 预设
    '-preset', NVENC_PRESETS[config.preset] || 'medium',
    '-profile:v', config.profile,
    
    // 码率控制
    '-rc', optimalConfig.rcMode,
    '-cq', config.crf.toString(),
    
    // 码率设置
    '-b:v', config.bitrate,
    '-maxrate', config.maxrate,
    '-bufsize', config.bufsize,
    
    // 像素格式
    '-pix_fmt', 'nv12',
    
    // GPU选择
    '-gpu', '0'
  ];
}

// 导出配置
module.exports = {
  getCudaDeviceInfo,
  getOptimalCudaConfig,
  generateCudaFfmpegArgs,
  NVENC_PRESETS,
  CUDA_QUALITY_CONFIGS
};

// 如果直接运行此文件，显示 GPU 信息
if (require.main === module) {
  const devices = getCudaDeviceInfo();
  const config = getOptimalCudaConfig();
  
  console.log('🎮 CUDA 设备信息:');
  devices.forEach((device, index) => {
    console.log(`   GPU ${index}: ${device.name}`);
    console.log(`   显存: ${Math.floor(device.memory / 1024)}GB`);
    console.log(`   CUDA 版本: ${device.cudaVersion}`);
  });
  
  if (config) {
    console.log('\n⚙️ 推荐配置:');
    console.log(`   并发数: ${config.concurrency}`);
    console.log(`   最大内存: ${config.maxMemoryUsage}MB`);
    console.log(`   批处理大小: ${config.batchSize}`);
    console.log(`   编码预设: ${config.preset}`);
    console.log(`   推荐质量: ${config.quality}`);
  } else {
    console.log('\n❌ 未检测到兼容的 CUDA 设备');
  }
}