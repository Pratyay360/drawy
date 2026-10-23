// "use client";

import { useRealtimeCursors } from "../hooks/realtime-cursor-react";
import { Cursor } from "./cursor";
export const RealtimeCursors = ({
    username,
    awareness,
}: {
    username: string;
    awareness?: import("y-protocols/awareness").Awareness;
}) => {
    const { cursors } = useRealtimeCursors({
        username,
        throttleMs: 30,
        awareness,
    });

    return (
        <>
            {Object.keys(cursors).map((id) => (
                <Cursor
                    key={id}
                    className="fixed transition-transform ease-in-out z-50"
                    style={{
                        transitionDuration: "30ms",
                        top: 0,
                        left: 0,
                        transform: `translate(${cursors[id].position.x}px, ${cursors[id].position.y}px)`,
                    }}
                    color={cursors[id].color}
                    name={cursors[id].user.name}
                />
            ))}
        </>
    );
};