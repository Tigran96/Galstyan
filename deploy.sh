#!/bin/bash

echo "🚀 Starting Galstyan Academy deployment..."

# Step 1: Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist folder not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 2: Switch to gh-pages branch (create if doesn't exist)
echo "🌿 Switching to gh-pages branch..."
git checkout gh-pages 2>/dev/null || git checkout -b gh-pages

# Step 3: Force add dist folder (ignore .gitignore)
echo "📁 Adding dist folder to git..."
git add -f dist/

# Step 4: Copy dist contents to root
echo "📋 Copying dist contents to root..."
cp -r dist/* . 2>/dev/null || xcopy dist\* . /E /H /Y

# Step 5: Add all files
echo "📝 Adding all files to git..."
git add .

# Step 6: Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy Galstyan Academy website - $(date)"

# Step 7: Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin gh-pages

echo "✅ Deployment completed!"
echo "🌐 Your website should be available at: https://tigran96.github.io/Galstyan/"
echo ""
echo "📋 Next steps:"
echo "1. Go to GitHub repository → Settings → Pages"
echo "2. Set source to 'Deploy from a branch'"
echo "3. Select 'gh-pages' branch"
echo "4. Set folder to '/' (root)"
echo "5. Save and wait for deployment"
