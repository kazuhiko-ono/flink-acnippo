import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useReportStore } from '@/stores/reportStore';
import { ProjectInfo } from '@/types';
import { Plus, Building2, Calendar, MapPin, User, Edit, Trash2 } from 'lucide-react';

export function ProjectManagement() {
  const { projects, createProject, updateProject, deleteProject, reports } = useReportStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectInfo | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<ProjectInfo, 'id'>>();

  const onSubmit = (data: Omit<ProjectInfo, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
      setEditingProject(null);
    } else {
      createProject(data);
    }
    reset();
    setShowForm(false);
  };

  const startEdit = (project: ProjectInfo) => {
    setEditingProject(project);
    reset(project);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingProject(null);
    reset();
    setShowForm(false);
  };

  const getProjectStats = (projectName: string) => {
    const projectReports = reports.filter(report => report.projectName === projectName);
    return {
      reportsCount: projectReports.length,
      lastReportDate: projectReports.length > 0 
        ? new Date(Math.max(...projectReports.map(r => new Date(r.date).getTime())))
        : null,
      totalPhotos: projectReports.reduce((sum, report) => sum + report.photos.length, 0),
      totalConcerns: projectReports.reduce((sum, report) => sum + report.concerns.length, 0),
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">プロジェクト管理</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新しいプロジェクト
        </Button>
      </div>

      {/* プロジェクト作成・編集フォーム */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProject ? 'プロジェクト編集' : '新しいプロジェクト'}
            </CardTitle>
            <CardDescription>
              プロジェクトの基本情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">プロジェクト名 *</Label>
                  <Input 
                    id="name"
                    {...register('name', { required: 'プロジェクト名を入力してください' })}
                    placeholder="工事名を入力"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="client">クライアント *</Label>
                  <Input 
                    id="client"
                    {...register('client', { required: 'クライアント名を入力してください' })}
                    placeholder="クライアント名を入力"
                  />
                  {errors.client && (
                    <p className="text-sm text-red-600 mt-1">{errors.client.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">現場住所 *</Label>
                  <Input 
                    id="location"
                    {...register('location', { required: '現場住所を入力してください' })}
                    placeholder="現場住所を入力"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="supervisor">現場責任者 *</Label>
                  <Input 
                    id="supervisor"
                    {...register('supervisor', { required: '現場責任者を入力してください' })}
                    placeholder="現場責任者を入力"
                  />
                  {errors.supervisor && (
                    <p className="text-sm text-red-600 mt-1">{errors.supervisor.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="startDate">開始日 *</Label>
                  <Input 
                    id="startDate"
                    type="date"
                    {...register('startDate', { 
                      required: '開始日を選択してください',
                      valueAsDate: true 
                    })}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate">終了予定日 *</Label>
                  <Input 
                    id="endDate"
                    type="date"
                    {...register('endDate', { 
                      required: '終了予定日を選択してください',
                      valueAsDate: true 
                    })}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">プロジェクト概要</Label>
                <Textarea 
                  id="description"
                  {...register('description')}
                  placeholder="プロジェクトの概要を入力してください"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="mr-2"
                  defaultChecked={true}
                />
                <Label htmlFor="isActive">アクティブなプロジェクト</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  キャンセル
                </Button>
                <Button type="submit">
                  {editingProject ? '更新' : '作成'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* プロジェクト一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">まだプロジェクトが作成されていません</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              最初のプロジェクトを作成
            </Button>
          </div>
        ) : (
          projects.map((project) => {
            const stats = getProjectStats(project.name);
            return (
              <Card key={project.id} className={project.isActive ? '' : 'opacity-60'}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.client}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(project)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {project.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    責任者: {project.supervisor}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(project.startDate).toLocaleDateString('ja-JP')} - 
                    {new Date(project.endDate).toLocaleDateString('ja-JP')}
                  </div>

                  {project.description && (
                    <p className="text-sm text-gray-700 mt-2">
                      {project.description}
                    </p>
                  )}

                  {/* プロジェクト統計 */}
                  <div className="border-t pt-3 mt-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">日報数:</span>
                        <span className="ml-1 font-medium">{stats.reportsCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">写真数:</span>
                        <span className="ml-1 font-medium">{stats.totalPhotos}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">懸念事項:</span>
                        <span className="ml-1 font-medium text-red-600">{stats.totalConcerns}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">最終更新:</span>
                        <span className="ml-1 font-medium">
                          {stats.lastReportDate 
                            ? stats.lastReportDate.toLocaleDateString('ja-JP')
                            : '-'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      project.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.isActive ? 'アクティブ' : '非アクティブ'}
                    </span>
                    <Button variant="outline" size="sm">
                      詳細を見る
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}