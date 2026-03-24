with open('src/data/players.ts', 'r') as f:
    content = f.read()

# 1. 找到 allPlayers 定义 (行 ~1200)
import re

# 找到 allPlayers 结束位置
allplayers_match = re.search(r'(\.\.\.additionalPlayers\n\];)', content)
if not allplayers_match:
    print("Could not find allPlayers end")
    exit(1)

allplayers_end = allplayers_match.end()

# 2. 找到函数定义开始位置
func_match = re.search(r'\nexport const getPlayerById', content)
if not func_match:
    print("Could not find functions")
    exit(1)

func_start = func_match.start()

# 3. 找到 orphan 数据开始 (在函数之后)
orphan_match = re.search(r'\n\s*// 96公牛', content)
if not orphan_match or orphan_match.start() < func_start:
    print("Could not find orphan data")
    exit(1)

orphan_start = orphan_match.start()

# 4. 提取 orphan 数据 (到文件末尾)
orphan_data = content[orphan_start:]

# 5. 删除 orphan 数据
content = content[:orphan_start] + content[func_start:]

# 6. 构建 additionalPlayers 定义
additional_def = f'''
// 额外球员数据
export const additionalPlayers: Player[] = [
{orphan_data.strip()}
];
'''

# 7. 插入到 allPlayers 之后
content = content[:allplayers_end] + additional_def + content[allplayers_end:]

with open('src/data/players.ts', 'w') as f:
    f.write(content)

print("Fixed!")
