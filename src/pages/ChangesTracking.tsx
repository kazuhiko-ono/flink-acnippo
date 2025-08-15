import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReportStore } from '@/stores/reportStore';
import { ChangeRecord, ClientRequest, WorkerFeedback, Concern } from '@/types';
import { Plus, AlertTriangle, MessageSquare, Users, AlertCircle } from 'lucide-react';

type TabType = 'changes' | 'requests' | 'feedback' | 'concerns';

export function ChangesTracking() {
  const [activeTab, setActiveTab] = useState<TabType>('changes');
  const { reports } = useReportStore();
  
  const todayReport = reports.find(report => 
    new Date(report.date).toDateString() === new Date().toDateString()
  );

  const tabs = [
    { id: 'changes', label: '変化記録', icon: AlertTriangle, count: todayReport?.changes.length || 0 },
    { id: 'requests', label: 'クライアント要望', icon: MessageSquare, count: todayReport?.clientRequests.length || 0 },
    { id: 'feedback', label: '職人フィードバック', icon: Users, count: todayReport?.workerFeedback.length || 0 },
    { id: 'concerns', label: '懸念事項', icon: AlertCircle, count: todayReport?.concerns.length || 0 },
  ];

  if (!todayReport) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">変化・要望記録</h2>
        <p className="text-gray-500 mb-6">まず今日の日報を作成してください</p>
        <Button>日報作成ページへ</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">変化・要望記録</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ja-JP')} - {todayReport.projectName}
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'changes' && <ChangeRecordsTab report={todayReport} />}
      {activeTab === 'requests' && <ClientRequestsTab report={todayReport} />}
      {activeTab === 'feedback' && <WorkerFeedbackTab report={todayReport} />}
      {activeTab === 'concerns' && <ConcernsTab report={todayReport} />}
    </div>
  );
}

function ChangeRecordsTab({ report }: { report: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>現場の変化記録</CardTitle>
        <CardDescription>
          些細な変化も含めて、現場で気づいた変化を記録してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {report.changes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              まだ変化が記録されていません
            </p>
          ) : (
            <div className="space-y-3">
              {report.changes.map((change: ChangeRecord) => (
                <div key={change.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      change.impact === '重要' ? 'bg-red-100 text-red-800' :
                      change.impact === '注意' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {change.category} - {change.impact}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(change.timestamp).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-2">{change.description}</p>
                  <p className="text-sm text-gray-600">報告者: {change.reportedBy}</p>
                </div>
              ))}
            </div>
          )}
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            新しい変化を記録
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientRequestsTab({ report }: { report: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>クライアント要望・フィードバック</CardTitle>
        <CardDescription>
          クライアントからの要望、変更依頼、不満などを記録してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {report.clientRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              まだクライアント要望が記録されていません
            </p>
          ) : (
            <div className="space-y-3">
              {report.clientRequests.map((request: ClientRequest) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white">
                        {request.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.priority === '高' ? 'bg-red-100 text-red-800' :
                        request.priority === '中' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === '対応済み' ? 'bg-green-100 text-green-800' :
                        request.status === '検討中' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(request.timestamp).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-2">{request.content}</p>
                  {request.response && (
                    <div className="bg-gray-50 p-3 rounded mt-2">
                      <p className="text-sm text-gray-700">対応: {request.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            新しい要望を記録
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkerFeedbackTab({ report }: { report: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>職人からのフィードバック</CardTitle>
        <CardDescription>
          作業者からの気づき、提案、困りごとなどを記録してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {report.workerFeedback.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              まだ職人フィードバックが記録されていません
            </p>
          ) : (
            <div className="space-y-3">
              {report.workerFeedback.map((feedback: WorkerFeedback) => (
                <div key={feedback.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        {feedback.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        feedback.priority === '高' ? 'bg-red-100 text-red-800' :
                        feedback.priority === '中' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {feedback.priority}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(feedback.timestamp).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-2">{feedback.content}</p>
                  <p className="text-sm text-gray-600">報告者: {feedback.workerName}</p>
                  {feedback.actionTaken && (
                    <div className="bg-gray-50 p-3 rounded mt-2">
                      <p className="text-sm text-gray-700">対応: {feedback.actionTaken}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            新しいフィードバックを記録
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ConcernsTab({ report }: { report: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>懸念事項</CardTitle>
        <CardDescription>
          安全面、品質面、スケジュールなどの懸念事項を記録してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {report.concerns.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              まだ懸念事項が記録されていません
            </p>
          ) : (
            <div className="space-y-3">
              {report.concerns.map((concern: Concern) => (
                <div key={concern.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {concern.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        concern.riskLevel === '緊急' ? 'bg-red-100 text-red-800' :
                        concern.riskLevel === '高' ? 'bg-orange-100 text-orange-800' :
                        concern.riskLevel === '中' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {concern.riskLevel}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        concern.status === '解決済み' ? 'bg-green-100 text-green-800' :
                        concern.status === '対応中' ? 'bg-blue-600 text-white' :
                        concern.status === '監視中' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {concern.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(concern.timestamp).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-2">{concern.description}</p>
                  <div className="bg-yellow-50 p-3 rounded mb-2">
                    <p className="text-sm text-yellow-800">想定される影響: {concern.potentialImpact}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded mb-2">
                    <p className="text-sm text-blue-800">推奨対応: {concern.recommendedAction}</p>
                  </div>
                  <p className="text-sm text-gray-600">報告者: {concern.reportedBy}</p>
                </div>
              ))}
            </div>
          )}
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            新しい懸念事項を記録
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}