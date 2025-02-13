import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpanishHistory from './components/SpanishHistory';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <Router>
            <div className="app">
                <nav>
                    {/* ... existing nav items ... */}
                    <Link to="/history">Spanish History 📜</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/history" element={<SpanishHistory />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App; 