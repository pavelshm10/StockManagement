// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Portfolio from './components/Portfolio/Portfolio';

export function App() {
  return (
    <div>
      <Routes>
        {/* Redirect root to portfolio */}
        <Route path="/" element={<Navigate to="/portfolio" replace />} />

        {/* Portfolio page - main application */}
        <Route path="/portfolio" element={<Portfolio />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/portfolio" replace />} />
      </Routes>
    </div>
  );
}

export default App;
