const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Mock user data
let users = {
  '0de25304-5afc-499d-8111-e23a826d1118': {
    id: '0de25304-5afc-499d-8111-e23a826d1118',
    firstName: 'Davin',
    lastName: 'User',
    email: 'davin@example.com',
    username: 'davin_user',
    role: 'Member'
  }
};

// Routes
app.get('/api/v1/users/:id', (req, res) => {
  console.log(`GET user ${req.params.id}`);
  const user = users[req.params.id];
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/api/v1/users/:id', upload.single('profileImage'), (req, res) => {
  console.log(`PUT update user ${req.params.id}`);
  console.log('Body:', req.body);
  console.log('File:', req.file);
  
  const userId = req.params.id;
  if (users[userId]) {
    // Update user data
    if (req.body.firstName) users[userId].firstName = req.body.firstName;
    if (req.body.lastName) users[userId].lastName = req.body.lastName;
    if (req.body.email) users[userId].email = req.body.email;
    if (req.body.username) users[userId].username = req.body.username;
    
    // Handle image upload
    if (req.file) {
      users[userId].profileImage = `/uploads/${req.file.filename}`;
      console.log(`Profile image uploaded: ${req.file.filename}`);
    }
    
    console.log('Updated user:', users[userId]);
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: users[userId] 
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', port: port });
});

// Start server
app.listen(port, () => {
  console.log(`Mock backend server running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  GET /api/v1/users/:id');
  console.log('  PUT /api/v1/users/:id (with file upload)');
  console.log('  GET /api/health');
});

// Handle missing dependencies gracefully
try {
  require('express');
} catch (e) {
  console.log('Please install dependencies: npm install express cors multer');
  process.exit(1);
}
