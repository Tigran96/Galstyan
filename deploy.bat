@echo off
echo 🚀 Starting Galstyan Academy deployment...

REM Step 1: Build the project
echo 📦 Building project...
call npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Build failed! dist folder not found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Step 2: Switch to gh-pages branch (create if doesn't exist)
echo 🌿 Switching to gh-pages branch...
git checkout gh-pages 2>nul || git checkout -b gh-pages

REM Step 3: Force add dist folder (ignore .gitignore)
echo 📁 Adding dist folder to git...
git add -f dist/

REM Step 4: Copy dist contents to root
echo 📋 Copying dist contents to root...
xcopy dist\* . /E /H /Y

REM Step 5: Add all files
echo 📝 Adding all files to git...
git add .

REM Step 6: Commit changes
echo 💾 Committing changes...
git commit -m "Deploy Galstyan Academy website - %date% %time%"

REM Step 7: Push to GitHub
echo 🚀 Pushing to GitHub...
git push origin gh-pages

echo ✅ Deployment completed!
echo 🌐 Your website should be available at: https://tigran96.github.io/Galstyan/
echo.
echo 📋 Next steps:
echo 1. Go to GitHub repository → Settings → Pages
echo 2. Set source to "Deploy from a branch"
echo 3. Select "gh-pages" branch
echo 4. Set folder to "/" (root)
echo 5. Save and wait for deployment
pause
