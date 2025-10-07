// script.js (전체 코드)

// DOM 요소
const monsterImage = document.getElementById('monster');
const counterDisplay = document.getElementById('hit-count'); 
const body = document.body; 
const cursorButtons = document.querySelectorAll('.cursor-button'); // 💥 버튼 요소들을 가져옵니다.

// 전역 상태 변수
let hitCount = 0;
// 💥 현재 선택된 커서의 기본 파일명 (예: 'cursor01')
let currentCursor = 'cursor01'; 

// 이미지 및 애니메이션 설정
const normalImage = 'Hit_01.png';
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png'];
const displayTime = 150; 
const effectDuration = 300; 

// 💥 커서 파일 경로를 생성하는 함수
function getCursorPaths(cursorName) {
    return {
        normal: `url('${cursorName}.png'), pointer`,
        hit: `url('${cursorName}_hit.png'), pointer`
    };
}

// 💥 몬스터 이미지의 기본 커서를 업데이트하는 함수
function updateMonsterCursor() {
    const cursorPath = getCursorPaths(currentCursor).normal;
    // 💡 CSS 파일에서 #monster에 정의된 기본 커서 값을 덮어씁니다.
    monsterImage.style.cursor = cursorPath; 
}


// 타격 이펙트 생성 및 재생 함수 (랜덤 회전 로직 포함)
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

    const randomRotation = Math.random() * 360; 
    effect.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
    
    body.appendChild(effect);
    
    requestAnimationFrame(() => {
        effect.classList.add('animate');
    });

    setTimeout(() => {
        effect.remove();
    }, effectDuration + 100); 
}


// 클릭 이벤트를 처리하는 함수 (handleHit)
function handleHit(event) {
    // 💥 이펙트 생성 및 재생
    createHitEffect(event.clientX, event.clientY);
    
    // 1. 타격 횟수 업데이트
    hitCount++;
    counterDisplay.textContent = hitCount;
    
    // 2. 랜덤 타격 이미지 변경
    const randomIndex = Math.floor(Math.random() * hitImages.length);
    monsterImage.src = hitImages[randomIndex];
    
    // 3. 🖱️ 커서를 **선택된** 타격 커서로 변경
    const hitCursorPath = getCursorPaths(currentCursor).hit;
    monsterImage.style.cursor = hitCursorPath; 

    // 4. 일정 시간 후 몬스터 이미지와 커서를 원래대로 되돌립니다.
    setTimeout(() => {
        monsterImage.src = normalImage;
        // 5. 🖱️ 커서를 **선택된** 기본 커서로 복원
        updateMonsterCursor(); 
    }, displayTime);
}

// 💥 커서 버튼 클릭 핸들러
function handleCursorChange(event) {
    const newCursorName = event.currentTarget.dataset.cursor;
    
    // 1. 선택된 커서 업데이트
    currentCursor = newCursorName;
    
    // 2. 몬스터 커서 업데이트 (클릭 시 즉시 커서 변경)
    updateMonsterCursor(); 
    
    // 3. 버튼 UI 업데이트
    cursorButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

// ------------------------------------
// 💥 초기화 및 이벤트 리스너 설정
// ------------------------------------

// 몬스터 이미지에 클릭 이벤트 리스너 추가
monsterImage.addEventListener('mousedown', handleHit);

// 커서 버튼들에 클릭 이벤트 리스너 추가
cursorButtons.forEach(button => {
    button.addEventListener('click', handleCursorChange);
});

// 페이지 로드 시 몬스터 커서를 초기값으로 설정
updateMonsterCursor();
