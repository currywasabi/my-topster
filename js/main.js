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

  get gridSize() {
    return this.gridState.rows * this.gridState.cols;
  },

  render() {
    const { rows, cols, albumList } = this.gridState;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr) 1fr`;

    let itemHTML = "";
    for (let i = 0; i < this.gridSize; i++) {
      if (albumList[i] === null) {
        itemHTML +=  `
          <div class="item">
            <span class="temp-text-container"></span>
            <button class="delete-button" data-index="${i}">X</button>
          </div>`;
      }
      else {
        itemHTML +=  `
          <div class="item">
            <span class="temp-text-container">${albumList[i]}</span>
            <button class="delete-button" data-index="${i}">X</button>
          </div>`;
      }

      if ((i+1) % this.gridState.cols === 0) {
        const start = i - (cols - 1);
        const end = i + 1;
        const rowAlbums = albumList.slice(start, end);
        
        let titleListHTML = `<ol class="title-list">`;
        rowAlbums.forEach(function(rowAlbum) {
          if (rowAlbum !== null) {
            titleListHTML += `<li class="title-list-item">${rowAlbum}</li>`
          }
        });
        titleListHTML += `</ol>`;

        itemHTML += titleListHTML;
      }
    }
    
    const logoHTML = `<img src="assets/logo_500X500.png" id="logo">`;
    gridContainer.innerHTML = itemHTML + logoHTML;
  },

  addAlbum(input) {
    const { albumList } = this.gridState;
    const emptyIndex = albumList.findIndex(item => item === null);
    
    if (emptyIndex === -1 || emptyIndex >= this.gridSize) {
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
// window.addEventListener('DOMContentLoaded', () => render());
// 현 상황으로선 같은 기능

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
