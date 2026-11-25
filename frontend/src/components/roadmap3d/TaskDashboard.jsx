import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  ExternalLink,
  Target,
  Sparkles,
  Flame,
  ChevronRight,
  Info,
  Compass,
} from 'lucide-react';
import { MILESTONES_DATA } from './roadCurve';

export default function TaskDashboard({
  activeMilestone,
  completedIds = [],
  isWalking,
  isPlayingJourney,
  onSelectMilestone,
  onPlayJourney,
  onPauseJourney,
  onResetJourney,
  onToggleComplete,
  progressPercent = 0,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(true);

  const isCurrentDone = activeMilestone ? completedIds.includes(activeMilestone.id) : false;

  return (
    <aside className={`roadmap-3d-hud ${collapsed ? 'collapsed' : ''}`} aria-label="3D Roadmap Dashboard">
      {/* Collapse Toggle Pill */}
      <button
        type="button"
        className="hud-collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand Roadmap Controls' : 'Collapse HUD'}
      >
        <ChevronRight size={18} className={collapsed ? '' : 'rotate-180'} />
      </button>

      {!collapsed && (
        <div className="hud-content-box">
          {/* Header Card */}
          <div className="hud-header">
            <div className="hud-title-row">
              <Compass size={20} className="text-amber-400" />
              <div>
                <h3 className="hud-main-title">Career Highway 3D</h3>
                <span className="hud-sub-label">Interactive Mountain Roadmap</span>
              </div>
            </div>

            {/* Overall Progress Meter */}
            <div className="hud-progress-block">
              <div className="hud-progress-labels">
                <span>Progress: {completedIds.length} of {MILESTONES_DATA.length} Targets</span>
                <span className="hud-percent-badge">{progressPercent}%</span>
              </div>
              <div className="hud-progress-track">
                <div
                  className="hud-progress-fill"
                  style={{ width: `${Math.max(4, progressPercent)}%` }}
                />
              </div>
            </div>

            {/* Journey Control Action Bar */}
            <div className="hud-controls-row">
              {!isPlayingJourney ? (
                <button
                  type="button"
                  className="btn-hud-primary"
                  onClick={onPlayJourney}
                  disabled={isWalking}
                  title="Automatically walk through each milestone"
                >
                  <Play size={14} fill="currentColor" /> Play Journey
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-hud-warning"
                  onClick={onPauseJourney}
                  title="Pause walking journey"
                >
                  <Pause size={14} fill="currentColor" /> Pause
                </button>
              )}

              <button
                type="button"
                className="btn-hud-secondary"
                onClick={onResetJourney}
                title="Return character to Start position"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </div>

          {/* Interactive Milestones List */}
          <div className="hud-milestones-list">
            <span className="hud-section-label">SELECT ROADMAP STOPPAGE</span>
            {MILESTONES_DATA.map((milestone) => {
              const isSelected = activeMilestone?.id === milestone.id;
              const isDone = completedIds.includes(milestone.id);

              return (
                <button
                  key={milestone.id}
                  type="button"
                  onClick={() => onSelectMilestone(milestone)}
                  className={`hud-milestone-item ${isSelected ? 'active' : ''} ${isDone ? 'done' : ''}`}
                  style={{ '--milestone-color': milestone.badgeColor }}
                >
                  <div className="item-marker">
                    {isDone ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <Circle size={15} style={{ color: milestone.badgeColor }} />
                    )}
                  </div>
                  <div className="item-text">
                    <span className="item-title">{milestone.title}</span>
                    <span className="item-sub">{milestone.subtitle}</span>
                  </div>
                  {isSelected && isWalking && (
                    <span className="item-walking-tag">Walking...</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Milestone Detailed Task Panel */}
          {activeMilestone && showTaskDetail && (
            <div className="hud-task-card">
              <div className="task-card-header">
                <div>
                  <span className="task-category-pill" style={{ color: activeMilestone.badgeColor }}>
                    {activeMilestone.category}
                  </span>
                  <h4 className="task-title">{activeMilestone.title}</h4>
                </div>
                <button
                  type="button"
                  className="btn-tick-complete"
                  onClick={() => onToggleComplete(activeMilestone.id)}
                  aria-pressed={isCurrentDone}
                >
                  {isCurrentDone ? (
                    <>
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      <span>Completed ✓</span>
                    </>
                  ) : (
                    <>
                      <Circle size={14} />
                      <span>Mark Tick</span>
                    </>
                  )}
                </button>
              </div>

              {/* Target threshold */}
              <div className="task-target-box">
                <Target size={14} className="text-amber-400 flex-shrink-0" />
                <span>
                  <strong>Target:</strong> {activeMilestone.target}
                </span>
              </div>

              <p className="task-why-text">{activeMilestone.whyItMatters}</p>

              {/* Action plan checklist */}
              <div className="task-action-box">
                <div className="task-action-heading">
                  <Flame size={13} className="text-orange-400" /> Improvement Action Plan:
                </div>
                <ul className="task-action-list">
                  {activeMilestone.actionPlan.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              <div className="task-footer">
                <span className="text-xs text-slate-400">
                  <Info size={12} className="inline mr-1" /> Practice on {activeMilestone.resource}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
