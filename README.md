# 🌟 Stuff Happens – A React Web Application Based on a Card Minigame
This project is a React-based web application that I built to practice working with React concepts like components, state management, and hooks, while also experimenting with a simple client–server architecture.

The game itself is a small card minigame inspired by Stuff Happens:
- The frontend is built with React (JavaScript) to provide a clean and user-friendly interface.
- The backend is a lightweight Express.js server with around 10 routes and a small SQLite database for storing and retrieving data.
- The client and server communicate over JSON APIs.
- Both are designed to run locally, with the client connecting to the server running on localhost.

> NOTE: if you want to try the app, just clone the repo, install dependencies for both the client and the server, then start first the server and then, in a separate terminal, the client.

This setup gave me the opportunity to practice full-stack development in a React + Express + SQLite stack, while building something interactive and fun.

## Game Rules
For this project, I’m building a web-based game where players face off against the computer in a series of rounds. The idea is simple but fun: each player collects a set of 6 cards, where every card represents a “horrible situation.”

I designed a deck of at least 50 unique cards, each one with:
- A title describing the situation (e.g., “your swimsuit slips off in a public pool” or “a shark attacks you and you lose a leg”)
- A representative image
- A bad luck index (from 1 = “not too bad” up to 100 = “why me?!”)

Every card has a unique index, with a minimum gap of 0.5 between values, so no two cards are too close. For the theme of my deck, I chose travel and tourism, so all the horrible situations are related to that.


**How the Game Works**

The game starts by giving the player 3 random cards (fully revealed, including names, images, and indexes). Then, each round, the computer generates a new horrible situation card. The player sees the name and image of the new card, but not its index. The challenge: the player must guess where this new card fits into their current lineup of cards, based on the bad luck index. For example, if their cards are 1.5, 42.5, and 99, and they see the new situation, they might guess that it falls between 42.5 and 99. If the player places it correctly within 30 seconds, they win that card, and the full details (including the index) are revealed and added to their set. If they guess wrong or run out of time, the card is discarded and won’t appear again in that game. The game ends when: the player collects 6 cards → they win 🎉 OR they miss 3 rounds → they lose ❌. Between rounds, the game shows feedback (win/loss of the round) and waits for the player to confirm before moving on.


**User Types**

Registered users can play full games until completion (win or loss). They also get a personal game history in their profile. Anonymous visitors can only play a demo game (one round, starting with 3 cards). They also have access to the instructions page, but not game history.


**End of Game & Replay**

At the end of any game (full or demo), the app shows a summary of the player’s collected cards — with the situation names, images, and indexes revealed. From there, the player can easily start a new game.

**Schreenshots of the app**

<img width="1439" height="812" alt="Image" src="https://github.com/user-attachments/assets/153de95f-c962-4681-8eec-04188fa960c8" />
<img width="1440" height="810" alt="Image" src="https://github.com/user-attachments/assets/ee2067e4-a7e5-453e-88fe-129ced52bb73" />
<img width="1440" height="810" alt="Image" src="https://github.com/user-attachments/assets/fc49db1e-1f93-4841-842b-c3320e359e02" />

## React Client Application Routes

- Route `/`: home page for introduction to the website, depending on whether the user is authenticated or not, what is showed can change.
- Route `/instructions`: page used for describing the game rules to the user, it can be accessed without authentication.
- Route `/login`: this page allows the user to login on the website through a simple form.
- Route `/profile/:userId`: page that contains the user information, identified by its id, and the games history 
- Route `/game/:gameId`: page for displaying the game in full mode, so only for authenticated users. 
- Route `/demoGame`: page for displaying the game in demo mode, any user can play a demo game.
- Route `*`: any other route inside the react-app, simply shows a "404 Not Found". 

## API Server

- POST `/api/sessions`
  - request parameters: username and password of the user who is trying to authenticate on the server
  - response body content: the user information
- GET `/api/sessions/current`
  - requires the session cookie
  - response body content: the user information  
- DELETE `/api/session/current`
  - requires the session cookie
  - response body content: a status code
- GET `/api/card`
  - request body content: a cardsGenerated list is requested to track all the cards already used in the game
  - response body content: a card extracted, randomly and excluding those cards already generated, from the database without the bad luck index
- GET `/api/cardIndex/:id`
  - request parameters: the id for the card that is needed to know its bad luck index
  - response body content: the bad luck index of the target card
- GET `/api/initialCards`
  - request parameters: none
  - response body content: a list of three cards extracted randomly and ordered by bad luck index
- POST `/api/played_card`
  - request body content: gameId, cardId, roundNumber and result used to store in the database the played card
  - response body content: a feedback message with status code
- POST `/api/initialCards`
  - request body content: gameId and a list of cardIds used to store in the database the three initial cards as played cards marked with result: "initial"
  - response body content: a feedback message with status code
- GET `/api/game/:userId`
  - request parameters: the userId who is requesting to start a new game
  - response body content: the new gameId created for a specific game
- POST `/api/game/:gameId`
  - request parameters: gameId used to store in the database the information about the played game
  - request body content: status and datePlayed of the game to be save
  - response body content: a feedback messsage with status code
- GET `/api/games/:userId`
  - request parameters: the userId who is requesting to retrieve his games history
  - response body content: a list of playedGames contaning for each game the information about how the game was ended and all the cards played with the results obtained in each round.

NOTE: each API endpoint perfroms a validity check on the incoming parameters (from the header/body) and based on what is computed from the server it returns an appropriate status code, in addition to what is needed to be returned to the client.  

## Database Tables

- Table `cards` - contains 50 cards used for the game (id, situation_name, img, bad_luck_index)
- Table `played_cards` - contains the cards played during a game (id, gameId, cardId, roundNumber, result). result can be one among: won, lost, initial
- Table `played_games` - contains the games played by the authenticated users (id, userId, status, datePlayed). status can be one among: won, lost or NULL (the last one for unterminated games), the datePlayed can also be NULL if the user has not complete the game. 
- Table `users` - contains the basic information for managing users and authentication (id, name, email, password, salt)

## Main React Components

- 6 view pages: `Home` (in `Home.jsx`), `InstructionPage` (in `InstructionPage.jsx`), `Profile` (in `Profile.jsx`), `Game` (in `Game.jsx`), `AuthPage` (in `AuthPage.jsx`), `DefaultLayout` (in `DefaultLayout.jsx`).
 Each page has it's own responsability for showing a particular type of information. For example the Game page contains all the components for managing the game (also the demo mode), the Profile page shows user information and games history and the AuthPage is in charge to handle the login procedure of the user. The other pages simply show basic and static information.

- Components used for a game: `Display the game` (in `DisplayGame.jsx`) handles all the main logic for managing the game such as calling the APIs for retrieve and store the cards from the server, checking some conditions during the round game and displaying the following components: The `new drawed card` (in `CardGame.jsx`) at each round, the `Game board` (in `GameBoard.jsx`) containing all the cards obtained by the player and the buttons used for placing the card in the desired position. It's a component that initially contains three `CardGame.jsx` and each time a new card is won, this component renders the new number of `CardGame.jsx` on the board. Finally a component is used only at the `End of the game` (in `GameEnded.jsx`) to show the game summary.

- Components used for the user profile page: A `History of the games` (in `GameHistory.jsx`) component which retrieves the played games of the user and displays the information about the game. For each game there is an `Item containing the played card information` (in `ItemCard.jsx`) such as if the card was collected and in which round, its basic data containing the situtation name, the image and the bad luck index.

- General components: `Navigation Bar` (in `NavHeader.jsx`) used to allow the user to navigate between the home page, the instruction page and the profile page (if authenticated) . `Protected routes` (in `ProtectedRoute.jsx`) are used to allow the user to access in some routes of the app that require authentication. A `General Button` (in `MyButton.jsx`) used for displaying a standard button in the app with some functional behaviours based on the props passed to the component.

- A context component: `Authentication Context` (in `AuthContext.jsx`) used to store all the information about the authenticated user and provides methods to call the APIs for handle the authentication. This component wraps the entier `React application` (in `App.jsx`) in order to have the possibility on each sub-component to access the authentication context and perform some operations based on the fact that the user is authenticated or not. 

## Users Credentials

- username: iliyan@mail.com password: gioco1
- username: prof@mail.com password: gioco2
- username: bot@mail.com password: gioco3
