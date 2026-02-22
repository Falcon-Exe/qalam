import { motion } from 'framer-motion';
import { Shield, Target, Award, Users, GraduationCap, Sparkles, BookOpen, Quote } from 'lucide-react';

const Home = () => {
    const pillars = [
        { icon: <Shield size={24} />, title: "Unity", desc: "Forging unbreakable bonds across the 2022-2026 batch." },
        { icon: <Target size={24} />, title: "Excellence", desc: "Striving for academic and extra-curricular brilliance." },
        { icon: <Sparkles size={24} />, title: "Legacy", desc: "Setting a gold standard for future unions to follow." }
    ];

    const team = [
        { role: "Class Representative", name: "Adarsh S", desc: "Leading with vision and determination." },
        { role: "Treasurer", name: "Sarah John", desc: "Ensuring financial transparency and growth." },
        { role: "Secretary", name: "Rahul Raj", desc: "Organizing success through coordination." }
    ];

    return (
        <div className="space-y-64 pb-64">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden rounded-[40px] border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative text-center z-10 p-32"
                >
                    <div className="inline-flex items-center gap-12 px-16 py-8 rounded-full bg-white/5 border border-white/10 mb-24 backdrop-blur-md">
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Official Class Union Portal</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-24 leading-none">
                        AL <span className="text-primary not-italic">QALAM</span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium italic">
                        "The Pen that writes the future of the 2022-2026 Batch."
                    </p>
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
            <section className="space-y-32">
                <div className="text-center">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">The Three Pillars</h2>
                    <p className="text-text-secondary uppercase tracking-[0.4em] text-[10px] font-black mt-8">Foundations of AL QALAM</p>
                </div>
                <div className="grid md:grid-cols-3 gap-24">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="nav-card text-center p-40 border-white/5 hover:border-primary/20 transition-all"
                        >
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-16 text-primary border border-white/10">
                                {p.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-8 text-white">{p.title}</h3>
                            <p className="text-sm text-text-secondary font-medium">{p.desc}</p>
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

                    <div className="grid md:grid-cols-3 gap-24">
                        {team.map((member, i) => (
                            <div key={i} className="flex gap-16 items-start">
                                <div className="w-2 h-12 bg-primary rounded-full" />
                                <div>
                                    <h4 className="text-white font-black italic uppercase tracking-tight">{member.name}</h4>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-8">{member.role}</p>
                                    <p className="text-xs text-text-secondary font-medium italic">"{member.desc}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Affiliation */}
            <section className="flex flex-col items-center gap-16 text-center pt-32">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="flex items-center gap-16">
                    <Users size={20} className="text-text-secondary" />
                    <span className="text-xs font-black uppercase tracking-[0.5em] text-text-secondary">Affiliated with MUSF UNION</span>
                    <Users size={20} className="text-text-secondary" />
                </div>
                <p className="text-[10px] text-white/20 font-medium">Batch of 2022 • College Union Portal • Vers 1.0.0</p>
            </section>
        </div>
    );
};

export default Home;
