![Bug Tracker](https://media.giphy.com/media/Yuvl9zDgVNCcU/giphy.gif)

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

In order to get the ball rolling you will need to npm install to get the dependencies.

```
npm install
```

### 4. Get familiar with the package.json file

I have added a bunch of commands under scripts in the package.json file in order to make my life easier check it out:

- Starts the server

```
npm run start
```

- Initializes nodemon

```
npm run dev
```

- Run test

```
npm run test
```

- Create our migrations

```
npm run migrate
```

- Creates a new knex migration

```
npm run make
```

- Runs the next chronological migration that has not yet been run.

```
npm run up
```

- Will undo the last migration that was run

```
npm run down
```

- Rolls back the latest migration group

```
npm run rollback
```

- Seeds our database

```
npm run seeds
```

- Creates our API documentation

```
npm run apidoc
```

### 5. Create our database

To create our database we will run:

```
npm run migrate
```

**_Note:_** Check in the data folder for our newly created help_desk.db3 file.

![Make Some Noise!](https://media.giphy.com/media/S8r6dMPZHQfK5gpJwM/giphy.gif)

👏 Yay! we did it. This is our SQL database👏

Now you can view the database with [SQLiteStudio](https://sqlitestudio.pl/)

### 6. Start the server

In development we will initialize nodemon to automatically restarting the node application when file changes and then we will start our server/app

- Initialize nodemon

```
npm run dev && start
```

# Documentation

I have included our API documentation here check it out: <br>
[Bug Tracker API Documentation](https://aesthetic-gecko-506323.netlify.app/)<br><br>

![Good luck Have fun!](https://media.giphy.com/media/W23aKzDl1OFRAcki9z/giphy.gif)

# License

[MIT licensed]()
