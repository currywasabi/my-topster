import { renderGrid } from './worker/renderer.js';
import { search } from './lib/api.js';

const searchInput = document.querySelector("#album-search");
const searchForm = document.querySelector(".search-form");
const addChartBtn = document.querySelector(".add-to-chart-button");
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

// 추가
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const albumTitle = searchInput.value;

  if (albumTitle.trim() === "") {
    alert("최소 1글자 이상 입력해 주세요.");
    return;
  }

  gridController.addAlbum(albumTitle);
  searchInput.value = ""; //입력창 초기화
});

// 삭제
// 문자열 그대로 집어넣었지만 작동은 한다
gridContainer.addEventListener("click", function (e) {
  gridController.deleteAlbum(e.target.dataset.index);
});

// 그리드 사이즈 바꾸기
// 이벤트 위임
// 정신없어서 일부러 input 대신 change
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

// 임시 api!!!!!! by using MusicBrainz

const tempSearchBtn = document.querySelector("#tempSearchBtn");

tempSearchBtn.addEventListener("click", () => {
  if (searchInput.value.trim() !== "") {
    search(searchInput.value.trim());
  }
});