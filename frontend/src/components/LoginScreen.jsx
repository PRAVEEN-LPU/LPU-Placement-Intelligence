import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Info,
  Key,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { BrandLogo } from './ui';
import campusImage from '../assets/lpu-campus-banner.webp';
import { usesSupabaseAuth } from '../services/supabaseClient';

const DEMO_ROLES = [
  {
    id: 'student',
    title: 'Student',
    username: 'student.demo',
    icon: GraduationCap,
    desc: 'Self-assessment, 9 skill sliders, SHAP insights & roadmap',
    color: '#0ea5e9', // Sky blue
  },
  {
    id: 'mentor',
    title: 'Mentor / Faculty',
    username: 'mentor.cse',
    icon: Users,
    desc: 'Cohort mentee tracking, reviews, guidance notes & queue',
    color: '#10b981', // Emerald green
  },
  {
    id: 'admin',
    title: 'Placement Admin',
    username: 'admin.lpu',
    icon: ShieldCheck,
    desc: 'Institutional analytics, model registry, audit & pipeline',
    color: '#f59e0b', // Amber
  },
];

const DEFAULT_DEMO_PASSWORD = '123456';

export default function LoginScreen({ onLogin, message, busy }) {
  const [selectedRoleId, setSelectedRoleId] = useState('student');
  const [username, setUsername] = useState('student.demo');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isBusy = busy || submitting;

  const handleSelectRole = (role) => {
    setSelectedRoleId(role.id);
    setUsername(role.username);
    setPassword(DEFAULT_DEMO_PASSWORD);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isBusy) return;
    if (!username.trim() || !password) {
      setError(`Enter both your ${usesSupabaseAuth ? 'email' : 'username'} and password.`);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const failure = await onLogin(username.trim(), password);
      if (failure) {
        setError(failure);
      } else {
        setShowPassword(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRole = DEMO_ROLES.find((r) => r.id === selectedRoleId) || DEMO_ROLES[0];

  return (
    <div className="login-shell">
      <a className="skip-link" href="#login-form">
        Skip to sign-in form
      </a>

      <main className="login-main login-layout">
        {/* Left Hero Section */}
        <section className="login-hero" aria-labelledby="login-hero-heading">
          <div className="login-hero-content">
            <div className="login-brand">
              <BrandLogo />
              <div>
                <h1>LPU Placement Intelligence</h1>
                <p>Unified student, mentor & placement platform</p>
              </div>
            </div>
            <div className="login-hero-message">
              <span className="login-eyebrow">
                <span aria-hidden="true" /> ROLE-BASED ACCESS CONTROL
              </span>
              <h2 id="login-hero-heading">
                One platform,<br />
                <em>three perspectives.</em>
              </h2>
              <p>
                Select your role on the right to access student self-assessment, mentor coaching, or
                placement administration with a single click.
              </p>
            </div>
            <div className="login-campus-frame">
              <img
                className="login-hero-image"
                src={campusImage}
                alt="LPU campus building with the university logo"
              />
              <div className="login-campus-label">
                <span>CAMPUS RECRUITMENT INTELLIGENCE</span>
                <strong>Gradient Boosting ML Model · 96.08% Accuracy</strong>
              </div>
            </div>
            <div className="login-hero-footer">
              <span>LPU CAPSTONE PROJECT</span>
              <span>All 3 Roles Unified on Single Login Screen</span>
            </div>
          </div>
        </section>

        {/* Right Login Panel */}
        <section className="login-panel" aria-labelledby="login-heading">
          <div className="login-panel-top">
            <span>UNIFIED ROLE LOGIN</span>
            <span className="login-panel-top-mark" aria-hidden="true">
              ✳
            </span>
          </div>

          <div className="glass-card login-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="login-welcome">
                SELECT ROLE <span aria-hidden="true">/</span> INSTANT SIGN IN
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: 600,
                }}
              >
                1-Click Demo Ready
              </span>
            </div>

            <h2 id="login-heading" style={{ margin: '4px 0 2px' }}>
              Select Role & Open Dashboard
            </h2>
            <p className="login-intro" style={{ margin: 0, fontSize: '0.8rem' }}>
              Click any role below to automatically fill the credentials.
            </p>

            {/* 3-Role Interactive Selector */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                margin: '8px 0 4px',
              }}
              role="radiogroup"
              aria-label="Select user role"
            >
              {DEMO_ROLES.map((role) => {
                const isSelected = selectedRoleId === role.id;
                const IconComponent = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    disabled={isBusy}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: isSelected
                        ? `2px solid ${role.color}`
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      background: isSelected
                        ? 'rgba(30, 41, 59, 0.95)'
                        : 'rgba(15, 23, 42, 0.6)',
                      boxShadow: isSelected
                        ? `0 0 12px ${role.color}33`
                        : 'none',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    <IconComponent
                      size={22}
                      color={isSelected ? role.color : '#94a3b8'}
                      style={{ marginBottom: '4px' }}
                    />
                    <strong
                      style={{
                        fontSize: '0.82rem',
                        color: isSelected ? '#ffffff' : '#cbd5e1',
                      }}
                    >
                      {role.title}
                    </strong>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        color: isSelected ? role.color : '#64748b',
                        fontFamily: 'monospace',
                        marginTop: '2px',
                      }}
                    >
                      {role.username}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Password Notification Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.78rem',
                color: '#34d399',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} />
                <span>
                  Universal Password for All Roles: <strong>123456</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPassword('123456')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Auto-fill
              </button>
            </div>

            {message ? (
              <div className="status-banner status-banner-warning" role="status">
                <Info size={16} aria-hidden="true" />
                <span>{message}</span>
              </div>
            ) : null}

            {/* Sign-in Form */}
            <form
              id="login-form"
              className="login-form"
              onSubmit={handleSubmit}
              noValidate
              tabIndex="-1"
            >
              {error ? (
                <div className="form-validation-message" role="alert">
                  <AlertTriangle size={16} aria-hidden="true" />
                  {error}
                </div>
              ) : null}

              <div className="login-field">
                <label htmlFor="login-username">
                  Selected Account ({selectedRole.title})
                </label>
                <input
                  id="login-username"
                  name="username"
                  type={usesSupabaseAuth ? 'email' : 'text'}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  disabled={isBusy}
                  required
                />
              </div>

              <div className="login-field">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <label htmlFor="login-password">Password</label>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Preset: <code style={{ color: '#38bdf8' }}>123456</code>
                  </span>
                </div>
                <div className="login-password-wrapper">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isBusy}
                    required
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isBusy}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? (
                      <EyeOff size={19} aria-hidden="true" />
                    ) : (
                      <Eye size={19} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={isBusy}
                aria-busy={isBusy}
                style={{
                  background:
                    selectedRoleId === 'admin'
                      ? 'linear-gradient(135deg, #d97706, #f59e0b)'
                      : selectedRoleId === 'mentor'
                      ? 'linear-gradient(135deg, #059669, #10b981)'
                      : 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  color: '#ffffff',
                  fontWeight: 700,
                }}
              >
                {isBusy ? (
                  'Signing in...'
                ) : (
                  <>
                    Open {selectedRole.title} Dashboard
                    <ArrowRight size={18} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <p className="login-note" style={{ margin: 0, textAlign: 'center' }}>
              Presentation Tip: Click any role above to switch between Student, Mentor, and Admin
              dashboards instantly.
            </p>
          </div>

          <p className="login-panel-footer">
            <span>STUDENT · MENTOR · ADMIN</span>
            <span>PLACEMENT INTELLIGENCE</span>
          </p>
        </section>
      </main>
    </div>
  );
}
