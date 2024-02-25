const http = require("http");
const fs = require("fs")
const path = require("path")

const requestListener = function (request, response){

    let leerHTML = "";

    //dependiendo de la URL mostramos los htmls existentes
    switch(request.url.toLowerCase()){
        //si accedemos directamente a localhost mostramos index
        case "/":
            leerHTML = "/index.html"
            break;
        //ignoramos favicon
        case "/favicon.ico":
            response.writeHead(200);
            response.end();
            break;
        //y ahora si, indicamos el HTML la ruta de acceso a esta web
        default:
            leerHTML = request.url
            break;
    }
    
    //si hay contenido...
    if(leerHTML.length>0){

        // partimos de la base de que se va a cargar un HTML
        let content = "text/html";

        //de lo contrario indicamos el contentType
        switch(path.extname(leerHTML)){
            case ".png":
                content = "image/png";
                break;
            case ".css":
                content = "text/css";
                break;
        }
        
        //se prubea a leer el archivo al que se accede desde URL
        fs.readFile("."+leerHTML, function (err, data) {
            //si no se puede porque no existe u otros, se genera error
            if (err) {
                response.writeHead(500);
                response.end();
                return;
            }
    
            //si existe, se carga con el header con el contentype indicado y leemos el contenido del archivo
            response.setHeader("Content-Type", content);
            response.writeHead(200);
            response.write(data);
            response.end();
        });
    }
   
};

const server = http.createServer(requestListener);
server.listen(80);
