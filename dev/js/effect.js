/**
 *
 * 클릭 시 이펙트 관련 함수
 * @returns
 */

// 이벤트 좌표 리턴
export function getPosition(event) {
  let x, y;

  // // 모바일
  if (event.type.startsWith("touch")) {
    const touch = event.touches[0] || event.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
    return { x, y };
  }

  // PC
  x = event.clientX;
  y = event.clientY;
  return { x, y };
}

// 타격 이펙트 생성 및 애니메이션 재생
export function createHitEffect(x, y) {
  const effect = document.createElement("div");

  effect.className = "hit-effect";
  effect.style.left = `${x}px`;
  effect.style.top = `${y}px`;

  effect.style.transform = `translate(-50%, -50%)`;
  document.body.appendChild(effect);

  requestAnimationFrame(() => {
    effect.classList.add("animate");
  });

  setTimeout(() => {
    effect.remove();
  }, 250);
}
