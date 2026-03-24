import { useParams, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '../stores/appStore';
import { getPlayerById } from '../data/players';

const eraLabels: Record<string, string> = {
  '80s': '80年代',
  '90s': '90年代',
  '00s': '00年代',
  '10s': '10年代',
  '20s': '20年代',
};

const positionLabels: Record<string, string> = {
  'PG': '控球后卫',
  'SG': '得分后卫',
  'SF': '小前锋',
  'PF': '大前锋',
  'C': '中锋',
};

function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const players = useStore((state) => state.players);
  
  const player = getPlayerById(id || '');
  
  if (!player) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-xl mb-4">未找到该球员</p>
        <button
          onClick={() => navigate('/players')}
          className="px-6 py-2 bg-orange-500 rounded-lg text-white hover:bg-orange-600"
        >
          返回球员库
        </button>
      </div>
    );
  }
  
  // Radar chart data
  const radarData = [
    { subject: '得分', A: player.stats.points, fullMark: 35 },
    { subject: '篮板', A: player.stats.rebounds, fullMark: 15 },
    { subject: '助攻', A: player.stats.assists, fullMark: 12 },
    { subject: '抢断', A: player.stats.steals, fullMark: 3 },
    { subject: '盖帽', A: player.stats.blocks, fullMark: 3 },
    { subject: '进攻', A: player.offenseRating, fullMark: 100 },
    { subject: '防守', A: player.defenseRating, fullMark: 100 },
  ];
  
  const getRatingColor = (rating: number) => {
    if (rating >= 95) return 'text-orange-400';
    if (rating >= 90) return 'text-yellow-400';
    if (rating >= 85) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
      >
        ← 返回
      </button>
      
      <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-purple-500/20">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#1a1a2e] bg-[#0a0a12]">
              <img
                src={player.avatar}
                alt={player.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231a1a2e" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23666" font-size="40">🏀</text></svg>';
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Info */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">{player.name}</h1>
              <p className="text-gray-400">{player.nameEn} | #{player.number}</p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getRatingColor(player.rating)}`}>
                {player.rating}
              </div>
              <div className="text-sm text-gray-500">综合评分</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-2 bg-[#0a0a12] rounded-lg">
              <span className="text-gray-500">位置</span>
              <span className="ml-2 text-white">{positionLabels[player.position]}</span>
            </span>
            <span className="px-4 py-2 bg-[#0a0a12] rounded-lg">
              <span className="text-gray-500">时代</span>
              <span className="ml-2 text-white">{eraLabels[player.era]}</span>
            </span>
            <span className="px-4 py-2 bg-[#0a0a12] rounded-lg">
              <span className="text-gray-500">球队</span>
              <span className="ml-2 text-white">{player.team}</span>
            </span>
            <span className="px-4 py-2 bg-[#0a0a12] rounded-lg">
              <span className="text-gray-500">进攻</span>
              <span className="ml-2 text-orange-400">{player.offenseRating}</span>
            </span>
            <span className="px-4 py-2 bg-[#0a0a12] rounded-lg">
              <span className="text-gray-500">防守</span>
              <span className="ml-2 text-blue-400">{player.defenseRating}</span>
            </span>
          </div>
          
          {/* Stats & Radar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Career Stats */}
            <div>
              <h3 className="text-lg font-bold mb-4">生涯数据</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0a0a12] rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-400">{player.stats.points}</div>
                  <div className="text-sm text-gray-500">场均得分</div>
                </div>
                <div className="bg-[#0a0a12] rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{player.stats.rebounds}</div>
                  <div className="text-sm text-gray-500">场均篮板</div>
                </div>
                <div className="bg-[#0a0a12] rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{player.stats.assists}</div>
                  <div className="text-sm text-gray-500">场均助攻</div>
                </div>
                <div className="bg-[#0a0a12] rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">{player.stats.steals}</div>
                  <div className="text-sm text-gray-500">场均抢断</div>
                </div>
                <div className="bg-[#0a0a12] rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">{player.stats.blocks}</div>
                  <div className="text-sm text-gray-500">场均盖帽</div>
                </div>
                <div className="bg-[#0a0a12] rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{player.stats.fgPct}%</div>
                  <div className="text-sm text-gray-500">投篮命中率</div>
                </div>
                <div className="bg-[#0a0a12] rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{player.stats.games}</div>
                  <div className="text-sm text-gray-500">生涯出场</div>
                </div>
                <div className="bg-[#0a0a12] rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{player.per}</div>
                  <div className="text-sm text-gray-500">效率值(PER)</div>
                </div>
              </div>
            </div>
            
            {/* Radar Chart */}
            <div>
              <h3 className="text-lg font-bold mb-4">能力雷达</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#2a2a4e" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <Radar
                      name="能力值"
                      dataKey="A"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Honors */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">荣誉墙</h3>
            <div className="flex flex-wrap gap-3">
              {player.honors.mvp > 0 && (
                <span className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400">
                  MVP × {player.honors.mvp}
                </span>
              )}
              {player.honors.fmvp > 0 && (
                <span className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400">
                  FMVP × {player.honors.fmvp}
                </span>
              )}
              {player.honors.champion > 0 && (
                <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
                  冠军 × {player.honors.champion}
                </span>
              )}
              {player.honors.allNBA > 0 && (
                <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
                  最佳阵容 × {player.honors.allNBA}
                </span>
              )}
              {player.honors.allDefense > 0 && (
                <span className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                  防守阵容 × {player.honors.allDefense}
                </span>
              )}
              {player.honors.allStar > 0 && (
                <span className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  全明星 × {player.honors.allStar}
                </span>
              )}
              {player.honors.mvp === 0 && player.honors.fmvp === 0 && 
               player.honors.champion === 0 && player.honors.allNBA === 0 && (
                <span className="text-gray-500">暂无荣誉数据</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetail;