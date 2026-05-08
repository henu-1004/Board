-- user 테이블 생성
CREATE TABLE IF NOT EXISTS user (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    emaildomain VARCHAR(50) NOT NULL
);

-- board 테이블 생성
CREATE TABLE IF NOT EXISTS board (
    postid INT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    regdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viewcnt INT DEFAULT 0,
    likes INT DEFAULT 0,
    FOREIGN KEY (author) REFERENCES user(username)
);

-- reply 테이블 생성
CREATE TABLE IF NOT EXISTS reply (
    commentid INT AUTO_INCREMENT PRIMARY KEY,
    postid INT NOT NULL,
    commentwriter VARCHAR(50) NOT NULL,
    commentcontent TEXT NOT NULL,
    commentdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postid) REFERENCES board(postid),
    FOREIGN KEY (commentwriter) REFERENCES user(username)
);

-- likes 테이블 생성
CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postid INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    UNIQUE KEY unique_like (postid, username),
    FOREIGN KEY (postid) REFERENCES board(postid) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES user(username) ON DELETE CASCADE
);
