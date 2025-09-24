import Container from "react-bootstrap/esm/Container";
import { useNavigate, useParams } from "react-router";
import MyButton from "./MyButton";
import ListGroup from "react-bootstrap/ListGroup";
import { useEffect } from "react";
import { saveGame, startNewGame } from "../API/API.mjs";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";

export default function GameEnded({ gameStatus, cardsCollected, isDemo }) {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { user } = useAuth();


  const saveGameResult = async() => {
     try {
        const response = await saveGame(gameId, gameStatus, dayjs().format("YYYY-MM-DD"));
        console.log("Game result saved:", response);
      } catch (error) {
        console.error("Error saving game result:", error);
      }
  }

  async function prepareNewGame(){
    console.log("Preparing a new game con userId:", user.id);
    const res = await startNewGame(user.id); 
    //console.log("new game id:", res.gameId)
    navigate(`/game/${res.gameId}`); 
  }

  useEffect(() => {
    if (isDemo) return; // If it's demo mode, no need to store the game result
    saveGameResult();
  }
  , []);


  return (
    <Container
      className="d-flex flex-column align-items-center mt-4 p-4 shadow rounded"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
        maxWidth: 800,
      }}
    >
      <h2 className="mb-2" style={{ fontWeight: 700, color: "#343a40" }}>
        {isDemo ? "🎲 Demo Game Summary" : "🏆 Game Summary"}
      </h2>
      <p className="mb-4 text-center" style={{ maxWidth: 500, fontSize: "1.15rem" }}>
        {isDemo ? (
          <span>
            <span style={{ fontWeight: 600, color: "#0d6efd" }}>Thanks for trying the demo mode!</span>
            <br />
            Hope you enjoyed the experience. <br />
            <span style={{ color: "#495057" }}>Log in to play full games and track your history!</span>
          </span>
        ) : gameStatus === "won" ? (
          <span className="text-success fw-bold" style={{ fontSize: "1.2rem" }}>
            🎉 Congratulations! You won the game!
          </span>
        ) : (
          <span className="text-danger fw-bold" style={{ fontSize: "1.2rem" }}>
            😢 Game Over! Better luck next time!
          </span>
        )}
      </p>
      <h3 className="mb-3" style={{ color: "#212529" }}>Your Collected Cards</h3>
      <ListGroup className="mb-4 w-100" style={{ maxWidth: 650 }}>
        {cardsCollected.map((card) => (
          <ListGroup.Item
            key={card.id}
            className="d-flex flex-row align-items-center gap-4"
            style={{
              background: "#fff",
              borderRadius: 10,
              marginBottom: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              border: "1px solid #e0e7ef",
            }}
          >
            <img
              src={`http://localhost:3001/public/images/${card.image}.jpg`}
              alt={card.situation_name}
              style={{
                width: 250,
                height: 170,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #eee",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              }}
            />
            <div>
              <h5 className="mb-1" style={{ fontWeight: 600 }}>{card.situation_name}</h5>
              <div>
                <b>Bad Luck Index:</b>{" "}
                <span style={{ color: "#0d6efd", fontWeight: 500 }}>{card.badLuckIndex}</span>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="d-flex flex-row gap-3">
        {!isDemo && (
          <MyButton
            text="Start a new game"
            variant="dark"
            size="lg"
            onClick={() => prepareNewGame()}
          />
        )}
        <MyButton
          text="Back to Home"
          variant="dark"
          size="lg"
          onClick={() => navigate("/")}
        />
      </div>
    </Container>
  );
}