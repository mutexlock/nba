// 球员位置
export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

// 时代标签
export type Era = '80s' | '90s' | '00s' | '10s' | '20s';

// 球员数据
export interface Player {
  id: string;
  name: string;
  nameEn: string;
  number: number;
  position: Position;
  team: string;
  era: Era;
  avatar: string;
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    fgPct: number;
    threePct: number;
    games: number;
  };
  rating: number;
  offenseRating: number;
  defenseRating: number;
  honors: {
    mvp: number;
    fmvp: number;
    champion: number;
    allNBA: number;
    allDefense: number;
    allStar: number;
  };
  per: number;
  ws: number;
}

// 球队数据
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  era: string;
  players: string[];
  rating: number;
  isPreset: boolean;
  description: string;
}

// 球员比赛数据
export interface PlayerStats {
  playerId: string;
  points: number;
  rebounds: number;
  assists: number;
  fgMade: number;
  fgAttempted: number;
  threeMade: number;
  threeAttempted: number;
}

// 对战记录
export interface BattleRecord {
  id: string;
  createdAt: number;
  teamA: {
    teamId: string;
    score: number;
    quarters: number[];
    players: PlayerStats[];
  };
  teamB: {
    teamId: string;
    score: number;
    quarters: number[];
    players: PlayerStats[];
  };
  winner: 'A' | 'B' | 'draw';
  shareImage?: string;
}

// 模拟结果
export interface SimulationResult {
  teamA: {
    score: number;
    quarters: number[];
    players: PlayerStats[];
  };
  teamB: {
    score: number;
    quarters: number[];
    players: PlayerStats[];
  };
  winner: 'A' | 'B' | 'draw';
}