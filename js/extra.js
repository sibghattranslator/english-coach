(function(){
"use strict";
const E=window.EC,$=E.$,app=E.app,esc=E.esc,shuffle=E.shuffle;
const mistake=(kind,wrong,right,why)=>{const S=E.S();S.mistakes.push({kind,wrong,right,why,date:E.today()});if(S.mistakes.length>400)S.mistakes=S.mistakes.slice(-400)};

/* ---------- text comparison ---------- */
function normEn(s){
  s=" "+s.toLowerCase().replace(/[‘’]/g,"'")+" ";
  s=s.replace(/won't/g," will not").replace(/can't/g," cannot").replace(/n't/g," not").replace(/'m\b/g," am").replace(/'re\b/g," are").replace(/'ll\b/g," will").replace(/'ve\b/g," have").replace(/\bcan not\b/g,"cannot");
  s=s.replace(/[^a-z0-9 ]/g," ");return s.split(/\s+/).filter(Boolean);
}
function lcs(a,b){const n=a.length,m=b.length,L=Array.from({length:n+1},()=>Array(m+1).fill(0));for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=a[i]===b[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);return L[0][0]}
const dice=(a,b)=>a.length+b.length?2*lcs(a,b)/(a.length+b.length):0;
function normUr(s){
  s=s.replace(/[ً-ٰٟ۔،؟!?.,;:"'()\-]/g," ").replace(/ي/g,"ی").replace(/ك/g,"ک").replace(/ۃ/g,"ہ").replace(/ە/g,"ہ").replace(/ئ/g,"ی");
  return s.split(/\s+/).filter(Boolean);
}
function bag(a,b){const m={};b.forEach(w=>m[w]=(m[w]||0)+1);let c=0;a.forEach(w=>{if(m[w]>0){m[w]--;c++}});return a.length+b.length?2*c/(a.length+b.length):0}

async function gradeEnglish(text){
  const L=E.localCheck(text);const ms=await E.ltCheck(L.out);
  const T=ms?E.applyLT(L.out,ms):{out:L.out,issues:[]};
  const final=T.out.replace(/\s+/g," ").trim();
  const errors=[...L.found,...T.issues].filter(x=>x.wrong&&x.wrong.toLowerCase()!==(x.right||"").toLowerCase());
  return {final,errors,online:ms!==null};
}

/* ---------- speech helpers ---------- */
function hasVoice(lang){try{return speechSynthesis.getVoices().some(v=>v.lang.toLowerCase().replace("_","-").startsWith(lang))}catch(e){return false}}
let urWarned=false;
function sayUr(t){
  if(!hasVoice("ur")){
    if(!urWarned){urWarned=true;alert("No Urdu voice is installed on this device, so Urdu cannot be read aloud. Read the Urdu sentence yourself. (Windows: Settings > Time & language > Speech > Add voices > Urdu.) This message will not appear again.")}
    return;
  }
  window.say(t,"ur-PK");
}
const MICERR={
  "not-allowed":"The microphone is blocked. Click the lock icon in the address bar, set Microphone to Allow, and reload.",
  "service-not-allowed":"The browser blocked speech recognition. Use Google Chrome and open the app from START.bat (localhost).",
  "audio-capture":"No microphone found. Plug in or enable a microphone.",
  "no-speech":"I did not hear anything. Press Space and speak clearly.",
  "network":"Speech recognition needs the internet (Chrome sends audio to Google). Check your connection.",
  "language-not-supported":"This browser does not support Urdu speech recognition. Use Google Chrome, or type the Urdu answer with an Urdu keyboard.",
  "aborted":""
};
function micInto(el,lang,btn,onEnd){
  if(btn.dataset.on){E.stop();return}
  const langs=lang==="ur-PK"?["ur-PK","ur-IN","ur"]:[lang];
  let msg=btn.parentNode.querySelector(".micmsg");
  if(!msg){msg=document.createElement("div");msg.className="muted micmsg";msg.style.width="100%";btn.parentNode.appendChild(msg)}
  const base=el.value?el.value.trim()+" ":"";
  let li=0,lastErr="",retry=false,heard=false;
  function reset(){delete btn.dataset.on;btn.classList.remove("on");btn.textContent="Start microphone"}
  function start(){
    retry=false;lastErr="";
    const r=E.listen(txt=>{heard=true;el.value=base+txt;msg.textContent=""},(x)=>{
      if(typeof x==="string"){lastErr=x;if(x==="language-not-supported"&&li<langs.length-1){retry=true}return}
      if(retry){li++;msg.textContent="Trying "+langs[li]+"...";setTimeout(start,150);return}
      reset();
      if(lastErr&&lastErr!=="aborted"){msg.innerHTML="<b>Microphone problem ("+esc(lastErr)+"):</b> "+esc(MICERR[lastErr]||"Unknown error. Try Google Chrome.");return}
      if(!heard&&!lastErr){msg.textContent=MICERR["no-speech"];return}
      onEnd&&onEnd();
    },langs[li]);
    if(r){btn.dataset.on="1";btn.classList.add("on");btn.textContent="Listening ("+langs[li]+")... press Space to stop";if(!retry)msg.textContent=""}
  }
  start();
}

/* ---------- TRANSLATION DRILL ---------- */
function translate(a){
  if(a[0]==="u2e")return drill("u2e");
  if(a[0]==="e2u")return drill("e2u");
  app.innerHTML=`<h1>Translation Practice</h1>
  <p class="muted">Each round has 10 sentences. A wrong sentence comes back again until you get it right.</p>
  <div class="grid">
   <a class="tile" href="#translate/u2e"><b>Urdu to English</b><small>You see (and can hear) an Urdu sentence. You say it in English. Grammar is corrected at once.</small></a>
   <a class="tile" href="#translate/e2u"><b>English to Urdu</b><small>You hear an English sentence. You say it in Urdu. The model answer is shown.</small></a>
  </div>
  <div class="card"><b>How it works</b><ol>
  <li>Press the microphone and say the sentence. When you stop speaking, it is checked automatically (this is the "interrupt and correct").</li>
  <li>Correct: you go to the next sentence. Wrong: you see the correction and the model answer, and the sentence returns later.</li>
  <li>The round ends only when all 10 are correct. Mistakes are saved in your mistake log.</li></ol></div>`;
}
function drill(mode){
  const PAIRS=window.PAIRS,TAGS=window.PAIR_TAGS;
  let tag="mix";try{tag=localStorage.getItem("ec_trtag")||"mix"}catch(e){}
  if(tag!=="mix"&&!TAGS[tag])tag="mix";
  function pick(){
    const st=E.S();st.trSeen=st.trSeen||{};
    let pool=tag==="mix"?PAIRS:PAIRS.filter(p=>p[2]===tag);
    let fresh=pool.filter(p=>!st.trSeen[p[0]]);
    if(fresh.length<10){pool.forEach(p=>delete st.trSeen[p[0]]);fresh=pool}
    let out;
    if(tag==="mix"){
      const by={};shuffle(fresh).forEach(p=>(by[p[2]]=by[p[2]]||[]).push(p));
      const keys=shuffle(Object.keys(by));out=[];
      for(let i=0;out.length<10&&keys.some(k=>by[k][i]);i++)keys.forEach(k=>{if(by[k][i]&&out.length<10)out.push(by[k][i])});
    }else out=shuffle(fresh).slice(0,10);
    out.forEach(p=>st.trSeen[p[0]]=1);E.save();
    return shuffle(out).map(p=>({p,tries:0}));
  }
  let queue=pick();const total=queue.length,hist=[];
  let checked=false;
  function next(auto){queue.length?show(auto):finish()}
  function finish(){
    E.touch(4);E.S();
    app.innerHTML=`<h1>Round complete</h1><div class="card"><div class="big">${total}/${total}</div>All sentences correct.
    <ul>${hist.map(h=>`<li>${esc(mode==="u2e"?h.p[1].split("|")[0]:h.p[0])} <span class="muted">(${h.tries===0?"first time":h.tries+" retry"+(h.tries>1?"ies":"")})</span></li>`).join("")}</ul></div>
    <div class="row"><button id="nr">New round</button><a href="#translate" class="btn alt" style="text-decoration:none;padding:9px 16px;border:1px solid var(--teal);border-radius:8px;color:var(--teal)">Back</a></div>`;
    E.save();$("#nr").onclick=()=>drill(mode);
  }
  function show(auto){
    checked=false;const it=queue[0],p=it.p,u2e=mode==="u2e";
    app.innerHTML=`<p><a href="#translate">&larr; Back</a> &nbsp; <span class="muted">Remaining: ${queue.length} of ${total}${it.tries?` &nbsp;|&nbsp; retry ${it.tries}`:""}</span> &nbsp; <select id="tag" style="width:auto;padding:4px 8px"><option value="mix">Mixed (all subjects)</option>${Object.keys(TAGS).map(k=>`<option value="${k}"${k===tag?" selected":""}>${TAGS[k]}</option>`).join("")}</select> <span class="badge">${esc(TAGS[p[2]]||"")}</span></p>
    <div class="bar"><i style="width:${(total-queue.length)/total*100}%"></i></div>
    <div class="duo"><div class="L">
    <div class="card"><div class="muted">${u2e?"Say this in English:":"Say this in Urdu:"}</div>
    ${u2e?`<div style="font-size:1.6rem;direction:rtl;text-align:right;line-height:2">${esc(p[0])}</div><button class="alt" id="hear">Listen (Urdu)</button>`
         :`<div style="font-size:1.4rem">${esc(p[1].split("|")[0])}</div><button class="alt" id="hear">Listen (English)</button>`}</div>
    <div id="act" class="row" style="margin:4px 0 8px"></div>
    <div class="card"><textarea id="ans" rows="3" ${u2e?"":'dir="rtl" style="font-size:1.3rem"'} placeholder="${u2e?"Speak or type your English sentence...":"Speak or type your Urdu sentence..."}"></textarea>
    <div class="row"><button class="mic" id="mic">Start microphone</button><button id="chk">Check</button><button class="alt" id="skip">Show answer</button></div>
    <div class="muted">Keys: <b>Space</b> = start / stop microphone (answer is checked when you stop) &nbsp;|&nbsp; <b>Enter</b> = check or next &nbsp;|&nbsp; you can also edit the text and press Check again.</div></div>
    </div><div class="R"><div id="res"><div class="card muted">Your correction and the model answer will appear here, beside the question.</div></div></div></div>`;
    $("#tag").onchange=e=>{try{localStorage.setItem("ec_trtag",e.target.value)}catch(x){}tag=e.target.value;drill(mode)};
    $("#hear").onclick=()=>u2e?sayUr(p[0]):window.say(p[1].split("|")[0]);
    $("#mic").onclick=()=>micInto($("#ans"),u2e?"en-GB":"ur-PK",$("#mic"),()=>{if($("#ans").value.trim()&&!checked)check()});
    $("#chk").onclick=check;
    $("#skip").onclick=()=>result(false,"",[],null,true);
    if(!u2e&&hasVoice("en"))setTimeout(()=>window.say(p[1].split("|")[0]),300);
    window.onkeydown=e=>{
      const typing=e.target.tagName==="TEXTAREA"||e.target.tagName==="INPUT";
      if(e.key===" "&&!typing){
        e.preventDefault();const n=$("#nx"),ag=$("#again");
        if(n){n.click();return}if(ag){ag.click();return}
        $("#mic")&&$("#mic").click();return}
      if(e.key==="Enter"&&!e.shiftKey&&(!typing||e.target.id==="ans")){
        e.preventDefault();const n=$("#nx");
        if(n){n.click();return}
        if($("#ans")&&$("#ans").value.trim()){checked=false;check()}
      }
    };
    if(auto&&u2e)setTimeout(()=>{const m=$("#mic");if(m&&!m.dataset.on)m.click()},250);
  }
  async function check(){
    if(checked)return;const text=$("#ans").value.trim();if(!text)return;checked=true;E.stop();
    const it=queue[0],p=it.p,refs=p[1].split("|");
    $("#res").innerHTML=`<div class="card">Checking...</div>`;
    if(mode==="u2e"){
      const g=await gradeEnglish(text);const u=normEn(text);
      const sim=Math.max(...refs.map(r=>dice(u,normEn(r))));
      const simF=Math.max(...refs.map(r=>dice(normEn(g.final),normEn(r))));
      const pass=g.errors.length===0&&sim>=0.6;
      result(pass,text,g.errors,{final:g.final,sim,simF,online:g.online});
    }else{
      const u=normUr(text),sim=Math.max(...[p[0]].map(r=>bag(u,normUr(r))));
      result(sim>=0.6,text,[],{sim});
    }
  }
  function result(pass,text,errors,info,skipped){
    const it=queue[0],p=it.p,u2e=mode==="u2e";const ref=p[1].split("|");
    let html="";
    if(skipped){html=`<div class="note err"><b>Model answer</b></div>`}
    else if(pass){html=`<div class="note ok"><b>Correct!</b> ${u2e&&info.sim<0.85?"Your sentence is correct but worded differently from the model.":""}</div>`}
    else{
      html=`<div class="note err"><b>Not correct yet.</b> ${u2e?(errors.length?"Fix the grammar below and say it again.":"The meaning or words are different from the model."):"Your Urdu is different from the model answer."}</div>`;
      if(u2e&&info&&text&&info.final.toLowerCase()!==text.toLowerCase())html+=`<div class="card"><b>Your sentence:</b> ${E.diffHTML(text,info.final)}<div style="margin-top:6px"><b>Corrected:</b> ${esc(info.final)}</div></div>`;
      if(errors.length)html+=errors.map(x=>`<div class="note err"><span class="del">${esc(x.wrong)}</span> &rarr; <span class="add">${esc(x.right||"?")}</span><div class="muted">${esc(x.why)}</div></div>`).join("");
      if(info&&info.online===false)html+=`<div class="note">Online grammar checker was not reachable; only built-in rules were used.</div>`;
    }
    html+=`<div class="card"><b>Model answer:</b>${u2e?`<div style="font-size:1.1rem">${ref.map(esc).join("<br>")}</div><button class="alt" id="hm">Listen</button>`:`<div dir="rtl" style="font-size:1.4rem;text-align:right">${esc(p[0])}</div><button class="alt" id="hm">Listen (Urdu)</button>`}</div>`;
    $("#act").innerHTML=pass?`<button id="nx">Next sentence &rarr; (Space)</button>`:`<button id="again">Try again (Space)</button><button class="alt" id="later">Next (comes back later) &rarr;</button>`;
    $("#res").innerHTML=html;
    app.scrollTop=0;

    $("#hm").onclick=()=>u2e?window.say(ref[0]):sayUr(p[0]);
    if(!pass&&!skipped){errors.forEach(x=>mistake("Translation",x.wrong,x.right||"",x.why));if(!errors.length&&text)mistake("Translation",text,u2e?ref[0]:p[0],"Different from the model answer");E.save()}
    if(pass){$("#nx").onclick=()=>{hist.push(queue.shift());next(true)}}
    else{
      $("#again").onclick=()=>{it.tries++;show(true)};
      $("#later").onclick=()=>{it.tries++;const f=queue.shift();queue.splice(Math.min(queue.length,3),0,f);next(true)};
    }
  }
  show();
}

/* ---------- SUBJECTS ---------- */
function subjects(a){
  const SUB=window.SUBJECTS;
  if(!a[0]){
    const groups=[...new Set(SUB.map(s=>s.group))];
    app.innerHTML=`<h1>CSS Subjects</h1>
    <div class="note"><b>Please note:</b> International Relations, Gender Studies, European History and Criminology are CSS <b>optional</b> subjects. The <b>compulsory</b> subjects are English Essay, English Precis and Composition, General Science and Ability, Current Affairs, Pakistan Affairs and Islamiat. Both sets are here. Current Affairs changes daily, so read Dawn and use the Speak page for it.</div>
    <p class="muted">For each subject: <b>Notes</b> (listen to them), <b>Quiz</b> (MCQs), <b>Speak</b> (answer an oral question in English, get your grammar corrected, and see which key points you missed).</p>
    ${groups.map(g=>`<h2>${esc(g)}</h2><div class="grid">${SUB.filter(s=>s.group===g).map(s=>`<a class="tile" href="#subjects/${s.id}"><b>${esc(s.name)}</b><small>${s.notes.length} notes, ${s.mcq.length} MCQs, ${s.oral.length} oral questions</small></a>`).join("")}</div>`).join("")}`;
    return;
  }
  const s=SUB.find(x=>x.id===a[0]);if(!s){location.hash="#subjects";return}
  const tab=a[1]||"notes";
  const tabs=[["notes","Notes"],["quiz","Quiz"],["oral","Speak"]];
  const head=`<p><a href="#subjects">&larr; All subjects</a></p><h1>${esc(s.name)}</h1><div class="tabs">${tabs.map(([k,n])=>`<button class="${k===tab?"on":""}" onclick="location.hash='#subjects/${s.id}/${k}'">${n}</button>`).join("")}</div>`;
  if(tab==="notes"){
    app.innerHTML=head+`<div class="row"><button id="all">Listen to all notes</button><button class="alt" id="stp">Stop</button></div>
    <div class="card">${s.notes.map((n,i)=>`<div class="rule"><button class="alt" data-i="${i}" style="padding:3px 10px;margin-right:8px">Listen</button>${esc(n)}</div>`).join("")}</div>`;
    app.querySelectorAll("button[data-i]").forEach(b=>b.onclick=()=>window.say(s.notes[+b.dataset.i]));
    $("#all").onclick=()=>{try{speechSynthesis.cancel();s.notes.forEach(n=>{const u=new SpeechSynthesisUtterance(n);u.lang="en-GB";u.rate=.9;speechSynthesis.speak(u)})}catch(e){}};
    $("#stp").onclick=()=>{try{speechSynthesis.cancel()}catch(e){}};
    E.touch();
  }else if(tab==="quiz"){
    const qs=shuffle(s.mcq).map(q=>({q:q[0],o:q[1],a:q[2],e:q[3]}));
    E.runQuiz(s.name+" quiz",qs,r=>{r.wrong.forEach(w=>mistake(s.name,w.q,w.o[w.a],w.e));E.touch(2);E.save()},()=>{location.hash="#subjects/"+s.id+"/quiz";route()},"#subjects/"+s.id);
  }else{
    let cur=null;
    app.innerHTML=head+`<div class="duo"><div class="L"><div class="card"><div class="muted">Answer in English, 4 to 6 sentences:</div><div class="note" id="oq" style="font-size:1.15rem"></div>
    <div class="row"><button class="alt" id="nq">Another question</button><button class="alt" id="hq">Listen to question</button></div></div>
    <div class="card"><textarea id="oa" rows="6" placeholder="Speak or type your answer..."></textarea>
    <div class="row"><button class="mic" id="mic">Start microphone</button><button id="chk">Check my answer</button></div></div></div><div class="R"><div id="res"><div class="card muted">Key points, corrections and the model answer will appear here.</div></div></div></div>`;
    const pick=()=>{const o=s.oral[Math.floor(Math.random()*s.oral.length)];cur=o;$("#oq").textContent=o.q;$("#res").innerHTML="";$("#oa").value=""};
    pick();$("#nq").onclick=pick;$("#hq").onclick=()=>window.say(cur.q);
    $("#mic").onclick=()=>micInto($("#oa"),"en-GB",$("#mic"));
    $("#chk").onclick=async()=>{
      const text=$("#oa").value.trim();if(!text)return;E.stop();$("#res").innerHTML=`<div class="card">Checking...</div>`;
      const g=await gradeEnglish(text);
      const cov=cur.keys.map(([l,re])=>[l,new RegExp(re,"i").test(text)]);const hit=cov.filter(x=>x[1]).length;
      g.errors.forEach(x=>mistake("Oral answer",x.wrong,x.right||"",x.why));E.touch(2);E.save();
      $("#res").innerHTML=`<div class="card"><b>Key points covered: ${hit}/${cov.length}</b>
      <div>${cov.map(([l,ok])=>`<div>${ok?"&#10003;":"&#10007;"} ${esc(l)}</div>`).join("")}</div></div>
      <div class="card"><b>Grammar:</b> ${g.errors.length?`<div style="margin-top:6px">${E.diffHTML(text,g.final)}</div><div style="margin-top:6px"><b>Corrected:</b> ${esc(g.final)}</div>${g.errors.map(x=>`<div class="note err"><span class="del">${esc(x.wrong)}</span> &rarr; <span class="add">${esc(x.right||"?")}</span><div class="muted">${esc(x.why)}</div></div>`).join("")}`:"No mistakes found."}</div>
      <div class="card"><b>Model answer:</b><p>${esc(cur.model)}</p><button class="alt" id="hm">Listen</button></div>`;
      $("#hm").onclick=()=>window.say(cur.model);
    };
  }
}

/* ---------- SPOKEN INTERVIEW ---------- */
function interview(a){
  const D=window.INTERVIEWS,key=a[0];
  if(!D[key]){
    app.innerHTML=`<h1>Spoken Interview</h1>
    <p class="muted">The interviewer speaks to you. You answer aloud. After each answer you see your grammar corrections on the right, and the interviewer asks a follow-up question based on what you said.</p>
    <div class="grid">${Object.keys(D).map(k=>`<a class="tile" href="#interview/${k}"><b>${esc(D[k].name)}</b><small>${esc(D[k].desc)}</small></a>`).join("")}</div>
    <div class="card"><b>How it works</b><ol><li>Press <b>Begin</b>. The interviewer speaks the question (turn your volume up).</li><li>The microphone starts automatically. Answer in full sentences, 3 to 6 sentences.</li><li>Press <b>Space</b> (or Done) when you finish. Your answer is checked, then the next question comes.</li><li>The interviewer picks follow-up questions from your own words, like a real board. This is a script, not a real person or AI.</li><li>You can also type your answer and press Enter.</li></ol></div>`;
    return;
  }
  const iv=D[key],G=window.INTERVIEW_GENERIC;
  let ti=0,asked=0,probed=false,used=new Set(),log=[],busy=false,finished=false,speaking=false,listening=false,cur="",qn=0,began=false;
  const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
  app.innerHTML=`<p><a href="#interview">&larr; Back</a> &nbsp; <b>${esc(iv.name)}</b></p>
  <div class="duo"><div class="L">
   <div class="card"><div class="muted" id="who">Interviewer</div>
     <div id="q" style="font-size:1.35rem;min-height:4.5em">Press Begin when you are ready. Allow the microphone if the browser asks.</div>
     <div class="row"><button id="begin">Begin interview</button><button class="alt" id="rep" disabled>Repeat question</button><button class="alt" id="skp" disabled>Skip</button><button class="alt" id="end" disabled>End interview</button></div></div>
   <div class="card"><textarea id="ans" rows="6" placeholder="Your answer appears here while you speak. You can also type."></textarea>
     <div class="row"><button class="mic" id="mic" disabled>Start microphone</button><button id="done" disabled>Done answering (Space)</button></div>
     <div class="muted micmsg" id="st"></div>
     <div class="muted">Keys: <b>Space</b> = start / finish speaking &nbsp;|&nbsp; <b>Enter</b> = send typed answer</div></div>
  </div><div class="R" id="logpane"><div id="log"><div class="card muted">The conversation and your corrections will appear here.</div></div></div></div>`;
  const st=m=>{const e=$("#st");if(e)e.innerHTML=m};
  const alive=()=>!!$("#ans");
  function speakText(text,cb){
    let fired=false;const once=()=>{if(fired)return;fired=true;speaking=false;cb&&alive()&&cb()};
    speaking=true;
    try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=.95;
      const v=speechSynthesis.getVoices().find(v=>/en-GB/i.test(v.lang));if(v)u.voice=v;
      u.onend=once;u.onerror=once;speechSynthesis.speak(u);setTimeout(once,Math.max(2500,text.length*95+2000));
    }catch(e){once()}
  }
  function enable(on){["rep","skp","end","mic","done"].forEach(id=>{const b=$("#"+id);if(b)b.disabled=!on})}
  function ask(text,pre){
    if(!alive())return;cur=text;busy=false;qn++;
    $("#q").textContent=text;$("#ans").value="";st("The interviewer is speaking...");
    speakText((pre?pre+" ":"")+text,()=>startMic());
  }
  let base="";
  function startMic(){
    if(finished||!alive()||listening||busy)return;
    base=$("#ans").value?$("#ans").value.trim()+" ":"";let err="",heard=false;
    const r=E.listen(txt=>{heard=true;$("#ans").value=base+txt},(x)=>{
      if(typeof x==="string"){err=x;return}
      listening=false;const m=$("#mic");if(m){m.classList.remove("on");m.textContent="Start microphone"}
      if(!alive())return;
      if(err&&err!=="aborted"&&err!=="no-speech"){st("<b>Microphone problem ("+esc(err)+"):</b> "+esc(MICERR[err]||"Try Google Chrome.")+" You can type your answer and press Enter.");return}
      if($("#ans").value.trim()){submit()}else{st(MICERR["no-speech"])}
    },"en-GB",true);
    if(r){listening=true;const m=$("#mic");m.classList.add("on");m.textContent="Listening... (Space = done)";st("Listening... answer now.")}
    else st("Could not start the microphone. Press Space to try again, or type your answer.");
  }
  async function submit(){
    if(busy||finished)return;const text=$("#ans").value.trim();
    if(!text){st("Please say or type an answer first.");return}
    busy=true;E.stop();listening=false;enable(false);st("Checking your answer...");
    const g=await gradeEnglish(text);
    const words=text.split(/\s+/).length,same=g.final.toLowerCase()===text.replace(/\s+/g," ").trim().toLowerCase();
    g.errors.forEach(x=>mistake("Interview",x.wrong,x.right||"",x.why));
    log.push({q:cur,text,errors:g.errors,words});
    const html=`<div class="card"><div class="muted">Interviewer</div><div>${esc(cur)}</div>
      <div class="muted" style="margin-top:8px">You (${words} words)</div><div>${same?esc(text):E.diffHTML(text,g.final)}</div>
      ${same?`<div class="note ok">No grammar mistakes found.</div>`:`<div class="note err"><b>Corrected:</b> ${esc(g.final)}</div>`}
      ${g.errors.map(x=>`<div class="note err"><span class="del">${esc(x.wrong)}</span> &rarr; <span class="add">${esc(x.right||"?")}</span><div class="muted">${esc(x.why)}</div></div>`).join("")}
      ${words<20?`<div class="muted">Tip: a board expects 3 to 6 full sentences (about 30 to 80 words).</div>`:""}</div>`;
    const lg=$("#log");if(lg){if(log.length===1)lg.innerHTML="";lg.insertAdjacentHTML("afterbegin",html)}
    E.touch(2);E.save();enable(true);
    next(text,words);
  }
  function next(text,words){
    const topic=iv.topics[ti];
    if(words<8&&!probed){probed=true;busy=false;return ask("Please answer in complete sentences and explain a little more. "+topic.q,"Hmm.")}
    if(asked<2){
      let fq=null;
      for(const [re,q] of topic.follow){if(!used.has(q)&&new RegExp(re,"i").test(text)){fq=q;break}}
      if(!fq){const left=G.filter(q=>!used.has(q));if(left.length)fq=pick(left)}
      if(fq){used.add(fq);asked++;return ask(fq,pick(["Thank you.","I see.","Interesting.","Good.","Alright."]))}
    }
    ti++;asked=0;probed=false;
    if(ti>=iv.topics.length)return finish();
    ask(iv.topics[ti].q,"Thank you. Let us move on.");
  }
  function finish(){
    finished=true;E.stop();listening=false;
    const all=log.flatMap(l=>l.errors),avg=log.length?Math.round(log.reduce((s,l)=>s+l.words,0)/log.length):0;
    const cnt={};all.forEach(x=>{const k=(x.wrong||"")+" -> "+(x.right||"");cnt[k]=(cnt[k]||0)+1});
    const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const html=`<div class="card" style="border-color:var(--teal)"><b>Interview finished</b>
      <div>Questions answered: <b>${log.length}</b> &nbsp;|&nbsp; Grammar mistakes: <b>${all.length}</b> &nbsp;|&nbsp; Average answer: <b>${avg} words</b></div>
      ${top.length?`<div class="muted" style="margin-top:6px">Most common mistakes:</div>${top.map(([k,n])=>`<div>${esc(k)} <span class="muted">(${n}x)</span></div>`).join("")}`:`<div class="note ok">No repeated mistakes. Well done!</div>`}
      <div class="muted" style="margin-top:6px">All mistakes are saved in your Progress page.</div>
      <div class="row"><button onclick="location.reload()">Interview again</button></div></div>`;
    const lg=$("#log");if(lg){if(!log.length)lg.innerHTML="";lg.insertAdjacentHTML("afterbegin",html)}
    $("#q").textContent=iv.closing;st("");enable(false);speakText(iv.closing);E.touch(3);E.save();
  }
  $("#begin").onclick=()=>{if(began)return;began=true;$("#begin").disabled=true;enable(true);$("#who").textContent="Interviewer";
    $("#q").textContent=iv.opening;speakText(iv.opening,()=>ask(iv.topics[0].q))};
  $("#rep").onclick=()=>{if(finished)return;E.stop();listening=false;speakText(cur,()=>startMic())};
  $("#skp").onclick=()=>{if(finished)return;E.stop();listening=false;busy=false;ti++;asked=0;probed=false;if(ti>=iv.topics.length)finish();else ask(iv.topics[ti].q,"Let us move on.")};
  $("#end").onclick=()=>{try{speechSynthesis.cancel()}catch(e){}E.stop();listening=false;finish()};
  $("#done").onclick=()=>{listening?E.stop():submit()};
  $("#mic").onclick=()=>{listening?E.stop():startMic()};
  window.onkeydown=e=>{
    if(!$("#ans")||!began||finished)return;
    const typing=e.target.tagName==="TEXTAREA"||e.target.tagName==="INPUT";
    if(e.key===" "&&!typing){e.preventDefault();if(speaking){try{speechSynthesis.cancel()}catch(x){}return}if(listening)E.stop();else if($("#ans").value.trim())submit();else startMic();return}
    if(e.key==="Enter"&&!e.shiftKey&&e.target.id==="ans"){e.preventDefault();if(listening)E.stop();else submit()}
  };
}

function route(){window.dispatchEvent(new Event("hashchange"))}
window.ECX={translate,subjects,interview};
})();
