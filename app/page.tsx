"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const word = "aeiou";
  const [currentTry, setCurrentTry] = useState(0);
  const [restarter, setRestarter] = useState(false);

  useEffect(() => {
    setCurrentTry(0);
  }, [restarter]);

  const restart = () => {
    setRestarter((prev) => !prev);
  };

  const handleSubmit = () => {
    setCurrentTry((prev) => prev + 1);
  };

  return (
    <main className="container min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-2">
        {[...Array(5)].map((_, idx) => (
          <Row
            key={idx}
            disabled={idx > currentTry}
            onSubmit={handleSubmit}
            active={currentTry === idx}
            restarter={restarter}
            word={word}
          />
        ))}
        <div className="p-0" />
        <div className="flex gap-2">
          <Button className="flex-1" variant="secondary" onClick={restart}>
            Restart
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </main>
  );
}

function Row({
  disabled,
  onSubmit,
  active,
  restarter,
  word,
}: {
  disabled: boolean;
  onSubmit: () => void;
  active: boolean;
  restarter: boolean;
  word: string;
}) {
  const [letters, setLetters] = useState(["", "", "", "", ""]);
  const [focusedLetter, setFocusedLetter] = useState(0);
  const ref = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (active && ref.current?.[focusedLetter]) {
      ref.current?.[focusedLetter]?.focus();
    }
  }, [focusedLetter, active]);

  useEffect(() => {
    setLetters(["", "", "", "", ""]);
    setFocusedLetter(0);
  }, [restarter]);

  const focusNext = () => {
    if (focusedLetter === 4) return;
    setFocusedLetter((prev) => prev + 1);
  };

  const focusPrev = () => {
    if (focusedLetter === 0) return;
    setFocusedLetter((prev) => prev - 1);
  };

  const isInWord = (letter: string) => {
    return !disabled && !active && word.includes(letter) && letter !== "";
  };

  const isAtPosition = (letter: string, idx: number) => {
    if (!disabled && !active) {
      console.log(letter, idx, word, word[idx] === letter);
    }
    return !disabled && !active && word[idx] === letter[0];
  };

  return (
    <div className="flex gap-2">
      {[...Array(5)].map((_, idx) => (
        <Input
          key={idx}
          ref={(el) => (ref.current[idx] = el)}
          className={
            "h-10 w-10 text-center " +
            (isInWord(letters[idx]) ? "border-yellow-500 " : "") +
            (isAtPosition(letters[idx], idx) ? "border-green-500 " : "")
          }
          placeholder={disabled ? "" : "?"}
          disabled={disabled}
          value={letters[idx]}
          onFocus={() => setFocusedLetter(idx)}
          onKeyDown={(e) => {
            const input = e.key;
            if (input === "Enter") {
              onSubmit();
            }
            if (input === "Backspace") {
              setLetters((prev) => {
                const newLetters = [...prev];
                newLetters[idx] = "";
                return newLetters;
              });
              focusPrev();
            }
            if (input === "ArrowRight") {
              focusNext();
            }
            if (input === "ArrowLeft") {
              focusPrev();
            }
            if (input.length !== 1) return;
            let letter = input.charAt(0);
            if (letter <= "Z" && letter >= "A") letter = letter.toLowerCase();
            if (letter <= "z" && letter >= "a") {
              setLetters((prev) => {
                const newLetters = [...prev];
                newLetters[idx] = letter;
                return newLetters;
              });
              focusNext();
            }
          }}
          onChange={(e) => e.preventDefault()}
        />
      ))}
    </div>
  );
}
