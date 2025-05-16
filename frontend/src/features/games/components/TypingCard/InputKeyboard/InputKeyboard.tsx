"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./InputKeyboard.module.scss";
import { useKeyboard, useTyping } from "@/features/games/hooks";
import type { KeyboardLayout } from "./InputKeyboard.types";
import type { KeydownEvent } from "@/features/games/hooks/keydown.types";
import { TYPE_JUDGE } from "@/constants";

const keyboardLayout: KeyboardLayout = [
  [
    { label: "Esc", code: "Escape" },
    { label: "F1", code: "F1" },
    { label: "F2", code: "F2" },
    { label: "F3", code: "F3" },
    { label: "F4", code: "F4" },
    { label: "F5", code: "F5" },
    { label: "F6", code: "F6" },
    { label: "F7", code: "F7" },
    { label: "F8", code: "F8" },
    { label: "F9", code: "F9" },
    { label: "F10", code: "F10" },
    { label: "F11", code: "F11" },
    { label: "F12", code: "F12" },
    { label: "PrtSc", code: "PrintScreen" },
    { label: "ScrLk", code: "ScrollLock" },
    { label: "Pause", code: "Pause" },
  ],
  [
    { label: "半/全", code: "Zenkaku" },
    { label: "1", code: "Digit1" },
    { label: "2", code: "Digit2" },
    { label: "3", code: "Digit3" },
    { label: "4", code: "Digit4" },
    { label: "5", code: "Digit5" },
    { label: "6", code: "Digit6" },
    { label: "7", code: "Digit7" },
    { label: "8", code: "Digit8" },
    { label: "9", code: "Digit9" },
    { label: "0", code: "Digit0" },
    { label: "-", code: "Minus" },
    { label: "^", code: "Equal" },
    { label: "¥", code: "IntlYen" },
    { label: "BS", code: "Backspace", wide: true },
  ],
  [
    { label: "Tab", code: "Tab", wide: true },
    { label: "Q", code: "KeyQ" },
    { label: "W", code: "KeyW" },
    { label: "E", code: "KeyE" },
    { label: "R", code: "KeyR" },
    { label: "T", code: "KeyT" },
    { label: "Y", code: "KeyY" },
    { label: "U", code: "KeyU" },
    { label: "I", code: "KeyI" },
    { label: "O", code: "KeyO" },
    { label: "P", code: "KeyP" },
    { label: "@", code: "BracketLeft" },
    { label: "[", code: "BracketRight" },
    { label: "Enter", code: "Enter", wide: true },
  ],
  [
    { label: "Caps", code: "CapsLock", wide: true },
    { label: "A", code: "KeyA" },
    { label: "S", code: "KeyS" },
    { label: "D", code: "KeyD" },
    { label: "F", code: "KeyF" },
    { label: "G", code: "KeyG" },
    { label: "H", code: "KeyH" },
    { label: "J", code: "KeyJ" },
    { label: "K", code: "KeyK" },
    { label: "L", code: "KeyL" },
    { label: ";", code: "Semicolon" },
    { label: ":", code: "Quote" },
    { label: "]", code: "Backslash" },
  ],
  [
    { label: "Shift", code: "ShiftLeft", wide: true },
    { label: "Z", code: "KeyZ" },
    { label: "X", code: "KeyX" },
    { label: "C", code: "KeyC" },
    { label: "V", code: "KeyV" },
    { label: "B", code: "KeyB" },
    { label: "N", code: "KeyN" },
    { label: "M", code: "KeyM" },
    { label: ",", code: "Comma" },
    { label: ".", code: "Period" },
    { label: "/", code: "Slash" },
    { label: "\\", code: "IntlRo" },
    { label: "Shift", code: "ShiftRight", wide: true },
  ],
  [
    { label: "Ctrl", code: "ControlLeft" },
    { label: "Win", code: "MetaLeft" },
    { label: "Alt", code: "AltLeft" },
    { label: "無変", code: "Convert" },
    { label: "Space", code: "Space", extraWide: true },
    { label: "変換", code: "NonConvert" },
    { label: "かな", code: "KanaMode" },
    { label: "Alt", code: "AltRight" },
    { label: "Win", code: "MetaRight" },
    { label: "Menu", code: "ContextMenu" },
    { label: "Ctrl", code: "ControlRight" },
  ],
];

export const InputKeyboard = () => {
  const { state, handlers } = useKeyboard();
  const { correctKeys, incorrectKeys, pressedKey } = state;
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [isCallbackRegistered, setIsCallbackRegistered] = useState(false);

  return (
    <div className={styles.keyboardLayout}>
      <div className={styles.keyboard}>
        {/* デバッグ情報 (実際の環境では非表示にする) */}
        {process.env.NODE_ENV === "development" && (
          <div style={{ position: "absolute", top: 0, right: 0, fontSize: "10px", color: "white", background: "rgba(0,0,0,0.5)", padding: "2px 5px", zIndex: 100 }}>
            <div>
              {lastPressedKey || "キー未押下"} ({isCallbackRegistered ? "CB登録済" : "CB未登録"})
            </div>
            <div>
              正解キー: {correctKeys.length > 0 ? correctKeys.join(', ') : "なし"} | 
              不正解キー: {incorrectKeys.length > 0 ? incorrectKeys.join(', ') : "なし"}
            </div>
          </div>
        )}
        
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.keyboardRow}>
            {row.map((key) => (
              <div
                key={key.code}
                className={`${styles.key} ${key.wide ? styles.keyWide : ""} ${
                  key.extraWide ? styles.keyExtraWide : ""
                } ${correctKeys.includes(key.code) ? styles.keyCorrect : ""} ${
                  incorrectKeys.includes(key.code) ? styles.keyIncorrect : ""
                }`}
              >
                {key.label}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputKeyboard;
