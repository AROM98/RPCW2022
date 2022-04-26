var express = require('express');
var router = express.Router();
var Para = require("../controllers/para")

/* GET home page. */
router.get('/paras', function(req, res, next) {
  Para.listar()
    .then(dados =>{
      console.log("bd_dados: ", dados)
      res.status(200).jsonp(dados)
    })
    .catch(e =>{
      res.status(500).jsonp({erro : e})
    })
   console.log("carreguei os dados da bd ?") 
});


router.post('/paras', function(req, res, next) {
  Para.inserir(req.body)
    .then(dados =>{
      res.status(201).jsonp(dados)
      console.log("dados: ", dados)
    })
    .catch(e =>{
      res.status(501).jsonp({erro : e})
      console.log("erro: ", e)
    })
});


router.get('/paras/:id', function(req, res, next) {
  Para.apagar(req.params.id)
    .then(dados =>{
      res.status(202)
      console.log("apaguei: ", dados)
    })
    .catch(e =>{
      res.status(502).jsonp({erro : e})
      console.log("erro: ", e)
    })
});

module.exports = router;
