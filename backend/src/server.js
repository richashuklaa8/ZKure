import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { state, makeClaim, logEvent, save } from './store.js';

const app=express();
app.disable('x-powered-by');
app.use(cors({origin:process.env.FRONTEND_ORIGIN?.split(',')||'http://localhost:5173'}));
app.use(express.json({limit:'1mb'}));
app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');next();});
const safe=(fn)=>(req,res)=>{try{fn(req,res);}catch(e){res.status(400).json({error:e.message||'Invalid request'});}};
const findClaim=id=>state.claims.find(c=>c.id===id);
const now=()=>new Date().toISOString();
app.get('/api/health',(_req,res)=>res.json({ok:true,service:'MediProof API',version:'2.0.0',mode:'synthetic-demo',timestamp:now()}));
app.get('/api/dashboard',(_req,res)=>res.json({claims:state.claims,permissions:state.permissions,records:state.records,accessLog:state.accessLog,meta:{mode:'synthetic-demo',lastUpdated:now()}}));
app.get('/api/claims',(_req,res)=>res.json(state.claims));
app.get('/api/claims/:id',safe((req,res)=>{const c=findClaim(req.params.id);if(!c)return res.status(404).json({error:'Claim not found'});res.json(c);}));
app.post('/api/claims',safe((req,res)=>res.status(201).json(makeClaim(req.body))));
app.post('/api/claims/:id/verify-demo',safe((req,res)=>{
 const c=findClaim(req.params.id);if(!c)return res.status(404).json({error:'Claim not found'});
 if(state.usedNullifiers.includes(c.nullifier)||c.status==='settled'){c.status='rejected';c.proofStatus='Replay detected · duplicate nullifier';logEvent('Claim rejected · replay', 'MediProof demo verifier',c.id);save();return res.status(409).json({error:'Duplicate claim rejected: nullifier already used.',claim:c});}
 const checks=[{key:'hospitalApproved',label:'Hospital is in approved registry'},{key:'policyActive',label:'Policy active for claim date'},{key:'procedureCovered',label:'Procedure belongs to covered set'},{key:'amount',label:'Claim amount is within policy limit',pass:c.amount<=c.policyLimit}];
 const failed=checks.filter(x=>x.pass===false||(x.key!=='amount'&&!c[x.key]));
 const valid=failed.length===0;c.status=valid?'verified':'rejected';c.proofStatus=valid?'Demo checks passed · not a ZK proof':`Rejected · ${failed.map(x=>x.label).join(', ')}`;c.checkedAt=now();
 logEvent(valid?'Eligibility demo checks passed':'Claim rejected · eligibility', 'MediProof demo verifier',c.id);save();
 res.json({valid,mode:'demo-simulation',cryptographicProof:false,checks:checks.map(x=>({label:x.label,passed:x.key==='amount'?c.amount<=c.policyLimit:Boolean(c[x.key])})),message:valid?'All demo eligibility checks passed. This is not a cryptographic ZK proof.':`Claim rejected: ${failed.map(x=>x.label).join('; ')}.`,claim:c});
}));
app.post('/api/claims/:id/settle-demo',safe((req,res)=>{
 const c=findClaim(req.params.id);if(!c)return res.status(404).json({error:'Claim not found'});
 if(c.status!=='verified')return res.status(400).json({error:'Only verified claims can be settled.'});
 if(state.usedNullifiers.includes(c.nullifier))return res.status(409).json({error:'Replay detected: nullifier already used.'});
 state.usedNullifiers.push(c.nullifier);c.status='settled';c.settledAt=now();c.receipt=`DEMO-${c.id}-${Date.now().toString(36).toUpperCase()}`;
 logEvent('Demo settlement recorded','ClaimGuard settlement',`${c.id} · ${c.receipt}`);save();res.json({ok:true,mode:'demo-simulation',realFundsMoved:false,claim:c,receipt:c.receipt});
}));
app.get('/api/records',(_req,res)=>res.json(state.records));
app.post('/api/records/:id/access-demo',safe((req,res)=>{const r=state.records.find(x=>x.id===req.params.id);if(!r)return res.status(404).json({error:'Record not found'});logEvent('Record access requested (demo event)',String(req.body?.actor||'Dr. Demo').slice(0,80),r.id);save();res.json({ok:true,mode:'demo-event-only',message:'Access event recorded. No real medical file was opened.',recordId:r.id});}));
app.post('/api/permissions',safe((req,res)=>{const {clinician,organization,scope,expires,record}=req.body||{};if(!clinician||!scope||!expires)return res.status(400).json({error:'clinician, scope and expires are required.'});if(!/^\d{4}-\d{2}-\d{2}$/.test(expires)||expires<now().slice(0,10))return res.status(400).json({error:'Choose a valid future expiry date.'});const p={id:`PER-${Date.now().toString(36).toUpperCase()}`,clinician:String(clinician).slice(0,100),organization:String(organization||'External clinician').slice(0,100),record:record||'REC-•••-104',scope:String(scope).slice(0,80),expires,active:true,createdAt:now()};state.permissions.unshift(p);logEvent('Access granted','Patient #P-104',`${p.clinician} · ${p.scope}`);save();res.status(201).json(p);}));
app.patch('/api/permissions/:id/revoke',safe((req,res)=>{const p=state.permissions.find(x=>x.id===req.params.id);if(!p)return res.status(404).json({error:'Permission not found'});if(!p.active)return res.status(409).json({error:'Permission is already inactive.'});p.active=false;p.revokedAt=now();logEvent('Access revoked','Patient #P-104',`${p.clinician} · ${p.scope}`);save();res.json(p);}));
app.get('/api/audit',(_req,res)=>res.json(state.accessLog));
app.use('/api/*',(_req,res)=>res.status(404).json({error:'API route not found'}));
const here=path.dirname(fileURLToPath(import.meta.url));
const frontendDist=path.resolve(here,'../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*',(_req,res)=>res.sendFile(path.join(frontendDist,'index.html'),err=>{if(err)res.status(404).send('Build the frontend with npm run build first.');}));
app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({error:'Unexpected server error.'});});
const port=Number(process.env.PORT||4000);app.listen(port,()=>console.log(`MediProof API ready at http://localhost:${port} · synthetic demo mode`));
