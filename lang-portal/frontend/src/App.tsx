import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Dashboard from '@/pages/Dashboard';
import StudyActivities from '@/pages/StudyActivities';
import StudyActivity from '@/pages/StudyActivity';
import Groups from '@/pages/Groups';
import Group from '@/pages/Group';
import Sessions from '@/pages/Sessions';
import Settings from '@/pages/Settings';
import SpanishHistory from '@/pages/SpanishHistory';
import { PracticeTracker } from '@/components/PracticeTracker';
import SongVocabulary from './pages/SongVocabulary';
import ListeningPractice from './pages/ListeningPractice';
import WritingPractice from './pages/WritingPractice';
import Flashcards from '@/pages/Flashcards';
import Progress from '@/pages/Progress';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<SpanishHistory />} />
            <Route path="/study-activities" element={<StudyActivities />} />
            <Route path="/study-activities/:id" element={<StudyActivity />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:id" element={<Group />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/practice" element={<PracticeTracker />} />
            <Route path="/song-vocabulary" element={<SongVocabulary />} />
            <Route path="/listening-practice" element={<ListeningPractice />} />
            <Route path="/writing-practice" element={<WritingPractice />} />
            <Route path="/flashcards" element={<Flashcards />} />
          </Routes>
          <Toaster richColors closeButton position="top-center" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App