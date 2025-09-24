import { Card, PlayedCard, PlayedGame, User } from './models.mjs';
import { getCard, getCardBadLuckIndex, getPlayedCardsByGameId, addPlayedCard, getPlayedGamesByUserId, addPlayedGame, getUser, getUserByEmail } from './dao.mjs';


/* test queries for cards */

const card1 = getCard(1);
console.log(card1);

const card1Index = getCardBadLuckIndex(1);
console.log("bad luck index of card1: ", card1Index);

card1.bad_luck_index = card1Index;
console.log(card1);

/* test queries for played_cards */

/*
const card = new PlayedCard(1, 1, 1, "won");
console.log(card);
const id = addPlayedCard(card);
console.log("card successfully inserted with id: ", id);
*/

const card = getPlayedCardsByGameId(1);
console.log("played cards for game 1: ", card);

/* test queries for played_games */

const game1 = getPlayedGamesByUserId(1);
console.log("played games for user 1: ", game1);

/*
const game2 = new PlayedGame(1, "lost", "2023-10-01");
const id = addPlayedGame(game2);
console.log("game successfully inserted with id: ", id);
*/

/* test queries for users */

const user = getUserByEmail("iliyan@mail.com");
console.log("user by email: ", user);
const user1 = await getUser(user.email, "gioco1");
console.log("user1: ", user1);

