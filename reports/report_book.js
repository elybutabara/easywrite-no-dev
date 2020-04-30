const officegen = require('officegen')
const fs = require('fs')

function GenerateDoc (data, filepath) {
  let docx = officegen('docx')

  docx.on('finalize', function (written) {
    console.log(
      'Finish to create a Microsoft Word document.'
    )
  })

  docx.on('error', function (err) {
    console.log(err)
  })

  let pObj = docx.createP()

  pObj.addText(data)

  pObj = docx.createP()

  let out = fs.createWriteStream(filepath)

  out.on('error', function (err) {
    console.log(err)
  })

  docx.generate(out)
}

exports.getContent = (filepath, data) => {
  GenerateDoc(data, filepath)
}