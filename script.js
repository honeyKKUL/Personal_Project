// script.js (전체 코드 - 최종 오류 수정 완료)

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
// 💥 이벤트 상태 변수
// ------------------------------------
let isEventActive = false; // 이벤트 활성 상태 플래그
const eventThreshold = 1010; // 이벤트 발동 타격 수
const eventGif = 'hit_event.gif'; // GIF 파일명 반영됨
const eventDuration = 4000; // GIF 재생 시간 (4초)


// 💥 업적 데이터 정의
const ACHIEVEMENTS = {
    'first_hit': { title: '첫 클릭!', condition: 1, achieved: false, type: 'hitCount', icon: 'icon_first_hit.png' },
    'amateur_striker': { title: '초보 타격가', condition: 50, achieved: false, type: 'hitCount', icon: 'icon_amateur_striker.png' },
    
    // 단일 커서 사용 업적 (10개) - 업적 이름이 변경됨
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


// 각 커서별 단일 타격 횟수를 저장하는 객체
let singleCursorHitCounts = {
    'cursor01': 0, 'cursor02': 0, 'cursor03': 0, 'cursor04': 0, 'cursor05': 0, 
    'cursor06': 0, 'cursor07': 0, 'cursor08': 0, 'cursor09': 0, 'cursor10': 0, 
};

// 해금 설정 및 상태 변수 (해금 관련 업적은 제거되었으나, 해금 로직은 유지)
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
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png', 'Hit_05.png'];
const displayTime = 150; 
const effectDuration = 250; // 👈 0.25초로 변경


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

// ------------------------------------
// 💥 사운드 추가 설정 (80% 감소 볼륨 적용)
// ------------------------------------
const HIT_SOUND_FILES = [
    'hit_sound_01.mp3',
    'hit_sound_02.mp3',
    'hit_sound_03.mp3',
    'hit_sound_04.mp3',
    'hit_sound_05.mp3'
];
const VOLUME_RATIO = 0.2; // 80% 감소 = 20% 볼륨 (0.2)

// 사운드 객체들을 미리 생성하여 재생 지연을 줄입니다.
const hitSounds = HIT_SOUND_FILES.map(file => {
    const audio = new Audio(file);
    audio.volume = VOLUME_RATIO;
    return audio;
});

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
    }, effectDuration); // 👈 effectDuration(250ms)로 바로 사용
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
    // 1. Hit Count Achievements ('first_hit', 'amateur_striker')
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
            
            // 💥 커서 마스터 업적 달성 시 이벤트 발동 로직 제거됨 (handleHit에서 전체 타격으로 처리)
        }
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
    
    // 1. 랜덤 타격 사운드 재생 (이전 오류 해결을 위해 복구)
    const soundIndex = Math.floor(Math.random() * hitSounds.length);
    const soundToPlay = hitSounds[soundIndex];

    soundToPlay.currentTime = 0; 
    soundToPlay.play().catch(e => {
        console.warn("사운드 재생 실패:", e);
    });

    // 💥 2. 1010 타격 초과 처리 로직 복원 및 수정
    const potentialHitCount = hitCount + currentDamage;
    
    if (hitCount < eventThreshold && potentialHitCount >= eventThreshold) {
        // 임계값을 넘기는 순간, 카운트를 1010으로 고정
        hitCount = eventThreshold;
        counterDisplay.textContent = hitCount;
        
        // 이벤트 발동
        playEventAnimation(); 
        
        // 타격수 업적 확인 (1타, 50타 등)
        checkAchievements();
        return; // 나머지 타격 로직 실행 중지
    }

    // 이펙트 생성 및 재생
    createHitEffect(event.clientX, event.clientY);
    
    // 3. 타격 횟수를 currentDamage 값만큼 증가시키고 화면을 업데이트합니다.
    hitCount += currentDamage;
    counterDisplay.textContent = hitCount;
    
    // 현재 커서의 단일 타격 횟수를 증가시킵니다.
    singleCursorHitCounts[currentCursor] += 1; 
    
    // 4. 해금 상태를 확인합니다.
    checkUnlocks();
    
    // 5. 업적 상태를 확인합니다.
    checkAchievements();

    // 6. 랜덤 타격 이미지 변경
    // 💥 266줄 오류 해결: 'randomIndex'가 이미 선언되었으므로, 다른 이름 (imageIndex) 사용
    const imageIndex = Math.floor(Math.random() * hitImages.length); 
    monsterImage.src = hitImages[imageIndex]; 
    
    // 7. 🖱️ 커서를 선택된 타격 커서로 변경
    const hitCursorPath = getCursorPaths(currentCursor).hit;
    monsterImage.style.cursor = hitCursorPath; 

    // 8. 일정 시간 후 몬스터 이미지와 커서를 원래대로 되돌립니다.
    setTimeout(() => {
        monsterImage.src = normalImage;
        updateMonsterCursor(); 
    }, displayTime); 
    // 💥 277줄 오류 해결: 불필요한 닫는 중괄호 제거

}

// ------------------------------------
// 개발자 기능: 1000 타격 증가 핸들러
// ------------------------------------
function handleHitJump() {
    const targetHitCount = eventThreshold - 10; // 1000으로 설정
    
    // 💥 1010타 (이벤트 임계값) 도달 시 경고
    if (hitCount >= eventThreshold) {
        alert("이미 최대 타격수(1010)를 달성했습니다.");
        closeModal();
        return;
    }
    
    // 타격수를 1000 또는 그 이상으로 설정하는 경우, 임계값을 넘지 않도록 조정
    const newHitCount = Math.min(hitCount + 1000, targetHitCount);
    hitCount = newHitCount;
    counterDisplay.textContent = hitCount;
    
    checkUnlocks();
    checkAchievements(); // 업적 강제 달성 로직 제거, checkAchievements에 의존

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
// 모달 (팝업) 기능
// ------------------------------------

/**
 * 업적 목록을 모달에 렌더링하는 함수
 */
function renderAchievements() {
    achievementList.innerHTML = ''; 

    // 커서 마스터 업적은 커서 이름 순서대로 정렬
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
            } else if (ach.type === 'singleHit') {
                statusText = `(${ach.condition} 타격 완료)`;
            }
        } else {
            // 달성 전에는 ??? 표시
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
    
    if (event.target !== settingsButton && !settingsMenu.contains(event.target)) {
        settingsMenu.style.display = 'none';
    }
});

// 페이지 로드 시 초기화 함수 실행
initializeCursors();
