//super simple to verify docker compose is working and running


const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords


//initialize session variables
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Authentication
const auth = (req, res, next) => {
    if (!req.session.user) {
        // Default to login page.
        return res.redirect('/login');
    }
    next();
};

// middleware setup
app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.




// database configuration
const dbConfig = {
    host: 'db', // the database server
    port: 5432, // the database port
    database: process.env.POSTGRES_DB, // the database name
    user: process.env.POSTGRES_USER, // the user account to connect with
    password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

//init pgp with our db config
const db = pgp(dbConfig);


//test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // you can view this message in the docker compose logs
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    })

//test page for now
app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
  });

app.get('/register', (req, res) => {
    res.render('pages/register')
});

// Register
app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        var username = req.body.username;

        // To-DO: Insert username and hashed password into the 'users' table
        var insertQuery = `insert into users (username, password) VALUES ('${username}', '${hash}');`
        await db.query(insertQuery)
        res.redirect('/login')
    }
    catch (error) {
        console.error('Error during registration');
        res.redirect('/register');
    }
});

app.get('/login', (req, res) => {
    res.render('pages/login')
});

app.post('/login', async (req, res) => {
    var username = req.body.username;
    const password = req.body.password;

    var user_Query = `select * from users where username = '${username}';`;
    const user = await db.oneOrNone(user_Query);
    if (user) {

        const match = await bcrypt.compare(password, user.password);
        if (match) {

            req.session.user = user;
            req.session.save(() => {

                res.redirect('/home');
            });
        } else {

            res.render('login.ejs', { error: 'Incorrect username or password' });
        }

    }
    else {
        res.redirect('/register');
    }

});

/* authenticated routes */

app.get("/home", auth, async (req, res) => {
    res.end("Welcome to the home page!");
});


app.get("/movies/:id", auth, async (req, res) => {
    //TODO get movie details from database
    //TODO render movie details page
    res.end("Welcome to the movie details page!");
});

//listen for requests
module.exports = app.listen(3000, () => {
    console.log('Listening on port 3000');
});