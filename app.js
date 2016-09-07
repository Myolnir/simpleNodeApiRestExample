var express  = require("express"),
    app      = express(),
    http     = require("http"),
    server   = http.createServer(app),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());


//Ejemplo de hola mundo con un GET en el raiz
var router = express.Router();

router.get('/', function(req, res) {
    res.send("Hello World!");
});

//Inicializa el endpoint raiz
app.use(router);


//Conecta a la BD y arranca el servidor
mongoose.connect('mongodb://localhost/tvshows', function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log(('Successfully connected to Database'))
    }
});

// Import Models and controllers
var models     = require('./models/tvshow')(app, mongoose);
var TVShowCtrl = require('./controllers/tvshows');

// API routes
var tvshows = express.Router();

tvshows.route('/tvshows')
    .get(TVShowCtrl.findAllTVShows)
    .post(TVShowCtrl.addTVShow);

tvshows.route('/tvshows/:id')
    .get(TVShowCtrl.findById)
    .put(TVShowCtrl.updateTVShow)
    .delete(TVShowCtrl.deleteTVShow);

//Define el endpoint para tvshows
app.use('/api', tvshows);

//Start Express server
app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});