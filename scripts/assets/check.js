/**
 * Assets Checker - 检查项目所需的资源文件
 * 扫描模板文件，检查所需资源是否存在
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class AssetsChecker {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.assetsDir = path.join(this.projectRoot, 'assets');
    this.templatesDir = path.join(this.projectRoot, 'templates');
    this.requiredAssets = new Set();
    this.missingAssets = [];
    this.existingAssets = [];
  }

  /**
   * 扫描实际使用的资源文件
   */
  scanActualAssets() {
    console.log(chalk.blue('📁 扫描实际使用的资源文件...'));
    
    // 扫描src目录中的实际引用
    const srcDir = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcDir)) {
      this.scanDirectoryForAssets(srcDir);
    }
    
    // 扫描public目录（如果存在）
    const publicDir = path.join(this.projectRoot, 'public');
    if (fs.existsSync(publicDir)) {
      this.scanDirectoryForAssets(publicDir);
    }

    console.log(chalk.green(`✅ 实际扫描完成，发现 ${this.requiredAssets.size} 个使用中的资源`));
  }

  /**
   * 扫描模板文件，提取所需的资源文件
   */
  scanTemplates() {
    console.log(chalk.blue('📁 扫描模板文件...'));
    
    if (!fs.existsSync(this.templatesDir)) {
      console.log(chalk.red('❌ 模板文件夹不存在'));
      return;
    }

    const templateFiles = fs.readdirSync(this.templatesDir)
      .filter(file => file.endsWith('.json'));

    templateFiles.forEach(file => {
      const filePath = path.join(this.templatesDir, file);
      console.log(chalk.gray(`  📄 扫描: ${file}`));
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const template = JSON.parse(content);
        
        this.extractAssetsFromTemplate(template, file);
      } catch (error) {
        console.log(chalk.yellow(`  ⚠️  解析失败: ${file} - ${error.message}`));
      }
    });

    console.log(chalk.green(`✅ 模板扫描完成，发现 ${this.requiredAssets.size} 个模板引用资源`));
  }

  /**
   * 扫描目录中的资源引用
   */
  scanDirectoryForAssets(dir) {
    const files = this.getAllFiles(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      
      // 扫描代码文件中的资源引用
      if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          // 查找staticFile(), import语句等
          const assetMatches = content.match(/staticFile\(['"`]([^'"`]+)['"`]\)|import.*['"`]([^'"`]+\.(png|jpg|jpeg|gif|svg|mp3|wav|mp4))['"`]/g);
          if (assetMatches) {
            assetMatches.forEach(match => {
              const assetMatch = match.match(/(['"`])([^'"`]+\.(png|jpg|jpeg|gif|svg|mp3|wav|mp4))\1/);
              if (assetMatch) {
                const assetPath = assetMatch[2];
                this.requiredAssets.add(assetPath.replace(/^\.\//, ''));
                console.log(chalk.gray(`    🎯 发现实际使用: ${assetPath}`));
              }
            });
          }
        } catch (error) {
          // 忽略读取错误
        }
      }
    });
  }

  /**
   * 获取目录下所有文件
   */
  getAllFiles(dir) {
    const files = [];
    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
          files.push(...this.getAllFiles(itemPath).map(f => path.join(item, f)));
        } else {
          files.push(item);
        }
      });
    } catch (error) {
      // 忽略错误
    }
    return files;
  }

  /**
   * 从模板中提取资源路径
   */
  extractAssetsFromTemplate(obj, templateName) {
    if (typeof obj === 'string') {
      // 匹配 assets/ 开头的路径
      const assetMatch = obj.match(/^assets\/([^"'\s]+)/);
      if (assetMatch) {
        const assetPath = assetMatch[1];
        this.requiredAssets.add(assetPath);
        console.log(chalk.gray(`    🎯 发现资源: ${assetPath}`));
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(item => this.extractAssetsFromTemplate(item, templateName));
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(value => this.extractAssetsFromTemplate(value, templateName));
    }
  }

  /**
   * 检查资源文件是否存在
   */
  checkAssets() {
    console.log(chalk.blue('\n🔍 检查资源文件...'));

    if (!fs.existsSync(this.assetsDir)) {
      console.log(chalk.red('❌ assets 文件夹不存在'));
      fs.mkdirSync(this.assetsDir, { recursive: true });
      console.log(chalk.green('✅ 已创建 assets 文件夹'));
    }

    this.requiredAssets.forEach(asset => {
      const assetPath = path.join(this.assetsDir, asset);
      if (fs.existsSync(assetPath)) {
        this.existingAssets.push(asset);
        console.log(chalk.green(`  ✅ ${asset}`));
      } else {
        this.missingAssets.push(asset);
        console.log(chalk.red(`  ❌ ${asset} (缺失)`));
      }
    });
  }

  /**
   * 创建缺失资源的占位符文件
   */
  createPlaceholders() {
    if (this.missingAssets.length === 0) {
      console.log(chalk.green('\n🎉 所有资源文件都存在！'));
      return;
    }

    console.log(chalk.blue('\n📝 创建占位符文件...'));

    this.missingAssets.forEach(asset => {
      const assetPath = path.join(this.assetsDir, asset);
      const dir = path.dirname(assetPath);
      
      // 确保目录存在
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 创建占位符文件
      if (asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.jpeg')) {
        // 对于图片文件，创建一个说明文件
        const placeholderContent = `# 占位符: ${asset}

这是一个占位符文件。请替换为实际的图片文件。

文件信息：
- 文件名: ${asset}
- 类型: 图片文件
- 状态: 需要替换

请提供合适的图片文件来替换此占位符。
`;
        fs.writeFileSync(assetPath + '.placeholder.md', placeholderContent);
        console.log(chalk.yellow(`  📄 已创建占位符说明: ${asset}.placeholder.md`));
      } else {
        // 其他文件类型的占位符
        fs.writeFileSync(assetPath, `# Placeholder for ${asset}\nPlease replace with actual content.`);
        console.log(chalk.yellow(`  📄 已创建占位符: ${asset}`));
      }
    });
  }

  /**
   * 生成资源报告
   */
  generateReport() {
    console.log(chalk.blue('\n📊 资源文件报告'));
    console.log('='.repeat(50));
    
    console.log(chalk.green(`✅ 存在的资源文件 (${this.existingAssets.length}):`));
    this.existingAssets.forEach(asset => {
      const assetPath = path.join(this.assetsDir, asset);
      const stats = fs.statSync(assetPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(chalk.gray(`  📁 ${asset} (${sizeKB} KB)`));
    });

    if (this.missingAssets.length > 0) {
      console.log(chalk.red(`\n❌ 缺失的资源文件 (${this.missingAssets.length}):`));
      this.missingAssets.forEach(asset => {
        console.log(chalk.gray(`  📁 ${asset}`));
      });
    }

    // 建议
    console.log(chalk.blue('\n💡 建议:'));
    if (this.missingAssets.length > 0) {
      console.log(chalk.yellow('  1. 准备缺失的资源文件'));
      console.log(chalk.yellow('  2. 将文件放入 assets 文件夹'));
      console.log(chalk.yellow('  3. 运行 npm run assets:validate 验证'));
    } else {
      console.log(chalk.green('  🎉 所有资源文件都已准备就绪！'));
    }
  }

  /**
   * 运行完整检查
   */
  run() {
    console.log(chalk.bold.blue('🔧 Assets Checker - 资源文件检查工具\n'));
    
    // 首先检查实际使用的资源
    this.scanActualAssets();
    const actualAssets = new Set(this.requiredAssets);
    
    // 然后检查模板引用（但不作为必需项）
    this.requiredAssets.clear();
    this.scanTemplates();
    const templateAssets = new Set(this.requiredAssets);
    
    // 合并实际使用的资源（优先级更高）
    this.requiredAssets = new Set([...actualAssets]);
    
    console.log(chalk.blue('\n📊 资源分析:'));
    console.log(chalk.green(`  实际使用: ${actualAssets.size} 个资源`));
    console.log(chalk.gray(`  模板引用: ${templateAssets.size} 个资源`));
    
    if (actualAssets.size === 0 && templateAssets.size > 0) {
      console.log(chalk.yellow('  ℹ️  当前项目使用代码生成内容，无需PNG文件'));
      console.log(chalk.gray('  模板中的PNG引用仅用于配置说明'));
    }
    
    this.checkAssets();
    this.createPlaceholders();
    this.generateReport();
    
    console.log(chalk.blue('\n✨ 检查完成！'));
    
    // 返回检查结果
    return {
      total: this.requiredAssets.size,
      actualAssets: actualAssets.size,
      templateAssets: templateAssets.size,
      existing: this.existingAssets.length,
      missing: this.missingAssets.length,
      success: this.missingAssets.length === 0 || actualAssets.size === 0
    };
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const checker = new AssetsChecker();
  const result = checker.run();
  
  process.exit(result.success ? 0 : 1);
}

module.exports = AssetsChecker;