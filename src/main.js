import { renderGrid } from './worker/renderer.js';
import { search } from './lib/api.js';
import { capture } from './worker/capturer.js';

const grid = document.querySelector(".grid");

const searchInput = document.querySelector(".search-bar__input");
const searchBtn = document.querySelector(".search-bar__btn--search");
const downloadBtn = document.querySelector('.search-bar__btn--download');

const gridSizer = document.querySelector(".grid-sizer");
const widthValue = document.querySelector(".grid-sizer__input--width");
const heightValue = document.querySelector(".grid-sizer__input--height");
const widthOutput = document.querySelector(".grid-sizer__output--width");
const heightOutput = document.querySelector(".grid-sizer__output--height");

const searchResults = document.querySelector(".results");

const gridController = {
  gridState : {
    albumList: new Array(100).fill(null),
    rows: 3,
    cols: 3,
  },

  render() {
    grid.style.gridTemplateColumns = `repeat(${this.gridState.cols}, 1fr) 1fr`;
    grid.innerHTML = renderGrid(this.gridState);
  },

  addAlbum(input) {
    const { albumList } = this.gridState;
    const emptyIndex = albumList.findIndex(item => item === null);
    
    if (emptyIndex === -1 || emptyIndex >= this.gridState.rows * this.gridState.cols) {
      alert("탑스터가 가득 찼습니다.");
      return;
    }

    const newAlbumList = [...albumList];
    newAlbumList[emptyIndex] = input;
    this.updateState({ albumList : newAlbumList });
  },

  deleteAlbum(index) {
    const newAlbumList = [...this.gridState.albumList];
    newAlbumList[index] = null;
    this.updateState({ albumList : newAlbumList });
  },

  updateGridSize(rows, cols) {
    this.updateState({ rows, cols });
  },

  // 제미나이 추천
  updateState(newData) {
    this.gridState = { ...this.gridState, ...newData };
    this.render()
  }
}


// ***********************************************


gridController.render();


// 앨범 추가
searchResults.addEventListener("click", function (e) {
  const target = e.target.closest('.results__card').dataset;
  const newAlbum = new Album (target.title, target.artist, target.src);
  gridController.addAlbum(newAlbum);
});

// 앨범 삭제
grid.addEventListener("click", function (e) {
  gridController.deleteAlbum(Number(e.target.dataset.index));
});


// ***********************************************
// 그리드 사이즈 조절 파트 (이벤트 위임 활용)


//초기화(축약 가능하지 않을까?)
widthOutput.textContent = widthValue.value;
heightOutput.textContent = heightValue.value;

gridSizer.addEventListener("input", () => {
  widthOutput.textContent = widthValue.value;
  heightOutput.textContent = heightValue.value;
});

gridSizer.addEventListener("change", () => {
  gridController.updateGridSize(Number(heightValue.value), Number(widthValue.value));
});


// ***********************************************
// 검색 파트 (by using MusicBrainz API)


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


// ***********************************************
// 그리드 캡쳐(탑스터 다운로드 항목)


downloadBtn.addEventListener("click", () => {
  capture(grid);
});