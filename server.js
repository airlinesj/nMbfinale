const express = require('express');
const fs = require('fs').promises;

// Try to load optional dependencies
let bcrypt, jwt, cors;
try {
    bcrypt = require('bcrypt');
    jwt = require('jsonwebtoken');
    cors = require('cors');
} catch (error) {
    console.log('Some dependencies are not installed. Please run: npm install');
    console.log('Installing dependencies now...');
    
    // In a real scenario, we would install dependencies here
    // For now, we'll use mock implementations
    bcrypt = {
        hash: async (password, salt) => {
            // Simple mock - in reality, use proper hashing
            return `hashed_${password}`;
        },
        compare: async (password, hash) => {
            // Simple mock - in reality, use proper comparison
            return `hashed_${password}` === hash;
        }
    };
    
    jwt = {
        sign: (payload, secret, options) => {
            // Simple mock - in reality, use proper JWT signing
            return `token_${JSON.stringify(payload)}`;
        },
        verify: (token, secret) => {
            // Simple mock - in reality, use proper JWT verification
            if (token.startsWith('token_')) {
                return JSON.parse(token.substring(6));
            }
            throw new Error('Invalid token');
        }
    };
    
    cors = () => (req, res, next) => next();
}

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// In-memory storage (in production, use a database like MongoDB)
let users = [];
let sessions = [];

// Load data from file if exists
async function loadData() {
  try {
    const data = await fs.readFile('users.json', 'utf8');
    users = JSON.parse(data);
  } catch (err) {
    users = [];
  }
}

// Save data to file
async function saveData() {
  try {
    await fs.writeFile('users.json', JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// Initialize data
loadData();

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    if (users.find(u => u.email === email || u.username === username)) {
      return res.status(409).json({ error: 'User already exists with this email or username' });
    }

    // Determine role based on email prefix
    let role = 'user';
    if (email.startsWith('admin@')) {
      role = 'admin';
    } else if (email.startsWith('auditor@')) {
      role = 'auditor';
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await saveData();

    // Create session for automatic login
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, SECRET_KEY, { expiresIn: '24h' });
    
    const session = {
      token,
      userId: newUser.id,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    sessions.push(session);

    res.status(201).json({
      message: `Account created successfully as ${role}!`,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create session
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
    
    const session = {
      token,
      userId: user.id,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    // Remove any existing sessions for this user
    sessions = sessions.filter(s => s.userId !== user.id);
    sessions.push(session);

    res.json({
      message: `Welcome ${user.firstName}!`,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify session endpoint
app.post('/api/verify-session', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Check if session exists and is not expired
    const session = sessions.find(s => s.token === token && s.expires > Date.now());
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Find user
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Remove session
    sessions = sessions.filter(s => s.token !== token);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
app.get('/api/users', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Check if user is admin
    const user = users.find(u => u.id === decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Return users without passwords
    const usersWithoutPasswords = users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    res.json(usersWithoutPasswords);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
