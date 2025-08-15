import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { CreateReport } from '@/pages/CreateReport';
import { ChangesTracking } from '@/pages/ChangesTracking';
import { PhotoManagement } from '@/pages/PhotoManagement';
import { ProjectManagement } from '@/pages/ProjectManagement';
import { ReportExport } from '@/pages/ReportExport';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout title="ダッシュボード">
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/create"
        element={
          <Layout title="日報作成">
            <CreateReport />
          </Layout>
        }
      />
      <Route
        path="/changes"
        element={
          <Layout title="変化・要望記録">
            <ChangesTracking />
          </Layout>
        }
      />
      <Route
        path="/photos"
        element={
          <Layout title="写真管理">
            <PhotoManagement />
          </Layout>
        }
      />
      <Route
        path="/projects"
        element={
          <Layout title="プロジェクト管理">
            <ProjectManagement />
          </Layout>
        }
      />
      <Route
        path="/export"
        element={
          <Layout title="レポート出力">
            <ReportExport />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;