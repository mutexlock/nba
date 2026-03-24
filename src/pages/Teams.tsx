import { presetTeams } from '../data/teams';
import { getPlayerById } from '../data/players';

export default function Teams() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">🏀 预设球队</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presetTeams.map(team => (
            <div key={team.id} className="bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <img src={team.logo} alt={team.name} className="w-16 h-16 rounded-xl" />
                <div>
                  <h2 className="text-xl font-bold text-white">{team.name}</h2>
                  <p className="text-gray-400 text-sm">{team.era}</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg font-bold px-3 py-1 rounded-full">
                    {team.rating}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{team.description}</p>
              
              <div className="space-y-2">
                <h3 className="text-white font-bold text-sm">首发阵容:</h3>
                {team.players.map((playerId, index) => {
                  const player = getPlayerById(playerId);
                  return (
                    <div key={playerId} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 w-6">
                        {['PG', 'SG', 'SF', 'PF', 'C'][index]}
                      </span>
                      <span className="text-gray-300">
                        {player?.name || playerId}
                      </span>
                      {player && (
                        <span className="ml-auto text-yellow-400">{player.rating}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}