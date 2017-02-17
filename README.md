# Erasmus Project - Würzburg-Brno - 2016/2017 - Backend

[![Join the chat at https://gitter.im/Erasmus2016/backend](https://badges.gitter.im/Erasmus2016/backend.svg)](https://gitter.im/Erasmus2016/backend?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Projects website

www.barmania.eu

## Project description

This little project targets primary the international collaboration between German and Czech students.

Projects topic is a web game witch is playable on the web.
The game is designed as a board game where other human players are able to join and play against each other.
During the game, every player will be asked questions about Würzburg's or Brno's culture or history.

This project is split into two parts:

1. The [backend](https://github.com/Erasmus2016/backend) which is developed with Node.js
2. The [frontend](https://github.com/Erasmus2016/frontend) which is developed primary with React.

The communication between this two parts is realized with socket.io.

This documentation targets the technical aspects of the **backend** of this project.

## Architecture

The backend is developed with Node.js @ ECMAScript6.

The questions are stored in a MySQL database.
This project is using the ["mysql"](https://www.npmjs.com/package/mysql) npm package for this database tasks.

```
.
+-- app.js
+-- class
|   +-- controller.js
|   +-- database.js
|   +-- game.js
|   +-- player.js
|   +-- playerList.js
|   +-- question.js
+-- config
+-- field
|   +-- fieldGenerator.js
+-- functions
|   +-- index.js
|   +-- randomNumber.js
|   +-- shuffle.js
|   +-- validator.js
```

The app.js is the point of entry.
This file sets up the backend and triggers the controller class.

All game logic is done in the class subfolders.

**class**-Folder:

_controller.js_ - This class handles the backend business logic for this app.
This is the only class which communicates with the frontend using socket.io

_database.js_ - This class is responsible for the MySQL database queries.

_game.js_ - This class stores the current game round including the playing field (map).

_player.js_ - This class represents a player object with its properties.

_playerList.js_ - This class represents a collection for all connected players for a game.

_question.js_ - This class handles the questions and answers requests.

**config**-Folder:

Stores config files (e.g. for the database connection) as json files.

**field**-Folder:

_fieldGenerator.js_ - This file generates a random playing field.

**functions**-Folder:

_index.js_ - Contains some helper functions like a guid generator or an improved logging functionality. 

_randomNumber.js_ - Generates the dice results for the board game.

_shuffle_ - Shuffles an input array with some elements in order to ensure random ordered values. 

_validator.js_ - Validates all user input for obviously reasons.

## Architecture diagrams

TODO: Add diagrams

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

## Game logic

This part describes, how the game logic is performed:
 
### Game initialization

A game can only be started if there are enough players ready to play. To achieve this, there is a construct called rooms.
A room is a game in which the players are pushed when they join the game.

Every player who navigates to the game web site will see a welcome screen.
This screen lets the player choose the player's name, playing color and questions category.

After a player filled out the form and hit submit, the player is pushed to a game room.
If there is a game room with the same category as the new player selected and there are open slots, the player will automatically pushed in this game room.
Otherwise there will be a new game room.
The backend supports multiple game rooms.

If a room is full (two players by default), the game is ready and about to start.

In this event the backend is pushing the playing field (game map) to all participating players.

### The actual game

This game is a round based game.
This means, at one point of a time, only one player is able to perform an action.

If it's the players turn, the player will have to trigger a _role the dice_ event.
The backend will be notified about this event and triggers a dice result, which will then be send to the player.
**The backend is performing the dice throw - not the frontend.**

The backend is now moving the player's position to the new position.
Now the new player's position is checked and handled, if its a special field.

There are tree kinds of field:
1. Standard fields - nothing happens here.
2. Jumping fields - the player will be moved to the destination field.
3. Question fields - the player will be send a question and appropriate answers object.
The backend is awaiting an answer for this question.

#### Standard field

After the backend has moved the player's position to this kind of field, no further action is performed and the next player's turn starts.

#### Jumping field

If the backend determines that the player's new position is on this kind of field, the backend moves the player to the jumping's destination field.
Then the player's turn is over and the next player's turn start.

#### Question field

For this kind of field the backend triggers a database query in order to get a question object with the multiple-choice answers for this question.
The backend is then sending the player this information and awaits an answer for this question.

In case of the player answers, the backend is checking whether the answer for this question is correct or not.

If the answer is correct, the player's position is moved forward depending on the difficulty of the question.
Whereas a wrong answer (or no answer after 20 seconds) will move the player the appropriate steps back.

After both cases the player's turn ends and its the next player's turn.

### End of the game

A game round comes to an end, if one player reaches the finish.
The first player who achieves this wins the game and all the glory.

That's the end of the game.

## Game rules

This game has a few game rules.
The order of this rules is irrelevant.

1. This is a round based board game.
This means only one player at a time is on him/her turn.
2. The games goal is to finish the game before all other players.
3. Every player starts at the _Start_.
4. The game is finished after the first player reached the _Finish_.
5. At the beginning of a turn the player clicks on the dice in order to perform a dice throw.
6. The player's meeple (token) will be moved to the new position.
The new position is the current position + the dice pips.
7. The game contains different kind of playing fields.
Beside of standard fields (where nothing further happens), there are two kind of special fields.
Jumping fields and question fields. See _Special fields_ for further information.
8. After one player's turn is done the next player's turn starts.


### Special field rules

Beside of standard fields (where nothing further happens), there are two kind of special fields:
Jumping fields and question fields.

#### Jumping field

Jumping fields are fields, where the player will be moved to the jumping destination.
This jump must be performed regardless of a forward or backward jump.

#### Question field

When a player hits a question field the player has to answer a question.

The player has the choice between three different kind of question difficulties: Easy, medium and hard.

All questions are multiple-choice questions with 4 different answers.
The player can only choose one answer.
Every question has only one valid answer.
If the player doesn't reply an answer after 20 seconds, the answer will be classified as wrong.

A valid answer for a question will move the player based on the difficulty forward of the playing field,
whereas a wrong answer will move the player backwards.

Easy questions are more easy than medium questions, but the amount of steps will also be lesser than medium questions.
Hard questions are the most challenging kind of questions with the highest amount of steps, so choose wisely.

## Credits

TODO: Add credits

## License

European Union Public Licence (EUPL)
