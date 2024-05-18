## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Access API documentation here

  [API DOCUMENTATION](http://localhost:3000/docs)
  

## Connecting to Socket.io 

```
Socket Server URL: ws://localhost:3000/.

Connect to socket server by setting an "authentication" header with value as user jwt token generated after login.\n Subscribe and listen to the following events "TASK_CREATED", "TASK_UPDATED" and "TASK_DELETED"

```
