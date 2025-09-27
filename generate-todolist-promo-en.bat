@echo off
echo ========================================
echo   TodoList English Promo Video Build
echo ========================================
echo.

:: Set up environment
set COMPOSITION_ID=TodoListPromoEn
set OUTPUT_DIR=output
set FILENAME=todolist-promo-en

:: Check if output directory exists
if not exist "%OUTPUT_DIR%" (
    echo Creating output directory...
    mkdir "%OUTPUT_DIR%"
)

echo Building English TodoList promotional video...
echo Composition: %COMPOSITION_ID%
echo Output: %OUTPUT_DIR%\%FILENAME%.mp4
echo.

:: Build the video
echo Starting Remotion render...
npx remotion render "%COMPOSITION_ID%" "%OUTPUT_DIR%\%FILENAME%.mp4" --log=verbose

:: Check if build was successful
if %ERRORLEVEL% == 0 (
    echo.
    echo ========================================
    echo   ✅ BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Output file: %OUTPUT_DIR%\%FILENAME%.mp4
    echo.
    echo The English TodoList promotional video has been generated successfully!
    echo Duration: ~40 seconds
    echo Resolution: 1920x1080
    echo Frame rate: 30fps
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ BUILD FAILED!
    echo ========================================
    echo.
    echo Please check the error messages above and try again.
    echo.
)

pause