import Link from "next/link";
import styles from "./HomeButton.module.scss";
import { Button } from "@/components/ui/Button/Button";
import { HOME_BACK_BUTTON } from "@/constants/route";

export const HomeButton = () => {
  return (
    <div className={styles.container}>
      <Link href={HOME_BACK_BUTTON.ROUTE}>
        <Button
          textColor="gold"
          backgroundColor="tertiary"
          isBorder={true}
          borderColor="gold"
          isRound={true}
        >
          {HOME_BACK_BUTTON.TEXT}
        </Button>
      </Link>
    </div>
  );
};

export default HomeButton;
