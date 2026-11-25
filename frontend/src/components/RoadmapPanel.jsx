import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  Circle,
  Compass,
  ExternalLink,
  Flame,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import {
  createCoachingRecord,
  getCoachingRecords,
  updateCoachingRecord,
  deleteCoachingRecord,
} from '../services/assessmentService';
import DeleteControl from './DeleteControl';
import WalkingStudentAvatar from './WalkingStudentAvatar';
import '../highway_zigzag.css';

const HIGHWAY_STOPPAGES = [
  {
    id: 1,
    stopCode: 'STOP 01',
    title: 'Build Fundamentals (DSA, OS, DBMS)',
    category: 'Computer Science Core',
    targetLabel: 'CGPA ≥ 7.50 & 0 Active Backlogs',
    checkMet: (p) => p && Number(p.cgpa || 0) >= 7.5 && Number(p.backlogs || 0) === 0,
    whyItMatters:
      'Top product & super-dream firms (Google, Microsoft, Amazon, Cisco, Oracle) enforce strict minimum cutoffs: CGPA ≥ 7.50 with zero active backlogs to unlock Round 1.',
    actionPlan: [
      'Prioritize continuous internal assessments and end-term exams to maintain cumulative CGPA above 7.50.',
      'Clear any pending arrears immediately during the supplementary/remedial examination window.',
      'Master core CS fundamentals: Operating Systems (Processes/Threads), DBMS (SQL/ACID), and Computer Networks.',
    ],
    resource: { name: 'LPU Academic Portal (UMS)', url: 'https://ums.lpu.in/' },
  },
  {
    id: 2,
    stopCode: 'STOP 02',
    title: 'Build Projects (AI/ML, Web, App)',
    category: 'Coding & Practical Engineering',
    targetLabel: 'Coding Score ≥ 75% & ≥ 2 Live Production Projects',
    checkMet: (p) => p && Number(p.coding_score || 0) >= 75 && Number(p.projects || 0) >= 2,
    whyItMatters:
      'Automated technical coding rounds on HackerRank and LeetCode eliminate over 70% of applicants; verified full-stack & ML projects with clean Git prove hands-on capability.',
    actionPlan: [
      'Solve daily 2 problems (1 Easy + 1 Medium) on LeetCode across Arrays, Strings, HashMaps, and Two Pointers.',
      'Build and deploy an end-to-end full-stack or ML web application with live cloud URL (Vercel/Render).',
      'Document architecture with system diagrams and clean Git commit history in your public portfolio.',
    ],
    resource: { name: 'LeetCode Curated Track', url: 'https://leetcode.com/problemset/all/' },
  },
  {
    id: 3,
    stopCode: 'STOP 03',
    title: 'Internship & Practical Experience',
    category: 'Technical Foundation & Industry Exposure',
    targetLabel: 'Technical Knowledge ≥ 75% & ≥ 1 Industry Internship',
    checkMet: (p) => p && Number(p.technical_score || 0) >= 75 && Number(p.internships || 0) >= 1,
    whyItMatters:
      'Technical interview panels look for candidates with real-world production experience, team collaboration, and deep systems understanding.',
    actionPlan: [
      'Apply to curated campus drive internships and open-source contributions.',
      'DBMS: Master complex SQL queries (JOINs, GROUP BY, Subqueries, B-Tree Indexing, and ACID properties).',
      'Revise OOPs design patterns and system design basics (REST APIs, Microservices, Caching).',
    ],
    resource: { name: 'GeeksforGeeks Core CS Fundamentals', url: 'https://www.geeksforgeeks.org/fundamentals-of-computer-science/' },
  },
  {
    id: 4,
    stopCode: 'STOP 04',
    title: 'GATE 2027 Preparation & Cognitive Screening',
    category: 'Aptitude & Speed Screening',
    targetLabel: 'Aptitude Score ≥ 70% (Quantitative & Logical Drills)',
    checkMet: (p) => p && Number(p.aptitude_score || 0) >= 70,
    whyItMatters:
      'Mass campus recruitment drives (TCS NQT, Infosys, Cognizant, Wipro, Capgemini) rely on timed cognitive and aptitude tests as their primary elimination filter.',
    actionPlan: [
      'Practice daily 30-45 minute timed sectional drills on Time & Work, Speed & Distance, Percentages, and Syllogisms.',
      'Memorize mental math shortcuts for square roots, fractions, and percentage change calculations.',
      'Solve previous company placement papers and mock tests on IndiaBIX and Prepleet.',
    ],
    resource: { name: 'IndiaBIX Quantitative Drills', url: 'https://www.indiabix.com/' },
  },
  {
    id: 5,
    stopCode: 'STOP 05',
    title: 'PSU / IIT / IISc / Govt Job (DSP / PCS)',
    category: 'Corporate HR & Professional Poise',
    targetLabel: 'Communication Score ≥ 70% (STAR Technique & Cultural Fit)',
    checkMet: (p) => p && Number(p.communication_score || 0) >= 70,
    whyItMatters:
      'HR and Leadership rounds evaluate professional poise, clarity of articulation, teamwork resilience, and cultural alignment before releasing offer letters.',
    actionPlan: [
      'Structure behavioral responses using the STAR framework: Situation, Task, Action, and Quantified Result.',
      'Deliver a polished 90-second elevator pitch covering academic background, core projects, and career aspirations.',
      'Record yourself answering standard HR behavioral questions on video to refine body language and remove filler words.',
    ],
    resource: { name: 'InterviewBit HR Questions Guide', url: 'https://www.interviewbit.com/hr-interview-questions/' },
  },
  {
    id: 6,
    stopCode: 'STOP 06',
    title: 'Final Goal: Campus Dream Placement Offer',
    category: 'Super-Dream Placement (8 to 24+ LPA)',
    targetLabel: 'All 6 Stoppages Cleared · Verified Offer Readiness',
    checkMet: (p) => p && Number(p.cgpa || 0) >= 7.5 && Number(p.coding_score || 0) >= 75 && Number(p.backlogs || 0) === 0,
    whyItMatters:
      'Clearing all 6 highway stoppages prepares you for top-tier corporate packages (8 to 24+ LPA) with zero eligibility friction and verified interview readiness.',
    actionPlan: [
      'Consolidate verified resume, GitHub repositories, and live project URLs.',
      'Schedule final mock interview sessions with faculty mentors.',
      'Review target corporate drive notices and company-specific interview archives.',
    ],
    resource: { name: 'LPU Placement Portal (UMS)', url: 'https://ums.lpu.in/' },
  },
];

function RoadmapPanelComponent({
  recommendations = [],
  studentId,
  assessmentDate,
  prediction = null,
}) {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');

  // Storage key for interactive road milestone checkboxes
  const storageKey = useMemo(() => `lpu_placement_road_ticks_${studentId || 'default'}`, [studentId]);

  // Load ticked stoppages from localStorage or initialize from diagnostic assessment
  const [checkedStops, setCheckedStops] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (_) {}

    // Auto-detect if profile already meets any milestones
    const profile = prediction?.student_profile;
    if (profile) {
      return HIGHWAY_STOPPAGES.filter((stop) => stop.checkMet(profile)).map((stop) => stop.id);
    }
    return [1]; // Default stop 1 checked as baseline
  });

  // Save checked state on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedStops));
    } catch (_) {}
  }, [checkedStops, storageKey]);

  // Walking Character Animation State
  const [currentWalkerStop, setCurrentWalkerStop] = useState(1);
  const [isWalking, setIsWalking] = useState(false);
  const [walkingStatusText, setWalkingStatusText] = useState('');
  const walkTimerRef = useRef(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const playAllTimerRef = useRef(null);

  // Walk character to a specific stop along the zigzag curve
  const walkToStop = useCallback((stopId, stopCode) => {
    if (walkTimerRef.current) clearTimeout(walkTimerRef.current);
    setIsWalking(true);
    setWalkingStatusText(`Walking to ${stopCode || `Stop 0${stopId}`}...`);
    setCurrentWalkerStop(stopId);

    walkTimerRef.current = setTimeout(() => {
      setIsWalking(false);
      setWalkingStatusText('');
    }, 2500);
  }, []);

  // Toggle stoppage checkbox — triggers character walking along the highway
  const toggleStop = useCallback((id) => {
    setCheckedStops((current) => {
      const exists = current.includes(id);
      const next = exists ? current.filter((x) => x !== id) : [...current, id];

      // Trigger walking character animation to this stoppage
      const stopObj = HIGHWAY_STOPPAGES.find((s) => s.id === id);
      if (stopObj) {
        walkToStop(id, stopObj.stopCode);
      }
      return next;
    });
  }, [walkToStop]);

  // Play full sequential journey through all stops
  const playFullJourney = useCallback(() => {
    setIsPlayingAll(true);
    let step = 1;
    walkToStop(step, HIGHWAY_STOPPAGES[step - 1].stopCode);

    const runNextStep = () => {
      step += 1;
      if (step <= HIGHWAY_STOPPAGES.length) {
        walkToStop(step, HIGHWAY_STOPPAGES[step - 1].stopCode);
        playAllTimerRef.current = setTimeout(runNextStep, 3000);
      } else {
        setIsPlayingAll(false);
      }
    };
    playAllTimerRef.current = setTimeout(runNextStep, 3000);
  }, [walkToStop]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (walkTimerRef.current) clearTimeout(walkTimerRef.current);
      if (playAllTimerRef.current) clearTimeout(playAllTimerRef.current);
    };
  }, []);

  const getWalkerTopPercent = (stopId) => {
    const map = { 1: 7, 2: 24, 3: 41, 4: 58, 5: 75, 6: 92 };
    return map[stopId] ?? 7;
  };

  const getWalkerLeftPercent = (stopId) => {
    // Alternates left and right across the central road spine to follow the S-curve
    const map = { 1: 54, 2: 46, 3: 54, 4: 46, 5: 54, 6: 50 };
    return map[stopId] ?? 50;
  };

  // Sync with current assessment profile
  const syncWithAssessment = useCallback(() => {
    const profile = prediction?.student_profile;
    if (!profile) {
      setSyncFeedback('No assessment profile data found to sync.');
      setTimeout(() => setSyncFeedback(''), 3000);
      return;
    }
    const metIds = HIGHWAY_STOPPAGES.filter((stop) => stop.checkMet(profile)).map((stop) => stop.id);
    setCheckedStops(metIds);
    setSyncFeedback(`Synced! ${metIds.length} of 6 milestones matched with your live assessment.`);
    setTimeout(() => setSyncFeedback(''), 4000);
  }, [prediction]);

  // Reset all checked stoppages
  const resetStops = useCallback(() => {
    setCheckedStops([]);
    setSyncFeedback('Roadmap checklist reset.');
    setTimeout(() => setSyncFeedback(''), 3000);
  }, []);

  const totalStops = HIGHWAY_STOPPAGES.length;
  const completedStops = checkedStops.length;
  const progressPercent = Math.round((completedStops / totalStops) * 100);

  const refresh = useCallback(async () => {
    if (!studentId) return;
    try {
      setRecords(await getCoachingRecords(studentId));
      setError('');
    } catch (err) {
      setError(err?.message || 'Saved action plans could not be loaded.');
    }
  }, [studentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addAction = async (actionTitle, actionDetail, due = null) => {
    setBusy(true);
    try {
      await createCoachingRecord(studentId, {
        kind: 'goal',
        title: actionTitle,
        detail: actionDetail,
        due_date: due,
        visibility: 'student',
      });
      await refresh();
      return true;
    } catch (err) {
      setError(err?.message || 'This action could not be saved.');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submitCustom = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    if (await addAction(title, detail, dueDate || null)) {
      setTitle('');
      setDetail('');
      setDueDate('');
    }
  };

  const patchRecord = async (record, changes) => {
    try {
      await updateCoachingRecord(studentId, record.id, changes);
      await refresh();
    } catch (err) {
      setError(err?.message || 'The action could not be updated.');
    }
  };

  const activeGoals = records.filter((record) => record.kind === 'goal');
  const completedGoals = activeGoals.filter((record) => record.status === 'completed').length;
  const suggested = recommendations.filter((rec) => !activeGoals.some((record) => record.title === rec.title));
  const defaultDue = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  };

  const preparationTasks = [
    ['Timed aptitude practice', 'Complete two timed quantitative, logical, or verbal practice sets and review incorrect answers.', 'https://www.indiabix.com/'],
    ['Coding assessment', 'Complete one timed coding assessment for your selected role and record the result.', 'https://www.hackerrank.com/'],
    ['Resume review', 'Review your resume for clear project outcomes, skills, links, and accurate dates.', 'https://www.ncs.gov.in/'],
    ['Mock interview', 'Schedule a mock interview with a mentor or peer; record one strength and one improvement.'],
    ['Communication practice', 'Practise a 90-second introduction and request feedback on clarity and structure.'],
    ['Group discussion practice', 'Join a practice discussion and reflect on listening, evidence, and turn-taking.'],
  ];

  return (
    <div className="student-roadmap">
      {/* =========================================================================
          ANIMATED HIGHWAY CAREER ROADMAP & TARGET STOPPAGES
          ========================================================================= */}
      <section className="road-master-wrapper" aria-label="Animated Career Highway Roadmap">
        {/* Road HUD Header Card */}
        <div className="road-hud-card">
          <div className="road-hud-header">
            <div>
              <h3 className="road-hud-title">
                <Compass className="text-orange-500" size={24} aria-hidden="true" />
                Placement Highway: Milestone & Stoppage Roadmap
              </h3>
              <p className="road-hud-tagline">
                Every stoppage is your target milestone. Track your progress, mark each checkpoint as completed, and drive your readiness to the Placement Finish Line!
              </p>
            </div>
            <div className="road-hud-actions">
              <button
                type="button"
                className="btn-hud-primary"
                onClick={playFullJourney}
                disabled={isWalking || isPlayingAll}
                title="Watch student character walk through all milestones"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: isWalking || isPlayingAll ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
                }}
              >
                <Play size={14} fill="currentColor" />
                {isPlayingAll ? 'Walking Highway...' : 'Play Highway Journey'}
              </button>

              <button
                type="button"
                className="btn-hud-sync"
                onClick={syncWithAssessment}
                title="Automatically evaluate milestones using your current assessment scores"
              >
                <Zap size={14} aria-hidden="true" />
                Auto-Sync with Assessment
              </button>

              <button
                type="button"
                className="btn-hud-reset"
                onClick={() => {
                  resetStops();
                  setCurrentWalkerStop(1);
                  setIsWalking(false);
                }}
                title="Reset completed milestones"
              >
                <RotateCcw size={13} aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>

          {syncFeedback && (
            <div className="status-banner status-banner-success mb-3" role="status">
              <Sparkles size={14} aria-hidden="true" /> {syncFeedback}
            </div>
          )}

          {/* Road Meter Progress Track with Dynamic Vehicle Indicator */}
          <div className="road-meter-container">
            <div className="road-meter-labels">
              <span className="road-meter-stats">
                Highway Progress: <span>{completedStops} of {totalStops}</span> Stoppages Cleared ({progressPercent}%)
              </span>
              <span className="text-secondary text-xs">
                {progressPercent === 100 ? '🎉 Placement Ready! All Targets Achieved' : '🚗 Journey in Progress'}
              </span>
            </div>

            <div className="road-track-surface">
              <div
                className="road-track-progress"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              >
                <div className="road-vehicle-pin" role="img" aria-label="Student vehicle navigating highway">
                  {progressPercent === 100 ? '🏆' : '🏎️'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CLEAN ZIGZAG HIGHWAY TRACK & ANIMATED WALKING MAN
            ========================================================================= */}
        <div className="highway-clean-container">
          <div className="highway-zigzag-track">
            {/* Background SVG Winding Road Ribbon connecting all checkpoints */}
            <svg
              className="highway-svg-spine"
              viewBox="0 0 140 1260"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Road Asphalt Base */}
              <path
                d="M 70 20 Q 125 125 70 230 Q 15 335 70 440 Q 125 545 70 650 Q 15 755 70 860 Q 125 965 70 1070 Q 70 1160 70 1240"
                stroke="#1e293b"
                strokeWidth="56"
                fill="none"
                strokeLinecap="round"
              />
              {/* Road Asphalt Surface */}
              <path
                d="M 70 20 Q 125 125 70 230 Q 15 335 70 440 Q 125 545 70 650 Q 15 755 70 860 Q 125 965 70 1070 Q 70 1160 70 1240"
                stroke="#334155"
                strokeWidth="46"
                fill="none"
                strokeLinecap="round"
              />
              {/* Glowing Yellow Side Curbs */}
              <path
                d="M 70 20 Q 125 125 70 230 Q 15 335 70 440 Q 125 545 70 650 Q 15 755 70 860 Q 125 965 70 1070 Q 70 1160 70 1240"
                stroke="#f59e0b"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="8 8"
                opacity="0.8"
              />
              {/* Animated White Dashes */}
              <path
                className="road-dash-stream"
                d="M 70 20 Q 125 125 70 230 Q 15 335 70 440 Q 125 545 70 650 Q 15 755 70 860 Q 125 965 70 1070 Q 70 1160 70 1240"
                stroke="#ffffff"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="14 18"
                opacity="0.6"
              />
            </svg>

            {/* Dynamic Animated Walking Character */}
            <div
              className={`highway-walking-actor ${isWalking ? 'is-moving' : ''}`}
              style={{
                top: `${getWalkerTopPercent(currentWalkerStop)}%`,
                left: `${getWalkerLeftPercent(currentWalkerStop)}%`,
              }}
              aria-label="Student walking character on highway"
            >
              {isWalking && (
                <div className="walking-status-bubble">
                  <span>🚶</span> {walkingStatusText || 'Walking to next milestone...'}
                </div>
              )}
              <div className="walking-avatar-wrapper">
                <WalkingStudentAvatar isWalking={isWalking} />
              </div>
            </div>

            {/* Alternating Checkpoint Rows */}
            {HIGHWAY_STOPPAGES.map((stop, index) => {
              const isDone = checkedStops.includes(stop.id);
              const isCurrent = currentWalkerStop === stop.id;
              const isEven = index % 2 === 0;
              const rowClass = isEven ? 'row-left' : 'row-right';
              const themeColor = ['#38bdf8', '#2dd4bf', '#f59e0b', '#a855f7', '#fb923c', '#10b981'][index % 6];

              return (
                <div
                  key={stop.id}
                  className={`highway-checkpoint-row ${rowClass}`}
                  id={`checkpoint-${stop.id}`}
                >
                  {/* Detailed Target Card */}
                  <div className="checkpoint-card-col">
                    <article
                      className={`highway-clean-card ${isDone ? 'is-cleared' : ''}`}
                      style={{ '--card-border-color': themeColor }}
                    >
                      <div className="clean-card-header">
                        <div className="clean-card-badges">
                          <span className="clean-badge-category">{stop.category}</span>
                          <span className="clean-badge-status">
                            {isDone ? '✓ CLEARED' : 'TARGET MILESTONE'}
                          </span>
                        </div>

                        {/* Interactive Tick Toggle Button */}
                        <button
                          type="button"
                          className={`btn-clean-tick ${isDone ? 'is-ticked' : ''}`}
                          onClick={() => toggleStop(stop.id)}
                          aria-pressed={isDone}
                        >
                          {isDone ? (
                            <>
                              <CheckSquare size={16} className="text-emerald-400" />
                              <span>Completed ✔</span>
                            </>
                          ) : (
                            <>
                              <Circle size={15} />
                              <span>Mark Tick if Completed</span>
                            </>
                          )}
                        </button>
                      </div>

                      <h4 className="clean-card-title">{stop.title}</h4>

                      {/* Explicit Target Box */}
                      <div className="clean-target-box">
                        <Target size={16} className="text-amber-400 flex-shrink-0" />
                        <span>
                          <strong>Target:</strong> {stop.targetLabel}
                        </span>
                      </div>

                      <p className="clean-card-why">{stop.whyItMatters}</p>

                      {/* How to Improve Guidance */}
                      <div className="clean-action-box">
                        <div className="clean-action-title">
                          <Flame size={14} /> How to Improve &amp; Clear This Target:
                        </div>
                        <ul className="clean-action-list">
                          {stop.actionPlan.map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="clean-card-footer">
                        <span className="text-muted">
                          {isDone ? 'Status: Target Met & Verified' : 'Action Required to Cross Cutoff'}
                        </span>
                        {stop.resource && (
                          <a
                            href={stop.resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="clean-resource-link"
                          >
                            <ExternalLink size={13} />
                            Practice on {stop.resource.name}
                          </a>
                        )}
                      </div>
                    </article>
                  </div>

                  {/* Road Center Node Pin */}
                  <div className="checkpoint-node-col">
                    <div className="checkpoint-connector-line" />
                    <button
                      type="button"
                      className={`checkpoint-pin-button ${isDone ? 'cleared' : ''} ${isCurrent ? 'active' : ''}`}
                      onClick={() => toggleStop(stop.id)}
                      title={`Click to mark ${stop.stopCode} as completed`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={26} className="text-emerald-400" />
                      ) : (
                        <span style={{ fontWeight: 800, fontSize: '18px' }}>{stop.id}</span>
                      )}
                    </button>
                    <span className="checkpoint-pin-code">{stop.stopCode}</span>
                  </div>

                  {/* Spacer Balancer for Opposite Side */}
                  <div className="checkpoint-spacer-col">
                    <div className="spacer-milestone-preview">
                      <Sparkles size={14} className="text-amber-400" />
                      <span>{isDone ? 'Milestone target achieved! Keep driving forward.' : 'Next target in your placement preparation highway.'}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Destination Summit Finish Banner */}
            <div className="highway-finish-stage">
              <div className="finish-trophy-circle">
                <Trophy size={32} className="text-amber-400" />
              </div>
              <div className="finish-content">
                <h4>🏁 Destination: Campus Dream Placement Offer (8–24+ LPA)</h4>
                <p>
                  Systematically clearing all 6 highway milestones prepares you for top-tier product and consulting recruitment with zero eligibility friction, strong CS fundamentals, and verified interview poise.
                </p>
                {progressPercent === 100 && (
                  <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981', color: '#6ee7b7', padding: '4px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px' }}>
                    <Sparkles size={16} /> ALL 6 TARGETS ACHIEVED! VERIFIED PLACEMENT READY!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXISTING PERSONAL COACHING & MENTOR ACTION PLANS
          ========================================================================= */}
      <div className="progress-summary-grid">
        <article className="metric-card">
          <span className="metric-card-label">Actions in plan</span>
          <strong className="metric-card-value">{activeGoals.length}</strong>
        </article>
        <article className="metric-card metric-card-success">
          <span className="metric-card-label">Completed</span>
          <strong className="metric-card-value">{completedGoals}</strong>
        </article>
        <article className="metric-card metric-card-primary">
          <span className="metric-card-label">Coaching Progress</span>
          <strong className="metric-card-value">
            {activeGoals.length ? `${Math.round((completedGoals / activeGoals.length) * 100)}%` : '—'}
          </strong>
        </article>
      </div>

      {error && (
        <div className="status-banner status-banner-warning" role="status">
          {error}
          <button className="inline-retry" type="button" onClick={refresh}>
            <RefreshCw size={14} aria-hidden="true" /> Retry
          </button>
        </div>
      )}

      <h3 className="panel-subheading">Your Personalized Action Plan</h3>
      {activeGoals.length === 0 ? (
        <p className="probability-note">
          Save one or two focused actions. Completing a resource does not automatically change your readiness result; reassess with evidence.
        </p>
      ) : (
        <div className="rec-list">
          {activeGoals.map((record) => (
            <article className="rec-card" key={record.id}>
              <div className="rec-header">
                <span className="rec-badge">
                  {record.status === 'completed'
                    ? 'Completed'
                    : record.status === 'in_progress'
                    ? 'In progress'
                    : 'Not started'}
                </span>
                <span className="rec-priority">
                  {record.due_date ? `Due ${record.due_date}` : 'No due date'}
                </span>
              </div>
              <h4 className="rec-title">{record.title}</h4>
              {record.detail && <p className="rec-details">{record.detail}</p>}
              <label className="input-label">
                Action status
                <select
                  className="number-input-field"
                  value={record.status}
                  onChange={(event) => patchRecord(record, { status: event.target.value })}
                >
                  <option value="open">Not started</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <EvidenceLink
                record={record}
                onSave={(evidence_url) => patchRecord(record, { evidence_url })}
              />
              {record.author_id === studentId && (
                <DeleteControl
                  label={`goal ${record.title}`}
                  onDelete={async () => {
                    await deleteCoachingRecord(studentId, record.id);
                    setRecords((current) => current.filter((item) => item.id !== record.id));
                  }}
                />
              )}
            </article>
          ))}
        </div>
      )}

      {suggested.length > 0 && (
        <>
          <h3 className="panel-subheading">Recommended next actions</h3>
          <p className="probability-note">
            Showing up to three priorities. Reassess after completing an action; the score is not guaranteed to change.
          </p>
          <div className="rec-list">
            {suggested.slice(0, 3).map((rec) => (
              <article className="rec-card" key={rec.title}>
                <div className="rec-header">
                  <span className="rec-badge">{rec.badge || 'From this assessment'}</span>
                  <span className={`rec-priority ${rec.priority || ''}`}>
                    {rec.priority || 'Suggested'} priority
                  </span>
                </div>
                <h4 className="rec-title">{rec.title}</h4>
                <p className="rec-details">
                  <strong>Gap / interpretation:</strong> {rec.details}
                </p>
                <p className="rec-details">
                  <strong>Evidence:</strong> {rec.evidence || `Profile area: ${rec.target_feature || 'overall readiness'}`}
                  {assessmentDate ? ` · Latest assessment ${new Date(assessmentDate).toLocaleDateString()}` : ''}
                </p>
                <p className="rec-details">
                  <strong>Effort:</strong> About {rec.effort_hours || 3} hours ·{' '}
                  <strong>Suggested due date:</strong>{' '}
                  {new Date(new Date().setDate(new Date().getDate() + (rec.suggested_days || 7))).toLocaleDateString()}
                </p>
                <ul className="rec-actions-list">
                  {(rec.action_items || []).slice(0, 3).map((item) => (
                    <li key={item}>
                      <span className="rec-bullet" aria-hidden="true">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="probability-note">
                  <strong>Progress check:</strong> {rec.progress_measure || 'Review with your mentor and reassess after the action.'}
                </p>
                <button
                  className="btn-primary"
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    addAction(
                      rec.title,
                      [
                        rec.details,
                        rec.evidence && `Evidence: ${rec.evidence}`,
                        rec.action_items?.slice(0, 3).join(' '),
                        `Estimated effort: about ${rec.effort_hours || 3} hours.`,
                        `Progress check: ${rec.progress_measure || 'Review with a mentor and reassess.'}`,
                      ]
                        .filter(Boolean)
                        .join(' '),
                      defaultDue()
                    )
                  }
                >
                  <Plus size={15} aria-hidden="true" /> Add to my plan · 1 week
                </button>
              </article>
            ))}
          </div>
        </>
      )}

      <form className="rec-card" onSubmit={submitCustom}>
        <h3 className="panel-subheading">
          <Plus size={16} aria-hidden="true" /> Add a personal goal
        </h3>
        <label className="input-label" htmlFor="personal-goal-title">
          Goal
        </label>
        <input
          id="personal-goal-title"
          className="number-input-field"
          required
          maxLength={140}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Complete a mock interview"
        />
        <label className="input-label" htmlFor="personal-goal-detail">
          Plan and progress measure
        </label>
        <textarea
          id="personal-goal-detail"
          className="number-input-field"
          rows={3}
          maxLength={2000}
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          placeholder="What will you do, and how will you show completion?"
        />
        <label className="input-label" htmlFor="personal-goal-date">
          Due date
        </label>
        <input
          id="personal-goal-date"
          className="number-input-field"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          onInput={(event) => setDueDate(event.currentTarget.value)}
        />
        <button type="submit" className="btn-primary" disabled={busy}>
          <CalendarDays size={15} aria-hidden="true" /> Save goal
        </button>
      </form>

      <details className="rec-card">
        <summary className="rec-summary">
          <strong>Preparation library</strong>
          <span className="rec-toggle">Add a practice goal</span>
        </summary>
        <p className="probability-note">
          These are preparation activities, not automatic score boosts. Add a task to your plan, complete it, and then reassess.
        </p>
        {preparationTasks.map(([task, description, url]) => (
          <div className="rec-header" key={task}>
            <span>
              <strong>{task}</strong>
              <br />
              <small>{description}</small>
              {url && (
                <>
                  <br />
                  <a href={url} target="_blank" rel="noreferrer">
                    Open practice resource
                  </a>
                </>
              )}
            </span>
            <button
              type="button"
              className="btn-preset"
              disabled={busy || activeGoals.some((item) => item.title === task)}
              onClick={() => addAction(task, description, defaultDue())}
            >
              <Plus size={14} aria-hidden="true" /> Add
            </button>
          </div>
        ))}
      </details>
      <p className="probability-note">
        <CheckCircle2 size={14} aria-hidden="true" /> Your actions are saved to the shared account record so an authorized mentor can follow progress. Only you and permitted staff can access them.
      </p>
    </div>
  );
}

function EvidenceLink({ record, onSave }) {
  const [url, setUrl] = useState(record.evidence_url || '');
  useEffect(() => setUrl(record.evidence_url || ''), [record.evidence_url]);
  return (
    <form
      className="evidence-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(url);
      }}
    >
      <label className="input-label" htmlFor={`evidence-${record.id}`}>
        Evidence link (optional)
      </label>
      <input
        id={`evidence-${record.id}`}
        className="number-input-field"
        type="url"
        maxLength={500}
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://…"
      />
      <button className="btn-primary evidence-save-button" type="submit">
        <Save size={15} aria-hidden="true" /> Save evidence
      </button>
    </form>
  );
}

export default memo(RoadmapPanelComponent);
