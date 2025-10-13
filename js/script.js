// script.js (최종 수정본 - 개발자 기능 삭제)

// DOM 요소
const monsterImage = document.getElementById("monster");
const counterDisplay = document.getElementById("hit-count");
const body = document.body;
const cursorButtons = document.querySelectorAll(".cursor-button");

// 💥 업적 및 설정 관련 DOM 요소
const settingsButton = document.getElementById("settings-button");
const settingsMenu = document.getElementById("settings-menu");
const achievementButton = document.getElementById("achievement-button");
const resetHitsButton = document.getElementById("reset-hits-button");
// 💥 삭제: const devButton = document.getElementById('dev-button');
const modal = document.getElementById("achievement-modal");
const closeButton = document.querySelector(".close-button");
const achievementPanel = document.getElementById("achievement-panel");
// 💥 삭제: const developerPanel = document.getElementById('developer-panel');
// 💥 삭제: const jump1000HitsButton = document.getElementById('jump-1000-hits');
const achievementList = document.getElementById("achievement-list");
const achievementBanner = document.getElementById("achievement-banner");
const achievementText = document.getElementById("achievement-text");

const fileSrc = `https://honeykkul.github.io/Personal_Project/`;

// ------------------------------------
// 💥 사운드 파일 정의
// ------------------------------------
const HIT_SOUNDS = [
  new Audio(`${fileSrc}hit_sound_01.mp3`),
  new Audio(`${fileSrc}hit_sound_02.mp3`),
  new Audio(`${fileSrc}hit_sound_03.mp3`),
  new Audio(`${fileSrc}hit_sound_04.mp3`),
  new Audio(`${fileSrc}hit_sound_05.mp3`),
];

// 💥 사운드 볼륨 설정 (20%)
const DEFAULT_VOLUME = 0.2;
HIT_SOUNDS.forEach((sound) => {
  sound.volume = DEFAULT_VOLUME;
});

// ------------------------------------
// 💥 이벤트 및 상태 변수
// ------------------------------------
let isEventActive = false; // 이벤트 활성 상태 플래그
const eventThreshold = 1010; // 이벤트 발동 타격 수
const eventGif = fileSrc + "hit_event.gif";
const eventDuration = 4000; // GIF 재생 시간 (4초)

let hitCount = 0;
let currentCursor = "cursor01";
let currentDamage = 1; // 💥 초기 피해량은 1로 설정

// ------------------------------------
// 💥 커서 강화 시스템 변수
// ------------------------------------
const LEVEL_UP_INTERVAL = 50; // 강화되는 타격 수 단위
const MAX_LEVEL = 4; // 최대 강화 단계
// 💥 모든 커서의 고정 기본 피해량
const BASE_DAMAGE = 1;
let cursorLevels = {};
let singleCursorHitCounts = {};

// 💥 업적 데이터 정의
const ACHIEVEMENTS = {
  // 1. 첫 타격 업적
  first_hit: {
    title: "첫 타격",
    description: "총 1회 타격",
    condition: 1,
    achieved: false,
    type: "hitCount",
    icon: "icon_first_hit.png",
    custom_status_text_achieved: "그만둬주십시오...",
  }, // 2. 모든 커서 강화 업적 추가
  ACH_ALL_CURSOR_LEVEL_5: {
    title: "공략 완료",
    description: "모든 커서를 5단계까지 강화",
    condition: MAX_LEVEL,
    achieved: false,
    type: "allMaxLevel",
    icon: "icon_amateur_striker.png",
    custom_status_text_achieved: "모든 히로인을 공략했습니다.",
  }, // 3. 단일 커서 사용 업적
  single_cursor_01: {
    title: "쇼타로",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor01",
    icon: "icon_single_cursor_01.png",
    custom_status_text_achieved: "아리아케로만 1010타격 달성",
  },
  single_cursor_02: {
    title: "메이",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor02",
    icon: "icon_single_cursor_02.png",
    custom_status_text_achieved: "신바시로만 1010타격 달성",
  },
  single_cursor_03: {
    title: "카에데",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor03",
    icon: "icon_single_cursor_03.png",
    custom_status_text_achieved: "아오미로만 1010타격 달성",
  },
  single_cursor_04: {
    title: "요조",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor04",
    icon: "icon_single_cursor_04.png",
    custom_status_text_achieved: "타케시바로만 1010타격 달성",
  },
  single_cursor_05: {
    title: "미치오",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor05",
    icon: "icon_single_cursor_05.png",
    custom_status_text_achieved: "시오도메로만 1010타격 달성",
  },
  single_cursor_06: {
    title: "기이치로",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor06",
    icon: "icon_single_cursor_06.png",
    custom_status_text_achieved: "시죠마에로만 1010타격 달성",
  },
  single_cursor_07: {
    title: "로렌",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor07",
    icon: "icon_single_cursor_07.png",
    custom_status_text_achieved: "토요스로만 1010타격 달성",
  },
  single_cursor_08: {
    title: "리이치",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor08",
    icon: "icon_single_cursor_08.png",
    custom_status_text_achieved: "히노데로만 1010타격 달성",
  },
  single_cursor_09: {
    title: "쿠레이치로",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor09",
    icon: "icon_single_cursor_09.png",
    custom_status_text_achieved: "후네노로만 1010타격 달성",
  },
  single_cursor_10: {
    title: "시즈마",
    condition: 1010,
    achieved: false,
    type: "singleHit",
    cursor: "cursor10",
    icon: "icon_single_cursor_10.png",
    custom_status_text_achieved: "다이바로만 1010타격 달성",
  },
};

// 이미지 및 커서 경로 관리
const normalImage = "Hit_01.png";
const hitImages = ["Hit_02.png", "Hit_03.png", "Hit_04.png", "Hit_05.png"];
const displayTime = 150;
const effectDuration = 250;
// 커서 파일 경로를 생성하는 함수
function getCursorPaths(cursorName) {
  return {
    normal: `url('${fileSrc}${cursorName}.png'), pointer`,
    hit: `url('${fileSrc}${cursorName}_hit.png'), pointer`,
  };
}

// 몬스터 이미지의 기본 커서를 업데이트하는 함수
function updateMonsterCursor() {
  const cursorPath = getCursorPaths(currentCursor).normal;
  monsterImage.style.cursor = cursorPath;
}

// ------------------------------------
// 유틸리티 및 상태 관리
// ------------------------------------

/**
 * 페이지 새로고침 시 모든 상태를 0으로 초기화합니다.
 */
function loadState() {
  hitCount = 0;
  currentCursor = "cursor01";
  currentDamage = BASE_DAMAGE; // 💥 기본 피해량으로 초기화 // 💥 강화 레벨 및 단일 타격 수 초기화
  cursorButtons.forEach((button) => {
    const cursorName = button.dataset.cursor;
    cursorLevels[cursorName] = 0; // 초기 레벨 0
    singleCursorHitCounts[cursorName] = 0; // 초기 타격 수 0
  }); // 💥 업적 상태 초기화
  for (const key in ACHIEVEMENTS) {
    ACHIEVEMENTS[key].achieved = false;
  } // 초기 UI 렌더링

  counterDisplay.textContent = hitCount;
  initializeCursors(); // 💥 이벤트 GIF 사전 로딩

  const eventGifPreloader = new Image();
  eventGifPreloader.src = eventGif; // eventGif 변수는 'hit_event.gif' 경로를 담고 있습니다.
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
  const selectedButton = document.querySelector(
    `[data-cursor="${cursorName}"]`
  );
  if (!selectedButton) return BASE_DAMAGE; // 💥 '기본 피해량'은 BASE_DAMAGE(1)로 고정. // 💥 data-damage 값은 '강화당 추가되는 피해량'으로 사용합니다. (이전에는 '기본 피해량'으로 사용됨)

  const damagePerLevel = parseInt(selectedButton.dataset.damage);
  const currentLevel = cursorLevels[cursorName] || 0; // 피해량 = 고정 기본 피해량 (1) + (강화당 추가 피해량 * 현재 레벨)

  return BASE_DAMAGE + damagePerLevel * currentLevel;
}

/**
 * 커서 버튼의 툴팁 텍스트를 업데이트합니다.
 */
function updateCursorButtonTooltip(button) {
  const cursorName = button.dataset.cursor;
  const damagePerLevel = parseInt(button.dataset.damage); // 💥 강화당 피해량으로 사용
  const currentLevel = cursorLevels[cursorName] || 0;
  const singleHitCount = singleCursorHitCounts[cursorName] || 0;
  const currentDamage = calculateDamage(cursorName); // 💥 수정된 함수 사용
  let tooltipText = `피해량: ${currentDamage} | 타격수: ${singleHitCount}`;

  if (currentLevel < MAX_LEVEL) {
    // 다음 레벨업에 필요한 총 타격 횟수
    const nextLevelHits = (currentLevel + 1) * LEVEL_UP_INTERVAL; // 💥 다음 레벨의 피해량 계산
    const nextDamage = BASE_DAMAGE + damagePerLevel * (currentLevel + 1);
    tooltipText += ` | 다음 강화 (${
      currentLevel + 1
    }단계, ${nextDamage} 피해): ${nextLevelHits} 타격 시`;
  } else {
    tooltipText += " | (최대 레벨 달성)";
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
      console.log(`[강화] ${cursorName}이(가) 레벨 ${newLevel}이 되었습니다!`); // 툴팁 UI 업데이트
      if (button) updateCursorButtonTooltip(button); // 현재 커서의 피해량 업데이트

      if (currentCursor === cursorName) {
        currentDamage = calculateDamage(currentCursor);
      }
    }
  } // 모든 커서가 최대 레벨인지 확인하여 업적 체크 (모든 커서를 순회)
  cursorButtons.forEach((b) => {
    if (cursorLevels[b.dataset.cursor] < MAX_LEVEL) {
      allMaxLevel = false;
    }
  });

  if (allMaxLevel) {
    checkAchievements("ALL_CURSOR_MAX_LEVEL");
  }
}

// ------------------------------------
// 이벤트 및 타격 로직
// ------------------------------------

function playEventAnimation() {
  isEventActive = true;
  monsterImage.src = eventGif;
  monsterImage.style.cursor = "default";

  setTimeout(() => {
    isEventActive = false;
    monsterImage.src = fileSrc + normalImage;
    updateMonsterCursor();
  }, eventDuration);
}

// 타격 이펙트 생성 및 재생 함수
function createHitEffect(x, y) {
  const effect = document.createElement("div");
  effect.className = "hit-effect";
  effect.style.left = `${x}px`;
  effect.style.top = `${y}px`;

  const randomRotation = Math.floor(Math.random() * 360);
  effect.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
  body.appendChild(effect);
  requestAnimationFrame(() => {
    effect.classList.add("animate");
  });

  setTimeout(() => {
    effect.remove();
  }, effectDuration);
}

// 업적 달성 배너 표시 함수
function showAchievementBanner(achievement) {
  const banner = document.getElementById("achievement-banner");
  const bannerText = document.getElementById("achievement-text"); // '업적달성' + 업적의 제목(title)을 조합하여 표시
  bannerText.textContent = `업적달성 "${achievement.title}"`; // 배너 표시
  banner.classList.add("show"); // 2초 후 배너 숨김

  setTimeout(() => {
    banner.classList.remove("show");
  }, 2000);
}

/**
 * 현재 커서 외에 다른 커서가 한 번이라도 사용되었는지 확인합니다.
 * @returns {boolean} true: 현재 커서만 사용됨, false: 다른 커서도 사용됨
 */
function isOnlyCurrentCursorUsed() {
  for (const cursorName in singleCursorHitCounts) {
    // 현재 커서가 아니면서, 타격 횟수가 0보다 큰 경우 (즉, 한 번이라도 사용된 경우)
    if (cursorName !== currentCursor && singleCursorHitCounts[cursorName] > 0) {
      return false;
    }
  }
  return true;
}

// 업적 확인 함수
function checkAchievements(type = "GENERAL") {
  let newlyAchieved = false; // 1. Hit Count Achievements ('first_hit') 및 기타 일반 업적
  for (const key in ACHIEVEMENTS) {
    const ach = ACHIEVEMENTS[key]; // 이미 달성했거나 type이 allMaxLevel이면 건너뜁니다. (ALL_CURSOR_MAX_LEVEL 체크는 루프 밖에서 별도로 진행)
    if (ach.achieved || ach.type === "allMaxLevel") continue;
    if (ach.type === "hitCount" && hitCount >= ach.condition) {
      ach.achieved = true;
      showAchievementBanner(ach);
      newlyAchieved = true;
    } else if (ach.type === "singleHit") {
      const cursorKey = ach.cursor; // 단일 커서 업적 조건: 해당 커서의 타격수가 조건(1010) 이상일 경우
      if (singleCursorHitCounts[cursorKey] >= ach.condition) {
        ach.achieved = true;
        showAchievementBanner(ach);
        newlyAchieved = true;
      }
    }
  } // 3. 모든 커서 강화 업적 (ALL_CURSOR_MAX_LEVEL 타입일 때만 체크)
  if (type === "ALL_CURSOR_MAX_LEVEL") {
    const allMaxAch = ACHIEVEMENTS["ACH_ALL_CURSOR_LEVEL_5"];
    if (allMaxAch && !allMaxAch.achieved) {
      const allMax = Array.from(cursorButtons).every((button) => {
        return cursorLevels[button.dataset.cursor] >= MAX_LEVEL;
      });
      if (allMax) {
        allMaxAch.achieved = true;
        showAchievementBanner(allMaxAch);
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
  } // 💥 1. 랜덤 타격 사운드 재생
  const randomIndex = Math.floor(Math.random() * HIT_SOUNDS.length);
  const soundToPlay = HIT_SOUNDS[randomIndex];
  soundToPlay.currentTime = 0;
  soundToPlay.play().catch((e) => {
    // 자동 재생 제한 등으로 인해 재생 실패 시 콘솔에만 기록
    console.warn("사운드 재생 실패.", e);
  });

  const potentialHitCount = hitCount + currentDamage; // 💥 1010 이벤트 발생 조건 체크
  if (hitCount < eventThreshold && potentialHitCount >= eventThreshold) {
    // --- 💥 이벤트 발생 블록 (수정 시작) 💥 ---
    // 1. 단일 커서 타격 수에 최종 데미지를 반영합니다.
    singleCursorHitCounts[currentCursor] += currentDamage; // 2. 현재 커서의 레벨을 체크하여 업데이트합니다.
    checkCursorLevels(currentCursor, singleCursorHitCounts[currentCursor]); // 3. 글로벌 타격 수를 1010으로 설정합니다.
    hitCount = eventThreshold;
    counterDisplay.textContent = hitCount; // 4. 단일 커서 업적 조건 검사... (중략)
    const currentAchKey = `single_cursor_${currentCursor.slice(-2)}`;
    const currentSingleAch = ACHIEVEMENTS[currentAchKey]; // 💥 오직 현재 커서로만 이벤트를 달성했고 아직 업적을 달성하지 않았다면
    if (
      currentSingleAch &&
      !currentSingleAch.achieved &&
      isOnlyCurrentCursorUsed()
    ) {
      // 업적 목록 렌더링을 위해 단일 타격수를 조건 이상으로 설정하여 강제 달성 처리
      singleCursorHitCounts[currentCursor] = Math.max(
        singleCursorHitCounts[currentCursor],
        currentSingleAch.condition
      );
    } // 💥 핵심 수정: 애니메이션 시작을 약간 지연시켜 연타 충돌을 방지합니다.
    setTimeout(() => {
      playEventAnimation();
      checkAchievements(); // 이벤트 애니메이션 후 업적 확인
      saveState();
    }, 50); // 50ms 지연 (충분히 짧고 충돌을 피할 수 있는 시간)
    return; // --- 💥 이벤트 발생 블록 수정 끝 💥 ---
  }

  createHitEffect(event.clientX, event.clientY);
  hitCount += currentDamage;
  counterDisplay.textContent = hitCount; // 💥 단일 커서 타격 횟수를 피해량만큼 증가
  singleCursorHitCounts[currentCursor] += currentDamage;
  checkCursorLevels(currentCursor, singleCursorHitCounts[currentCursor]);
  checkAchievements();
  saveState(); // 💥 변수 이름 중복 수정 (randomIndex -> randomImageIndex)

  const randomImageIndex = Math.floor(Math.random() * hitImages.length);
  monsterImage.src = fileSrc + hitImages[randomImageIndex];
  const hitCursorPath = getCursorPaths(currentCursor).hit;
  monsterImage.style.cursor = hitCursorPath;
  setTimeout(() => {
    monsterImage.src = fileSrc + normalImage;
    updateMonsterCursor();
  }, displayTime);
}
// ------------------------------------
// 💥 타격수 초기화 기능
// ------------------------------------
/**
 * 총 타격수와 단일 커서 타격수만 0으로 초기화하고, 강화 레벨과 업적은 유지합니다.
 */
function handleHitCountReset() {
  if (
    !confirm(
      "총 타격수와 각 커서의 타격수를 초기화하시겠습니까? 커서 강화 레벨과 업적 달성 기록은 유지됩니다."
    )
  ) {
    return;
  } // 1. 총 타격수 초기화
  hitCount = 0;
  counterDisplay.textContent = hitCount; // 2. 단일 커서 타격수 초기화 및 툴팁 업데이트
  cursorButtons.forEach((button) => {
    const cursorName = button.dataset.cursor;
    singleCursorHitCounts[cursorName] = 0;
    updateCursorButtonTooltip(button);
  }); // 3. 현재 피해량 재계산
  currentDamage = calculateDamage(currentCursor); // 4. 이벤트 상태 및 이미지 초기화
  isEventActive = false;
  monsterImage.src = normalImage;
  updateMonsterCursor();
  closeModal();
  alert("타격수가 성공적으로 초기화되었습니다.");
}

// ------------------------------------
// 커서 버튼 및 모달 기능
// ------------------------------------

/**
 * 커서 버튼 클릭 핸들러
 */
function handleCursorChange(event) {
  const clickedButton = event.currentTarget;
  const newCursorName = clickedButton.dataset.cursor; // 이전 커서의 아이콘을 _off 상태로 변경
  const previouslySelectedButton = document.querySelector(
    ".cursor-button.selected"
  );
  if (previouslySelectedButton) {
    previouslySelectedButton.classList.remove("selected");
    const oldCursorName = previouslySelectedButton.dataset.cursor;
    const oldIconImg = previouslySelectedButton.querySelector("img");
    if (oldIconImg) {
      oldIconImg.src = `${fileSrc}${oldCursorName}_icon_off.png`;
    }
  } // 새 커서의 아이콘을 _on 상태로 변경
  clickedButton.classList.add("selected");
  const newIconImg = clickedButton.querySelector("img");
  if (newIconImg) {
    newIconImg.src = `${fileSrc}${newCursorName}_icon_on.png`;
  } // 게임 상태 업데이트

  currentCursor = newCursorName;
  currentDamage = calculateDamage(currentCursor); // 💥 수정된 함수 사용
  updateMonsterCursor();
  saveState();
}

/**
 * 업적 목록을 모달에 렌더링하는 함수
 */
function renderAchievements() {
  achievementList.innerHTML = ""; // 업적을 세 그룹으로 나누어 정렬
  const achievementsArray = Object.entries(ACHIEVEMENTS);
  const firstHitAch = achievementsArray.find(
    ([, ach]) => ach.type === "hitCount"
  );
  const allMaxAch = achievementsArray.find(
    ([, ach]) => ach.type === "allMaxLevel"
  );
  const singleHitAchs = achievementsArray
    .filter(([, ach]) => ach.type === "singleHit")
    .sort(([, a], [, b]) => a.cursor.localeCompare(b.cursor)); // 커서 이름 순서대로 정렬 // 정렬된 순서로 배열 재구성: 첫 타격 -> 모든 강화 -> 단일 커서

  const sortedEntries = [];
  if (firstHitAch) sortedEntries.push(firstHitAch);
  if (allMaxAch) sortedEntries.push(allMaxAch);
  sortedEntries.push(...singleHitAchs);

  for (const [key, ach] of sortedEntries) {
    const li = document.createElement("li");
    const isUnlocked = ach.achieved;
    let statusText = "";
    let iconSrc = ach.icon;
    if (isUnlocked) {
      // 💥 달성 시 커스텀 문구 사용
      if (ach.custom_status_text_achieved) {
        statusText = ach.custom_status_text_achieved;
      } else {
        statusText = "달성 완료";
      }
    } else {
      // 미달성 시 텍스트 제거
    } // 요청에 따라 커서 레벨 및 피해량 정보를 표시하는 로직을 제거했습니다.
    let cursorLevelInfo = "";

    li.className = `achievement-item ${isUnlocked ? "unlocked" : "locked"}`;
    li.innerHTML = `
<div class="achievement-text-group">
    <div class="achievement-icon">
        <img src="${fileSrc}${iconSrc}" alt="아이콘"/>
    </div>
    <div class="achievement-title-status">
        <p class="achievement-title">${ach.title}${cursorLevelInfo}</p>
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
  if (panelId === "achievement") {
    renderAchievements();
    achievementPanel.style.display = "block";
  }
  settingsMenu.style.display = "none";
  modal.style.display = "flex";
  // 바디 스크롤 막기
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  // 바디 스크롤 가능
  document.body.style.overflow = "";
}

/**
 * 설정 메뉴 토글 함수
 */
function toggleSettingsMenu() {
  // CSS에서 display: none을 초기값으로 설정하지 않았으므로, 'none'인지 체크
  settingsMenu.style.display =
    settingsMenu.style.display === "none" || settingsMenu.style.display === ""
      ? "flex"
      : "none";
}

/**
 * 초기화 함수
 */
function initializeCursors() {
  cursorButtons.forEach((button) => {
    const cursorName = button.dataset.cursor;
    const iconImg = button.querySelector("img");
    button.classList.remove("locked"); // 툴팁 초기화 (강화 정보 포함)
    updateCursorButtonTooltip(button); // 선택된 커서 UI 업데이트

    if (button.dataset.cursor === currentCursor) {
      button.classList.add("selected");
      if (iconImg) {
        iconImg.src = `${fileSrc}${cursorName}_icon_on.png`;
      }
    } else if (iconImg) {
      iconImg.src = `${fileSrc}${cursorName}_icon_off.png`;
    }
  });

  updateMonsterCursor();
}

// ------------------------------------
// 💥 개발자 기능 삭제: handleHitJump 함수 삭제
// ------------------------------------

// ------------------------------------
// 이벤트 리스너 설정
// ------------------------------------

// 페이지 로드 시 상태 로드 및 초기화
loadState();

monsterImage.addEventListener("mousedown", handleHit);

cursorButtons.forEach((button) => {
  button.addEventListener("click", handleCursorChange);
});

// 설정 메뉴 관련 이벤트 리스너
settingsButton.addEventListener("click", toggleSettingsMenu);

achievementButton.addEventListener("click", () => openModal("achievement"));
resetHitsButton.addEventListener("click", handleHitCountReset);

// 💥 삭제: devButton.addEventListener('click', () => openModal('developer'));

// 💥 삭제: 개발자 기능 버튼 이벤트 리스너 삭제

closeButton.addEventListener("click", closeModal);

// 외부 클릭 시 모달 또는 메뉴 닫기 로직
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    closeModal();
  }
  const settingsAreaContainer = document.getElementById(
    "settings-area-container"
  ); // settingsAreaContainer가 존재하는지 Null 체크
  if (settingsAreaContainer) {
    if (
      event.target !== settingsButton &&
      !settingsAreaContainer.contains(event.target) &&
      settingsMenu.style.display === "flex"
    ) {
      settingsMenu.style.display = "none";
    }
  }
});

// 1. 몬스터 이미지 우클릭 방지
monsterImage.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// 2. 모든 이미지(커서 아이콘 포함) 우클릭 방지
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
});
