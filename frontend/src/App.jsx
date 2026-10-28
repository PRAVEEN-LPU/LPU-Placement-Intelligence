import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Code2,
  Cpu,
  Brain,
  MessageSquare,
  FolderGit2,
  Briefcase,
  Award,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BarChart3,
  ListTodo,
  Printer,
  RefreshCw,
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const API_BASE = '/api';

const PRESETS = {
  high: {
    label: '🌟 Top Performer',
    data: {
      cgpa: 8.9,
      technical_score: 88,
      aptitude_score: 82,
      communication_score: 85,
      coding_score: 90,
      projects: 3,
      internships: 2,
      certifications: 3,
      backlogs: 0,
    },
  },
  average: {
    label: '⚖️ Average Profile',
    data: {
      cgpa: 7.4,
      technical_score: 68,
      aptitude_score: 64,
      communication_score: 70,
      coding_score: 62,
      projects: 2,
      internships: 0,
      certifications: 1,
      backlogs: 0,
    },
  },
  needs_focus: {
    label: '⚠️ Needs Focus',
    data: {
      cgpa: 6.2,
      technical_score: 48,
      aptitude_score: 52,
      communication_score: 56,
      coding_score: 44,
      projects: 1,
      internships: 0,
      certifications: 0,
      backlogs: 0,
    },
  },
  backlog: {
    label: '🚨 Active Backlogs',
    data: {
      cgpa: 6.7,
      technical_score: 64,
      aptitude_score: 62,
      communication_score: 65,
      coding_score: 58,
      projects: 1,
      internships: 0,
      certifications: 1,
      backlogs: 2,
    },
  },
};

export default function App() {
  const [formData, setFormData] = useState(PRESETS.average.data);
  const [activeTab, setActiveTab] = useState('gaps'); // 'gaps' | 'roadmap' | 'factors'
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        setApiOnline(true);
        setErrorMessage(null);
      } else {
        setApiOnline(false);
      }
    } catch {
      setApiOnline(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'cgpa' ? parseFloat(value) : parseInt(value, 10),
    }));
  };

  const applyPreset = (presetKey) => {
    setFormData(PRESETS[presetKey].data);
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to calculate prediction.');
      }

      setPrediction(json.data);
      setApiOnline(true);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction once API is healthy
  useEffect(() => {
    handleAnalyze();
  }, []);

  // Gauge calculations
  const score = prediction ? prediction.readiness_score : 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getGaugeColor = (val) => {
    if (val >= 75) return '#10b981'; // Emerald
    if (val >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="app-wrapper">
      {/* Top Navigation */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-section">
            <div className="brand-logo">
              <GraduationCap size={24} color="#ffffff" />
            </div>
            <div>
              <div className="brand-title">
                LPU Placement Intelligence
                <span className="brand-badge">Student Readiness AI</span>
              </div>
              <div className="brand-sub">
                Campus Drive Diagnostic & Explainable Skill Gap Engine
              </div>
            </div>
          </div>

          <div className="header-actions">
            <div className="status-indicator">
              <span className={`status-dot ${apiOnline ? '' : 'disconnected'}`}></span>
              <span>{apiOnline ? 'Flask ML API Connected' : 'Connecting to API...'}</span>
            </div>
            <button
              onClick={() => window.print()}
              className="btn-preset"
              title="Print Student Diagnostic Report"
            >
              <Printer size={15} />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Presets Toolbar */}
        <section className="presets-banner">
          <div className="presets-title">
            <Sparkles size={16} color="var(--accent-primary)" />
            <span>Quick Test Profiles:</span>
          </div>
          <div className="preset-buttons">
            {Object.entries(PRESETS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                className="btn-preset"
                onClick={() => applyPreset(key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {/* Error Notification if any */}
        {errorMessage && (
          <div className="disclaimer-banner" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)', color: '#fca5a5' }}>
            <AlertTriangle size={18} color="var(--color-danger)" />
            <span><strong>System Notice:</strong> {errorMessage}</span>
          </div>
        )}

        {/* 2-Column Responsive Dashboard */}
        <div className="dashboard-grid">
          {/* Left Column: Input Form */}
          <section className="glass-card form-container">
            <div className="card-header">
              <h2>
                <GraduationCap size={20} color="var(--accent-primary)" />
                Student Competency Matrix
              </h2>
              <p>Adjust parameters or use presets</p>
            </div>

            <form className="card-body" onSubmit={handleAnalyze}>
              {/* Section 1: Academics & Problem Solving */}
              <div>
                <div className="form-section-title">
                  <TrendingUp size={14} /> Academics & Coding
                </div>

                {/* CGPA */}
                <div className="input-group">
                  <div className="input-label-row">
                    <span className="input-label">Academic CGPA</span>
                    <span className="input-value-badge">{formData.cgpa.toFixed(1)} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.1"
                    value={formData.cgpa}
                    onChange={(e) => handleInputChange('cgpa', e.target.value)}
                  />
                </div>

                {/* Coding Score */}
                <div className="input-group">
                  <div className="input-label-row">
                    <span className="input-label">
                      <Code2 size={14} /> Coding Practice (DSA)
                    </span>
                    <span className="input-value-badge">{formData.coding_score}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.coding_score}
                    onChange={(e) => handleInputChange('coding_score', e.target.value)}
                  />
                </div>

                {/* Technical Score */}
                <div className="input-group">
                  <div className="input-label-row">
                    <span className="input-label">
                      <Cpu size={14} /> Core CS Technical Score
                    </span>
                    <span className="input-value-badge">{formData.technical_score}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.technical_score}
                    onChange={(e) => handleInputChange('technical_score', e.target.value)}
                  />
                </div>
              </div>

              {/* Section 2: Aptitude & Soft Skills */}
              <div>
                <div className="form-section-title">
                  <Brain size={14} /> Aptitude & Communication
                </div>

                {/* Aptitude */}
                <div className="input-group">
                  <div className="input-label-row">
                    <span className="input-label">Aptitude & Logical Reasoning</span>
                    <span className="input-value-badge">{formData.aptitude_score}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.aptitude_score}
                    onChange={(e) => handleInputChange('aptitude_score', e.target.value)}
                  />
                </div>

                {/* Communication */}
                <div className="input-group">
                  <div className="input-label-row">
                    <span className="input-label">
                      <MessageSquare size={14} /> Communication & HR Fit
                    </span>
                    <span className="input-value-badge">{formData.communication_score}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.communication_score}
                    onChange={(e) => handleInputChange('communication_score', e.target.value)}
                  />
                </div>
              </div>

              {/* Section 3: Practical Experience & Standing */}
              <div>
                <div className="form-section-title">
                  <Briefcase size={14} /> Practical Profile & Backlogs
                </div>

                <div className="inputs-subgrid">
                  <div className="input-group">
                    <label className="input-label">
                      <FolderGit2 size={14} /> Projects
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      className="number-input-field"
                      value={formData.projects}
                      onChange={(e) => handleInputChange('projects', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      <Briefcase size={14} /> Internships
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className="number-input-field"
                      value={formData.internships}
                      onChange={(e) => handleInputChange('internships', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      <Award size={14} /> Certifications
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      className="number-input-field"
                      value={formData.certifications}
                      onChange={(e) => handleInputChange('certifications', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ color: formData.backlogs > 0 ? 'var(--color-danger)' : 'inherit' }}>
                      <AlertTriangle size={14} /> Active Backlogs
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className="number-input-field"
                      style={{ borderColor: formData.backlogs > 0 ? 'var(--color-danger)' : 'inherit' }}
                      value={formData.backlogs}
                      onChange={(e) => handleInputChange('backlogs', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="spin-animate" size={18} />
                    Calculating Placement Readiness...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Placement Readiness
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Right Column: Prediction & Diagnostics */}
          <section className="results-container">
            {/* Top Readiness Score Card */}
            {prediction && (
              <div className="readiness-score-card">
                {/* Circular Gauge */}
                <div className="gauge-wrapper">
                  <svg className="gauge-svg" viewBox="0 0 160 160">
                    <circle
                      className="gauge-bg"
                      cx="80"
                      cy="80"
                      r={radius}
                    />
                    <circle
                      className="gauge-fill"
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke={getGaugeColor(prediction.readiness_score)}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="gauge-center-text">
                    <span
                      className="gauge-number"
                      style={{ color: getGaugeColor(prediction.readiness_score) }}
                    >
                      {prediction.readiness_score}
                    </span>
                    <span className="gauge-label">Readiness</span>
                  </div>
                </div>

                {/* Score Details & Category */}
                <div className="readiness-info">
                  <div className="category-badge-row">
                    <span className={`category-badge ${prediction.badge_variant}`}>
                      {prediction.badge_variant === 'success' && <CheckCircle2 size={15} />}
                      {prediction.badge_variant === 'warning' && <TrendingUp size={15} />}
                      {prediction.badge_variant === 'critical' && <AlertTriangle size={15} />}
                      {prediction.readiness_category}
                    </span>
                    <span className="probability-note">
                      <Info size={13} />
                      Model Confidence: {(prediction.model_probability * 100).toFixed(1)}%
                    </span>
                  </div>

                  <p className="category-description">
                    {prediction.readiness_description}
                  </p>

                  <div className="probability-note">
                    {prediction.probability_note}
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic Tabs Card */}
            <div className="glass-card">
              <nav className="tabs-nav">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'gaps' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gaps')}
                >
                  <ListTodo size={16} />
                  Skill Gap Matrix
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                  onClick={() => setActiveTab('roadmap')}
                >
                  <Sparkles size={16} />
                  Action Roadmap
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'factors' ? 'active' : ''}`}
                  onClick={() => setActiveTab('factors')}
                >
                  <BarChart3 size={16} />
                  Influential Factors
                </button>
              </nav>

              <div className="card-body">
                {/* Tab 1: Skill Gaps */}
                {activeTab === 'gaps' && prediction && (
                  <div className="gap-grid">
                    {prediction.skill_gaps.map((gap, idx) => (
                      <div key={idx} className={`gap-card ${gap.severity}`}>
                        <div className="gap-header">
                          <span className="gap-skill-name">{gap.skill}</span>
                          <span className={`gap-status-pill ${gap.severity}`}>
                            {gap.status}
                          </span>
                        </div>
                        <div className="gap-metric-row">
                          <span>Current: <strong>{gap.current} {gap.unit}</strong></span>
                          <span>Target: <strong>{gap.target} {gap.unit}</strong></span>
                        </div>
                        <p className="gap-action-text">{gap.action}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 2: Recommendations Roadmap */}
                {activeTab === 'roadmap' && prediction && (
                  <div className="rec-list">
                    {prediction.recommendations.map((rec, idx) => (
                      <div key={idx} className="rec-card">
                        <div className="rec-header">
                          <div className="rec-title-group">
                            <span className="rec-badge">{rec.badge}</span>
                            <span className={`rec-priority ${rec.priority}`}>
                              {rec.priority} Priority
                            </span>
                          </div>
                        </div>
                        <h4 className="rec-title">{rec.title}</h4>
                        <p className="rec-details">{rec.details}</p>
                        <ul className="rec-actions-list">
                          {rec.action_items.map((item, aIdx) => (
                            <li key={aIdx}>
                              <span className="rec-bullet">▸</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Model Factor Importance */}
                {activeTab === 'factors' && prediction && (
                  <div>
                    <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Global Feature Importance (Gini importance from 250 Random Forest trees):
                    </div>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={prediction.top_factors}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                        >
                          <XAxis type="number" unit="%" stroke="#64748b" />
                          <YAxis
                            type="category"
                            dataKey="label"
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                            width={110}
                          />
                          <Tooltip
                            formatter={(value) => [`${value}%`, 'Relative Weight']}
                            contentStyle={{
                              background: '#1e293b',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: '#fff',
                            }}
                          />
                          <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                            {prediction.top_factors.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={index === 0 ? '#f97316' : index < 3 ? '#6366f1' : '#3b82f6'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Educational Disclaimer Banner */}
            {prediction && (
              <div className="disclaimer-banner">
                <Info size={20} color="var(--color-warning)" style={{ flexShrink: 0 }} />
                <span>{prediction.disclaimer}</span>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
