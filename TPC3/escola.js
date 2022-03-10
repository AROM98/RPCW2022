const http = require('http');
var url = require('url');
const axios = require('axios');
const { isFloat64Array } = require('util/types');


function generateMainPage()
{   
    page = "<h1 style=\"text-align: center\";> Escola de Música </h1>"
    page += "<body style=\"text-align: center\";> <p> hyperlinks para as seguintes páginas: </p>"
    page += "<lu>"
    page += "<li> <a href=\"http://localhost:4000/alunos\"> Alunos </a> </li>"
    page += "<li> <a href=\"http://localhost:4000/cursos\"> Cursos </a> </li>"
    page += "<li> <a href=\"http://localhost:4000/instrumentos\"> Instrumentos </a> </li>"
    page += "</lu> </body>"
    return page
}
// <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">

myserver = http.createServer(function(req, res) {
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)
    var myurl = url.parse(req.url, true).pathname
    if(myurl == "/"){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8;' });
        res.write("<link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\">")
        res.write(generateMainPage())
        res.end()
    }
    else if(myurl== "/alunos"){
        axios.get('http://localhost:3000/alunos')
            .then(function (resp) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write("<link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\">");
                page = "<body> <h1 style=\"text-align: center\"> Alunos </h1> <table class=\"w3-table-all\">"
                page += "<tr class=\"w3-green\">"
                page += "<th> Id </th>"
                page += "<th> Nome </th>"
                page += "<th> Curso </th>"
                page += "<th> Instrumento </th>"
                page += "</tr>"
                alunos = resp.data;
                alunos.forEach(a => {
                    //console.log(p.id+" :: "+ p.nome+" :: "+p.instrumento);
                    page += "<tr>"
                    page += "<th> "+ a.id+" </th>"
                    page += "<th> "+ a.nome+" </th>"
                    page += "<th> "+ a.curso+" </th>"
                    page += "<th> "+ a.instrumento+" </th>"
                    page += "</tr>"
                });
                page += "</lu>"
                page += "<a style=\"color: red; text-align: center\"; href=\"http://localhost:4000\"> voltar </a>"
                page += "</body>"
                res.write(page)
                res.end()
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    else if(myurl== "/cursos"){
        axios.get('http://localhost:3000/cursos')
            .then(function (resp) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write("<link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\">");
                page = "<body> <h1 style=\"text-align: center\"> Cursos </h1> <table class=\"w3-table-all\">"
                page += "<tr class=\"w3-green\">"
                page += "<th class=\"w3-center\"> Id </th>"
                page += "<th class=\"w3-center\"> Designação </th>"
                page += "</tr>"
                cursos= resp.data;
                cursos.forEach(c => {
                    //console.log(p.id+" :: "+ p.nome+" :: "+p.instrumento);
                    page += "<tr>"
                    page += "<th class=\"w3-center\"> "+ c.id+" </th>"
                    page += "<th class=\"w3-center\"> "+ c.designacao+" </th>"
                    page += "</tr>"
                });
                page += "</lu>"
                page += "<a style=\"color: red; text-align: center\"; href=\"http://localhost:4000\"> voltar </a>"
                page += "</body>"
                res.write(page)
                res.end()
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    else if(myurl== "/instrumentos"){
        axios.get('http://localhost:3000/instrumentos')
            .then(function (resp) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write("<link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\">");
                page = "<body> <h1 style=\"text-align: center\"> Instrumentos </h1> <table class=\"w3-table-all\">"
                page += "<tr class=\"w3-green\">"
                page += "<th class=\"w3-center\"> Id </th>"
                page += "<th class=\"w3-center\"> Designação </th>"
                page += "</tr>"
                instrumentos = resp.data;
                instrumentos.forEach(i => {
                    //console.log(p.id+" :: "+ p.nome+" :: "+p.instrumento);
                    page += "<tr>"
                    page += "<th class=\"w3-center\"> "+ i.id+" </th>"
                    page += "<th class=\"w3-center\"> "+ i.text+" </th>"
                    page += "</tr>"
                });
                page += "</lu>"
                page += "<a style=\"color: red; text-align: center\"; href=\"http://localhost:4000\"> voltar </a>"
                page += "</body>"
                res.write(page)
                res.end()
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end("<p> Rota não suportada:" + req.url + "</p>")
    }
})

myserver.listen(4000)

console.log('Servidor á escuta na porta 4000')