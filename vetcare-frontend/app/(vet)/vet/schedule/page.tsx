"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { vetApi } from '@/lib/vetApi';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';

export default function VetSchedulePage() {
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        async function fetchSchedule() {
            try {
                const response = await vetApi.getSchedule();
                setSchedule(response.data);
            } catch (error) {
                console.error('Failed to fetch schedule:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSchedule();
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
                        <p className="text-gray-500">Manage your weekly working hours and time-off blocks</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition shadow-sm font-medium">
                        <Plus size={18} />
                        Add Time-Off Block
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {days.map((day, index) => {
                        const daySchedule = schedule.filter(s => s.dayOfWeek === index + 1);
                        return (
                            <div key={day} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                <div className="p-3 bg-gray-50 border-b border-gray-100 text-center font-semibold text-gray-700">
                                    {day}
                                </div>
                                <div className="p-4 flex-grow space-y-3 min-h-[150px]">
                                    {loading ? (
                                        <div className="h-4 bg-gray-100 animate-pulse rounded"></div>
                                    ) : daySchedule.length > 0 ? (
                                        daySchedule.map((slot: any) => (
                                            <div key={slot.id} className="p-2 bg-primary-50 border border-primary-100 rounded text-sm text-primary-700">
                                                <div className="flex items-center gap-1 font-medium mb-1">
                                                    <Clock size={14} />
                                                    {slot.startTime} - {slot.endTime}
                                                </div>
                                                {slot.isAvailable ? 'Available' : 'Blocked'}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-center text-gray-400 mt-4 italic">No hours set</div>
                                    )}
                                </div>
                                <div className="p-2 bg-gray-50 border-t border-gray-100">
                                    <button className="w-full text-xs text-primary-600 hover:text-primary-700 font-medium py-1">
                                        Edit Hours
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-primary-600" />
                        Upcoming Time-Off Blocks
                    </h2>
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        You have no upcoming time-off blocks scheduled.
                    </div>
                </div>
            </div>
        </Layout>
    );
}
