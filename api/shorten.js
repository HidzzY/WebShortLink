const axios = require("axios");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { url, provider = "tinyurl" } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL wajib diisi"
      });
    }

    const providers = {
      tinyurl: `https://api.ikyyxd.my.id/tools/shortlink?url=${encodeURIComponent(url)}`,
      bomso: `https://api.ikyyxd.my.id/tools/shortbom?url=${encodeURIComponent(url)}`,
      byvn: `https://api.ikyyxd.my.id/tools/shortby?url=${encodeURIComponent(url)}`,
      ejuz: `https://api.ikyyxd.my.id/tools/shortejuz?url=${encodeURIComponent(url)}`,
      goosu: `https://api.ikyyxd.my.id/tools/shortgoo?url=${encodeURIComponent(url)}`,
      ouo: `https://api.ikyyxd.my.id/tools/shortouo?url=${encodeURIComponent(url)}`
    };

    const apiUrl = providers[provider];

    if (!apiUrl) {
      return res.status(400).json({
        success: false,
        error: "Provider tidak valid"
      });
    }

    const response = await axios.get(apiUrl);
    const data = response.data;

    const shortUrl =
      data.short ||
      data.result?.short ||
      data.result?.shorturl ||
      data.result?.short_url ||
      data.result;

    if (!shortUrl) {
      return res.status(500).json({
        success: false,
        error: "Gagal mengambil shortlink"
      });
    }

    const message =
`✨ SHORTLINK BARU

🔗 Original:
${url}

⚡ Shortlink:
${shortUrl}

🛠 Provider:
${provider}`;

    try {
      await axios.get(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          params: {
            chat_id: process.env.CHAT_ID,
            text: message
          }
        }
      );
    } catch (telegramError) {
      console.log("Telegram error:", telegramError.message);
    }

    return res.status(200).json({
      success: true,
      shortUrl
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Gagal memproses shortlink"
    });
  }
};
