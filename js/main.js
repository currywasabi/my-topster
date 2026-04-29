const searchInput = document.querySelector("#album-search");
const searchForm = document.querySelector(".search-form");
const addChartBtn = document.querySelector(".add-to-chart-button");

const albumList = Array(9).fill("");

// n번째 그리드 내용 + 우측 앨범 타이틀 바꿔 주는 함수
function changeItems(index, title) {
  document.querySelectorAll(".temp-text-container")[index].innerHTML = title;
  document.querySelectorAll(".title-list-item")[index].innerHTML = title;
}

// 앨범 추가
searchForm.addEventListener("submit", function (e) {
  e.preventDefault(); //중요! submit하면 기본으로 새로고침

  const albumTitle = searchInput.value;

  //예외처리
  if (albumTitle.trim() === "") {
    alert("최소 1글자 이상 입력해 주세요.");
    return;
  }

  for (let i = 0; i < 9; i++) {
    if (albumList[i] === "") {
      albumList[i] = albumTitle;
      changeItems(i, albumTitle);
      searchInput.value = ""; //입력창 초기화
      break;
    }
    // 탑스터 가득 찼는지 여부 테스트
    if (i === 8) {
      alert("탑스터가 가득 찼습니다.");
      searchInput.value = "";
      return;
    }
  }
});

// 앨범 삭제
document.querySelector(".grid-container").addEventListener("click", function (e) {
    if (albumList[e.target.dataset.index] !== "") {
      albumList[e.target.dataset.index] = "";
      changeItems(e.target.dataset.index, "");
    }
  });
