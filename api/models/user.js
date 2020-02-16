this.authenticate = async function (db, args) {
  console.log('ARGS  ==> ' + args.username)
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line handle-callback-err
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [args.username, args.password], function (err, row) {
      if (typeof row !== 'undefined') {
        let response = { success: 1, user: row }

        db.get('SELECT * FROM authors WHERE user_id = ?', [row.id], function (err2, row2) {
          response.author = row2
          resolve(response)
        })
      } else {
        console.log({ success: 0, message: 'Invalid usernamd or password...' })
        resolve({ success: 0, message: 'Invalid usernamd or password...' })
      }
    })
  })
}
