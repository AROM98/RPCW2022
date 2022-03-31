var express = require('express');
var logger = require('morgan');
var templates = require('./html-template')
var jsonfile = require('jsonfile')
var fs = require('fs')
const open = require('open');


var multer = require('multer')
var upload = multer({dest : 'uploads'})

var app = express();

app.use(logger('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended : false}))

app.get('*', (req, res, next) => {
  console.log('Recebi um GET')
  next()
})

app.get('/', (req, res) => {
  var d = new Date().toISOString().substring(0,16)
  var files = jsonfile.readFileSync('./dbFiles.json')
  //console.log(files)
  res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
  res.write(templates.fileList(files, d))
  res.end()
})


app.post('/files/upload', upload.single('myFile'), (req, res) => {
  let oldPath = __dirname + '/' + req.file.path
  let newPath = __dirname + '/fileStore/' + req.file.originalname

  fs.rename(oldPath, newPath, erro => {
    if(erro) throw erro
  })

  var d = new Date().toISOString().substring(0,16)
  var files = jsonfile.readFileSync('./dbFiles.json')

  files.push({
    date : d,
    name : req.file.originalname,
    mimetype : req.file.mimetype,
    size : req.file.size
  })

  jsonfile.writeFileSync('./dbFiles.json', files)

  res.redirect('/')
})

app.post('/files/download', upload.single('myFile'), (req, res) => {
  console.log("ENTREI NO download")
  var filename = req.body.myFile
  console.log("req ==", req.body.myFile)

  // só abre no safari
  open('./fileStore/' + filename, {app: {name: 'safari'}})

  res.redirect('/')
})


app.post('/files/delete', upload.single('myFile'), (req, res) => {
  console.log("ENTREI NO DELETE")
  var filename= req.body.myFile
  console.log("req ==", req.body.myFile)
  //console.log("res ==", res)
  

  // HARD DELETE
  fs.unlinkSync('./fileStore/' + filename);

  /* SOFT DELETE
  let oldPath = __dirname + '/fileStore/' + filename
  let newPath = __dirname + '/toDelete/' + filename

  fs.rename(oldPath, newPath, erro => {
    if(erro) throw erro
  })
  */

  var d = new Date().toISOString().substring(0,16)
  var files = jsonfile.readFileSync('./dbFiles.json')

  for (var i = 0; i < files.length; i++){
    if(files[i].name == filename){
      files.splice(i, 1)
    }
  }

  jsonfile.writeFileSync('./dbFiles.json', files)

  res.redirect('/')
})



app.listen(3000, () => console.log("Servidor à escuta na porta 3000 ..."))

module.exports = app;
