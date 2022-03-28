var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Músicas' });
});

router.get('/musicas', function(req, res, next) {
  axios.get("http://localhost:3000/musicas")
    .then(response => {
        var lista = response.data
        res.render('musicas', {musicas : lista});
    })
    .catch(function(erro){
        res.render('error', {error : erro});
    })
});

router.get('/musicas/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas?id=" + req.params.id)
    .then(response => {
        var dados = response.data[0]
        console.log(dados)
        res.render('musica', {musica : dados});
    })
    .catch(function(erro){
        res.render('error', {error : erro});
    })
});

router.get('/musicas/prov/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas?prov=" + req.params.id)
    .then(response => {
        var dados = response.data
        console.log(dados)
        res.render('provincia', {musicas : dados, provincia : req.params.id});
    })
    .catch(function(erro){
        res.render('error', {error : erro});
    })
});

module.exports = router;
