import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../stores/appStore';
import { getPlayerById } from '../data/players';
import { Team } from '../types';

export default function MyTeams() {
  const navigate = useNavigate();
  const { customTeams, removeCustomTeam, teams } = useStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // 合并预设球队和自定义球队
  const allTeams: (Team & { isCustom?: boolean })[] = [
    ...teams.map(t => ({ ...t, isCustom: false })),
    ...customTeams.map(t => ({ ...t, isCustom: true }))
  ];

  const handleDelete = (teamId: string) => {
    if (confirmDelete === teamId) {
      removeCustomTeam(teamId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(teamId);
      // 3秒后自动重置确认状态
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleEdit = (teamId: string) => {
    navigate(`/create-team/${teamId}`);
  };

  const getTeamPlayers = (team: Team & { isCustom?: boolean }) => {
    return team.players.map(id => getPlayerById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">🏆 我的球队</h1>
            <p className="text-gray-400 mt-2">管理你创建的梦幻球队</p>
          </div>
          <Link
            to="/create-team"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span>➕</span> 创建球队
          </Link>
        </div>

        {allTeams.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏀</div>
            <h2 className="text-2xl font-bold text-white mb-4">还没有球队</h2>
            <p className="text-gray-400 mb-8">创建你的第一支梦幻球队吧！</p>
            <Link
              to="/create-team"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity inline-block"
            >
              创建球队
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTeams.map(team => {
              const players = getTeamPlayers(team);
              const avgRating = players.length > 0
                ? Math.round(players.reduce((sum, p: any) => sum + p!.rating, 0) / players.length)
                : 0;

              return (
                <div
                  key={team.id}
                  className={`bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/15 transition-colors ${
                    team.isCustom ? 'border border-blue-500/30' : 'border border-orange-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        team.isCustom 
                          ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20' 
                          : 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
                      }`}>
                        🏀
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{team.name}</h2>
                        <p className="text-gray-400 text-sm">
                          {team.isCustom ? '自定义球队' : team.era || '预设球队'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                      team.isCustom
                        ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                    }`}>
                      {avgRating || team.rating}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 text-sm mb-3">阵容 ({players.length}/15)</p>
                    <div className="space-y-2">
                      {players.slice(0, 5).map((player): React.ReactNode => (
                        <div key={player.id} className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500 w-5 text-xs">
                            {['PG', 'SG', 'SF', 'PF', 'C'][index] || ''}
                          </span>
                          <span className="text-gray-300 flex-1 truncate">{player.name}</span>
                          <span className={player.rating >= 90 ? 'text-yellow-400' : 'text-gray-400'}>
                            {player.rating}
                          </span>
                        </div>
                      ))}
                      {players.length > 5 && (
                        <p className="text-gray-500 text-xs pl-7">+{players.length - 5}名替补</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {team.isCustom ? (
                      <>
                        <button
                          onClick={() => handleEdit(team.id)}
                          className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(team.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            confirmDelete === team.id
                              ? 'bg-red-500 text-white'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          }`}
                        >
                          {confirmDelete === team.id ? '确认删除' : '删除'}
                        </button>
                      </>
                    ) : (
                      <Link
                        to={`/battle?teamA=${team.id}`}
                        className="flex-1 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors text-sm font-medium text-center block"
                      >
                        选择对战
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}