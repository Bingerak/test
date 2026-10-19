(function(){
"use strict";
var LANG=((document.documentElement.lang||'pt').slice(0,2)==='en')?'en':'pt';var EN={"automático": "automatic", "claro": "light", "escuro": "dark", "Tema: ": "Theme: ", "Digite para buscar em notícias, eventos e páginas.": "Type to search news, events and pages.", "Nenhum resultado para essa busca. Tente outra palavra.": "No results for that search. Try another word.", " matéria": " article", " matérias": " articles", " · página ": " · page ", " de ": " of ", "‹ Anterior": "‹ Previous", "Próxima ›": "Next ›", "Ver matéria →": "See article →", "Galeria de fotos": "Photo gallery", "Fechar": "Close", "Foto anterior": "Previous photo", "Próxima foto": "Next photo", "Link copiado": "Link copied", "Preencha este campo.": "Please fill in this field.", "Informe um e-mail válido, como nome@dominio.com.": "Enter a valid email, such as name@domain.com.", "Informe um telefone com DDD.": "Enter a phone number with area code.", "Escreva um pouco mais (mínimo de %n caracteres).": "Please write a little more (at least %n characters).", "A idade mínima para manifestar interesse é 18 anos.": "The minimum age to express interest is 18.", "É preciso aceitar para continuar.": "You need to accept to continue.", "Manifestação recebida": "Expression of interest received", "Obrigado pelo interesse. Um representante autorizado da sua região entrará em contato nos próximos dias.": "Thank you for your interest. An authorized representative from your region will contact you in the coming days.", "Mensagem enviada": "Message sent", "Recebemos sua mensagem e responderemos pelo e-mail informado.": "We received your message and will reply to the email provided.", "Inscrição confirmada": "Registration confirmed", "Você receberá os detalhes do evento no e-mail informado.": "You will receive the event details at the email provided.", "Inscrição feita": "Subscribed", "Você passará a receber o boletim mensal.": "You will now receive the monthly newsletter.", "O acesso ainda não está ativo. Procure a secretaria da sua Loja para liberar o seu cadastro.": "Access is not active yet. Contact your Lodge secretary to enable your account.", "Mês anterior": "Previous month", "Próximo mês": "Next month", "● Dia com evento": "● Day with event", "○ Hoje": "○ Today", " evento(s)": " event(s)", " fotos": " photos", " Loja encontrada": " Lodge found", " Lojas encontradas": " Lodges found"};function T(t){return LANG==='en'&&EN[t]!==undefined?EN[t]:t}

var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var ROOT=(function(){var s=$('script[src$="site.js"]');return s?s.getAttribute('src').replace('assets/site.js',''):''})();var PROOT=ROOT+(LANG==='en'?'en/':'');
var DIA=new RegExp('[\\u0300-\\u036f]','g');function norm(t){return (t||'').toLowerCase().normalize('NFD').replace(DIA,'')}
function toast(msg){var t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.remove()},3200)}

/* ---------- theme toggle (per-viewer convenience) ---------- */
var themeBtn=$('[data-theme-toggle]'), modes=['auto','light','dark'], names={auto:T('automático'),light:T('claro'),dark:T('escuro')};
function applyTheme(m){if(m==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',m);if(themeBtn)themeBtn.textContent=T('Tema: ')+names[m]}
var saved='auto';try{saved=localStorage.getItem('lp-theme')||'auto'}catch(e){}
applyTheme(saved);
if(themeBtn)themeBtn.addEventListener('click',function(){saved=modes[(modes.indexOf(saved)+1)%3];applyTheme(saved);try{localStorage.setItem('lp-theme',saved)}catch(e){}});

/* ---------- mobile nav + dropdowns ---------- */
var nav=$('#nav'), scrim=$('.scrim'), openBtn=$('[data-open-nav]');
function setNav(o){if(!nav)return;nav.classList.toggle('open',o);scrim.classList.toggle('on',o);if(openBtn)openBtn.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''}
if(openBtn)openBtn.addEventListener('click',function(){setNav(true)});
$$('[data-close-nav]').forEach(function(b){b.addEventListener('click',function(){setNav(false)})});
function closeSubs(except){$$('.has-sub.open').forEach(function(x){if(x!==except){x.classList.remove('open');var t=x.querySelector('.sub-tg');if(t)t.setAttribute('aria-expanded','false')}})}
$$('.has-sub>.sub-tg').forEach(function(b){b.addEventListener('click',function(ev){ev.stopPropagation();var li=b.parentNode,o=!li.classList.contains('open');closeSubs(li);li.classList.toggle('open',o);b.setAttribute('aria-expanded',o)})});
$$('.nav a').forEach(function(a){a.addEventListener('click',function(){setNav(false)})});
document.addEventListener('click',function(ev){if(!ev.target.closest('.has-sub')&&window.innerWidth>1320)closeSubs(null);if(!ev.target.closest('.lang'))closeLang()});
/* ---------- language menu ---------- */
var langBtn=$('.lang-btn'),langMenu=$('.lang-menu');
function closeLang(){if(langMenu&&!langMenu.hidden){langMenu.hidden=true;langBtn.setAttribute('aria-expanded','false')}}
if(langBtn)langBtn.addEventListener('click',function(ev){ev.stopPropagation();var o=langMenu.hidden;langMenu.hidden=!o;langBtn.setAttribute('aria-expanded',o);if(o){var c=langMenu.querySelector('[aria-current]');(c||langMenu.querySelector('a')).focus()}});
$$('.lang-menu a').forEach(function(a){a.addEventListener('click',function(){try{localStorage.setItem('lp-lang',a.dataset.lang)}catch(e){}})});

/* ---------- global search ---------- */
var ov=$('.search-ov'), q=$('#q-global'), res=$('.search-res');
function openSearch(){ov.hidden=false;q.value='';renderSearch('');setTimeout(function(){q.focus()},30)}
function closeSearch(){ov.hidden=true}
function renderSearch(v){var idx=window.SITE_INDEX||[],n=norm(v.trim());
  if(!n){res.innerHTML='<p class="search-empty">'+T('Digite para buscar em notícias, eventos e páginas.')+'</p>';return}
  var terms=n.split(/\s+/),hits=idx.filter(function(it){var x=norm(it.x+' '+it.t);return terms.every(function(t){return x.indexOf(t)>-1})}).slice(0,12);
  res.innerHTML=hits.length?hits.map(function(h){return '<a href="'+PROOT+h.u+'"><b></b><span></span></a>'}).join(''):'<p class="search-empty">'+T('Nenhum resultado para essa busca. Tente outra palavra.')+'</p>';
  $$('a',res).forEach(function(a,i){a.querySelector('b').textContent=hits[i].t;a.querySelector('span').textContent=hits[i].k})}
$$('[data-open-search]').forEach(function(b){b.addEventListener('click',openSearch)});
if(ov){$('[data-close-search]').addEventListener('click',closeSearch);ov.addEventListener('click',function(e){if(e.target===ov)closeSearch()});q.addEventListener('input',function(){renderSearch(q.value)})}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(ov&&!ov.hidden)closeSearch();closeLang();closeSubs(null);setNav(false);closeLb();closeReg()}if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)&&ov){e.preventDefault();openSearch()}});

/* ---------- news filter + pagination ---------- */
var grid=$('#news-grid');
if(grid){
  var posts=$$('.post',grid),per=9,pageN=1,cat='todas',reg=$('#f-region'),fq=$('#f-q'),pager=$('#news-pager'),count=$('#news-count'),empty=$('#news-empty'),feature=$('.feature');
  var h=(location.hash||'').slice(1); if(h&&$('.chip[data-cat="'+h+'"]'))cat=h;
  function apply(resetPage){if(resetPage)pageN=1;
    var n=norm(fq.value.trim()),r=reg.value;
    var list=posts.filter(function(p){return (cat==='todas'||p.dataset.cat===cat)&&(!r||p.dataset.region===r)&&(!n||norm(p.dataset.text).indexOf(n)>-1)});
    var pages=Math.max(1,Math.ceil(list.length/per)); if(pageN>pages)pageN=pages;
    posts.forEach(function(p){p.hidden=true});
    list.slice((pageN-1)*per,pageN*per).forEach(function(p){p.hidden=false});
    if(feature)feature.hidden=!(cat==='todas'&&!n&&!r&&pageN===1);
    empty.hidden=list.length>0; count.textContent=list.length?(list.length+(list.length===1?T(' matéria'):T(' matérias'))+(pages>1?T(' · página ')+pageN+T(' de ')+pages:'')):'';
    $$('.chip',$('.chips')).forEach(function(c){c.setAttribute('aria-pressed',c.dataset.cat===cat)});
    pager.innerHTML='';
    if(pages>1){
      var mk=function(label,pg,dis,cur){var b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=!!dis;if(cur)b.setAttribute('aria-current','page');b.addEventListener('click',function(){pageN=pg;apply();grid.scrollIntoView({behavior:'smooth',block:'start'})});pager.appendChild(b)};
      mk(T('‹ Anterior'),pageN-1,pageN===1);for(var i=1;i<=pages;i++)mk(String(i),i,false,i===pageN);mk(T('Próxima ›'),pageN+1,pageN===pages);
    }}
  $$('.chip',$('.chips')).forEach(function(c){c.addEventListener('click',function(){cat=c.dataset.cat;apply(true)})});
  reg.addEventListener('change',function(){apply(true)});fq.addEventListener('input',function(){apply(true)});
  $('#news-reset').addEventListener('click',function(){cat='todas';reg.value='';fq.value='';apply(true)});
  window.addEventListener('hashchange',function(){var h=location.hash.slice(1);if($('.chip[data-cat="'+h+'"]')){cat=h;apply(true)}});
  apply(true);
}

/* ---------- lightbox ---------- */
var lb=null,lbList=[],lbI=0;
function showLb(){var it=lbList[lbI];lb.querySelector('img').src=it.src;lb.querySelector('img').alt=it.cap||'';lb.querySelector('.cnt').innerHTML='';
  var c=lb.querySelector('.cnt'),t=document.createElement('span');t.textContent=(lbI+1)+' / '+lbList.length+(it.cap?'  ·  '+it.cap:'');c.appendChild(t);
  if(it.link){var a=document.createElement('a');a.href=it.link;a.textContent=T('Ver matéria →');a.className='lb-link';c.appendChild(a)}}
function closeLb(){if(lb&&!lb.hidden){lb.hidden=true;document.body.style.overflow=''}}
$$('[data-gallery]').forEach(function(g){var btns=$$('button[data-full]',g);btns.forEach(function(b){b.addEventListener('click',function(){
  if(!lb){lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label',T('Galeria de fotos'));
    lb.innerHTML='<img alt=""><button class="x" type="button" aria-label="'+T('Fechar')+'">✕</button><button class="pv" type="button" aria-label="'+T('Foto anterior')+'">‹</button><button class="nx" type="button" aria-label="'+T('Próxima foto')+'">›</button><div class="cnt"></div>';
    document.body.appendChild(lb);lb.querySelector('.x').onclick=closeLb;lb.querySelector('.pv').onclick=function(){lbI=(lbI-1+lbList.length)%lbList.length;showLb()};lb.querySelector('.nx').onclick=function(){lbI=(lbI+1)%lbList.length;showLb()};lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
    var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)lb.querySelector(dx<0?'.nx':'.pv').click();sx=null})}
  var vis=btns.filter(function(x){return x.dataset.inset!==undefined?x.dataset.inset==='1':!x.closest('[hidden]')});
  lbList=vis.map(function(x){return {src:x.dataset.full,cap:x.dataset.cap||'',link:x.dataset.link||''}});lbI=Math.max(0,vis.indexOf(b));lb.hidden=false;document.body.style.overflow='hidden';showLb();lb.querySelector('.x').focus()})})});
document.addEventListener('keydown',function(e){if(lb&&!lb.hidden){if(e.key==='ArrowRight')lb.querySelector('.nx').click();if(e.key==='ArrowLeft')lb.querySelector('.pv').click()}});

/* ---------- photo gallery page: filters + progressive reveal ---------- */
var wall=$('#wall');
if(wall){var tiles=$$('.tile',wall),gcat='todas',shown=24,more=$('#g-more'),gcount=$('#g-count');
  var hh=(location.hash||'').slice(1);if(hh&&$('[data-gf="'+hh+'"]'))gcat=hh;
  function gApply(reset){if(reset)shown=24;var list=tiles.filter(function(t){return gcat==='todas'||t.dataset.g===gcat});
    tiles.forEach(function(t){t.hidden=true;t.dataset.inset=(gcat==='todas'||t.dataset.g===gcat)?'1':'0'});list.slice(0,shown).forEach(function(t){t.hidden=false});
    more.hidden=list.length<=shown;gcount.textContent=Math.min(shown,list.length)+T(' de ')+list.length+T(' fotos');
    $$('[data-gf]').forEach(function(c){c.setAttribute('aria-pressed',c.dataset.gf===gcat)})}
  $$('[data-gf]').forEach(function(c){c.addEventListener('click',function(){gcat=c.dataset.gf;gApply(true)})});
  more.addEventListener('click',function(){shown+=24;gApply()});
  var bw=$$('[data-view]');bw.forEach(function(b){b.addEventListener('click',function(){wall.classList.toggle('grid',b.dataset.view==='grid');bw.forEach(function(x){x.setAttribute('aria-pressed',x===b)})})});
  gApply(true)}

/* ---------- copy link ---------- */
$$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var t=b.dataset.copy;
  try{navigator.clipboard.writeText(t).then(function(){toast(T('Link copiado'))},function(){toast(t)})}catch(e){toast(t)}})});

/* ---------- forms (client-side validation; backend to be connected) ---------- */
var MSG={required:T('Preencha este campo.'),email:T('Informe um e-mail válido, como nome@dominio.com.'),tel:T('Informe um telefone com DDD.'),min:T('Escreva um pouco mais (mínimo de %n caracteres).'),age:T('A idade mínima para manifestar interesse é 18 anos.'),check:T('É preciso aceitar para continuar.')};
function validate(f){var ok=true,first=null;
  $$('input,textarea,select',f).forEach(function(el){if(el.type==='hidden'||el.classList.contains('hp'))return;var m='';var v=(el.value||'').trim();
    if(el.type==='checkbox'){if(el.required&&!el.checked)m=MSG.check}
    else if(el.required&&!v)m=MSG.required;
    else if(el.type==='email'&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))m=MSG.email;
    else if(el.type==='tel'&&v&&v.replace(/\D/g,'').length<10)m=MSG.tel;
    else if(el.type==='number'&&v&&+v<18)m=MSG.age;
    else if(el.minLength>0&&v&&v.length<el.minLength)m=MSG.min.replace('%n',el.minLength);
    var err=el.type==='checkbox'?f.querySelector('[data-for="'+el.id+'"]'):(el.parentNode.querySelector('.err'));
    if(err)err.textContent=m; el.setAttribute('aria-invalid',m?'true':'false');
    if(m){ok=false;if(!first)first=el}});
  if(first)first.focus(); return ok}
var DONE={interest:[T('Manifestação recebida'),T('Obrigado pelo interesse. Um representante autorizado da sua região entrará em contato nos próximos dias.')],contact:[T('Mensagem enviada'),T('Recebemos sua mensagem e responderemos pelo e-mail informado.')],event:[T('Inscrição confirmada'),T('Você receberá os detalhes do evento no e-mail informado.')],newsletter:[T('Inscrição feita'),T('Você passará a receber o boletim mensal.')]};
$$('form[data-form]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
  if(f.querySelector('.hp')&&f.querySelector('.hp').value)return;
  if(!validate(f))return;
  var kind=f.dataset.form;
  if(kind==='login'){var err=f.querySelector('.err');f.querySelector('#m-pass').parentNode.querySelector('.err').textContent=T('O acesso ainda não está ativo. Procure a secretaria da sua Loja para liberar o seu cadastro.');return}
  if(kind==='newsletter'){f.reset();toast(DONE.newsletter[0]+': '+DONE.newsletter[1]);return}
  var d=DONE[kind],box=document.createElement('div');box.className='form-ok';box.setAttribute('role','status');box.innerHTML='<h3></h3><p></p>';box.querySelector('h3').textContent=d[0];box.querySelector('p').textContent=d[1];
  f.replaceWith(box)})});

/* ---------- event registration modal ---------- */
var reg=$('#reg');
function closeReg(){if(reg&&!reg.hidden)reg.hidden=true}
$$('[data-register]').forEach(function(b){b.addEventListener('click',function(){if(!reg){location.href=PROOT+'eventos.html';return}$('#reg-t').textContent=b.dataset.register;$('#reg-ev').value=b.dataset.register;reg.hidden=false;$('#r-nome')&&$('#r-nome').focus()})});
if(reg){$('[data-close-reg]').addEventListener('click',closeReg);reg.addEventListener('click',function(e){if(e.target===reg)closeReg()})}

/* ---------- events: filter + calendar ---------- */
var evList=$('#ev-list');
if(evList){var evs=$$('.ev',evList),aud='all';
  function evApply(){var n=0;evs.forEach(function(x){var s=aud==='all'||x.dataset.aud===aud;x.hidden=!s;if(s)n++});$('#ev-empty').hidden=n>0;$$('.chip[data-aud]').forEach(function(c){c.setAttribute('aria-pressed',c.dataset.aud===aud)})}
  $$('.chip[data-aud]').forEach(function(c){c.addEventListener('click',function(){aud=c.dataset.aud;evApply()})});
  var cal=$('#cal'),dates={};evs.forEach(function(x){(dates[x.dataset.date]=dates[x.dataset.date]||[]).push(x)});
  var today=new Date(2026,9,19),cur=new Date(2026,9,1);
  var MES=LANG==='en'?['January','February','March','April','May','June','July','August','September','October','November','December']:['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  function pad(n){return n<10?'0'+n:''+n}
  function drawCal(){var y=cur.getFullYear(),m=cur.getMonth(),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
    var h='<div class="cal-head"><button type="button" aria-label="'+T('Mês anterior')+'" data-m="-1">‹</button><h2>'+MES[m]+' '+y+'</h2><button type="button" aria-label="'+T('Próximo mês')+'" data-m="1">›</button></div><div class="cal-grid">';
    (LANG==='en'?['S','M','T','W','T','F','S']:['D','S','T','Q','Q','S','S']).forEach(function(d){h+='<span class="dow" aria-hidden="true">'+d+'</span>'});
    for(var i=0;i<first;i++)h+='<span></span>';
    for(var d=1;d<=days;d++){var k=y+'-'+pad(m+1)+'-'+pad(d),has=dates[k],t=(y===today.getFullYear()&&m===today.getMonth()&&d===today.getDate());
      h+=has?'<button type="button" class="d has'+(t?' today':'')+'" data-k="'+k+'" aria-label="'+(LANG==='en'?MES[m]+' '+d:d+' de '+MES[m])+': '+has.length+T(' evento(s)')+'">'+d+'</button>':'<span class="d'+(t?' today':'')+'">'+d+'</span>'}
    h+='</div><div class="cal-legend"><span>'+T('● Dia com evento')+'</span><span>'+T('○ Hoje')+'</span></div>';cal.innerHTML=h;
    $$('[data-m]',cal).forEach(function(b){b.addEventListener('click',function(){cur.setMonth(cur.getMonth()+(+b.dataset.m));drawCal()})});
    $$('.d.has',cal).forEach(function(b){b.addEventListener('click',function(){aud='all';evApply();var el=dates[b.dataset.k][0];evs.forEach(function(x){x.classList.remove('hl')});el.classList.add('hl');el.scrollIntoView({behavior:'smooth',block:'center'})})})}
  drawCal();evApply();
  var hh=location.hash.slice(1);if(hh&&$('#'+hh))$('#'+hh).classList.add('hl');
}

/* ---------- lodge directory ---------- */
var lodges=$('#lodges');
if(lodges){var items=$$('.lodge',lodges),lq=$('#l-q'),lr=$('#l-reg'),lc=$('#l-city'),lt=$('#l-rite');
  function lApply(){var n=norm(lq.value.trim()),c=0;items.forEach(function(x){var s=(!n||norm(x.dataset.name).indexOf(n)>-1||norm(x.dataset.city).indexOf(n)>-1)&&(!lr.value||x.dataset.region===lr.value)&&(!lc.value||x.dataset.city===lc.value)&&(!lt.value||x.dataset.rite===lt.value);x.hidden=!s;if(s)c++});
    $('#l-count').textContent=c+(c===1?T(' Loja encontrada'):T(' Lojas encontradas'));$('#l-empty').hidden=c>0}
  [lq,lr,lc,lt].forEach(function(el){el.addEventListener('input',lApply);el.addEventListener('change',lApply)});lApply()}
})();
