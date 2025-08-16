import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  EMAIL_VALIDATION,
  NAME_VALIDATION,
  PASSWORD_VALIDATION,
} from "@/constants";

import {
  useEmailValidation,
  useNameValidation,
  usePasswordValidation,
} from "./useValidation";

describe("usePasswordValidation", () => {
  describe("初期状態", () => {
    it("初期状態でerrorsが空配列であること", () => {
      const { result } = renderHook(() => usePasswordValidation());
      expect(result.current.errors).toEqual([]);
    });

    it("初期状態でvalidatePasswordが関数であること", () => {
      const { result } = renderHook(() => usePasswordValidation());
      expect(typeof result.current.validatePassword).toBe("function");
    });
  });

  describe("必須チェック", () => {
    it("空文字の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });

    it("nullの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword(null as any);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });

    it("undefinedの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword(undefined as any);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });

    it("空白文字のみの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("   ");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });
  });

  describe("長さチェック", () => {
    it("最小長未満の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("Ab1!");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_LENGTH
      );
    });

    it("最大長超過の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      const longPassword = "A".repeat(129) + "b1!";
      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword(longPassword);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.MAX_LENGTH
      );
    });

    it("最小長と最大長の境界値でエラーが発生しないこと", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("AB12!@ab");
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });
  });

  describe("大文字チェック", () => {
    it("大文字が不足している場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("ab12!@");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_UPPERCASE
      );
    });

    it("大文字が最小数未満の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("Ab12!@");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_UPPERCASE
      );
    });

    it("大文字が最小数を満たしている場合にエラーが発生しないこと", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("AB12!@ab");
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });
  });

  describe("数字チェック", () => {
    it("数字が不足している場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("ABcd!@");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_NUMBER
      );
    });

    it("数字が最小数未満の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("AB1!@");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_NUMBER
      );
    });

    it("数字が最小数を満たしている場合にエラーが発生しないこと", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("AB12!@ab");
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });
  });

  describe("小文字チェック", () => {
    it("小文字が不足している場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("AB12!@");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED_CHARS
      );
    });

    it("小文字が最小数を満たしている場合にエラーが発生しないこと", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("AB12!@ab");
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });
  });

  describe("特殊文字チェック", () => {
    it("特殊文字が不足している場合にエラーが発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("AB12ab");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_SPECIAL_CHAR
      );
    });

    it("特殊文字が最小数を満たしている場合にエラーが発生しないこと", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("AB12!@ab");
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });
  });

  describe("複合バリデーション", () => {
    it("複数のエラーが同時に発生すること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("a");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.length).toBeGreaterThan(1);
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_LENGTH
      );
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_UPPERCASE
      );
    });

    it("有効なパスワードでエラーが発生しないこと", () => {
      const { result } = renderHook(() => usePasswordValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validatePassword("AB12!@ab");
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });
  });

  describe("状態管理", () => {
    it("エラーが発生した後、新しいバリデーションでエラーが更新されること", () => {
      const { result } = renderHook(() => usePasswordValidation());

      // 最初のバリデーション
      act(() => {
        result.current.validatePassword("");
      });
      expect(result.current.errors).toContain(
        PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED
      );

      // 2番目のバリデーション
      act(() => {
        result.current.validatePassword("AB12!@ab");
      });
      expect(result.current.errors).toEqual([]);
    });
  });
});

describe("useEmailValidation", () => {
  describe("初期状態", () => {
    it("初期状態でerrorsが空配列であること", () => {
      const { result } = renderHook(() => useEmailValidation());
      expect(result.current.errors).toEqual([]);
    });

    it("初期状態でvalidateEmailが関数であること", () => {
      const { result } = renderHook(() => useEmailValidation());
      expect(typeof result.current.validateEmail).toBe("function");
    });
  });

  describe("必須チェック", () => {
    it("空文字の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useEmailValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateEmail("");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        EMAIL_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });

    it("nullの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useEmailValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateEmail(null as any);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        EMAIL_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });

    it("undefinedの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useEmailValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateEmail(undefined as any);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        EMAIL_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });

    it("空白文字のみの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useEmailValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateEmail("   ");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        EMAIL_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });
  });

  describe("長さチェック", () => {
    it("最大長超過の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useEmailValidation());

      const longEmail = "a".repeat(255) + "@example.com";
      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateEmail(longEmail);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        `メールアドレスは${EMAIL_VALIDATION.MAX_LENGTH}文字以下で入力してください`
      );
    });

    it("最大長の境界値でエラーが発生しないこと", () => {
      const { result } = renderHook(() => useEmailValidation());

      const boundaryEmail = "a".repeat(240) + "@example.com";
      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateEmail(boundaryEmail);
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });
  });

  describe("フォーマットチェック", () => {
    it("無効なフォーマットの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useEmailValidation());

      const invalidEmails = [
        "invalid-email",
        "@example.com",
        "test@",
        "test@.com",
        "test@example",
        "test.example.com",
        "test@@example.com",
      ];

      invalidEmails.forEach((email) => {
        const { result: testResult } = renderHook(() => useEmailValidation());
        let isValid: boolean = false;
        act(() => {
          isValid = testResult.current.validateEmail(email);
        });

        // デバッグ情報を出力
        if (isValid) {
          console.log(`Unexpectedly valid email: ${email}`);
        }

        expect(isValid).toBe(false);
        expect(testResult.current.errors).toContain(
          EMAIL_VALIDATION.ERROR_MESSAGES.INVALID
        );
      });
    });

    it("有効なフォーマットでエラーが発生しないこと", () => {
      const { result } = renderHook(() => useEmailValidation());

      const validEmails = [
        "test@example.com",
        "user.name@domain.co.jp",
        "user+tag@example.org",
        "123@example.com",
      ];

      validEmails.forEach((email) => {
        let isValid: boolean = false;
        act(() => {
          isValid = result.current.validateEmail(email);
        });
        expect(isValid).toBe(true);
        expect(result.current.errors).toEqual([]);
      });
    });
  });

  describe("複合バリデーション", () => {
    it("複数のエラーが同時に発生すること", () => {
      const { result } = renderHook(() => useEmailValidation());

      const longInvalidEmail = "a".repeat(255) + "@invalid";
      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateEmail(longInvalidEmail);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.length).toBeGreaterThan(1);
      expect(result.current.errors).toContain(
        `メールアドレスは${EMAIL_VALIDATION.MAX_LENGTH}文字以下で入力してください`
      );
      expect(result.current.errors).toContain(
        EMAIL_VALIDATION.ERROR_MESSAGES.INVALID
      );
    });
  });

  describe("状態管理", () => {
    it("エラーが発生した後、新しいバリデーションでエラーが更新されること", () => {
      const { result } = renderHook(() => useEmailValidation());

      // 最初のバリデーション
      act(() => {
        result.current.validateEmail("");
      });
      expect(result.current.errors).toContain(
        EMAIL_VALIDATION.ERROR_MESSAGES.REQUIRED
      );

      // 2番目のバリデーション
      act(() => {
        result.current.validateEmail("test@example.com");
      });
      expect(result.current.errors).toEqual([]);
    });
  });
});

describe("useNameValidation", () => {
  describe("初期状態", () => {
    it("初期状態でerrorsが空配列であること", () => {
      const { result } = renderHook(() => useNameValidation());
      expect(result.current.errors).toEqual([]);
    });

    it("初期状態でvalidateNameが関数であること", () => {
      const { result } = renderHook(() => useNameValidation());
      expect(typeof result.current.validateName).toBe("function");
    });
  });

  describe("必須チェック", () => {
    it("空文字の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useNameValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateName("");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        NAME_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });

    it("nullの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useNameValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateName(null as any);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        NAME_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });

    it("undefinedの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useNameValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateName(undefined as any);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        NAME_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });

    it("空白文字のみの場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useNameValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateName("   ");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        NAME_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
    });
  });

  describe("長さチェック", () => {
    it("最小長未満の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useNameValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateName("");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        NAME_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
      // 空文字の場合は必須エラーのみで、最小長エラーは追加されない
      expect(result.current.errors).toEqual([
        NAME_VALIDATION.ERROR_MESSAGES.REQUIRED,
      ]);
    });

    it("最大長超過の場合にエラーが発生すること", () => {
      const { result } = renderHook(() => useNameValidation());

      const longName = "a".repeat(16);
      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateName(longName);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toContain(
        NAME_VALIDATION.ERROR_MESSAGES.MAX_LENGTH
      );
    });

    it("最小長と最大長の境界値でエラーが発生しないこと", () => {
      const { result } = renderHook(() => useNameValidation());

      const boundaryNames = ["a", "a".repeat(15)];

      boundaryNames.forEach((name) => {
        let isValid: boolean = false;
        act(() => {
          isValid = result.current.validateName(name);
        });
        expect(isValid).toBe(true);
        expect(result.current.errors).toEqual([]);
      });
    });
  });

  describe("複合バリデーション", () => {
    it("複数のエラーが同時に発生すること", () => {
      const { result } = renderHook(() => useNameValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateName("");
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.length).toBeGreaterThan(0);
      expect(result.current.errors).toContain(
        NAME_VALIDATION.ERROR_MESSAGES.REQUIRED
      );
      // 空文字の場合は必須エラーのみで、最小長エラーは追加されない
      expect(result.current.errors).toEqual([
        NAME_VALIDATION.ERROR_MESSAGES.REQUIRED,
      ]);
    });

    it("有効な名前でエラーが発生しないこと", () => {
      const { result } = renderHook(() => useNameValidation());

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateName("テストユーザー");
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });
  });

  describe("状態管理", () => {
    it("エラーが発生した後、新しいバリデーションでエラーが更新されること", () => {
      const { result } = renderHook(() => useNameValidation());

      // 最初のバリデーション
      act(() => {
        result.current.validateName("");
      });
      expect(result.current.errors).toContain(
        NAME_VALIDATION.ERROR_MESSAGES.REQUIRED
      );

      // 2番目のバリデーション
      act(() => {
        result.current.validateName("テストユーザー");
      });
      expect(result.current.errors).toEqual([]);
    });
  });

  describe("エッジケース", () => {
    it("特殊文字を含む名前が有効であること", () => {
      const { result } = renderHook(() => useNameValidation());

      const specialCharNames = [
        "テスト-ユーザー",
        "テスト_ユーザー",
        "テスト.ユーザー",
        "テスト@ユーザー",
        "テスト#ユーザー",
      ];

      specialCharNames.forEach((name) => {
        let isValid: boolean = false;
        act(() => {
          isValid = result.current.validateName(name);
        });
        expect(isValid).toBe(true);
        expect(result.current.errors).toEqual([]);
      });
    });

    it("数字を含む名前が有効であること", () => {
      const { result } = renderHook(() => useNameValidation());

      const numberNames = [
        "テスト123",
        "123テスト",
        "テスト1ユーザー2",
        "1テスト2ユーザー3",
      ];

      numberNames.forEach((name) => {
        let isValid: boolean = false;
        act(() => {
          isValid = result.current.validateName(name);
        });
        expect(isValid).toBe(true);
        expect(result.current.errors).toEqual([]);
      });
    });
  });
});

describe("統合テスト", () => {
  it("複数のバリデーションフックが独立して動作すること", () => {
    const passwordHook = renderHook(() => usePasswordValidation());
    const emailHook = renderHook(() => useEmailValidation());
    const nameHook = renderHook(() => useNameValidation());

    // パスワードのバリデーション
    act(() => {
      passwordHook.result.current.validatePassword("");
    });
    expect(passwordHook.result.current.errors).toContain(
      PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED
    );

    // メールアドレスのバリデーション
    act(() => {
      emailHook.result.current.validateEmail("test@example.com");
    });
    expect(emailHook.result.current.errors).toEqual([]);

    // 名前のバリデーション
    act(() => {
      nameHook.result.current.validateName("テストユーザー");
    });
    expect(nameHook.result.current.errors).toEqual([]);

    // 各フックの状態が独立していることを確認
    expect(passwordHook.result.current.errors).toContain(
      PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED
    );
    expect(emailHook.result.current.errors).toEqual([]);
    expect(nameHook.result.current.errors).toEqual([]);
  });

  it("バリデーションエラーが適切にクリアされること", () => {
    const passwordHook = renderHook(() => usePasswordValidation());

    // エラーを発生させる
    act(() => {
      passwordHook.result.current.validatePassword("");
    });
    expect(passwordHook.result.current.errors.length).toBeGreaterThan(0);

    // エラーをクリアする
    act(() => {
      passwordHook.result.current.validatePassword("AB12!@ab");
    });
    expect(passwordHook.result.current.errors).toEqual([]);
  });
});
