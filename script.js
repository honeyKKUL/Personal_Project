// script.js

// 몬스터 이미지 요소를 가져옵니다.
const monsterImage = document.getElementById('monster');

// 타격 이미지 파일 경로 (몬스터 이미지)
const hitImage = 'Hit_02.png';
// 기본 이미지 파일 경로 (몬스터 이미지)
const normalImage = 'Hit_01.png';
// 이미지/커서 유지 시간 (밀리초)
const displayTime = 150; 

// ✨ 타격 시 사용할 커서 이미지 정의
const hitCursor = "url('cursor_hit.png'), pointer";

// 클릭 이벤트를 처리하는 함수
function handleHit() {
    // 1. 몬스터 이미지를 'Hit_02.png'로 변경합니다.
    monsterImage.src = hitImage;

    // 2. 🖱️ 커서를 'cursor_hit.png' (타격 커서)로 변경합니다.
    // 인라인 스타일로 적용하여 CSS 설정을 임시로 덮어씁니다.
    monsterImage.style.cursor = hitCursor; 

    // 3. 일정 시간 후에 몬스터 이미지와 커서를 원래대로 되돌립니다.
    setTimeout(() => {
        // 몬스터 이미지 원상 복구
        monsterImage.src = normalImage;

        // 4. 🖱️ 커서의 인라인 스타일을 제거하여 CSS에 정의된 기본 커서('cursor.png')로 되돌립니다.
        monsterImage.style.cursor = ''; 
    }, displayTime);
}

// 몬스터 이미지에 클릭 이벤트 리스너를 추가합니다.
monsterImage.addEventListener('mousedown', handleHit);
