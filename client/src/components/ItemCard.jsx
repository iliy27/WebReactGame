import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Image from "react-bootstrap/Image";

export default function ItemCard({ card }) {
  return (
    <ListGroup.Item>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <b>Situation:</b> {card.situation_name} <br />
          <b>Bad Luck Index:</b> {card.badLuckIndex} <br />
          <b>Round:</b> {card.roundNumber} <br />
          <b>Result:</b>{" "}
          <Badge bg={card.result === "won" ? "success" : card.result === "lost" ? "danger" : "secondary"}>
            {card.result.toUpperCase()}
          </Badge>
          </div>
          {card.image && (
            <div className="mt-2">
              <Image src={`http://localhost:3001/public/images/${card.image}.jpg`} alt={card.situation_name} thumbnail width={150} height={75} />
            </div>
          )}
      </div>
    </ListGroup.Item>
  );
}