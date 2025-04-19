import styles from "./Button.module.scss";
import { Text } from "@/components/ui/Text";
import type { ButtonProps } from "./Button.types";

export const Button = ({
  children,
  textColor = "primary",
  backgroundColor = "primary",
  borderColor = "primary",
  buttonSize = "medium",
  type = "button",
  isDisabled = false,
  isLoading = false,
  isRound = false,
  className = "",
  onClick = () => {},
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles[buttonSize]} ${styles[`${textColor}-text`]} ${
        styles[`${backgroundColor}-background`]
      } ${styles[`${borderColor}-border`]} ${
        isDisabled ? styles.disabled : ""
      } ${isLoading ? styles.loading : ""} ${
        isRound ? styles.round : ""
      } ${className}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
