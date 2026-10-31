(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const app=$("#app");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const today=()=>new Date().toISOString().slice(0,10);

/* ---------- storage ---------- */
const KEY="english_coach_v1";
let S={quiz:{},mistakes:[],days:{},known:{}};
try{const r=localStorage.getItem(KEY);if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const touch=(n=1)=>{S.days[today()]=(S.days[today()]||0)+n;save()};
function streak(){let n=0;const d=new Date();for(;;){const k=d.toISOString().slice(0,10);if(S.days[k]){n++;d.setDate(d.getDate()-1)}else if(n===0&&k===today()){d.setDate(d.getDate()-1)}else break}return n}

/* ---------- router ---------- */
const routes={home,grammar,speak,vocab,exam,progress,translate:a=>window.ECX.translate(a),subjects:a=>window.ECX.subjects(a)};
function route(){
  const h=(location.hash||"#home").slice(1).split("/");
  const name=routes[h[0]]?h[0]:"home";
  buildSide(name,h.join("/"));
  stopSpeech();
  routes[name](h.slice(1));
  app.scrollTop=0;window.scrollTo(0,0);
  document.body.classList.remove("menu-open");
}
function buildSide(name,path){
  const pairs=(arr)=>arr.map(x=>[x.id,x.title||x.name]);
  const MENU=[
    {k:"home",t:"Home"},
    {k:"speak",t:"Speak"},
    {k:"translate",t:"Translate",kids:[["u2e","Urdu to English"],["e2u","English to Urdu"]]},
    {k:"grammar",t:"Grammar",kids:pairs(window.GRAMMAR)},
    {k:"subjects",t:"CSS Subjects",kids:pairs(window.SUBJECTS||[])},
    {k:"vocab",t:"Vocabulary",kids:[["words","Words"],["idioms","Idioms"],["oneword","One word"],["phrasal","Phrasal verbs"],["pron","Pronunciation"],["errors","Common mistakes"]]},
    {k:"exam",t:"Exam",kids:[["mcq","Timed MCQ test"],["g/precis","Precis"],["g/essay","Essay"],["g/comprehension","Comprehension"],["g/interview","Interview"],["g/letters","Letters"]]},
    {k:"progress",t:"Progress"}
  ];
  const side=$("#side");
  side.innerHTML=MENU.map(m=>{
    const on=m.k===name;
    let h=`<a class="m ${on?"on":""}" href="#${m.k}">${esc(m.t)}${m.kids?`<span class="car">${on?"\u25BE":"\u25B8"}</span>`:""}</a>`;
    if(m.kids&&on)h+=`<div class="kids">${m.kids.map(([id,tt])=>`<a class="${path===m.k+"/"+id||path.indexOf(m.k+"/"+id+"/")===0||(m.k==="vocab"&&!path.includes("/")&&id==="words")?"on":""}" href="#${m.k}/${id}">${esc(tt)}</a>`).join("")}</div>`;
    return h;
  }).join("");
}
$("#menubtn")&&($("#menubtn").onclick=()=>document.body.classList.toggle("menu-open"));
window.addEventListener("hashchange",route);

/* ---------- HOME ---------- */
const PLAN=["Revision test + mock interview (Sunday)","Tenses and subject-verb agreement","Articles and prepositions","Voice and narration","Clauses, conditionals, transformation","Vocabulary, idioms, one-word substitution","Precis and essay"];
function home(){
  const dow=new Date().getDay();
  const w=VOCAB[Math.floor(Date.now()/864e5)%VOCAB.length];
  const done=Object.keys(S.quiz).length;
  app.innerHTML=`
  <h1>Assalam o Alaikum, Sibghat</h1>
  <p class="muted">Study 30 minutes every day. Speak aloud. Mistakes are how you learn.</p>
  <div class="card"><b>Today's plan:</b> ${esc(PLAN[dow])}
    <div class="row"><span>Streak: <b>${streak()}</b> day(s)</span><span>Grammar topics tried: <b>${done}/${GRAMMAR.length}</b></span><span>Mistakes saved: <b>${S.mistakes.length}</b></span></div>
    <div class="bar"><i style="width:${Math.round(done/GRAMMAR.length*100)}%"></i></div>
  </div>
  <div class="card"><b>Word of the day:</b> <span class="big" style="font-size:1.4rem">${esc(w[0])}</span> <button class="alt" onclick="window.say('${esc(w[0])}')">Listen</button>
    <div>${esc(w[1])} &nbsp;|&nbsp; ${esc(w[2])}</div><div class="muted">${esc(w[3])}</div></div>
  <h2>Start here</h2>
  <div class="grid">
    <a class="tile" href="#translate"><b>Translation practice</b><small>Urdu to English and English to Urdu, 10 sentences, repeated until correct.</small></a>
    <a class="tile" href="#subjects"><b>CSS subjects</b><small>IR, Gender Studies, European History, Criminology and compulsory subjects. Listen, quiz, speak.</small></a>
    <a class="tile" href="#speak"><b>Speak and get corrected</b><small>Use the microphone or type. Instant grammar correction.</small></a>
    <a class="tile" href="#grammar"><b>Wren &amp; Martin grammar</b><small>20 topics: rules, examples, quizzes.</small></a>
    <a class="tile" href="#vocab"><b>Vocabulary</b><small>Words, idioms, one-word substitution, phrasal verbs.</small></a>
    <a class="tile" href="#exam"><b>Competitive exam prep</b><small>Precis, essay, interview, timed MCQs.</small></a>
    <a class="tile" href="#vocab/errors"><b>Common mistakes</b><small>Mistakes Urdu and Pashto speakers often make.</small></a>
    <a class="tile" href="#progress"><b>My progress</b><small>Scores and mistake log.</small></a>
  </div>
  <h2>Daily routine (30 minutes)</h2>
  <div class="card"><ol><li>Warm-up speaking: 5 sentences about your day (Speak page).</li><li>One grammar topic and its quiz (10 min).</li><li>10 vocabulary cards (5 min).</li><li>One precis OR one essay outline from the Exam page (10 min).</li><li>Read your mistake log (Progress page) for 2 minutes.</li></ol></div>`;
}

/* ---------- GRAMMAR ---------- */
function grammar(a){
  if(a[0]) return lesson(a[0],a[1]);
  app.innerHTML=`<h1>Wren &amp; Martin Grammar</h1><p class="muted">Study the rules, then take the quiz. Repeat until you score 5/5.</p>
  <div class="grid">${GRAMMAR.map(t=>{const q=S.quiz[t.id];return `<a class="tile" href="#grammar/${t.id}"><b>${esc(t.title)}</b><small>${q?`Best: ${q.best}/${t.quiz.length}`:"Not tried"}</small></a>`}).join("")}</div>`;
}
function lesson(id,mode){
  const t=GRAMMAR.find(x=>x.id===id); if(!t){location.hash="#grammar";return}
  if(mode==="quiz") return runQuiz(t.title,t.quiz.map(q=>({q:q[0],o:q[1],a:q[2],e:q[3]})),r=>{
    const b=S.quiz[id]?Math.max(S.quiz[id].best,r.score):r.score;S.quiz[id]={best:b,last:r.score,date:today()};
    r.wrong.forEach(w=>S.mistakes.push({kind:"Quiz",wrong:w.q,right:w.o[w.a],why:w.e,date:today()}));save();touch(2);
  },()=>{location.hash="#grammar/"+id},"#grammar");
  app.innerHTML=`<p><a href="#grammar">&larr; All topics</a></p><h1>${esc(t.title)}</h1>
  <div class="card">${t.rules.map(r=>`<div class="rule">${esc(r)}</div>`).join("")}</div>
  <div class="row"><button onclick="location.hash='#grammar/${id}/quiz'">Take the quiz (${t.quiz.length} questions)</button>
  <button class="alt" onclick="window.say(${JSON.stringify(t.rules.join(' '))})">Listen to rules</button></div>`;
}

/* ---------- generic QUIZ runner ---------- */
function runQuiz(title,qs,onDone,onRetry,backHref,timer){
  let i=0,score=0,wrong=[],locked=false,t0=Date.now();
  function show(){
    if(i>=qs.length){
      const sec=Math.round((Date.now()-t0)/1000);
      onDone&&onDone({score,wrong});
      app.innerHTML=`<h1>${esc(title)}: finished</h1><div class="card"><div class="big">${score}/${qs.length}</div>
      <div class="muted">Time: ${Math.floor(sec/60)}m ${sec%60}s</div>
      <p>${score===qs.length?"Excellent!":score>=qs.length*0.7?"Good. Review the mistakes below.":"Study the rules again, then retry."}</p></div>
      ${wrong.length?`<h2>Review your mistakes</h2>${wrong.map(w=>`<div class="note err"><b>${esc(w.q)}</b><br>Correct: <b>${esc(w.o[w.a])}</b><br><span class="muted">${esc(w.e||"")}</span></div>`).join("")}`:""}
      <div class="row"><button onclick="window.__retry()">Try again</button><a class="btn alt" style="text-decoration:none;padding:9px 16px;border:1px solid var(--teal);border-radius:8px;color:var(--teal)" href="${backHref}">Back</a></div>`;
      window.__retry=onRetry||(()=>route());return;
    }
    const q=qs[i];locked=false;
    app.innerHTML=`<p class="muted">${esc(title)} &nbsp; Question ${i+1} of ${qs.length}</p><div class="bar"><i style="width:${i/qs.length*100}%"></i></div>
    <div class="card"><b style="font-size:1.1rem">${esc(q.q)}</b><div class="opts">${q.o.map((o,k)=>`<button data-k="${k}">${esc(o)}</button>`).join("")}</div><div id="fb"></div></div>`;
    app.querySelectorAll(".opts button").forEach(b=>b.onclick=()=>{
      if(locked)return;locked=true;const k=+b.dataset.k;
      app.querySelectorAll(".opts button").forEach(x=>x.disabled=true);
      app.querySelector(`.opts button[data-k="${q.a}"]`).classList.add("right");
      if(k===q.a)score++;else{b.classList.add("wrong");wrong.push(q)}
      $("#fb").innerHTML=`<div class="note ${k===q.a?"ok":"err"}"><b>${k===q.a?"Correct":"Not correct"}.</b> ${esc(q.e||"")}</div><button id="nx">${i+1<qs.length?"Next":"Finish"}</button>`;
      $("#nx").onclick=()=>{i++;show()};
    });
  }
  show();
}

/* ---------- SPEAK: rules + LanguageTool ---------- */
const BASEV={went:"go",came:"come",saw:"see",ate:"eat",took:"take",gave:"give",made:"make",said:"say",got:"get",knew:"know",wrote:"write",spoke:"speak",bought:"buy",did:"do",had:"have",ran:"run"};
const STAT={having:"have",knowing:"know",wanting:"want",liking:"like",loving:"love",understanding:"understand",believing:"believe",needing:"need",hearing:"hear",seeing:"see"};
const V3={knows:"know",sings:"sing",goes:"go",comes:"come",works:"work",plays:"play",speaks:"speak",writes:"write",reads:"read",eats:"eat",takes:"take",gives:"give",makes:"make",says:"say",knows:"know",wants:"want",likes:"like",helps:"help",runs:"run",walks:"walk",has:"have",does:"do",drives:"drive",swims:"swim"};
const RULES=[
 [/\b(?:am|is|are) agree\b/gi,()=>"agree","'Agree' is a verb. Say 'I agree', not 'I am agree'."],
 [/\b(said) (me|him|her|us|them)\b/gi,(m,a,b)=>"told "+b,"'Say' needs 'to'. Use 'told me' or 'said to me'."],
 [/\bam (having|knowing|wanting|liking|loving|understanding|believing|needing|hearing|seeing)\b/gi,(m,v)=>STAT[v.toLowerCase()],"Do not use these verbs in the continuous form."],
 [/\bdiscuss(?:ed|es|ing)? about\b/gi,m=>m.replace(/ about/i,""),"'Discuss' takes no preposition: discuss the topic."],
 [/\breturn back\b/gi,()=>"return","'Return' already means come back."],
 [/\bcousin (?:brother|sister)\b/gi,()=>"cousin","'Cousin' has no gender."],
 [/\bmore (better|worse|easier|bigger|faster|taller|smaller|cheaper|stronger|nicer)\b/gi,(m,a)=>a,"Do not use 'more' before a comparative."],
 [/\bmost best\b/gi,()=>"best","Do not use 'most' before a superlative."],
 [/\b(he|she|it) don't\b/gi,(m,a)=>a+" doesn't","Use 'doesn't' with he/she/it."],
 [/\b(did not|didn't|did) (went|came|saw|ate|took|gave|made|said|got|knew|wrote|spoke|bought|ran)\b/gi,(m,a,b)=>a+" "+BASEV[b.toLowerCase()],"After 'did', use the base form of the verb."],
 [/\b(can|could|will|would|should|must|may|might) (sings|goes|comes|works|plays|speaks|writes|reads|eats|takes|gives|makes|says|knows|wants|likes|helps|runs|walks|has|does|drives|swims)\b/gi,(m,a,b)=>a+" "+V3[b.toLowerCase()],"After a modal, use the base verb."],
 [/\b(informations|advices|furnitures|equipments|luggages|knowledges|peoples)\b/gi,m=>({informations:"information",advices:"advice",furnitures:"furniture",equipments:"equipment",luggages:"luggage",knowledges:"knowledge",peoples:"people"})[m.toLowerCase()],"This noun is uncountable: no plural -s."],
 [/\b(?:a|an) (information|advice|furniture|equipment|luggage|knowledge)\b/gi,(m,a)=>a,"Uncountable nouns do not take 'a/an'."],
 [/\bopen the (light|lights|fan|tv|ac)\b/gi,(m,a)=>"switch on the "+a,"Use 'switch on' for lights and machines."],
 [/\bclose the (light|lights|fan|tv|ac)\b/gi,(m,a)=>"switch off the "+a,"Use 'switch off' for lights and machines."],
 [/\bgoing to home\b/gi,()=>"going home","No 'to' before 'home'."],
 [/^\s*myself\b/i,()=>"I am","Do not start with 'myself'. Say 'I am...' or 'My name is...'."],
 [/\byour good name\b/gi,()=>"your name","Just say 'your name'."],
 [/\bsince (\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten) (years?|months?|weeks?|days?|hours?)\b/gi,(m,a,b)=>"for "+a+" "+b,"Use 'for' with a period of time, 'since' with a point in time."],
 [/\bI have (\d+) years?\b(?! old)/gi,(m,a)=>"I am "+a+" years old","Age uses 'be': I am 25 years old."],
 [/\bI am (living|working|studying|waiting|learning)\b([^.?!]*?)\b(since|for)\b/gi,(m,a,b,c)=>"I have been "+a+b+c,"With 'since/for' use the present perfect continuous."],
 [/\bless (people|students|books|cars|persons|friends|mistakes|words)\b/gi,(m,a)=>"fewer "+a,"Use 'fewer' with countable nouns."],
 [/\bthe reason is because\b/gi,()=>"the reason is that","Say 'the reason is that'."],
 [/\bmarried with\b/gi,()=>"married to","Say 'married to'."],
 [/\brevert back\b/gi,()=>"revert","'Revert' already means go back."],
 [/\bpeople is\b/gi,()=>"people are","'People' is plural."],
 [/\b(he|she|it) have\b/gi,(m,a)=>a+" has","Use 'has' with he/she/it."],
 [/\b(I|we|you|they) has\b/gi,(m,a)=>a+" have","Use 'have' with I/we/you/they."],
 [/\b(a) ([aeiou]\w*)/gi,(m,a,b)=>/^(uni|use|usu|eur|one|once|ubi|uti)/i.test(b)?m:"an "+b,"Use 'an' before a vowel sound."],
 [/\b(states|students|women|men|children|countries|people|things|problems|laws) is\b/gi,(m,a)=>a+" are","Plural subject: use 'are'."],
 [/\b(realism|liberalism|feminism|he|she|it|everyone|everybody|nobody|government|society) (say|believe|think|want|like|need|know|show|stress|argue|claim|say)\b/gi,(m,a,b)=>a+" "+b+"s","Singular subject: add -s to the present-tense verb."],
 [/\b(he|she|it) are\b/gi,(m,a)=>a+" is","Use 'is' with he/she/it."],
 [/\b(I|we|you|they) is\b/gi,(m,a)=>a==="I"?"I am":a+" are","Check subject-verb agreement."],
 [/\bI is\b/g,()=>"I am","Use 'I am'."],
 [/\b(does not|doesn't|doesnt) (knows|goes|comes|works|plays|speaks|writes|reads|eats|takes|gives|makes|says|wants|likes|helps|runs|walks|has|does)\b/gi,(m,a,b)=>a+" "+V3[b.toLowerCase()],"After 'does not', use the base verb (no -s)."]
];
function localCheck(text){
  let out=text;const found=[];
  out=out.replace(/\bi\b/g,"I");
  RULES.forEach(([re,fn,msg])=>{
    if(!msg)return;
    out=out.replace(re,(...m)=>{const rep=fn(...m);if(rep!==m[0]){found.push({wrong:m[0],right:rep,why:msg})}return rep});
  });
  out=out.replace(/(^|[.!?]\s+)([a-z])/g,(m,a,b)=>a+b.toUpperCase());
  return {out,found};
}
async function ltCheck(text){
  const body=new URLSearchParams({text,language:"en-GB",enabledOnly:"false"});
  const ctrl=new AbortController();const to=setTimeout(()=>ctrl.abort(),9000);
  try{
    const r=await fetch("https://api.languagetool.org/v2/check",{method:"POST",body,signal:ctrl.signal,headers:{"Content-Type":"application/x-www-form-urlencoded"}});
    clearTimeout(to);if(!r.ok)throw new Error(r.status);
    return (await r.json()).matches||[];
  }catch(e){clearTimeout(to);return null}
}
function applyLT(text,matches){
  let out=text;const issues=[];
  matches.slice().sort((a,b)=>b.offset-a.offset).forEach(m=>{
    const rep=m.replacements&&m.replacements[0]&&m.replacements[0].value;
    const orig=text.substr(m.offset,m.length);
    issues.unshift({wrong:orig,right:rep||"",why:m.message,cat:m.rule&&m.rule.category&&m.rule.category.name});
    if(rep&&m.rule&&m.rule.issueType!=="style"&&m.rule.category.id!=="STYLE")out=out.slice(0,m.offset)+rep+out.slice(m.offset+m.length);
  });
  return {out,issues};
}
function diffHTML(a,b){
  const x=a.split(/\s+/).filter(Boolean),y=b.split(/\s+/).filter(Boolean);
  const n=x.length,m=y.length,L=Array.from({length:n+1},()=>Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=x[i].toLowerCase()===y[j].toLowerCase()?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
  let i=0,j=0,o=[];
  while(i<n&&j<m){if(x[i].toLowerCase()===y[j].toLowerCase()){o.push(esc(y[j]));i++;j++}else if(L[i+1][j]>=L[i][j+1]){o.push(`<span class="del">${esc(x[i])}</span>`);i++}else{o.push(`<span class="add">${esc(y[j])}</span>`);j++}}
  while(i<n)o.push(`<span class="del">${esc(x[i++])}</span>`);while(j<m)o.push(`<span class="add">${esc(y[j++])}</span>`);
  return o.join(" ");
}
/* speech */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
function stopSpeech(){try{rec&&rec.stop()}catch(e){}rec=null;try{speechSynthesis.cancel()}catch(e){}}
window.say=function(t,lang){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=lang||"en-GB";u.rate=.9;speechSynthesis.speak(u)}catch(e){alert("Speech playback is not supported in this browser.")}};
function listen(onText,onEnd,lang){
  if(!SR){alert("Voice typing needs Google Chrome or Microsoft Edge. You can type instead.");return null}
  const r=new SR();r.lang=lang||"en-GB";r.interimResults=true;r.continuous=false;
  r.onresult=e=>{let s="";for(const x of e.results)s+=x[0].transcript;onText(s,e.results[e.results.length-1].isFinal)};
  r.onend=onEnd;r.onerror=e=>{onEnd(e.error)};r.start();return r;
}
function speak(){
  const cats=Object.keys(SPEAK_TOPICS);
  app.innerHTML=`<h1>Speak and get corrected</h1>
  <p class="muted">1) Pick a topic. 2) Press the microphone and speak 3 to 5 sentences (or type). 3) Press Check. Correct sentences are saved in your mistake log. Use Chrome or Edge for the microphone.</p>
  <div class="card"><div class="row"><select id="cat" style="max-width:260px">${cats.map(c=>`<option>${esc(c)}</option>`).join("")}</select><button class="alt" id="newq">New question</button></div>
  <div class="note" id="q" style="font-size:1.1rem"></div>
  <div class="row"><button class="alt" id="hear">Listen to question</button></div></div>
  <div class="card"><textarea id="txt" rows="5" placeholder="Press the microphone and speak, or type here..."></textarea>
  <div class="row"><button class="mic" id="mic">Start microphone</button><button id="chk">Check my English</button><button class="alt" id="clr">Clear</button></div>
  <div class="muted">Tip: speak slowly. The microphone may auto-correct some words, so also practise by typing what you really say.</div></div>
  <div id="res"></div>`;
  const pick=()=>{const l=SPEAK_TOPICS[$("#cat").value];$("#q").textContent=l[Math.floor(Math.random()*l.length)]};
  $("#cat").onchange=pick;$("#newq").onclick=pick;pick();
  $("#hear").onclick=()=>window.say($("#q").textContent);
  $("#clr").onclick=()=>{$("#txt").value="";$("#res").innerHTML=""};
  const mic=$("#mic");
  mic.onclick=()=>{
    if(rec){stopSpeech();mic.classList.remove("on");mic.textContent="Start microphone";return}
    const base=$("#txt").value?$("#txt").value.trim()+" ":"";
    rec=listen((t)=>{$("#txt").value=base+t},()=>{rec=null;mic.classList.remove("on");mic.textContent="Start microphone"});
    if(rec){mic.classList.add("on");mic.textContent="Listening... (press to stop)"}
  };
  $("#chk").onclick=async()=>{
    const text=$("#txt").value.trim();if(!text)return;
    $("#res").innerHTML=`<div class="card">Checking...</div>`;
    const L=localCheck(text);const ms=await ltCheck(L.out);
    const T=ms?applyLT(L.out,ms):{out:L.out,issues:[]};
    const final=T.out.replace(/\s+/g," ").trim();
    const all=[...L.found.map(f=>({...f,src:"rule"})),...T.issues.map(f=>({...f,src:"LT"}))].filter(x=>x.wrong&&x.wrong.toLowerCase()!==(x.right||"").toLowerCase());
    all.forEach(x=>S.mistakes.push({kind:"Speaking",wrong:x.wrong,right:x.right||"(see note)",why:x.why,date:today()}));
    if(S.mistakes.length>400)S.mistakes=S.mistakes.slice(-400);save();touch(1+all.length?1:1);
    const same=final.toLowerCase()===text.replace(/\s+/g," ").trim().toLowerCase();
    $("#res").innerHTML=`<div class="card"><b>What you said:</b><div>${esc(text)}</div>
    <div class="note ${all.length?"err":"ok"}"><b>${all.length?"Better version:":"Correct! No mistakes found."}</b><div style="font-size:1.1rem">${same?esc(final):diffHTML(text,final)}</div>${same?"":`<div style="margin-top:8px"><b>Clean sentence:</b> ${esc(final)}</div>`}</div>
    <div class="row"><button class="alt" id="hr">Listen to correct version</button><button id="rep">Say it again</button></div><div id="rr"></div></div>
    ${all.length?`<h2>What was wrong</h2>${all.map(x=>`<div class="note err"><span class="del">${esc(x.wrong)}</span> &rarr; <span class="add">${esc(x.right||"?")}</span><div class="muted">${esc(x.why)}</div></div>`).join("")}`:""}
    ${ms===null?`<div class="note">The online grammar checker could not be reached, so only the built-in rules were used. Check your internet connection.</div>`:""}
    <div class="muted">Automatic checking is good but not perfect. Check important rules in the Grammar page or in your Wren &amp; Martin book.</div>`;
    $("#hr").onclick=()=>window.say(final);
    $("#rep").onclick=()=>{
      $("#rr").innerHTML=`<div class="muted">Listening...</div>`;
      rec=listen((t,fin)=>{
        const a=final.toLowerCase().replace(/[^a-z' ]/g,"").split(/\s+/).filter(Boolean),b=new Set(t.toLowerCase().replace(/[^a-z' ]/g,"").split(/\s+/));
        const hit=a.filter(w=>b.has(w)).length,pct=Math.round(hit/(a.length||1)*100);
        $("#rr").innerHTML=`<div class="note ${pct>=80?"ok":"err"}">You said: ${esc(t)}<br><b>Match: ${pct}%</b> ${pct>=80?"Well done!":"Listen again and repeat slowly."}</div>`;
      },()=>{rec=null});
    };
  };
}

/* ---------- VOCAB ---------- */
const SETS={
 words:{name:"Words",get:()=>VOCAB.map(v=>({f:v[0],b:`${v[1]}<br><span class="muted">${esc(v[2])}</span><br><i>${esc(v[3])}</i>`,k:v[0],a:v[1],speak:v[0]}))},
 idioms:{name:"Idioms",get:()=>IDIOMS.map(v=>({f:v[0],b:`${v[1]}<br><i>${esc(v[2])}</i>`,k:v[0],a:v[1]}))},
 oneword:{name:"One word",get:()=>ONEWORD.map(v=>({f:v[0],b:`<b>${esc(v[1])}</b>`,k:v[1],a:v[1],speak:v[1]}))},
 phrasal:{name:"Phrasal verbs",get:()=>PHRASAL.map(v=>({f:v[0],b:`${v[1]}<br><i>${esc(v[2])}</i>`,k:v[0],a:v[1]}))}
};
function vocab(a){
  const set=a[0]||"words";
  const tabs=[...Object.keys(SETS).map(k=>[k,SETS[k].name]),["pron","Pronunciation"],["errors","Common mistakes"]];
  const head=`<h1>Vocabulary</h1><div class="tabs">${tabs.map(([k,n])=>`<button class="${k===set?"on":""}" onclick="location.hash='#vocab/${k}'">${n}</button>`).join("")}</div>`;
  if(set==="pron"){
    app.innerHTML=head+`<div class="card"><table><tr><th>Word</th><th>Say it</th><th>Note</th><th></th></tr>${PRONOUNCE.map(p=>`<tr><td><b>${esc(p[0])}</b></td><td>${esc(p[1])}</td><td>${esc(p[2])}</td><td><button class="alt" onclick="window.say('${esc(p[0])}')">Listen</button></td></tr>`).join("")}</table></div>`;return}
  if(set==="errors"){
    app.innerHTML=head+`<p class="muted">Mistakes often made by Urdu and Pashto speakers. Read them aloud, correct form only.</p><div class="card"><table><tr><th>Wrong</th><th>Correct</th><th>Why</th></tr>${COMMON_ERRORS.map(p=>`<tr><td class="del">${esc(p[0])}</td><td class="add">${esc(p[1])}</td><td>${esc(p[2])}</td></tr>`).join("")}</table></div>`;return}
  const items=SETS[set].get();let deck=shuffle(items.filter(i=>!S.known[set+":"+i.k]));
  if(!deck.length){deck=shuffle(items)}
  let i=0,flipped=false;
  function card(){
    const it=deck[i%deck.length];const knownN=items.filter(x=>S.known[set+":"+x.k]).length;
    app.innerHTML=head+`<p class="muted">Known: ${knownN}/${items.length}. Tap the card to see the answer.</p>
    <div class="card flash" id="fc"><div>${flipped?it.b:esc(it.f)}</div>${flipped?`<small>${esc(it.f)}</small>`:`<small>Tap to flip</small>`}</div>
    <div class="row"><button id="know">I know it</button><button class="alt" id="again">Show again later</button>${it.speak?`<button class="alt" id="sp">Listen</button>`:""}<button class="alt" id="qz">Quiz me (10)</button></div>`;
    $("#fc").onclick=()=>{flipped=!flipped;card()};
    $("#know").onclick=()=>{S.known[set+":"+it.k]=1;save();touch();i++;flipped=false;card()};
    $("#again").onclick=()=>{i++;flipped=false;card()};
    if(it.speak)$("#sp").onclick=e=>{e.stopPropagation();window.say(it.speak)};
    $("#qz").onclick=()=>vquiz(set,items);
  }
  card();
}
function vquiz(set,items){
  const pool=shuffle(items).slice(0,10);
  const qs=pool.map(it=>{
    const ans=SETS[set]===SETS.oneword?it.k:it.a;
    const q=set==="oneword"?it.f:(set==="words"||set==="idioms"||set==="phrasal"?`What does "${it.f}" mean?`:it.f);
    const wrong=shuffle(items.filter(x=>x!==it)).slice(0,3).map(x=>set==="oneword"?x.k:x.a);
    const opts=shuffle([ans,...wrong]);return {q,o:opts,a:opts.indexOf(ans),e:it.f+": "+ans};
  });
  runQuiz(SETS[set].name+" quiz",qs,r=>{touch(2)},()=>vquiz(set,items),"#vocab/"+set);
}

/* ---------- EXAM ---------- */
function exam(a){
  if(a[0]==="mcq") return mcq();
  if(a[0]==="g") return guide(a[1]);
  const g=GRAMMAR.length;
  app.innerHTML=`<h1>Competitive Exam Preparation</h1>
  <div class="grid">
    <a class="tile" href="#exam/mcq"><b>Timed MCQ test</b><small>20 mixed grammar questions from all ${g} topics.</small></a>
    ${Object.keys(GUIDES).map(k=>`<a class="tile" href="#exam/g/${k}"><b>${esc(GUIDES[k].title)}</b><small>Step-by-step method</small></a>`).join("")}
  </div>
  <h2>Random essay topic</h2><div class="card"><div class="note" id="et" style="font-size:1.1rem"></div>
  <div class="row"><button id="en">New topic</button><span class="muted">Write the thesis statement, 5 outline points and a conclusion for each.</span></div></div>
  <h2>Useful phrases</h2>${Object.keys(USEFUL_PHRASES).map(k=>`<div class="card"><b>${esc(k)}</b><ul>${USEFUL_PHRASES[k].map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}`;
  const nxt=()=>{$("#et").textContent=ESSAY_TOPICS[Math.floor(Math.random()*ESSAY_TOPICS.length)]};$("#en").onclick=nxt;nxt();
}
function guide(k){
  const g=GUIDES[k];if(!g){location.hash="#exam";return}
  app.innerHTML=`<p><a href="#exam">&larr; Exam</a></p><h1>${esc(g.title)}</h1><div class="card"><ol>${g.steps.map(s=>`<li style="margin:8px 0">${esc(s)}</li>`).join("")}</ol></div>${g.tips.length?`<h2>Tips</h2><div class="card"><ul>${g.tips.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`:""}`;
}
function mcq(){
  const all=GRAMMAR.flatMap(t=>t.quiz.map(q=>({q:q[0],o:q[1],a:q[2],e:q[3],t:t.title})));
  const qs=shuffle(all).slice(0,20);
  runQuiz("Mixed MCQ test",qs,r=>{
    r.wrong.forEach(w=>S.mistakes.push({kind:"MCQ",wrong:w.q,right:w.o[w.a],why:w.e,date:today()}));
    S.mock=(S.mock||[]);S.mock.push({date:today(),score:r.score,total:qs.length});S.mock=S.mock.slice(-30);save();touch(3);
  },mcq,"#exam");
}

/* ---------- PROGRESS ---------- */
function progress(){
  const q=Object.entries(S.quiz);const avg=q.length?Math.round(q.reduce((s,[id,v])=>{const t=GRAMMAR.find(x=>x.id===id);return s+v.best/t.quiz.length},0)/q.length*100):0;
  const knownN=Object.keys(S.known).length;
  const weak=GRAMMAR.filter(t=>S.quiz[t.id]&&S.quiz[t.id].best<t.quiz.length).map(t=>t.title);
  const recent=S.mistakes.slice(-40).reverse();
  const mock=(S.mock||[]).slice(-5).reverse();
  app.innerHTML=`<h1>My Progress</h1>
  <div class="grid">
   <div class="card"><div class="big">${streak()}</div>day streak</div>
   <div class="card"><div class="big">${q.length}/${GRAMMAR.length}</div>grammar topics tried (avg best ${avg}%)</div>
   <div class="card"><div class="big">${knownN}</div>vocabulary items known</div>
   <div class="card"><div class="big">${S.mistakes.length}</div>mistakes logged</div>
  </div>
  ${weak.length?`<h2>Revise these topics</h2><div class="card">${weak.map(w=>`<div>${esc(w)}</div>`).join("")}</div>`:""}
  ${mock.length?`<h2>Recent mock tests</h2><div class="card">${mock.map(m=>`<div>${m.date}: <b>${m.score}/${m.total}</b></div>`).join("")}</div>`:""}
  <h2>My mistake log (latest 40)</h2>${recent.length?recent.map(m=>`<div class="note err"><span class="muted">${m.kind} ${m.date}</span><br><span class="del">${esc(m.wrong)}</span> &rarr; <span class="add">${esc(m.right)}</span><div class="muted">${esc(m.why||"")}</div></div>`).join(""):`<div class="card muted">No mistakes yet. Try the Speak page.</div>`}
  <div class="row"><button class="alt" id="ex">Download my progress</button><label class="btn alt" style="padding:9px 16px;border:1px solid var(--teal);border-radius:8px;color:var(--teal);cursor:pointer">Restore progress<input type="file" id="im" accept=".json" hidden></label><button class="alt" id="rs">Reset everything</button></div>`;
  $("#ex").onclick=()=>{const b=new Blob([JSON.stringify(S)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="english-coach-progress.json";a.click()};
  $("#im").onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{S=Object.assign({quiz:{},mistakes:[],days:{},known:{}},JSON.parse(t));save();progress()}catch(x){alert("Invalid file")}})};
  $("#rs").onclick=()=>{if(confirm("Delete all progress?")){S={quiz:{},mistakes:[],days:{},known:{}};save();progress()}};
}

window.EC={esc,shuffle,S:()=>S,save,touch,today,localCheck,ltCheck,applyLT,diffHTML,runQuiz,stop:stopSpeech,listen:(a,b,c)=>{rec=listen(a,b,c);return rec},$,app};
window.addEventListener("load",route);
})();
