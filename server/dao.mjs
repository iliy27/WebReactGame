import Database from "better-sqlite3";
import { Card, PlayedCard, PlayedGame, User } from './models.mjs';
import crypto from 'crypto';

const db = new Database("./stuffHappens.sqlite");
/*
    Since we are using better-sqlite3, so a version of sqlite which allows us
    to write queries in a non-asynchronous way, we can use the following
    pragma to set the journal mode to WAL (Write-Ahead Logging). This allows
    for better concurrency and performance in our application.
    Instead of writing directly into the database, changed are first written
    in a separate file and then applied to the database.
*/
db.pragma("journal_mode = WAL");


/* cards queries */

export const getCard = (id) => {
    const query = "SELECT id, situation_name, image FROM cards WHERE id = ?";
    const stmt = db.prepare(query);
    const row = stmt.get(id);
    if (row) {
        return new Card(row.id, row.situation_name, row.image);
    } else {
        return null;
    }
}

export const getCardBadLuckIndex = (id) => {
    const query = "SELECT bad_luck_index FROM cards WHERE id = ?";
    const stmt = db.prepare(query);
    const row = stmt.get(id);
    if (row) {
        return row.bad_luck_index;
    } else {
        return null;
    }
}

/* played_cards queries */

export const getPlayedCardsByGameId = (gameId) => {
    const playedCards = [];
    const query = "SELECT gameId, cardId, roundNumber, result FROM played_cards WHERE gameId = ?";
    const stmt = db.prepare(query);
    const rows = stmt.all(gameId);
    for (const row of rows) {
        playedCards.push(new PlayedCard(row.gameId, row.cardId, row.roundNumber, row.result));
    }
    return playedCards;
}

export const addPlayedCard = (playedCard) => {
    const query = "INSERT INTO played_cards (gameId, cardId, roundNumber, result) VALUES (?, ?, ?, ?)";
    const stmt = db.prepare(query);
    const res = stmt.run(playedCard.gameId, playedCard.cardId, playedCard.roundNumber, playedCard.result);
    return res.lastInsertRowid;
}

export const initialCardsAlreadySaved = (gameId) => {
    const query = "SELECT COUNT(*) as count FROM played_cards WHERE gameId = ?";
    const stmt = db.prepare(query);
    const row = stmt.get(gameId);
    return row.count > 0; // Returns true if there are any played cards for the gameId
}

/* played_games queries */

export const getPlayedGamesByUserId = (userId) => {
    const playedGames = [];
    const query = "SELECT id, userId, status, datePlayed FROM played_games WHERE userId = ?";
    const stmt = db.prepare(query);
    const rows = stmt.all(userId);
    for (const row of rows) {
        playedGames.push(new PlayedGame(row.userId, row.status, row.datePlayed, row.id));
    }
    return playedGames;
}

export const registerNewGame = (userId) => {
    const query = "INSERT INTO played_games (userId) VALUES (?)";
    const stmt = db.prepare(query);
    const res = stmt.run(userId);
    return res.lastInsertRowid;
}

export const addPlayedGame = (status, datePlayed, id) => {
    const query = "UPDATE played_games SET status = ?, datePlayed = ? WHERE id = ?";
    const stmt = db.prepare(query);
    const res = stmt.run(status, datePlayed, id);
    return res.changes > 0; // Returns true if the update was successful
}

/* users queries

   users stored in the db: 
   name: iliyanPlayer, email: iliyan@mail.com, password: gioco1
   name: profPlayer, email: prof@mail.com, password: gioco2
   name: botPlayer, email: bot@mail.com, password: gioco3   
*/


export const getUser = (email, password) => {
  const row = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  if (row) {
    const user = { id: row.id, name: row.name, email: row.email };
    const salt = row.salt;

    // Convert the stored password to a Buffer
    const storedPasswordHex = Buffer.from(row.password, 'hex');

    // Return a Promise to handle async behavior
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
        if (err) return reject(err);

        // Compare the hashed password with the stored password
        if (crypto.timingSafeEqual(storedPasswordHex, hashedPassword)) {
          console.log('Password match!');
          resolve(new User(user.id, user.name, user.email,));
        } else {
          console.log('Password does not match!');
          resolve(null);
        }
      });
    });
  }
  return Promise.resolve(null); // User not found
};

export const getUserByEmail = (email) => {
    const row = db.prepare('SELECT id, name, email FROM users WHERE email=?').get(email);
    if(row){
        return new User(row.id, row.name, row.email);
    } 
    return null;
}







