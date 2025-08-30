#!/bin/bash

# Start script for Banking Loyalty Platform

echo "Banking Loyalty Platform Start"
echo "=============================="

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install Node.js and npm first."
    echo "You can install Node.js and npm by running:"
    echo "  sudo apt update"
    echo "  sudo apt install nodejs npm"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Dependencies not installed. Installing dependencies..."
    npm install
fi

echo "Starting the server..."
npm start &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 3

echo "Opening the application in your browser..."
# Try to open in default browser (works on most Linux systems)
if command -v xdg-open &> /dev/null
then
    xdg-open http://localhost:3000
elif command -v gnome-open &> /dev/null
then
    gnome-open http://localhost:3000
elif command -v open &> /dev/null
then
    open http://localhost:3000
else
    echo "Please open your browser and navigate to http://localhost:3000"
fi

echo "Server is running with PID $SERVER_PID"
echo "Press Ctrl+C to stop the server"

# Wait for the server process
wait $SERVER_PID
