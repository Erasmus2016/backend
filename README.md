# Erasmus Project - Würzburg-Brno - 2016/2017 - Backend

[![Join the chat at https://gitter.im/Erasmus2016/backend](https://badges.gitter.im/Erasmus2016/backend.svg)](https://gitter.im/Erasmus2016/backend?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Project description

This little project targets primary the international collaboration between German and Czech students.

Project topic is a web game witch is playable on the web.
The game is designed as a board game where other human player are able to join and play against each other.
During the game, every player will be asked questions about Würzburg's or Brno's culture or history.

This project is split into two parts:
1. The backend which is developed with Node.js
2. The frontend which is developed primary with React.

The communication between this two parts is realized with socket.io.

This documentation targets the technical aspects of the **backend** of this project.

## Architecture

The backend is developed with Node.js @ ECMAScript6.

The questions are stored in a mySQL database.
This project is using the mysql npm package for this database tasks.



```
.
+-- app.js // Point of entry
+-- map.js  // A dummy map for testing purpose
+-- class
|   +-- controller.js
|   +-- database.js
|   +-- game.js
|   +-- player.js
|   +-- question.js
+-- config
+-- field
|   +-- fieldGenerator.js
+-- functions
|   +-- randomNumber.js
|   +-- validator.js
```

The app.js is the point of entry.
This file sets up the backend and triggers the controller class.

All logic is done in the class subfolders.

**class**-Folder:

_controller.js_ - This class handles the backend business logic for this app.
This is the only class which communicates with the frontend using socket.io

_database.js_ - This class is responsible for the mySQL database queries.

_game.js_ - This class stores the current game round including the playing field (map).

_player.js_ - This class represents a player object with its properties.

_question.js_ - This class handles the questions and answers requests.

**config**-Folder:

Stores config files (e.g. for the database connection) as json files.

**field**-Folder:

_fieldGenerator.js_ - This file generates a random playing field.

**functions**-Folder:

_randomNumber.js_ - Generates the dice results for the board game.

_validator.js_ - Validates all user input for obviously reasons.

**node_modules**-Folder:

Stores all required npm packages for this app.

## Communication between backend and frontend

All communication between the backend and the frontend is done via socket.io.

Socket.io is using WebSockets for data transfer between the two parts, this will guarantee fast and instant reactions for the actions.
 
There are multiple actions available:

### Actions from the backend to the frontend

* _login_ - After a game session (currently two players in a game) is ready, all players are notified to show the login screen.
* _available-colors_ - After one player picks a color - all remaining available colors are broadcasted to all players within this game.
* _map_ - After every player is ready the game is about to begin. In this case the backend is pushing the playing field (map) to all players within this game.
* _roll-the-dice_ - When there's a players turn the backend is pushing this information to this player.
* _dice-result_ - When the player triggered the frontend _roll-the-dice_ action, the backend is getting a random dice result und returns this result to the specific player.
* _question_ - If a player requested a question the backend is sending an array with three elements: First the question object, next an answer array with the 4 answers for this question, and last the image (if any or null).
* _player-position_ - After a movement the new position for the current player will be broadcasted to all players.
* _game-over_ - In case of the end of the game, this action will be invoked. The backend is sending the id of the winning player to all players of this game.

### Actions from the frontend to the backend

* _login_ - Receives the player settings (name, color, etc.) from the frontend.
* _roll-the-dice_ - Triggers, if the current user roled the dice. This will trigger the get random dice value function.
* _set-difficulty_ - Receives the players choice for a question difficulty. This will invoke the get question with answers function.
* _answer_ - Gets the current players answer (for a question) from the frontend. This will trigger a check for the correct answer and the player movement.

## Credits

TODO: Add credits

## License

European Union Public Licence (EUPL)