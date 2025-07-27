"use client";

import { useState } from "react";

import { InputProps } from "@/components/ui/Input/Input.types";

type InputType = InputProps["type"];

/**
 * パスワードの表示/非表示を切り替えるフック
 * @returns パスワードの表示/非表示を切り替えるフック
 */
export const usePasswordVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return {
    isVisible,
    toggleVisibility,
    inputType: isVisible ? ("text" as InputType) : ("password" as InputType),
  };
};

