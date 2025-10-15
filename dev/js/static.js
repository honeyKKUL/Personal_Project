// 정적 파일 주소
export const fileSrc = `https://honeykkul.github.io/Personal_Project/assets/`;
export const eventGif = fileSrc + "hit_event.gif";

// 사운드 파일
export const HIT_SOUNDS = [
  new Audio(`${fileSrc}hit_sound_01.mp3`),
  new Audio(`${fileSrc}hit_sound_02.mp3`),
  new Audio(`${fileSrc}hit_sound_03.mp3`),
  new Audio(`${fileSrc}hit_sound_04.mp3`),
  new Audio(`${fileSrc}hit_sound_05.mp3`),
];

// ------------------------------------
// 💥 이벤트 및 상태 변수
// ------------------------------------

export const eventThreshold = 2; // 이벤트 발동 타격 수
export const eventDuration = 4000; // GIF 재생 시간 (4초)


// export const state = {};
export const initialState = {
  hitCount: 0,
  currentCursor: "cursor01",
  currentDamage: 1,
};
// ------------------------------------
// 💥 커서 강화 시스템 변수
// ------------------------------------
export const LEVEL_UP_INTERVAL = 50; // 강화되는 타격 수 단위
export const MAX_LEVEL = 4; // 최대 강화 단계
// 💥 모든 커서의 고정 기본 피해량
export const BASE_DAMAGE = 1;
export let cursorLevels = {};
export let singleCursorHitCounts = {};

// 이미지 및 커서 경로 관리
export const normalImage = "Hit_01.png";
export const hitImages = [
  "Hit_02.png",
  "Hit_03.png",
  "Hit_04.png",
  "Hit_05.png",
];
export const displayTime = 150;

// 💥 업적 데이터 정의
export const ACHIEVEMENTS = {
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
