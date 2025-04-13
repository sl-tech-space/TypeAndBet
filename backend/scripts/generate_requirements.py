import ast
import os
import sys
from pathlib import Path

def extract_imports(file_path):
    """Pythonファイルから import 文を抽出"""
    with open(file_path, 'r', encoding='utf-8') as file:
        try:
            tree = ast.parse(file.read())
        except:
            return set()

    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for name in node.names:
                imports.add(name.name.split('.')[0])
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.add(node.module.split('.')[0])
    return imports

def get_project_imports():
    """プロジェクト内の全Pythonファイルからimportを収集"""
    imports = set()
    backend_dir = Path(__file__).parent.parent
    
    for root, _, files in os.walk(backend_dir):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                imports.update(extract_imports(file_path))
    
    # 設定ファイルから特別な依存関係を検出
    settings_file = backend_dir / 'config' / 'settings' / '__init__.py'
    if settings_file.exists():
        with open(settings_file, 'r', encoding='utf-8') as f:
            content = f.read()
            if 'postgresql' in content:
                imports.add('psycopg2')
    
    return imports

def filter_standard_libs(imports):
    """標準ライブラリを除外"""
    std_libs = set(sys.stdlib_module_names)
    return {imp for imp in imports if imp not in std_libs}

def categorize_imports(imports):
    """importを種類別に分類"""
    package_patterns = {
        'Django & REST Framework': {
            'django',
            'rest_framework',
            'corsheaders'
        },
        'Database': {
            'psycopg',
            'psycopg2',
            'psycopg2_binary'
        },
        'Environment': {
            'dotenv',
            'environ'
        },
        'Development': {
            'black',
            'flake8',
            'isort'
        },
        'Production': {
            'gunicorn',
            'whitenoise'
        }
    }
    
    categorized = {cat: [] for cat in package_patterns}
    others = []
    
    for imp in imports:
        categorized_flag = False
        for cat, patterns in package_patterns.items():
            if any(imp.lower().startswith(pattern) for pattern in patterns):
                categorized[cat].append(imp)
                categorized_flag = True
                break
        if not categorized_flag:
            others.append(imp)
    
    if others:
        categorized['Other'] = others
    
    return categorized

def generate_requirements_in():
    """requirements.inファイルを生成"""
    imports = get_project_imports()
    filtered_imports = filter_standard_libs(imports)
    categorized = categorize_imports(filtered_imports)
    
    requirements_in_path = Path(__file__).parent.parent / 'requirements.in'
    
    with open(requirements_in_path, 'w', encoding='utf-8') as f:
        for category, packages in categorized.items():
            if packages:
                f.write(f'\n# {category}\n')
                for package in sorted(packages):
                    if not any(package.lower() == cat.lower().replace(' & ', '_').replace(' ', '_') 
                            for cat in categorized.keys()):
                        f.write(f'{package}\n')

if __name__ == '__main__':
    generate_requirements_in()
    print('requirements.inを生成しました。')
    print('pip-compile requirements.in を実行してrequirements.txtを生成してください。') 