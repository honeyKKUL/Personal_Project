// script.js (전체 코드)

// DOM 요소
const monsterImage = document.getElementById('monster');
const counterDisplay = document.getElementById('hit-count');
const body = document.body;
const cursorButtons = document.querySelectorAll('.cursor-button');

// 💥 업적 및 설정 관련 DOM 요소 (수정/추가됨)
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
// 💥 이벤트 상태 변수 (GIF 파일명, 지속 시간 반영)
// ------------------------------------
let isEventActive = false; // 이벤트 활성 상태 플래그
const eventThreshold = 1010; // 이벤트 발동 타격 수
const eventGif = 'hit_event.gif'; // 💥 GIF 파일명 반영됨
const eventDuration = 3000; // 💥 GIF 재생 시간 (4초)


// 💥 업적 데이터 정의 (icon 필드 추가)
const ACHIEVEMENTS = {
    'first_hit': { title: '첫 클릭!', condition: 1, achieved: false, type: 'hitCount', icon: 'icon_first_hit.png' },
    'amateur_striker': { title: '초보 타격가', condition: 50, achieved: false, type: 'hitCount', icon: 'icon_amateur_striker.png' },
    'pro_striker': { title: '프로 타격가', condition: 100, achieved: false, type: 'hitCount', icon: 'icon_pro_striker.png' },
    'master_striker': { title: '타격의 달인', condition: 500, achieved: false, type: 'hitCount', icon: 'icon_master_striker.png' },
    'ultimate_striker': { title: '궁극의 타격가', condition: 1010, achieved: false, type: 'hitCount', icon: 'icon_ultimate_striker.png' },
    'cursor_collector': { title: '커서 수집가', condition: 5, achieved: false, type: 'cursorCount', icon: 'icon_cursor_collector.png' },
    'unlock_cursor02': { title: '첫 해금!', condition: 50, achieved: false, type: 'unlock', icon: 'icon_unlock_cursor02.png' },

    // 단일 커서 사용 업적 (10개)
    'single_cursor_01': { title: '커서 01 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor01', icon: 'icon_single_cursor_01.png' },
    'single_cursor_02': { title: '커서 02 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor02', icon: 'icon_single_cursor_02.png' },
    'single_cursor_03': { title: '커서 03 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor03', icon: 'icon_single_cursor_03.png' },
    'single_cursor_04': { title: '커서 04 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor04', icon: 'icon_single_cursor_04.png' },
    'single_cursor_05': { title: '커서 05 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor05', icon: 'icon_single_cursor_05.png' },
    'single_cursor_06': { title: '커서 06 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor06', icon: 'icon_single_cursor_06.png' },
    'single_cursor_07': { title: '커서 07 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor07', icon: 'icon_single_cursor_07.png' },
    'single_cursor_08': { title: '커서 08 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor08', icon: 'icon_single_cursor_08.png' },
    'single_cursor_09': { title: '커서 09 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor09', icon: 'icon_single_cursor_09.png' },
    'single_cursor_10': { title: '커서 10 마스터', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor10', icon: 'icon_single_cursor_10.png' },
};


// 각 커서별 단일 타격 횟수를 저장하는 객체
let singleCursorHitCounts = {
    'cursor01': 0, 'cursor02': 0, 'cursor03': 0, 'cursor04': 0, 'cursor05': 0, 
    'cursor06': 0, 'cursor07': 0, 'cursor08': 0, 'cursor09': 0, 'cursor10': 0, 
};

// 해금 설정 및 상태 변수
const UNLOCK_INTERVAL = 50;
const UNLOCK_THRESHOLDS = {};
for (let i = 2; i <= 10; i++) {
    const key = `cursor${i.toString().padStart(2, '0')}`;
    UNLOCK_THRESHOLDS[key] = (i - 1) * UNLOCK_INTERVAL;
}

let hitCount = 0;
let currentCursor = 'cursor01'; 
let currentDamage = 1; 


// 이미지 및 애니메이션 설정
const normalImage = 'Hit_01.png';
// 💥 수정됨: Hit_05.png 추가
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png', 'Hit_05.png'];
const displayTime = 150; 
const effectDuration = 300; 


// 커서 파일 경로를 생성하는 함수
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
// 💥 이벤트 재생 함수
// ------------------------------------
function playEventAnimation() {
    isEventActive = true; // 이벤트 활성화, 클릭 방지
    
    // 몬스터 이미지 교체 (GIF 재생)
    monsterImage.src = eventGif; 
    
    // 몬스터 커서를 기본 커서로 되돌립니다.
    monsterImage.style.cursor = 'default';

    // 일정 시간 후 (GIF 재생 시간) 게임 상태 복구
    setTimeout(() => {
        isEventActive = false; // 이벤트 비활성화, 클릭 허용
        monsterImage.src = normalImage; // 원래 몬스터 이미지 (Hit_01.png)로 복구
        updateMonsterCursor(); // 이전에 선택된 커서로 복구
        
        console.log("1010 이벤트 종료. 게임 플레이 재개.");
    }, eventDuration);
}


// 타격 이펙트 생성 및 재생 함수
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

    const randomRotation = Math.random() * 360; 
    effect.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
    
    body.appendChild(effect);
    
    requestAnimationFrame(() => {
        // CSS 애니메이션 시작
        effect.classList.add('animate');
    });

    // CSS transition time(0.3s) + delay(0.1s)
    setTimeout(() => {
        effect.remove();
    }, effectDuration + 100); 
}

// 업적 달성 배너 표시 함수
function showAchievementBanner(title) {
    achievementText.textContent = `업적 달성: ${title}`;
    achievementBanner.classList.add('show');
    
    // 2.5초 후 배너를 숨깁니다.
    setTimeout(() => {
        achievementBanner.classList.remove('show');
    }, 2500);
}


// 업적 확인 함수
function checkAchievements() {
    // 1. Hit Count & Cursor Collector Achievements 
    for (const key in ACHIEVEMENTS) {
        const achievement = ACHIEVEMENTS[key];
        
        if (achievement.achieved) continue;

        if (achievement.type === 'hitCount') {
            if (hitCount >= achievement.condition) {
                achievement.achieved = true;
                showAchievementBanner(achievement.title);
                
                // 💥 1010 타격 이벤트 발동 조건
                if (key === 'ultimate_striker' && hitCount >= eventThreshold) {
                    playEventAnimation();
                }
            }
        } else if (achievement.type === 'cursorCount') {
            const unlockedCount = Array.from(cursorButtons).filter(btn => !btn.classList.contains('locked')).length;
            if (unlockedCount >= achievement.condition) {
                achievement.achieved = true;
                showAchievementBanner(achievement.title);
            }
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


// 커서 해금 상태를 확인하고 UI를 업데이트하는 함수
function checkUnlocks() {
    cursorButtons.forEach(button => {
        const cursorName = button.dataset.cursor;
        
        // 이벤트 임계값을 넘겼다면 더 이상 해금하지 않습니다.
        if (hitCount >= eventThreshold) return;

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

            if (cursorName === 'cursor02' && !ACHIEVEMENTS['unlock_cursor02'].achieved) {
                 ACHIEVEMENTS['unlock_cursor02'].achieved = true;
                 showAchievementBanner(ACHIEVEMENTS['unlock_cursor02'].title);
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
    
    // 1. 💥 1010 타격 초과 처리 로직 (타격수가 임계값을 넘길 때 고정)
    const potentialHitCount = hitCount + currentDamage;
    
    if (hitCount < eventThreshold && potentialHitCount >= eventThreshold) {
        // 임계값을 넘기는 순간, 카운트를 1010으로 고정
        hitCount = eventThreshold;
        counterDisplay.textContent = hitCount;
        
        // 이벤트 발동 로직 실행 (checkAchievements에서 playEventAnimation 호출)
        checkAchievements(); 
        return; // 나머지 타격 로직 실행 중지
    }
    
    // 이펙트 생성 및 재생
    createHitEffect(event.clientX, event.clientY);
    
    // 2. 타격 횟수를 currentDamage 값만큼 증가시키고 화면을 업데이트합니다.
    hitCount += currentDamage;
    counterDisplay.textContent = hitCount;
    
    // 현재 커서의 단일 타격 횟수를 증가시킵니다.
    singleCursorHitCounts[currentCursor] += 1; 
    
    // 3. 해금 상태를 확인합니다.
    checkUnlocks();
    
    // 4. 업적 상태를 확인합니다.
    checkAchievements();

    // 5. 랜덤 타격 이미지 변경
    const randomIndex = Math.floor(Math.random() * hitImages.length);
    monsterImage.src = hitImages[randomIndex];
    
    // 6. 🖱️ 커서를 선택된 타격 커서로 변경
    const hitCursorPath = getCursorPaths(currentCursor).hit;
    monsterImage.style.cursor = hitCursorPath; 

    // 7. 일정 시간 후 몬스터 이미지와 커서를 원래대로 되돌립니다.
    setTimeout(() => {
        monsterImage.src = normalImage;
        updateMonsterCursor(); 
    }, displayTime); 
}

// ------------------------------------
// 💥 개발자 기능: 1000 타격 증가 핸들러
// ------------------------------------
function handleHitJump() {
    const jumpAmount = 1000;
    
    if (hitCount >= eventThreshold) {
        alert("이미 최대 타격수(1010)를 달성했습니다.");
        closeModal();
        return;
    }
    
    // 1010을 초과하지 않는 범위 내에서 증가
    const newHitCount = Math.min(hitCount + jumpAmount, eventThreshold);
    hitCount = newHitCount;
    counterDisplay.textContent = hitCount;
    
    checkUnlocks();
    checkAchievements();
    
    closeModal(); // 버튼 누른 후 모달 닫기
    alert(`타격수가 ${newHitCount - (newHitCount - jumpAmount)} 증가했습니다! 현재: ${hitCount}`);
}


/**
 * 💥 커서 버튼 클릭 핸들러
 */
function handleCursorChange(event) {
    const clickedButton = event.currentTarget;
    const newCursorName = clickedButton.dataset.cursor;
    
    if (clickedButton.classList.contains('locked')) {
        console.log("잠금 해제 후 선택할 수 있습니다.");
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
}


// ------------------------------------
// 💥 모달 (팝업) 기능 (패널 분리 및 조건 숨김 로직 포함)
// ------------------------------------

/**
 * 업적 목록을 모달에 렌더링하는 함수
 */
function renderAchievements() {
    achievementList.innerHTML = ''; // 목록 초기화

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
            // 달성 시에만 실제 조건 표시
            if (ach.type === 'hitCount') {
                statusText = `(${ach.condition} 타격 완료)`;
            } else if (ach.type === 'unlock') {
                statusText = `(커서 02 해금 완료)`;
            } else if (ach.type === 'cursorCount') {
                const unlockedCount = Array.from(cursorButtons).filter(btn => !btn.classList.contains('locked')).length;
                statusText = `(${unlockedCount}/${ach.condition} 개 해금 완료)`;
            } else if (ach.type === 'singleHit') {
                statusText = `(${ach.condition} 타격 완료)`;
            }
        } else {
            // 💥 달성 전에는 ??? 표시
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
 * @param {string} panelId - 'achievement' 또는 'developer'
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
    
    settingsMenu.style.display = 'none'; // 모달이 열리면 메뉴 닫기
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}


/**
 * 💥 설정 메뉴 토글 함수
 */
function toggleSettingsMenu() {
    settingsMenu.style.display = settingsMenu.style.display === 'none' || settingsMenu.style.display === '' 
        ? 'flex' 
        : 'none';
}


/**
 * 💥 초기화 함수
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

cursorButtons.forEach(button => {
    button.addEventListener('click', handleCursorChange);
});

// 💥 설정 메뉴 관련 이벤트 리스너
settingsButton.addEventListener('click', toggleSettingsMenu);

achievementButton.addEventListener('click', () => openModal('achievement'));
devButton.addEventListener('click', () => openModal('developer'));

// 💥 개발자 기능 버튼 이벤트 리스너
jump1000HitsButton.addEventListener('click', handleHitJump);

closeButton.addEventListener('click', closeModal);

// 💥 외부 클릭 시 모달 또는 메뉴 닫기 로직 (개발자 기능 클릭 문제를 해결함)
window.addEventListener('click', (event) => {
    // 1. 모달 외부 클릭 시 닫기
    if (event.target == modal) {
        closeModal();
    }
    
    // 2. 설정 버튼이나 메뉴 자체가 아닌 곳을 클릭했을 때 메뉴 숨김
    if (event.target !== settingsButton && !settingsMenu.contains(event.target)) {
        settingsMenu.style.display = 'none';
    }
});

// 페이지 로드 시 초기화 함수 실행
initializeCursors();
