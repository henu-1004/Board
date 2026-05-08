const express = require('express');
const router = express.Router();
const connection = require('../database');

// 메인 페이지 및 로그인 화면
router.get('/', (req, res) => {
  if (req.session.username) {
    res.render('index', { title: '환영합니다', username: req.session.username });
  } else {
    res.render('index', { title: '로그인' });
  }
});

// 로그인 처리
router.post('/', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM user WHERE username = ? AND password = ?`;
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('database error:', err);
      return res.status(500).json({ success: false, message: 'database error' });
    }

    if (results.length > 0) {
      req.session.username = username; // 세션에 사용자 ID 저장
      console.log("로그인 성공");
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: '로그인 실패' });
    }
  });
});

// 로그아웃 처리
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: '로그아웃 실패' });
    }
    return res.status(200).json({ success: true });
  });
});

// 회원가입 페이지 이동
router.get('/register', (req, res) => {
  res.render('register', { title: '회원가입' });
});

// 아이디 중복 확인 처리
router.post('/checkduplicateid', (req, res) => {
  const { username } = req.body;

  const query = "SELECT COUNT(*) AS count FROM user WHERE username = ?";
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('아이디 중복 확인 오류:', err);
      return res.status(500).json({ isduplicate: false, error: 'database error' });
    }

    const isduplicate = results[0].count > 0;
    res.json({ isduplicate });
  });
});

// 회원가입 처리
router.post('/register', (req, res) => {
  const { username, password, passwordconfirm, name, email, emaildomain } = req.body;

  if (!username || !password || !name || !email || !emaildomain) {
    console.log("모든 필드를 입력해주세요.");
    return res.status(400).render('register', { title: '회원가입', error: '모든 필드를 입력해주세요.' });
  }

  if (password !== passwordconfirm) {
    console.log("비밀번호가 일치하지 않습니다.");
    return res.status(400).render('register', { title: '회원가입', error: '비밀번호가 일치하지 않습니다.' });
  }

  const query = "INSERT INTO user (username, password, name, email, emaildomain) VALUES (?, ?, ?, ?, ?)";
  connection.query(query, [username, password, name, email, emaildomain], (err) => {
    if (err) {
      console.error('회원가입 오류:', err);
      return res.status(500).render('register', { title: '회원가입', error: '회원가입 오류' });
    }
    console.log("회원가입 성공");
    return res.render('index', { title: '회원가입 완료', message: '회원가입이 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.' });
  });
});





// 게시글 목록 조회
router.get('/list', (req, res) => {
  res.redirect('/list/1?limit=5'); // 기본적으로 5개 단위로 설정
});

router.get('/list/:page', (req, res) => {
  const page = req.params.page;
  const limit = parseInt(req.query.limit) || 5; // 페이지당 게시글 수, 기본값 5
  const offset = (page - 1) * limit;

  const sql = "SELECT postid, author, title, regdate, viewcnt, likes FROM board ORDER BY postid DESC LIMIT ?, ?";
  connection.query(sql, [offset, limit], (err, rows) => {
    if (err) {
      console.log("쿼리 실행 오류:", err);
      return res.status(500).send('게시글 목록 조회 오류');
    }

    // 총 게시글 수 조회
    const countsql = "SELECT COUNT(*) AS count FROM board";
    connection.query(countsql, (counterr, countresult) => {
      if (counterr) {
        console.log("게시글 수 조회 오류:", counterr);
        return res.status(500).send('게시글 수 조회 오류');
      }

      const totalposts = countresult[0].count;
      const totalpages = Math.ceil(totalposts / limit);

      res.render('index', { 
        title: '전체 글 조회', 
        rows: rows, 
        currentpage: parseInt(page), 
        totalpages: totalpages, 
        limit: limit, // 현재 페이지당 게시글 수
        username: req.session.username 
      });
    });
  });
});

// 게시글 상세 조회
router.get('/read/:postid', (req, res) => {
  const postid = req.params.postid;

  // 조회수 증가 쿼리
  const updateviewcountsql = "UPDATE board SET viewcnt = viewcnt + 1 WHERE postid = ?";
  connection.query(updateviewcountsql, [postid], (updateerr) => {
    if (updateerr) {
      console.log("조회수 업데이트 오류:", updateerr);
    }

    // 게시글 조회 쿼리
    const sql = "SELECT * FROM board WHERE postid=?";
    connection.query(sql, [postid], (err, row) => {
      if (err) {
        console.log("쿼리 실행 오류:", err);
        return res.status(500).json({ success: false, message: '게시글 조회 오류' });
      }

      const replysql = "SELECT * FROM reply WHERE postid=?";
      connection.query(replysql, [postid], (replyerr, replies) => {
        if (replyerr) {
          console.log("댓글 조회 오류:", replyerr);
          return res.status(500).json({ success: false, message: '댓글 조회 오류' });
        }

        // 좋아요 여부 확인
        const checkLikeSql = "SELECT * FROM likes WHERE postid = ? AND username = ?";
        connection.query(checkLikeSql, [postid, req.session.username], (likeErr, likeResults) => {
          if (likeErr) {
            console.error('좋아요 확인 오류:', likeErr);
            return res.status(500).json({ success: false, message: '좋아요 확인 오류' });
          }

          const liked = likeResults.length > 0;
          res.render('read', { title: '게시 글 상세 조회', row: row[0], replies: replies, username: req.session.username, liked: liked });
        });
      });
    });
  });
});

// 댓글 작성 처리
router.post('/reply', (req, res) => {
  const { postid, commentwriter, commentcontent } = req.body;
  const sql = "INSERT INTO reply (postid, commentwriter, commentcontent, commentdate) VALUES (?, ?, ?, NOW())";
  connection.query(sql, [postid, commentwriter, commentcontent], (err) => {
    if (err) {
      console.log("댓글 작성 오류:", err);
      return res.status(500).json({ success: false, message: '댓글 작성 오류' });
    }
    res.redirect('/read/' + postid);
  });
});

// 글쓰기 페이지 이동
router.get('/write', (req, res) => {
  res.render('write', { title: '게시 글 작성', username: req.session.username });
});

// 글쓰기
router.post('/write', (req, res) => {
  const { title, author, body } = req.body;
  const sql = "INSERT INTO board (author, title, body, regdate) VALUES (?, ?, ?, NOW())";
  connection.query(sql, [author, title, body], (err) => {
    if (err) {
      console.log("쿼리 실행 오류:", err);
      return res.status(500).json({ success: false, message: '게시물 작성 오류' });
    }
    res.redirect('/list');
  });
});

// 게시글 삭제
router.post('/delete', (req, res) => {
  const postid = req.body.postid;
  const username = req.session.username;

  const checkauthorsql = "SELECT author FROM board WHERE postid=?";
  connection.query(checkauthorsql, [postid], (err, rows) => {
    if (err) {
      console.log("작성자 확인 오류:", err);
      return res.status(500).json({ success: false, message: '작성자 확인 오류' });
    }

    if (rows.length > 0 && rows[0].author === username) {
      connection.query("DELETE FROM reply WHERE postid=?", [parseInt(postid)], (err) => {
        if (err) {
          console.log("댓글 삭제 오류:", err);
          return res.status(500).json({ success: false, message: '댓글 삭제 오류' });
        }

        connection.query("DELETE FROM board WHERE postid=?", [parseInt(postid)], (err) => {
          if (err) {
            console.log("게시물 삭제 오류:", err);
            return res.status(500).json({ success: false, message: '게시물 삭제 오류' });
          }
          res.status(200).json({ success: true });
        });
      });
    } else {
      res.status(403).json({ success: false, message: '작성자만 삭제할 수 있습니다.' });
    }
  });
});

// 댓글 삭제
router.post('/deletereply', (req, res) => {
  const commentid = req.body.commentid;
  const username = req.session.username;

  const checkauthorsql = "SELECT commentwriter, postid FROM reply WHERE commentid=?";
  connection.query(checkauthorsql, [commentid], (err, rows) => {
    if (err) {
      console.log("작성자 확인 오류:", err);
      return res.status(500).json({ success: false, message: '작성자 확인 오류' });
    }

    if (rows.length > 0 && rows[0].commentwriter === username) {
      connection.query("DELETE FROM reply WHERE commentid=?", [commentid], (err) => {
        if (err) {
          console.log("댓글 삭제 오류:", err);
          return res.status(500).json({ success: false, message: '댓글 삭제 오류' });
        }
        res.status(200).json({ success: true });
      });
    } else {
      res.status(403).json({ success: false, message: '작성자만 삭제할 수 있습니다.' });
    }
  });
});

// 좋아요 처리
router.post('/like', (req, res) => {
  const postid = req.body.postid;
  const username = req.session.username;

  // 먼저 해당 사용자가 이 게시글을 좋아요 했는지 확인
  const checkLikeSql = "SELECT * FROM likes WHERE postid = ? AND username = ?";
  connection.query(checkLikeSql, [postid, username], (err, results) => {
    if (err) {
      console.error('좋아요 확인 오류:', err);
      return res.status(500).json({ success: false, message: '좋아요 확인 오류' });
    }

    if (results.length > 0) {
      // 이미 좋아요를 한 경우, 좋아요 취소
      const deleteLikeSql = "DELETE FROM likes WHERE postid = ? AND username = ?";
      connection.query(deleteLikeSql, [postid, username], (err) => {
        if (err) {
          console.error('좋아요 취소 오류:', err);
          return res.status(500).json({ success: false, message: '좋아요 취소 오류' });
        }

        // 좋아요 수 감소 처리
        const updateLikesSql = "UPDATE board SET likes = likes - 1 WHERE postid = ?";
        connection.query(updateLikesSql, [postid], (updateErr) => {
          if (updateErr) {
            console.error('좋아요 수 감소 오류:', updateErr);
            return res.status(500).json({ success: false, message: '좋아요 수 감소 오류' });
          }
          
          // 새로운 좋아요 수 가져오기
          const getLikesSql = "SELECT likes FROM board WHERE postid = ?";
          connection.query(getLikesSql, [postid], (getErr, getResults) => {
            if (getErr) {
              console.error('좋아요 수 가져오기 오류:', getErr);
              return res.status(500).json({ success: false, message: '좋아요 수 가져오기 오류' });
            }
            res.status(200).json({ success: true, liked: false, likes: getResults[0].likes });
          });
        });
      });
    } else {
      // 좋아요를 누르지 않은 경우, 좋아요 등록
      const insertLikeSql = "INSERT INTO likes (postid, username) VALUES (?, ?)";
      connection.query(insertLikeSql, [postid, username], (err) => {
        if (err) {
          console.error('좋아요 등록 오류:', err);
          return res.status(500).json({ success: false, message: '좋아요 등록 오류' });
        }

        // 좋아요 수 증가 처리
        const updateLikesSql = "UPDATE board SET likes = likes + 1 WHERE postid = ?";
        connection.query(updateLikesSql, [postid], (updateErr) => {
          if (updateErr) {
            console.error('좋아요 수 증가 오류:', updateErr);
            return res.status(500).json({ success: false, message: '좋아요 수 증가 오류' });
          }

          // 새로운 좋아요 수 가져오기
          const getLikesSql = "SELECT likes FROM board WHERE postid = ?";
          connection.query(getLikesSql, [postid], (getErr, getResults) => {
            if (getErr) {
              console.error('좋아요 수 가져오기 오류:', getErr);
              return res.status(500).json({ success: false, message: '좋아요 수 가져오기 오류' });
            }
            res.status(200).json({ success: true, liked: true, likes: getResults[0].likes });
          });
        });
      });
    }
  });
});

module.exports = router;


