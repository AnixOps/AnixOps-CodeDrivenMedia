const { execSync } = require('child_process');
const path = require('path');
const { getCudaDeviceInfo, getOptimalCudaConfig } = require('./cuda-config');

/**
 * TodoList宣传视频生成脚本
 * 
 * 使用方法:
 * node scripts/generate-todolist-promo-en.js
 * 
 * 选项:
 * --preview: 仅预览，不渲染完整视频
 * --output: 指定输出目录 (默认: ./output)
 * --cuda: 启用 GPU 渲染加速 (需要 NVIDIA GPU)
 * --gpu: 启用 GPU 加速 (自动检测)
 * --quality: 设置视频质量 (low|medium|high|ultra, 默认: high)
 */

console.log('🎬 开始生成TodoList宣传视频...\n');

// 检查参数
const args = process.argv.slice(2);
const isPreview = args.includes('--preview');
const enableCuda = args.includes('--cuda') || args.includes('--gpu');
const outputIndex = args.indexOf('--output');
const qualityIndex = args.indexOf('--quality');
const outputDir = outputIndex !== -1 && args[outputIndex + 1] 
  ? args[outputIndex + 1] 
  : './output';
const quality = qualityIndex !== -1 && args[qualityIndex + 1]
  ? args[qualityIndex + 1]
  : 'high';

// 确保输出目录存在
const outputPath = path.resolve(outputDir);
console.log(`📁 输出目录: ${outputPath}`);

// CUDA 检测和配置
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
  console.log(`📊 推荐质量: ${cudaConfig.quality}`);
} else if (enableCuda && !hasCuda) {
  console.log('⚠️  未检测到 GPU 支持，使用 CPU 渲染');
} else {
  console.log('💻 使用 CPU 渲染模式');
}

// 质量配置映射
const qualityConfigs = {
  low: { crf: 28, scale: 0.5, fps: 24 },
  medium: { crf: 23, scale: 0.75, fps: 30 },
  high: { crf: 18, scale: 1, fps: 60 },
  ultra: { crf: 15, scale: 2, fps: 120 }
};

const selectedQuality = qualityConfigs[quality] || qualityConfigs.high;

try {
  // 视频配置
  const videoConfig = {
    composition: 'TodoListPromoEn',
    width: 1920,
    height: 1080,
    fps: selectedQuality.fps,
    duration: 60, // 60秒
    frames: 60 * selectedQuality.fps, // 基于帧率计算总帧数
    quality: quality,
    useCuda: useCuda
  };

  console.log('📋 视频配置:');
  console.log(`   - 组合ID: ${videoConfig.composition}`);
  console.log(`   - 分辨率: ${videoConfig.width}x${videoConfig.height}`);
  console.log(`   - 帧率: ${videoConfig.fps}fps`);
  console.log(`   - 时长: ${videoConfig.duration}秒`);
  console.log(`   - 总帧数: ${videoConfig.frames}帧`);
  console.log(`   - 质量: ${videoConfig.quality}`);
  console.log(`   - GPU加速: ${videoConfig.useCuda ? '✅ 启用' : '❌ 禁用'}\n`);

  if (isPreview) {
    console.log('👀 启动预览模式...');
    // 启动Remotion Studio预览
    const previewCommand = `npx remotion studio`;
    console.log(`执行命令: ${previewCommand}`);
    execSync(previewCommand, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
  } else {
    console.log('🎥 开始渲染完整视频...');
    
    // 生成输出文件名（包含时间戳）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const outputFile = path.join(outputPath, `todolist-promo-${timestamp}.mp4`);
    
    // 构建渲染命令
    const baseCommand = [
      'npx remotion render',
      videoConfig.composition,
      outputFile,
      `--width=${Math.round(videoConfig.width * selectedQuality.scale)}`,
      `--height=${Math.round(videoConfig.height * selectedQuality.scale)}`,
      `--fps=${videoConfig.fps}`,
      '--audio-codec=aac',
      '--audio-bitrate=192k',
      '--overwrite'
    ];

    // GPU 渲染加速配置 (基于Remotion官方文档)
    if (useCuda && cudaConfig) {
      // 使用 Remotion 官方的 GPU 渲染加速
      baseCommand.push(
        '--gl=angle',  // Windows系统推荐使用angle渲染器
        '--codec=h264',
        '--pixel-format=yuv420p',
        `--concurrency=${cudaConfig.concurrency}`,
        '--video-bitrate=24M'  // 使用码率控制而不是CRF
      );
      
      console.log(`🎯 使用 GPU 加速渲染 (OpenGL Angle)`);
      console.log(`📐 渲染后端: angle (Windows推荐)`);
      console.log(`💾 最大内存: ${cudaConfig.maxMemoryUsage}MB`);
      console.log(`🔧 并发数: ${cudaConfig.concurrency}`);
      console.log(`⚡ 视频码率: 8M (优化文件大小)`);
    } else {
      baseCommand.push(
        '--codec=h264',
        '--pixel-format=yuv420p',
        '--concurrency=2',
        `--crf=${selectedQuality.crf}`  // CPU渲染使用CRF
      );
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

    console.log('\n✅ 视频渲染完成！');
    console.log(`📊 渲染统计:`);
    console.log(`   - 耗时: ${duration}秒`);
    console.log(`   - 输出文件: ${outputFile}`);
    console.log(`   - 文件大小: ${getFileSize(outputFile)}`);
    console.log(`   - 加速模式: ${useCuda ? 'GPU 渲染加速 (OpenGL)' : 'CPU 软件渲染'}`);
    console.log(`   - 视频质量: ${quality}`);
    console.log(`   - 实际分辨率: ${Math.round(videoConfig.width * selectedQuality.scale)}x${Math.round(videoConfig.height * selectedQuality.scale)}`);
  }

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

console.log('\n🎉 TodoList宣传视频生成完成！');
console.log('\n📝 脚本说明:');
console.log('   该脚本基于您提供的60秒宣传视频脚本生成');
console.log('   包含6个场景：痛点呈现、解决方案、功能展示、跨平台特性、品牌理念、行动号召');
console.log('   如需调整内容，请编辑 src/compositions/TodoListPromo.tsx');
console.log('\n💡 使用提示:');
console.log('   - 预览: node scripts/generate-todolist-promo.js --preview');
console.log('   - CPU渲染: node scripts/generate-todolist-promo.js');
console.log('   - GPU加速: node scripts/generate-todolist-promo.js --cuda');
console.log('   - 指定质量: node scripts/generate-todolist-promo.js --quality ultra --cuda');
console.log('   - 指定输出: node scripts/generate-todolist-promo.js --output ./my-videos --cuda');
console.log('\n🎮 质量选项: low | medium | high | ultra');
console.log('💡 提示: 使用 --cuda 参数可大幅提升渲染速度（需要 NVIDIA GPU，使用 OpenGL 加速）');