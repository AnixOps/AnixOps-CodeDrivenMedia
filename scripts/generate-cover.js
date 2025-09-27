const { execSync } = require('child_process');
const path = require('path');
const { getCudaDeviceInfo, getOptimalCudaConfig } = require('./cuda-config');

/**
 * TodoList宣传封面图片生成脚本
 * 
 * 使用方法:
 * node scripts/generate-cover.js
 * 
 * 选项:
 * --output: 指定输出目录 (默认: ./output)
 * --cuda: 启用 GPU 渲染加速 (需要 NVIDIA GPU)  
 * --format: 图片格式 (png|jpeg, 默认: png)
 * --quality: 图片质量 (仅JPEG, 1-100, 默认: 95)
 * --scale: 输出比例 (0.5-3.0, 默认: 1.0)
 * --frame: 指定输出帧 (0-89, 默认: 60，封面最佳状态)
 */

console.log('🖼️ 开始生成TodoList宣传封面图片...\n');

// 检查参数
const args = process.argv.slice(2);
const enableCuda = args.includes('--cuda') || args.includes('--gpu');
const outputIndex = args.indexOf('--output');
const formatIndex = args.indexOf('--format');
const qualityIndex = args.indexOf('--quality');
const scaleIndex = args.indexOf('--scale');
const frameIndex = args.indexOf('--frame');

const outputDir = outputIndex !== -1 && args[outputIndex + 1] 
  ? args[outputIndex + 1] 
  : './output';
const format = formatIndex !== -1 && args[formatIndex + 1]
  ? args[formatIndex + 1]
  : 'png';
const quality = qualityIndex !== -1 && args[qualityIndex + 1]
  ? parseInt(args[qualityIndex + 1])
  : 95;
const scale = scaleIndex !== -1 && args[scaleIndex + 1]
  ? parseFloat(args[scaleIndex + 1])
  : 1.0;
const frameNumber = frameIndex !== -1 && args[frameIndex + 1]
  ? parseInt(args[frameIndex + 1])
  : 60; // 第60帧是封面动画的最佳状态

// 参数验证
if (!['png', 'jpeg', 'jpg'].includes(format.toLowerCase())) {
  console.error('❌ 错误: 不支持的图片格式。支持的格式: png, jpeg, jpg');
  process.exit(1);
}

if (quality < 1 || quality > 100) {
  console.error('❌ 错误: 图片质量必须在 1-100 之间');
  process.exit(1);
}

if (scale < 0.5 || scale > 3.0) {
  console.error('❌ 错误: 输出比例必须在 0.5-3.0 之间');
  process.exit(1);
}

if (frameNumber < 0 || frameNumber > 89) {
  console.error('❌ 错误: 帧数必须在 0-89 之间');
  process.exit(1);
}

// 确保输出目录存在
const outputPath = path.resolve(outputDir);
console.log(`📁 输出目录: ${outputPath}`);

// GPU 检测和配置
const cudaDevices = getCudaDeviceInfo();
const hasCuda = cudaDevices.length > 0;
const useCuda = enableCuda && hasCuda;
const cudaConfig = useCuda ? getOptimalCudaConfig() : null;

// 设置环境变量
if (useCuda && cudaConfig) {
  process.env.ENABLE_CUDA = 'true';
  process.env.REMOTION_CONCURRENCY = cudaConfig.concurrency.toString();
  console.log('🚀 GPU 渲染加速已启用！');
  console.log(`💡 检测到 GPU: ${cudaDevices[0].name}`);
  console.log(`🎯 显存: ${Math.floor(cudaDevices[0].memory / 1024)}GB`);
  console.log(`⚙️ 并发数: ${cudaConfig.concurrency}`);
} else if (enableCuda && !hasCuda) {
  console.log('⚠️  未检测到 GPU 支持，使用 CPU 渲染');
} else {
  console.log('💻 使用 CPU 渲染模式');
}

try {
  // 封面配置
  const coverConfig = {
    composition: 'TodoListCoverEn',
    width: Math.round(1920 * scale),
    height: Math.round(1080 * scale),
    format: format.toLowerCase(),
    quality: format.toLowerCase() === 'png' ? undefined : quality,
    frame: frameNumber,
    scale: scale,
    useCuda: useCuda
  };

  console.log('📋 封面配置:');
  console.log(`   - 组合ID: ${coverConfig.composition}`);
  console.log(`   - 分辨率: ${coverConfig.width}x${coverConfig.height}`);
  console.log(`   - 格式: ${coverConfig.format.toUpperCase()}`);
  if (coverConfig.quality !== undefined) {
    console.log(`   - 质量: ${coverConfig.quality}%`);
  }
  console.log(`   - 输出帧: ${coverConfig.frame}`);
  console.log(`   - 缩放比例: ${coverConfig.scale}x`);
  console.log(`   - GPU加速: ${coverConfig.useCuda ? '✅ 启用' : '❌ 禁用'}\n`);

  console.log('🎨 开始渲染封面图片...');
  
  // 生成输出文件名（包含时间戳和配置信息）
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const scaleStr = scale !== 1.0 ? `_${scale}x` : '';
  const frameStr = frameNumber !== 60 ? `_f${frameNumber}` : '';
  const outputFile = path.join(outputPath, `todolist-cover-${timestamp}${scaleStr}${frameStr}.${coverConfig.format}`);
  
  // 构建渲染命令
  const baseCommand = [
    'npx remotion still',
    coverConfig.composition,
    outputFile,
    `--frame=${coverConfig.frame}`,
    `--width=${coverConfig.width}`,
    `--height=${coverConfig.height}`,
    '--overwrite'
  ];

  // 格式特定选项
  if (coverConfig.format === 'jpeg' || coverConfig.format === 'jpg') {
    baseCommand.push(`--jpeg-quality=${coverConfig.quality}`);
  }

  // GPU 渲染加速配置 (基于Remotion官方文档)
  if (useCuda && cudaConfig) {
    // 使用 Remotion 官方的 GPU 渲染加速
    baseCommand.push(
      '--gl=angle',  // Windows系统推荐使用angle渲染器
      `--concurrency=${cudaConfig.concurrency}`
    );
    
    console.log(`🎯 使用 GPU 加速渲染 (OpenGL Angle)`);
    console.log(`📐 渲染后端: angle (Windows推荐)`);
    console.log(`💾 最大内存: ${cudaConfig.maxMemoryUsage}MB`);
    console.log(`🔧 并发数: ${cudaConfig.concurrency}`);
  } else {
    baseCommand.push('--concurrency=2');
    console.log('🎯 使用 CPU 软件渲染');
  }

  const renderCommand = baseCommand.join(' ');

  console.log(`执行命令: ${renderCommand}\n`);
  console.log('⏳ 渲染中，请稍候...\n');

  const startTime = Date.now();
  execSync(renderCommand, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);

  console.log('\n✅ 封面图片渲染完成！');
  console.log(`📊 渲染统计:`);
  console.log(`   - 耗时: ${duration}秒`);
  console.log(`   - 输出文件: ${outputFile}`);
  console.log(`   - 文件大小: ${getFileSize(outputFile)}`);
  console.log(`   - 加速模式: ${useCuda ? 'GPU 渲染加速 (OpenGL)' : 'CPU 软件渲染'}`);
  console.log(`   - 图片格式: ${coverConfig.format.toUpperCase()}`);
  console.log(`   - 实际分辨率: ${coverConfig.width}x${coverConfig.height}`);
  console.log(`   - 输出帧: ${coverConfig.frame}`);

} catch (error) {
  console.error('\n❌ 生成失败:', error.message);
  process.exit(1);
}

// 获取文件大小的辅助函数
function getFileSize(filePath) {
  try {
    const fs = require('fs');
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    return `${fileSizeInMB} MB`;
  } catch (error) {
    return '未知';
  }
}

console.log('\n🎉 TodoList宣传封面图片生成完成！');
console.log('\n📝 脚本说明:');
console.log('   该脚本基于TodoListCover组件生成高质量封面图片');
console.log('   支持PNG和JPEG格式，可自定义分辨率和质量');
console.log('   如需调整封面设计，请编辑 src/compositions/TodoListCover.tsx');
console.log('\n💡 使用提示:');
console.log('   - 生成PNG封面: node scripts/generate-cover.js');
console.log('   - GPU加速: node scripts/generate-cover.js --cuda');
console.log('   - JPEG格式: node scripts/generate-cover.js --format jpeg --quality 95');
console.log('   - 2K分辨率: node scripts/generate-cover.js --scale 1.5 --cuda');
console.log('   - 指定输出: node scripts/generate-cover.js --output ./covers --cuda');
console.log('   - 特定帧: node scripts/generate-cover.js --frame 30 --cuda');
console.log('\n🎮 格式选项: png | jpeg');
console.log('📐 比例选项: 0.5 (960x540) | 1.0 (1920x1080) | 1.5 (2880x1620) | 2.0 (3840x2160)');
console.log('💡 提示: 使用 --cuda 参数可大幅提升渲染速度（需要 NVIDIA GPU，使用 OpenGL 加速）');