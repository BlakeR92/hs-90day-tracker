import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, CheckCircle2, ChevronDown, Download, Flame, ListChecks, PartyPopper, Settings, User2, BarChart3, Target, Rocket, Clock } from 'lucide-react'
import confetti from 'canvas-confetti'

const HS = {
  orange: '#ff5c35',
  teal: '#00a4bd',
  navy: '#33475b',
  sand: '#fef6f3',
  mint: '#e6f5f7',
  grey: '#eaf0f6',
}

const LS_KEY = 'hs-90day-tracker-v1'
const load = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') } catch { return null }
}
const save = (data:any) => localStorage.setItem(LS_KEY, JSON.stringify(data))

interface Task { id:string; text:string; done:boolean; phase:1|2|3; weight?:number }

const DEFAULT_TASKS: Task[] = [
  { id:'p1-1', text:'Complete mandatory onboarding & Academy modules', done:false, phase:1, weight:2 },
  { id:'p1-2', text:'Shadow 3+ calls with top CSMs', done:false, phase:1 },
  { id:'p1-3', text:'Map key internal partners (Sales, SEs, Support)', done:false, phase:1 },
  { id:'p1-4', text:'Review portfolio: history, usage, renewals', done:false, phase:1 },
  { id:'p1-5', text:'Draft account insight notes for each client', done:false, phase:1 },
  { id:'p2-1', text:'Intro calls with all assigned accounts', done:false, phase:2, weight:2 },
  { id:'p2-2', text:'Deliver 2–3 quick wins (automation, dashboards, pipeline)', done:false, phase:2 },
  { id:'p2-3', text:'Start light-touch QBRs with top accounts', done:false, phase:2 },
  { id:'p2-4', text:'Document 1–2 expansion opportunities', done:false, phase:2 },
  { id:'p2-5', text:'Engage at least 80% of portfolio', done:false, phase:2 },
  { id:'p3-1', text:'Run full strategic QBRs (data + outcomes)', done:false, phase:3, weight:2 },
  { id:'p3-2', text:'Create renewal plans; secure 1 early renewal', done:false, phase:3 },
  { id:'p3-3', text:'Mitigation plan for at-risk accounts', done:false, phase:3 },
  { id:'p3-4', text:'Ensure every account has a Success Plan in CRM', done:false, phase:3 },
  { id:'p3-5', text:'Share one team process improvement', done:false, phase:3 },
]

const ProgressRing = ({value}:{value:number}) => {
  const size = 88, stroke = 10
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (value/100) * circ
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size/2} cy={size/2} r={radius} stroke={HS.grey} strokeWidth={stroke} fill="none"/>
      <circle cx={size/2} cy={size/2} r={radius} stroke={HS.orange} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="font-semibold" fill={HS.navy}>{Math.round(value)}%</text>
    </svg>
  )
}

const Pill = ({icon:Icon, text}:{icon:any, text:string}) => (
  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs" style={{borderColor:HS.teal,color:HS.navy}}>
    <Icon size={14}/>{text}
  </span>
)

const Card = ({children}:{children:React.ReactNode}) => (
  <div className="rounded-2xl shadow-sm p-5 bg-white border" style={{borderColor:HS.grey}}>{children}</div>
)

const PhaseHeader = ({phase, title, subtitle, expanded, onToggle}:{phase:1|2|3; title:string; subtitle:string; expanded:boolean; onToggle:()=>void}) => (
  <button onClick={onToggle} className="w-full flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background: phase===1?HS.sand:phase===2?HS.mint:'#f6f7f9'}}>
        {phase===1 && <Clock color={HS.orange}/>} 
        {phase===2 && <Flame color={HS.teal}/>} 
        {phase===3 && <Rocket color={HS.navy}/>} 
      </div>
      <div className="text-left">
        <div className="font-semibold text-lg" style={{color:HS.navy}}>Phase {phase} – {title}</div>
        <div className="text-sm opacity-80" style={{color:HS.navy}}>{subtitle}</div>
      </div>
    </div>
    <ChevronDown className={`transition ${expanded?'rotate-180':''}`} />
  </button>
)

const Metric = ({icon:Icon, label, value}:{icon:any; label:string; value:string}) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:HS.grey}}><Icon/></div>
    <div>
      <div className="text-xs uppercase tracking-wide opacity-70" style={{color:HS.navy}}>{label}</div>
      <div className="font-semibold" style={{color:HS.navy}}>{value}</div>
    </div>
  </div>
)

const Celebrate = ({show}:{show:boolean}) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="flex items-center gap-2 text-sm rounded-xl px-3 py-2" style={{background:HS.sand, color:HS.navy}}>
        <PartyPopper size={16}/> Milestone unlocked — awesome work!
      </motion.div>
    )}
  </AnimatePresence>
)

export default function App(){
  const stored = load()
  const [name, setName] = useState<string>(stored?.name || 'Blake Riddington')
  const [manager, setManager] = useState<string>(stored?.manager || '')
  const [startDate, setStartDate] = useState<string>(stored?.startDate || '2025-09-01')
  const [tasks, setTasks] = useState<Task[]>(stored?.tasks || DEFAULT_TASKS)
  const [expanded, setExpanded] = useState<Record<number, boolean>>(stored?.expanded || {1:true,2:false,3:false})
  const [celebrate, setCelebrate] = useState(false)
  const [kpis, setKpis] = useState<any>(stored?.kpis || {
    portfolioSize: 35,
    renewalTargetPct: 92,
    nrrTargetPct: 105,
    expansionTarget: 120000,
    tierSplitA: 30,
    tierSplitB: 50,
    tierSplitC: 20,
    qbrCadenceA: 'Monthly',
    qbrCadenceB: 'Bi‑monthly',
    qbrCadenceC: 'Quarterly',
    currency: 'AUD'
  })

  const loadANZPreset = () => setKpis({
    portfolioSize: 35,
    renewalTargetPct: 92,
    nrrTargetPct: 105,
    expansionTarget: 120000,
    tierSplitA: 30,
    tierSplitB: 50,
    tierSplitC: 20,
    qbrCadenceA: 'Monthly',
    qbrCadenceB: 'Bi‑monthly',
    qbrCadenceC: 'Quarterly',
    currency: 'AUD'
  })

  const today = new Date()
  const sd = startDate ? new Date(startDate) : null
  const daysElapsed = useMemo(()=> sd ? Math.max(0, Math.floor((today.getTime()-sd.getTime())/86400000)) : 0, [startDate])
  const currentPhase = daysElapsed<=30?1:daysElapsed<=60?2:3

  const weightedProgress = (phase:1|2|3) => {
    const list = tasks.filter(t=>t.phase===phase)
    const totalWeight = list.reduce((s,t)=> s + (t.weight || 1), 0)
    const doneWeight = list.filter(t=>t.done).reduce((s,t)=> s + (t.weight || 1), 0)
    return totalWeight ? (doneWeight/totalWeight)*100 : 0
  }
  const overall = useMemo(()=>{
    const w1 = weightedProgress(1), w2 = weightedProgress(2), w3 = weightedProgress(3)
    return Math.round((w1+w2+w3)/3)
  },[tasks])

  useEffect(()=>{
    save({name, manager, startDate, tasks, expanded, kpis})
  },[name, manager, startDate, tasks, expanded, kpis])

  useEffect(()=>{
    if ([25,50,75,100].includes(Math.round(overall))) {
      setCelebrate(true)
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.2 } })
      setTimeout(()=> setCelebrate(false), 2500)
    }
  },[overall])

  const toggleTask = (id:string) => setTasks(prev => prev.map(t => t.id===id ? {...t, done:!t.done}: t))
  const resetAll = () => {
    if (confirm('Reset tracker? This will clear all progress.')){
      setTasks(DEFAULT_TASKS)
      setExpanded({1:true,2:false,3:false})
      setManager('')
      setStartDate('')
    }
  }
  const printPDF = () => window.print()

  const tierCounts = {
    A: Math.round((kpis.portfolioSize||0) * (kpis.tierSplitA||0) / 100),
    B: Math.round((kpis.portfolioSize||0) * (kpis.tierSplitB||0) / 100),
    C: Math.round((kpis.portfolioSize||0) * (kpis.tierSplitC||0) / 100),
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid gap-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{color:HS.navy}}>First 90 Days – Senior CSM Success Plan</h1>
            <p className="mt-1 text-sm" style={{color:HS.navy}}>A HubSpot-style, interactive one-pager to keep you focused, celebrate milestones, and showcase impact.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill icon={User2} text={`Name: ${name || '—'}`}/>
              <Pill icon={Settings} text={`Manager: ${manager || '—'}`}/>
              <Pill icon={CalendarDays} text={`Start: ${startDate || '—'}`}/>
              <Pill icon={Flame} text={`Day ${daysElapsed || 0} of 90`}/>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={printPDF} className="px-3 py-2 rounded-xl border text-sm flex items-center gap-2" style={{borderColor:HS.grey,color:HS.navy}}><Download size={16}/> Export / Print</button>
            <button onClick={resetAll} className="px-3 py-2 rounded-xl text-sm" style={{background:HS.orange,color:'white'}}>Reset</button>
          </div>
        </div>

        <Card>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-3 grid gap-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wide" style={{color:HS.navy}}>Your name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} placeholder="Your name"/>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide" style={{color:HS.navy}}>Manager</label>
                  <input value={manager} onChange={e=>setManager(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} placeholder="Manager name"/>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide" style={{color:HS.navy}}>Start date</label>
                  <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}}/>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <div className="flex items-center justify-between">
                    <Metric icon={BarChart3} label="Overall Progress" value={`${overall}%`}/>
                    <ProgressRing value={overall}/>
                  </div>
                </Card>
                <Card>
                  <Metric icon={Target} label="Next Milestone" value={overall<25?'25%':overall<50?'50%':overall<75?'75%':'100%'}/>
                  <div className="mt-2"><Celebrate show={celebrate}/></div>
                </Card>
                <Card>
                  <Metric icon={ListChecks} label="Tasks Complete" value={`${tasks.filter(t=>t.done).length}/${tasks.length}`}/>
                </Card>
              </div>

              <Card>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold" style={{color:HS.navy}}>KPIs (editable) — ANZ Corporate</div>
                  <button onClick={loadANZPreset} className="px-3 py-1 rounded-xl text-xs" style={{background:HS.grey}}>Load preset</button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wide" style={{color:HS.navy}}>Portfolio size</label>
                    <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.portfolioSize} onChange={e=>setKpis({...kpis, portfolioSize:Number(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide" style={{color:HS.navy}}>GRR target %</label>
                    <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.renewalTargetPct} onChange={e=>setKpis({...kpis, renewalTargetPct:Number(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide" style={{color:HS.navy}}>NRR target %</label>
                    <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.nrrTargetPct} onChange={e=>setKpis({...kpis, nrrTargetPct:Number(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide" style={{color:HS.navy}}>Expansion target ({kpis.currency})</label>
                    <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.expansionTarget} onChange={e=>setKpis({...kpis, expansionTarget:Number(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide" style={{color:HS.navy}}>Tier split A/B/C %</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.tierSplitA} onChange={e=>setKpis({...kpis, tierSplitA:Number(e.target.value)})}/>
                      <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.tierSplitB} onChange={e=>setKpis({...kpis, tierSplitB:Number(e.target.value)})}/>
                      <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.tierSplitC} onChange={e=>setKpis({...kpis, tierSplitC:Number(e.target.value)})}/>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide" style={{color:HS.navy}}>QBR cadence A/B/C</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.qbrCadenceA} onChange={e=>setKpis({...kpis, qbrCadenceA:e.target.value})}/>
                      <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.qbrCadenceB} onChange={e=>setKpis({...kpis, qbrCadenceB:e.target.value})}/>
                      <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{borderColor:HS.grey}} value={kpis.qbrCadenceC} onChange={e=>setKpis({...kpis, qbrCadenceC:e.target.value})}/>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs opacity-70" style={{color:HS.navy}}>Tip: Use the preset, then fine-tune. These values are saved locally with your tracker.</div>
              </Card>
            </div>

            <div className="md:col-span-1 p-4 rounded-2xl" style={{background:HS.mint}}>
              <div className="font-semibold mb-2" style={{color:HS.navy}}>Success Goals by Day 90</div>
              <ul className="text-sm list-disc pl-5 space-y-1" style={{color:HS.navy}}>
                <li>Own portfolio with strong relationships</li>
                <li>Drive adoption in ≥30% of accounts</li>
                <li>Secure at least 1 early renewal</li>
                <li>Mitigate risks with action plans</li>
                <li>Share 1 team process improvement</li>
              </ul>
            </div>
          </div>
        </Card>

        {[1,2,3].map((p)=>{
          const items = tasks.filter(t=>t.phase===p as 1|2|3)
          const progress = (()=>{
            const list = tasks.filter(t=>t.phase===p as 1|2|3)
            const totalWeight = list.reduce((s,t)=> s + (t.weight || 1), 0)
            const doneWeight = list.filter(t=>t.done).reduce((s,t)=> s + (t.weight || 1), 0)
            return totalWeight ? (doneWeight/totalWeight)*100 : 0
          })()
          return (
            <Card key={p}>
              <PhaseHeader
                phase={p as 1|2|3}
                title={p===1?'Learn & Connect':p===2?'Build Relationships & Quick Wins':'Own & Optimise'}
                subtitle={p===1?'Absorb, shadow, map stakeholders':p===2?'Intro calls, wins, light QBRs':'Full QBRs, renewals, risk & process'}
                expanded={!!expanded[p]}
                onToggle={()=> setExpanded(prev=>({...prev, [p]:!prev[p]}))}
              />
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-2 rounded-full" style={{background:HS.grey}}>
                  <div className="h-2 rounded-full" style={{width:`${progress}%`, background: p===1?HS.orange:p===2?HS.teal:HS.navy}} />
                </div>
                <span className="text-sm font-medium" style={{color:HS.navy}}>{Math.round(progress)}%</span>
              </div>
              <AnimatePresence initial={false}>
                {expanded[p] && (
                  <motion.div initial={{opacity:0, y:-6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}} className="grid md:grid-cols-2 gap-3">
                    {items.map(item=> (
                      <label key={item.id} className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:shadow-sm transition" style={{borderColor:HS.grey}}>
                        <input type="checkbox" checked={item.done} onChange={()=> setTasks(prev => prev.map(t => t.id===item.id ? {...t, done:!t.done}: t))} className="mt-1 h-4 w-4"/>
                        <div className="flex-1">
                          <div className="text-sm" style={{color:HS.navy}}>{item.text}</div>
                          {item.weight===2 && (
                            <div className="mt-1 inline-flex items-center gap-1 text-xs" style={{color:HS.orange}}>
                              <CheckCircle2 size={14}/> High-impact
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold" style={{color:HS.navy}}>Notes / Risks</div>
              <span className="text-xs opacity-70" style={{color:HS.navy}}>Private to you (saved locally)</span>
            </div>
            <textarea placeholder="Jot risks, blockers, follow-ups…" className="w-full min-h-[140px] rounded-xl border p-3" style={{borderColor:HS.grey}}
              defaultValue={stored?.notes || ''}
              onBlur={(e)=>{ save({...load(), notes:e.target.value}); }}
            />
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold flex items-center gap-2" style={{color:HS.navy}}>
                <TrophyIcon/> Wins & Kudos
              </div>
              <span className="text-xs opacity-70" style={{color:HS.navy}}>Celebrate progress</span>
            </div>
            <WinsList />
            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm" style={{color:HS.navy}}>
              <div className="p-3 rounded-xl border" style={{borderColor:HS.grey}}>
                <div className="opacity-70 text-xs">Tier A / B / C</div>
                <div className="font-semibold">{tierCounts.A} / {tierCounts.B} / {tierCounts.C}</div>
              </div>
              <div className="p-3 rounded-xl border" style={{borderColor:HS.grey}}>
                <div className="opacity-70 text-xs">QBR cadence A/B/C</div>
                <div className="font-semibold">{kpis.qbrCadenceA} / {kpis.qbrCadenceB} / {kpis.qbrCadenceC}</div>
              </div>
              <div className="p-3 rounded-xl border" style={{borderColor:HS.grey}}>
                <div className="opacity-70 text-xs">Targets</div>
                <div className="font-semibold">GRR {kpis.renewalTargetPct}% · NRR {kpis.nrrTargetPct}% · {kpis.currency} {Intl.NumberFormat().format(kpis.expansionTarget)}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center text-xs opacity-70" style={{color:HS.navy}}>
          Built with ❤️ to mirror HubSpot’s HEART values — humble, empathetic, adaptable, remarkable, transparent.
        </div>
      </div>
    </div>
  )
}

function TrophyIcon(){
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 5h3v2a5 5 0 0 1-5 5h-1" stroke={HS.navy} strokeWidth="1.5"/>
      <path d="M6 5H3v2a5 5 0 0 0 5 5h1" stroke={HS.navy} strokeWidth="1.5"/>
      <path d="M8 5a4 4 0 1 1 8 0v4a4 4 0 1 1-8 0V5Z" stroke={HS.navy} strokeWidth="1.5"/>
      <path d="M9 17h6v2a3 3 0 0 1-3 3 3 3 0 0 1-3-3v-2Z" stroke={HS.navy} strokeWidth="1.5"/>
    </svg>
  )
}

function WinsList(){
  const [wins, setWins] = useState<string[]>(()=>{
    try { return JSON.parse(localStorage.getItem('hs-90day-wins')||'[]') } catch { return [] }
  })
  useEffect(()=>{ localStorage.setItem('hs-90day-wins', JSON.stringify(wins)) },[wins])

  const addWin = () => {
    const text = prompt("Add a win, kudos, or outcome (e.g., 'Secured early renewal with ACME')")
    if (text && text.trim()) setWins([text.trim(), ...wins])
  }
  const removeWin = (idx:number) => setWins(wins.filter((_,i)=> i!==idx))

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <button onClick={addWin} className="px-3 py-2 rounded-xl text-sm" style={{background:HS.teal, color:'white'}}>Add Win</button>
        <span className="text-xs" style={{color:HS.navy}}>{wins.length} saved</span>
      </div>
      {wins.length===0 && (
        <div className="text-sm opacity-70" style={{color:HS.navy}}>No wins yet — they’re coming. Add your first one!</div>
      )}
      <ul className="mt-2 space-y-2">
        {wins.map((w,idx)=> (
          <li key={idx} className="p-3 rounded-xl border flex items-start justify-between gap-3" style={{borderColor:HS.grey}}>
            <span className="text-sm" style={{color:HS.navy}}>{w}</span>
            <button onClick={()=>removeWin(idx)} className="text-xs opacity-70 hover:opacity-100 underline">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
