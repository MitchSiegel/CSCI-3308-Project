//super simple to verify docker compose is working and running


const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const fetch = require('node-fetch'); // To make HTTP requests from the node server
const compression = require('compression'); // To compress the response bodies



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
app.use(compression()); // compress all responses (super basic compression)

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


app.get('/register', async(req, res) => {
    //get background image (unless we already have it cached)
    if(!cachedBGImage){
        cachedBGImage = await getBg();
        res.render('pages/register', {bg: cachedBGImage});
    }else{
        res.render('pages/register', {bg: cachedBGImage});
        //update image now that we've sent the response
        cachedBGImage = await getBg();
    }
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
app.post('/testRegister', async (req, res) => {
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

let cachedBGImage;
app.get('/login', async(req, res) => {
    //get background image (unless we already have it cached)
    if(!cachedBGImage){
        cachedBGImage = await getBg();
        res.render('pages/login', {bg: cachedBGImage});
    }else{
        res.render('pages/login', {bg: cachedBGImage});
        //update image now that we've sent the response
        cachedBGImage = await getBg();
    }
});

app.post('/login', async (req, res) => {
    var username = req.body.username;
    const password = req.body.password;
    //this is okay to do, we trust our users to not inject sql
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
app.get('/search', async (req, res) => {
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


//above route rewrite to use TMDB & our database
app.get('/movie/:id', async (req, res) => {
    try{
        //first get the movie name from our database using our movie id, which is not the same as the TMDB id
        const movid = req.params['id'];
        const movQuery = `SELECT * FROM movies WHERE movieId = '${movid}';`;
        const movies = await db.query(movQuery);
        //get the movie details from TMDB
        let movieDetails = await findMovieDetails(movies[0].title);

        //convert movie backdrop to base64 for quicker rendering on the client
        let bgUrl = await urlToBase("https://image.tmdb.org/t/p/original/" + movieDetails.backdrop_path);

        //now we see if we have any reviews for this movie, and if not, we get them from TMDB
        const movieReviewsQuery = `SELECT * FROM reviews WHERE movieId = '${movid}';`;
        const executedMovie = await db.query(movieReviewsQuery);
        // Check if moviereviews has any results

        const pullReviews = (executedMovie.length > 0) ? false : true; //if we have reviews, don't pull them from TMDB

        movieDetails.reviews = (executedMovie.length == 0) ? await getReviews(movieDetails) : executedMovie;
        //render the page
        res.render('pages/viewDetails', { data: movieDetails, bg: bgUrl });

        //if we pulled, add those reviews to the database
        if(pullReviews){
            for(let i = 0; i < movieDetails.reviews.length; i++){
                let review = movieDetails.reviews[i];
                review.content = review.content.replace(/'/g, "''"); //escape single quotes, this was causing an error
                review.numberofstars = (review.numberofstars == null) ? 0 : review.numberofstars; //null protection
                let query = `INSERT INTO reviews (movieId, numberOfStars, text, userName,localReview) VALUES ('${movid}', ${review.numberofstars}, '${review.content}', '${review.author}',false);`;
                await db.query(query).catch(error => (true)); //due to some weirdness with the TMDB api, some reviews will always fail to insert, so we just ignore them
            }
        }
    }
    catch(error){
        console.error('Error during view Movie Details:', error);
        res.status(500).send({ message: 'Error during view Movie Details' });
    }
});

app.get('/logout', async(req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

//listen for requests
module.exports = app.listen(3000, () => {
    console.log('Listening on port 3000');
});

app.post('/addReview', auth, async (req, res) => {
    try {
        if(!req.body.review || !req.body.rating || !req.body.id){
            return res.status(400).send({ message: 'Invalid input' });
        }
		else if(!req.session.user.username){
			return res.status(400).send({ message: 'Login to review' });
		}
		else{
	      // look at the console log and see data
		  // break data into variables
		  // Push the variables to the reviews and MovieReviews tables
		  //this part handles adding the review to the database.
		  let addReview = `INSERT INTO reviews (movieid, numberofstars, text, username) VALUES (${req.body.id}, ${req.body.rating}, '${req.body.review}', '${req.session.user.username}');`; // might need to add TRUE for localReview bool
		  await db.query(addReview);
	
		  //temporary end request
		  res.end("Review added");
		}
    }
    catch {
        console.error('Error during review submission');
        res.status(500).send({ message: 'Error during page render' });
    }
});

/* ====================== */
/* Helper functions below */
/* ====================== */

//get a random background image from unsplash, convert it to base64, and return data about the image, including credit.
async function getBg(){
    const access = process.env.UNSPLASH_ACCESS_KEY;
    if(!access || access == "key"){ //if the key is set to the default placeholder value or not set at all, return a default image
        console.error('UNSPLASH_ACCESS_KEY not set. Proving default image instead of random image from unsplash');
        return {base64: null, url: "https://images.unsplash.com/photo-1485095329183-d0797cdc5676", name: "Jake Hills", link: "https://unsplash.com/@jakehills", default: true};
    }
    //get a random number between 1 and 30
    const picture = Math.floor(Math.random() * 50);
    const url = `https://api.unsplash.com/search/photos?query=movie theather&orientation=landscape&client_id=${access}&per_page=1&page=${picture}`
    const response = await fetch(url);
    //convert image to base64 for quicker rendering on the client (but still credit the author)
    const data = await response.json();
    const base64 = await urlToBase(data.results[0].urls.full);
    return {base64: base64, url: data.results[0].urls.full, name: data.results[0].user.name, link: data.results[0].user.links.html, default: false};
}

async function urlToBase(url){
    const response = await fetch(url);
    const data = await response.buffer();
    return data.toString('base64');
}

//convert a rating from the 1-10 scale to the 1-6.5 scale
async function convertRating(originalRating) {
    if(!originalRating) return null; //null protection
    let rating = originalRating / 2;
    rating = (rating == 5) ? 6.5 : Math.round(rating);
    if(originalRating == 9) rating = 6;
    return rating;
}


//These two functions are supposed to be used together, ex: findMovieDetails("The Matrix").then(data => getReviews(data));
//finds a movie from the api TMDB
async function findMovieDetails(moveName) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${moveName}`;
    const response = await fetch(url);
    const data = await response.json();
    data.results[0].vote_average = await convertRating(data.results[0].vote_average);
    return data.results[0];
}

//gets reviews for a movie from the api TMDB
async function getReviews(movieObject) {
    const url = `https://api.themoviedb.org/3/movie/${movieObject.id}/reviews?api_key=${process.env.TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    //loop through and convert the ratings & strip out unnecessary data
    for(let i = 0; i < data.results.length; i++){
        data.results[i].numberofstars = await convertRating(data.results[i].author_details.rating);
        data.results[i].username = data.results[i].author;
        delete data.results[i].author_details;
        delete data.results[i].id;
        delete data.results[i].created_at; //only need updated_at
        data.results[i].text = data.results[i].content.replace(/\r\n|\r|\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"); //markdown to html
        //I certainly hope nobody tries to inject html into their review...
    }
    return data.results;
}

//dump reviews from the database
async function dumpReviews(){
    const reviews = await db.query(`SELECT * FROM reviews;`);
    console.log(reviews);
    return reviews;
}

//dumpReviews().then(data => console.log(data));

//dump reviews to movies reationship from the database
async function dumpMovieReviews(){
    const reviews = await db.query(`SELECT * FROM movieReviews;`);
    console.log(reviews);
    return reviews;
}

//dumpMovieReviews().then(data => console.log(data));