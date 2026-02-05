#!/bin/bash

# Kill process on port 5000

echo "🔍 Checking for processes on port 5000..."

# Find process on port 5000
PID=$(lsof -ti:5000 2>/dev/null)

if [ -z "$PID" ]; then
    echo "✅ No process found on port 5000"
    exit 0
fi

echo "Found process $PID using port 5000"
echo "Killing process..."

kill -9 $PID 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Process killed successfully"
    echo "Port 5000 is now free"
else
    echo "❌ Failed to kill process"
    echo "Try manually: kill -9 $PID"
    exit 1
fi
