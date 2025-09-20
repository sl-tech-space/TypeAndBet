import { type ReactNode } from "react";

import type { CommonColor } from "@/types";

export type LabelProps = {
  htmlFor: string;
  color?: CommonColor;
  required?: boolean;
  children: ReactNode;
  className?: string;
};
