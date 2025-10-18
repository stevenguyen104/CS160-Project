import { useState, useEffect } from "react";

const words = ["cleaner", "faster", "safer"];

export default function TypingEffect() {
    const [displayText, setDisplayText] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [typing, setTyping] = useState(true);
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (typing) {
        if (charIndex < words[wordIndex].length) {
            timeout = setTimeout(() => {
            setDisplayText((prev) => prev + words[wordIndex][charIndex]);
            setCharIndex((prev) => prev + 1);
            }, 150);
        } else {
            timeout = setTimeout(() => setTyping(false), 2500);
        }
        } else {
        if (charIndex > 0) {
            timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
            setCharIndex((prev) => prev - 1);
            }, 100);
        } else {
            setWordIndex((prev) => (prev + 1) % words.length);
            setTyping(true);
        }
        }

        return () => clearTimeout(timeout);
    }, [charIndex, typing, wordIndex]);

    return (
        <h1 style={{ display: "flex", gap: "0.3em" }}>
            <span>Travel</span>
            <span>{displayText}.</span>
        </h1>
    );
}
