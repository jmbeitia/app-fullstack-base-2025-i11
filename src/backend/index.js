//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');

var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
    utils.query("SELECT * FROM Devices",function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});
app.get('/devices/:id', function(req, res, next) {
    utils.query("SELECT * FROM Devices where id = "+req.params.id, function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});
app.post('/devices', function (req, res) {
    let { name, description, type, state } = req.body;

    if (!name || !description || typeof type === 'undefined' || typeof state === 'undefined') {
        res.status(400).send({ error: 'Datos incompletos' });
        return;
    }

    const query = `INSERT INTO Devices (name, description, type, state) VALUES (?, ?, ?, ?)`;
    utils.query(query, [name, description, type, state], function (error, results) {
        if (!error) {
            res.status(201).send({ message: 'Dispositivo creado', id: results.insertId });
        } else {
            console.log(error);
            res.status(500).send({ error: 'Error al insertar el dispositivo' });
        }
    }); 
});

app.get('/algo',function(req,res,next){

    console.log("llego una peticion a algo")
    res.status(409).send({nombre:"Matias",apellido:"Ramos",dni:2131});
});
app.get('/algoInfo/:nombre',function(req,res,next){
    
    
    res.status(200).send({saludo:"Hola "+req.params.nombre});
});

app.post('/algoInfoBody/',function(req,res,next){
    console.log(req.body);
    if(req.body.nombre != undefined){
        res.status(200).send({saludo:"Hola "+req.body.nombre});
    }else{
        res.status(409).send({error:"Falta el nombre"});
    }
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
