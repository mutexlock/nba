import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../stores/appStore';
import { Player } from '../types';

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

function Players() {
  const players = useStore((state) => state.players);
  const [search, setSearch] = useState('');
  const [eraFilter, setEraFilter] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'era'>('rating');

  const filteredPlayers = useMemo(() => {
    let result = [...players];
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.nameEn.toLowerCase().includes(searchLower) ||
        p.team.toLowerCase().includes(searchLower)
      );
    }
    
    // Era filter
    if (eraFilter) {
      result = result.filter(p => p.era === eraFilter);
    }
    
    // Position filter
    if (positionFilter) {
      result = result.filter(p => p.position === positionFilter);
    }
    
    // Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    } else if (sortBy === 'era') {
      const eraOrder = ['80s', '90s', '00s', '10s', '20s'];
      result.sort((a, b) => eraOrder.indexOf(a.era) - eraOrder.indexOf(b.era));
    }
    
    return result;
  }, [players, search, eraFilter, positionFilter, sortBy]);

  const getRatingColor = (rating: number) => {
    if (rating >= 95) return 'text-orange-400';
    if (rating >= 90) return 'text-yellow-400';
    if (rating >= 85) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">球员数据库</h2>
          <p className="text-gray-400">共 {players.length} 名球员</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="搜索球员..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
          
          <select
            value={eraFilter}
            onChange={(e) => setEraFilter(e.target.value)}
            className="px-4 py-2 bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">所有时代</option>
            {Object.entries(eraLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-4 py-2 bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">所有位置</option>
            {Object.entries(positionLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'name' | 'era')}
            className="px-4 py-2 bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="rating">按评分</option>
            <option value="name">按姓名</option>
            <option value="era">按时代</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">🔍</p>
          <p>未找到相关球员</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
              className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-4 hover:border-orange-500/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#0a0a12] flex-shrink-0">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231a1a2e" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23666" font-size="40">🏀</text></svg>';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                      {player.name}
                    </h3>
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                      #{player.number}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{player.nameEn}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="text-gray-400">{positionLabels[player.position]}</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-400">{eraLabels[player.era]}</span>
                    <span className="text-gray-600">|</span>
                    <span className={`font-bold ${getRatingColor(player.rating)}`}>
                      {player.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Players;