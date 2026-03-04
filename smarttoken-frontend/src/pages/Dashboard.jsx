import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CountUp from "react-countup";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import "../styles/Dashboard.css";
import { FaCheck, FaTimes } from "react-icons/fa";

function Dashboard() {

    const [tokens, setTokens] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    const navigate = useNavigate();
    const tokensPerPage = 5;

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
    }, []);
    useEffect(() => {
        fetchTokens();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
    const fetchTokens = async () => {
        try {
            const res = await axios.get(
                "http://localhost:7985/token/all",
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                }
            );

            setTokens(res.data);

        } catch (err) {
            toast.error("Failed to load tokens");
        }
    };

    const generateToken = async () => {
        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:7985/token/generate",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                }
            );

            const newToken = { ...res.data, status: "WAITING" };
            await fetchTokens();

            toast.success("Token Generated 🚀");

        } catch {
            toast.error("Unauthorized ❌");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = (id, newStatus) => {
        setTokens(tokens.map(t =>
            t.id === id ? { ...t, status: newStatus } : t
        ));
    };

    const filteredTokens = useMemo(() => {
        return tokens.filter(t =>
            (statusFilter === "ALL" || t.status === statusFilter) &&
            t.id.toString().includes(search)
        );
    }, [tokens, search, statusFilter]);

    const indexOfLast = currentPage * tokensPerPage;
    const indexOfFirst = indexOfLast - tokensPerPage;
    const currentTokens = filteredTokens.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredTokens.length / tokensPerPage);

    const chartData = [
        { name: "WAITING", value: tokens.filter(t => t.status === "WAITING").length },
        { name: "SERVED", value: tokens.filter(t => t.status === "SERVED").length },
        { name: "CANCELLED", value: tokens.filter(t => t.status === "CANCELLED").length }
    ];

    const confirmAction = (id, status) => {
        setSelectedId(id);
        setSelectedStatus(status);
        setShowModal(true);
    };

    const handleConfirm = () => {
        updateStatus(selectedId, selectedStatus);
        setShowModal(false);
    };

    return (
        <div className={`dashboard ${darkMode ? "dark" : ""}`}>

            {/* Sidebar */}
            <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                <div>
                    <h3>{collapsed ? "ST" : "Smart Token"}</h3>
                    <button
                        className="collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? "➡" : "⬅"}
                    </button>
                </div>

                <div>
                    <button
                        className="toggle-btn"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>

                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main */}
            <div className="main">

                <div className="top">
                    <h2>Dashboard</h2>

                    <button onClick={generateToken}>
                        {loading ? "Generating..." : "Generate Token"}
                    </button>
                </div>

                {/* Animated Counter */}
                <div className="counter-box">
                    <h4>Total Tokens</h4>
                    <h2>
                        <CountUp end={tokens.length} duration={1} />
                    </h2>
                </div>

                {/* Search + Filter */}
                <div className="filters">
                    <input
                        placeholder="Search by ID"
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="ALL">All</option>
                        <option value="WAITING">Waiting</option>
                        <option value="SERVED">Served</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                {/* Table */}
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTokens.map(t => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>
                                    <span className={`badge ${t.status.toLowerCase()}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td>
                                    <td className="action-buttons">

                                        <button
                                            className="serve-btn"
                                            disabled={t.status === "SERVED"}
                                            onClick={() => confirmAction(t.id, "SERVED")}
                                        >
                                            <FaCheck className="icon" />
                                            Serve
                                        </button>

                                        <button
                                            className="cancel-btn"
                                            disabled={t.status === "CANCELLED"}
                                            onClick={() => confirmAction(t.id, "CANCELLED")}
                                        >
                                            <FaTimes className="icon" />
                                            Cancel
                                        </button>

                                    </td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={currentPage === i + 1 ? "active" : ""}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* Chart */}
                <div className="chart-box">
                    <h3>Token Analytics</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h4>Confirm Action</h4>
                        <p>
                            Are you sure you want to mark this token as{" "}
                            <strong>{selectedStatus}</strong>?
                        </p>

                        <div className="modal-buttons">
                            <button className="confirm-btn" onClick={handleConfirm}>
                                Yes
                            </button>

                            <button
                                className="cancel-modal-btn"
                                onClick={() => setShowModal(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;