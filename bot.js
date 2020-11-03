const TelegramBot = require('node-telegram-bot-api');
const token = '1474067552:AAFey_F3tQyQINZmkK4_-oxB2lvs0XgCGmQ';
const bot = new TelegramBot(token, { polling: true });
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var MongoClient = require("mongodb").MongoClient;
var url =
    "mongodb+srv://admin:superadmin@cluster0.x3q0p.mongodb.net/unoriesgo?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});
var $ = jQuery = require('jquery')(window);
bot.on('polling_error', function(error) {
    console.log(error);
});
var sw;
var length;

function que(valor) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unoriesgo");
        var query = { nombre: valor };
        dbo
            .collection("recursos")
            .find(query)
            .toArray(function(err, result) {
                if (err) throw err;
                sw = result[0].nombre;
                si = result[0].imagen;
                console.log(result[0].nombre);
                db.close();
            });
    });
}
bot.onText(/^\/start/, function(msg) {
    var chatId = msg.chat.id;
    var nameUser = msg.from.first_name;

    //  bot.sendMessage(chatId, "Bienvenido a mi bot " + chatId);
    bot.sendMessage(chatId, "Bienvenido a mi bot " + nameUser);
});

bot.onText(/\/buscar (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unoriesgo");
        var query = { nombre: resp };
        dbo
            .collection("recursos")
            .find(query)
            .toArray(function(err, result) {
                // if (err) throw err;
                //https://unorecursos-backend.herokuapp.com/api/recursos/5fa18623b0c1f30017215222
                //  carta(chatId, result[0].nombre, result[0].imagen);
                //    bot.sendPhoto(chatId, result[0].imagen);
                //   bot.sendMessage(chatId, result[0].nombre);
                //sw = result[0].nombre;
                // si = result[0].imagen;
                //  console.log(result[0].nombre);
                if (err) throw err;
                if (result.length == 0) {
                    bot.sendMessage(chatId, "No existe el termino que buscas");
                } else {

                    $.getJSON(
                        "https://unorecursos-backend.herokuapp.com/api/recursos/" + result[0]._id
                    ).then(function(response) {
                        console.log(response.nombre);
                        carta(
                            chatId,
                            response.nombre,
                            response.imagen,
                            response.links[0].url,
                            response.links[1].url,
                            response.links[2].url
                        );

                        bot.on("callback_query", function onCallbackQuery(
                            accionboton
                        ) {
                            const data = accionboton.data;
                            const msg = accionboton.message;
                            if (data == "boton1") {
                                bot.sendMessage(chatId, response[num].links[1].url);
                            }
                            if (data == "boton2") {
                                bot.sendMessage(chatId, response[num].links[2].url);
                            }
                            if (data == "boton3") {
                                bot.sendMessage(chatId, response[num].links[0].url);
                            }
                            if (data == "boton4") {
                                ll();
                                var f = num + 1;
                                if (length > num) {
                                    num++;
                                    bot.sendMessage(chatId, "existe un recurso mas ");
                                } else {
                                    bot.sendMessage(
                                        chatId,
                                        "se acabaron los cursos "
                                    );
                                }

                                // carta(chatId, response[num].nombre, response[num].imagen);

                                //
                            }
                        });
                        //bot.sendMessage(chatId, s);
                        //"Hola " + nameUser + ", Se tiene un total de " + response.length + "cursos los cuales son:" + "\n" +
                        //    bot.sendPhoto(chatId, response[0].imagen);
                        //  bot.sendMessage(chatId, response[0].nombre + " ");
                        //j(chatId, response.length);
                    });


                    //  bot.sendMessage(chatId, "existe");
                }

                db.close();
            });
    });
    // que(resp);
    // carta(chatId, sw, si);
    // // send back the matched "whatever" to the chat
    // bot.sendMessage(chatId, resp);
});
var l =
    "Soy un bot que busca ayudarte entu camino de aprendizaje, este bot se regla a la ley DMCA, si un contenido que se te proporciona rompe con los estandares del DMCA notificar para proceder con la evaluacion y eliminacion del mismo." +
    "\n" +
    "Comandos:" +
    "\n" +
    "Buscar : este comando le debes pasar el termino, ejemplo: /buscar Curso Basico de Python" +
    "\n" +
    "Length : este comando te devuelve el numero de cursos que se ha subido,no recibe parametros: /length" +
    "\n" +
    "Cursos : este comando te devuelve una botonera con los links de acceso del curso mostrada en la imagen y un boton de cambiar al siguienteo,no recibe parametros: /cursos";

bot.onText(/^\/inicio/, function(msg) {
    var chatId = msg.chat.id;
    var nameUser = msg.from.first_name;

    //  bot.sendMessage(chatId, "Bienvenido a mi bot " + chatId);
    bot.sendMessage(chatId, l);
});
bot.onText(/^\/length/, function(msg) {
    var chatId = msg.chat.id;
    var nameUser = msg.from.first_name;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unoriesgo");
        dbo
            .collection("recursos")
            .find({})
            .toArray(function(err, result) {
                if (err) throw err;
                bot.sendMessage(chatId, "La cantidad de cursos es de " + result.length);
                console.log(result);
                db.close();
            });
    });
    //  bot.sendMessage(chatId, "Bienvenido a mi bot " + chatId);

});


bot.onText(/^\!qr/, function(msg) {
    console.log(msg);
    var userId = msg.from.id;
    var data = msg.text.substring(3).trim();
    var imageqr =
        "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + data;
    bot.sendMessage(msg.chat.id, "[✏️](" + imageqr + ")Qr code de: ", {
        parse_mode: "Markdown",
    });
});
bot.onText(/^\textfoto/, function(msg) {
    var chatId = msg.chat.id;
    bot.sendPhoto(chatId, "https://previews.123rf.com/images/kahovsky/kahovsky1711/kahovsky171100063/89471041-lindo-sonriendo-chat-bot-trabajando-en-auriculares-con-micr%C3%B3fono-detr%C3%A1s-de-la-computadora-port%C3%A1til-vector-d.jpg");
})

var num = 0;

function carta(chatId, nombre, imagen, url1, url2, url3) {
    var f = num + 1;
    bot.sendPhoto(
        chatId,
        imagen, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Siguiente curso",
                        callback_data: "boton4",
                    }, ],
                ],
            },
            caption: "curso #" +
                f +
                " " +
                nombre +
                "\n" +
                "Telegram:" +
                url1 +
                "\n" +
                "Mega:" +
                url2 +
                "\n" +
                "Google Drive:" +
                url3 + " #escueladedesarrollo web",
        }

    );
    // bot.sendMessage(
    //     chatId,
    //     "curso #" +
    //     f +
    //     " " +
    //     nombre +
    //     "\n" +
    //     "Telegram:" + url1 +
    //     "\n" +
    //     "Mega:" + url2 +
    //     "\n" +
    //     "Google Drive:" + url3, {
    //         reply_markup: {
    //             inline_keyboard: [
    //                 [{
    //                     text: "Siguiente curso",
    //                     callback_data: "boton4",
    //                 }, ],
    //             ],
    //         },
    //     }
    // );
    // bot.sendPhoto(chatId, imagen);
}

function ll() {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unoriesgo");
        dbo
            .collection("recursos")
            .find({})
            .toArray(function(err, result) {
                if (err) throw err;
                length = result.length;
                // bot.sendMessage(chatId, "La cantidad de cursos es de " + result.length);
                console.log(result);
                db.close();
            });
    });
}
bot.onText(/^\/cursos/, function(msg) {
    var chatId = msg.chat.id;
    var s;
    var botones = {
        reply_markup: {
            inline_keyboard: [
                [{
                        text: "Boton 1",
                        callback_data: "boton1",
                    },
                    {
                        text: "Boton 2",
                        callback_data: "boton2",
                    },
                ],
            ],
        }
    };
    $.getJSON("https://unorecursos-backend.herokuapp.com/api/recursos").then(
        function(response) {
            for (let index = 0; index < response.length; index++) {
                //  const element = response[index];
                s += "/" + response[index]._id + " " + response[index].nombre;
                //+ " ," + response[index].nombre + "\n"
            }
            carta(
                chatId,
                response[num].nombre,
                response[0].imagen,
                response[num].links[0].url,
                response[num].links[1].url,
                response[num].links[2].url
            );

            bot.on("callback_query", function onCallbackQuery(accionboton) {
                const data = accionboton.data;
                const msg = accionboton.message;
                if (data == "boton1") {
                    bot.sendMessage(chatId, response[num].links[1].url);
                }
                if (data == "boton2") {
                    bot.sendMessage(chatId, response[num].links[2].url);
                }
                if (data == "boton3") {
                    bot.sendMessage(chatId, response[num].links[0].url);
                }
                if (data == "boton4") {
                    ll();
                    var f = num + 1;
                    if (length > num) {
                        num++;
                        bot.sendMessage(chatId, "existe un recurso mas ");
                    } else {
                        bot.sendMessage(chatId, "se acabaron los cursos ");
                    }

                    // carta(chatId, response[num].nombre, response[num].imagen);

                    //  
                }
            });
            //bot.sendMessage(chatId, s);
            //"Hola " + nameUser + ", Se tiene un total de " + response.length + "cursos los cuales son:" + "\n" +
            //    bot.sendPhoto(chatId, response[0].imagen);
            //  bot.sendMessage(chatId, response[0].nombre + " ");
            //j(chatId, response.length);
        }
    );

    //   bot.sendMessage(chatId, "este es el texto de una publicacion", botones)




})


function getmovie(movie, chatId) {
    $.getJSON("https://apiroommovie.herokuapp.com/api/movies").then(function(
        response
    ) {


        j(chatId, response.length);
    });
}

function j(chatId, valor) {

    //  console.log(https://image.tmdb.org/t/p/w500+response.results[e].poster_path);
    bot.sendMessage(chatId, valor);
    //   bot.sendMessage(chatId, num)


}
bot.onText(/^\/cursos/, function(msg) {
    var chatId = msg.chat.id;
    var nameUser = msg.from.first_name;
    var s = " ";
    $.getJSON("https://recursosinformaticos.herokuapp.com/api/recursos").then(
        function(response) {
            for (let index = 0; index < response.length; index++) {
                //  const element = response[index];
                s += "/" + response[index]._id + " " + response[index].nombre;
                //+ " ," + response[index].nombre + "\n"
            }
            bot.sendMessage(chatId, s);
            //"Hola " + nameUser + ", Se tiene un total de " + response.length + "cursos los cuales son:" + "\n" +
            //    bot.sendPhoto(chatId, response[0].imagen);
            //  bot.sendMessage(chatId, response[0].nombre + " ");
            //j(chatId, response.length);
        }
    );
    //  bot.sendMessage(chatId, "Bienvenido a mi bot " + chatId);

});