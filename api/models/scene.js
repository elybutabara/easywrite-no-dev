this.getOtherScenesByBookID = async function (db, args) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line handle-callback-err
    db.all('SELECT * FROM scenes WHERE chapter_id is null AND book_id = ? ', [args.book_id], function (err, rows) {
      console.log({ success: 1, rows: rows })
      resolve({ success: 1, rows: rows })
    })
  })
}

this.getScenesByChapterID = async function (db, args) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line handle-callback-err
    db.all('SELECT * FROM scenes WHERE chapter_id = ?', [args.chapter_id], function (err, rows) {
      console.log({ success: 1, rows: rows })
      resolve({ success: 1, rows: rows })
    })
  })
}
