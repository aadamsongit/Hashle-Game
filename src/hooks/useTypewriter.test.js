import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypewriter } from "./useTypewriter";

describe("useTypewriter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("eventually reveals the full string, including a leading emoji intact", () => {
    const text = "🚀Hashle: An Evolving Word Game";
    const { result } = renderHook(() => useTypewriter(text, { speed: 10 }));

    // Run well past the time needed for every character to reveal.
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.displayText).toBe(text);
    expect(result.current.isDone).toBe(true);
    // The emoji must survive intact, not split into an unpaired
    // surrogate half — this is the specific failure mode
    // Array.from() (grapheme-aware) avoids that .split("") wouldn't.
    expect(result.current.displayText.startsWith("🚀")).toBe(true);
  });

  it("reveals progressively, not all at once", () => {
    // easeOut disabled here so each step is exactly `speed` ms apart —
    // isolates "does it reveal one character at a time" from the
    // separate easing-curve behavior (covered below).
    const text = "ABCDE";
    const { result } = renderHook(() =>
      useTypewriter(text, { speed: 100, easeOut: false })
    );

    expect(result.current.displayText).toBe("");

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayText).toBe("A");
    expect(result.current.isDone).toBe(false);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayText).toBe("AB");
  });

  it("marks isDone only once every character has been revealed", () => {
    const text = "HI";
    const { result } = renderHook(() =>
      useTypewriter(text, { speed: 10, easeOut: false })
    );

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayText).toBe("H");
    expect(result.current.isDone).toBe(false);

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayText).toBe("HI");
    expect(result.current.isDone).toBe(true);
  });

  it("eases out: later steps take longer than the base speed", () => {
    const text = "ABCDE";
    const { result } = renderHook(() =>
      useTypewriter(text, { speed: 100, easeOut: true })
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayText).toBe("A");

    // The second step's delay is speed + progress*speed*0.6, which is
    // strictly more than `speed` once any progress has been made —
    // so advancing by exactly `speed` again should NOT be enough yet.
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayText).toBe("A");

    // Advancing the rest of the way should get there.
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe("AB");
  });

  it("handles an empty string without hanging or throwing", () => {
    const { result } = renderHook(() => useTypewriter("", { speed: 10 }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.displayText).toBe("");
    expect(result.current.isDone).toBe(true);
  });
});
