/**
 * 受け取るデータの型
 */
export interface TextPair {
  kanji: string;
  hiragana: string;
}

/**
 * 生成された文章とローマ字変換の型
 */
export interface Sentence extends TextPair {
  romaji: string[][];
}

/**
 * プロンプトの詳細の型
 */
export interface PromptDetail {
  theme: string;
  category: string;
}

/**
 * 生成結果の型
 */
export interface GeneratorResult {
  pairs: TextPair[];
  theme: string;
  category: string;
}
