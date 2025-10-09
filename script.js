// script.js (개발자 기능, 1010 이벤트, 커서 포함 복구 버전)

// ------------------------------------
// 1. DOM 요소 및 상태 변수 선언
// ------------------------------------

const monsterImage = document.getElementById('monster');
const counterDisplay = document.getElementById('hit-count');
const body = document.body;
const cursorButtons = document.querySelectorAll('.cursor-button');
const settingsButton = document.getElementById('settings-button');
const settingsMenu = document.getElementById('settings-menu'); 
const achievementButton = document.getElementById('achievement-button'); 
const devButton = document.getElementById('dev-button'); 
const modal = document.getElementById('achievement-modal');
const closeButton = document.querySelector('.close-button');
const modalTitle = document.getElementById('modal-title'); 
const achievementPanel = document.getElementById('achievement-panel'); 
const developerPanel = document.getElementById('developer-panel'); 
const jump1000HitsButton = document.getElementById('jump-1000-hits'); 

// 이벤트 상태 변수 (1010 이벤트)
let isEventActive = false; 
const eventThreshold = 1010; 
const eventGif = 'hit_event.gif'; // 4초짜리 이벤트 GIF가 필요합니다.
const eventDuration = 4000; 

let hitCount = 0;
let currentCursor = 'cursor01'; 
let currentDamage = 1; 

const normalImage = 'Hit_01.png';
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png', 'Hit_05.png']; 
const displayTime = 150; 
const effectDuration = 300; 

// ------------------------------------
// 2. 핵심 함수
// ------------------------------------

// 커서 경로 설정
function getCursorPaths(cursorName) {
    // 마우스 커서를 동적으로 변경합니다.
    return {
        normal: `url('${cursorName}.png'), pointer`,
    };
}

// 몬스터 커서 업데이트
function updateMonsterCursor() {
    const cursorPath = getCursorPaths(currentCursor).normal;
    monsterImage.style.cursor = cursorPath; 
}

// 1010 타격 이벤트 재생
function playEventAnimation() {
    isEventActive = true; 
    monsterImage.src = eventGif; 
    monsterImage.style.cursor = 'default';

    setTimeout(() => {
        isEventActive = false; 
        monsterImage.src = normalImage;
        updateMonsterCursor(); 
    }, eventDuration);

    console.log("🎉 1010 이벤트가 발생했습니다!");
}


// 타격 이펙트 생성 및 재생 함수
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

    body.appendChild(effect);
    
    // requestAnimationFrame을 사용하여 부드럽게 애니메이션 시작
    requestAnimationFrame(() => {
        effect.classList.add('animate');
    });

    // 이펙트 제거
    setTimeout(() => {
        effect.remove();
    }, effectDuration + 50); 
}


// 클릭 이벤트를 처리하는 함수 (handleHit)
function handleHit(event) {
    if (isEventActive) {
        return;
    }
    
    const potentialHitCount = hitCount + currentDamage;
    
    // 1010 이벤트 트리거 조건 확인
    if (hitCount < eventThreshold && potentialHitCount >= eventThreshold) {
        hitCount = eventThreshold;
        counterDisplay.textContent = hitCount;
        
        playEventAnimation(); 
        return;
    }

    // 좌표 추출 (PC/모바일 환경 모두 대응)
    let clientX = event.clientX;
    let clientY = event.touches && event.touches.length > 0 ? event.touches[0].clientY : event.clientY;
    
    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        event.preventDefault(); 
    }

    createHitEffect(clientX, clientY);
    
    hitCount += currentDamage;
    counterDisplay.textContent = hitCount;
    
    // 몬스터 이미지 변경 (피격 애니메이션)
    const randomIndex = Math.floor(Math.random() * hitImages.length);
    monsterImage.src = hitImages[randomIndex];
    
    // 일정 시간 후 원본 이미지로 복구
    setTimeout(() => {
        monsterImage.src = normalImage;
    }, displayTime); 
}

// ------------------------------------
// 3. 커서 및 모달/설정 함수
// ------------------------------------

// 개발자 기능: 1000 타격 증가 핸들러
function handleHitJump() {
    const targetHitCount = eventThreshold - 10; 
    
    if (hitCount >= targetHitCount) {
        alert("이미 높은 타격수(1000 이상)를 달성했습니다.");
        closeModal();
        return;
    }
    
    hitCount = targetHitCount;
    counterDisplay.textContent = hitCount;
    
    closeModal(); 
    alert(`타격수가 ${targetHitCount}로 설정되었습니다!`);
}


// 커서 버튼 클릭 핸들러
function handleCursorChange(event) {
    const clickedButton = event.currentTarget;
    const newCursorName = clickedButton.dataset.cursor;
    const newDamage = parseInt(clickedButton.dataset.damage); 
    
    // 기존 선택된 버튼 해제
    const previouslySelectedButton = document.querySelector('.cursor-button.selected');
    if (previouslySelectedButton) {
        previouslySelectedButton.classList.remove('selected');
        const oldCursorName = previouslySelectedButton.dataset.cursor;
        const oldIconImg = previouslySelectedButton.querySelector('img');
        if (oldIconImg) {
            oldIconImg.src = `${oldCursorName}_icon_off.png`;
        }
    }
    
    // 새 버튼 선택
    clickedButton.classList.add('selected');
    const newIconImg = clickedButton.querySelector('img');
    if (newIconImg) {
        newIconImg.src = `${newCursorName}_icon_on.png`;
    }

    currentCursor = newCursorName;
    currentDamage = newDamage; 
    
    updateMonsterCursor();
}


// 모달 열기 함수
function openModal(panelId) {
    if (panelId === 'achievement') {
        modalTitle.textContent = "업적 목록 (비활성화)";
        achievementPanel.style.display = 'block';
        developerPanel.style.display = 'none';
        achievementPanel.innerHTML = '<li><p style="color:red;">업적 기능은 롤백되어 비활성화 상태입니다.</p></li>';
    } else if (panelId === 'developer') {
        modalTitle.textContent = "개발자 기능";
        achievementPanel.style.display = 'none';
        developerPanel.style.display = 'block';
    }
    
    settingsMenu.style.display = 'none'; 
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}


// 설정 메뉴 토글 함수
function toggleSettingsMenu() {
    settingsMenu.style.display = settingsMenu.style.display === 'none' || settingsMenu.style.display === '' 
        ? 'flex' 
        : 'none';
}


// 커서 아이콘 초기화 (선택된 것만 on, 나머지는 off)
function initializeCursors() {
    cursorButtons.forEach(button => {
        const cursorName = button.dataset.cursor;
        const iconImg = button.querySelector('img');

        if (button.classList.contains('selected')) {
            if (iconImg) {
                iconImg.src = `${cursorName}_icon_on.png`;
            }
        } else if (iconImg) {
            iconImg.src = `${cursorName}_icon_off.png`;
        }
    });

    updateMonsterCursor(); 
}


// ------------------------------------
// 4. 이벤트 리스너 설정
// ------------------------------------

monsterImage.addEventListener('mousedown', handleHit);
monsterImage.addEventListener('touchstart', handleHit); 

cursorButtons.forEach(button => {
    button.addEventListener('click', handleCursorChange);
});

if(jump1000HitsButton) {
    jump1000HitsButton.addEventListener('click', handleHitJump);
}

settingsButton.addEventListener('click', toggleSettingsMenu);
achievementButton.addEventListener('click', () => openModal('achievement'));
devButton.addEventListener('click', () => openModal('developer'));
closeButton.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
    
    // 설정 메뉴 외부 클릭 시 닫기
    if (event.target !== settingsButton && !settingsMenu.contains(event.target) && settingsMenu.style.display !== 'none') {
        // 단, 설정 메뉴 내 버튼(업적, 개발자) 클릭은 모달 열기 함수에서 처리되도록 예외 처리
        if (event.target.id !== 'achievement-button' && event.target.id !== 'dev-button') {
            settingsMenu.style.display = 'none';
        }
    }
});

// 페이지 로드 시 초기화 함수 실행
initializeCursors();
