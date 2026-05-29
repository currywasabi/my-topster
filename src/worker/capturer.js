import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js";

export function capture(element) {
    html2canvas(element, {
        useCORS: true, // 필수 (없으면 앨범 커버 이미지 누락된 채 다운로드됨)
        height: element.offsetHeight //다운로드 밑에 흰 줄 없애기
    }).then((canvas) => {
        const link = document.createElement('a');
        link.download = '나의 탑스터.png'
        link.href = canvas.toDataURL();
        link.click()
    });
}