/**
 * 업적 목록을 모달에 렌더링하는 함수 (미달성 문구 제거)
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
