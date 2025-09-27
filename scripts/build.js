/**
 * Build Script - 完整的构建流程脚本
 * 整合资源检查、验证、优化和视频生成
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

class BuildScript {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.steps = [
      { name: '资源检查', command: 'npm', args: ['run', 'assets:check'], critical: false }, // 改为非关键，因为项目不依赖PNG
      { name: '资源验证', command: 'npm', args: ['run', 'assets:validate'], critical: false },
      { name: '创建备份', command: 'npm', args: ['run', 'assets:backup'], critical: false },
      { name: '配置验证', command: 'npm', args: ['run', 'validate-config'], critical: true },
      { name: '视频生成', command: 'npm', args: ['run', 'video-gen'], critical: true }
    ];
    this.results = [];
  }

  /**
   * 执行单个命令
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
        if (code === 0) {
          resolve({ success: true, code });
        } else {
          resolve({ success: false, code });
        }
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
          duration: parseFloat(duration),
          critical: step.critical
        });
        return true;
      } else {
        console.log(chalk.red(`❌ ${step.name} 失败 (退出码: ${result.code})`));
        this.results.push({
          step: step.name,
          success: false,
          duration: parseFloat(duration),
          critical: step.critical,
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
        critical: step.critical,
        error: error.message
      });
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
    const criticalFailures = this.results.filter(r => !r.success && r.critical).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    // 统计信息
    console.log(chalk.blue('📈 统计信息:'));
    console.log(chalk.gray(`  总步骤数: ${totalSteps}`));
    console.log(chalk.green(`  成功: ${successfulSteps}`));
    console.log(chalk.red(`  失败: ${failedSteps}`));
    console.log(chalk.red(`  关键失败: ${criticalFailures}`));
    console.log(chalk.gray(`  总耗时: ${totalDuration.toFixed(2)}s`));

    // 详细结果
    console.log(chalk.blue('\n📋 详细结果:'));
    this.results.forEach((result, index) => {
      const stepNum = index + 1;
      const icon = result.success ? '✅' : '❌';
      const critical = result.critical ? ' (关键)' : '';
      const duration = `${result.duration.toFixed(2)}s`;
      
      console.log(chalk.gray(`  ${stepNum}. ${icon} ${result.step}${critical} - ${duration}`));
      
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
    if (criticalFailures > 0) {
      console.log(chalk.red('❌ 构建失败 - 关键步骤失败'));
      return { success: false, critical: true };
    } else if (failedSteps > 0) {
      console.log(chalk.yellow('⚠️  构建部分成功 - 非关键步骤失败'));
      return { success: true, warnings: true };
    } else {
      console.log(chalk.green('🎉 构建完全成功！'));
      return { success: true, perfect: true };
    }
  }

  /**
   * 执行完整构建流程
   */
  async build() {
    console.log(chalk.bold.blue('🚀 开始完整构建流程\n'));
    console.log(chalk.gray(`项目路径: ${this.projectRoot}`));
    console.log(chalk.gray(`构建时间: ${new Date().toLocaleString()}`));

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
      if (report.perfect) {
        console.log(chalk.bold.green('\n🎉 构建完美完成！'));
      } else {
        console.log(chalk.bold.yellow('\n⚠️  构建完成，但有警告'));
      }
    } else {
      console.log(chalk.bold.red('\n❌ 构建失败'));
    }

    return report;
  }

  /**
   * 快速构建（跳过非关键步骤）
   */
  async quickBuild() {
    console.log(chalk.bold.blue('⚡ 快速构建模式\n'));
    
    // 只执行关键步骤
    const criticalSteps = this.steps.filter(step => step.critical);
    const originalSteps = this.steps;
    this.steps = criticalSteps;

    const result = await this.build();
    
    // 恢复原始步骤
    this.steps = originalSteps;
    
    return result;
  }

  /**
   * 开发模式构建
   */
  async devBuild() {
    console.log(chalk.bold.blue('🔧 开发模式构建\n'));
    
    // 开发模式：跳过备份和优化
    const devSteps = this.steps.filter(step => 
      !step.name.includes('备份') && !step.name.includes('优化')
    );
    
    const originalSteps = this.steps;
    this.steps = devSteps;

    const result = await this.build();
    
    // 恢复原始步骤
    this.steps = originalSteps;
    
    return result;
  }
}

// 命令行接口
if (require.main === module) {
  const builder = new BuildScript();
  const mode = process.argv[2] || 'full';

  let buildPromise;

  switch (mode) {
    case 'quick':
      buildPromise = builder.quickBuild();
      break;
    case 'dev':
      buildPromise = builder.devBuild();
      break;
    case 'full':
    default:
      buildPromise = builder.build();
      break;
  }

  buildPromise
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.log(chalk.red(`\n💥 构建脚本出错: ${error.message}`));
      process.exit(1);
    });
}

module.exports = BuildScript;