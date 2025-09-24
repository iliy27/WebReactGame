import dayjs from 'dayjs';

function Card(id, situation_name, image, bad_luck_index){
    this.id = id;
    this.situation_name = situation_name;
    this.image = image;
    this.bad_luck_index = bad_luck_index;   
}

function PlayedCard(gameId, cardId, roundNumber, result, id){
    if(id) this.id = id;
    this.gameId = gameId;
    this.cardId = cardId;
    this.roundNumber = roundNumber;
    this.result = result;
}

function PlayedGame(userId, status, datePlayed, id){
    if(id) this.id = id;
    this.userId = userId;
    this.status = status;
    this.datePlayed = dayjs(datePlayed).format('YYYY/MM/DD'); 
}

function User(id, name, email){
    this.id = id;
    this.name = name;
    this.email = email;
}

export { Card, PlayedCard, PlayedGame, User };