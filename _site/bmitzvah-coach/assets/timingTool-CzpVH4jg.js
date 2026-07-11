function e(e,t,n,r){let i=document.querySelector(`#ui-root`);i.style.pointerEvents=`auto`,document.querySelector(`#app-canvas`).style.display=`none`;let a=localStorage.getItem(n),o=new Map;(a?JSON.parse(a):r)?.words.forEach(e=>o.set(e.id,{...e}));let s=[...e.keys()].find(t=>!o.has(e[t].id))??e.length,c=Math.max(0,s-1);i.innerHTML=`
    <style>
      #timing { font-family: Rubik, system-ui; color: #e8d8b0; background: #1a120b;
        height: 100vh; display: flex; flex-direction: column; padding: 12px; box-sizing: border-box; }
      #timing header { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
      #timing .help { opacity: 0.7; font-size: 13px; }
      #words { flex: 1; overflow-y: auto; margin-top: 10px; display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 4px; align-content: start; }
      .w { padding: 6px 10px; border-radius: 6px; background: #2a1c10; display: flex;
        justify-content: space-between; gap: 8px; font-size: 14px; cursor: pointer; }
      .w .he { font-family: TaameyFrankCLM, serif; font-size: 17px; }
      .w.next { outline: 2px solid #d4a017; }
      .w.selected { background: #4a3418; }
      .w.marked { color: #9fe09f; }
      .w small { opacity: 0.8; }
      button { background: #d4a017; border: 0; border-radius: 6px; padding: 8px 14px;
        font-weight: 600; cursor: pointer; }
    </style>
    <div id="timing">
      <header>
        <button id="export">Export JSON (E)</button>
        <span id="status"></span>
        <span class="help">Space: mark next · Backspace: undo · ↑↓: select · , .: nudge ±25ms ·
          Enter: replay slice · R: 0.75× · click word: seek</span>
      </header>
      <audio id="audio" src="${t}" controls style="width:100%; margin-top:8px"></audio>
      <div id="words"></div>
    </div>`;let l=i.querySelector(`#audio`),u=i.querySelector(`#words`),d=i.querySelector(`#status`);function f(){let t=[];for(let n=0;n<e.length;n++){let r=o.get(e[n].id);if(!r)break;let i=n+1<e.length?o.get(e[n+1].id):void 0;t.push({id:r.id,start:r.start,end:i?Math.max(r.start+.05,i.start-.02):l.duration||r.start+1})}return t}function p(){let e={audio:t.replace(/^.*\/audio\//,`audio/`),version:1,words:f()};return localStorage.setItem(n,JSON.stringify(e)),e}function m(){u.innerHTML=e.map((e,t)=>{let n=o.get(e.id);return`<div class="${[`w`,t===s?`next`:``,t===c?`selected`:``,n?`marked`:``].filter(Boolean).join(` `)}" data-i="${t}">
          <span class="he">${e.hePointed}</span>
          <span><small>${e.translit}</small> ${n?`<small>${n.start.toFixed(2)}</small>`:``}</span>
        </div>`}).join(``),d.textContent=`${o.size}/${e.length} marked · selected: ${e[c]?.translit??`-`}`}u.addEventListener(`click`,t=>{let n=t.target.closest(`.w`);if(!n)return;c=Number(n.dataset.i);let r=o.get(e[c].id);r&&(l.currentTime=r.start),m()}),document.addEventListener(`keydown`,t=>{if(t.target===l)return;let r=e[c];switch(t.code){case`Space`:{if(t.preventDefault(),s>=e.length)break;let n=Math.max(0,l.currentTime-.08*l.playbackRate);o.set(e[s].id,{id:e[s].id,start:n,end:n+1}),c=s,s++,p();break}case`Backspace`:if(t.preventDefault(),s===0)break;s--,o.delete(e[s].id),c=Math.max(0,s-1),p();break;case`ArrowUp`:t.preventDefault(),c=Math.max(0,c-1);break;case`ArrowDown`:t.preventDefault(),c=Math.min(e.length-1,c+1);break;case`Comma`:case`Period`:{let e=r&&o.get(r.id);if(!e)break;e.start=Math.max(0,e.start+(t.code===`Comma`?-.025:.025)),p();break}case`Enter`:{t.preventDefault();let e=f().find(e=>e.id===r?.id);if(!e)break;l.currentTime=e.start,l.play();let n=()=>{l.currentTime>=e.end&&(l.pause(),l.removeEventListener(`timeupdate`,n))};l.addEventListener(`timeupdate`,n);break}case`KeyR`:l.playbackRate=l.playbackRate===1?.75:1;break;case`KeyE`:{let e=new Blob([JSON.stringify(p(),null,2)],{type:`application/json`}),t=document.createElement(`a`);t.href=URL.createObjectURL(e),t.download=n+`.json`,t.click();break}default:return}m()}),m()}export{e as runTimingTool};