import Container from 'react-bootstrap/Container';
import { useState } from "react";
import MyButton from "../components/MyButton";
import DisplayGame from '../components/DisplayGame';


export default function Game({isDemo}) {

    const [playDemo, setPlayDemo] = useState(false);

    return ( 
        isDemo==true ? (
        // handle the game mode in demo
        <Container className="d-flex flex-column align-items-center mt-3">
            <h2>Demo Mode</h2>
            { playDemo ? (
                <DisplayGame isDemo />
            ) : (
            <>
        <Container className="d-flex flex-column align-items-center justify-content-center mt-5 p-4 shadow rounded" style={{
                minHeight: '50vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
                maxWidth: 600,
            }}
            >
            <h2 className="mb-3" style={{ color: "#343a40", fontWeight: 700 }}>
                🎲 Try the Demo!
            </h2>
            <p
                className="text-center mb-4"
                style={{
                fontSize: "1.15rem",
                color: "#495057",
                lineHeight: 1.6,
                background: "rgba(255,255,255,0.7)",
                borderRadius: 12,
                padding: "1rem",
                }}
            >
                Welcome to <b>Stuff Happens</b> demo mode!<br />
                <span style={{ color: "#0d6efd" }}>Start with 3 random cards</span> and try to guess where a new situation fits based on its unseen bad luck index.<br /><br />
                Want the full experience with <b>multiple rounds</b> and <b>game history</b>?<br />
                <span style={{ color: "#198754" }}>Log in after this round!</span>
            </p>
            <MyButton
                onClick={() => setPlayDemo(true)}
                variant="dark"
                text="Play Demo"
                size="lg"
                style={{ minWidth: 180, fontWeight: 600, fontSize: "1.1rem" }}
            />
        </Container>
            </>
            )}
        </Container>    
        ) : (
        // handle the game mode in normal play
        <Container className='d-flex flex-column align-items-center mt-3'>
            <h2>Stuff Happens Game</h2>
            <DisplayGame />
        </Container>
        )
    );
}