'use client';

import { useEffect, useState, useCallback } from 'react';

interface Lead {
    id: number;
    student_name: string | null;
    parent_phone: string;
    course_interest: string | null;
    budget: string | null;
    timeline: string | null;
    created_at: string;
}

export default function DashboardPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<'today' | 'this_week' | 'all'>('all');

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/leads?dateFilter=${dateFilter}&limit=100`);
            const data = await res.json();
            if (res.ok) {
                setLeads(data.leads || []);
            }
        } catch (error) {
            console.error('Failed to fetch leads', error);
        } finally {
            setLoading(false);
        }
    }, [dateFilter]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your WhatsApp leads</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.875rem', color: '#64748b' }}>Filter:</label>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value as any)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#fff',
                            fontSize: '0.875rem',
                            color: '#1e293b',
                            outline: 'none',
                        }}
                    >
                        <option value="today">Today</option>
                        <option value="this_week">This Week</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            <div className="table-container" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                {loading ? (
                    <div className="loading-spinner" style={{ minHeight: '300px' }}>
                        <div className="spinner"></div>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="empty-state" style={{ minHeight: '300px' }}>
                        <div className="empty-state-icon">👥</div>
                        <h3>No leads found</h3>
                        <p>When leads come in from WhatsApp, they will appear here.</p>
                    </div>
                ) : (
                    <table className="data-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Course Interest</th>
                                <th>Budget</th>
                                <th>Timeline</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td style={{ fontWeight: 500, color: '#1e293b' }}>{lead.student_name || '—'}</td>
                                    <td className="phone-cell">{lead.parent_phone}</td>
                                    <td>{lead.course_interest || '—'}</td>
                                    <td>{lead.budget || '—'}</td>
                                    <td>{lead.timeline || '—'}</td>
                                    <td className="date-cell">
                                        {new Date(lead.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
