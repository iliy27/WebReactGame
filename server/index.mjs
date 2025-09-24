import express from 'express';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import morgan from 'morgan';
import dayjs from 'dayjs';

import { getUser, getUserByEmail, getCard, getCardBadLuckIndex, registerNewGame, addPlayedCard, addPlayedGame, getPlayedGamesByUserId, getPlayedCardsByGameId, initialCardsAlreadySaved } from './dao.mjs'; // Assuming userDao.mjs exports these functions
import { getRandomIdExcluding, generateThreeRandomIds } from './utils.mjs';

// init express
const app = new express();
const port = 3001;

app.use('/public', express.static('public'));

// middleware
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true,
};

app.use(cors(corsOptions));

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    async function(username, password, done) {
     const user =  await getUser(username, password);
     if(user){
        return done(null, user);
     } else {
        return done(null, false, { message: 'Incorrect username or password.' });
     }
    }
));
  
// serialize and de-serialize the user (user object <-> session)
passport.serializeUser((user, done) => {
  done(null, user.email); // Store only the user's email in the session
});
  
// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((email, done) => {
  console.log("deserializeUser called with email: ", email);
    const user = getUserByEmail(email);
    console.log("User found in deserializeUser: ", user);
    if(user){
        return done(null, user);
    } else {
        done(new Error('User not found during deserialization'));
    }

});
  
// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
      return next();
    
    return res.status(401).json({ error: 'Not authenticated'});
}
  
// set up the session
app.use(session({
    secret: 'hkfc674cxdkytvdfs09',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.authenticate('session'));


/* ROUTES */

// Routes for managing authentication and logout session of the user

app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
      if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
      }
        // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
          
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.status(200).json(req.user);
        });
    })(req, res, next);
  });


app.get('/api/sessions/current', (req, res) => {
  //console.log("Checking current session for user:", req.user);
  if(req.isAuthenticated()) {
    // console.log("User is authenticated:", req.user);
    // If the user is authenticated, send the user info
    return res.status(200).json(req.user);
  } else {
    return res.status(401).json({ error: 'Not authenticated' });
  }
});


app.delete('/api/sessions/current', (req, res) => {
    req.logout( ()=> { res.end(); } );
  });
  
// Routes for cards

app.get('/api/card', (req, res) => {
    let cardsGenerated = [];
    if (req.headers.cardsgenerated) {
        try {
            // Parse the cardsGenerated header to get the array of generated card IDs
            // Assuming the header is a JSON string representation of an array
            // e.g., '["1", "2", "3"]'
            cardsGenerated = JSON.parse(req.headers.cardsgenerated); // TO-DO controllare se questo check ha senso
            //console.log("Cards generated:", cardsGenerated);
            if (!Array.isArray(cardsGenerated)) {
                return res.status(400).json({ error: 'cardsGenerated must be an array.' });
            }
        } catch (e) {
            return res.status(400).json({ error: 'Invalid cardsGenerated header format.' });
        }
    }
    
    const id = getRandomIdExcluding(cardsGenerated);
    if(id === null) {
        return res.status(404).json({ error: 'No more cards available.' });
    }
    const card = getCard(id);
    if(card) {
        return res.status(200).json(card);
    }
    return res.status(404).json({ error: 'Card not found.' });
})

app.get('/api/cardIndex/:id', (req, res) => {
  const id = req.params.id;
  if(!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid card ID.' });
  }
  const cardIndex = getCardBadLuckIndex(id);
  if(cardIndex !== null) {
      return res.status(200).json({ badLuckIndex: cardIndex });
  }
  return res.status(404).json({ error: 'Bad Luck index not found for the card.' });
})

app.get('/api/initialCards', (req, res) => {
    const ids = generateThreeRandomIds();
    if (ids.length !== 3) {
        return res.status(500).json({ error: 'Failed to generate three random card IDs.' });
    }
    const payload = [];
    for (const id of ids) {
        const card = getCard(id);
        const cardIndex = getCardBadLuckIndex(id);
        if (card && cardIndex !== null) {
            payload.push({
                id: card.id,
                situation_name: card.situation_name,
                image: card.image,
                badLuckIndex: cardIndex
            });
        } else {
            return res.status(500).json({ error: `Something went wrong with the generation of the initial cards` });
        }
    }
    payload.sort((a, b) => a.badLuckIndex - b.badLuckIndex);
    return res.status(200).json(payload);
})


// Routes for played_cards

app.post('/api/played_cards', isLoggedIn, (req, res) => {
  const { gameId, cardId, roundNumber, result } = req.body;

  if (!gameId || !cardId || !roundNumber || !result) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (isNaN(gameId) || isNaN(cardId) || isNaN(roundNumber) || (result!== 'won' && result !== 'lost')) {
    return res.status(422).json({ error: 'Game ID, Card ID, and Round Number must be numeric.' });
  }

  const playedCard = {
    gameId,
    cardId,
    roundNumber,
    result
  };

  const id = addPlayedCard(playedCard);
  
  if (id) {
    return res.status(201).json({ message: 'Played card added successfully.', id });
  } else {
    return res.status(500).json({ error: 'Failed to add played card.' });
  }
})

app.post('/api/initialCards', isLoggedIn, (req, res) => {
  //console.log("Saving initial cards...");
  const { gameId, cardIds } = req.body;
  if (!gameId || isNaN(gameId)) {
    return res.status(422).json({ error: 'Invalid game ID' });
  }

  if (!Array.isArray(cardIds) || cardIds.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty card IDs array.' });
  }

  for (const id of cardIds) {
    if (isNaN(id)) {
      return res.status(422).json({ error: 'Card IDs must be numeric.' });
    }
  }

  if(initialCardsAlreadySaved(gameId)) {
    //console.log("Initial cards already saved for game ID:", gameId);
    return res.status(201).json({ message: 'Initial cards already saved for this game.' });
  }  

  for (const id of cardIds) {
    const playedCard = {
      gameId,
      cardId: id,
      roundNumber: 0,
      result: 'initial'
    };
    const playedCardId = addPlayedCard(playedCard);
    if (!playedCardId) {
      return res.status(500).json({ error: 'Failed to save initial cards.' });
    }
  }
  return res.status(201).json({ message: 'Initial cards saved successfully.' });
});

// Routes for played_games

app.get('/api/game/:userId', isLoggedIn, (req, res) => {
  const userId = req.params.userId;
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  const gameId = registerNewGame(userId);
  
  if (gameId) {
    return res.status(200).json({ gameId });
  } else {
    return res.status(500).json({ error: 'Failed to register new game.' });
  }
});

app.post('/api/game/:gameId', isLoggedIn, (req, res) => {
  const gameId = req.params.gameId;
  let { status, datePlayed } = req.body;
  if (!gameId || isNaN(gameId) || !status || !datePlayed) {
    return res.status(400).json({ error: 'Invalid game data.' });
  }

  console.log("Received status:", status);
  if( status !== 'won' && status !== 'lost') {
    return res.status(422).json({ error: 'Status must be either "won" or "lost".' });
  }

  datePlayed = dayjs(datePlayed).format('YYYY/MM/DD'); 
  const result = addPlayedGame(status, datePlayed, gameId);
  if (result) {
    return res.status(201).json({ message: 'Game saved successfully.' });
  }
  return res.status(500).json({ error: 'Failed to save game.' });
});

app.get('/api/games/:userId', isLoggedIn, (req, res) => {
  const userId = req.params.userId;
  if (!userId || isNaN(userId)) {
    return res.status(422).json({ error: 'Invalid user ID.' });
  }

  const playedGames = getPlayedGamesByUserId(userId);
  for (const game of playedGames) {
    const cardsPlayed = getPlayedCardsByGameId(game.id);
    game.cardsPlayed = cardsPlayed; 
    for (const card of game.cardsPlayed) {
      //console.log("Processing card:", card);
      const cardDetails = getCard(card.cardId);
      card.situation_name = cardDetails.situation_name;
      card.image = cardDetails.image;
      card.badLuckIndex = getCardBadLuckIndex(card.cardId);
    }
  }
  
  if (playedGames) {
    return res.status(200).json(playedGames);
  } else {
    return res.status(404).json({ error: 'No played games found for this user.' });
  }
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});