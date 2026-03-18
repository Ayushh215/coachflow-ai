'use client';

import { useEffect, useState, useCallback } from 'react';

function formatPhone(phone: string) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

interface Lead {
    id: number;
    student_name: string;
    parent_phone: string;
    class: string;
    course_interest: string;
    budget: string | null;
    timeline: string | null;
    status: string;
    created_at: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const STATUS_LABELS: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    demo_booked: 'Demo Booked',
    admitted: 'Converted',
    not_interested: 'Lost',
};

const ALL_STATUSES = ['new', 'contacted', 'demo_booked', 'admitted', 'not_interested'];

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({
        student_name: '',
        parent_phone: '',
        class: '',
        course_interest: '',
    });
    const [addLoading, setAddLoading] = useState(false);

    const fetchLeads = useCallback(
        async (page = 1) => {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
            });
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (search) params.set('search', search);

            try {
                const res = await fetch(`/api/leads?${params}`);
                const data = await res.json();
                setLeads(data.leads || []);
                setPagination(data.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 });
            } catch (error) {
                console.error('Failed to fetch leads:', error);
            } finally {
                setLoading(false);
            }
        },
        [statusFilter, search]
    );

    useEffect(() => {
        const debounce = setTimeout(() => fetchLeads(1), 300);
        return () => clearTimeout(debounce);
    }, [fetchLeads]);

    async function handleStatusChange(leadId: number, newStatus: string) {
        try {
            const res = await fetch(`/api/leads/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setLeads((prev) =>
                    prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
                );
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    }

    async function handleDelete(leadId: number) {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        try {
            const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads((prev) => prev.filter((l) => l.id !== leadId));
                setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
            }
        } catch (error) {
            console.error('Failed to delete lead:', error);
        }
    }

    async function handleAddLead(e: React.FormEvent) {
        e.preventDefault();
        setAddLoading(true);
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm),
            });
            if (res.ok) {
                setShowAddModal(false);
                setAddForm({ student_name: '', parent_phone: '', class: '', course_interest: '' });
                fetchLeads(1);
            }
        } catch (error) {
            console.error('Failed to add lead:', error);
        } finally {
            setAddLoading(false);
        }
    }

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Leads</h1>
                    <p>Manage all your student inquiries and leads</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('CSV Export coming soon!')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export CSV
                    </button>
                    <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddModal(true)}>
                        + Add Lead
                    </button>
                </div>
            </div>

            <div className="table-container">
                <div className="table-toolbar">
                    <div className="table-search">
                        <span className="icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {STATUS_LABELS[s]}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <h3>No leads found</h3>
                        <p>
                            {search || statusFilter !== 'all'
                                ? 'Try adjusting your filters.'
                                : 'Leads will appear here when students message your WhatsApp number or you add them manually.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Phone</th>
                                    <th>Class</th>
                                    <th>Course / Subject</th>
                                    <th>Budget</th>
                                    <th>Timeline</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td style={{ fontWeight: 600 }}>{lead.student_name || '—'}</td>
                                        <td className="phone-cell">{formatPhone(lead.parent_phone)}</td>
                                        <td>{lead.class || '—'}</td>
                                        <td>{lead.course_interest || '—'}</td>
                                        <td>{lead.budget ? lead.budget.replace(/(\d+)/, (match) => parseInt(match).toLocaleString('en-IN')) : '—'}</td>
                                        <td>
                                            {lead.timeline ? (
                                                <span style={{ fontSize: '12px', background: 'var(--bg-glass)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                                    {lead.timeline}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td>
                                            <select
                                                className={`status-select ${lead.status}`}
                                                value={lead.status}
                                                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, border: 'none' }}
                                            >
                                                {ALL_STATUSES.map((s) => (
                                                    <option key={s} value={s}>
                                                        {STATUS_LABELS[s]}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(lead.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handleDelete(lead.id)}
                                                title="Delete lead"
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', padding: '6px' }}
                                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <div className="pagination-info">
                                    Showing {(pagination.page - 1) * pagination.limit + 1}–
                                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                    {pagination.total}
                                </div>
                                <div className="pagination-controls">
                                    <button
                                        className="pagination-btn"
                                        disabled={pagination.page <= 1}
                                        onClick={() => fetchLeads(pagination.page - 1)}
                                    >
                                        ← Prev
                                    </button>
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum: number;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.page <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.page >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.page - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`pagination-btn ${pagination.page === pageNum ? 'active' : ''}`}
                                                onClick={() => fetchLeads(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        className="pagination-btn"
                                        disabled={pagination.page >= pagination.totalPages}
                                        onClick={() => fetchLeads(pagination.page + 1)}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add Lead Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Lead</h2>
                        <form onSubmit={handleAddLead}>
                            <div className="form-group">
                                <label htmlFor="add-name">Student Name</label>
                                <input
                                    id="add-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="Student full name"
                                    value={addForm.student_name}
                                    onChange={(e) => setAddForm({ ...addForm, student_name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="add-phone">Parent Phone *</label>
                                <input
                                    id="add-phone"
                                    type="tel"
                                    className="form-input"
                                    placeholder="+91XXXXXXXXXX"
                                    value={addForm.parent_phone}
                                    onChange={(e) => setAddForm({ ...addForm, parent_phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="add-class">Class</label>
                                <select
                                    id="add-class"
                                    className="form-input"
                                    value={addForm.class}
                                    onChange={(e) => setAddForm({ ...addForm, class: e.target.value })}
                                >
                                    <option value="">Select class</option>
                                    <option value="Class 9">Class 9</option>
                                    <option value="Class 10">Class 10</option>
                                    <option value="Class 11">Class 11</option>
                                    <option value="Class 12">Class 12</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="add-course">Course / Subject</label>
                                <input
                                    id="add-course"
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Mathematics, JEE Prep"
                                    value={addForm.course_interest}
                                    onChange={(e) => setAddForm({ ...addForm, course_interest: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={addLoading}>
                                    {addLoading ? 'Adding...' : 'Add Lead'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
