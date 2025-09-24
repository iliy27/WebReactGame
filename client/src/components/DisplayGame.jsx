import GameBoard from "./GameBoard";
import { getInitialCards, drawCard, getBadLuckIndex, saveInitialCards, addPlayedCard } from "../API/API.mjs";
import { useState, useEffect, useRef } from "react";
import CardGame from "./CardGame"
import Container from 'react-bootstrap/Container';
import MyButton from "./MyButton";
import GameEnded from "./GameEnded";
import Modal from 'react-bootstrap/Modal';
import { useParams } from "react-router";

const cardsToBeCollected = 6;

export default function DisplayGame({isDemo}) {

    const maxLostCards = isDemo ? 1 : 3; // Maximum number of lost cards allowed, 1 for demo mode, 3 for normal game
    const timerRef = useRef(); // Reference to the value of the timer between renders

    const { gameId } = useParams(); // Get the gameId from the URL parameters

    const [cards, setCards] = useState([]); // State to hold the cards
    const [drawedCard, setDrawedCard] = useState(null); // State to hold the drawn card
    const [lostCards, setLostCards] = useState([]); // State to hold the number of lost cards

    const [loadingDrawedCard, setLoadingDrawedCard] = useState(true); // State to manage loading state for drawn card
    const [loadingCards, setLoadingCards] = useState(true); // State to manage loading state for cards    

    const [timeLeft, setTimeLeft] = useState(30); // State to manage time left for the game
    const [tries, setTries] = useState(0); // State to manage tries left for the game

    const [showNextRoundPrompt, setShowNextRoundPrompt] = useState(false); // State to manage showing next round prompt
    const [gameStatus, setGameStatus] = useState("playing"); // State to manage the game status, can be "playing", "won", or "lost"
    const [gameEnded, setGameEnded] = useState(false); // State to manage if the game has ended

    const [showConfirmModal, setShowConfirmModal] = useState(false); // State to manage showing the confirmation modal
    const [selectedInsertIdx, setSelectedInsertIdx] = useState(null); // State to manage the selected index for inserting a card
    const [hasTried, setHasTried] = useState(false); // State for tracking one try per round

    const [roundNumber, setRoundNumber] = useState(1); // State to manage the current round number
    const [lastRoundResult, setLastRoundResult] = useState(null); // State to manage the last round result


    const gameInit = async () => {
        try {

            setCards([]);
            setLostCards([]);
            setDrawedCard(null);
            setGameStatus("playing");
            setGameEnded(false);
            setTries(0);
            setLastRoundResult(null);
            setShowNextRoundPrompt(false);
            setHasTried(false);
            setTimeLeft(30);

            const initialCards = await getInitialCards();
            
            console.log("Initial cards fetched:", initialCards);
            setCards(initialCards); // Set the fetched cards to state
            const drawedCard = await drawCard(initialCards.map(card => card.id)); // Draw a new card based on the initial cards
            console.log("Drawed card fetched:", drawedCard);
            
            //console.log("before save initial cards");
            console.log(isDemo)
            if(isDemo===undefined) await saveInitialCards(gameId, initialCards.map(card => card.id)); // Save the initial cards
            
            setDrawedCard(drawedCard); 
            setLoadingCards(false); 
            setLoadingDrawedCard(false); 
        } catch (error) {
            console.error("Error fetching initial cards:", error);
        }
    }    

    useEffect(() => {
        // Fetch initial cards when the component mounts
        gameInit();
    }, [gameId]);

    useEffect(() => {

        if(!drawedCard || gameStatus !== "playing") return;

        if(timeLeft > 0){
            timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timerRef.current); // Cleanup timeout on component unmount
        } else {
            handleTimeout();
        }
    }, [drawedCard, timeLeft, gameStatus]);


    function handleTimeout() {
        setLastRoundResult("missed");
        setShowNextRoundPrompt(true);
        setHasTried(true);
        setTries(prev => {
            const newLost = prev + 1;
            if (newLost >= maxLostCards) {
            setGameStatus("lost");
            setGameEnded(true);
            setShowConfirmModal(false);
            }
            return newLost;
        });      
    }


    async function handleInsert(insertIdx) {
        if (!drawedCard || gameStatus !== "playing") return;
    
        let playedResult = "lost";
        const res = await getBadLuckIndex(drawedCard.id); // Always fetch on click

        const badLuckIndex = res.badLuckIndex; // Extract the bad luck index from the response
        //console.log("Bad luck index fetched:", badLuckIndex);

        // Find the correct position for the drawn card
        let correctIdx = cards.findIndex(card => badLuckIndex < card.badLuckIndex);
        if (correctIdx === -1) correctIdx = cards.length; // Insert at end if greater than all
    
        if (insertIdx === correctIdx) {
            setLastRoundResult("won");
            // Insert the card at the correct position
            const newCard = { ...drawedCard, badLuckIndex: badLuckIndex };
            const newCards = [...cards];
            newCards.splice(insertIdx, 0, newCard);
            setCards(newCards);
            playedResult = "won";

            if(isDemo){
                setGameStatus("won");
                setGameEnded(true);
            } else if(newCards.length === cardsToBeCollected){
                setGameStatus("won");
                setGameEnded(true);
                console.log("Game status:", gameStatus, ", game ended:", gameEnded, " the game end");
            } else {
                setShowNextRoundPrompt(true); // Show prompt for next round
            } 

        } else {
            setLastRoundResult("lost");
            setLostCards(prev => [...prev, drawedCard]); // Add the lost card to the lost cards array
            setTries(prev => {
                const newLost = prev + 1;
                if (newLost >= maxLostCards) {
                    setGameStatus("lost");
                    setGameEnded(true);
                    setShowConfirmModal(false);
                }
                return newLost;
            });
            setShowNextRoundPrompt(true); // Show prompt for next round
        }

        if(!isDemo) {
            try {
                //console.log("In handle insert calling the api to add the played card");
                await addPlayedCard(gameId, drawedCard.id, roundNumber, playedResult);
            } catch (error) {
                console.error("Error adding played card:", error);
            }
        }
    }

    async function startNextRound(){
        setShowNextRoundPrompt(false);
        setTimeLeft(30);
        setRoundNumber(prev => prev + 1); // Increment the round number
        setHasTried(false); // Reset the try state for the next round
        const idsWonCards = cards.map(card => card.id); // Get the IDs of the collected cards
        const idsLostCards = lostCards.map(card => card.id); // Get the IDs of the lost cards
        const newCard = await drawCard(idsWonCards.concat(idsLostCards)); // Draw a new card based on the collected and lost cards
        setDrawedCard(newCard);
    }

    function onInsertRequest(idx) {
      if (hasTried) return; // Only allow one try
      setSelectedInsertIdx(idx);
      setShowConfirmModal(true);
    }

    return (
       <Container>
       {gameEnded && gameStatus!=="playing" ? (
            <GameEnded gameStatus={gameStatus} cardsCollected={cards} isDemo={isDemo}/> ) : 
                gameStatus === "playing" && showNextRoundPrompt ? (
            <div className="mt-4 d-flex flex-row align-items-center gap-4 p-3 rounded shadow-sm"
                 style={{ background: "#f8fafc", border: "1px solid #e0e7ef" }}>
              <span style={{ fontSize: "1.15rem" }}>
                {lastRoundResult === "won" && (
                  <span className="text-success fw-bold">
                    🎉 You guessed the position!
                  </span>
                )}
                {lastRoundResult === "lost" && (
                  <span className="text-danger fw-bold">
                    ❌ Wrong position!
                  </span>
                )}
                {lastRoundResult === "missed" && (
                  <span className="text-warning fw-bold">
                    ⏰ Time's up! You didn't play a card.
                  </span>
                )}
                <br />
                <span style={{ color: "#0d6efd" }}>
                  Ready for the next round? <br />
                  <span style={{ color: "#495057" }}>
                    Lost cards: <b>{tries}</b> / <b>{maxLostCards}</b>
                  </span>
                </span>
              </span>
              <MyButton text="Yes, continue!"
                onClick={() => {
                  setLastRoundResult(null);
                  startNextRound();
                }} variant="dark" size="md" style={{ minWidth: 120, fontWeight: 600 }} />
            </div> ):(
            <>
                    {loadingDrawedCard ? (
                        <p>Loading a new card...</p>
                    ) : (
                        drawedCard && <CardGame card={drawedCard} />
                    )}
                    <div>
                        {timeLeft > 0 ? (
                        <div className="d-flex align-items-center gap-2">
                            <span style={{ fontWeight: 600, color: timeLeft <= 5 ? "#dc3545" : "#0d6efd" }}>
                            ⏳ Time left:
                            </span>
                            <span style={{ fontSize: "1.3rem", fontWeight: 700, color: timeLeft <= 5 ? "#dc3545" : "#212529" }}>
                            {timeLeft} s
                            </span>
                            <div style={{ flex: 1 }}>
                            <div
                                style={{
                                height: 8,
                                background: "#e9ecef",
                                borderRadius: 4,
                                overflow: "hidden",
                                marginLeft: 10,
                                marginRight: 10,
                                minWidth: 80,
                                }}
                            >
                                <div
                                style={{
                                    width: `${(timeLeft / 30) * 100}%`,
                                    height: "100%",
                                    background: timeLeft <= 5 ? "#dc3545" : "#0d6efd",
                                    transition: "width 1s linear",
                                }}
                                />
                            </div>
                            </div>
                        </div>
                        ) : null}
                    </div>
                    {loadingCards ? (
                        <p>Loading initial cards...</p>
                    ) : (
                        <GameBoard cardsCollected={cards} onInsert={onInsertRequest} hasTried={hasTried} />
                    )}
            </>
        )}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Your Choice</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to place the card at position {selectedInsertIdx + 1}?
            </Modal.Body>
            <Modal.Footer>
                <MyButton
                text="Cancel"
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
                />
                <MyButton
                text="Confirm"
                variant="dark"
                onClick={async () => {
                    setShowConfirmModal(false);
                    setHasTried(true);
                    await handleInsert(selectedInsertIdx);
                }}
                />
            </Modal.Footer>
        </Modal>
     </Container>    
    )
}