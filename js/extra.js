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
function micInto(el,lang,btn,onEnd){
  if(btn.dataset.on){E.stop();return}
  const base=el.value?el.value.trim()+" ":"";
  const r=E.listen((t)=>{el.value=base+t},(err)=>{delete btn.dataset.on;btn.classList.remove("on");btn.textContent="Start microphone";if(!err||typeof err!=="string")onEnd&&onEnd()},lang);
  if(r){btn.dataset.on="1";btn.classList.add("on");btn.textContent="Listening... (press to stop)"}
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
  const PAIRS=window.PAIRS;let queue=shuffle(PAIRS).slice(0,10).map(p=>({p,tries:0}));const total=queue.length,hist=[];
  let checked=false;
  function next(auto){queue.length?show(auto):finish()}
  function finish(){
    E.touch(4);E.S();
    app.innerHTML=`<h1>Round complete</h1><div class="card"><div class="big">${total}/${total}</div>All sentences correct.
    <ul>${hist.map(h=>`<li>${esc(mode==="u2e"?h.p[1].split("|")[0]:h.p[0])} <span class="muted">(${h.tries===0?"first time":h.tries+" retry"+(h.tries>1?"ies":"")})</span></li>`).join("")}</ul></div>
    <div class="row"><button onclick="location.reload()">New round</button><a href="#translate" class="btn alt" style="text-decoration:none;padding:9px 16px;border:1px solid var(--teal);border-radius:8px;color:var(--teal)">Back</a></div>`;
    E.save();
  }
  function show(auto){
    checked=false;const it=queue[0],p=it.p,u2e=mode==="u2e";
    app.innerHTML=`<p><a href="#translate">&larr; Back</a> &nbsp; <span class="muted">Remaining: ${queue.length} of ${total}${it.tries?` &nbsp;|&nbsp; retry ${it.tries}`:""}</span></p>
    <div class="bar"><i style="width:${(total-queue.length)/total*100}%"></i></div>
    <div class="card"><div class="muted">${u2e?"Say this in English:":"Say this in Urdu:"}</div>
    ${u2e?`<div style="font-size:1.6rem;direction:rtl;text-align:right;line-height:2">${esc(p[0])}</div><button class="alt" id="hear">Listen (Urdu)</button>`
         :`<div style="font-size:1.4rem">${esc(p[1].split("|")[0])}</div><button class="alt" id="hear">Listen (English)</button>`}</div>
    <div id="act" class="row" style="margin:4px 0 8px"></div>
    <div class="card"><textarea id="ans" rows="3" ${u2e?"":'dir="rtl" style="font-size:1.3rem"'} placeholder="${u2e?"Speak or type your English sentence...":"Speak or type your Urdu sentence..."}"></textarea>
    <div class="row"><button class="mic" id="mic">Start microphone</button><button id="chk">Check</button><button class="alt" id="skip">Show answer</button></div>
    <div class="muted">Keys: <b>Space</b> = start / stop microphone (answer is checked when you stop) &nbsp;|&nbsp; <b>Enter</b> = check or next &nbsp;|&nbsp; you can also edit the text and press Check again.</div></div><div id="res"></div>`;
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
      $("#later").onclick=()=>{it.tries++;queue.push(queue.shift());next(true)};
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
    app.innerHTML=head+`<div class="card"><div class="muted">Answer in English, 4 to 6 sentences:</div><div class="note" id="oq" style="font-size:1.15rem"></div>
    <div class="row"><button class="alt" id="nq">Another question</button><button class="alt" id="hq">Listen to question</button></div></div>
    <div class="card"><textarea id="oa" rows="6" placeholder="Speak or type your answer..."></textarea>
    <div class="row"><button class="mic" id="mic">Start microphone</button><button id="chk">Check my answer</button></div></div><div id="res"></div>`;
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
function route(){window.dispatchEvent(new Event("hashchange"))}
window.ECX={translate,subjects};
})();
