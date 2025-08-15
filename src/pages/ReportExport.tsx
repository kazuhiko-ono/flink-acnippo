import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReportStore } from '@/stores/reportStore';
import { FileText, Download, Calendar, Filter, FileSpreadsheet, FileImage } from 'lucide-react';

export function ReportExport() {
  const { reports } = useReportStore();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<string>('pdf');

  const filteredReports = reports.filter(report => {
    const projectMatch = !selectedProject || report.projectName === selectedProject;
    const startMatch = !startDate || new Date(report.date) >= new Date(startDate);
    const endMatch = !endDate || new Date(report.date) <= new Date(endDate);
    return projectMatch && startMatch && endMatch;
  });

  const exportData = () => {
    // TODO: Implement actual export functionality
    console.log('Exporting reports:', filteredReports);
    alert(`${filteredReports.length}件のレポートを${exportFormat.toUpperCase()}形式でエクスポートします`);
  };

  const exportFormats = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet },
    { value: 'images', label: '写真アルバム', icon: FileImage },
  ];

  const projectNames = [...new Set(reports.map(report => report.projectName))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">レポート出力</h2>
        <div className="text-sm text-gray-500">
          総レポート数: {reports.length}件
        </div>
      </div>

      {/* エクスポート設定 */}
      <Card>
        <CardHeader>
          <CardTitle>エクスポート設定</CardTitle>
          <CardDescription>
            出力するレポートの条件と形式を選択してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="project">プロジェクト</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="すべてのプロジェクト" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべてのプロジェクト</SelectItem>
                  {projectNames.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">開始日</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">終了日</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="format">出力形式</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="出力形式を選択" />
                </SelectTrigger>
                <SelectContent>
                  {exportFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex items-center">
                        <format.icon className="h-4 w-4 mr-2" />
                        {format.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>条件に一致するレポート: {filteredReports.length}件</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedProject('');
                  setStartDate('');
                  setEndDate('');
                }}
              >
                フィルターをクリア
              </Button>
              <Button onClick={exportData} disabled={filteredReports.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* エクスポート形式の説明 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportFormats.map((format) => (
          <Card key={format.value} className={exportFormat === format.value ? 'ring-2 ring-blue-500' : ''}>
            <CardHeader>
              <div className="flex items-center">
                <format.icon className="h-5 w-5 mr-2" />
                <CardTitle className="text-lg">{format.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {format.value === 'pdf' && '日報をPDF形式で出力します。印刷やメール送信に適しています。'}
                {format.value === 'excel' && 'データをExcel形式で出力します。集計や分析に適しています。'}
                {format.value === 'images' && '写真をアルバム形式で出力します。視覚的な記録の確認に適しています。'}
              </CardDescription>
              <Button 
                variant={exportFormat === format.value ? 'default' : 'outline'}
                className="w-full mt-3"
                onClick={() => setExportFormat(format.value)}
              >
                選択
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* プレビュー */}
      {filteredReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>エクスポート対象レポート</CardTitle>
            <CardDescription>
              以下のレポートがエクスポートされます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredReports.map((report) => (
                <div key={report.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.projectName}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString('ja-JP')} - {report.reporter}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        進捗 {report.progress.actual}%
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        写真 {report.photos.length}枚
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
                  <div className="text-sm text-gray-500">
                    {new Date(report.updatedAt).toLocaleString('ja-JP')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 統計情報 */}
      {filteredReports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">対象レポート数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredReports.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総写真数</CardTitle>
              <FileImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredReports.reduce((sum, report) => sum + report.photos.length, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">変化記録</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredReports.reduce((sum, report) => sum + report.changes.length, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">懸念事項</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {filteredReports.reduce((sum, report) => sum + report.concerns.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}