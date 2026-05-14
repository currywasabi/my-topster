const MB_BASE = "https://musicbrainz.org/ws/2";
const CAA_BASE = "https://coverartarchive.org";

export async function search(input) {
  const q = input.trim();
  if (!q) return;

  document.getElementById("results").innerHTML = "";
  document.getElementById("status").textContent = "검색 중…";

  // 1. MusicBrainz에서 앨범 검색
  const url = `${MB_BASE}/release/?query=${encodeURIComponent(q)}&fmt=json&limit=10`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Deutda_Topster/1.0 (demo) (maxpark0329@gmail.com)",
    },
  });
  const data = await res.json();
  const releases = data.releases || [];

  document.getElementById("status").textContent = `${releases.length}개 결과`;

  // 2. 각 앨범 카드 렌더링
  releases.forEach((release) => {
    const mbid = release.id;
    const title = release.title;
    const artist = release["artist-credit"]?.[0]?.artist?.name || "";
    const year = (release.date || "").slice(0, 4);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="no-cover" id="img-${mbid}">No Cover</div>
        <div class="title">${title}</div>
        <div class="artist">${artist}</div>
        ${year ? `<div class="year">${year}</div>` : ""}
    `;
    document.getElementById("results").appendChild(card);

    // 3. Cover Art Archive에서 커버 이미지 로드
    loadCover(mbid);
  });
}

async function loadCover(mbid) {
  try {
    const res = await fetch(`${CAA_BASE}/release/${mbid}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return; // 커버 없는 경우 그냥 종료

    const data = await res.json();
    const image = data.images?.find((i) => i.front) || data.images?.[0];
    if (!image) return;

    const imgUrl =
      image.thumbnails?.["500"] || image.thumbnails?.large || image.image;

    // 기존 placeholder를 img 태그로 교체
    const placeholder = document.getElementById(`img-${mbid}`);
    if (!placeholder) return;

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = "album cover";
    placeholder.replaceWith(img);
  } catch {
    // 커버 로드 실패 시 무시 (No Cover 유지)
  }
}
