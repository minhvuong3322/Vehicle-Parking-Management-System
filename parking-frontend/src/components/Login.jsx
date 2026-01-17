import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/api";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Lưu thông tin đăng nhập để dùng cho các API sau
        setAuthToken(username, password);
        alert("Đã lưu thông tin đăng nhập! Chuyển sang màn hình chính.");
        navigate("/dashboard");
    };

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>Đăng nhập Hệ thống Bãi xe</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" placeholder="Username (admin)" 
                    onChange={(e) => setUsername(e.target.value)} 
                    style={{ padding: "10px", margin: "5px" }}
                />
                <br />
                <input 
                    type="password" placeholder="Password (admin123)" 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ padding: "10px", margin: "5px" }}
                />
                <br />
                <button type="submit" style={{ padding: "10px 20px" }}>Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;