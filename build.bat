@echo off
echo ==========================================
echo   AnixOps CodeDrivenMedia 构建脚本
echo ==========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 检查npm是否可用
npm --version >nul 2>&1
if errorlevel 1 (
    echo 错误: npm不可用，请检查Node.js安装
    pause
    exit /b 1
)

echo 检测到Node.js环境，开始构建...
echo.

REM 显示菜单
echo 请选择构建模式:
echo 1. 完整构建 (推荐)
echo 2. 快速构建 (仅关键步骤)
echo 3. 开发构建 (跳过备份和优化)
echo 4. 仅资源检查
echo 5. 仅视频生成
echo 6. 退出
echo.

choice /c 123456 /n /m "请输入选择 (1-6): "

if errorlevel 6 goto :end
if errorlevel 5 goto :video_only
if errorlevel 4 goto :assets_only
if errorlevel 3 goto :dev_build
if errorlevel 2 goto :quick_build
if errorlevel 1 goto :full_build

:full_build
echo.
echo 执行完整构建...
npm run build
goto :build_complete

:quick_build
echo.
echo 执行快速构建...
npm run build:quick
goto :build_complete

:dev_build
echo.
echo 执行开发构建...
npm run build:dev
goto :build_complete

:assets_only
echo.
echo 执行资源检查...
npm run assets:full-check
goto :build_complete

:video_only
echo.
echo 执行视频生成...
npm run video-gen
goto :build_complete

:build_complete
echo.
if errorlevel 1 (
    echo ==========================================
    echo   构建失败
    echo ==========================================
    echo 请检查上方的错误信息并修复问题
) else (
    echo ==========================================
    echo   构建完成
    echo ==========================================
    echo 构建成功完成！
)

echo.
echo 按任意键继续...
pause >nul

:end
echo 感谢使用AnixOps CodeDrivenMedia构建脚本！