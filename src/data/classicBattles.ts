import { Team } from '../types';

// 经典战役数据
export interface ClassicBattle {
  id: string;
  name: string;
  year: number;
  teamA: {
    teamId: string;
    name: string;
    story: string;
  };
  teamB: {
    teamId: string;
    name: string;
    story: string;
  };
  background: string;
  highlight: string;
}

export const classicBattles: ClassicBattle[] = [
  {
    id: '1998-final',
    name: '1998年总决赛',
    year: 1998,
    teamA: {
      teamId: '96-bulls',
      name: '1996芝加哥公牛',
      story: '乔丹、皮蓬、罗德曼领衔，72胜10负历史第一战绩的王者之师'
    },
    teamB: {
      teamId: '98-jazz',
      name: '1998犹他爵士',
      story: '卡尔·马龙和约翰·斯托克顿组成"黑白双煞"，连续两年总决赛'
    },
    background: '1998年总决赛是公牛王朝的最后一舞，乔丹完成最后一投，锁定第六冠',
    highlight: '乔丹最后时刻晃倒拉塞尔，投中准绝杀'
  },
  {
    id: '2016-final',
    name: '2016年总决赛',
    year: 2016,
    teamA: {
      teamId: '16-cavaliers',
      name: '2016克里夫兰骑士',
      story: '詹姆斯、欧文、乐福领衔，骑士三巨头首次合体'
    },
    teamB: {
      teamId: '17-warriors',
      name: '2017金州勇士',
      story: '库里、克莱、KD组成"死神组合"，赛季73胜历史第一'
    },
    background: '总决赛1-3落后完成大逆转，骑士打破勇士主场不败金身',
    highlight: '詹姆斯追身大帽，欧文关键三分，骑士完成历史性翻盘'
  },
  {
    id: '1987-allstar',
    name: '1987年全明星赛',
    year: 1987,
    teamA: {
      teamId: '86-celtics',
      name: '1986波士顿凯尔特人',
      story: '伯德、麦克海尔、帕里什组成"铁血三角"，80年代最强战队'
    },
    teamB: {
      teamId: '86-lakers',
      name: '1986洛杉矶湖人',
      story: '魔术师、贾巴尔、沃西领衔，SHOWTIME湖人的巅峰之作'
    },
    background: '80年代黄绿大战的经典对决，NBA最辉煌时代的巅峰碰撞',
    highlight: '伯德连续三分绝杀，魔术师背后妙传'
  },
  {
    id: '2001-west-conf',
    name: '2001年西部决赛',
    year: 2001,
    teamA: {
      teamId: '00-lakers',
      name: '2000洛杉矶湖人',
      story: 'OK组合巅峰期，科比和奥尼尔统治级的双人组合'
    },
    teamB: {
      teamId: '00-76ers',
      name: '2001费城76人',
      story: '艾弗森单核带队，MVP赛季的孤胆英雄'
    },
    background: '湖人季后赛全胜战绩晋级总决赛，AI单挑OK组合',
    highlight: '艾弗森G1狂砍48分挑落湖人，终结紫金军团季后赛全胜'
  },
  {
    id: '2013-final',
    name: '2013年总决赛',
    year: 2013,
    teamA: {
      teamId: '13-heat',
      name: '2013迈阿密热火',
      story: '詹姆斯、韦德、波什三巨头，27连胜的卫冕冠军'
    },
    teamB: {
      teamId: '14-spurs',
      name: '2014圣安东尼奥马刺',
      story: 'GDP组合最后巅峰，团队篮球的极致代表'
    },
    background: '总决赛上演绝地七分钟，雷·阿伦关键三分扳平比分',
    highlight: '雷·阿伦底角三分拖入加时，热火完成卫冕'
  },
  {
    id: '1986-final',
    name: '1986年总决赛',
    year: 1986,
    teamA: {
      teamId: '86-celtics',
      name: '1986波士顿凯尔特人',
      story: '伯德MVP赛季，攻防两端无懈可击的超级战队'
    },
    teamB: {
      teamId: '86-rockets',
      name: '1986休斯顿火箭',
      story: '奥拉朱旺和桑普森组成"双塔"，内线统治力超强'
    },
    background: '凯尔特人队史第16冠，伯德总决赛MVP三连庄',
    highlight: '伯德"世纪偷球"成经典，总决赛G4三双表现'
  },
  {
    id: '2022-final',
    name: '2022年总决赛',
    year: 2022,
    teamA: {
      teamId: '17-warriors',
      name: '2022金州勇士',
      story: '库里、克莱、格林重逢，勇士王朝复兴'
    },
    teamB: {
      teamId: '22-celtics',
      name: '2022波士顿凯尔特人',
      story: '塔图姆、布朗领衔，年轻势力的崛起'
    },
    background: '勇士时隔4年重返总决赛，库里终于圆梦FMVP',
    highlight: '库里G4狂砍43分+7三分，G6关键三分锁定冠军'
  },
  {
    id: '1995-west-conf',
    name: '1995年西部决赛',
    year: 1995,
    teamA: {
      teamId: '95-rockets',
      name: '1995休斯顿火箭',
      story: '奥拉朱旺率队卫冕冠军，实现两连冠'
    },
    teamB: {
      teamId: '95-magic',
      name: '1995奥兰多魔术',
      story: '奥尼尔和哈达威年轻组合，东部第一战绩'
    },
    background: '火箭连续两年总决赛，西部决赛4-2淘汰魔术',
    highlight: '奥拉朱旺完胜奥尼尔，火箭上演下克上'
  },
  {
    id: '2009-west-conf',
    name: '2009年西部决赛',
    year: 2009,
    teamA: {
      teamId: '00-lakers',
      name: '2009洛杉矶湖人',
      story: '科比加索尔组合，冲击三连冠的王朝球队'
    },
    teamB: {
      teamId: '09-nuggets',
      name: '2009丹佛掘金',
      story: '安东尼和比卢普斯领衔，攻击火力超强'
    },
    background: '科比场均34分统治系列赛，湖人重返总决赛',
    highlight: '科比G1准三双，G6关键中投杀死比赛'
  },
  {
    id: '2020-final',
    name: '2020年总决赛',
    year: 2020,
    teamA: {
      teamId: '20-lakers',
      name: '2020洛杉矶湖人',
      story: '詹姆斯、戴维斯双核，园区冠军特殊赛季'
    },
    teamB: {
      teamId: '20-heat',
      name: '2020迈阿密热火',
      story: '巴姆·阿德巴约带领的黑马球队'
    },
    background: '疫情下的园区总决赛，詹姆斯第四冠戴维斯首冠',
    highlight: '詹姆斯G5三双统治，G6关键盖帽锁定胜局'
  }
];

// 获取预设球队ID映射
export const getClassicBattleTeams = (battleId: string) => {
  const battle = classicBattles.find(b => b.id === battleId);
  if (!battle) return null;
  return {
    teamA: battle.teamA.teamId,
    teamB: battle.teamB.teamId
  };
};