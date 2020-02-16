this.getLocationsByBookID = async function (db, args) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line handle-callback-err
    db.all('SELECT * FROM locations WHERE book_id = ? ', [args.book_id], function (err, rows) {
      console.log({ success: 1, rows: rows })
      resolve({ success: 1, rows: rows })
    })
  })
}
