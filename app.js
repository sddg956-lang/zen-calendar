const APP_VERSION='1.2.1';
document.querySelector('#ver').textContent='v'+APP_VERSION;
const s=document.querySelector('#screen'),tabs=document.querySelector('#tabs'),sheet=document.querySelector('#sheet');
let tab='today',day=0,step=0;

function loadData(){
  let storedTasks=JSON.parse(localStorage.getItem('zen.tasks')||'[]');
  let storedEvents=JSON.parse(localStorage.getItem('zen.events')||'[]');
  if(!localStorage.getItem('zen.migrated.1.2.1')){
    storedTasks=storedTasks.filter(t=>!(t.id===1&&t.title==='寄出報價單')&&!(t.id===2&&t.title==='整理會議資料'));
    storedEvents=storedEvents.filter(e=>!(e.id===11&&e.title==='客戶會議')&&!(e.id===12&&e.title==='與陳先生確認報價'));
    localStorage.setItem('zen.migrated.1.2.1','1');
    localStorage.setItem('zen.tasks',JSON.stringify(storedTasks));
    localStorage.setItem('zen.events',JSON.stringify(storedEvents));
  }
  return {storedTasks,storedEvents};
}
const loaded=loadData();
let tasks=loaded.storedTasks;
let events=loaded.storedEvents;

function save(){localStorage.setItem('zen.tasks',JSON.stringify(tasks));localStorage.setItem('zen.events',JSON.stringify(events))}
function di(){let d=new Date();d.setDate(d.getDate()+day);return `${d.getMonth()+1} 月 ${d.getDate()} 日`}
function today(){
  let ev=events.filter(x=>(x.date||0)===day),ts=tasks.filter(x=>(x.date||0)===day);
  s.innerHTML=`<div class="date">${di()}</div><div class="small">${day===0?'今日':day===1?'明天':day===-1?'昨天':''}</div><section class="section"><div class="title">今日行程</div>${ev.map(e=>`<div class="card event" onclick="editEvent(${e.id})"><div class="time">${e.time||'未定'}</div><div><b>${escapeHtml(e.title)}</b><div class="small">點一下可編輯或刪除</div></div></div>`).join('')||'<div class="card small">沒有行程</div>'}</section><section class="section"><div class="title">今日待辦</div>${ts.map(t=>`<div class="card task"><span onclick="toggleDone(${t.id})" style="cursor:pointer;flex:1">${t.done?'✓':'○'} ${escapeHtml(t.title)}</span><button onclick="toggleDone(${t.id})">${t.done?'恢復':'完成'}</button></div>`).join('')||'<div class="card small">沒有待辦</div>'}</section><div class="quick"><button class="primary" onclick="capture()">＋ 記下一件事</button><button class="mic" onclick="voice()">🎙</button></div><div class="hint">空白區左右滑：前一天 / 下一天</div>`
}
function calendar(){s.innerHTML=`<div class="date">${new Date().getFullYear()} 年 ${new Date().getMonth()+1} 月</div><div class="card">行事曆月檢視</div><div class="hint">左右滑：上一月 / 下一月</div>`}
function review(){let a=[['今天辛苦了。','一起把明天整理好。'],['今天還有一些事情。','確認尚未完成的待辦。'],['確認明天的安排','檢查明天的行程與待辦。'],['AI 想確認','有沒有今天想到、但還沒排進明天的事情？'],['明天準備好了。','晚安。']][step];s.innerHTML=`<div style="text-align:center;padding-top:80px"><div style="font-size:42px">☾</div><div class="date">${a[0]}</div><p>${a[1]}</p><button class="primary" onclick="step=step<4?step+1:0;review()">${step<4?'下一步':'完成'}</button><div class="hint">左右滑：上一步 / 下一步</div></div>`}
function settings(){s.innerHTML=`<div class="date">設定</div><div class="card">通知提醒　開啟</div><div class="card">睡前整理　22:30</div><div class="card">語音快速輸入　開啟</div><div class="card">AI 遺漏建議　開啟</div>`}
function render(){({today,calendar,review,settings}[tab])()}
tabs.onclick=e=>{let b=e.target.closest('button');if(!b)return;tab=b.dataset.t;tabs.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));render()};
function toggleDone(id){let t=tasks.find(x=>x.id===id);if(!t)return;t.done=!t.done;save();today()}
function capture(text=''){sheet.classList.remove('hidden');sheet.innerHTML=`<div><h2>記下來</h2><textarea id="cap" placeholder="例如：明天下午三點和陳先生開會">${escapeHtml(text)}</textarea><button class="primary" onclick="add()">交給我整理</button><p class="small" onclick="closeSheet()">取消</p></div>`}
function voice(){capture('')}
function add(){let text=document.querySelector('#cap').value.trim();if(!text)return;if(/開會|點|時/.test(text))events.push({id:Date.now(),time:extractTime(text),title:text,date:text.includes('明天')?1:0});else tasks.push({id:Date.now(),title:text,done:false,date:text.includes('明天')?1:0});save();closeSheet();render()}
function extractTime(text){if(text.includes('下午三'))return '15:00';if(text.includes('下午兩'))return '14:00';return '未定'}
function editEvent(id){const e=events.find(x=>x.id===id);if(!e)return;sheet.classList.remove('hidden');sheet.innerHTML=`<div><h2>編輯行程</h2><input id="evtTitle" value="${escapeAttr(e.title)}" style="width:100%;padding:12px;border:1px solid #DDDCD6;border-radius:14px;background:#FBFAF7"><input id="evtTime" type="time" value="${/^\d\d:\d\d$/.test(e.time||'')?e.time:''}" style="width:100%;padding:12px;border:1px solid #DDDCD6;border-radius:14px;background:#FBFAF7;margin-top:10px"><button class="primary" style="margin-top:14px" onclick="saveEventEdit(${id})">儲存修改</button><button class="primary" style="margin-top:10px;background:#986B64" onclick="deleteEvent(${id})">刪除行程</button><p class="small" onclick="closeSheet()">取消</p></div>`}
function saveEventEdit(id){const e=events.find(x=>x.id===id);if(!e)return;const title=document.querySelector('#evtTitle').value.trim();const time=document.querySelector('#evtTime').value;if(title)e.title=title;e.time=time||'未定';save();closeSheet();today()}
function deleteEvent(id){if(!confirm('確定要刪除這個行程嗎？'))return;events=events.filter(x=>x.id!==id);save();closeSheet();today()}
function closeSheet(){sheet.classList.add('hidden');sheet.innerHTML=''}
function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function escapeAttr(v=''){return escapeHtml(v)}
let x=0,y=0,go=false;s.addEventListener('pointerdown',e=>{if(e.target.closest('button,.card,textarea,input'))return;x=e.clientX;y=e.clientY;go=true});s.addEventListener('pointerup',e=>{if(!go)return;go=false;let dx=e.clientX-x,dy=e.clientY-y;if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy))return;if(tab==='today'){day+=dx<0?1:-1;today()}else if(tab==='review'){step=Math.max(0,Math.min(4,step+(dx<0?1:-1)));review()}});if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js');render();
