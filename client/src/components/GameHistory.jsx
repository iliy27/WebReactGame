import { getUserHistory } from "../API/API.mjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Card from "react-bootstrap/Card";
import ItemCard from "./ItemCard";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Accordion from "react-bootstrap/Accordion";

export default function GameHistory() {

    const [history, setHistory] = useState([]);
    const userId = useParams().userId;
    const [isLoading, setIsLoading] = useState(false);

    const fetchHistory = async() => {
        try {
          setIsLoading(true);
          const data = await getUserHistory(userId);
          setHistory(data);
          setIsLoading(false);
          //console.log("Game history fetched:", data);
        } catch (error) {
            console.error("Error fetching game history:", error);
        }
    }

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="container mt-5">
            {history.length === 0 ? (
                <p>No games played yet.</p>
            ) : (
                <div>
                    { isLoading ? (<p>Loading...</p>) : (
                    [...history] // a copy of the original state avoiding its mutation
                    .sort((a, b) => new Date(b.datePlayed) - new Date(a.datePlayed))
                    .map((game, index) => (
                        <ListGroup.Item key={game.id} className="mb-3">
                            <Card>
                                <Card.Body>
                                  <Card.Title>
                                    Game #{index + 1}{" "} - Outcome:{" "}
                                    <Badge bg={game.status === "won" ? "success" : "danger"} className="ms-2">
                                      {game.status ? game.status.toUpperCase() : "N/A"}
                                    </Badge>
                                  </Card.Title>
                                  <Card.Subtitle className="mb-2 text-muted">
                                    Date Played: {game.datePlayed ? game.datePlayed : "N/A"}
                                  </Card.Subtitle>
                                  <Card.Text>
                                    Cards Played: <b>{game.cardsPlayed.length}</b>
                                  </Card.Text>
                                  <Card.Text>
                                    Cards Collected: <b>{game.cardsPlayed.filter(c => c.result==='won').length}</b>
                                  </Card.Text>
                                  {game.cardsPlayed.length > 0 && (
                                    <Accordion>
                                      <Accordion.Item eventKey="0">
                                        <Accordion.Header>Show Played Cards</Accordion.Header>
                                        <Accordion.Body>
                                          <ListGroup className="mt-2">
                                            {game.cardsPlayed.map((card, idx) => (
                                              <ItemCard key={idx} card={card}/>
                                            ))}
                                          </ListGroup>
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    </Accordion>
                                  )}
                                </Card.Body>
                            </Card>
                        </ListGroup.Item>
                    )))}
                </div>
            )}
        </div>
    );
}