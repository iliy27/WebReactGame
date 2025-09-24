import axios from 'axios';
const APIURL = 'http://localhost:3001/api';


async function loginUser(username, password) {
    try {
      const response = await axios.post(`${APIURL}/sessions`, {
        username,
        password,
      }, { withCredentials: true }); // Include credentials in the request
      return response.data; // Axios automatically parses JSON
    } catch (error) {
      console.error('Error logging in:', error);
      throw error; // Re-throw the error for further handling
    }
  }

async function getUserInfo(){
  try {
    console.log("In API trying to call get/sessions/current");
    const response = await axios.get(`${APIURL}/sessions/current`, { withCredentials: true });
    return response.data; 
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error; 
  }
}  

async function logoutUser() {
    try {
      const response = await axios.delete(`${APIURL}/sessions/current`, { withCredentials: true });
      return response.status; // Axios automatically parses JSON
    } catch (error) {
      console.error('Error logging out:', error);
      throw error; // Re-throw the error for further handling
    }
}

async function getUserHistory(userId) {
    try {
      const response = await axios.get(`${APIURL}/games/${userId}`, { withCredentials: true });
      return response.data; 
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw error; 
    }
}

async function getInitialCards() {
  try {
    const response = await axios.get(`${APIURL}/initialCards`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching initial cards:', error);
    throw error; 
  }
}

async function drawCard(cardsGenerated) {
  console.log("Drawing card with cardsGenerated:", cardsGenerated);
  try {
    const response = await axios.get(`${APIURL}/card`,
      { headers: { cardsGenerated: JSON.stringify(cardsGenerated)}}
    );
    return response.data; 
  } catch (error) {
    console.error('Error drawing card:', error);
    throw error; 
  }  
}

async function getBadLuckIndex(cardId) {
  try {
    const response = await axios.get(`${APIURL}/cardIndex/${cardId}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching bad luck index:', error);
    throw error; 
  }
}

async function startNewGame(userId) {
  try {
    console.log("calling the server for a new game");
    const response = await axios.get(`${APIURL}/game/${userId}`, { withCredentials: true });
    return response.data; 
  } catch (error) {
    console.error('Error starting new game:', error);
    throw error; 
  }
}

async function saveGame(gameId, status, datePlayed) {
  try {
    console.log("Saving game with ID:", gameId, "Status:", status, "Date Played:", datePlayed);
    const response = await axios.post(`${APIURL}/game/${gameId}`, { status, datePlayed }, { withCredentials: true });
    return response.data; 
  } catch (error) {
    console.error('Error saving game:', error);
    throw error; 
  }

}

async function saveInitialCards(gameId, cardIds) {
  try {
    console.log("Saving initial cards...");
    const response = await axios.post(`${APIURL}/initialCards`, { gameId, cardIds }, { withCredentials: true });
    console.log("Initial cards saved successfully.");
    return response.status; 
  } catch (error) {
    console.error('Error saving initial cards:', error);
    throw error; 
  }
}

async function addPlayedCard(gameId, cardId, roundNumber, result) {
  try {
    const response = await axios.post(`${APIURL}/played_cards`, { gameId, cardId, roundNumber, result}, { withCredentials: true });
    return response.data; 
  } catch (error) {
    console.error('Error adding played card:', error);
    throw error; 
  }
}



export { loginUser, logoutUser, getUserHistory, getInitialCards, drawCard, getBadLuckIndex, startNewGame, saveGame, saveInitialCards, addPlayedCard, getUserInfo };