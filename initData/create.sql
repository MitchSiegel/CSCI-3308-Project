-- Users table
CREATE TABLE users (
    userName VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Movies table
CREATE TABLE movies (
    movieId SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    releaseDate DATE NOT NULL,
    posterImage TEXT NOT NULL
);

-- Reviews table (we can remove the check here I just saw it in the documentation and thought it would be easier to have a check here instead of in the JS)
CREATE TABLE reviews (
    reviewId SERIAL PRIMARY KEY,
    numberOfStars DECIMAL(2,1) CHECK (numberOfStars <= 6.5),
    text TEXT,
    userName VARCHAR(255) REFERENCES users(userName)
);

-- Link table for Reviews to Movies (on delete will handle the case where either a movie or a review is deleted to delete the reference between the two)
CREATE TABLE movieReviews (
    reviewId INT REFERENCES reviews(reviewId) ON DELETE CASCADE,
    movieId INT REFERENCES movies(movieId) ON DELETE CASCADE,
    PRIMARY KEY (reviewId, movieId)
);