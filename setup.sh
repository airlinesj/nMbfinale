#!/bin/bash

# Setup script for Banking Loyalty Platform

echo "Banking Loyalty Platform Setup"
echo "=============================="

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install Node.js and npm first."
    echo "You can install Node.js and npm by running:"
    echo "  sudo apt update"
    echo "  sudo apt install nodejs npm"
    echo ""
    echo "After installing Node.js and npm, run this script again."
    exit 1
fi

echo "Installing dependencies..."
npm install

echo ""
echo "Setup complete!"
echo ""
echo "To start the server, run:"
echo "  npm start"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
