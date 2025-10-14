#!/bin/bash
# ----------------------------------------
# dev 폴더를 최신 코드로 덮어씌워서 GitHub Pages 테스트용으로 배포하는 스크립트
# ----------------------------------------

# main 브랜치로 이동
git checkout main

# main 최신화
git pull origin main

# dev 폴더 초기화 후, 최신 코드 복사
rm -rf dev/*
mkdir -p dev
cp -r index.html css js dev/

# 커밋 및 푸시
git add dev
git commit -m "🔄 Update dev test version"
git push origin main

echo "✅ /dev 폴더가 업데이트되었습니다. https://honeykkul.github.io/Personal_Project/dev/"
