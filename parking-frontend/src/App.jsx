import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ParkingMap from './components/ParkingMap';
import CheckIn from './components/CheckIn';
import CheckOut from './components/CheckOut';

// Component để bảo vệ các route yêu cầu xác thực
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // Chưa đăng nhập -> chuyển về trang login
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Component để redirect user đã đăng nhập khỏi trang login
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    // Đã đăng nhập -> chuyển về dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route mặc định - chuyển hướng về login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Route công khai - Login */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Route công khai - Register */}
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        
        {/* Các route yêu cầu xác thực */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/parking-map" 
          element={
            <ProtectedRoute>
              <ParkingMap />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/check-in" 
          element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/check-out" 
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          } 
        />
        
        {/* Route không tìm thấy - 404 */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-slate-400 mb-8">Trang không tồn tại</p>
                <a 
                  href="/dashboard" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Về Trang Chủ
                </a>
              </div>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

