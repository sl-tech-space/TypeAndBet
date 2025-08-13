import logging
import statistics

logger = logging.getLogger("app")


class GameCalculator:
    @staticmethod
    def calculate_score(correct_typed: int, accuracy: float) -> int:
        """
        スコアを計算する
        """
        # accuracy が 0 の場合はゼロ除算を避け、スコア 0 を返す
        if accuracy == 0:
            return 0
        return int(correct_typed * 10 / accuracy)

    @staticmethod
    def calculate_z_score(score: int, past_scores: list) -> float:
        """
        Zスコアを計算する
        """
        if not past_scores:
            return 0

        median = statistics.median(past_scores)
        std_dev = statistics.stdev(past_scores) if len(past_scores) > 1 else 1
        return (score - median) / std_dev if std_dev != 0 else 0

    @staticmethod
    def calculate_multiplier(z_score: float) -> float:
        """
        倍率を計算する
        """
        if z_score >= 3.0:
            return 3.0  # 上位0.1%
        if z_score >= 2.5:
            return 2.5  # 上位0.6%
        if z_score >= 2.0:
            return 2.0  # 上位2.3%
        if z_score >= 1.5:
            return 1.75  # 上位6.7%
        if z_score >= 1.0:
            return 1.5  # 上位15.9%
        if z_score >= 0.5:
            return 1.25  # 上位30.9%
        if z_score >= 0.0:
            return 1.0  # 上位50%
        if z_score >= -0.5:
            return -1.0  # 下位30.9%
        if z_score >= -1.0:
            return -1.5  # 下位15.9%
        if z_score >= -1.5:
            return -2.0  # 下位6.7%
        if z_score >= -2.0:
            return -2.5  # 下位2.3%
        if z_score >= -2.5:
            return -3.0  # 下位0.6%
        return -4.0  # 下位0.1%

    @staticmethod
    def calculate_gold_change(
        multiplier: float, bet_amount: int, user_gold: int = None
    ) -> int:
        """
        ゴールドの変化を計算する
        """
        if multiplier >= 0:
            return int(bet_amount * multiplier)
        base_loss = int(bet_amount * abs(multiplier))
        additional_loss = int(bet_amount * 0.1)
        total_loss = base_loss + additional_loss
        if user_gold is not None and total_loss > user_gold:
            total_loss = user_gold
        return -total_loss
