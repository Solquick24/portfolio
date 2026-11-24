# 자기소개 웹앱 (self-intro-webapp)

충남대학교 클라우드 데이터베이스 수업의 자기소개 웹앱 프로젝트이다.
원페이지 정적 사이트를 Amazon S3에 올리고 CloudFront(OAC)로 배포한다.

## 화면 구성

| ID | 섹션 | 내용 |
|----|------|------|
| S01 | 홈 | 이름, 한 줄 소개, 프로젝트 보기 버튼 |
| S02 | 소개 | 자기소개, 경험, 기술 스택 |
| S03 | 프로젝트 | `data/projects.json`을 읽어 카드와 상세 창 표시 |
| S04 | 연락처 | 이메일(메일 보내기, 주소 복사), GitHub |
| S05 | 방명록 | 입력 폼과 목록 (AppSync, DynamoDB 연결 예정) |

## 폴더 구조

```
index.html          원페이지 마크업
css/style.css       스타일
js/app.js           프로젝트 카드, 상세 창, 이메일 복사, 방명록 입력 검사
data/projects.json  프로젝트 데이터
scripts/deploy.ps1  S3 업로드와 CloudFront 캐시 무효화
```

## 아키텍처

```
방문자 ──HTTPS──> CloudFront ──OAC──> S3 (퍼블릭 액세스 차단)
                       └─(예정) AppSync ──> DynamoDB (방명록)
```

## 배포

```powershell
aws login                       # 브라우저 로그인으로 임시 자격 증명 받기
./scripts/deploy.ps1 -DistributionId <CloudFront 배포 ID>
```
