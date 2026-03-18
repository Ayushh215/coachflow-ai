'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Lead {
    id: number;
    student_name: string | null;
    parent_phone: string;
    course_interest: string | null;
    budget: string | null;
    timeline: string | null;
    status: string;
    created_at: string;
}

export default function DashboardPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch data from /api/leads
            const res = await fetch(`/api/leads?limit=1000`);
            const data = await res.json();
            if (res.ok) {
                setLeads(data.leads || []);
            }
        } catch (error) {
            console.error('Failed to fetch leads', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    if (loading) {
        return (
            <div className="loading-spinner" style={{ minHeight: '300px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const totalLeads = leads.length;
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Last 7 days
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();

    const newToday = leads.filter(l => new Date(l.created_at).getTime() >= todayStart).length;
    const thisWeek = leads.filter(l => new Date(l.created_at).getTime() >= weekStart).length;
    const converted = leads.filter(l => l.status === 'admitted' || l.status === 'Converted').length;
    
    const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 100) : 0;
    
    const recentLeads = leads.slice(0, 5);

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your WhatsApp leads</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon purple">👥</div>
                    </div>
                    <div className="stat-title">Total Leads</div>
                    <div className="stat-card-value">{totalLeads}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon blue">✨</div>
                    </div>
                    <div className="stat-title">New Today</div>
                    <div className="stat-card-value" style={{ color: 'var(--status-new)' }}>{newToday}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon amber">📅</div>
                    </div>
                    <div className="stat-title">This Week</div>
                    <div className="stat-card-value" style={{ color: 'var(--status-contacted)' }}>{thisWeek}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon green">📈</div>
                    </div>
                    <div className="stat-title">Conversion Rate</div>
                    <div className="stat-card-value">{conversionRate}%</div>
                </div>
            </div>

            <div className="chart-card" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div className="chart-title" style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Recent Leads</div>
                {leads.length === 0 ? (
                    <div className="empty-state" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>No leads yet.</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Share your WhatsApp number to start capturing leads!</p>
                    </div>
                ) : (
                    <>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Course</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentLeads.map(lead => (
                                <tr key={lead.id}>
                                    <td style={{ fontWeight: 500 }}>{lead.student_name || '—'}</td>
                                    <td>{lead.parent_phone}</td>
                                    <td>{lead.course_interest || '—'}</td>
                                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                        <Link href="/dashboard/leads" className="btn btn-secondary btn-sm" style={{ width: 'auto', display: 'inline-block' }}>View All Leads →</Link>
                    </div>
                    </>
                )}
            </div>
        </>
    );
}
