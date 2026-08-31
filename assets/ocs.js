/* Offer Clarity Scorer — deterministic browser-only scoring engine. */
(function(){
'use strict';
const questions=[
 {name:'Audience',title:'Who is this for?',help:'Name the specific buyer, role, company type, or situation. Avoid “businesses” or “everyone.”',prompt:'Example: VP Sales at a 50–200 person B2B SaaS company with a growing inbound pipeline.'},
 {name:'Problem',title:'What specific problem does the buyer have?',help:'Describe the costly or urgent problem in the buyer’s language. What is happening that should change?',prompt:'Think symptoms, consequences, triggers, or measurable pain — not broad aspirations.'},
 {name:'Outcome',title:'What changes after they buy?',help:'State the concrete outcome the buyer should expect. Include a metric, timeframe, or observable change when you can.',prompt:'What will be different, better, faster, safer, or cheaper?'},
 {name:'Mechanism',title:'How do you create that outcome?',help:'Explain the distinctive mechanism, process, product capability, or way of working that connects the offer to the result.',prompt:'A buyer should be able to understand the “how” without reading a sales deck.'},
 {name:'Differentiation',title:'Why this instead of the obvious alternatives?',help:'Give a specific reason you win against doing nothing, doing it internally, or choosing a competitor. Concrete proof beats adjectives.',prompt:'Name the meaningful difference and, where possible, the evidence behind it.'},
 {name:'Proof',title:'What evidence supports the promise?',help:'Use checkable proof: customer results, numbers, named customers, experiments, guarantees, credentials, or other concrete evidence.',prompt:'If you do not have proof yet, say so. The scorer will not invent it.'},
 {name:'Risk',title:'What makes the decision feel safe?',help:'Address the biggest reason a qualified buyer could hesitate: switching cost, implementation risk, uncertainty, price, internal approval, or another real objection.',prompt:'Explain what reduces that risk — or acknowledge what remains unproven.'},
 {name:'Action',title:'What should the buyer do next?',help:'Make the next step unmistakable. State exactly what happens, how long it takes, and what the buyer gets if useful.',prompt:'One clear action is stronger than a menu of vague calls to action.'}
];
const filler=[/world[- ]class/i,/best[- ]in[- ]class/i,/cutting[- ]edge/i,/innovative/i,/seamless/i,/holistic/i,/end[- ]to[- ]end/i,/game[- ]changing/i,/revolutionary/i,/next[- ]gen/i,/leverage/i,/unlock/i,/empower/i,/transform/i,/synergy/i,/robust/i,/comprehensive/i,/tailored/i,/solutions?/i,/strategic/i,/powerful/i,/unique/i,/industry[- ]leading/i];
const concrete=[/\b\d+(?:\.\d+)?\s*%/i,/[$€£₹]\s?\d[\d,.]*/i,/\b\d+(?:\.\d+)?\s*(?:days?|weeks?|months?|hours?|minutes?|x)\b/i,/\b(?:20|19)\d{2}\b/i,/\b(?:CEO|CFO|COO|CRO|CTO|CMO|VP|director|manager|founder|owner)\b/i,/\b(?:SaaS|B2B|B2C|enterprise|SMB|mid[- ]market)\b/i,/\b(?:HubSpot|Salesforce|Stripe|Shopify|AWS|Google|Microsoft|Slack|Zoom)\b/i];
function analyze(text){
 const t=(text||'').trim(), words=t?t.split(/\s+/).length:0;
 const fillerHits=[]; filler.forEach(r=>{const m=t.match(r);if(m&&!fillerHits.includes(m[0].toLowerCase()))fillerHits.push(m[0].toLowerCase())});
 const concreteHits=[]; concrete.forEach(r=>{const m=t.match(r);if(m&&!concreteHits.includes(m[0]))concreteHits.push(m[0])});
 if(!t) return {score:0,words,filled:false,filler:fillerHits,concrete:concreteHits,suff:false,note:'No evidence supplied'};
 let score=0;
 score+=Math.min(42,words*1.75);
 score+=Math.min(32,concreteHits.length*10);
 score-=Math.min(34,fillerHits.length*8);
 const sentence=t.split(/[.!?]+/).filter(Boolean).length;
 if(sentence>=2) score+=6;
 if(/[,:;—-]/.test(t)) score+=3;
 score=Math.max(0,Math.min(100,Math.round(score)));
 return {score,words,filled:true,filler:fillerHits,concrete:concreteHits,suff:words>=6,note:words<6?'Very little evidence supplied':fillerHits.length?'Generic language reduces confidence':'Usable evidence supplied'};
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
const state={i:0,answers:Array(8).fill(''),skipped:Array(8).fill(false)};
function el(id){return document.getElementById(id)}
function renderStep(){
 const q=questions[state.i],a=state.answers[state.i]||'';
 el('ocsSteps').innerHTML=`<article class="ocs-step"><span class="ocs-step-label">${state.i+1} / 8 · ${q.name}</span><h2 class="ocs-question">${q.title}</h2><p class="ocs-help">${q.help}</p><textarea class="ocs-textarea" id="ocsAnswer" maxlength="2400" aria-label="${escapeHtml(q.title)}" placeholder="${escapeHtml(q.prompt)}">${escapeHtml(a)}</textarea><div class="ocs-counter"><span>Specific beats polished.</span><span id="ocsCount">${a.length} / 2,400</span></div></article>`;
 const ta=el('ocsAnswer');ta.addEventListener('input',()=>{state.answers[state.i]=ta.value;el('ocsCount').textContent=ta.value.length+' / 2,400'});ta.focus();
 el('ocsProgressLabel').textContent=`Question ${state.i+1} of 8`;el('ocsProgressPercent').textContent=Math.round((state.i+1)/8*100)+'%';el('ocsProgressFill').style.width=((state.i+1)/8*100)+'%';el('ocsProgress').setAttribute('aria-valuenow',state.i+1);el('ocsBack').disabled=state.i===0;
 el('ocsNext').innerHTML=state.i===7?'See my results <span aria-hidden="true">→</span>':'Next <span aria-hidden="true">→</span>';
}
function start(){el('ocsIntro').hidden=true;el('ocsReport').hidden=true;el('ocsWizard').hidden=false;state.i=0;renderStep();window.scrollTo({top:0,behavior:'smooth'})}
function next(skip){const ta=el('ocsAnswer');if(ta)state.answers[state.i]=ta.value;if(skip)state.skipped[state.i]=true;else state.skipped[state.i]=false;if(state.i<7){state.i++;renderStep();window.scrollTo({top:0,behavior:'smooth'})}else report()}
function report(){el('ocsWizard').hidden=true;el('ocsReport').hidden=false;const results=questions.map((q,i)=>({...q,...analyze(state.answers[i]),skipped:state.skipped[i]}));const usable=results.filter(r=>r.filled&&r.suff);const composite=usable.length?Math.round(usable.reduce((s,r)=>s+r.score,0)/usable.length):0;const insufficient=results.filter(r=>!r.suff).length;const sorted=[...results].sort((a,b)=>a.score-b.score);const leak=sorted[0];let grade=composite>=85?'Strong':composite>=70?'Clear with gaps':composite>=50?'Material ambiguity':'High clarity risk';let summary=composite>=85?'Your offer contains substantial usable evidence. Tighten the weakest dimension before adding more messaging.':composite>=70?'The core is understandable, but several dimensions still rely on incomplete or generic evidence.':'The offer leaves important buyer questions unanswered. Start with the weakest dimension rather than polishing the whole message.';
 el('ocsComposite').innerHTML=`<div><div class="ocs-score">${composite}<span> / 100</span></div><div class="ocs-grade">${grade}</div></div><div><p class="ocs-summary">${summary}</p><p class="ocs-summary" style="margin-top:9px;font-size:12px">${usable.length} of 8 dimensions had enough usable evidence for a meaningful score.</p></div>`;
 const note=el('ocsInsufficientNote');if(insufficient){note.hidden=false;note.textContent=`${insufficient} dimension${insufficient===1?'':'s'} did not contain enough usable evidence to support a confident score. Those gaps are shown rather than guessed.`}else note.hidden=true;
 el('ocsBreakdown').innerHTML=results.map(r=>`<div class="ocs-dimension"><div><div class="ocs-dimension-head"><span class="ocs-dimension-name">${r.name}</span><span class="ocs-dimension-score">${r.suff?r.score+' / 100':'Not enough evidence'}</span></div><div class="ocs-bar"><div class="ocs-bar-fill" style="width:${r.score}%"></div></div></div><p class="ocs-dimension-note">${r.note}${r.filler.length?' · '+r.filler.length+' filler phrase'+(r.filler.length===1?'':'s')+' detected':''}${r.concrete.length?' · '+r.concrete.length+' concrete signal'+(r.concrete.length===1?'':'s'):''}</p></div>`).join('');
 el('ocsLeak').innerHTML=`<div class="ocs-leak-label">Biggest clarity leak</div><h3 class="ocs-leak-title">${leak.name}</h3><p>${leak.filled?`This dimension scored ${leak.score}/100, making it the clearest priority among the evidence supplied.`:'No usable answer was supplied here, so this is an evidence gap rather than a claim that the dimension is weak.'}${leak.filler.length?` ${leak.filler.length} generic filler phrase${leak.filler.length===1?'':'s'} were detected.`:''}</p>`;
 const fixes=[`Rewrite <strong>${leak.name}</strong> using one specific buyer-facing statement rather than broad positioning language.`,`Add at least one concrete, checkable detail where it is genuinely available — a number, named specific, timeframe, mechanism, or proof point.`,`Re-read the offer as a buyer: can they identify what changes, why you, and what happens next without inference?`];
 el('ocsFixes').innerHTML=`<h3 class="ocs-fixes-title">What to fix first</h3><p>Do not rewrite everything. Address the largest evidence gap first.</p><div class="ocs-fix-list">${fixes.map(x=>`<div class="ocs-fix">${x}</div>`).join('')}</div>`;
 el('ocsMethodDetail').innerHTML=`<strong>Score construction</strong><br>Each answer starts from its usable word count, gains weight for concrete/checkable signals, and loses weight for detected generic filler phrases. Scores are capped at 0–100. Answers with fewer than 6 words are shown as “Not enough evidence” rather than treated as a confident judgment. This is a deterministic text analysis performed in your browser; no external data or AI judgment is used.`;
 window.scrollTo({top:0,behavior:'smooth'});
}
el('ocsStart').addEventListener('click',start);el('ocsNext').addEventListener('click',()=>next(false));el('ocsSkip').addEventListener('click',()=>next(true));el('ocsBack').addEventListener('click',()=>{if(state.i>0){const ta=el('ocsAnswer');if(ta)state.answers[state.i]=ta.value;state.i--;renderStep()}});el('ocsRestart').addEventListener('click',()=>{state.answers=Array(8).fill('');state.skipped=Array(8).fill(false);start()});el('ocsMethodToggle').addEventListener('click',e=>{e.preventDefault();const d=el('ocsMethodDetail');d.hidden=!d.hidden;if(!d.hidden)d.scrollIntoView({behavior:'smooth',block:'center'})});
})();
