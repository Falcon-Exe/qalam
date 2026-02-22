import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Maximize2, Tag, Calendar, Trash2, X, Send, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Gallery = ({ isAdmin = true }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newImage, setNewImage] = useState({ event_name: '', gallery_date: new Date().toISOString().split('T')[0], file: null });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data } = await api.get('/gallery');
            setImages(data);
        } catch (err) {
            console.error('Failed to fetch gallery:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newImage.file) return alert('Please select an image');

        setSubmitting(true);
        const formData = new FormData();
        formData.append('image', newImage.file);
        formData.append('event_name', newImage.event_name);
        formData.append('gallery_date', newImage.gallery_date);

        const user = JSON.parse(localStorage.getItem('user'));
        formData.append('created_by', user.id);

        try {
            await api.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowModal(false);
            setNewImage({ event_name: '', gallery_date: new Date().toISOString().split('T')[0], file: null });
            fetchImages();
        } catch (err) {
            console.error('Failed to upload image:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this memory?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            setSelectedImage(null);
            fetchImages();
        } catch (err) {
            console.error('Failed to delete image:', err);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const base = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';
        return `${base}${url}`;
    };

    return (
        <div className="space-y-32 mb-32">
            <div className="flex justify-between items-center bg-card p-24 rounded-card border border-white/5">
                <div className="flex items-center gap-16">
                    <div className="p-12 bg-primary/10 rounded-xl text-primary"><ImageIcon size={24} /></div>
                    <div>
                        <h2 className="text-xl font-black text-white italic">AL QALAM ARCHIVE</h2>
                        <p className="text-xs text-text-secondary mt-1 font-medium italic">Capturing MUSF journey since 2022</p>
                    </div>
                </div>
                {isAdmin && <button onClick={() => setShowModal(true)} className="btn-primary py-8 text-xs px-24 font-black tracking-widest uppercase shadow-soft"><Plus size={16} /> Add Moments</button>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
                {loading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="aspect-square card-base bg-white/5 animate-pulse rounded-2xl" />)
                ) : images.length === 0 ? (
                    <div className="col-span-full py-64 text-center text-text-secondary italic">No moments captured yet.</div>
                ) : (
                    images.map((img, index) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="aspect-square card-base p-0 overflow-hidden relative group cursor-pointer border-none shadow-soft"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img src={getImageUrl(img.image_url)} alt={img.event_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-16 flex flex-col justify-end">
                                <span className="text-[10px] font-black italic text-primary uppercase tracking-[0.2em] mb-4 bg-background/80 w-fit px-8 py-4 rounded-lg">{img.event_name}</span>
                                <div className="flex justify-between items-center pt-8">
                                    <span className="text-xs text-text-secondary font-bold flex items-center gap-4"><Calendar size={12} /> {new Date(img.gallery_date).toLocaleDateString()}</span>
                                    <Maximize2 size={16} className="text-white group-hover:scale-125 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
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
                                <img src={getImageUrl(selectedImage.image_url)} alt={selectedImage.event_name} className="max-h-full object-contain" />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-24 right-24 p-12 bg-background/80 hover:bg-background rounded-full transition-all border border-white/10 group shadow-lg text-white"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform " />
                                </button>
                            </div>
                            <div className="p-32 flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-black mb-12 tracking-tight text-white italic uppercase italic underline decoration-primary/30 decoration-4 underline-offset-8">{selectedImage.event_name}</h3>
                                    <div className="flex gap-16">
                                        <span className="text-xs font-bold text-text-secondary flex items-center gap-8"><Calendar size={14} /> {new Date(selectedImage.gallery_date).toLocaleDateString()}</span>
                                        <span className="text-xs font-bold text-primary flex items-center gap-8 italic">#ALQALAM_Memories</span>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button onClick={() => handleDelete(selectedImage.id)} className="p-16 bg-danger/10 hover:bg-danger/20 text-danger rounded-2xl transition-all shadow-soft group">
                                        <Trash2 size={24} className="group-hover:scale-110" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[110] p-16"
                        >
                            <div className="card-base border-white/10 shadow-3xl bg-card/95 backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />

                                <div className="flex justify-between items-center mb-24">
                                    <div>
                                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Capture Moment</h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Class Gallery Management</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-8 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleUpload} className="space-y-24">
                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Event Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newImage.event_name}
                                            onChange={(e) => setNewImage({ ...newImage, event_name: e.target.value })}
                                            placeholder="e.g. Freshers Day 2026"
                                            className="input-base w-full"
                                        />
                                    </div>

                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={newImage.gallery_date}
                                            onChange={(e) => setNewImage({ ...newImage, gallery_date: e.target.value })}
                                            className="input-base w-full"
                                        />
                                    </div>

                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Image File</label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-all bg-white/5">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-24 h-24 text-text-secondary mb-8" />
                                                <p className="text-xs text-text-secondary font-bold italic uppercase tracking-widest px-16 text-center">
                                                    {newImage.file ? newImage.file.name : 'Select a memory to upload'}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => setNewImage({ ...newImage, file: e.target.files[0] })}
                                            />
                                        </label>
                                    </div>

                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="btn-primary w-full py-14 italic font-black uppercase tracking-tight shadow-lg shadow-primary/20 flex items-center justify-center gap-12"
                                    >
                                        {submitting ? 'Preserving...' : <>UPLOAD MOMENT <Send size={16} /></>}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
