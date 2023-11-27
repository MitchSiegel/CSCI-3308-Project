# Movie Review Site
### Group Project for 3308
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

todo 
Prerequisites to run the application - Any software that needs to be installed to run the application

How to install and run the application (env variables, config file, etc)

Get an API key from [Unsplash](https://unsplash.com/developers)
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

Link to deployed application

