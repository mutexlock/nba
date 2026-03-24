import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './stores/appStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Players from './pages/Players';
import Teams from './pages/Teams';
import Battle from './pages/Battle';
import PlayerDetail from './pages/PlayerDetail';
import BattleRecord from './pages/BattleRecord';

function App() {
  const initialize = useStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="players" element={<Players />} />
          <Route path="players/:id" element={<PlayerDetail />} />
          <Route path="teams" element={<Teams />} />
          <Route path="battle" element={<Battle />} />
          <Route path="battle-record" element={<BattleRecord />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;