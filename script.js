// script.js (최종 수정본 - 업적 파일명 및 로직 변경 반영)

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
let currentDamage = 1; 

// ------------------------------------
// 💥 커서 강화 시스템 변수 (요청에 따라 삭제됨)
// ------------------------------------
/*
이전에 구현했던 커서 강화 시스템(50단위 강화, MAX_LEVEL)은
사용자님이 원하시는 커서 해금 시스템(타격수에 따른 해금)으로 복구되었습니다.
*/


// 💥 업적 데이터 정의 (요청 반영)
const ACHIEVEMENTS = {
    // 1. 첫 타격 업적 (50타 업적 삭제)
    'first_hit': { 
        title: '첫 클릭!', 
        description: '총 1회 타격', 
        condition: 1, 
        achieved: false, 
        type: 'hitCount', 
        icon: 'icon_first_hit.png' // 💥 파일명 반영
    },
    // 2. 모든 커서 강화 업적 추가 (50타 업적 이미지 재사용)
    'ACH_ALL_CURSOR_LEVEL_5': { 
        title: '궁극의 무기', 
        description: '모든 커서를 5단계까지 강화 (더미 업적)', 
        condition: 5, 
        achieved: false, 
        type: 'allMaxLevel', 
        icon: 'icon_amateur_striker.png' // 💥 파일명 반영
    },
    
    // 3. 단일 커서 사용 업적 (파일명 변경)
    'single_cursor_01': { title: '제대로 저로 개종해주셨나요?', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor01', icon: 'icon_single_cursor_01.png' }, // 💥 파일명 반영
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


// 각 커서별 단일 타격 횟수를 저장하는 객체
let singleCursorHitCounts = {
    'cursor01': 0, 'cursor02': 0, 'cursor03': 0, 'cursor04': 0, 'cursor05': 0, 
    'cursor06': 0, 'cursor07': 0, 'cursor08': 0, 'cursor09': 0, 'cursor10': 0, 
};

// 해금 설정 및 상태 변수 (이전 로직 복구)
const UNLOCK_INTERVAL = 50;
const UNLOCK_THRESHOLDS = {};
for (let i = 2; i <= 10; i++) {
    const key = `cursor${i.toString().padStart(2, '0')}`;
    UNLOCK_THRESHOLDS[key] = (i - 1) * UNLOCK_INTERVAL;
}


// 이미지 및 애니메이션 설정
const normalImage = 'Hit_01.png';
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png', 'Hit_05.png'];
const displayTime = 150; 
const effectDuration = 250; 


// 커서 파일 경로를 생성하는 함수 (PNG 파일명 규칙 복구)
function getCursorPaths(cursorName) {
    return {
        // 💥 PNG 파일과 custom cursor 포맷 사용
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
// 유틸리티 및 상태 관리 (로컬 스토리지)
// ------------------------------------

/**
 * 로컬 스토리지에서 상태를 로드합니다.
 */
function loadState() {
    const savedHitCount = localStorage.getItem('hitCount');
    const savedCursor = localStorage.getItem('selectedCursor');
    const savedSingleHits = localStorage.getItem('singleCursorHitCounts');
    const savedAchievements = localStorage.getItem('achievements');

    // 1. 상태 로드
    hitCount = savedHitCount ? parseInt(savedHitCount) : 0;
    
    if (savedSingleHits) {
        Object.assign(singleCursorHitCounts, JSON.parse(savedSingleHits));
    }
    
    // 업적 상태 복구
    if (savedAchievements) {
        const loadedAchievements = JSON.parse(savedAchievements);
        for (const key in loadedAchievements) {
            // 업적 목록이 변경되었으므로, 기존 저장된 상태가 있을 때만 덮어씁니다.
            if (ACHIEVEMENTS[key]) {
                ACHIEVEMENTS[key].achieved = loadedAchievements[key];
            }
        }
    }


    // 2. 선택 커서 및 피해량 복원
    currentCursor = 'cursor01'; // 기본값
    if (savedCursor) {
        const selectedButton = document.querySelector(`[data-cursor="${savedCursor}"]`);
        if (selectedButton) {
            currentCursor = savedCursor;
            currentDamage = parseInt(selectedButton.dataset.damage);
        }
    } 
    
    // 3. 초기 UI 렌더링
    counterDisplay.textContent = hitCount;
    initializeCursors();
}

/**
 * 로컬 스토리지에 현재 상태를 저장합니다.
 */
function saveState() {
    localStorage.setItem('hitCount', hitCount);
    localStorage.setItem('selectedCursor', currentCursor);
    localStorage.setItem('singleCursorHitCounts', JSON.stringify(singleCursorHitCounts));
    
    // 업적 달성 상태만 저장
    const achievementStatus = {};
    for (const key in ACHIEVEMENTS) {
        achievementStatus[key] = ACHIEVEMENTS[key].achieved;
    }
    localStorage.setItem('achievements', JSON.stringify(achievementStatus));
}


// ------------------------------------
// 이벤트 재생 함수
// ------------------------------------
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
    achievementText.textContent = `업적 달성: ${title}`;
    achievementBanner.classList.add('show');
    
    setTimeout(() => {
        achievementBanner.classList.remove('show');
    }, 2500);
}


// 업적 확인 함수
function checkAchievements() {
    let newlyAchieved = false;
    
    // 1. Hit Count Achievements ('first_hit')
    const firstHitAch = ACHIEVEMENTS['first_hit'];
    if (firstHitAch && !firstHitAch.achieved && hitCount >= firstHitAch.condition) {
        firstHitAch.achieved = true;
        showAchievementBanner(firstHitAch.title);
        newlyAchieved = true;
    }
    
    // 2. Single Cursor Hit Achievements 
    for (let i = 1; i <= 10; i++) {
        const cursorKey = `cursor${i.toString().padStart(2, '0')}`;
        const achievementKey = `single_cursor_${i.toString().padStart(2, '0')}`;
        const ach = ACHIEVEMENTS[achievementKey];

        if (ach && !ach.achieved && singleCursorHitCounts[cursorKey] >= ach.condition) {
            ach.achieved = true;
            showAchievementBanner(ach.title);
            newlyAchieved = true;
        }
    }
    
    // 3. 모든 커서 강화 업적 (더미 로직)
    const allMaxAch = ACHIEVEMENTS['ACH_ALL_CURSOR_LEVEL_5'];
    if (allMaxAch && !allMaxAch.achieved) {
        // 이 업적은 현재 강화 로직이 없으므로, 여기에 임시로 '더미' 조건을 넣거나
        // 아니면 해당 업적을 해금시키는 개발자 기능을 만들어야 합니다.
        // 현재는 달성 체크 로직을 비워둡니다.
    }
    
    if (newlyAchieved) {
        saveState();
    }
}


// 커서 해금 상태를 확인하고 UI를 업데이트하는 함수
function checkUnlocks() {
    cursorButtons.forEach(button => {
        const cursorName = button.dataset.cursor;
        
        if (cursorName === 'cursor01') return;

        const unlockHitCount = UNLOCK_THRESHOLDS[cursorName];

        if (hitCount >= unlockHitCount && button.classList.contains('locked')) {
            button.classList.remove('locked');
            console.log(`🎉 ${cursorName}이(가) ${hitCount}타로 해금되었습니다!`);

            // 해금 시 커서 아이콘을 _off 상태로 업데이트
            const iconImg = button.querySelector('img');
            if (iconImg) {
                iconImg.src = `${cursorName}_icon_off.png`;
            }
        }
    });
}


// 클릭 이벤트를 처리하는 함수 (handleHit)
function handleHit(event) {
    // 이벤트가 활성화된 상태면 클릭 무시
    if (isEventActive) {
        return;
    }
    
    // 💥 1. 1010 타격 초과 처리 로직 
    const potentialHitCount = hitCount + currentDamage;
    
    if (hitCount < eventThreshold && potentialHitCount >= eventThreshold) {
        // 임계값을 넘기는 순간, 카운트를 1010으로 고정
        hitCount = eventThreshold;
        counterDisplay.textContent = hitCount;
        
        // 이벤트 발동
        playEventAnimation(); 
        
        // 타격수 업적 확인
        checkAchievements();
        saveState();
        return; // 나머지 타격 로직 실행 중지
    }

    // 이펙트 생성 및 재생
    createHitEffect(event.clientX, event.clientY);
    
    // 2. 타격 횟수를 currentDamage 값만큼 증가시키고 화면을 업데이트합니다.
    hitCount += currentDamage;
    counterDisplay.textContent = hitCount;
    
    // 현재 커서의 단일 타격 횟수를 증가시킵니다.
    singleCursorHitCounts[currentCursor] += currentDamage; 
    
    // 3. 해금 상태를 확인합니다.
    checkUnlocks();
    
    // 4. 업적 상태를 확인합니다.
    checkAchievements();
    saveState();


    // 5. 랜덤 타격 이미지 변경
    const randomIndex = Math.floor(Math.random() * hitImages.length);
    monsterImage.src = hitImages[randomIndex];
    
    // 6. 🖱️ 커서를 선택된 타격 커서로 변경 (💥 _hit.png)
    const hitCursorPath = getCursorPaths(currentCursor).hit;
    monsterImage.style.cursor = hitCursorPath; 

    // 7. 일정 시간 후 몬스터 이미지와 커서를 원래대로 되돌립니다.
    setTimeout(() => {
        monsterImage.src = normalImage;
        updateMonsterCursor(); 
    }, displayTime); 
}


// ------------------------------------
// 개발자 기능: 1000 타격 증가 핸들러
// ------------------------------------
function handleHitJump() {
    const jumpAmount = 1000;
    const targetHitCount = eventThreshold; 
    
    if (hitCount >= targetHitCount) {
        alert(`이미 이벤트 타격수(${targetHitCount})를 달성했습니다.`);
        closeModal();
        return;
    }

    // 1010을 넘지 않도록 조정
    const newHitCount = Math.min(hitCount + jumpAmount, targetHitCount - 1); 
    hitCount = newHitCount;
    counterDisplay.textContent = hitCount;
    
    checkUnlocks();
    checkAchievements();
    saveState();

    closeModal(); 
    alert(`타격수가 ${hitCount}으로 설정되었습니다!`);
}


/**
 * 커서 버튼 클릭 핸들러
 */
function handleCursorChange(event) {
    const clickedButton = event.currentTarget;
    const newCursorName = clickedButton.dataset.cursor;
    
    if (clickedButton.classList.contains('locked')) {
        const requiredHits = UNLOCK_THRESHOLDS[newCursorName];
        alert(`커서 해금까지 ${requiredHits - hitCount}타 남았습니다! (총 ${requiredHits}타 필요)`);
        return; 
    }
    
    const newDamage = parseInt(clickedButton.dataset.damage); 
    
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
    currentDamage = newDamage; 
    
    updateMonsterCursor();
    saveState();
}


// ------------------------------------
// 모달 (팝업) 기능
// ------------------------------------

/**
 * 업적 목록을 모달에 렌더링하는 함수
 */
function renderAchievements() {
    achievementList.innerHTML = ''; 

    // 단일 커서 업적은 커서 이름 순서대로 정렬
    const sortedAchievements = Object.entries(ACHIEVEMENTS).sort(([, a], [, b]) => {
        if (a.type === 'singleHit' && b.type === 'singleHit') {
            return a.cursor.localeCompare(b.cursor);
        }
        return 0;
    });


    for (const [key, ach] of sortedAchievements) {
        const li = document.createElement('li');
        const isUnlocked = ach.achieved;
        
        let statusText;
        let iconSrc = ach.icon; // 💥 업적 자체 아이콘 사용
        
        if (isUnlocked) {
            
            // 달성 시에만 실제 조건 표시
            if (ach.type === 'hitCount') {
                statusText = `총 ${ach.condition}회 타격 완료`;
            } else if (ach.type === 'singleHit') {
                statusText = `${ach.condition}회 타격 완료`;
            } else if (ach.type === 'allMaxLevel') {
                 statusText = `모든 커서 ${ach.condition}단계 달성`;
            }
        } else {
            // 달성 전에는 진행 상황 표시
            if (ach.type === 'singleHit') {
                 statusText = `(${singleCursorHitCounts[ach.cursor] || 0} / ${ach.condition} 타격)`;
            } else if (ach.type === 'hitCount') {
                statusText = `(${hitCount} / ${ach.condition} 타격)`;
            } else if (ach.type === 'allMaxLevel') {
                statusText = '모든 커서를 최대 단계까지 강화하세요.';
            } else {
                statusText = '???';
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
        
        // 해금 상태에 따라 locked 클래스 추가/제거
        if (cursorName !== 'cursor01' && hitCount < UNLOCK_THRESHOLDS[cursorName]) {
            button.classList.add('locked');
        } else {
             button.classList.remove('locked');
        }

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
