/* style.css */

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background-color: #282c34;
    color: white;
    font-family: sans-serif;
    text-align: center;
}

.main-content {
    display: flex;
    flex-direction: row; 
    align-items: flex-start;
    gap: 50px; 
}

.game-container {
    padding: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

/* 타격 횟수 카운터 스타일 */
#hit-count {
    margin-bottom: 20px;
    color: #c0392b;
    font-size: 4em;
    font-weight: bold;
}

/* 이미지 스타일 */
#monster {
    width: 80%;
    max-width: 500px;
    /* JS에서 커서가 설정되지만, 기본값으로 유지 */
    cursor: url('cursor.png'), pointer;
    transition: transform 0.1s ease-out;
}

#monster:active {
    transform: scale(0.98);
}

/* ------------------------------------ */
/* 커서 컨트롤 및 설정 버튼 스타일 */
/* ------------------------------------ */

.cursor-controls {
    display: flex;
    flex-direction: column;
    gap: 15px; 
    align-items: center;
}

.cursor-selector {
    padding: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    color: #333;
    width: 50px; 
}

#settings-button {
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    transition: background-color 0.2s;
}
#settings-button:hover {
    background-color: #2980b9;
}


/* ------------------------------------ */
/* 커서 버튼 그룹 스타일 */
/* ------------------------------------ */

.button-group {
    display: flex;
    flex-direction: column; 
    gap: 10px;
    align-items: center;
}

.cursor-button {
    background-color: #f0f0f0;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 5px;
    cursor: pointer;
    transition: all 0.2s;
    width: 50px; 
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cursor-button:hover {
    border-color: #c0392b;
    box-shadow: 0 0 5px rgba(192, 57, 43, 0.5);
}

.cursor-button.selected {
    border-color: #c0392b; 
    background-color: #c0392b;
    box-shadow: 0 0 8px rgba(192, 57, 43, 0.8);
}

.cursor-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* 잠금된 커서 스타일 */
.cursor-button.locked {
    opacity: 0.35; 
    cursor: not-allowed; 
    background-color: #777; 
    border-color: #aaa;
}

.cursor-button.locked:hover {
    border-color: #aaa; 
    box-shadow: none;
}


/* ------------------------------------ */
/* 업적 달성 배너 스타일 */
/* ------------------------------------ */
#achievement-banner {
    position: fixed;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    padding: 15px;
    background-color: #2ecc71;
    color: white;
    text-align: center;
    font-weight: bold;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    transition: bottom 0.5s ease-out;
}

#achievement-banner.show {
    bottom: 0;
}


/* ------------------------------------ */
/* 모달 (팝업) 스타일 */
/* ------------------------------------ */
.modal {
    display: none; 
    position: fixed; 
    z-index: 1001; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgba(0,0,0,0.7); 
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto; 
    padding: 20px;
    border: 1px solid #888;
    width: 80%; 
    max-width: 400px;
    border-radius: 10px;
    color: #333;
}

.close-button {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close-button:hover,
.close-button:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
}

/* 업적 목록 스타일 */
#achievement-list {
    list-style: none;
    padding: 0;
}
.achievement-item {
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 5px solid;
    transition: opacity 0.3s;
}
.achievement-item.unlocked {
    background-color: #e8f5e9; 
    border-color: #4caf50;
    font-weight: bold;
}
.achievement-item.locked {
    background-color: #f8f8f8;
    border-color: #999;
    opacity: 0.7;
    font-style: italic;
}

/* ------------------------------------ */
/* 타격 이펙트 스타일 */
/* ------------------------------------ */

.hit-effect {
    width: 125px; 
    height: 125px;
    position: absolute;
    pointer-events: none;
    background-image: url('hit_effect.png');
    background-repeat: no-repeat;
    background-size: 500px 125px; 
    background-position: 0 0;
    transform: translate(-50%, -50%);
}

@keyframes playEffect {
    from { background-position: 0 0; }
    to { background-position: -500px 0; } 
}

.animate {
    animation: playEffect 0.2s steps(4) forwards; /* 0.2s 대신 0.3s로 변경 (이전 답변 코드와 통일) */
    opacity: 0;
    transition: opacity 0.1s 0.2s; 
}
