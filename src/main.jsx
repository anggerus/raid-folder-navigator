import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Search, Layers, MapPin, Compass, Plus, Minus, Crosshair, ChevronDown, Menu, X, Trees, Mountain, House, Route, ClipboardList, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import "./style.css";

const photoForest = "https://images.unsplash.com/photo-1525806047694-f14aa78cf38c?auto=format&fit=crop&w=1400&q=80";
const photoCity = "https://images.unsplash.com/photo-1727622607761-d98fbd488858?auto=format&fit=crop&w=1400&q=80";
const photoIndustry = "https://images.unsplash.com/photo-1769778674824-e69f58d7c55d?auto=format&fit=crop&w=1400&q=80";

const locations = [
 {id:"woods",name:"Woods",ru:"Лес",kind:"nature",photo:photoForest,credit:"Natalia CraftTheWay · Unsplash",photoLink:"https://unsplash.com/photos/forest-and-lake-during-daytime-in-landscape-photography-ttfGW6JBfx8",description:"Заповедник, хвойный лес и озёрные берега",points:[["Лесная поляна",18,26],["Берег озера",43,18],["Старая лесопилка",68,40],["Сторожка",34,70]]},
 {id:"shoreline",name:"Shoreline",ru:"Побережье",kind:"coast",photo:photoForest,credit:"Natalia CraftTheWay · Unsplash",photoLink:"https://unsplash.com/photos/forest-and-lake-during-daytime-in-landscape-photography-ttfGW6JBfx8",description:"Побережье, деревня и курортная зона",points:[["Прибрежная тропа",16,64],["Смотровая площадка",44,20],["Сельская улица",70,55],["Главный корпус",78,26]]},
 {id:"customs",name:"Customs",ru:"Таможня",kind:"industry",photo:photoIndustry,credit:"Yunfan Li · Unsplash",photoLink:"https://unsplash.com/photos/white-industrial-building-with-large-windows-and-lush-green-plants-FB7QTOXs6q0",description:"Промышленная зона, склады и городская окраина",points:[["Складской квартал",20,30],["Административное здание",51,22],["Старый мост",75,55],["Железнодорожная станция",39,73]]},
 {id:"factory",name:"Factory",ru:"Завод",kind:"industry",photo:photoIndustry,credit:"Yunfan Li · Unsplash",photoLink:"https://unsplash.com/photos/white-industrial-building-with-large-windows-and-lush-green-plants-FB7QTOXs6q0",description:"Промышленный комплекс и внутренние помещения",points:[["Цех",45,38],["Офисный блок",25,22],["Внутренний двор",72,68]]},
 {id:"reserve",name:"Reserve",ru:"Резерв",kind:"industry",photo:photoIndustry,credit:"Yunfan Li · Unsplash",photoLink:"https://unsplash.com/photos/white-industrial-building-with-large-windows-and-lush-green-plants-FB7QTOXs6q0",description:"Большая территория с административными корпусами",points:[["Центральная площадь",48,44],["Северный корпус",26,20],["Южный корпус",72,70],["Техническое здание",82,30]]},
 {id:"interchange",name:"Interchange",ru:"Развязка",kind:"city",photo:photoCity,credit:"Karolina Bobek · Unsplash",photoLink:"https://unsplash.com/photos/a-narrow-city-street-with-buildings-on-both-sides-sIphHMBuQZo",description:"Городская транспортная зона и большой торговый центр",points:[["Главный вход",47,22],["Парковочная зона",25,66],["Галерея",68,45],["Транспортный узел",82,74]]},
 {id:"lighthouse",name:"Lighthouse",ru:"Маяк",kind:"coast",photo:photoForest,credit:"Natalia CraftTheWay · Unsplash",photoLink:"https://unsplash.com/photos/forest-and-lake-during-daytime-in-landscape-photography-ttfGW6JBfx8",description:"Скалистое побережье и небольшие поселения",points:[["Береговой маяк",78,22],["Прибрежная деревня",30,57],["Смотровой склон",52,18],["Пирс",18,78]]},
 {id:"streets",name:"Streets of Tarkov",ru:"Улицы Таркова",kind:"city",photo:photoCity,credit:"Karolina Bobek · Unsplash",photoLink:"https://unsplash.com/photos/a-narrow-city-street-with-buildings-on-both-sides-sIphHMBuQZo",description:"Плотная городская застройка и улицы",points:[["Городская площадь",48,44],["Жилой квартал",20,25],["Пешеходная улица",72,26],["Деловой центр",65,72]]},
 {id:"groundzero",name:"Ground Zero",ru:"Эпицентр",kind:"city",photo:photoCity,credit:"Karolina Bobek · Unsplash",photoLink:"https://unsplash.com/photos/a-narrow-city-street-with-buildings-on-both-sides-sIphHMBuQZo",description:"Центральный городской квартал",points:[["Площадь",48,45],["Офисный квартал",70,25],["Жилой дом",25,65]]},
 {id:"lab",name:"The Lab",ru:"Лаборатория",kind:"industry",photo:photoIndustry,credit:"Yunfan Li · Unsplash",photoLink:"https://unsplash.com/photos/white-industrial-building-with-large-windows-and-lush-green-plants-FB7QTOXs6q0",description:"Исследовательский комплекс и внутренние помещения",points:[["Центральный холл",50,44],["Лабораторный блок",25,26],["Технический зал",75,68]]},
 {id:"labyrinth",name:"The Labyrinth",ru:"Лабиринт",kind:"industry",photo:photoIndustry,credit:"Yunfan Li · Unsplash",photoLink:"https://unsplash.com/photos/white-industrial-building-with-large-windows-and-lush-green-plants-FB7QTOXs6q0",description:"Подземный комплекс с коридорами и залами",points:[["Центральный зал",50,50],["Северный коридор",48,18],["Восточный зал",78,52]]}
];

// Это авторские ознакомительные задания Field Atlas, а не полный официальный список квестов игры.
const taskTemplates = [
 {id:"visit",name:"Изучить ориентиры локации",type:"Исследование",desc:"Посети отмеченные на схеме нейтральные ориентиры и ознакомься с территорией."},
 {id:"photo",name:"Собрать фотозаметки",type:"Наблюдение",desc:"Отметь интересные архитектурные и природные объекты."},
 {id:"route",name:"Пройти обзорный маршрут",type:"Маршрут",desc:"Последовательно изучи доступные точки интереса на схеме."}
];
const cats=[{id:"nature",label:"Природа",icon:Trees},{id:"buildings",label:"Постройки",icon:House},{id:"routes",label:"Дороги",icon:Route}];

function App(){
 const [active,setActive]=useState("woods");
 const [selectedPoint,setSelectedPoint]=useState(null);
 const [selectedTask,setSelectedTask]=useState(null);
 const [visible,setVisible]=useState(["nature","buildings","routes"]);
 const [query,setQuery]=useState("");
 const [zoom,setZoom]=useState(1);
 const [offset,setOffset]=useState({x:0,y:0});
 const [drag,setDrag]=useState(null);
 const [sidebar,setSidebar]=useState(true);
 const [done,setDone]=useState([]);
 const location=locations.find(x=>x.id===active)||locations[0];
 const points=location.points.map((p,i)=>({id:active+"-"+i,name:p[0],x:p[1],y:p[2],type:i%3===0?"nature":i%3===1?"buildings":"routes",note:"Ознакомительный ориентир на схематичной карте"}));
 const shown=points.filter(p=>visible.includes(p.type)&&p.name.toLowerCase().includes(query.toLowerCase()));
 const tasks=taskTemplates.map(t=>({...t,points:points.slice(0,t.id==="visit"?points.length:t.id==="photo"?Math.min(2,points.length):Math.min(3,points.length))}));
 const activeTask=tasks.find(t=>t.id===selectedTask);
 const toggle=(id)=>setVisible(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
 const zoomBy=n=>setZoom(z=>Math.min(2.4,Math.max(.7,+(z+n).toFixed(2))));
 const startDrag=e=>{if(e.button!==0)return;setDrag({x:e.clientX-offset.x,y:e.clientY-offset.y});};
 const moveDrag=e=>{if(drag)setOffset({x:e.clientX-drag.x,y:e.clientY-drag.y});};
 const taskPoints=activeTask?.points||[];
 return <div className="app">
  <header className="topbar">
   <button className="iconbtn mobile-only" onClick={()=>setSidebar(!sidebar)} aria-label="Меню">{sidebar?<X/>:<Menu/>}</button>
   <div className="brand"><div className="brandmark"><Compass size={22}/></div><div><b>FIELD ATLAS</b><small>COMMUNITY MAPS</small></div></div>
   <div className="top-divider"/>
   <div className="map-select"><span>ЛОКАЦИЯ</span><select value={active} onChange={e=>{setActive(e.target.value);setSelectedPoint(null);setSelectedTask(null);setZoom(1);setOffset({x:0,y:0})}}>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
   <div className="top-spacer"/>
   <div className="status"><i/> FIELD ATLAS · 11 ЛОКАЦИЙ</div>
   <button className="avatar" title="Field Atlas">FA</button>
  </header>
  <main className="layout">
   <aside className={sidebar?"sidebar open":"sidebar"}>
    <div className="side-head"><div><span className="eyebrow">ОБЗОР ЛОКАЦИИ</span><h1>{location.name}</h1><p>{location.description}</p></div><span className="tag">11 MAPS</span></div>
    <div className="location-photo" style={{backgroundImage:"linear-gradient(0deg,#111a14d9,transparent 65%),url("+location.photo+")"}}>
      <div><span className="eyebrow">ВИЗУАЛЬНЫЙ ОРИЕНТИР</span><b>{location.ru}</b></div>
      <a href={location.photoLink} target="_blank" rel="noreferrer">Фото: {location.credit}</a>
    </div>
    <div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Найти ориентир..."/>{query&&<button onClick={()=>setQuery("")}>×</button>}</div>
    <section className="section"><div className="section-title"><span><Layers size={15}/> СЛОИ КАРТЫ</span><button onClick={()=>setVisible(visible.length===3?[]:["nature","buildings","routes"])}>{visible.length===3?"Скрыть всё":"Показать всё"}</button></div>
     {cats.map(c=><button className="layer-row" key={c.id} onClick={()=>toggle(c.id)}><span className="layer-icon"><c.icon size={17}/></span><span>{c.label}</span><span className={visible.includes(c.id)?"switch on":"switch"}><i/></span></button>)}
    </section>
    <section className="section task-section"><div className="section-title"><span><ClipboardList size={15}/> ЗАДАНИЯ FIELD ATLAS</span><small>{tasks.length}</small></div>
     {tasks.map(t=><button key={t.id} className={"task-row "+(selectedTask===t.id?"chosen":"")} onClick={()=>{setSelectedTask(selectedTask===t.id?null:t.id);setSelectedPoint(null)}}><span className="task-icon"><MapPin size={15}/></span><span className="place-copy"><b>{t.name}</b><small>{t.type} · {t.points.length} точек</small></span><span className="arrow">↗</span></button>)}
     {activeTask&&<div className="task-detail"><b>{activeTask.name}</b><p>{activeTask.desc}</p><small>Точки задания выделены на схеме.</small></div>}
    </section>
    <section className="section places"><div className="section-title"><span><MapPin size={15}/> ОРИЕНТИРЫ</span><small>{shown.length} НА КАРТЕ</small></div>
     {shown.map(p=><button key={p.id} className={"place-row "+(selectedPoint?.id===p.id?"chosen":"")} onClick={()=>{setSelectedPoint(p);setSidebar(false)}}><span className={"place-dot "+p.type}/><span className="place-copy"><b>{p.name}</b><small>{p.note}</small></span><span className="arrow">↗</span></button>)}
     {!shown.length&&<div className="empty">Ничего не найдено</div>}
    </section>
    <div className="side-footer"><span>FIELD ATLAS <b>v2.0</b></span><span>ОЗНАКОМИТЕЛЬНЫЕ СХЕМЫ</span></div>
   </aside>
   <section className="map-area">
    <div className="map-toolbar"><div className="crumb"><span>КАРТЫ</span><b>/</b><strong>{location.name.toUpperCase()}</strong></div><div className="tool-actions"><button onClick={()=>{setZoom(1);setOffset({x:0,y:0})}}><Crosshair size={15}/> Сбросить вид</button><button onClick={()=>setSidebar(!sidebar)}><Layers size={15}/> Панель</button></div></div>
    <div className="map-viewport" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={()=>setDrag(null)} onPointerLeave={()=>setDrag(null)}>
     <div className="map-canvas" style={{transform:"translate("+offset.x+"px,"+offset.y+"px) scale("+zoom+")"}}>
      <svg className="terrain" viewBox="0 0 1000 760" preserveAspectRatio="xMidYMid slice">
       <defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#a3b59a" strokeOpacity=".10" strokeWidth="1"/></pattern><pattern id="forest" width="95" height="82" patternUnits="userSpaceOnUse"><path d="M18 8l-12 24h8l-11 20h30L22 32h8z" fill="#1c382c" opacity=".46"/><path d="M67 33l-10 19h7l-9 16h25L69 52h7z" fill="#294b36" opacity=".48"/></pattern></defs>
       <rect width="1000" height="760" fill={location.kind==="city"?"#8f9b8c":location.kind==="industry"?"#9d9c89":"#9cae8e"}/><rect width="1000" height="760" fill="url(#forest)" opacity={location.kind==="nature"?.9:location.kind==="coast"?.35:.18}/><rect width="1000" height="760" fill="url(#grid)"/>
       <path d="M-30 170 Q170 100 270 210 T510 190 T760 230 T1040 120 L1040 0H-30Z" fill="#829b78" opacity=".65"/><path d="M-20 520 Q160 430 310 510 T590 490 T1020 560 L1020 790H-20Z" fill="#829879" opacity=".6"/>
       <path d="M-30 365 C130 320 180 420 310 370 S500 280 630 350 S850 420 1030 310" fill="none" stroke="#b7b48e" strokeWidth="26" opacity=".7"/><path d="M-30 365 C130 320 180 420 310 370 S500 280 630 350 S850 420 1030 310" fill="none" stroke="#e0d5ad" strokeWidth="13" opacity=".85"/>
       <path d="M160 -20 Q260 140 390 220 T590 420 T840 790" fill="none" stroke="#718e80" strokeWidth="18" opacity=".85"/><path d="M160 -20 Q260 140 390 220 T590 420 T840 790" fill="none" stroke="#b4c4aa" strokeWidth="7" opacity=".9"/>
       <g fill="#6b765a" opacity=".9"><rect x="640" y="225" width="64" height="38" rx="4"/><rect x="292" y="452" width="82" height="52" rx="4"/><rect x="455" y="350" width="54" height="32" rx="4"/></g>
       {Array.from({length:30},(_,i)=><path key={i} d={"M"+(40+(i*137)%930)+" "+(35+(i*83)%680)+" q 35 -22 65 0"} fill="none" stroke="#d7d6ad" strokeWidth="2" opacity=".35"/>)}
      </svg>
      <div className="map-label label-north">{location.name.toUpperCase()} <small>{location.ru.toUpperCase()}</small></div><div className="map-label label-woods">FIELD ATLAS <small>СХЕМАТИЧНАЯ СХЕМА</small></div><div className="map-label label-creek">LANDMARKS</div>
      {(activeTask?taskPoints:shown).map(p=><button key={p.id} className={"marker "+p.type+(selectedPoint?.id===p.id?" selected":"")+(activeTask?" task-marker":"")} style={{left:p.x+"%",top:p.y+"%"}} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setSelectedPoint(p)}}><span className="pin-core"><MapPin size={14}/></span><span className="marker-label">{p.name}</span></button>)}
     </div>
     <div className="north">N <Compass size={20}/></div>
     <div className="zoom"><button onClick={()=>zoomBy(.15)}><Plus/></button><span>{Math.round(zoom*100)}%</span><button onClick={()=>zoomBy(-.15)}><Minus/></button></div>
     <div className="map-hint">ПЕРЕТАСКИВАЙТЕ КАРТУ · ВЫБИРАЙТЕ ОРИЕНТИРЫ</div>
     {selectedPoint&&<div className="detail"><button className="detail-close" onClick={()=>setSelectedPoint(null)}><X size={16}/></button><span className="eyebrow">ВЫБРАННЫЙ ОРИЕНТИР</span><h3>{selectedPoint.name}</h3><p>{selectedPoint.note}</p><span className="detail-coord">СХЕМАТИЧЕСКАЯ МЕТКА · {selectedPoint.x} / {selectedPoint.y}</span></div>}
    </div>
    <footer className="map-footer"><span><i className="legend-dot"/> СХЕМАТИЧЕСКАЯ КАРТА</span><span>{activeTask?"ЗАДАНИЕ: "+activeTask.name.toUpperCase():location.name.toUpperCase()} · {Math.round(zoom*100)}%</span><span>FIELD ATLAS © 2026</span></footer>
   </section>
  </main>
  <div className="disclaimer">Фотографии — иллюстрации локаций, не игровые скриншоты. Задания Field Atlas ознакомительные; это не полный официальный каталог квестов и не точная игровая навигация.</div>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);
