const { execSync } = require('child_process');
const path = require('path');

/**
 * TodoList宣传视频生成脚本
 * 
 * 使用方法:
 * node scripts/generate-todolist-promo.js
 * 
 * 选项:
 * --preview: 仅预览，不渲染完整视频
 * --output: 指定输出目录 (默认: ./output)
 */

console.log('🎬 开始生成TodoList宣传视频...\n');

// 检查参数
const args = process.argv.slice(2);
const isPreview = args.includes('--preview');
const outputIndex = args.indexOf('--output');
const outputDir = outputIndex !== -1 && args[outputIndex + 1] 
  ? args[outputIndex + 1] 
  : './output';

// 确保输出目录存在
const outputPath = path.resolve(outputDir);
console.log(`📁 输出目录: ${outputPath}`);

try {
  // 视频配置
  const videoConfig = {
    composition: 'TodoListPromo',
    width: 1920,
    height: 1080,
    fps: 60,
    duration: 60, // 60秒
    frames: 1800, // 60秒 * 30fps
  };

  console.log('📋 视频配置:');
  console.log(`   - 组合ID: ${videoConfig.composition}`);
  console.log(`   - 分辨率: ${videoConfig.width}x${videoConfig.height}`);
  console.log(`   - 帧率: ${videoConfig.fps}fps`);
  console.log(`   - 时长: ${videoConfig.duration}秒`);
  console.log(`   - 总帧数: ${videoConfig.frames}帧\n`);

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
    
    // 渲染命令
    const renderCommand = [
      'npx remotion render',
      videoConfig.composition,
      outputFile,
      `--width=${videoConfig.width}`,
      `--height=${videoConfig.height}`,
      `--fps=${videoConfig.fps}`,
      '--codec=h264',
      '--crf=18', // 高质量
      '--audio-codec=aac',
      '--audio-bitrate=192k',
      '--overwrite'
    ].join(' ');

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
console.log('   - 渲染: node scripts/generate-todolist-promo.js');
console.log('   - 指定输出: node scripts/generate-todolist-promo.js --output ./my-videos');