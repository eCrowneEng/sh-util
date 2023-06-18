import { MemoryRouter as Router, Link, Routes, Route } from 'react-router-dom';
import './App.scss';
import OledPage from './features/oled/OledPage';

/**
 * Unused, can be the root of all utilities in the future
 */
function Welcome() {
  return (
    <div>
      <h1>eCrowne Utilities</h1>
      <Link to="/oled">SimHub OLED Helper</Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OledPage />} />
      </Routes>
    </Router>
  );
}
