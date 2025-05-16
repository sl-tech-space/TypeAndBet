/**
 * タイピングのTrie構造を実装するユーティリティ
 */

/**
 * Trieノードの型定義
 */
export interface TrieNode {
  // キーは次の文字、値は次のノード
  children: Map<string, TrieNode>;
  // このノードが単語の終端を表すかどうか
  isEndOfWord: boolean;
  // パターンのインデックス（複数パターンがある場合）
  patternIndices: number[];
  // 現在のローマ字単位（"ko", "n", "ni"など）
  romajiUnit: string;
  // 現在の文字位置
  charIndex: number;
}

/**
 * Trieツリーを作成するクラス
 */
export class RomajiTrie {
  root: TrieNode;
  patterns: string[][]; // 参照用にパターン配列を保持

  constructor() {
    this.root = this.createNode("", -1, -1);
    this.patterns = [];
  }

  /**
   * 新しいTrieノードを作成する
   */
  private createNode(
    romajiUnit: string = "",
    charIndex: number = -1,
    patternIndex: number = -1
  ): TrieNode {
    const node: TrieNode = {
      children: new Map(),
      isEndOfWord: false,
      patternIndices: patternIndex >= 0 ? [patternIndex] : [],
      romajiUnit,
      charIndex,
    };
    return node;
  }

  /**
   * ローマ字パターンをTrieに挿入する
   * @param patterns ローマ字パターンの配列 (例: [["ko", "n", "ni", "chi", "wa"], ...])
   */
  insertPatterns(patterns: string[][]): void {
    this.patterns = patterns; // パターン配列を保存
    patterns.forEach((pattern, patternIndex) => {
      this.insertPattern(pattern, patternIndex);
    });
  }

  /**
   * 単一のローマ字パターンをTrieに挿入する
   * @param pattern ローマ字パターン (例: ["ko", "n", "ni", "chi", "wa"])
   * @param patternIndex パターンのインデックス
   */
  private insertPattern(pattern: string[], patternIndex: number): void {
    // 各文字位置ごとに処理
    for (let charIndex = 0; charIndex < pattern.length; charIndex++) {
      const romajiUnit = pattern[charIndex];

      // 文字位置に対応するサブツリーの根ノードを見つけるか作成
      let charNode = this.findOrCreateCharNode(this.root, charIndex);

      // ローマ字単位を1文字ずつTrieに追加
      this.insertRomajiUnit(charNode, romajiUnit, charIndex, patternIndex);
    }
  }

  /**
   * 特定の文字位置に対応するノードを見つけるか作成する
   */
  private findOrCreateCharNode(node: TrieNode, charIndex: number): TrieNode {
    // 特別なキーを使って文字位置に対応するノードを管理
    const charKey = `#${charIndex}`;

    if (!node.children.has(charKey)) {
      node.children.set(charKey, this.createNode("", charIndex, -1));
    }

    return node.children.get(charKey)!;
  }

  /**
   * ローマ字単位（"ko", "n", "ni"など）を1文字ずつのノードに分解してTrieに挿入
   * @param node 親ノード
   * @param romajiUnit ローマ字単位 (例: "ko")
   * @param charIndex 文字位置
   * @param patternIndex パターンのインデックス
   */
  private insertRomajiUnit(
    node: TrieNode,
    romajiUnit: string,
    charIndex: number,
    patternIndex: number
  ): void {
    let current = node;

    // ローマ字単位全体をパスとして保存
    // これによりsya/shaのような異なる表記を効率的に扱える
    if (!current.children.has(romajiUnit)) {
      const unitNode = this.createNode(romajiUnit, charIndex, patternIndex);
      unitNode.isEndOfWord = true;
      current.children.set(romajiUnit, unitNode);
    } else {
      // 既存ノードにパターンインデックスを追加
      const existingNode = current.children.get(romajiUnit)!;
      if (!existingNode.patternIndices.includes(patternIndex)) {
        existingNode.patternIndices.push(patternIndex);
      }
    }

    // 各文字ごとにもノードを作成（部分一致検索用）
    let prefix = "";
    for (let i = 0; i < romajiUnit.length; i++) {
      const char = romajiUnit[i];
      prefix += char;

      if (!current.children.has(prefix)) {
        const prefixNode = this.createNode(prefix, charIndex, patternIndex);
        // 最後の文字の場合のみ終端としてマーク
        prefixNode.isEndOfWord = i === romajiUnit.length - 1;
        current.children.set(prefix, prefixNode);
      } else {
        // 既存ノードにパターンインデックスを追加
        const existingNode = current.children.get(prefix)!;
        if (!existingNode.patternIndices.includes(patternIndex)) {
          existingNode.patternIndices.push(patternIndex);
        }
        // 最後の文字なら終端としてマーク
        if (i === romajiUnit.length - 1) {
          existingNode.isEndOfWord = true;
        }
      }

      current = current.children.get(prefix)!;
    }
  }

  /**
   * 入力履歴と現在位置に基づいて、有効なパターンのインデックスを返す
   * @param inputHistory 入力履歴の配列
   * @param currentIndex 現在の文字単位のインデックス
   * @param patternFilter 検索対象のパターンインデックス（指定しない場合は全パターン）
   * @returns 有効なパターンのインデックスの配列
   */
  findValidPatterns(
    inputHistory: string[],
    currentIndex: number,
    patternFilter?: number[]
  ): number[] {
    // 検索対象のパターン
    const targetPatterns =
      patternFilter ||
      Array.from({ length: this.patterns.length }, (_, i) => i);

    // 入力履歴が空の場合は指定されたパターンが全て有効
    if (inputHistory.length === 0) {
      return targetPatterns;
    }

    const inputString = inputHistory.join("");

    // 現在の文字位置のノードを取得
    const charNode = this.findCharNode(this.root, currentIndex);
    if (!charNode) return [];

    // 入力文字列に基づいてマッチするノードを探す
    const matchingNodes = this.findMatchingNodes(charNode, inputString);

    // マッチするノードがない場合は早期リターン（一致するパターンなし）
    if (matchingNodes.length === 0) {
      return [];
    }

    // マッチするノードからパターンインデックスを収集
    const validIndices = new Set<number>();

    for (const node of matchingNodes) {
      // 完全一致か部分一致かを確認
      const isExactMatch = node.romajiUnit === inputString;
      const isPartialMatch = node.romajiUnit.startsWith(inputString);

      // 完全一致または部分一致の場合のみパターンを有効とする
      if (isExactMatch || isPartialMatch) {
        // ノードのパターンインデックスから、指定されたパターンフィルタに含まれるものだけを追加
        node.patternIndices
          .filter((idx) => targetPatterns.includes(idx))
          .forEach((idx) => validIndices.add(idx));
      }
    }

    return Array.from(validIndices);
  }

  /**
   * 入力履歴に基づいて、次に入力可能な文字の配列を返す
   * @param inputHistory 入力履歴の配列
   * @param currentIndex 現在の文字単位のインデックス
   * @param patternFilter 検索対象のパターンインデックス（指定しない場合は全パターン）
   * @returns 次に入力可能な文字の配列
   */
  getNextPossibleChars(
    inputHistory: string[],
    currentIndex: number,
    patternFilter?: number[]
  ): string[] {
    // まず有効なパターンを検索（特定のパターンのみを対象にする）
    const validPatterns = patternFilter
      ? patternFilter
      : this.findValidPatterns(inputHistory, currentIndex);

    if (validPatterns.length === 0) {
      return []; // 有効なパターンがない場合は空配列
    }

    const inputString = inputHistory.join("");

    // 入力履歴が空の場合、現在の文字位置の最初の文字を有効パターンから収集
    if (inputString === "") {
      return this.getFirstCharsOfCharIndex(currentIndex, validPatterns);
    }

    // 現在の文字位置のノードを取得
    const charNode = this.findCharNode(this.root, currentIndex);
    if (!charNode) return [];

    // 入力文字列に基づいてマッチするノードを探す
    const matchingNodes = this.findMatchingNodes(charNode, inputString);

    // マッチするノードがない場合は空配列を返す（無効な入力）
    if (matchingNodes.length === 0) {
      return [];
    }

    // 次の可能な文字を収集
    const nextChars = new Set<string>();

    for (const node of matchingNodes) {
      // このノードが有効なパターンに含まれているか確認
      const hasValidPattern = node.patternIndices.some((idx) =>
        validPatterns.includes(idx)
      );
      if (!hasValidPattern) continue;

      // 入力が現在のノードの完全な文字列と一致する場合
      if (node.romajiUnit === inputString) {
        // このノードの子ノードから次の文字を収集
        for (const [key, childNode] of node.children.entries()) {
          // 子ノードも有効なパターンに属しているか確認
          const childHasValidPattern = childNode.patternIndices.some((idx) =>
            validPatterns.includes(idx)
          );
          if (!childHasValidPattern) continue;

          if (
            key !== inputString &&
            key.startsWith(inputString) &&
            key.length > inputString.length
          ) {
            const nextChar = key[inputString.length];
            nextChars.add(nextChar);
          }
        }
      }
      // 入力が部分的に一致する場合
      else if (node.romajiUnit.startsWith(inputString)) {
        // 次の文字を追加
        if (node.romajiUnit.length > inputString.length) {
          nextChars.add(node.romajiUnit[inputString.length]);
        }
      }
    }

    return Array.from(nextChars);
  }

  /**
   * 特定の文字位置における最初の文字をすべて取得
   * @param charIndex 文字位置
   * @param validPatterns 有効なパターンのインデックス（指定しない場合は全パターン）
   */
  private getFirstCharsOfCharIndex(
    charIndex: number,
    validPatterns?: number[]
  ): string[] {
    const charNode = this.findCharNode(this.root, charIndex);
    if (!charNode) return [];

    const firstChars = new Set<string>();

    for (const [key, node] of charNode.children.entries()) {
      // 特別なキーでないものだけを対象に
      if (!key.startsWith("#") && key.length > 0) {
        // このノードが有効なパターンに含まれているか確認
        if (validPatterns) {
          const hasValidPattern = node.patternIndices.some((idx) =>
            validPatterns.includes(idx)
          );
          if (!hasValidPattern) continue;
        }

        firstChars.add(key[0]);
      }
    }

    return Array.from(firstChars);
  }

  /**
   * 特定の文字位置に対応するノードを見つける
   */
  private findCharNode(node: TrieNode, charIndex: number): TrieNode | null {
    const charKey = `#${charIndex}`;
    return node.children.has(charKey) ? node.children.get(charKey)! : null;
  }

  /**
   * 入力文字列にマッチするノードを見つける
   */
  private findMatchingNodes(node: TrieNode, inputString: string): TrieNode[] {
    const matchingNodes: TrieNode[] = [];

    // 正確に一致するノードを探す
    if (node.children.has(inputString)) {
      matchingNodes.push(node.children.get(inputString)!);
      return matchingNodes; // 正確な一致があれば、それを優先して返す
    }

    // 正確な一致がない場合のみ、部分一致を探す
    for (const [key, childNode] of node.children.entries()) {
      // 特殊なキー（#で始まるもの）は無視
      if (key.startsWith("#")) continue;

      // 入力が先頭部分に一致するノードを探す（例: input="na", key="natsu"）
      if (key.startsWith(inputString)) {
        matchingNodes.push(childNode);
      }
      // 入力の先頭部分がノードに一致する場合（例: input="natsu", key="na"）
      else if (inputString.startsWith(key) && childNode.isEndOfWord) {
        // 単語の終端である場合のみ追加（例: "sh"は"sha"の一部として有効）
        matchingNodes.push(childNode);
      }
    }

    return matchingNodes;
  }

  /**
   * 入力履歴に基づいて、入力が有効かどうかを判定
   * @param inputHistory 入力履歴の配列
   * @param currentIndex 現在の文字単位のインデックス
   * @returns 入力が有効かどうか
   */
  isValidInput(inputHistory: string[], currentIndex: number): boolean {
    const validPatterns = this.findValidPatterns(inputHistory, currentIndex);
    return validPatterns.length > 0;
  }

  /**
   * 入力が特定のローマ字単位を完了したかどうかをチェック
   * @param inputString ユーザーの入力文字列
   * @param currentIndex 現在の位置
   * @param patternFilter 検索対象のパターンインデックス（指定しない場合は全パターン）
   * @returns 入力が完了したかどうか
   */
  isInputComplete(
    inputString: string,
    currentIndex: number,
    patternFilter?: number[]
  ): boolean {
    // 現在の文字位置のノードを取得
    const charNode = this.findCharNode(this.root, currentIndex);
    if (!charNode) return false;

    // パターンフィルターを適用
    const targetPatterns =
      patternFilter ||
      Array.from({ length: this.patterns.length }, (_, i) => i);

    // 入力が完全に一致するノードを優先的に確認
    if (charNode.children.has(inputString)) {
      const node = charNode.children.get(inputString)!;

      // そのノードが終端であり、かつ対象パターンに含まれるか確認
      if (
        node.isEndOfWord &&
        node.patternIndices.some((idx) => targetPatterns.includes(idx))
      ) {
        return true;
      }
    }

    // 完全一致がない場合は、有効なパターンを探す
    // これにより「sha」と「sya」のような代替表記も許容する
    const validPatterns = this.findValidPatterns(
      [inputString],
      currentIndex,
      targetPatterns
    );

    // 有効なパターンがあれば、それぞれのパターンでこの位置の文字を確認
    for (const patternIndex of validPatterns) {
      const pattern = this.patterns[patternIndex];
      if (pattern && pattern[currentIndex] === inputString) {
        return true;
      }
    }

    return false;
  }

  /**
   * 特定の文字位置における全ての可能なローマ字ユニットを取得
   * @param charIndex 文字位置
   * @param patternFilter 検索対象のパターンインデックス（指定しない場合は全パターン）
   * @returns 全ての可能なローマ字ユニットの配列
   */
  getAllPossibleRomajiUnits(
    charIndex: number,
    patternFilter?: number[]
  ): string[] {
    // 検索対象のパターン
    const targetPatterns =
      patternFilter ||
      Array.from({ length: this.patterns.length }, (_, i) => i);

    // 各パターンでのローマ字ユニットを収集
    const allUnits = new Set<string>();

    for (const patternIndex of targetPatterns) {
      if (patternIndex >= 0 && patternIndex < this.patterns.length) {
        const pattern = this.patterns[patternIndex];
        if (charIndex >= 0 && charIndex < pattern.length) {
          // パターンのユニットを追加
          allUnits.add(pattern[charIndex]);
        }
      }
    }

    return Array.from(allUnits);
  }

  /**
   * 特定のパターンと位置における最短のローマ字ユニットを取得
   * @param patternIndex パターンのインデックス
   * @param charIndex 文字位置
   * @returns 最短のローマ字ユニット
   */
  getShortestRomajiUnit(patternIndex: number, charIndex: number): string {
    // パターンが存在するか確認
    if (patternIndex < 0 || patternIndex >= this.patterns.length) {
      return "";
    }

    // 指定された位置に文字があるか確認
    const pattern = this.patterns[patternIndex];
    if (charIndex < 0 || charIndex >= pattern.length) {
      return "";
    }

    // そのパターンのユニットを返す
    return pattern[charIndex];
  }

  /**
   * 指定した文字位置における全てのパターンの中で最短のローマ字ユニットを取得
   * @param charIndex 文字位置
   * @param patternFilter 検索対象のパターンインデックス（指定しない場合は全パターン）
   * @returns 最短のローマ字ユニット
   */
  getShortestRomajiUnitForAllPatterns(
    charIndex: number,
    patternFilter?: number[]
  ): string {
    // その位置での全ての可能なローマ字ユニットを取得
    const allUnits = this.getAllPossibleRomajiUnits(charIndex, patternFilter);

    // 有効なユニットがない場合は空文字を返す
    if (allUnits.length === 0) {
      return "";
    }

    // 最短のユニットを返す（同じ長さの場合はアルファベット順で早いものを優先）
    return allUnits.reduce((shortest, current) => {
      if (current.length < shortest.length) {
        return current;
      } else if (current.length === shortest.length) {
        // 同じ長さなら辞書順で比較
        return current.localeCompare(shortest) < 0 ? current : shortest;
      }
      return shortest;
    }, allUnits[0]);
  }
}

/**
 * 複数のローマ字パターンからTrieを構築する
 * @param patterns ローマ字パターンの配列
 * @returns 構築されたRomajiTrieインスタンス
 */
export function buildRomajiTrie(patterns: string[][]): RomajiTrie {
  const trie = new RomajiTrie();
  trie.insertPatterns(patterns);
  return trie;
}

/**
 * 一連のローマ字パターンから最短のローマ字表記を取得する
 * 表示用に使用されるヘルパー関数
 * @param trie 構築済みのRomajiTrieインスタンス
 * @param confirmedPatterns 確定したパターンのインデックス配列
 * @param totalLength パターンの総文字数
 * @param currentIndex 現在の入力位置（この位置より前は元のパターンを使用）
 * @param currentPattern 現在使用中のパターンインデックス
 * @returns 最短のローマ字表記
 */
export function getShortestDisplayRomaji(
  trie: RomajiTrie,
  confirmedPatterns: number[],
  totalLength: number,
  currentIndex: number = 0,
  currentPattern: number = 0
): string[] {
  const shortRomaji: string[] = [];

  // 各文字位置で最短のローマ字表記を取得
  for (let i = 0; i < totalLength; i++) {
    let unit: string;

    // 入力済みの位置は現在のパターンの値を使用
    if (i < currentIndex && currentPattern < trie.patterns.length) {
      unit = trie.patterns[currentPattern][i] || "";
    } else {
      // それ以外は最短のローマ字表記を使用
      unit = trie.getShortestRomajiUnitForAllPatterns(i, confirmedPatterns);
    }

    shortRomaji.push(unit);
  }

  return shortRomaji;
}
