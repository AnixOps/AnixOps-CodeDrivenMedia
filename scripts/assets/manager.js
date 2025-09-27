/**
 * Assets Manager - 资源文件管理主脚本
 * 统一管理所有资源文件相关操作
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// 导入各个功能模块
const AssetsChecker = require('./check');
const AssetsValidator = require('./validate');
const AssetsOptimizer = require('./optimize');
const AssetsBackup = require('./backup');

class AssetsManager {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.assetsDir = path.join(this.projectRoot, 'assets');
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(chalk.bold.blue('🔧 Assets Manager - 资源文件管理工具\n'));
    
    console.log(chalk.blue('📋 可用命令:'));
    console.log(chalk.gray('  check         - 检查所需的资源文件'));
    console.log(chalk.gray('  validate      - 验证资源文件的完整性'));
    console.log(chalk.gray('  optimize      - 优化资源文件大小'));
    console.log(chalk.gray('  backup        - 创建资源文件备份'));
    console.log(chalk.gray('  restore       - 恢复资源文件备份'));
    console.log(chalk.gray('  list-backups  - 列出所有备份'));
    console.log(chalk.gray('  cleanup       - 清理旧备份'));
    console.log(chalk.gray('  init          - 初始化资源文件系统'));
    console.log(chalk.gray('  status        - 显示资源文件状态'));
    console.log(chalk.gray('  full-check    - 执行完整检查流程'));
    console.log(chalk.gray('  help          - 显示帮助信息'));
    
    console.log(chalk.blue('\n📖 使用示例:'));
    console.log(chalk.gray('  npm run assets:check      - 检查缺失的资源文件'));
    console.log(chalk.gray('  npm run assets:validate   - 验证所有资源文件'));
    console.log(chalk.gray('  npm run assets:optimize   - 优化图片文件大小'));
    console.log(chalk.gray('  npm run assets:backup     - 备份当前资源文件'));
    console.log(chalk.gray('  npm run assets:status     - 查看资源状态总览'));
    console.log(chalk.gray('  npm run assets:full-check - 执行完整检查'));
  }

  /**
   * 初始化资源文件系统
   */
  async init() {
    console.log(chalk.bold.blue('🚀 初始化资源文件系统...\n'));

    // 1. 创建assets目录
    if (!fs.existsSync(this.assetsDir)) {
      fs.mkdirSync(this.assetsDir, { recursive: true });
      console.log(chalk.green('✅ 创建 assets 目录'));
    }

    // 2. 检查所需资源
    console.log(chalk.blue('\n📋 步骤1: 检查所需资源'));
    const checker = new AssetsChecker();
    const checkResult = checker.run();

    // 3. 创建初始备份
    if (checkResult.existing > 0) {
      console.log(chalk.blue('\n💾 步骤2: 创建初始备份'));
      const backup = new AssetsBackup();
      backup.createBackup();
    }

    console.log(chalk.bold.green('\n🎉 初始化完成!'));
    console.log(chalk.gray('下一步: 将所需的图片文件放入 assets 文件夹'));
  }

  /**
   * 显示资源文件状态
   */
  async status() {
    console.log(chalk.bold.blue('📊 资源文件状态总览\n'));

    // 检查assets目录
    if (!fs.existsSync(this.assetsDir)) {
      console.log(chalk.red('❌ assets 目录不存在'));
      console.log(chalk.gray('运行 npm run assets:init 初始化'));
      return;
    }

    // 1. 基本信息
    console.log(chalk.blue('📁 目录信息:'));
    console.log(chalk.gray(`  路径: ${this.assetsDir}`));
    
    try {
      const files = this.getAllFiles(this.assetsDir);
      const totalSize = files.reduce((size, file) => {
        try {
          const stats = fs.statSync(path.join(this.assetsDir, file));
          return size + stats.size;
        } catch {
          return size;
        }
      }, 0);

      console.log(chalk.gray(`  文件数: ${files.length}`));
      console.log(chalk.gray(`  总大小: ${(totalSize / 1024).toFixed(2)} KB`));
    } catch (error) {
      console.log(chalk.red(`  ❌ 读取目录失败: ${error.message}`));
    }

    // 2. 快速检查
    console.log(chalk.blue('\n🔍 快速检查:'));
    const checker = new AssetsChecker();
    const checkResult = checker.run();

    // 3. 备份信息
    console.log(chalk.blue('\n💾 备份信息:'));
    const backup = new AssetsBackup();
    const backups = backup.listBackups();
    
    if (backups.length === 0) {
      console.log(chalk.yellow('  ⚠️  没有备份文件'));
    } else {
      console.log(chalk.green(`  ✅ 找到 ${backups.length} 个备份`));
      const latest = backups[0];
      if (latest.timestamp) {
        const date = new Date(latest.timestamp).toLocaleString();
        console.log(chalk.gray(`  最新备份: ${date}`));
      }
    }

    // 4. 建议
    console.log(chalk.blue('\n💡 建议操作:'));
    if (checkResult.missing > 0) {
      console.log(chalk.yellow('  🔧 运行完整检查: npm run assets:full-check'));
      console.log(chalk.yellow('  📁 添加缺失的资源文件'));
    }
    if (checkResult.existing > 0 && backups.length === 0) {
      console.log(chalk.yellow('  💾 创建备份: npm run assets:backup'));
    }
    if (checkResult.existing > 0) {
      console.log(chalk.blue('  ✅ 验证文件: npm run assets:validate'));
      console.log(chalk.blue('  🔧 优化文件: npm run assets:optimize'));
    }
  }

  /**
   * 执行完整检查流程
   */
  async fullCheck() {
    console.log(chalk.bold.blue('🔧 执行完整资源检查流程\n'));

    let results = {
      check: null,
      validate: null,
      optimize: null,
      backup: null
    };

    try {
      // 1. 检查所需资源
      console.log(chalk.blue('📋 步骤1: 检查所需资源'));
      console.log('='.repeat(50));
      const checker = new AssetsChecker();
      results.check = checker.run();

      if (results.check.existing === 0) {
        console.log(chalk.yellow('\n⚠️  没有资源文件，跳过后续步骤'));
        console.log(chalk.gray('请先添加资源文件，然后重新运行检查'));
        return results;
      }

      // 2. 验证资源文件
      console.log(chalk.blue('\n🔍 步骤2: 验证资源文件'));
      console.log('='.repeat(50));
      const validator = new AssetsValidator();
      results.validate = validator.run();

      // 3. 优化建议
      console.log(chalk.blue('\n🔧 步骤3: 优化分析'));
      console.log('='.repeat(50));
      const optimizer = new AssetsOptimizer();
      results.optimize = optimizer.run();

      // 4. 备份检查
      console.log(chalk.blue('\n💾 步骤4: 备份状态'));
      console.log('='.repeat(50));
      const backup = new AssetsBackup();
      const backups = backup.listBackups();
      
      if (backups.length === 0) {
        console.log(chalk.yellow('⚠️  建议创建备份'));
        console.log(chalk.gray('运行: npm run assets:backup'));
      } else {
        console.log(chalk.green(`✅ 找到 ${backups.length} 个备份`));
      }

      // 5. 总结报告
      console.log(chalk.bold.blue('\n📊 完整检查报告'));
      console.log('='.repeat(50));
      
      console.log(chalk.blue('🔍 检查结果:'));
      console.log(chalk.gray(`  所需资源: ${results.check.total}`));
      console.log(chalk.green(`  已存在: ${results.check.existing}`));
      console.log(chalk.red(`  缺失: ${results.check.missing}`));

      if (results.validate) {
        console.log(chalk.blue('\n✅ 验证结果:'));
        console.log(chalk.green(`  有效文件: ${results.validate.valid}`));
        console.log(chalk.red(`  无效文件: ${results.validate.invalid}`));
        console.log(chalk.yellow(`  警告数量: ${results.validate.warnings}`));
      }

      if (results.optimize && results.optimize.optimized > 0) {
        console.log(chalk.blue('\n🔧 优化结果:'));
        console.log(chalk.green(`  已优化: ${results.optimize.optimized} 个文件`));
        console.log(chalk.green(`  节省空间: ${results.optimize.totalSavings.toFixed(2)} KB`));
      }

      // 6. 最终建议
      console.log(chalk.blue('\n💡 最终建议:'));
      const suggestions = [];
      
      if (results.check.missing > 0) {
        suggestions.push('添加缺失的资源文件');
      }
      if (results.validate && results.validate.invalid > 0) {
        suggestions.push('修复无效的资源文件');
      }
      if (backups.length === 0) {
        suggestions.push('创建资源文件备份');
      }
      if (results.validate && results.validate.warnings > 0) {
        suggestions.push('考虑优化资源文件');
      }

      if (suggestions.length === 0) {
        console.log(chalk.green('  🎉 所有检查都通过了！'));
      } else {
        suggestions.forEach((suggestion, index) => {
          console.log(chalk.yellow(`  ${index + 1}. ${suggestion}`));
        });
      }

    } catch (error) {
      console.log(chalk.red(`\n❌ 检查过程中出现错误: ${error.message}`));
      return { success: false, error: error.message };
    }

    console.log(chalk.bold.green('\n✨ 完整检查完成！'));
    return results;
  }

  /**
   * 获取所有文件
   */
  getAllFiles(dir, basePath = '') {
    const files = [];
    try {
      const items = fs.readdirSync(dir);

      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const relativePath = basePath ? path.join(basePath, item) : item;
        
        if (fs.statSync(itemPath).isDirectory()) {
          files.push(...this.getAllFiles(itemPath, relativePath));
        } else {
          if (!item.endsWith('.placeholder.md') && item !== 'README.md') {
            files.push(relativePath);
          }
        }
      });
    } catch (error) {
      // 忽略读取错误
    }

    return files;
  }

  /**
   * 运行指定命令
   */
  async run(command, ...args) {
    switch (command) {
      case 'check':
        const checker = new AssetsChecker();
        return checker.run();

      case 'validate':
        const validator = new AssetsValidator();
        return validator.run();

      case 'optimize':
        const optimizer = new AssetsOptimizer();
        return optimizer.run();

      case 'backup':
        const backup = new AssetsBackup();
        return backup.createBackup();

      case 'restore':
        const restoreBackup = new AssetsBackup();
        return restoreBackup.restoreBackup(args[0]);

      case 'list-backups':
        const listBackup = new AssetsBackup();
        return listBackup.listBackups();

      case 'cleanup':
        const cleanupBackup = new AssetsBackup();
        return cleanupBackup.cleanupOldBackups(parseInt(args[0]) || 5);

      case 'init':
        return this.init();

      case 'status':
        return this.status();

      case 'full-check':
        return this.fullCheck();

      case 'help':
      default:
        this.showHelp();
        return;
    }
  }
}

// 命令行接口
if (require.main === module) {
  const manager = new AssetsManager();
  const command = process.argv[2] || 'help';
  const args = process.argv.slice(3);

  manager.run(command, ...args)
    .then(result => {
      if (result && typeof result === 'object' && result.success === false) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.log(chalk.red(`\n❌ 执行失败: ${error.message}`));
      process.exit(1);
    });
}

module.exports = AssetsManager;