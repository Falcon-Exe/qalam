import { useState, useEffect } from 'react';
import { Calendar, MapPin, Plus, Share2, ChevronRight, Clock, X, Send, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Events = ({ isAdmin = true }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewEvent, setViewEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
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

    const handleOpenCreate = () => {
        setIsEditing(false);
        setNewEvent({
            title: '',
            event_date: '',
            venue: '',
            description: '',
            poster_url: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5'
        });
        setShowModal(true);
    };

    const handleOpenEdit = (event) => {
        setIsEditing(true);
        // Format date for datetime-local input (YYYY-MM-DDThh:mm)
        const date = new Date(event.event_date);
        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

        setNewEvent({ ...event, event_date: formattedDate });
        setShowModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEditing) {
                await api.put(`/events/${newEvent.id}`, newEvent);
            } else {
                const user = JSON.parse(localStorage.getItem('user'));
                await api.post('/events', { ...newEvent, created_by: user.id });
            }
            setShowModal(false);
            fetchEvents();
        } catch (err) {
            console.error('Failed to save event:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (err) {
            console.error('Failed to delete event:', err);
        }
    };

    const handleShare = (event) => {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: `${event.title} at ${event.venue} on ${formatDate(event.event_date)}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(`${event.title} at ${event.venue} on ${formatDate(event.event_date)}`).then(() => {
                alert('Event details copied to clipboard!');
            });
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
                        onClick={handleOpenCreate}
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
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop';
                                        }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

                                    {/* Glass Overlay Actions */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-black/20">
                                        <button
                                            onClick={() => setViewEvent(event)}
                                            className="px-20 py-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-8 shadow-2xl scale-90 group-hover:scale-100 transition-all"
                                        >
                                            View Intelligence <ChevronRight size={14} />
                                        </button>
                                    </div>

                                    {/* Admin Quick Actions (Stacked on Mobile) */}
                                    {isAdmin && (
                                        <div className="absolute top-12 right-12 flex flex-col gap-6 transform translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}
                                                className="p-8 bg-danger/80 hover:bg-danger text-white rounded-lg backdrop-blur-md border border-white/20 shadow-lg active:scale-95 transition-all"
                                                title="Delete Event"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleOpenEdit(event); }}
                                                className="p-8 bg-secondary/80 hover:bg-secondary text-white rounded-lg backdrop-blur-md border border-white/20 shadow-lg active:scale-95 transition-all"
                                                title="Edit Event"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <span className={`absolute top-16 left-16 px-12 py-6 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 ${getStatus(event.event_date) === 'upcoming' ? 'bg-primary/20 text-secondary' : 'bg-white/10 text-white/40'
                                        }`}>
                                        {getStatus(event.event_date)}
                                    </span>
                                </div>

                                <div className="p-24 space-y-12 relative">
                                    <div className="flex justify-between items-start gap-12">
                                        <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">{event.title}</h3>
                                        <button
                                            onClick={() => handleShare(event)}
                                            className="p-8 hover:bg-white/5 rounded-lg transition-all text-text-secondary border border-white/5 flex-shrink-0"
                                        >
                                            <Share2 size={14} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 pt-4">
                                        <div className="flex items-center gap-8 text-[11px] text-text-secondary font-bold uppercase tracking-wider">
                                            <Calendar size={12} className="text-primary" /> {formatDate(event.event_date)}
                                        </div>
                                        <div className="flex items-center gap-8 text-[11px] text-text-secondary font-bold uppercase tracking-wider">
                                            <Clock size={12} className="text-secondary" /> {formatTime(event.event_date)}
                                        </div>
                                        <div className="flex items-center gap-8 text-[11px] text-text-secondary font-bold uppercase tracking-wider col-span-2">
                                            <MapPin size={12} className="text-danger" /> <span className="break-words leading-tight">{event.venue}</span>
                                        </div>
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]"
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-[1001] p-16 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="w-full max-w-xl pointer-events-auto"
                            >
                                <div className="card-base border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-[#0a0a0c]/98 backdrop-blur-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-10" />

                                    <div className="p-24 pb-0">
                                        <div className="flex justify-between items-center mb-24">
                                            <div>
                                                <h2 className="text-xl font-black italic uppercase tracking-tight text-white">{isEditing ? 'Edit Event' : 'Create Event'}</h2>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{isEditing ? 'Update gathering details' : 'Official Class Gathering'}</p>
                                            </div>
                                            <button onClick={() => setShowModal(false)} className="p-8 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-24 pt-0 overflow-y-auto custom-scrollbar">
                                        <form onSubmit={handleFormSubmit} className="space-y-24 pb-8">
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
                                                {submitting ? (isEditing ? 'Updating...' : 'Creating...') : <>{isEditing ? 'UPDATE EVENT' : 'CREATE GATHERING'} <Send size={16} /></>}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* View Details Modal */}
            <AnimatePresence>
                {viewEvent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewEvent(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[1000]"
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-[1001] p-16 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="w-full max-w-2xl pointer-events-auto"
                            >
                                <div className="card-base border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-[#0a0a0c]/98 backdrop-blur-2xl relative overflow-hidden p-0 max-h-[85vh] overflow-y-auto flex flex-col">
                                    <div className="relative h-72 bg-white/5 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={viewEvent.poster_url || 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5'}
                                            className="w-full h-full object-cover"
                                            alt={viewEvent.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                                        <button
                                            onClick={() => setViewEvent(null)}
                                            className="absolute top-16 right-16 p-8 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="p-32 space-y-32">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
                                            <div className="space-y-8">
                                                <span className="px-12 py-6 bg-primary/20 text-secondary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                                    {getStatus(viewEvent.event_date)}
                                                </span>
                                                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">{viewEvent.title}</h2>
                                            </div>
                                            <button
                                                onClick={() => handleShare(viewEvent)}
                                                className="btn-primary py-10 px-16 text-[10px] bg-white/5 border border-white/5 text-white"
                                            >
                                                <Share2 size={14} /> SHARE EVENT
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-y border-white/5 py-24">
                                            <div className="flex flex-col gap-4">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Schedule</span>
                                                <div className="flex items-center gap-8 text-white font-bold">
                                                    <Calendar size={14} className="text-primary" /> {formatDate(viewEvent.event_date)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Timeframe</span>
                                                <div className="flex items-center gap-8 text-white font-bold">
                                                    <Clock size={14} className="text-secondary" /> {formatTime(viewEvent.event_date)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Location</span>
                                                <div className="flex items-center gap-8 text-white font-bold">
                                                    <MapPin size={14} className="text-danger" /> {viewEvent.venue}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-12">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence & Details</h4>
                                            <p className="text-text-secondary text-sm leading-relaxed font-medium">
                                                {viewEvent.description || "No further intelligence provided for this gathering."}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setViewEvent(null)}
                                            className="w-full py-12 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                                        >
                                            RETURN TO CALENDAR
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Events;
