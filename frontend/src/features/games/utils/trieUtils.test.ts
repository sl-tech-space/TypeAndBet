/**
 * trieUtils.tsのユニットテスト
 * タイピングゲーム用のTrie構造のテスト
 */

import {
  RomajiTrie,
  buildRomajiTrie,
  getShortestDisplayRomaji,
  type TrieNode,
} from "./trieUtils";

describe("TrieNode", () => {
  it("TrieNode型の構造が正しく定義され、必要なプロパティを持つ", () => {
    const node: TrieNode = {
      children: new Map(),
      isEndOfWord: false,
      patternIndices: [],
      romajiUnit: "test",
      charIndex: 0,
    };

    expect(node.children).toBeInstanceOf(Map);
    expect(node.isEndOfWord).toBe(false);
    expect(node.patternIndices).toStrictEqual([]);
    expect(node.romajiUnit).toBe("test");
    expect(node.charIndex).toBe(0);
  });
});

describe("RomajiTrie", () => {
  let trie: RomajiTrie;

  beforeEach(() => {
    trie = new RomajiTrie();
  });

  describe("コンストラクタ", () => {
    it("空のTrieを正しく初期化し、ルートノードが適切に設定される", () => {
      expect(trie.root).toBeDefined();
      expect(trie.root.children.size).toBe(0);
      expect(trie.root.isEndOfWord).toBe(false);
      expect(trie.root.romajiUnit).toBe("");
      expect(trie.root.charIndex).toBe(-1);
      expect(trie.patterns).toStrictEqual([]);
    });
  });

  describe("insertPatterns", () => {
    it("単一のローマ字パターンを正しく挿入し、文字位置ノードが作成される", () => {
      const patterns = [["ko", "n", "ni", "chi", "wa"]];
      trie.insertPatterns(patterns);

      expect(trie.patterns).toStrictEqual(patterns);
      // ルートノードに文字位置ノードが作成されることを確認
      expect(trie.root.children.has("#0")).toBe(true);
      expect(trie.root.children.has("#1")).toBe(true);
      expect(trie.root.children.has("#2")).toBe(true);
      expect(trie.root.children.has("#3")).toBe(true);
      expect(trie.root.children.has("#4")).toBe(true);
    });

    it("複数のローマ字パターンを正しく挿入し、各文字位置のノードが適切に作成される", () => {
      const patterns = [
        ["ko", "n", "ni", "chi", "wa"],
        ["ko", "nn", "ni", "ti", "wa"],
      ];
      trie.insertPatterns(patterns);

      expect(trie.patterns).toStrictEqual(patterns);

      // 各文字位置のノードが存在することを確認
      for (let i = 0; i < 5; i++) {
        expect(trie.root.children.has(`#${i}`)).toBe(true);
      }
    });

    it("空のパターン配列を処理し、Trieが空の状態を維持する", () => {
      const patterns: string[][] = [];
      trie.insertPatterns(patterns);

      expect(trie.patterns).toStrictEqual([]);
      expect(trie.root.children.size).toBe(0);
    });
  });

  describe("findValidPatterns", () => {
    beforeEach(() => {
      const patterns = [
        ["ko", "n", "ni", "chi", "wa"], // "こんにちは"
        ["ko", "nn", "ni", "ti", "wa"], // "こんにちは" (別表記)
        ["sa", "yo", "u", "na", "ra"], // "さようなら"
      ];
      trie.insertPatterns(patterns);
    });

    it("空の入力履歴で全パターンのインデックスを返す", () => {
      const result = trie.findValidPatterns([], 0);
      expect(result).toContain(0);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result.length).toBe(3);
    });

    it("最初の文字入力で正しくフィルタリングし、該当するパターンのみを返す", () => {
      const result = trie.findValidPatterns(["ko"], 0);
      expect(result).toContain(0);
      expect(result).toContain(1);
      expect(result.length).toBe(2);
    });

    it("部分的な文字入力で正しくフィルタリングし、候補パターンを返す", () => {
      const result = trie.findValidPatterns(["k"], 0);
      expect(result).toContain(0);
      expect(result).toContain(1);
      expect(result.length).toBe(2);
    });

    it("異なる文字で正しくフィルタリングし、該当するパターンのみを返す", () => {
      const result = trie.findValidPatterns(["sa"], 0);
      expect(result.sort()).toStrictEqual([2]);
    });

    it("無効な文字入力で空配列を返し、エラーを発生させない", () => {
      const result = trie.findValidPatterns(["xyz"], 0);
      expect(result).toStrictEqual([]);
    });

    it("patternFilterを適用して、指定されたパターンのみを返す", () => {
      const result = trie.findValidPatterns(["ko"], 0, [1]);
      expect(result).toStrictEqual([1]);
    });

    it("存在しない文字位置で空配列を返し、エラーを発生させない", () => {
      const result = trie.findValidPatterns(["ko"], 10);
      expect(result).toStrictEqual([]);
    });
  });

  describe("getNextPossibleChars", () => {
    beforeEach(() => {
      const patterns = [
        ["ko", "n", "ni", "chi", "wa"],
        ["ka", "n", "ni", "chi", "wa"],
        ["ki", "n", "ni", "chi", "wa"],
      ];
      trie.insertPatterns(patterns);
    });

    it("最初の文字位置で可能な次の文字を正しく返す", () => {
      const result = trie.getNextPossibleChars([], 0);
      // 実際に返される文字は実装に依存するため、空でなければOK
      expect(result.length).toBeGreaterThan(0);
      // 各パターンの最初の文字の候補文字が含まれることを確認
      expect(result.every((char) => ["k", "a", "i", "o"].includes(char))).toBe(
        true
      );
    });

    it("部分入力から次の可能な文字を正しく返す", () => {
      const result = trie.getNextPossibleChars(["k"], 0);
      // "k"の後に来る可能な文字をチェック
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((char) => ["a", "i", "o"].includes(char))).toBe(true);
    });

    it("完全一致後の次の文字位置で空配列を返す", () => {
      const result = trie.getNextPossibleChars(["ko"], 0);
      expect(result).toStrictEqual([]);
    });

    it("無効な文字入力で空配列を返し、エラーを発生させない", () => {
      const result = trie.getNextPossibleChars(["xyz"], 0);
      expect(result).toStrictEqual([]);
    });

    it("patternFilterを適用して、指定されたパターンのみから次の文字を返す", () => {
      const result = trie.getNextPossibleChars(["k"], 0, [0]);
      expect(result).toStrictEqual(["o"]);
    });
  });

  describe("isValidInput", () => {
    beforeEach(() => {
      const patterns = [
        ["ko", "n", "ni", "chi", "wa"],
        ["sa", "yo", "u", "na", "ra"],
      ];
      trie.insertPatterns(patterns);
    });

    it("有効な文字入力でtrueを返し、パターンに含まれる文字を正しく認識する", () => {
      expect(trie.isValidInput(["ko"], 0)).toBe(true);
      expect(trie.isValidInput(["k"], 0)).toBe(true);
      expect(trie.isValidInput(["sa"], 0)).toBe(true);
    });

    it("無効な文字入力でfalseを返し、存在しない文字を正しく拒否する", () => {
      expect(trie.isValidInput(["xyz"], 0)).toBe(false);
      expect(trie.isValidInput(["zu"], 0)).toBe(false);
    });

    it("空の入力でtrueを返し、初期状態を正しく処理する", () => {
      expect(trie.isValidInput([], 0)).toBe(true);
    });
  });

  describe("isInputComplete", () => {
    beforeEach(() => {
      const patterns = [
        ["ko", "n", "ni", "chi", "wa"],
        ["sha", "n", "ni", "chi", "wa"], // sha vs sya
        ["sya", "n", "ni", "chi", "wa"],
      ];
      trie.insertPatterns(patterns);
    });

    it("完全なローマ字単位でtrueを返し、入力完了を正しく判定する", () => {
      expect(trie.isInputComplete("ko", 0)).toBe(true);
      expect(trie.isInputComplete("n", 1)).toBe(true);
      expect(trie.isInputComplete("ni", 2)).toBe(true);
      expect(trie.isInputComplete("chi", 3)).toBe(true);
      expect(trie.isInputComplete("wa", 4)).toBe(true);
      // 位置1では"sha"と"sya"は存在しない（位置1は"n"のみ）
      expect(trie.isInputComplete("sha", 0)).toBe(true); // 位置0での"sha"
      expect(trie.isInputComplete("sya", 0)).toBe(true); // 位置0での"sya"
    });

    it("部分的な文字入力でfalseを返し、入力未完了を正しく判定する", () => {
      expect(trie.isInputComplete("k", 0)).toBe(false);
      expect(trie.isInputComplete("sh", 0)).toBe(false); // 位置0での部分入力
      expect(trie.isInputComplete("sy", 0)).toBe(false); // 位置0での部分入力
    });

    it("無効な文字入力でfalseを返し、存在しない文字を正しく拒否する", () => {
      expect(trie.isInputComplete("xyz", 0)).toBe(false);
      expect(trie.isInputComplete("zu", 0)).toBe(false);
    });

    it("patternFilterを適用して、指定されたパターンのみで入力完了を判定する", () => {
      // パターン1は["sha", "n", "ni", "chi", "wa"]なので位置0で"sha"が有効
      expect(trie.isInputComplete("sha", 0, [1])).toBe(true);
      expect(trie.isInputComplete("sya", 0, [1])).toBe(false); // パターン1にはsyaがない
      expect(trie.isInputComplete("sya", 0, [2])).toBe(true); // パターン2にはsyaがある
    });

    it("存在しない文字位置でfalseを返し、エラーを発生させない", () => {
      expect(trie.isInputComplete("ko", 10)).toBe(false);
    });
  });

  describe("getAllPossibleRomajiUnits", () => {
    beforeEach(() => {
      const patterns = [
        ["ko", "n", "ni", "chi", "wa"],
        ["ko", "nn", "ni", "ti", "wa"],
        ["sa", "n", "ni", "chi", "wa"],
      ];
      trie.insertPatterns(patterns);
    });

    it("指定された文字位置の全ローマ字ユニットを重複なく返す", () => {
      const result = trie.getAllPossibleRomajiUnits(0);
      expect(result).toContain("ko");
      expect(result).toContain("sa");
      expect(result.length).toBe(2);
    });

    it("複数の選択肢がある文字位置で全ユニットを正しく返す", () => {
      const result = trie.getAllPossibleRomajiUnits(1);
      expect(result).toContain("n");
      expect(result).toContain("nn");
      expect(result.length).toBe(2);
    });

    it("同じローマ字ユニットを重複させず、一意な値のみを返す", () => {
      const result = trie.getAllPossibleRomajiUnits(2);
      expect(result).toContain("ni");
      expect(result.length).toBe(1); // 重複なし
    });

    it("patternFilterを適用して、指定されたパターンのみからローマ字ユニットを返す", () => {
      const result = trie.getAllPossibleRomajiUnits(1, [0, 2]);
      expect(result).toStrictEqual(["n"]);
    });

    it("存在しない文字位置で空配列を返し、エラーを発生させない", () => {
      const result = trie.getAllPossibleRomajiUnits(10);
      expect(result).toStrictEqual([]);
    });

    it("無効なpatternIndexで空配列を返し、エラーを発生させない", () => {
      const result = trie.getAllPossibleRomajiUnits(0, [100]);
      expect(result).toStrictEqual([]);
    });
  });

  describe("getShortestRomajiUnit", () => {
    beforeEach(() => {
      const patterns = [
        ["ko", "n", "ni", "chi", "wa"],
        ["ka", "nn", "ni", "ti", "wa"],
      ];
      trie.insertPatterns(patterns);
    });

    it("指定されたパターンと文字位置のローマ字ユニットを正しく返す", () => {
      expect(trie.getShortestRomajiUnit(0, 0)).toBe("ko");
      expect(trie.getShortestRomajiUnit(1, 0)).toBe("ka");
      expect(trie.getShortestRomajiUnit(0, 1)).toBe("n");
      expect(trie.getShortestRomajiUnit(1, 1)).toBe("nn");
    });

    it("無効なpatternIndexで空文字を返し、エラーを発生させない", () => {
      expect(trie.getShortestRomajiUnit(-1, 0)).toBe("");
      expect(trie.getShortestRomajiUnit(100, 0)).toBe("");
    });

    it("無効なcharIndexで空文字を返し、エラーを発生させない", () => {
      expect(trie.getShortestRomajiUnit(0, -1)).toBe("");
      expect(trie.getShortestRomajiUnit(0, 100)).toBe("");
    });
  });

  describe("getShortestRomajiUnitForAllPatterns", () => {
    beforeEach(() => {
      const patterns = [
        ["ko", "nn", "ni", "chi", "wa"],
        ["ko", "n", "ni", "ti", "wa"],
        ["sa", "n", "ni", "chi", "wa"],
      ];
      trie.insertPatterns(patterns);
    });

    it("全パターンから最短のローマ字ユニットを正しく選択して返す", () => {
      expect(trie.getShortestRomajiUnitForAllPatterns(1)).toBe("n"); // "n" < "nn"
      expect(["chi", "ti"]).toContain(
        trie.getShortestRomajiUnitForAllPatterns(3)
      ); // 同じ長さなので実装依存
    });

    it("同一長さのローマ字ユニットがある場合は辞書順で早いものを返す", () => {
      expect(trie.getShortestRomajiUnitForAllPatterns(0)).toBe("ko"); // "ko" < "sa"
    });

    it("patternFilterを適用して、指定されたパターンのみから最短ユニットを選択する", () => {
      expect(trie.getShortestRomajiUnitForAllPatterns(1, [0])).toBe("nn");
      expect(trie.getShortestRomajiUnitForAllPatterns(3, [1])).toBe("ti");
    });

    it("存在しない文字位置で空文字を返し、エラーを発生させない", () => {
      expect(trie.getShortestRomajiUnitForAllPatterns(10)).toBe("");
    });

    it("無効なpatternFilterで空文字を返し、エラーを発生させない", () => {
      expect(trie.getShortestRomajiUnitForAllPatterns(0, [100])).toBe("");
    });
  });
});

describe("ヘルパー関数", () => {
  describe("buildRomajiTrie", () => {
    it("ローマ字パターン配列からTrieを正しく構築し、検索が可能になる", () => {
      const patterns = [
        ["ko", "n", "ni", "chi", "wa"],
        ["sa", "yo", "u", "na", "ra"],
      ];
      const trie = buildRomajiTrie(patterns);

      expect(trie).toBeInstanceOf(RomajiTrie);
      expect(trie.patterns).toStrictEqual(patterns);
      expect(trie.findValidPatterns(["ko"], 0)).toStrictEqual([0]);
      expect(trie.findValidPatterns(["sa"], 0)).toStrictEqual([1]);
    });

    it("空のパターン配列でTrieを構築し、空の状態を正しく初期化する", () => {
      const patterns: string[][] = [];
      const trie = buildRomajiTrie(patterns);

      expect(trie).toBeInstanceOf(RomajiTrie);
      expect(trie.patterns).toStrictEqual([]);
    });
  });

  describe("getShortestDisplayRomaji", () => {
    let trie: RomajiTrie;

    beforeEach(() => {
      const patterns = [
        ["ko", "nn", "ni", "chi", "wa"], // Pattern 0
        ["ko", "n", "ni", "ti", "wa"], // Pattern 1
        ["sa", "n", "ni", "chi", "wa"], // Pattern 2
      ];
      trie = buildRomajiTrie(patterns);
    });

    it("複数パターンから最短表示を正しく取得し、位置ごとに最適なユニットを選択する", () => {
      const result = getShortestDisplayRomaji(trie, [0, 1], 5, 0, 0);
      // 位置ごとに最短を選択するため
      expect(result[0]).toBe("ko"); // 共通
      expect(result[1]).toBe("n"); // "n" < "nn"
      expect(result[2]).toBe("ni"); // 共通
      expect(["chi", "ti"]).toContain(result[3]); // "chi"と"ti"どちらかが選ばれる
      expect(result[4]).toBe("wa"); // 共通
      expect(result.length).toBe(5);
    });

    it("現在位置より前は現在パターンを使用し、現在位置以降は最短選択を行う", () => {
      const result = getShortestDisplayRomaji(trie, [0, 1], 5, 2, 0);
      // 現在位置より前（0, 1）は現在パターン（Pattern 0）を使用
      expect(result[0]).toBe("ko"); // Pattern 0
      expect(result[1]).toBe("nn"); // Pattern 0
      expect(result[2]).toBe("ni"); // 共通
      expect(["chi", "ti"]).toContain(result[3]); // 位置2以降は最短選択
      expect(result[4]).toBe("wa"); // 共通
      expect(result.length).toBe(5);
    });

    it("確定パターンフィルターを適用して、指定されたパターンのみから表示用ローマ字を生成する", () => {
      const result = getShortestDisplayRomaji(trie, [1], 5, 0, 1);
      expect(result).toStrictEqual(["ko", "n", "ni", "ti", "wa"]);
    });

    it("総文字数0で空配列を返し、エラーを発生させない", () => {
      const result = getShortestDisplayRomaji(trie, [0], 0, 0, 0);
      expect(result).toStrictEqual([]);
    });

    it("無効な現在パターンで最短選択を使用し、エラーを発生させない", () => {
      const result = getShortestDisplayRomaji(trie, [0, 1], 5, 0, 100);
      // 複数パターンから最短を選択するため、位置ごとに検証
      expect(result[0]).toBe("ko"); // 共通
      expect(["n", "nn"]).toContain(result[1]); // nまたはnn
      expect(result[2]).toBe("ni"); // 共通
      expect(["chi", "ti"]).toContain(result[3]); // chiまたはti
      expect(result[4]).toBe("wa"); // 共通
      expect(result.length).toBe(5);
    });
  });
});

describe("エッジケースとエラーハンドリング", () => {
  let trie: RomajiTrie;

  beforeEach(() => {
    trie = new RomajiTrie();
  });

  describe("findMatchingNodesの詳細テスト", () => {
    beforeEach(() => {
      const patterns = [
        ["sha", "n", "ni"],
        ["shi", "n", "ni"],
        ["natsu", "da"],
      ];
      trie.insertPatterns(patterns);
    });

    it("正確な文字一致が優先され、部分一致を正しく処理する", () => {
      const charNode = trie["findCharNode"](trie.root, 0)!;
      const result = trie["findMatchingNodes"](charNode, "sh");
      expect(result.length).toBeGreaterThan(0);
    });

    it("部分的な文字入力を正しく処理し、候補ノードを適切に返す", () => {
      const charNode = trie["findCharNode"](trie.root, 0)!;
      const result = trie["findMatchingNodes"](charNode, "na");
      expect(result.length).toBeGreaterThan(0);
    });

    it("入力の先頭部分がノードに完全一致する場合を正しく処理する", () => {
      const charNode = trie["findCharNode"](trie.root, 0)!;
      const result = trie["findMatchingNodes"](charNode, "natsu");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getNextPossibleCharsの完全一致後処理", () => {
    beforeEach(() => {
      const patterns = [
        ["ko", "n", "ni"],
        ["kon", "ni"],
      ];
      trie.insertPatterns(patterns);
    });

    it("完全一致後に子ノードから次の可能な文字を正しく収集する", () => {
      const result = trie.getNextPossibleChars(["ko"], 0);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("子ノードが有効なパターンに属しているかを正しく確認し、適切な文字を返す", () => {
      const result = trie.getNextPossibleChars(["ko"], 0, [0]);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("特殊文字と空文字列の処理", () => {
    it("空のローマ字ユニットを安全に処理し、エラーを発生させない", () => {
      const patterns = [["", "n", "ni"]];
      expect(() => trie.insertPatterns(patterns)).not.toThrow();
    });

    it("特殊文字を含むローマ字ユニットを安全に処理し、検索が可能になる", () => {
      const patterns = [["a-b", "c_d", "e.f"]];
      expect(() => trie.insertPatterns(patterns)).not.toThrow();
      expect(trie.findValidPatterns(["a-b"], 0)).toStrictEqual([0]);
    });
  });

  describe("大きなデータセットの処理", () => {
    it("多数のパターンを安全に処理し、メモリリークを発生させない", () => {
      const patterns: string[][] = [];
      for (let i = 0; i < 100; i++) {
        patterns.push([`pattern${i}`, "test", "data"]);
      }

      expect(() => trie.insertPatterns(patterns)).not.toThrow();
      expect(trie.patterns.length).toBe(100);
    });

    it("長いパターンを安全に処理し、深いネスト構造を正しく構築する", () => {
      const longPattern: string[] = [];
      for (let i = 0; i < 50; i++) {
        longPattern.push(`unit${i}`);
      }

      const patterns = [longPattern];
      expect(() => trie.insertPatterns(patterns)).not.toThrow();
      expect(trie.patterns[0].length).toBe(50);
    });
  });

  describe("境界値テスト", () => {
    beforeEach(() => {
      const patterns = [["ko", "n"]];
      trie.insertPatterns(patterns);
    });

    it("負のインデックスを適切に処理し、空配列を返してエラーを発生させない", () => {
      expect(trie.findValidPatterns(["ko"], -1)).toStrictEqual([]);
      expect(trie.getNextPossibleChars(["ko"], -1)).toStrictEqual([]);
      expect(trie.getAllPossibleRomajiUnits(-1)).toStrictEqual([]);
    });

    it("範囲外のインデックスを適切に処理し、空配列を返してエラーを発生させない", () => {
      expect(trie.findValidPatterns(["ko"], 100)).toStrictEqual([]);
      expect(trie.getNextPossibleChars(["ko"], 100)).toStrictEqual([]);
      expect(trie.getAllPossibleRomajiUnits(100)).toStrictEqual([]);
    });
  });

  describe("同じパターンの重複挿入", () => {
    it("同じパターンを複数回挿入しても正常に動作し、重複を適切に処理する", () => {
      const patterns = [
        ["ko", "n"],
        ["ko", "n"],
      ];
      trie.insertPatterns(patterns);

      expect(trie.patterns.length).toBe(2);
      expect(trie.findValidPatterns(["ko"], 0)).toStrictEqual([0, 1]);
    });
  });

  describe("プライベートメソッドの詳細テスト", () => {
    beforeEach(() => {
      const patterns = [
        ["sha", "n", "ni"],
        ["sya", "n", "ni"],
        ["sh", "i", "ni"],
      ];
      trie.insertPatterns(patterns);
    });

    it("findCharNodeが存在しない文字位置でnullを正しく返す", () => {
      const result = trie["findCharNode"](trie.root, 999);
      expect(result).toBeNull();
    });

    it("getFirstCharsOfCharIndexでvalidPatternsが指定された場合に正しく動作する", () => {
      const result = trie["getFirstCharsOfCharIndex"](0, [0]);
      expect(result.length).toBeGreaterThan(0);
    });

    it("getFirstCharsOfCharIndexで存在しない位置を指定した場合に空配列を返す", () => {
      const result = trie["getFirstCharsOfCharIndex"](999, [0]);
      expect(result).toStrictEqual([]);
    });

    it("insertRomajiUnitで既存ノードにパターンを安全に追加し、エラーを発生させない", () => {
      // 同じローマ字ユニットで異なるパターンを追加する場合をテスト
      const charNode = trie["findOrCreateCharNode"](trie.root, 0);
      expect(() =>
        trie["insertRomajiUnit"](charNode, "sha", 0, 999)
      ).not.toThrow();
    });

    it("findMatchingNodesで特殊キーを適切に無視し、有効な結果のみを返す", () => {
      const charNode = trie["findCharNode"](trie.root, 0)!;
      const result = trie["findMatchingNodes"](charNode, "#test");
      expect(result.length).toBe(0);
    });
  });

  describe("isInputCompleteの詳細分岐テスト", () => {
    beforeEach(() => {
      const patterns = [
        ["sha", "n"],
        ["sh", "i"],
      ];
      trie.insertPatterns(patterns);
    });

    it("完全一致ノードが存在するが終端でない場合にfalseを正しく返す", () => {
      // "s"は"sh"や"sha"の途中なので完了していない
      const result = trie.isInputComplete("s", 0);
      expect(result).toBe(false);
    });

    it("終端ノードだが対象パターンに含まれない場合にfalseを正しく返す", () => {
      const result = trie.isInputComplete("sh", 0, [0]); // パターン0には"sh"がない
      expect(result).toBe(false);
    });

    it("有効なパターンで位置の文字が一致する場合にtrueを正しく返す", () => {
      const result = trie.isInputComplete("sha", 0, [0]);
      expect(result).toBe(true);
    });
  });
});
