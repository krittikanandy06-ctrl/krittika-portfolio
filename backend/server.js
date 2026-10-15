// =========================================================
// KRITTIKA NANDY · PORTFOLIO BACKEND
// Node.js + Express + MongoDB (Mongoose)
//
// Routes:
//   GET  /api/health        → is the server alive?
//   GET  /api/stats         → { visits, pets }
//   POST /api/visit         → +1 visitor, returns { visits }
//   POST /api/simba/pet     → +1 Simba pet, returns { pets }
//   POST /api/contact       → saves { name, email, message } to the database
// =========================================================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Render (and most hosts) sit behind a proxy; this lets rate limiting see the real visitor IP
app.set('trust proxy', 1);

// Only accept JSON up to 20 KB (nobody needs a bigger contact message)
app.use(express.json({ limit: '20kb' }));

// Only these websites may call this API (set in .env)
const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  }
}));

// ---------- Database models ----------
const Message = mongoose.model('Message', new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 3000 }
}, { timestamps: true }));

const Counter = mongoose.model('Counter', new mongoose.Schema({
  key: { type: String, unique: true },
  value: { type: Number, default: 0 }
}));

// Adds 1 to a counter (creates it the first time) and returns the new value
async function increment(key) {
  const doc = await Counter.findOneAndUpdate({ key }, { $inc: { value: 1 } }, { new: true, upsert: true });
  return doc.value;
}
async function read(key) {
  const doc = await Counter.findOne({ key });
  return doc ? doc.value : 0;
}

// ---------- Spam protection ----------
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, message: { ok: false, error: 'Too many messages. Please try again later.' } });
const counterLimiter = rateLimit({ windowMs: 60 * 1000, limit: 30 });

// ---------- Routes ----------
app.get('/', (req, res) => res.send('Krittika’s portfolio API is running 🐶'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected' });
});

app.get('/api/stats', async (req, res, next) => {
  try { res.json({ ok: true, visits: await read('visits'), pets: await read('pets') }); }
  catch (err) { next(err); }
});

app.post('/api/visit', counterLimiter, async (req, res, next) => {
  try { res.json({ ok: true, visits: await increment('visits') }); }
  catch (err) { next(err); }
});

app.post('/api/simba/pet', counterLimiter, async (req, res, next) => {
  try { res.json({ ok: true, pets: await increment('pets') }); }
  catch (err) { next(err); }
});

app.post('/api/contact', contactLimiter, async (req, res, next) => {
  try {
    const { name = '', email = '', message = '', website = '' } = req.body || {};
    if (website) return res.json({ ok: true });                 // hidden "honeypot" field: bots fill it, humans don't
    if (!name.trim() || !email.trim() || !message.trim()) {
      return res.status(400).json({ ok: false, error: 'Please fill in your name, email and message.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }
    await Message.create({ name, email, message });
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
});

// ---------- Errors ----------
app.use((req, res) => res.status(404).json({ ok: false, error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.message === 'Not allowed by CORS' ? 403 : 500).json({ ok: false, error: 'Something went wrong on the server.' });
});

// ---------- Start ----------
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing. Copy .env.example to .env and paste your MongoDB Atlas link.');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
