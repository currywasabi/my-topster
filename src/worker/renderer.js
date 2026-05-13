const createItemHtml = (index, album) => `
    <div class="item">
        <span class="temp-text-container">${album === null ? '' : album}</span>
        <button class="delete-button" data-index="${index}">X</button>
    </div>
`;

const createTitleListHtml = (rowAlbums) => {
    let titleListHTML = `<ol class="title-list">`;
    rowAlbums.forEach(rowAlbum => {
        if (rowAlbum !== null) {
            titleListHTML += `<li class="title-list-item">${rowAlbum}</li>`
        }
    });
    titleListHTML += `</ol>`;

    return titleListHTML;
}

export const renderGrid = (gridState) => {
    const { rows, cols, albumList } = gridState;
    const gridSize = rows * cols;

    let gridHTML = "";
    for (let i = 0; i < gridSize; i++) {
        gridHTML += createItemHtml(i, albumList[i]);

        if ((i+1) % cols === 0) {
            const start = i - (cols - 1);
            const end = i + 1;
            const rowAlbums = albumList.slice(start, end);
            
            gridHTML += createTitleListHtml(rowAlbums);
        }
    }

    const logoHTML = `<img src="image/logo_500X500.png" id="logo">`;
    return gridHTML + logoHTML;
}