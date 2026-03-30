import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Mail, Lock, Building, Users, FileText, CheckCircle, XCircle, Eye, Settings, UploadCloud, Save, X, Activity, FileCheck, MapPin, Calendar, Download, Map, Search, Plus, Trash2, Edit2, Globe, Send, FilePlus } from 'lucide-react';

export function SysAdminLoginScreen({ onBack, onLoginSuccess }: { onBack: () => void, onLoginSuccess: (user: {name: string, role: string}) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({ name: 'Quản trị viên Hệ thống', role: 'sysadmin' });
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
          <div className="bg-slate-100 p-4 rounded-full text-slate-700">
            <ShieldCheck size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Quản trị Hệ thống</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Đăng nhập dành cho Admin Open Farm</p>
        
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
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                placeholder="admin@openfarm.vn"
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
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-900 active:bg-black transition-colors mt-6"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export function SysAdminApp({ currentUser, onLogout }: { currentUser: {name: string}, onLogout: () => void }) {
  const [htxs, setHtxs] = useState([
    { 
      id: '1', 
      name: 'HTX Nông Nghiệp Xanh', 
      representative: 'Nguyễn Văn A', 
      phone: '0901234567', 
      email: 'contact@htxxanh.vn',
      address: 'Xã Tân Bình, Huyện Châu Thành, Tỉnh Đồng Tháp',
      registrationDate: '2026-03-15',
      status: 'approved', 
      farmers: 45, 
      area: '120 ha', 
      activeLogs: 124,
      documents: [
        { name: 'Giấy phép kinh doanh.pdf', type: 'pdf', size: '2.4 MB' },
        { name: 'Danh sách thành viên ban đầu.xlsx', type: 'excel', size: '1.1 MB' }
      ],
      zones: [
        {
          id: 'z1',
          name: 'Vùng trồng Sầu riêng Ri6 - Mã: VN-DT-001',
          area: '50 ha',
          mapImage: 'https://picsum.photos/seed/map1/800/400',
          certificate: { name: 'GCN_QSDD_VN-DT-001.pdf', size: '3.5 MB' }
        },
        {
          id: 'z2',
          name: 'Vùng trồng Sầu riêng Thái - Mã: VN-DT-002',
          area: '70 ha',
          mapImage: 'https://picsum.photos/seed/map2/800/400',
          certificate: { name: 'GCN_QSDD_VN-DT-002.pdf', size: '4.1 MB' }
        }
      ]
    },
    { 
      id: '2', 
      name: 'HTX Sầu Riêng Sạch', 
      representative: 'Trần Thị B', 
      phone: '0987654321', 
      email: 'sauriengsach@gmail.com',
      address: 'Xã Long Tiên, Huyện Cai Lậy, Tỉnh Tiền Giang',
      registrationDate: '2026-03-28',
      status: 'pending', 
      farmers: 12, 
      area: '30 ha', 
      activeLogs: 0,
      documents: [
        { name: 'Giấy phép kinh doanh.pdf', type: 'pdf', size: '1.8 MB' },
        { name: 'Cam kết chất lượng.pdf', type: 'pdf', size: '0.5 MB' }
      ],
      zones: [
        {
          id: 'z3',
          name: 'Vùng trồng Sầu riêng - Mã: VN-TG-005',
          area: '30 ha',
          mapImage: 'https://picsum.photos/seed/map3/800/400',
          certificate: { name: 'GCN_QSDD_VN-TG-005.pdf', size: '2.1 MB' }
        }
      ]
    },
    { 
      id: '3', 
      name: 'HTX Trái Cây Miền Tây', 
      representative: 'Lê Văn C', 
      phone: '0912345678', 
      email: 'mientayfruit@yahoo.com',
      address: 'Phường 7, TP. Bến Tre, Tỉnh Bến Tre',
      registrationDate: '2026-02-10',
      status: 'approved', 
      farmers: 80, 
      area: '250 ha', 
      activeLogs: 342,
      documents: [
        { name: 'Giấy phép kinh doanh.pdf', type: 'pdf', size: '3.1 MB' },
        { name: 'Hồ sơ năng lực.pdf', type: 'pdf', size: '5.2 MB' }
      ],
      zones: []
    },
  ]);

  const [vietgapReqs, setVietgapReqs] = useState([
    { id: '1', htxName: 'HTX Nông Nghiệp Xanh', date: '2026-03-25', status: 'reviewing', document: 'HoSo_VietGAP_HTXXanh.pdf', notes: '' },
    { id: '2', htxName: 'HTX Trái Cây Miền Tây', date: '2026-03-20', status: 'approved', document: 'HoSo_VietGAP_MienTay.pdf', notes: 'Đã cấp mã số vùng trồng' },
  ]);

  return (
    <Routes>
      <Route path="/" element={<SysAdminDashboardScreen currentUser={currentUser} onLogout={onLogout} htxs={htxs} setHtxs={setHtxs} vietgapReqs={vietgapReqs} setVietgapReqs={setVietgapReqs} />} />
      <Route path="/htx/:id" element={<SysAdminHTXDetailScreen htxs={htxs} setHtxs={setHtxs} />} />
      <Route path="/materials" element={<SysAdminMaterialsScreen />} />
      <Route path="/maps" element={<SysAdminMapsScreen htxs={htxs} />} />
      <Route path="/vietgap/new" element={<SysAdminVietGAPCreateScreen htxs={htxs} vietgapReqs={vietgapReqs} setVietgapReqs={setVietgapReqs} />} />
    </Routes>
  );
}

export function SysAdminDashboardScreen({ currentUser, onLogout, htxs, setHtxs, vietgapReqs, setVietgapReqs }: any) {
  const [activeTab, setActiveTab] = useState<'htx' | 'vietgap' | 'settings'>('htx');
  const navigate = useNavigate();

  const [viewingHtx, setViewingHtx] = useState<any>(null);
  const [editingVietgap, setEditingVietgap] = useState<any>(null);

  const handleApproveHtx = (id: string) => {
    setHtxs(htxs.map(h => h.id === id ? { ...h, status: 'approved' } : h));
  };

  const handleRejectHtx = (id: string) => {
    setHtxs(htxs.map(h => h.id === id ? { ...h, status: 'rejected' } : h));
  };

  const handleUpdateVietgap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVietgap) return;
    setVietgapReqs(vietgapReqs.map((r: any) => r.id === editingVietgap.id ? editingVietgap : r));
    setEditingVietgap(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-slate-800 text-white p-4 sticky top-0 z-10 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={24} />
          <h1 className="text-xl font-bold">Open Farm Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-300 hidden sm:block">
            Xin chào, <span className="font-bold text-white">{currentUser.name}</span>
          </div>
          <button onClick={onLogout} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors" title="Đăng xuất">
            <Lock size={18} />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto">
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('htx')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${activeTab === 'htx' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Building size={20} />
            Quản lý Hợp tác xã
          </button>
          <button 
            onClick={() => setActiveTab('vietgap')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${activeTab === 'vietgap' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <FileText size={20} />
            Hồ sơ VietGAP & Mã vùng trồng
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Settings size={20} />
            Cấu hình Hệ thống
          </button>
        </div>

        {activeTab === 'htx' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Danh sách Hợp tác xã đăng ký</h2>
              <button onClick={() => navigate('/sysadmin/maps')} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 font-medium transition-colors">
                <Map size={18} />
                Xem bản đồ tổng hợp
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="p-4 font-medium whitespace-nowrap">Tên HTX</th>
                    <th className="p-4 font-medium whitespace-nowrap">Người đại diện</th>
                    <th className="p-4 font-medium whitespace-nowrap">Quy mô</th>
                    <th className="p-4 font-medium whitespace-nowrap">Trạng thái</th>
                    <th className="p-4 font-medium whitespace-nowrap text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {htxs.map((htx) => (
                    <tr key={htx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{htx.name}</td>
                      <td className="p-4 text-gray-600">
                        <div>{htx.representative}</div>
                        <div className="text-xs text-gray-400">{htx.phone}</div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-1"><Users size={14} /> {htx.farmers} nông dân</div>
                        <div className="text-xs text-gray-400">Diện tích: {htx.area}</div>
                      </td>
                      <td className="p-4">
                        {htx.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle size={12} /> Đã duyệt
                          </span>
                        ) : htx.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle size={12} /> Đã từ chối
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Eye size={12} /> Chờ duyệt
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <button onClick={() => navigate(`/sysadmin/htx/${htx.id}`)} className="text-sm text-slate-600 hover:text-slate-900 font-medium underline flex items-center gap-1">
                            <Eye size={16} /> Chi tiết
                          </button>
                          {htx.status === 'pending' && (
                            <>
                              <button onClick={() => handleApproveHtx(htx.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Phê duyệt">
                                <CheckCircle size={18} />
                              </button>
                              <button onClick={() => handleRejectHtx(htx.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Từ chối">
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vietgap' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">Hỗ trợ cấp chứng nhận VietGAP & Mã vùng trồng</h2>
                <p className="text-gray-500 text-sm">Quản lý hồ sơ, tài liệu và hỗ trợ HTX tạo báo cáo chuẩn để xin cấp chứng nhận.</p>
              </div>
              <button onClick={() => navigate('/sysadmin/vietgap/new')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors">
                <FilePlus size={18} />
                Tạo hồ sơ mới
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="p-4 font-medium whitespace-nowrap">Hợp tác xã</th>
                    <th className="p-4 font-medium whitespace-nowrap">Ngày nộp</th>
                    <th className="p-4 font-medium whitespace-nowrap">Hồ sơ đính kèm</th>
                    <th className="p-4 font-medium whitespace-nowrap">Trạng thái</th>
                    <th className="p-4 font-medium whitespace-nowrap text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vietgapReqs.map((req) => (
                    <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{req.htxName}</td>
                      <td className="p-4 text-gray-600">{req.date}</td>
                      <td className="p-4 text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                        <FileText size={16} /> {req.document}
                      </td>
                      <td className="p-4">
                        {req.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle size={12} /> Đã cấp mã
                          </span>
                        ) : req.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle size={12} /> Cần bổ sung
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <Eye size={12} /> Đang thẩm định
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setEditingVietgap(req)}
                          className="text-sm text-slate-600 hover:text-slate-900 font-medium border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Cập nhật hồ sơ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Cấu hình Hệ thống Chung</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <FileCheck size={20} />
                  </div>
                  <h3 className="font-bold text-gray-800">Danh mục Vật tư Chuẩn</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Quản lý danh sách các loại phân bón, thuốc BVTV được phép sử dụng theo chuẩn VietGAP.</p>
                <button onClick={() => navigate('/sysadmin/materials')} className="text-sm font-medium text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 w-full text-center">
                  Quản lý Danh mục
                </button>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Activity size={20} />
                  </div>
                  <h3 className="font-bold text-gray-800">Cấu hình AI Nhận diện</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Thiết lập các tham số cho mô hình AI nhận diện bao bì vật tư và trích xuất sổ đỏ.</p>
                <button className="text-sm font-medium text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 w-full text-center">
                  Cài đặt AI Model
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Update VietGAP Modal */}
      {editingVietgap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-gray-800">Cập nhật Hồ sơ VietGAP</h2>
              <button onClick={() => setEditingVietgap(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateVietgap} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hợp tác xã</label>
                <input type="text" disabled value={editingVietgap.htxName} className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 text-gray-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái thẩm định</label>
                <select 
                  value={editingVietgap.status}
                  onChange={e => setEditingVietgap({...editingVietgap, status: e.target.value})}
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="reviewing">Đang thẩm định</option>
                  <option value="rejected">Yêu cầu bổ sung</option>
                  <option value="approved">Đã cấp mã / Đạt chuẩn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tài liệu đính kèm mới (Tùy chọn)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                  <UploadCloud size={24} className="mx-auto text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Tải lên file PDF hoặc Word</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú / Phản hồi cho HTX</label>
                <textarea 
                  rows={3}
                  value={editingVietgap.notes}
                  onChange={e => setEditingVietgap({...editingVietgap, notes: e.target.value})}
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Nhập ghi chú hoặc yêu cầu bổ sung..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditingVietgap(null)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-2">
                  <Save size={18} /> Lưu cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function SysAdminMapsScreen({ htxs }: any) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const allZones = htxs.flatMap((htx: any) => 
    (htx.zones || []).map((zone: any) => ({
      ...zone,
      htxName: htx.name,
      htxId: htx.id
    }))
  );

  const filteredZones = allZones.filter((zone: any) => 
    zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    zone.htxName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/sysadmin')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Bản đồ Vùng trồng Toàn Hệ thống</h1>
          </div>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Tìm kiếm vùng trồng, HTX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredZones.map((zone: any, index: number) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-gray-100 border-b border-gray-100">
                <img src={zone.mapImage} alt={`Bản đồ ${zone.name}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                  {zone.area}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-1 truncate" title={zone.name}>{zone.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Building size={16} className="shrink-0" />
                  <span className="truncate" title={zone.htxName}>{zone.htxName}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/sysadmin/htx/${zone.htxId}`)} className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors border border-gray-200">
                    Chi tiết HTX
                  </button>
                  <button className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium transition-colors border border-emerald-100 flex items-center justify-center gap-2">
                    <Download size={16} /> Tải bản đồ
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredZones.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
              <Map size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Không tìm thấy bản đồ nào</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export function SysAdminVietGAPCreateScreen({ htxs, vietgapReqs, setVietgapReqs }: any) {
  const navigate = useNavigate();
  const [selectedHtx, setSelectedHtx] = useState('');
  const [regType, setRegType] = useState('vietgap');
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const htx = htxs.find((h: any) => h.id === selectedHtx);
    if (htx) {
      const newReq = {
        id: Date.now().toString(),
        htxName: htx.name,
        date: new Date().toISOString().split('T')[0],
        status: 'reviewing',
        document: `HoSo_${regType.toUpperCase()}_${htx.name.replace(/\s+/g, '')}.pdf`,
        notes: 'Hồ sơ mới tạo'
      };
      setVietgapReqs([newReq, ...vietgapReqs]);
      navigate('/sysadmin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/sysadmin')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Tạo Hồ sơ Đăng ký Mới</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> Thông tin chung
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại hồ sơ đăng ký *</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`border rounded-xl p-4 cursor-pointer transition-all ${regType === 'vietgap' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="regType" value="vietgap" checked={regType === 'vietgap'} onChange={(e) => setRegType(e.target.value)} className="sr-only" />
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={24} className={regType === 'vietgap' ? 'text-blue-600' : 'text-gray-400'} />
                      <div>
                        <p className={`font-bold ${regType === 'vietgap' ? 'text-blue-900' : 'text-gray-700'}`}>Chuẩn VietGAP</p>
                        <p className="text-xs text-gray-500 mt-1">Chứng nhận thực hành nông nghiệp tốt</p>
                      </div>
                    </div>
                  </label>
                  <label className={`border rounded-xl p-4 cursor-pointer transition-all ${regType === 'gacc' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="regType" value="gacc" checked={regType === 'gacc'} onChange={(e) => setRegType(e.target.value)} className="sr-only" />
                    <div className="flex items-center gap-3">
                      <Globe size={24} className={regType === 'gacc' ? 'text-emerald-600' : 'text-gray-400'} />
                      <div>
                        <p className={`font-bold ${regType === 'gacc' ? 'text-emerald-900' : 'text-gray-700'}`}>Mã vùng trồng GACC</p>
                        <p className="text-xs text-gray-500 mt-1">Xuất khẩu thị trường Trung Quốc</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Hợp tác xã *</label>
                <select 
                  required
                  value={selectedHtx}
                  onChange={(e) => setSelectedHtx(e.target.value)}
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn Hợp tác xã --</option>
                  {htxs.filter((h: any) => h.status === 'approved').map((h: any) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Details */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
              <Map size={20} className="text-emerald-600" /> Chi tiết đăng ký
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại cây trồng *</label>
                <input type="text" required placeholder="VD: Sầu riêng, Thanh long..." className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sản lượng dự kiến (tấn/năm) *</label>
                <input type="number" required placeholder="VD: 500" className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn vùng trồng đăng ký *</label>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  {selectedHtx ? (
                    <div className="space-y-2">
                      {htxs.find((h: any) => h.id === selectedHtx)?.zones?.map((zone: any) => (
                        <label key={zone.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                          <span className="font-medium text-gray-700">{zone.name}</span>
                          <span className="text-sm text-gray-500">({zone.area})</span>
                        </label>
                      )) || <p className="text-sm text-gray-500 italic">HTX này chưa có dữ liệu vùng trồng.</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic text-center py-2">Vui lòng chọn Hợp tác xã trước</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <button type="button" onClick={() => navigate('/sysadmin')} className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
              Hủy bỏ
            </button>
            <button type="button" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Save size={18} /> Lưu nháp
            </button>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <Send size={18} /> Kết xuất & Nộp hồ sơ
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export function SysAdminHTXDetailScreen({ htxs, setHtxs }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const htx = htxs.find((h: any) => h.id === id);

  if (!htx) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Không tìm thấy Hợp tác xã</h2>
        <button onClick={() => navigate('/sysadmin')} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900">
          <ArrowLeft size={20} /> Quay lại
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    setHtxs(htxs.map((h: any) => h.id === id ? { ...h, status: 'approved' } : h));
  };

  const handleReject = () => {
    setHtxs(htxs.map((h: any) => h.id === id ? { ...h, status: 'rejected' } : h));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/sysadmin')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Chi tiết Hợp tác xã</h1>
          </div>
          <div className="flex items-center gap-3">
            {htx.status === 'pending' && (
              <>
                <button onClick={handleReject} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 text-sm">
                  Từ chối
                </button>
                <button onClick={handleApprove} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 text-sm">
                  Phê duyệt
                </button>
              </>
            )}
            {htx.status === 'approved' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                <CheckCircle size={16} /> Đã duyệt
              </span>
            )}
            {htx.status === 'rejected' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700">
                <XCircle size={16} /> Đã từ chối
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        {/* Header Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shrink-0">
              <Building size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{htx.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1"><Users size={16} className="text-gray-400" /> {htx.representative}</div>
                <div className="flex items-center gap-1"><Mail size={16} className="text-gray-400" /> {htx.email}</div>
                <div className="flex items-center gap-1"><MapPin size={16} className="text-gray-400" /> {htx.address}</div>
                <div className="flex items-center gap-1"><Calendar size={16} className="text-gray-400" /> Đăng ký: {htx.registrationDate}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Stats & Documents */}
          <div className="space-y-6">
            {htx.status === 'approved' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-blue-600" /> Tổng quan hoạt động
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                    <div className="text-2xl font-bold text-emerald-700">{htx.farmers}</div>
                    <div className="text-sm text-emerald-600">Nông dân</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                    <div className="text-2xl font-bold text-blue-700">{htx.area}</div>
                    <div className="text-sm text-blue-600">Diện tích</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center col-span-2">
                    <div className="text-2xl font-bold text-amber-700">{htx.activeLogs}</div>
                    <div className="text-sm text-amber-600">Nhật ký (7 ngày qua)</div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-slate-600" /> Tài liệu đăng ký
              </h3>
              <div className="space-y-3">
                {htx.documents?.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`p-2 rounded-lg shrink-0 ${doc.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0" title="Tải xuống">
                      <Download size={16} />
                    </button>
                  </div>
                ))}
                {(!htx.documents || htx.documents.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">Chưa có tài liệu đính kèm</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Zones & Maps */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Map size={18} className="text-emerald-600" /> Bản đồ & Giấy chứng nhận QSDĐ
              </h3>
              
              <div className="space-y-8">
                {htx.zones?.map((zone: any) => (
                  <div key={zone.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-800">{zone.name}</h4>
                        <p className="text-sm text-gray-500">Diện tích: {zone.area}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Bản đồ mô phỏng vùng trồng:</p>
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video relative">
                          <img src={zone.mapImage} alt={`Bản đồ ${zone.name}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Giấy chứng nhận QSDĐ:</p>
                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                              <FileCheck size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-900">{zone.certificate.name}</p>
                              <p className="text-xs text-blue-600">{zone.certificate.size}</p>
                            </div>
                          </div>
                          <button className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors" title="Xem chi tiết">
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!htx.zones || htx.zones.length === 0) && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Map size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có dữ liệu vùng trồng</p>
                    <p className="text-sm text-gray-400 mt-1">Hợp tác xã chưa cập nhật bản đồ và giấy chứng nhận.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function SysAdminMaterialsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'fertilizer' | 'pesticide'>('fertilizer');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [materials, setMaterials] = useState([
    { id: '1', type: 'fertilizer', name: 'Phân bón hữu cơ vi sinh Đầu Trâu', activeIngredient: 'Hữu cơ 15%, Vi sinh vật', target: 'Cải tạo đất, cung cấp dinh dưỡng', status: 'active' },
    { id: '2', type: 'fertilizer', name: 'Phân bón lá NPK 20-20-20', activeIngredient: 'N: 20%, P2O5: 20%, K2O: 20%', target: 'Kích thích ra hoa, đậu trái', status: 'active' },
    { id: '3', type: 'fertilizer', name: 'Phân lân nung chảy Văn Điển', activeIngredient: 'P2O5: 15-17%, Ca, Mg, Si', target: 'Bón lót, hạ phèn', status: 'inactive' },
    { id: '4', type: 'pesticide', name: 'Thuốc trừ sâu sinh học Radiant 60SC', activeIngredient: 'Spinetoram 60g/L', target: 'Bọ trĩ, sâu tơ, sâu xanh', status: 'active' },
    { id: '5', type: 'pesticide', name: 'Thuốc trừ bệnh Anvil 5SC', activeIngredient: 'Hexaconazole 50g/L', target: 'Nấm hồng, rỉ sắt, đốm lá', status: 'active' },
    { id: '6', type: 'pesticide', name: 'Thuốc trừ cỏ Glyphosate (Cấm)', activeIngredient: 'Glyphosate', target: 'Cỏ dại', status: 'banned' },
  ]);

  const filteredMaterials = materials.filter(m => 
    m.type === activeTab && 
    (m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem.id) {
      setMaterials(materials.map(m => m.id === editingItem.id ? editingItem : m));
    } else {
      setMaterials([...materials, { ...editingItem, id: Date.now().toString(), type: activeTab }]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vật tư này?')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingItem({ name: '', activeIngredient: '', target: '', status: 'active' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/sysadmin')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Danh mục Vật tư Chuẩn VietGAP</h1>
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 text-sm transition-colors">
            <Plus size={16} /> Thêm vật tư mới
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
            <div className="flex bg-white rounded-xl p-1 border border-gray-200 w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('fertilizer')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'fertilizer' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Phân bón
              </button>
              <button 
                onClick={() => setActiveTab('pesticide')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pesticide' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Thuốc BVTV
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm tên, hoạt chất..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full rounded-xl border-gray-300 border py-2 focus:ring-slate-500 focus:border-slate-500 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium whitespace-nowrap">Tên thương mại</th>
                  <th className="p-4 font-medium whitespace-nowrap">Hoạt chất chính</th>
                  <th className="p-4 font-medium whitespace-nowrap">Đối tượng / Công dụng</th>
                  <th className="p-4 font-medium whitespace-nowrap">Trạng thái</th>
                  <th className="p-4 font-medium whitespace-nowrap text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{item.name}</td>
                    <td className="p-4 text-gray-600 text-sm">{item.activeIngredient}</td>
                    <td className="p-4 text-gray-600 text-sm">{item.target}</td>
                    <td className="p-4">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle size={12} /> Cho phép
                        </span>
                      ) : item.status === 'inactive' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <Activity size={12} /> Hạn chế
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <XCircle size={12} /> Cấm sử dụng
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMaterials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Không tìm thấy vật tư nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingItem.id ? 'Cập nhật Vật tư' : `Thêm ${activeTab === 'fertilizer' ? 'Phân bón' : 'Thuốc BVTV'} mới`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương mại</label>
                <input 
                  type="text" 
                  required
                  value={editingItem.name}
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500" 
                  placeholder="VD: Phân bón NPK..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt chất chính / Thành phần</label>
                <input 
                  type="text" 
                  required
                  value={editingItem.activeIngredient}
                  onChange={e => setEditingItem({...editingItem, activeIngredient: e.target.value})}
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500" 
                  placeholder="VD: N: 20%, P2O5: 20%..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng / Công dụng</label>
                <input 
                  type="text" 
                  required
                  value={editingItem.target}
                  onChange={e => setEditingItem({...editingItem, target: e.target.value})}
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500" 
                  placeholder="VD: Cải tạo đất, trị rầy nâu..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái (Chuẩn VietGAP)</label>
                <select 
                  value={editingItem.status}
                  onChange={e => setEditingItem({...editingItem, status: e.target.value})}
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="active">Cho phép sử dụng</option>
                  <option value="inactive">Hạn chế sử dụng</option>
                  <option value="banned">Cấm sử dụng</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-2">
                  <Save size={18} /> Lưu vật tư
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
