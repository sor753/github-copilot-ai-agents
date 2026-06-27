import { Navigate, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import MyJournalPage from './pages/MyJournalPage';
import JournalDetailPage from './pages/JournalDetailPage';
import JournalFormPage from './pages/JournalFormPage';
import NotFoundPage from './pages/NotFoundPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/journal" element={<MyJournalPage />} />
      <Route path="/journal/new" element={<JournalFormPage />} />
      <Route path="/journal/:date" element={<JournalDetailPage />} />
      <Route path="/journal/:date/edit" element={<JournalFormPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
