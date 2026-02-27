import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Target, Award, Users, GraduationCap, Sparkles, BookOpen, Quote, ArrowRight, LayoutDashboard } from 'lucide-react';
import logo from '../assets/logo.png';

const Home = ({ user }) => {
    const pillars = [
        { icon: <Shield size={24} />, title: "Unity", desc: "Forging unbreakable bonds across the 2022-2026 batch." },
        { icon: <Target size={24} />, title: "Excellence", desc: "Striving for academic and extra-curricular brilliance." },
        { icon: <Sparkles size={24} />, title: "Legacy", desc: "Setting a gold standard for future unions to follow." }
    ];

    const team = [
        { role: "Chairman", name: "Habeeb", desc: "Leading with vision and determination." },
        { role: "Secretary", name: "Sinan", desc: "Organizing success through coordination." },
        { role: "Tresurer", name: "Shahid", desc: "Ensuring financial transparency and growth." }
    ];

    return (
        <div className="space-y-32 md:space-y-64 -mt-24 md:mt-0">
            {/* Hero Section */}
            <section className="relative min-h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-[24px] md:rounded-[40px] border border-white/5 py-32 px-16">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative text-center z-10 px-8 md:p-32 w-full"
                >
                    <div className="inline-flex items-center gap-8 md:gap-12 px-12 md:px-16 py-6 md:py-8 rounded-full bg-white/5 border border-white/10 mb-16 md:mb-24 backdrop-blur-md">
                        <Sparkles size={12} className="text-primary" />
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-text-secondary">Official Class Union Portal</span>
                    </div>
                    <div className="flex justify-center mb-16 md:mb-24">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 p-4 backdrop-blur-xl">
                            <img src={logo} alt="Al Qalam Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-8xl font-black italic tracking-tighter text-white mb-16 md:mb-24 leading-none">
                        AL <span className="text-primary not-italic">QALAM</span>
                    </h1>
                    <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto font-medium italic mb-24 md:mb-40 px-16">
                        "quality  for Association learning and academic molding"
                    </p>

                    <Link to={user ? "/dashboard" : "/login"}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary py-12 md:py-16 px-24 md:px-40 text-xs md:text-sm font-black italic shadow-2xl shadow-primary/40 mx-auto group"
                        >
                            {user ? <>ENTER PORTAL <LayoutDashboard size={16} className="group-hover:rotate-12 transition-transform" /></> : <>AUTHORIZE ACCESS <ArrowRight size={16} className="group-hover:translate-x-4 transition-transform" /></>}
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -ml-32 -mb-32" />
            </section>

            {/* Vision & Mission */}
            <section className="grid md:grid-cols-2 gap-32">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="card-base bg-gradient-to-br from-card to-background border-white/5 group"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-24 group-hover:bg-primary group-hover:text-white transition-all">
                        <Target size={32} />
                    </div>
                    <h2 className="text-3xl font-black italic mb-16 uppercase tracking-tight text-white">Our Vision</h2>
                    <p className="text-text-secondary leading-relaxed font-medium">
                        To cultivate a revolutionary academic environment where every member of the MUSF union is empowered to innovate, lead, and excel in their respective fields, leaving a lasting mark on the college history.
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="card-base bg-gradient-to-br from-card to-background border-white/5 group"
                >
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-24 group-hover:bg-secondary group-hover:text-white transition-all">
                        <BookOpen size={32} />
                    </div>
                    <h2 className="text-3xl font-black italic mb-16 uppercase tracking-tight text-white">Our Mission</h2>
                    <p className="text-text-secondary leading-relaxed font-medium">
                        To provide a seamless bridge between students and administration, ensuring transparency, fostering unity through cultural and technical exchange, and safeguarding the welfare of every individual in the batch.
                    </p>
                </motion.div>
            </section>

            {/* The Three Pillars */}
            <section className="space-y-24 md:space-y-32">
                <div className="text-center px-16">
                    <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">The Three Pillars</h2>
                    <p className="text-text-secondary uppercase tracking-[0.3em] md:tracking-[0.4em] text-[8px] md:text-[10px] font-black mt-8">Foundations of AL QALAM</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 px-16 md:px-0">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="nav-card text-center p-24 md:p-40 border-white/5 hover:border-primary/20 transition-all"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-16 text-primary border border-white/10">
                                {p.icon}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mb-8 text-white">{p.title}</h3>
                            <p className="text-xs md:text-sm text-text-secondary font-medium">{p.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Meet the Union */}
            <section className="card-base border-white/5 bg-background relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 opacity-10">
                    <Quote size={120} className="text-primary" />
                </div>

                <div className="relative z-10 space-y-40">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">The Union Core</h2>
                        <p className="text-text-secondary uppercase tracking-[0.4em] text-[10px] font-black mt-8">Meet the Representatives</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-32">
                        {team.map((member, i) => (
                            <div key={i} className="flex gap-16 items-start p-16 bg-white/5 md:bg-transparent rounded-2xl border border-white/5 md:border-none">
                                <div className="w-1 h-12 md:w-2 md:h-12 bg-primary rounded-full shrink-0" />
                                <div>
                                    <h4 className="text-white font-black italic uppercase tracking-tight text-sm md:text-base">{member.name}</h4>
                                    <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-4 md:mb-8">{member.role}</p>
                                    <p className="text-[11px] md:text-xs text-text-secondary font-medium italic leading-relaxed">"{member.desc}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Affiliation */}
            <section className="flex flex-col items-center gap-12 md:gap-16 text-center pt-32 px-16">
                <div className="w-24 md:w-12 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    <div className="flex items-center gap-12">
                        <Users size={16} className="text-text-secondary/40" />
                        <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.5em] text-text-secondary">Al Qalam</span>
                        <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.5em] text-text-secondary">Majlis Umariyya Students Federation</span>
                        <Users size={16} className="text-text-secondary/40" />
                    </div>
                </div>
                <p className="text-[8px] md:text-[10px] text-white/10 font-bold uppercase tracking-widest">
                    Majlis Batch 06 • Al Qalam
                </p>
            </section>
        </div>
    );
};

export default Home;
