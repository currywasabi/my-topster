const gridItemHtml = (index, album) => {
  let itemHTML = `<div class="grid__item">`;
  if (album !== null) {
    itemHTML += `<img src="${album.src}"></img>`;
  }
  itemHTML += `
        <button class="grid__delete-btn" data-index="${index}">✕</button>
    </div>`;

  return itemHTML;
};

const gridTitleListHtml = (rowAlbums) => {
  let titleListHTML = `<ol class="grid__title-list">`;
  rowAlbums.forEach((rowAlbum) => {
    if (rowAlbum !== null) {
      titleListHTML += `<li class="grid__title-item">${rowAlbum.artist} - ${rowAlbum.title}</li>`;
    }
  });
  titleListHTML += `</ol>`;

  return titleListHTML;
};


// ****************************************


const grid = document.querySelector(".grid");

export const renderGrid = (gridState) => {
  const { rows, cols, albumList } = gridState;
  const gridSize = rows * cols;

  let gridHTML = "";
  for (let i = 0; i < gridSize; i++) {
    gridHTML += gridItemHtml(i, albumList[i]);

    if ((i + 1) % cols === 0) {
      const start = i - (cols - 1);
      const end = i + 1;
      const rowAlbums = albumList.slice(start, end);

      gridHTML += gridTitleListHtml(rowAlbums);
    }
  }

  const logoHTML = `<img src="public/image/logo_500X500.png" id="logo">`;

  grid.style.setProperty('--cols', cols); // css 조절용
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr) 1fr`;
  grid.innerHTML = gridHTML + logoHTML;
};
