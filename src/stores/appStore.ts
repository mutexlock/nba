import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Team, BattleRecord, SimulationResult, PlayerStats } from '../types';
import { getPlayerById, allPlayers } from '../data/players';
import { getTeamById } from '../data/teams';
import localforage from 'localforage';

localforage.config({
  name: 'nba-simulator',
  storeName: 'data'
});

interface AppState {
  // Players
  players: Player[];
  setPlayers: (players: Player[]) => void;
  
  // Teams
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  
  // Selection
  selectedTeamA: string | null;
  selectedTeamB: string | null;
  setSelectedTeamA: (id: string | null) => void;
  setSelectedTeamB: (id: string | null) => void;
  
  // Simulation
  simulationResult: SimulationResult | null;
  setSimulationResult: (result: SimulationResult | null) => void;
  
  // Battle Records
  battleRecords: BattleRecord[];
  addBattleRecord: (record: BattleRecord) => void;
  clearBattleRecords: () => void;
  
  // Custom Teams (for V1.1)
  customTeams: Team[];
  addCustomTeam: (team: Team) => void;
  removeCustomTeam: (id: string) => void;
  updateCustomTeam: (id: string, updates: Partial<Team>) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Initialize
  initialize: () => void;
}

// Helper to simulate a game
const simulateGame = (teamA: Team, teamB: Team): SimulationResult => {
  const teamAPlayers = teamA.players.map(id => getPlayerById(id)).filter(Boolean) as Player[];
  const teamBPlayers = teamB.players.map(id => getPlayerById(id)).filter(Boolean) as Player[];
  
  const teamARating = teamA.rating;
  const teamBRating = teamB.rating;
  
  // Quarter coefficients (NBA比赛四节得分规律)
  const quarterCoefficients = [1.0, 0.95, 1.0, 1.1];
  
  const generateQuarterScore = (baseRating: number, opponentRating: number, coefficient: number): number => {
    // 基础得分 = 球队评分 / 200 * 30 (约25-30分)
    const baseScore = (baseRating / 200) * 28;
    // 对手防守修正
    const opponentFactor = 1 - (opponentRating / 100) * 0.2;
    // 随机波动 0.85 - 1.15
    const randomFactor = 0.85 + Math.random() * 0.3;
    // 节次系数
    const quarterScore = baseScore * opponentFactor * coefficient * randomFactor;
    return Math.round(quarterScore);
  };
  
  // Generate quarter scores
  const quartersA: number[] = [];
  const quartersB: number[] = [];
  
  for (let i = 0; i < 4; i++) {
    quartersA.push(generateQuarterScore(teamARating, teamBRating, quarterCoefficients[i]));
    quartersB.push(generateQuarterScore(teamBRating, teamARating, quarterCoefficients[i]));
  }
  
  // Calculate total scores
  const scoreA = quartersA.reduce((a, b) => a + b, 0);
  const scoreB = quartersB.reduce((a, b) => a + b, 0);
  
  // Generate player stats
  const generatePlayerStats = (players: Player[], teamScore: number): PlayerStats[] => {
    const totalRating = players.reduce((sum, p) => sum + p.rating, 0);
    
    return players.map(player => {
      const weight = player.rating / totalRating;
      const points = Math.round(teamScore * weight * (0.7 + Math.random() * 0.6));
      const rebounds = Math.round(player.stats.rebounds * (0.3 + Math.random() * 0.4));
      const assists = Math.round(player.stats.assists * (0.3 + Math.random() * 0.4));
      const fgAttempted = Math.round(points * 1.8);
      const fgMade = Math.round(fgAttempted * (player.stats.fgPct / 100) * (0.8 + Math.random() * 0.4));
      const threeAttempted = Math.round(fgAttempted * 0.35);
      const threeMade = Math.round(threeAttempted * (player.stats.threePct / 100));
      
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
  };
  
  const winner: 'A' | 'B' | 'draw' = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'draw';
  
  return {
    teamA: {
      score: scoreA,
      quarters: quartersA,
      players: generatePlayerStats(teamAPlayers, scoreA)
    },
    teamB: {
      score: scoreB,
      quarters: quartersB,
      players: generatePlayerStats(teamBPlayers, scoreB)
    },
    winner
  };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Players
      players: allPlayers,
      setPlayers: (players) => set({ players }),
      
      // Teams
      teams: [],
      setTeams: (teams) => set({ teams }),
      
      // Selection
      selectedTeamA: null,
      selectedTeamB: null,
      setSelectedTeamA: (id) => set({ selectedTeamA: id }),
      setSelectedTeamB: (id) => set({ selectedTeamB: id }),
      
      // Simulation
      simulationResult: null,
      setSimulationResult: (result) => set({ simulationResult: result }),
      
      // Battle Records
      battleRecords: [],
      addBattleRecord: (record) => set((state) => ({
        battleRecords: [record, ...state.battleRecords].slice(0, 50)
      })),
      clearBattleRecords: () => set({ battleRecords: [] }),
      
      // Custom Teams
      customTeams: [],
      addCustomTeam: (team) => set((state) => ({
        customTeams: [...state.customTeams, team]
      })),
      removeCustomTeam: (id) => set((state) => ({
        customTeams: state.customTeams.filter(t => t.id !== id)
      })),
      updateCustomTeam: (id, updates) => set((state) => ({
        customTeams: state.customTeams.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      
      // UI State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Initialize - load from localforage
      initialize: async () => {
        const players = allPlayers;
        const { presetTeams } = await import('../data/teams');
        
        set({ 
          players,
          teams: presetTeams
        });
      }
    }),
    {
      name: 'nba-simulator-storage',
      storage: {
        getItem: async (name) => {
          const value = await localforage.getItem(name);
          return (value as any) ?? null;
        },
        setItem: async (name, value) => {
          await localforage.setItem(name, value);
        },
        removeItem: async (name) => {
          await localforage.removeItem(name);
        }
      }
    }
  )
);

// Export simulate function for direct use
export { simulateGame };