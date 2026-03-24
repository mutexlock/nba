with open('src/data/players.ts', 'r') as f:
    content = f.read()

# 在 allPlayers 定义之后添加 additionalPlayers 定义
old = '''export const allPlayers: Player[] = [
  ...players,
  ...players80s,
  ...players90s,
  ...players00s,
  ...players10s,
  ...players20s,
  ...additionalPlayers
];

export const getPlayerById'''

new = '''export const allPlayers: Player[] = [
  ...players,
  ...players80s,
  ...players90s,
  ...players00s,
  ...players10s,
  ...players20s,
  ...additionalPlayers
];

// 额外球员数据 (96公牛、17勇士、86凯尔特人等)
export const additionalPlayers: Player[] = [
  // 96公牛
  {
    id: 'dennis-rodman',
    name: '丹尼斯-罗德曼',
    nameEn: 'Dennis Rodman',
    number: 91,
    position: 'PF',
    team: 'Chicago Bulls',
    era: '90s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dennis_Rodman_2016.jpg/440px-Dennis_Rodman_2016.jpg',
    stats: { points: 7.3, rebounds: 13.1, assists: 1.8, steals: 0.6, blocks: 0.6, fgPct: 47.3, threePct: 20.6, games: 1070 },
    rating: 88,
    offenseRating: 60,
    defenseRating: 95,
    honors: { mvp: 0, fmvp: 0, champion: 5, allNBA: 2, allDefense: 8, allStar: 2 },
    per: 14.5,
    ws: 97.5
  },
  {
    id: 'luc-longley',
    name: '卢克-朗利',
    nameEn: 'Luc Longley',
    number: 13,
    position: 'C',
    team: 'Chicago Bulls',
    era: '90s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Luc_Longley.jpg/440px-Luc_Longley.jpg',
    stats: { points: 11.1, rebounds: 5.4, assists: 2.5, steals: 0.9, blocks: 0.6, fgPct: 47.2, threePct: 21.3, games: 754 },
    rating: 75,
    offenseRating: 76,
    defenseRating: 75,
    honors: { mvp: 0, fmvp: 0, champion: 3, allNBA: 0, allDefense: 0, allStar: 0 },
    per: 12.9,
    ws: 53.2
  },
  {
    id: 'steve-kerr',
    name: '史蒂夫-科尔',
    nameEn: 'Steve Kerr',
    number: 25,
    position: 'PG',
    team: 'Chicago Bulls',
    era: '90s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Steve_Kerr_(48465681362).jpg/440px-Steve_Kerr_(48465681362).jpg',
    stats: { points: 6.0, rebounds: 1.2, assists: 2.8, steals: 0.7, blocks: 0.1, fgPct: 47.9, threePct: 45.4, games: 910 },
    rating: 78,
    offenseRating: 85,
    defenseRating: 72,
    honors: { mvp: 0, fmvp: 0, champion: 5, allNBA: 0, allDefense: 0, allStar: 0 },
    per: 11.7,
    ws: 53.4
  },
  // 17勇士
  {
    id: 'zaza-pachulia',
    name: '扎扎-帕楚里亚',
    nameEn: 'Zaza Pachulia',
    number: 27,
    position: 'C',
    team: 'Golden State Warriors',
    era: '10s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Zaza_Pachulia_(cropped).jpg/440px-Zaza_Pachulia_(cropped).jpg',
    stats: { points: 8.7, rebounds: 6.9, assists: 1.3, steals: 0.8, blocks: 0.4, fgPct: 49.0, threePct: 14.7, games: 1088 },
    rating: 76,
    offenseRating: 76,
    defenseRating: 75,
    honors: { mvp: 0, fmvp: 0, champion: 2, allNBA: 0, allDefense: 0, allStar: 0 },
    per: 12.2,
    ws: 66.3
  },
  // 86凯尔特人
  {
    id: 'kevin-mchale',
    name: '凯文-麦克海尔',
    nameEn: 'Kevin McHale',
    number: 32,
    position: 'PF',
    team: 'Boston Celtics',
    era: '80s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kevin_McHale_(cropped).jpg/440px-Kevin_McHale_(cropped).jpg',
    stats: { points: 17.9, rebounds: 7.3, assists: 1.7, steals: 0.4, blocks: 1.7, fgPct: 55.4, threePct: 26.1, games: 971 },
    rating: 90,
    offenseRating: 88,
    defenseRating: 85,
    honors: { mvp: 0, fmvp: 0, champion: 3, allNBA: 6, allDefense: 3, allStar: 7 },
    per: 21.5,
    ws: 180.2
  },
  {
    id: 'robert-parish',
    name: '罗伯特-帕里什',
    nameEn: 'Robert Parish',
    number: 0,
    position: 'C',
    team: 'Boston Celtics',
    era: '80s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Robert_Parish.jpg/440px-Robert_Parish.jpg',
    stats: { points: 14.5, rebounds: 9.1, assists: 1.4, steals: 0.8, blocks: 1.5, fgPct: 53.7, threePct: 21.6, games: 1606 },
    rating: 90,
    offenseRating: 82,
    defenseRating: 86,
    honors: { mvp: 0, fmvp: 0, champion: 4, allNBA: 9, allDefense: 2, allStar: 9 },
    per: 18.3,
    ws: 244.2
  },
  {
    id: 'dennis-johnson',
    name: '丹尼斯-约翰逊',
    nameEn: 'Dennis Johnson',
    number: 3,
    position: 'PG',
    team: 'Boston Celtics',
    era: '80s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Dennis_Johnson.jpg/440px-Dennis_Johnson.jpg',
    stats: { points: 14.1, rebounds: 3.0, assists: 5.0, steals: 1.9, blocks: 0.5, fgPct: 44.7, threePct: 25.6, games: 1100 },
    rating: 86,
    offenseRating: 82,
    defenseRating: 88,
    honors: { mvp: 0, fmvp: 1, champion: 1, allNBA: 5, allDefense: 6, allStar: 5 },
    per: 15.8,
    ws: 124.1
  },
  {
    id: 'danny-ainge',
    name: '丹尼-安吉',
    nameEn: 'Danny Ainge',
    number: 44,
    position: 'SG',
    team: 'Boston Celtics',
    era: '80s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Danny_Ainge_(cropped).jpg/440px-Danny_Ainge_(cropped).jpg',
    stats: { points: 10.6, rebounds: 2.7, assists: 4.0, steals: 1.1, blocks: 0.1, fgPct: 45.6, threePct: 30.8, games: 1043 },
    rating: 78,
    offenseRating: 80,
    defenseRating: 76,
    honors: { mvp: 0, fmvp: 0, champion: 2, allNBA: 0, allDefense: 0, allStar: 0 },
    per: 11.3,
    ws: 54.2
  },
  // 20湖人
  {
    id: 'dwight-howard',
    name: '德怀特-霍华德',
    nameEn: 'Dwight Howard',
    number: 39,
    position: 'C',
    team: 'Los Angeles Lakers',
    era: '10s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Dwight_Howard_2018.jpg/440px-Dwight_Howard_2018.jpg',
    stats: { points: 15.7, rebounds: 11.8, assists: 1.4, steals: 0.8, blocks: 1.8, fgPct: 57.0, threePct: 9.8, games: 1184 },
    rating: 88,
    offenseRating: 85,
    defenseRating: 88,
    honors: { mvp: 3, fmvp: 0, champion: 1, allNBA: 8, allDefense: 5, allStar: 8 },
    per: 20.6,
    ws: 183.2
  },
  {
    id: 'anthony-davis',
    name: '安东尼-戴维斯',
    nameEn: 'Anthony Davis',
    number: 23,
    position: 'PF',
    team: 'Los Angeles Lakers',
    era: '10s',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Anthony_Davis_(52828094961)_(cropped).jpg/440px-Anthony_Davis_(52828094961)_(cropped).jpg',
    stats: { points: 20.9, rebounds: 8.9, assists: 2.1, steals: 1.3, blocks: 2.1, fgPct: 51.2, threePct: 31.1, games: 679 },
    rating: 92,
    offenseRating: 90,
    defenseRating: 92,
    honors: { mvp: 1, fmvp: 1, champion: 1, allNBA: 8, allDefense: 4, allStar: 10 },
    per: 25.3,
    ws: 129.2
  }
];

export const getPlayerById'''

content = content.replace(old, new)

# 然后删除文件后面的孤立数据
import re
# 找到并删除函数定义后面的孤立数据
content = re.sub(
    r'\nexport const getPlayersByPosition = \(position: string\): Player\[\] => \{[^}]+\};\s*// 96公牛.*',
    '\nexport const getPlayersByPosition = (position: string): Player[] => {\n  return allPlayers.filter(p => p.position === position);\n};',
    content,
    flags=re.DOTALL
)

with open('src/data/players.ts', 'w') as f:
    f.write(content)

print("Fixed!")
