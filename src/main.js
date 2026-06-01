import { gridController } from './worker/gridController.js';
import { renderGrid } from './worker/renderer.js';
import { capture } from './worker/capturer.js';
import { search } from './lib/api.js';

const grid = document.querySelector(".grid");

const searchInput = document.querySelector(".search-bar__input");
const searchBtn = document.querySelector(".search-bar__btn--search");

const gridSizer = document.querySelector(".grid-sizer");
const widthValue = document.querySelector(".grid-sizer__input--width");
const heightValue = document.querySelector(".grid-sizer__input--height");
const widthOutput = document.querySelector(".grid-sizer__output--width");
const heightOutput = document.querySelector(".grid-sizer__output--height");

const downloadBtn = document.querySelector('.floating-controls__btn--download');
const floatingGridSizer = document.querySelector(".floating-controls__grid-sizer");
const colsOutput = document.querySelector(".floating-controls__output--cols");
const rowsOutput = document.querySelector(".floating-controls__output--rows");

const searchResults = document.querySelector(".results");



// 초기화***********************************************


renderGrid(gridController.gridState);
updateSizerOutput ();


// 앨범 그리드에 추가/삭제 파트*****************************

// 앨범 추가
searchResults.addEventListener("click", function (e) {
  const target = e.target.closest('.results__card').dataset;
  const newAlbum = new Album (target.title, target.artist, target.src);
  gridController.addAlbum(newAlbum);
  renderGrid(gridController.gridState);
});

// 앨범 삭제
grid.addEventListener("click", function (e) {
  gridController.deleteAlbum(Number(e.target.dataset.index));
  renderGrid(gridController.gridState);
});


// 검색 파트 (by using MusicBrainz API)*******************


// 앨범 객체 생성자
function Album(title, artist, src) {
  this.title = title;
  this.artist = artist;
  this.src = src;
}

// 앨범 검색 (API 호출)
function doSearch(input) {
  if (input.trim() !== "") {
    document.querySelector('.results-container').style.display = "block";
    search(input.trim());
  }
}

// 검색1 - 버튼 클릭
searchBtn.addEventListener("click", () => {
  doSearch(searchInput.value);
});

// 검색2 - 엔터키 입력
searchInput.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') doSearch(searchInput.value);
});


// floating active button 파트**************************


downloadBtn.addEventListener("click", () => {
  capture(grid);
});

function updateSizerOutput () {
  const { cols, rows } = gridController.gridState;
  colsOutput.textContent = `${cols}칸`;
  rowsOutput.textContent = `${rows}칸`;
}

floatingGridSizer.addEventListener("click", (e) => {
  const btn = e.target.closest('.floating-controls__btn--sizer');
  if (!btn) return;

  const axis = btn.dataset.axis;
  const dir = Number(btn.dataset.dir);
  const current = gridController.gridState[axis];
  const next = current + dir;

  if (next < 1 || next > 10) return;

  gridController.updateGridSize(
    axis === "rows" ? next : gridController.gridState.rows,
    axis === "cols" ? next : gridController.gridState.cols
  );
  renderGrid(gridController.gridState);

  updateSizerOutput ();
});