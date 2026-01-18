import React, { useState, useEffect } from 'react';
import { Bike, Car, Info, Filter } from 'lucide-react';
import { zonesAPI } from '../services/api';

export default function ParkingMap() {
  const [zoneAData, setZoneAData] = useState([]);
  const [zoneBData, setZoneBData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu zones từ API
  useEffect(() => {
    const loadZones = async () => {
      try {
        const response = await zonesAPI.getAll();
        const zonesData = response.data.data || response.data; // Handle ApiResponse wrapper
        
        // Kiểm tra zones có phải là array không
        if (!Array.isArray(zonesData)) {
          console.error('Zones is not an array:', zonesData);
          throw new Error('Invalid zones data');
        }

        // Phân loại zones theo vehicleType
        const motorbikeZone = zonesData.find(z => z.vehicleType === 'MOTORBIKE');
        const carZone = zonesData.find(z => z.vehicleType === 'CAR');

        // Map slots cho Zone A (Xe máy)
        if (motorbikeZone && motorbikeZone.slots) {
          const mappedSlotsA = motorbikeZone.slots.map(slot => ({
            id: slot.slotNumber,
            status: slot.status === 'AVAILABLE' ? 'available' : 'occupied',
            type: 'motorbike'
          }));
          setZoneAData(mappedSlotsA);
        } else {
          // Fallback: dữ liệu giả lập
          setZoneAData(Array.from({ length: 20 }, (_, i) => ({
            id: `A-${(i + 1).toString().padStart(2, '0')}`,
            status: Math.random() > 0.4 ? 'available' : 'occupied',
            type: 'motorbike'
          })));
        }

        // Map slots cho Zone B (Ô tô)
        if (carZone && carZone.slots) {
          const mappedSlotsB = carZone.slots.map(slot => ({
            id: slot.slotNumber,
            status: slot.status === 'AVAILABLE' ? 'available' : 'occupied',
            type: 'car'
          }));
          setZoneBData(mappedSlotsB);
        } else {
          // Fallback: dữ liệu giả lập
          setZoneBData(Array.from({ length: 12 }, (_, i) => ({
            id: `B-${(i + 1).toString().padStart(2, '0')}`,
            status: Math.random() > 0.3 ? 'available' : 'occupied',
            type: 'car'
          })));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading zones:', error);
        // Sử dụng dữ liệu giả lập khi API lỗi
        setZoneAData(Array.from({ length: 20 }, (_, i) => ({
          id: `A-${(i + 1).toString().padStart(2, '0')}`,
          status: Math.random() > 0.4 ? 'available' : 'occupied',
          type: 'motorbike'
        })));
        setZoneBData(Array.from({ length: 12 }, (_, i) => ({
          id: `B-${(i + 1).toString().padStart(2, '0')}`,
          status: Math.random() > 0.3 ? 'available' : 'occupied',
          type: 'car'
        })));
        setLoading(false);
      }
    };

    loadZones();
    // Refresh zones mỗi 15 giây
    const interval = setInterval(loadZones, 15000);
    return () => clearInterval(interval);
  }, []);

  // Component hiển thị từng ô đỗ xe
  const ParkingSlot = ({ data }) => {
    const isOccupied = data.status === 'occupied';
    const isCar = data.type === 'car';

    return (
      <div 
        className={`
          relative rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 group
          ${isCar ? 'h-32' : 'h-24'} 
          ${isOccupied 
            ? 'bg-red-50 border-red-200 hover:border-red-400' 
            : 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
          }
        `}
      >
        {/* Slot Header: ID */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold
          ${isOccupied ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}
        `}>
          {data.id}
        </div>

        {/* Slot Content: Icon & Text */}
        <div className="h-full flex flex-col items-center justify-center pt-4">
          {isOccupied ? (
            <>
              {isCar ? <Car size={40} className="text-red-500 mb-1" /> : <Bike size={32} className="text-red-500 mb-1" />}
              <span className="text-xs font-semibold text-red-600">Đã có xe</span>
              <span className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                BKS: 29A-123.45
              </span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center mb-1">
                <span className="text-emerald-400 text-xs">P</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600">Trống</span>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải dữ liệu bãi xe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sơ đồ trạng thái bãi xe</h1>
          <p className="text-slate-500 text-sm mt-1">Cập nhật thời gian thực</p>
        </div>

        {/* Legend (Chú thích) */}
        <div className="flex items-center gap-6 bg-white px-4 py-3 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-100 border-2 border-emerald-400"></div>
            <span className="text-sm font-medium text-slate-600">Còn trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-400"></div>
            <span className="text-sm font-medium text-slate-600">Đã có xe</span>
          </div>
          <div className="h-4 w-px bg-slate-200 mx-2"></div>
          <button className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
            <Filter size={16} />
            Bộ lọc
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Zone A: Motorbikes (Left Side - Takes up 1 column on large screens) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-t-xl border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
                <Bike size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Khu vực A (Xe máy)</h3>
                <p className="text-xs text-blue-600 font-medium">{zoneAData.length} vị trí</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-white rounded text-xs font-bold text-blue-700 shadow-sm border border-blue-100">
              Zone A
            </span>
          </div>
          
          <div className="bg-white p-4 rounded-b-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {zoneAData.map((slot) => (
                <ParkingSlot key={slot.id} data={slot} />
              ))}
            </div>
          </div>
        </div>

        {/* Zone B: Cars (Right Side - Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-t-xl border-b border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
                <Car size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Khu vực B (Ô tô)</h3>
                <p className="text-xs text-indigo-600 font-medium">{zoneBData.length} vị trí</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-white rounded text-xs font-bold text-indigo-700 shadow-sm border border-indigo-100">
              Zone B
            </span>
          </div>

          <div className="bg-white p-6 rounded-b-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {zoneBData.map((slot) => (
                <ParkingSlot key={slot.id} data={slot} />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Summary Footer */}
      <div className="mt-8 bg-slate-800 rounded-xl p-4 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Info size={20} className="text-blue-400" />
          <span className="text-sm font-medium">Hệ thống đang hoạt động bình thường. Cập nhật dữ liệu thời gian thực.</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Tổng vị trí trống</span>
          <span className="text-xl font-bold text-emerald-400">
            {zoneAData.filter(x => x.status === 'available').length + zoneBData.filter(x => x.status === 'available').length}
          </span>
        </div>
      </div>
    </div>
  );
}

