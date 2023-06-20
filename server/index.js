const express = require('express');
const fileUpload = require("express-fileupload");
const cors = require('cors');
const config = require('./config');

const DataBase = require('./db');

const UsersController = require('./controllers/usersController');
const MediasController = require('./controllers/mediasController');

const { signUpValidation } = require('./validations');
const checkAuth = require('./utils/checkAuth');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/static', express.static('public'));
app.use(fileUpload());

/* USERS */
app.post('/auth/signup', signUpValidation, UsersController.signUp);
app.post("/auth/signin", UsersController.signIn);
app.get("/avatar", checkAuth, UsersController.getAvatar)

/* MEDIAS */
app.get('/medias', MediasController.getAll);
app.get('/medias/marks', checkAuth, MediasController.getMarkMedias);
app.post('/medias/marks/add', checkAuth, MediasController.addMarkMedia)
app.delete('/medias/marks/:mediaId', checkAuth, MediasController.deleteMarkMedia);
app.get('/medias/type/:typeid', MediasController.getMediasByType);
app.get('/medias/search/type/:typeId/title/:title', MediasController.searchMedia);
app.get('/medias/search/marked/title/:title', checkAuth, MediasController.searchMarkedMedia)

const start = async () => {
    try {
        await DataBase.connect(config.db);
        console.log('DB OK');

        app.listen(config.port, () => {
            console.log(`Server OK. Port ${config.port}`);
        })
    }
    catch (e) {
        console.log(e);
    }
}

start();