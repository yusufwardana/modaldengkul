require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const imageRoutes = require('../routes/imageRoutes');
const textRoutes = require('../routes/textRoutes');
const voiceVideoRoutes = require('../routes/voiceVideoRoutes');

// Inisialisasi aplikasi Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Gunakan routes
app.use('/api/image', imageRoutes);
app.use('/api/text', textRoutes);
app.use('/api/voice-video', voiceVideoRoutes);

// Route dasar untuk cek status
app.get('/api', (req, res) => {
  res.send('TikTok Affiliate Backend is running on Vercel!');
});

// Hanya untuk development lokal, Vercel menangani ini secara otomatis.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running for local development on port ${PORT}`));
}

// Ekspor aplikasi Express untuk digunakan oleh Vercel
module.exports = app;