import { renderGrid } from './worker/renderer.js';
import { search } from './lib/api.js';

const searchInput = document.querySelector("#album-search");
// const searchForm = document.querySelector(".search-form");
const gridContainer = document.querySelector(".grid-container");
const rangeContainer = document.querySelector(".sidebar-container-range");

const gridController = {
  gridState : {
    albumList: new Array(100).fill(null),
    rows: 3,
    cols: 3,
  },

  render() {
    gridContainer.style.gridTemplateColumns = `repeat(${this.gridState.cols}, 1fr) 1fr`;
    gridContainer.innerHTML = renderGrid(this.gridState);
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

// 삭제
gridContainer.addEventListener("click", function (e) {
  gridController.deleteAlbum(Number(e.target.dataset.index));
});

// 그리드 사이즈 바꾸기 (이벤트 위임 활용)
const widthValue = document.querySelector("#width-range");
const heightValue = document.querySelector("#height-range");
const widthOutput = document.querySelector("#width-output");
const heightOutput = document.querySelector("#height-output");

//초기화(축약 가능하지 않을까?)
widthOutput.textContent = widthValue.value;
heightOutput.textContent = heightValue.value;

rangeContainer.addEventListener("change", () => {
  widthOutput.textContent = widthValue.value;
  heightOutput.textContent = heightValue.value;
  gridController.updateGridSize(Number(heightValue.value), Number(widthValue.value));
});


// ***********************************************

// 임시 api!!!!!! by using MusicBrainz

const tempSearchBtn = document.querySelector("#tempSearchBtn");
const searchResults = document.querySelector("#results");

// 앨범 객체 생성자
function Album(title, artist, src) {
  this.title = title;
  this.artist = artist;
  this.src = src;
}

function doSearch(input) {
  if (input.trim() !== "") {
    document.querySelector('.results-container').style.display = "block";
    search(input.trim());
  }
}

// 검색1 - 버튼 클릭
tempSearchBtn.addEventListener("click", () => {
  doSearch(searchInput.value);
});

// 검색2 - 엔터키 입력
searchInput.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') doSearch(searchInput.value);
});

// 추가
searchResults.addEventListener("click", function (e) {
  const target = e.target.closest('.card').dataset;
  const newAlbum = new Album (target.title, target.artist, target.src);
  gridController.addAlbum(newAlbum);
});