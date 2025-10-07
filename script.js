// script.js

// 몬스터 이미지 요소를 가져옵니다.
const monsterImage = document.getElementById('monster');
// 타격 횟수 카운터를 표시할 요소를 가져옵니다.
const counterDisplay = document.getElementById('hit-count'); 
// 💥 이펙트가 표시될 부모 요소를 body로 설정
const body = document.body; 

// 타격 횟수 변수를 초기화합니다.
let hitCount = 0;

// 기본 이미지 파일 경로 (몬스터 이미지)
const normalImage = 'Hit_01.png';

// 랜덤으로 선택될 타격 이미지 파일 배열
const hitImages = ['Hit_02.png', 'Hit_03.png', 'Hit_04.png'];

// 이미지/커서 유지 시간 (밀리초)
const displayTime = 150; 
// 💥 이펙트 애니메이션 지속 시간 (CSS의 0.3s와 일치)
const effectDuration = 300; 

// 타격 시 사용할 커서 이미지 정의
const hitCursor = "url('cursor_hit.png'), pointer";

// 💥 타격 이펙트 생성 및 재생 함수
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    
    // 클릭된 위치를 기준으로 이펙트 배치
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    body.appendChild(effect);
    
    // CSS 애니메이션 시작
    // requestAnimationFrame을 사용하여 다음 프레임에 애니메이션 적용
    requestAnimationFrame(() => {
        effect.classList.add('animate');
    });

    // 애니메이션 재생 후 요소 제거 (메모리 관리)
    setTimeout(() => {
        effect.remove();
    }, effectDuration + 100); // 애니메이션 시간보다 약간 더 길게 설정
}


// 클릭 이벤트를 처리하는 함수 (handleHit)
function handleHit(event) {
    // 💥 이펙트 생성 및 재생 (클릭 위치 사용)
    createHitEffect(event.clientX, event.clientY);
    
    // 1. 타격 횟수를 1 증가시키고 화면을 업데이트합니다.
    hitCount++;
    counterDisplay.textContent = hitCount;
    
    // 2. 랜덤으로 타격 이미지 중 하나를 선택합니다.
    const randomIndex = Math.floor(Math.random() * hitImages.length);
    const randomHitImage = hitImages[randomIndex];
    
    // 3. 몬스터 이미지를 랜덤으로 선택된 타격 이미지로 변경합니다.
    monsterImage.src = randomHitImage;

    // 4. 🖱️ 커서를 'cursor_hit.png' (타격 커서)로 변경합니다.
    monsterImage.style.cursor = hitCursor; 

    // 5. 일정 시간 후에 몬스터 이미지와 커서를 원래대로 되돌립니다.
    setTimeout(() => {
        // 몬스터 이미지 원상 복구 (Hit_01.png)
        monsterImage.src = normalImage;

        // 6. 🖱️ 커서의 인라인 스타일을 제거하여 CSS에 정의된 기본 커서로 되돌립니다.
        monsterImage.style.cursor = ''; 
    }, displayTime);
}

// 몬스터 이미지에 클릭 이벤트 리스너를 추가합니다.
// 클릭 위치를 알기 위해 이벤트 객체를 handleHit 함수로 전달합니다.
monsterImage.addEventListener('mousedown', handleHit);
