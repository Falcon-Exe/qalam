import React from 'react';
import {
    LayoutDashboard, Megaphone, Calendar, Wallet,
    BarChart3, Image, ClipboardCheck, MessageSquare,
    Users, LogOut, Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const Sidebar = ({ onSelect, onLogout }) => {
    const location = useLocation();

    const menuItems = [
        { icon: Sparkles, label: 'Home', path: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Megaphone, label: 'Announcements', path: '/announcements' },
        { icon: Calendar, label: 'Events', path: '/events' },
        { icon: Wallet, label: 'Funds', path: '/funds' },
        { icon: BarChart3, label: 'Polls', path: '/polls' },
        { icon: Image, label: 'Gallery', path: '/gallery' },
        { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
        { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
        { icon: Users, label: 'Students', path: '/students' },
    ];

    const handleClick = () => {
        if (onSelect) onSelect();
    };

    return (
        <aside className="w-sidebar h-screen bg-[#0f172a] border-r border-white/5 flex flex-col">
            <div className="h-24 flex items-center px-24 mb-16 border-b border-white/5">
                <Link to="/" className="flex items-center">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mr-16 shadow-lg border border-white/10 p-4">
                        <img src={logo} alt="Al Qalam Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <span className="text-[18px] font-black text-white tracking-tighter block leading-none">AL QALAM</span>
                        <span className="text-[10px] font-black text-primary tracking-[0.3em] mt-2 block uppercase">MUSF UNION</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-16 space-y-8 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path} onClick={handleClick}>
                            <div className={`sidebar-item flex items-center gap-16 px-16 py-12 rounded-lg transition-all duration-200 cursor-pointer ${isActive
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-text-secondary hover:text-white hover:bg-white/5'
                                }`}>
                                <item.icon size={20} className={isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-16 border-t border-white/5">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-16 px-16 py-12 w-full rounded-lg text-danger/80 hover:text-danger hover:bg-danger/5 transition-all text-sm font-medium"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
