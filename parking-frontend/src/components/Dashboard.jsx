import { useEffect, useState, useCallback } from "react"; // Nhớ import useCallback
import api from "../services/api";

const Dashboard = () => {
    const [zones, setZones] = useState([]);
    const [licensePlate, setLicensePlate] = useState("");
    const [ticketId, setTicketId] = useState("");
    const [message, setMessage] = useState("");

    // 1. Dùng useCallback để "đóng gói" hàm fetchZones
    // Giúp hàm này không bị tạo lại mỗi lần render, tránh lỗi useEffect
    const fetchZones = useCallback(async () => {
        try {
            const res = await api.get("/zones");
            setZones(res.data.data || []); 
        } catch (error) {
            console.error("Lỗi tải data", error);
        }
    }, []);

    // Thêm [fetchZones] vào danh sách phụ thuộc
    useEffect(() => {
        fetchZones();
    }, [fetchZones]);

    // 2. Xử lý Xe Vào (Phần của Dũng)
    const handleCheckIn = async (slotId) => {
        if (!licensePlate) return alert("Vui lòng nhập biển số!");
        try {
            await api.post("/tickets", {
                licensePlate: licensePlate,
                vehicleType: "MOTORBIKE", 
                slotId: slotId
            });
            setMessage(`Xe ${licensePlate} đã vào bến thành công!`);
            setLicensePlate("");
            fetchZones(); // Load lại giao diện
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || "Lỗi server"));
        }
    };

    // 3. Xử lý Xe Ra & Tính tiền (Phần của Thành + Vương)
    const handleCheckOut = async () => {
        if (!ticketId) return alert("Nhập mã vé!");
        try {
            const res = await api.post(`/tickets/${ticketId}/exit`);
            const ticket = res.data.data;
            setMessage(`Xe ra thành công! Tổng tiền: ${ticket.totalAmount} VNĐ`);
            setTicketId("");
            fetchZones(); // Load lại slot trống
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || "Lỗi xử lý"));
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Quản lý Bãi xe</h1>
            <h3 style={{ color: "green" }}>{message}</h3>

            <div style={{ display: "flex", gap: "50px" }}>
                {/* Cột trái: Danh sách bãi xe (Hiếu) */}
                <div style={{ flex: 1 }}>
                    <h3>Sơ đồ bãi xe</h3>
                    {zones.map((zone) => (
                        <div key={zone.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
                            <h4>{zone.name} ({zone.vehicleType}) - Trống: {zone.availableSlots}</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                                {zone.slots && zone.slots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        disabled={slot.status === "OCCUPIED"}
                                        onClick={() => handleCheckIn(slot.id)}
                                        style={{
                                            backgroundColor: slot.status === "AVAILABLE" ? "#4CAF50" : "#F44336",
                                            color: "white", padding: "10px", border: "none", cursor: "pointer"
                                        }}
                                    >
                                        {slot.slotNumber} <br/>
                                        <small>{slot.status === "AVAILABLE" ? "Trống" : "Có xe"}</small>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cột phải: Thao tác */}
                <div style={{ width: "300px", borderLeft: "1px solid #eee", paddingLeft: "20px" }}>
                    <div style={{ marginBottom: "30px" }}>
                        <h3>🛵 Xe Vào (Check-in)</h3>
                        <p>1. Nhập biển số bên dưới</p>
                        <p>2. Chọn ô màu XANH bên trái để đỗ</p>
                        <input 
                            type="text" placeholder="Biển số (VD: 59-X1 1234)" 
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value)}
                            style={{ width: "100%", padding: "8px" }}
                        />
                    </div>

                    <hr />

                    <div>
                        <h3>💰 Xe Ra (Check-out)</h3>
                        <input 
                            type="number" placeholder="Nhập ID vé (Ticket ID)" 
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                        />
                        <button 
                            onClick={handleCheckOut}
                            style={{ width: "100%", padding: "10px", backgroundColor: "#2196F3", color: "white", border: "none" }}
                        >
                            Thanh toán & Xuất bến
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;