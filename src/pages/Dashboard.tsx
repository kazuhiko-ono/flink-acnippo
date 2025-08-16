import { useReportStore } from '@/stores/reportStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, AlertTriangle, Camera, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { reports, getTodayReport, getRecentReports } = useReportStore();
  const todayReport = getTodayReport();
  const recentReports = getRecentReports(5);

  const stats = {
    totalReports: reports.length,
    changesThisWeek: reports.reduce((acc, report) => acc + report.changes.length, 0),
    concernsOpen: reports.reduce((acc, report) => 
      acc + report.concerns.filter(c => c.status !== '解決済み').length, 0
    ),
    photosTotal: reports.reduce((acc, report) => acc + report.photos.length, 0),
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ダッシュボード</h2>
        <Link to="/create">
          <Button variant="outline" className="border-2 hover:bg-gray-50">
            <Plus className="h-4 w-4 mr-2" />
            新しい日報作成
          </Button>
        </Link>
      </div>

      {/* Today's Report Status */}
      {todayReport ? (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">本日の日報</CardTitle>
            <CardDescription>
              {todayReport.projectName} - 最終更新: {new Date(todayReport.updatedAt).toLocaleTimeString('ja-JP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm">進捗率: {todayReport.progress.actual}%</p>
                <p className="text-sm">変化記録: {todayReport.changes.length}件</p>
                <p className="text-sm">写真: {todayReport.photos.length}枚</p>
              </div>
              <Link to="/create">
                <Button variant="outline" size="sm">
                  編集
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">本日の日報</CardTitle>
            <CardDescription>まだ本日の日報が作成されていません</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/create">
              <Button variant="outline" className="w-full border-2 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                今日の日報を作成
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総日報数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              累計レポート数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今週の変化</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.changesThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              記録された変化
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">未解決の懸念</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.concernsOpen}</div>
            <p className="text-xs text-muted-foreground">
              対応が必要
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">写真総数</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.photosTotal}</div>
            <p className="text-xs text-muted-foreground">
              アップロード済み
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>最近の日報</CardTitle>
          <CardDescription>直近5件の作成済み日報</CardDescription>
        </CardHeader>
        <CardContent>
          {recentReports.length > 0 ? (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.projectName}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString('ja-JP')} - {report.reporter}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        進捗 {report.progress.actual}%
                      </span>
                      {report.changes.length > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          変化 {report.changes.length}件
                        </span>
                      )}
                      {report.concerns.length > 0 && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          懸念 {report.concerns.length}件
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    詳細
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              まだ日報が作成されていません
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}