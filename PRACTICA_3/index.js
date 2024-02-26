const express = require("express");
const { request } = require("http");
const mongoose = require("mongoose");
const url = require("url")

mongoose.connect('mongodb://localhost:27017/biblioteca');

let libroSchema = new mongoose.Schema({
    titulo: String,
    autor: [String],
    ejemplares: Number
}, {
    versionKey: false 
});
    
let Libro = mongoose.model('libros', libroSchema)

let app = express();
app.use(express.json());

//mostramos el libro por id
app.get('/libros', (req, res) => {
    var url_parts = url.parse(req.url, true);

    Libro.findById(url_parts.query.id).then(result => {
        res.send(result);
    })
});

//mostramos todos los libros
app.get('/libros/all', (req, res) => {
    Libro.find().then(result => {
        res.send(result);
    })
});

//mostramos los libros que contenga un literal en autor y tengan ejemplores mayores a X
app.get('/librosWithConditions', (req, res) => {
    var url_parts = url.parse(req.url, true);

    var gtThan = parseInt(url_parts.query.mayor_que);
    var searchName = url_parts.query.nombreAutor;

    Libro.find({
        autor: { $elemMatch: { $regex: searchName, $options: 'i' } },
        ejemplares: { $gt: gtThan }
    }).then(result => {
        res.send(result);
    })
});

//creamos uno o mas libros por post
app.post('/libros', (req, res) => {

    if (Array.isArray(req.body)){
        var insertar = [];
        req.body.forEach(element => {
            const nuevo = {
                titulo: element.titulo,
                autor: element.autor,
                ejemplares: element.ejemplares
            };
        
            insertar.push(nuevo);
        });

        Libro.insertMany(insertar).then(result => {
            res.send(result);
        })
    }else{
        Libro.create({
            titulo: req.body.titulo,
            autor: req.body.autor,
            ejemplares: req.body.ejemplares
        }).then(result => {
            res.send(result);
        })
    }
});

//actualizamos un libro con la condicion id
app.put('/libros', (req, res) => {
    Libro.findByIdAndUpdate(req.body.id, 
        {
            titulo: req.body.titulo,
            autor: req.body.autor,
            ejemplares: req.body.ejemplares
        },
        { new: true }
    ).then(result => {
            res.send(result);
        }
    )
});

//borramos un libro por id
app.delete('/libros', (req, res) => {
    var url_parts = url.parse(req.url, true);

    Libro.findByIdAndDelete(url_parts.query.id).then(result => {
            res.send(result);
        }
    )
});

app.listen(8080);