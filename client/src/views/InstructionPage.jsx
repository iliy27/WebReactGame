import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import MyButton from "../components/MyButton";
import { useNavigate } from "react-router";
import { FaBullseye, FaRegIdCard, FaGamepad, FaTrophy, FaSkull } from "react-icons/fa";

export default function InstructionPage() {
  const navigate = useNavigate();
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
      <Card className="shadow p-4" style={{ maxWidth: 700, width: "100%" }}>
        <Card.Body>
          <Card.Title as="h1" className="text-center mb-4">Game Instructions</Card.Title>
          
          <h4 className="mb-3"><FaBullseye className="me-2 text-primary" />Objective</h4>
          <p>
            Collect <b>6 cards</b> by correctly guessing where each new situation ranks in terms of bad luck.<br />
            <span className="text-danger">3 wrong guesses</span>, and the game is over!
          </p>

          <h4 className="mb-3"><FaRegIdCard className="me-2 text-warning" />The Cards</h4>
          <ListGroup className="mb-3">
            <ListGroup.Item>A name (e.g., <i>Lost your passport</i>)</ListGroup.Item>
            <ListGroup.Item>An image representing the situation</ListGroup.Item>
            <ListGroup.Item>
              A <b>Bad Luck Index</b> (from 1.0 to 100.0 – higher means worse)
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="text-muted">You won't see the Bad Luck Index of a new card until you earn it!</span>
            </ListGroup.Item>
          </ListGroup>

          <h4 className="mb-3"><FaGamepad className="me-2 text-success" />Game Flow</h4>
          <ol className="mb-3">
            <li>You begin with <b>3 random cards</b>, visible in your hand and already sorted by Bad Luck Index.</li>
            <li>Each round, a new random card is shown (image + name only).</li>
            <li>You must guess where it fits among your current cards in terms of bad luck (30 seconds to decide).</li>
            <li>
              <b>Guess Right?</b> <span className="text-success">✅ You win the card!</span> It’s added to your collection, fully revealed.
            </li>
            <li>
              <b>Guess Wrong?</b> <span className="text-danger">❌ You lose the round!</span> The card is discarded and will not appear again.
            </li>
          </ol>

          <h4 className="mb-3"><FaTrophy className="me-2 text-info" />Game End</h4>
          <ul>
            <li>
              <span className="text-success"><FaTrophy /> You Win</span> if you collect 6 cards total.
            </li>
            <li>
              <span className="text-danger"><FaSkull /> You Lose</span> if you make 3 incorrect guesses.
            </li>
            <li>
              A summary of your game will be shown at the end.
            </li>
          </ul>

          <p className="mt-4 text-center">
            <b>Have fun and may the best player win!</b>
          </p>
          <div className="d-flex justify-content-center mt-4">
            <MyButton text="Start a demo game" variant="dark" size="lg" onClick={() => navigate('/demoGame')} />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}