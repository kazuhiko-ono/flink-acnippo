import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dailyReportSchema, type DailyReportFormData } from '@/utils/validationSchemas';
import { useReportStore } from '@/stores/reportStore';
import { DailyReport, WorkItem, Material, Worker } from '@/types';
import { Save, Plus, Trash2 } from 'lucide-react';

const weatherOptions = [
  '晴れ', '曇り', '雨', '雪', '強風', '霧'
];

export function CreateReport() {
  const { createReport, updateReport, getTodayReport, settings } = useReportStore();
  const existingReport = getTodayReport();
  
  const [workItems, setWorkItems] = useState<WorkItem[]>(existingReport?.workCompleted || []);
  const [materials] = useState<Material[]>(existingReport?.materials || []);
  const [workers] = useState<Worker[]>(existingReport?.workers || []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DailyReportFormData>({
    resolver: zodResolver(dailyReportSchema),
    defaultValues: existingReport ? {
      projectName: existingReport.projectName,
      location: existingReport.location,
      date: new Date(existingReport.date),
      weather: existingReport.weather,
      temperature: existingReport.temperature,
      reporter: existingReport.reporter,
      supervisor: existingReport.supervisor,
      workHours: existingReport.workHours,
      progress: existingReport.progress,
      notes: existingReport.notes,
      tomorrowPlan: existingReport.tomorrowPlan,
    } : {
      date: new Date(),
      reporter: settings.defaultReporter,
      supervisor: settings.defaultSupervisor,
      progress: { planned: 0, actual: 0 },
      workHours: { start: '08:00', end: '17:00' },
      temperature: 20,
    },
  });

  const onSubmit = (data: DailyReportFormData) => {
    const reportData: Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt'> = {
      ...data,
      notes: data.notes || '',
      tomorrowPlan: data.tomorrowPlan || '',
      workCompleted: workItems,
      materials,
      workers,
      changes: existingReport?.changes || [],
      clientRequests: existingReport?.clientRequests || [],
      workerFeedback: existingReport?.workerFeedback || [],
      concerns: existingReport?.concerns || [],
      photos: existingReport?.photos || [],
      communications: existingReport?.communications || [],
    };

    if (existingReport) {
      updateReport(existingReport.id, reportData);
    } else {
      createReport(reportData);
    }
  };

  const addWorkItem = () => {
    const newItem: WorkItem = {
      id: crypto.randomUUID(),
      category: '',
      description: '',
      isCompleted: false,
    };
    setWorkItems([...workItems, newItem]);
  };

  const updateWorkItem = (id: string, updates: Partial<WorkItem>) => {
    setWorkItems(items => items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeWorkItem = (id: string) => {
    setWorkItems(items => items.filter(item => item.id !== id));
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {existingReport ? '日報編集' : '日報作成'}
        </h2>
        <Button onClick={handleSubmit(onSubmit)}>
          <Save className="h-4 w-4 mr-2" />
          保存
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>工事の基本的な情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectName">工事名 *</Label>
                <Input 
                  id="projectName"
                  {...register('projectName')}
                  placeholder="工事名を入力"
                />
                {errors.projectName && (
                  <p className="text-sm text-red-600 mt-1">{errors.projectName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">現場住所 *</Label>
                <Input 
                  id="location"
                  {...register('location')}
                  placeholder="現場住所を入力"
                />
                {errors.location && (
                  <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="date">報告日時 *</Label>
                <Input 
                  id="date"
                  type="date"
                  {...register('date', { valueAsDate: true })}
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="weather">天候 *</Label>
                <Select onValueChange={(value) => setValue('weather', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="天候を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {weatherOptions.map((weather) => (
                      <SelectItem key={weather} value={weather}>
                        {weather}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.weather && (
                  <p className="text-sm text-red-600 mt-1">{errors.weather.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="temperature">気温 (℃) *</Label>
                <Input 
                  id="temperature"
                  type="number"
                  {...register('temperature', { valueAsNumber: true })}
                  placeholder="気温を入力"
                />
                {errors.temperature && (
                  <p className="text-sm text-red-600 mt-1">{errors.temperature.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reporter">報告者名 *</Label>
                <Input 
                  id="reporter"
                  {...register('reporter')}
                  placeholder="報告者名を入力"
                />
                {errors.reporter && (
                  <p className="text-sm text-red-600 mt-1">{errors.reporter.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="supervisor">現場責任者 *</Label>
                <Input 
                  id="supervisor"
                  {...register('supervisor')}
                  placeholder="現場責任者を入力"
                />
                {errors.supervisor && (
                  <p className="text-sm text-red-600 mt-1">{errors.supervisor.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workStart">作業開始時間 *</Label>
                <Input 
                  id="workStart"
                  type="time"
                  {...register('workHours.start')}
                />
                {errors.workHours?.start && (
                  <p className="text-sm text-red-600 mt-1">{errors.workHours.start.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="workEnd">作業終了時間 *</Label>
                <Input 
                  id="workEnd"
                  type="time"
                  {...register('workHours.end')}
                />
                {errors.workHours?.end && (
                  <p className="text-sm text-red-600 mt-1">{errors.workHours.end.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plannedProgress">予定進捗率 (%)</Label>
                <Input 
                  id="plannedProgress"
                  type="number"
                  min="0"
                  max="100"
                  {...register('progress.planned', { valueAsNumber: true })}
                  placeholder="予定進捗率"
                />
              </div>

              <div>
                <Label htmlFor="actualProgress">実績進捗率 (%)</Label>
                <Input 
                  id="actualProgress"
                  type="number"
                  min="0"
                  max="100"
                  {...register('progress.actual', { valueAsNumber: true })}
                  placeholder="実績進捗率"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 作業内容 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>作業内容</CardTitle>
                <CardDescription>本日実施した作業を記録してください</CardDescription>
              </div>
              <Button type="button" onClick={addWorkItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                作業追加
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>作業カテゴリ</Label>
                        <Input
                          value={item.category}
                          onChange={(e) => updateWorkItem(item.id, { category: e.target.value })}
                          placeholder="例: 配管工事"
                        />
                      </div>
                      <div>
                        <Label>作業時間 (時間)</Label>
                        <Input
                          type="number"
                          value={item.timeSpent || ''}
                          onChange={(e) => updateWorkItem(item.id, { timeSpent: Number(e.target.value) })}
                          placeholder="作業時間"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeWorkItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>作業内容</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateWorkItem(item.id, { description: e.target.value })}
                      placeholder="作業内容を詳しく入力してください"
                    />
                  </div>
                  <div>
                    <Label>詳細・備考</Label>
                    <Textarea
                      value={item.details || ''}
                      onChange={(e) => updateWorkItem(item.id, { details: e.target.value })}
                      placeholder="詳細情報や備考があれば入力してください"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`completed-${item.id}`}
                      checked={item.isCompleted}
                      onChange={(e) => updateWorkItem(item.id, { isCompleted: e.target.checked })}
                      className="mr-2"
                    />
                    <Label htmlFor={`completed-${item.id}`}>完了</Label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* その他の情報 */}
        <Card>
          <CardHeader>
            <CardTitle>その他の情報</CardTitle>
            <CardDescription>備考や明日の予定を記録してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">備考・特記事項</Label>
              <Textarea 
                id="notes"
                {...register('notes')}
                placeholder="備考があれば入力してください"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tomorrowPlan">明日の予定・申し送り事項</Label>
              <Textarea 
                id="tomorrowPlan"
                {...register('tomorrowPlan')}
                placeholder="明日の予定や申し送り事項を入力してください"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button type="submit" size="lg">
            <Save className="h-4 w-4 mr-2" />
            日報を保存
          </Button>
        </div>
      </form>
    </div>
  );
}