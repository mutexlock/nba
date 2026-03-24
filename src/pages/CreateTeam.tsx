import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../stores/appStore';
import { getPlayerById, allPlayers } from '../data/players';
import { Position } from '../types';

type FilterPosition = Position | 'ALL';

const POSITIONS: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];

export default function CreateTeam() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const { customTeams, addCustomTeam, updateCustomTeam } = useStore();
  
  // 筛选状态
  const [search, setSearch] = useState('');
  const [filterPosition, setFilterPosition] = useState<FilterPosition>('ALL');
  const [filterEra, setFilterEra] = useState<string>('ALL');
  
  // 球队编辑状态
  const [teamName, setTeamName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [startingLineup, setStartingLineup] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // 加载已有球队数据（编辑模式）
  const editingTeam = useMemo(() => {
    if (!teamId) return null;
    return customTeams.find(t => t.id === teamId);
  }, [teamId, customTeams]);

  // 初始化编辑数据
  useMemo(() => {
    if (editingTeam) {
      setTeamName(editingTeam.name);
      setSelectedPlayers(editingTeam.players);
      // 前5人为首发
      setStartingLineup(editingTeam.players.slice(0, 5));
    }
  }, [editingTeam]);

  // 获取球员位置
  const getPlayerPosition = (playerId: string): Position | null => {
    const player = getPlayerById(playerId);
    return player?.position || null;
  };

  // 过滤球员
  const filteredPlayers = useMemo(() => {
    return allPlayers.filter(player => {
      // 搜索筛选
      if (search && !player.name.includes(search) && !player.nameEn.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // 位置筛选
      if (filterPosition !== 'ALL' && player.position !== filterPosition) {
        return false;
      }
      // 时代筛选
      if (filterEra !== 'ALL' && player.era !== filterEra) {
        return false;
      }
      return true;
    });
  }, [search, filterPosition, filterEra]);

  // 处理选择/取消选择球员
  const handlePlayerToggle = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      // 取消选择
      setSelectedPlayers(prev => prev.filter(id => id !== playerId));
      setStartingLineup(prev => prev.filter(id => id !== playerId));
    } else {
      // 添加球员（不能超过15人）
      if (selectedPlayers.length >= 15) {
        setErrors(['球队最多15人']);
        setTimeout(() => setErrors([]), 2000);
        return;
      }
      setSelectedPlayers(prev => [...prev, playerId]);
    }
  };

  // 设置首发
  const handleSetStarter = (playerId: string) => {
    if (!selectedPlayers.includes(playerId)) return;
    
    const currentPosition = getPlayerPosition(playerId);
    const positionInStarters = startingLineup.map(id => getPlayerPosition(id));
    
    // 检查位置冲突
    if (currentPosition) {
      const positionIndex = POSITIONS.indexOf(currentPosition);
      // 找到当前首发中相同位置的球员
      const samePositionIndex = startingLineup.findIndex(id => getPlayerPosition(id) === currentPosition);
      
      if (samePositionIndex !== -1 && startingLineup[samePositionIndex] !== playerId) {
        // 替换同位置球员
        const newStarting = [...startingLineup];
        newStarting[samePositionIndex] = playerId;
        setStartingLineup(newStarting);
      } else if (!startingLineup.includes(playerId) && startingLineup.length < 5) {
        // 添加到首发
        setStartingLineup(prev => [...prev, playerId]);
      } else if (startingLineup.includes(playerId)) {
        // 已经在首发中，保持不变
      } else {
        // 首发已满，尝试替换
        const newStarting = [...startingLineup];
        newStarting[4] = playerId; // 简单替换最后一个
        setStartingLineup(newStarting);
      }
    }
  };

  // 从首发移除
  const handleRemoveFromStarters = (playerId: string) => {
    setStartingLineup(prev => prev.filter(id => id !== playerId));
  };

  // 验证球队
  const validateTeam = (): string[] => {
    const errs: string[] = [];
    
    if (!teamName.trim()) {
      errs.push('请输入球队名称');
    }
    
    if (selectedPlayers.length < 5) {
      errs.push('球队至少需要5名球员');
    }
    
    if (selectedPlayers.length > 15) {
      errs.push('球队最多15名球员');
    }
    
    if (startingLineup.length !== 5) {
      errs.push('首发阵容需要5名球员');
    }
    
    return errs;
  };

  // 保存球队
  const handleSave = () => {
    const validationErrors = validateTeam();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    // 计算球队评分
    const players = selectedPlayers.map(id => getPlayerById(id)).filter(Boolean);
    const avgRating = Math.round(players.reduce((sum, p: any) => sum + p!.rating, 0) / players.length);
    
    const teamData = {
      id: editingTeam?.id || `custom-${Date.now()}`,
      name: teamName.trim(),
      shortName: teamName.trim().slice(0, 10),
      logo: '/images/teams/custom.png',
      era: '自定义',
      players: selectedPlayers,
      rating: avgRating,
      isPreset: false,
      description: `自定义球队，拥有${players.length}名球员`
    };

    if (editingTeam) {
      updateCustomTeam(editingTeam.id, teamData);
    } else {
      addCustomTeam(teamData);
    }

    setTimeout(() => {
      navigate('/my-teams');
    }, 500);
  };

  const selectedPlayerObjects = selectedPlayers.map(id => getPlayerById(id)).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {editingTeam ? '编辑球队' : '创建球队'}
            </h1>
            <p className="text-gray-400 mt-1">从球员库选择5-15人组建你的梦幻球队</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/my-teams')}
              className="px-4 py-2 border border-gray-500 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : '保存球队'}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            {errors.map((err, i) => (
              <p key={i} className="text-red-400 text-sm">• {err}</p>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：已选球员 */}
          <div className="lg:col-span-1 space-y-4">
            {/* 球队名称 */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <label className="block text-gray-400 text-sm mb-2">球队名称</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="输入球队名称"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 球队概览 */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">球员阵容</h3>
                <span className={`text-sm ${selectedPlayers.length >= 5 && selectedPlayers.length <= 15 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {selectedPlayers.length}/15
                </span>
              </div>

              {/* 首发阵容 */}
              <div className="mb-4">
                <h4 className="text-gray-400 text-sm mb-2">首发5人</h4>
                <div className="space-y-2">
                  {startingLineup.length > 0 ? (
                    startingLineup.map((playerId, idx) => {
                      const player = getPlayerById(playerId);
                      if (!player) return null;
                      return (
                        <div
                          key={playerId}
                          className="flex items-center gap-2 p-2 bg-orange-500/20 rounded-lg"
                        >
                          <span className="text-orange-400 text-xs w-6">{POSITIONS[idx]}</span>
                          <span className="text-white text-sm flex-1 truncate">{player.name}</span>
                          <span className="text-yellow-400 text-sm">{player.rating}</span>
                          <button
                            onClick={() => handleRemoveFromStarters(playerId)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">点击球员卡片设置首发</p>
                  )}
                </div>
              </div>

              {/* 替补席 */}
              <div>
                <h4 className="text-gray-400 text-sm mb-2">替补 ({selectedPlayers.length - startingLineup.length}人)</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {selectedPlayers
                    .filter(id => !startingLineup.includes(id))
                    .map(playerId => {
                      const player = getPlayerById(playerId);
                      if (!player) return null;
                      return (
                        <div
                          key={playerId}
                          className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                        >
                          <span className="text-gray-500 text-xs w-6">{player.position}</span>
                          <span className="text-gray-300 text-sm flex-1 truncate">{player.name}</span>
                          <span className="text-gray-400 text-sm">{player.rating}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* 球队评分 */}
            {selectedPlayerObjects.length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">球队综合评分</p>
                <p className="text-4xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {Math.round(selectedPlayerObjects.reduce((sum, p) => sum + p!.rating, 0) / selectedPlayerObjects.length)}
                </p>
              </div>
            )}
          </div>

          {/* 右侧：球员库 */}
          <div className="lg:col-span-2">
            {/* 筛选器 */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索球员..."
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value as FilterPosition)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">所有位置</option>
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                <select
                  value={filterEra}
                  onChange={(e) => setFilterEra(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">所有时代</option>
                  <option value="80s">80年代</option>
                  <option value="90s">90年代</option>
                  <option value="00s">00年代</option>
                  <option value="10s">10年代</option>
                  <option value="20s">20年代</option>
                </select>
              </div>
            </div>

            {/* 球员列表 */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto">
              {filteredPlayers.map(player => {
                const isSelected = selectedPlayers.includes(player.id);
                const isStarter = startingLineup.includes(player.id);
                
                return (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerToggle(player.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? isStarter
                          ? 'bg-orange-500/30 border-2 border-orange-500'
                          : 'bg-blue-500/30 border-2 border-blue-500'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-lg">
                        🏀
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm truncate">{player.name}</span>
                          {isStarter && <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded">首发</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="px-1.5 py-0.5 bg-white/10 rounded">{player.position}</span>
                          <span>{player.team}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${player.rating >= 90 ? 'text-yellow-400' : player.rating >= 80 ? 'text-orange-400' : 'text-gray-400'}`}>
                          {player.rating}
                        </span>
                      </div>
                    </div>
                    
                    {/* 设置首发按钮 */}
                    {isSelected && !isStarter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetStarter(player.id);
                        }}
                        className="mt-2 w-full py-1.5 bg-orange-500/20 text-orange-400 text-xs rounded-lg hover:bg-orange-500/30 transition-colors"
                      >
                        设为首发
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                没有找到匹配的球员
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}