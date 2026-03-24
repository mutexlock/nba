import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { presetTeams } from '../data/teams';
import { getTeamById } from '../data/teams';
import { simulateBattle, getBattleShareText } from '../utils/battle';
import { generateBattleReport, generateShareImage } from '../utils/battleReport';
import { SimulationResult } from '../types';
import { useStore } from '../stores/appStore';

export default function Battle() {
  const location = useLocation();
  const battleInfo = location.state as { battle?: string; background?: string; teamA?: string; teamB?: string } | null;
  
  const [teamAId, setTeamAId] = useState<string>(battleInfo?.teamA || '');
  const [teamBId, setTeamBId] = useState<string>(battleInfo?.teamB || '');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const battleName = battleInfo?.battle || '';
  const battleBackground = battleInfo?.background || '';
  const [isSimulating, setIsSimulating] = useState(false);
  const [reportStyle, setReportStyle] = useState<'exciting' | 'professional' | 'humor'>('exciting');
  const [shareImage, setShareImage] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const addBattleRecord = useStore(state => state.addBattleRecord);
  const customTeams = useStore(state => state.customTeams);
  const shareRef = useRef<HTMLDivElement>(null);

  const handleSimulate = () => {
    if (!teamAId || !teamBId) return;
    
    // 检查球队人数是否至少5人
    const teamA = getTeamById(teamAId);
    const teamB = getTeamById(teamBId);
    
    if (!teamA || !teamB) return;
    
    if (teamA.players.length < 5) {
      alert('球队至少需要5名球员');
      return;
    }
    
    if (teamB.players.length < 5) {
      alert('球队至少需要5名球员');
      return;
    }
    
    setIsSimulating(true);
    
    // 模拟延迟，增加仪式感
    setTimeout(() => {
      const teamA = getTeamById(teamAId);
      const teamB = getTeamById(teamBId);
      
      if (teamA && teamB) {
        const battleResult = simulateBattle(teamA, teamB);
        setResult(battleResult);
        
        // 保存战报
        addBattleRecord({
          id: `battle-${Date.now()}`,
          createdAt: Date.now(),
          teamA: {
            teamId: teamAId,
            score: battleResult.teamA.score,
            quarters: battleResult.teamA.quarters,
            players: battleResult.teamA.players
          },
          teamB: {
            teamId: teamBId,
            score: battleResult.teamB.score,
            quarters: battleResult.teamB.quarters,
            players: battleResult.teamB.players
          },
          winner: battleResult.winner
        });
      }
      
      setIsSimulating(false);
    }, 1500);
  };

  const teamA = teamAId ? getTeamById(teamAId) : null;
  const teamB = teamBId ? getTeamById(teamBId) : null;

  const copyResult = () => {
    if (!result || !teamA || !teamB) return;
    const text = getBattleShareText(result, teamA.name, teamB.name);
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          {battleName ? (
            <>
              <h1 className="text-4xl font-bold text-white mb-2">⚔️ {battleName}</h1>
              <p className="text-orange-300 text-lg mb-2">{battleBackground}</p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-white mb-2">🏀 NBA对战模拟器</h1>
              <p className="text-gray-400">选择两支球队，模拟世纪大战</p>
            </>
          )}
        </div>

        {/* 球队选择 */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 球队A */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">主队</span>
              选择球队
            </h2>
            <select
              value={teamAId}
              onChange={(e) => setTeamAId(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-gray-800">选择球队...</option>
              {presetTeams.map(team => (
                <option key={team.id} value={team.id} className="text-gray-800">
                  {team.name} (评分: {team.rating})
                </option>
              ))}
            </select>
            
            {/* 球队信息 */}
            {teamA && (
              <div className="mt-4 p-4 bg-blue-500/20 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <img src={teamA.logo} alt={teamA.name} className="w-12 h-12 rounded-lg" />
                  <div>
                    <h3 className="text-white font-bold">{teamA.name}</h3>
                    <p className="text-blue-300 text-sm">球队评分: {teamA.rating}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{teamA.description}</p>
              </div>
            )}
          </div>

          {/* 球队B */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">客队</span>
              选择球队
            </h2>
            <select
              value={teamBId}
              onChange={(e) => setTeamBId(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="" className="text-gray-800">选择球队...</option>
              {presetTeams.map(team => (
                <option key={team.id} value={team.id} className="text-gray-800">
                  {team.name} (评分: {team.rating})
                </option>
              ))}
            </select>
            
            {/* 球队信息 */}
            {teamB && (
              <div className="mt-4 p-4 bg-red-500/20 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <img src={teamB.logo} alt={teamB.name} className="w-12 h-12 rounded-lg" />
                  <div>
                    <h3 className="text-white font-bold">{teamB.name}</h3>
                    <p className="text-red-300 text-sm">球队评分: {teamB.rating}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{teamB.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* 模拟按钮 */}
        <div className="text-center mb-8">
          <button
            onClick={handleSimulate}
            disabled={!teamAId || !teamBId || isSimulating}
            className={`px-12 py-4 rounded-full text-xl font-bold transition-all ${
              teamAId && teamBId && !isSimulating
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105 shadow-lg shadow-orange-500/30'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                模拟比赛中...
              </span>
            ) : (
              '⚡ 开始模拟'
            )}
          </button>
        </div>

        {/* 比赛结果 */}
        {result && teamA && teamB && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8 animate-fade-in">
            {battleName && (
              <div className="text-center mb-4">
                <span className="bg-orange-500/20 text-orange-300 px-4 py-1 rounded-full text-sm">
                  {battleName}
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {result.winner === 'A' && `🏆 ${teamA.name} 获胜!`}
                {result.winner === 'B' && `🏆 ${teamB.name} 获胜!`}
                {result.winner === 'draw' && '🤝 平局'}
              </h2>
              <p className="text-gray-400">比赛结束</p>
            </div>

            {/* 比分牌 */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className={`text-center p-4 rounded-xl ${result.winner === 'A' ? 'bg-blue-500/30' : 'bg-white/5'}`}>
                <img src={teamA.logo} alt={teamA.name} className="w-16 h-16 mx-auto mb-2" />
                <p className="text-white font-bold">{teamA.shortName}</p>
                <p className="text-4xl font-bold text-blue-400">{result.teamA.score}</p>
              </div>
              <span className="text-2xl text-gray-400">-</span>
              <div className={`text-center p-4 rounded-xl ${result.winner === 'B' ? 'bg-red-500/30' : 'bg-white/5'}`}>
                <img src={teamB.logo} alt={teamB.name} className="w-16 h-16 mx-auto mb-2" />
                <p className="text-white font-bold">{teamB.shortName}</p>
                <p className="text-4xl font-bold text-red-400">{result.teamB.score}</p>
              </div>
            </div>

            {/* 四节比分图表 */}
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <h3 className="text-white font-bold mb-3">📊 四节比分走势</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Q1', [teamA.shortName]: result.teamA.quarters[0], [teamB.shortName]: result.teamB.quarters[0] },
                  { name: 'Q2', [teamA.shortName]: result.teamA.quarters[1], [teamB.shortName]: result.teamB.quarters[1] },
                  { name: 'Q3', [teamA.shortName]: result.teamA.quarters[2], [teamB.shortName]: result.teamB.quarters[2] },
                  { name: 'Q4', [teamA.shortName]: result.teamA.quarters[3], [teamB.shortName]: result.teamB.quarters[3] },
                ]}>
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none' }} />
                  <Bar dataKey={teamA.shortName} fill="#3b82f6" />
                  <Bar dataKey={teamB.shortName} fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 球员数据 */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* 球队A球员 */}
              <div className="bg-blue-500/10 rounded-xl p-4">
                <h3 className="text-blue-300 font-bold mb-3">{teamA.name} 球员数据</h3>
                <div className="space-y-2">
                  {result.teamA.players.map((stat, i) => {
                    const player = teamA.players[i];
                    return (
                      <div key={player} className="flex justify-between text-sm">
                        <span className="text-gray-300">{player}</span>
                        <span className="text-white font-bold">
                          {stat.points}分 {stat.rebounds}板 {stat.assists}助
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 球队B球员 */}
              <div className="bg-red-500/10 rounded-xl p-4">
                <h3 className="text-red-300 font-bold mb-3">{teamB.name} 球员数据</h3>
                <div className="space-y-2">
                  {result.teamB.players.map((stat, i) => {
                    const player = teamB.players[i];
                    return (
                      <div key={player} className="flex justify-between text-sm">
                        <span className="text-gray-300">{player}</span>
                        <span className="text-white font-bold">
                          {stat.points}分 {stat.rebounds}板 {stat.assists}助
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-center gap-4">
              <button
                onClick={copyResult}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                📋 复制结果
              </button>
              <Link
                to="/battle-record"
                className="px-6 py-2 bg-purple-500/30 hover:bg-purple-500/50 text-white rounded-full transition-colors"
              >
                📜 查看战报
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}