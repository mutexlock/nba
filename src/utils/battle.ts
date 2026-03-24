import { Player, Team, SimulationResult, PlayerStats } from '../types';
import { getPlayerById } from '../data/players';

// 模拟比赛
export function simulateBattle(teamA: Team, teamB: Team): SimulationResult {
  const playersA = teamA.players.map(id => getPlayerById(id)).filter(Boolean) as Player[];
  const playersB = teamB.players.map(id => getPlayerById(id)).filter(Boolean) as Player[];
  
  if (playersA.length === 0 || playersB.length === 0) {
    return {
      teamA: { score: 0, quarters: [0, 0, 0, 0], players: [] },
      teamB: { score: 0, quarters: [0, 0, 0, 0], players: [] },
      winner: 'draw'
    };
  }

  // 计算球队整体评分
  const ratingA = calculateTeamRating(playersA);
  const ratingB = calculateTeamRating(playersB);
  
  // 基础得分（每节约 20-35 分，四节共 80-120 分）
  const baseScore = 25;
  const ratingDiff = (ratingA - ratingB) / 100;
  
  // 生成四节比分
  const quartersA: number[] = [];
  const quartersB: number[] = [];
  
  let totalA = 0;
  let totalB = 0;
  
  for (let i = 0; i < 4; i++) {
    // 每一节有随机波动（-5 到 +10）
    const variance = Math.random() * 15 - 5;
    const quarterA = Math.round(baseScore + ratingDiff * 5 + variance + Math.random() * 5);
    const quarterB = Math.round(baseScore - ratingDiff * 5 + variance + Math.random() * 5);
    
    quartersA.push(Math.max(18, Math.min(35, quarterA)));
    quartersB.push(Math.max(18, Math.min(35, quarterB)));
    totalA += quartersA[i];
    totalB += quartersB[i];
  }
  
  // 确保最后一节后有胜者（如果平分，最后一节多的一定赢）
  if (totalA === totalB) {
    const winner = Math.random() > 0.5 ? 'A' : 'B';
    if (winner === 'A') {
      quartersA[3] += 2;
      totalA += 2;
    } else {
      quartersB[3] += 2;
      totalB += 2;
    }
  }
  
  // 生成球员数据
  const playerStatsA = generatePlayerStats(playersA, totalA, ratingA);
  const playerStatsB = generatePlayerStats(playersB, totalB, ratingB);
  
  const winner: 'A' | 'B' | 'draw' = totalA > totalB ? 'A' : totalB > totalA ? 'B' : 'draw';
  
  return {
    teamA: {
      score: totalA,
      quarters: quartersA,
      players: playerStatsA
    },
    teamB: {
      score: totalB,
      quarters: quartersB,
      players: playerStatsB
    },
    winner
  };
}

// 计算球队整体评分
function calculateTeamRating(players: Player[]): number {
  if (players.length === 0) return 70;
  
  // 首发5人评分加权平均
  const weights = [1.5, 1.3, 1.2, 1.0, 1.0]; // 核心球员权重更高
  let totalWeight = 0;
  let weightedSum = 0;
  
  players.slice(0, 5).forEach((player, index) => {
    const weight = weights[index] || 1.0;
    weightedSum += player.rating * weight;
    totalWeight += weight;
  });
  
  return Math.round(weightedSum / totalWeight);
}

// 生成球员比赛数据
function generatePlayerStats(players: Player[], teamScore: number, teamRating: number): PlayerStats[] {
  // 根据球员评分分配得分权重
  const totalRating = players.slice(0, 5).reduce((sum, p) => sum + p.rating, 0);
  
  return players.slice(0, 5).map(player => {
    const weight = player.rating / totalRating;
    const points = Math.round(teamScore * weight * (0.8 + Math.random() * 0.4));
    
    // 生成其他统计数据
    const fgAttempted = Math.round(8 + Math.random() * 12);
    const fgMade = Math.round(fgAttempted * (player.stats.fgPct / 100) * (0.7 + Math.random() * 0.6));
    const threeAttempted = Math.round(2 + Math.random() * 6);
    const threeMade = Math.round(threeAttempted * (player.stats.threePct / 100) * (0.5 + Math.random() * 1));
    
    const rebounds = Math.round(player.stats.rebounds * (0.3 + Math.random() * 0.7));
    const assists = Math.round(player.stats.assists * (0.3 + Math.random() * 0.7));
    
    return {
      playerId: player.id,
      points,
      rebounds,
      assists,
      fgMade,
      fgAttempted,
      threeMade,
      threeAttempted
    };
  });
}

// 获取比赛战报HTML（用于分享）
export function getBattleShareText(result: SimulationResult, teamAName: string, teamBName: string): string {
  const winner = result.winner === 'A' ? teamAName : result.winner === 'B' ? teamBName : '平局';
  const scoreA = result.teamA.score;
  const scoreB = result.teamB.score;
  
  let text = `🏀 NBA对战模拟器\n\n`;
  text += `${teamAName} ${scoreA} - ${scoreB} ${teamBName}\n`;
  text += `🏆 获胜: ${winner}\n\n`;
  text += `📊 四节比分:\n`;
  text += `${teamAName}: ${result.teamA.quarters.join(' - ')}\n`;
  text += `${teamBName}: ${result.teamB.quarters.join(' - ')}`;
  
  return text;
}