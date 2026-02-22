import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Login = ({ onLogin }) => {
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onLogin(data.user.role);
        } catch (err) {
            setError(err.response?.data?.message || 'Authorization Failed');
            console.error('Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-24 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-40">
                    <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-primary/20 mb-24 rotate-3 border-2 border-white/10">
                        <LayoutDashboard size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white flex flex-col items-center leading-none">
                        AL <span className="text-primary tracking-widest not-italic font-black">QALAM</span>
                    </h1>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mt-12">College Union MUSF • Portal Access</p>
                </div>

                <div className="card-base border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

                    <div className="flex p-8 bg-background/50 rounded-xl mb-32 border border-white/5">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 py-12 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${role === 'student' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-12 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-24">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-danger/10 border border-danger/20 p-12 rounded-lg text-danger text-[10px] font-bold uppercase tracking-wider text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                        <div className="space-y-8">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Credentials</label>
                            <div className="relative group">
                                <Mail className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={role === 'admin' ? 'Administrator ID' : 'Roll Number'}
                                    className="input-base w-full pl-44"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="relative group">
                                <Lock className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Secret Key"
                                    className="input-base w-full pl-44"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-16 text-sm font-black italic shadow-xl shadow-primary/20 relative overflow-hidden"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>AUTHORIZE ACCESS <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-32 pt-24 border-t border-white/5 flex flex-col items-center gap-8">
                        <p className="text-[8px] font-black uppercase text-text-secondary tracking-widest">Forgot Access? Consult Rep</p>
                        <div className="flex gap-16 text-[8px] font-black text-primary uppercase underline tracking-widest cursor-pointer">
                            <span>System Status</span>
                            <span>Privacy Policy</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
