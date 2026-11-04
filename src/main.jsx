import React, { useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Search, Layers, MapPin, Compass, Plus, Minus, Crosshair, ChevronDown, Menu, X, Trees, Mountain, House, Route, Eye, EyeOff } from "lucide-react";
import "./style.css";

const places = [
  { id:1, name:"Старая лесная дорога", type:"routes", x:22, y:28, note:"Извилистая дорога через северную часть леса" },
  { id:2, name:"Лесная поляна", type:"nature", x:43, y:20, note:"Открытая поляна среди деревьев" },
  { id:3, name:"Сторожка", type:"buildings", x:68, y:33, note:"Небольшое строение у дороги" },
  { id:4, name:"Северный мост", type:"routes", x:79, y:16, note:"Переход через ручей" },
  { id:5, name:"Заброшенный лагерь", type:"buildings", x:31, y:62, note:"Группа старых построек" },
  { id:6, name:"Каменистый склон", type:"nature", x:57, y:76, note:"Возвышенность с каменистым рельефом" },
  { id:7, name:"Южная тропа", type:"routes", x:83, y:69, note:"Тропа вдоль края леса" },
  { id:8, name:"Смотровая площадка", type:"nature", x:13, y:79, note:"Открытый участок с видом на долину" },
  { id:9, name:"Лесной домик", type:"buildings", x:48, y:48, note:"Отдельное небольшое здание" },
];
const categories = [
  {id:"nature",label:"Местность",icon:Trees,color:"#91b77a"},
  {id:"buildings",label:"Постройки",icon:House,color:"#d6b27b"},
  {id:"routes",label:"Дороги и тропы",icon:Route,color:"#8eb8c4"},
];
function App(){
 const [active,setActive]=useState("woods");
 const [visible,setVisible]=useState(["nature","buildings","routes"]);
 const [selected,setSelected]=useState(null);
 const [query,setQuery]=useState("");
 const [zoom,setZoom]=useState(1);
 const [offset,setOffset]=useState({x:0,y:0});
 const [drag,setDrag]=useState(null);
 const [sidebar,setSidebar]=useState(true);
 const svgRef=useRef(null);
 const shown=useMemo(()=>places.filter(p=>visible.includes(p.type)&&p.name.toLowerCase().includes(query.toLowerCase())),[visible,query]);
 const toggle=(id)=>setVisible(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
 const startDrag=e=>{if(e.button!==0)return;setDrag({x:e.clientX-offset.x,y:e.clientY-offset.y});};
 const moveDrag=e=>{if(drag)setOffset({x:e.clientX-drag.x,y:e.clientY-drag.y});};
 const endDrag=()=>setDrag(null);
 const zoomBy=n=>setZoom(z=>Math.min(2.4,Math.max(.7,+(z+n).toFixed(2))));
 return <div className="app">
  <header className="topbar">
   <button className="iconbtn mobile-only" onClick={()=>setSidebar(!sidebar)} aria-label="Меню">{sidebar?<X/>:<Menu/>}</button>
   <div className="brand"><div className="brandmark"><Compass size={22}/></div><div><b>FIELD ATLAS</b><small>COMMUNITY MAPS</small></div></div>
   <div className="top-divider"/>
   <div className="map-select"><span>ЛОКАЦИЯ</span><button onClick={()=>setActive(active==="woods"?"shoreline":"woods")}>{active==="woods"?"Woods":"Shoreline"} <ChevronDown size={15}/></button></div>
   <div className="top-spacer"/>
   <div className="status"><i/> КАРТА СООБЩЕСТВА</div>
   <button className="avatar" title="Локальный профиль">FA</button>
  </header>
  <main className="layout">
   <aside className={sidebar?"sidebar open":"sidebar"}>
    <div className="side-head"><div><span className="eyebrow">ОБЗОР ЛОКАЦИИ</span><h1>{active==="woods"?"Woods":"Shoreline"}</h1><p>Лесная местность · схема-ориентир</p></div><span className="tag">01 / 02</span></div>
    <div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Найти ориентир..."/>{query&&<button onClick={()=>setQuery("")}>×</button>}</div>
    <section className="section"><div className="section-title"><span><Layers size={15}/> СЛОИ КАРТЫ</span><button onClick={()=>setVisible(visible.length===3?[]:["nature","buildings","routes"])}>{visible.length===3?"Скрыть всё":"Показать всё"}</button></div>
     {categories.map(c=><button className="layer-row" key={c.id} onClick={()=>toggle(c.id)}><span className="layer-icon" style={{color:c.color}}><c.icon size={17}/></span><span>{c.label}</span><span className={visible.includes(c.id)?"switch on":"switch"}><i/></span></button>)}
    </section>
    <section className="section places"><div className="section-title"><span><MapPin size={15}/> ОРИЕНТИРЫ</span><small>{shown.length} НА КАРТЕ</small></div>
     {shown.map(p=><button key={p.id} className={"place-row "+(selected?.id===p.id?"chosen":"")} onClick={()=>{setSelected(p);setSidebar(false)}}><span className={"place-dot "+p.type}/><span className="place-copy"><b>{p.name}</b><small>{p.note}</small></span><span className="arrow">↗</span></button>)}
     {!shown.length&&<div className="empty">Ничего не найдено</div>}
    </section>
    <div className="side-footer"><span>FIELD ATLAS <b>v1.1</b></span><span>СХЕМА, НЕ НАВИГАЦИОННЫЕ ДАННЫЕ</span></div>
   </aside>
   <section className="map-area">
    <div className="map-toolbar"><div className="crumb"><span>КАРТЫ</span><b>/</b><strong>{active.toUpperCase()}</strong></div><div className="tool-actions"><button onClick={()=>{setZoom(1);setOffset({x:0,y:0})}}><Crosshair size={15}/> Сбросить вид</button><button onClick={()=>setSidebar(!sidebar)}><Layers size={15}/> Панель</button></div></div>
    <div className="map-viewport" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerLeave={endDrag}>
     <div className="map-canvas" style={{transform:"translate("+offset.x+"px,"+offset.y+"px) scale("+zoom+")"}}>
      <svg className="terrain" viewBox="0 0 1000 760" preserveAspectRatio="xMidYMid slice">
       <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#a3b59a" strokeOpacity=".10" strokeWidth="1"/></pattern>
        <pattern id="forest" width="95" height="82" patternUnits="userSpaceOnUse"><path d="M18 8l-12 24h8l-11 20h30L22 32h8z" fill="#1c382c" opacity=".46"/><path d="M67 33l-10 19h7l-9 16h25L69 52h7z" fill="#294b36" opacity=".48"/></pattern>
       </defs>
       <rect width="1000" height="760" fill="#9cae8e"/><rect width="1000" height="760" fill="url(#forest)"/><rect width="1000" height="760" fill="url(#grid)"/>
       <path d="M-30 170 Q170 100 270 210 T510 190 T760 230 T1040 120 L1040 0H-30Z" fill="#829b78" opacity=".8"/>
       <path d="M-20 520 Q160 430 310 510 T590 490 T1020 560 L1020 790H-20Z" fill="#829879" opacity=".7"/>
       <path d="M-30 365 C130 320 180 420 310 370 S500 280 630 350 S850 420 1030 310" fill="none" stroke="#b7b48e" strokeWidth="26" opacity=".7"/>
       <path d="M-30 365 C130 320 180 420 310 370 S500 280 630 350 S850 420 1030 310" fill="none" stroke="#e0d5ad" strokeWidth="13" opacity=".85"/>
       <path d="M160 -20 Q260 140 390 220 T590 420 T840 790" fill="none" stroke="#718e80" strokeWidth="18" opacity=".85"/>
       <path d="M160 -20 Q260 140 390 220 T590 420 T840 790" fill="none" stroke="#b4c4aa" strokeWidth="7" opacity=".9"/>
       <path d="M70 80 Q190 150 290 120 T510 90 T760 150 T970 90 M40 630 Q200 570 340 620 T640 650 T960 590" fill="none" stroke="#d2d4b0" strokeWidth="2" strokeDasharray="7 9" opacity=".65"/>
       {Array.from({length:32},(_,i)=><path key={i} d={"M"+(40+(i*137)%930)+" "+(35+(i*83)%680)+" q 35 -22 65 0"} fill="none" stroke="#d7d6ad" strokeWidth="2" opacity=".35"/>)}
       <g fill="#566e50" opacity=".8"><path d="M80 250l55-35 45 30-28 46-55-5z"/><path d="M690 520l72-40 52 35-40 54-66-8z"/><path d="M390 90l55-28 45 26-24 45-58-3z"/></g>
       <g fill="#6b765a" opacity=".9"><rect x="640" y="225" width="64" height="38" rx="4"/><rect x="292" y="452" width="82" height="52" rx="4"/><rect x="455" y="350" width="54" height="32" rx="4"/></g>
       <g fill="none" stroke="#e4e0bd" strokeWidth="2" opacity=".55"><path d="M0 110 Q200 50 390 120 T780 95 T1000 60"/><path d="M0 680 Q230 610 400 690 T760 680 T1000 650"/><path d="M80 0 Q30 180 100 320 T70 760"/><path d="M920 0 Q850 170 920 360 T900 760"/></g>
      </svg>
      <div className="map-label label-north">NORTH RIDGE <small>СЕВЕРНЫЙ ХРЕБЕТ</small></div><div className="map-label label-woods">WOODED AREA <small>ЛЕСНОЙ МАССИВ</small></div><div className="map-label label-creek">CREEK <small>РУЧЕЙ</small></div>
      {shown.map(p=><button key={p.id} className={"marker "+p.type+(selected?.id===p.id?" selected":"")} style={{left:p.x+"%",top:p.y+"%"}} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setSelected(p)}}><span className="pin-core"><MapPin size={14}/></span><span className="marker-label">{p.name}</span></button>)}
     </div>
     <div className="north">N <Compass size={20}/></div>
     <div className="zoom"><button onClick={()=>zoomBy(.15)}><Plus/></button><span>{Math.round(zoom*100)}%</span><button onClick={()=>zoomBy(-.15)}><Minus/></button></div>
     <div className="map-hint">ПЕРЕТАСКИВАЙТЕ КАРТУ · НАЖИМАЙТЕ НА МЕТКИ</div>
     {selected&&<div className="detail"><button className="detail-close" onClick={()=>setSelected(null)}><X size={16}/></button><span className="eyebrow">ВЫБРАННЫЙ ОРИЕНТИР</span><h3>{selected.name}</h3><p>{selected.note}</p><span className="detail-coord">СХЕМАТИЧЕСКАЯ МЕТКА · {String(selected.x).padStart(2,"0")} / {String(selected.y).padStart(2,"0")}</span></div>}
    </div>
    <footer className="map-footer"><span><i className="legend-dot"/> СХЕМАТИЧЕСКАЯ КАРТА</span><span>МАСШТАБ {Math.round(zoom*100)}% · {shown.length} ОРИЕНТИРОВ</span><span>FIELD ATLAS © 2026</span></footer>
   </section>
  </main>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);
