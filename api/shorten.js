const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { url, provider } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL wajib diisi' });
    }

    const providers = {
      tinyurl: `https://api.ikyyxd.my.id/tools/shortlink?url=${encodeURIComponent(url)}`,
      bomso: `https://api.ikyyxd.my.id/tools/shortbom?url=${encodeURIComponent(url)}`,
      byvn: `https://api.ikyyxd.my.id/tools/shortby?url=${encodeURIComponent(url)}`,
      ejuz: `https://api.ikyyxd.my.id/tools/shortejuz?url=${encodeURIComponent(url)}`,
      goosu: `https://api.ikyyxd.my.id/tools/shortgoo?url=${encodeURIComponent(url)}`,
      ouo: `https://api.ikyyxd.my.id/tools/shortouo?url=${encodeURIComponent(url)}`
    };

    const apiUrl = providers[provider || 'tinyurl'];
    const response = await axios.get(apiUrl);
    const data = response.data;

    let shortUrl = data.short || data.result?.short || data.result?.shorturl || data.result?.short_url || data.result;

    const message = `✨ SHORTLINK BARU\n\n🔗 Original: ${url}\n⚡ Result: ${shortUrl}\n🛠 Provider: ${provider}`;

    await axios.get(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        params: {
          chat_id: process.env.CHAT_ID,
          text: message
        }
      }
    );

    res.status(200).json({ success: true, shortUrl });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memproses shortlink' });
  }
};