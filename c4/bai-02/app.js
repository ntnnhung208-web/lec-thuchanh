/* E4B Chặng 2–4 · trang luyện tập 1 bài: Ôn bài · Luyện nghe · Luyện nói · Kiểm tra · Trò chơi. Cần window.LESSON. */
(function(){
const D=window.LESSON,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const st={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=(a,n)=>shuf(a).slice(0,n);
const P='e4b-c'+D.stage+'-'+D.code+'-';
const plain=t=>String(t).replace(/[{}]/g,'');
const hi=t=>esc(t).replace(/\{([^}]*)\}/g,'<em>$1</em>');
const PLAY='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>';
const PAUSE='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor"/></svg>';
const SPK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
let voice=st.get('e4b-cx-voice','f');
const au=new Audio();au.preload='auto';
function src(t,v){const k=D.audio[plain(t)]||D.audio[plain(t).replace(/ – /g,' ')];return k?'a/'+k+'_'+(v||voice)+'.mp3':null}
function say(t,v){const s=src(t,v);if(!s)return Promise.resolve();au.pause();au.src=s;au.currentTime=0;
  return new Promise(r=>{au.onended=r;au.onerror=r;au.play().catch(r)})}
function tone(ok){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=tone.c||(tone.c=new C());const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);
  const t=c.currentTime;o.frequency.setValueAtTime(ok?660:220,t);if(ok)o.frequency.setValueAtTime(880,t+.09);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.15,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.28);o.start(t);o.stop(t+.3)}catch(e){}}

/* ---------- Ôn bài ---------- */
function renderReview(){
  const row=(en,vi)=>`<div class="row"><button class="play" data-say="${esc(plain(en))}" aria-label="Nghe">${PLAY}</button><div class="tx"><div class="en">${hi(en)}</div><div class="vi">${esc(vi)}</div></div></div>`;
  let h=`<div class="card"><h3>Từ vựng · từ → cụm từ → câu</h3><div class="rows">${D.vocab.map(([w,ipa,m],i)=>{const L=D.ladder[i];return `<div class="lad"><button class="lw" data-say="${esc(w)}"><span class="play">${PLAY}</span><b>${esc(w)}</b><span class="ipa">${esc(ipa)}</span><span class="m">${esc(m)}</span></button>
   <div class="row"><button class="play" data-say="${esc(L[1])}" aria-label="Nghe">${PLAY}</button><div class="tx"><div class="en">${esc(L[1])}</div><div class="vi">${esc(L[0])}</div></div></div>
   <div class="row"><button class="play" data-say="${esc(plain(L[3]))}" aria-label="Nghe">${PLAY}</button><div class="tx"><div class="en">${hi(L[3])}</div><div class="vi">${esc(L[2])}</div></div></div></div>`}).join('')}</div></div>`;
  h+=`<div class="card"><h3>Cụm từ hay dùng</h3><div class="rows">${D.phrases.map(p=>row(p[0],p[1])).join('')}</div></div>`;
  D.structs.forEach(s=>{h+=`<div class="card"><h3>${esc(s.name)}</h3><div class="pat">${esc(s.pat)}<small>${esc(s.vn)}</small></div><div class="rows">${s.ex.map(e=>row(e[1],e[0])).join('')}</div></div>`});
  h+=`<div class="card"><h3>Ghi nhớ</h3><div class="gram">${D.grammar.rows.map(r=>`<b>${esc(r[0])}</b><span>${esc(r[1])}</span>`).join('')}</div>${D.errors.map(e=>`<div class="err"><div><s>✘ ${esc(e[0])}</s></div><div><b>✔ ${esc(e[1])}</b></div><span>${esc(e[2])}</span></div>`).join('')}</div>`;
  h+=`<div class="card"><h3>Nói dài hơn · nghe rồi nói theo</h3><div class="rows">${D.ext.lines.map(l=>`<div class="row"><button class="play" data-say="${esc(l)}" aria-label="Nghe">${PLAY}</button><div class="tx"><div class="en">${esc(l)}</div></div></div>`).join('')}</div>
   <div class="pat">Đến lượt bạn: nói về bạn theo khung<small>${D.ext.frame.map(esc).join('<br>')}</small></div></div>`;
  h+=`<div class="cta"><button class="btn" data-go="luyen-nghe">Sang Luyện nghe ›</button></div>`;
  $('#pOn').innerHTML=h;
}

/* ---------- Luyện nghe ---------- */
const dl=new Audio('a/dialog.mp3');dl.preload='auto';
const fmt=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
let roleRun=0;
function renderListen(){
  const speeds=[0.5,0.75,1,1.25,1.5,2];let sp=st.get('e4b-cx-speed',1);
  const KW=D.kw?`<div class="card" id="kwc"><h3>Nghe lần 1 · Bắt 3 ${D.lm==='dt'?'chi tiết':'từ khóa'}</h3><p class="sub" style="font-size:15px">Đọc 3 câu hỏi trước. Bật hội thoại ở chế độ <b>Chỉ nghe</b>, ${D.lm==='dt'?'tập trung bắt đúng chi tiết (số, màu, địa điểm)':'chỉ cần bắt từ khóa'} rồi chọn đáp án.</p>
    <div class="acts" style="justify-content:flex-start"><button class="btn" id="kwp">Nghe hội thoại (chỉ nghe)</button></div>
    ${D.kw.map(([qq,o],i)=>`<div class="kwq" data-q="${i}"><b>${esc(qq)}</b><div class="opts">${shuf(o.map((x,j)=>[x,j])).map(([x,j])=>`<button data-j="${j}">${esc(x)}</button>`).join('')}</div></div>`).join('')}<div id="kwr"></div></div>`:'';
  $('#pNg').innerHTML=KW+`<div class="card player" id="pl"><h3 style="align-self:flex-start">Nghe hội thoại</h3>
    <button id="pb" aria-label="Phát">${PLAY}</button>
    <div class="seek"><span id="tc">0:00</span><input id="sk" type="range" min="0" max="1000" value="0" aria-label="Tua"><span id="td">0:00</span></div>
    <div class="speed">${speeds.map(x=>`<button data-sp="${x}" class="${x===sp?'on':''}">${x}x</button>`).join('')}</div>
    <div class="seg" role="group" aria-label="Hiện chữ"><button data-tx="1" aria-pressed="true">Có văn bản</button><button data-tx="0" aria-pressed="false">Chỉ nghe</button></div>
    <div class="lines">${D.dialog.map((d,i)=>`<button data-l="${i}"><span class="who ${d[0]==='B'?'b':''}">${d[0]}</span><span><span class="en">${esc(d[1])}</span><span class="vi">${esc(d[2])}</span></span></button>`).join('')}</div>
    <p class="sub" style="font-size:14px">Bấm vào một câu để nghe lại từ câu đó. Luyện đủ 5 bước: xem script → nghe đọc theo → nghe nói theo → shadowing → nghe chép.</p></div>
   <div class="card role" id="rl"><h3 style="align-self:flex-start">Đóng vai</h3><p class="sub">Chọn vai của bạn. Máy đọc vai còn lại, đến lượt bạn thì nói to câu của mình rồi nghe câu mẫu.</p>
    <div class="acts"><button class="btn" data-role="B">Tôi là B</button><button class="btn alt" data-role="A">Tôi là A</button></div><div id="rbox" style="width:100%"></div></div>`;
  dl.playbackRate=sp;
  const pb=$('#pb'),sk=$('#sk');
  const sync=()=>{pb.innerHTML=dl.paused?PLAY:PAUSE;$('#tc').textContent=fmt(dl.currentTime);$('#td').textContent=fmt(dl.duration);
    if(dl.duration)sk.value=dl.currentTime/dl.duration*1000;
    const t=dl.currentTime;$$('.lines button').forEach((b,i)=>{const T=D.times[i];b.classList.toggle('on',!dl.paused&&t>=T[0]&&t<T[1]+0.3)})};
  ['timeupdate','play','pause','loadedmetadata','ended'].forEach(e=>dl.addEventListener(e,sync));
  pb.onclick=()=>{au.pause();dl.paused?dl.play().catch(()=>{}):dl.pause()};
  sk.oninput=()=>{if(dl.duration)dl.currentTime=sk.value/1000*dl.duration};
  $$('.speed button').forEach(b=>b.onclick=()=>{sp=+b.dataset.sp;dl.playbackRate=sp;st.set('e4b-cx-speed',sp);$$('.speed button').forEach(x=>x.classList.toggle('on',x===b))});
  $$('#pl .seg button').forEach(b=>b.onclick=()=>{$('#pl').classList.toggle('hidetx',b.dataset.tx==='0');$$('#pl .seg button').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  $$('.lines button').forEach(b=>b.onclick=()=>{dl.currentTime=D.times[+b.dataset.l][0];dl.play().catch(()=>{})});
  $$('[data-role]').forEach(b=>b.onclick=()=>role(b.dataset.role));
  if(D.kw){let done=0,ok=0;
    $('#kwp').onclick=()=>{$('#pl').classList.add('hidetx');$$('#pl .seg button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.tx==='0'));au.pause();dl.currentTime=0;dl.play().catch(()=>{})};
    $$('.kwq').forEach(box=>box.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(box.dataset.done)return;box.dataset.done=1;const j=+b.dataset.j;
      box.querySelectorAll('button').forEach(x=>{x.disabled=true;if(x.dataset.j==='0')x.classList.add('ok')});if(j!==0)b.classList.add('no');else ok++;tone(j===0);
      if(++done===D.kw.length)$('#kwr').innerHTML=`<div class="fb ${ok===done?'ok':'no'}"><b>Bạn bắt đúng ${ok}/${done} ${D.lm==='dt'?'chi tiết':'từ khóa'}.</b>${ok===done?'Giỏi lắm! Giờ luyện tiếp 5 bước với hội thoại bên dưới.':'Nghe lại một lần nữa, rồi luyện tiếp 5 bước bên dưới.'}</div>`}))}
  sync();
}
async function role(me){
  const run=++roleRun;dl.pause();const box=$('#rbox');
  for(let i=0;i<D.dialog.length;i++){
    if(run!==roleRun)return;const [w,en,vi]=D.dialog[i];const v=w==='A'?'f':'m';
    if(w!==me){box.innerHTML=`<div class="say" style="background:var(--lav)"><span class="who ${w==='B'?'b':''}">${w}</span> ${esc(en)}</div>`;await say(en,v);await new Promise(r=>setTimeout(r,350))}
    else{box.innerHTML=`<div class="say">Đến lượt bạn nói:<small>${esc(vi)}</small></div><div class="acts" style="margin-top:10px"><button class="btn" id="rv">Nói xong · Nghe mẫu</button></div>`;
      await new Promise(r=>$('#rv').onclick=r);if(run!==roleRun)return;
      box.innerHTML=`<div class="say">${esc(en)}<small>${esc(vi)}</small></div>`;await say(en,v);await new Promise(r=>setTimeout(r,500))}
  }
  if(run===roleRun)box.innerHTML=`<div class="say" style="background:var(--okbg)">Hoàn thành! Đổi vai và luyện thêm một lượt nhé.</div>`;
}

/* ---------- Luyện nói ---------- */
let spRun=0;
function renderSpeak(){
  $('#pNo').innerHTML=`<div class="card"><h3>Luyện nói · 4 cách luyện</h3><p class="sub" style="font-size:15px">Ở level này, hiểu thôi chưa đủ — bạn cần <b>nói ra được thật nhanh</b>. Chọn một cách luyện dưới đây.</p>
   <div class="games">
    <button class="gcard" data-sp="fl"><b>Phản xạ Việt → Anh</b><span>Đọc câu tiếng Việt, nói to câu tiếng Anh trong đầu ra miệng, rồi lật thẻ kiểm tra.</span><em>${D.flash.length} thẻ</em></button>
    <button class="gcard" data-sp="sh"><b>Shadowing</b><span>Nghe từng câu, máy dừng để bạn nhại lại đúng nhịp, đúng ngữ điệu.</span><em>${D.shadow.length} câu</em></button>
    <button class="gcard" data-sp="rc"><b>Ghi âm &amp; so sánh</b><span>Tự ghi âm giọng mình, nghe lại cạnh giọng mẫu để sửa phát âm.</span><em>Dùng micro</em></button>
    <button class="gcard" data-sp="pr"><b>Nói theo đề</b><span>Nhận một tình huống thật, bấm giờ và nói liền một mạch, rồi so với bài mẫu.</span><em>${D.prompts.length} đề</em></button>
   </div></div><div id="spb"></div>`;
  $$('[data-sp]').forEach(b=>b.onclick=()=>{spRun++;au.pause();$$('[data-sp]').forEach(x=>x.classList.toggle('sel',x===b));({fl:flash,sh:shadow,rc:rec,pr:prompt})[b.dataset.sp]();$('#spb').scrollIntoView({behavior:'smooth',block:'start'})});
}
function flash(){
  let deck=shuf(D.flash.map((_,i)=>i)),known=0,tot=D.flash.length;
  const draw=()=>{if(!deck.length){$('#spb').innerHTML=`<div class="res"><div class="sc">${tot}<small>/${tot}</small></div><p>Bạn đã nói được hết ${tot} câu! Làm lại để phản xạ nhanh hơn nữa.</p><div class="acts"><button class="btn" id="fa">Làm lại</button></div></div>`;$('#fa').onclick=flash;tone(true);return}
    const f=D.flash[deck[0]];
    $('#spb').innerHTML=`<div class="card"><div class="ghead"><span>Thẻ còn lại: <b>${deck.length}</b></span><b>Đã thuộc ${known}/${tot}</b></div>
     <div class="fc" id="fc"><span class="fv">${esc(f[0])}</span><span class="fe" hidden>${esc(f[1])}</span></div>
     <div class="acts" id="fact"><button class="btn" id="ff">Lật thẻ · nghe đáp án</button></div></div>`;
    $('#ff').onclick=()=>{$('#fc .fe').hidden=false;say(f[1]);$('#fact').innerHTML=`<button class="btn" id="fk">Mình nói đúng ✓</button><button class="btn alt" id="fn">Chưa đúng – ôn lại</button><button class="btn alt" data-say="${esc(f[1])}">Nghe lại</button>`;
      $('#fk').onclick=()=>{deck.shift();known++;tone(true);draw()};
      $('#fn').onclick=()=>{const k=deck.shift();deck.splice(Math.min(deck.length,2),0,k);tone(false);draw()}}};
  draw();
}
async function shadow(){
  const run=spRun;let slow=st.get('e4b-cx-shslow',false);
  $('#spb').innerHTML=`<div class="card"><h3>Shadowing</h3><p class="sub">Nghe một câu → máy dừng → bạn nói lại y hệt, cùng tốc độ và ngữ điệu. Bấm vào một câu để bắt đầu từ câu đó.</p>
   <div class="seg" role="group" aria-label="Tốc độ"><button data-sl="1" aria-pressed="${slow}">Chậm</button><button data-sl="0" aria-pressed="${!slow}">Bình thường</button></div>
   <div class="acts"><button class="btn" id="shs">Bắt đầu</button><button class="btn alt" id="shx">Dừng</button></div>
   <div class="lines" id="shl">${D.shadow.map((t,i)=>`<button data-k="${i}"><span class="en">${esc(t)}</span></button>`).join('')}</div></div>`;
  $$('[data-sl]').forEach(b=>b.onclick=()=>{slow=b.dataset.sl==='1';st.set('e4b-cx-shslow',slow);$$('[data-sl]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  const go=async from=>{const r=++spRun;for(let i=from;i<D.shadow.length;i++){if(r!==spRun)return;
      $$('#shl button').forEach((b,j)=>{b.classList.toggle('on',j===i);b.classList.remove('me')});
      au.defaultPlaybackRate=slow?0.8:1;const t0=Date.now();await say(D.shadow[i],i<D.dialog.length&&D.dialog[i][0]==='B'?'m':'f');au.defaultPlaybackRate=1;
      if(r!==spRun)return;const dur=(Date.now()-t0)/1000;$$('#shl button')[i].classList.add('me');
      await new Promise(z=>setTimeout(z,(dur*1.25+0.7)*1000))}
    if(r===spRun){$$('#shl button').forEach(b=>b.classList.remove('on','me'));tone(true)}};
  $('#shs').onclick=()=>go(0);$('#shx').onclick=()=>{spRun++;au.pause();$$('#shl button').forEach(b=>b.classList.remove('on','me'))};
  $$('#shl button').forEach(b=>b.onclick=()=>go(+b.dataset.k));
}
let mrec=null,mstream=null;
function rec(){
  const ok=!!(navigator.mediaDevices&&window.MediaRecorder);let i=0;const urls={};
  const draw=()=>{const t=D.shadow[i];
    $('#spb').innerHTML=`<div class="card"><div class="ghead"><span>Câu ${i+1} / ${D.shadow.length}</span><b></b></div>
     <div class="fc"><span class="fe">${esc(t)}</span></div>
     <div class="acts"><button class="btn alt" data-say="${esc(t)}">Nghe mẫu</button><button class="btn" id="rb">${ok?'● Ghi âm':'Trình duyệt chưa hỗ trợ ghi âm'}</button><button class="btn alt" id="rp" ${urls[i]?'':'disabled'}>Nghe giọng mình</button></div>
     <p class="sub" id="rm" style="font-size:14px">${ok?'Bấm Ghi âm, đọc câu, rồi bấm Dừng. Nghe giọng mẫu và giọng mình để so sánh.':'Bạn vẫn có thể nghe mẫu và đọc to theo.'}</p>
     <div class="acts"><button class="btn alt" id="rpv" ${i?'':'disabled'}>‹ Câu trước</button><button class="btn alt" id="rnx" ${i<D.shadow.length-1?'':'disabled'}>Câu sau ›</button></div></div>`;
    $('#rpv').onclick=()=>{i--;draw()};$('#rnx').onclick=()=>{i++;draw()};
    $('#rp').onclick=()=>{if(urls[i]){au.pause();au.src=urls[i];au.play().catch(()=>{})}};
    if(!ok){$('#rb').disabled=true;return}
    $('#rb').onclick=async()=>{
      if(mrec&&mrec.state==='recording'){mrec.stop();return}
      try{mstream=await navigator.mediaDevices.getUserMedia({audio:true})}catch(e){$('#rm').textContent='Không mở được micro. Hãy cho phép trang dùng micro, hoặc nghe mẫu và đọc to theo.';return}
      const ch=[];mrec=new MediaRecorder(mstream);mrec.ondataavailable=e=>ch.push(e.data);
      mrec.onstop=()=>{mstream.getTracks().forEach(t=>t.stop());urls[i]=URL.createObjectURL(new Blob(ch,{type:mrec.mimeType||'audio/webm'}));draw();$('#rp').click()};
      mrec.start();$('#rb').textContent='■ Dừng';$('#rm').textContent='Đang ghi âm… đọc câu rồi bấm Dừng.'}};
  draw();
}
let pTimer=null;
function prompt(){
  let k=0,secs=st.get('e4b-cx-psec',60);
  const draw=()=>{clearInterval(pTimer);const p=D.prompts[k];
    $('#spb').innerHTML=`<div class="card"><div class="ghead"><span>Đề ${k+1} / ${D.prompts.length}</span><b id="ptm">${secs}s</b></div>
     <div class="fc"><span class="fv">${esc(p.q)}</span></div>
     <p class="sub" style="font-size:14px">Nhớ dùng:</p><div class="chips" id="pch">${p.need.map((x,j)=>`<button data-j="${j}">${esc(x)}</button>`).join('')}</div>
     <div class="speed">${[45,60,90].map(x=>`<button data-ps="${x}" class="${x===secs?'on':''}">${x}s</button>`).join('')}</div>
     <div class="acts"><button class="btn" id="pgo">Bắt đầu nói</button><button class="btn alt" id="pm">Xem bài mẫu</button></div><div id="pmd"></div>
     <div class="acts">${D.prompts.length>1?`<button class="btn alt" id="pnx">Đề khác ›</button>`:''}</div></div>`;
    $$('[data-ps]').forEach(b=>b.onclick=()=>{secs=+b.dataset.ps;st.set('e4b-cx-psec',secs);draw()});
    $$('#pch button').forEach(b=>b.onclick=()=>b.classList.toggle('sel'));
    $('#pgo').onclick=()=>{clearInterval(pTimer);let left=secs;$('#ptm').textContent=left+'s';$('#pgo').textContent='Đang nói…';
      pTimer=setInterval(()=>{left--;$('#ptm').textContent=left+'s';if(left<=0){clearInterval(pTimer);tone(true);$('#pgo').textContent='Hết giờ! Nói lại';$('#pmd').innerHTML='<div class="fb ok"><b>Hết giờ!</b>Đánh dấu những cụm bạn đã dùng ở trên, rồi xem bài mẫu.</div>'}},1000)};
    $('#pm').onclick=()=>{$('#pmd').innerHTML=`<div class="say">${esc(p.m)}</div><div class="acts" style="margin-top:8px"><button class="btn alt" data-say="${esc(p.m)}">Nghe bài mẫu</button></div>`;say(p.m)};
    if($('#pnx'))$('#pnx').onclick=()=>{k=(k+1)%D.prompts.length;draw()}};
  draw();
}

/* ---------- Kiểm tra ---------- */
function buildQs(){
  const qs=[];
  D.quiz.forEach(q=>{
    if(q.t==='fix')qs.push({t:'c',kind:'Chọn câu đúng',q:q.q,o:q.o,a:0,e:q.e});
    else if(q.t==='gap')qs.push({t:'c',kind:'Điền vào chỗ trống',q:esc(q.q).replace('___','<b>_____</b>'),o:q.o,a:0,e:q.e,raw:q.q});
    else if(q.t==='order')qs.push({t:'o',kind:'Sắp xếp thành câu đúng',s:q.s});
    else if(q.t==='dict')qs.push({t:'w',kind:'Nghe và gõ lại câu',s:q.s});
    else if(q.t==='resp')qs.push({t:'r',kind:'Nghe và chọn câu đáp phù hợp',s:q.p,o:q.o,a:0,e:q.e});
    else if(q.t==='tr')qs.push({t:'x',kind:'Dịch sang tiếng Anh',q:'“'+esc(q.q)+'”',acc:q.a,s:q.a[0],raw:q.q});
  });
  pick(D.vocab,4).forEach((v,i)=>{const d=pick(D.vocab.filter(x=>x!==v),2);
    if(i%2)qs.push({t:'l',kind:'Nghe và chọn nghĩa',s:v[0],o:[v[2],...d.map(x=>x[2])],a:0,e:v[0]+' = '+v[2]});
    else qs.push({t:'c',kind:'Chọn từ tiếng Anh',q:'"'+esc(v[2])+'" tiếng Anh là:',o:[v[0],...d.map(x=>x[0])],a:0,e:v[2]+' = '+v[0]})});
  return shuf(qs);
}
function normT(s){s=s.toLowerCase().replace(/[’`]/g,"'");const C={"i'm":"i am","it's":"it is","he's":"he is","she's":"she is","what's":"what is","that's":"that is","you're":"you are","i'll":"i will","we'll":"we will","i'd":"i would","i've":"i have","we're":"we are","let's":"let us","can't":"cannot","don't":"do not","there's":"there is","where's":"where is","we've":"we have"};
  s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  return s.replace(/[a-z]+'[a-z]+/g,m=>C[m]||m).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
let Q=[],qi=0,score=0,answered=false,log=[],combo=0,retry=false;
function startTest(qs){retry=!!qs;Q=qs||buildQs();qi=0;score=0;log=[];combo=0;showQ()}
function showQ(){
  answered=false;const q=Q[qi],box=$('#pKt');let body='',ans='';
  if(q.t==='c'||q.t==='x')body=`<p class="qq">${q.q}</p>`;
  else body=`<button class="big" data-say="${esc(q.s)}" aria-label="Nghe lại">${SPK}</button>`;
  if(q.t==='o')body=`<p class="qq" style="text-align:center;color:var(--mu);font-size:16px">Nghe rồi bấm các từ theo đúng thứ tự</p>`+body;
  if(q.t==='w'||q.t==='x')ans=`<form class="typ" id="tf"><input id="ti" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${q.t==='x'?'Gõ câu tiếng Anh…':'Gõ câu bạn nghe được…'}"><button class="btn" type="submit">Kiểm tra</button></form>`;
  else if(q.t==='o'){q.w=q.w||shuf(q.s.split(' '));ans=`<div class="slots" id="sl"></div><div class="chips" id="ch">${q.w.map((w,i)=>`<button data-k="${i}">${esc(w)}</button>`).join('')}</div><div class="cta"><button class="btn" id="oc" disabled>Kiểm tra</button></div>`}
  else{const order=shuf(q.o.map((_,i)=>i));ans=`<div class="opts">${order.map(i=>`<button data-i="${i}">${esc(q.o[i])}</button>`).join('')}</div>`}
  box.innerHTML=`<div class="qhead"><div class="bar"><i style="width:${qi/Q.length*100}%"></i></div><span class="qn">${qi+1} / ${Q.length}</span></div>
   <div class="tally"><span class="t-ok">✓ Đúng ${score}</span><span class="t-no">✗ Sai ${qi-score}</span>${combo>=2?`<span class="t-combo">Chuỗi đúng ×${combo}</span>`:''}${retry?'<span class="t-rt">Làm lại câu sai</span>':''}</div>
   <div class="qbox"><span class="qk">${q.kind}</span>${body}${ans}<div id="fb"></div></div>`;
  if(q.t!=='c'&&q.t!=='x')setTimeout(()=>say(q.s),250);
  if(q.t==='w'||q.t==='x'){$('#tf').onsubmit=e=>{e.preventDefault();const v=$('#ti').value;if(!v.trim())return;judge(q.t==='x'?q.acc.some(a=>normT(a)===normT(v)):normT(v)===normT(q.s),q,v)};setTimeout(()=>$('#ti').focus({preventScroll:true}),50)}
  else if(q.t==='o'){const picked=[];const draw=()=>{$('#sl').innerHTML=picked.map((k,j)=>`<button data-j="${j}">${esc(q.w[k])}</button>`).join('');
      $$('#ch button').forEach(b=>b.disabled=picked.includes(+b.dataset.k));$('#oc').disabled=picked.length!==q.w.length;
      $$('#sl button').forEach(b=>b.onclick=()=>{if(answered)return;picked.splice(+b.dataset.j,1);draw()})};
    $$('#ch button').forEach(b=>b.onclick=()=>{if(answered)return;picked.push(+b.dataset.k);draw()});
    $('#oc').onclick=()=>{const g=picked.map(k=>q.w[k]).join(' ');$('#oc').disabled=true;judge(g===q.s,q,g)};}
  else box.querySelectorAll('.opts button').forEach(b=>b.onclick=()=>{if(answered)return;const i=+b.dataset.i;
    box.querySelectorAll('.opts button').forEach(x=>{x.disabled=true;if(+x.dataset.i===q.a)x.classList.add('ok')});if(i!==q.a)b.classList.add('no');judge(i===q.a,q,q.o[i])});
}
const PRAISE=['Chính xác!','Tuyệt vời!','Quá chuẩn!','Giỏi lắm!','Đúng rồi!'];
function judge(ok,q,given){
  if(answered)return;answered=true;if(ok){score++;combo++}else combo=0;tone(ok);log.push({q,ok,given});
  const inp=$('#ti');if(inp){inp.disabled=true;$('#tf button').disabled=true}
  const right=(q.t==='w'||q.t==='o'||q.t==='x')?q.s:'';
  $('#fb').innerHTML=`<div class="fb ${ok?'ok':'no'}"><b>${ok?(combo>=3?'Chuỗi '+combo+' câu đúng liên tiếp!':PRAISE[qi%PRAISE.length]):'Chưa đúng — không sao, ghi nhớ nhé:'}</b>${right&&!ok?'Đáp án: <b style="display:inline;color:inherit">'+esc(right)+'</b>. ':''}${q.e?esc(q.e):''}</div>
   <div class="cta" style="margin-top:12px"><button class="btn" id="nx">${qi+1<Q.length?'Câu tiếp ›':'Xem kết quả ›'}</button></div>`;
  if(right&&ok)say(q.s);
  if(q.t==='r')say(q.o[q.a],'m');
  $('#nx').onclick=()=>{qi++;qi<Q.length?showQ():result()};$('#nx').focus({preventScroll:true});
}
const strip=h=>String(h).replace(/<[^>]+>/g,'');
function qLabel(q){return q.t==='c'?(q.raw||strip(q.q)):q.t==='x'?'Dịch: “'+q.raw+'”':q.t==='l'?'Nghe: “'+q.s+'”':q.t==='r'?'Đáp lại: “'+q.s+'”':q.t==='o'?'Sắp xếp câu':'Nghe và gõ lại câu'}
function qRight(q){return (q.t==='w'||q.t==='o'||q.t==='x')?q.s:q.o[q.a]}
function result(){
  const tot=Q.length,pct=Math.round(score/tot*100),pts=Math.round(score/tot*100)/10,stars=pct>=90?3:pct>=75?2:pct>=60?1:0,pass=pct>=60;
  const prev=st.get(P+'best',null);let newBest=false;
  if(!retry&&(!prev||pct>prev.pct)){st.set(P+'best',{pct,stars});newBest=!!prev}
  const wrong=log.filter(x=>!x.ok).map(x=>x.q);
  const msg=retry?(wrong.length?'Còn '+wrong.length+' câu chưa đúng. Làm thêm lượt nữa là thuộc!':'Đã sửa hết các câu sai. Giờ làm lại cả bài để lấy điểm cao hơn nhé!')
   :pct===100?'Điểm tuyệt đối! Chơi 3 trò chơi để nhớ lâu hơn nhé!':pct>=90?'Xuất sắc! Chỉ còn chút xíu nữa là 10 điểm.':pct>=75?'Rất tốt! Sửa nốt câu sai để lấy 3 sao nhé.':pct>=60?'Đạt rồi! Làm lại câu sai để lên sao nhé.':'Cần 6 điểm để qua bài. Xem lại Ôn bài rồi thử lại — lần sau chắc chắn khá hơn!';
  $('#pKt').innerHTML=`<div class="res">
   ${retry?'':`<span class="badge ${pass?'pass':'fail'}">${pass?'ĐẠT':'CHƯA ĐẠT'}</span>`}
   <div class="sc">${retry?score+'/'+tot:pts.toString().replace('.',',')+'<small>/10</small>'}</div>
   ${retry?'':`<div class="stars">${[1,2,3].map(n=>`<i class="${n<=stars?'on':''}">★</i>`).join('')}</div>`}
   <p>${msg}${newBest?'<br><b class="nb">Kỷ lục mới của bạn!</b>':''}${!retry&&prev&&!newBest?'<br>Điểm cao nhất của bạn: '+(prev.pct/10).toString().replace('.',',')+'/10':''}</p>
   <div class="acts">${wrong.length?`<button class="btn" id="fixw">Làm lại ${wrong.length} câu sai</button>`:''}<button class="btn alt" id="again">Làm lại cả bài</button>
   ${pass||retry?`<button class="btn${wrong.length?' alt':''}" data-go="tro-choi">Chơi trò chơi ›</button>`:''}</div></div>
   <div class="card"><h3>Chấm bài · ${score} đúng, ${tot-score} sai</h3><ol class="mark">${log.map(x=>`<li class="${x.ok?'ok':'no'}"><span class="mk">${x.ok?'✓':'✗'}</span><span class="tx"><span class="ql">${esc(qLabel(x.q))}</span>${x.ok?`<span class="an">${esc(qRight(x.q))}</span>`:`<span class="an">${(x.q.t==='w'||x.q.t==='x')?'Bạn gõ':'Bạn chọn'}: <s>${esc(strip(x.given||'—'))}</s> → Đáp án: <b>${esc(qRight(x.q))}</b></span>`}</span></li>`).join('')}</ol></div>`;
  $('#again').onclick=()=>{startTest();window.scrollTo({top:0})};
  if(wrong.length)$('#fixw').onclick=()=>{startTest(shuf(wrong).map(q=>({...q,w:null})));window.scrollTo({top:0})};
  window.scrollTo({top:0});
}

/* ---------- Trò chơi ---------- */
let gTimer=null;
const GAMES=[['match','Ghép cặp siêu tốc','Ghép 6 từ tiếng Anh với nghĩa đúng nhanh nhất có thể.'],['tf','Đúng hay sai?','45 giây: cụm từ và nghĩa này có khớp không? Bấm thật nhanh!'],['dlg','Xếp lại hội thoại','Bấm các câu theo đúng thứ tự của đoạn hội thoại.'],['hv','Ghép nửa câu','Ghép nửa đầu với nửa sau để thành câu đúng mẫu của bài.']];
function gameMenu(){clearInterval(gTimer);
  $('#pTc').innerHTML=`<div class="games">${GAMES.map(g=>{const b=st.get(P+'g-'+g[0],null);return `<button class="gcard" data-g="${g[0]}"><b>${g[1]}</b><span>${g[2]}</span><em>${b==null?'Chưa chơi':'Kỷ lục: '+(g[0]==='tf'?b+' điểm':b+' giây')}</em></button>`}).join('')}</div>`;
  $$('#pTc .gcard').forEach(b=>b.onclick=()=>({match,tf,dlg,hv})[b.dataset.g]());
}
function gameEnd(id,val,better,line){
  clearInterval(gTimer);const prev=st.get(P+'g-'+id,null);const rec=prev==null||better(val,prev);if(rec)st.set(P+'g-'+id,val);
  $('#pTc').innerHTML=`<div class="res"><div class="sc">${val}<small>${id==='tf'?' điểm':' giây'}</small></div><p>${line}${rec&&prev!=null?'<br><b class="nb">Kỷ lục mới!</b>':''}${!rec?'<br>Kỷ lục của bạn: '+prev+(id==='tf'?' điểm':' giây'):''}</p>
   <div class="acts"><button class="btn" id="ga">Chơi lại</button><button class="btn alt" id="gm">Trò khác</button></div></div>`;
  $('#ga').onclick=()=>({match,tf,dlg,hv})[id]();$('#gm').onclick=gameMenu;tone(true);
}
function match(){
  const items=pick(D.vocab,6),t0=Date.now();let sel=null,left=6,miss=0;
  const cards=shuf([...items.map((v,i)=>({k:i,t:v[0],en:1})),...items.map((v,i)=>({k:i,t:v[2],en:0}))]);
  $('#pTc').innerHTML=`<div class="ghead"><span>Ghép cặp siêu tốc</span><b id="gt">0s</b></div><div class="mgrid">${cards.map((c,i)=>`<button data-i="${i}" class="${c.en?'en':''}">${esc(c.t)}</button>`).join('')}</div>`;
  gTimer=setInterval(()=>{$('#gt').textContent=Math.floor((Date.now()-t0)/1000)+'s'},250);
  $$('.mgrid button').forEach(b=>b.onclick=()=>{const c=cards[+b.dataset.i];if(c.en)say(c.t);
    if(!sel||sel===b){$$('.mgrid button').forEach(x=>x.classList.remove('sel','no'));sel=sel===b?null:b;if(sel)b.classList.add('sel');return}
    const s=cards[+sel.dataset.i];
    if(s.k===c.k&&s.en!==c.en){sel.classList.add('done');b.classList.add('done');sel=null;tone(true);if(--left===0){const sec=Math.round((Date.now()-t0)/1000);gameEnd('match',sec,(a,p)=>a<p,miss?'Xong! Ghép sai '+miss+' lần.':'Hoàn hảo, không sai lần nào!')}}
    else{miss++;tone(false);b.classList.add('no');sel.classList.add('no');const a=sel;sel=null;setTimeout(()=>{a.classList.remove('no','sel');b.classList.remove('no')},400)}});
}
function tf(){
  const pool=[...D.vocab.map(v=>[v[0],v[2]]),...D.phrases.map(p=>[p[0],p[1]])];let pts=0,left=45,cur;
  $('#pTc').innerHTML=`<div class="ghead"><span>Điểm: <b id="gp">0</b></span><b id="gt">45s</b></div><div class="tf" id="tfc"><span class="e" id="te"></span><span class="v" id="tv"></span></div><div class="tfb"><button class="y" data-a="1">Đúng ✓</button><button class="n" data-a="0">Sai ✗</button></div>`;
  const next=()=>{const p=pool[Math.floor(Math.random()*pool.length)];const ok=Math.random()<.5;const m=ok?p[1]:pick(pool.filter(x=>x!==p),1)[0][1];cur={ok};$('#te').textContent=p[0];$('#tv').textContent=m};
  next();
  gTimer=setInterval(()=>{left--;$('#gt').textContent=left+'s';if(left<=0)gameEnd('tf',pts,(a,p)=>a>p,pts>=15?'Phản xạ cực nhanh!':'Chơi thêm để tăng điểm nhé!')},1000);
  $$('.tfb button').forEach(b=>b.onclick=()=>{const ok=(b.dataset.a==='1')===cur.ok;if(ok)pts++;else pts=Math.max(0,pts-1);tone(ok);$('#gp').textContent=pts;
    const c=$('#tfc');c.classList.remove('flash-ok','flash-no');void c.offsetWidth;c.classList.add(ok?'flash-ok':'flash-no');next()});
}
function dlg(){
  const t0=Date.now();let k=0;const order=shuf(D.dialog.map((_,i)=>i));
  $('#pTc').innerHTML=`<div class="ghead"><span>Câu tiếp theo là câu nào?</span><b id="gt">0s</b></div><div class="lines" id="done"></div><div class="opts" id="dop">${order.map(i=>`<button data-i="${i}">${esc(D.dialog[i][1])}</button>`).join('')}</div>`;
  gTimer=setInterval(()=>{$('#gt').textContent=Math.floor((Date.now()-t0)/1000)+'s'},250);
  $$('#dop button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
    if(i===k){const d=D.dialog[i];b.remove();$('#done').insertAdjacentHTML('beforeend',`<button><span class="who ${d[0]==='B'?'b':''}">${d[0]}</span><span class="en">${esc(d[1])}</span></button>`);say(d[1],d[0]==='A'?'f':'m');tone(true);
      if(++k===D.dialog.length)setTimeout(()=>gameEnd('dlg',Math.round((Date.now()-t0)/1000),(a,p)=>a<p,'Bạn đã xếp đúng cả đoạn hội thoại!'),900)}
    else{tone(false);b.classList.add('no');setTimeout(()=>b.classList.remove('no'),400)}});
}

function hv(){
  const items=pick(D.halves,Math.min(6,D.halves.length)),t0=Date.now();let sel=null,left=items.length,miss=0;
  const L=shuf(items.map((h,i)=>({k:i,t:h[0]}))),R=shuf(items.map((h,i)=>({k:i,t:h[1]})));
  $('#pTc').innerHTML=`<div class="ghead"><span>Ghép nửa câu</span><b id="gt">0s</b></div><div class="hvg"><div id="hl">${L.map(c=>`<button data-k="${c.k}">${esc(c.t)}…</button>`).join('')}</div><div id="hr">${R.map(c=>`<button data-k="${c.k}">…${esc(c.t)}</button>`).join('')}</div></div>`;
  gTimer=setInterval(()=>{$('#gt').textContent=Math.floor((Date.now()-t0)/1000)+'s'},250);
  $$('#hl button').forEach(b=>b.onclick=()=>{if(b.classList.contains('done'))return;$$('#hl button').forEach(x=>x.classList.remove('sel'));sel=b;b.classList.add('sel')});
  $$('#hr button').forEach(b=>b.onclick=()=>{if(!sel||b.classList.contains('done'))return;
    if(sel.dataset.k===b.dataset.k){const h=items[+b.dataset.k];sel.classList.replace('sel','done');b.classList.add('done');sel=null;tone(true);say(h.join(' '));
      if(--left===0)setTimeout(()=>gameEnd('hv',Math.round((Date.now()-t0)/1000),(a,p)=>a<p,miss?'Xong! Ghép sai '+miss+' lần.':'Hoàn hảo, không sai lần nào!'),1200)}
    else{miss++;tone(false);b.classList.add('no');setTimeout(()=>b.classList.remove('no'),400)}});
}

/* ---------- khung trang ---------- */
const TABS={'on-bai':'#pOn','luyen-nghe':'#pNg','luyen-noi':'#pNo','kiem-tra':'#pKt','tro-choi':'#pTc'};
function tab(id){
  if(!TABS[id])id='on-bai';
  $$('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===id));
  Object.entries(TABS).forEach(([k,s])=>$(s).hidden=k!==id);
  if(id!=='luyen-nghe'){dl.pause();roleRun++}
  if(id!=='luyen-noi'){spRun++;clearInterval(pTimer);if(mrec&&mrec.state==='recording')mrec.stop()}
  if(id==='luyen-noi'&&!$('#pNo').innerHTML)renderSpeak();
  if(id==='kiem-tra'&&!$('#pKt').innerHTML)startTest();
  if(id==='tro-choi'&&!$('#pTc').innerHTML)gameMenu();
  if(location.hash.slice(1)!==id)history.replaceState(null,'','#'+id);
}
function init(){
  document.title='Lesson '+D.id+' · '+D.title+' · E4B Chặng '+D.stage;
  $('#tag').textContent='E4B · CHẶNG '+D.stage+' · LESSON '+D.id;$('#h1').textContent=D.en;$('#sub').textContent=D.title;
  $('#foot').innerHTML=(D.prev?`<a href="${D.prev}" style="color:inherit">‹ Lesson ${D.id-1}</a> · `:'')+'Lucina English Class'+(D.nextUrl?` · <a href="${D.nextUrl}" style="color:inherit">Lesson ${D.id+1} ›</a>`:'');
  renderReview();renderListen();
  $$('.top .seg button').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.v===voice);b.onclick=()=>{voice=b.dataset.v;st.set('e4b-cx-voice',voice);$$('.top .seg button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===voice))}});
  $$('.tabs button').forEach(b=>b.onclick=()=>{tab(b.dataset.tab);window.scrollTo({top:0})});
  document.addEventListener('click',e=>{const s=e.target.closest('[data-say]');if(s){dl.pause();say(s.dataset.say);return}const g=e.target.closest('[data-go]');if(g){tab(g.dataset.go);window.scrollTo({top:0})}});
  window.addEventListener('hashchange',()=>tab(location.hash.slice(1)));
  tab(location.hash.slice(1));
}
init();
})();
