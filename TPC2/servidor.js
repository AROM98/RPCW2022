var http = require('http');
var url = require('url');
var fs = require('fs');

myserver = http.createServer(function(req, res){
    console.log(req.method + " " + req.url)
    var myurl = req.url.substring(1)
    if(myurl.length > 7){
        myurl = req.url.substring(8)
        console.log("myurl = " + myurl)
    }
    else{
        myurl = 'index'
    }
    fs.readFile('/Users/andre/Desktop/RPCW/RPCW2022/TPC2/htmlpages/'+myurl+'.html', function(err, data){// readFile assincrono
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        if(err){
            res.write("<p> Erro na leitura de ficheiro...</p>")
        }
        else{
            res.write(data)
        }
        res.end()
    })
})

myserver.listen(7777)

console.log('Servidor á escuta na porta 7777')

/*O servidor vai ser basicamente isto, falta adaptar depois de concluir as paginas html*/