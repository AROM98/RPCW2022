var express = require('express');
var router = express.Router();
const axios = require('axios');

token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGNiYTg0OWJhYmI2NjdjYmZkYzE2ZSIsImlhdCI6MTY0OTE5NTY1MiwiZXhwIjoxNjUxNzg3NjUyfQ.EuvH713Qr6IZ073-5FMF6j5p_3tb6Trv0TOOF5ZHWOPUlCBqKU1H9DTo_ueoCyWhPbEd6F8xzNvn-UkG3J8Ppq65xF8uukoElnSIsi3kldXI2E_EHMv5ETIq-2SGpiBmLyv1zu2broi-nXw18XwKM-WWpoumw5mZacg1qyj4kokGm--WzPIDD15Uibu2ObsDfeHpbDt81Npq-WgEVe56F5w0TdAvY_b-Xvm77hXI4MuaatL9bsOtYEyiepLuBelDyVWjAIoon3-7tB1lwrPnC0OJ_cxKUyCdqx8sZPkmciyTmBsV8fDTyvTP1ibiryAQsDRK5TrG83CcWmStZyDnoQ";


async function getClavData(url){
  return axios.get(url)
      .then(response => {
        //console.log(res.data)
        return response.data
      })
      .catch(error => {
        console.log(error);
      }); 
}


/* GET home page. */
router.get('/', function(req, res, next) {
  url = "http://clav-api.di.uminho.pt/v2/classes?nivel=1&apikey=" + token
  getClavData(url).then(data =>{
    //console.log(data)
    //res.status(200).jsonp(data)
    res.render('index', { title: 'CLAV', entradas: data});
  })    
});

router.get('/classes/:id', function(req, res, next) {
  console.log("ID == ", req.params.id)
  url = "http://clav-api.di.uminho.pt/v2/classes/"+req.params.id+"?apikey=" + token
  getClavData(url).then(data =>{
    //console.log(data.filhos[0].codigo)
    filhos = []
    proceRelacion = []
    for (filho in data.filhos){
      code = data.filhos[filho].codigo
      //console.log("CODIGO == ", code)
      filhos_str = JSON.stringify(data.filhos[filho])
      tmp = {
        codigo : code,
        dados : filhos_str
      }
      filhos.push(tmp)
    }
    //console.log("FILHOS == ", filhos)
    for (procc in data.processosRelacionados){
      //console.log("####################")
      tipos = ["eCruzadoCom", "eComplementarDe", "eSuplementoDe", "eSuplementoPara"]
      data.processosRelacionados[procc].idRel 
      if(tipos.includes(data.processosRelacionados[procc].idRel)){
        code = data.processosRelacionados[procc].codigo
        relacoes = JSON.stringify(data.processosRelacionados[procc])
        console.log(data.processosRelacionados[procc])
        tmp = {
          codigo : code,
          dados : relacoes
        }
        proceRelacion.push(tmp)
      }
      //console.log("RELALOES == ", proceRelacion)
      //proceRelacion.push(JSON.stringify(data.processosRelacionados[procc]))
    }
    //res.status(200).jsonp(data)
    res.render('classe', { title: 'CLAV', entrada: data, f: filhos, pro: proceRelacion});
  })    
});

module.exports = router;
