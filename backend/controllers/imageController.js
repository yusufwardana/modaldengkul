// controllers/imageController.js

exports.generateImages = async (req, res) => {
  const { imageBase64, theme } = req.body;

  if (!imageBase64 || !theme) {
    return res.status(400).json({ message: 'imageBase64 and theme are required' });
  }

  console.log(`Generating mock images for theme: ${theme}`);

  // TODO: Ganti dengan panggilan ke API image generation (misalnya DALL-E, Midjourney, atau Gemini Image)
  // Anda akan mengirim imageBase64 dan prompt teks (berdasarkan tema) ke model AI.

  try {
    // Simulasi jeda waktu API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Response tiruan (mock)
    const mockUrls = [
      `https://placehold.co/512x512/E2E8F0/1A202C?text=Hasil+${theme}+1`,
      `https://placehold.co/512x512/A7F3D0/1A202C?text=Hasil+${theme}+2`,
      `https://placehold.co/512x512/FBBF24/1A202C?text=Hasil+${theme}+3`,
      `https://placehold.co/512x512/F472B6/1A202C?text=Hasil+${theme}+4`,
    ];

    res.status(200).json({ imageUrls: mockUrls });
  } catch (error) {
    console.error('Error in mock image generation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};