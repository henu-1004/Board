# 📝 Board Project

> **Node.js + Express + MySQL 기반 게시판 구현 프로젝트**  
> 기본 게시판 버전과 jQuery AJAX 기반 비동기 처리 버전을 함께 정리한 레포지토리입니다.

---

## 📌 Project Overview

이 레포지토리는 데이터베이스와 웹 서버 연동을 학습하기 위해 구현한 게시판 프로젝트입니다.

Node.js와 Express를 기반으로 서버를 구성하고, MySQL/MariaDB 데이터베이스를 연동하여 회원가입, 로그인, 게시글 작성, 게시글 조회, 댓글, 좋아요 등의 게시판 기능을 구현했습니다.

본 레포지토리에는 두 가지 버전의 게시판 프로젝트가 포함되어 있습니다.

| Folder | Description |
|---|---|
| `express-board-basic` | Node.js + Express + MySQL 기반 기본 게시판 구현 |
| `express-board-ajax` | jQuery AJAX를 활용하여 로그인, 회원가입, 댓글, 좋아요 등 비동기 동작을 적용한 게시판 구현 |

---

## 🛠️ Tech Stack

| Category | Stack |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| View Engine | EJS |
| Database | MySQL / MariaDB |
| Frontend | HTML, CSS, jQuery |
| Session | express-session |
| Request Handling | AJAX, body-parser |

---

## 📁 Version Description

## 1. express-board-basic

`express-board-basic`은 Node.js와 Express를 활용한 기본 게시판 구현 버전입니다.

이 버전에서는 서버 라우팅, MySQL/MariaDB 연결, 세션 기반 로그인, 게시글 CRUD, 댓글 기능 등 게시판의 기본 흐름을 중심으로 구현했습니다.

주요 구현 내용은 다음과 같습니다.

- Express 기반 웹 서버 구성
- MySQL/MariaDB 데이터베이스 연결
- 회원가입 및 로그인
- 세션 기반 사용자 관리
- 게시글 목록 조회
- 게시글 상세 조회
- 게시글 작성
- 게시글 삭제
- 댓글 작성
- 댓글 삭제
- 좋아요 기능

---

## 2. express-board-ajax

`express-board-ajax`는 기본 게시판 기능에 jQuery AJAX를 활용한 비동기 요청 처리를 적용한 버전입니다.

폼 제출이나 버튼 클릭 시 페이지 전체를 새로고침하지 않고 서버와 데이터를 주고받을 수 있도록 구현했습니다.

주요 구현 내용은 다음과 같습니다.

- jQuery 기반 이벤트 처리
- AJAX 로그인 요청
- AJAX 회원가입 처리
- 아이디 중복 확인
- 게시글 삭제 요청
- 댓글 작성 및 삭제 요청
- 좋아요 추가 / 취소 처리
- 좋아요 수 실시간 반영

---

## 🧱 Database Schema

본 프로젝트는 게시판 기능 구현을 위해 다음 테이블을 사용했습니다.

### User Table

사용자 정보를 저장하는 테이블입니다.

| Column | Description |
|---|---|
| username | 사용자 ID |
| password | 비밀번호 |
| name | 이름 |
| email | 이메일 |
| emaildomain | 이메일 도메인 |

---

### Board Table

게시글 정보를 저장하는 테이블입니다.

| Column | Description |
|---|---|
| postid | 게시글 번호 |
| author | 작성자 |
| title | 제목 |
| body | 게시글 내용 |
| regdate | 작성일 |
| viewcnt | 조회수 |
| likes | 좋아요 수 |

---

### Reply Table

댓글 정보를 저장하는 테이블입니다.

| Column | Description |
|---|---|
| commentid | 댓글 번호 |
| postid | 게시글 번호 |
| commentwriter | 댓글 작성자 |
| commentcontent | 댓글 내용 |
| commentdate | 댓글 작성일 |

---

### Likes Table

게시글 좋아요 정보를 저장하는 테이블입니다.

| Column | Description |
|---|---|
| postid | 게시글 번호 |
| username | 사용자 ID |

---

## ⚙️ Main Features

## 1. 회원가입

사용자는 이름, 아이디, 비밀번호, 이메일 정보를 입력하여 회원가입할 수 있습니다.

구현 기능은 다음과 같습니다.

- 필수 입력값 검증
- 비밀번호 확인 검증
- 아이디 중복 확인
- 사용자 정보 데이터베이스 저장

---

## 2. 로그인 / 로그아웃

사용자가 입력한 아이디와 비밀번호를 데이터베이스의 사용자 정보와 비교하여 로그인 여부를 판단합니다.

로그인 성공 시 세션에 사용자 정보를 저장하고, 로그아웃 시 세션을 삭제하여 로그인 상태를 해제합니다.

---

## 3. 게시글 목록 조회

게시글 목록은 데이터베이스에서 최신순으로 조회하여 출력합니다.

구현 기능은 다음과 같습니다.

- 게시글 번호 출력
- 제목 출력
- 작성자 출력
- 작성일 출력
- 조회수 출력
- 좋아요 수 출력
- 페이지네이션 처리
- 페이지당 게시글 수 조절

---

## 4. 게시글 상세 조회

사용자가 게시글을 선택하면 상세 페이지로 이동합니다.

상세 조회 시 다음 기능을 수행합니다.

- 게시글 제목, 작성자, 작성일, 내용 출력
- 조회수 증가
- 댓글 목록 조회
- 좋아요 상태 확인
- 작성자일 경우 삭제 버튼 표시

---

## 5. 게시글 작성

로그인한 사용자는 게시글을 작성할 수 있습니다.

게시글 작성 시 제목과 내용을 입력하고, 작성자는 현재 로그인한 사용자 정보로 자동 설정되도록 구현했습니다.

---

## 6. 게시글 삭제

게시글 삭제는 작성자만 가능하도록 구현했습니다.

삭제 요청 시 현재 로그인한 사용자와 게시글 작성자를 비교하고, 일치하는 경우 게시글에 달린 댓글을 먼저 삭제한 뒤 게시글을 삭제합니다.

---

## 7. 댓글 작성 / 삭제

게시글 상세 페이지에서 댓글을 작성할 수 있습니다.

댓글 삭제는 댓글 작성자만 가능하도록 구현했습니다.

댓글에는 다음 정보가 저장됩니다.

- 게시글 번호
- 댓글 작성자
- 댓글 내용
- 댓글 작성일

---

## 8. 좋아요 기능

사용자는 게시글에 좋아요를 누르거나 취소할 수 있습니다.

좋아요 버튼 클릭 시 서버는 현재 사용자가 해당 게시글에 좋아요를 눌렀는지 확인하고, 상태에 따라 좋아요를 추가하거나 취소합니다.

좋아요 처리 후 현재 좋아요 수를 다시 조회하여 화면에 반영합니다.

---

## 🔁 Routing Summary

| Method | Route | Description |
|---|---|---|
| GET | `/` | 메인 페이지 / 로그인 화면 |
| POST | `/` | 로그인 처리 |
| GET | `/logout` | 로그아웃 처리 |
| GET | `/register` | 회원가입 페이지 |
| POST | `/register` | 회원가입 처리 |
| POST | `/checkduplicateid` | 아이디 중복 확인 |
| GET | `/list` | 게시글 목록 기본 페이지 |
| GET | `/list/:page` | 게시글 목록 페이지네이션 |
| GET | `/read/:postid` | 게시글 상세 조회 |
| POST | `/write` | 게시글 작성 |
| POST | `/delete` | 게시글 삭제 |
| POST | `/reply` | 댓글 작성 |
| POST | `/deletereply` | 댓글 삭제 |
| POST | `/like` | 좋아요 처리 |

---

## 🧩 Key Implementation Details

### 1. Express Routing

`routes/index.js`에서 게시판의 주요 요청을 처리했습니다.

로그인, 회원가입, 게시글 조회, 게시글 작성, 댓글, 좋아요 등 기능별 라우트를 구성하여 요청 흐름을 분리했습니다.

---

### 2. Session-based Login

`express-session`을 활용하여 로그인 상태를 관리했습니다.

로그인 성공 시 세션에 사용자 ID를 저장하고, 이후 게시글 작성, 삭제, 댓글 작성, 좋아요 처리에서 현재 사용자를 확인하는 데 사용했습니다.

---

### 3. MySQL / MariaDB Connection

`database.js`에서 MySQL/MariaDB 데이터베이스 연결을 설정하고, 각 라우트에서 SQL 쿼리를 실행하여 데이터를 조회하거나 수정했습니다.

> 실제 운영 환경에서는 DB 접속 정보가 코드에 직접 포함되지 않도록 `.env` 파일과 환경변수를 사용하는 것이 안전합니다.

---

### 4. EJS Template Rendering

EJS 템플릿을 활용하여 서버에서 조회한 데이터를 HTML 화면에 렌더링했습니다.

게시글 목록, 게시글 상세 조회, 회원가입, 게시글 작성 화면 등을 EJS 파일로 구성했습니다.

---

### 5. jQuery AJAX

`express-board-ajax` 버전에서는 jQuery AJAX를 활용하여 사용자 요청을 비동기적으로 처리했습니다.

AJAX를 사용한 주요 기능은 다음과 같습니다.

- 로그인 요청
- 회원가입 요청
- 아이디 중복 확인
- 좋아요 추가 / 취소
- 게시글 삭제
- 댓글 작성
- 댓글 삭제

---

## ⚙️ Installation & Run

각 버전 폴더로 이동한 뒤 패키지를 설치하고 실행합니다.

### 1. Move to Project Folder

```bash
cd express-board-basic
```

또는

```bash
cd express-board-ajax
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Run Server

```bash
node app.js
```

서버 실행 후 브라우저에서 접속합니다.

```text
http://localhost:3000
```


---

## ✅ Implemented Features

- [x] 회원가입
- [x] 아이디 중복 확인
- [x] 로그인
- [x] 로그아웃
- [x] 세션 기반 사용자 관리
- [x] 게시글 목록 조회
- [x] 페이지네이션
- [x] 게시글 상세 조회
- [x] 조회수 증가
- [x] 게시글 작성
- [x] 게시글 삭제
- [x] 댓글 작성
- [x] 댓글 삭제
- [x] 좋아요 추가 / 취소
- [x] MySQL / MariaDB 연동
- [x] EJS 기반 화면 렌더링
- [x] jQuery AJAX 기반 비동기 처리


---

## 🧠 What I Learned

이 프로젝트를 통해 Node.js와 Express를 활용한 웹 서버 구성 방식을 학습했습니다.

게시판 기능을 구현하면서 단순히 화면을 만드는 것뿐만 아니라, 사용자 인증, 세션 관리, 데이터베이스 설계, SQL 쿼리 작성, 라우팅 처리, 비동기 요청 처리까지 웹 애플리케이션의 기본 흐름을 경험할 수 있었습니다.

또한 사용자, 게시글, 댓글, 좋아요 테이블 간의 관계를 구성하면서 DBMS에서 테이블 관계 설계가 실제 기능 구현에 어떻게 연결되는지 이해할 수 있었습니다.

---

## 📚 Keywords

- Node.js
- Express
- MySQL
- MariaDB
- EJS
- jQuery
- AJAX
- Session
- CRUD
- Board Service
- Pagination
- Like System
- Comment System
- DBMS

---