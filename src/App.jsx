import { useEffect, useMemo, useRef, useState } from "react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import {
  AppWindow,
  Briefcase,
  CalendarBlank,
  CaretDown,
  ChartBar,
  CheckCircle,
  Clock,
  Cloud,
  Database,
  DotsThree,
  DownloadSimple,
  FloppyDisk,
  Gear,
  Info,
  Lightbulb,
  List,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  SquaresFour,
  Square,
  Target,
  Timer,
  Trash,
  UploadSimple,
  User,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { SiSap } from "react-icons/si";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: SquaresFour },
  { id: "applications", label: "Applications", icon: AppWindow },
  { id: "time-log", label: "Time Log", icon: Timer },
  { id: "insights", label: "Insights", icon: Lightbulb },
  { id: "settings", label: "Settings", icon: Gear },
];

const activityOptions = [
  "Requirements Gathering",
  "Requirements Analysis",
  "Test Planning",
  "Entry Criteria",
  "Exit Criteria",
  "Test Execution",
  "Defect Retesting",
  "Bug Reporting",
  "Cross-team Coordination",
];

const activityShort = {
  "Requirements Gathering": "Req Gather",
  "Requirements Analysis": "Req Analysis",
  "Test Planning": "Planning",
  "Entry Criteria": "Entry Crit",
  "Exit Criteria": "Exit Crit",
  "Test Execution": "Execution",
  "Defect Retesting": "Re-testing",
  "Bug Reporting": "Bug Report",
  "Cross-team Coordination": "Coordination",
};

const chartData = [
  { name: "Requirements", estimated: 40, actual: 26.5 },
  { name: "Analysis", estimated: 55, actual: 22 },
  { name: "Planning", estimated: 68, actual: 21.5 },
  { name: "Entry Criteria", estimated: 25, actual: 7 },
  { name: "Exit Criteria", estimated: 20, actual: 0 },
  { name: "Execution", estimated: 283, actual: 71.5 },
  { name: "Retesting", estimated: 82, actual: 11 },
  { name: "Bug Reporting", estimated: 48, actual: 6.5 },
  { name: "Coordination", estimated: 62, actual: 12.5 },
];

const defaultApps = [
  {
    id: "crm",
    source: "CRM",
    target: "Salesforce",
    description: "Accounts, contacts & 1.2M activity records",
    testPhase: "SIT",
    startDate: "2026-08-03",
    endDate: "2026-09-25",
    complexity: "High",
    multiplier: 1.2,
    estimate: 198.7,
    doneEstimate: 54.1,
    ceiling: 224.4,
    progress: 64,
    variance: -36,
    color: "blue",
  },
  {
    id: "hr",
    source: "HR Legacy DB",
    target: "Workday",
    description: "Employee master + payroll history",
    testPhase: "UAT",
    startDate: "2026-09-01",
    endDate: "2026-10-30",
    complexity: "Medium",
    multiplier: 1,
    estimate: 114.6,
    doneEstimate: 28.6,
    ceiling: 127.8,
    progress: 36,
    variance: -64,
    color: "green",
  },
  {
    id: "billing",
    source: "Billing",
    target: "SAP S/4HANA",
    description: "Open items, tax data, 7yr archive",
    testPhase: "Regression",
    startDate: "2026-10-05",
    endDate: "2026-12-18",
    complexity: "Very High",
    multiplier: 1.4,
    estimate: 328.4,
    doneEstimate: 0,
    ceiling: 375,
    progress: 3,
    variance: -97,
    color: "navy",
  },
];

const defaultEntries = [
  ["2026-07-17", "crm", "Test Execution", "Diego Tan", 8, "UAT support"],
  ["2026-07-17", "billing", "Requirements Gathering", "Ben Cruz", 4, "Archive scope review"],
  ["2026-07-16", "crm", "Test Execution", "Ben Cruz", 9.5, "Delta load verification"],
  ["2026-07-16", "crm", "Bug Reporting", "Diego Tan", 3, "Triage + evidence"],
  ["2026-07-15", "crm", "Defect Retesting", "Carla Reyes", 7, "Retest address defects"],
  ["2026-07-15", "crm", "Cross-team Coordination", "Aria Santos", 4.5, "Cutover rehearsal call"],
  ["2026-07-15", "hr", "Bug Reporting", "Diego Tan", 2, "Logged 5 defects"],
  ["2026-07-14", "crm", "Test Execution", "Carla Reyes", 9, "Reconciliation queries"],
  ["2026-07-14", "hr", "Test Execution", "Carla Reyes", 6.5, "Benefits mapping checks"],
  ["2026-07-14", "billing", "Requirements Gathering", "Aria Santos", 6, "Finance stakeholder intake"],
  ["2026-07-13", "crm", "Test Execution", "Diego Tan", 8, "Duplicate checks"],
  ["2026-07-13", "crm", "Bug Reporting", "Ben Cruz", 3.5, "Logged 14 defects"],
  ["2026-07-13", "hr", "Cross-team Coordination", "Aria Santos", 3, "Workday vendor call"],
  ["2026-07-12", "crm", "Test Execution", "Ben Cruz", 8.5, "Mock run 2"],
  ["2026-07-12", "crm", "Defect Retesting", "Diego Tan", 6, "Retest DEF-114 batch"],
  ["2026-07-12", "hr", "Test Execution", "Diego Tan", 7, "Employee master load test"],
  ["2026-07-11", "crm", "Test Execution", "Carla Reyes", 8, "Field-level validation"],
  ["2026-07-11", "hr", "Entry Criteria", "Diego Tan", 2, "Env readiness check"],
  ["2026-07-10", "crm", "Test Execution", "Ben Cruz", 8, "Mock run 1 – record counts"],
  ["2026-07-10", "crm", "Cross-team Coordination", "Aria Santos", 4, "Sync w/ ETL team"],
  ["2026-07-09", "crm", "Test Planning", "Ben Cruz", 5.5, "Reconciliation approach"],
  ["2026-07-09", "crm", "Entry Criteria", "Carla Reyes", 4, "Entry checklist sign-off"],
  ["2026-07-08", "crm", "Test Planning", "Aria Santos", 7, "Migration test plan v1"],
  ["2026-07-08", "hr", "Test Planning", "Diego Tan", 8, "Test plan + data sets"],
  ["2026-07-07", "crm", "Requirements Analysis", "Carla Reyes", 6, "Data profiling"],
  ["2026-07-07", "hr", "Requirements Analysis", "Carla Reyes", 7.5, "Payroll rules analysis"],
  ["2026-07-06", "crm", "Requirements Analysis", "Aria Santos", 8, "Mapping spec analysis"],
  ["2026-07-06", "hr", "Requirements Gathering", "Carla Reyes", 5.5, "HR data owners intake"],
  ["2026-07-05", "crm", "Requirements Gathering", "Aria Santos", 5, "Stakeholder workshop"],
  ["2026-07-05", "crm", "Requirements Gathering", "Ben Cruz", 4.5, "Field mapping review"],
].map((entry, index) => ({ id: `entry-${index + 1}`, date: entry[0], appId: entry[1], activity: entry[2], tester: entry[3], hours: entry[4], note: entry[5] }));

const defaultTeam = ["Aria Santos", "Ben Cruz", "Carla Reyes", "Diego Tan"];

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function appName(app) {
  const source = app.source?.trim();
  return source ? `${source} → ${app.target}` : app.target;
}

function formatHours(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}h` : `${rounded.toFixed(1)}h`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function formatScheduleDate(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function AppLogo({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <img src="/migrateqa-logo.png" alt="" />
      </span>
      <div className="brand-copy">
        <div className="brand-name">Migrate<span>QA</span></div>
        {!compact && <div className="brand-subtitle">Data Migration<br />QA Estimation & Tracking</div>}
      </div>
    </div>
  );
}

function Sidebar({ page, onNavigate }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <AppLogo />
      <nav className="side-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              aria-current={page === item.id ? "page" : undefined}
            >
              <Icon size={22} weight={page === item.id ? "fill" : "regular"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-foot">
        <span className="status-dot" />
        <div><strong>Program active</strong><small>Last saved just now</small></div>
      </div>
    </aside>
  );
}

function MobileNav({ page, onNavigate }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => onNavigate(item.id)}>
            <Icon size={21} weight={page === item.id ? "fill" : "regular"} />
            <span>{item.label.replace("Applications", "Apps").replace("Time Log", "Time")}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Header({ programTitle, onLogTime }) {
  const today = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="topbar">
      <div className="workspace-title">{programTitle}</div>
      <div className="topbar-actions">
        <span className="as-of-date"><CalendarBlank size={18} /> Data as of {today}</span>
        <button className="button primary" onClick={onLogTime}><Clock size={19} /> Log time</button>
      </div>
      <div className="mobile-topbar">
        <AppLogo compact />
        <button className="icon-button" onClick={onLogTime} aria-label="Log time"><Plus size={22} /></button>
      </div>
    </header>
  );
}

function Metric({ icon: Icon, tone, label, value, detail }) {
  return (
    <div className={`metric metric-${tone}`}>
      <div className={`metric-icon ${tone}`}><Icon size={30} weight="duotone" /></div>
      <div>
        <span className="eyebrow">{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function MigrationIcon({ app }) {
  if (app.logo) return <div className="migration-logo custom"><img src={app.logo} alt="" /></div>;
  if (app.id === "billing") return <div className="migration-logo sap"><SiSap size={35} /></div>;
  if (app.id === "crm") return <div className="migration-logo salesforce"><Cloud size={25} weight="fill" /></div>;
  return <div className="migration-logo database"><Database size={25} weight="fill" /></div>;
}

function HealthDonut({ consumed }) {
  const data = [{ name: "Consumed", value: consumed }, { name: "Remaining", value: 100 - consumed }];
  return (
    <div className="health-donut" aria-label={`${consumed}% of estimate consumed`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={44} outerRadius={57} startAngle={90} endAngle={-270} stroke="none" isAnimationActive={false}>
            <Cell fill="#079455" />
            <Cell fill="#e9edf3" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-label"><strong>{consumed}%</strong><span>consumed</span></div>
    </div>
  );
}

function ActivityChart() {
  const [view, setView] = useState("chart");

  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div><h2>Estimated vs actual by activity</h2></div>
        <div className="chart-view-toggle" aria-label="Activity data view">
          <button className={view === "chart" ? "active" : ""} onClick={() => setView("chart")} aria-label="Show chart" aria-pressed={view === "chart"}><ChartBar size={20} weight="bold" /></button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="Show list" aria-pressed={view === "list"}><List size={20} weight="bold" /></button>
        </div>
      </div>
      <div className="chart-legend" aria-hidden="true">
        <span><Square size={11} weight="fill" color="#155eef" />Estimated</span>
        <span><Square size={11} weight="fill" color="#06a6a6" />Actual</span>
      </div>
      {view === "chart" ? (
        <div className="chart-wrap" role="img" aria-label="Estimated versus actual hours by testing activity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }} barGap={4}>
              <CartesianGrid vertical={false} stroke="#dfe5ee" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: "#42526b", fontSize: 11 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis
                domain={[0, 283]}
                ticks={[0, 71, 142, 212, 283]}
                tick={{ fill: "#42526b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{ value: "Hours", angle: -90, position: "insideLeft", offset: 11, fill: "#42526b", fontSize: 11 }}
              />
              <Tooltip cursor={{ fill: "#f5f8fc" }} contentStyle={{ border: "1px solid #d9e0ea", borderRadius: 10, boxShadow: "0 8px 22px rgba(15,23,42,.08)" }} />
              <Bar dataKey="estimated" fill="#155eef" radius={[4, 4, 0, 0]} maxBarSize={26} isAnimationActive />
              <Bar dataKey="actual" fill="#06a6a6" radius={[4, 4, 0, 0]} maxBarSize={26} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="activity-list" role="table" aria-label="Estimated and actual hours by activity">
          <div className="activity-list-head" role="row"><span>Activity</span><span>Estimated</span><span>Actual</span><span>Consumed</span></div>
          {chartData.map((item) => <div className="activity-list-row" role="row" key={item.name}><strong>{item.name}</strong><span>{formatHours(item.estimated)}</span><span>{formatHours(item.actual)}</span><span>{Math.round((item.actual / item.estimated) * 100)}%</span></div>)}
        </div>
      )}
    </section>
  );
}

function HealthPanel({ actual, estimated }) {
  const consumed = Math.round((actual / estimated) * 100);
  return (
    <section className="panel health-panel">
      <div className="panel-heading health-heading"><h2>Program health & forecast</h2><span className="status-chip"><span />On track</span></div>
      <div className="health-summary">
        <HealthDonut consumed={consumed} />
        <dl>
          <div><dt>Total estimate</dt><dd>{formatHours(estimated)}</dd></div>
          <div><dt>Actual logged</dt><dd>{formatHours(actual)}</dd></div>
          <div><dt>Remaining budget</dt><dd>{formatHours(estimated - actual)}</dd></div>
        </dl>
      </div>
      <div className="forecast">
        <div className="forecast-title">Forecast at completion (95% confidence)<Info size={15} /></div>
        <div className="forecast-row"><span>Expected completion</span><strong>557.6h</strong></div>
        <div className="forecast-row"><span>Expected headroom vs estimate</span><strong className="positive">-84.2h (-13%)</strong></div>
        <div className="forecast-row"><span>Upper confidence ceiling</span><strong>727.2h</strong></div>
        <div className="forecast-row"><span>Efficiency on done activities</span><strong>135%</strong></div>
      </div>
      <p className="confidence-note">Confidence is based on variance from completed activities.</p>
    </section>
  );
}

function ApplicationsTable({ apps, entries, onSelect }) {
  const appActual = (id) => entries.filter((e) => e.appId === id).reduce((sum, e) => sum + Number(e.hours), 0);
  return (
    <section className="migration-section panel">
      <div className="section-heading"><h2>Application migrations</h2></div>
      <div className="migration-table">
        <div className="table-head migration-grid">
          <span>Application</span><span>Estimate risk</span><span>Progress</span><span>Status</span><span>Actions</span>
        </div>
        {apps.map((app) => {
          const logged = appActual(app.id);
          const progress = Math.min(100, Math.round((logged / app.estimate) * 100));
          return (
            <button className="table-row migration-grid" key={app.id} onClick={() => onSelect("applications")} aria-label={`Open ${appName(app)}`}>
              <div className="migration-name"><MigrationIcon app={app} /><div><strong>{appName(app)}</strong></div></div>
              <div className="risk-cell"><span className={`risk-dot ${app.color}`} /><span>{app.complexity}</span><small>×{app.multiplier.toFixed(1)}</small></div>
              <div className="progress-cell"><div><span>{formatHours(logged)} logged of {formatHours(app.estimate)} estimated</span><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div></div>
              <strong className="positive status-variance">{app.variance}%</strong>
              <span className="row-menu" aria-hidden="true"><DotsThree size={21} weight="bold" /></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Dashboard({ apps, entries, programTitle, onNavigate, onLogTime }) {
  const actual = entries.reduce((sum, entry) => sum + Number(entry.hours), 0);
  const estimated = 641.8;
  const remaining = estimated - actual;
  return (
    <div className="page dashboard-page">
      <div className="metrics-grid">
        <Metric icon={Clock} tone="purple" label="Total estimated" value={formatHours(estimated)} detail="80.2 person-days incl. 15% contingency" />
        <Metric icon={PencilSimple} tone="green" label="Actual logged" value={formatHours(actual)} detail={`${entries.length} entries • ${(actual / 8).toFixed(1)} person-days`} />
        <Metric icon={Briefcase} tone="blue" label="Remaining budget" value={formatHours(remaining)} detail={`${Math.round((actual / estimated) * 100)}% of estimate consumed`} />
        <Metric icon={Target} tone="cyan" label="Estimation accuracy" value="74%" detail="on Done activities • efficiency 135%" />
      </div>
      <div className="analysis-grid dashboard-analysis"><ActivityChart /></div>
      <ApplicationsTable apps={apps} entries={entries} onSelect={onNavigate} />
    </div>
  );
}

function ApplicationsPage({ apps, entries, onAdd, onEdit, onDelete }) {
  const appActual = (id) => entries.filter((e) => e.appId === id).reduce((sum, e) => sum + Number(e.hours), 0);
  return (
    <div className="page standard-page">
      <PageHeader kicker="Portfolio" title="Application migrations" description="Manage scope, complexity, progress, and confidence across every migration." action={<button className="button primary" onClick={onAdd}><Plus size={18} /> Add application</button>} />
      <div className="application-cards">
        {apps.map((app) => {
          const logged = appActual(app.id);
          const progress = Math.min(100, Math.round((logged / app.estimate) * 100));
          return (
            <article className="application-card" key={app.id}>
              <div className="app-card-main">
                <button className="application-logo-button" onClick={() => onEdit(app)} aria-label={`Update logo for ${appName(app)}`}>
                  <MigrationIcon app={app} />
                  <span><PencilSimple size={12} weight="bold" /></span>
                </button>
                <div className="app-card-title"><h2>{appName(app)}</h2><p>{app.description}</p>{(app.startDate || app.endDate) && <span className="app-date-range"><CalendarBlank size={13} />{app.startDate ? formatScheduleDate(app.startDate) : "Not scheduled"} – {app.endDate ? formatScheduleDate(app.endDate) : "Open ended"}</span>}</div>
              </div>
              <div className="app-card-badges"><span className="phase-chip">{app.testPhase || "SIT"}</span><span className={`complexity ${app.complexity.toLowerCase().replace(" ", "-")}`}>{app.complexity} ×{app.multiplier.toFixed(1)}</span><span className="status-chip"><span />On track</span></div>
              <div className="app-card-stats"><div><span>Logged</span><strong>{formatHours(logged)}</strong></div><div><span>Estimate</span><strong>{formatHours(app.estimate)}</strong></div><div><span>95% ceiling</span><strong>{formatHours(app.ceiling)}</strong></div><div><span>Variance</span><strong className="positive">{app.variance}%</strong></div></div>
              <div className="app-progress"><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><strong>{progress}% consumed</strong></div>
              <div className="card-actions"><button className="button secondary" onClick={() => onEdit(app)}><PencilSimple size={17} /> Edit</button><button className="icon-button danger" onClick={() => onDelete(app)} aria-label={`Delete ${appName(app)}`}><Trash size={18} /></button></div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PageHeader({ kicker, title, description, action }) {
  return <div className="page-header"><div><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function TimeLogPage({ apps, entries, team, onLog, onEdit, onBulkEdit, onDelete, onDeleteSelected, onExport }) {
  const [appFilter, setAppFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [testerFilter, setTesterFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const filtered = entries.filter((entry) => {
    const app = apps.find((candidate) => candidate.id === entry.appId);
    return (appFilter === "all" || entry.appId === appFilter)
      && (activityFilter === "all" || entry.activity === activityFilter)
      && (testerFilter === "all" || entry.tester === testerFilter)
      && `${entry.note} ${entry.tester} ${app ? appName(app) : ""}`.toLowerCase().includes(query.toLowerCase());
  });
  const total = filtered.reduce((sum, entry) => sum + Number(entry.hours), 0);
  const selectedEntries = entries.filter((entry) => selectedIds.includes(entry.id));
  const allVisibleSelected = filtered.length > 0 && filtered.every((entry) => selectedIds.includes(entry.id));
  const toggleRow = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]);
  const toggleAllVisible = () => {
    const visibleIds = filtered.map((entry) => entry.id);
    setSelectedIds((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : [...new Set([...current, ...visibleIds])]);
  };

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => entries.some((entry) => entry.id === id)));
  }, [entries]);

  return (
    <div className="page standard-page">
      <PageHeader kicker="Effort tracking" title="Time log" description="Review actual effort, filter activity, and keep migration work auditable." action={<button className="button primary" onClick={onLog}><Plus size={18} /> Log time</button>} />
      <div className="filter-bar">
        <label className="search-field"><MagnifyingGlass size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes or testers" /></label>
        <select value={appFilter} onChange={(e) => setAppFilter(e.target.value)}><option value="all">All applications</option>{apps.map((app) => <option key={app.id} value={app.id}>{appName(app)}</option>)}</select>
        <select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}><option value="all">All activities</option>{activityOptions.map((activity) => <option key={activity}>{activity}</option>)}</select>
        <select value={testerFilter} onChange={(e) => setTesterFilter(e.target.value)}><option value="all">All testers</option>{team.map((tester) => <option key={tester}>{tester}</option>)}</select>
        <button className="button secondary" onClick={onExport}><DownloadSimple size={17} /> CSV</button>
      </div>
      {selectedIds.length > 0 && (
        <div className="selection-toolbar" role="region" aria-label="Selected time entry actions">
          <div><strong>{selectedIds.length} selected</strong><span>{selectedIds.length === 1 ? "Edit the selected entry or remove it." : "Apply a shared update or delete the selected entries."}</span></div>
          <div className="selection-actions">
            <button className="button secondary" onClick={() => selectedIds.length === 1 ? onEdit(selectedEntries[0]) : onBulkEdit(selectedIds)}><PencilSimple size={17} /> Edit selected</button>
            <button className="button danger-button" onClick={() => onDeleteSelected(selectedIds)}><Trash size={17} /> Delete selected</button>
            <button className="text-button" onClick={() => setSelectedIds([])}>Clear</button>
          </div>
        </div>
      )}
      <div className="data-table time-table">
        <div className="time-grid table-head"><label className="row-checkbox"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} aria-label="Select all visible time entries" /></label><span>Date</span><span>Application</span><span>Activity</span><span>Tester</span><span>Hours</span><span>Note</span><span /></div>
        {filtered.map((entry) => {
          const app = apps.find((candidate) => candidate.id === entry.appId);
          const selected = selectedIds.includes(entry.id);
          return <div className={`time-grid table-row${selected ? " is-selected" : ""}`} key={entry.id}><label className="row-checkbox"><input type="checkbox" checked={selected} onChange={() => toggleRow(entry.id)} aria-label={`Select ${app ? appName(app) : "removed application"} entry from ${formatDate(entry.date)}`} /></label><span>{formatDate(entry.date)}</span><strong>{app ? appName(app) : "Removed app"}</strong><span>{activityShort[entry.activity] || entry.activity}</span><span>{entry.tester || "Unassigned"}</span><strong>{entry.hours}</strong><span className="note-cell">{entry.note || "—"}</span><span className="row-actions"><button className="icon-button" onClick={() => onEdit(entry)} aria-label="Edit entry"><PencilSimple size={17} /></button><button className="icon-button danger" onClick={() => onDelete(entry.id)} aria-label="Delete entry"><Trash size={17} /></button></span></div>;
        })}
        {filtered.length === 0 && <div className="empty-state"><MagnifyingGlass size={28} /><strong>No entries found</strong><span>Try changing the filters or search term.</span></div>}
        <div className="table-total"><span>{filtered.length} entries</span><strong>Total {formatHours(total)}</strong></div>
      </div>
    </div>
  );
}

function InsightsPage({ entries, team }) {
  const actual = entries.reduce((sum, entry) => sum + Number(entry.hours), 0);
  const byTester = team.map((tester) => ({ tester, hours: entries.filter((e) => e.tester === tester).reduce((sum, e) => sum + Number(e.hours), 0) })).sort((a, b) => b.hours - a.hours);
  const accuracyRows = [
    ["Requirements Gathering", 18.6, 15, "0.80"],
    ["Requirements Analysis", 26.6, 21.5, "0.80"],
    ["Test Planning", 31.7, 20.5, "0.65"],
    ["Entry Criteria", 5.8, 4, "0.70"],
    ["Test Execution", 283, 71.5, "0.25"],
    ["Bug Retest", 82, 11, "0.15"],
    ["Exit Criteria", 20, 0, "0.00"],
    ["Bug Reporting", 48, 6.5, "0.15"],
    ["Coordination", 62, 12.5, "0.20"],
  ];
  return (
    <div className="page standard-page">
      <PageHeader kicker="Decision support" title="Estimation insights" description="Turn completed work into better planning factors for the next migration." />
      <div className="insight-callouts">
        <article><CheckCircle size={24} weight="duotone" /><div><h2>Estimates carry healthy headroom</h2><p>Tracked activities used 162.5h of the 577.7h estimated. Similar future work can be planned more tightly.</p></div></article>
        <article><ChartBar size={24} weight="duotone" /><div><h2>Execution is the primary effort driver</h2><p>Test execution accounts for the largest share of both estimated and logged effort.</p></div></article>
        <article><Target size={24} weight="duotone" /><div><h2>Planning factors are stabilizing</h2><p>Nine priority activity groups are now included in the accuracy view.</p></div></article>
      </div>
      <div className="insights-health"><HealthPanel actual={actual} estimated={641.8} /></div>
      <div className="insights-grid">
        <section className="panel insight-table"><div className="panel-heading"><h2>Accuracy by completed activity</h2></div><div className="accuracy-head accuracy-grid"><span>Activity</span><span>Estimated</span><span>Actual</span><span>Accuracy</span><span>Next factor</span></div>{accuracyRows.map(([activity, estimated, actual, factor]) => <div className="accuracy-row accuracy-grid" key={activity}><strong>{activity}</strong><span>{estimated}h</span><span>{actual}h</span><span>{Math.round((actual / estimated) * 100)}%</span><span className="factor">×{factor}</span></div>)}</section>
        <section className="panel effort-panel"><div className="panel-heading"><h2>Effort by tester</h2></div>{byTester.map((item) => <div className="tester-row" key={item.tester}><div className="avatar">{item.tester.split(" ").map((part) => part[0]).join("")}</div><div><strong>{item.tester}</strong><span>{(item.hours / 8).toFixed(1)} person-days</span></div><strong>{formatHours(item.hours)}</strong></div>)}</section>
      </div>
    </div>
  );
}

function SettingsPage({ programTitle, setProgramTitle, contingency, setContingency, hoursPerDay, setHoursPerDay, team, setTeam, onExportJson, onImport, onExportCsv, onReset, notify }) {
  const [newTester, setNewTester] = useState("");
  const importRef = useRef(null);
  const save = () => notify("Program settings saved");
  const addTester = () => {
    const clean = newTester.trim();
    if (!clean || team.includes(clean)) return;
    setTeam([...team, clean]);
    setNewTester("");
    notify(`${clean} added to the team`);
  };
  return (
    <div className="page standard-page settings-page">
      <PageHeader kicker="Program administration" title="Settings" description="Configure estimation assumptions, team access, and portable backups." />
      <section className="settings-section"><div className="settings-section-title"><Gear size={22} /><div><h2>Program settings</h2><p>Core assumptions used across estimates and reports.</p></div></div><div className="form-grid settings-form"><label className="full"><span>Program title</span><input value={programTitle} onChange={(e) => setProgramTitle(e.target.value)} /></label><label><span>Contingency %</span><input type="number" value={contingency} onChange={(e) => setContingency(Number(e.target.value))} /></label><label><span>Hours per person-day</span><input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))} /></label></div><button className="button primary" onClick={save}><FloppyDisk size={17} /> Save settings</button><p className="formula-note"><Info size={16} /> Adjusted estimate = PERT × complexity × (1 + contingency).</p></section>
      <section className="settings-section"><div className="settings-section-title"><User size={22} /><div><h2>Team</h2><p>Testers available for ownership and time logging.</p></div></div><div className="team-list">{team.map((tester) => <div key={tester}><span className="avatar small">{tester.split(" ").map((part) => part[0]).join("")}</span><strong>{tester}</strong><button className="icon-button danger" onClick={() => setTeam(team.filter((name) => name !== tester))} aria-label={`Remove ${tester}`}><X size={17} /></button></div>)}</div><div className="add-team"><input value={newTester} onChange={(e) => setNewTester(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTester()} placeholder="Add tester name" /><button className="button secondary" onClick={addTester}><Plus size={17} /> Add</button></div></section>
      <section className="settings-section"><div className="settings-section-title"><Database size={22} /><div><h2>Data & portability</h2><p>Export work before switching devices or environments.</p></div></div><div className="data-actions"><button className="button secondary" onClick={onExportJson}><DownloadSimple size={17} /> JSON backup</button><button className="button secondary" onClick={() => importRef.current?.click()}><UploadSimple size={17} /> Import JSON</button><button className="button secondary" onClick={onExportCsv}><DownloadSimple size={17} /> Estimates CSV</button><button className="button danger-button" onClick={onReset}><Trash size={17} /> Reset all data</button><input ref={importRef} type="file" accept="application/json" hidden onChange={onImport} /></div></section>
    </div>
  );
}

function Modal({ title, description, onClose, children, size = "medium" }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className={`modal ${size}`} role="dialog" aria-modal="true" aria-label={title}><div className="modal-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>{children}</div></div>;
}

function LogTimeModal({ apps, team, entry, onClose, onSave }) {
  const [form, setForm] = useState(entry || { date: "2026-07-19", hours: "", appId: apps[0]?.id || "", activity: activityOptions[0], tester: "", note: "" });
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const save = (event) => {
    event.preventDefault();
    if (!form.date || !form.appId || !form.activity || !Number(form.hours)) return;
    onSave({ ...form, hours: Number(form.hours), id: form.id || `entry-${Date.now()}` });
  };
  return <Modal title={entry ? "Edit time entry" : "Log time"} description="Capture actual effort against a migration activity." onClose={onClose}><form onSubmit={save}><div className="form-grid"><label><span>Date</span><input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required /></label><label><span>Hours</span><input type="number" step="0.5" min="0.5" value={form.hours} onChange={(e) => update("hours", e.target.value)} placeholder="e.g. 2.5" required autoFocus /></label><label className="full"><span>Application</span><select value={form.appId} onChange={(e) => update("appId", e.target.value)}>{apps.map((app) => <option key={app.id} value={app.id}>{appName(app)}</option>)}</select></label><label className="full"><span>Activity</span><select value={form.activity} onChange={(e) => update("activity", e.target.value)}>{activityOptions.map((activity) => <option key={activity}>{activity}</option>)}</select></label><label className="full"><span>Tester</span><select value={form.tester} onChange={(e) => update("tester", e.target.value)}><option value="">— unassigned —</option>{team.map((tester) => <option key={tester}>{tester}</option>)}</select></label><label className="full"><span>Note</span><textarea value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="What was completed?" /></label></div><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary"><FloppyDisk size={17} /> {entry ? "Save changes" : "Save entry"}</button></div></form></Modal>;
}

function BulkEditTimeModal({ count, team, onClose, onSave }) {
  const [activity, setActivity] = useState("__keep__");
  const [tester, setTester] = useState("__keep__");
  const hasChanges = activity !== "__keep__" || tester !== "__keep__";
  const save = (event) => {
    event.preventDefault();
    const changes = {};
    if (activity !== "__keep__") changes.activity = activity;
    if (tester !== "__keep__") changes.tester = tester === "__unassigned__" ? "" : tester;
    if (hasChanges) onSave(changes);
  };
  return (
    <Modal title={`Edit ${count} selected entries`} description="Apply shared activity or tester changes without overwriting dates, hours, or notes." onClose={onClose}>
      <form onSubmit={save}>
        <div className="form-grid">
          <label className="full"><span>Activity</span><select value={activity} onChange={(e) => setActivity(e.target.value)}><option value="__keep__">Keep current activities</option>{activityOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="full"><span>Tester</span><select value={tester} onChange={(e) => setTester(e.target.value)}><option value="__keep__">Keep current testers</option><option value="__unassigned__">Set as unassigned</option>{team.map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>
        <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={!hasChanges}><FloppyDisk size={17} /> Apply changes</button></div>
      </form>
    </Modal>
  );
}

function ApplicationModal({ app, onClose, onSave }) {
  const [form, setForm] = useState({ source: "", target: "", description: "", testPhase: "SIT", startDate: "", endDate: "", complexity: "Medium", multiplier: 1, estimate: "", ceiling: "", logo: "", ...(app || {}) });
  const [logoError, setLogoError] = useState("");
  const [dateError, setDateError] = useState("");
  const logoRef = useRef(null);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateLogo = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setLogoError("Choose a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setLogoError("Logo files must be 1 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update("logo", reader.result);
      setLogoError("");
    };
    reader.onerror = () => setLogoError("That image could not be read. Try another file.");
    reader.readAsDataURL(file);
  };
  const save = (event) => {
    event.preventDefault();
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setDateError("End Date must be on or after Start Date.");
      return;
    }
    const complexityMap = { Low: 0.9, Medium: 1, High: 1.2, "Very High": 1.4 };
    onSave({ ...form, id: form.id || `app-${Date.now()}`, multiplier: complexityMap[form.complexity], estimate: Number(form.estimate), ceiling: Number(form.ceiling || form.estimate * 1.12), doneEstimate: form.doneEstimate || 0, progress: form.progress || 0, variance: form.variance || -100, color: form.color || "blue" });
  };
  return <Modal title={app ? "Edit application" : "Add application"} description="Define migration scope, logo, schedule, and estimation parameters." onClose={onClose} size="large"><form onSubmit={save}><div className="form-grid"><div className="full logo-field"><span>Application logo</span><div className="logo-editor"><MigrationIcon app={form} /><div><strong>{form.logo ? "Custom logo" : "Default application icon"}</strong><small>PNG, JPG, or WebP · square images work best · max 1 MB</small><div className="logo-editor-actions"><button type="button" className="button secondary compact" onClick={() => logoRef.current?.click()}><UploadSimple size={16} /> {form.logo ? "Replace logo" : "Upload logo"}</button>{form.logo && <button type="button" className="text-button danger-text" onClick={() => { update("logo", ""); setLogoError(""); }}>Remove</button>}</div>{logoError && <em role="alert">{logoError}</em>}</div><input ref={logoRef} className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={updateLogo} /></div></div><label><span>Source system <small>(optional)</small></span><input value={form.source} onChange={(e) => update("source", e.target.value)} placeholder="e.g. Legacy CRM" autoFocus /></label><label><span>Target system</span><input value={form.target} onChange={(e) => update("target", e.target.value)} required /></label><label className="full"><span>Description</span><input value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Data scope and key records" /></label><label><span>Test Phase</span><select value={form.testPhase} onChange={(e) => update("testPhase", e.target.value)}><option>SIT</option><option>UAT</option><option>Regression</option></select></label><label><span>Complexity</span><select value={form.complexity} onChange={(e) => update("complexity", e.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Very High</option></select></label><label><span>Start Date</span><input type="date" value={form.startDate} max={form.endDate || undefined} onChange={(e) => { update("startDate", e.target.value); setDateError(""); }} /></label><label><span>End Date</span><input type="date" value={form.endDate} min={form.startDate || undefined} onChange={(e) => { update("endDate", e.target.value); setDateError(""); }} /></label>{dateError && <div className="full form-error" role="alert">{dateError}</div>}<label><span>Adjusted estimate (hours)</span><input type="number" step="0.1" min="1" value={form.estimate} onChange={(e) => update("estimate", e.target.value)} required /></label><label><span>95% confidence ceiling (hours)</span><input type="number" step="0.1" min="1" value={form.ceiling} onChange={(e) => update("ceiling", e.target.value)} placeholder="Optional—calculated if blank" /></label></div><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary"><FloppyDisk size={17} /> {app ? "Save changes" : "Add application"}</button></div></form></Modal>;
}

function ConfirmModal({ title, description, confirmLabel, onClose, onConfirm }) {
  return <Modal title={title} description={description} onClose={onClose} size="small"><div className="confirm-illustration"><WarningCircle size={42} weight="duotone" /></div><div className="modal-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className="button danger-button" onClick={onConfirm}><Trash size={17} /> {confirmLabel}</button></div></Modal>;
}

function Toast({ message }) {
  if (!message) return null;
  return <div className="toast" role="status"><CheckCircle size={20} weight="fill" />{message}</div>;
}

function downloadFile(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows) {
  return rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
}

export function App() {
  const initialPage = navItems.some((item) => item.id === location.hash.slice(1)) ? location.hash.slice(1) : "dashboard";
  const [page, setPage] = useState(initialPage);
  const [apps, setApps] = useStoredState("migrateqa-apps", defaultApps);
  const [entries, setEntries] = useStoredState("migrateqa-entries", defaultEntries);
  const [team, setTeam] = useStoredState("migrateqa-team", defaultTeam);
  const [programTitle, setProgramTitle] = useStoredState("migrateqa-title", "Data Migration Test Program");
  const [contingency, setContingency] = useStoredState("migrateqa-contingency", 15);
  const [hoursPerDay, setHoursPerDay] = useStoredState("migrateqa-hours-day", 8);
  const [logModal, setLogModal] = useState(null);
  const [bulkEdit, setBulkEdit] = useState(null);
  const [appModal, setAppModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onHash = () => {
      const next = location.hash.slice(1);
      if (navItems.some((item) => item.id === next)) setPage(next);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title = `${navItems.find((item) => item.id === page)?.label || "Dashboard"} — MigrateQA`;
  }, [page]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const navigate = (next) => {
    setPage(next);
    location.hash = next;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveEntry = (entry) => {
    setEntries((current) => current.some((item) => item.id === entry.id) ? current.map((item) => item.id === entry.id ? entry : item) : [entry, ...current]);
    setLogModal(null);
    notify(entry.id.startsWith("entry-") && entries.some((item) => item.id === entry.id) ? "Time entry updated" : "Time logged successfully");
  };

  const saveBulkEntries = (ids, changes) => {
    setEntries((current) => current.map((entry) => ids.includes(entry.id) ? { ...entry, ...changes } : entry));
    setBulkEdit(null);
    notify(`${ids.length} time ${ids.length === 1 ? "entry" : "entries"} updated`);
  };

  const saveApp = (app) => {
    setApps((current) => current.some((item) => item.id === app.id) ? current.map((item) => item.id === app.id ? app : item) : [...current, app]);
    setAppModal(null);
    notify("Application saved");
  };

  const exportTimeCsv = () => downloadFile("migrateqa-time-log.csv", toCsv([["Date", "Application", "Activity", "Tester", "Hours", "Note"], ...entries.map((entry) => [entry.date, appName(apps.find((app) => app.id === entry.appId) || { source: "Removed", target: "app" }), entry.activity, entry.tester, entry.hours, entry.note])]), "text/csv");
  const exportEstimatesCsv = () => downloadFile("migrateqa-estimates.csv", toCsv([["Application", "Test Phase", "Start Date", "End Date", "Complexity", "Estimate", "95% Ceiling"], ...apps.map((app) => [appName(app), app.testPhase || "SIT", app.startDate || "", app.endDate || "", app.complexity, app.estimate, app.ceiling])]), "text/csv");
  const exportJson = () => downloadFile("migrateqa-backup.json", JSON.stringify({ programTitle, contingency, hoursPerDay, team, apps, entries }, null, 2), "application/json");
  const importJson = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.apps) setApps(data.apps);
        if (data.entries) setEntries(data.entries);
        if (data.team) setTeam(data.team);
        if (data.programTitle) setProgramTitle(data.programTitle);
        if (data.contingency !== undefined) setContingency(data.contingency);
        if (data.hoursPerDay !== undefined) setHoursPerDay(data.hoursPerDay);
        notify("Backup imported successfully");
      } catch {
        notify("That backup file could not be read");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const pageContent = useMemo(() => {
    if (page === "applications") return <ApplicationsPage apps={apps} entries={entries} onAdd={() => setAppModal({ mode: "add" })} onEdit={(app) => setAppModal({ mode: "edit", app })} onDelete={(app) => setConfirm({ title: "Delete application?", description: `${appName(app)} will be removed. Existing time entries remain in the audit log.`, label: "Delete application", action: () => { setApps(apps.filter((item) => item.id !== app.id)); setConfirm(null); notify("Application deleted"); } })} />;
    if (page === "time-log") return <TimeLogPage apps={apps} entries={entries} team={team} onLog={() => setLogModal({})} onEdit={(entry) => setLogModal({ entry })} onBulkEdit={(ids) => setBulkEdit({ ids })} onDelete={(id) => setConfirm({ title: "Delete time entry?", description: "This logged effort will be removed from totals and cannot be recovered.", label: "Delete entry", action: () => { setEntries(entries.filter((entry) => entry.id !== id)); setConfirm(null); notify("Time entry deleted"); } })} onDeleteSelected={(ids) => setConfirm({ title: `Delete ${ids.length} selected ${ids.length === 1 ? "entry" : "entries"}?`, description: "The selected logged effort will be removed from totals and cannot be recovered.", label: ids.length === 1 ? "Delete entry" : `Delete ${ids.length} entries`, action: () => { setEntries(entries.filter((entry) => !ids.includes(entry.id))); setConfirm(null); notify(`${ids.length} time ${ids.length === 1 ? "entry" : "entries"} deleted`); } })} onExport={exportTimeCsv} />;
    if (page === "insights") return <InsightsPage entries={entries} team={team} />;
    if (page === "settings") return <SettingsPage programTitle={programTitle} setProgramTitle={setProgramTitle} contingency={contingency} setContingency={setContingency} hoursPerDay={hoursPerDay} setHoursPerDay={setHoursPerDay} team={team} setTeam={setTeam} onExportJson={exportJson} onImport={importJson} onExportCsv={exportEstimatesCsv} onReset={() => setConfirm({ title: "Reset all program data?", description: "Applications, time entries, team members, and settings will return to the sample program. Export a backup first if needed.", label: "Reset all data", action: () => { setApps(defaultApps); setEntries(defaultEntries); setTeam(defaultTeam); setProgramTitle("Data Migration Test Program"); setContingency(15); setHoursPerDay(8); setConfirm(null); notify("Sample program restored"); } })} notify={notify} />;
    return <Dashboard apps={apps} entries={entries} programTitle={programTitle} onNavigate={navigate} onLogTime={() => setLogModal({})} />;
  }, [page, apps, entries, team, programTitle, contingency, hoursPerDay]);

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={navigate} />
      <div className="app-main"><Header programTitle={programTitle} onLogTime={() => setLogModal({})} />{pageContent}</div>
      <MobileNav page={page} onNavigate={navigate} />
      {logModal && <LogTimeModal apps={apps} team={team} entry={logModal.entry} onClose={() => setLogModal(null)} onSave={saveEntry} />}
      {bulkEdit && <BulkEditTimeModal count={bulkEdit.ids.length} team={team} onClose={() => setBulkEdit(null)} onSave={(changes) => saveBulkEntries(bulkEdit.ids, changes)} />}
      {appModal && <ApplicationModal app={appModal.app} onClose={() => setAppModal(null)} onSave={saveApp} />}
      {confirm && <ConfirmModal title={confirm.title} description={confirm.description} confirmLabel={confirm.label} onClose={() => setConfirm(null)} onConfirm={confirm.action} />}
      <Toast message={toast} />
    </div>
  );
}
