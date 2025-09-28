#!/usr/bin/env python3
"""
TypeAndBet Django管理コマンド用のスケジューラー
APSchedulerを使用してcronジョブを実行します
"""

import logging
import os
import subprocess
import sys
from datetime import datetime

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/app/logs/scheduler.log"),
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)


class DjangoJobScheduler:
    def __init__(self):
        self.scheduler = BlockingScheduler()
        self.app_dir = "/app"
        self.python_path = "/opt/venv/bin/python"
        self.django_env_file = "/tmp/django_env"

    def load_environment(self):
        """環境変数ファイルを読み込み"""
        if os.path.exists(self.django_env_file):
            with open(self.django_env_file, "r") as f:
                for line in f:
                    if line.strip() and not line.startswith("#"):
                        key, value = line.strip().split("=", 1)
                        # export を除去
                        if key.startswith("export "):
                            key = key[7:]
                        os.environ[key] = value.strip('"')
            logger.info("環境変数を読み込みました")
        else:
            logger.warning(f"環境変数ファイルが見つかりません: {self.django_env_file}")

    def run_django_command(self, command_args, job_name):
        """Django管理コマンドを実行"""
        try:
            logger.info(f"{job_name} ジョブを開始します")

            # 作業ディレクトリを変更
            os.chdir(self.app_dir)

            # コマンド実行
            cmd = [self.python_path, "/app/manage.py"] + command_args
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300,  # 5分のタイムアウト
            )

            # ログファイルに出力
            log_file = f"/app/logs/{job_name}.log"
            with open(log_file, "a", encoding="utf-8") as f:
                f.write(f"\n=== {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===\n")
                f.write(f"Exit code: {result.returncode}\n")
                if result.stdout:
                    f.write(f"STDOUT:\n{result.stdout}\n")
                if result.stderr:
                    f.write(f"STDERR:\n{result.stderr}\n")
                f.write("=" * 50 + "\n")

            if result.returncode == 0:
                logger.info(f"{job_name} ジョブが正常に完了しました")
            else:
                logger.error(
                    f"{job_name} ジョブが失敗しました (Exit code: {result.returncode})"
                )

        except subprocess.TimeoutExpired:
            logger.error(f"{job_name} ジョブがタイムアウトしました")
        except Exception as e:
            logger.error(f"{job_name} ジョブでエラーが発生しました: {str(e)}")

    def setup_jobs(self):
        """スケジュールジョブを設定"""

        # generate_text_job: 0,10,20,30,40,50分に実行
        self.scheduler.add_job(
            func=self.run_django_command,
            trigger=CronTrigger(minute="0,10,20,30,40,50"),
            args=(["generate_text_job"], "generate_text_job"),
            id="generate_text_job",
            name="AIテキスト生成ジョブ",
            replace_existing=True,
        )

        # convert_hiragana_job: 5,15,25,35,45,55分に実行
        self.scheduler.add_job(
            func=self.run_django_command,
            trigger=CronTrigger(minute="5,15,25,35,45,55"),
            args=(["convert_hiragana_job"], "convert_hiragana_job"),
            id="convert_hiragana_job",
            name="ひらがな変換ジョブ",
            replace_existing=True,
        )

        # partition_textpairs: 毎日2:00に実行
        self.scheduler.add_job(
            func=self.run_django_command,
            trigger=CronTrigger(hour=2, minute=0),
            args=(["partition_textpairs", "--all"], "partition_textpairs"),
            id="partition_textpairs",
            name="テキストペア分割ジョブ",
            replace_existing=True,
        )

        logger.info("スケジュールジョブを設定しました")

    def start(self):
        """スケジューラーを開始"""
        try:
            logger.info("スケジューラーを開始します")
            self.scheduler.start()
        except KeyboardInterrupt:
            logger.info("スケジューラーを停止します")
            self.scheduler.shutdown()
        except Exception as e:
            logger.error(f"スケジューラーでエラーが発生しました: {str(e)}")
            sys.exit(1)


def main():
    """メイン関数"""
    logger.info("TypeAndBet Django スケジューラーを開始します")

    # スケジューラーを作成
    scheduler = DjangoJobScheduler()

    # 環境変数を読み込み
    scheduler.load_environment()

    # ジョブを設定
    scheduler.setup_jobs()

    # 設定されたジョブを表示
    logger.info("設定されたジョブ:")
    logger.info(
        "  - AIテキスト生成ジョブ (ID: generate_text_job) - 0,10,20,30,40,50分に実行"
    )
    logger.info(
        "  - ひらがな変換ジョブ (ID: convert_hiragana_job) - 5,15,25,35,45,55分に実行"
    )
    logger.info("  - テキストペア分割ジョブ (ID: partition_textpairs) - 毎日2:00に実行")

    # スケジューラーを開始
    logger.info("スケジューラーを開始します...")
    scheduler.start()


if __name__ == "__main__":
    main()
