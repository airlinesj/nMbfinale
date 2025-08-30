# Banking Loyalty Platform

A seamless login system from registration to admin dashboard with backend user profile management.

## Features

- User registration with role-based access (admin, auditor, user)
- Secure login with session management
- Backend storage of user profiles
- Automatic session verification and revalidation
- Admin dashboard with customer management and analytics

## Files

- `index.html` - Main dashboard (requires authentication)
- `login.html` - User login page
- `register.html` - User registration page
- `admin-login.html` - Admin login page (with role selection)
- `server.js` - Backend server with API endpoints
- `app.js` - Main application logic
- `setup.sh` - Setup script for dependencies

## Setup

1. Make sure you have Node.js and npm installed:
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

2. Run the setup script:
   ```bash
   ./setup.sh
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account (use admin@ prefix for admin access)
3. Login with your credentials
4. Access the admin dashboard for administrative functions

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login with email and password
- `POST /api/verify-session` - Verify an existing session
- `POST /api/logout` - Logout and invalidate session
- `GET /api/users` - Get all users (admin only)

## Security

- Passwords are hashed using bcrypt
- Sessions are managed with JWT tokens
- Tokens are stored in localStorage
- Session validation on all protected pages
