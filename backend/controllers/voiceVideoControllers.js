// controllers/voiceVideoController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const textToSpeech = require('@google-cloud/text-to-speech');

// Inisialisasi klien
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ttsClient = new textToSpeech.TextToSpeechClient();

exports.generateVoiceAndVideo = async (req, res) => {
  const { sourceText, voiceStyle } = req.body;

  if (!sourceText || !voiceStyle) {
    return res.status(400).json({ message: 'sourceText and voiceStyle are required' });
  }

  try {
    // Langkah 1: Generate script dan prompt dengan Gemini
    const geminiPrompt = `
      Anda adalah seorang sutradara dan penulis naskah iklan TikTok di Indonesia.
      Teks utama dari klien adalah: "${sourceText}"
      Gaya suara yang diinginkan adalah: "${voiceStyle}".
      Tugas Anda: Buat "voiceScript" (dalam Bahasa Indonesia, natural dan engaging) dan "videoPrompt" (dalam Bahasa Inggris, detail untuk model AI video).
      Berikan output dalam format JSON yang bisa di-parse: { "voiceScript": "...", "videoPrompt": "..." }
    `;
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const geminiResult = await geminiModel.generateContent(geminiPrompt);
    const geminiResponse = await geminiResult.response;
    const cleanedText = geminiResponse.text().replace(/```json/g, '').replace(/```/g, '');
    const { voiceScript, videoPrompt } = JSON.parse(cleanedText);

    // Langkah 2: Konversi voiceScript ke audio dengan Google Cloud TTS
    const voiceMap = {
      'Wanita Natural 🇮🇩': { languageCode: 'id-ID', name: 'id-ID-Standard-A', ssmlGender: 'FEMALE' },
      'Pria Enerjik 🇮🇩': { languageCode: 'id-ID', name: 'id-ID-Standard-C', ssmlGender: 'MALE' },
      'Soft Voice 🇮🇩': { languageCode: 'id-ID', name: 'id-ID-Standard-B', ssmlGender: 'FEMALE' },
    };
    const request = {
      input: { text: voiceScript },
      voice: voiceMap[voiceStyle] || voiceMap['Wanita Natural 🇮🇩'],
      audioConfig: { audioEncoding: 'MP3' },
    };
    const [ttsResponse] = await ttsClient.synthesizeSpeech(request);
    
    // Langkah 3: Konversi audio buffer ke base64 string untuk Vercel
    const audioBase64 = ttsResponse.audioContent.toString('base64');
    
    // Langkah 4: Kirim response akhir
    res.status(200).json({
      voiceScript,
      videoPrompt,
      audioBase64,
    });

  } catch (error) {
    console.error('Error in voice/video generation process:', error);
    res.status(500).json({ message: 'Internal server error during generation' });
  }
};