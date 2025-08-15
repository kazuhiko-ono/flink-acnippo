import { z } from 'zod';

export const dailyReportSchema = z.object({
  projectName: z.string().min(1, '工事名を入力してください'),
  location: z.string().min(1, '現場住所を入力してください'),
  date: z.date({ required_error: '報告日時を選択してください' }),
  weather: z.string().min(1, '天候を選択してください'),
  temperature: z.number().min(-50).max(50),
  reporter: z.string().min(1, '報告者名を入力してください'),
  supervisor: z.string().min(1, '現場責任者を入力してください'),
  workHours: z.object({
    start: z.string().min(1, '開始時間を入力してください'),
    end: z.string().min(1, '終了時間を入力してください'),
  }),
  progress: z.object({
    planned: z.number().min(0).max(100),
    actual: z.number().min(0).max(100),
  }),
  notes: z.string().optional(),
  tomorrowPlan: z.string().optional(),
});

export const changeRecordSchema = z.object({
  category: z.enum(['環境', '機器', '近隣', 'その他']),
  description: z.string().min(1, '変化の内容を入力してください'),
  impact: z.enum(['軽微', '注意', '重要']),
  actionRequired: z.string().optional(),
  reportedBy: z.string().min(1, '報告者を入力してください'),
});

export const clientRequestSchema = z.object({
  type: z.enum(['追加要望', '変更依頼', '不満', '質問', '評価']),
  content: z.string().min(1, '要望内容を入力してください'),
  priority: z.enum(['低', '中', '高']),
  response: z.string().optional(),
  status: z.enum(['対応済み', '検討中', '未対応']),
  contactPerson: z.string().optional(),
});

export const workerFeedbackSchema = z.object({
  type: z.enum(['作業上の気づき', '改善提案', '困りごと', '相談事項']),
  content: z.string().min(1, 'フィードバック内容を入力してください'),
  workerName: z.string().min(1, '作業者名を入力してください'),
  priority: z.enum(['低', '中', '高']),
  actionTaken: z.string().optional(),
});

export const concernSchema = z.object({
  category: z.enum(['安全面', '品質面', 'スケジュール', 'コスト', 'その他']),
  description: z.string().min(1, '懸念内容を入力してください'),
  riskLevel: z.enum(['低', '中', '高', '緊急']),
  potentialImpact: z.string().min(1, '想定される影響を入力してください'),
  recommendedAction: z.string().min(1, '推奨対応を入力してください'),
  reportedBy: z.string().min(1, '報告者を入力してください'),
  status: z.enum(['新規', '対応中', '解決済み', '監視中']).default('新規'),
});

export const workItemSchema = z.object({
  category: z.string().min(1, '作業カテゴリを入力してください'),
  description: z.string().min(1, '作業内容を入力してください'),
  details: z.string().optional(),
  timeSpent: z.number().optional(),
});

export const materialSchema = z.object({
  name: z.string().min(1, '材料名を入力してください'),
  quantity: z.number().min(0, '数量は0以上で入力してください'),
  unit: z.string().min(1, '単位を入力してください'),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});

export const workerSchema = z.object({
  name: z.string().min(1, '作業者名を入力してください'),
  role: z.string().min(1, '職種を入力してください'),
  hoursWorked: z.number().min(0).max(24, '作業時間は24時間以内で入力してください'),
  tasks: z.array(z.string()).optional(),
});

export type DailyReportFormData = z.infer<typeof dailyReportSchema>;
export type ChangeRecordFormData = z.infer<typeof changeRecordSchema>;
export type ClientRequestFormData = z.infer<typeof clientRequestSchema>;
export type WorkerFeedbackFormData = z.infer<typeof workerFeedbackSchema>;
export type ConcernFormData = z.infer<typeof concernSchema>;
export type WorkItemFormData = z.infer<typeof workItemSchema>;
export type MaterialFormData = z.infer<typeof materialSchema>;
export type WorkerFormData = z.infer<typeof workerSchema>;