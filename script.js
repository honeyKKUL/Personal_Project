// 몬스터 이미지 요소를 가져옵니다.
const monsterImage = document.getElementById('monster');

// 타격 이미지 파일 경로
const hitImage = 'Hit_02.png';
// 기본 이미지 파일 경로
const normalImage = 'Hit_01.png';
// 이미지 유지 시간 (밀리초) - 너무 짧으면 시각적으로 인지하기 어려울 수 있어요.
const displayTime = 150; // 0.15초

// 클릭 이벤트를 처리하는 함수
function handleHit() {
    // 1. 이미지를 'Hit_02.png' (타격 이미지)로 변경합니다.
    monsterImage.src = hitImage;

    // 2. 일정 시간(displayTime) 후에 이미지를 'Hit_01.png' (기본 이미지)로 되돌립니다.
    // setTimeout 함수를 사용하여 일정 시간 후에 코드가 실행되도록 합니다.
    setTimeout(() => {
        monsterImage.src = normalImage;
    }, displayTime);
}

// 몬스터 이미지에 클릭 이벤트 리스너를 추가합니다.
monsterImage.addEventListener('mousedown', handleHit);

// 참고: 'mousedown' 이벤트를 사용하면 마우스를 누르는 순간 이미지가 바뀌어
// 'click' 이벤트보다 더 빠르게 반응하는 클릭 게임의 느낌을 줄 수 있습니다.
