require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Academic, IBPrep, Internship, Network, Portfolio } = require('./models');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Connected to Atlas!'))
  .catch(err => console.log(err));

// --- DASHBOARD & USER ROUTES ---
app.get('/api/user', async (req, res) => {
  const user = await User.findOne() || await User.create({});
  res.json(user);
});

// Change your PUT route in server.js to this:
app.put('/api/user', async (req, res) => {
  try {
    // This finds the user or creates one if empty
    const user = await User.findOneAndUpdate({}, req.body, { 
        new: true, 
        upsert: true, // Creates the document if it's missing
        setDefaultsOnInsert: true 
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- INTERNSHIP TRACKER ROUTES ---
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

// --- NETWORKING CRM ROUTES ---
app.get('/api/network', async (req, res) => {
  const contacts = await Network.find();
  res.json(contacts);
});

app.post('/api/network', async (req, res) => {
  const contact = await Network.create(req.body);
  res.json(contact);
});

// --- ANALYTICS (Aggregating Data) ---
app.get('/api/analytics', async (req, res) => {
  const totalApps = await Internship.countDocuments();
  const interviews = await Internship.countDocuments({ status: 'Interview' });
  const contacts = await Network.countDocuments();
  
  res.json({
    applications: totalApps,
    interviews: interviews,
    networkingGrowth: contacts
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`IB OS Backend running on port ${PORT}`));
