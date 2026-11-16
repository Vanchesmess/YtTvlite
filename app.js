'use strict';
const $=s=>document.querySelector(s),M=$('#m');
const D={ru:{home:'Главная',subs:'Подписки',lib:'Библиотека',set:'Настройки',search:'Поиск',all:'Все',gaming:'Игры',news:'Новости',sports:'Спорт',learning:'Обучение',live:'Эфиры',
wl:'Смотреть позже',fav:'Избранное',hist:'История',empty:'Пусто',err:'Не удалось загрузить. Проверьте сервер в настройках.',sub:'Подписаться',subd:'Вы подписаны',
queue:'Добавить в очередь',queued:'Добавлено в очередь',saved:'Сохранено',goch:'Канал',share:'Поделиться',comments:'Комментарии',related:'Похожие',upnext:'Далее',playnow:'Смотреть',
filters:'Фильтры',date:'Дата',dur:'Длительность',sort:'Сортировка',type:'Тип',clear:'Очистить историю поиска',recent:'Недавние запросы',noRes:'Ничего не найдено',
theme:'Тема',region:'Регион',lang:'Язык',inst:'Сервер Invidious',autoplay:'Автовоспроизведение',ryd:'Return YouTube Dislike',sb:'SponsorBlock',skip:'Пропускать',btn:'Кнопка',off:'Выкл',
likes:'нрав.',dislikes:'не нрав.',views:'просм.',videos:'Видео',playlists:'Плейлисты',exp:'Экспорт данных',imp:'Импорт данных',sk:'Пропустить',more:'Ещё',auto:'Авто',dark:'Тёмная',light:'Светлая',desc:'Описание'},
en:{home:'Home',subs:'Subscriptions',lib:'Library',set:'Settings',search:'Search',all:'All',gaming:'Gaming',news:'News',sports:'Sports',learning:'Learning',live:'Live',
wl:'Watch later',fav:'Favorites',hist:'History',empty:'Nothing here',err:"Couldn't load. Check the server in Settings.",sub:'Subscribe',subd:'Subscribed',
queue:'Add to queue',queued:'Added to queue',saved:'Saved',goch:'Channel',share:'Share',comments:'Comments',related:'Related',upnext:'Up next',playnow:'Play now',
filters:'Filters',date:'Date',dur:'Duration',sort:'Sort',type:'Type',clear:'Clear search history',recent:'Recent searches',noRes:'No results',
theme:'Theme',region:'Region',lang:'Language',inst:'Invidious server',autoplay:'Autoplay',ryd:'Return YouTube Dislike',sb:'SponsorBlock',skip:'Auto skip',btn:'Show button',off:'Disable',
likes:'likes',dislikes:'dislikes',views:'views',videos:'Videos',playlists:'Playlists',exp:'Export data',imp:'Import data',sk:'Skip',more:'More',auto:'Auto',dark:'Dark',light:'Light',desc:'Description'}};
const S=Object.assign({theme:'auto',region:'US',lang:navigator.language.startsWith('ru')?'ru':'en',inst:'https://inv.nadeko.net',autoplay:true,ryd:true,
sb:{sponsor:'skip',selfpromo:'skip',interaction:'btn',intro:'off',outro:'off',preview:'off',filler:'off'},subs:[],hist:[],wl:[],fav:[],recent:[],q:[]},JSON.parse(localStorage.opaline||'{}'));
const save=()=>localStorage.opaline=JSON.stringify(S),t=k=>D[S.lang][k]||k;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FB=['https://inv.nadeko.net','https://yewtu.be','https://invidious.nerdvpn.de'],V={};
const toast=m=>{const e=$('#toast');e.textContent=m;e.style.display='block';setTimeout(()=>e.style.display='none',1800)};
function theme(){const d=S.theme=='dark'||(S.theme=='auto'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.t=d?'dark':'light';document.documentElement.lang=S.lang}
async function api(p){for(const h of [S.inst,...FB.filter(x=>x!=S.inst)]){try{const r=await fetch(h+'/api/v1'+p,{signal:AbortSignal.timeout(9000)});if(r.ok){if(h!=S.inst){S.inst=h;save()}return await r.json()}}catch(e){}}throw 0}
const fmt=s=>{s=+s||0;const h=s/3600|0,m=(s%3600)/60|0,x=s%60;return(h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0')};
const slim=v=>({videoId:v.videoId,title:v.title,author:v.author,authorId:v.authorId,lengthSeconds:v.lengthSeconds});
function card(v){if(!v.videoId)return'';V[v.videoId]=v;return`<div class="card"><a href="#/w/${v.videoId}"><img loading="lazy" src="https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg"><b>${esc(v.title)}</b><small>${esc(v.author)}${v.viewCountText?' · '+esc(v.viewCountText):''}${v.publishedText?' · '+esc(v.publishedText):''}</small></a>${v.lengthSeconds?`<span class="dur" style="top:auto;bottom:calc(100% - 56.25% * 1);">${fmt(v.lengthSeconds)}</span>`:''}<button class="more" onclick="menu('${v.videoId}')">⋯</button></div>`}
const list=(a,e)=>a&&a.length?`<div class="grid">${a.map(card).join('')}</div>`:`<p class="pad mut">${e||t('empty')}</p>`;
function sheet(items){$('#sh').innerHTML=items.map((x,i)=>`<button data-i="${i}">${x[0]}</button>`).join('');$('#sheet').style.display='flex';$('#sh').onclick=e=>{const i=e.target.dataset.i;if(i!=null)items[i][1]()}}
const toggle=(k,id)=>{const v=V[id];if(!v)return;const a=S[k],i=a.findIndex(x=>x.videoId==id);i<0?a.unshift(slim(v)):a.splice(i,1);save();toast(t('saved'))};
window.menu=id=>{const v=V[id]||{};sheet([[t('wl'),()=>toggle('wl',id)],[t('fav'),()=>toggle('fav',id)],[t('queue'),()=>{S.q.push(slim(v));save();toast(t('queued'))}],[t('goch'),()=>location.hash='#/c/'+v.authorId]])};
/* ---------- views ---------- */
const nav=()=>{const h=location.hash.split('/')[1]||'home';$('#nav').innerHTML=[['home','🏠'],['subs','📺'],['lib','📚'],['set','⚙️']].map(([k,i])=>`<a href="#/${k}" class="${h==k?'on':''}">${i}<br><small>${t(k=='set'?'set':k)}</small></a>`).join('');$('#q').placeholder=t('search')};
let cat='';const CATS={all:'',gaming:'gaming',news:'news',sports:'sports',learning:'learning'};
async function home(){M.innerHTML=`<div class="chips">${Object.keys(CATS).map(k=>`<button class="chip ${CATS[k]==cat?'on':''}" onclick="cat='${CATS[k]}';home()">${t(k)}</button>`).join('')}</div><div id="f" class="pad mut">…</div>`;
try{const r=await api(`/trending?region=${S.region}${cat?'&type='+cat:''}`);$('#f').outerHTML=list(r)}catch{$('#f').textContent=t('err')}}
async function subs(){if(!S.subs.length){M.innerHTML=`<p class="pad mut">${t('empty')}</p>`;return}M.innerHTML='<div id="f" class="pad mut">…</div>';
const all=(await Promise.all(S.subs.map(c=>api(`/channels/${c.id}/latest`).then(r=>(r.videos||r).slice(0,8)).catch(()=>[])))).flat();
all.sort((a,b)=>(b.published||0)-(a.published||0));$('#f').outerHTML=`<div class="chips">${S.subs.map(c=>`<a class="chip" href="#/c/${c.id}">${esc(c.name)}</a>`).join('')}</div>`+list(all)}
function lib(sec){const tabs=[['hist',S.hist],['wl',S.wl],['fav',S.fav]];sec=sec||'hist';
M.innerHTML=`<div class="chips">${tabs.map(([k])=>`<button class="chip ${k==sec?'on':''}" onclick="lib('${k}')">${t(k)}</button>`).join('')}</div>`+list(S[sec])}
const FL={date:['','hour','today','week','month','year'],duration:['','short','medium','long'],sort:['relevance','rating','date','views'],type:['video','playlist','channel']};let flt={date:'',duration:'',sort:'relevance',type:'video'};
async function search(q){q=decodeURIComponent(q);$('#q').value=q;
M.innerHTML=`<div class="chips">${Object.keys(FL).map(k=>`<button class="chip ${flt[k]&&flt[k]!=FL[k][0]?'on':''}" onclick="pickF('${k}','${q.replace(/'/g,"\\'")}')">${t(k=='duration'?'dur':k)}</button>`).join('')}</div><div id="f" class="pad mut">…</div>`;
try{const p=new URLSearchParams({q,...flt});const r=await api('/search?'+p);const vs=r.filter(x=>x.type=='video'),o=r.filter(x=>x.type!='video');
$('#f').outerHTML=(o.length?`<div class="chips">${o.slice(0,6).map(x=>`<a class="chip" href="#/${x.type=='channel'?'c/'+x.authorId:'p/'+x.playlistId}">${esc(x.author||x.title)}</a>`).join('')}</div>`:'')+list(vs,t('noRes'))}catch{$('#f').textContent=t('err')}}
window.pickF=(k,q)=>sheet(FL[k].map(v=>[(flt[k]==v?'✓ ':'')+(v||t('all')),()=>{flt[k]=v;search(encodeURIComponent(q))}]));
async function chan(id){M.innerHTML='<div id="f" class="pad mut">…</div>';try{const[c,v]=await Promise.all([api('/channels/'+id),api(`/channels/${id}/videos`)]);const on=S.subs.some(x=>x.id==id);
$('#f').outerHTML=`<div class="pad"><h2 style="margin:0">${esc(c.author)}</h2><span class="mut">${(c.subCount||0).toLocaleString()} sub</span><br><br><button class="btn ${on?'g':''}" id="sb">${t(on?'subd':'sub')}</button></div>`+list(v.videos||v);
$('#sb').onclick=()=>{const i=S.subs.findIndex(x=>x.id==id);i<0?S.subs.push({id,name:c.author}):S.subs.splice(i,1);save();chan(id)}}catch{$('#f').textContent=t('err')}}
async function plist(id){M.innerHTML='<div id="f" class="pad mut">…</div>';try{const p=await api('/playlists/'+id);$('#f').outerHTML=`<h3>${esc(p.title)}</h3>`+list(p.videos)}catch{$('#f').textContent=t('err')}}
/* ---------- player ---------- */
let yp,tick,segs=[],cur,nxt,cd;
const ytReady=new Promise((r,j)=>{if(window.YT&&YT.Player)return r();window.onYouTubeIframeAPIReady=r;const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.onerror=j;document.head.appendChild(s)});
function stop(){clearInterval(tick);clearTimeout(cd);try{yp&&yp.destroy()}catch{}yp=null}
async function watch(id){stop();cur=id;segs=[];
M.innerHTML=`<div class="pl"><div id="yt"></div></div><div class="pad" id="info"><span class="mut">…</span></div><div id="skipb" class="pad" style="display:none"></div><div id="rel"></div>`;
ytReady.then(()=>{if(cur!=id)return;
yp=new YT.Player('yt',{videoId:id,width:'100%',height:'100%',playerVars:{autoplay:1,playsinline:1,rel:0,origin:location.origin},events:{onStateChange:e=>{if(e.data==0)ended()}}});
tick=setInterval(sbTick,400)}).catch(()=>{const e=$('#yt');if(e)e.outerHTML=`<p class="pad mut" style="color:#fff">${t('err')}</p>`});
api('/videos/'+id).then(v=>{if(cur!=id)return;V[id]=Object.assign(V[id]||{},slim(v));S.hist=[slim(v),...S.hist.filter(x=>x.videoId!=id)].slice(0,200);save();
const rec=(v.recommendedVideos||[]).map(r=>({...r,viewCountText:r.viewCountText}));nxt=rec[0];
$('#info').innerHTML=`<h3 style="margin:0 0 6px">${esc(v.title)}</h3><span class="mut">${(v.viewCount||0).toLocaleString()} ${t('views')} · ${esc(v.publishedText||'')}</span><div class="mut" id="ryd"></div>
<p><a href="#/c/${v.authorId}"><b>${esc(v.author)}</b></a></p><div class="acts"><button class="btn g" onclick="toggle('wl','${id}')">⏱ ${t('wl')}</button><button class="btn g" onclick="toggle('fav','${id}')">♥ ${t('fav')}</button><button class="btn g" id="shr">↗ ${t('share')}</button><button class="btn g" id="cmb">💬 ${t('comments')}</button></div>
<details><summary>${t('desc')}</summary><pre style="white-space:pre-wrap;font:inherit">${esc(v.description)}</pre></details><div id="cms"></div>`;
$('#shr').onclick=()=>{const u='https://youtu.be/'+id;navigator.share?navigator.share({title:v.title,url:u}):(navigator.clipboard.writeText(u),toast('✓'))};
$('#cmb').onclick=()=>comments(id);
$('#rel').innerHTML=`<h3>${t('related')}</h3>`+list(rec)}).catch(()=>{$('#info').innerHTML=`<span class="mut">${t('err')}</span>`});
if(S.ryd)fetch('https://returnyoutubedislikeapi.com/votes?videoId='+id).then(r=>r.json()).then(d=>{const e=$('#ryd');if(e&&cur==id)e.textContent=`👍 ${d.likes.toLocaleString()} · 👎 ${d.dislikes.toLocaleString()}`}).catch(()=>{});
const cats=Object.keys(S.sb).filter(k=>S.sb[k]!='off');
if(cats.length)fetch('https://sponsor.ajay.app/api/skipSegments?videoID='+id+'&categories='+encodeURIComponent(JSON.stringify(cats))).then(r=>r.ok?r.json():[]).then(a=>{if(cur==id)segs=a}).catch(()=>{})}
function sbTick(){if(!yp||!yp.getCurrentTime)return;const ct=yp.getCurrentTime(),b=$('#skipb');let hit=null;
for(const s of segs)if(ct>=s.segment[0]&&ct<s.segment[1]-.3){hit=s;break}
if(hit&&S.sb[hit.category]=='skip'){yp.seekTo(hit.segment[1],true);toast('⏭ '+hit.category);return}
if(hit&&b){b.style.display='block';b.innerHTML=`<button class="btn">${t('sk')} ${esc(hit.category)}</button>`;b.firstChild.onclick=()=>yp.seekTo(hit.segment[1],true)}else if(b)b.style.display='none'}
function ended(){let n;if(S.q.length){n=S.q.shift();save()}else if(S.autoplay&&nxt)n=nxt;if(!n)return;
const b=$('#skipb');let s=5;b.style.display='block';const step=()=>{b.innerHTML=`${t('upnext')}: <b>${esc(n.title)}</b> <button class="btn">${t('playnow')} (${s})</button>`;b.querySelector('button').onclick=go};
const go=()=>{clearTimeout(cd);location.hash='#/w/'+n.videoId};step();const loop=()=>{if(--s<=0)return go();step();cd=setTimeout(loop,1000)};cd=setTimeout(loop,1000)}
async function comments(id){const c=$('#cms');c.innerHTML='…';try{const r=await api('/comments/'+id);c.innerHTML=`<h3 style="margin:8px 0">${t('comments')}</h3>`+(r.comments||[]).map(x=>`<div class="cm"><b>${esc(x.author)}</b> <span class="mut">${esc(x.publishedText||'')} · 👍${x.likeCount||0}</span><br>${esc(x.content)}</div>`).join('')}catch{c.innerHTML=t('err')}}
/* ---------- settings ---------- */
function settings(){const sel=(k,o,lbl)=>`<select data-k="${k}">${o.map(([v,l])=>`<option value="${v}" ${S[k]==v?'selected':''}>${l}</option>`).join('')}</select>`;
const R=['US','GB','DE','FR','ES','IT','RU','UA','JP','TR','BR','IN'];
M.innerHTML=`<div class="row">${t('theme')}${sel('theme',[['auto',t('auto')],['dark',t('dark')],['light',t('light')]])}</div>
<div class="row">${t('lang')}${sel('lang',[['ru','Русский'],['en','English']])}</div>
<div class="row">${t('region')}${sel('region',R.map(r=>[r,r]))}</div>
<div class="row">${t('autoplay')}<input type="checkbox" data-k="autoplay" ${S.autoplay?'checked':''}></div>
<div class="row">${t('ryd')}<input type="checkbox" data-k="ryd" ${S.ryd?'checked':''}></div>
<div class="row"><span>${t('inst')}</span><input data-k="inst" value="${esc(S.inst)}" style="width:55%;background:var(--card);border:0;border-radius:8px;padding:6px"></div>
<h3>${t('sb')}</h3>${Object.keys(S.sb).map(k=>`<div class="row">${k}<select data-sb="${k}">${['skip','btn','off'].map(v=>`<option value="${v}" ${S.sb[k]==v?'selected':''}>${t(v)}</option>`).join('')}</select></div>`).join('')}
<div class="row"><button class="btn g" id="clr">${t('clear')}</button><button class="btn g" id="exp">${t('exp')}</button></div>
<p class="pad mut">Data: Invidious API · SponsorBlock (sponsor.ajay.app) · Return YouTube Dislike</p>`;
M.onchange=e=>{const el=e.target;if(el.dataset.k){S[el.dataset.k]=el.type=='checkbox'?el.checked:el.value}else if(el.dataset.sb)S.sb[el.dataset.sb]=el.value;else return;save();theme();if(el.dataset.k=='lang'){nav();settings()}};
$('#clr').onclick=()=>{S.recent=[];save();toast('✓')};
$('#exp').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='opaline-data.json';a.click()}}
/* ---------- router ---------- */
function route(){M.onchange=null;const[,p,a]=location.hash.split('/');if(p!='s')$('#q').value='';nav();if(p!='w')stop();scrollTo(0,0);
({w:()=>watch(a),c:()=>chan(a),p:()=>plist(a),s:()=>search(a||''),subs,lib:()=>lib(),set:settings}[p]||home)()}
$('#q').addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.value.trim()){const q=e.target.value.trim();S.recent=[q,...S.recent.filter(x=>x!=q)].slice(0,15);save();e.target.blur();location.hash='#/s/'+encodeURIComponent(q)}});
$('#q').addEventListener('focus',e=>{if(!e.target.value&&S.recent.length)sheet(S.recent.map(r=>['🕘 '+esc(r),()=>location.hash='#/s/'+encodeURIComponent(r)]))});
addEventListener('hashchange',route);theme();matchMedia('(prefers-color-scheme:dark)').onchange=theme;route();
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
