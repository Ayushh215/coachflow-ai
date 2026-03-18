'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface DashboardData {
    total: number;
    today: number;
    byStatus: Record<string, number>;
    daily: { date: string; count: string }[];
    recentLeads: any[];
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics`);
            const json = await res.json();
            if (res.ok) {
                setData(json);
            }
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading || !data) {
        return (
            <div className="loading-spinner" style={{ minHeight: '300px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const totalLeads = data.total;
    const newToday = data.today;
    const converted = data.byStatus['admitted'] || 0;
    const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 100) : 0;

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your WhatsApp leads</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-title">Total Leads</div>
                    <div className="stat-value">{totalLeads}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">New Today</div>
                    <div className="stat-value" style={{ color: 'var(--status-new)' }}>{newToday}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Converted</div>
                    <div className="stat-value" style={{ color: 'var(--status-admitted)' }}>{converted}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Conversion Rate</div>
                    <div className="stat-value">{conversionRate}%</div>
                </div>
            </div>

            <div className="chart-card" style={{ marginTop: '2rem' }}>
                <div className="chart-title">Recent Leads (Last 5)</div>
                {data.recentLeads.length === 0 ? (
                    <div className="empty-state" style={{ minHeight: '150px' }}>
                        <p>No leads found yet.</p>
                    </div>
                ) : (
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
                            {data.recentLeads.map(lead => (
                                <tr key={lead.id}>
                                    <td style={{ fontWeight: 500 }}>{lead.student_name || '—'}</td>
                                    <td>{lead.parent_phone}</td>
                                    <td>{lead.course_interest || '—'}</td>
                                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                    <Link href="/dashboard/leads" className="btn btn-secondary btn-sm" style={{ width: 'auto', display: 'inline-block' }}>View All Leads →</Link>
                </div>
            </div>
        </>
    );
}
