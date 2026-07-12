function buildAffiliateUrl(rawUrl, tag) {
    try {
        const url = new URL(rawUrl);
        url.searchParams.set("tag", tag);
        return url.toString();
    } catch (e) {
        return rawUrl;
    }
}

function renderProduct(p) {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = p.image
        ? `<img src="${p.image}" alt="${p.title}">`
        : "";

    const chips = [p.price, p.sellerRating, p.prime, p.trendVelocity ? `Trend: ${p.trendVelocity}` : null]
        .filter(Boolean)
        .map((c) => `<span class="stat-chip">${c}</span>`)
        .join("");

    const buyUrl = buildAffiliateUrl(p.amazonUrl, CONFIG.AMAZON_TAG);

    card.innerHTML = `
        ${img}
        <div class="body">
            <h2>${p.title}</h2>
            <div class="stat-row">${chips}</div>
            ${p.flaw ? `<div class="flaw">⚠️ ${p.flaw}</div>` : ""}
            <a class="buy-btn" href="${buyUrl}" target="_blank" rel="noopener sponsored">View on Amazon →</a>
        </div>
    `;
    return card;
}

async function init() {
    const tiktokLink = document.getElementById("tiktok-link");
    tiktokLink.href = CONFIG.TIKTOK_HANDLE_URL;

    const list = document.getElementById("product-list");
    try {
        const res = await fetch("products.json");
        const products = await res.json();
        list.innerHTML = "";
        if (!products.length) {
            list.innerHTML = `<div class="empty-hint">New picks dropping soon.</div>`;
            return;
        }
        products.forEach((p) => list.appendChild(renderProduct(p)));
    } catch (e) {
        list.innerHTML = `<div class="empty-hint">Couldn't load products right now.</div>`;
    }
}

document.addEventListener("DOMContentLoaded", init);
