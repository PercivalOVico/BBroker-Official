#!/bin/bash

# BBroker Quick Start Script
# Runs all setup commands in sequence

set -e

echo "🚀 BBroker Quick Start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✅ .env created"
    echo ""
else
    echo "✅ .env file exists"
    echo ""
fi

# Push database schema
echo "🗄️  Pushing database schema..."
npm run db:push
echo ""

# Start development server
echo "🚀 Starting development server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Server will start at: http://localhost:5001"
echo ""

npm run dev
