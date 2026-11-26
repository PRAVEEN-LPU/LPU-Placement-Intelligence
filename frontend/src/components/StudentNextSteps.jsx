import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight, RefreshCw, Code2, Target, Sparkles, Calendar } from 'lucide-react';
import { getCoachingRecords, getStudentEvidence } from '../services/assessmentService';

const formatDate = (value) => {
  if (!value) return 'No due date';
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString();
};

const CARD_THEMES = [
  {
    themeClass: 'action-card-cyan',
    badgeText: 'CORE SPRINT',
    stepNumber: '01',
    iconBg: 'rgba(6, 182, 212, 0.18)',
    iconColor: '#38bdf8',
    Icon: Code2,
    btnClass: 'btn-action-cyan',
  },
  {
    themeClass: 'action-card-purple',
    badgeText: 'APTITUDE & SPEED',
    stepNumber: '02',
    iconBg: 'rgba(168, 85, 247, 0.18)',
    iconColor: '#c084fc',
    Icon: Target,
    btnClass: 'btn-action-purple',
  },
  {
    themeClass: 'action-card-orange',
    badgeText: 'PRACTICAL EXPERIENCE',
    stepNumber: '03',
    iconBg: 'rgba(249, 115, 22, 0.18)',
    iconColor: '#fb923c',
    Icon: Sparkles,
    btnClass: 'btn-action-orange',
  },
];

export default function StudentNextSteps({ studentId, recommendations = [], history = [], onOpenPlan, onOpenEvidence, onOpenProgress }) {
  const [records, setRecords] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!studentId) return;
    try {
      const [goals, items] = await Promise.all([getCoachingRecords(studentId), getStudentEvidence(studentId)]);
      setRecords(goals); setEvidence(items); setError('');
    } catch (err) { setRecords(null); setEvidence(null); setError(err?.message || 'Your activity could not be loaded.'); }
  }, [studentId]);
  useEffect(() => { load(); }, [load]);

  const active = (records || []).filter((item) => item.kind === 'goal' && item.status !== 'completed')
    .sort((a, b) => (a.due_date || '9999').localeCompare(b.due_date || '9999'));
  const suggestions = recommendations.filter((item) => !(records || []).some((record) => record.kind === 'goal' && record.title === item.title));
  const actions = [...active.map((item) => ({ title: item.title, date: item.due_date, suggested: false })),
    ...suggestions.map((item) => ({ title: item.title, suggested: true, days: item.suggested_days || 7 }))].slice(0, 3);
  const events = [
    ...history.map((item) => ({ key: `assessment-${item.id}`, date: item.created_at, label: `Assessment: ${item.readiness_score}/100`, open: onOpenProgress })),
    ...(records || []).filter((item) => item.kind === 'goal' && item.status === 'completed').map((item) => ({ key: `goal-${item.id}`, date: item.updated_at, label: `Goal completed: ${item.title}`, open: onOpenPlan })),
    ...(records || []).filter((item) => item.kind !== 'goal' && item.visibility === 'student').map((item) => ({ key: `mentor-${item.id}`, date: item.created_at, label: `Mentor update: ${item.title}`, open: onOpenPlan })),
    ...(evidence || []).map((item) => ({ key: `evidence-${item.id}`, date: item.submitted_at, label: `Evidence submitted: ${item.title}`, open: onOpenEvidence })),
  ].filter((item) => item.date).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 5);

  return <section className="glass-card next-steps" aria-labelledby="next-steps-title">
    <div className="card-header"><div><h2 id="next-steps-title">What should I do next?</h2><p>Your next actions and recent activity in one place.</p></div><button type="button" className="btn-preset" onClick={load}><RefreshCw size={14} aria-hidden="true" /> Refresh</button></div>
    <div className="card-body">
      {error && <p role="alert">{error} <button className="inline-retry" type="button" onClick={load}>Retry loading activity</button></p>}
      {records === null && !error && <p role="status">Loading your plan…</p>}
      {records !== null && (actions.length ? (
        <div className="next-action-list next-action-grid">
          {actions.map((item, index) => {
            const theme = CARD_THEMES[index % CARD_THEMES.length];
            const IconComp = theme.Icon;
            return (
              <article
                className={`next-action next-action-square-card ${theme.themeClass}`}
                key={`${item.title}-${index}`}
              >
                <div className="next-action-card-top">
                  <div className="next-action-badge-group">
                    <div className="next-action-icon-pill" style={{ background: theme.iconBg, color: theme.iconColor }}>
                      <IconComp size={16} aria-hidden="true" />
                    </div>
                    <span className="next-action-category-tag">{theme.badgeText}</span>
                  </div>
                  <span className="next-action-step-num">STEP {theme.stepNumber}</span>
                </div>

                <div className="next-action-card-mid">
                  <h3 className="next-action-card-title">{item.title}</h3>
                  <p className="next-action-card-desc">
                    <Calendar size={13} aria-hidden="true" style={{ verticalAlign: 'middle', marginRight: '4px', opacity: 0.8 }} />
                    {item.suggested
                      ? `Suggested: within ${item.days} days; add to your plan`
                      : item.date
                      ? `Due ${formatDate(item.date)}`
                      : 'No due date set'}
                  </p>
                </div>

                <div className="next-action-card-bottom">
                  <button
                    type="button"
                    className={`btn-preset next-action-open-btn ${theme.btnClass}`}
                    onClick={onOpenPlan}
                  >
                    <span>Open plan</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="probability-note">No actions yet. Analyze your profile or add a goal to your plan.</p>
      ))}
      <h3 className="panel-subheading">Recent activity</h3>
      {events.length ? <ul className="activity-timeline">{events.map((item) => <li key={item.key}><time>{formatDate(item.date)}</time><button type="button" className="mentor-link-button" onClick={item.open}>{item.label}</button></li>)}</ul> : <p className="probability-note">Your assessments, completed goals, evidence, and mentor updates will appear here.</p>}
      <p className="probability-note">Assessment comparisons show recorded input changes; they do not prove why a score changed.</p>
    </div>
  </section>;
}
