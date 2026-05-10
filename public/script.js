async function shortenUrl() {
  const url = document.getElementById('url').value;
  const provider = document.getElementById('provider').value;

  const res = await fetch(`/api/shorten?url=${encodeURIComponent(url)}&provider=${provider}`);
  const data = await res.json();

  document.getElementById('result').innerHTML = data.shortUrl
    ? `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`
    : data.error;
}