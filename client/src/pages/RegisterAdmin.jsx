import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Lock, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterAdmin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullname: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register-admin', formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            console.error('Registration Error:', err);
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
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white flex flex-col items-center leading-none">
                        AL <span className="text-primary tracking-widest not-italic font-black">QALAM</span>
                    </h1>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mt-12">System Administration Setup</p>
                </div>

                <div className="card-base border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

                    {success ? (
                        <div className="py-40 text-center space-y-24">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto"
                            >
                                <CheckCircle2 size={40} className="text-success" />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-black italic text-white uppercase tracking-tight">Access Granted!</h2>
                                <p className="text-text-secondary text-sm mt-8 font-medium">Administrator account created successfully. Redirecting to portal entrance...</p>
                            </div>
                            <Link to="/login" className="btn-primary py-12 px-24 text-[10px] font-black uppercase tracking-widest inline-flex shadow-lg shadow-primary/20">
                                Manual Entry
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-24">
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        placeholder="Enter Legal Name"
                                        className="input-base w-full pl-44"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Identification</label>
                                <div className="relative group">
                                    <UserPlus className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Set Admin ID"
                                        className="input-base w-full pl-44"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Security Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-16 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Establish Secret Hash"
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
                                    <>INITIALIZE ADMIN <ArrowRight size={18} /></>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-32 pt-24 border-t border-white/5 flex flex-col items-center gap-8">
                        <Link to="/login" className="text-[10px] font-black uppercase text-text-secondary tracking-widest hover:text-primary transition-colors">
                            Already Regulated? Log In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterAdmin;
