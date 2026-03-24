import { Link } from 'react-router-dom';
import { useStore } from '../stores/appStore';
import { getTeamById } from '../data/teams';

const featuredTeams = [
  { id: '96-bulls', desc: '72胜历史最强' },
  { id: '17-warriors', desc: '死神杜兰特加盟' },
  { id: '00-lakers', desc: 'OK组合王朝' },
];

function Home() {
  const teams = useStore((state) => state.teams);
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
            跨时代NBA对战模拟器
          </span>
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          让不同时代的传奇球队同场竞技，谁是NBA历史最强？
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/battle"
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
          >
            开始对战 ⚔️
          </Link>
          <Link
            to="/players"
            className="px-8 py-3 border border-orange-500/50 rounded-lg font-semibold text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            查看球员库 👥
          </Link>
        </div>
      </section>
      
      {/* Classic Battles */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-center">⚔️ 经典战役</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/classic-battles"
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                ⚔️
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                  历史经典战役
                </h4>
                <p className="text-sm text-gray-400">重温NBA历史上的巅峰对决</p>
              </div>
              <span className="text-purple-400 text-xl">→</span>
            </div>
          </Link>
          
          <Link
            to="/my-teams"
            className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  自建球队
                </h4>
                <p className="text-sm text-gray-400">从球员库选择创建你的梦幻球队</p>
              </div>
              <span className="text-blue-400 text-xl">→</span>
            </div>
          </Link>
        </div>
      </section>
      
      {/* Featured Teams */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-center">🏆 经典球队</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTeams.map((team) => {
            const teamData = getTeamById(team.id);
            if (!teamData) return null;
            return (
              <Link
                key={team.id}
                to={`/battle?teamA=${team.id}`}
                className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-6 hover:border-orange-500/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center text-3xl">
                    🏀
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                      {teamData.name}
                    </h4>
                    <p className="text-sm text-gray-500">{team.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">球队评分</span>
                  <span className="text-orange-400 font-bold">{teamData.rating}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      
      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a2e]/50 border border-[#2a2a4e] rounded-xl p-6">
          <div className="text-3xl mb-3">👥</div>
          <h4 className="text-lg font-bold mb-2">球员数据库</h4>
          <p className="text-gray-400 text-sm">涵盖80年代至今100+球员数据，包含能力值和生涯统计</p>
        </div>
        <div className="bg-[#1a1a2e]/50 border border-[#2a2a4e] rounded-xl p-6">
          <div className="text-3xl mb-3">⚔️</div>
          <h4 className="text-lg font-bold mb-2">跨时代对战</h4>
          <p className="text-gray-400 text-sm">选择任意两支球队模拟比赛，体验关公战秦琼的乐趣</p>
        </div>
        <div className="bg-[#1a1a2e]/50 border border-[#2a2a4e] rounded-xl p-6">
          <div className="text-3xl mb-3">📊</div>
          <h4 className="text-lg font-bold mb-2">数据可视化</h4>
          <p className="text-gray-400 text-sm">专业图表展示比赛数据，帮你深入分析每场对决</p>
        </div>
      </section>
    </div>
  );
}

export default Home;