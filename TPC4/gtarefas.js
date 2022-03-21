var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static.js')
var {parse} = require('querystring')

// Funções auxilidares
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco =>{
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }

}

function geraIds(tarefas){
    var id = 0
    tarefas.forEach(t =>{
        x = parseInt(t.id)
        //console.log("X === "+ x)
        if (x > id){
            id = x
        }
    })
    return id + 1
}


function geraHomepage( tarefas, d ){

    var next_id = geraIds(tarefas)

    let pagHTML = `
    <html>
        <head>
            <title>Registo de Tarefas</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        
            <div class="w3-container w3-teal">
                <h2>Registo de Tarefa</h2>
            </div>

            <form class="w3-container" action="/tarefas" method="POST">
                <input type="hidden" name="id" value="${next_id}">

                <label class="w3-text-teal"><b> Autor </b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="autor">
          
                <label class="w3-text-teal"><b> Data de Registo </b></label>
                <input class="w3-input w3-border w3-light-grey" type="date" name="datareg">

                <label class="w3-text-teal"><b> Data </b></label>
                <input class="w3-input w3-border w3-light-grey" type="date" name="datafinal">

                <label class="w3-text-teal"><b> Descrição </b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="descricao">

                <label class="w3-text-teal"><b> Tipo de tarefa </b></label>
                <select class="w3-select w3-border w3-light-grey" name="tipo">
                    <option value="" disabled selected> Escolha o tipo </option>
                    <option value="Emprego"> Emprego </option>
                    <option value="Pessoal"> Pessoal </option>
                    <option value="Casa"> Casa </option>
                    <option value="Familia"> Familia </option>
                </select>
                
                <input type="hidden" name="estado" value = "por fazer">
          
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar"/> 
            </form>`

            pagHTML += `
            <div class="dividetabelas">
            <div class="split left">
            <div class="centered">
            <h3><b>Tarefas por fazer: </b></h3>
            <table class="w3-table w3-bordered">
                <tr class="w3-red">
                    <th>Autor</th>
                    <th>Data de registo</th>
                    <th>Data Limite</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Editar</th>
                </tr>
                `
    tarefas.forEach(t => {
        if(t.estado != "concluido"){
            console.log("VOU POR === "+ t.id)
            console.log("INFO === "+ t.estado)
            pagHTML += `
            <tr>
                <td>${t.autor}</td>
                <td>${t.datareg}</td>
                <td>${t.datafinal}</td>
                <td>${t.descricao}</td>
                <td>${t.tipo}</td>
                <td>${t.estado}</td>
                <td> <a href="/tarefas/${t.id}/editar/"> Editar </a> </td>
            </tr>`
        }
        else{
            console.log("NAO VOU POR === "+ t.id)
        }
    });
    pagHTML += `</table>
    </div> 
    </div>`

    


    pagHTML += `
            <div class="split right">
            <div class="centered">
            <h3><b>Tarefas concluidas:</b></h3>
            <table class="w3-table w3-bordered">
                <tr class="w3-green">
                    <th>Autor</th>
                    <th>Data de registo</th>
                    <th>Data Limite</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Apagar</th>
                </tr>
                `
    tarefas.forEach(t => {
        if(t.estado == "concluido"){
            pagHTML += `
            <tr>
                <td>${t.autor}</td>
                <td>${t.datareg}</td>
                <td>${t.datafinal}</td>
                <td>${t.descricao}</td>
                <td>${t.tipo}</td>
                <td>${t.estado}</td>
                <td> <a href="/tarefas/${t.id}/apagar/"> Apagar </a> </td>
            </tr>`
        }
    });
    pagHTML += `</table>
    </div> 
    </div>
    </div>`


   pagHTML +=`       <footer class="w3-container w3-teal">
                <address>Gerado por AROM :: RPCW2020 em ${d}</address>
            </footer>
        </body>
    </html>
    `
    return pagHTML
}


function geraPostConfirm( tarefa, d ){
    return `
    <html>
        <head>
            <title> POST receipt tarefa com id=${tarefa.id}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        <div class="w3-card-4">
                <header class="w3-container w3-teal">
                    <h1> Tarefa com id=${tarefa.id} inserida com sucesso!</h1>
                </header>

            <div class="w3-container">
                <p><a href="/"> [HOME]</a></p>
            </div>
            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::RPCW2022 em ${d}</address>
            </footer>
        </body>
    </html>
    `
}


function geraPagEdit(tarefa, d){
    var pagHTML = `
    <html>
        <head>
            <title> Editar tarefa com id=${tarefa.id}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        <div class="w3-card-4">
                <header class="w3-container w3-teal">
                    <h1> Editar tarefa com id=${tarefa.id} </h1>
                </header>

            <div class="w3-container">
            <form class="w3-container" action="/tarefas/editar" method="POST">
            <input type="hidden" name="id" value="${tarefa.id}">

            <label class="w3-text-teal"><b> Autor </b></label>
            <input class="w3-input w3-border w3-light-grey" type="text" name="autor" value="${tarefa.autor}">
      
            <label class="w3-text-teal"><b> Data de Registo </b></label>
            <input class="w3-input w3-border w3-light-grey" type="date" name="datareg" value="${tarefa.datareg}">

            <label class="w3-text-teal"><b> Data </b></label>
            <input class="w3-input w3-border w3-light-grey" type="date" name="datafinal" value="${tarefa.datafinal}">

            <label class="w3-text-teal"><b> Descrição </b></label>
            <input class="w3-input w3-border w3-light-grey" type="text" name="descricao" value="${tarefa.descricao}">

            <label class="w3-text-teal"><b> Tipo de tarefa </b></label>
            <select class="w3-select w3-border w3-light-grey" name="tipo" value="${tarefa.tipo}">
                <option value="Emprego"> Emprego </option>
                <option value="Pessoal"> Pessoal </option>
                <option value="Casa"> Casa </option>
                <option value="Familia"> Familia </option>
            </select>
            
            <br>
            <label class="w3-text-teal"><b> Estado </b></label> <br>
            <input class="w3-radio" type="radio" name="estado" value="por fazer" checked>
            <label>Por fazer</label>

            <input class="w3-radio" type="radio" name="estado" value="concluido">
            <label>Concluido</label>
            <br>
            <br>
            <input class="w3-btn w3-blue-grey" type="submit" value="Submeter edição"/>
            <input class="w3-btn w3-blue-grey" type="reset" value="Limpar"/> 
            <a href="/" class="w3-button w3-blue-grey"> [Cancelar] </a>
        </form>
            </div>
            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::RPCW2022 em ${d}</address>
            </footer>
        </body>
    </html>`
    return pagHTML
}

function geraPagDelete(tarefa, d){
    var pagHTML = `
    <html>
        <head>
            <title> Apagar tarefa com id=${tarefa.id}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        <div class="w3-card-4">
                <header class="w3-container w3-teal">
                    <h1> Apagar tarefa com id=${tarefa.id} </h1>
                </header>

            <div class="w3-container">
            <form class="w3-container" action="/tarefas/apagar" method="POST">
            <input type="hidden" name="id" value="${tarefa.id}">
            <input class="w3-btn w3-blue-grey" type="submit" value="Apagar Tarefa"/>
            <a href="/" class="w3-button w3-black"> [Cancelar] </a>
        </form>
            </div>
            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::RPCW2022 em ${d}</address>
            </footer>
        </body>
    </html>`
    return pagHTML
}


function geraPutConfirm( tarefa, d ){
    return `
    <html>
        <head>
            <title> PUT receipt tarefa com id=${tarefa.id}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        <div class="w3-card-4">
                <header class="w3-container w3-teal">
                    <h1> Tarefa com id=${tarefa.id} editada com sucesso!</h1>
                </header>

            <div class="w3-container">
                <p><a href="/"> [HOME]</a></p>
            </div>
            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::RPCW2022 em ${d}</address>
            </footer>
        </body>
    </html>
    `
}

function geraDeleteConfirm( tarefa, d ){
    return `
    <html>
        <head>
            <title> DELETE receipt</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        <div class="w3-card-4">
                <header class="w3-container w3-teal">
                    <h1> Tarefa eliminda com sucesso!</h1>
                </header>

            <div class="w3-container">
                <p><a href="/"> [HOME]</a></p>
            </div>
            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::RPCW2022 em ${d}</address>
            </footer>
        </body>
    </html>
    `
}

// Criação do servidor

var Server = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)
    var tarefas;
    // Tratamento do pedido
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /tarefas
                if((req.url == "/") || (req.url == "/tarefas")){
                    axios.get("http://localhost:3000/tarefas")
                        .then(response => {
                            tarefas = response.data
                            // Add code to render page with the student's list
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraHomepage(tarefas, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de tarefas..."+ erro)
                            res.end()
                        })
                }
                else if(/\/tarefas\/[0-9]+\/editar/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                    console.log("idTarefa =====" + idTarefa)
                    axios.get("http://localhost:3000/tarefas?id=" + idTarefa)
                        .then( response => {
                            var a = response.data
                            
                            // Add code to render page with the student record
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(g = geraPagEdit(a[0], d))
                            res.end()
                        })
                        .catch(function(erro){
                            console.log("DEU MERDA 1")
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível efectua a edição..."+ erro)
                            res.end()
                        })
                }
                else if(/\/tarefas\/[0-9]+\/apagar/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                    axios.get("http://localhost:3000/tarefas?id=" + idTarefa)
                        .then( response => {
                            var a = response.data
                            
                            // Add code to render page with the student record
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagDelete(a[0], d))
                            res.end()
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break

            case "POST":
                if(req.url == '/tarefas'){
                    recuperaInfo(req, resultado =>{
                        console.log('POST de Tarefa:' + JSON.stringify(resultado))
                        axios.post("http://localhost:3000/tarefas",  resultado)
                        .then( resp => {
                            
                            // Add code to render page with the student record
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPostConfirm(resp.data, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.end()
                        })
                    })
                }
                else if(req.url == '/tarefas/editar'){
                    recuperaInfo(req, resultado =>{
                        console.log('PUT de Tarefa:' + JSON.stringify(resultado))
                        axios.put("http://localhost:3000/tarefas/"+resultado.id,  resultado)
                        .then( resp => {
                            
                            // Add code to render page with the student record
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPutConfirm(resp.data, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.end()
                        })
                    })
                }
                else if(req.url == '/tarefas/apagar'){
                    recuperaInfo(req, resultado =>{
                        console.log('DELETE de Tarefa:' + JSON.stringify(resultado))
                        axios.delete("http://localhost:3000/tarefas/"+resultado.id,  resultado)
                        .then( resp => {
                            
                            // Add code to render page with the student record
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraDeleteConfirm(resp.data, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.end()
                        })
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    // Replace this code with a POST request to the API server
                    res.write('<p>Recebi um POST não suportado</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()

                }
                break

            case "PUT": ///  NAO ESTA A FUNCIONAR (não percebi porque)
                    if(req.url == '/tarefas/editar'){
                        recuperaInfo(req, resultado =>{
                            console.log('PUT de Tarefa:' + JSON.stringify(resultado))
                            axios.put("http://localhost:3000/tarefas/"+resultado.id,  resultado)
                            .then( resp => {
                                
                                // Add code to render page with the student record
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraPutConfirm(resp.data, d))
                                res.end()
                            })
                            .catch(function(erro){
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.end()
                            })
                        })
                    }
                    else{
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        // Replace this code with a POST request to the API server
                        res.write('<p>Recebi um POST não suportado</p>')
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
    
                    }
                    break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
})

Server.listen(7777)
console.log('Servidor à escuta na porta 7777...')