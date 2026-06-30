require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Ensure this path matches the actual name of your model file (e.g., models.js)
const { User, Internship, Network } = require('./models');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Connect to MongoDB with error handling
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Connected to Atlas!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- API ROUTES ---
app.get('/api/user', async (req, res) => {
  try {
    const user = await User.findOne() || await User.create({});
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/user', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({}, req.body, { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true 
    });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/internships', async (req, res) => {
  const apps = await Internship.find();
  res.json(apps);
});

app.post('/api/internships', async (req, res) => {
  const newApp = await Internship.create(req.body);
  res.json(newApp);
});

app.put('/api/internships/:id', async (req, res) => {
  const updatedApp = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedApp);
});

app.get('/api/network', async (req, res) => {
  const contacts = await Network.find();
  res.json(contacts);
});

app.post('/api/network', async (req, res) => {
  const contact = await Network.create(req.body);
  res.json(contact);
});

app.get('/api/analytics', async (req, res) => {
  try {
    const totalApps = await Internship.countDocuments();
    const interviews = await Internship.countDocuments({ status: 'Interview' });
    const contacts = await Network.countDocuments();
    res.json({ applications: totalApps, interviews, networkingGrowth: contacts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- FRONTEND ROUTE ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- START SERVER ---
// Binding to 0.0.0.0 is critical for Railway networking
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
