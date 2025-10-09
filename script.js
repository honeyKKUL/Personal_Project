// script.js (최종 디자인, 기능, 배너/이펙트 오류 수정 버전)

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

// 배너 관련 DOM 요소 추가
const achievementBanner = document.getElementById('achievement-banner');
const achievementText = document.getElementById('achievement-text');


// 이벤트 상태 변수 (1010 이벤트)
let isEventActive = false; 
const eventThreshold = 1010; 
const eventGif = 'hit_event.gif'; 
const eventDuration = 4000; 

let hitCount = 0;
let currentCursor = 'cursor01'; 
let currentDamage = 1; 

const normalImage = 'Hit_01.png';
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png', 'Hit_05.png']; 
const displayTime = 150; 
const effectDuration = 300; // CSS 애니메이션 지속 시간(0.3s)과 일치

// ------------------------------------
// 2. 핵심 함수
// ------------------------------------

// 커서 경로 설정
function getCursorPaths(cursorName) {
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

    // 이벤트 발생 시 배너를 사용하여 메시지 표시 (필요에 따라 활성화)
    showAchievementBanner("1010 타격 달성!");
    console.log("🎉 1010 이벤트가 발생했습니다!");
}

/**
 * 💥 문제 해결 1: 배너가 사라지도록 타이머 설정
 */
function showAchievementBanner(title) {
    // 임시 배너이므로 타이틀은 고정하거나, 필요한 경우만 표시
    achievementText.textContent = title;
    achievementBanner.classList.add('show');
    
    // 2.5초 후 배너를 숨김
    setTimeout(() => {
        achievementBanner.classList.remove('show');
    }, 2500); 
}


/**
 * 💥 문제 해결 2: 타격 이펙트 생성 및 재생 로직 안정화
 */
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    
    // 위치 설정 (클릭 지점 중앙)
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

    body.appendChild(effect);
    
    // requestAnimationFrame을 사용하여 DOM이 완전히 업데이트된 후 애니메이션 클래스 적용
    requestAnimationFrame(() => {
        effect.classList.add('animate');
    });

    // 이펙트 제거 (CSS 애니메이션 시간 + 여유 시간)
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

    // 좌표 추출
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
// 3. 커서 및 모달/설정 함수 (이전 코드와 동일)
// ------------------------------------

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


function handleCursorChange(event) {
    const clickedButton = event.currentTarget;
    const newCursorName = clickedButton.dataset.cursor;
    const newDamage = parseInt(clickedButton.dataset.damage); 
    
    const previouslySelectedButton = document.querySelector('.cursor-button.selected');
    if (previouslySelectedButton) {
        previouslySelectedButton.classList.remove('selected');
        const oldCursorName = previouslySelectedButton.dataset.cursor;
        const oldIconImg = previouslySelectedButton.querySelector('img');
        if (oldIconImg) {
            oldIconImg.src = `${oldCursorName}_icon_off.png`;
        }
    }
    
    clickedButton.classList.add('selected');
    const newIconImg = clickedButton.querySelector('img');
    if (newIconImg) {
        newIconImg.src = `${newCursorName}_icon_on.png`;
    }

    currentCursor = newCursorName;
    currentDamage = newDamage; 
    
    updateMonsterCursor();
}


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


function toggleSettingsMenu() {
    settingsMenu.style.display = settingsMenu.style.display === 'none' || settingsMenu.style.display === '' 
        ? 'flex' 
        : 'none';
}


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
    
    if (event.target !== settingsButton && !settingsMenu.contains(event.target) && settingsMenu.style.display !== 'none') {
        if (event.target.id !== 'achievement-button' && event.target.id !== 'dev-button') {
            settingsMenu.style.display = 'none';
        }
    }
});

// 페이지 로드 시 초기화 함수 실행
initializeCursors();
