import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  LogIn, 
  LogOut, 
  Users, 
  LogOut as SignOutIcon, 
  Menu, 
  Car, 
  CreditCard,
  AlertCircle,
  ParkingSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI, zonesAPI, reportsAPI } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalSlots: 0,
    occupiedSlots: 0,
    availableSlots: 0,
    dailyRevenue: '0đ'
  });
  const [user, setUser] = useState(null);

  // Load thông tin user từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Load thống kê từ API
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Lấy thông tin vị trí trống
        const slotsResponse = await zonesAPI.getAvailableSlots();
        const slotsData = slotsResponse.data.data || slotsResponse.data;
        const availableCount = slotsData.total || slotsData.slots?.length || 0;
        
        // Lấy doanh thu ngày
        try {
          const today = new Date().toISOString().split('T')[0];
          const revenueResponse = await reportsAPI.getDailyRevenue(today);
          const revenueData = revenueResponse.data.data || revenueResponse.data;
          const revenue = revenueData.revenue || 0;

          setStats({
            totalSlots: 200,
            occupiedSlots: 200 - availableCount,
            availableSlots: availableCount,
            dailyRevenue: `${revenue.toLocaleString('vi-VN')}đ`
          });
        } catch (revenueError) {
          console.error('Error loading revenue:', revenueError);
          setStats({
            totalSlots: 200,
            occupiedSlots: 200 - availableCount,
            availableSlots: availableCount,
            dailyRevenue: '0đ'
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        // Sử dụng dữ liệu mẫu nếu API lỗi
        setStats({
          totalSlots: 200,
          occupiedSlots: 145,
          availableSlots: 55,
          dailyRevenue: '0đ'
        });
      }
    };

    loadStats();
    // Refresh stats mỗi 30 giây
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Danh sách menu
  const menuItems = [
    { name: 'Tổng quan', icon: <LayoutDashboard size={20} />, path: '/dashboard', active: true },
    { name: 'Sơ đồ bãi xe', icon: <Map size={20} />, path: '/parking-map', active: false },
    { name: 'Xe vào (Check-in)', icon: <LogIn size={20} />, path: '/check-in', active: false },
    { name: 'Xe ra (Check-out)', icon: <LogOut size={20} />, path: '/check-out', active: false },
    { name: 'Quản lý nhân viên', icon: <Users size={20} />, path: '/employees', active: false },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      authAPI.logout();
      navigate('/login');
    }
  };

  // Dữ liệu thống kê hiển thị
  const statsDisplay = [
    { 
      title: 'Tổng vị trí', 
      value: stats.totalSlots.toString(), 
      icon: <ParkingSquare size={28} />, 
      color: 'bg-blue-600', 
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Số xe đang gửi', 
      value: stats.occupiedSlots.toString(), 
      icon: <Car size={28} />, 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    { 
      title: 'Vị trí trống', 
      value: stats.availableSlots.toString(), 
      icon: <AlertCircle size={28} />, 
      color: 'bg-green-500', 
      textColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Doanh thu hôm nay', 
      value: stats.dailyRevenue, 
      icon: <CreditCard size={28} />, 
      color: 'bg-purple-600', 
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col fixed h-full z-20 shadow-xl`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Car size={20} className="text-white" />
            </div>
            {isSidebarOpen && <span className="animate-fade-in">PMS Admin</span>}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 group relative
                ${item.active 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <span className={`${isSidebarOpen ? 'mr-3' : 'mx-auto'}`}>
                {item.icon}
              </span>
              
              {isSidebarOpen && (
                <span className="font-medium text-sm whitespace-nowrap animate-fade-in">
                  {item.name}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {item.name}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Toggle Button (Optional for UX) */}
        <div className="p-4 border-t border-slate-700 flex justify-end">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="p-2 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
           >
             <Menu size={20} />
           </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tổng quan hệ thống</h2>
            <p className="text-xs text-slate-500">Cập nhật lần cuối: 10 phút trước</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700">Xin chào, {user?.username || 'Admin'}</p>
              <p className="text-xs text-slate-500">{user?.role || 'Quản lý cấp cao'}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-100 shadow-sm">
              <Users size={20} className="text-slate-600" />
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
            >
              <SignOutIcon size={18} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsDisplay.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.textColor}`}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder for future content (Charts/Tables) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 h-96 flex flex-col items-center justify-center text-slate-400 border-dashed border-2 border-slate-200">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <LayoutDashboard size={40} className="text-slate-300" />
            </div>
            <p className="font-medium">Khu vực biểu đồ và danh sách xe mới nhất</p>
            <p className="text-sm mt-2">Sẽ được thêm vào trong các bước tiếp theo...</p>
          </div>

        </main>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

