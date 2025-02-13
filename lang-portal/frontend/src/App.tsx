import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Dashboard from '@/pages/Dashboard';
import StudyActivities from '@/pages/StudyActivities';
import StudyActivity from '@/pages/StudyActivity';
import Words from '@/pages/Words';
import Word from '@/pages/Word';
import Groups from '@/pages/Groups';
import Group from '@/pages/Group';
import Sessions from '@/pages/Sessions';
import Settings from '@/pages/Settings';
import SpanishHistory from '@/pages/SpanishHistory';
import CommonPhrases from './pages/CommonPhrases';
import TravelVocabulary from './pages/TravelVocabulary';
import { PracticeTracker } from '@/components/PracticeTracker';
import { ActivityLauncher } from '@/components/ActivityLauncher';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-6">
            <Breadcrumbs />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<SpanishHistory />} />
              <Route path="/study-activities" element={<StudyActivities />} />
              <Route path="/study-activities/:id" element={<StudyActivity />} />
              <Route path="/words" element={<Words />} />
              <Route path="/words/:id" element={<Word />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/core-verbs" element={<Group />} />
              <Route path="/groups/common-phrases" element={<CommonPhrases />} />
              <Route path="/groups/travel-vocabulary" element={<TravelVocabulary />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/practice" element={<PracticeTracker />} />
              <Route path="/activities" element={<ActivityLauncher />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App