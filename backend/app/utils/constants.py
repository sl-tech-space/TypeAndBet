class AuthErrorMessages:
    """認証に関するエラーメッセージを定義するクラス"""

    AUTHENTICATION_FAILED = "認証に失敗しました"
    INVALID_CREDENTIALS = "メールアドレスまたはパスワードが正しくありません"
    TOKEN_EXPIRED = "トークンの有効期限が切れています"
    INVALID_TOKEN = "無効なトークンです"
    TOKEN_GENERATION_ERROR = "トークンの生成中にエラーが発生しました"
    DUPLICATE_EMAIL = "このメールアドレスは既に登録されています"
    DUPLICATE_USERNAME = "このユーザー名は既に使用されています"
    INVALID_INPUT = "入力値が不正です"
    PASSWORD_MISMATCH = "パスワードが一致しません"
    INVALID_EMAIL_FORMAT = "有効なメールアドレスを入力してください"
    PASSWORD_TOO_LONG = "パスワードは255文字以内で入力してください"
    USERNAME_TOO_LONG = "ユーザー名は15文字以内で入力してください"
    LOGIN_REQUIRED = "ログインが必要です"
    PASSWORD_UPPERCASE_REQUIRED = "パスワードには大文字を2文字以上含める必要があります"
    PASSWORD_NUMBER_REQUIRED = "パスワードには数字を2文字以上含める必要があります"
    PASSWORD_SYMBOL_REQUIRED = "パスワードには記号を1文字以上含める必要があります"
    REQUIRED_FIELDS_MISSING = "メールアドレスとパスワードは必須です"


class TextGeneratorErrorMessages:
    """テキスト生成に関するエラーメッセージを定義するクラス"""

    INITIALIZATION_ERROR = "テキスト生成の初期化中にエラーが発生しました"
    THEME_SELECTION_ERROR = "テーマの選択中にエラーが発生しました"
    PROMPT_GENERATION_ERROR = "プロンプトの生成中にエラーが発生しました"
    TEXT_GENERATION_ERROR = "テキストの生成中にエラーが発生しました"
    AI_REQUEST_ERROR = "AIへのリクエスト中にエラーが発生しました"
    RESPONSE_PROCESSING_ERROR = "AIのレスポンス処理中にエラーが発生しました"


class ResultErrorMessages:
    """結果に関するエラーメッセージを定義するクラス"""

    GAME_NOT_FOUND = "ゲームが見つかりません"
    RANKING_CALCULATION_ERROR = "ランキングの計算中にエラーが発生しました"
    GOLD_CALCULATION_ERROR = "ゴールドの計算中にエラーが発生しました"
    RANK_CHANGE_CALCULATION_ERROR = "ランク変動の計算中にエラーが発生しました"
    NEXT_RANK_CALCULATION_ERROR = "次のランク必要金額の計算中にエラーが発生しました"


class RankingErrorMessages:
    """ランキングに関するエラーメッセージを定義するクラス"""

    RANKING_NOT_FOUND = "ランキングが見つかりません"
    RANKING_CALCULATION_ERROR = "ランキングの計算中にエラーが発生しました"
    RANKING_UPDATE_ERROR = "ランキングの更新中にエラーが発生しました"
    INVALID_RANKING_PARAMS = "無効なランキングパラメータが指定されました"
    RANKING_FETCH_ERROR = "ランキングの取得中にエラーが発生しました"


class GameErrorMessages:
    """ゲームに関するエラーメッセージを定義するクラス"""

    LOGIN_REQUIRED = "ログインが必要です"
    GAME_NOT_FOUND = "ゲームが見つかりません"
    NO_PERMISSION = "このゲームを更新する権限がありません"
    BET_AMOUNT_INVALID = "掛け金は100から700の間で設定してください"
    INSUFFICIENT_GOLD = "所持金が不足しています"
    CORRECT_TYPED_INVALID = "正タイプ数は0以上である必要があります"
    ACCURACY_INVALID = "正タイプ率は0より大きく1以下である必要があります"
    GAME_ALREADY_COMPLETED = "このゲームは既に完了しています"
    BET_SETTING_ERROR = "掛け金の設定中にエラーが発生しました"
    SCORE_UPDATE_ERROR = "スコアの更新中にエラーが発生しました"
    INVALID_INPUT = "入力内容が無効です"


class ModelConstants:
    """モデル関連の定数を定義するクラス"""

    # 文字列長制限
    MAX_NAME_LENGTH = 15
    MAX_EMAIL_LENGTH = 254
    MAX_ICON_LENGTH = 255
    MAX_TOKEN_HASH_LENGTH = 64
    MAX_IDEMPOTENCY_KEY_LENGTH = 255
    TOKEN_HEX_LENGTH = 32

    # デフォルト値
    DEFAULT_GOLD = 1000
    DEFAULT_ICON = "default.png"

    # 制約値
    MIN_GOLD = 0
    MIN_SCORE = 0
    MIN_BET_GOLD = 100
    MAX_BET_GOLD = 700

    # その他
    DEFAULT_RANKING = 1
    RANKING_INCREMENT = 1
    RANKING_DECREMENT = 1
    TEXT_PREVIEW_LENGTH = 20


class RankingConstants:
    """ランキング関連の定数を定義するクラス"""

    # デフォルト値
    DEFAULT_LIMIT = 10
    DEFAULT_OFFSET = 0
    MIN_LIMIT = 1
    MIN_OFFSET = 0

    # ランキング計算
    RANKING_START = 1
    RANKING_INCREMENT = 1
    RANKING_DECREMENT = 1


class EmailConstants:
    """メール関連の定数を定義するクラス"""

    # 有効期限
    DEFAULT_VERIFICATION_EXPIRATION_HOURS = 24
    DEFAULT_PASSWORD_RESET_EXPIRATION_HOURS = 1
    DEFAULT_PASSWORD_RESET_EXPIRATION_MINUTES = 60

    # フロントエンドURL
    DEFAULT_FRONTEND_URL = "http://localhost:3000"
