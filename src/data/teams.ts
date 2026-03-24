import { Team } from '../types';

export const presetTeams: Team[] = [
  {
    id: '96-bulls',
    name: '1996芝加哥公牛',
    shortName: '96 Bulls',
    logo: '/images/teams/96-bulls.png',
    era: '90s',
    players: ['michael-jordan', 'scottie-pippen', 'dennis-rodman', 'luc-longley', 'steve-kerr'],
    rating: 98,
    isPreset: true,
    description: '72胜10负历史最佳战绩，NBA历史上最伟大的球队之一'
  },
  {
    id: '17-warriors',
    name: '2017金州勇士',
    shortName: '17 Warriors',
    logo: '/images/teams/17-warriors.png',
    era: '10s',
    players: ['stephen-curry', 'klay-thompson', 'kevin-durant', 'draymond-green', 'zaza-pachulia'],
    rating: 97,
    isPreset: true,
    description: '死神杜兰特的加盟让勇士成为历史级进攻球队'
  },
  {
    id: '00-lakers',
    name: '2000洛杉矶湖人',
    shortName: '00 Lakers',
    logo: '/images/teams/00-lakers.png',
    era: '00s',
    players: ['shaquille-o\'neal', 'kobe-bryant', 'pau-gasol', 'lamarcus-aldridge', 'derek-fisher'],
    rating: 96,
    isPreset: true,
    description: 'OK组合巅峰赛季，三连冠王朝的开始'
  },
  {
    id: '86-celtics',
    name: '1986波士顿凯尔特人',
    shortName: '86 Celtics',
    logo: '/images/teams/86-celtics.png',
    era: '80s',
    players: ['larry-bird', 'kevin-mchale', 'robert-parish', 'dennis-johnson', 'danny-ainge'],
    rating: 95,
    isPreset: true,
    description: '伯德领衔的超级战队，攻防两端都无懈可击'
  },
  {
    id: '86-lakers',
    name: '1986洛杉矶湖人',
    shortName: '86 Lakers',
    logo: '/images/teams/86-lakers.png',
    era: '80s',
    players: ['magic-johnson', 'kareem-abdul-jabbar', 'james-worthy', 'clyde-drexler', 'michael-cooper'],
    rating: 95,
    isPreset: true,
    description: 'SHOWTIME湖人的巅峰之作'
  },
  {
    id: '98-jazz',
    name: '1998犹他爵士',
    shortName: '98 Jazz',
    logo: '/images/teams/98-jazz.png',
    era: '90s',
    players: ['karl-malone', 'john-stockton', 'grant-hill', 'bryant-reaves', 'olden-poly'],
    rating: 92,
    isPreset: true,
    description: '黑白双煞的最后一季，连续两年总决赛'
  },
  {
    id: '13-heat',
    name: '2013迈阿密热火',
    shortName: '13 Heat',
    logo: '/images/teams/13-heat.png',
    era: '10s',
    players: ['lebron-james', 'dwyane-wade', 'chris-bosh', 'ray-allen', 'mario-chalmers'],
    rating: 94,
    isPreset: true,
    description: '三巨头完整版，27连胜的恐怖战绩'
  },
  {
    id: '16-cavaliers',
    name: '2016克里夫兰骑士',
    shortName: '16 Cavs',
    logo: '/images/teams/16-cavaliers.png',
    era: '10s',
    players: ['lebron-james', 'russell-westbrook', 'kevin-love', 'carmelo-anthony', 'tristan-thompson'],
    rating: 93,
    isPreset: true,
    description: '总决赛1-3翻盘，创造历史的逆转'
  },
  {
    id: '14-spurs',
    name: '2014圣安东尼奥马刺',
    shortName: '14 Spurs',
    logo: '/images/teams/14-spurs.png',
    era: '10s',
    players: ['tim-duncan', 'tony-parker', 'manu-ginobili', 'kawhi-leonard', 'lamarcus-aldridge'],
    rating: 92,
    isPreset: true,
    description: '团队篮球的极致，总决赛吊打热火'
  },
  {
    id: '20-lakers',
    name: '2020洛杉矶湖人',
    shortName: '20 Lakers',
    logo: '/images/teams/20-lakers.png',
    era: '20s',
    players: ['lebron-james', 'anthony-edwards', 'anthony-davis', 'dwight-howard', 'rajon-rondo'],
    rating: 91,
    isPreset: true,
    description: '园区冠军，詹眉组合的首个冠军'
  }
];

export const getTeamById = (id: string): Team | undefined => {
  return presetTeams.find(t => t.id === id);
};

export const getTeamsByEra = (era: string): Team[] => {
  return presetTeams.filter(t => t.era === era);
};