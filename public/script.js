const body = document.body;
const themeIcon = document.getElementById('theme-icon');

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = savedTheme;
    updateThemeIcon(savedTheme);
});

function toggleTheme() {
    if (body.classList.contains('dark-theme')) {
        body.className = 'light-theme';
        localStorage.setItem('theme', 'light-theme');
        updateThemeIcon('light-theme');
    } else {
        body.className = 'dark-theme';
        localStorage.setItem('theme', 'dark-theme');
        updateThemeIcon('dark-theme');
    }
}

function updateThemeIcon(theme) {
    if (theme === 'dark-theme') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

async function shortenUrl() {
    const urlInput = document.getElementById("url");
    const url = urlInput.value.trim();
    const provider = document.getElementById("provider").value;
    const resultContainer = document.getElementById("result-container");
    const resultDisplay = document.getElementById("result");

    if (!url) {
        showError("❌ Masukkan URL terlebih dahulu");
        return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        showError("❌ URL harus diawali http:// atau https://");
        return;
    }

    try {
        resultContainer.classList.remove('hidden');
        resultDisplay.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sedang memproses...`;

        const response = await fetch(
            `/api/shorten?url=${encodeURIComponent(url)}&provider=${provider}`
        );

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.error("Response bukan JSON:", text);
            showError("❌ API endpoint error / format tidak valid");
            return;
        }

        if (data.success && data.shortUrl) {
            resultDisplay.innerHTML = `
                <div class="success-result">
                    <span style="display:block; font-size:0.8rem; color:var(--text-sub); margin-bottom:5px;">✅ Berhasil:</span>
                    <a href="${data.shortUrl}" id="shortened-link" target="_blank">${data.shortUrl}</a>
                </div>
            `;
            
            const copyBtn = document.getElementById('copy-btn');
            copyBtn.onclick = () => copyLink(data.shortUrl);
        } else {
            showError(`❌ ${data.error || "Terjadi kesalahan"}`);
        }
    } catch (error) {
        console.error(error);
        showError("❌ Gagal terhubung ke server");
    }
}

function copyLink(link) {
    if (!link) return;
    
    navigator.clipboard.writeText(link).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        const originalIcon = copyBtn.innerHTML;
        
        copyBtn.innerHTML = `<i class="fas fa-check" style="color: #10b981;"></i>`;
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 2000);
        
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
    });
}

function showError(message) {
    const resultContainer = document.getElementById("result-container");
    const resultDisplay = document.getElementById("result");
    
    resultContainer.classList.remove('hidden');
    resultDisplay.innerHTML = `<span style="color: #ef4444;">${message}</span>`;
}
