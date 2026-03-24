import { useStore } from '../stores/appStore';
import { getTeamById } from '../data/teams';

export default function BattleRecord() {
  const battleRecords = useStore(state => state.battleRecords);
  const clearBattleRecords = useStore(state => state.clearBattleRecords);

  if (battleRecords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">📜 战报记录</h1>
          <p className="text-gray-400">暂无对战记录，快去模拟比赛吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">📜 战报记录</h1>
          <button
            onClick={clearBattleRecords}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors"
          >
            清空记录
          </button>
        </div>

        <div className="space-y-4">
          {battleRecords.map(record => {
            const teamA = getTeamById(record.teamA.teamId);
            const teamB = getTeamById(record.teamB.teamId);
            
            return (
              <div key={record.id} className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src={teamA?.logo} alt="" className="w-8 h-8 rounded" />
                    <span className="text-white font-bold">{teamA?.name || record.teamA.teamId}</span>
                  </div>
                  <div className="text-center">
                    <span className={`text-2xl font-bold ${record.winner === 'A' ? 'text-green-400' : record.winner === 'B' ? 'text-red-400' : 'text-gray-400'}`}>
                      {record.teamA.score}
                    </span>
                    <span className="text-gray-400 mx-2">-</span>
                    <span className={`text-2xl font-bold ${record.winner === 'B' ? 'text-green-400' : record.winner === 'A' ? 'text-red-400' : 'text-gray-400'}`}>
                      {record.teamB.score}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{teamB?.name || record.teamB.teamId}</span>
                    <img src={teamB?.logo} alt="" className="w-8 h-8 rounded" />
                  </div>
                </div>
                
                <div className="text-gray-400 text-sm text-center">
                  {new Date(record.createdAt).toLocaleString('zh-CN')}
                </div>
                
                <div className="mt-3 flex justify-center gap-4 text-sm">
                  <span className="text-gray-400">
                    {teamA?.shortName}: {record.teamA.quarters.join(' - ')}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-400">
                    {teamB?.shortName}: {record.teamB.quarters.join(' - ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}