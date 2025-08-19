class AuthErrorMessages:
    """認証に関するエラーメッセージを定義するクラス"""

    AUTHENTICATION_FAILED = "認証に失敗しました"
    INVALID_CREDENTIALS = "メールアドレスまたはパスワードが正しくありません"
    USER_NOT_FOUND = "ユーザーが見つかりません"
    INVALID_TOKEN = "トークンが無効か期限切れです"
    TOKEN_GENERATION_ERROR = "トークンの生成に失敗しました"
    REQUIRED_FIELDS_MISSING = "メールアドレスとパスワードは必須です"
    INVALID_EMAIL_FORMAT = "メールアドレスの形式が正しくありません"
    DUPLICATE_EMAIL = "このメールアドレスは既に使用されています"


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


class TextGeneratorErrorMessages:
    """テキスト生成に関するエラーメッセージを定義するクラス"""

    INITIALIZATION_ERROR = "テキスト生成器の初期化に失敗しました"
    TEXT_GENERATION_ERROR = "テキストの生成に失敗しました"
    RESPONSE_PROCESSING_ERROR = "生成されたテキストの処理に失敗しました"


class ThrottlingLimits:
    """レート制限の設定値を定義するクラス"""

    # 認証関連（最も厳格）
    AUTH_LOGIN = "5/m"  # 1分間に5回のログイン試行
    AUTH_REGISTER = "5/m"  # 1分間に5回のユーザー登録
    AUTH_PASSWORD_RESET = "3/m"  # 1分間に3回のパスワードリセット要求
    AUTH_EMAIL_VERIFY = "10/m"  # 1分間に10回のメール確認
    AUTH_EMAIL_RESEND = "3/m"  # 1分間に3回のメール再送信

    # ゲーム関連
    GAME_CREATE = "10/m"  # 1分間に10回のゲーム作成
    GAME_UPDATE = "30/m"  # 1分間に30回のゲーム更新
    GAME_SIMULATE = "30/m"  # 1分間に30回の練習完了
    GAME_TEXT_GENERATE = "5/m"  # 1分間に5回のテキスト生成
    GAME_TEXT_PAIR = "30/m"  # 1分間に30回のテキストペア取得
    GAME_HIRAGANA_CONVERT = "10/m"  # 1分間に10回のひらがな変換

    # その他
    QUERY = "200/m"  # 1分間に200回のクエリ
    MUTATION = "100/m"  # 1分間に100回のミューテーション


class TimeConstants:
    """時間関連の定数を定義するクラス"""

    # 秒単位
    ONE_SECOND = 1
    ONE_MINUTE = 60
    ONE_HOUR = 3600
    ONE_DAY = 86400

    # 分単位
    FIVE_MINUTES = 5
    TEN_MINUTES = 10
    THIRTY_MINUTES = 30

    # 時間単位
    ONE_HOUR_HOURS = 1
    TWENTY_FOUR_HOURS = 24

    # 日単位
    FOURTEEN_DAYS = 14
    THIRTY_DAYS = 30


class GameConstants:
    """ゲーム関連の定数を定義するクラス"""

    # ベット金額の制限
    MIN_BET_AMOUNT = 100
    MAX_BET_AMOUNT = 700

    # スコア関連
    MIN_SCORE = 0
    MIN_ACCURACY = 0.0
    MAX_ACCURACY = 1.0

    # テキストペア関連
    DEFAULT_TEXT_PAIR_COUNT = 30
    MAX_TEXT_PAIR_COUNT = 100

    # ランキング関連
    DEFAULT_RANKING = 999999


class ValidationConstants:
    """バリデーション関連の定数を定義するクラス"""

    # 文字列長制限
    MAX_NAME_LENGTH = 255
    MAX_EMAIL_LENGTH = 254
    MIN_PASSWORD_LENGTH = 8

    # 数値制限
    MIN_USER_ID_LENGTH = 1
    MAX_USER_ID_LENGTH = 1000000


class ModelConstants:
    """モデル関連の定数を定義するクラス"""

    # 文字列長制限
    MAX_NAME_LENGTH = 15
    MAX_EMAIL_LENGTH = 254
    MAX_ICON_LENGTH = 255
    MAX_TOKEN_HASH_LENGTH = 64
    MAX_IDEMPOTENCY_KEY_LENGTH = 255

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


class TokenConstants:
    """トークン関連の定数を定義するクラス"""

    # 有効期限
    ACCESS_TOKEN_EXPIRE_DAYS = 14
    REFRESH_TOKEN_EXPIRE_DAYS = 30

    # アルゴリズム
    JWT_ALGORITHM = "HS256"

    # その他
    TOKEN_HEX_LENGTH = 16


class LoggingConstants:
    """ログ関連の定数を定義するクラス"""

    # ファイルサイズ制限
    MAX_LOG_FILE_SIZE = 1024 * 1024 * 5  # 5MB
    DEFAULT_BACKUP_COUNT = 5

    # ポート番号
    DEFAULT_FRONTEND_PORT = "3000"
    DEFAULT_DB_PORT = "5432"
    DEFAULT_EMAIL_PORT = 587
