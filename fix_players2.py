with open('src/data/players.ts', 'r') as f:
    lines = f.readlines()

# 找到 allPlayers 定义中的 ...additionalPlayers 位置并替换
new_lines = []
for i, line in enumerate(lines):
    if '...additionalPlayers' in line:
        # 用具体球员数据替换
        new_lines.append('  // 96公牛\n')
        new_lines.append('  ...[\n')
        new_lines.append('    {\n')
        new_lines.append("      id: 'dennis-rodman',\n")
        new_lines.append("      name: '丹尼斯-罗德曼',\n")
        new_lines.append("      nameEn: 'Dennis Rodman',\n")
        new_lines.append('      number: 91,\n')
        new_lines.append("      position: 'PF' as Position,\n")
        new_lines.append("      team: 'Chicago Bulls',\n")
        new_lines.append("      era: '90s' as Era,\n")
        new_lines.append("      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dennis_Rodman_2016.jpg/440px-Dennis_Rodman_2016.jpg',\n")
        new_lines.append('      stats: { points: 7.3, rebounds: 13.1, assists: 1.8, steals: 0.6, blocks: 0.6, fgPct: 47.3, threePct: 20.6, games: 1070 },\n')
        new_lines.append('      rating: 88,\n')
        new_lines.append('      offenseRating: 60,\n')
        new_lines.append('      defenseRating: 95,\n')
        new_lines.append('      honors: { mvp: 0, fmvp: 0, champion: 5, allNBA: 2, allDefense: 8, allStar: 2 },\n')
        new_lines.append('      per: 14.5,\n')
        new_lines.append('      ws: 97.5\n')
        new_lines.append('    }\n')
        new_lines.append('  ],\n')
    else:
        new_lines.append(line)

# 现在删除函数后面的孤立数据 (从 "// 96公牛" 开始到文件末尾)
# 先找到 getPlayersByPosition 函数结束位置，然后删除后面的内容
result = []
skip = False
for line in new_lines:
    if "export const getPlayerById = (id: string)" in line:
        skip = True
    if skip and line.strip().startswith('// 96公牛'):
        # 继续读取到函数定义
        continue
    if skip and 'export const getPlayerById' in line:
        skip = False
    if not skip:
        result.append(line)

with open('src/data/players.ts', 'w') as f:
    f.writelines(result)

print("Fixed!")
