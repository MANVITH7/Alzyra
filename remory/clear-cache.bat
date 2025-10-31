@echo off
echo ========================================
echo Clearing ALL React Native Caches
echo ========================================
echo.

echo [1/5] Removing node_modules/.cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo   Done
) else (
    echo   Already clean
)

echo.
echo [2/5] Removing Metro cache...
if exist "%TEMP%\metro-*" (
    del /q "%TEMP%\metro-*"
    echo   Done
) else (
    echo   Already clean
)

echo.
echo [3/5] Removing Babel cache...
if exist "node_modules\.cache\babel-loader" (
    rmdir /s /q "node_modules\.cache\babel-loader"
    echo   Done
) else (
    echo   Already clean
)

echo.
echo [4/5] Removing React Native cache...
if exist "%LOCALAPPDATA%\Temp\react-native-*" (
    del /q "%LOCALAPPDATA%\Temp\react-native-*"
    echo   Done
) else (
    echo   Already clean
)

echo.
echo [5/5] Clearing watchman (if installed)...
where watchman >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    watchman watch-del-all
    echo   Done
) else (
    echo   Watchman not installed - skipping
)

echo.
echo ========================================
echo Cache cleared successfully!
echo ========================================
echo.
echo Now run: npm start
echo.
pause
