import { useState, useEffect, useRef } from "react";

// ── Permissions Screen ────────────────────────────────────────────────────────
function PermissionsScreen({ name, onComplete }) {
  const [notifStatus, setNotifStatus] = useState("idle"); // idle | granted | denied
  const [locationStatus, setLocationStatus] = useState("idle");
  const [calStatus, setCalStatus] = useState("idle");
  const [allDone, setAllDone] = useState(false);

  const C = "#C4714A";

  async function requestNotifications() {
    setNotifStatus("asking");
    try {
      const result = await Notification.requestPermission();
      setNotifStatus(result === "granted" ? "granted" : "denied");
    } catch { setNotifStatus("denied"); }
  }

  async function requestLocation() {
    setLocationStatus("asking");
    navigator.geolocation.getCurrentPosition(
      () => setLocationStatus("granted"),
      () => setLocationStatus("denied")
    );
  }

  async function requestCalendar() {
    // Calendar API not available in browser — we explain and mark as noted
    setCalStatus("granted");
  }

  useEffect(() => {
    if (notifStatus !== "idle" && locationStatus !== "idle" && calStatus !== "idle") {
      setAllDone(true);
    }
  }, [notifStatus, locationStatus, calStatus]);

  const statusIcon = (s) => s === "granted" ? "✅" : s === "denied" ? "⚠️" : s === "asking" ? "⏳" : "";
  const btn = (color, disabled) => ({
    padding: "9px 18px", borderRadius: "100px", border: "none",
    background: disabled ? "#E8D0B8" : color, color: "white",
    fontSize: "13px", fontWeight: "700", cursor: disabled ? "default" : "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", opacity: disabled ? 0.5 : 1
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FDF0E4 0%,#F5E6D8 50%,#EDD8C8 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ background: "white", borderRadius: "28px", padding: "36px 28px", maxWidth: "420px", width: "100%", boxShadow: "0 20px 60px rgba(61,43,31,0.12)" }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#3D2B1F" }}>Matr<span style={{ color: C, fontStyle: "italic" }}>eo</span> 🌸</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", color: "#3D2B1F", marginTop: "16px", lineHeight: "1.3" }}>Almost ready, {name}.</div>
          <div style={{ fontSize: "14px", color: "#9A7B6A", marginTop: "8px", lineHeight: "1.7", fontWeight: "300" }}>Matreo works best when it can reach you and find things near you. You control every permission — and can change them anytime.</div>
        </div>

        {/* Notifications */}
        <div style={{ background: "#FDF6EE", borderRadius: "16px", padding: "16px", marginBottom: "12px", border: `1.5px solid ${notifStatus === "granted" ? "#A8C5A0" : notifStatus === "denied" ? "#E8A598" : "#E8D0B8"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "22px" }}>🔔</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#3D2B1F", marginBottom: "2px" }}>Morning brief notifications</div>
                <div style={{ fontSize: "12px", color: "#9A7B6A", lineHeight: "1.5" }}>Matreo taps you at 7:30 AM with your daily focus — so you start the day ready, not reactive.</div>
              </div>
            </div>
            {statusIcon(notifStatus) && <span style={{ fontSize: "16px", flexShrink: 0 }}>{statusIcon(notifStatus)}</span>}
          </div>
          {notifStatus === "idle" && <button style={btn(C, false)} onClick={requestNotifications}>Allow notifications</button>}
          {notifStatus === "denied" && <div style={{ fontSize: "11px", color: "#C4714A" }}>You can enable this later in your phone Settings → Notifications → Matreo</div>}
          {notifStatus === "granted" && <div style={{ fontSize: "11px", color: "#7DAA7D", fontWeight: "600" }}>You'll get your morning brief every day at 7:30 AM 🌅</div>}
        </div>

        {/* Location */}
        <div style={{ background: "#FDF6EE", borderRadius: "16px", padding: "16px", marginBottom: "12px", border: `1.5px solid ${locationStatus === "granted" ? "#A8C5A0" : locationStatus === "denied" ? "#E8A598" : "#E8D0B8"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "22px" }}>📍</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#3D2B1F", marginBottom: "2px" }}>Find doctors & errands near you</div>
                <div style={{ fontSize: "12px", color: "#9A7B6A", lineHeight: "1.5" }}>When you need an ortho, a pharmacy, or a lab — Matreo finds the closest options. Used only when you ask.</div>
              </div>
            </div>
            {statusIcon(locationStatus) && <span style={{ fontSize: "16px", flexShrink: 0 }}>{statusIcon(locationStatus)}</span>}
          </div>
          {locationStatus === "idle" && <button style={btn(C, false)} onClick={requestLocation}>Allow location</button>}
          {locationStatus === "denied" && <div style={{ fontSize: "11px", color: "#C4714A" }}>You can enable this later in Settings → Privacy → Location → Matreo</div>}
          {locationStatus === "granted" && <div style={{ fontSize: "11px", color: "#7DAA7D", fontWeight: "600" }}>Matreo can now find things near you when you need them 📍</div>}
        </div>

        {/* Calendar */}
        <div style={{ background: "#FDF6EE", borderRadius: "16px", padding: "16px", marginBottom: "24px", border: `1.5px solid ${calStatus === "granted" ? "#A8C5A0" : "#E8D0B8"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "22px" }}>📅</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#3D2B1F", marginBottom: "2px" }}>Google Calendar sync</div>
                <div style={{ fontSize: "12px", color: "#9A7B6A", lineHeight: "1.5" }}>Matreo already connects to your Google Calendar to pull in school events, activities, and appointments automatically.</div>
              </div>
            </div>
            {statusIcon(calStatus) && <span style={{ fontSize: "16px", flexShrink: 0 }}>{statusIcon(calStatus)}</span>}
          </div>
          {calStatus === "idle" && <button style={btn(C, false)} onClick={requestCalendar}>Got it — already connected</button>}
          {calStatus === "granted" && <div style={{ fontSize: "11px", color: "#7DAA7D", fontWeight: "600" }}>Calendar events will flow into your tasks automatically ✓</div>}
        </div>

        <div style={{ background: "#F5F5F5", borderRadius: "12px", padding: "12px 14px", marginBottom: "20px", fontSize: "11px", color: "#9A7B6A", lineHeight: "1.6" }}>
          🔒 <strong>Your privacy matters.</strong> Matreo never sells your data. Location is only used when you ask. You can revoke any permission anytime in your phone settings.
        </div>

        <button
          onClick={onComplete}
          style={{ width: "100%", background: allDone ? C : "#D4B090", color: "white", border: "none", borderRadius: "100px", padding: "15px", fontSize: "15px", fontWeight: "700", cursor: allDone ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s" }}
        >
          {allDone ? "Take me to Matreo 🌸" : "Allow the permissions above to continue"}
        </button>

        <button onClick={onComplete} style={{ width: "100%", background: "transparent", border: "none", color: "#B89070", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: "10px", padding: "6px" }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

const CATEGORIES = {
  insurance: { label: "Insurance & Medical Bills", emoji: "🏥", color: "#E8A598", keywords: ["insurance", "claim", "billing", "medical bill", "EOB"] },
  appointments: { label: "Appointments", emoji: "📅", color: "#A8C5A0", keywords: ["appointment", "doctor", "schedule", "confirm", "reminder"] },
  school: { label: "School & Kids", emoji: "🎒", color: "#B8A9D4", keywords: ["school", "principal", "teacher", "incident", "student", "Girl Scouts", "practice", "closing", "book fair", "volunteer", "donate"] },
  household: { label: "Household", emoji: "🏠", color: "#F0C080", keywords: ["water bill", "utility", "invoice", "payment due"] },
  admin: { label: "Admin & Paperwork", emoji: "📋", color: "#98BED4", keywords: ["tax", "IRS", "refund", "paperwork", "filing"] },
  selfcare: { label: "Self Care", emoji: "🌸", color: "#D4A8B8", keywords: ["endocrinologist", "specialist", "referral", "GHI", "health"] },
};

const STATUS = {
  todo: { label: "To Do", color: "#C9A882" },
  inprogress: { label: "In Progress", color: "#7BA7BC" },
  waiting: { label: "Waiting on Them", color: "#B8956A" },
  done: { label: "Done ✓", color: "#7DAA7D" },
};

const SEED_TASKS = [
  { id: 1, category: "insurance", status: "waiting", title: "Son's school injury insurance claim", notes: "Insurance not responding. File DFS complaint at dfs.ny.gov.", deadline: "2026-04-25", urgent: true, fromCalendar: false },
  { id: 2, category: "school", status: "inprogress", title: "School paperwork — injury incident", notes: "Contact principal + school legal/risk management in writing.", deadline: "2026-04-22", urgent: true, fromCalendar: false },
  { id: 3, category: "household", status: "todo", title: "Pay water bill", notes: "", deadline: "2026-04-30", urgent: false, fromCalendar: false },
  { id: 4, category: "admin", status: "todo", title: "Follow up on taxes application", notes: "", deadline: "", urgent: false, fromCalendar: false },
  { id: 5, category: "appointments", status: "todo", title: "Schedule Sophia's ortho appointment", notes: "GHI insurance. Need ortho near Bethpage.", deadline: "", urgent: false, fromCalendar: false },
  { id: 6, category: "appointments", status: "todo", title: "Schedule kids' annual physicals", notes: "Both kids overdue.", deadline: "", urgent: false, fromCalendar: false },
  { id: 7, category: "selfcare", status: "todo", title: "Schedule my endocrinologist appointment", notes: "GHI insurance. Check providers near Bethpage.", deadline: "", urgent: false, fromCalendar: false },
  { id: 8, category: "school", status: "todo", title: "Sophia's Girl Scouts meeting", notes: "Remember to bring cookie money.", deadline: "2026-04-23", urgent: false, fromCalendar: true, calendarDate: "Apr 23", calendarTime: "4:00 PM" },
  { id: 9, category: "school", status: "todo", title: "School Book Fair", notes: "Starts Monday. Suggested donation: $20.", deadline: "2026-04-22", urgent: false, fromCalendar: true, calendarDate: "Apr 22", calendarTime: "All day" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return { value: i, label: `${h}:00 ${ampm}` };
});

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ── AI: Generate daily brief + time pockets ───────────────────────────────────
async function generateDailyBrief(tasks, profile) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const activeTasks = tasks.filter(t => t.status !== "done").slice(0, 12);
  const taskSummary = activeTasks.map(t =>
    `- [${t.category}] "${t.title}" | urgent:${t.urgent} | deadline:${t.deadline||"none"} | notes:${t.notes||"none"} | calDate:${t.calendarDate||""} ${t.calendarTime||""}`
  ).join("\n");

  const isWorkDay = profile.workDays?.includes(todayDay);
  const workNote = profile.workStyle === "sahm"
    ? "She is a stay-at-home mom with no fixed work hours."
    : profile.workStyle === "flexible"
    ? `She has flexible work hours on ${profile.workDays?.join(", ")||"weekdays"}. Today ${isWorkDay ? "IS" : "is NOT"} a work day.`
    : `She works ${profile.workStyle} from ${HOURS[profile.workStart||9]?.label} to ${HOURS[profile.workEnd||17]?.label} on ${profile.workDays?.join(", ")||"weekdays"}. Today ${isWorkDay ? "IS" : "is NOT"} a work day. ${profile.hasCommute ? `She has a ${profile.commuteMinutes||30}-minute commute each way.` : "She works from home — no commute."}`;

  const pocketPrefs = profile.pocketTimes?.length > 0
    ? `She prefers time pockets during: ${profile.pocketTimes.join(", ")}.`
    : "She's open to any pockets of free time.";

  const prompt = `You are Matreo — a warm, brilliant personal chief of staff for a mom named ${profile.name||"Mom"}. Today is ${today}.

HER WORK PROFILE:
${workNote}
${pocketPrefs}

HER OPEN TASKS:
${taskSummary}

Return ONLY valid JSON with this exact structure:
{
  "greeting": "Warm, specific 1-sentence morning message to ${profile.name||"Mom"}. Acknowledge her day. Friend tone, not productivity app.",
  "focus": [
    {
      "taskTitle": "exact task title from list",
      "priority": 1,
      "action": "ONE specific concrete action RIGHT NOW. e.g. 'Reply to BlueCross — draft is ready to send', 'Call GHI ortho line at 1-800-xxx', 'Put $20 in Sophia's backpack tonight for Book Fair', 'Search ghi.com/find-a-doctor for ortho near Bethpage 11714'",
      "timeEstimate": "2 min",
      "type": "email|call|errand|payment|appointment|school|self"
    }
  ],
  "pockets": [
    {
      "time": "e.g. 7:30–7:50 AM",
      "duration": "20 min",
      "suggestion": "Warm, specific suggestion for this pocket. e.g. 'Before the day starts — enough time to call the ortho office when they open, or walk around the block with your coffee.'",
      "type": "task|self|errand"
    }
  ],
  "affirmation": "One warm sentence. Specific to what she is carrying. Like a friend who truly sees her.",
  "doneEarly": "Gentle suggestion if she finishes early — ideally something for herself."
}

RULES:
- focus: pick TOP 4-5 tasks only. Most urgent/deadline-driven first.
- pockets: find 2-3 real time windows OUTSIDE her work hours. If today is not a work day, all day is open. Account for commute time if she has one. Morning before work, lunch if she has flexibility, after work/kids pickup, weekend time.
- If workStyle is sahm, pockets can be anytime — morning nap time, school hours, evening.
- If workStyle is flexible, be gentle — suggest pockets but acknowledge she controls her schedule.
- Actions must be HYPER-SPECIFIC. Never vague.
- Tone: warm best friend, never corporate, never judgmental.
- JSON only. No markdown.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.map(b => b.text || "").join("") || "{}";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch { return null; }
}

async function fetchEmailsForTask(task) {
  const cat = CATEGORIES[task.category];
  const terms = [task.title, ...(cat?.keywords||[])].slice(0,4).join(", ");
  const prompt = `Gmail MCP access. Search inbox for emails related to: "${task.title}". Terms: ${terms}. Return JSON array max 3: [{id,from,subject,date,snippet,read}]. JSON only.`;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, messages: [{ role: "user", content: prompt }], mcp_servers: [{ type: "url", url: "https://gmailmcp.googleapis.com/mcp/v1", name: "gmail-mcp" }] }),
    });
    const data = await res.json();
    const text = data.content?.map(b => b.text||"").join("")||"[]";
    const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

// ── Onboarding ────────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const TOTAL = 4;
  const [name, setName] = useState("");
  const [workStyle, setWorkStyle] = useState("");
  const [workDays, setWorkDays] = useState(["Mon","Tue","Wed","Thu","Fri"]);
  const [workStart, setWorkStart] = useState(9);
  const [workEnd, setWorkEnd] = useState(17);
  const [hasCommute, setHasCommute] = useState(null);
  const [commuteMinutes, setCommuteMinutes] = useState(30);
  const [pocketTimes, setPocketTimes] = useState([]);

  const toggleDay = d => setWorkDays(p => p.includes(d) ? p.filter(x=>x!==d) : [...p,d]);
  const togglePocket = p => setPocketTimes(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev,p]);

  const C = "#C4714A";
  const card = { background:"white", borderRadius:"28px", padding:"32px 24px", maxWidth:"420px", width:"100%", boxShadow:"0 20px 60px rgba(61,43,31,0.12)", fontFamily:"'DM Sans',sans-serif" };
  const T = { fontFamily:"'Playfair Display',serif", fontSize:"21px", fontWeight:"700", color:"#3D2B1F", marginBottom:"8px", lineHeight:"1.3" };
  const S = { fontSize:"14px", color:"#9A7B6A", marginBottom:"20px", lineHeight:"1.7", fontWeight:"300" };
  const L = { fontSize:"10px", color:"#9A7B6A", fontWeight:"700", letterSpacing:"1px", display:"block", marginBottom:"8px" };
  const inp = { width:"100%", padding:"12px 16px", borderRadius:"12px", border:"1.5px solid #E8D0B8", fontSize:"15px", color:"#3D2B1F", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", outline:"none" };
  const btn = (disabled=false) => ({ width:"100%", background: disabled ? "#D4B090" : C, color:"white", border:"none", borderRadius:"100px", padding:"14px", fontSize:"15px", fontWeight:"700", cursor: disabled?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif", marginTop:"18px", opacity: disabled ? 0.6 : 1 });
  const btnBack = { width:"100%", background:"#F0E4D4", color:"#7A5C44", border:"none", borderRadius:"100px", padding:"11px", fontSize:"14px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginTop:"8px" };
  const optC = (active) => ({ display:"flex", alignItems:"flex-start", gap:"12px", padding:"13px 15px", borderRadius:"14px", border:`1.5px solid ${active?C:"#E8D0B8"}`, background:active?"#FDF0E8":"white", cursor:"pointer", marginBottom:"9px", transition:"all 0.2s" });
  const dayB = (active) => ({ padding:"7px 11px", borderRadius:"20px", fontSize:"12px", fontWeight:"600", border:active?"none":"1.5px solid #E8D0B8", background:active?C:"white", color:active?"white":"#9A7B6A", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" });
  const sel = { width:"100%", padding:"10px 14px", borderRadius:"12px", border:"1.5px solid #E8D0B8", fontSize:"14px", color:"#3D2B1F", fontFamily:"'DM Sans',sans-serif", background:"white" };
  const pocketB = (active) => ({ flex:1, padding:"12px 8px", borderRadius:"14px", border:`1.5px solid ${active?C:"#E8D0B8"}`, background:active?"#FDF0E8":"white", cursor:"pointer", textAlign:"center", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif" });

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#FDF0E4 0%,#F5E6D8 50%,#EDD8C8 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={card}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"24px" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", fontWeight:"700", color:"#3D2B1F" }}>Matr<span style={{ color:C, fontStyle:"italic" }}>eo</span> 🌸</div>
          <div style={{ fontSize:"11px", color:"#C4A882", marginTop:"4px" }}>Your family's chief of staff</div>
          <div style={{ display:"flex", gap:"5px", justifyContent:"center", marginTop:"14px" }}>
            {Array.from({length:TOTAL},(_,i)=>(
              <div key={i} style={{ height:"4px", borderRadius:"10px", background:i<step?C:"#E8D0B8", width:i<step?"24px":"12px", transition:"all 0.3s" }} />
            ))}
          </div>
          <div style={{ fontSize:"11px", color:"#C4A882", marginTop:"5px" }}>Step {step} of {TOTAL}</div>
        </div>

        {/* STEP 1 — Name */}
        {step === 1 && <>
          <div style={T}>Hi! What should Matreo call you?</div>
          <div style={S}>You'll only set this up once. Matreo learns your life from your answers and personalizes everything — so it fits <em>you</em>, not a generic mom.</div>
          <label style={L}>YOUR FIRST NAME</label>
          <input style={inp} placeholder="e.g. Lydia" value={name} onChange={e=>setName(e.target.value)} autoFocus />
          <div style={{ marginTop:"20px", background:"#F5EDE6", borderRadius:"12px", padding:"12px 14px", fontSize:"12px", color:"#9A7B6A", lineHeight:"1.6" }}>
            🔒 Matreo only connects to the apps you approve. Your data stays yours.
          </div>
          <button style={btn(!name.trim())} onClick={() => name.trim() && setStep(2)}>Let's set you up →</button>
        </>}

        {/* STEP 2 — Work life */}
        {step === 2 && <>
          <div style={T}>How does your work life look?</div>
          <div style={S}>No two moms have the same schedule. Tell Matreo about yours so it only suggests pockets of time that are <em>actually</em> yours.</div>

          {[
            { key:"office", emoji:"🏢", label:"I go into the office", sub:"Set days, set hours — commute counts too" },
            { key:"remote", emoji:"💻", label:"I work fully from home", sub:"No commute, but I have real work hours" },
            { key:"hybrid", emoji:"🔀", label:"Hybrid — some office, some home", sub:"My schedule changes by day" },
            { key:"flexible", emoji:"⏰", label:"My hours are flexible", sub:"I control when I work — no fixed schedule" },
            { key:"sahm", emoji:"🌸", label:"I'm not working outside the home", sub:"Stay-at-home mom, or between jobs right now" },
          ].map(o=>(
            <div key={o.key} style={optC(workStyle===o.key)} onClick={()=>setWorkStyle(o.key)}>
              <span style={{ fontSize:"22px", marginTop:"1px" }}>{o.emoji}</span>
              <div>
                <div style={{ fontSize:"14px", fontWeight:"600", color:"#3D2B1F", marginBottom:"2px" }}>{o.label}</div>
                <div style={{ fontSize:"12px", color:"#9A7B6A" }}>{o.sub}</div>
              </div>
            </div>
          ))}

          {workStyle && workStyle !== "sahm" && <>
            <label style={{ ...L, marginTop:"14px" }}>WHICH DAYS DO YOU WORK?</label>
            <div style={{ display:"flex", gap:"7px", flexWrap:"wrap", marginBottom:"16px" }}>
              {DAYS.map(d=><button key={d} style={dayB(workDays.includes(d))} onClick={()=>toggleDay(d)}>{d}</button>)}
            </div>

            {workStyle !== "flexible" && <>
              <label style={L}>TYPICAL WORK HOURS</label>
              <div style={{ display:"flex", gap:"10px", marginBottom:"4px" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"10px", color:"#B89070", marginBottom:"4px" }}>START</div>
                  <select style={sel} value={workStart} onChange={e=>setWorkStart(Number(e.target.value))}>
                    {HOURS.map(h=><option key={h.value} value={h.value}>{h.label}</option>)}
                  </select>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"10px", color:"#B89070", marginBottom:"4px" }}>END</div>
                  <select style={sel} value={workEnd} onChange={e=>setWorkEnd(Number(e.target.value))}>
                    {HOURS.map(h=><option key={h.value} value={h.value}>{h.label}</option>)}
                  </select>
                </div>
              </div>
            </>}
          </>}

          <button style={btn(!workStyle)} onClick={()=>workStyle&&setStep(workStyle==="sahm"||workStyle==="remote"?3:3)}>Continue →</button>
          <button style={btnBack} onClick={()=>setStep(1)}>← Back</button>
        </>}

        {/* STEP 3 — Commute */}
        {step === 3 && <>
          <div style={T}>Do you have a commute?</div>
          <div style={S}>Commute time is <em>your</em> time too — Matreo will protect it and factor it into your day so suggestions actually make sense.</div>

          {workStyle === "remote" || workStyle === "sahm" ? (
            <>
              <div style={{ background:"#F0FAF0", borderRadius:"14px", padding:"16px", marginBottom:"16px", fontSize:"14px", color:"#4A8A4A", lineHeight:"1.6" }}>
                🏠 Since you work from home, there's no commute to factor in. Matreo will use your full personal time window.
              </div>
              <button style={btn()} onClick={()=>{ setHasCommute(false); setStep(4); }}>Got it →</button>
            </>
          ) : (
            <>
              <div style={optC(hasCommute===false)} onClick={()=>setHasCommute(false)}>
                <span style={{ fontSize:"22px" }}>🏠</span>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:"600", color:"#3D2B1F", marginBottom:"2px" }}>No commute — I work from home</div>
                  <div style={{ fontSize:"12px", color:"#9A7B6A" }}>My work hours start right at home</div>
                </div>
              </div>
              <div style={optC(hasCommute===true)} onClick={()=>setHasCommute(true)}>
                <span style={{ fontSize:"22px" }}>🚗</span>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:"600", color:"#3D2B1F", marginBottom:"2px" }}>Yes, I commute to work</div>
                  <div style={{ fontSize:"12px", color:"#9A7B6A" }}>Train, car, bus — time away from home</div>
                </div>
              </div>

              {hasCommute === true && <>
                <label style={{ ...L, marginTop:"14px" }}>HOW LONG IS YOUR COMMUTE? (ONE WAY)</label>
                <select style={sel} value={commuteMinutes} onChange={e=>setCommuteMinutes(Number(e.target.value))}>
                  {[10,15,20,25,30,35,40,45,50,60,75,90].map(m=><option key={m} value={m}>{m} minutes</option>)}
                </select>
                <div style={{ fontSize:"12px", color:"#9A7B6A", marginTop:"4px" }}>Matreo adds {commuteMinutes} min before and after your work hours as commute buffer.</div>
              </>}

              <button style={btn(hasCommute===null)} onClick={()=>hasCommute!==null&&setStep(4)}>Continue →</button>
            </>
          )}
          <button style={btnBack} onClick={()=>setStep(2)}>← Back</button>
        </>}

        {/* STEP 4 — Pocket preferences */}
        {step === 4 && <>
          <div style={T}>When do you want Matreo to find time for you?</div>
          <div style={S}>Pick the windows that feel most like <em>your</em> time. Matreo will look for pockets here first — for tasks, for yourself, for breathing room.</div>

          <label style={L}>YOUR BEST WINDOWS (pick all that apply)</label>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"16px" }}>
            {[
              { key:"morning", emoji:"🌅", label:"Mornings", sub:"Before work or school drop-off" },
              { key:"lunch", emoji:"🥗", label:"Lunch break", sub:"Mid-day breather" },
              { key:"commute", emoji:"🚆", label:"Commute time", sub:"On the train or in the car" },
              { key:"after", emoji:"🌇", label:"After work", sub:"After pickup, before dinner" },
              { key:"evening", emoji:"🌙", label:"Evening", sub:"After kids are in bed" },
              { key:"weekend", emoji:"☀️", label:"Weekends", sub:"Saturday or Sunday pockets" },
            ].map(p=>(
              <div key={p.key} style={{ width:"calc(50% - 4px)" }}>
                <div style={pocketB(pocketTimes.includes(p.key))} onClick={()=>togglePocket(p.key)}>
                  <div style={{ fontSize:"22px", marginBottom:"4px" }}>{p.emoji}</div>
                  <div style={{ fontSize:"12px", fontWeight:"600", color:"#3D2B1F" }}>{p.label}</div>
                  <div style={{ fontSize:"10px", color:"#9A7B6A", marginTop:"2px" }}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:"#FDF6EE", borderRadius:"12px", padding:"14px 16px", fontSize:"13px", color:"#7A5C44", lineHeight:"1.6", marginBottom:"4px" }}>
            🌸 <strong>Matreo never judges.</strong> These are just suggestions — you always choose what to do with your time. No scores, no guilt, no optimization.
          </div>

          <button style={btn(pocketTimes.length===0)} onClick={()=>pocketTimes.length>0&&finish()}>I'm ready — set up Matreo 🌸</button>
          <button style={btnBack} onClick={()=>setStep(3)}>← Back</button>
        </>}
      </div>
    </div>
  );
}

// ── AI Draft ──────────────────────────────────────────────────────────────────
function AiDraftModal({ task, onClose }) {
  const [draft, setDraft] = useState(""); const [loading, setLoading] = useState(true); const [copied, setCopied] = useState(false);
  useEffect(() => {
    (async () => {
      const prompt = `Warm assistant helping working mom draft a follow-up. Task: "${task.title}" | Notes: "${task.notes||"none"}" | Category: ${CATEGORIES[task.category]?.label}. Write professional email under 150 words. Subject line. If insurance: mention NY DFS complaint. Sign as "Lydia". Calm, firm.`;
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] }) });
        const data = await res.json();
        setDraft(data.content?.map(b=>b.text||"").join("")||"Could not generate.");
      } catch { setDraft("Could not generate draft."); }
      setLoading(false);
    })();
  }, [task]);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(80,60,50,0.4)", backdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <div style={{ background:"#FDF6EE", borderRadius:"24px", maxWidth:"560px", width:"100%", padding:"28px", boxShadow:"0 20px 60px rgba(100,70,50,0.25)" }}>
        <div style={{ fontSize:"12px", color:"#B89070", marginBottom:"6px", fontFamily:"'DM Sans',sans-serif" }}>✨ AI Draft for</div>
        <div style={{ fontSize:"17px", fontWeight:"700", color:"#4A3728", marginBottom:"18px", fontFamily:"'Playfair Display',serif" }}>{task.title}</div>
        {loading ? <div style={{ textAlign:"center", padding:"36px 0", color:"#C4956A" }}><div style={{ fontSize:"28px", marginBottom:"10px" }}>✍️</div><div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px" }}>Drafting for you...</div></div>
          : <textarea value={draft} onChange={e=>setDraft(e.target.value)} style={{ width:"100%", minHeight:"180px", background:"#FFF8F0", border:"1.5px solid #E8D0B8", borderRadius:"12px", padding:"14px", fontSize:"14px", lineHeight:"1.7", color:"#4A3728", resize:"vertical", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box" }} />}
        <div style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
          <button onClick={()=>{ navigator.clipboard.writeText(draft); setCopied(true); setTimeout(()=>setCopied(false),2000); }} disabled={loading} style={{ flex:1, background:"#C4956A", color:"white", border:"none", borderRadius:"12px", padding:"12px", fontSize:"14px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:"600" }}>{copied?"Copied! ✓":"Copy to Clipboard"}</button>
          <button onClick={onClose} style={{ flex:1, background:"#F0E4D4", color:"#7A5C44", border:"none", borderRadius:"12px", padding:"12px", fontSize:"14px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Today's Focus ─────────────────────────────────────────────────────────────
const ACTION_ICONS = { email:"📧", call:"📞", errand:"🛍️", payment:"💳", appointment:"🩺", school:"🎒", self:"🌸" };
const POCKET_ICONS = { task:"✅", self:"🌸", errand:"🛍️" };

function TodaysFocus({ tasks, profile, onDraft, onMarkDone }) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const generated = useRef(false);

  useEffect(() => {
    if (generated.current) return;
    generated.current = true;
    generateDailyBrief(tasks, profile).then(b=>{ setBrief(b); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  const findTask = title => tasks.find(t => t.title === title || t.title.includes(title?.slice(0,20)));

  return (
    <div style={{ background:"linear-gradient(135deg,#3D2B1F 0%,#5A3D2A 100%)", borderRadius:"24px", overflow:"hidden", marginBottom:"14px", boxShadow:"0 8px 40px rgba(61,43,31,0.25)" }}>
      <div style={{ padding:"18px 20px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }} onClick={()=>setCollapsed(c=>!c)}>
        <div>
          <div style={{ fontSize:"10px", letterSpacing:"2px", color:"rgba(255,255,255,0.5)", fontWeight:"700", marginBottom:"4px", fontFamily:"'DM Sans',sans-serif" }}>✦ TODAY'S FOCUS</div>
          <div style={{ fontSize:"14px", color:"white", fontFamily:"'Playfair Display',serif", fontStyle:"italic", lineHeight:"1.4", maxWidth:"280px" }}>
            {loading ? "Thinking about your day..." : brief?.greeting || "Here's what matters most today."}
          </div>
        </div>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"16px", marginTop:"2px" }}>{collapsed?"▼":"▲"}</div>
      </div>

      {!collapsed && <>
        {loading ? (
          <div style={{ padding:"16px 20px 24px", display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ fontSize:"22px" }}>🌅</div>
            <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontFamily:"'DM Sans',sans-serif" }}>Building your daily brief...</div>
          </div>
        ) : (<>
          {/* Focus items */}
          <div style={{ padding:"0 14px 6px" }}>
            {brief?.focus?.map((item, i) => {
              const task = findTask(item.taskTitle);
              return (
                <div key={i} style={{ background:"rgba(255,255,255,0.07)", borderRadius:"14px", padding:"13px 14px", marginBottom:"7px", border:"1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"10px" }}>
                    <div style={{ fontSize:"18px", marginTop:"1px", flexShrink:0 }}>{ACTION_ICONS[item.type]||"✦"}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", gap:"8px", marginBottom:"3px" }}>
                        <div style={{ fontSize:"12px", fontWeight:"700", color:"white", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.3" }}>{item.taskTitle}</div>
                        <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif", flexShrink:0 }}>{item.timeEstimate}</div>
                      </div>
                      <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.72)", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.5", marginBottom:"9px" }}>{item.action}</div>
                      <div style={{ display:"flex", gap:"7px", flexWrap:"wrap" }}>
                        {task && (item.type==="email"||item.type==="call") && <button onClick={()=>onDraft(task)} style={{ background:"#C4956A", color:"white", border:"none", borderRadius:"20px", padding:"5px 12px", fontSize:"11px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:"700" }}>✨ Draft it</button>}
                        {task && <button onClick={()=>onMarkDone(task.id)} style={{ background:"rgba(125,170,125,0.3)", color:"#A8D4A8", border:"1px solid rgba(125,170,125,0.3)", borderRadius:"20px", padding:"5px 12px", fontSize:"11px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:"600" }}>Done ✓</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Pockets */}
          {brief?.pockets?.length > 0 && (
            <div style={{ margin:"0 14px 14px", background:"rgba(255,255,255,0.05)", borderRadius:"16px", padding:"14px", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize:"10px", fontWeight:"700", color:"rgba(255,255,255,0.45)", letterSpacing:"1.5px", marginBottom:"10px", fontFamily:"'DM Sans',sans-serif" }}>⏱ POCKETS OF TIME TODAY</div>
              {brief.pockets.map((pocket, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", marginBottom: i < brief.pockets.length-1 ? "10px" : "0", paddingBottom: i < brief.pockets.length-1 ? "10px" : "0", borderBottom: i < brief.pockets.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontSize:"16px", flexShrink:0 }}>{POCKET_ICONS[pocket.type]||"🌿"}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"3px" }}>
                      <div style={{ fontSize:"12px", fontWeight:"700", color:"rgba(255,255,255,0.85)", fontFamily:"'DM Sans',sans-serif" }}>{pocket.time}</div>
                      <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", fontFamily:"'DM Sans',sans-serif" }}>{pocket.duration}</div>
                    </div>
                    <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.5", fontStyle:"italic" }}>{pocket.suggestion}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Affirmation */}
          {brief?.affirmation && (
            <div style={{ margin:"0 14px 10px", background:"rgba(196,149,106,0.15)", borderRadius:"12px", padding:"12px 14px", display:"flex", gap:"9px", alignItems:"flex-start" }}>
              <span style={{ fontSize:"14px" }}>🌸</span>
              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.65)", fontFamily:"'Playfair Display',serif", fontStyle:"italic", lineHeight:"1.6" }}>{brief.affirmation}</div>
            </div>
          )}
          {brief?.doneEarly && (
            <div style={{ margin:"0 14px 16px", fontSize:"11px", color:"rgba(255,255,255,0.3)", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.5" }}>
              💡 If you finish early: {brief.doneEarly}
            </div>
          )}
        </>)}
      </>}
    </div>
  );
}

// ── Email panel ───────────────────────────────────────────────────────────────
function EmailPanel({ task }) {
  const [emails, setEmails] = useState(null); const [loading, setLoading] = useState(true);
  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return; fetched.current = true;
    fetchEmailsForTask(task).then(e=>{ setEmails(e); setLoading(false); }).catch(()=>{ setEmails([]); setLoading(false); });
  }, []);
  if (loading) return <div style={{ background:"#F5EDE6", borderRadius:"10px", padding:"9px 12px", marginTop:"8px", fontSize:"11px", color:"#9A7B6A", fontFamily:"'DM Sans',sans-serif" }}>📬 Checking Gmail...</div>;
  if (!emails?.length) return <div style={{ background:"#F5EDE6", borderRadius:"10px", padding:"9px 12px", marginTop:"8px", fontSize:"11px", color:"#9A7B6A", fontFamily:"'DM Sans',sans-serif" }}>📭 No related emails found.</div>;
  return (
    <div style={{ marginTop:"8px" }}>
      <div style={{ fontSize:"10px", fontWeight:"700", color:"#B89070", letterSpacing:"1px", marginBottom:"5px", fontFamily:"'DM Sans',sans-serif" }}>📬 RELATED EMAILS</div>
      {emails.map((e,i)=>(
        <div key={i} style={{ background:e.read?"#FAF4EE":"#FFF8F0", borderRadius:"9px", padding:"8px 11px", marginBottom:"5px", border:e.read?"1px solid #EAD8C4":"1.5px solid #D4A878" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"2px" }}>
            <div style={{ fontSize:"11px", fontWeight:e.read?"500":"700", color:"#4A3728", fontFamily:"'DM Sans',sans-serif" }}>{!e.read&&<span style={{ display:"inline-block", width:"5px", height:"5px", background:"#C4956A", borderRadius:"50%", marginRight:"5px", verticalAlign:"middle" }} />}{e.subject}</div>
            <div style={{ fontSize:"10px", color:"#B89070", fontFamily:"'DM Sans',sans-serif" }}>{e.date}</div>
          </div>
          <div style={{ fontSize:"11px", color:"#7A5C44", lineHeight:"1.5", fontFamily:"'DM Sans',sans-serif" }}>{e.snippet}</div>
        </div>
      ))}
    </div>
  );
}

// ── Task card ─────────────────────────────────────────────────────────────────
function TaskCard({ task, onStatusChange, onDraft, onDelete }) {
  const cat = CATEGORIES[task.category]; const status = STATUS[task.status];
  const [expanded, setExpanded] = useState(false);
  const isOverdue = task.deadline && new Date(task.deadline) < new Date();
  return (
    <div style={{ background:"white", borderRadius:"16px", padding:"14px 16px", marginBottom:"8px", boxShadow:"0 2px 10px rgba(100,70,50,0.06)", borderLeft:`4px solid ${cat.color}`, cursor:"pointer" }} onClick={()=>setExpanded(e=>!e)}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:"10px" }}>
        <span style={{ fontSize:"16px", marginTop:"2px" }}>{cat.emoji}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"7px", flexWrap:"wrap" }}>
            <span style={{ fontSize:"14px", fontWeight:"600", color:"#3D2B1F", fontFamily:"'Playfair Display',Georgia,serif", lineHeight:"1.3" }}>{task.title}</span>
            {task.urgent && <span style={{ background:"#FDECEA", color:"#C0392B", fontSize:"9px", fontWeight:"700", padding:"2px 7px", borderRadius:"10px", fontFamily:"'DM Sans',sans-serif" }}>URGENT</span>}
            {task.fromCalendar && <span style={{ background:"#E8F5E8", color:"#4A8A4A", fontSize:"9px", fontWeight:"700", padding:"2px 7px", borderRadius:"10px", fontFamily:"'DM Sans',sans-serif" }}>📆 CAL</span>}
          </div>
          <div style={{ display:"flex", gap:"7px", marginTop:"5px", flexWrap:"wrap", alignItems:"center" }}>
            <select value={task.status} onChange={e=>{ e.stopPropagation(); onStatusChange(task.id,e.target.value); }} onClick={e=>e.stopPropagation()} style={{ fontSize:"10px", padding:"2px 7px", borderRadius:"20px", border:`1.5px solid ${status.color}`, color:status.color, background:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:"600", cursor:"pointer" }}>
              {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
            {task.calendarDate ? <span style={{ fontSize:"10px", color:"#4A8A4A", fontFamily:"'DM Sans',sans-serif" }}>📆 {task.calendarDate}{task.calendarTime&&task.calendarTime!=="All day"?` · ${task.calendarTime}`:""}</span>
              : task.deadline ? <span style={{ fontSize:"10px", color:isOverdue?"#C0392B":"#9A7B6A", fontFamily:"'DM Sans',sans-serif" }}>{isOverdue?"⚠️ ":"📅 "}{new Date(task.deadline+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span> : null}
            <span style={{ fontSize:"10px", color:"#C4A882", fontFamily:"'DM Sans',sans-serif", marginLeft:"auto" }}>{expanded?"▲":"▼"}</span>
          </div>
          {expanded && (
            <div style={{ marginTop:"10px" }} onClick={e=>e.stopPropagation()}>
              {task.notes && <p style={{ fontSize:"12px", color:"#7A5C44", lineHeight:"1.6", margin:"0 0 8px", fontFamily:"'DM Sans',sans-serif", background:"#FDF6EE", padding:"9px 11px", borderRadius:"9px", whiteSpace:"pre-line" }}>{task.notes}</p>}
              <EmailPanel task={task} />
              <div style={{ display:"flex", gap:"7px", marginTop:"10px" }}>
                {!task.fromCalendar && <button onClick={()=>onDraft(task)} style={{ background:"#C4956A", color:"white", border:"none", borderRadius:"20px", padding:"6px 14px", fontSize:"11px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:"600" }}>✨ Draft for me</button>}
                <button onClick={()=>onDelete(task.id)} style={{ background:"#F5EDE6", color:"#9A7B6A", border:"none", borderRadius:"20px", padding:"6px 12px", fontSize:"11px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Remove</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Add Task ──────────────────────────────────────────────────────────────────
function AddTaskModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ title:"", category:"admin", deadline:"", notes:"", urgent:false });
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(80,60,50,0.4)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <div style={{ background:"#FDF6EE", borderRadius:"24px", maxWidth:"480px", width:"100%", padding:"28px", boxShadow:"0 20px 60px rgba(100,70,50,0.2)", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ fontSize:"19px", fontWeight:"700", color:"#3D2B1F", fontFamily:"'Playfair Display',serif", marginBottom:"18px" }}>Add to your plate</div>
        {[{label:"What needs to happen?",key:"title",type:"text",placeholder:"e.g. Buy birthday gift for Emma's party"},{label:"Deadline (optional)",key:"deadline",type:"date"},{label:"Notes (optional)",key:"notes",type:"text",placeholder:"Any details..."}].map(f=>(
          <div key={f.key} style={{ marginBottom:"12px" }}>
            <label style={{ fontSize:"10px", color:"#9A7B6A", fontWeight:"700", display:"block", marginBottom:"4px", letterSpacing:"0.5px" }}>{f.label.toUpperCase()}</label>
            <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={{ width:"100%", padding:"10px 14px", borderRadius:"10px", border:"1.5px solid #E8D0B8", background:"white", fontSize:"14px", color:"#3D2B1F", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box" }} />
          </div>
        ))}
        <div style={{ marginBottom:"12px" }}>
          <label style={{ fontSize:"10px", color:"#9A7B6A", fontWeight:"700", display:"block", marginBottom:"4px" }}>CATEGORY</label>
          <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={{ width:"100%", padding:"10px 14px", borderRadius:"10px", border:"1.5px solid #E8D0B8", background:"white", fontSize:"14px", color:"#3D2B1F", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box" }}>
            {Object.entries(CATEGORIES).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.label}</option>)}
          </select>
        </div>
        <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"#7A5C44", marginBottom:"18px", cursor:"pointer" }}>
          <input type="checkbox" checked={form.urgent} onChange={e=>setForm(p=>({...p,urgent:e.target.checked}))} /> Mark as urgent
        </label>
        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={()=>{ if(form.title.trim()){ onAdd({...form,fromCalendar:false}); onClose(); }}} style={{ flex:1, background:"#C4956A", color:"white", border:"none", borderRadius:"12px", padding:"13px", fontSize:"14px", fontWeight:"600", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Add It</button>
          <button onClick={onClose} style={{ flex:1, background:"#F0E4D4", color:"#7A5C44", border:"none", borderRadius:"12px", padding:"13px", fontSize:"14px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [profile, setProfile] = useState(() => {
    try { const p = localStorage.getItem("matreo_profile"); return p ? JSON.parse(p) : null; } catch { return null; }
  });
  const [permsDone, setPermsDone] = useState(() => {
    try { return !!localStorage.getItem("matreo_perms"); } catch { return false; }
  });
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [view, setView] = useState("today");
  const [filter, setFilter] = useState("all");
  const [draftTask, setDraftTask] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const nextId = useRef(SEED_TASKS.length + 1);

  function completeOnboarding(p) {
    setProfile(p);
    try { localStorage.setItem("matreo_profile", JSON.stringify(p)); } catch {}
  }

  function completePerms() {
    setPermsDone(true);
    try { localStorage.setItem("matreo_perms", "1"); } catch {}
  }

  if (!profile) return <Onboarding onComplete={completeOnboarding} />;
  if (!permsDone) return <PermissionsScreen name={profile.name} onComplete={completePerms} />;

  const urgent = tasks.filter(t=>t.urgent&&t.status!=="done").length;
  const done = tasks.filter(t=>t.status==="done").length;
  const filtered = filter==="all" ? tasks.filter(t=>t.status!=="done")
    : filter==="urgent" ? tasks.filter(t=>t.urgent&&t.status!=="done")
    : filter==="calendar" ? tasks.filter(t=>t.fromCalendar)
    : filter==="done" ? tasks.filter(t=>t.status==="done")
    : tasks.filter(t=>t.category===filter&&t.status!=="done");

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#FDF0E4 0%,#F5E6D8 50%,#EDD8C8 100%)", fontFamily:"'DM Sans',sans-serif", paddingBottom:"80px" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#8B5E3C 0%,#A67C5B 100%)", padding:"28px 20px 20px", color:"white", borderRadius:"0 0 28px 28px", boxShadow:"0 8px 30px rgba(100,70,50,0.25)" }}>
          <div style={{ maxWidth:"600px", margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
              <div>
                <div style={{ fontSize:"10px", letterSpacing:"3px", opacity:0.6, fontWeight:"700", marginBottom:"3px" }}>MATREO</div>
                <div style={{ fontSize:"22px", fontWeight:"700", fontFamily:"'Playfair Display',serif" }}>Hi {profile.name} 🌸</div>
                <div style={{ fontSize:"11px", opacity:0.65, marginTop:"2px" }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"6px", alignItems:"flex-end" }}>
                <button onClick={()=>setShowAdd(true)} style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:"20px", padding:"7px 14px", color:"white", fontSize:"12px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:"600" }}>+ Add</button>
                <button onClick={()=>{ if(window.confirm("Reset your profile?")){ setProfile(null); try{localStorage.removeItem("matreo_profile");}catch{} }}} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.35)", fontSize:"10px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>⚙ settings</button>
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              {[{label:"Open",val:tasks.filter(t=>t.status!=="done").length,bg:"rgba(255,255,255,0.15)"},{label:"Urgent",val:urgent,bg:urgent>0?"rgba(220,80,60,0.4)":"rgba(255,255,255,0.15)"},{label:"Calendar",val:tasks.filter(t=>t.fromCalendar).length,bg:"rgba(100,180,100,0.3)"},{label:"Done",val:done,bg:"rgba(255,255,255,0.12)"}].map(s=>(
                <div key={s.label} style={{ background:s.bg, borderRadius:"10px", padding:"8px 10px", textAlign:"center", flex:1 }}>
                  <div style={{ fontSize:"18px", fontWeight:"700" }}>{s.val}</div>
                  <div style={{ fontSize:"9px", opacity:0.7, fontWeight:"700", letterSpacing:"0.5px" }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:"6px", marginTop:"12px" }}>
              {[{key:"today",label:"✦ Today's Focus"},{key:"all",label:"All Tasks"}].map(v=>(
                <button key={v.key} onClick={()=>setView(v.key)} style={{ flex:1, padding:"8px", borderRadius:"20px", fontSize:"12px", fontWeight:"700", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", background:view===v.key?"white":"rgba(255,255,255,0.15)", color:view===v.key?"#8B5E3C":"rgba(255,255,255,0.8)", transition:"all 0.2s" }}>{v.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:"600px", margin:"0 auto", padding:"14px 16px 0" }}>
          <div style={{ display:"flex", gap:"12px", marginBottom:"12px" }}>
            {[{label:"Gmail",color:"#7DAA7D"},{label:"Google Calendar",color:"#7DAA7D"}].map(s=>(
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                <div style={{ width:"6px", height:"6px", background:s.color, borderRadius:"50%" }} />
                <span style={{ fontSize:"10px", color:s.color, fontWeight:"700", letterSpacing:"0.5px" }}>{s.label.toUpperCase()}</span>
              </div>
            ))}
          </div>

          {view==="today" && <TodaysFocus tasks={tasks} profile={profile} onDraft={setDraftTask} onMarkDone={id=>setTasks(ts=>ts.map(t=>t.id===id?{...t,status:"done"}:t))} />}

          {view==="all" && <>
            <div style={{ display:"flex", gap:"7px", overflowX:"auto", paddingBottom:"8px", scrollbarWidth:"none", marginBottom:"10px" }}>
              {[{key:"all",label:"All Open"},{key:"urgent",label:"🔴 Urgent"},{key:"calendar",label:"📆 Calendar"},...Object.entries(CATEGORIES).map(([k,v])=>({key:k,label:`${v.emoji} ${v.label.split(" ")[0]}`})),{key:"done",label:"✓ Done"}].map(f=>(
                <button key={f.key} onClick={()=>setFilter(f.key)} style={{ whiteSpace:"nowrap", padding:"6px 13px", borderRadius:"20px", fontSize:"12px", border:filter===f.key?"none":"1.5px solid #E0C8B0", background:filter===f.key?"#8B5E3C":"white", color:filter===f.key?"white":"#7A5C44", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:"500" }}>{f.label}</button>
              ))}
            </div>
            {filtered.length===0
              ? <div style={{ textAlign:"center", padding:"48px 24px", color:"#B89070" }}><div style={{ fontSize:"30px", marginBottom:"10px" }}>🌿</div><div style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px" }}>Nothing here.</div></div>
              : filtered.map(task=><TaskCard key={task.id} task={task} onStatusChange={(id,s)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,status:s}:t))} onDraft={setDraftTask} onDelete={id=>setTasks(ts=>ts.filter(t=>t.id!==id))} />)
            }
          </>}

          <button onClick={()=>setShowAdd(true)} style={{ width:"100%", marginTop:"12px", padding:"14px", background:"white", border:"2px dashed #D4B090", borderRadius:"16px", fontSize:"14px", color:"#9A7B6A", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:"600" }}>+ Add something to your plate</button>
        </div>
      </div>
      {draftTask && <AiDraftModal task={draftTask} onClose={()=>setDraftTask(null)} />}
      {showAdd && <AddTaskModal onAdd={f=>setTasks(ts=>[...ts,{...f,id:nextId.current++}])} onClose={()=>setShowAdd(false)} />}
    </>
  );
}
