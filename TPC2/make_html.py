#! python3
import json

## 1. tenho que ler o ficheiro json
f = open('cinemaATP.json')
data = json.load(f)

# ordenar por ordem alfabetica
data.sort(key = lambda x:x["title"])

#print(data)
#f.close()

## 2. criar index.html com todos os titulos dos filmes for ordem alfabetica

film_count = 1

ind = open("/Users/andre/Desktop/RPCW/RPCW2022/TPC2/htmlpages/index.html","w")
print("coisas")

ind.write("<html>\n \
    <head>\n \
        <meta charset="+"UTF-8"+">\n \
    </head>\n \
    <body>\n \
        <h1>Filmes</h1>\n \
        <lu>\n")

for filme in data:
    ind.write("<li> <a href=\"http://localhost:7777/filmes/f"+str(film_count)+"\"> "+filme['title']+"</a></li>\n")
    ## 3. criar pagina html para cada um dos filmes
    name_file = "/Users/andre/Desktop/RPCW/RPCW2022/TPC2/htmlpages/f"+str(film_count)+".html"
    f2 = open(name_file, "w")
    f2.write("<html>\n \
    <head>\n \
        <meta charset="+"UTF-8"+">\n \
    </head>\n \
    <body>\n \
        <h1>"+ str(filme['title'])+"</h1>\n \
        <p> Year: "+ str(filme['year'])+"</p>\n \
        <p> Cast: "+ str(filme['cast'])+"</p>\n \
        <p> Genres: "+ str(filme['genres'])+"</p>\n \
        <a style=\"color: red;\" href=\"http://localhost:7777/filmes\"> voltar </a>\n \
    </body>\n \
</html>\n")
    f2.close()
    film_count += 1

ind.write("</lu>\n \
    </body>\n \
</html>\n")



