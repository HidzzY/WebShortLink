async function shortenUrl() {
  const url = document.getElementById("url").value.trim();
  const provider = document.getElementById("provider").value;
  const result = document.getElementById("result");

  if (!url) {
    result.innerHTML = "❌ Masukkan URL terlebih dahulu";
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    result.innerHTML = "❌ URL harus diawali http:// atau https://";
    return;
  }

  try {
    result.innerHTML = "⏳ Sedang memproses...";

    const response = await fetch(
      `/api/shorten?url=${encodeURIComponent(url)}&provider=${provider}`
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Response bukan JSON:", text);
      result.innerHTML = "❌ API endpoint error / bukan JSON";
      return;
    }

    if (data.success && data.shortUrl) {
      result.innerHTML = `
        <div>
          <p>✅ Shortlink berhasil dibuat</p>
          <br>
          <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
          <br><br>
          <button onclick="copyLink('${data.shortUrl}')">📋 Copy Link</button>
        </div>
      `;
    } else {
      result.innerHTML = `❌ ${data.error || "Terjadi kesalahan"}`;
    }
  } catch (error) {
    console.error(error);
    result.innerHTML = "❌ Gagal terhubung ke server";
  }
}

function copyLink(link) {
  navigator.clipboard.writeText(link);
  alert("Link berhasil disalin!");
}
