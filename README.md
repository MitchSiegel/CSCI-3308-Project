# Movie Review Site (Group Project for 3308)
## Description
Our website is a movie review site very similar to IMDB and other sites however it has a few differences. The site has a built in review system where anyone can leave reviews on any movie within the database. Also giving it a rating out of 6.5 stars that will displayed as an average to everyone that views that movie. Speaking of viewing movies from the home page one can browse a list of movies and search up the name of any movie they wish to view. From there they can click on the movie to view details or add a review as discussed before. The view movies page allows one to a see a description of the movie as pulled from our database and also see any reviews that have been left behind. On top of that the website has an account system where users are logged in the system. There is a also a featured movies section on the home page where we can select movies to feature to the viewer immediately when opening the website. Overall the website is very similar to your average review website it has a a few differences that make it better, with a cleaner ui and new rating system.

## Contributors
- [Ethan Pinnick](https://github.com/EPinnick)
- [Ian Scheuermann](https://github.com/ischeuermann)
- [Mitch Siegel](https://github.com/MitchSiegel)
- [Caleb Schroder](https://github.com/CalebSchroder1)


## Technology Stack
| Stack | Use |
| --- | --- | 
| [Node.js](https://nodejs.org/en/) | Backend |
| [Express](https://expressjs.com/)| Website server |
| [PostgreSQL](https://www.postgresql.org/) | Database |
| [Postman](https://www.postman.com/) | Testing |
| [Docker](https://www.docker.com/) | Deployment & Distribution |
| [GitHub](https://github.com) | Version Control & Project Management |
| [Azure](https://azure.microsoft.com/) | Hosting |
| [Bootstrap](https://getbootstrap.com/) | Frontend framework |
| [Unsplash](https://unsplash.com/) | Image API for login and register page|
| [TMDB](https://www.themoviedb.org/) | Review data API |

## How to run
Pre-reqs: Docker, Node.js, Git.

This project uses docker-compose. Please follow the steps to get your env setup first.

You'll need to aquire an API key from these two places: 

Get an API key from [Unsplash](https://unsplash.com/developers)

Get an API key from [TMDB](https://www.themoviedb.org/settings/api)

After you've gotten your key, please modify this sample .env file 
```bash
# database credentials
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="pwd"
POSTGRES_DB="project_db"

#Node 
SESSION_SECRET="super duper secret!!!!"

#unsplash api key. This key is technically optional, but the login and register pages will simply display a non-random, default image if this is not set
UNSPLASH_ACCESS_KEY="key"

#TMDB API key (https://www.themoviedb.org/)
TMDB_API_KEY="key"
```

After you've gotten your .env setup, run 
```bash
docker-compose up
```

This will download the correct docker images, and should configure the website for you, including loading in our intinal data.

That's it 🎉! You should be good to go. Tests will pass by default, and are helpful if you plan on making any changes to make sure nothing was broken. 
## Hosting
The website is hosted at:
	http://recitation-15-team-04.eastus.cloudapp.azure.com:3000

[Lab 13 hosting screenshot](/MilestoneSubmissions/lab_13_hosting_screenshot.png)


## Tests
The tests are located in [serverspec.js](test/serverspec.js).

Tests should automatically run when the application is built. 

To run tests manually, run `npm test` in the root directory of the project.

## Deployment
Check out our deployed application [here](http://recitation-15-team-04.eastus.cloudapp.azure.com:3000) (Link not always hosted)

