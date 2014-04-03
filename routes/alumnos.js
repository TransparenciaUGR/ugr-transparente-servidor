/*
  Portal web transparente.ugr.es para publicar datos de la Universidad de Granada
  Copyright (C) 2014  Jaime Torres Benavente

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


//Variable para la base de datos mongodb

var MongoClient = require('mongodb').MongoClient;

//Variable para las configuraciones
var conf = require('../configuracion');

//Variable para almacenar los datos 
var datos = new Array(); 
var datos2 = new Array();
var datos3 = new Array();





//Variable para la url
var url="";

//Funcion para almacenar los datos del recurso que se le pasa

function ObtenerDatos(url,tipo){

  require('node.io').scrape(function() {
      this.get(url, function(err, data) {
          var lines = data.split('\n');
          //2010
          if(tipo==1){
            datos=new Array();
            for (var line, i = 1, l = lines.length; i < l; i++) {
                line = this.parseValues(lines[i]);
                datos.push(line);
                
            }
          }
          //2011
          else if(tipo==2){
            datos2=new Array();
            for (var line, i = 1, l = lines.length; i < l; i++) {
                line = this.parseValues(lines[i]);
                datos2.push(line);
                
            }           
          }
          //2012
          else if(tipo==3){
            datos3=new Array();
            for (var line, i = 1, l = lines.length; i < l; i++) {
                line = this.parseValues(lines[i]);
                datos3.push(line);
                
            }           
          }
      });
  });

}

//Funcion para conectarnos a la base de datos y leer la url del recurso que queremos consultar en opendata.ugr.es

function conectarBD(tipo){
    MongoClient.connect(conf.BD, function(err,db){
          if(err) throw err;
   
          var coleccion = db.collection('alumnos');
   
          if(tipo==1)
            var cursor = coleccion.find({"año" : 2010});
          else if(tipo==2)
            var cursor = coleccion.find({"año" : 2011});
          else if(tipo==3)
            var cursor = coleccion.find({"año" : 2012});
          cursor.each(function(err, item) {
                  if(item != null)
                    url=item.url
                  // Si no existen mas item que mostrar, cerramos la conexión con con Mongo y obtenemos los datos 
                  else{

                    db.close();
                    if(url!="")
                      ObtenerDatos(url,tipo);

                  }
          });
    });
}



// Funcion para gestionar la página de secciones de la ugr

exports.alumnos = function(req, res){
  conectarBD(1);
  tam=datos.length;
  conectarBD(2);
  tam2=datos2.length;
  conectarBD(3);
  tam3=datos3.length;
  res.render('alumnos', { seccion: conf.sec4 , datos: datos, datos2: datos2, datos3: datos3 , tam: tam, tam2: tam2, tam3: tam3});

};