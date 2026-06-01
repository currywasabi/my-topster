export const gridController = {
  gridState: {
    albumList: new Array(100).fill(null),
    rows: 3,
    cols: 3,
  },

  addAlbum(input) {
    const { albumList } = this.gridState;
    const emptyIndex = albumList.findIndex((item) => item === null);

    if (
      emptyIndex === -1 ||
      emptyIndex >= this.gridState.rows * this.gridState.cols
    ) {
      alert("탑스터가 가득 찼습니다.");
      return;
    }

    const newAlbumList = [...albumList];
    newAlbumList[emptyIndex] = input;
    this.updateState({ albumList: newAlbumList });
  },

  deleteAlbum(index) {
    const newAlbumList = [...this.gridState.albumList];
    newAlbumList[index] = null;
    this.updateState({ albumList: newAlbumList });
  },

  updateGridSize(rows, cols) {
    this.updateState({ rows, cols });
  },

  // for immutability
  updateState(newData) {
    this.gridState = { ...this.gridState, ...newData };
  },
};
