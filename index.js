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
        saveUninitialized: true,
        resave: true,
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
app.use(express.static('resources'));

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

        var insertQuery = `insert into users (username, password) VALUES ('${username}', '${hash}');`
        await db.query(insertQuery)
        res.redirect('/login')
    }
    catch (error) {
        console.error('Error during registration');
        res.redirect('/register');
    }
});

//test route for registering. this is a mock route and any user will be added and then removed from the database
app.post("/testRegister", async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;

        if (!username || !password) {
            return res.status(400).send({ message: 'Invalid input' });
        }
        //hash the password using bcrypt library
        const hash = await bcrypt.hash(password, 10);

        //insert user into the database
        var insertQuery = `INSERT INTO users (username, password) VALUES ('${username}', '${hash}');`;
        await db.query(insertQuery);

        //immediately remove the user
        var deleteQuery = `DELETE FROM users WHERE username='${username}';`;
        await db.query(deleteQuery);

        //send success response
        res.status(200).send({ message: 'User registered and removed for test' });
    } catch (error) {
        console.error('Error during mock registration:', error);
        res.status(500).send({ message: 'Error during registration' });
    }
});

app.get('/login', (req, res) => {
    res.render('pages/login')
});

app.post('/login', async (req, res) => {
    var username = req.body.username;
    const password = req.body.password;

    var user_Query = `SELECT * FROM users WHERE username = '${username}';`;
    const user = await db.oneOrNone(user_Query);
    if (user) {

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            //only save username, not password (for obvious reasons)
            let user = { username: username };
            req.session.user = user;
            req.session.save(() => {
                res.redirect('/');
            });
        } else {

            res.render('pages/login', { error: 'Incorrect username or password' });
        }

    }
    else {
        res.redirect('/register');
    }

});

//testing route for login
app.post('/testLogin', async (req, res) => {
    try {
        var username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).send({ message: 'Invalid input' });
        }
        //get user from database
        const user = await db.oneOrNone(`SELECT * FROM users WHERE username = '${username}';`);
        if(user){
            //check salted password hash
            const match = await bcrypt.compare(password, user.password);
            if(match){
                return res.status(200).send({ message: 'User logged in' });
            }
            else{
                return res.status(400).send({ message: 'Incorrect password' });
            }
        }else{
            return res.status(400).send({ message: 'User does not exist' });
        }
    }
    catch(error){
        console.error('Error during mock registration:', error);
        res.status(500).send({ message: 'Error during registration' });
    }
});

//movie search
app.get("/search", async (req, res) => {
    try{
        const movieName = req.query.movieName;
        //movie name is required
        if(!movieName){
            return res.status(400).send({ message: 'movieName query expected.' });
        }
        //build query
        const query = `SELECT * FROM movies WHERE title ILIKE $1;`;
        //build values array
        const values = [`%${movieName}%`];
        //execute query
        const movies = await db.query(query, values); 
        //send results
        res.status(200).send({ movies: movies});
    }
    catch(error){
        console.error('Error during movie search:', error);
        res.status(500).send({ message: 'Error during movie search' });
    }
});


/* authenticated routes */
app.get('/', auth, async (req, res) => {
    try
    {
        //Only send the first 6 movies
        movQuery = `SELECT * FROM movies LIMIT 6;`;
        const movies = await db.query(movQuery);
        res.render('pages/home', {movies: movies})
    }
    catch(error)
    {
        console.error('Error during page render:', error);
        res.status(500).send({ message: 'Error during page render' });
    }

  });


app.get("/movie/:id", async (req, res) => {
    //TODO get movie details from database
    try{
        movid = req.params['id']
        
        movQuery = `SELECT * FROM movies WHERE movieId = '${movid}';`;
        
        const movies = await db.query(movQuery);

        movreviewsQuery = `SELECT * FROM movieReviews WHERE movieId = '${movid}';`;
        const moviereviews = await db.query(movreviewsQuery);
        

        // Check if moviereviews has any results
        const reviewId = moviereviews.length > 0 ? moviereviews[0].reviewId : null;

        if (reviewId) {
            const reviewsQuery = `SELECT * FROM reviews WHERE reviewId = '${reviewId}';`;
            const reviews = await db.query(reviewsQuery);

            // Render the page with both movies and reviews
            res.render('pages/viewDetails', { movies: movies, reviews: reviews });
        } else {
            // Render the page with only movie details (and an empty reviews array)
            res.render('pages/viewDetails', { movies: movies, reviews: [] });
        }
    }
    catch(error){
        console.error('Error during view Movie Details:', error);
        res.status(500).send({ message: 'Error during view Movie Details' });
    }
});

app.get("/logout", async(req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

//listen for requests
module.exports = app.listen(3000, () => {
    console.log('Listening on port 3000');
});

app.post('/addReview', auth, async (req, res) => {
	console.log(req.body);
    try {
        if(!req.body.review || !req.body.rating || !req.body.id){
            return res.status(400).send({ message: 'Invalid input' });
        }
        // look at the console log and see data
        // break data into variables
        // Push the variables to the reviews and MovieReviews tables
        //this part handles adding the review to the database.
        let addReview = `INSERT INTO reviews (numberOfStars, text, userName) VALUES (${req.body.rating}, ${req.body.review}, ${req.session.user.username});`

        //you'll also need the movie id from the movie page to link the review to the movie

        //temporary end request
        res.end("Review added");
    }
    catch {
        console.error('Error during review submission');
        res.status(500).send({ message: 'Error during page render' });
    }
});