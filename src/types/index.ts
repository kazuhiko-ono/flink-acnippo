export interface DailyReport {
  id: string;
  date: Date;
  projectName: string;
  location: string;
  weather: string;
  temperature: number;
  reporter: string;
  supervisor: string;
  workHours: { start: string; end: string };
  workCompleted: WorkItem[];
  progress: { planned: number; actual: number };
  materials: Material[];
  workers: Worker[];
  changes: ChangeRecord[];
  clientRequests: ClientRequest[];
  workerFeedback: WorkerFeedback[];
  concerns: Concern[];
  photos: Photo[];
  tomorrowPlan: string;
  communications: Communication[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkItem {
  id: string;
  category: string;
  description: string;
  isCompleted: boolean;
  details?: string;
  timeSpent?: number;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  supplier?: string;
  notes?: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  hoursWorked: number;
  tasks?: string[];
}

export interface ChangeRecord {
  id: string;
  category: '環境' | '機器' | '近隣' | 'その他';
  description: string;
  impact: '軽微' | '注意' | '重要';
  timestamp: Date;
  photoId?: string;
  actionRequired?: string;
  reportedBy: string;
}

export interface ClientRequest {
  id: string;
  type: '追加要望' | '変更依頼' | '不満' | '質問' | '評価';
  content: string;
  priority: '低' | '中' | '高';
  response: string;
  status: '対応済み' | '検討中' | '未対応';
  timestamp: Date;
  contactPerson?: string;
}

export interface WorkerFeedback {
  id: string;
  type: '作業上の気づき' | '改善提案' | '困りごと' | '相談事項';
  content: string;
  workerName: string;
  timestamp: Date;
  actionTaken?: string;
  priority: '低' | '中' | '高';
}

export interface Concern {
  id: string;
  category: '安全面' | '品質面' | 'スケジュール' | 'コスト' | 'その他';
  description: string;
  riskLevel: '低' | '中' | '高' | '緊急';
  timestamp: Date;
  potentialImpact: string;
  recommendedAction: string;
  reportedBy: string;
  status: '新規' | '対応中' | '解決済み' | '監視中';
}

export interface Photo {
  id: string;
  filename: string;
  url: string;
  caption?: string;
  category: '作業前' | '作業中' | '作業後' | '問題箇所' | '完成' | 'その他';
  timestamp: Date;
  location?: string;
  associatedReportId?: string;
}

export interface Communication {
  id: string;
  type: '他業者調整' | 'クライアント' | '監理者' | '元請け' | 'その他';
  content: string;
  contactPerson: string;
  timestamp: Date;
  method: '対面' | '電話' | 'メール' | 'LINE' | 'その他';
  followUpRequired: boolean;
  followUpDate?: Date;
}

export interface ReportTemplate {
  id: string;
  name: string;
  projectType: string;
  workItems: Omit<WorkItem, 'id' | 'isCompleted'>[];
  commonMaterials: Omit<Material, 'id' | 'quantity'>[];
  defaultWorkers: Omit<Worker, 'id' | 'hoursWorked'>[];
}

export interface UserSettings {
  defaultReporter: string;
  defaultSupervisor: string;
  favoriteTemplates: string[];
  notificationSettings: {
    dailyReminder: boolean;
    reminderTime: string;
    weeklyReport: boolean;
  };
}

export type ReportStatus = '下書き' | '提出済み' | '承認済み' | '要修正';

export interface ReportSummary {
  id: string;
  date: Date;
  projectName: string;
  status: ReportStatus;
  hasChanges: boolean;
  hasRequests: boolean;
  hasConcerns: boolean;
  photoCount: number;
}

export interface ProjectInfo {
  id: string;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  client: string;
  supervisor: string;
  description?: string;
  isActive: boolean;
}