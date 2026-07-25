import { useEffect, useState } from "react";

// Reveals `text` one grapheme at a time. Array.from() (not .split(""))
// is grapheme-aware, so multi-code-unit characters like emoji don't get
// split mid-surrogate-pair and render as a broken glyph for a frame.
//
// Driving the reveal in JS instead of a CSS width/steps() animation
// avoids the class of bug where the animation's "100%" width resolves
// against font metrics (monospace + letter-spacing + emoji width) that
// don't line up with the steps() count, permanently clipping the tail
// of the text via overflow: hidden. This always renders the full string.
export function useTypewriter(text, { speed = 90, easeOut = true } = {}) {
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const characters = Array.from(text);
    let index = 0;
    let timeoutId;

    const revealNext = () => {
      index += 1;
      setDisplayText(characters.slice(0, index).join(""));

      if (index >= characters.length) {
        setIsDone(true);
        return;
      }

      // Ease out: reveal slightly slower as it approaches the end,
      // reads more like a natural typing cadence than a linear tick.
      const progress = index / characters.length;
      const delay = easeOut ? speed + progress * speed * 0.6 : speed;
      timeoutId = setTimeout(revealNext, delay);
    };

    setDisplayText("");
    setIsDone(false);
    timeoutId = setTimeout(revealNext, speed);

    return () => clearTimeout(timeoutId);
  }, [text, speed, easeOut]);

  return { displayText, isDone };
}
