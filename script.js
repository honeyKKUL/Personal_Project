// script.js (최종 수정본 - 문법 오류 수정, 강화 시스템 반영, 커서 파일명/확장자 복구)

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
// 💥 이벤트 및 상태 변수
// ------------------------------------
let isEventActive = false; // 이벤트 활성 상태 플래그
const eventThreshold = 1010; // 이벤트 발동 타격 수
const eventGif = 'hit_event.gif'; // GIF 파일명
const eventDuration = 4000; // GIF 재생 시간 (4초)

let hitCount = 0;
let currentCursor = 'cursor01'; 


// ------------------------------------
// 💥 커서 강화 시스템 변수
// ------------------------------------
const LEVEL_UP_INTERVAL = 50; // 강화되는 타격 수 단위
const MAX_LEVEL = 5; // 최대 강화 단계

// 각 커서의 현재 레벨과 단일 타격 횟수를 저장하는 객체 (로컬 스토리지에서 로드됨)
let cursorLevels = {}; 
let singleCursorHitCounts = {};


// 💥 업적 데이터 정의
const ACHIEVEMENTS = {
    'ACH_CURSOR_01': { 
        title: '기본 커서 마스터', 
        description: '커서 01로 1010회 타격 달성', 
        condition: { type: 'HIT_WITH_CURSOR', target: 'cursor01', count: 1010 },
        icon: 'icon_cursor_01_master.png' 
    },
    'ACH_CURSOR_02': { 
        title: '황금 커서 마스터', 
        description: '커서 02로 1010회 타격 달성', 
        condition: { type: 'HIT_WITH_CURSOR', target: 'cursor02', count: 1010 },
        icon: 'icon_cursor_02_master.png'
    },
    'ACH_CURSOR_05': { 
        title: '블랙 커서 마스터', 
        description: '커서 05로 1010회 타격 달성', 
        condition: { type: 'HIT_WITH_CURSOR', target: 'cursor05', count: 1010 },
        icon: 'icon_cursor_05_master.png'
    },
    'ACH_CURSOR_10': { 
        title: '최강 커서 마스터', 
        description: '커서 10으로 1010회 타격 달성', 
        condition: { type: 'HIT_WITH_CURSOR', target: 'cursor10', count: 1010 },
        icon: 'icon_cursor_10_master.png'
    },
    'ACH_ALL_LEVEL_5': { 
        title: '궁극의 무기', 
        description: '모든 커서를 5단계까지 강화', 
        condition: { type: 'ALL_CURSOR_MAX_LEVEL' },
        icon: 'icon_all_max_level.png'
    },
    // 기존의 단순 타격수 업적 유지
    'first_hit': { title: '첫 클릭!', description: '총 1회 타격', condition: { type: 'TOTAL_HIT', count: 1 }, icon: 'icon_first_hit.png' },
    'amateur_striker': { title: '초보 타격가', description: '총 50회 타격', condition: { type: 'TOTAL_HIT', count: 50 }, icon: 'icon_amateur_striker.png' },
};
let achievementsState = {}; // 업적 달성 상태 저장

// 몬스터 이미지 및 애니메이션 설정
const normalImage = 'Hit_01.png';
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png', 'Hit_05.png'];
const displayTime = 150; 
const effectDuration = 250; 


// ------------------------------------
// 유틸리티 및 상태 관리
// ------------------------------------

/**
 * 로컬 스토리지에서 데이터를 로드합니다.
 */
function loadState() {
    const savedHitCount = localStorage.getItem('hitCount');
    const savedCursor = localStorage.getItem('selectedCursor');
    const savedAchievements = localStorage.getItem('achievementsState');
    const savedLevels = localStorage.getItem('cursorLevels');
    const savedSingleHits = localStorage.getItem('singleCursorHitCounts');

    // 1. 상태 로드
    hitCount = savedHitCount ? parseInt(savedHitCount) : 0;
    achievementsState = savedAchievements ? JSON.parse(savedAchievements) : {};
    cursorLevels = savedLevels ? JSON.parse(savedLevels) : {};
    singleCursorHitCounts = savedSingleHits ? JSON.parse(savedSingleHits) : {};


    // 2. 초기화 및 UI 업데이트
    counterDisplay.textContent = hitCount;
    
    // 커서 레벨 및 단일 타격수 초기화/복구
    cursorButtons.forEach(button => {
        const cursorName = button.dataset.cursor;
        if (cursorLevels[cursorName] === undefined) {
            cursorLevels[cursorName] = 0;
        }
        if (singleCursorHitCounts[cursorName] === undefined) {
            singleCursorHitCounts[cursorName] = 0;
        }
        // 툴팁 텍스트 초기화 (레벨 반영)
        updateCursorButtonTooltip(button);
    });

    // 3. 선택 커서 복원
    currentCursor = 'cursor01'; // 기본값
    if (savedCursor) {
        const selectedButton = document.querySelector(`[data-cursor="${savedCursor}"]`);
        if (selectedButton) {
            currentCursor = savedCursor;
        }
    } 
    
    // 4. 초기 UI 렌더링
    initializeCursors();
    updateAchievementList();
}

/**
 * 로컬 스토리지에 현재 상태를 저장합니다.
 */
function saveState() {
    localStorage.setItem('hitCount', hitCount);
    localStorage.setItem('selectedCursor', currentCursor);
    localStorage.setItem('achievementsState', JSON.stringify(achievementsState));
    localStorage.setItem('cursorLevels', JSON.stringify(cursorLevels));
    localStorage.setItem('singleCursorHitCounts', JSON.stringify(singleCursorHitCounts));
}


// ------------------------------------
// 💥 커서 강화 및 피해량 계산
// ------------------------------------

/**
 * 커서 버튼의 툴팁 텍스트를 업데이트합니다.
 */
function updateCursorButtonTooltip(button) {
    const cursorName = button.dataset.cursor;
    const baseDamage = parseInt(button.dataset.damage);
    const currentLevel = cursorLevels[cursorName] || 0;
    
    // 💥 피해량 계산: 기본 피해량 (data-damage) + 현재 레벨
    const currentDamage = baseDamage + currentLevel; 
    
    let tooltipText = `피해량: ${currentDamage}`;

    if (currentLevel < MAX_LEVEL) {
        // 다음 레벨업에 필요한 총 타격 횟수
        const nextLevelHits = (currentLevel + 1) * LEVEL_UP_INTERVAL;
        const nextDamage = baseDamage + currentLevel + 1;
        tooltipText += ` | 다음 강화 (${currentLevel + 1}단계, ${nextDamage} 피해): 총 ${nextLevelHits}회 타격 시`;
    } else {
        tooltipText += ' | (최대 레벨 달성)';
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
        let currentLevel = cursorLevels[cursorName];
        
        if (currentLevel < MAX_LEVEL) {
            allMaxLevel = false;
            
            // 현재 타격 횟수로 도달 가능한 최대 레벨 계산
            const potentialLevel = Math.floor(hitCount / LEVEL_UP_INTERVAL);
            const newLevel = Math.min(potentialLevel, MAX_LEVEL);

            if (newLevel > currentLevel) {
                // 레벨업 실행
                cursorLevels[cursorName] = newLevel;
                console.log(`[강화] ${cursorName}이(가) 레벨 ${newLevel}이 되었습니다!`);
                
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

/**
 * 현재 커서의 실제 피해량을 반환합니다.
 */
function getCurrentDamage() {
    const selectedButton = document.querySelector('.cursor-button.selected');
    if (!selectedButton) return 1;

    const baseDamage = parseInt(selectedButton.dataset.damage);
    const cursorName = selectedButton.dataset.cursor;
    const currentLevel = cursorLevels[cursorName] || 0;

    // 피해량 = 기본 피해량 + 현재 레벨
    return baseDamage + currentLevel; 
}


// ------------------------------------
// 핵심 이벤트 핸들러
// ------------------------------------

/**
 * 클릭 이벤트를 처리하는 함수 (handleHit)
 */
function handleHit(event) {
    // 이벤트가 활성화된 상태면 클릭 무시
    if (isEventActive) {
        return;
    }
    
    const damage = getCurrentDamage(); 

    // 💥 1. 1010 타격 초과 처리 로직 (이벤트)
    const potentialHitCount = hitCount + damage;
    
    if (hitCount < eventThreshold && potentialHitCount >= eventThreshold) {
        // 임계값을 넘기는 순간, 카운트를 1010으로 고정
        hitCount = eventThreshold;
        counterDisplay.textContent = hitCount;
        
        // 이벤트 발동
        playEventAnimation(); 
        
        // 타격수 업적 확인 (1타, 50타 등)
        checkAchievements('TOTAL_HIT');
        saveState();
        return; 
    }

    // 2. 이펙트 생성 및 재생
    createHitEffect(event.clientX, event.clientY);
    
    // 3. 타격 횟수를 damage 값만큼 증가시키고 화면을 업데이트합니다.
    hitCount += damage;
    counterDisplay.textContent = hitCount;
    
    // 현재 커서의 단일 타격 횟수를 증가시킵니다.
    singleCursorHitCounts[currentCursor] += damage; 
    
    // 4. 커서 강화 상태를 확인합니다.
    checkCursorLevels(hitCount);
    
    // 5. 업적 상태를 확인합니다.
    checkAchievements('TOTAL_HIT');
    checkAchievements('HIT_WITH_CURSOR', currentCursor);
    
    saveState();

    // 6. 랜덤 타격 이미지 변경
    const randomIndex = Math.floor(Math.random() * hitImages.length);
    monsterImage.src = hitImages[randomIndex];
    
    // 7. 🖱️ 커서를 **타격 시 커서 파일**로 변경 (💥 _hit.png)
    monsterImage.style.cursor = `url('${currentCursor}_hit.png'), auto`;

    // 8. 일정 시간 후 몬스터 이미지와 커서를 원래대로 되돌립니다.
    setTimeout(() => {
        monsterImage.src = normalImage;
        updateMonsterCursor(); // 평상시 커서로 복구
    }, displayTime); 
}

/**
 * 커서 버튼 클릭 핸들러
 */
function handleCursorChange(event) {
    const clickedButton = event.currentTarget;
    const newCursorName = clickedButton.dataset.cursor;
    
    // 1. 이전 커서의 아이콘을 _off 상태로 변경
    const previouslySelectedButton = document.querySelector('.cursor-button.selected');
    if (previouslySelectedButton) {
        previouslySelectedButton.classList.remove('selected');
        const oldCursorName = previouslySelectedButton.dataset.cursor;
        const oldIconImg = previouslySelectedButton.querySelector('img');
        if (oldIconImg) {
            oldIconImg.src = `${oldCursorName}_icon_off.png`;
        }
    }
    
    // 2. 새 커서의 아이콘을 _on 상태로 변경
    clickedButton.classList.add('selected');
    const newIconImg = clickedButton.querySelector('img');
    if (newIconImg) {
        newIconImg.src = `${newCursorName}_icon_on.png`;
    }

    // 3. 게임 상태 업데이트
    currentCursor = newCursorName;
    
    updateMonsterCursor();
    saveState();
}


// ------------------------------------
// UI 및 기타 함수
// ------------------------------------

/**
 * 몬스터 이미지의 기본 커서를 업데이트하는 함수 (💥 파일명 복구)
 */
function updateMonsterCursor() {
    // 💥 경로를 [cursorName].png로 설정
    const cursorPath = `url('${currentCursor}.png'), auto`;
    monsterImage.style.cursor = cursorPath; 
}


/**
 * 이벤트 시작
 */
function playEventAnimation() {
    isEventActive = true;
    const originalSrc = monsterImage.src;
    
    monsterImage.src = eventGif; 
    monsterImage.style.cursor = 'default';

    setTimeout(() => {
        isEventActive = false; 
        monsterImage.src = originalSrc;
        updateMonsterCursor(); 
        console.log("1010 이벤트 종료. 게임 플레이 재개.");
    }, eventDuration);
}

// 타격 이펙트 생성 및 재생 함수
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

    // 랜덤 회전 설정 (이펙트가 단순한 네모가 아님을 가정)
    const randomRotation = Math.floor(Math.random() * 360); 
    effect.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
    
    body.appendChild(effect);
    
    requestAnimationFrame(() => {
        effect.classList.add('animate');
    });

    setTimeout(() => {
        effect.remove();
    }, effectDuration); 
}


// 업적 달성 배너 표시 함수
function showAchievementBanner(title) {
    achievementText.textContent = `업적 달성: ${title}`;
    achievementBanner.classList.add('show');
    
    setTimeout(() => {
        achievementBanner.classList.remove('show');
    }, 2500);
}


/**
 * 업적 체크 및 달성 처리
 * @param {string} type - 체크할 조건 타입 (예: 'TOTAL_HIT', 'HIT_WITH_CURSOR', 'ALL_CURSOR_MAX_LEVEL')
 * @param {string} [cursorName] - HIT_WITH_CURSOR 타입일 때 커서 이름
 */
function checkAchievements(type, cursorName) {
    let newlyAchieved = [];
    
    for (const id in ACHIEVEMENTS) {
        const achievement = ACHIEVEMENTS[id];
        const condition = achievement.condition;
        
        if (achievementsState[id]) continue; 

        let isAchieved = false;

        if (type === 'TOTAL_HIT' && condition.type === 'TOTAL_HIT') {
            // 총 타격 횟수 조건
            if (hitCount >= condition.count) {
                isAchieved = true;
            }
        } 
        else if (type === 'HIT_WITH_CURSOR' && condition.type === 'HIT_WITH_CURSOR') {
            // 특정 커서로 타격 조건
            if (condition.target === cursorName && singleCursorHitCounts[cursorName] >= condition.count) {
                isAchieved = true;
            }
        } 
        else if (type === 'ALL_CURSOR_MAX_LEVEL' && condition.type === 'ALL_CURSOR_MAX_LEVEL') {
             // 모든 커서 최대 레벨 달성 조건
            const allMax = cursorButtons.length > 0 && Array.from(cursorButtons).every(button => {
                const name = button.dataset.cursor;
                return cursorLevels[name] >= MAX_LEVEL;
            });
            if (allMax) {
                isAchieved = true;
            }
        }
        
        if (isAchieved) {
            achievementsState[id] = true;
            newlyAchieved.push(achievement.title);
        }
    }
    
    if (newlyAchieved.length > 0) {
        saveState();
        updateAchievementList();
        newlyAchieved.forEach(title => showAchievementBanner(title));
    }
}


/**
 * 업적 목록을 모달에 렌더링하는 함수 (renderAchievements)
 */
function updateAchievementList() {
    achievementList.innerHTML = ''; 

    // 커서 마스터 업적은 커서 이름 순서대로 정렬
    const sortedAchievements = Object.entries(ACHIEVEMENTS).sort(([, a], [, b]) => {
        if (a.condition.type === 'HIT_WITH_CURSOR' && b.condition.type === 'HIT_WITH_CURSOR') {
            return a.condition.target.localeCompare(b.condition.target);
        }
        return 0;
    });


    for (const [key, ach] of sortedAchievements) {
        const isUnlocked = achievementsState[key];
        const li = document.createElement('li');
        
        let statusText = '???';
        let iconSrc = 'achievement_locked.png';

        if (isUnlocked) {
            iconSrc = 'achievement_unlocked.png';
            if (ach.condition.type === 'TOTAL_HIT') {
                statusText = `총 ${ach.condition.count}회 타격 완료`;
            } else if (ach.condition.type === 'HIT_WITH_CURSOR') {
                statusText = `${ach.condition.count}회 타격 완료 (현재 ${singleCursorHitCounts[ach.condition.target] || 0}회)`;
            } else if (ach.condition.type === 'ALL_CURSOR_MAX_LEVEL') {
                statusText = '모든 커서 5단계 달성 완료';
            }
        } else {
             if (ach.condition.type === 'HIT_WITH_CURSOR') {
                // 달성 전에도 단일 타격 횟수 진행 상황 표시
                statusText = `(${singleCursorHitCounts[ach.condition.target] || 0} / ${ach.condition.count} 타격)`;
            } else if (ach.condition.type === 'ALL_CURSOR_MAX_LEVEL') {
                 statusText = '모든 커서를 강화하세요.';
            } else if (ach.condition.type === 'TOTAL_HIT') {
                statusText = `(${hitCount} / ${ach.condition.count} 타격)`;
            }
        }


        li.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        li.innerHTML = `
            <div class="achievement-text-group">
                <div class="achievement-icon">
                    <img src="${iconSrc}" alt="아이콘"> 
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
        updateAchievementList(); // 열 때마다 목록 업데이트
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
    // 💥 index.html에 locked 클래스가 남아있더라도 여기서 제거
    cursorButtons.forEach(button => {
        const cursorName = button.dataset.cursor;
        const iconImg = button.querySelector('img');
        
        button.classList.remove('locked'); // 모든 커서 잠금 해제

        if (button.dataset.cursor === currentCursor) {
            button.classList.add('selected');
            // 버튼 아이콘은 이미 `_on.png` 규칙을 따르고 있음
            if (iconImg) {
                iconImg.src = `${cursorName}_icon_on.png`;
            }
        } else if (iconImg) {
            // 버튼 아이콘은 이미 `_off.png` 규칙을 따르고 있음
            iconImg.src = `${cursorName}_icon_off.png`;
        }
    });

    updateMonsterCursor(); 
}

// ------------------------------------
// 개발자 기능: 1000 타격 증가 핸들러
// ------------------------------------
function handleHitJump() {
    const jumpAmount = 1000;
    
    // 타격수를 증가시키고 임계값 체크
    const newHitCount = hitCount + jumpAmount;
    
    if (hitCount >= eventThreshold) {
        alert("이미 이벤트 타격수(1010)를 달성했습니다.");
        closeModal();
        return;
    }

    hitCount = newHitCount;
    counterDisplay.textContent = hitCount;
    
    // 강화 및 업적 체크
    checkCursorLevels(hitCount);
    checkAchievements('TOTAL_HIT');

    // 1010 타격 임계값 도달 시 이벤트 발동 로직 (개발자 기능이 임계값을 넘을 수 있음)
    if (hitCount >= eventThreshold) {
        hitCount = eventThreshold;
        counterDisplay.textContent = hitCount;
        playEventAnimation();
    }
    
    saveState();
    closeModal(); 
    alert(`타격수가 ${hitCount}으로 설정되었습니다!`);
}


// ------------------------------------
// 이벤트 리스너 설정
// ------------------------------------

// 상태 로드 및 초기화
loadState();

monsterImage.addEventListener('mousedown', handleHit);

cursorButtons.forEach(button => {
    button.addEventListener('click', handleCursorChange);
});

// 설정 메뉴 관련 이벤트 리스너
settingsButton.addEventListener('click', toggleSettingsMenu);

achievementButton.addEventListener('click', () => openModal('achievement'));
devButton.addEventListener('click', () => openModal('developer'));

// 개발자 기능 버튼 이벤트 리스너
jump1000HitsButton.addEventListener('click', handleHitJump);

closeButton.addEventListener('click', closeModal);

// 외부 클릭 시 모달 또는 메뉴 닫기 로직
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
    
    if (event.target !== settingsButton && !settingsMenu.contains(event.target) && settingsMenu.style.display === 'flex') {
        settingsMenu.style.display = 'none';
    }
});
