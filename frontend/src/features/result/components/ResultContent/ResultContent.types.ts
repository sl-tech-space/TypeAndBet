/**
 * タイピング結果のコンテンツの型
 */
export type ResultContentProps = {
  content: string;
  value: number | "-";
  unit: string;
  change: number | "";
  "data-index"?: number;
};
