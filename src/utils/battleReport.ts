import { SimulationResult, PlayerStats } from '../types';
import { getPlayerById } from '../data/players';
import { Team } from '../types';

// 战报模板类型
type ReportStyle = 'exciting' | 'professional' | 'humor';

// 生成比赛战报
export function generateBattleReport(
  result: SimulationResult,
  teamA: Team,
  teamB: Team,
  style: ReportStyle = 'exciting'
): string {
  const teamAName = teamA.shortName;
  const teamBName = teamB.shortName;
  const scoreA = result.teamA.score;
  const scoreB = result.teamB.score;
  const diff = Math.abs(scoreA - scoreB);
  
  // 获取最佳球员
  const topScorerA = getTopScorer(result.teamA.players);
  const topScorerB = getTopScorer(result.teamB.players);
  const topScorerOverall = scoreA > scoreB ? topScorerA : topScorerB;
  
  switch (style) {
    case 'exciting':
      return generateExcitingReport(result, teamAName, teamBName, scoreA, scoreB, diff, topScorerA, topScorerB, topScorerOverall);
    case 'professional':
      return generateProfessionalReport(result, teamAName, teamBName, scoreA, scoreB, topScorerA, topScorerB);
    case 'humor':
      return generateHumorReport(result, teamAName, teamBName, scoreA, scoreB, diff, topScorerA, topScorerB);
    default:
      return generateExcitingReport(result, teamAName, teamBName, scoreA, scoreB, diff, topScorerA, topScorerB, topScorerOverall);
  }
}

// 获取得分王
function getTopScorer(players: PlayerStats[]): PlayerStats {
  return players.reduce((top, player) => 
    player.points > top.points ? player : top
  , players[0]);
}

// 风格1: 激情战报
function generateExcitingReport(
  result: SimulationResult,
  teamAName: string,
  teamBName: string,
  scoreA: number,
  scoreB: number,
  diff: number,
  topScorerA: PlayerStats,
  topScorerB: PlayerStats,
  topScorerOverall: PlayerStats
): string {
  const winner = result.winner === 'A' ? teamAName : result.winner === 'B' ? teamBName : '平局';
  const player = getPlayerById(topScorerOverall.playerId);
  const playerName = player?.nameEn || topScorerOverall.playerId;
  
  let report = `🏀 激情NBA战报 🏀\n\n`;
  report += `📊 ${teamAName} ${scoreA} - ${scoreB} ${teamBName}\n\n`;
  
  if (diff <= 3) {
    report += `🔥 关键时刻！双方战况激烈，比分紧咬！\n`;
    report += `🎯 最后一节才分出胜负，这才是真正的篮球！\n\n`;
  } else if (diff <= 10) {
    report += `💪 精彩对决！${winner}以${diff}分优势拿下比赛！\n\n`;
  } else {
    report += `🚀 ${winner}全场压制，以${diff}分大胜！\n\n`;
  }
  
  report += `📈 四节比分：\n`;
  report += `${teamAName}: ${result.teamA.quarters.join(' - ')}\n`;
  report += `${teamBName}: ${result.teamB.quarters.join(' - ')}\n\n`;
  
  report += `⭐ 全场最佳：${playerName}\n`;
  report += `   贡献 ${topScorerOverall.points} 分\n`;
  
  if (topScorerOverall.rebounds > 0) {
    report += `   ${topScorerOverall.rebounds} 篮板`;
  }
  if (topScorerOverall.assists > 0) {
    report += ` / ${topScorerOverall.assists} 助攻`;
  }
  
  return report;
}

// 风格2: 专业战报
function generateProfessionalReport(
  result: SimulationResult,
  teamAName: string,
  teamBName: string,
  scoreA: number,
  scoreB: number,
  topScorerA: PlayerStats,
  topScorerB: PlayerStats
): string {
  const winner = result.winner === 'A' ? teamAName : result.winner === 'B' ? teamBName : '平局';
  const playerA = getPlayerById(topScorerA.playerId);
  const playerB = getPlayerById(topScorerB.playerId);
  
  let report = `【NBA比赛战报】\n\n`;
  report += `${teamAName} vs ${teamBName}\n`;
  report += `终场比分：${scoreA}:${scoreB}\n`;
  report += `胜者：${winner}\n\n`;
  
  report += `【数据统计】\n`;
  report += `\n${teamAName}:\n`;
  report += `  • 四节：${result.teamA.quarters.join(' / ')}\n`;
  report += `  • ${playerA?.nameEn || topScorerA.playerId}: ${topScorerA.points}分\n`;
  report += `    ${topScorerA.rebounds}篮板 ${topScorerA.assists}助攻\n`;
  
  report += `\n${teamBName}:\n`;
  report += `  • 四节：${result.teamB.quarters.join(' / ')}\n`;
  report += `  • ${playerB?.nameEn || topScorerB.playerId}: ${topScorerB.points}分\n`;
  report += `    ${topScorerB.rebounds}篮板 ${topScorerB.assists}助攻`;
  
  return report;
}

// 风格3: 趣味战报
function generateHumorReport(
  result: SimulationResult,
  teamAName: string,
  teamBName: string,
  scoreA: number,
  scoreB: number,
  diff: number,
  topScorerA: PlayerStats,
  topScorerB: PlayerStats
): string {
  const winner = result.winner === 'A' ? teamAName : result.winner === 'B' ? teamBName : '平局';
  const playerA = getPlayerById(topScorerA.playerId);
  const playerB = getPlayerById(topScorerB.playerId);
  
  const comments = [
    `这场比赛简直太刺激了！`,
    `球员们打得难解难分！`,
    `这就是NBA的魅力！`,
    `球迷们心脏病都要犯了！`
  ];
  const randomComment = comments[Math.floor(Math.random() * comments.length)];
  
  let report = `😎 ${randomComment}\n\n`;
  report += `${teamAName} ${scoreA} : ${scoreB} ${teamBName}\n\n`;
  
  if (diff > 15) {
    report += `💀 ${winner}把对手按在地上摩擦！\n`;
    report += `对手：${diff}分差距，我太难了！\n\n`;
  } else if (diff > 5) {
    report += `😅 ${winner}险胜！\n`;
    report += `赢得不多不少，刚好够赢！\n\n`;
  } else {
    report += `🤯 加时赛都没打完！\n`;
    report += `最后时刻绝杀，心脏病患者请绕行！\n\n`;
  }
  
  report += `🏀 ${playerA?.nameEn || topScorerA.playerId}: ${topScorerA.points}分\n`;
  report += `🏀 ${playerB?.nameEn || topScorerB.playerId}: ${topScorerB.points}分`;
  
  return report;
}

// 生成可分享的图片HTML
export function generateShareImageHTML(
  result: SimulationResult,
  teamAName: string,
  teamBName: string,
  style: ReportStyle = 'exciting'
): string {
  const winner = result.winner === 'A' ? teamAName : result.winner === 'B' ? teamBName : '平局';
  const scoreA = result.teamA.score;
  const scoreB = result.teamB.score;
  
  const bgGradient = style === 'exciting' 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    : style === 'professional'
    ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  
  return `
    <div style="width: 600px; height: 400px; ${bgGradient}; padding: 40px; box-sizing: border-box; font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;">
      <div style="text-align: center; color: white; margin-bottom: 30px;">
        <h1 style="font-size: 36px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🏀 NBA对战模拟器</h1>
      </div>
      
      <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 30px;">
        <div style="text-align: center; color: white;">
          <div style="font-size: 28px; font-weight: bold;">${teamAName}</div>
          <div style="font-size: 48px; font-weight: bold; color: #f0c419;">${scoreA}</div>
        </div>
        <div style="color: #f0c419; font-size: 24px; font-weight: bold;">VS</div>
        <div style="text-align: center; color: white;">
          <div style="font-size: 28px; font-weight: bold;">${teamBName}</div>
          <div style="font-size: 48px; font-weight: bold; color: #f0c419;">${scoreB}</div>
        </div>
      </div>
      
      <div style="text-align: center; color: white; margin-bottom: 20px;">
        <span style="background: #e94560; padding: 8px 20px; border-radius: 20px; font-size: 18px;">
          🏆 获胜: ${winner}
        </span>
      </div>
      
      <div style="text-align: center; color: rgba(255,255,255,0.6); font-size: 14px;">
        四节比分: ${result.teamA.quarters.join(' - ')} | ${result.teamB.quarters.join(' - ')}
      </div>
    </div>
  `;
}

// 使用html2canvas生成图片
export async function generateShareImage(
  result: SimulationResult,
  teamAName: string,
  teamBName: string,
  style: ReportStyle = 'exciting'
): Promise<string> {
  const { default: html2canvas } = await import('html2canvas');
  
  // 创建临时容器
  const container = document.createElement('div');
  container.innerHTML = generateShareImageHTML(result, teamAName, teamBName, style);
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
      backgroundColor: null,
      scale: 2
    });
    
    return canvas.toDataURL('image/png');
  } finally {
    document.body.removeChild(container);
  }
}