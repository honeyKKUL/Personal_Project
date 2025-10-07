// 몬스터 이미지 요소를 가져옵니다.
const monsterImage = document.getElementById('monster');
// 타격 횟수 카운터를 표시할 요소를 가져옵니다.
const counterDisplay = document.getElementById('hit-count'); 

// 타격 횟수 변수를 초기화합니다.
let hitCount = 0;

// 기본 이미지 파일 경로 (몬스터 이미지)
const normalImage = 'Hit_01.png';

// 💥 랜덤으로 선택될 타격 이미지 파일 배열
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png'];

// 이미지/커서 유지 시간 (밀리초)
const displayTime = 150; 

// 타격 시 사용할 커서 이미지 정의
const hitCursor = "url('cursor_hit.png'), pointer";

// 클릭 이벤트를 처리하는 함수
function handleHit() {
    // 1. 타격 횟수를 1 증가시키고 화면을 업데이트합니다.
    hitCount++;
    counterDisplay.textContent = hitCount;
    
    // 💥 2. 랜덤으로 타격 이미지 중 하나를 선택합니다.
    const randomIndex = Math.floor(Math.random() * hitImages.length);
    const randomHitImage = hitImages[randomIndex];
    
    // 3. 몬스터 이미지를 랜덤으로 선택된 타격 이미지로 변경합니다.
    monsterImage.src = randomHitImage;

    // 4. 🖱️ 커서를 'cursor_hit.png' (타격 커서)로 변경합니다.
    monsterImage.style.cursor = hitCursor; 

    // 5. 일정 시간 후에 몬스터 이미지와 커서를 원래대로 되돌립니다.
    setTimeout(() => {
        // 몬스터 이미지 원상 복구 (Hit_01.png)
        monsterImage.src = normalImage;

        // 6. 🖱️ 커서의 인라인 스타일을 제거하여 CSS에 정의된 기본 커서로 되돌립니다.
        monsterImage.style.cursor = ''; 
    }, displayTime);
}

// 몬스터 이미지에 클릭 이벤트 리스너를 추가합니다.
monsterImage.addEventListener('mousedown', handleHit);
