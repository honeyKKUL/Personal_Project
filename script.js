// script.js (전체 코드)

// DOM 요소
const monsterImage = document.getElementById('monster');
const counterDisplay = document.getElementById('hit-count');
const body = document.body;
const cursorButtons = document.querySelectorAll('.cursor-button');

// 💥 업적 관련 DOM 요소
const settingsButton = document.getElementById('settings-button');
const modal = document.getElementById('achievement-modal');
const closeButton = document.querySelector('.close-button');
const achievementList = document.getElementById('achievement-list');
const achievementBanner = document.getElementById('achievement-banner');
const achievementText = document.getElementById('achievement-text');


// 💥 업적 데이터 정의
const ACHIEVEMENTS = {
    'first_hit': { title: '첫 클릭!', condition: 1, achieved: false, type: 'hitCount' },
    'amateur_striker': { title: '초보 타격가', condition: 50, achieved: false, type: 'hitCount' },
    'pro_striker': { title: '프로 타격가', condition: 100, achieved: false, type: 'hitCount' },
    'cursor_collector': { title: '커서 수집가', condition: 5, achieved: false, type: 'cursorCount' },
    'master_striker': { title: '타격의 달인', condition: 500, achieved: false, type: 'hitCount' },
    'unlock_cursor02': { title: '첫 해금!', condition: 50, achieved: false, type: 'unlock' },

    // 단일 커서 사용 업적 (10개)
    'single_cursor_01': { title: '01', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor01' },
    'single_cursor_02': { title: '02', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor02' },
    'single_cursor_03': { title: '03', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor03' },
    'single_cursor_04': { title: '04', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor04' },
    'single_cursor_05': { title: '05', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor05' },
    'single_cursor_06': { title: '06', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor06' },
    'single_cursor_07': { title: '07', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor07' },
    'single_cursor_08': { title: '08', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor08' },
    'single_cursor_09': { title: '09', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor09' },
    'single_cursor_10': { title: '10', condition: 1010, achieved: false, type: 'singleHit', cursor: 'cursor10' },
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
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png'];
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
        effect.classList.add('animate');
    });

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
    // 1. Hit Count & Cursor Collector Achievements (기존 로직 유지)
    for (const key in ACHIEVEMENTS) {
        const achievement = ACHIEVEMENTS[key];
        
        if (achievement.achieved) continue;

        if (achievement.type === 'hitCount') {
            if (hitCount >= achievement.condition) {
                achievement.achieved = true;
                showAchievementBanner(achievement.title);
            }
        } else if (achievement.type === 'cursorCount') {
            const unlockedCount = Array.from(cursorButtons).filter(btn => !btn.classList.contains('locked')).length;
            if (unlockedCount >= achievement.condition) {
                achievement.achieved = true;
                showAchievementBanner(achievement.title);
            }
        }
    }
    
    // 2. Single Cursor Hit Achievements (단일 커서 업적)
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
    // 이펙트 생성 및 재생
    createHitEffect(event.clientX, event.clientY);
    
    // 1. 타격 횟수를 currentDamage 값만큼 증가시키고 화면을 업데이트합니다.
    hitCount += currentDamage;
    counterDisplay.textContent = hitCount;
    
    // 현재 커서의 단일 타격 횟수를 증가시킵니다.
    singleCursorHitCounts[currentCursor] += 1; 
    
    // 2. 해금 상태를 확인합니다.
    checkUnlocks();
    
    // 3. 업적 상태를 확인합니다.
    checkAchievements();

    // 4. 랜덤 타격 이미지 변경
    const randomIndex
