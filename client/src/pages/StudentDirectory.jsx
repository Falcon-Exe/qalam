import React, { useState } from 'react';
import { Users, Search, Mail, Phone, Shield, Edit3, Trash2, Plus, UserCircle } from 'lucide-react';

const StudentDirectory = ({ isAdmin = true }) => {
    const students = [
        { id: 1, name: 'Adarsh S', role: 'Student', class_role: 'CR', email: 'adarsh@college.edu', phone: '+91 98765 43210' },
        { id: 2, name: 'Anjali P', role: 'Student', class_role: 'Secretary', email: 'anjali@college.edu', phone: '+91 98765 43211' },
        { id: 3, name: 'Binu Kumar', role: 'Student', class_role: 'Treasurer', email: 'binu@college.edu', phone: '+91 98765 43212' },
        { id: 4, name: 'Deepa Raj', role: 'Student', class_role: null, email: 'deepa@college.edu', phone: '+91 98765 43213' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold leading-tight">Student Directory</h2>
                    <p className="text-text-secondary mt-1">Class of 2026 • 48 Students Total</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input type="text" placeholder="Search by name, role..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50" />
                    </div>
                    {isAdmin && (
                        <button className="glass bg-primary/20 hover:bg-primary/30 p-3.5 rounded-2xl transition-all">
                            <Plus size={24} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                    <div key={student.id} className="glass p-8 rounded-[2.5rem] relative group hover:scale-[1.02] transition-all">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-2xl font-bold">
                                {student.name.charAt(0)}
                            </div>
                            {student.class_role && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary rounded-xl text-xs font-bold uppercase tracking-wider">
                                    <Shield size={12} /> {student.class_role}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold">{student.name}</h3>
                                <p className="text-sm text-text-secondary">Student</p>
                            </div>

                            <div className="pt-4 border-t border-white/5 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-text-secondary group-hover:text-white transition-colors">
                                    <Mail size={16} className="text-primary" /> {student.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary group-hover:text-white transition-colors">
                                    <Phone size={16} className="text-primary" /> {student.phone}
                                </div>
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white"><Edit3 size={16} /></button>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-text-secondary hover:text-red-400"><Trash2 size={16} /></button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDirectory;
