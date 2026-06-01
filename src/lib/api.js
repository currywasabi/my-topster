const MB_BASE = "https://musicbrainz.org/ws/2";
const CAA_BASE = "https://coverartarchive.org";

export async function search(input) {
  const q = input.trim();
  if (q === "") return;

  const url = `${MB_BASE}/release/?query=${encodeURIComponent(q)}&fmt=json&limit=15`;

  try {
    const res = await fetch(url, {
      headers: {"User-Agent": "Deutda_Topster/1.0 (demo) (maxpark0329@gmail.com)"}
    });

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    
    const data = await res.json();
    const releases = data.releases || [];
    console.log(releases);

    renderCard(releases);
  } catch (e) {
    console.error(e);
    alert("앨범 검색에 실패하였습니다.");
  }
}

async function loadCover(mbid) {
  const res = await fetch(`${CAA_BASE}/release/${mbid}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("no cover");

  const data = await res.json();
  const image = data.images?.find((i) => i.front) || data.images?.[0];
  if (!image) throw new Error("no image");

  const imgUrl = image.thumbnails?.["500"] || image.thumbnails?.large || image.image;
  return imgUrl;
}


// *************** DOM 조작 *****************


function renderCard(releases) {
  const results = document.querySelector(".results");
  results.innerHTML = "";

  releases.forEach((release) => {
    const mbid = release.id;
    const title = release.title;
    const artist = release["artist-credit"]?.[0]?.artist?.name || "";

    const card = document.createElement("div");
    card.className = "results__card";
    card.dataset.artist = artist;
    card.dataset.title = title;
    card.innerHTML = `
        <div class="no-cover" id="img-${mbid}">No Cover</div>
        <div class="results__title">${title}</div>
        <div class="results__artist">${artist}</div>
    `;
    results.appendChild(card);

    // Cover Art Archive에서 커버 이미지 로드
   loadCover(mbid)
      .then((imgUrl) => {
        const placeholder = card.querySelector(".no-cover");
        if (!placeholder) return;
        const img = document.createElement("img");
        img.crossOrigin = "anonymous"; // CORS 오염 방지 (없어도 돌아가긴 함)
        img.src = imgUrl;
        img.alt = "album cover";
        card.dataset.src = imgUrl;
        placeholder.replaceWith(img);
      })
      .catch(() => {
        // 실패 시 No Cover 유지
      });
  });
}