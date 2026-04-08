import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { 
  Plus, ArrowLeft, Save, Calendar, MapPin, User, Activity, Bug, Droplet, 
  Beaker, Clock, ShieldAlert, Droplets, Scissors, Leaf, CloudRain, Sprout, 
  FlaskConical, BugOff, SprayCan, TreePine, Image as ImageIcon, X, LogOut, Lock, Phone,
  Trash2, Recycle, Package, ScanLine, Loader2, Home, ClipboardList, AlertTriangle, Settings, ShieldCheck, Warehouse, HardHat, Camera,
  Mail, Building, Upload, CheckCircle, FileText, Map as MapIcon, Printer, Download, Cloud, Sun, Wind, Thermometer,
  Menu, ShoppingCart, LayoutDashboard, Edit, PlusCircle, Search, Filter, Eye
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMapEvents, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { area as turfArea } from '@turf/area';
import { polygon as turfPolygon } from '@turf/helpers';
import { Scanner } from '@yudiel/react-qr-scanner';

// Weather Widget Component
function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 31,
    humidity: 65,
    condition: 'Nhiều mây',
    icon: Cloud,
    forecast: [
      { day: 'Mai', temp: 32, icon: Sun },
      { day: 'Thứ 5', temp: 29, icon: CloudRain },
      { day: 'Thứ 6', temp: 30, icon: Cloud },
    ]
  });

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-blue-100 text-sm font-medium flex items-center gap-1">
            <MapPin size={14} /> Xuyên Mộc, Bà Rịa - Vũng Tàu
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-4xl font-bold">{weather.temp}°C</span>
            <weather.icon size={32} className="text-blue-100" />
          </div>
          <p className="text-blue-100 text-sm mt-1">{weather.condition}</p>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end gap-1 text-xs text-blue-100">
            <Droplets size={14} /> <span>Độ ẩm: {weather.humidity}%</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-xs text-blue-100">
            <Wind size={14} /> <span>Gió: 12km/h</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-blue-400/30">
        {weather.forecast.map((f, i) => (
          <div key={i} className="text-center">
            <p className="text-[10px] text-blue-100 uppercase font-bold mb-1">{f.day}</p>
            <f.icon size={18} className="mx-auto mb-1" />
            <p className="text-xs font-bold">{f.temp}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Traceability Modal Component
function TraceabilityModal({ harvest, zone, lot, onClose }: { harvest: HarvestRecord, zone: PlantingZone, lot: LandLot, onClose: () => void }) {
  const qrValue = `https://openfarm.vn/trace/${harvest.id}`;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-emerald-600 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} />
            <h3 className="font-bold">Truy xuất nguồn gốc sản phẩm</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="bg-white p-3 rounded-xl border-2 border-emerald-100 shadow-sm">
              <QRCodeSVG value={qrValue} size={160} />
              <p className="text-[10px] text-center text-gray-400 mt-2 font-mono">ID: {harvest.id}</p>
            </div>
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div>
                <h4 className="text-2xl font-bold text-gray-800">Sầu riêng Ri6 - VietGAP</h4>
                <p className="text-emerald-600 font-medium">Mã vùng trồng: {zone.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold">Ngày thu hoạch</p>
                  <p className="font-bold text-gray-800">{new Date(harvest.date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold">Sản lượng</p>
                  <p className="font-bold text-gray-800">{harvest.quantity} {harvest.unit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Production Details */}
          <div className="space-y-4">
            <h5 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Warehouse size={18} className="text-emerald-600" />
              Thông tin sản xuất
            </h5>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hợp tác xã</p>
                  <p className="font-medium">HTX Nông Nghiệp Xanh</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lô đất</p>
                  <p className="font-medium">{lot.name} - {zone.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Production Diary */}
          <div className="space-y-4">
            <h5 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
              <ClipboardList size={18} className="text-emerald-600" />
              Nhật ký canh tác (Toàn bộ quy trình)
            </h5>
            <div className="relative pl-4 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100">
              {harvest.logs.map((log, idx) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[13px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-emerald-700">{log.task}</span>
                      <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-100">
                        {new Date(log.datetime).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <p><span className="text-gray-500">Người thực hiện:</span> <span className="font-medium">{log.executor}</span></p>
                      <p><span className="text-gray-500">Giai đoạn:</span> <span className="font-medium">{log.stage}</span></p>
                      {log.fertilizer && <p className="col-span-2"><span className="text-gray-500">Vật tư:</span> <span className="font-medium">{log.fertilizer}</span></p>}
                      {log.activeIngredient && <p className="col-span-2"><span className="text-gray-500">Hoạt chất:</span> <span className="font-medium">{log.activeIngredient}</span></p>}
                      {log.dosage && <p><span className="text-gray-500">Liều lượng:</span> <span className="font-medium">{log.dosage}</span></p>}
                      {log.quarantineTime && <p><span className="text-gray-500">Cách ly:</span> <span className="font-medium text-amber-600">{log.quarantineTime}</span></p>}
                    </div>
                  </div>
                </div>
              ))}
              {harvest.logs.length === 0 && (
                <p className="text-gray-500 italic text-sm">Không có dữ liệu nhật ký cho lô này.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={20} /> In báo cáo
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            Hoàn tất
          </button>
        </div>
      </motion.div>
    </div>
  );
}

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
  plantCode?: string;
}

interface HarvestRecord {
  id: string;
  zoneId: string;
  lotId: string;
  date: string;
  quantity: number;
  unit: string;
  notes: string;
  logs: FarmLog[];
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
import { SysAdminLoginScreen, SysAdminApp } from './SysAdmin';

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

function HarvestManagementScreen({ onBack, harvests, setHarvests, zones, logs }: { onBack: () => void, harvests: HarvestRecord[], setHarvests: (h: HarvestRecord[]) => void, zones: PlantingZone[], logs: FarmLog[] }) {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [newHarvest, setNewHarvest] = useState<Partial<HarvestRecord>>({ date: new Date().toISOString().split('T')[0], quantity: 0, unit: 'kg' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHarvest.zoneId || !newHarvest.lotId || !newHarvest.date || !newHarvest.quantity) return;

    const lotName = zones.find(z => z.id === newHarvest.zoneId)?.lots.find(l => l.id === newHarvest.lotId)?.name;
    const relatedLogs = logs.filter(log => log.lot === lotName);

    const record: HarvestRecord = {
      id: Date.now().toString(),
      zoneId: newHarvest.zoneId,
      lotId: newHarvest.lotId,
      date: newHarvest.date,
      quantity: newHarvest.quantity,
      unit: newHarvest.unit || 'kg',
      notes: newHarvest.notes || '',
      logs: relatedLogs
    };

    setHarvests([record, ...harvests]);
    setView('list');
    setNewHarvest({ date: new Date().toISOString().split('T')[0], quantity: 0, unit: 'kg' });
  };

  const exportToPDF = (harvest: HarvestRecord) => {
    const doc = new jsPDF();
    const zone = zones.find(z => z.id === harvest.zoneId);
    const lot = zone?.lots.find(l => l.id === harvest.lotId);

    // Add font for Vietnamese characters if needed, but for simplicity we'll use default
    // Note: Default jsPDF fonts don't support full UTF-8 Vietnamese. 
    // We will use basic ASCII replacements or just let it be for this demo.
    
    doc.setFontSize(18);
    doc.text('Bao Cao Thu Hoach', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Khu vuc: ${zone?.name || ''}`, 14, 32);
    doc.text(`Lo dat: ${lot?.name || ''}`, 14, 40);
    doc.text(`Ngay thu hoach: ${harvest.date}`, 14, 48);
    doc.text(`San luong: ${harvest.quantity} ${harvest.unit}`, 14, 56);
    if (harvest.notes) {
      doc.text(`Ghi chu: ${harvest.notes}`, 14, 64);
    }

    doc.text('Nhat ky canh tac:', 14, 76);

    const tableData = harvest.logs.map(log => [
      new Date(log.datetime).toLocaleDateString('vi-VN'),
      log.task,
      log.executor,
      log.plantCode || '',
      log.fertilizer || log.activeIngredient || ''
    ]);

    autoTable(doc, {
      startY: 80,
      head: [['Ngay', 'Cong viec', 'Nguoi thuc hien', 'Ma cay', 'Vat tu/Hoat chat']],
      body: tableData,
    });

    doc.save(`bao-cao-thu-hoach-${harvest.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button onClick={view === 'list' ? onBack : () => setView('list')} className="p-1 hover:bg-emerald-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Quản lý Thu hoạch</h1>
      </header>

      <main className="p-4 max-w-[1600px] mx-auto">
        <Breadcrumb />
        {view === 'list' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Lịch sử thu hoạch</h2>
              <button 
                onClick={() => setView('add')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} /> Ghi nhận thu hoạch
              </button>
            </div>

            {harvests.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                <Sprout className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Chưa có đợt thu hoạch nào.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {harvests.map(harvest => {
                  const zone = zones.find(z => z.id === harvest.zoneId);
                  const lot = zone?.lots.find(l => l.id === harvest.lotId);
                  return (
                    <div key={harvest.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">Thu hoạch {lot?.name} - {zone?.name}</h3>
                          <p className="text-sm text-gray-500">Ngày: {harvest.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Sản lượng</p>
                          <p className="font-bold text-emerald-600 text-lg">
                            {harvest.quantity} {harvest.unit}
                          </p>
                          <button 
                            onClick={() => exportToPDF(harvest)}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1"
                          >
                            <Download size={16} /> Xuất PDF
                          </button>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Truy xuất nguồn gốc ({harvest.logs.length} nhật ký):</p>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                          {harvest.logs.map(log => (
                            <div key={log.id} className="bg-gray-50 p-3 rounded border border-gray-100 text-sm">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-gray-800">{log.task}</span>
                                <span className="text-gray-500">{new Date(log.datetime).toLocaleDateString('vi-VN')}</span>
                              </div>
                              <p className="text-gray-600">Người thực hiện: {log.executor}</p>
                              {log.plantCode && <p className="text-gray-600">Cây: <span className="font-medium">{log.plantCode}</span></p>}
                              {log.fertilizer && <p className="text-gray-600">Vật tư: {log.fertilizer} {log.dosage ? `(${log.dosage})` : ''}</p>}
                              {log.activeIngredient && <p className="text-gray-600">Hoạt chất: {log.activeIngredient} {log.dosage ? `(${log.dosage})` : ''}</p>}
                            </div>
                          ))}
                          {harvest.logs.length === 0 && (
                            <p className="text-sm text-gray-500 italic">Không có nhật ký canh tác nào cho lô này.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {view === 'add' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Ghi nhận Thu hoạch</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã vùng trồng <span className="text-red-500">*</span></label>
                <select 
                  required
                  value={newHarvest.zoneId || ''} 
                  onChange={e => setNewHarvest({...newHarvest, zoneId: e.target.value, lotId: ''})} 
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="">Chọn vùng trồng</option>
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lô sản xuất <span className="text-red-500">*</span></label>
                <select 
                  required
                  value={newHarvest.lotId || ''} 
                  onChange={e => setNewHarvest({...newHarvest, lotId: e.target.value})} 
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  disabled={!newHarvest.zoneId}
                >
                  <option value="">Chọn lô sản xuất</option>
                  {zones.find(z => z.id === newHarvest.zoneId)?.lots.map(lot => (
                    <option key={lot.id} value={lot.id}>{lot.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày thu hoạch <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  required
                  value={newHarvest.date || ''} 
                  onChange={e => setNewHarvest({...newHarvest, date: e.target.value})} 
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sản lượng <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.1"
                    value={newHarvest.quantity || ''} 
                    onChange={e => setNewHarvest({...newHarvest, quantity: parseFloat(e.target.value)})} 
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                  <select 
                    value={newHarvest.unit || 'kg'} 
                    onChange={e => setNewHarvest({...newHarvest, unit: e.target.value})} 
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="tấn">tấn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea 
                  value={newHarvest.notes || ''} 
                  onChange={e => setNewHarvest({...newHarvest, notes: e.target.value})} 
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  placeholder="Ghi chú thêm về đợt thu hoạch..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setView('list')} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors shadow-sm">Lưu Thu hoạch</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

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

  const [harvests, setHarvests] = useState<HarvestRecord[]>([]);

  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'Phân Lân Văn Điển', type: 'Phân bón', activeIngredient: 'P2O5', isVietGAP: true, unit: 'Bao 50kg', quantity: 100 },
    { id: '2', name: 'Champion', type: 'Thuốc BVTV', activeIngredient: 'Copper Hydroxide', isVietGAP: true, unit: 'Gói 1kg', quantity: 50 },
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
      <Route path="/" element={<LandingScreen onLoginClick={() => navigate('/login')} onRegisterClick={() => navigate('/register')} onHTXLoginClick={() => navigate('/htx_login')} onSysAdminLoginClick={() => navigate('/sysadmin_login')} onSupplierAuthClick={() => navigate('/supplier_auth')} onCustomerAuthClick={() => navigate('/customer_auth')} />} />
      <Route path="/htx_login" element={<HTXLoginScreen onBack={() => navigate('/')} onLoginSuccess={(user) => { setCurrentUser(user); navigate('/admin'); }} />} />
      <Route path="/supplier_auth" element={<SupplierAuthScreen onBack={() => navigate('/')} onAuthSuccess={(user) => { setCurrentUser(user); navigate('/supplier'); }} />} />
      <Route path="/customer_auth" element={<CustomerAuthScreen onBack={() => navigate('/')} onAuthSuccess={(user) => { setCurrentUser(user); navigate('/customer'); }} />} />
      <Route path="/sysadmin_login" element={<SysAdminLoginScreen onBack={() => navigate('/')} onLoginSuccess={(user) => { setCurrentUser(user); navigate('/sysadmin'); }} />} />
      <Route path="/sysadmin/*" element={<SysAdminApp currentUser={currentUser!} onLogout={() => { setCurrentUser(null); navigate('/'); }} />} />
      <Route path="/register" element={<RegisterScreen onBack={() => navigate('/')} onRegisterSuccess={() => navigate('/onboard')} onLoginClick={() => navigate('/login')} />} />
      <Route path="/onboard" element={<OnboardHTXScreen onComplete={(htxName) => {
        setCurrentUser({ name: htxName, role: 'admin' });
        navigate('/admin');
      }} />} />
      <Route path="/supplier" element={<SupplierDashboardScreen currentUser={currentUser!} onLogout={() => { setCurrentUser(null); navigate('/'); }} materials={materials} setMaterials={setMaterials} />} />
      <Route path="/customer" element={<CustomerDashboardScreen currentUser={currentUser!} onLogout={() => { setCurrentUser(null); navigate('/'); }} zones={zones} />} />
      <Route path="/admin" element={<AdminDashboardScreen currentUser={currentUser!} onLogout={() => { setCurrentUser(null); navigate('/'); }} onNavigate={(screen) => {
        const routes: Record<string, string> = {
          'admin_land': '/admin/land',
          'admin_farmer': '/admin/farmer',
          'admin_report': '/admin/report',
          'admin_material': '/admin/material',
          'admin_process': '/admin/process',
          'admin_harvest': '/admin/harvest'
        };
        navigate(routes[screen] || '/');
      }} farmers={farmers} zones={zones} logs={logs} />} />
      <Route path="/admin/land" element={<LandManagementScreen onBack={() => navigate('/admin')} zones={zones} setZones={setZones} farmers={farmers} currentUser={currentUser!} />} />
      <Route path="/admin/farmer" element={<FarmerManagementScreen onBack={() => navigate('/admin')} farmers={farmers} setFarmers={setFarmers} zones={zones} />} />
      <Route path="/admin/report" element={<ReportManagementScreen onBack={() => navigate('/admin')} logs={logs} incidentReports={incidentReports} />} />
      <Route path="/admin/report/log/:id" element={<LogDetailScreen onBack={() => navigate('/admin/report')} logs={logs} />} />
      <Route path="/admin/report/incident/:id" element={<IncidentDetailScreen onBack={() => navigate('/admin/report')} incidentReports={incidentReports} />} />
      <Route path="/admin/material" element={<MaterialManagementScreen onBack={() => navigate('/admin')} materials={materials} setMaterials={setMaterials} />} />
      <Route path="/admin/process" element={<ProcessManagementScreen onBack={() => navigate('/admin')} tasksConfig={tasksConfig} setTasksConfig={setTasksConfig} taskCategories={taskCategories} setTaskCategories={setTaskCategories} />} />
      <Route path="/admin/harvest" element={<HarvestManagementScreen onBack={() => navigate('/admin')} harvests={harvests} setHarvests={setHarvests} zones={zones} logs={logs} />} />
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
            <WeatherWidget />
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
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Open Farm</h1>
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
            {log.plantCode && (
              <div className="flex items-center gap-1.5 col-span-2">
                <TreePine size={14} className="text-emerald-500" />
                <span className="font-medium text-emerald-700">Cây: {log.plantCode}</span>
              </div>
            )}
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
  const [isScanningPlant, setIsScanningPlant] = useState(false);
  
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
    plantCode: '',
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Mã cây (Tuỳ chọn)</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="plantCode"
              value={formData.plantCode || ''}
              onChange={handleChange}
              className="flex-1 rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập mã cây hoặc quét QR"
            />
            <button
              type="button"
              onClick={() => setIsScanningPlant(true)}
              className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-200 transition-colors flex items-center justify-center"
            >
              Quét QR
            </button>
          </div>
        </div>

        {isScanningPlant && (
          <div className="fixed inset-0 z-[600] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl overflow-hidden w-full max-w-sm">
              <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
                <h3 className="font-bold">Quét mã QR cây</h3>
                <button onClick={() => setIsScanningPlant(false)} className="text-white hover:text-gray-200">
                  <X size={24} />
                </button>
              </div>
              <div className="p-4">
                <Scanner
                  onScan={(result) => {
                    if (result && result.length > 0) {
                      setFormData(prev => ({ ...prev, plantCode: result[0].rawValue }));
                      setIsScanningPlant(false);
                    }
                  }}
                />
                <p className="text-center text-sm text-gray-500 mt-4">Hướng camera vào mã QR của cây</p>
              </div>
            </div>
          </div>
        )}

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

function SupplierAuthScreen({ onBack, onAuthSuccess }: { onBack: () => void, onAuthSuccess: (user: {name: string, role: string}) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Công nghệ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthSuccess({ name: isLogin ? 'Nhà cung cấp Demo' : name, role: 'supplier' });
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
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <Package size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{isLogin ? 'Đăng nhập Nhà cung cấp' : 'Đăng ký Nhà cung cấp'}</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Cung cấp vật tư, công nghệ cho HTX</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên doanh nghiệp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tên doanh nghiệp"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực cung cấp</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Công nghệ">Công nghệ (IoT, Phần mềm)</option>
                  <option value="Vật tư">Vật tư (Phân bón, Thuốc BVTV VietGAP)</option>
                  <option value="Giống">Giống cây trồng/vật nuôi VietGAP</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </>
          )}
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
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
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
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors mt-6"
          >
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerAuthScreen({ onBack, onAuthSuccess }: { onBack: () => void, onAuthSuccess: (user: {name: string, role: string}) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthSuccess({ name: isLogin ? 'Khách hàng Demo' : name, role: 'customer' });
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
          <div className="bg-amber-100 p-4 rounded-full text-amber-600">
            <User size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{isLogin ? 'Đăng nhập Khách hàng' : 'Đăng ký Khách hàng'}</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Xem vùng trồng và đặt hàng thu hoạch</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Họ và tên"
                />
              </div>
            </div>
          )}
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
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-amber-500 focus:border-amber-500"
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
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors mt-6"
          >
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-600 hover:text-amber-800 text-sm font-medium"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
    title: 'Nền tảng Quản lý Nông nghiệp',
    subtitle: 'Thông minh & Chuẩn VietGAP',
    description: 'Giải pháp toàn diện giúp Hợp tác xã và Nông dân số hoá nhật ký canh tác, quản lý vật tư chuẩn VietGAP, và minh bạch nguồn gốc nông sản.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0a3023?q=80&w=2070&auto=format&fit=crop',
    title: 'Nhật ký Canh tác Số',
    subtitle: 'Dễ dàng & Nhanh chóng',
    description: 'Nông dân dễ dàng ghi chép hoạt động bón phân, phun thuốc, thu hoạch ngay trên điện thoại. Dữ liệu được đồng bộ theo thời gian thực.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop',
    title: 'Quản lý Vật tư',
    subtitle: 'An toàn & Minh bạch',
    description: 'HTX kiểm soát chặt chẽ danh mục phân bón, thuốc BVTV. Đảm bảo nông dân chỉ sử dụng các vật tư đạt chuẩn an toàn VietGAP.'
  }
];

function LandingScreen({ onLoginClick, onRegisterClick, onHTXLoginClick, onSysAdminLoginClick, onSupplierAuthClick, onCustomerAuthClick }: { onLoginClick: () => void, onRegisterClick: () => void, onHTXLoginClick: () => void, onSysAdminLoginClick: () => void, onSupplierAuthClick: () => void, onCustomerAuthClick: () => void }) {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sprout size={28} />
            <span className="text-xl font-bold">Open Farm</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={onLoginClick}
              className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors text-sm sm:text-base px-2 hidden md:block"
            >
              Đăng Nhập Nông Dân
            </button>
            <div className="relative group">
              <button className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors text-sm sm:text-base px-2 flex items-center gap-1">
                Đối tác <span className="text-xs">▼</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={onSupplierAuthClick} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-t-xl transition-colors">Nhà cung cấp</button>
                <button onClick={onCustomerAuthClick} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-b-xl transition-colors">Khách hàng</button>
              </div>
            </div>
            <button 
              onClick={onRegisterClick}
              className="bg-emerald-600 text-white px-4 sm:px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition-colors text-sm sm:text-base"
            >
              Đăng ký HTX
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Slide Banner */}
      <main className="flex-1 flex flex-col">
        <section className="relative h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banners[currentBanner].image})` }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight text-white">
                    {banners[currentBanner].title} <br className="hidden sm:block" />
                    <span className="text-emerald-400">{banners[currentBanner].subtitle}</span>
                  </h1>
                  <p className="text-base sm:text-xl text-gray-200 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                    {banners[currentBanner].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0 w-full sm:w-auto">
                <button 
                  onClick={onLoginClick}
                  className="w-full sm:w-auto bg-emerald-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <User size={20} />
                  Đăng nhập cho Nông dân
                </button>
                <button 
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white/20 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Building size={20} />
                  Đăng ký Hợp tác xã
                </button>
              </div>
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentBanner ? 'bg-emerald-500 w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
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

              {/* Feature 4 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <ScanLine size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Nhận diện Vật tư bằng AI</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Sử dụng AI để quét và trích xuất thông tin từ bao bì vật tư nông nghiệp, giúp nông dân nhập liệu nhanh chóng và chính xác.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <AlertTriangle size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Báo cáo Sự cố & Dịch bệnh</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Nông dân có thể báo cáo nhanh các sự cố, sâu bệnh kèm hình ảnh thực tế để Ban quản lý HTX kịp thời hỗ trợ và xử lý.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Printer size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Thống kê & Xuất Báo cáo PDF</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Tổng hợp dữ liệu toàn HTX, cung cấp cái nhìn tổng quan qua các biểu đồ và hỗ trợ xuất báo cáo chi tiết ra file PDF.
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
          <span className="text-xl font-bold">Open Farm</span>
        </div>
        <p className="mb-6 text-sm sm:text-base">© 2026 Open Farm. Nền tảng nông nghiệp số.</p>
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onHTXLoginClick}
            className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors text-sm sm:text-base bg-gray-800 px-6 py-2.5 rounded-full"
          >
            Đăng nhập dành cho Ban quản lý HTX
          </button>
          <button 
            onClick={onSysAdminLoginClick}
            className="text-gray-500 hover:text-gray-300 transition-colors text-xs underline"
          >
            Đăng nhập Quản trị Hệ thống
          </button>
        </div>
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
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onLoginSuccess({ name: 'HTX Demo (Google)', role: 'htx' })}
            className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Đăng nhập bằng Google
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

interface SupplierProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  status: 'active' | 'inactive';
  stock: number;
}

interface SupplierOrder {
  id: string;
  htxName: string;
  date: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  items: { productName: string; quantity: number; price: number }[];
}

const MOCK_SUPPLIER_PRODUCTS: SupplierProduct[] = [
  { id: 'p1', name: 'Phân bón hữu cơ vi sinh', category: 'Vật tư', price: 250000, unit: 'Bao 25kg', description: 'Đạt chuẩn VietGAP, phù hợp cho sầu riêng', status: 'active', stock: 500 },
  { id: 'p2', name: 'Cảm biến độ ẩm đất IoT', category: 'Công nghệ', price: 1200000, unit: 'Bộ', description: 'Bao gồm đấu nối và cấu hình thiết bị IoT tiêu chuẩn', status: 'active', stock: 50 },
  { id: 'p3', name: 'Giống sầu riêng Ri6', category: 'Giống', price: 150000, unit: 'Cây', description: 'Cây giống khỏe, sạch bệnh', status: 'active', stock: 1000 },
];

const MOCK_SUPPLIER_ORDERS: SupplierOrder[] = [
  { 
    id: 'ORD-001', htxName: 'HTX Nông nghiệp Sạch', date: '2026-04-01', totalAmount: 5000000, status: 'pending',
    items: [{ productName: 'Phân bón hữu cơ vi sinh', quantity: 20, price: 250000 }]
  },
  { 
    id: 'ORD-002', htxName: 'HTX Sầu riêng Chín Hóa', date: '2026-03-28', totalAmount: 12000000, status: 'processing',
    items: [{ productName: 'Cảm biến độ ẩm đất IoT', quantity: 10, price: 1200000 }]
  },
];

function SupplierDashboardScreen({ currentUser, onLogout, materials, setMaterials }: { currentUser: {name: string}, onLogout: () => void, materials: Material[], setMaterials: React.Dispatch<React.SetStateAction<Material[]>> }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [productView, setProductView] = useState<'list' | 'add' | 'edit'>('list');
  const [addMode, setAddMode] = useState<'select' | 'new'>('select');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState<SupplierProduct[]>(MOCK_SUPPLIER_PRODUCTS);
  const [orders, setOrders] = useState<SupplierOrder[]>(MOCK_SUPPLIER_ORDERS);
  
  const [newProduct, setNewProduct] = useState<Partial<SupplierProduct> & { activeIngredient?: string }>({ status: 'active', category: 'Vật tư' });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.stock) {
      const productId = Date.now().toString();
      
      const finalDescription = addMode === 'new' && newProduct.activeIngredient 
        ? `Hoạt chất: ${newProduct.activeIngredient} - Chuẩn VietGAP. ${newProduct.description || ''}`
        : newProduct.description || '';

      const productToAdd = { 
        ...newProduct, 
        id: productId,
        description: finalDescription
      } as SupplierProduct;

      setProducts([...products, productToAdd]);
      
      if (addMode === 'new' && (newProduct.category === 'Vật tư' || newProduct.category === 'Giống')) {
        const newMaterial: Material = {
          id: `mat_${productId}`,
          name: newProduct.name,
          type: newProduct.category === 'Vật tư' ? 'Phân bón' : 'Khác',
          activeIngredient: newProduct.activeIngredient || 'N/A',
          isVietGAP: true,
          unit: newProduct.unit || 'Gói',
          quantity: 0
        };
        setMaterials([...materials, newMaterial]);
      }

      setProductView('list');
      setNewProduct({ status: 'active', category: 'Vật tư' });
      setAddMode('select');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 flex flex-col fixed h-full z-20`}>
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 font-bold text-lg truncate">
              <Package size={24} className="text-blue-300 shrink-0" />
              <span>Nhà cung cấp</span>
            </div>
          )}
          {!isSidebarOpen && <Package size={24} className="text-blue-300 mx-auto" />}
          <button onClick={toggleSidebar} className="p-1 hover:bg-blue-700 rounded text-blue-200 hidden md:block">
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 flex-1">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700/50 hover:text-white'}`}
            >
              <LayoutDashboard size={20} className="shrink-0" />
              {isSidebarOpen && <span className="font-medium">Tổng quan</span>}
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700/50 hover:text-white'}`}
            >
              <Package size={20} className="shrink-0" />
              {isSidebarOpen && <span className="font-medium">Sản phẩm & Dịch vụ</span>}
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700/50 hover:text-white'}`}
            >
              <ShoppingCart size={20} className="shrink-0" />
              {isSidebarOpen && (
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">Đơn hàng</span>
                  {orders.filter(o => o.status === 'pending').length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {orders.filter(o => o.status === 'pending').length}
                    </span>
                  )}
                </div>
              )}
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-blue-700">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-blue-200 hover:bg-blue-700 hover:text-white`}
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 md:hidden">
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === 'overview' && 'Tổng quan'}
              {activeTab === 'products' && 'Quản lý Sản phẩm & Dịch vụ'}
              {activeTab === 'orders' && 'Quản lý Đơn hàng'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900">{currentUser.name}</span>
              <span className="text-xs text-gray-500">Nhà cung cấp</span>
            </div>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 font-medium">Tổng doanh thu</h3>
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <span className="font-bold">₫</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">17.000.000đ</div>
                  <div className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <span>+12% so với tháng trước</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 font-medium">Đơn hàng mới</h3>
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={20} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</div>
                  <div className="text-sm text-gray-500 mt-2">Đang chờ xử lý</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 font-medium">Sản phẩm đang bán</h3>
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <Package size={20} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{products.filter(p => p.status === 'active').length}</div>
                  <div className="text-sm text-gray-500 mt-2">Trên tổng số {products.length} sản phẩm</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng gần đây</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-sm text-gray-500">
                        <th className="pb-3 font-medium">Mã ĐH</th>
                        <th className="pb-3 font-medium">Khách hàng (HTX)</th>
                        <th className="pb-3 font-medium">Ngày đặt</th>
                        <th className="pb-3 font-medium">Tổng tiền</th>
                        <th className="pb-3 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 font-medium text-gray-900">{order.id}</td>
                          <td className="py-3 text-gray-600">{order.htxName}</td>
                          <td className="py-3 text-gray-600">{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                          <td className="py-3 font-medium text-gray-900">{order.totalAmount.toLocaleString('vi-VN')}đ</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {order.status === 'pending' ? 'Chờ xử lý' :
                               order.status === 'processing' ? 'Đang chuẩn bị' :
                               order.status === 'shipped' ? 'Đang giao' :
                               order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              {productView === 'list' ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm..." 
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button onClick={() => setProductView('add')} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0">
                      <PlusCircle size={20} /> Thêm sản phẩm
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                            <th className="p-4 font-medium">Tên sản phẩm</th>
                            <th className="p-4 font-medium">Danh mục</th>
                            <th className="p-4 font-medium">Giá bán</th>
                            <th className="p-4 font-medium">Tồn kho</th>
                            <th className="p-4 font-medium">Trạng thái</th>
                            <th className="p-4 font-medium text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(product => (
                            <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                              <td className="p-4">
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                              </td>
                              <td className="p-4">
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                  {product.category}
                                </span>
                              </td>
                              <td className="p-4 font-medium text-gray-900">
                                {product.price.toLocaleString('vi-VN')}đ <span className="text-gray-500 font-normal text-sm">/{product.unit}</span>
                              </td>
                              <td className="p-4 text-gray-600">{product.stock}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit size={18} />
                                </button>
                                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1">
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <button onClick={() => setProductView('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <ArrowLeft size={20} />
                    </button>
                    <h3 className="text-xl font-bold text-gray-800">Thêm sản phẩm mới</h3>
                  </div>
                  
                  <form onSubmit={handleAddProduct} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <div className="flex gap-6 mb-4 border-b border-gray-100 pb-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="addMode" checked={addMode === 'select'} onChange={() => { setAddMode('select'); setNewProduct({ status: 'active', category: 'Vật tư' }); }} className="text-blue-600 focus:ring-blue-500 w-4 h-4" />
                            <span className="text-sm font-medium text-gray-700">Chọn từ danh mục VietGAP của HTX</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="addMode" checked={addMode === 'new'} onChange={() => { setAddMode('new'); setNewProduct({ status: 'active', category: 'Vật tư' }); }} className="text-blue-600 focus:ring-blue-500 w-4 h-4" />
                            <span className="text-sm font-medium text-gray-700">Tạo sản phẩm mới</span>
                          </label>
                        </div>
                      </div>

                      {addMode === 'select' ? (
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn vật tư từ danh mục VietGAP</label>
                          <select 
                            required
                            className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => {
                              const mat = materials.find(m => m.id === e.target.value);
                              if (mat) {
                                setNewProduct({
                                  ...newProduct,
                                  name: mat.name,
                                  category: mat.type,
                                  unit: mat.unit,
                                  description: `Hoạt chất: ${mat.activeIngredient} - Chuẩn VietGAP`
                                });
                              }
                            }}
                          >
                            <option value="">-- Chọn vật tư --</option>
                            {materials.filter(m => m.isVietGAP).map(m => (
                              <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                            <input type="text" required value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập tên sản phẩm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                            <select required value={newProduct.category || 'Vật tư'} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500">
                              <option value="Công nghệ">Công nghệ (IoT, Phần mềm)</option>
                              <option value="Vật tư">Vật tư (Phân bón, Thuốc BVTV)</option>
                              <option value="Giống">Giống cây trồng/vật nuôi</option>
                              <option value="Khác">Khác</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label>
                            <input type="text" required value={newProduct.unit || ''} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="VD: Bao 50kg, Chai 1L, Bộ" />
                          </div>
                          {(newProduct.category === 'Vật tư' || newProduct.category === 'Giống') && (
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt chất / Thành phần chính</label>
                              <input type="text" required value={newProduct.activeIngredient || ''} onChange={e => setNewProduct({...newProduct, activeIngredient: e.target.value})} className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="VD: N-P-K, Copper Hydroxide..." />
                            </div>
                          )}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
                            <textarea rows={2} value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="Mô tả chi tiết..." />
                          </div>
                        </>
                      )}
                      
                      {newProduct.name && (
                        <>
                          {addMode === 'select' && (
                            <div className="sm:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                              <h4 className="font-medium text-blue-800 mb-2">Thông tin sản phẩm</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm text-blue-900">
                                <div><span className="text-blue-700">Tên:</span> {newProduct.name}</div>
                                <div><span className="text-blue-700">Danh mục:</span> {newProduct.category}</div>
                                <div><span className="text-blue-700">Đơn vị:</span> {newProduct.unit}</div>
                                <div className="col-span-2"><span className="text-blue-700">Mô tả:</span> {newProduct.description}</div>
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                            <input 
                              type="number" 
                              required
                              min="0"
                              value={newProduct.price || ''}
                              onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                              className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="VD: 250000"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                            <input 
                              type="number" 
                              required
                              min="0"
                              value={newProduct.stock || ''}
                              onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                              className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="VD: 100"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select 
                              value={newProduct.status}
                              onChange={e => setNewProduct({...newProduct, status: e.target.value as 'active' | 'inactive'})}
                              className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="active">Đang bán</option>
                              <option value="inactive">Ngừng bán</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button type="button" onClick={() => setProductView('list')} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
                      <button type="submit" disabled={!newProduct.name} className="px-5 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm">Lưu sản phẩm</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['Tất cả', 'Chờ xử lý', 'Đang chuẩn bị', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((status, idx) => (
                  <button key={idx} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                    {status}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-gray-900">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status === 'pending' ? 'Chờ xử lý' :
                             order.status === 'processing' ? 'Đang chuẩn bị' :
                             order.status === 'shipped' ? 'Đang giao' :
                             order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar size={14} /> {new Date(order.date).toLocaleDateString('vi-VN')}
                          <span className="mx-1">•</span>
                          <Building size={14} /> {order.htxName}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Xác nhận đơn
                          </button>
                        )}
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                          <Eye size={16} /> Chi tiết
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-600">{item.quantity}x</span>
                            <span className="text-gray-800">{item.productName}</span>
                          </div>
                          <span className="text-gray-600">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Tổng thanh toán:</span>
                      <span className="text-lg font-bold text-blue-600">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CustomerDashboardScreen({ currentUser, onLogout, zones }: { currentUser: {name: string}, onLogout: () => void, zones: PlantingZone[] }) {
  const [selectedZone, setSelectedZone] = useState<PlantingZone | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-amber-600 text-white p-4 sticky top-0 z-10 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User size={24} />
          <h1 className="text-xl font-bold">Khách hàng</h1>
        </div>
        <button onClick={onLogout} className="p-2 hover:bg-amber-700 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </header>
      
      <main className="p-6 max-w-[1600px] mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Xin chào, {currentUser.name}!</h2>
          <p className="text-gray-600">Khám phá vùng trồng và đặt hàng nông sản trực tiếp từ HTX.</p>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapIcon size={24} className="text-amber-600" /> Bản đồ Vùng trồng
        </h3>
        
        <div className="grid gap-4 mb-8">
          {zones.map(zone => (
            <div key={zone.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Cây trồng: {zone.cropType}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">{zone.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
                  className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                >
                  {selectedZone?.id === zone.id ? 'Ẩn bản đồ' : 'Xem bản đồ & Đặt hàng'}
                </button>
              </div>
              
              {selectedZone?.id === zone.id && zone.lots.some(l => l.latLngs) && (
                <div className="mt-4">
                  <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200 mb-4">
                    <MapContainer 
                      center={zone.lots.find(l => l.latLngs)?.latLngs?.[0] || [10.5, 107.4]} 
                      zoom={16} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <LayersControl position="topright">
                        <LayersControl.BaseLayer name="Bản đồ đường phố">
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maxZoom={22}
                            maxNativeZoom={19}
                          />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer checked name="Bản đồ vệ tinh">
                          <TileLayer
                            attribution='&copy; <a href="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}">Esri</a>'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            maxZoom={22}
                            maxNativeZoom={19}
                          />
                        </LayersControl.BaseLayer>
                      </LayersControl>
                      {zone.lots.map(lot => lot.latLngs && (
                        <Polygon key={lot.id} positions={lot.latLngs} color="#10b981" fillColor="#10b981" fillOpacity={0.4}>
                          <Popup>
                            <div className="font-bold">{lot.name}</div>
                            <div className="mb-2">Diện tích: {lot.area} ha</div>
                          </Popup>
                        </Polygon>
                      ))}
                    </MapContainer>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-2">
                      <Package size={20} /> Đặt hàng thu hoạch
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function AdminDashboardScreen({ currentUser, onLogout, onNavigate, farmers, zones, logs }: { currentUser: {name: string}, onLogout: () => void, onNavigate: (screen: 'landing' | 'register' | 'onboard' | 'admin' | 'admin_land' | 'admin_farmer' | 'admin_report' | 'admin_material' | 'admin_process' | 'admin_harvest' | 'login' | 'app') => void, farmers: Farmer[], zones: PlantingZone[], logs: FarmLog[] }) {
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
      
      <main className="p-6 max-w-[1600px] mx-auto">
        <Breadcrumb />
        <WeatherWidget />
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
          <div onClick={() => onNavigate('admin_process')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Settings size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors">Quản lý Quy trình</h3>
            <p className="text-sm text-gray-500">Cấu hình các bước nhật ký canh tác cho nông dân.</p>
          </div>
          <div onClick={() => onNavigate('admin_farmer')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <User size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">Quản lý Nông dân</h3>
            <p className="text-sm text-gray-500">Thêm, sửa, xóa tài khoản nông dân và phân công lô đất.</p>
          </div>
          <div onClick={() => onNavigate('admin_land')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors">Quản lý Mã vùng trồng</h3>
            <p className="text-sm text-gray-500">Thiết lập bản đồ, chia lô và theo dõi trạng thái canh tác.</p>
          </div>
          <div onClick={() => onNavigate('admin_report')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">Báo cáo tổng hợp</h3>
            <p className="text-sm text-gray-500">Xem thống kê nhật ký canh tác và sự cố từ tất cả nông dân.</p>
          </div>
          <div onClick={() => onNavigate('admin_material')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-stone-300 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-stone-600 group-hover:text-white transition-colors">
              <Package size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-stone-700 transition-colors">Quản lý Vật tư</h3>
            <p className="text-sm text-gray-500">Theo dõi kho phân bón, thuốc trừ sâu và vật tư nông nghiệp.</p>
          </div>
          <div onClick={() => onNavigate('admin_harvest')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Sprout size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">Quản lý Thu hoạch</h3>
            <p className="text-sm text-gray-500">Ghi nhận thu hoạch và truy xuất nguồn gốc.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export interface Plant {
  id: string;
  varietyName: string;
  plantCode: string;
  qrCode: string;
  latLng: [number, number];
}

export interface LandLot {
  id: string;
  name: string;
  area: number;
  coordinates: string;
  center: { x: number, y: number };
  latLngs?: [number, number][];
  plants?: Plant[];
}

interface PlantingZone {
  id: string;
  cropType: string;
  name: string;
  lots: LandLot[];
}

const MOCK_EXTRACTED_LOTS: LandLot[] = [
  { id: 'l1', name: 'Lô 1', area: 1.2, coordinates: '10,10 90,10 90,60 10,60', center: {x: 50, y: 35}, latLngs: [[10.500, 107.400], [10.501, 107.400], [10.501, 107.401], [10.500, 107.401]] },
  { id: 'l2', name: 'Lô 2', area: 0.8, coordinates: '100,10 180,10 180,60 100,60', center: {x: 140, y: 35}, latLngs: [[10.500, 107.402], [10.501, 107.402], [10.501, 107.403], [10.500, 107.403]] },
  { id: 'l3', name: 'Lô 3', area: 1.5, coordinates: '10,70 180,70 180,140 10,140', center: {x: 95, y: 105}, latLngs: [[10.498, 107.400], [10.499, 107.400], [10.499, 107.403], [10.498, 107.403]] },
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

      <main className="p-4 max-w-[1600px] mx-auto">
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

function MapEvents({ onClick }: { onClick: (e: any) => void }) {
  useMapEvents({
    click: onClick,
  });
  return null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

function LotDetailManagementScreen({ zone, lot, onBack, onUpdateLot, farmers, currentUser }: { zone: PlantingZone, lot: LandLot, onBack: () => void, onUpdateLot: (updatedLot: LandLot) => void, farmers: Farmer[], currentUser: {name: string, role?: string} }) {
  const [plants, setPlants] = useState<Plant[]>(lot.plants || []);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [newPlant, setNewPlant] = useState({ varietyName: zone.cropType, plantCode: '', latLng: [0, 0] as [number, number] });
  const [mapCenter, setMapCenter] = useState<[number, number]>(lot.latLngs?.[0] || [10.5, 107.4]);
  const [previewPlant, setPreviewPlant] = useState<Plant | null>(null);

  const owner = farmers.find(f => f.managedLot === lot.id)?.fullName || 'Chưa có chủ sở hữu';
  const htxName = currentUser.name;

  const handleMapClick = (e: any) => {
    if (isAddingPlant) {
      setNewPlant({ ...newPlant, latLng: [e.latlng.lat, e.latlng.lng] });
    }
  };

  const handleAddPlant = () => {
    if (!newPlant.plantCode) return;
    const plant: Plant = {
      id: Date.now().toString(),
      varietyName: newPlant.varietyName,
      plantCode: newPlant.plantCode,
      qrCode: `QR-${newPlant.plantCode}-${Date.now()}`,
      latLng: newPlant.latLng
    };
    const updatedPlants = [...plants, plant];
    setPlants(updatedPlants);
    onUpdateLot({ ...lot, plants: updatedPlants });
    setIsAddingPlant(false);
    setNewPlant({ varietyName: zone.cropType, plantCode: '', latLng: [0, 0] });
  };

  const handleDeletePlant = (id: string) => {
    const updatedPlants = plants.filter(p => p.id !== id);
    setPlants(updatedPlants);
    onUpdateLot({ ...lot, plants: updatedPlants });
  };

  const handlePrintQR = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quản lý lô: {lot.name}</h2>
          <p className="text-sm text-gray-500">Vùng trồng: {zone.name} • Diện tích: {lot.area} ha</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Bản đồ quy hoạch cây trồng</h3>
            <button 
              onClick={() => setIsAddingPlant(!isAddingPlant)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${isAddingPlant ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
            >
              {isAddingPlant ? <><X size={16} /> Hủy thêm</> : <><Plus size={16} /> Thêm cây</>}
            </button>
          </div>
          
          {isAddingPlant && (
            <div className="p-3 bg-blue-50 border-b border-blue-100 text-blue-800 text-sm flex items-start gap-2">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Chế độ thêm cây trồng</p>
                <p>1. Click vào bản đồ để chọn vị trí cây.</p>
                <p>2. Nhập thông tin cây ở cột bên phải.</p>
              </div>
            </div>
          )}

          <div className="h-[70vh] min-h-[500px] w-full relative">
            <MapContainer 
              center={mapCenter} 
              zoom={18} 
              style={{ height: '100%', width: '100%' }}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer name="Bản đồ đường phố">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={22}
                    maxNativeZoom={19}
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer checked name="Bản đồ vệ tinh">
                  <TileLayer
                    attribution='&copy; <a href="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}">Esri</a>'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={22}
                    maxNativeZoom={19}
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              <MapEvents onClick={handleMapClick} />
              
              {lot.latLngs && (
                <Polygon positions={lot.latLngs} color="#10b981" fillColor="#10b981" fillOpacity={0.1} weight={2} />
              )}

              {plants.map(plant => (
                <Marker key={plant.id} position={plant.latLng}>
                  <Popup>
                    <div className="font-bold text-emerald-800">{plant.plantCode}</div>
                    <div className="text-sm mb-1">Giống: {plant.varietyName}</div>
                    <div className="text-xs text-gray-500 mb-2 break-all">QR: {plant.qrCode}</div>
                    <button 
                      onClick={() => handleDeletePlant(plant.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Xóa cây này
                    </button>
                  </Popup>
                </Marker>
              ))}

              {isAddingPlant && newPlant.latLng[0] !== 0 && (
                <Marker position={newPlant.latLng} opacity={0.6}>
                  <Popup>Vị trí đang chọn</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        <div className="space-y-6">
          {isAddingPlant && newPlant.latLng[0] !== 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-200">
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Sprout size={20} /> Thông tin cây mới
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên giống</label>
                  <input 
                    type="text" 
                    value={newPlant.varietyName}
                    onChange={e => setNewPlant({...newPlant, varietyName: e.target.value})}
                    className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã số cây <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={newPlant.plantCode}
                    onChange={e => setNewPlant({...newPlant, plantCode: e.target.value})}
                    placeholder="VD: SR-001"
                    className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="pt-2">
                  <button 
                    onClick={handleAddPlant}
                    disabled={!newPlant.plantCode}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lưu cây trồng
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>Danh sách cây ({plants.length})</span>
            </h3>
            
            {plants.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                Chưa có cây nào trong lô này.<br/>Nhấn "Thêm cây" để bắt đầu quy hoạch.
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {plants.map(plant => (
                  <div key={plant.id} className="p-3 border border-gray-100 rounded-lg hover:border-emerald-200 transition-colors bg-gray-50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-emerald-700">{plant.plantCode}</span>
                      <button 
                        onClick={() => handleDeletePlant(plant.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Giống: {plant.varietyName}</div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="bg-white p-1 rounded border border-gray-200 flex-shrink-0">
                          <QRCodeSVG value={plant.qrCode} size={40} />
                        </div>
                        <div className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded truncate min-w-0" title={plant.qrCode}>
                          {plant.qrCode}
                        </div>
                      </div>
                      <button 
                        onClick={() => setPreviewPlant(plant)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 flex-shrink-0"
                      >
                        <ScanLine size={12} /> Xem & In QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Preview Modal */}
      {previewPlant && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Xem trước mã QR</h3>
              <button onClick={() => setPreviewPlant(null)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center bg-gray-50 print:bg-white print:p-0">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center print:shadow-none print:border-none print:p-4 w-full">
                <h4 className="font-bold text-xl text-gray-900 mb-1">{previewPlant.plantCode}</h4>
                <p className="text-sm font-medium text-emerald-700 mb-4">{previewPlant.varietyName}</p>
                
                <div className="bg-white p-2 inline-block rounded-lg border border-gray-100 mb-4">
                  <QRCodeSVG value={previewPlant.qrCode} size={200} />
                </div>
                
                <div className="text-left text-sm text-gray-700 space-y-1 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-200">
                  <p><span className="text-gray-500">Lô:</span> <span className="font-medium">{lot.name}</span></p>
                  <p><span className="text-gray-500">Chủ sở hữu:</span> <span className="font-medium">{owner}</span></p>
                  <p><span className="text-gray-500">Vùng trồng:</span> <span className="font-medium">{zone.name} ({zone.id})</span></p>
                  <p><span className="text-gray-500">HTX:</span> <span className="font-medium">{htxName}</span></p>
                </div>
                <p className="text-xs text-gray-400 mt-4 font-mono">{previewPlant.qrCode}</p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex gap-3 print:hidden">
              <button 
                onClick={() => setPreviewPlant(null)}
                className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={handlePrintQR}
                className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} /> In mã QR này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawMapScreen({ onSave, onCancel }: { onSave: (lots: LandLot[]) => void, onCancel: () => void }) {
  const [lots, setLots] = useState<LandLot[]>([]);
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.5, 107.4]);
  const [isLocating, setIsLocating] = useState(false);

  const handleMapClick = (e: any) => {
    setCurrentPoints([...currentPoints, [e.latlng.lat, e.latlng.lng]]);
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      setIsLocating(false);
    }
  };

  const calculateCurrentArea = (points: [number, number][]) => {
    if (points.length < 3) return 0;
    try {
      // turf expects [longitude, latitude]
      const coordinates = points.map(p => [p[1], p[0]]);
      // Close the polygon
      coordinates.push(coordinates[0]);
      const poly = turfPolygon([coordinates]);
      return turfArea(poly); // returns area in square meters
    } catch (e) {
      return 0;
    }
  };

  const handleFinishLot = () => {
    if (currentPoints.length < 3) {
      alert("Cần ít nhất 3 điểm để tạo thành một lô đất.");
      return;
    }
    
    const areaSqMeters = calculateCurrentArea(currentPoints);
    const areaHectares = areaSqMeters / 10000;
    
    const newLot: LandLot = {
      id: `lot_${Date.now()}`,
      name: `Lô ${lots.length + 1}`,
      area: parseFloat(areaHectares.toFixed(2)),
      coordinates: currentPoints.map(p => `${p[0]},${p[1]}`).join(' '),
      center: { x: currentPoints[0][0], y: currentPoints[0][1] },
      latLngs: currentPoints
    };
    
    setLots([...lots, newLot]);
    setCurrentPoints([]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Vẽ bản đồ thủ công</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleGetLocation}
            disabled={isLocating}
            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2 text-sm"
          >
            {isLocating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
            Định vị GPS
          </button>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm mb-4">Nhấn vào bản đồ để thêm các điểm góc ranh của lô đất. Cần ít nhất 3 điểm để tạo thành một lô.</p>
      
      <div className="h-[70vh] min-h-[500px] w-full rounded-xl overflow-hidden border border-gray-200 mb-4 relative">
        <MapContainer 
          center={mapCenter} 
          zoom={16} 
          style={{ height: '100%', width: '100%' }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer name="Bản đồ đường phố">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={22}
                maxNativeZoom={19}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked name="Bản đồ vệ tinh">
              <TileLayer
                attribution='&copy; <a href="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={22}
                maxNativeZoom={19}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <MapUpdater center={mapCenter} />
          <MapEvents onClick={handleMapClick} />
          
          {/* Render completed lots */}
          {lots.map(lot => lot.latLngs && (
            <Polygon key={lot.id} positions={lot.latLngs} color="#10b981" fillColor="#10b981" fillOpacity={0.4}>
              <Popup>{lot.name}</Popup>
            </Polygon>
          ))}
          
          {/* Render current drawing polygon */}
          {currentPoints.length > 0 && (
            <Polygon positions={currentPoints} color="#3b82f6" fillColor="#3b82f6" fillOpacity={0.4} dashArray="5, 5" />
          )}
          
          {/* Render current points as markers */}
          {currentPoints.map((p, i) => (
            <Marker key={i} position={p} />
          ))}
        </MapContainer>
        
        {/* Drawing Controls Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-white p-2 rounded-xl shadow-lg border border-gray-200 flex gap-2 items-center">
          {currentPoints.length >= 3 && (
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100 whitespace-nowrap">
              Diện tích: {(calculateCurrentArea(currentPoints) / 10000).toFixed(2)} ha ({(calculateCurrentArea(currentPoints)).toFixed(0)} m²)
            </div>
          )}
          <button
            onClick={() => setCurrentPoints(currentPoints.slice(0, -1))}
            disabled={currentPoints.length === 0}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
          >
            Xóa điểm cuối
          </button>
          <button
            onClick={handleFinishLot}
            disabled={currentPoints.length < 3}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
          >
            Hoàn thành lô này
          </button>
        </div>
      </div>

      {lots.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-2">Các lô đã vẽ ({lots.length}):</h3>
          <div className="flex flex-wrap gap-2">
            {lots.map(lot => (
              <div key={lot.id} className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                {lot.name}
                <button 
                  onClick={() => setLots(lots.filter(l => l.id !== lot.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button 
          onClick={onCancel}
          className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
        >
          Hủy
        </button>
        <button 
          onClick={() => onSave(lots)}
          disabled={lots.length === 0}
          className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          Lưu bản đồ ({lots.length} lô)
        </button>
      </div>
    </div>
  );
}

function LandManagementScreen({ onBack, zones, setZones, farmers, currentUser }: { onBack: () => void, zones: PlantingZone[], setZones: (z: PlantingZone[]) => void, farmers: Farmer[], currentUser: {name: string, role?: string} }) {
  const [view, setView] = useState<'list' | 'add_info' | 'add_upload' | 'add_extracting' | 'add_preview' | 'lot_detail' | 'add_draw_map'>('list');
  const [newZone, setNewZone] = useState({ cropType: 'Sầu riêng', name: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);

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

      <main className="p-4 max-w-[1600px] mx-auto">
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
                      <div className="flex flex-col gap-2 mb-4">
                        {zone.lots.map(lot => (
                          <div key={lot.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <span className="text-gray-700 text-sm font-medium">
                              {lot.name} ({lot.area} ha)
                            </span>
                            <button
                              onClick={() => {
                                setSelectedZoneId(zone.id);
                                setSelectedLotId(lot.id);
                                setView('lot_detail');
                              }}
                              className="text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Quản lý chi tiết
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setSelectedZoneId(selectedZoneId === zone.id ? null : zone.id)}
                        className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center gap-1"
                      >
                        <MapIcon size={16} /> {selectedZoneId === zone.id ? 'Ẩn bản đồ' : 'Xem bản đồ vùng trồng'}
                      </button>
                      
                      {selectedZoneId === zone.id && zone.lots.some(l => l.latLngs) && (
                        <div className="mt-4 h-[500px] w-full rounded-lg overflow-hidden border border-gray-200">
                          <MapContainer 
                            center={zone.lots.find(l => l.latLngs)?.latLngs?.[0] || [10.5, 107.4]} 
                            zoom={16} 
                            style={{ height: '100%', width: '100%' }}
                          >
                            <LayersControl position="topright">
                              <LayersControl.BaseLayer name="Bản đồ đường phố">
                                <TileLayer
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  maxZoom={22}
                                  maxNativeZoom={19}
                                />
                              </LayersControl.BaseLayer>
                              <LayersControl.BaseLayer checked name="Bản đồ vệ tinh">
                                <TileLayer
                                  attribution='&copy; <a href="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}">Esri</a>'
                                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                  maxZoom={22}
                                  maxNativeZoom={19}
                                />
                              </LayersControl.BaseLayer>
                            </LayersControl>
                            {zone.lots.map(lot => lot.latLngs && (
                              <Polygon key={lot.id} positions={lot.latLngs} color="#10b981" fillColor="#10b981" fillOpacity={0.4}>
                                <Popup>
                                  <div className="font-bold">{lot.name}</div>
                                  <div className="mb-2">Diện tích: {lot.area} ha</div>
                                  <button
                                    onClick={() => {
                                      setSelectedZoneId(zone.id);
                                      setSelectedLotId(lot.id);
                                      setView('lot_detail');
                                    }}
                                    className="w-full bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-emerald-700"
                                  >
                                    Quản lý chi tiết
                                  </button>
                                </Popup>
                              </Polygon>
                            ))}
                          </MapContainer>
                        </div>
                      )}
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
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 mb-4"
            >
              Xử lý & Trích xuất toạ độ
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <button
              onClick={() => setView('add_draw_map')}
              className="w-full bg-white text-emerald-700 border border-emerald-300 py-3 rounded-xl font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <MapIcon size={20} /> Vẽ bản đồ thủ công
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

        {view === 'add_draw_map' && (
          <DrawMapScreen 
            onCancel={() => setView('add_upload')}
            onSave={(lots) => {
              const zone: PlantingZone = {
                id: Date.now().toString(),
                cropType: newZone.cropType,
                name: newZone.name,
                lots: lots
              };
              setZones([...zones, zone]);
              setView('list');
              setNewZone({ cropType: 'Sầu riêng', name: '' });
            }}
          />
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

        {view === 'lot_detail' && selectedZoneId && selectedLotId && (
          <LotDetailManagementScreen 
            zone={zones.find(z => z.id === selectedZoneId)!}
            lot={zones.find(z => z.id === selectedZoneId)!.lots.find(l => l.id === selectedLotId)!}
            onBack={() => setView('list')}
            farmers={farmers}
            currentUser={currentUser}
            onUpdateLot={(updatedLot) => {
              setZones(zones.map(z => {
                if (z.id === selectedZoneId) {
                  return {
                    ...z,
                    lots: z.lots.map(l => l.id === selectedLotId ? updatedLot : l)
                  };
                }
                return z;
              }));
            }}
          />
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

      <main className="p-4 max-w-[1600px] mx-auto">
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
                      <div className="flex flex-col gap-1 items-start">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">{log.lot}</span>
                        {log.plantCode && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <TreePine size={12} /> {log.plantCode}
                          </span>
                        )}
                      </div>
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

      <main className="p-4 max-w-[1600px] mx-auto">
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

function MaterialManagementScreen({ onBack, materials, setMaterials }: { onBack: () => void, materials: Material[], setMaterials: React.Dispatch<React.SetStateAction<Material[]>> }) {
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

      <main className="p-4 max-w-[1600px] mx-auto">
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
      <main className="p-4 max-w-[1600px] mx-auto">
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
              {log.plantCode && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <TreePine size={14} /> Cây: {log.plantCode}
                </span>
              )}
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
      <main className="p-4 max-w-[1600px] mx-auto">
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