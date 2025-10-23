@echo off
REM Campus Mindspace - Windows Maintenance Script

echo 🔧 Campus Mindspace Maintenance Script
echo =====================================

set BACKUP_DIR=..\campus-mindspace-backups
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "DATE=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"
set "BACKUP_NAME=campus-mindspace-backup-%DATE%"

echo.
echo What would you like to do?
echo 1) Create backup
echo 2) Check system health
echo 3) Generate report
echo 4) Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto create_backup
if "%choice%"=="2" goto check_health
if "%choice%"=="3" goto generate_report
if "%choice%"=="4" goto exit
goto invalid

:create_backup
echo 📦 Creating backup...

REM Create backup directory
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Create backup using PowerShell
powershell -command "Compress-Archive -Path '.\*' -DestinationPath '%BACKUP_DIR%\%BACKUP_NAME%.zip' -Exclude '.git','node_modules','*.log','*.tmp'"

echo ✅ Backup created: %BACKUP_DIR%\%BACKUP_NAME%.zip

REM Keep only last 10 backups
cd "%BACKUP_DIR%"
for /f "skip=10 delims=" %%i in ('dir /b /o-d campus-mindspace-backup-*.zip 2^>nul') do del "%%i"
cd - >nul

echo 🧹 Old backups cleaned up
goto end

:check_health
echo 🏥 Checking system health...

echo 📁 File sizes:
dir /s *.css *.js *.html

echo 🔍 Large files (^>100KB):
for /f "tokens=*" %%i in ('dir /s /b *.css *.js *.html *.jpg *.png 2^>nul') do (
    for /f "tokens=3" %%j in ('dir "%%i" 2^>nul ^| findstr "%%~nxi"') do (
        if %%j gtr 100000 (
            echo ⚠️  %%i - %%j bytes
        )
    )
)

echo 🔧 Checking for missing files...
findstr /r /s "src=" *.html | findstr /v "http" | findstr /v "mailto" | findstr /v "tel"

echo ✅ Health check complete
goto end

:generate_report
echo 📊 Generating maintenance report...

set REPORT_FILE=..\maintenance-report-%DATE%.txt

(
echo Campus Mindspace Maintenance Report
echo Generated: %date% %time%
echo ==================================
echo.
echo File Statistics:
echo HTML files: 
dir /s /b *.html 2^>nul | find /c /v ""
echo CSS files: 
dir /s /b *.css 2^>nul | find /c /v ""
echo JavaScript files: 
dir /s /b *.js 2^>nul | find /c /v ""
echo.
echo Recommendations:
echo - Run health check regularly
echo - Keep backups up to date
echo - Monitor performance metrics
echo - Update dependencies monthly
) > "%REPORT_FILE%"

echo ✅ Report generated: %REPORT_FILE%
goto end

:invalid
echo ❌ Invalid choice. Please run the script again.
goto end

:exit
echo 👋 Goodbye!
goto end

:end
pause
