#!/bin/bash

echo "🚀 Starting GCC Playground Backend..."

# Check if GCC is installed
if ! command -v gcc &> /dev/null; then
    echo "❌ Error: GCC is not installed or not in PATH"
    echo "Please install GCC:"
    echo "  Ubuntu/Debian: sudo apt install build-essential"
    echo "  macOS: xcode-select --install"
    echo "  Windows: Install MinGW-w64 or use WSL"
    exit 1
fi

echo "✅ GCC found: $(gcc --version | head -n1)"

# Check if objdump is available
if ! command -v objdump &> /dev/null; then
    echo "⚠️  Warning: objdump not found. Assembly dump may not work."
fi

# Check if hexdump is available
if ! command -v hexdump &> /dev/null; then
    echo "⚠️  Warning: hexdump not found. Binary dump may not work."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create temp directory if it doesn't exist
mkdir -p temp

echo "🔧 Starting development server..."
npm run dev 