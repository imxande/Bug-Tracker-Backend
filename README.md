<img src="https://media.giphy.com/media/Yuvl9zDgVNCcU/giphy.gif" alt="bug tracker" width="830">

# Bug Tracker Backend

## Summary

This repo contains all backend code in use at our Bug Tracker. For easier development please check the How To Run section. Have fun! 💖💖💖

## How To Run Development

### 1. Clone the repo

```
git clone https://github.com/imxande/Bug-Tracker-Backend.git
```

### 2. Prerequisites

- [Node](https://nodejs.org/en/) 14 or later
- [Express](https://expressjs.com/)
- [Knex](http://knexjs.org/)
- [NPM](https://docs.npmjs.com/)

### 3. Installation

- In order to get the ball rolling you will need to npm install to get the dependencies.

```
npm install
```

- In development we will initialize nodemon to automatically restarting the node application when file changes and then we will start our server/app

```
npm run dev && start
```

### 4. Create our database

Once the server is up an running we create our database, please run:

```
npm run migrate
```

**_Note:_** Check in the data folder for our newly created help_desk.db3 file.

<img src="https://media.giphy.com/media/S8r6dMPZHQfK5gpJwM/giphy.gif" alt="bug tracker" width="830">

👏 Yay! we did it. This is our SQL database👏

Now you can view the database with [SQLiteStudio](https://sqlitestudio.pl/)

# Documentation

I have included our API documentation here check it out: <br>
[Bug Tracker API Documentation](https://aesthetic-gecko-506323.netlify.app/)<br><br>

![Good luck Have fun!](https://media.giphy.com/media/W23aKzDl1OFRAcki9z/giphy.gif)

# License

[MIT licensed](./LICENSE)
