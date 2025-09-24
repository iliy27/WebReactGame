import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Image from "react-bootstrap/Image";
import { FaQuestion } from "react-icons/fa";

export default function CardGame({ card }){
    return (
        <Card
          style={{
            width: '13rem',
            margin: '0 auto',
            minHeight: 150,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: "0 2px 12px rgba(13,110,253,0.08)",
            borderRadius: 16,
            background: "#f8fafc"
          }}
        >
          <Card.Body
            className="d-flex flex-column align-items-center justify-content-between w-100"
            style={{ flex: 1, padding: "1.2rem" }}
          >
            <Card.Title
              className="mb-3 text-center w-100"
              style={{
                fontWeight: 400,
                fontSize: "1.1rem",
                color: "#000000",
                letterSpacing: "0.5px",
                textShadow: "0 1px 4px rgba(13,110,253,0.08)",
                textTransform: "capitalize",
              }}
            >
              {card.situation_name}
            </Card.Title>
            {card.image && (
              <Image
                src={`http://localhost:3001/public/images/${card.image}.jpg`}
                alt={card.situation_name}
                thumbnail
                width={180}
                height={110}
                className="my-2"
                style={{
                  objectFit: "cover",
                  borderRadius: 10,
                  boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                }}
              />
            )}
            <Card.Text className="mt-3 text-center w-100" style={{ fontSize: "1rem" }}>
              <b>Bad Luck Index:</b>
              <br />
              <Badge bg="danger" style={{ fontSize: "1.1rem", padding: "0.5em 1em" }}>
                {card.badLuckIndex ? card.badLuckIndex : <FaQuestion />}
              </Badge>
            </Card.Text>
          </Card.Body>
        </Card>
    );    
}