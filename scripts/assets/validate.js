/**
 * Assets Validator - 验证资源文件的完整性和有效性
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class AssetsValidator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.assetsDir = path.join(this.projectRoot, 'assets');
    this.validationResults = {
      total: 0,
      valid: 0,
      invalid: 0,
      warnings: 0,
      errors: []
    };
  }

  /**
   * 验证图片文件
   */
  validateImageFile(filePath, fileName) {
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    const sizeMB = sizeKB / 1024;
    
    let isValid = true;
    const warnings = [];
    const errors = [];

    // 检查文件大小
    if (stats.size === 0) {
      errors.push('文件为空');
      isValid = false;
    } else if (sizeMB > 10) {
      warnings.push(`文件较大 (${sizeMB.toFixed(2)} MB)，建议优化`);
    }

    // 检查文件扩展名
    const ext = path.extname(fileName).toLowerCase();
    const validExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    if (!validExts.includes(ext)) {
      errors.push(`不支持的图片格式: ${ext}`);
      isValid = false;
    }

    // 根据文件名给出建议
    this.validateByFileName(fileName, warnings);

    return {
      isValid,
      warnings,
      errors,
      size: sizeKB,
      type: 'image'
    };
  }

  /**
   * 根据文件名验证并给出建议
   */
  validateByFileName(fileName, warnings) {
    const recommendations = {
      'todolist-logo.png': {
        suggestedSize: '512x512px',
        notes: '建议使用透明背景的PNG格式'
      },
      'anixops-logo.png': {
        suggestedSize: '512x512px',
        notes: '建议使用透明背景的PNG格式'
      },
      'todolist-interface.png': {
        suggestedSize: '1200x800px',
        notes: '应该是清晰的应用界面截图'
      },
      'messy-notes.png': {
        suggestedSize: '800x600px',
        notes: '应该展现散乱的便签效果'
      },
      'cluttered-desktop.png': {
        suggestedSize: '1920x1080px',
        notes: '应该是真实的桌面截图'
      },
      'busy-calendar.png': {
        suggestedSize: '800x600px',
        notes: '应该展现密集的日程安排'
      },
      'confused-user.png': {
        suggestedSize: '400x400px',
        notes: '应该是表情困惑的人物图像'
      }
    };

    const recommendation = recommendations[fileName];
    if (recommendation) {
      warnings.push(`建议规格: ${recommendation.suggestedSize} - ${recommendation.notes}`);
    }
  }

  /**
   * 验证单个文件
   */
  validateFile(filePath, fileName) {
    console.log(chalk.gray(`  🔍 验证: ${fileName}`));

    try {
      const ext = path.extname(fileName).toLowerCase();
      let result;

      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        result = this.validateImageFile(filePath, fileName);
      } else {
        // 其他文件类型的基本验证
        const stats = fs.statSync(filePath);
        result = {
          isValid: stats.size > 0,
          warnings: [],
          errors: stats.size === 0 ? ['文件为空'] : [],
          size: stats.size / 1024,
          type: 'other'
        };
      }

      // 输出验证结果
      if (result.isValid) {
        console.log(chalk.green(`    ✅ 有效 (${result.size.toFixed(2)} KB)`));
        this.validationResults.valid++;
      } else {
        console.log(chalk.red(`    ❌ 无效`));
        this.validationResults.invalid++;
        this.validationResults.errors.push({
          file: fileName,
          errors: result.errors
        });
      }

      // 显示警告
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          console.log(chalk.yellow(`    ⚠️  ${warning}`));
        });
        this.validationResults.warnings += result.warnings.length;
      }

      // 显示错误
      if (result.errors.length > 0) {
        result.errors.forEach(error => {
          console.log(chalk.red(`    ❌ ${error}`));
        });
      }

      return result;

    } catch (error) {
      console.log(chalk.red(`    ❌ 验证失败: ${error.message}`));
      this.validationResults.invalid++;
      this.validationResults.errors.push({
        file: fileName,
        errors: [error.message]
      });
      return { isValid: false, errors: [error.message] };
    }
  }

  /**
   * 验证所有资源文件
   */
  validateAllAssets() {
    console.log(chalk.blue('🔍 验证资源文件...'));

    if (!fs.existsSync(this.assetsDir)) {
      console.log(chalk.red('❌ assets 文件夹不存在'));
      return false;
    }

    const files = this.getAllAssetFiles(this.assetsDir);
    this.validationResults.total = files.length;

    if (files.length === 0) {
      console.log(chalk.yellow('⚠️  没有找到资源文件'));
      return false;
    }

    files.forEach(file => {
      const filePath = path.join(this.assetsDir, file);
      this.validateFile(filePath, file);
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
   * 生成验证报告
   */
  generateReport() {
    console.log(chalk.blue('\n📊 验证报告'));
    console.log('='.repeat(50));

    const { total, valid, invalid, warnings, errors } = this.validationResults;

    console.log(chalk.gray(`总文件数: ${total}`));
    console.log(chalk.green(`有效文件: ${valid}`));
    console.log(chalk.red(`无效文件: ${invalid}`));
    console.log(chalk.yellow(`警告数量: ${warnings}`));

    if (errors.length > 0) {
      console.log(chalk.red('\n❌ 错误详情:'));
      errors.forEach(error => {
        console.log(chalk.red(`  📁 ${error.file}:`));
        error.errors.forEach(err => {
          console.log(chalk.gray(`    - ${err}`));
        });
      });
    }

    // 给出建议
    console.log(chalk.blue('\n💡 建议:'));
    if (invalid > 0) {
      console.log(chalk.yellow('  1. 修复或替换无效的资源文件'));
      console.log(chalk.yellow('  2. 确保图片文件不为空'));
      console.log(chalk.yellow('  3. 使用支持的文件格式'));
    }
    if (warnings > 0) {
      console.log(chalk.yellow('  4. 考虑优化文件大小和格式'));
      console.log(chalk.yellow('  5. 按照建议规格准备资源文件'));
    }
    if (valid === total && warnings === 0) {
      console.log(chalk.green('  🎉 所有资源文件都完美！'));
    }

    return {
      success: invalid === 0,
      hasWarnings: warnings > 0,
      total,
      valid,
      invalid,
      warnings
    };
  }

  /**
   * 运行验证
   */
  run() {
    console.log(chalk.bold.blue('🔧 Assets Validator - 资源文件验证工具\n'));

    const hasFiles = this.validateAllAssets();
    if (!hasFiles) {
      console.log(chalk.red('\n❌ 验证失败：没有可验证的文件'));
      return { success: false };
    }

    const report = this.generateReport();
    
    console.log(chalk.blue('\n✨ 验证完成！'));
    
    return report;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const validator = new AssetsValidator();
  const result = validator.run();
  
  process.exit(result.success ? 0 : 1);
}

module.exports = AssetsValidator;