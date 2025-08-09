# Generated manually for textpairs table partitioning

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0002_textpair_alter_game_options_remove_game_gold_change_and_more"),
    ]

    operations = [
        migrations.RunSQL(
            # 既存のtext_pairsテーブルをパーティション化
            sql="""
            -- 既存のtext_pairsテーブルをリネーム
            ALTER TABLE text_pairs RENAME TO text_pairs_old;
            
            -- パーティション化されたtext_pairsテーブルを作成
            CREATE TABLE text_pairs (
                id BIGSERIAL,
                kanji TEXT NOT NULL,
                hiragana TEXT,
                is_converted BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            ) PARTITION BY RANGE (created_at);
            
            -- 今日のパーティションを作成
            CREATE TABLE text_pairs_default PARTITION OF text_pairs DEFAULT;
            
            -- 既存データを新しいテーブルに移行
            INSERT INTO text_pairs (id, kanji, hiragana, is_converted, created_at, updated_at)
            SELECT id, kanji, hiragana, is_converted, created_at, updated_at
            FROM text_pairs_old;
            
            -- シーケンスを更新
            SELECT setval('text_pairs_id_seq', (SELECT MAX(id) FROM text_pairs));
            
            -- 古いテーブルを削除
            DROP TABLE text_pairs_old;
            
            -- インデックスを作成
            CREATE INDEX idx_text_pairs_created_at ON text_pairs (created_at);
            CREATE INDEX idx_text_pairs_is_converted ON text_pairs (is_converted);
            """,
            reverse_sql="""
            -- パーティション化を元に戻す（注意：データ損失の可能性）
            CREATE TABLE text_pairs_temp AS SELECT * FROM text_pairs;
            DROP TABLE text_pairs CASCADE;
            ALTER TABLE text_pairs_temp RENAME TO text_pairs;
            """,
        ),
    ]
