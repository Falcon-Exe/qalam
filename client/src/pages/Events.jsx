import React from 'react';
import { Calendar, MapPin, Plus, Share2, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Events = ({ isAdmin = true }) => {
    const events = [
        {
            id: 1,
            title: 'Annual Tech Symposium',
            date: 'March 15, 2026',
            time: '10:00 AM',
            venue: 'Main Auditorium',
            status: 'upcoming',
            poster: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5'
        },
        {
            id: 2,
            title: 'Inter-College Hackathon',
            date: 'Feb 10, 2026',
            time: '09:00 AM',
            venue: 'CS Block Lab 1',
            status: 'completed',
            poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d'
        },
        {
            id: 3,
            title: 'Alumni Meet 2026',
            date: 'April 05, 2026',
            time: '05:00 PM',
            venue: 'College Grounds',
            status: 'upcoming',
            poster: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1'
        }
    ];

    return (
        <div className="space-y-32">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-xs font-black text-primary uppercase tracking-widest">Mark your calendar</p>
                    <h2 className="text-2xl font-black mt-4 tracking-tight underline decoration-primary/30 decoration-4 underline-offset-8 text-white">Upcoming Events</h2>
                </div>
                {isAdmin && (
                    <button className="btn-primary">
                        <Plus size={18} /> Create Event
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card-base card-hover p-0 group overflow-hidden border-none"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img src={event.poster} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                            <span className={`absolute top-16 left-16 px-12 py-6 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 ${event.status === 'upcoming' ? 'bg-primary/20 text-secondary' : 'bg-white/10 text-white/40'
                                }`}>
                                {event.status}
                            </span>
                        </div>

                        <div className="p-24 space-y-16">
                            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">{event.title}</h3>
                            <div className="space-y-8">
                                <div className="flex items-center gap-12 text-sm text-text-secondary font-medium">
                                    <Calendar size={14} className="text-primary" /> {event.date}
                                </div>
                                <div className="flex items-center gap-12 text-sm text-text-secondary font-medium">
                                    <Clock size={14} className="text-secondary" /> {event.time}
                                </div>
                                <div className="flex items-center gap-12 text-sm text-text-secondary font-medium">
                                    <MapPin size={14} className="text-danger" /> {event.venue}
                                </div>
                            </div>

                            <div className="flex gap-12 pt-8">
                                <button className="flex-1 btn-primary py-8 text-xs bg-white/5 border border-white/5 hover:bg-white/10 text-white">
                                    Get Details <ChevronRight size={14} />
                                </button>
                                <button className="p-12 hover:bg-white/5 rounded-xl transition-all text-text-secondary border border-white/5">
                                    <Share2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Events;
