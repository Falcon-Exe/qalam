import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Maximize2, Tag, Calendar, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = ({ isAdmin = true }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const images = [
        { id: 1, url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94', event: 'Freshers Day 2025', date: '2025-08-20' },
        { id: 2, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622', event: 'Cultural Fest', date: '2025-11-15' },
        { id: 3, url: 'https://images.unsplash.com/photo-1475721027185-39a1294d55ee', event: 'Tech Seminar', date: '2026-01-10' },
        { id: 4, url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655', event: 'Sports Meet', date: '2026-02-05' },
        { id: 5, url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', event: 'Workshop', date: '2026-02-15' },
        { id: 6, url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644', event: 'Farewell', date: '2025-04-20' }
    ];

    return (
        <div className="space-y-32 mb-32">
            <div className="flex justify-between items-center bg-card p-24 rounded-card border border-white/5">
                <div className="flex items-center gap-16">
                    <div className="p-12 bg-primary/10 rounded-xl text-primary"><ImageIcon size={24} /></div>
                    <div>
                        <h2 className="text-xl font-black">Memory Archive</h2>
                        <p className="text-xs text-text-secondary mt-1 font-medium italic">Capturing our journey since 2022</p>
                    </div>
                </div>
                {isAdmin && <button className="btn-primary py-8 text-xs px-24 font-black tracking-widest uppercase shadow-soft"><Plus size={16} /> Add Moments</button>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
                {images.map((img, index) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="aspect-square card-base p-0 overflow-hidden relative group cursor-pointer border-none shadow-soft"
                        onClick={() => setSelectedImage(img)}
                    >
                        <img src={img.url} alt={img.event} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-16 flex flex-col justify-end">
                            <span className="text-[10px] font-black italic text-primary uppercase tracking-[0.2em] mb-4 bg-background/80 w-fit px-8 py-4 rounded-lg">{img.event}</span>
                            <div className="flex justify-between items-center pt-8">
                                <span className="text-xs text-text-secondary font-bold flex items-center gap-4"><Calendar size={12} /> {img.date}</span>
                                <Maximize2 size={16} className="text-white group-hover:scale-125 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-32"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="max-w-4xl w-full bg-card rounded-[32px] overflow-hidden border border-white/10 shadow-3xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="relative aspect-video flex items-center justify-center bg-black/40">
                                <img src={selectedImage.url} alt={selectedImage.event} className="max-h-full object-contain" />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-24 right-24 p-12 bg-background/80 hover:bg-background rounded-full transition-all border border-white/10 group shadow-lg"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>
                            <div className="p-32 flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-black mb-12 tracking-tight">{selectedImage.event}</h3>
                                    <div className="flex gap-16">
                                        <span className="text-xs font-bold text-text-secondary flex items-center gap-8"><Calendar size={14} /> {selectedImage.date}</span>
                                        <span className="text-xs font-bold text-primary flex items-center gap-8 italic">#collegeMemories</span>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button className="p-16 bg-danger/10 hover:bg-danger/20 text-danger rounded-2xl transition-all shadow-soft group">
                                        <Trash2 size={24} className="group-hover:scale-110" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
