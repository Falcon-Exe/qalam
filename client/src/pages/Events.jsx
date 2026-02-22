import { useState, useEffect } from 'react';
import { Calendar, MapPin, Plus, Share2, ChevronRight, Clock, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Events = ({ isAdmin = true }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        event_date: '',
        venue: '',
        description: '',
        poster_url: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5'
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.post('/events', { ...newEvent, created_by: user.id });
            setShowModal(false);
            setNewEvent({
                title: '',
                event_date: '',
                venue: '',
                description: '',
                poster_url: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5'
            });
            fetchEvents();
        } catch (err) {
            console.error('Failed to create event:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatus = (dateStr) => {
        const eventDate = new Date(dateStr);
        const now = new Date();
        return eventDate >= now ? 'upcoming' : 'completed';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-32">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-xs font-black text-primary uppercase tracking-widest">Mark your calendar</p>
                    <h2 className="text-2xl font-black mt-4 tracking-tight underline decoration-primary/30 decoration-4 underline-offset-8 text-white">Upcoming Events</h2>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <Plus size={18} /> Create Event
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="card-base h-64 bg-white/5 animate-pulse rounded-2xl" />
                    ))
                ) : (
                    <AnimatePresence>
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card-base card-hover p-0 group overflow-hidden border-none"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={event.poster_url || 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5'}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                                    <span className={`absolute top-16 left-16 px-12 py-6 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 ${getStatus(event.event_date) === 'upcoming' ? 'bg-primary/20 text-secondary' : 'bg-white/10 text-white/40'
                                        }`}>
                                        {getStatus(event.event_date)}
                                    </span>
                                </div>

                                <div className="p-24 space-y-16">
                                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors line-clamp-1">{event.title}</h3>
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-12 text-sm text-text-secondary font-medium">
                                            <Calendar size={14} className="text-primary" /> {formatDate(event.event_date)}
                                        </div>
                                        <div className="flex items-center gap-12 text-sm text-text-secondary font-medium">
                                            <Clock size={14} className="text-secondary" /> {formatTime(event.event_date)}
                                        </div>
                                        <div className="flex items-center gap-12 text-sm text-text-secondary font-medium">
                                            <MapPin size={14} className="text-danger" /> {event.venue}
                                        </div>
                                    </div>

                                    <div className="flex gap-12 pt-8">
                                        <button className="flex-1 btn-primary py-8 text-xs bg-white/5 border border-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-8">
                                            Get Details <ChevronRight size={14} />
                                        </button>
                                        <button className="p-10 hover:bg-white/5 rounded-xl transition-all text-text-secondary border border-white/5">
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
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
                                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Create Event</h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Official Class Gathering</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-8 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreate} className="space-y-24">
                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Event Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                            placeholder="e.g. Union Picnic"
                                            className="input-base w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-16">
                                        <div className="space-y-8">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Date & Time</label>
                                            <input
                                                required
                                                type="datetime-local"
                                                value={newEvent.event_date}
                                                onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                                                className="input-base w-full bg-card"
                                            />
                                        </div>
                                        <div className="space-y-8">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Venue</label>
                                            <input
                                                required
                                                type="text"
                                                value={newEvent.venue}
                                                onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                                placeholder="Location Name"
                                                className="input-base w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4 italic">Brief Description</label>
                                        <textarea
                                            rows={3}
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                            placeholder="What's happening?"
                                            className="input-base w-full resize-none p-16"
                                        />
                                    </div>

                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="btn-primary w-full py-14 italic font-black uppercase tracking-tight shadow-lg shadow-primary/20 flex items-center justify-center gap-12"
                                    >
                                        {submitting ? 'Creating...' : <>CREATE GATHERING <Send size={16} /></>}
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

export default Events;
