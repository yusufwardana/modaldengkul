// controllers/textController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.generateText = async (req, res) => {
  const { productDescription } = req.body;
  if (!productDescription) {
    return res.status(400).json({ message: 'productDescription is required' });
  }

  try {
    const prompt = `
      Anda adalah seorang copywriter profesional untuk iklan TikTok di Indonesia.
      Deskripsi produk dari klien adalah: "${productDescription}".
      Tugas Anda adalah membuat "hook", "caption", "description", dan "cta".
      - Hook harus sangat menarik perhatian dalam 3 detik pertama.
      - Caption harus engaging, menggunakan emoji, dan hashtag relevan.
      - Description harus lebih detail dan persuasif.
      - CTA (Call to Action) harus kuat dan jelas, seperti "Klik keranjang kuning!".
      Berikan output dalam format JSON yang bisa langsung di-parse dengan struktur berikut:
      { "hook": "...", "caption": "...", "description": "...", "cta": "..." }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Membersihkan response agar valid JSON
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '');
    const generatedData = JSON.parse(cleanedText);

    res.status(200).json(generatedData);
  } catch (error)
  {
    console.error('Error generating text with Gemini:', error);
    res.status(500).json({ message: 'Failed to generate text from AI' });
  }
};