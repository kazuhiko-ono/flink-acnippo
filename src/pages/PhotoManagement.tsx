import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReportStore } from '@/stores/reportStore';
import { Upload, Camera, Image, Trash2, Eye } from 'lucide-react';

const photoCategories = [
  '作業前', '作業中', '作業後', '問題箇所', '完成', 'その他'
];

export function PhotoManagement() {
  const { reports } = useReportStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  const allPhotos = reports.flatMap(report => 
    report.photos.map(photo => ({
      ...photo,
      reportId: report.id,
      projectName: report.projectName,
      reportDate: report.date,
    }))
  );

  const filteredPhotos = allPhotos.filter(photo => {
    const categoryMatch = !selectedCategory || photo.category === selectedCategory;
    const projectMatch = !selectedProject || photo.projectName === selectedProject;
    return categoryMatch && projectMatch;
  });

  const projects = [...new Set(reports.map(report => report.projectName))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">写真管理</h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          写真をアップロード
        </Button>
      </div>

      {/* フィルター */}
      <Card>
        <CardHeader>
          <CardTitle>フィルター</CardTitle>
          <CardDescription>写真を絞り込んで表示できます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">カテゴリ</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="すべてのカテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべてのカテゴリ</SelectItem>
                  {photoCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="project">プロジェクト</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="すべてのプロジェクト" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべてのプロジェクト</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedProject('');
                }}
                className="w-full"
              >
                フィルターをクリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総写真数</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allPhotos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">表示中</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPhotos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今週の追加</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allPhotos.filter(photo => {
                const photoDate = new Date(photo.timestamp);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return photoDate > weekAgo;
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">プロジェクト数</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* 写真グリッド */}
      <Card>
        <CardHeader>
          <CardTitle>写真一覧</CardTitle>
          <CardDescription>
            {filteredPhotos.length > 0 
              ? `${filteredPhotos.length}枚の写真が見つかりました`
              : '写真が見つかりませんでした'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                    <span className="text-sm text-gray-500 ml-2">画像プレビュー</span>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {photo.category}
                      </span>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{photo.projectName}</h4>
                    {photo.caption && (
                      <p className="text-xs text-gray-600 mb-2">{photo.caption}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(photo.timestamp).toLocaleDateString('ja-JP')}
                    </p>
                    {photo.location && (
                      <p className="text-xs text-gray-500">{photo.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {selectedCategory || selectedProject 
                  ? '選択した条件に一致する写真がありません'
                  : 'まだ写真がアップロードされていません'
                }
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                最初の写真をアップロード
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}