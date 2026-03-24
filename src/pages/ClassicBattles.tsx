import { useState } from 'react';
import { classicBattles, ClassicBattle } from '../data/classicBattles';
import { useStore } from '../stores/appStore';
import { getTeamById } from '../data/teams';
import { simulateGame } from '../stores/appStore';
import { useNavigate } from 'react-router-dom';

export default function ClassicBattles() {
  const navigate = useNavigate();
  const { setSimulationResult, addBattleRecord, teams } = useStore();
  const [selectedBattle, setSelectedBattle] = useState<ClassicBattle | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleStartBattle = async (battle: ClassicBattle) => {
    setIsSimulating(true);
    
    // 加载预设球队
    const { presetTeams } = await import('../data/teams');
    const teamA = presetTeams.find(t => t.id === battle.teamA.teamId);
    const teamB = presetTeams.find(t => t.id === battle.teamB.teamId);
    
    if (teamA && teamB) {
      const result = simulateGame(teamA, teamB);
      setSimulationResult(result);
      
      // 保存对战记录
      const record = {
        id: Date.now().toString(),
        createdAt: Date.now(),
        teamA: {
          teamId: teamA.id,
          score: result.teamA.score,
          quarters: result.teamA.quarters,
          players: result.teamA.players
        },
        teamB: {
          teamId: teamB.id,
          score: result.teamB.score,
          quarters: result.teamB.quarters,
          players: result.teamB.players
        },
        winner: result.winner
      };
      addBattleRecord(record);
      
      // 传递战役信息并跳转
      navigate('/battle', { 
        state: { 
          battle: battle.name,
          background: battle.background,
          teamA: teamA.id,
          teamB: teamB.id
        } 
      });
    }
    
    setIsSimulating(false);
  };

  return (
    <div className="classic-battles-page">
      <div className="page-header">
        <h1>🏆 经典战役</h1>
        <p>重温NBA历史上的经典对决</p>
      </div>
      
      <div className="battles-grid">
        {classicBattles.map((battle) => (
          <div key={battle.id} className="battle-card">
            <div className="battle-teams">
              <div className="team team-a">
                <img 
                  src={getTeamById(battle.teamA.teamId)?.logo || '/images/teams/96-bulls.png'} 
                  alt={battle.teamA.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/teams/96-bulls.png';
                  }}
                />
                <span>{battle.teamA.name}</span>
              </div>
              <div className="vs">VS</div>
              <div className="team team-b">
                <img 
                  src={getTeamById(battle.teamB.teamId)?.logo || '/images/teams/96-bulls.png'} 
                  alt={battle.teamB.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/teams/96-bulls.png';
                  }}
                />
                <span>{battle.teamB.name}</span>
              </div>
            </div>
            
            <div className="battle-info">
              <h3>{battle.name}</h3>
              <p className="background">{battle.background}</p>
              <p className="highlight">💫 {battle.highlight}</p>
            </div>
            
            <button 
              className="start-btn"
              onClick={() => handleStartBattle(battle)}
              disabled={isSimulating}
            >
              {isSimulating ? '⚔️ 比赛中...' : '⚔️ 开始模拟'}
            </button>
          </div>
        ))}
      </div>
      
      <style>{`
        .classic-battles-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .page-header h1 {
          font-size: 2.5rem;
          color: #1a1a2e;
          margin-bottom: 10px;
        }
        
        .page-header p {
          color: #666;
          font-size: 1.1rem;
        }
        
        .battles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }
        
        .battle-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .battle-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        
        .battle-teams {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 16px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 12px;
        }
        
        .team {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        
        .team img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin-bottom: 8px;
        }
        
        .team span {
          color: white;
          font-size: 0.85rem;
          text-align: center;
        }
        
        .vs {
          color: #f0c419;
          font-size: 1.5rem;
          font-weight: bold;
          padding: 0 16px;
        }
        
        .battle-info h3 {
          font-size: 1.2rem;
          color: #1a1a2e;
          margin-bottom: 12px;
        }
        
        .battle-info .background {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 8px;
        }
        
        .battle-info .highlight {
          color: #e94560;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .start-btn {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s;
        }
        
        .start-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        
        .start-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}