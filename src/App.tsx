import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { 
  Plus, ArrowLeft, Save, Calendar, MapPin, User, Activity, Bug, Droplet, 
  Beaker, Clock, ShieldAlert, Droplets, Scissors, Leaf, CloudRain, Sprout, 
  FlaskConical, BugOff, SprayCan, TreePine, Image as ImageIcon, X, LogOut, Lock, Phone,
  Trash2, Recycle, Package, ScanLine, Loader2, Home, ClipboardList, AlertTriangle, Settings, ShieldCheck, Warehouse, HardHat, Camera,
  Mail, Building, Upload, CheckCircle, FileText, Map as MapIcon, Printer
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

// Types
interface IncidentReport {
  id: string;
  executor: string;
  lot: string;
  datetime: string;
  reportType: string;
  description: string;
  images: string[];
}

interface FarmLog {
  id: string;
  executor: string;
  stage: string;
  lot: string;
  datetime: string;
  task: string;
  pest: string;
  method: string;
  fertilizer: string;
  activeIngredient: string;
  dosage: string;
  quarantineTime: string;
  images?: string[];
  wasteType?: string;
  materialName?: string;
  materialQuantity?: string;
}

const USERS = [
  { phone: '0987654321', pin: '1234', name: 'Nguyễn Văn A' },
  { phone: '0123456789', pin: '1234', name: 'Trần Thị B' },
  { phone: '0999999999', pin: '0000', name: 'Quản trị viên' },
];

const STAGES = ['Trước Gieo Trồng', 'Phân hoá mầm hoa', 'Trước Thu Hoạch', 'Khác'];
const LOTS = ['Lô 1', 'Lô 2', 'Lô 3', 'Khác'];

interface TaskConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  requiresMaterials: boolean;
  defaultValues: {
    task: string;
    pest?: string;
    method?: string;
    fertilizer?: string;
    activeIngredient?: string;
    dosage?: string;
    quarantineTime?: string;
    wasteType?: string;
  };
}

import { Breadcrumb } from './components/Breadcrumb';

const PREDEFINED_TASKS: TaskConfig[] = [
  {
    id: 'rua_vuon',
    name: 'Rửa vườn',
    icon: Droplets,
    color: 'bg-blue-100 text-blue-600',
    requiresMaterials: true,
    defaultValues: { task: 'Rửa vườn', pest: 'Rêu', method: 'Champion', activeIngredient: 'Copper Hydroxide', dosage: '2kg / 1000 lít nước', quarantineTime: '7 Ngày' }
  },
  {
    id: 'cat_tia',
    name: 'Cắt tỉa cành',
    icon: Scissors,
    color: 'bg-gray-100 text-gray-600',
    requiresMaterials: false,
    defaultValues: { task: 'Cắt tỉa cành' }
  },
  {
    id: 'lam_co',
    name: 'Làm sạch cỏ',
    icon: Leaf,
    color: 'bg-green-100 text-green-600',
    requiresMaterials: false,
    defaultValues: { task: 'Làm sạch cỏ' }
  },
  {
    id: 'tuoi_nuoc',
    name: 'Tưới nước',
    icon: CloudRain,
    color: 'bg-cyan-100 text-cyan-600',
    requiresMaterials: false,
    defaultValues: { task: 'Tưới nước', dosage: '50lit/m2' }
  },
  {
    id: 'bon_phan_vi_sinh',
    name: 'Bón phân vi sinh',
    icon: Sprout,
    color: 'bg-lime-100 text-lime-600',
    requiresMaterials: true,
    defaultValues: { task: 'Bón phân vi sinh', fertilizer: 'Phân gà Nhật Bản' }
  },
  {
    id: 'bon_phan_lan',
    name: 'Bón phân Lân',
    icon: FlaskConical,
    color: 'bg-orange-100 text-orange-600',
    requiresMaterials: true,
    defaultValues: { task: 'Bón phân', fertilizer: 'Phân Lân Văn Điển', dosage: '2kg / 1 cây' }
  },
  {
    id: 'bon_phan_npk',
    name: 'Bón phân NPK',
    icon: FlaskConical,
    color: 'bg-amber-100 text-amber-600',
    requiresMaterials: true,
    defaultValues: { task: 'Bón phân', fertilizer: 'NPK 30-10-10', dosage: '1kg / cây' }
  },
  {
    id: 'phun_sau_ray_najat',
    name: 'Sâu Rầy (Najat)',
    icon: BugOff,
    color: 'bg-red-100 text-red-600',
    requiresMaterials: true,
    defaultValues: { task: 'Phun thuốc Sâu Rầy', pest: 'Sâu rầy', method: 'Najat 3.6', activeIngredient: 'Abamectin', dosage: '800ml/800L', quarantineTime: '7 Ngày' }
  },
  {
    id: 'phun_ray_xanh',
    name: 'Rầy xanh',
    icon: BugOff,
    color: 'bg-red-100 text-red-600',
    requiresMaterials: true,
    defaultValues: { task: 'Phun thuốc Sâu Rầy', pest: 'Rầy xanh', method: 'Bình Dân', activeIngredient: 'Abamectin', dosage: '800g/800L', quarantineTime: '7 Ngày' }
  },
  {
    id: 'phun_rep',
    name: 'Phun Rệp',
    icon: BugOff,
    color: 'bg-rose-100 text-rose-600',
    requiresMaterials: true,
    defaultValues: { task: 'Phun thuốc Sâu Rầy', pest: 'Rệp', method: 'Tado 4.0', activeIngredient: 'Picoxystrobin', dosage: '500ml / 600L' }
  },
  {
    id: 'phun_nhen_do',
    name: 'Phun Nhện đỏ',
    icon: SprayCan,
    color: 'bg-purple-100 text-purple-600',
    requiresMaterials: true,
    defaultValues: { task: 'Phun thuốc', pest: 'Nhện đỏ', method: 'Dipimai 150 EC', activeIngredient: 'Pyridaben', dosage: '2000ml / 800L nước', quarantineTime: '7 Ngày' }
  },
  {
    id: 'do_goc',
    name: 'Đổ gốc',
    icon: TreePine,
    color: 'bg-emerald-100 text-emerald-600',
    requiresMaterials: true,
    defaultValues: { task: 'Đổ gốc', method: 'Humic', activeIngredient: 'Axit Humic' }
  },
  {
    id: 'xu_ly_chat_thai',
    name: 'Xử lý chất thải',
    icon: Trash2,
    color: 'bg-stone-100 text-stone-600',
    requiresMaterials: false,
    defaultValues: { task: 'Xử lý chất thải', wasteType: 'Thu gom chất thải độc hại' }
  },
  {
    id: 'quan_ly_vat_tu',
    name: 'Quản lý vật tư',
    icon: Package,
    color: 'bg-indigo-100 text-indigo-600',
    requiresMaterials: false,
    defaultValues: { task: 'Quản lý vật tư' }
  },
  {
    id: 've_sinh_kho',
    name: 'Vệ sinh kho',
    icon: Warehouse,
    color: 'bg-teal-100 text-teal-600',
    requiresMaterials: false,
    defaultValues: { task: 'An toàn vệ sinh kho' }
  },
  {
    id: 'an_toan_lao_dong',
    name: 'An toàn lao động',
    icon: HardHat,
    color: 'bg-yellow-100 text-yellow-600',
    requiresMaterials: false,
    defaultValues: { task: 'An toàn lao động' }
  }
];

const TASKS = Array.from(new Set(PREDEFINED_TASKS.map(t => t.defaultValues.task)));

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<{phone?: string, email?: string, name: string, role?: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'diary' | 'report' | 'settings'>('diary');
  const [view, setView] = useState<'list' | 'add'>('list');
  const [selectedTaskConfig, setSelectedTaskConfig] = useState<TaskConfig | null>(null);
  const [tasksConfig, setTasksConfig] = useState(PREDEFINED_TASKS);
  const [taskCategories, setTaskCategories] = useState(TASK_CATEGORIES);
  const tasksList = Array.from(new Set(tasksConfig.map(t => t.defaultValues.task)));
  
  const [farmers, setFarmers] = useState<Farmer[]>([
    { id: '1', phone: '0901234567', pin: '123456', cccd: '001090123456', fullName: 'Nguyễn Văn A', birthYear: '1980', managedLot: 'Lô 1' },
    { id: '2', phone: '0987654321', pin: '654321', cccd: '001090654321', fullName: 'Trần Thị B', birthYear: '1985', managedLot: 'Lô 2' },
  ]);
  const [zones, setZones] = useState<PlantingZone[]>([
    { id: 'z1', cropType: 'Sầu riêng', name: 'Khu vực Sầu riêng 1', lots: MOCK_EXTRACTED_LOTS }
  ]);

  const [logs, setLogs] = useState<FarmLog[]>([
    {
      id: '1',
      executor: 'Nguyen Van',
      stage: 'Trước Gieo Trồng',
      lot: 'Lô 1',
      datetime: '2026-02-07T12:00',
      task: 'Rửa vườn',
      pest: 'Rêu',
      method: 'Champion',
      fertilizer: '',
      activeIngredient: 'Copper Hydroxide',
      dosage: '2kg / 1000 lít nước',
      quarantineTime: '7 Ngày'
    },
    {
      id: '2',
      executor: 'Nguyen Van',
      stage: 'Trước Thu Hoạch',
      lot: 'Lô 2',
      datetime: '2027-02-07T12:00',
      task: 'Cắt tỉa cành',
      pest: '',
      method: '',
      fertilizer: '',
      activeIngredient: '',
      dosage: '',
      quarantineTime: ''
    },
    {
      id: '3',
      executor: 'Nguyen Van',
      stage: 'Phân hoá mầm hoa',
      lot: 'Lô 1',
      datetime: '2032-02-07T12:00',
      task: 'Bón phân',
      pest: '',
      method: '',
      fertilizer: 'Phân Lân Văn Điển',
      activeIngredient: '',
      dosage: '2kg / 1 cây',
      quarantineTime: ''
    }
  ]);

  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([
    {
      id: '1',
      executor: 'Nguyễn Văn A',
      lot: 'Lô 1',
      datetime: '2026-03-20T08:30',
      reportType: 'Sâu bệnh',
      description: 'Phát hiện rệp sáp trên lá non',
      images: []
    }
  ]);

  const handleAddLog = (log: FarmLog) => {
    setLogs([log, ...logs]);
    setView('list');
  };

  const handleSelectTask = (taskConfig: TaskConfig | null) => {
    setSelectedTaskConfig(taskConfig);
    setView('add');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingScreen onLoginClick={() => navigate('/login')} onRegisterClick={() => navigate('/register')} onHTXLoginClick={() => navigate('/htx_login')} />} />
      <Route path="/htx_login" element={<HTXLoginScreen onBack={() => navigate('/')} onLoginSuccess={(user) => { setCurrentUser(user); navigate('/admin'); }} />} />
      <Route path="/register" element={<RegisterScreen onBack={() => navigate('/')} onRegisterSuccess={() => navigate('/onboard')} onLoginClick={() => navigate('/login')} />} />
      <Route path="/onboard" element={<OnboardHTXScreen onComplete={(htxName) => {
        setCurrentUser({ name: htxName, role: 'admin' });
        navigate('/admin');
      }} />} />
      <Route path="/admin" element={<AdminDashboardScreen currentUser={currentUser!} onLogout={() => { setCurrentUser(null); navigate('/'); }} onNavigate={(screen) => {
        const routes: Record<string, string> = {
          'admin_land': '/admin/land',
          'admin_farmer': '/admin/farmer',
          'admin_report': '/admin/report',
          'admin_material': '/admin/material',
          'admin_process': '/admin/process'
        };
        navigate(routes[screen] || '/');
      }} farmers={farmers} zones={zones} logs={logs} />} />
      <Route path="/admin/land" element={<LandManagementScreen onBack={() => navigate('/admin')} zones={zones} setZones={setZones} />} />
      <Route path="/admin/farmer" element={<FarmerManagementScreen onBack={() => navigate('/admin')} farmers={farmers} setFarmers={setFarmers} zones={zones} />} />
      <Route path="/admin/report" element={<ReportManagementScreen onBack={() => navigate('/admin')} logs={logs} incidentReports={incidentReports} />} />
      <Route path="/admin/report/log/:id" element={<LogDetailScreen onBack={() => navigate('/admin/report')} logs={logs} />} />
      <Route path="/admin/report/incident/:id" element={<IncidentDetailScreen onBack={() => navigate('/admin/report')} incidentReports={incidentReports} />} />
      <Route path="/admin/material" element={<MaterialManagementScreen onBack={() => navigate('/admin')} />} />
      <Route path="/admin/process" element={<ProcessManagementScreen onBack={() => navigate('/admin')} tasksConfig={tasksConfig} setTasksConfig={setTasksConfig} taskCategories={taskCategories} setTaskCategories={setTaskCategories} />} />
      <Route path="/login" element={<LoginScreen onLogin={(user) => { setCurrentUser(user); navigate('/app'); }} onBack={() => navigate('/')} />} />
      <Route path="/app" element={
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
          {/* Header */}
          <header className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeTab === 'diary' && view === 'add' && (
                <button onClick={() => setView('list')} className="p-1 -ml-1 hover:bg-emerald-700 rounded-full">
                  <ArrowLeft size={24} />
                </button>
              )}
              <h1 className="text-xl font-bold">
                {activeTab === 'diary' ? 'Nhật Ký Canh Tác' : activeTab === 'report' ? 'Báo Cáo Sự Cố' : 'Cài Đặt'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-emerald-700 px-3 py-1 rounded-full">{currentUser?.name}</span>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 max-w-md mx-auto pb-24">
            {activeTab === 'diary' && (
              view === 'list' ? (
                <>
                  <div className="mb-6">
                    <TaskGrid onSelectTask={handleSelectTask} tasksConfig={tasksConfig} taskCategories={taskCategories} />
                  </div>
                  
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Nhật ký gần đây</h2>
                  </div>
                  <LogList logs={logs} />
                </>
              ) : (
                <AddLogForm 
                  initialData={selectedTaskConfig} 
                  currentUser={currentUser}
                  onSave={handleAddLog} 
                  onCancel={() => setView('list')} 
                  tasksConfig={tasksConfig}
                  tasksList={tasksList}
                />
              )
            )}
            {activeTab === 'report' && <ReportScreen currentUser={currentUser!} onAddReport={(report) => setIncidentReports([report, ...incidentReports])} />}
            {activeTab === 'settings' && <SettingsScreen currentUser={currentUser!} onLogout={() => { setCurrentUser(null); navigate('/'); }} />}
          </main>

          {/* FAB for Add */}
          {activeTab === 'diary' && view === 'list' && (
            <button
              onClick={() => handleSelectTask(null)}
              className="fixed bottom-20 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-full shadow-lg hover:bg-emerald-700 active:scale-95 transition-transform flex items-center gap-2 font-medium z-20"
            >
              <Plus size={24} />
              Thêm nhật ký
            </button>
          )}

          {/* Bottom Tab Bar */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center pb-safe z-30">
            <button 
              onClick={() => { setActiveTab('diary'); setView('list'); }}
              className={`flex flex-col items-center py-3 px-6 gap-1 ${activeTab === 'diary' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ClipboardList size={24} />
              <span className="text-xs font-medium">Nhật ký</span>
            </button>
            <button 
              onClick={() => { setActiveTab('report'); setView('list'); }}
              className={`flex flex-col items-center py-3 px-6 gap-1 ${activeTab === 'report' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <AlertTriangle size={24} />
              <span className="text-xs font-medium">Sự cố</span>
            </button>
            <button 
              onClick={() => { setActiveTab('settings'); setView('list'); }}
              className={`flex flex-col items-center py-3 px-6 gap-1 ${activeTab === 'settings' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Settings size={24} />
              <span className="text-xs font-medium">Cài đặt</span>
            </button>
          </nav>
        </div>
      } />
    </Routes>
  );
}

function LoginScreen({ onLogin, onBack }: { onLogin: (user: {phone: string, name: string}) => void, onBack: () => void }) {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.phone === phone && u.pin === pin);
    if (user) {
      onLogin({ phone: user.phone, name: user.name });
    } else {
      setError('Số điện thoại hoặc mã PIN không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium hidden sm:inline">Quay lại</span>
      </button>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <Sprout size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Nông Trại Xanh</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Đăng nhập để ghi nhật ký canh tác</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã PIN</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập mã PIN 4 số"
                maxLength={4}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors mt-6"
          >
            Đăng nhập
          </button>
        </form>
        
        <div className="mt-6 text-xs text-center text-gray-400">
          <p>Tài khoản dùng thử:</p>
          <p>0987654321 / 1234</p>
        </div>
      </div>
    </div>
  );
}

const TASK_CATEGORIES = [
  {
    id: 'cham_soc',
    name: 'Chăm sóc cơ bản',
    taskIds: ['tuoi_nuoc', 'lam_co', 'cat_tia', 'rua_vuon']
  },
  {
    id: 'dinh_duong',
    name: 'Phân bón & Dinh dưỡng',
    taskIds: ['bon_phan_vi_sinh', 'bon_phan_lan', 'bon_phan_npk', 'do_goc']
  },
  {
    id: 'phong_tru',
    name: 'Phòng trừ sâu bệnh',
    taskIds: ['phun_sau_ray_najat', 'phun_ray_xanh', 'phun_rep', 'phun_nhen_do']
  },
  {
    id: 'quan_ly',
    name: 'Quản lý & Vệ sinh bảo hộ',
    taskIds: ['xu_ly_chat_thai', 'quan_ly_vat_tu', 've_sinh_kho', 'an_toan_lao_dong']
  }
];

function TaskGrid({ onSelectTask, tasksConfig, taskCategories }: { onSelectTask: (task: TaskConfig | null) => void, tasksConfig: TaskConfig[], taskCategories: typeof TASK_CATEGORIES }) {
  return (
    <div className="space-y-5">
      {taskCategories.map(category => (
        <div key={category.id}>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{category.name}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {category.taskIds.map(taskId => {
              const task = tasksConfig.find(t => t.id === taskId);
              if (!task) return null;
              const Icon = task.icon;
              return (
                <button
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="flex flex-col items-center justify-start gap-2 p-2 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <div className={`p-3 rounded-full ${task.color}`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] sm:text-xs text-center font-medium leading-tight text-gray-700">{task.name}</span>
                </button>
              );
            })}
            {category.id === 'quan_ly' && (
              <button
                onClick={() => onSelectTask(null)}
                className="flex flex-col items-center justify-start gap-2 p-2 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                  <Plus size={24} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] sm:text-xs text-center font-medium leading-tight text-gray-700">Khác</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function LogList({ logs }: { logs: FarmLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>Chưa có nhật ký nào.</p>
        <p>Bấm dấu + để thêm mới.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map(log => (
        <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-emerald-800">{log.task || 'Không tên công việc'}</h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">
              {log.stage}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>{new Date(log.datetime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-400" />
              <span>{log.lot}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <User size={14} className="text-gray-400" />
              <span>{log.executor}</span>
            </div>
          </div>

          {(log.materialName || log.materialQuantity || log.wasteType || log.pest || log.method || log.fertilizer || log.activeIngredient || log.dosage || log.quarantineTime) && (
            <div className="mt-3 pt-3 border-t border-gray-50 space-y-1.5 text-sm">
              {log.materialName && <p><span className="text-gray-500">Vật tư:</span> {log.materialName}</p>}
              {log.activeIngredient && log.task === 'Quản lý vật tư' && <p><span className="text-gray-500">Hoạt chất:</span> {log.activeIngredient}</p>}
              {log.materialQuantity && <p><span className="text-gray-500">Số lượng:</span> {log.materialQuantity}</p>}
              {log.wasteType && <p><span className="text-gray-500">Loại xử lý:</span> {log.wasteType}</p>}
              {log.pest && <p><span className="text-gray-500">Đối tượng:</span> {log.pest}</p>}
              {log.method && <p><span className="text-gray-500">Biện pháp:</span> {log.method}</p>}
              {log.fertilizer && <p><span className="text-gray-500">Phân bón:</span> {log.fertilizer}</p>}
              {log.activeIngredient && log.task !== 'Quản lý vật tư' && <p><span className="text-gray-500">Hoạt chất:</span> {log.activeIngredient}</p>}
              {log.dosage && <p><span className="text-gray-500">Liều lượng:</span> {log.dosage}</p>}
              {log.quarantineTime && (
                <p className="text-amber-600 font-medium flex items-center gap-1 mt-1">
                  <ShieldAlert size={14} />
                  Cách ly: {log.quarantineTime}
                </p>
              )}
            </div>
          )}

          {log.images && log.images.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-50">
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                {log.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Log" className="h-20 w-20 object-cover rounded-lg border border-gray-200 snap-start shrink-0" />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AddLogForm({ initialData, currentUser, onSave, onCancel, tasksConfig, tasksList }: { initialData: TaskConfig | null, currentUser: {name: string}, onSave: (log: FarmLog) => void, onCancel: () => void, tasksConfig: TaskConfig[], tasksList: string[] }) {
  const defaultTask = initialData?.defaultValues?.task || '';
  const isTaskInList = tasksList.includes(defaultTask);
  
  const [isCustomTask, setIsCustomTask] = useState(!initialData || !isTaskInList);
  const [requiresMaterials, setRequiresMaterials] = useState(initialData ? initialData.requiresMaterials : true);
  const [isScanning, setIsScanning] = useState(false);
  
  const [formData, setFormData] = useState<Partial<FarmLog>>({
    executor: currentUser.name,
    stage: STAGES[0],
    lot: LOTS[0],
    datetime: new Date().toISOString().slice(0, 16),
    task: defaultTask || tasksList[0],
    pest: initialData?.defaultValues?.pest || '',
    method: initialData?.defaultValues?.method || '',
    fertilizer: initialData?.defaultValues?.fertilizer || '',
    activeIngredient: initialData?.defaultValues?.activeIngredient || '',
    dosage: initialData?.defaultValues?.dosage || '',
    quarantineTime: initialData?.defaultValues?.quarantineTime || '',
    wasteType: initialData?.defaultValues?.wasteType || 'Thu gom chất thải độc hại',
    materialName: '',
    materialQuantity: '',
    images: []
  });

  const handleScanMaterial = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsScanning(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise((resolve) => {
        reader.onload = resolve;
      });
      const base64Data = (reader.result as string).split(',')[1];
      const mimeType = file.type;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: 'Extract the material name (tên vật tư/thuốc/phân bón), active ingredient (hoạt chất), and quantity/volume (dung tích/khối lượng) from this image. Return JSON.',
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              materialName: { type: Type.STRING, description: 'Tên vật tư/thuốc/phân bón' },
              activeIngredient: { type: Type.STRING, description: 'Hoạt chất chính' },
              quantity: { type: Type.STRING, description: 'Dung tích hoặc khối lượng' },
            },
          },
        },
      });

      const result = JSON.parse(response.text || '{}');
      setFormData(prev => ({
        ...prev,
        materialName: result.materialName || prev.materialName,
        activeIngredient: result.activeIngredient || prev.activeIngredient,
        materialQuantity: result.quantity || prev.materialQuantity,
        images: [...(prev.images || []), URL.createObjectURL(file)]
      }));
    } catch (error) {
      console.error('Error scanning material:', error);
      alert('Không thể nhận diện hình ảnh. Vui lòng nhập thủ công.');
    } finally {
      setIsScanning(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData, id: Date.now().toString() };
    if (finalData.task !== 'Xử lý chất thải') {
      delete finalData.wasteType;
    }
    if (finalData.task !== 'Quản lý vật tư') {
      delete finalData.materialName;
      delete finalData.materialQuantity;
    } else {
      delete finalData.pest;
      delete finalData.method;
      delete finalData.fertilizer;
      delete finalData.dosage;
      delete finalData.quarantineTime;
    }
    onSave(finalData as FarmLog);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Thông tin cơ bản */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-semibold text-emerald-800 border-b pb-2 flex items-center gap-2">
          <Activity size={18} /> Thông tin chung
        </h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Người thực hiện</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="executor"
              required
              value={formData.executor}
              onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập tên người thực hiện"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giai đoạn</label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lô canh tác</label>
            <select
              name="lot"
              value={formData.lot}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {LOTS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className="text-gray-400" />
            </div>
            <input
              type="datetime-local"
              name="datetime"
              required
              value={formData.datetime}
              onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung công việc</label>
          <select
            value={isCustomTask ? 'Khác' : formData.task}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'Khác') {
                setIsCustomTask(true);
                setRequiresMaterials(true);
                setFormData(prev => ({ ...prev, task: '' }));
              } else {
                setIsCustomTask(false);
                const predefined = tasksConfig.find(t => t.defaultValues.task === val);
                setRequiresMaterials(predefined ? predefined.requiresMaterials : true);
                setFormData(prev => ({ ...prev, task: val }));
              }
            }}
            className={`w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white ${isCustomTask ? 'mb-2' : ''}`}
          >
            {tasksList.map(t => <option key={t} value={t}>{t}</option>)}
            <option value="Khác">Khác...</option>
          </select>
          
          {isCustomTask && (
            <textarea
              name="task"
              required
              value={formData.task}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập nội dung công việc khác..."
            ></textarea>
          )}

          {formData.task === 'Xử lý chất thải' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại xử lý</label>
              <select
                name="wasteType"
                value={formData.wasteType}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Thu gom chất thải độc hại">Thu gom chất thải độc hại</option>
                <option value="Xử lý phụ phẩm">Xử lý phụ phẩm</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh hoạt động / Kho vật tư</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {formData.images?.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }))}
                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
              <ImageIcon size={24} className="mb-1 text-gray-400" />
              <span className="text-xs font-medium">Thêm ảnh</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files) {
                    const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
                    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...filesArray] }));
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Quản lý vật tư */}
      {formData.task === 'Quản lý vật tư' && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-semibold text-indigo-800 flex items-center gap-2">
              <Package size={18} /> Nhập kho vật tư
            </h2>
            <label className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer hover:bg-indigo-100 transition-colors">
              {isScanning ? <Loader2 size={16} className="animate-spin" /> : <ScanLine size={16} />}
              {isScanning ? 'Đang quét...' : 'Quét nhãn'}
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={handleScanMaterial}
                disabled={isScanning}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên vật tư / Thuốc / Phân bón</label>
            <input
              type="text"
              name="materialName"
              required
              value={formData.materialName}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập hoặc quét ảnh để tự điền..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt chất chính</label>
            <input
              type="text"
              name="activeIngredient"
              value={formData.activeIngredient}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ví dụ: Abamectin..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng / Dung tích</label>
            <input
              type="text"
              name="materialQuantity"
              required
              value={formData.materialQuantity}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ví dụ: 10 chai, 500ml..."
            />
          </div>
        </div>
      )}

      {/* Chi tiết vật tư / Thuốc */}
      {requiresMaterials && formData.task !== 'Quản lý vật tư' && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-emerald-800 border-b pb-2 flex items-center gap-2">
            <Beaker size={18} /> Vật tư & Phòng trừ
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng gây hại</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Bug size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="pest"
                value={formData.pest}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ví dụ: Rêu, Sâu rầy, Rệp..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên biện pháp / Thuốc</label>
            <input
              type="text"
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ví dụ: Champion, Najat 3.6..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phân bón</label>
            <input
              type="text"
              name="fertilizer"
              value={formData.fertilizer}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ví dụ: Phân gà, NPK 30-10-10..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt chất</label>
            <input
              type="text"
              name="activeIngredient"
              value={formData.activeIngredient}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ví dụ: Copper Hydroxide, Abamectin..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Liều lượng</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Droplet size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="VD: 2kg/1000L"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian cách ly</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldAlert size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="quarantineTime"
                  value={formData.quarantineTime}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="VD: 7 Ngày"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 pb-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="flex-[2] bg-emerald-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm"
        >
          <Save size={20} /> Lưu Nhật Ký
        </button>
      </div>
    </form>
  );
}

function ReportScreen({ currentUser, onAddReport }: { currentUser: {name: string}, onAddReport: (report: IncidentReport) => void }) {
  const [reportType, setReportType] = useState('Sâu bệnh');
  const [description, setDescription] = useState('');
  const [lot, setLot] = useState(LOTS[0]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onAddReport({
        id: Date.now().toString(),
        executor: currentUser.name,
        lot,
        datetime: new Date().toISOString(),
        reportType,
        description,
        images
      });
      alert('Báo cáo sự cố đã được gửi thành công!');
      setIsSubmitting(false);
      setDescription('');
      setImages([]);
    }, 1000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={20} />
          Báo cáo sự cố mới
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại sự cố</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="Sâu bệnh">Sâu bệnh bùng phát</option>
              <option value="Thời tiết">Thiệt hại do thời tiết</option>
              <option value="Thiết bị">Hỏng hóc thiết bị/hệ thống tưới</option>
              <option value="Khác">Vấn đề khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí (Lô)</label>
            <select
              value={lot}
              onChange={(e) => setLot(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {LOTS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Mô tả rõ tình trạng sự cố..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh hiện trường</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                <Camera size={24} className="mb-1 text-gray-400" />
                <span className="text-xs font-medium">Chụp ảnh</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  multiple 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) {
                      const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
                      setImages(prev => [...prev, ...filesArray]);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-amber-600 active:bg-amber-700 transition-colors shadow-sm disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <AlertTriangle size={20} />}
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </button>
        </form>
      </div>
    </div>
  );
}

function SettingsScreen({ currentUser, onLogout }: { currentUser: {name: string}, onLogout: () => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold">
          {currentUser.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-800">{currentUser.name}</h2>
          <p className="text-sm text-gray-500">Nông dân hợp tác xã</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Sprout size={18} className="text-emerald-600" />
            Thông tin trang trại
          </h3>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tên HTX:</span>
            <span className="font-medium text-gray-800">HTX Nông Nghiệp Xanh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Địa chỉ:</span>
            <span className="font-medium text-gray-800 text-right">Xã Phước Thuận, H. Xuyên Mộc</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tổng diện tích:</span>
            <span className="font-medium text-gray-800">5.2 hecta</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Cây trồng chính:</span>
            <span className="font-medium text-gray-800">Sầu riêng, Bưởi</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <MapPin size={18} className="text-emerald-600" />
            Bản đồ lô canh tác
          </h3>
        </div>
        <div className="p-4">
          <div className="aspect-video bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <div className="grid grid-cols-2 gap-2 w-full h-full p-4 z-10">
              <div className="bg-emerald-200/80 rounded border border-emerald-400 flex items-center justify-center text-emerald-800 font-bold text-sm shadow-sm">Lô 1</div>
              <div className="bg-emerald-300/80 rounded border border-emerald-500 flex items-center justify-center text-emerald-900 font-bold text-sm shadow-sm">Lô 2</div>
              <div className="bg-emerald-100/80 rounded border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-sm shadow-sm col-span-2">Lô 3</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">Bản đồ được cấu hình bởi ban quản lý HTX</p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full bg-white text-red-600 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-50 active:bg-red-100 transition-colors shadow-sm border border-red-100"
      >
        <LogOut size={20} /> Đăng xuất tài khoản
      </button>
    </div>
  );
}

function LandingScreen({ onLoginClick, onRegisterClick, onHTXLoginClick }: { onLoginClick: () => void, onRegisterClick: () => void, onHTXLoginClick: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sprout size={28} />
            <span className="text-xl font-bold">Nông Trại Xanh</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={onLoginClick}
              className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors text-sm sm:text-base px-2"
            >
              Đăng nhập
            </button>
            <button 
              onClick={onRegisterClick}
              className="bg-emerald-600 text-white px-4 sm:px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition-colors text-sm sm:text-base"
            >
              Đăng ký HTX
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="bg-emerald-600 text-white py-12 sm:py-20 lg:py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
              Nền tảng Quản lý Nông nghiệp <br className="hidden sm:block" />
              <span className="text-emerald-200">Thông minh & Chuẩn VietGAP</span>
            </h1>
            <p className="text-base sm:text-xl text-emerald-50 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              Giải pháp toàn diện giúp Hợp tác xã và Nông dân số hoá nhật ký canh tác, quản lý vật tư chuẩn VietGAP, và minh bạch nguồn gốc nông sản.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0 w-full sm:w-auto">
              <button 
                onClick={onLoginClick}
                className="w-full sm:w-auto bg-white text-emerald-600 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-emerald-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <User size={20} />
                Đăng nhập cho Nông dân
              </button>
              <button 
                onClick={onRegisterClick}
                className="w-full sm:w-auto bg-emerald-700 text-white border border-emerald-500 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-emerald-800 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Building size={20} />
                Đăng ký Hợp tác xã
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-20 px-4 bg-white flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Tính năng nổi bật</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base px-2">Hệ sinh thái công cụ quản lý trang trại toàn diện, kết nối chặt chẽ giữa Ban quản lý HTX và Nông dân.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <ClipboardList size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Nhật ký Canh tác Số</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Nông dân dễ dàng ghi chép hoạt động bón phân, phun thuốc, thu hoạch ngay trên điện thoại. Dữ liệu được đồng bộ theo thời gian thực.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Package size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Quản lý Vật tư VietGAP</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  HTX kiểm soát chặt chẽ danh mục phân bón, thuốc BVTV. Đảm bảo nông dân chỉ sử dụng các vật tư đạt chuẩn an toàn VietGAP.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <MapPin size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Bản đồ Lô đất AI</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Tự động trích xuất tọa độ VN-2000 từ sổ đỏ bằng AI, vẽ bản đồ phân lô trực quan giúp HTX quản lý diện tích canh tác chính xác.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-10 text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-300">
          <Sprout size={24} />
          <span className="text-xl font-bold">Nông Trại Xanh</span>
        </div>
        <p className="mb-6 text-sm sm:text-base">© 2026 Nông Trại Xanh. Nền tảng nông nghiệp số.</p>
        <button 
          onClick={onHTXLoginClick}
          className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors text-sm sm:text-base bg-gray-800 px-6 py-2.5 rounded-full"
        >
          Đăng nhập dành cho Ban quản lý HTX
        </button>
      </footer>
    </div>
  );
}

function RegisterScreen({ onBack, onRegisterSuccess, onLoginClick }: { onBack: () => void, onRegisterSuccess: () => void, onLoginClick: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    onRegisterSuccess();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium hidden sm:inline">Trang chủ</span>
      </button>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <Building size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Đăng ký Hợp tác xã</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Tạo tài khoản quản lý HTX của bạn</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập địa chỉ email"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Tạo mật khẩu"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors mt-6"
          >
            Đăng ký bằng Email
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          <button
            onClick={onRegisterSuccess}
            className="mt-6 w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Đăng ký bằng Google
          </button>
        </div>
        
        <div className="mt-8 text-sm text-center text-gray-600">
          Đã có tài khoản?{' '}
          <button onClick={onLoginClick} className="text-emerald-600 font-medium hover:underline">
            Đăng nhập HTX
          </button>
        </div>
      </div>
    </div>
  );
}

function HTXLoginScreen({ onBack, onLoginSuccess }: { onBack: () => void, onLoginSuccess: (user: {name: string, role: string}) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onLoginSuccess({ name: 'HTX Nông Nghiệp Xanh', role: 'admin' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium hidden sm:inline">Trang chủ</span>
      </button>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <Building size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Đăng nhập HTX</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Quản lý hoạt động hợp tác xã</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập địa chỉ email"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors mt-6"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

function OnboardHTXScreen({ onComplete }: { onComplete: (htxName: string) => void }) {
  const [htxName, setHtxName] = useState('');
  const [address, setAddress] = useState('');
  const [representative, setRepresentative] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(htxName || 'HTX Mới');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thiết lập Hợp tác xã</h1>
          <p className="text-gray-500 text-sm">Vui lòng cung cấp thông tin để hoàn tất đăng ký</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1. Tên Hợp tác xã <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={htxName}
              onChange={e => setHtxName(e.target.value)}
              className="w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="VD: HTX Nông Nghiệp Xanh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. Địa chỉ HTX <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập địa chỉ đầy đủ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">3. Người đại diện <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={representative}
              onChange={e => setRepresentative(e.target.value)}
              className="w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Họ và tên người đại diện pháp luật"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">4. Giấy chứng nhận đăng ký HTX <span className="text-red-500">*</span></label>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-emerald-400 cursor-pointer transition-colors">
              <Upload size={32} className="mb-2 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700 mb-1">Tải lên tài liệu</span>
              <span className="text-xs text-gray-400">Hỗ trợ PDF, JPG, PNG (Tối đa 5MB)</span>
              <input 
                type="file" 
                required
                accept=".pdf,image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
              />
            </label>
            {fileName && (
              <div className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                <CheckCircle size={16} /> Đã chọn: {fileName}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors mt-8 shadow-sm"
          >
            Hoàn tất thiết lập
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboardScreen({ currentUser, onLogout, onNavigate, farmers, zones, logs }: { currentUser: {name: string}, onLogout: () => void, onNavigate: (screen: 'landing' | 'register' | 'onboard' | 'admin' | 'admin_land' | 'admin_farmer' | 'admin_report' | 'admin_material' | 'admin_process' | 'login' | 'app') => void, farmers: Farmer[], zones: PlantingZone[], logs: FarmLog[] }) {
  const totalLots = zones.reduce((acc, zone) => acc + zone.lots.length, 0);
  const activeTasks = logs.filter(log => new Date(log.datetime) >= new Date(new Date().setDate(new Date().getDate() - 7))).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building size={24} />
          <h1 className="text-xl font-bold">Quản lý HTX</h1>
        </div>
        <button onClick={onLogout} className="p-2 hover:bg-emerald-800 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </header>
      
      <main className="p-6 max-w-4xl mx-auto">
        <Breadcrumb />
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Onboard thành công!</h2>
          <p className="text-gray-600">Chào mừng bạn đến với hệ thống quản lý của <strong>{currentUser.name}</strong>.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <User size={24} className="text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-gray-800">{farmers.length}</span>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Nông dân</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <MapPin size={24} className="text-amber-500 mb-2" />
            <span className="text-2xl font-bold text-gray-800">{totalLots}</span>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Lô đất</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <ClipboardList size={24} className="text-purple-500 mb-2" />
            <span className="text-2xl font-bold text-gray-800">{logs.length}</span>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Nhật ký</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <Activity size={24} className="text-emerald-500 mb-2" />
            <span className="text-2xl font-bold text-gray-800">{activeTasks}</span>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Hoạt động (7 ngày)</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div onClick={() => onNavigate('admin_process')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <Settings size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Quản lý Quy trình</h3>
            <p className="text-sm text-gray-500">Cấu hình các bước nhật ký canh tác cho nông dân.</p>
          </div>
          <div onClick={() => onNavigate('admin_farmer')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <User size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Quản lý Nông dân</h3>
            <p className="text-sm text-gray-500">Thêm, sửa, xóa tài khoản nông dân và phân công lô đất.</p>
          </div>
          <div onClick={() => onNavigate('admin_land')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Quản lý Mã vùng trồng</h3>
            <p className="text-sm text-gray-500">Thiết lập bản đồ, chia lô và theo dõi trạng thái canh tác.</p>
          </div>
          <div onClick={() => onNavigate('admin_report')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Báo cáo tổng hợp</h3>
            <p className="text-sm text-gray-500">Xem thống kê nhật ký canh tác và sự cố từ tất cả nông dân.</p>
          </div>
          <div onClick={() => onNavigate('admin_material')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-lg flex items-center justify-center mb-4">
              <Package size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Quản lý Vật tư</h3>
            <p className="text-sm text-gray-500">Theo dõi kho phân bón, thuốc trừ sâu và vật tư nông nghiệp.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

interface LandLot {
  id: string;
  name: string;
  area: number;
  coordinates: string;
  center: { x: number, y: number };
}

interface PlantingZone {
  id: string;
  cropType: string;
  name: string;
  lots: LandLot[];
}

const MOCK_EXTRACTED_LOTS: LandLot[] = [
  { id: 'l1', name: 'Lô 1', area: 1.2, coordinates: '10,10 90,10 90,60 10,60', center: {x: 50, y: 35} },
  { id: 'l2', name: 'Lô 2', area: 0.8, coordinates: '100,10 180,10 180,60 100,60', center: {x: 140, y: 35} },
  { id: 'l3', name: 'Lô 3', area: 1.5, coordinates: '10,70 180,70 180,140 10,140', center: {x: 95, y: 105} },
];

interface Farmer {
  id: string;
  phone: string;
  pin: string;
  cccd: string;
  fullName: string;
  birthYear: string;
  managedLot: string;
}

function FarmerManagementScreen({ onBack, farmers, setFarmers, zones }: { onBack: () => void, farmers: Farmer[], setFarmers: (f: Farmer[]) => void, zones: PlantingZone[] }) {
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [newFarmer, setNewFarmer] = useState<Partial<Farmer>>({});
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');

  const handleSaveFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFarmer.phone && newFarmer.fullName) {
      if (view === 'edit') {
        setFarmers(farmers.map(f => f.id === newFarmer.id ? newFarmer as Farmer : f));
      } else {
        setFarmers([...farmers, { ...newFarmer, id: Date.now().toString() } as Farmer]);
      }
      setView('list');
      setNewFarmer({});
      setSelectedZoneId('');
    }
  };

  const handleEdit = (farmer: Farmer) => {
    setNewFarmer(farmer);
    // Find the zone that contains this lot
    const zone = zones.find(z => z.lots.some(l => l.name === farmer.managedLot));
    setSelectedZoneId(zone ? zone.id : '');
    setView('edit');
  };

  const handleCancel = () => {
    setView('list');
    setNewFarmer({});
    setSelectedZoneId('');
  };

  const selectedZone = zones.find(z => z.id === selectedZoneId);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button onClick={view === 'list' ? onBack : () => setView('list')} className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Quản lý Nông dân</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        {view === 'list' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Danh sách Nông dân</h2>
              <button onClick={() => setView('add')} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <Plus size={20} /> Thêm mới
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                      <th className="p-4 font-medium whitespace-nowrap">Họ và tên</th>
                      <th className="p-4 font-medium whitespace-nowrap">SĐT</th>
                      <th className="p-4 font-medium whitespace-nowrap">CCCD</th>
                      <th className="p-4 font-medium whitespace-nowrap">Năm sinh</th>
                      <th className="p-4 font-medium whitespace-nowrap">Lô quản lý</th>
                      <th className="p-4 font-medium text-right whitespace-nowrap">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {farmers.map(farmer => (
                      <tr key={farmer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{farmer.fullName}</td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">{farmer.phone}</td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">{farmer.cccd}</td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">{farmer.birthYear}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">{farmer.managedLot}</span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button className="text-blue-500 hover:text-blue-700 p-2 mr-2" onClick={() => handleEdit(farmer)}>
                            <Settings size={18} />
                          </button>
                          <button className="text-red-500 hover:text-red-700 p-2" onClick={() => setFarmers(farmers.filter(f => f.id !== farmer.id))}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {farmers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có nông dân nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{view === 'edit' ? 'Sửa thông tin Nông dân' : 'Thêm Nông dân mới'}</h2>
            <form onSubmit={handleSaveFarmer} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input type="text" required value={newFarmer.fullName || ''} onChange={e => setNewFarmer({...newFarmer, fullName: e.target.value})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="VD: Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input type="tel" required value={newFarmer.phone || ''} onChange={e => setNewFarmer({...newFarmer, phone: e.target.value})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="SĐT đăng nhập" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã PIN (6 số) <span className="text-red-500">*</span></label>
                  <input type="text" required pattern="\d{6}" value={newFarmer.pin || ''} onChange={e => setNewFarmer({...newFarmer, pin: e.target.value})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="123456" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số CCCD</label>
                  <input type="text" value={newFarmer.cccd || ''} onChange={e => setNewFarmer({...newFarmer, cccd: e.target.value})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Nhập CCCD" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Năm sinh</label>
                  <input type="number" value={newFarmer.birthYear || ''} onChange={e => setNewFarmer({...newFarmer, birthYear: e.target.value})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="VD: 1980" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vùng trồng</label>
                  <select 
                    value={selectedZoneId} 
                    onChange={e => {
                      setSelectedZoneId(e.target.value);
                      setNewFarmer({...newFarmer, managedLot: ''}); // Reset lot when zone changes
                    }} 
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="">Chọn vùng trồng</option>
                    {zones.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lô đất quản lý</label>
                  <select 
                    value={newFarmer.managedLot || ''} 
                    onChange={e => setNewFarmer({...newFarmer, managedLot: e.target.value})} 
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    disabled={!selectedZoneId}
                  >
                    <option value="">Chọn lô đất</option>
                    {selectedZone?.lots.map(lot => (
                      <option key={lot.id} value={lot.name}>{lot.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={handleCancel} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors shadow-sm">Lưu Nông dân</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function LandManagementScreen({ onBack, zones, setZones }: { onBack: () => void, zones: PlantingZone[], setZones: (z: PlantingZone[]) => void }) {
  const [view, setView] = useState<'list' | 'add_info' | 'add_upload' | 'add_extracting' | 'add_preview'>('list');
  const [newZone, setNewZone] = useState({ cropType: 'Sầu riêng', name: '' });
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const startExtraction = () => {
    setView('add_extracting');
    setTimeout(() => {
      setView('add_preview');
    }, 2500);
  };

  const confirmAndSave = () => {
    const zone: PlantingZone = {
      id: Date.now().toString(),
      cropType: newZone.cropType,
      name: newZone.name,
      lots: MOCK_EXTRACTED_LOTS
    };
    setZones([...zones, zone]);
    setView('list');
    setNewZone({ cropType: 'Sầu riêng', name: '' });
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button onClick={view === 'list' ? onBack : () => setView('list')} className="p-1 hover:bg-emerald-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Quản lý Mã vùng trồng</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        {view === 'list' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Danh sách Mã vùng trồng</h2>
              <button 
                onClick={() => setView('add_info')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} /> Thêm vùng trồng
              </button>
            </div>

            {zones.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                <MapIcon className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Chưa có mã vùng trồng nào.</p>
                <p className="text-sm text-gray-400 mt-1">Hãy thêm vùng trồng và upload sổ đỏ để hệ thống tự động vẽ bản đồ.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {zones.map(zone => (
                  <div key={zone.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Cây trồng: {zone.cropType}</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{zone.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Tổng diện tích</p>
                        <p className="font-bold text-emerald-600">
                          {zone.lots.reduce((acc, lot) => acc + lot.area, 0).toFixed(1)} ha
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Danh sách lô đất ({zone.lots.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {zone.lots.map(lot => (
                          <span key={lot.id} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full border border-gray-200">
                            {lot.name} ({lot.area} ha)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'add_info' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin Vùng trồng</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại cây trồng <span className="text-red-500">*</span></label>
                <select
                  value={newZone.cropType}
                  onChange={e => setNewZone({...newZone, cropType: e.target.value})}
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Sầu riêng">Sầu riêng</option>
                  <option value="Cà phê">Cà phê</option>
                  <option value="Hồ tiêu">Hồ tiêu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên vùng trồng <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newZone.name}
                  onChange={e => setNewZone({...newZone, name: e.target.value})}
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="VD: Vùng trồng Sầu riêng Xuyên Mộc"
                />
              </div>
              <button
                onClick={() => setView('add_upload')}
                disabled={!newZone.cropType || !newZone.name}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 mt-4"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {view === 'add_upload' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Upload Giấy chứng nhận QSDĐ</h2>
            <p className="text-gray-500 text-sm mb-6">Tải lên các trang sổ đỏ có chứa bảng toạ độ góc ranh (VN-2000) của các lô đất thuộc vùng trồng này.</p>
            
            <label className="border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-xl p-8 flex flex-col items-center justify-center text-emerald-700 hover:bg-emerald-100 cursor-pointer transition-colors mb-6">
              <Upload size={40} className="mb-3 text-emerald-500" />
              <span className="font-medium mb-1">Nhấn để chọn file</span>
              <span className="text-xs opacity-70">Hỗ trợ PDF, JPG, PNG (Có thể chọn nhiều file)</span>
              <input 
                type="file" 
                multiple
                accept=".pdf,image/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </label>

            {files.length > 0 && (
              <div className="text-left mb-6">
                <p className="font-medium text-sm text-gray-700 mb-2">Đã chọn {files.length} file:</p>
                <ul className="space-y-2">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                      <FileText size={16} className="text-emerald-500" /> {f.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={startExtraction}
              disabled={files.length === 0}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              Xử lý & Trích xuất toạ độ
            </button>
          </div>
        )}

        {view === 'add_extracting' && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center flex flex-col items-center justify-center">
            <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Đang phân tích tài liệu...</h2>
            <p className="text-gray-500 text-sm">Hệ thống AI đang đọc giấy chứng nhận và trích xuất danh sách toạ độ VN-2000 để vẽ bản đồ.</p>
          </div>
        )}

        {view === 'add_preview' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Xác nhận Bản đồ Vùng trồng</h2>
                <p className="text-gray-500 text-sm">Hệ thống đã nhận diện được {MOCK_EXTRACTED_LOTS.length} lô đất từ tài liệu.</p>
              </div>
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg font-bold">
                {newZone.cropType}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Map Preview */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <div className="p-3 bg-gray-100 border-b border-gray-200 font-medium text-sm text-gray-700 flex items-center gap-2">
                  <MapIcon size={16} /> Bản đồ mô phỏng
                </div>
                <div className="p-4 aspect-video flex items-center justify-center">
                  <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-sm">
                    {MOCK_EXTRACTED_LOTS.map(lot => (
                      <g key={lot.id}>
                        <polygon
                          points={lot.coordinates}
                          className="fill-emerald-200 stroke-emerald-600 stroke-[1.5] hover:fill-emerald-300 transition-colors cursor-pointer"
                        />
                        <text 
                          x={lot.center.x} 
                          y={lot.center.y} 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          className="text-[8px] font-bold fill-emerald-900 pointer-events-none"
                        >
                          {lot.name}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Lots List */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Danh sách lô đất trích xuất:</h3>
                <div className="space-y-3 mb-6">
                  {MOCK_EXTRACTED_LOTS.map(lot => (
                    <div key={lot.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded flex items-center justify-center font-bold text-sm">
                          {lot.name.replace('Lô ', '')}
                        </div>
                        <span className="font-medium text-gray-800">{lot.name}</span>
                      </div>
                      <span className="text-emerald-600 font-bold">{lot.area} ha</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100 mb-6">
                  <span className="font-medium text-emerald-800">Tổng diện tích:</span>
                  <span className="font-bold text-xl text-emerald-600">
                    {MOCK_EXTRACTED_LOTS.reduce((acc, lot) => acc + lot.area, 0).toFixed(1)} ha
                  </span>
                </div>

                <button
                  onClick={confirmAndSave}
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle size={20} /> Xác nhận & Lưu vùng trồng
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ReportManagementScreen({ onBack, logs, incidentReports }: { onBack: () => void, logs: FarmLog[], incidentReports: IncidentReport[] }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Báo cáo tổng hợp</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        
        <div className="flex justify-end mb-4">
          <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm">
            <Printer size={16} />
            Xuất PDF toàn bộ báo cáo
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Nhật ký canh tác toàn HTX</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium whitespace-nowrap">Thời gian</th>
                  <th className="p-4 font-medium whitespace-nowrap">Nông dân</th>
                  <th className="p-4 font-medium whitespace-nowrap">Lô đất</th>
                  <th className="p-4 font-medium whitespace-nowrap">Công việc</th>
                  <th className="p-4 font-medium min-w-[200px]">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map(log => (
                  <tr key={log.id} onClick={() => navigate(`/admin/report/log/${log.id}`)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {new Date(log.datetime).toLocaleDateString('vi-VN')} {new Date(log.datetime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{log.executor}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">{log.lot}</span>
                    </td>
                    <td className="p-4 text-gray-800 whitespace-nowrap">{log.task}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      {log.fertilizer && <div>Phân bón: {log.fertilizer} ({log.dosage})</div>}
                      {log.pest && <div>Sâu bệnh: {log.pest}</div>}
                      {log.method && <div>Phương pháp: {log.method}</div>}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có nhật ký nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            Báo cáo sự cố từ Nông dân
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium whitespace-nowrap">Thời gian</th>
                  <th className="p-4 font-medium whitespace-nowrap">Nông dân</th>
                  <th className="p-4 font-medium whitespace-nowrap">Lô đất</th>
                  <th className="p-4 font-medium whitespace-nowrap">Loại sự cố</th>
                  <th className="p-4 font-medium min-w-[200px]">Mô tả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {incidentReports.map(report => (
                  <tr key={report.id} onClick={() => navigate(`/admin/report/incident/${report.id}`)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {new Date(report.datetime).toLocaleDateString('vi-VN')} {new Date(report.datetime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{report.executor}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">{report.lot}</span>
                    </td>
                    <td className="p-4 text-amber-600 font-medium whitespace-nowrap">{report.reportType}</td>
                    <td className="p-4 text-gray-700 text-sm">{report.description}</td>
                  </tr>
                ))}
                {incidentReports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có báo cáo sự cố nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

interface Material {
  id: string;
  name: string;
  type: 'Phân bón' | 'Thuốc BVTV' | 'Khác';
  activeIngredient: string;
  isVietGAP: boolean;
  unit: string;
  quantity: number;
}

function ProcessManagementScreen({ onBack, tasksConfig, setTasksConfig, taskCategories, setTaskCategories }: { onBack: () => void, tasksConfig: TaskConfig[], setTasksConfig: React.Dispatch<React.SetStateAction<TaskConfig[]>>, taskCategories: typeof TASK_CATEGORIES, setTaskCategories: React.Dispatch<React.SetStateAction<typeof TASK_CATEGORIES>> }) {
  const [view, setView] = useState<'list' | 'edit' | 'add'>('list');
  const [currentTask, setCurrentTask] = useState<TaskConfig | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(taskCategories[0]?.id || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = (task: TaskConfig) => {
    setCurrentTask(task);
    setView('edit');
  };

  const handleAdd = () => {
    setCurrentTask({
      id: `task_${Date.now()}`,
      name: '',
      icon: Leaf,
      color: 'bg-emerald-100 text-emerald-600',
      requiresMaterials: false,
      defaultValues: { task: '' }
    });
    setSelectedCategoryId(taskCategories[0]?.id || '');
    setView('add');
  };

  const handleDelete = () => {
    if (currentTask) {
      setTasksConfig(tasksConfig.filter(t => t.id !== currentTask.id));
      setTaskCategories(taskCategories.map(cat => ({
        ...cat,
        taskIds: cat.taskIds.filter(id => id !== currentTask.id)
      })));
      setView('list');
      setCurrentTask(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTask) {
      if (view === 'add') {
        setTasksConfig([...tasksConfig, currentTask]);
        setTaskCategories(taskCategories.map(cat => 
          cat.id === selectedCategoryId 
            ? { ...cat, taskIds: [...cat.taskIds, currentTask.id] }
            : cat
        ));
      } else {
        setTasksConfig(tasksConfig.map(t => t.id === currentTask.id ? currentTask : t));
      }
      setView('list');
      setCurrentTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button onClick={view === 'list' ? onBack : () => setView('list')} className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Quản lý Quy trình</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        {view === 'list' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-800">Cấu hình Nhật ký Canh tác</h2>
              <button onClick={handleAdd} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                <Plus size={18} />
                Thêm quy trình
              </button>
            </div>
            
            {taskCategories.map(category => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700">{category.name}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {category.taskIds.map(taskId => {
                    const task = tasksConfig.find(t => t.id === taskId);
                    if (!task) return null;
                    const Icon = task.icon;
                    return (
                      <div key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${task.color}`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{task.name}</p>
                            <p className="text-xs text-gray-500">
                              {task.requiresMaterials ? 'Có sử dụng vật tư/thuốc' : 'Không dùng vật tư'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleEdit(task)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium text-sm px-3 py-1.5 rounded hover:bg-emerald-50 transition-colors"
                        >
                          Cấu hình
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          currentTask && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{view === 'add' ? 'Thêm quy trình mới' : `Cấu hình: ${currentTask.name}`}</h2>
              <form onSubmit={handleSave} className="space-y-5">
                {view === 'add' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm quy trình <span className="text-red-500">*</span></label>
                    <select 
                      value={selectedCategoryId}
                      onChange={e => setSelectedCategoryId(e.target.value)}
                      className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {taskCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên quy trình <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={currentTask.name} 
                    onChange={e => setCurrentTask({...currentTask, name: e.target.value, defaultValues: {...currentTask.defaultValues, task: e.target.value}})} 
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" 
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <input 
                    type="checkbox" 
                    id="requiresMaterials" 
                    checked={currentTask.requiresMaterials} 
                    onChange={e => setCurrentTask({...currentTask, requiresMaterials: e.target.checked})} 
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" 
                  />
                  <label htmlFor="requiresMaterials" className="font-medium text-emerald-800 cursor-pointer">
                    Quy trình này có sử dụng Vật tư / Phân bón / Thuốc
                  </label>
                </div>

                {currentTask.requiresMaterials && (
                  <div className="space-y-4 border-t border-gray-100 pt-4">
                    <h3 className="font-medium text-gray-800">Giá trị mặc định (Gợi ý cho nông dân)</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng gây hại (Sâu bệnh)</label>
                        <input 
                          type="text" 
                          value={currentTask.defaultValues.pest || ''} 
                          onChange={e => setCurrentTask({...currentTask, defaultValues: {...currentTask.defaultValues, pest: e.target.value}})} 
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" 
                          placeholder="VD: Rầy xanh, Nhện đỏ..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên thuốc / Biện pháp</label>
                        <input 
                          type="text" 
                          value={currentTask.defaultValues.method || ''} 
                          onChange={e => setCurrentTask({...currentTask, defaultValues: {...currentTask.defaultValues, method: e.target.value}})} 
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" 
                          placeholder="VD: Champion, Najat 3.6..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phân bón</label>
                        <input 
                          type="text" 
                          value={currentTask.defaultValues.fertilizer || ''} 
                          onChange={e => setCurrentTask({...currentTask, defaultValues: {...currentTask.defaultValues, fertilizer: e.target.value}})} 
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" 
                          placeholder="VD: Phân gà, NPK..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt chất</label>
                        <input 
                          type="text" 
                          value={currentTask.defaultValues.activeIngredient || ''} 
                          onChange={e => setCurrentTask({...currentTask, defaultValues: {...currentTask.defaultValues, activeIngredient: e.target.value}})} 
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" 
                          placeholder="VD: Abamectin..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Liều lượng</label>
                        <input 
                          type="text" 
                          value={currentTask.defaultValues.dosage || ''} 
                          onChange={e => setCurrentTask({...currentTask, defaultValues: {...currentTask.defaultValues, dosage: e.target.value}})} 
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" 
                          placeholder="VD: 800ml/800L"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian cách ly</label>
                        <input 
                          type="text" 
                          value={currentTask.defaultValues.quarantineTime || ''} 
                          onChange={e => setCurrentTask({...currentTask, defaultValues: {...currentTask.defaultValues, quarantineTime: e.target.value}})} 
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" 
                          placeholder="VD: 7 Ngày"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                  {view === 'edit' ? (
                    <button type="button" onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                      Xóa
                    </button>
                  ) : <div></div>}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setView('list')} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
                    <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors shadow-sm">Lưu Cấu hình</button>
                  </div>
                </div>
              </form>
            </div>
          )
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa quy trình <strong>{currentTask?.name}</strong>? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition-colors shadow-sm">Xóa Quy trình</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MaterialManagementScreen({ onBack }: { onBack: () => void }) {
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'Phân Lân Văn Điển', type: 'Phân bón', activeIngredient: 'P2O5', isVietGAP: true, unit: 'Bao 50kg', quantity: 100 },
    { id: '2', name: 'Champion', type: 'Thuốc BVTV', activeIngredient: 'Copper Hydroxide', isVietGAP: true, unit: 'Gói 1kg', quantity: 50 },
  ]);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({});

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'add') {
      setMaterials([...materials, { ...currentMaterial, id: Date.now().toString() } as Material]);
    } else if (view === 'edit') {
      setMaterials(materials.map(m => m.id === currentMaterial.id ? currentMaterial as Material : m));
    }
    setView('list');
    setCurrentMaterial({});
  };

  const handleEdit = (material: Material) => {
    setCurrentMaterial(material);
    setView('edit');
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button onClick={view === 'list' ? onBack : () => setView('list')} className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Quản lý Vật tư (VietGAP)</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        {view === 'list' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Danh mục Vật tư</h2>
              <button onClick={() => { setCurrentMaterial({ isVietGAP: true, type: 'Phân bón' }); setView('add'); }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <Plus size={20} /> Thêm mới
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                      <th className="p-4 font-medium whitespace-nowrap">Tên vật tư</th>
                      <th className="p-4 font-medium whitespace-nowrap">Loại</th>
                      <th className="p-4 font-medium whitespace-nowrap">Hoạt chất</th>
                      <th className="p-4 font-medium text-center whitespace-nowrap">Chuẩn VietGAP</th>
                      <th className="p-4 font-medium text-right whitespace-nowrap">Tồn kho</th>
                      <th className="p-4 font-medium text-right whitespace-nowrap">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {materials.map(material => (
                      <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{material.name}</td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${material.type === 'Phân bón' ? 'bg-amber-100 text-amber-700' : material.type === 'Thuốc BVTV' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                            {material.type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">{material.activeIngredient}</td>
                        <td className="p-4 text-center whitespace-nowrap">
                          {material.isVietGAP ? (
                            <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-600 p-1 rounded-full"><CheckCircle size={16} /></span>
                          ) : (
                            <span className="inline-flex items-center justify-center bg-red-100 text-red-600 p-1 rounded-full"><AlertTriangle size={16} /></span>
                          )}
                        </td>
                        <td className="p-4 text-right text-gray-800 font-medium whitespace-nowrap">
                          {material.quantity} <span className="text-gray-500 text-sm font-normal">{material.unit}</span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <button className="text-blue-500 hover:text-blue-700 p-2" onClick={() => handleEdit(material)}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button className="text-red-500 hover:text-red-700 p-2" onClick={() => handleDelete(material.id)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {materials.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có vật tư nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{view === 'add' ? 'Thêm Vật tư mới' : 'Cập nhật Vật tư'}</h2>
            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên vật tư (Thương mại) <span className="text-red-500">*</span></label>
                  <input type="text" required value={currentMaterial.name || ''} onChange={e => setCurrentMaterial({...currentMaterial, name: e.target.value})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="VD: Phân Lân Văn Điển" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại vật tư <span className="text-red-500">*</span></label>
                  <select required value={currentMaterial.type || 'Phân bón'} onChange={e => setCurrentMaterial({...currentMaterial, type: e.target.value as any})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                    <option value="Phân bón">Phân bón</option>
                    <option value="Thuốc BVTV">Thuốc Bảo vệ thực vật</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt chất chính</label>
                  <input type="text" value={currentMaterial.activeIngredient || ''} onChange={e => setCurrentMaterial({...currentMaterial, activeIngredient: e.target.value})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="VD: P2O5, Copper Hydroxide..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính <span className="text-red-500">*</span></label>
                  <input type="text" required value={currentMaterial.unit || ''} onChange={e => setCurrentMaterial({...currentMaterial, unit: e.target.value})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="VD: Bao 50kg, Chai 1L..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                  <input type="number" min="0" value={currentMaterial.quantity || 0} onChange={e => setCurrentMaterial({...currentMaterial, quantity: Number(e.target.value)})} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3 mt-2 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <input type="checkbox" id="vietgap" checked={currentMaterial.isVietGAP || false} onChange={e => setCurrentMaterial({...currentMaterial, isVietGAP: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                  <label htmlFor="vietgap" className="font-medium text-emerald-800 cursor-pointer">Vật tư được phép sử dụng trong tiêu chuẩn VietGAP</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setView('list')} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors shadow-sm">Lưu Vật tư</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export function LogDetailScreen({ onBack, logs }: { onBack: () => void, logs: FarmLog[] }) {
  const { id } = useParams();
  const log = logs.find(l => l.id === id);

  if (!log) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy nhật ký</h2>
          <button onClick={onBack} className="text-emerald-600 hover:underline">Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Chi tiết Nhật ký</h1>
      </header>
      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{log.task}</h2>
              <p className="text-gray-500">{new Date(log.datetime).toLocaleString('vi-VN')}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {log.lot}
              </span>
              <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium">
                <Printer size={16} />
                Xuất PDF
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Người thực hiện</h3>
                <p className="text-gray-900 font-medium">{log.executor}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Giai đoạn</h3>
                <p className="text-gray-900">{log.stage}</p>
              </div>
              {log.pest && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Sâu bệnh</h3>
                  <p className="text-gray-900">{log.pest}</p>
                </div>
              )}
              {log.method && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Phương pháp</h3>
                  <p className="text-gray-900">{log.method}</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {log.fertilizer && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Phân bón / Thuốc</h3>
                  <p className="text-gray-900">{log.fertilizer}</p>
                </div>
              )}
              {log.activeIngredient && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Hoạt chất</h3>
                  <p className="text-gray-900">{log.activeIngredient}</p>
                </div>
              )}
              {log.dosage && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Liều lượng</h3>
                  <p className="text-gray-900">{log.dosage}</p>
                </div>
              )}
              {log.quarantineTime && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Thời gian cách ly</h3>
                  <p className="text-gray-900">{log.quarantineTime}</p>
                </div>
              )}
            </div>
          </div>
          
          {log.images && log.images.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Hình ảnh đính kèm</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {log.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Hình ảnh nhật ký ${idx + 1}`} className="w-full h-40 object-cover rounded-xl border border-gray-200 shadow-sm" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export function IncidentDetailScreen({ onBack, incidentReports }: { onBack: () => void, incidentReports: IncidentReport[] }) {
  const { id } = useParams();
  const report = incidentReports.find(r => r.id === id);

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy báo cáo</h2>
          <button onClick={onBack} className="text-emerald-600 hover:underline">Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Chi tiết Sự cố</h1>
      </header>
      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-amber-600 flex items-center gap-2">
                <AlertTriangle size={24} />
                {report.reportType}
              </h2>
              <p className="text-gray-500 mt-1">{new Date(report.datetime).toLocaleString('vi-VN')}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {report.lot}
              </span>
              <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium">
                <Printer size={16} />
                Xuất PDF
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Người báo cáo</h3>
              <p className="text-gray-900 font-medium">{report.executor}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Mô tả chi tiết</h3>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                {report.description}
              </p>
            </div>
            {report.images && report.images.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Hình ảnh đính kèm</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {report.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Hình ảnh sự cố ${idx + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}