# What Is

This is a slack bot that is inspired by the project within the Department of Veterans Affairs [wtf-bot](https://github.com/department-of-veterans-affairs/wtf-bot) that will return acronyms / terms for [Pluribus Digital](https://pluribusdigital.com/) within the context of government contracting.

## Environment variables:

    ACRONYMS_URL the url of the acronyms csv file [REQUIRED]
    PORT to set the port that the app will run on (default: 3000) [OPTIONAL]

## How to run?

### Locally
~~~
npm install
npm start
~~~

### Production Deployment

This application is hosted on Heroku, so you need to be part of the team to push to Heroku


## Query Instuctions

Once running you can reqest at the url or IP address at the port specified and with a query parameter of acronym.

http://localhost:3000/?acronym=stsi
