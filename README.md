# Fnt App

[![Go Report Card](https://goreportcard.com/badge/vikaspogu/fnt_app)](https://goreportcard.com/report/github.com/vikaspogu/fnt_app)

## Frontend

Frontend is developed using ReactJS and Pattenfly as design

## Golang backend

Go backend using gin gonic, mongo as database

### Deploy to heroku

```bash
cd ../fnt-backend
heroku git:remote -a fnt-backend
git remote rename heroku heroku-fnt-backend
cd ../fnt-frontend
heroku git:remote -a fnt-frontend
git remote rename heroku heroku-fnt-frontend
cd ../image-scraper
heroku git:remote -a fnt-image-scraper
git remote rename heroku heroku-image-scraper
cd ../
git subtree push --prefix fnt-frontend heroku-fnt-frontend master
git subtree push --prefix fnt-backend heroku-fnt-backend master
git subtree push --prefix image-scraper heroku-image-scraper master
```

Reset heroku git repo

```bash
$ cd /my-project/
$ heroku plugins:install heroku-repo
$ heroku repo:reset
```

helpful git commands

```bash
git remote remove fnt-frontend
```
