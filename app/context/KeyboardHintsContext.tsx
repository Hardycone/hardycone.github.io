"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { isTextEntryKeyboardTarget } from "@/lib/keyboard";

type KeyboardHintsContextValue = {
  showKeyboardHints: boolean;
  pressedShortcut: string | null;
  isTextEntryFocused: boolean;
  flashShortcutHint: (shortcut: string) => void;
};

const KeyboardHintsContext = createContext<KeyboardHintsContextValue | null>(
  null,
);

export function KeyboardHintsProvider({ children }: { children: ReactNode }) {
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [pressedShortcut, setPressedShortcut] = useState<string | null>(null);
  const [isTextEntryFocused, setIsTextEntryFocused] = useState(false);
  const pressedShortcutTimeout = useRef<number | null>(null);
  const pointerPosition = useRef<{ x: number; y: number } | null>(null);

  const flashShortcutHint = useCallback((shortcut: string) => {
    setPressedShortcut(shortcut);

    if (pressedShortcutTimeout.current) {
      window.clearTimeout(pressedShortcutTimeout.current);
    }

    pressedShortcutTimeout.current = window.setTimeout(() => {
      setPressedShortcut(null);
      pressedShortcutTimeout.current = null;
    }, 120);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Tab" ||
        event.key === "Shift" ||
        event.key === "Meta" ||
        event.key === "Control" ||
        event.key === "Alt"
      ) {
        setShowKeyboardHints(false);
        return;
      }

      if (event.repeat || isTextEntryKeyboardTarget(event.target)) {
        setShowKeyboardHints(false);
        return;
      }

      setShowKeyboardHints(true);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      const previousPosition = pointerPosition.current;
      pointerPosition.current = { x: event.clientX, y: event.clientY };

      if (
        previousPosition &&
        (previousPosition.x !== event.clientX ||
          previousPosition.y !== event.clientY)
      ) {
        setShowKeyboardHints(false);
      }
    };

    const updateFocusedTarget = () => {
      const textEntryFocused = isTextEntryKeyboardTarget(
        document.activeElement,
      );
      setIsTextEntryFocused(textEntryFocused);
      if (textEntryFocused) {
        setShowKeyboardHints(false);
      }
    };

    const handleFocusOut = () => {
      window.requestAnimationFrame(updateFocusedTarget);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("focusin", updateFocusedTarget);
    document.addEventListener("focusout", handleFocusOut);
    updateFocusedTarget();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("focusin", updateFocusedTarget);
      document.removeEventListener("focusout", handleFocusOut);

      if (pressedShortcutTimeout.current) {
        window.clearTimeout(pressedShortcutTimeout.current);
      }
    };
  }, []);

  return (
    <KeyboardHintsContext.Provider
      value={{
        showKeyboardHints,
        pressedShortcut,
        isTextEntryFocused,
        flashShortcutHint,
      }}
    >
      {children}
    </KeyboardHintsContext.Provider>
  );
}

export function useKeyboardHints() {
  const context = useContext(KeyboardHintsContext);

  if (!context) {
    throw new Error(
      "useKeyboardHints must be used within KeyboardHintsProvider",
    );
  }

  return context;
}
