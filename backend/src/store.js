import { nanoid } from 'nanoid';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, '../data');
const dataFile = path.join(dataDir, 'demo-state.json');
const seed = {
  claims: [
    { id:'CLM-2048', patient:'Patient #P-104', hospital:'Northstar Medical Centre', amount:18400, policy:'POL-•••-7291', procedure:'Hidden from insurer', claimDate:new Date().toISOString().slice(0,10), status:'verified', nullifier:'0x8f2a00000000000000000000000000000000d91c', recipient:'0x71C0000000000000000000000000000000002a90', proofStatus:'Demo checks passed · not a ZK proof', settledAt:null, policyLimit:50000, policyActive:true, hospitalApproved:true, procedureCovered:true },
    { id:'CLM-2047', patient:'Patient #P-108', hospital:'Northstar Medical Centre', amount:9200, policy:'POL-•••-4108', procedure:'Hidden from insurer', claimDate:new Date(Date.now()-86400000).toISOString().slice(0,10), status:'settled', nullifier:'0x7b1100000000000000000000000000000000af03', recipient:'0x90A0000000000000000000000000000000001c42', proofStatus:'Demo checks passed · not a ZK proof', settledAt:new Date(Date.now()-86400000).toISOString(), policyLimit:30000, policyActive:true, hospitalApproved:true, procedureCovered:true }
  ],
  permissions:[
    {id:'PER-01',clinician:'Dr. A. Mehta',organization:'Northstar Medical Centre',record:'REC-•••-104',scope:'Treatment summary',expires:new Date(Date.now()+7*86400000).toISOString().slice(0,10),active:true,createdAt:new Date().toISOString()},
    {id:'PER-02',clinician:'Dr. S. Rao',organization:'City Diagnostics',record:'REC-•••-104',scope:'Lab reports',expires:new Date(Date.now()-86400000).toISOString().slice(0,10),active:false,createdAt:new Date().toISOString()}
  ],
  records:[
    {id:'REC-104',name:'Patient health summary',category:'Clinical summary',updatedAt:new Date().toISOString(),commitment:'0x8a2f…c91d',storage:'Encrypted off-chain object',status:'Protected',size:'1.8 MB'},
    {id:'REC-109',name:'Laboratory report bundle',category:'Lab reports',updatedAt:new Date(Date.now()-2*86400000).toISOString(),commitment:'0x41b9…02fe',storage:'Encrypted off-chain object',status:'Protected',size:'840 KB'},
    {id:'REC-112',name:'Prescription history',category:'Medication record',updatedAt:new Date(Date.now()-5*86400000).toISOString(),commitment:'0xd73c…b8a1',storage:'Encrypted off-chain object',status:'Protected',size:'420 KB'}
  ],
  accessLog:[
    {id:'LOG-01',action:'Access granted',actor:'Patient #P-104',target:'Dr. A. Mehta · Treatment summary',time:new Date().toISOString()},
    {id:'LOG-02',action:'Record viewed (demo event)',actor:'Dr. A. Mehta',target:'Treatment summary',time:new Date(Date.now()-3600000).toISOString()},
    {id:'LOG-03',action:'Access revoked',actor:'Patient #P-104',target:'Dr. S. Rao · Lab reports',time:new Date(Date.now()-86400000).toISOString()}
  ],
  usedNullifiers:['0x7b1100000000000000000000000000000000af03']
};
function load(){
  try { fs.mkdirSync(dataDir,{recursive:true}); if(fs.existsSync(dataFile)) return JSON.parse(fs.readFileSync(dataFile,'utf8')); }
  catch(err){ console.warn('Could not load demo state; using seed:',err.message); }
  const initial=structuredClone(seed); save(initial); return initial;
}
export function save(s=state){ fs.mkdirSync(dataDir,{recursive:true}); fs.writeFileSync(dataFile,JSON.stringify(s,null,2)); }
export const state=load();
const stamp=()=>new Date().toISOString();
export function logEvent(action,actor,target){ state.accessLog.unshift({id:`LOG-${nanoid(7).toUpperCase()}`,action,actor,target,time:stamp()}); state.accessLog=state.accessLog.slice(0,150); }
export function makeClaim(body={}){
  const amount=Number(body.amount);
  if(!Number.isFinite(amount)||amount<100||amount>1000000) throw new Error('Claim amount must be between ₹100 and ₹10,00,000.');
  const claim={id:`CLM-${nanoid(6).toUpperCase()}`,patient:'Patient #P-104',hospital:String(body.hospital||'Northstar Medical Centre').slice(0,100),amount,policy:'POL-•••-7291',procedure:'Hidden from insurer',claimDate:stamp().slice(0,10),status:'pending',nullifier:`0x${nanoid(32).replaceAll('-','')}`,recipient:'0x71C0000000000000000000000000000000002a90',proofStatus:'Awaiting eligibility checks',settledAt:null,policyLimit:Number(body.policyLimit)||50000,policyActive:body.policyActive!==false,hospitalApproved:body.hospitalApproved!==false,procedureCovered:body.procedureCovered!==false};
  state.claims.unshift(claim); logEvent('Claim created',claim.hospital,claim.id); save(); return claim;
}
