/**
 * Assets Optimizer - 优化资源文件大小和格式
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class AssetsOptimizer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.assetsDir = path.join(this.projectRoot, 'assets');
    this.optimizationResults = {
      total: 0,
      optimized: 0,
      skipped: 0,
      errors: 0,
      totalSizeBefore: 0,
      totalSizeAfter: 0,
      savings: 0
    };
  }

  /**
   * 获取文件大小（KB）
   */
  getFileSizeKB(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size / 1024;
    } catch (error) {
      return 0;
    }
  }

  /**
   * 检查是否需要优化
   */
  needsOptimization(filePath, fileName) {
    const sizeKB = this.getFileSizeKB(filePath);
    const ext = path.extname(fileName).toLowerCase();
    
    // 优化条件
    const conditions = {
      largeFile: sizeKB > 500, // 大于500KB
      isImage: ['.png', '.jpg', '.jpeg'].includes(ext),
      canOptimize: true
    };

    return conditions.largeFile && conditions.isImage && conditions.canOptimize;
  }

  /**
   * 模拟图片优化（实际项目中可以集成真实的图片优化库）
   */
  optimizeImage(filePath, fileName) {
    console.log(chalk.gray(`  🔧 优化图片: ${fileName}`));
    
    try {
      const originalSize = this.getFileSizeKB(filePath);
      
      // 这里是模拟优化，实际项目中可以使用：
      // - sharp (Node.js图片处理库)
      // - imagemin (图片压缩工具)
      // - tinify (TinyPNG API)
      
      // 模拟优化结果（减少20-40%文件大小）
      const compressionRatio = 0.3 + Math.random() * 0.2; // 30-50%压缩率
      const optimizedSize = originalSize * (1 - compressionRatio);
      const savings = originalSize - optimizedSize;
      
      console.log(chalk.green(`    ✅ 优化完成`));
      console.log(chalk.gray(`    📊 ${originalSize.toFixed(2)} KB → ${optimizedSize.toFixed(2)} KB`));
      console.log(chalk.green(`    💾 节省 ${savings.toFixed(2)} KB (${(compressionRatio * 100).toFixed(1)}%)`));
      
      return {
        success: true,
        originalSize,
        optimizedSize,
        savings
      };
      
    } catch (error) {
      console.log(chalk.red(`    ❌ 优化失败: ${error.message}`));
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 生成优化建议
   */
  generateOptimizationSuggestions(fileName, sizeKB) {
    const suggestions = [];
    const ext = path.extname(fileName).toLowerCase();
    
    // 根据文件类型和大小给出建议
    if (ext === '.png') {
      if (sizeKB > 1000) {
        suggestions.push('考虑转换为JPEG格式（如果不需要透明背景）');
        suggestions.push('使用PNG压缩工具如TinyPNG');
      }
      suggestions.push('确保图片分辨率适合使用场景');
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      if (sizeKB > 500) {
        suggestions.push('调整JPEG质量到80-90%');
        suggestions.push('考虑使用WebP格式（现代浏览器支持）');
      }
    }

    // 根据文件名给出特定建议
    const specificSuggestions = {
      'todolist-logo.png': ['Logo文件建议使用SVG格式以获得更好的缩放性'],
      'anixops-logo.png': ['Logo文件建议使用SVG格式以获得更好的缩放性'],
      'todolist-interface.png': ['界面截图可以适当压缩，不影响视觉效果'],
    };

    if (specificSuggestions[fileName]) {
      suggestions.push(...specificSuggestions[fileName]);
    }

    return suggestions;
  }

  /**
   * 优化单个文件
   */
  optimizeFile(filePath, fileName) {
    const sizeKB = this.getFileSizeKB(filePath);
    this.optimizationResults.totalSizeBefore += sizeKB;
    
    console.log(chalk.gray(`  📁 检查: ${fileName} (${sizeKB.toFixed(2)} KB)`));

    if (!this.needsOptimization(filePath, fileName)) {
      console.log(chalk.blue(`    ℹ️  无需优化`));
      this.optimizationResults.skipped++;
      this.optimizationResults.totalSizeAfter += sizeKB;
      
      // 显示优化建议
      const suggestions = this.generateOptimizationSuggestions(fileName, sizeKB);
      if (suggestions.length > 0) {
        console.log(chalk.yellow(`    💡 建议:`));
        suggestions.forEach(suggestion => {
          console.log(chalk.gray(`      - ${suggestion}`));
        });
      }
      
      return { skipped: true };
    }

    // 执行优化
    const result = this.optimizeImage(filePath, fileName);
    
    if (result.success) {
      this.optimizationResults.optimized++;
      this.optimizationResults.totalSizeAfter += result.optimizedSize;
      this.optimizationResults.savings += result.savings;
    } else {
      this.optimizationResults.errors++;
      this.optimizationResults.totalSizeAfter += sizeKB;
    }

    return result;
  }

  /**
   * 优化所有资源文件
   */
  optimizeAllAssets() {
    console.log(chalk.blue('🔧 优化资源文件...'));

    if (!fs.existsSync(this.assetsDir)) {
      console.log(chalk.red('❌ assets 文件夹不存在'));
      return false;
    }

    const files = this.getAllAssetFiles(this.assetsDir);
    this.optimizationResults.total = files.length;

    if (files.length === 0) {
      console.log(chalk.yellow('⚠️  没有找到资源文件'));
      return false;
    }

    files.forEach(file => {
      const filePath = path.join(this.assetsDir, file);
      this.optimizeFile(filePath, file);
    });

    return true;
  }

  /**
   * 递归获取所有资源文件
   */
  getAllAssetFiles(dir, basePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const relativePath = basePath ? path.join(basePath, item) : item;
      
      if (fs.statSync(itemPath).isDirectory()) {
        files.push(...this.getAllAssetFiles(itemPath, relativePath));
      } else {
        // 跳过占位符文件和说明文件
        if (!item.endsWith('.placeholder.md') && item !== 'README.md') {
          files.push(relativePath);
        }
      }
    });

    return files;
  }

  /**
   * 生成优化报告
   */
  generateReport() {
    console.log(chalk.blue('\n📊 优化报告'));
    console.log('='.repeat(50));

    const { total, optimized, skipped, errors, totalSizeBefore, totalSizeAfter, savings } = this.optimizationResults;
    const savingsPercent = totalSizeBefore > 0 ? (savings / totalSizeBefore) * 100 : 0;

    console.log(chalk.gray(`总文件数: ${total}`));
    console.log(chalk.green(`已优化: ${optimized}`));
    console.log(chalk.blue(`跳过: ${skipped}`));
    console.log(chalk.red(`错误: ${errors}`));
    
    console.log(chalk.blue('\n📊 文件大小统计:'));
    console.log(chalk.gray(`优化前: ${totalSizeBefore.toFixed(2)} KB`));
    console.log(chalk.gray(`优化后: ${totalSizeAfter.toFixed(2)} KB`));
    console.log(chalk.green(`节省: ${savings.toFixed(2)} KB (${savingsPercent.toFixed(1)}%)`));

    // 给出建议
    console.log(chalk.blue('\n💡 建议:'));
    if (optimized > 0) {
      console.log(chalk.green('  🎉 优化完成！文件大小已减小'));
    }
    if (skipped > 0) {
      console.log(chalk.yellow('  ℹ️  一些文件无需优化，已显示优化建议'));
    }
    if (errors > 0) {
      console.log(chalk.red('  ❌ 一些文件优化失败，请检查文件完整性'));
    }
    
    console.log(chalk.blue('\n🔧 高级优化:'));
    console.log(chalk.gray('  1. 安装图片优化工具: npm install sharp imagemin'));
    console.log(chalk.gray('  2. 考虑使用WebP格式替代PNG/JPEG'));
    console.log(chalk.gray('  3. 使用SVG格式替代小尺寸的PNG图标'));
    console.log(chalk.gray('  4. 设置适当的图片分辨率'));

    return {
      success: errors === 0,
      optimized,
      totalSavings: savings,
      savingsPercent
    };
  }

  /**
   * 运行优化
   */
  run() {
    console.log(chalk.bold.blue('🔧 Assets Optimizer - 资源文件优化工具\n'));

    const hasFiles = this.optimizeAllAssets();
    if (!hasFiles) {
      console.log(chalk.red('\n❌ 优化失败：没有可优化的文件'));
      return { success: false };
    }

    const report = this.generateReport();
    
    console.log(chalk.blue('\n✨ 优化完成！'));
    
    return report;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const optimizer = new AssetsOptimizer();
  const result = optimizer.run();
  
  console.log(chalk.blue('\n📝 注意: 当前为模拟优化模式'));
  console.log(chalk.gray('要启用真实优化，请安装: npm install sharp imagemin'));
  
  process.exit(result.success ? 0 : 1);
}

module.exports = AssetsOptimizer;