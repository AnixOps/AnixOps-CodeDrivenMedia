/**
 * Assets Backup & Restore - 备份和恢复资源文件
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class AssetsBackup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.assetsDir = path.join(this.projectRoot, 'assets');
    this.backupsDir = path.join(this.projectRoot, 'backups', 'assets');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * 确保备份目录存在
   */
  ensureBackupDir() {
    if (!fs.existsSync(this.backupsDir)) {
      fs.mkdirSync(this.backupsDir, { recursive: true });
      console.log(chalk.green(`✅ 创建备份目录: ${this.backupsDir}`));
    }
  }

  /**
   * 复制文件
   */
  copyFile(src, dest) {
    try {
      // 确保目标目录存在
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.copyFileSync(src, dest);
      return true;
    } catch (error) {
      console.log(chalk.red(`❌ 复制失败: ${src} -> ${dest}: ${error.message}`));
      return false;
    }
  }

  /**
   * 递归复制目录
   */
  copyDirectory(src, dest) {
    if (!fs.existsSync(src)) {
      return { success: false, error: '源目录不存在' };
    }

    let copiedFiles = 0;
    let errors = 0;

    const copyRecursive = (srcPath, destPath) => {
      const items = fs.readdirSync(srcPath);

      items.forEach(item => {
        const srcItemPath = path.join(srcPath, item);
        const destItemPath = path.join(destPath, item);

        if (fs.statSync(srcItemPath).isDirectory()) {
          copyRecursive(srcItemPath, destItemPath);
        } else {
          if (this.copyFile(srcItemPath, destItemPath)) {
            copiedFiles++;
            console.log(chalk.gray(`  📁 ${path.relative(src, srcItemPath)}`));
          } else {
            errors++;
          }
        }
      });
    };

    try {
      copyRecursive(src, dest);
      return { success: true, copiedFiles, errors };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 创建备份
   */
  createBackup() {
    console.log(chalk.blue('💾 创建资源文件备份...'));

    if (!fs.existsSync(this.assetsDir)) {
      console.log(chalk.red('❌ assets 文件夹不存在，无法备份'));
      return { success: false };
    }

    this.ensureBackupDir();

    const backupName = `assets-backup-${this.timestamp}`;
    const backupPath = path.join(this.backupsDir, backupName);

    console.log(chalk.gray(`📂 备份到: ${backupPath}`));

    const result = this.copyDirectory(this.assetsDir, backupPath);

    if (result.success) {
      console.log(chalk.green(`✅ 备份完成! 复制了 ${result.copiedFiles} 个文件`));
      
      if (result.errors > 0) {
        console.log(chalk.yellow(`⚠️  ${result.errors} 个文件复制失败`));
      }

      // 创建备份信息文件
      const backupInfo = {
        timestamp: new Date().toISOString(),
        backupName,
        totalFiles: result.copiedFiles,
        errors: result.errors,
        sourceDir: this.assetsDir,
        backupDir: backupPath
      };

      fs.writeFileSync(
        path.join(backupPath, 'backup-info.json'),
        JSON.stringify(backupInfo, null, 2)
      );

      return { 
        success: true, 
        backupName, 
        backupPath, 
        copiedFiles: result.copiedFiles,
        errors: result.errors
      };
    } else {
      console.log(chalk.red(`❌ 备份失败: ${result.error}`));
      return { success: false, error: result.error };
    }
  }

  /**
   * 列出所有备份
   */
  listBackups() {
    console.log(chalk.blue('📋 资源文件备份列表:'));

    if (!fs.existsSync(this.backupsDir)) {
      console.log(chalk.yellow('⚠️  没有找到备份目录'));
      return [];
    }

    const backups = fs.readdirSync(this.backupsDir)
      .filter(item => {
        const itemPath = path.join(this.backupsDir, item);
        return fs.statSync(itemPath).isDirectory() && item.startsWith('assets-backup-');
      })
      .map(backupName => {
        const backupPath = path.join(this.backupsDir, backupName);
        const infoPath = path.join(backupPath, 'backup-info.json');
        
        let info = { backupName, path: backupPath };
        
        if (fs.existsSync(infoPath)) {
          try {
            const backupInfo = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
            info = { ...info, ...backupInfo };
          } catch (error) {
            console.log(chalk.yellow(`⚠️  无法读取备份信息: ${backupName}`));
          }
        }

        return info;
      })
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    if (backups.length === 0) {
      console.log(chalk.yellow('⚠️  没有找到资源文件备份'));
      return [];
    }

    backups.forEach((backup, index) => {
      const date = backup.timestamp ? new Date(backup.timestamp).toLocaleString() : '未知时间';
      const files = backup.totalFiles || '未知';
      
      console.log(chalk.gray(`  ${index + 1}. ${backup.backupName}`));
      console.log(chalk.gray(`     时间: ${date}`));
      console.log(chalk.gray(`     文件数: ${files}`));
      if (backup.errors && backup.errors > 0) {
        console.log(chalk.yellow(`     错误: ${backup.errors}`));
      }
      console.log(chalk.gray(`     路径: ${backup.path}`));
      console.log('');
    });

    return backups;
  }

  /**
   * 恢复备份
   */
  restoreBackup(backupName) {
    console.log(chalk.blue(`🔄 恢复备份: ${backupName}`));

    const backupPath = path.join(this.backupsDir, backupName);

    if (!fs.existsSync(backupPath)) {
      console.log(chalk.red(`❌ 备份不存在: ${backupName}`));
      return { success: false, error: '备份不存在' };
    }

    // 备份当前的assets目录（如果存在）
    if (fs.existsSync(this.assetsDir)) {
      console.log(chalk.yellow('⚠️  当前assets目录将被替换'));
      const currentBackupName = `assets-current-${this.timestamp}`;
      const currentBackupPath = path.join(this.backupsDir, currentBackupName);
      
      console.log(chalk.gray(`💾 备份当前assets到: ${currentBackupName}`));
      const backupResult = this.copyDirectory(this.assetsDir, currentBackupPath);
      
      if (backupResult.success) {
        console.log(chalk.green(`✅ 当前assets已备份`));
      } else {
        console.log(chalk.red(`❌ 备份当前assets失败: ${backupResult.error}`));
        return { success: false, error: '备份当前assets失败' };
      }

      // 删除当前assets目录
      try {
        this.removeDirectory(this.assetsDir);
        console.log(chalk.green('✅ 清除当前assets目录'));
      } catch (error) {
        console.log(chalk.red(`❌ 清除当前assets目录失败: ${error.message}`));
        return { success: false, error: '清除当前目录失败' };
      }
    }

    // 恢复备份
    const restoreResult = this.copyDirectory(backupPath, this.assetsDir);

    if (restoreResult.success) {
      console.log(chalk.green(`✅ 恢复完成! 恢复了 ${restoreResult.copiedFiles} 个文件`));
      
      if (restoreResult.errors > 0) {
        console.log(chalk.yellow(`⚠️  ${restoreResult.errors} 个文件恢复失败`));
      }

      return { 
        success: true, 
        restoredFiles: restoreResult.copiedFiles,
        errors: restoreResult.errors
      };
    } else {
      console.log(chalk.red(`❌ 恢复失败: ${restoreResult.error}`));
      return { success: false, error: restoreResult.error };
    }
  }

  /**
   * 删除目录
   */
  removeDirectory(dir) {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        const curPath = path.join(dir, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          this.removeDirectory(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dir);
    }
  }

  /**
   * 清理旧备份
   */
  cleanupOldBackups(keepCount = 5) {
    console.log(chalk.blue(`🧹 清理旧备份 (保留最新 ${keepCount} 个)...`));

    const backups = this.listBackups();
    
    if (backups.length <= keepCount) {
      console.log(chalk.green(`✅ 当前有 ${backups.length} 个备份，无需清理`));
      return { success: true, cleaned: 0 };
    }

    const toDelete = backups.slice(keepCount);
    let cleaned = 0;

    toDelete.forEach(backup => {
      try {
        this.removeDirectory(backup.path);
        console.log(chalk.gray(`  🗑️  删除: ${backup.backupName}`));
        cleaned++;
      } catch (error) {
        console.log(chalk.red(`❌ 删除失败: ${backup.backupName}: ${error.message}`));
      }
    });

    console.log(chalk.green(`✅ 清理完成，删除了 ${cleaned} 个旧备份`));
    return { success: true, cleaned };
  }
}

// 命令行接口
if (require.main === module) {
  const backup = new AssetsBackup();
  const command = process.argv[2];

  switch (command) {
    case 'create':
    case 'backup':
      backup.createBackup();
      break;
      
    case 'list':
      backup.listBackups();
      break;
      
    case 'restore':
      const backupName = process.argv[3];
      if (!backupName) {
        console.log(chalk.red('❌ 请指定要恢复的备份名称'));
        console.log(chalk.gray('使用方法: node backup.js restore <backup-name>'));
        process.exit(1);
      }
      backup.restoreBackup(backupName);
      break;
      
    case 'cleanup':
      const keepCount = parseInt(process.argv[3]) || 5;
      backup.cleanupOldBackups(keepCount);
      break;
      
    default:
      console.log(chalk.bold.blue('🔧 Assets Backup & Restore - 资源文件备份恢复工具\n'));
      console.log(chalk.gray('使用方法:'));
      console.log(chalk.gray('  node backup.js create     - 创建备份'));
      console.log(chalk.gray('  node backup.js list       - 列出所有备份'));
      console.log(chalk.gray('  node backup.js restore <name> - 恢复指定备份'));
      console.log(chalk.gray('  node backup.js cleanup [count] - 清理旧备份 (默认保留5个)'));
      break;
  }
}

module.exports = AssetsBackup;