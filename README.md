# Fnt App

[![Go Report Card](https://goreportcard.com/badge/vikaspogu/fnt_app)](https://goreportcard.com/report/github.com/vikaspogu/fnt_app)

## Frontend

Frontend is developed using ReactJS and Pattenfly as design

## Golang backend

Go backend using gin gonic, mongo as database

### Deploy to heroku

```bash
cd ../go_backend
heroku git:remote -a go-backend-fnt
git remote rename heroku heroku-backend-app
cd image-scraper-ts
heroku git:remote -a image-scraper-fnt
git remote rename heroku heroku-image-app
cd ../frontend-react-ts
heroku git:remote -a frontend-react-fnt
git remote rename heroku heroku-frontend-app
cd ../
git subtree push --prefix frontend-react-ts heroku-frontend-app master
git subtree push --prefix go_backend heroku-backend-app master
git subtree push --prefix image-scraper-ts heroku-image-app master
```

Reset heroku git repo

```bash
$ cd /my-project/
$ heroku plugins:install heroku-repo
$ heroku repo:reset
```
