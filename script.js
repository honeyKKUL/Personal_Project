// script.js (최종 수정본 - 배너 텍스트 출력 수정 반영)

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
// 💥 사운드 파일 정의 (타격 사운드 5개만 사용)
// ------------------------------------
const HIT_SOUNDS = [
    new Audio('hit_sound_01.mp3'),
    new Audio('hit_sound_02.mp3'),
    new Audio('hit_sound_03.mp3'),
    new Audio('hit_sound_04.mp3'),
    new Audio('hit_sound_05.mp3')
];

// 💥 사운드 볼륨 설정 (20%)
const DEFAULT_VOLUME = 0.2; 
HIT_SOUNDS.forEach(sound => {
    sound.volume = DEFAULT_VOLUME;
});


// ------------------------------------
// 💥 이벤트 및 상태 변수 (초기값으로 고정)
// ------------------------------------
let isEventActive = false; // 이벤트 활성 상태 플래그
const eventThreshold = 1010; // 이벤트 발동 타격 수
const eventGif = 'hit_event.gif'; // GIF 파일명 반영됨
const eventDuration = 4000; // GIF 재생 시간 (4초)

let hitCount = 0;
let currentCursor = 'cursor01'; 
let currentDamage = 1; 

// ------------------------------------
// 💥 커서 강화 시스템 변수 (초기값으로 고정)
// ------------------------------------
const LEVEL_UP_INTERVAL = 50; // 강화되는 타격 수 단위
const MAX_LEVEL = 5; // 최대 강화 단계

// 각 커서의 현재 레벨과 단일 타격 횟수를 저장하는 객체 (새로고침 시 초기화됨)
let cursorLevels = {}; 
let singleCursorHitCounts = {};


// 💥 업적 데이터 정의 (사용자 지정 문구 반영)
const ACHIEVEMENTS = {
    // 1. 첫 타격 업적 
    'first_hit': { 
        title: '첫 타격', 
        description: '총 1회 타격', 
        condition: 1, 
        achieved: false, 
        type: 'hitCount', 
        icon: 'icon_first_hit.png',
        custom_status_text_achieved: '그만둬주십시오...' // 💥 달성 문구
    },
    // 2. 모든 커서 강화 업적 추가 
    'ACH_ALL_CURSOR_LEVEL_5': { 
        title: '공략완료', 
        description: '모든 커서를 5단계까지 강화', 
        condition: MAX_LEVEL,
        achieved: false, 
        type: 'allMaxLevel', 
        icon: 'icon_amateur_striker.png',
        custom_status_text_achieved: '모든 히로인을 강화했습니다' // 💥 달성 문구
    },
    
    // 3. 단일 커서 사용 업적 (여기의 'title'과 'custom_status_text_achieved'를 수정하세요!)
    'single_cursor_01': { 
        title: '제대로 저로 개종해주셨나요?', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor01', 
        icon: 'icon_single_cursor_01.png',
        custom_status_text_achieved: '아리아케로만 1010타격 달성' // 💥 달성 문구
    }, 
    'single_cursor_02': { 
        title: '큭큭, 바보같을 정도로 성실하신 분...', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor02', 
        icon: 'icon_single_cursor_02.png',
        custom_status_text_achieved: '신바시로만 1010타격 달성' // 💥 달성 문구
    },
    'single_cursor_03': { 
        title: '당신에게 선택받는다고 해서 무엇이 달라지나요.', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor03', 
        icon: 'icon_single_cursor_03.png',
        custom_status_text_achieved: '아오미로만 1010타격 달성' // 💥 달성 문구
    },
    'single_cursor_04': { 
        title: '나, 나하하... 사용한 건 나 뿐? 탐정씨도 참...', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor04', 
        icon: 'icon_single_cursor_04.png',
        custom_status_text_achieved: '타케시바로만 1010타격 달성' // 💥 달성 문구
    },
    'single_cursor_05': { 
        title: '이히히!!!! 벌써 끝인가요~?', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor05', 
        icon: 'icon_single_cursor_05.png',
        custom_status_text_achieved: '시오도메로만 1010타격 달성' // 💥 달성 문구
    },
    'single_cursor_06': { 
        title: '그야말로 일로매진이로군, 오오사키 군!', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor06', 
        icon: 'icon_single_cursor_06.png',
        custom_status_text_achieved: '시죠마에로만 1010타격 달성' // 💥 달성 문구
    },
    'single_cursor_07': { 
        title: '오오사키 님, 해내셨군요. 훌륭하십니다.', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor07', 
        icon: 'icon_single_cursor_07.png',
        custom_status_text_achieved: '토요스로만 1010타격 달성' // 💥 달성 문구
    },
    'single_cursor_08': { 
        title: '...❤️', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor08', 
        icon: 'icon_single_cursor_08.png',
        custom_status_text_achieved: '히노데로만 1010타격 달성' // 💥 달성 문구
    },
    'single_cursor_09': { 
        title: '사, 사용될 수 있어서 영광이었습니다...', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor09', 
        icon: 'icon_single_cursor_09.png',
        custom_status_text_achieved: '후네노로만 1010타격 달성' // 💥 달성 문구
    },
    'single_cursor_10': { 
        title: '나로만 달성했다는 건가? 이거 무거운 걸, 오오사키 군.', 
        condition: 1010, 
        achieved: false, 
        type: 'singleHit', 
        cursor: 'cursor10', 
        icon: 'icon_single_cursor_10.png',
        custom_status_text_achieved: '시즈마로만 1010타격 달성' // 💥 달성 문구
    },
};


// 이미지 및 커서 경로 관리
const normalImage = 'Hit_01.png';
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png', 'Hit_05.png'];
const displayTime = 150; 
const effectDuration = 250; 

// 커서 파일 경로를 생성하는 함수 (PNG 파일명 규칙 복구)
function getCursorPaths(cursorName) {
    return {
        normal: `url('${cursorName}.png'), pointer`, 
        hit: `url('${cursorName}_hit.png'), pointer`
    };
}

// 몬스터 이미지의 기본 커서를 업데이트하는 함수
function updateMonsterCursor() {
    const cursorPath = getCursorPaths(currentCursor).normal;
    monsterImage.style.cursor = cursorPath; 
}

// ------------------------------------
// 유틸리티 및 상태 관리 (localStorage 제거)
// ------------------------------------

/**
 * 페이지 새로고침 시 모든 상태를 0으로 초기화합니다.
 */
function loadState() {
    hitCount = 0; 
    currentCursor = 'cursor01'; 
    currentDamage = 1; 

    // 💥 강화 레벨 및 단일 타격 수 초기화
    cursorButtons.forEach(button => {
        const cursorName = button.dataset.cursor;
        cursorLevels[cursorName] = 0; // 초기 레벨 0
        singleCursorHitCounts[cursorName] = 0; // 초기 타격 수 0
    });
    
    // 💥 업적 상태 초기화
    for (const key in ACHIEVEMENTS) {
        ACHIEVEMENTS[key].achieved = false;
    }

    // 초기 UI 렌더링
    counterDisplay.textContent = hitCount;
    initializeCursors();
}

/**
 * 상태 저장 로직을 제거했습니다. 새로고침 시 모든 데이터가 사라집니다.
 */
function saveState() {
    // 아무것도 저장하지 않습니다.
}


// ------------------------------------
// 💥 커서 강화 및 피해량 계산
// ------------------------------------

/**
 * 현재 커서의 실제 피해량을 계산합니다.
 */
function calculateDamage(cursorName) {
    const selectedButton = document.querySelector(`[data-cursor="${cursorName}"]`);
    if (!selectedButton) return 1;

    const baseDamage = parseInt(selectedButton.dataset.damage);
    const currentLevel = cursorLevels[cursorName] || 0;

    // 피해량 = 기본 피해량 + 현재 레벨
    return baseDamage + currentLevel; 
}

/**
 * 커서 버튼의 툴팁 텍스트를 업데이트합니다.
 */
function updateCursorButtonTooltip(button) {
    const cursorName = button.dataset.cursor;
    const baseDamage = parseInt(button.dataset.damage);
    const currentLevel = cursorLevels[cursorName] || 0;
    const singleHitCount = singleCursorHitCounts[cursorName] || 0;
    
    const currentDamage = baseDamage + currentLevel; 
    
    let tooltipText = `피해량: ${currentDamage} | 타격수: ${singleHitCount}`;

    if (currentLevel < MAX_LEVEL) {
        // 다음 레벨업에 필요한 총 타격 횟수
        const nextLevelHits = (currentLevel + 1) * LEVEL_UP_INTERVAL;
        const nextDamage = baseDamage + currentLevel + 1;
        tooltipText += ` | 다음 강화 (${currentLevel + 1}단계, ${nextDamage} 피해): ${nextLevelHits} 타격 시`;
    } else {
        tooltipText += ' | (최대 레벨 달성)';
    }

    button.title = tooltipText;
}


/**
 * 타격 횟수에 따라 커서 레벨을 체크하고 강화합니다. (선택된 커서의 단일 타격 수 기준)
 */
function checkCursorLevels(cursorName, singleHitCount) {
    let allMaxLevel = true;
    
    const button = document.querySelector(`[data-cursor="${cursorName}"]`);
    let currentLevel = cursorLevels[cursorName];
        
    if (currentLevel < MAX_LEVEL) {
        // 현재 타격 횟수로 도달 가능한 최대 레벨 계산
        const potentialLevel = Math.floor(singleHitCount / LEVEL_UP_INTERVAL);
        const newLevel = Math.min(potentialLevel, MAX_LEVEL);

        if (newLevel > currentLevel) {
            // 레벨업 실행
            cursorLevels[cursorName] = newLevel;
            console.log(`[강화] ${cursorName}이(가) 레벨 ${newLevel}이 되었습니다!`);
            
            // 툴팁 UI 업데이트
            if (button) updateCursorButtonTooltip(button);

            // 현재 커서의 피해량 업데이트
            currentDamage = calculateDamage(currentCursor);
        }
    }
    
    // 모든 커서가 최대 레벨인지 확인하여 업적 체크 (모든 커서를 순회)
    cursorButtons.forEach(b => {
        if (cursorLevels[b.dataset.cursor] < MAX_LEVEL) {
            allMaxLevel = false;
        }
    });

    if (allMaxLevel) {
         checkAchievements('ALL_CURSOR_MAX_LEVEL');
    }
}


// ------------------------------------
// 이벤트 및 타격 로직
// ------------------------------------

function playEventAnimation() {
    isEventActive = true; 
    
    monsterImage.src = eventGif; 
    monsterImage.style.cursor = 'default';

    setTimeout(() => {
        isEventActive = false; 
        monsterImage.src = normalImage;
        updateMonsterCursor(); 
    }, eventDuration);
}

// 타격 이펙트 생성 및 재생 함수
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

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
    // 💥 수정: 배너 텍스트를 달성한 업적의 제목으로 설정하여 표시합니다.
    achievementText.textContent = title; 
    achievementBanner.classList.add('show');
    
    setTimeout(() => {
        achievementBanner.classList.remove('show');
    }, 2500);
}


// 업적 확인 함수
function checkAchievements(type = 'GENERAL') {
    let newlyAchieved = false;
    
    // 1. Hit Count Achievements ('first_hit') 및 기타 일반 업적
    for (const key in ACHIEVEMENTS) {
        const ach = ACHIEVEMENTS[key];
        
        if (ach.achieved) continue;
        
        if (ach.type === 'hitCount' && hitCount >= ach.condition) {
            ach.achieved = true;
            showAchievementBanner(ach.title);
            newlyAchieved = true;
            
        } else if (ach.type === 'singleHit') {
            const cursorKey = ach.cursor;
            if (singleCursorHitCounts[cursorKey] >= ach.condition) {
                ach.achieved = true;
                showAchievementBanner(ach.title);
                newlyAchieved = true;
            }
        }
    }
    
    // 3. 모든 커서 강화 업적 (ALL_CURSOR_MAX_LEVEL 타입일 때만 체크)
    if (type === 'ALL_CURSOR_MAX_LEVEL') {
        const allMaxAch = ACHIEVEMENTS['ACH_ALL_CURSOR_LEVEL_5'];
        if (allMaxAch && !allMaxAch.achieved) {
             const allMax = Array.from(cursorButtons).every(button => {
                return cursorLevels[button.dataset.cursor] >= MAX_LEVEL;
            });
            if (allMax) {
                allMaxAch.achieved = true;
                showAchievementBanner(allMaxAch.title);
                newlyAchieved = true;
            }
        }
    }
    
    if (newlyAchieved) {
        saveState(); // 저장 로직은 제거됨
    }
}


// 클릭 이벤트를 처리하는 함수 (handleHit)
function handleHit(event) {
    if (isEventActive) {
        return;
    }
    
    // 💥 타격 사운드 재생 (5개 중 랜덤, 볼륨 20% 적용됨)
    const randomSound = HIT_SOUNDS[Math.floor(Math.random() * HIT_SOUNDS.length)];
    randomSound.currentTime = 0;
    randomSound.play();
    
    const potentialHitCount = hitCount + currentDamage;
    
    if (hitCount < eventThreshold && potentialHitCount >= eventThreshold) {
        hitCount = eventThreshold;
        counterDisplay.textContent = hitCount;
        
        playEventAnimation(); 
        checkAchievements();
        saveState(); 
        return; 
    }

    createHitEffect(event.clientX, event.clientY);
    
    hitCount += currentDamage;
    counterDisplay.textContent = hitCount;
    singleCursorHitCounts[currentCursor] += currentDamage; 
    
    checkCursorLevels(currentCursor, singleCursorHitCounts[currentCursor]);
    
    checkAchievements();
    saveState();


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
// 커서 버튼 및 모달 기능
// ------------------------------------

/**
 * 커서 버튼 클릭 핸들러
 */
function handleCursorChange(event) {
    const clickedButton = event.currentTarget;
    const newCursorName = clickedButton.dataset.cursor;
    
    // 잠금 상태면 클릭 무시 (index.html에서 locked 클래스가 제거되어야 함)
    if (clickedButton.classList.contains('locked')) {
        return;
    }
    
    // 이전 커서의 아이콘을 _off 상태로 변경
    const previouslySelectedButton = document.querySelector('.cursor-button.selected');
    if (previouslySelectedButton) {
        previouslySelectedButton.classList.remove('selected');
        const oldCursorName = previouslySelectedButton.dataset.cursor;
        const oldIconImg = previouslySelectedButton.querySelector('img');
        if (oldIconImg) {
            oldIconImg.src = `${oldCursorName}_icon_off.png`;
        }
    }
    
    // 새 커서의 아이콘을 _on 상태로 변경
    clickedButton.classList.add('selected');
    const newIconImg = clickedButton.querySelector('img');
    if (newIconImg) {
        newIconImg.src = `${newCursorName}_icon_on.png`;
    }

    // 게임 상태 업데이트
    currentCursor = newCursorName;
    currentDamage = calculateDamage(currentCursor); // 강화 레벨 기반으로 피해량 계산
    
    updateMonsterCursor();
    saveState();
}


/**
 * 업적 목록을 모달에 렌더링하는 함수 (정렬 개선 및 미달성 문구 제거)
 */
function renderAchievements() {
    achievementList.innerHTML = ''; 

    // 업적을 세 그룹으로 나누어 정렬
    const achievementsArray = Object.entries(ACHIEVEMENTS);
    
    const firstHitAch = achievementsArray.find(([, ach]) => ach.type === 'hitCount');
    const allMaxAch = achievementsArray.find(([, ach]) => ach.type === 'allMaxLevel');
    const singleHitAchs = achievementsArray
        .filter(([, ach]) => ach.type === 'singleHit')
        .sort(([, a], [, b]) => a.cursor.localeCompare(b.cursor)); // 커서 이름 순서대로 정렬

    // 정렬된 순서로 배열 재구성: 첫 타격 -> 모든 강화 -> 단일 커서
    const sortedEntries = [];
    if (firstHitAch) sortedEntries.push(firstHitAch);
    if (allMaxAch) sortedEntries.push(allMaxAch);
    sortedEntries.push(...singleHitAchs);


    for (const [key, ach] of sortedEntries) {
        const li = document.createElement('li');
        const isUnlocked = ach.achieved;
        
        let statusText = '';
        let iconSrc = ach.icon; 
        
        if (isUnlocked) {
            // 💥 달성 시 커스텀 문구 사용
            if (ach.custom_status_text_achieved) {
                 statusText = ach.custom_status_text_achieved;
            } else {
                statusText = '달성 완료';
            }
        } else {
            // 💥 미달성 시 텍스트 제거 (statusText는 빈 문자열로 유지됨)
        }
        
        // 커서 강화 레벨을 업적 제목 옆에 표시
        let cursorLevelInfo = '';
        if (ach.type === 'singleHit') {
            const level = cursorLevels[ach.cursor] || 0;
            cursorLevelInfo = ` (현재 ${level}Lv, 피해량 ${calculateDamage(ach.cursor)})`;
        } else if (ach.type === 'allMaxLevel' && !isUnlocked) {
             const completed = Array.from(cursorButtons).filter(b => cursorLevels[b.dataset.cursor] >= MAX_LEVEL).length;
             cursorLevelInfo = ` (${completed} / ${cursorButtons.length}개 커서 ${MAX_LEVEL}단계 달성)`;
        }


        li.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        li.innerHTML = `
            <div class="achievement-text-group">
                <div class="achievement-icon">
                    <img src="${iconSrc}" alt="아이콘"> 
                </div>
                <div class="achievement-title-status">
                    <span>${ach.title}${cursorLevelInfo}</span>
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
        
        // 툴팁 초기화 (강화 정보 포함)
        updateCursorButtonTooltip(button);

        // 선택된 커서 UI 업데이트
        if (button.dataset.cursor === currentCursor) {
            button.classList.add('selected');
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
// 개발자 기능: 1000 타격 증가 핸들러
// ------------------------------------
function handleHitJump() {
    const targetHitCount = eventThreshold - 10; 
    
    if (hitCount >= eventThreshold) {
        alert(`이미 이벤트 타격수(${eventThreshold})를 달성했습니다.`);
        closeModal();
        return;
    }

    const newHitCount = Math.min(hitCount + 1000, targetHitCount); 
    hitCount = newHitCount;
    counterDisplay.textContent = hitCount;
    
    checkAchievements();
    saveState(); 

    closeModal(); 
    alert(`타격수가 ${hitCount}으로 설정되었습니다!`);
}


// ------------------------------------
// 이벤트 리스너 설정
// ------------------------------------

// 페이지 로드 시 상태 로드 및 초기화
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
