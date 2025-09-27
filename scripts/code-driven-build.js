/**
 * Code-Driven Build Script - 专为代码驱动项目优化的构建脚本
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

class CodeDrivenBuild {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.steps = [
      { name: '项目检查', command: 'npm', args: ['run', 'type-check'], critical: true },
      { name: '配置验证', command: 'npm', args: ['run', 'validate-config'], critical: true },
      { name: '视频生成', command: 'npm', args: ['run', 'video-gen'], critical: true }
    ];
    this.results = [];
  }

  /**
   * 执行命令
   */
  async executeCommand(command, args, cwd = this.projectRoot) {
    return new Promise((resolve, reject) => {
      console.log(chalk.gray(`  执行: ${command} ${args.join(' ')}`));
      
      const process = spawn(command, args, {
        cwd,
        stdio: 'inherit',
        shell: true
      });

      process.on('close', (code) => {
        resolve({ success: code === 0, code });
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * 执行构建步骤
   */
  async executeStep(step, index) {
    const stepNumber = index + 1;
    console.log(chalk.blue(`\n📋 步骤${stepNumber}: ${step.name}`));
    console.log('='.repeat(50));

    const startTime = Date.now();

    try {
      const result = await this.executeCommand(step.command, step.args);
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      if (result.success) {
        console.log(chalk.green(`✅ ${step.name} 完成 (${duration}s)`));
        this.results.push({
          step: step.name,
          success: true,
          duration: parseFloat(duration)
        });
        return true;
      } else {
        console.log(chalk.red(`❌ ${step.name} 失败 (退出码: ${result.code})`));
        this.results.push({
          step: step.name,
          success: false,
          duration: parseFloat(duration),
          exitCode: result.code
        });
        return false;
      }
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(chalk.red(`❌ ${step.name} 出错: ${error.message}`));
      this.results.push({
        step: step.name,
        success: false,
        duration: parseFloat(duration),
        error: error.message
      });
      return false;
    }
  }

  /**
   * 显示项目信息
   */
  showProjectInfo() {
    console.log(chalk.bold.blue('🎬 AnixOps CodeDrivenMedia - 代码驱动视频生成'));
    console.log(chalk.gray('项目特点: 纯代码生成视觉内容，无需PNG图片文件'));
    console.log(chalk.gray(`项目路径: ${this.projectRoot}`));
    console.log(chalk.gray(`构建时间: ${new Date().toLocaleString()}\n`));
  }

  /**
   * 检查开发服务器状态
   */
  async checkDevServer() {
    console.log(chalk.blue('🔍 检查开发环境...'));
    
    try {
      const response = await fetch('http://localhost:3000').catch(() => null);
      if (response) {
        console.log(chalk.green('✅ 开发服务器运行中 (http://localhost:3000)'));
        return true;
      } else {
        console.log(chalk.yellow('⚠️  开发服务器未启动'));
        console.log(chalk.gray('可运行: npm run dev'));
        return false;
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  无法检查开发服务器状态'));
      return false;
    }
  }

  /**
   * 生成构建报告
   */
  generateReport() {
    console.log(chalk.bold.blue('\n📊 构建报告'));
    console.log('='.repeat(60));

    const totalSteps = this.results.length;
    const successfulSteps = this.results.filter(r => r.success).length;
    const failedSteps = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(chalk.blue('📈 统计信息:'));
    console.log(chalk.gray(`  总步骤数: ${totalSteps}`));
    console.log(chalk.green(`  成功: ${successfulSteps}`));
    console.log(chalk.red(`  失败: ${failedSteps}`));
    console.log(chalk.gray(`  总耗时: ${totalDuration.toFixed(2)}s`));

    // 详细结果
    console.log(chalk.blue('\n📋 详细结果:'));
    this.results.forEach((result, index) => {
      const stepNum = index + 1;
      const icon = result.success ? '✅' : '❌';
      const duration = `${result.duration.toFixed(2)}s`;
      
      console.log(chalk.gray(`  ${stepNum}. ${icon} ${result.step} - ${duration}`));
      
      if (!result.success) {
        if (result.exitCode) {
          console.log(chalk.red(`      退出码: ${result.exitCode}`));
        }
        if (result.error) {
          console.log(chalk.red(`      错误: ${result.error}`));
        }
      }
    });

    // 构建状态
    console.log(chalk.blue('\n🎯 构建状态:'));
    if (failedSteps === 0) {
      console.log(chalk.green('🎉 构建完全成功！'));
      return { success: true, perfect: true };
    } else {
      console.log(chalk.red('❌ 构建失败'));
      return { success: false };
    }
  }

  /**
   * 执行代码驱动构建
   */
  async build() {
    this.showProjectInfo();
    
    // 检查开发服务器（可选）
    await this.checkDevServer();

    const overallStartTime = Date.now();
    let shouldContinue = true;

    // 执行每个步骤
    for (let i = 0; i < this.steps.length && shouldContinue; i++) {
      const step = this.steps[i];
      const success = await this.executeStep(step, i);

      // 如果关键步骤失败，停止构建
      if (!success && step.critical) {
        console.log(chalk.red(`\n💥 关键步骤"${step.name}"失败，停止构建`));
        shouldContinue = false;
      }
    }

    const totalBuildTime = ((Date.now() - overallStartTime) / 1000).toFixed(2);
    
    // 生成报告
    const report = this.generateReport();
    
    console.log(chalk.blue(`\n⏱️  总构建时间: ${totalBuildTime}s`));
    
    if (report.success) {
      console.log(chalk.bold.green('\n🎉 代码驱动构建完成！'));
      console.log(chalk.gray('💡 提示: 运行 npm run dev 启动开发服务器预览'));
    } else {
      console.log(chalk.bold.red('\n❌ 构建失败'));
    }

    return report;
  }
}

// 命令行接口
if (require.main === module) {
  const builder = new CodeDrivenBuild();
  
  builder.build()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.log(chalk.red(`\n💥 构建脚本出错: ${error.message}`));
      process.exit(1);
    });
}

module.exports = CodeDrivenBuild;