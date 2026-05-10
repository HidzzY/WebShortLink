async function shortenUrl() {
  const urlInput = document.getElementById("url");
  const providerInput = document.getElementById("provider");
  const resultBox = document.getElementById("result");

  const url = urlInput.value.trim();
  const provider = providerInput.value;

  if (!url) {
    resultBox.innerHTML = "❌ Masukkan URL terlebih dahulu";
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    resultBox.innerHTML = "❌ URL harus diawali http:// atau https://";
    return;
  }

  try {
    resultBox.innerHTML = "⏳ Sedang membuat shortlink...";

    const response = await fetch(
      `/api/shorten?url=${encodeURIComponent(url)}&provider=${provider}`
    );

    const data = await response.json();

    if (data.success && data.shortUrl) {
      resultBox.innerHTML = `
        <div class="success-box">
          <p>✅ Shortlink berhasil dibuat:</p>
          <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
          <br><br>
          <button onclick="copyLink('${data.shortUrl}')">📋 Copy Link</button>
        </div>
      `;
    } else {
      resultBox.innerHTML = `❌ ${data.error || "Terjadi kesalahan"}`;
    }
  } catch (error) {
    console.error(error);
    resultBox.innerHTML = "❌ Gagal terhubung ke server";
  }
}

function copyLink(link) {
  navigator.clipboard.writeText(link);
  alert("Link berhasil disalin!");
}
