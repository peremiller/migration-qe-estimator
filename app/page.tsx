"use client";

import { useEffect, useMemo, useState } from "react";

type Phase = { name: string; estimate: number; actual: number; driver: string };

const initialPhases: Phase[] = [
  { name: "Requirements gathering", estimate: 56, actual: 48, driver: "Workshops & source discovery" },
  { name: "Requirements analysis", estimate: 72, actual: 61, driver: "Mappings, rules & traceability" },
  { name: "Test planning", estimate: 88, actual: 74, driver: "Strategy, scope & environments" },
  { name: "Entry criteria", estimate: 36, actual: 32, driver: "Readiness & access checks" },
  { name: "Test execution", estimate: 312, actual: 243, driver: "Cycles, reconciliation & regression" },
  { name: "Testing defects", estimate: 96, actual: 89, driver: "Triage, retest & RCA" },
  { name: "Reporting bugs", estimate: 42, actual: 35, driver: "Evidence & defect creation" },
  { name: "Team coordination", estimate: 64, actual: 51, driver: "Dev, data & business teams" },
  { name: "Exit criteria", estimate: 34, actual: 17, driver: "Sign-off & closure report" },
  { name: "Schema & datatype validation", estimate: 48, actual: 34, driver: "Source-target structure comparison" },
  { name: "Completeness reconciliation", estimate: 68, actual: 52, driver: "Counts, totals, nulls & duplicates" },
  { name: "Transformation rules", estimate: 76, actual: 59, driver: "Mappings, calculations & derivations" },
  { name: "Referential integrity", estimate: 42, actual: 31, driver: "Keys, relationships & orphan detection" },
  { name: "Delta-load validation", estimate: 54, actual: 38, driver: "Incremental loads & cutover windows" },
  { name: "Performance & volume", estimate: 62, actual: 41, driver: "Throughput, scale & batch duration" },
  { name: "Rollback & recovery", estimate: 38, actual: 20, driver: "Restore, rerun & reconciliation" },
  { name: "Hypercare validation", estimate: 44, actual: 8, driver: "Production checks & early-life support" },
];

const apps = [
  { name: "FINCORE", detail: "Core banking", risk: "Medium", status: "On track", estimate: 320, actual: 238 },
  { name: "FININT", detail: "Interface engine", risk: "High", status: "At risk", estimate: 196, actual: 174 },
  { name: "FINREP", detail: "Reporting hub", risk: "Low", status: "On track", estimate: 154, actual: 119 },
  { name: "FINARCH", detail: "Data archive", risk: "Medium", status: "Not started", estimate: 130, actual: 19 },
];

function fmt(n: number) { return n.toLocaleString(undefined, { maximumFractionDigits: 1 }); }
function duration(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Home() {
  const [tab, setTab] = useState("Dashboard");
  const [phases, setPhases] = useState(initialPhases);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(5087);
  const [activeApp, setActiveApp] = useState("FINCORE — Core banking");
  const [task, setTask] = useState("Validate GL account balances");
  const [notes, setNotes] = useState("Validating trial balance and account rollups for FY2023 migrated data set.");
  const [drawer, setDrawer] = useState(false);
  const [risk, setRisk] = useState(1.15);
  const [team, setTeam] = useState(8);
  const [days, setDays] = useState(38);
  const [saved, setSaved] = useState(false);
  const [role, setRole] = useState("QA Manager");
  const [baseline, setBaseline] = useState("Baseline v3 · Approved");

  useEffect(() => {
    const raw = window.localStorage.getItem("migration-qa-workspace");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data.phases)) setPhases(data.phases);
      if (data.risk) setRisk(data.risk);
      if (data.team) setTeam(data.team);
      if (data.days) setDays(data.days);
    } catch { /* keep calibrated defaults */ }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("migration-qa-workspace", JSON.stringify({ phases, risk, team, days }));
  }, [phases, risk, team, days]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const totals = useMemo(() => {
    const base = phases.reduce((s, p) => s + p.estimate, 0);
    const estimate = Math.round(base * risk);
    const actual = phases.reduce((s, p) => s + p.actual, 0);
    const variance = actual - estimate;
    const confidence = Math.max(58, Math.min(94, Math.round(91 - (risk - 1) * 42 - Math.abs(variance / estimate) * 8)));
    return { base, estimate, actual, variance, confidence };
  }, [phases, risk]);

  const updateEstimate = (i: number, value: number) => setPhases(p => p.map((x, n) => n === i ? { ...x, estimate: value } : x));
  const saveLog = () => {
    setSaved(true); setRunning(false);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="brandmark">C</span><strong>Migration QA</strong><span>Estimator</span></div>
        <label className="project-select"><small>PROJECT</small><select aria-label="Project"><option>FIN-2026 Core Banking Migration</option><option>Customer Data Modernization</option></select></label>
        <div className="search">⌕ <input aria-label="Search" placeholder="Search estimates, tasks, applications…" /><kbd>⌘ K</kbd></div>
        <div className="top-actions"><button aria-label="Notifications">♢<i>3</i></button><button aria-label="Help">?</button><span className="avatar">MP</span><div><strong>Miller Perez</strong><select className="role-select" value={role} onChange={e=>setRole(e.target.value)} aria-label="Current role"><option>QA Manager</option><option>Tester</option><option>Project Manager</option><option>Viewer</option></select></div></div>
      </header>

      <nav className="mobile-tabs" aria-label="Main navigation">
        {["Dashboard", "AI Copilot", "Estimator", "Time logs", "Applications", "Portfolio", "Governance", "Integrations"].map(x => <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>{x}</button>)}
      </nav>

      <div className="workspace">
        <section className="content">
          <div className="page-head">
            <div><div className="eyebrow">FINANCE TRANSFORMATION / QA WORKSPACE</div><h1>{tab === "AI Copilot" ? "OpenAI QA Copilot" : tab === "Estimator" ? "Effort estimator" : tab === "Time logs" ? "Team time logs" : tab === "Applications" ? "Migration applications" : tab === "Portfolio" ? "Portfolio intelligence" : tab === "Governance" ? "Controls & approvals" : tab === "Integrations" ? "Connected delivery" : "Command center"}</h1><p><span className="status-dot"></span> On track <b>•</b> {baseline} <b>•</b> {team} testers</p></div>
            <button className="primary" onClick={() => setDrawer(true)}>＋ New estimate</button>
          </div>

          {tab === "Dashboard" && <>
            <div className="kpis">
              <article><span>Planned effort</span><strong>{fmt(totals.estimate)}<small> h</small></strong><em>Risk-adjusted baseline</em><div className="line green"></div></article>
              <article><span>Actual logged</span><strong>{fmt(totals.actual)}<small> h</small></strong><em>{Math.round(totals.actual / totals.estimate * 100)}% of plan consumed</em><div className="line dark" style={{width:`${Math.min(100, totals.actual/totals.estimate*100)}%`}}></div></article>
              <article><span>Variance</span><strong className={totals.variance > 0 ? "danger" : "amber"}>{totals.variance > 0 ? "+" : ""}{fmt(totals.variance)}<small> h</small></strong><em>{Math.abs(Math.round(totals.variance/totals.estimate*100))}% {totals.variance <= 0 ? "under" : "over"} plan</em><div className="line amberline"></div></article>
              <article><span>Estimate confidence</span><strong>{totals.confidence}<small>%</small></strong><em className="positive">P80 forecast · High</em><div className="line green" style={{width:`${totals.confidence}%`}}></div></article>
            </div>

            <article className="panel workload">
              <div className="panel-head"><div><h2>Workload by phase</h2><p>Estimated versus logged hours</p></div><div className="legend"><span className="pl"></span> Planned <span className="ac"></span> Actual</div></div>
              <div className="phase-list">
                {phases.map((p, i) => <div className="phase" key={p.name}>
                  <div><b>{p.name}</b><small>{p.driver}</small></div><span>{fmt(Math.round(p.estimate*risk))}h</span><div className="bars"><i style={{width:`${p.estimate/3.2}%`}}></i><em style={{width:`${p.actual/3.2}%`}}></em></div><strong className={p.actual > p.estimate*risk ? "danger" : "positive"}>{p.actual - Math.round(p.estimate*risk) > 0 ? "+" : ""}{fmt(p.actual - Math.round(p.estimate*risk))}h</strong>
                </div>)}
              </div>
            </article>

            <div className="lower-grid">
              <article className="panel insights"><div className="panel-head"><div><h2>Estimation insights</h2><p>Based on current burn and migration risk</p></div><span className="score">{totals.confidence}%</span></div>
                <div className="insight good"><b>↗ Execution is 22% more efficient</b><p>Reconciliation automation is reducing manual validation time.</p></div>
                <div className="insight warn"><b>△ Defect effort is trending high</b><p>FININT mapping defects average 2.4 retests each. Reserve 18 hours.</p></div>
                <div className="insight"><b>◎ P80 forecast: {fmt(totals.estimate + 46)} hours</b><p>Includes risk buffer and expected defect arrival rate.</p></div>
              </article>
              <article className="panel apps"><div className="panel-head"><div><h2>Migration applications</h2><p>Health and effort consumption</p></div><button onClick={() => setTab("Applications")}>View all →</button></div>
                {apps.map(a => <div className="app-row" key={a.name}><div><b>{a.name}</b><small>{a.detail}</small></div><span className={`badge ${a.status.replace(" ", "").toLowerCase()}`}>{a.status}</span><span>{a.actual} / {a.estimate}h</span><div className="mini"><i style={{width:`${a.actual/a.estimate*100}%`}}></i></div></div>)}
              </article>
            </div>
          </>}

          {tab === "AI Copilot" && <AICopilot />}

          {tab === "Estimator" && <Estimator phases={phases} risk={risk} setRisk={setRisk} team={team} setTeam={setTeam} days={days} setDays={setDays} updateEstimate={updateEstimate} total={totals.estimate} />}
          {tab === "Time logs" && <TimeLogs />}
          {tab === "Applications" && <Applications />}
          {tab === "Portfolio" && <Portfolio />}
          {tab === "Governance" && <Governance baseline={baseline} setBaseline={setBaseline} />}
          {tab === "Integrations" && <Integrations />}
        </section>

        <aside className="timer-rail">
          <div className="timer-title"><div><span className={running ? "pulse" : ""}></span><h2>Active timer</h2></div><small>{running ? "LIVE" : "PAUSED"}</small></div>
          <div className="timer-card">
            <label>CURRENT TASK<input value={task} onChange={e=>setTask(e.target.value)} /></label>
            <p>Test execution <b>›</b> Data validation</p>
            <div className="time">{duration(seconds)}</div>
            <div className="timer-buttons"><button className="primary" onClick={() => setRunning(!running)}>{running ? "Ⅱ Pause" : "▶ Start"}</button><button onClick={() => {setSeconds(0);setRunning(false)}}>↻ Reset</button></div>
          </div>
          <label className="field">Application<select value={activeApp} onChange={e=>setActiveApp(e.target.value)}>{apps.map(a=><option key={a.name}>{a.name} — {a.detail}</option>)}</select></label>
          <label className="field">Notes<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4} /><small>{notes.length}/500</small></label>
          <button className="save-log" onClick={saveLog}>{saved ? "✓ Time log saved" : "Save time log"}</button>
          <div className="recent"><div className="panel-head"><h3>Recent logs</h3><button>View all</button></div>
            {[['Validate customer migration','00:45'],['Review mapping rules','00:30'],['Test data load — batch 12','01:15']].map(x=><div className="recent-row" key={x[0]}><button>▶</button><div><b>{x[0]}</b><small>Today · {activeApp.split(' ')[0]}</small></div><strong>{x[1]}</strong></div>)}
          </div>
          <div className="capacity"><span>TEAM CAPACITY</span><div><strong>{team}</strong><small>testers</small><b>68%</b><small>utilized</small></div><i><em></em></i><p>{Math.round(team*days*8*0.68).toLocaleString()} hours available this release</p></div>
        </aside>
      </div>

      {drawer && <div className="overlay" onMouseDown={()=>setDrawer(false)}><section className="drawer" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setDrawer(false)}>×</button><span className="eyebrow">NEW MODEL</span><h2>Create an estimate</h2><p>Start with a calibrated template for a data-migration test cycle.</p><label>Estimate name<input defaultValue="Cycle 2 — Full migration rehearsal" /></label><label>Estimation method<select><option>Hybrid: 3-point + historical velocity</option><option>Bottom-up work breakdown</option><option>Analogy-based estimate</option></select></label><label>Confidence target<select><option>P80 — Recommended</option><option>P50 — Most likely</option><option>P90 — Conservative</option></select></label><button className="primary wide" onClick={()=>{setDrawer(false);setTab("Estimator")}}>Build estimate →</button></section></div>}
    </main>
  );
}

function Estimator({phases,risk,setRisk,team,setTeam,days,setDays,updateEstimate,total}:{phases:Phase[],risk:number,setRisk:(n:number)=>void,team:number,setTeam:(n:number)=>void,days:number,setDays:(n:number)=>void,updateEstimate:(i:number,n:number)=>void,total:number}) {
  const [method,setMethod]=useState("Hybrid · three-point + history");
  const [drivers,setDrivers]=useState({volume:3,apps:4,mappings:420,quality:82,cycles:3,automation:46,dependencies:7,retests:2.4});
  const setDriver=(k:string,n:number)=>setDrivers(d=>({...d,[k]:n}));
  const modifier=1+(drivers.volume-2)*.04+(drivers.cycles-2)*.03+(100-drivers.quality)*.0015+(drivers.dependencies-4)*.01-(drivers.automation-30)*.001;
  const p50=Math.round(total*modifier*.94),p80=Math.round(total*modifier*1.08),p90=Math.round(total*modifier*1.17);
  return <><div className="model-strip panel"><div><span>ESTIMATION MODEL</span><select value={method} onChange={e=>setMethod(e.target.value)}><option>Hybrid · three-point + history</option><option>Bottom-up work breakdown</option><option>PERT estimate</option><option>Historical analogy</option><option>Test-case based</option><option>Requirements point conversion</option></select></div><div className="confidence-band"><span>P50 <b>{fmt(p50)}h</b></span><span className="recommended">P80 <b>{fmt(p80)}h</b></span><span>P90 <b>{fmt(p90)}h</b></span></div><button className="primary">Save new version</button></div><div className="estimator-grid"><article className="panel estimator"><div className="panel-head"><div><h2>Migration test work breakdown</h2><p>Edit calibrated effort by testing activity</p></div><span className="method">{method}</span></div>{phases.map((p,i)=><div className="edit-row" key={p.name}><div><b>{p.name}</b><small>{p.driver}</small></div><label>BASE HOURS<input type="number" value={p.estimate} onChange={e=>updateEstimate(i,+e.target.value)} /></label><span>× {(risk*modifier).toFixed(2)}</span><strong>{Math.round(p.estimate*risk*modifier)}h</strong></div>)}<div className="estimate-total"><span>P80 risk-adjusted estimate</span><strong>{fmt(p80)} hours</strong></div></article><aside><article className="panel assumptions"><h2>Migration drivers</h2><label>Risk multiplier <b>{risk.toFixed(2)}×</b><input type="range" min="1" max="1.5" step="0.05" value={risk} onChange={e=>setRisk(+e.target.value)} /></label><div className="driver-grid"><label>Applications<input type="number" value={drivers.apps} onChange={e=>setDriver('apps',+e.target.value)} /></label><label>Data volume (1–5)<input type="number" min="1" max="5" value={drivers.volume} onChange={e=>setDriver('volume',+e.target.value)} /></label><label>Mapping rules<input type="number" value={drivers.mappings} onChange={e=>setDriver('mappings',+e.target.value)} /></label><label>Data quality %<input type="number" value={drivers.quality} onChange={e=>setDriver('quality',+e.target.value)} /></label><label>Test cycles<input type="number" value={drivers.cycles} onChange={e=>setDriver('cycles',+e.target.value)} /></label><label>Automation %<input type="number" value={drivers.automation} onChange={e=>setDriver('automation',+e.target.value)} /></label><label>Dependencies<input type="number" value={drivers.dependencies} onChange={e=>setDriver('dependencies',+e.target.value)} /></label><label>Retests / defect<input type="number" step=".1" value={drivers.retests} onChange={e=>setDriver('retests',+e.target.value)} /></label></div><label>Available testers<input type="number" value={team} onChange={e=>setTeam(+e.target.value)} /></label><label>Working days<input type="number" value={days} onChange={e=>setDays(+e.target.value)} /></label><div className="forecast"><span>Forecast completion</span><strong>{p80/(team*8) <= days ? `Day ${Math.ceil(p80/(team*8))} · Healthy` : `Day ${Math.ceil(p80/(team*8))} · Capacity risk`}</strong><p>{Math.round(p80/(team*days*8)*100)}% of gross capacity · {Math.max(0,Math.ceil(p80/(days*8)-team))} additional testers recommended</p></div></article><article className="panel method-note"><h3>Model explanation</h3><p>The recommendation blends bottom-up activity effort, three-point uncertainty and performance from three comparable migration cycles. The largest sensitivity is test-cycle count, followed by data quality and mapping-rule complexity.</p></article></aside></div></>
}

function TimeLogs(){const rows=[['Jul 18','Miller Perez','FINCORE','Test execution','1h 25m'],['Jul 18','Jamie Lim','FININT','Testing defects','2h 10m'],['Jul 18','Ari Santos','FINREP','Requirements analysis','1h 40m'],['Jul 17','Bea Cruz','FINCORE','Reporting bugs','45m'],['Jul 17','Noah Tan','FINARCH','Entry criteria','1h 15m'],['Jul 17','Miller Perez','FININT','Team coordination','50m']];const exportCsv=()=>{const csv=['Date,Team member,Application,Activity,Duration,Billable',...rows.map(r=>[...r,'Yes'].join(','))].join('\n');const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='migration-qa-time-logs.csv';a.click()};return <><div className="kpis compact"><article><span>Logged this week</span><strong>126.5<small> h</small></strong><em>94% submitted</em></article><article><span>Pending approval</span><strong>18.0<small> h</small></strong><em>3 team members</em></article><article><span>Unplanned work</span><strong>12.4<small>%</small></strong><em className="amber">Mostly defect retests</em></article><article><span>Billable utilization</span><strong>78<small>%</small></strong><em className="positive">+4% vs last week</em></article></div><article className="panel table-panel"><div className="panel-head"><div><h2>Actual time ledger</h2><p>Audit-ready activity logs linked to cycles, requirements and defects</p></div><div><button className="outline">Approve selected</button> <button className="outline" onClick={exportCsv}>Export CSV</button></div></div><table><thead><tr><th>Date</th><th>Team member</th><th>Application</th><th>Activity</th><th>Duration</th><th>Billable</th></tr></thead><tbody>{rows.map(r=><tr key={r.join()}>{r.map((x,i)=><td key={x}>{i===5?<span className="badge ontrack">Yes</span>:x}</td>)}</tr>)}</tbody></table></article></>}

function Applications(){return <div className="app-cards">{apps.map((a,i)=><article className="panel app-card" key={a.name}><div className="app-icon">{a.name.slice(-2)}</div><div><span className={`badge ${a.status.replace(' ','').toLowerCase()}`}>{a.status}</span><h2>{a.name}</h2><p>{a.detail} · {a.risk} migration risk</p></div><div className="app-stats"><span>Planned <b>{a.estimate}h</b></span><span>Actual <b>{a.actual}h</b></span><span>Defects <b>{[18,27,8,3][i]}</b></span></div><div className="progress"><i style={{width:`${a.actual/a.estimate*100}%`}}></i></div><button>Open analysis →</button></article>)}</div>}

function Portfolio(){const projects=[['Core Banking Migration','On track','920','650','82%','Jul 31'],['Customer Data Modernization','At risk','1,420','1,184','61%','Aug 22'],['Claims Archive Consolidation','On track','680','401','88%','Sep 05'],['ERP Finance Cutover','Planning','1,110','96','74%','Oct 18']];return <><div className="kpis"><article><span>Portfolio planned</span><strong>4,130<small> h</small></strong><em>Across 4 active programs</em></article><article><span>Forecast at completion</span><strong>4,382<small> h</small></strong><em className="amber">6.1% above baseline</em></article><article><span>Shared capacity</span><strong>27<small> FTE</small></strong><em>84% allocated</em></article><article><span>Estimate accuracy</span><strong>86<small>%</small></strong><em className="positive">+9% this quarter</em></article></div><article className="panel table-panel"><div className="panel-head"><div><h2>Migration portfolio</h2><p>Cross-project delivery confidence and staffing demand</p></div><button className="outline">Executive report</button></div><table><thead><tr><th>Program</th><th>Health</th><th>Planned</th><th>Actual</th><th>Confidence</th><th>Forecast finish</th></tr></thead><tbody>{projects.map(r=><tr key={r[0]}><td><b>{r[0]}</b></td><td><span className={`badge ${r[1].replace(' ','').toLowerCase()}`}>{r[1]}</span></td>{r.slice(2).map(x=><td key={x}>{x}</td>)}</tr>)}</tbody></table></article><div className="lower-grid"><article className="panel"><h2>Systemic underestimation</h2>{[['Defect retesting','+18%'],['Cross-team coordination','+14%'],['Delta-load validation','+11%'],['Entry readiness','+7%']].map(x=><div className="rank-row" key={x[0]}><span>{x[0]}</span><b className="danger">{x[1]}</b></div>)}</article><article className="panel"><h2>Resource outlook</h2><div className="forecast-bars"><span>Data validation <i style={{width:'92%'}}></i><b>12 FTE</b></span><span>Defect management <i style={{width:'62%'}}></i><b>7 FTE</b></span><span>Automation <i style={{width:'48%'}}></i><b>5 FTE</b></span><span>Governance <i style={{width:'32%'}}></i><b>3 FTE</b></span></div></article></div></>}

function Governance({baseline,setBaseline}:{baseline:string,setBaseline:(s:string)=>void}){const [approved,setApproved]=useState(false);return <div className="governance-grid"><article className="panel"><div className="panel-head"><div><h2>Estimate control</h2><p>Version history, approval and change impact</p></div><span className="badge ontrack">Audit ready</span></div><div className="baseline-card"><span>CURRENT BASELINE</span><h3>{baseline}</h3><p>P80: 1,284 hours · Approved by Program QA Lead · Jul 16</p><button className="primary" onClick={()=>{setApproved(true);setBaseline('Baseline v4 · Approved')}}>{approved?'✓ Baseline v4 approved':'Approve pending v4'}</button></div>{[['v4 · Pending approval','1,332h','Mapping scope +48h'],['v3 · Approved','1,284h','Initial risk reserve'],['v2 · Superseded','1,196h','Cycle 3 added'],['v1 · Archived','1,080h','Original estimate']].map(x=><div className="version-row" key={x[0]}><b>{x[0]}</b><span>{x[1]}</span><small>{x[2]}</small><button>View diff</button></div>)}</article><article className="panel"><div className="panel-head"><div><h2>Entry & exit controls</h2><p>Evidence-backed readiness gates</p></div><b>14 / 18</b></div>{[['Source extracts reconciled',true],['Target environment signed off',true],['PII masking verified',true],['Rollback rehearsal completed',false],['Critical defects closed',false],['Business reconciliation approved',true]].map(x=><label className="check-row" key={x[0]}><input type="checkbox" defaultChecked={x[1] as boolean}/><span>{x[0]}</span><small>{x[1]?'Evidence attached':'Owner action required'}</small></label>)}</article><article className="panel"><div className="panel-head"><div><h2>Risk & dependency register</h2><p>Active assumptions affecting the forecast</p></div><button className="outline">＋ Add</button></div>{[['R-014','FININT mapping volatility','High','Data team'],['D-008','Masked production extract','Medium','Security'],['A-021','Cycle 3 starts Jul 22','Low','QA Lead'],['R-018','Weekend cutover coverage','Medium','PMO']].map(x=><div className="risk-row" key={x[0]}><b>{x[0]}</b><span>{x[1]}</span><em className={x[2]==='High'?'danger':'amber'}>{x[2]}</em><small>{x[3]}</small></div>)}</article><article className="panel"><h2>Recent audit activity</h2>{['Miller approved test-plan scope','Jamie attached reconciliation evidence','Ari changed FININT risk to High','System recalculated P80 forecast'].map((x,i)=><div className="audit-row" key={x}><span className="avatar mini-avatar">{i?'S':'MP'}</span><div><b>{x}</b><small>{i+1} hour{i?'s':''} ago · immutable audit entry</small></div></div>)}</article></div>}

function Integrations(){const [connected,setConnected]=useState<string[]>(['Azure DevOps']);const toggle=(x:string)=>setConnected(c=>c.includes(x)?c.filter(v=>v!==x):[...c,x]);const items=[['Azure DevOps','Requirements, test plans, work items and defects'],['Jira','Issues, sprints, releases and work logs'],['Microsoft Teams','Alerts, approvals and daily status summaries'],['Power BI','Portfolio measures and executive reporting'],['Excel / CSV','Bulk estimates, logs and reconciliation extracts'],['REST API','Secure access for enterprise data pipelines']];return <><article className="panel integration-hero"><div><span className="eyebrow">CONNECTED DELIVERY</span><h2>Keep QA work synchronized</h2><p>Connect planning, execution, defects, communication and reporting without duplicate entry.</p></div><div className="sync-health"><strong>98.7%</strong><span>Sync health</span><small>Last checked 2 minutes ago</small></div></article><div className="integration-grid">{items.map(x=><article className="panel integration-card" key={x[0]}><div className="integration-logo">{x[0].slice(0,2).toUpperCase()}</div><div><h3>{x[0]}</h3><p>{x[1]}</p></div><span className={`badge ${connected.includes(x[0])?'ontrack':'notstarted'}`}>{connected.includes(x[0])?'Connected':'Available'}</span><button className={connected.includes(x[0])?'outline':'primary'} onClick={()=>toggle(x[0])}>{connected.includes(x[0])?'Configure':'Connect'}</button></article>)}</div><article className="panel automation-list"><div className="panel-head"><div><h2>Automation recipes</h2><p>Active rules across the migration program</p></div><button className="outline">＋ New recipe</button></div>{[['Import new ADO requirements into the estimate','Every 30 minutes','Active'],['Create defect effort when severity 1–2 bugs arrive','On event','Active'],['Send forecast variance to Teams','Weekdays 4:00 PM','Active'],['Publish approved baseline to Power BI','On approval','Paused']].map(x=><div className="automation-row" key={x[0]}><span>⚡</span><b>{x[0]}</b><small>{x[1]}</small><em className={x[2]==='Active'?'positive':'amber'}>{x[2]}</em></div>)}</article></>}

function AICopilot(){
  const tools=[
    {id:'estimate',icon:'∑',title:'AI estimate review',desc:'Challenge assumptions, find missing work and recommend a P80 reserve.',prompt:'Review our 1,417-hour migration QA estimate across four applications. Identify likely omissions and recommend a defensible P80 reserve.'},
    {id:'requirements',icon:'≡',title:'Requirements analyst',desc:'Turn migration documents into testable requirements and traceability.',prompt:'Analyze migration requirements for a core banking data move. Produce testable requirements, ambiguities and acceptance criteria.'},
    {id:'defect',icon:'△',title:'Defect intelligence',desc:'Cluster duplicates, suggest severity and summarize root-cause patterns.',prompt:'Analyze current defect pattern: 27 FININT mapping issues, average 2.4 retests, recurring null and datatype mismatches. Recommend clusters and actions.'},
    {id:'evidence',icon:'◫',title:'Evidence inspector',desc:'Read screenshots and reconciliation files using multimodal understanding.',prompt:'Describe how to validate a reconciliation screenshot and what evidence is required for audit-ready sign-off.'},
    {id:'status',icon:'↗',title:'Executive narrator',desc:'Create an evidence-grounded status update with risks and decisions.',prompt:'Create a concise executive QA migration status: 66% effort consumed, 82% confidence, FININT at risk, 27 mapping defects.'},
    {id:'search',icon:'⌕',title:'Knowledge search',desc:'Search plans, mappings, defects and evidence by meaning, not filename.',prompt:'Find the most relevant project knowledge for rollback readiness, delta-load reconciliation and PII masking.'},
  ];
  const [active,setActive]=useState(tools[0]);const [prompt,setPrompt]=useState(tools[0].prompt);const [result,setResult]=useState('');const [busy,setBusy]=useState(false);const [voice,setVoice]=useState(false);const [fileName,setFileName]=useState('');
  const run=async()=>{setBusy(true);setResult('');try{const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:active.id,prompt})});const d=await r.json();setResult(d.output||d.error);}catch{setResult('AI service is not configured yet. The workflow is ready; add OPENAI_API_KEY to activate live analysis.');}finally{setBusy(false)}};
  const select=(t:typeof tools[number])=>{setActive(t);setPrompt(t.prompt);setResult('')};
  return <div className="ai-layout"><section><article className="panel ai-hero"><div><span className="ai-spark">✦</span><div><span className="eyebrow">POWERED BY OPENAI</span><h2>One copilot for the entire migration test lifecycle</h2><p>Reason over requirements, estimates, evidence and defects—then take governed action with human approval.</p></div></div><span className="badge ontrack">Responsible AI controls on</span></article><div className="ai-tool-grid">{tools.map(t=><button key={t.id} className={`ai-tool ${active.id===t.id?'selected':''}`} onClick={()=>select(t)}><span>{t.icon}</span><div><b>{t.title}</b><small>{t.desc}</small></div></button>)}</div><article className="panel ai-studio"><div className="panel-head"><div><h2>{active.title}</h2><p>Responses API · structured output · citations to project sources</p></div><div className="model-chip">GPT-5.6 Sol ▾</div></div><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={5}/><div className="ai-actions"><label className="upload">＋ Add evidence<input type="file" accept="image/*,.pdf,.csv,.xlsx" onChange={e=>setFileName(e.target.files?.[0]?.name||'')}/></label><button className={voice?'recording':'outline'} onClick={()=>setVoice(!voice)}>{voice?'● Listening…':'◉ Voice note'}</button><span>{fileName&&`Attached: ${fileName}`}</span><button className="primary" onClick={run} disabled={busy}>{busy?'Analyzing…':'Run AI analysis →'}</button></div>{result&&<div className="ai-result"><div><span>✦</span><b>Copilot recommendation</b><em>Review before applying</em></div><p>{result}</p><div><button className="primary">Apply as draft</button><button className="outline">Add to risk register</button></div></div>}</article></section><aside><article className="panel product-stack"><div className="panel-head"><div><h2>OpenAI product stack</h2><p>Purpose-matched, not one-model-fits-all</p></div></div>{[['Responses API','Reasoning, tools and structured actions','Live'],['File Search','Grounded project knowledge retrieval','Ready'],['Vision','Screenshots, reports and evidence review','Ready'],['Code Interpreter','CSV reconciliation and variance analysis','Ready'],['Realtime API','Low-latency voice logging and coaching','Ready'],['Embeddings','Semantic similarity and defect clustering','Ready'],['Batch API','Nightly portfolio reforecasting','Scheduled'],['Moderation','Safe user-entered content handling','On'],['Agents SDK','Specialist agent handoffs with traces','Designed'],['Codex','Maintain and test the application','Active']].map(x=><div className="product-row" key={x[0]}><span className="openai-dot">○</span><div><b>{x[0]}</b><small>{x[1]}</small></div><em>{x[2]}</em></div>)}</article><article className="panel guardrails"><h3>AI governance</h3>{['Human approval before changes','Source citations and confidence','PII minimization','Prompt and output audit trail','Model/version visibility'].map(x=><div key={x}>✓ {x}</div>)}</article></aside></div>
}
