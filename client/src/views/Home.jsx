import MyButton from "../components/MyButton"
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { startNewGame } from "../API/API.mjs";


export default function Home() {

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  async function prepareNewGame(){
    // Logic to prepare a new game can be added here if needed
    // console.log("Preparing a new game for user: ", user);
    const res = await startNewGame(user.id); // Call the API to start a new game
    navigate(`/game/${res.gameId}`); // Navigate to the new game route
  }


  return (

    isAuthenticated ? (
      <Container fluid className="d-flex flex-column align-items-center justify-content-center text-center mt-5">
        <Card className="shadow p-4" style={{ maxWidth: 600, width: "100%" }}>
          <Card.Body>
            <Card.Title as="h1" className="display-4 mb-3">Welcome back to Stuff Happens!</Card.Title>
            <Card.Text className="mb-4">
              Ready to dive back into the unpredictable world of travel misadventures? Whether you're a seasoned globetrotter or a first-time player,
              this game will have you laughing, cringing, and ranking the most outrageous travel mishaps. Let's see if you can survive the chaos again!
            </Card.Text>
            <div className="d-flex justify-content-center gap-3">
              <MyButton text="Play Now!" variant="dark" size="lg" onClick={prepareNewGame} />
            </div>
          </Card.Body>
        </Card>
      </Container>
    ) :
    <Container fluid className="d-flex flex-column align-items-center justify-content-center text-center mt-5">
      <Card className="shadow p-4" style={{ maxWidth: 600, width: "100%" }}>
        <Card.Body>
          <Card.Title as="h1" className="display-4 mb-3">Welcome to Stuff Happens!</Card.Title>
          <Card.Text className="mb-4">
            Life's a trip… and sometimes, things go hilariously wrong. In this travel-themed card game, you'll face the most unexpected
            (and inconvenient) situations a globetrotter could imagine. From sunburns to lost passports, your goal is to survive the chaos by ranking
            just how bad each misadventure really is. Ready to laugh, cringe, and test your bad luck instincts? Dive in—because in Stuff Happens, the journey is unpredictable,
            and the stuff... well, it definitely happens.
          </Card.Text>
          <div className="d-flex justify-content-center gap-3">
            <MyButton text="Start a demo game" variant="dark" size="lg" onClick={()=>navigate('/demoGame')} />
            <MyButton text="Login" variant="outline-dark" size="lg" onClick={()=>navigate('/login')} />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}