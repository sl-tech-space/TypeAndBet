#!/bin/bash

# requirements.inを生成
echo "requirements.inを生成中..."
python scripts/generate_requirements.py

# pip-toolsをインストール（なければ）
pip install --quiet pip-tools

# requirements.txtを生成
echo "requirements.txtを生成中..."
pip-compile requirements.in

echo "依存関係の更新が完了しました。" 