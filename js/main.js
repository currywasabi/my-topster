const searchInput = document.querySelector("#album-search");
const searchForm = document.querySelector(".search-form");
const addChartBtn = document.querySelector(".add-to-chart-button");
const gridContainer = document.querySelector(".grid-container");

// 그리드 크기, albumList 관리
let gridState = {
  rows: 3,
  cols: 3,
  albumList: new Array(3*3).fill(null) // new 한번 지워보기
}

function render() {
  gridContainer.style.gridTemplateColumns = `repeat(${gridState.cols}, 1fr) 1fr`
  
  const gridHTML = gridState.albumList.map((album, index) => {
    let itemHTML = "";
    if (album === null) {
      itemHTML =  `
      <div class="item">
        <span class="temp-text-container"></span>
        <button class="delete-button" data-index="${index}">X</button>
      </div>`;
    }
    else {
      itemHTML =  `
      <div class="item">
        <span class="temp-text-container">${album}</span>
        <button class="delete-button" data-index="${index}">X</button>
      </div>`;
    }
    
    //titlelist
    if ((index+1) % gridState.cols === 0) {
      const start = index - (gridState.cols - 1);
      const end = index + 1;
      const rowAlbums = gridState.albumList.slice(start, end);
      
      let titleListHTML = `<ol class="title-list">`;
      rowAlbums.forEach(function(rowAlbum) {
        if (rowAlbum !== null) {
          titleListHTML += `<li class="title-list-item">${rowAlbum}</li>`
        }
      });
      titleListHTML += `</ol>`;
      
      return itemHTML + titleListHTML;
    }

    return itemHTML;
  }). join('');

  const logoHTML = `<img src="assets/logo_500X500.png" id="logo">`;
  gridContainer.innerHTML = gridHTML + logoHTML;
}

function addAlbum(input) {
  const emptyIndex = gridState.albumList.findIndex(item => item === null);
  // 못 찾으면 -1 반환
  if (emptyIndex !== -1) {
    gridState.albumList[emptyIndex] = input;
    render();
  }
  else {
    alert("탑스터가 가득 찼습니다.");
  }
}

function deleteAlbum(index) {
  gridState.albumList[index] = null;
  render();
}

// ***********************************************

render();
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

  addAlbum(albumTitle);
  searchInput.value = ""; //입력창 초기화
});

gridContainer.addEventListener("click", function (e) {
  deleteAlbum(e.target.dataset.index); // 문자열 그대로 집어넣은 건데...
});
