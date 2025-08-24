#!/bin/bash

echo "=== Nginx設定テストスクリプト ==="

# 必要なファイルの存在確認
echo "1. 必要なファイルの存在確認..."
required_files=(
    "Dockerfile"
    "nginx.conf.template"
    "default.conf.template"
    "custom-entrypoint.sh"
    "modsecurity.d/"
)

for file in "${required_files[@]}"; do
    if [ -e "$file" ]; then
        echo "✓ $file が存在します"
    else
        echo "✗ $file が見つかりません"
    fi
done

# 権限設定の確認
echo "2. 権限設定の確認..."
if [ -x "custom-entrypoint.sh" ]; then
    echo "✓ custom-entrypoint.sh に実行権限があります"
else
    echo "✗ custom-entrypoint.sh に実行権限がありません"
    chmod +x custom-entrypoint.sh
    echo "→ 実行権限を付与しました"
fi

# Dockerfileの構文チェック
echo "3. Dockerfileの構文チェック..."
if command -v docker >/dev/null 2>&1; then
    echo "Dockerが利用可能です。構文チェックを実行中..."
    if docker build --dry-run . > /dev/null 2>&1; then
        echo "✓ Dockerfileの構文は正常です"
    else
        echo "✗ Dockerfileに構文エラーがあります"
        echo "詳細なエラーを確認するには以下を実行してください："
        echo "  docker build --no-cache ."
    fi
else
    echo "⚠ Dockerがインストールされていません。構文チェックをスキップします"
fi

# 設定ファイルの内容確認
echo "4. 設定ファイルの内容確認..."
if grep -q "user nginx" nginx.conf.template; then
    echo "✓ nginx.conf.template でnginxユーザーが設定されています"
else
    echo "✗ nginx.conf.template でnginxユーザーが設定されていません"
fi

echo "=== テスト完了 ==="
echo ""
echo "次のステップ:"
echo "1. docker-compose -f docker-compose.staging.yml build nginx"
echo "2. docker-compose -f docker-compose.staging.yml up nginx"
