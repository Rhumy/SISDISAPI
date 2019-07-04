const express = require("express");
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const app = express();

const PORT = process.env.PORT || 3000;

const CONNECTION_URL = "mongodb+srv://SistDist:SistDist@clustersistemasdistribuidos-f3top.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "SistemasDistribuidos";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var database, collection;

let mensaje = {
	_id: null,
	nickname : '',
	puntaje : '',
	juego : ''
};

let respuesta = {
	error: false,
	codigo: 200,
	mensaje: ''
}
app.get("/", function(req, res) {
	var juegoABuscar = req.body.juego;

	console.log('Juego: '+req.body.juego);
	collection.find({"juego": juegoABuscar}).sort({puntaje: -1}).toArray((error, result) => {
		if(error) {
			respuesta = {
				error: true,
				codigo: 500,
				mensaje: 'Problema al obtener de la base de datos'
			};
			console.log(error);
			res.send(respuesta);
		}
		else{
			res.send(result);
		}
	})
});
app.post("/", function(req, res) {
	mensaje.nickname = req.body.nickname;
	mensaje.puntaje = req.body.puntaje;
	mensaje.juego = req.body.juego;
	console.log('Nickname: '+req.body.nickname+'. Puntaje: '+req.body.puntaje+'. Juego: '+req.body.juego);
	if( mensaje.nickname !=undefined && mensaje.puntaje!=undefined && mensaje.juego!=undefined){
		//Enviar a MongoDB
		collection.insertOne(mensaje, (error, result) => {
			mensaje._id = null;
			if(error) {
				respuesta = {
					error: true,
					codigo: 500,
					mensaje: 'Problema al insertar en la base de datos'
				};
				console.log(error);
			}
			else{
				respuesta = {
					error: false,
					codigo: 200,
					mensaje: 'Mensaje guardado',
					respuesta: mensaje
				};	
			}
		})
	}
	else{
		respuesta = {
			error: true,
			codigo: 501,
			mensaje: 'El mensaje debe tener todos los datos'
		};
	}
	res.send(respuesta);
});
app.listen(PORT, () => {
	MongoClient.connect(CONNECTION_URL, {useNewUrlParse: true}, (error, client) => {
		if (error) {
			throw error;
		}
		database = client.db(DATABASE_NAME);
		collection = database.collection("Datos");
		console.log("Conectado a "+DATABASE_NAME+"!");
	})
	console.log("Servidor inicializado");
})