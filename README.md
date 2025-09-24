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
