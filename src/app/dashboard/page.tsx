'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Analytics {
    total: number;
    today: number;
    byStatus: Record<string, number>;
    daily: Array<{ date: string; count: string }>;
    recentLeads: Array<{
        id: number;
        student_name: string;
        parent_phone: string;
        class: string;
        course_interest: string;
        status: string;
        created_at: string;
    }>;
}

const STATUS_LABELS: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    demo_booked: 'Demo Booked',
    admitted: 'Admitted',
    not_interested: 'Not Interested',
};

export default function DashboardPage() {
    const [data, setData] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/analytics')
            .then((res) => res.json())
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <h3>Unable to load analytics</h3>
                <p>Please check your database connection and try again.</p>
            </div>
        );
    }

    const maxDaily = Math.max(...(data.daily.map((d) => parseInt(d.count)) || [1]), 1);

    return (
        <>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Overview of your coaching institute leads and performance</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon purple">📋</div>
                        <span className="stat-card-label">Total Leads</span>
                    </div>
                    <div className="stat-card-value">{data.total}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon blue">🆕</div>
                        <span className="stat-card-label">New Today</span>
                    </div>
                    <div className="stat-card-value">{data.today}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon green">✅</div>
                        <span className="stat-card-label">Admitted</span>
                    </div>
                    <div className="stat-card-value">{data.byStatus.admitted || 0}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon amber">📅</div>
                        <span className="stat-card-label">Demo Booked</span>
                    </div>
                    <div className="stat-card-value">{data.byStatus.demo_booked || 0}</div>
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="section-header">
                <h2>Lead Status Breakdown</h2>
            </div>
            <div className="status-grid">
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <div className="status-chip" key={key}>
                        <div className={`status-dot ${key}`} />
                        <div className="status-chip-info">
                            <div className="status-chip-label">{label}</div>
                            <div className="status-chip-count">{data.byStatus[key] || 0}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Daily Chart */}
            {data.daily.length > 0 && (
                <div className="chart-card">
                    <div className="chart-title">Leads — Last 7 Days</div>
                    <div className="bar-chart">
                        {data.daily.map((d) => {
                            const count = parseInt(d.count);
                            const heightPercent = (count / maxDaily) * 100;
                            const dateObj = new Date(d.date);
                            const dayLabel = dateObj.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                            });
                            return (
                                <div className="bar-chart-item" key={d.date}>
                                    <div className="bar-chart-value">{count}</div>
                                    <div
                                        className="bar-chart-bar"
                                        style={{ height: `${Math.max(heightPercent, 3)}%` }}
                                    />
                                    <div className="bar-chart-label">{dayLabel}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recent Leads */}
            <div className="section-header">
                <h2>Recent Leads</h2>
                <Link href="/dashboard/leads">View All →</Link>
            </div>
            <div className="table-container">
                {data.recentLeads.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <h3>No leads yet</h3>
                        <p>
                            Leads will appear here when students message your WhatsApp
                            number or you add them manually.
                        </p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Phone</th>
                                <th>Class</th>
                                <th>Course</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentLeads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>{lead.student_name || '—'}</td>
                                    <td className="phone-cell">{lead.parent_phone}</td>
                                    <td>{lead.class || '—'}</td>
                                    <td>{lead.course_interest || '—'}</td>
                                    <td>
                                        <span className={`status-badge ${lead.status}`}>
                                            {STATUS_LABELS[lead.status] || lead.status}
                                        </span>
                                    </td>
                                    <td className="date-cell">
                                        {new Date(lead.created_at).toLocaleDateString()}
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
