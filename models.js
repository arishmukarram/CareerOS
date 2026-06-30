const mongoose = require('mongoose');

// --- SCHEMAS ---

const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const AcademicSchema = new mongoose.Schema({
  semester: String,
  subject: String,
  assignments: [{ title: String, dueDate: Date, status: String }],
  studyProgress: {
    mitOcw: Number,
    azevedo: Number,
    damodaran: Number
  }
});

const IBPrepSchema = new mongoose.Schema({
  topic: { type: String, enum: ['DCF', 'LBO', 'M&A', 'Excel', 'PowerBI', 'Python', 'SQL'] },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'] },
  projects: [{ title: String, link: String }]
});

const InternshipSchema = new mongoose.Schema({
  company: String,
  tier: { type: String, enum: ['BB', 'EB', 'Boutique', 'Big4', 'Startup', 'Research'] },
  status: { type: String, enum: ['Not Started', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'] },
  dateApplied: Date
});

const NetworkSchema = new mongoose.Schema({
  name: String,
  role: String,
  category: { type: String, enum: ['Alumni', 'Professor', 'Recruiter', 'Industry'] },
  lastContacted: Date,
  followUpReminder: Date,
  notes: String
});

const PortfolioSchema = new mongoose.Schema({
  resumeLink: String,
  coverLetterLink: String,
  linkedinChecked: Boolean,
  githubLink: String,
  certificates: [String]
});

// --- FINAL EXPORT (Only one) ---
module.exports = {
  User: mongoose.model('User', UserSchema),
  Academic: mongoose.model('Academic', AcademicSchema),
  IBPrep: mongoose.model('IBPrep', IBPrepSchema),
  Internship: mongoose.model('Internship', InternshipSchema),
  Network: mongoose.model('Network', NetworkSchema),
  Portfolio: mongoose.model('Portfolio', PortfolioSchema)
};
