// script.js (전체 코드)

// DOM 요소
const monsterImage = document.getElementById('monster');
const counterDisplay = document.getElementById('hit-count');
const body = document.body;
const cursorButtons = document.querySelectorAll('.cursor-button');

// 업적 및 설정 관련 DOM 요소
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
const achievementList = document.getElementById('achievement-list');
const achievementBanner = document.getElementById('achievement-banner');
const achievementText = document.getElementById('achievement-text');

// ------------------------------------
// 이벤트 상태 변수
// ------------------------------------
let isEventActive = false; 
const eventThreshold = 1010; 
const eventGif = 'hit_event.gif'; 
const eventDuration = 4000; 

// 업적 데이터 정의 (생략: 기존과 동일)
const ACHIEVEMENTS = {
    'first_hit': { title: '첫 클릭!', condition: 1, achieved: false, type: 'hitCount', icon: 'icon_first_hit.png' },
    'amateur_striker': { title: '초보 타격가', condition: 50, achieved: false, type: 'hitCount', icon: 'icon_amateur_striker.png' },
    'single_cursor_01': { title: '제대로 저로 개종해주셨나요?', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor01', icon: 'icon_single_cursor_01.png' },
    'single_cursor_02': { title: '큭큭, 바보같을 정도로 성실하신 분...', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor02', icon: 'icon_single_cursor_02.png' },
    'single_cursor_03': { title: '당신에게 선택받는다고 해서 무엇이 달라지지는...', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor03', icon: 'icon_single_cursor_03.png' },
    'single_cursor_04': { title: '나, 나하하... 사용한 건 나 뿐? 탐정씨도 참...', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor04', icon: 'icon_single_cursor_04.png' },
    'single_cursor_05': { title: '이히히!!!! 벌써 끝인가요~?', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor05', icon: 'icon_single_cursor_05.png' },
    'single_cursor_06': { title: '그야말로 일로매진이로군, 오오사키 군!', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor06', icon: 'icon_single_cursor_06.png' },
    'single_cursor_07': { title: '오오사키 님, 해내셨군요. 훌륭하십니다.', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor07', icon: 'icon_single_cursor_07.png' },
    'single_cursor_08': { title: '...❤️', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor08', icon: 'icon_single_cursor_08.png' },
    'single_cursor_09': { title: '아, 아앗... 저, 저로도 괜찮으시다면...', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor09', icon: 'icon_single_cursor_09.png' },
    'single_cursor_10': { title: '나로만 달성했다는 건가? 무겁네~ 네 마음은!', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor10', icon: 'icon_single_cursor_10.png' },
};

let singleCursorHitCounts = {
    'cursor01': 0, 'cursor02': 0, 'cursor03': 0, 'cursor04': 0, 'cursor05': 0, 
    'cursor06': 0, 'cursor07': 0, 'cursor08': 0, 'cursor09': 0, 'cursor10': 0, 
};

const UNLOCK_INTERVAL = 50;
const UNLOCK_THRESHOLDS = {};
for (let i = 2; i <= 10; i++) {
    const key = `cursor${i.toString().padStart(2, '0')}`;
    UNLOCK_THRESHOLDS[key] = (i - 1) * UNLOCK_INTERVAL;
}

let hitCount = 0;
let currentCursor = 'cursor01'; 
let currentDamage = 1; 

const normalImage = 'Hit_01.png';
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png', 'Hit_05.png'];
const displayTime = 150; 
const effectDuration = 300; 


function getCursorPaths(cursorName) {
    return {
        normal: `url('${cursorName}.png'), pointer`,
        hit: `url('${cursorName}_hit.png'), pointer`
    };
}

function updateMonsterCursor() {
    const cursorPath = getCursorPaths(currentCursor).normal;
    monsterImage.style.cursor = cursorPath; 
}

function playEventAnimation() {
    isEventActive = true; 
    monsterImage.src = eventGif; 
    monsterImage.style.cursor = 'default';

    setTimeout(() => {
        isEventActive = false; 
        monsterImage.src = normalImage;
        updateMonsterCursor(); 
        console.log("1010 이벤트 종료. 게임 플레이 재개.");
    }, eventDuration);
}


// 타격 이펙트 생성 및 재생 함수 (수정)
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

    // 초기 변환 설정
    const randomRotation = Math.floor(Math.random() * 360); 
    effect.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
    
    body.appendChild(effect);
    
    // 💥 수정: 이중 requestAnimationFrame을 사용하여 애니메이션 확실히 트리거
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            effect.classList.add('animate');
        });
    });

    setTimeout(() => {
        effect.remove();
    }, effectDuration + 100); 
}

function showAchievementBanner(title) {
    achievementText.textContent = `업적 달성: ${title}`;
    achievementBanner.classList.add('show');
    
    setTimeout(() => {
        achievementBanner.classList.remove('show');
    }, 2500);
}


function checkAchievements() {
    // 1. Hit Count Achievements 
    for (const key of ['first_hit', 'amateur_striker']) {
        const achievement = ACHIEVEMENTS[key];
        if (achievement.achieved) continue;

        if (hitCount >= achievement.condition) {
            achievement.achieved = true;
            showAchievementBanner(achievement.title);
        }
    }
    
    // 2. Single Cursor Hit Achievements 
    for (let i = 1; i <= 10; i++) {
        const cursorKey = `cursor${i.toString().padStart(2, '0')}`;
        const achievementKey = `single_cursor_${i.toString().padStart(2, '0')}`;
        const ach = ACHIEVEMENTS[achievementKey];

        if (ach && !ach.achieved && singleCursorHitCounts[cursorKey] >= ach.condition) {
            ach.achieved = true;
            showAchievementBanner(ach.title);
        }
    }
}


function checkUnlocks() {
    cursorButtons.forEach(button => {
        const cursorName = button.dataset.cursor;
        if (cursorName === 'cursor01') return;

        const unlockHitCount = UNLOCK_THRESHOLDS[cursorName];

        if (hitCount >= unlockHitCount && button.classList.contains('locked')) {
            button.classList.remove('locked');
            console.log(`🎉 ${cursorName}이(가) ${hitCount}타로 해금되었습니다!`);

            const iconImg = button.querySelector('img');
            if (iconImg) {
                iconImg.src = `${cursorName}_icon_off.png`;
            }
        }
    });
}


// 클릭 이벤트를 처리하는 함수 (handleHit)
function handleHit(event) {
    if (isEventActive) {
        return;
    }
    
    const potentialHitCount = hitCount + currentDamage;
    
    if (hitCount < eventThreshold && potentialHitCount >= eventThreshold) {
        hitCount = eventThreshold;
        counterDisplay.textContent = hitCount;
        
        playEventAnimation(); 
        checkAchievements();
        return;
    }

    // 💥 터치 이벤트/마우스 이벤트에서 좌표 추출 통일
    let clientX = event.clientX;
    let clientY = event.clientY;

    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }

    createHitEffect(clientX, clientY);
    
    hitCount += currentDamage;
    counterDisplay.textContent = hitCount;
    
    singleCursorHitCounts[currentCursor] += 1; 
    
    checkUnlocks();
    checkAchievements();

    const randomIndex = Math.floor(Math.random() * hitImages.length);
    monsterImage.src = hitImages[randomIndex];
    
    const hitCursorPath = getCursorPaths(currentCursor).hit;
    monsterImage.style.cursor = hitCursorPath; 

    setTimeout(() => {
        monsterImage.src = normalImage;
        updateMonsterCursor(); 
    }, displayTime); 
}

// ------------------------------------
// 개발자 기능: 1000 타격 증가 핸들러
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
    
    checkUnlocks();
    checkAchievements();

    closeModal(); 
    alert(`타격수가 1000으로 설정되었습니다! 현재: ${hitCount}`);
}


/**
 * 커서 버튼 클릭 핸들러
 */
function handleCursorChange(event) {
    const clickedButton = event.currentTarget;
    const newCursorName = clickedButton.dataset.cursor;
    
    if (clickedButton.classList.contains('locked')) {
        console.log("잠금 해제 후 선택할 수 있습니다.");
        return; 
    }
    
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


// ------------------------------------
// 모달 (팝업) 기능
// ------------------------------------

/**
 * 업적 목록을 모달에 렌더링하는 함수
 */
function renderAchievements() {
    achievementList.innerHTML = ''; 

    const sortedAchievements = Object.entries(ACHIEVEMENTS).sort(([, a], [, b]) => {
        if (a.type === 'singleHit' && b.type === 'singleHit') {
            return a.cursor.localeCompare(b.cursor);
        }
        return 0;
    });


    for (const [key, ach] of sortedAchievements) {
        const li = document.createElement('li');
        
        let statusText;
        if (ach.achieved) {
            if (ach.type === 'hitCount') {
                statusText = `(${ach.condition} 타격 완료)`;
            } else if (ach.type === 'singleHit') {
                statusText = `(${ach.condition} 타격 완료)`;
            }
        } else {
            statusText = '???';
        }

        li.className = `achievement-item ${ach.achieved ? 'unlocked' : 'locked'}`;
        li.innerHTML = `
            <div class="achievement-text-group">
                <div class="achievement-icon">
                    ${ach.icon ? `<img src="${ach.icon}" alt="아이콘">` : ''} 
                </div>
                <div class="achievement-title-status">
                    <span>${ach.title}</span>
                    <span class="achievement-status">${statusText}</span>
                </div>
            </div>
        `;
        achievementList.appendChild(li);
    }
}

/**
 * 모달 열기 함수 (패널 선택 기능)
 */
function openModal(panelId) {
    if (panelId === 'achievement') {
        renderAchievements();
        modalTitle.textContent = "업적 목록";
        achievementPanel.style.display = 'block';
        developerPanel.style.display = 'none';
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


/**
 * 설정 메뉴 토글 함수
 */
function toggleSettingsMenu() {
    settingsMenu.style.display = settingsMenu.style.display === 'none' || settingsMenu.style.display === '' 
        ? 'flex' 
        : 'none';
}


/**
 * 초기화 함수
 */
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
// 이벤트 리스너 설정
// ------------------------------------

monsterImage.addEventListener('mousedown', handleHit);

// 💥 터치 이벤트를 handleHit 함수로 처리
monsterImage.addEventListener('touchstart', (event) => {
    handleHit(event);
    event.preventDefault(); 
});

cursorButtons.forEach(button => {
    button.addEventListener('click', handleCursorChange);
});

settingsButton.addEventListener('click', toggleSettingsMenu);

achievementButton.addEventListener('click', () => openModal('achievement'));
devButton.addEventListener('click', () => openModal('developer'));

jump1000HitsButton.addEventListener('click', handleHitJump);

closeButton.addEventListener('click', closeModal);

// 외부 클릭 시 모달 또는 메뉴 닫기 로직
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
    
    if (event.target !== settingsButton && !settingsMenu.contains(event.target)) {
        settingsMenu.style.display = 'none';
    }
});

// 페이지 로드 시 초기화 함수 실행
initializeCursors();
