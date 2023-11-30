### Group Project for 3308

# Movie Review Site
# Description
Our website is a movie review site very similar to imdb and other sites however it has a few differences. The site has a built in review system where anyone can leave reviews on any movie within the database. Also giving it a rating out of 6.5 stars that will displayed as an average to everyone that views that movie. Speaking of viewing movies from the home page one can browse a list of movies and search up the name of any movie they wish to view. From there they can click on the movie to view details or add a review as discussed before. The view movies page allows one to a see a description of the mvie as pulled from our database and also see any reviews that have been left behind. On top of that the webiste has an account system where users are logged in the system. There is a also a featured movies section on the home page where we can selkect movies to featured to the viewer immediatley when opening the website. Overall the website is very similar to your average review website it has a a few differences that make it better, with a cleaner ui and new rating system.

# Contributors
- [Ethan Pinnick](https://github.com/EPinnick)
- [Ian Scheuermann](https://github.com/ischeuermann)
- [Mitch Siegel](https://github.com/MitchSiegel)
- [Caleb Schroder](https://github.com/CalebSchroder1)

# Technology Stack
| Stack | Use |
| --- | --- | 
| [Node.js](https://nodejs.org/en/) | Backend |
| [Express](https://expressjs.com/)| Website server |
| [PostgreSQL](https://www.postgresql.org/) | Database |
| [Postman](https://www.postman.com/) | Testing |
| [Docker](https://www.docker.com/) | Deployment & Distribution |
| [GitHub](https://github.com) | Version Control & Project Management |
| [Heroku](https://www.heroku.com/) | Hosting (maybe) |
| [Bootstrap](https://getbootstrap.com/) | Frontend framework |
| [Unsplash](https://unsplash.com/) | Image API for login and register page|
| [TMDB](https://www.themoviedb.org/) | Review data API |

todo 
Prerequisites to run the application - Any software that needs to be installed to run the application
quick list: node, npm, docker, git (optional but recommended - I mean who doesn't have git installed?)

How to install and run the application (env variables, config file, etc)

Get an API key from [Unsplash](https://unsplash.com/developers)
Get an API key from [TMDB](https://www.themoviedb.org/settings/api)
Sample .env file
```bash
# database credentials
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="pwd"
POSTGRES_DB="project_db"

#Node 
SESSION_SECRET="super duper secret!!!!"

#unsplash api key. This key is technically optional, but the login and register pages will simply display a non random, default image if this is not set
UNSPLASH_ACCESS_KEY="key"

#TMDB api key (https://www.themoviedb.org/)
TMDB_API_KEY="key"
```

How to run tests

Tests should automatically run when the application is built. To run tests manually, run `npm test` in the root directory of the project.

Link to deployed application
//TODO once hosting is set up