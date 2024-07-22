const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const DBCONFIG = require('./db-config/db');
const path = require('path');
global.verifyToken = require('./models/verifyToken');
global.helperFunction = require('./models/helperfunctions');

const corsOptions = {
    origin: true, // This allows requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable cookies and other credentials
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const DBURL = DBCONFIG.url;
const PORT = DBCONFIG.port;
const LOCAL_ADDRESS = DBCONFIG.hostname;

// Connecting to the database
mongoose.connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// require('./passport-setup');
require('./routes/')(app);

app.listen(PORT, LOCAL_ADDRESS, () => {
    console.log(`Server running at http://${LOCAL_ADDRESS}:${PORT}/`);
});
