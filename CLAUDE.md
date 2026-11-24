# 자기소개 웹앱 작업 안내 (Claude Code용)

## 작업 흐름
Claude Code로 코드를 고친다 → GitHub(Solquick24/portfolio)에 push → AWS(S3 + CloudFront)에 배포한다.

1. 코드 수정 후 브라우저 없이 확인할 수 있는 것은 먼저 확인한다 (JSON 문법, 경로).
2. `git add`, `git commit`, `git push origin main`으로 GitHub에 올린다.
3. `aws login`으로 받은 임시 자격 증명으로 `./scripts/deploy.ps1`을 실행해 S3에 올리고 CloudFront 캐시를 무효화한다.

## AWS 리소스
- 리전: ap-northeast-2 (서울)
- S3 버킷: solquick24-portfolio (퍼블릭 액세스 차단 유지)
- CloudFront: 배포 ID E3EBX10YEJY6LC, 주소 https://d3b09ii6vr1zn8.cloudfront.net
- OAC: solquick24-portfolio-oac로만 S3에 접근, 기본 루트 객체 index.html

## 지켜야 할 것
- S3 버킷의 퍼블릭 액세스 차단을 풀지 않는다. 접근은 CloudFront OAC로만 한다.
- 액세스 키 같은 자격 증명을 저장소에 넣지 않는다.
- 프로젝트 내용은 `data/projects.json`만 고치면 된다.
