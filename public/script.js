async function shortenUrl() {
  const url = document.getElementById("url").value.trim();
  const provider = document.getElementById("provider").value;
  const result = document.getElementById("result");

  if (!url) {
    result.innerHTML = "❌ Masukkan URL terlebih dahulu";
    return;
  }

  try {
    result.innerHTML = "⏳ Sedang memproses...";

    const response = await fetch(
      `/api/shorten?url=${encodeURIComponent(url)}&provider=${provider}`
    );

    const data = await response.json();

    if (data.success) {
      result.innerHTML = `
        ✅ Shortlink berhasil dibuat<br><br>
        <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
      `;
    } else {
      result.innerHTML = `❌ ${data.error || "Terjadi error"}`;
    }
  } catch (error) {
    console.error(error);
    result.innerHTML = "❌ Gagal terhubung ke server";
  }
}
