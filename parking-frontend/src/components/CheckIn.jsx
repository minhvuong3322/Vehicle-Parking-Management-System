import React, { useState, useEffect } from 'react';
import { Bike, Car, Printer, ArrowRight, QrCode, History } from 'lucide-react';
import { ticketsAPI, zonesAPI } from '../services/api';

export default function CheckIn() {
  const [vehicleType, setVehicleType] = useState('MOTORBIKE'); // MOTORBIKE | CAR
  const [plateNumber, setPlateNumber] = useState('');
  const [suggestedSlot, setSuggestedSlot] = useState('A-05');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [stats, setStats] = useState({
    motorbikeCount: 0,
    carCount: 0
  });

  // Lấy vị trí gợi ý khi đổi loại xe
  useEffect(() => {
    const fetchAvailableSlot = async () => {
      try {
        const response = await zonesAPI.getAvailableSlots();
        const data = response.data.data; // API trả về { success, message, data }
        const availableSlots = data.slots || [];
        
        // Lọc slots theo loại xe
        const filteredSlots = availableSlots.filter(slot => {
          if (vehicleType === 'MOTORBIKE') {
            return slot.slotNumber.startsWith('A-');
          } else {
            return slot.slotNumber.startsWith('B-');
          }
        });

        if (filteredSlots.length > 0) {
          setSuggestedSlot(filteredSlots[0].slotNumber);
        } else {
          setSuggestedSlot(vehicleType === 'MOTORBIKE' ? 'A-00' : 'B-00');
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        // Fallback: random slot
        if (vehicleType === 'MOTORBIKE') {
          setSuggestedSlot(`A-${(Math.floor(Math.random() * 20) + 1).toString().padStart(2, '0')}`);
        } else {
          setSuggestedSlot(`B-${(Math.floor(Math.random() * 10) + 1).toString().padStart(2, '0')}`);
        }
      }
    };

    fetchAvailableSlot();
  }, [vehicleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plateNumber) return;

    setIsProcessing(true);

    try {
      // Gọi API tạo ticket với đúng tên field theo backend
      const ticketData = {
        licensePlate: plateNumber,
        vehicleType: vehicleType,
        zoneId: vehicleType === 'MOTORBIKE' ? 1 : 2  // Giả sử zone 1 là xe máy, zone 2 là ô tô
      };

      const response = await ticketsAPI.create(ticketData);
      
      // Lưu thông tin check-in mới nhất
      setLastCheckIn({
        plate: plateNumber,
        type: vehicleType.toLowerCase(),
        slot: response.data.data.slot?.slotNumber || suggestedSlot,
        time: new Date().toLocaleTimeString('vi-VN')
      });

      // Cập nhật stats
      setStats(prev => ({
        ...prev,
        motorbikeCount: vehicleType === 'MOTORBIKE' ? prev.motorbikeCount + 1 : prev.motorbikeCount,
        carCount: vehicleType === 'CAR' ? prev.carCount + 1 : prev.carCount
      }));

      alert(`Đã cấp vé thành công cho xe ${plateNumber}!\nSlot: ${response.data.data.slot?.slotNumber || suggestedSlot}`);
      
      // Reset form
      setPlateNumber('');
      
    } catch (error) {
      console.error('Check-in error:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo vé. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans flex flex-col md:flex-row gap-6">
      
      {/* Cột trái: Form nhập liệu chính */}
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="bg-slate-800 p-6 text-white flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wider">Tiếp Nhận Xe Vào</h1>
              <p className="text-slate-400 text-sm mt-1">Cổng số 1 - Làn kiểm soát số 02</p>
            </div>
            <div className="h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center animate-pulse">
              <div className="h-3 w-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            {/* 1. Chọn loại xe (Big Toggle Buttons) */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setVehicleType('MOTORBIKE')}
                className={`relative h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200
                  ${vehicleType === 'MOTORBIKE' 
                    ? 'bg-blue-50 border-blue-500 shadow-inner ring-2 ring-blue-200 ring-offset-2' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-slate-300'
                  }
                `}
              >
                <Bike size={40} className={vehicleType === 'MOTORBIKE' ? 'text-blue-600' : 'text-slate-400'} />
                <span className={`font-bold text-lg ${vehicleType === 'MOTORBIKE' ? 'text-blue-700' : 'text-slate-500'}`}>
                  Xe Máy
                </span>
                {vehicleType === 'MOTORBIKE' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setVehicleType('CAR')}
                className={`relative h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200
                  ${vehicleType === 'CAR' 
                    ? 'bg-orange-50 border-orange-500 shadow-inner ring-2 ring-orange-200 ring-offset-2' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-slate-300'
                  }
                `}
              >
                <Car size={40} className={vehicleType === 'CAR' ? 'text-orange-600' : 'text-slate-400'} />
                <span className={`font-bold text-lg ${vehicleType === 'CAR' ? 'text-orange-700' : 'text-slate-500'}`}>
                  Ô Tô
                </span>
                {vehicleType === 'CAR' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            </div>

            {/* 2. Nhập biển số & Vị trí gợi ý */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase">Biển số xe (Nhập liền)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    placeholder={vehicleType === 'MOTORBIKE' ? "VD: 59P112345" : "VD: 51A56789"}
                    className="block w-full h-20 px-6 text-4xl font-mono font-bold text-slate-800 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-300 transition-all uppercase tracking-wider"
                    autoFocus
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                    <QrCode size={32} />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <ArrowRight className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-800 font-medium">Hệ thống đề xuất vị trí:</p>
                    <p className="text-xs text-emerald-600">Dựa trên khu vực còn trống gần nhất</p>
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-600 tracking-tighter bg-white px-4 py-1 rounded shadow-sm border border-emerald-100">
                  {suggestedSlot}
                </div>
              </div>
            </div>

            {/* 3. Nút hành động chính */}
            <button
              onClick={handleSubmit}
              disabled={!plateNumber || isProcessing}
              className="w-full h-24 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-sm font-medium">Đang xử lý...</span>
                </div>
              ) : (
                <>
                  <Printer size={48} strokeWidth={1.5} />
                  <div className="text-left">
                    <span className="block text-2xl font-black uppercase tracking-wide">Cấp Vé & Mở Cổng</span>
                    <span className="block text-sm font-medium text-green-100 opacity-90">Nhấn Enter để xác nhận nhanh</span>
                  </div>
                </>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Cột phải: Lịch sử gần nhất & Thông tin phụ */}
      <div className="w-full md:w-80 space-y-6">
        
        {/* Card Lịch sử */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
            <History size={18} className="text-slate-500" />
            <h3 className="font-semibold text-slate-700">Vừa tiếp nhận</h3>
          </div>
          <div className="p-4">
            {lastCheckIn ? (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 animate-fade-in-down">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${lastCheckIn.type === 'motorbike' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                    {lastCheckIn.type === 'motorbike' ? 'XE MÁY' : 'Ô TÔ'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{lastCheckIn.time}</span>
                </div>
                <div className="text-xl font-bold text-slate-800 font-mono mb-1">
                  {lastCheckIn.plate}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ArrowRight size={14} />
                  <span>Vị trí: <strong>{lastCheckIn.slot}</strong></span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm italic">
                Chưa có xe nào check-in trong phiên này.
              </div>
            )}
          </div>
        </div>

        {/* Card Thống kê nhanh */}
        <div className="bg-slate-800 rounded-xl shadow-md p-4 text-white">
          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase text-xs tracking-wider">Thống kê ca làm việc</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><Bike size={16}/> Xe máy vào</span>
              <span className="font-bold text-lg">{stats.motorbikeCount}</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{width: `${Math.min((stats.motorbikeCount / 20) * 100, 100)}%`}}></div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="flex items-center gap-2"><Car size={16}/> Ô tô vào</span>
              <span className="font-bold text-lg">{stats.carCount}</span>
            </div>
             <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full" style={{width: `${Math.min((stats.carCount / 10) * 100, 100)}%`}}></div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

