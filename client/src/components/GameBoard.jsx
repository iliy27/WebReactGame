import React from "react";
import CardGame from "./CardGame";
import MyButton from "./MyButton";

export default function GameBoard({ cardsCollected, onInsert, hasTried }) {
    return (
        <div className="d-flex flex-row mt-3 gap-3">
            {[...Array(cardsCollected.length + 1)].map((_, idx) => (
                <React.Fragment key={idx}>
                    <MyButton
                        text="INSERT"
                        variant="outline-secondary"
                        size="sm"
                        disabled={hasTried}
                        onClick={() => onInsert(idx)}
                    />
                    {idx < cardsCollected.length && (
                        <CardGame key={cardsCollected[idx].id} card={cardsCollected[idx]} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}