import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowUpRight, BadgeCheck, Bell, Blocks, BriefcaseMedical,
  Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, Copy, FileCheck2, FileKey2,
  FileLock2, Fingerprint, FlaskConical, HeartPulse, Home, Hospital, LayoutDashboard,
  LockKeyhole, LogOut, MoreHorizontal, Plus, RefreshCw, Search, Settings, Shield,
  ShieldCheck, ShieldEllipsis, ShieldX, Wallet, X, Zap
} from 'lucide-react';

const API = '/api';
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

function App() {
  const [role, setRole] = useState('Patient');
  const [page, setPage] = useState('Overview');
  const [dashboard, setDashboard] = useState({ claims: [], permissions: [], accessLog: [] });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState('');
  const [amount, setAmount] = useState('18400');
  const [grant, setGrant] = useState({ clinician: 'Dr. N. Kapoor', organization: 'Northstar Medical Centre', scope: 'Treatment summary', expires: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) });
  const [search, setSearch] = useState('');

  const refresh = async () => {
    try { const r = await fetch(`${API}/dashboard`); if (!r.ok) throw new Error(); setDashboard(await r.json()); }
    catch { setToast('API unavailable — start the backend with npm run dev.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 3200); return () => clearTimeout(t); }, [toast]);

  const claims = dashboard.claims || [];
  const permissions = dashboard.permissions || [];
  const activePermissions = permissions.filter(p => p.active).length;
  const totalSettled = claims.filter(c => c.status === 'settled').reduce((s, c) => s + c.amount, 0);
  const latestClaim = claims[0];

  async function api(path, options = {}) {
    const r = await fetch(`${API}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Request failed');
    return data;
  }
  async function createClaim() {
    try { await api('/claims', { method: 'POST', body: JSON.stringify({ amount }) }); await refresh(); setModal(''); setRole('Hospital'); setPage('Claims'); setToast('New claim created in the demo workspace.'); }
    catch (e) { setToast(e.message); }
  }
  async function verify(id) {
    try { const result = await api(`/claims/${id}/verify-demo`, { method: 'POST', body: '{}' }); await refresh(); setToast(result.message); }
    catch (e) { await refresh(); setToast(e.message); }
  }
  async function settle(id) {
    try { const result = await api(`/claims/${id}/settle-demo`, { method: 'POST', body: '{}' }); await refresh(); setToast(`Demo settlement recorded · ${result.receipt}`); }
    catch (e) { setToast(e.message); }
  }
  async function addPermission(e) {
    e.preventDefault();
    try { await api('/permissions', { method: 'POST', body: JSON.stringify(grant) }); await refresh(); setModal(''); setToast('Permission granted.'); }
    catch (e) { setToast(e.message); }
  }
  async function revoke(id) {
    try { await api(`/permissions/${id}/revoke`, { method: 'PATCH', body: '{}' }); await refresh(); setToast('Future access revoked in the demo service.'); }
    catch (e) { setToast(e.message); }
  }
  async function logRecordAccess(id) {
    try { const result = await api(`/records/${id}/access-demo`, { method: 'POST', body: JSON.stringify({ actor: role === 'Hospital' ? 'Northstar Medical Centre' : 'Patient workspace' }) }); await refresh(); setToast(result.message); }
    catch (e) { setToast(e.message); }
  }

  const nav = useMemo(() => role === 'Patient'
    ? [{ name: 'Overview', icon: LayoutDashboard }, { name: 'My records', icon: FileLock2 }, { name: 'Access control', icon: Fingerprint }, { name: 'Claims', icon: FileCheck2 }]
    : role === 'Hospital'
      ? [{ name: 'Overview', icon: LayoutDashboard }, { name: 'Claims', icon: FileCheck2 }, { name: 'Create claim', icon: Plus }, { name: 'Records', icon: FileLock2 }]
      : [{ name: 'Overview', icon: LayoutDashboard }, { name: 'Claims review', icon: FileCheck2 }, { name: 'Settlement', icon: Wallet }, { name: 'Audit trail', icon: Activity }], [role]);

  useEffect(() => { if (!nav.some(n => n.name === page)) setPage('Overview'); }, [role]);

  const filteredClaims = claims.filter(c => `${c.id} ${c.patient} ${c.hospital} ${c.status}`.toLowerCase().includes(search.toLowerCase()));
  const statusClass = s => s === 'settled' || s === 'verified' ? 'success' : s === 'rejected' ? 'danger' : 'warning';

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><HeartPulse size={21}/></div><div><div className="brand-name">mediproof<span>.</span></div><div className="brand-sub">PRIVATE HEALTH NETWORK</div></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <div className="role-switch"><span className="role-icon"><ShieldCheck size={16}/></span><div className="role-copy"><small>Signed in as</small><strong>{role} workspace</strong></div><ChevronDown size={15}/><select aria-label="Switch workspace" value={role} onChange={e => { setRole(e.target.value); setPage('Overview'); }}><option>Patient</option><option>Hospital</option><option>Insurer</option></select></div>
      <div className="nav-label">MENU</div>
      <nav>{nav.map(item => <button key={item.name} className={`nav-item ${page === item.name ? 'active' : ''}`} onClick={() => setPage(item.name)}><item.icon size={18}/><span>{item.name}</span>{item.name === 'Claims' && role === 'Hospital' && <span className="nav-count">{claims.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="security-card"><div className="security-icon"><LockKeyhole size={17}/></div><strong>Your data stays yours.</strong><p>Private by design. Access by permission.</p><div className="security-link" onClick={() => setPage('Access control')}>Manage permissions <ArrowUpRight size={13}/></div></div><button className="nav-item muted"><Settings size={18}/><span>Settings</span></button><button className="nav-item muted"><CircleHelp size={18}/><span>Help & support</span></button><div className="profile-row"><div className="avatar">{role === 'Patient' ? 'P' : role === 'Hospital' ? 'H' : 'I'}</div><div className="profile-info"><strong>{role === 'Patient' ? 'R. Patient' : role === 'Hospital' ? 'Northstar Medical' : 'Aster Insurance'}</strong><small>{role === 'Patient' ? 'Patient ID · P-104' : role === 'Hospital' ? 'Verified provider · Demo' : 'Claims team · Demo'}</small></div><MoreHorizontal size={18}/></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span className="crumb-sep">/</span><strong>{page}</strong></div><div className="top-actions"><div className="network-pill"><span className="pulse-dot"/> Demo network</div><button className="icon-button" aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">{role[0]}</div></div></header>
      <div className="content-wrap">
        <div className="page-heading"><div><div className="eyebrow">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} <span>·</span> {role.toUpperCase()} PORTAL</div><h1>{page === 'Overview' ? `Good afternoon, ${role === 'Patient' ? 'Richa' : role === 'Hospital' ? 'Northstar team' : 'Claims team'}.` : page}</h1><p>{role === 'Patient' ? 'Your health records, your permissions, your peace of mind.' : role === 'Hospital' ? 'Submit verifiable claims without exposing patient details.' : 'Review cryptographic claim evidence and manage settlement.'}</p></div><div className="heading-actions"><button className="btn btn-light" onClick={refresh}><RefreshCw size={15}/> Refresh</button>{role !== 'Insurer' && <button className="btn btn-primary" onClick={() => setModal(role === 'Patient' ? 'permission' : 'claim')}><Plus size={16}/>{role === 'Patient' ? 'Grant access' : 'New claim'}</button>}</div></div>

        {page === 'Overview' && <>
          <div className="hero-banner"><div className="hero-orb orb-one"/><div className="hero-orb orb-two"/><div className="hero-copy"><div className="hero-kicker"><ShieldCheck size={14}/> PRIVACY-FIRST CARE</div><h2>Healthcare trust,<br/><em>without the exposure.</em></h2><p>Verify what matters. Keep what’s personal private.</p><div className="hero-points"><span><Check size={13}/> Zero-knowledge ready</span><span><Check size={13}/> Patient-controlled access</span><span><Check size={13}/> Auditable settlement</span></div></div><div className="hero-art"><div className="art-ring ring-a"/><div className="art-ring ring-b"/><div className="art-shield"><ShieldCheck size={54}/></div><div className="art-chip chip-top"><LockKeyhole size={14}/> Encrypted</div><div className="art-chip chip-bottom"><BadgeCheck size={14}/> Verified</div></div></div>
          <div className="stats-grid">
            <Stat icon={FileCheck2} label="Total claims" value={claims.length.toString().padStart(2,'0')} change="Across this workspace" tone="blue"/>
            <Stat icon={ShieldCheck} label="Verified claims" value={claims.filter(c => c.status === 'verified' || c.status === 'settled').length.toString().padStart(2,'0')} change="Eligibility checks passed" tone="green"/>
            <Stat icon={Wallet} label="Settled amount" value={money(totalSettled)} change="Demo settlement volume" tone="purple"/>
            <Stat icon={Fingerprint} label={role === 'Patient' ? 'Active permissions' : 'Active workflows'} value={role === 'Patient' ? activePermissions.toString().padStart(2,'0') : '03'} change={role === 'Patient' ? 'You control access' : 'Role-based access'} tone="orange"/>
          </div>
          <div className="section-grid"><section className="panel claims-panel"><div className="panel-head"><div><h3>Recent claims</h3><p>Latest activity across your network</p></div><button className="text-button" onClick={() => setPage(role === 'Insurer' ? 'Claims review' : 'Claims')}>View all <ArrowUpRight size={14}/></button></div><ClaimTable claims={claims.slice(0,4)} statusClass={statusClass} role={role} verify={verify} settle={settle}/></section><section className="panel activity-panel"><div className="panel-head"><div><h3>{role === 'Patient' ? 'Access activity' : 'Network activity'}</h3><p>Transparent by default</p></div><button className="dots"><MoreHorizontal size={18}/></button></div><div className="activity-list">{(dashboard.accessLog || []).slice(0,4).map((log,i)=><div className="activity-item" key={log.id}><div className={`activity-icon a${i%3}`}>{i===0?<Fingerprint size={16}/>:i===1?<FileLock2 size={16}/>:<Shield size={16}/>}</div><div className="activity-text"><strong>{log.action}</strong><span>{log.target} · {log.actor}</span></div><time>{log.time}</time></div>)}</div><div className="activity-foot"><span className="live-dot"/> Audit events are recorded in this demo</div></section></div>
          <div className="bottom-note"><div className="note-icon"><ShieldEllipsis size={18}/></div><div><strong>Privacy architecture at a glance</strong><p>Medical records remain encrypted off-chain. Only commitments, proof results and minimum necessary events belong on-chain.</p></div><button onClick={() => setPage(role === 'Patient' ? 'My records' : role === 'Hospital' ? 'Records' : 'Audit trail')}>Explore architecture <ArrowUpRight size={14}/></button></div>
        </>}

        {(page === 'Claims' || page === 'Claims review' || page === 'Settlement') && <section className="panel full-panel"><div className="panel-head"><div><h3>{page === 'Settlement' ? 'Settlement queue' : 'Claims register'}</h3><p>Only minimum necessary claim metadata is visible here.</p></div><div className="table-tools"><div className="search-box"><Search size={15}/><input placeholder="Search claims..." value={search} onChange={e => setSearch(e.target.value)}/></div>{role === 'Hospital' && <button className="btn btn-primary" onClick={() => setModal('claim')}><Plus size={15}/> New claim</button>}</div></div><ClaimTable claims={filteredClaims} statusClass={statusClass} role={role} verify={verify} settle={settle}/></section>}

        {(page === 'My records' || page === 'Records') && <div className="records-layout"><section className="panel"><div className="panel-head"><div><h3>Encrypted record vault</h3><p>Documents are represented by synthetic metadata in this prototype.</p></div><span className="tag tag-green"><LockKeyhole size={12}/> Encrypted demo</span></div>{(dashboard.records || []).map((record, index) => <div className="record-card" key={record.id}><div className={`record-icon ${index % 2 ? 'purple' : ''}`}>{index % 2 ? <FlaskConical size={21}/> : <FileLock2 size={21}/>}</div><div className="record-main"><strong>{record.name}</strong><span>{record.id} · Updated {new Date(record.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span><small>{record.storage} · Commitment <code>{record.commitment}</code></small></div><button className="btn btn-light" onClick={() => logRecordAccess(record.id)}>Log access</button><span className="tag tag-green">{record.status}</span></div>)}<div className="privacy-callout"><ShieldCheck size={18}/><div><strong>What the insurer can see</strong><p>Claim amount, policy commitment, claim nullifier and approved-hospital root — not your diagnosis, prescriptions or treatment history.</p></div></div></section><section className="panel storage-panel"><div className="panel-head"><div><h3>Storage boundary</h3><p>Designed to minimize exposure</p></div></div><div className="storage-row"><span className="storage-dot onchain"/><div><strong>On-chain</strong><p>Hashes, commitments, proof result, permissions and settlement events</p></div></div><div className="storage-row"><span className="storage-dot offchain"/><div><strong>Encrypted off-chain</strong><p>Medical files, identity mapping and encryption keys</p></div></div><div className="mini-stat"><span>Patient-controlled access</span><strong>{activePermissions} active grants</strong></div></section></div>}

        {page === 'Access control' && <div className="records-layout"><section className="panel"><div className="panel-head"><div><h3>Who can access your records?</h3><p>Grant and revoke future access to selected record categories.</p></div><button className="btn btn-primary" onClick={() => setModal('permission')}><Plus size={15}/> Grant access</button></div><div className="permission-list">{permissions.map(p=><div className="permission-card" key={p.id}><div className="clinician-avatar">{p.clinician.split(' ').slice(-1)[0][0]}</div><div className="permission-info"><strong>{p.clinician}</strong><span>{p.organization} · {p.scope}</span><small>Access expires {p.expires}</small></div><div className="permission-actions"><span className={`tag ${p.active?'tag-green':'tag-gray'}`}>{p.active?'Active':'Revoked'}</span>{p.active&&<button className="btn btn-outline-danger" onClick={()=>revoke(p.id)}>Revoke</button>}</div></div>)}</div></section><section className="panel"><div className="panel-head"><div><h3>Access history</h3><p>Recent permission events</p></div></div><div className="activity-list">{(dashboard.accessLog||[]).map((l,i)=><div className="activity-item" key={l.id}><div className="activity-icon a2"><Activity size={16}/></div><div className="activity-text"><strong>{l.action}</strong><span>{l.target}</span></div><time>{l.time}</time></div>)}</div><div className="warning-note"><Shield size={16}/><span>Revocation blocks future access through the MediProof service. It cannot erase copies a recipient has already downloaded.</span></div></section></div>}

        {page === 'Audit trail' && <section className="panel full-panel"><div className="panel-head"><div><h3>Audit trail</h3><p>Permission and claim lifecycle events in the demo environment.</p></div><span className="tag tag-blue">Append-only concept</span></div><div className="audit-timeline">{[...(dashboard.accessLog||[]),...claims.map(c=>({id:c.id,action:`Claim ${c.status}`,target:c.id,actor:c.hospital,time:c.settledAt||c.claimDate}))].map((l,i)=><div className="audit-row" key={l.id+i}><div className="audit-mark"><span/></div><div><strong>{l.action}</strong><p>{l.target} · {l.actor}</p></div><time>{l.time}</time></div>)}</div></section>}

        {page === 'Create claim' && <section className="panel create-panel"><div className="panel-head"><div><h3>Start a privacy-preserving claim</h3><p>Create a synthetic claim for the hackathon demo.</p></div></div><div className="create-form"><label>Claim amount (INR)<input type="number" min="100" max="100000" value={amount} onChange={e=>setAmount(e.target.value)}/></label><div className="form-info"><LockKeyhole size={17}/><span>Diagnosis, procedure code, prescriptions and treatment history remain private inputs to the intended proof circuit.</span></div><button className="btn btn-primary" onClick={createClaim}>Create demo claim <ArrowUpRight size={15}/></button></div></section>}
      </div>
      <footer className="footer"><span>© 2026 MediProof Network</span><span><span className="footer-dot"/> Prototype environment · Synthetic data only</span><span>Built for W3-01 <b>·</b> v2.0.0</span></footer>
    </main>

    {modal && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal('')}><div className="modal"><div className="modal-head"><div><div className="eyebrow">MEDIPROOF WORKSPACE</div><h3>{modal==='permission'?'Grant record access':'Create a new claim'}</h3></div><button className="icon-button" onClick={()=>setModal('')}><X size={18}/></button></div>{modal==='permission'?<form onSubmit={addPermission} className="modal-form"><label>Clinician name<input required value={grant.clinician} onChange={e=>setGrant({...grant,clinician:e.target.value})}/></label><label>Organization<input value={grant.organization} onChange={e=>setGrant({...grant,organization:e.target.value})}/></label><label>Record scope<select value={grant.scope} onChange={e=>setGrant({...grant,scope:e.target.value})}><option>Treatment summary</option><option>Lab reports</option><option>Prescription history</option><option>Full record bundle</option></select></label><label>Access expires<input type="date" required value={grant.expires} onChange={e=>setGrant({...grant,expires:e.target.value})}/></label><div className="form-info"><LockKeyhole size={16}/><span>Demo permission metadata only. Production access must be enforced by a secure key-release service.</span></div><button className="btn btn-primary block-btn" type="submit">Confirm permission <ArrowUpRight size={15}/></button></form>:<div className="modal-form"><label>Claim amount (INR)<input type="number" min="100" max="100000" value={amount} onChange={e=>setAmount(e.target.value)}/></label><div className="claim-preview"><span>Patient reference</span><strong>Patient #P-104</strong><span>Hospital</span><strong>Northstar Medical Centre</strong><span>Private clinical details</span><strong>Not exposed to insurer</strong></div><div className="form-info"><ShieldCheck size={16}/><span>This creates a synthetic demo claim. It does not submit real patient data or move real funds.</span></div><button className="btn btn-primary block-btn" onClick={createClaim}>Create claim <ArrowUpRight size={15}/></button></div>}</div></div>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}<button onClick={()=>setToast('')}><X size={14}/></button></div>}
    {loading&&<div className="loading-indicator">Connecting to MediProof demo API…</div>}
  </div>;
}

function Stat({icon:Icon,label,value,change,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={18}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-change"><span className="change-dot"/>{change}</div></div>; }
function ClaimTable({claims,statusClass,role,verify,settle}) { if(!claims.length)return <div className="empty-state"><FileCheck2 size={26}/><strong>No claims found</strong><span>New claims will appear here.</span></div>; return <div className="table-scroll"><table className="data-table"><thead><tr><th>CLAIM ID</th><th>HOSPITAL / PATIENT</th><th>AMOUNT</th><th>PROOF STATUS</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{claims.map(c=><tr key={c.id}><td><strong className="claim-id">{c.id}</strong><small>{c.claimDate}</small></td><td><strong>{role==='Patient'?c.hospital:c.patient}</strong><small>{role==='Patient'?'Provider':'Northstar network'}</small></td><td className="amount-cell">{money(c.amount)}</td><td><span className={`proof-state ${c.proofStatus?.includes('Replay')?'bad-proof':''}`}><span/>{c.proofStatus||'Pending'}</span></td><td><span className={`status-pill ${statusClass(c.status)}`}>{c.status}</span></td><td>{role==='Hospital'&&c.status==='pending'?<button className="table-action" onClick={()=>verify(c.id)}>Generate proof <ArrowUpRight size={13}/></button>:role==='Insurer'&&c.status==='verified'?<button className="table-action" onClick={()=>settle(c.id)}>Settle claim <ArrowUpRight size={13}/></button>:role==='Hospital'&&c.status==='verified'?<button className="table-action" onClick={()=>verify(c.id)}>Re-check <RefreshCw size={12}/></button>:<span className="muted-action">{c.status==='settled'?'Receipt recorded':'View details'}</span>}</td></tr>)}</tbody></table></div>; }

export default App;
