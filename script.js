// script.js (전체 코드 - 커서 강화 시스템 반영)

// DOM 요소
const monsterImage = document.getElementById('monster');
const counterDisplay = document.getElementById('hit-count');
const body = document.body;
const cursorButtons = document.querySelectorAll('.cursor-button');

// 💥 업적 및 설정 관련 DOM 요소
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
// 💥 이벤트 상태 변수
// ------------------------------------
let isEventActive = false; // 이벤트 활성 상태 플래그
const eventThreshold = 1010; // 이벤트 발동 타격 수
const eventGif = 'hit_event.gif'; // GIF 파일명 반영됨
const eventDuration = 4000; // GIF 재생 시간 (4초)


// ------------------------------------
// 💥 커서 강화 시스템 변수
// ------------------------------------
const LEVEL_UP_INTERVAL = 50; // 강화되는 타격 수 단위
const MAX_LEVEL = 5; // 최대 강화 단계

// 각 커서의 현재 레벨을 저장하는 객체 (로컬 스토리지에서 로드됨)
let cursorLevels = {}; 


// 💥 업적 데이터 정의 (타격 횟수 해금 대신 '특정 커서로 1010회 타격'으로 변경)
const ACHIEVEMENTS = {
    'ACH_CURSOR_01': { 
        name: '기본 커서 마스터', 
        description: '커서 01로 1010회 타격 달성', 
        condition: { type: 'HIT_WITH_CURSOR', target: 'cursor01', count: 1010 } 
    },
    'ACH_CURSOR_02': { 
        name: '황금 커서 마스터', 
        description: '커서 02로 1010회 타격 달성', 
        condition: { type: 'HIT_WITH_CURSOR', target: 'cursor02', count: 1010 } 
    },
    'ACH_CURSOR_05': { 
        name: '블랙 커서 마스터', 
        description: '커서 05로 1010회 타격 달성', 
        condition: { type: 'HIT_WITH_CURSOR', target: 'cursor05', count: 1010 } 
    },
    'ACH_CURSOR_10': { 
        name: '최강 커서 마스터', 
        description: '커서 10으로 1010회 타격 달성', 
        condition: { type: 'HIT_WITH_CURSOR', target: 'cursor10', count: 1010 } 
    },
    'ACH_ALL_LEVEL_5': { 
        name: '궁극의 무기', 
        description: '모든 커서를 5단계까지 강화', 
        condition: { type: 'ALL_CURSOR_MAX_LEVEL' } 
    },
};
let achievementsState = {}; // 업적 달성 상태 저장


// ------------------------------------
// 유틸리티 함수
// ------------------------------------

/**
 * 로컬 스토리지에서 데이터를 로드합니다.
 */
function loadState() {
    const savedHitCount = localStorage.getItem('hitCount');
    const savedCursor = localStorage.getItem('selectedCursor');
    const savedAchievements = localStorage.getItem('achievementsState');
    const savedLevels = localStorage.getItem('cursorLevels');

    // 1. 타격 수 로드
    let hitCount = savedHitCount ? parseInt(savedHitCount) : 0;

    // 2. 업적 상태 로드
    achievementsState = savedAchievements ? JSON.parse(savedAchievements) : {};
    
    // 3. 커서 레벨 로드 및 초기화
    cursorLevels = savedLevels ? JSON.parse(savedLevels) : {};

    // 로드된 데이터로 hitCount 및 UI 업데이트
    counterDisplay.textContent = hitCount;
    
    // 모든 커서가 잠금 해제 상태로 시작하도록 설정
    cursorButtons.forEach(button => {
        // 'locked' 클래스 제거
        button.classList.remove('locked');
        
        const cursorName = button.dataset.cursor;
        
        // 레벨 데이터가 없으면 기본값 0으로 초기화 (0단계: 기본 피해량)
        if (cursorLevels[cursorName] === undefined) {
            cursorLevels[cursorName] = 0;
        }

        // 툴팁 텍스트 초기화 (레벨 반영)
        updateCursorButtonTooltip(button);
    });

    // 4. 선택 커서 복원
    if (savedCursor) {
        // 기존 선택 해제
        cursorButtons.forEach(button => button.classList.remove('selected'));
        
        // 저장된 커서 선택
        const selectedButton = document.querySelector(`[data-cursor="${savedCursor}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        } else {
            // 저장된 커서가 없으면 기본 커서01 선택
            document.querySelector('[data-cursor="cursor01"]').classList.add('selected');
        }
    } else {
         // 기본 커서01 선택
        document.querySelector('[data-cursor="cursor01"]').classList.add('selected');
    }
    
    // UI 초기화 함수 호출
    initializeCursors();
    updateAchievementList();
    
    return hitCount;
}

/**
 * 로컬 스토리지에 현재 상태를 저장합니다.
 */
function saveState(hitCount) {
    localStorage.setItem('hitCount', hitCount);
    localStorage.setItem('achievementsState', JSON.stringify(achievementsState));
    localStorage.setItem('cursorLevels', JSON.stringify(cursorLevels));
}


// ------------------------------------
// 💥 커서 강화 및 UI 업데이트 함수
// ------------------------------------

/**
 * 커서 버튼의 툴팁 텍스트를 업데이트합니다.
 */
function updateCursorButtonTooltip(button) {
    const cursorName = button.dataset.cursor;
    const baseDamage = parseInt(button.dataset.damage);
    const currentLevel = cursorLevels[cursorName] || 0;
    const currentDamage = baseDamage + currentLevel;
    const nextDamage = baseDamage + currentLevel + 1;
    
    let tooltipText = `피해량: ${currentDamage}`;

    if (currentLevel < MAX_LEVEL) {
        const nextLevelHits = (currentLevel + 1) * LEVEL_UP_INTERVAL;
        tooltipText += ` | 다음 강화 (${currentLevel + 1}단계, ${nextDamage} 피해): 총 ${nextLevelHits}회 타격 시`;
    } else {
        tooltipText += ' | (최대 레벨)';
    }

    button.title = tooltipText;
}


/**
 * 타격 횟수에 따라 커서 레벨을 체크하고 강화합니다.
 */
function checkCursorLevels(hitCount) {
    let allMaxLevel = true;
    
    cursorButtons.forEach(button => {
        const cursorName = button.dataset.cursor;
        const currentLevel = cursorLevels[cursorName];
        
        if (currentLevel < MAX_LEVEL) {
            allMaxLevel = false;
            
            // 다음 레벨업에 필요한 총 타격 횟수
            const nextLevelHits = (currentLevel + 1) * LEVEL_UP_INTERVAL;

            if (hitCount >= nextLevelHits) {
                // 레벨업 실행
                cursorLevels[cursorName] = currentLevel + 1;
                
                // 레벨업 알림 (옵션)
                console.log(`[강화] ${cursorName}이(가) 레벨 ${cursorLevels[cursorName]}이 되었습니다!`);
                
                // 툴팁 UI 업데이트
                updateCursorButtonTooltip(button);
            }
        }
    });
    
    // 모든 커서가 최대 레벨인지 확인하여 업적 체크
    if (allMaxLevel) {
         checkAchievements('ALL_CURSOR_MAX_LEVEL');
    }
}


// ------------------------------------
// 핵심 이벤트 핸들러
// ------------------------------------

/**
 * 몬스터 타격 처리 함수
 */
function handleHit(event) {
    if (isEventActive) return; // 이벤트 중에는 타격 방지
    
    // 1. 현재 선택된 커서 찾기
    const selectedButton = document.querySelector('.cursor-button.selected');
    if (!selectedButton) return;

    const baseDamage = parseInt(selectedButton.dataset.damage);
    const cursorName = selectedButton.dataset.cursor;
    const currentLevel = cursorLevels[cursorName] || 0;
    
    // 2. 💥 피해량 계산: 기본 피해량 + 현재 레벨 (1단계 -> +1, 5단계 -> +5)
    const damage = baseDamage + currentLevel; 

    // 3. 타격 횟수 업데이트
    let hitCount = parseInt(counterDisplay.textContent);
    hitCount += damage;
    counterDisplay.textContent = hitCount;
    
    // 4. 상태 저장
    saveState(hitCount);
    
    // 5. 💥 커서 강화 체크
    checkCursorLevels(hitCount);
    
    // 6. 타격 이펙트 표시 (이펙트는 사용자 복구 코드를 따른다고 가정)
    // 이펙트 관련 코드는 여기에 위치
    
    // 7. 💥 업적 체크 (선택 커서와 현재 타격수 기반)
    checkAchievements('HIT_WITH_CURSOR', cursorName, hitCount);
    
    // 8. 이벤트 발동 체크
    if (hitCount >= eventThreshold && !isEventActive) {
        startEvent();
    }
}


/**
 * 커서 변경 처리 함수
 */
function handleCursorChange(event) {
    const newSelectedButton = event.currentTarget;
    
    // 💥 잠금 기능 삭제, 바로 선택 가능
    
    // 기존 선택 해제
    cursorButtons.forEach(button => {
        if (button.classList.contains('selected')) {
            button.classList.remove('selected');
            // 아이콘 off로 변경
            const oldCursorName = button.dataset.cursor;
            button.querySelector('img').src = `${oldCursorName}_icon_off.png`;
        }
    });

    // 새 커서 선택
    newSelectedButton.classList.add('selected');
    const newCursorName = newSelectedButton.dataset.cursor;
    
    // 아이콘 on으로 변경
    newSelectedButton.querySelector('img').src = `${newCursorName}_icon_on.png`;
    
    // 상태 저장
    localStorage.setItem('selectedCursor', newCursorName);
    
    // 마우스 커서 업데이트
    updateMonsterCursor();
}

// ------------------------------------
// UI 및 기타 함수
// ------------------------------------

/**
 * 마우스 커서 아이콘을 업데이트합니다.
 */
function updateMonsterCursor() {
    const selectedButton = document.querySelector('.cursor-button.selected');
    if (selectedButton) {
        const cursorName = selectedButton.dataset.cursor;
        // 커서 이미지 파일명: [cursorName]_cursor.cur (기존 로직 유지)
        monsterImage.style.cursor = `url('${cursorName}_cursor.cur'), auto`;
    }
}

/**
 * 업적 체크 및 달성 처리
 * @param {string} type - 체크할 조건 타입 (예: 'HIT_WITH_CURSOR', 'ALL_CURSOR_MAX_LEVEL')
 * @param {string} [cursorName] - HIT_WITH_CURSOR 타입일 때 커서 이름
 * @param {number} [hitCount] - HIT_WITH_CURSOR 타입일 때 현재 타격 횟수
 */
function checkAchievements(type, cursorName, hitCount) {
    let newlyAchieved = [];
    
    for (const id in ACHIEVEMENTS) {
        const achievement = ACHIEVEMENTS[id];
        const condition = achievement.condition;
        
        if (achievementsState[id]) continue; // 이미 달성함

        let isAchieved = false;

        if (type === 'HIT_WITH_CURSOR' && condition.type === 'HIT_WITH_CURSOR') {
            // 💥 '특정 커서로 1010회 타격' 조건
            if (condition.target === cursorName && hitCount >= condition.count) {
                isAchieved = true;
            }
        } else if (type === 'ALL_CURSOR_MAX_LEVEL' && condition.type === 'ALL_CURSOR_MAX_LEVEL') {
            // 💥 '모든 커서 레벨 5 달성' 조건
            const allMax = cursorButtons.every(button => {
                const name = button.dataset.cursor;
                return cursorLevels[name] >= MAX_LEVEL;
            });
            if (allMax) {
                isAchieved = true;
            }
        }
        
        if (isAchieved) {
            achievementsState[id] = true;
            newlyAchieved.push(achievement.name);
        }
    }
    
    if (newlyAchieved.length > 0) {
        saveState(parseInt(counterDisplay.textContent));
        updateAchievementList();
        newlyAchieved.forEach(name => showAchievementBanner(name));
    }
}

/**
 * 업적 목록을 모달에 업데이트합니다.
 */
function updateAchievementList() {
    achievementList.innerHTML = '';
    
    for (const id in ACHIEVEMENTS) {
        const achievement = ACHIEVEMENTS[id];
        const isUnlocked = achievementsState[id] || false;
        const listItem = document.createElement('li');
        listItem.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        // 아이콘 이미지
        const iconSrc = isUnlocked ? 'achievement_unlocked.png' : 'achievement_locked.png';
        
        listItem.innerHTML = `
            <div class="achievement-text-group">
                <div class="achievement-icon">
                    <img src="${iconSrc}" alt="업적 아이콘">
                </div>
                <div class="achievement-title-status">
                    <span>${achievement.name}</span>
                    <span class="achievement-status">${achievement.description}</span>
                </div>
            </div>
        `;
        achievementList.appendChild(listItem);
    }
}


/**
 * 업적 달성 배너 표시
 */
function showAchievementBanner(achievementName) {
    achievementText.textContent = `업적 달성: ${achievementName}!`;
    achievementBanner.classList.add('show');
    setTimeout(() => {
        achievementBanner.classList.remove('show');
    }, 4000); 
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
        
        // 💥 모든 커서는 잠금 해제 상태로 시작하므로, 툴팁 업데이트만 수행
        updateCursorButtonTooltip(button);
    });

    updateMonsterCursor(); 
}


// ------------------------------------
// 이벤트 발동 시스템 (GIF)
// ------------------------------------

/**
 * 이벤트 시작
 */
function startEvent() {
    isEventActive = true;
    const originalSrc = monsterImage.src;
    
    monsterImage.src = eventGif; 
    
    setTimeout(() => {
        monsterImage.src = originalSrc;
        isEventActive = false;
        // NOTE: 이벤트를 한 번만 발생시키려면 eventThreshold를 더 높은 값으로 설정하거나, 이벤트 발생 상태를 localStorage에 저장해야 합니다.
    }, eventDuration);
}


// ------------------------------------
// 이벤트 리스너 설정
// ------------------------------------

// 상태 로드 및 hitCount 초기화
let currentHitCount = loadState();

monsterImage.addEventListener('mousedown', handleHit);

cursorButtons.forEach(button => {
    // 💥 모든 커서는 잠금 해제 상태로 시작하므로 'locked' 클래스 제거
    button.classList.remove('locked'); 
    button.addEventListener('click', handleCursorChange);
});

// 설정 메뉴 토글
settingsButton.addEventListener('click', toggleSettingsMenu);

// 모달 열기/닫기
achievementButton.addEventListener('click', () => {
    modalTitle.textContent = '업적 목록';
    achievementPanel.style.display = 'block';
    developerPanel.style.display = 'none';
    modal.style.display = 'block';
});

devButton.addEventListener('click', () => {
    modalTitle.textContent = '개발자 기능';
    achievementPanel.style.display = 'none';
    developerPanel.style.display = 'flex';
    modal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 개발자 기능: 타격수 증가
jump1000HitsButton.addEventListener('click', () => {
    let hitCount = parseInt(counterDisplay.textContent);
    hitCount += 1000;
    counterDisplay.textContent = hitCount;
    saveState(hitCount);
    // 상태 변경 후 강화 및 업적 체크
    checkCursorLevels(hitCount);
    // 선택된 커서로 업적 체크
    const selectedButton = document.querySelector('.cursor-button.selected');
    if (selectedButton) {
        const cursorName = selectedButton.dataset.cursor;
        checkAchievements('HIT_WITH_CURSOR', cursorName, hitCount);
    }
});
