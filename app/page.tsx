"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";

type ChatMessage = {
  id: string;
  author: "Officer" | "OM";
  text: string;
  time: string;
};

type TabKey = "home" | "check" | "patrol" | "report" | "more";

type ReportSectionKey = "incident" | "visitor" | "vehicle" | "occurrence" | "handover";

type MoreSectionKey = "history" | "chat" | "profile" | "login";

type QuickActionKey =
  | "check"
  | "patrol"
  | "visitor"
  | "vehicle"
  | "incident"
  | "occurrence"
  | "handover"
  | "chat"
  | "announce"
  | "leave"
  | "emergency"
  | "history";

type QuickAction = {
  key: QuickActionKey;
  label: string;
  icon: string;
  accent: string;
  target: TabKey;
  reportSection?: ReportSectionKey;
  moreSection?: MoreSectionKey;
};

const assignment = {
  site: "Pier 47 Logistics Gate",
  window: "06:00 – 14:00",
  post: "North Watch",
  address: "184 Harbor St, Building A",
  supervisor: "OM Clark",
  tasks: [
    "Guard tour @ 06:15",
    "Delivery verification @ 08:30",
    "Relief prep @ 12:00",
  ],
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "check", label: "Check In/Out" },
  { key: "patrol", label: "Patrol" },
  { key: "report", label: "Report" },
  { key: "more", label: "More" },
];

const tabIcons: Record<TabKey, ReactNode> = {
  home: (
    <svg className="tab-icon" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none">
      <path
        d="M4 11.5 11.4 5a1 1 0 0 1 1.3 0L20 11.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.5V19a.5.5 0 0 0 .5.5H11v-4h2v4h4a.5.5 0 0 0 .5-.5v-8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  check: (
    <svg className="tab-icon" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none">
      <circle cx="12" cy="12" r="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  patrol: (
    <svg className="tab-icon" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none">
      <path
        d="M12 4.5c-3 0-5.5 2.3-5.5 5.3 0 4.2 5.5 9.7 5.5 9.7s5.5-5.5 5.5-9.7c0-3-2.5-5.3-5.5-5.3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.8" r="1.8" />
    </svg>
  ),
  report: (
    <svg className="tab-icon" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none">
      <path
        d="M12.7 4.7 20 17.8a1 1 0 0 1-.9 1.5H4.9a1 1 0 0 1-.9-1.5L11.3 4.7a1 1 0 0 1 1.4 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 9v4.5" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  more: (
    <svg className="tab-icon" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none">
      <path d="M6 8h12M6 12h12M6 16h12" strokeLinecap="round" />
    </svg>
  ),
};

const quickActions: QuickAction[] = [
  { key: "check", label: "Check In", icon: "✔", accent: "from-emerald-500/40 to-emerald-600/30", target: "check" },
  { key: "patrol", label: "Patrol", icon: "📋", accent: "from-indigo-500/40 to-indigo-700/30", target: "patrol" },
  {
    key: "visitor",
    label: "Visitor",
    icon: "👥",
    accent: "from-blue-500/40 to-blue-700/30",
    target: "report",
    reportSection: "visitor",
  },
  {
    key: "vehicle",
    label: "Vehicle",
    icon: "🚗",
    accent: "from-orange-500/40 to-red-500/30",
    target: "report",
    reportSection: "vehicle",
  },
  {
    key: "incident",
    label: "Incident",
    icon: "⚠️",
    accent: "from-rose-500/40 to-amber-500/30",
    target: "report",
    reportSection: "incident",
  },
  {
    key: "occurrence",
    label: "Occ. Book",
    icon: "📝",
    accent: "from-cyan-400/40 to-sky-500/30",
    target: "report",
    reportSection: "occurrence",
  },
  {
    key: "handover",
    label: "Handover",
    icon: "🔄",
    accent: "from-purple-500/40 to-fuchsia-500/30",
    target: "report",
    reportSection: "handover",
  },
  { key: "announce", label: "Announcements", icon: "📢", accent: "from-slate-400/40 to-slate-600/30", target: "home" },
  { key: "leave", label: "Apply Leave", icon: "🗓️", accent: "from-sky-400/40 to-sky-600/30", target: "home" },
  {
    key: "emergency",
    label: "Emergency",
    icon: "🚨",
    accent: "from-rose-600/50 to-rose-800/30",
    target: "report",
    reportSection: "incident",
  },
  {
    key: "chat",
    label: "Contact OM",
    icon: "💬",
    accent: "from-slate-500/40 to-slate-700/30",
    target: "more",
    moreSection: "chat",
  },
  {
    key: "history",
    label: "Attendance",
    icon: "📅",
    accent: "from-indigo-400/40 to-indigo-600/30",
    target: "more",
    moreSection: "history",
  },
];

const reportPrimaryTabs: Array<{ key: ReportSectionKey; label: string }> = [
  { key: "incident", label: "Incident" },
  { key: "visitor", label: "Visitors" },
  { key: "vehicle", label: "Vehicles" },
];

const moreOptions: Array<{ key: MoreSectionKey; label: string }> = [
  { key: "history", label: "Attendance History" },
  { key: "chat", label: "Chat / Contact OM" },
  { key: "profile", label: "Profile & history" },
  { key: "login", label: "Secure login" },
];

const patrolSchedule = [
  { time: "06:15", checkpoint: "North Gate Sweep", status: "pending" },
  { time: "08:30", checkpoint: "Dock 3 Delivery", status: "pending" },
  { time: "10:45", checkpoint: "Warehouse Loop", status: "done" },
  { time: "12:15", checkpoint: "Admin Wing", status: "up next" },
];

const checkpoints = [
  { label: "Pier QR-01", status: "Ready" },
  { label: "Dock QR-07", status: "Missed" },
  { label: "Gate QR-11", status: "Scanned" },
];

const occurrenceEntries = [
  { id: 1, type: "Routine", summary: "All gates secured", time: "05:45" },
  { id: 2, type: "Incident", summary: "Delivery delay logged", time: "07:20" },
  { id: 3, type: "Handover", summary: "Briefed relief on badge policy", time: "13:50" },
];

const announcements = [
  {
    id: "ann-1",
    title: "HQ inspection",
    detail: "Regional director on site tomorrow 07:00.",
    time: "1h ago",
  },
  {
    id: "ann-2",
    title: "Uniform update",
    detail: "New reflective vest required for night patrols.",
    time: "Yesterday",
  },
];

const chatSeed: ChatMessage[] = [
  { id: "m1", author: "OM", text: "Confirming you received the updated patrol route.", time: "05:05" },
  { id: "m2", author: "Officer", text: "Received. Starting first sweep.", time: "05:10" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [formData, setFormData] = useState({ email: "", phone: "", password: "", otp: "" });
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);
  const [status, setStatus] = useState<"on" | "off" | "done">("off");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [incident, setIncident] = useState({ type: "Security", severity: "Medium", description: "" });
  const [incidentNotice, setIncidentNotice] = useState<string | null>(null);
  const [visitor, setVisitor] = useState({ name: "", id: "", purpose: "", host: "" });
  const [vehicle, setVehicle] = useState({ plate: "", type: "Van", purpose: "Delivery" });
  const [visitorNotice, setVisitorNotice] = useState<string | null>(null);
  const [vehicleNotice, setVehicleNotice] = useState<string | null>(null);
  const [reportSection, setReportSection] = useState<ReportSectionKey>("incident");
  const [moreSection, setMoreSection] = useState<MoreSectionKey | null>(null);
  const [occurrenceDraft, setOccurrenceDraft] = useState("");
  const [occurrenceNotice, setOccurrenceNotice] = useState<string | null>(null);
  const [handover, setHandover] = useState({
    summary: "Pending dock sweep",
    issues: "Battery swap for QR scanner",
    relief: "Not confirmed",
  });
  const [language, setLanguage] = useState<"EN" | "MY">("EN");
  const [chatMessages, setChatMessages] = useState(chatSeed);
  const [newChat, setNewChat] = useState("");
  const [qrNotice, setQrNotice] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<"idle" | "scanning">("idle");
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  const statusLabel = status === "on" ? "On duty" : status === "done" ? "Checked-out" : "Not checked-in";

  const formatTime = (iso: string) =>
    new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(iso));

  const formattedCheckIn = useMemo(() => (checkInTime ? formatTime(checkInTime) : "--:--"), [checkInTime]);

  const handleQuickAction = (action: QuickAction) => {
    setActiveTab(action.target);
    if (action.target === "report") {
      setReportSection(action.reportSection ?? "incident");
      return;
    }
    if (action.target === "more") {
      setMoreSection(action.moreSection ?? null);
    }
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab === "report") {
      setReportSection("incident");
      return;
    }
    if (tab === "more") {
      setMoreSection(null);
    }
  };

  const handleCredentialChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const identifier = contactMethod === "email" ? formData.email.trim() : formData.phone.trim();
    const credential = authMode === "password" ? formData.password.trim() : formData.otp.trim();

    if (!identifier || !credential) {
      setLoginFeedback("Provide your contact info and credential to continue.");
      return;
    }

    setLoginFeedback("Credentials locked. You can proceed to site check-in.");
  };

  const handleAttendance = (type: "check-in" | "check-out") => {
    setError(null);

    if (type === "check-in") {
      if (status === "on") {
        setError("Already checked in for this assignment.");
        return;
      }

      setStatus("on");
      setCheckInTime(new Date().toISOString());
      return;
    }

    if (status === "off") {
      setError("You are not checked in yet.");
      return;
    }

    setStatus("done");
  };


  const submitIncident = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!incident.description.trim()) {
      setIncidentNotice("Add a short description before submitting.");
      return;
    }
    setIncidentNotice("Incident submitted to OM • status: Submitted");
    setIncident((prev) => ({ ...prev, description: "" }));
  };

  const submitVisitor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!visitor.name.trim()) {
      setVisitorNotice("Enter visitor details.");
      return;
    }
    setVisitorNotice("Visitor badge issued. Remember to log checkout.");
    setVisitor({ name: "", id: "", purpose: "", host: "" });
  };

  const submitVehicle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vehicle.plate.trim()) {
      setVehicleNotice("Plate number required.");
      return;
    }
    setVehicleNotice("Vehicle entry recorded. Syncs with OM dashboard.");
    setVehicle((prev) => ({ ...prev, plate: "" }));
  };

  const submitOccurrence = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!occurrenceDraft.trim()) {
      setOccurrenceNotice("Add log details or photos reference.");
      return;
    }
    setOccurrenceNotice("Entry saved locally. Syncs once online.");
    setOccurrenceDraft("");
  };

  const sendChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newChat.trim()) {
      return;
    }
    const message: ChatMessage = {
      id: `local-${Date.now()}`,
      author: "Officer",
      text: newChat.trim(),
      time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()),
    };
    setChatMessages((prev) => [...prev, message]);
    setNewChat("");
  };

  const launchQrScanner = () => {
    setQrNotice("QR scanner requested. Opening device camera flow...");
    setTimeout(() => setQrNotice(null), 4000);
  };

  const scanAndAttend = (type: "check-in" | "check-out") => {
    if (scanProgress === "scanning") {
      return;
    }
    setError(null);
    setScanProgress("scanning");
    setScanNotice(
      `Scanning assignment QR for ${type === "check-in" ? "check-in" : "check-out"}...`
    );
    setTimeout(() => {
      setScanProgress("idle");
      setScanNotice(
        `Scan verified • ${type === "check-in" ? "Check-in" : "Check-out"} recorded`
      );
      handleAttendance(type);
      setTimeout(() => setScanNotice(null), 4000);
    }, 1600);
  };

  const renderHomeTab = () => (
    <>
      <section className="rounded-3xl border border-slate-800/70 bg-[#0b1224]/90 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Quick actions</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.key}
              onClick={() => handleQuickAction(action)}
              className={`group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-800/60 bg-gradient-to-br ${action.accent} px-3 py-3 text-left text-sm font-semibold text-slate-100 transition duration-300 hover:-translate-y-0.5 hover:border-slate-600`}
            >
              <span className="text-lg">{action.icon}</span>
              <span className="flex-1 text-left">{action.label}</span>
              <span className="text-[10px] uppercase text-slate-300 group-hover:text-white">GO</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-800/80 bg-[#0b1327]/80 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Shift checklist</p>
            <h2 className="text-lg font-semibold">{assignment.post}</h2>
          </div>
          <span className="text-xs text-slate-500">{assignment.address}</span>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">
          {assignment.tasks.map((task) => (
            <li
              key={task}
              className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/70 px-3 py-2"
            >
              <span>{task}</span>
              <span className="text-[11px] text-emerald-300">Ready</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-3xl border border-slate-800/70 bg-[#0b1224]/85 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Announcements</h3>
          <span className="text-xs text-slate-400">HQ feed</span>
        </div>
        <ul className="space-y-2 text-sm text-slate-200">
          {announcements.map((note) => (
            <li
              key={note.id}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-3"
            >
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-500">
                <span>{note.title}</span>
                <span>{note.time}</span>
              </div>
              <p className="mt-1 text-slate-200">{note.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );

  const renderStatusPill = (state: string) => {
    const normalized = state.toLowerCase();
    if (normalized === "done" || normalized === "scanned") {
      return "bg-emerald-500/10 text-emerald-200 border border-emerald-400/40";
    }

    if (normalized === "pending") {
      return "bg-amber-500/10 text-amber-200 border border-amber-400/40";
    }

    if (normalized === "up next" || normalized === "ready") {
      return "bg-sky-500/10 text-sky-200 border border-sky-400/40";
    }

    if (normalized === "missed") {
      return "bg-rose-500/10 text-rose-200 border border-rose-400/40";
    }

    return "bg-slate-800/80 text-slate-300 border border-slate-700/80";
  };

  const renderCheckTab = () => (
    <>
      <section className="space-y-3 rounded-3xl border border-slate-800/70 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950/90 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Attendance status</p>
            <p className="text-xl font-semibold">{statusLabel}</p>
          </div>
          <div className="relative flex items-center gap-2">
            <span
              className={`status-pill ${status === "on" ? "bg-emerald-500/20 text-emerald-100" : status === "done" ? "bg-indigo-500/30 text-indigo-100" : "bg-slate-700/70 text-slate-200"}`}
            >
              {statusLabel}
            </span>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-300" />
            </span>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/70 p-3 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Check-in time</span>
            <strong className="text-base text-white">{formattedCheckIn}</strong>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Site</span>
            <span>{assignment.site}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => scanAndAttend("check-in")}
            disabled={scanProgress === "scanning"}
            className={`group rounded-2xl border border-emerald-500/20 bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
              status === "on" ? "shadow-[0_0_25px_rgba(16,185,129,0.35)]" : ""
            } ${scanProgress === "scanning" ? "cursor-not-allowed opacity-60" : ""}`}
          >
            Scan for Check-In
          </button>
          <button
            onClick={() => scanAndAttend("check-out")}
            disabled={scanProgress === "scanning"}
            className={`rounded-2xl border border-slate-700/70 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-200 ${
              scanProgress === "scanning" ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            Scan for Check-Out
          </button>
        </div>
        {scanNotice && <p className="text-xs text-emerald-200">{scanNotice}</p>}
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">
            {error}
          </div>
        )}
      </section>
    </>
  );

  const renderPatrolTab = () => (
    <>
      <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Patrol & QR checkpoints</h3>
          <span className="text-xs text-slate-400">Progress 68%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: "68%" }} />
        </div>
        <ul className="space-y-2 text-xs text-slate-300">
          {patrolSchedule.map((patrol) => (
            <li
              key={patrol.time}
              className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">{patrol.checkpoint}</p>
                <p className="text-[11px] text-slate-500">{patrol.time}</p>
              </div>
              <span
                className={`text-[10px] uppercase tracking-wide rounded-full px-3 py-1 ${renderStatusPill(patrol.status)}`}
              >
                {patrol.status}
              </span>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 text-xs text-slate-300">
          <p className="text-sm font-semibold">Checkpoint status</p>
          <ul className="mt-2 space-y-1">
            {checkpoints.map((checkpoint) => (
              <li key={checkpoint.label} className="flex items-center justify-between">
                <span>{checkpoint.label}</span>
                <span
                  className={`text-[10px] uppercase tracking-wide rounded-full px-2 py-1 ${renderStatusPill(checkpoint.status)}`}
                >
                  {checkpoint.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-500">Missed patrols trigger alerts to OM. Scan QR at each post to auto-log GPS + timestamp.</p>
      </section>

      <section className="space-y-2 rounded-3xl border border-slate-800/80 bg-[#0b1327]/80 p-4 text-sm text-slate-300">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">QR Scan Prep</p>
          <span className="text-xs text-slate-500">Camera ready</span>
        </div>
        <p>Scan checkpoint tags to log patrols. Offline mode stores scans, then syncs on network reconnect.</p>
        <button
          onClick={launchQrScanner}
          className="w-full rounded-2xl border border-emerald-400/60 bg-emerald-500/30 px-4 py-3 text-sm font-semibold text-emerald-50"
        >
          Launch QR Scanner
        </button>
        {qrNotice && <p className="text-xs text-emerald-200">{qrNotice}</p>}
      </section>
    </>
  );

  const renderReportContent = () => {
    switch (reportSection) {
      case "incident":
        return (
          <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0b1224] p-4">
            <h3 className="text-lg font-semibold">Incident report</h3>
            <form className="space-y-3 text-sm" onSubmit={submitIncident}>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(["Security", "Safety", "Operational", "Other"] as const).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setIncident((prev) => ({ ...prev, type }))}
                    className={`rounded-2xl border px-3 py-2 font-semibold uppercase tracking-wide transition ${
                      incident.type === type ? "border-rose-400 bg-rose-500/20 text-white" : "border-slate-700 text-slate-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Severity</span>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High"] as const).map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setIncident((prev) => ({ ...prev, severity: level }))}
                      className={`rounded-full border px-3 py-1 text-[11px] uppercase ${
                        incident.severity === level
                          ? "border-amber-300 bg-amber-500/20 text-white"
                          : "border-slate-700 text-slate-400"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={incident.description}
                onChange={(event) => setIncident((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Describe event, actions taken, people involved..."
                className="input min-h-[90px]"
              />
              <button
                type="submit"
                className="w-full rounded-2xl border border-rose-400/60 bg-rose-500/30 px-4 py-3 text-sm font-semibold text-rose-50 transition hover:border-rose-300 hover:bg-rose-500/40"
              >
                Submit Incident
              </button>
            </form>
            {incidentNotice && <p className="text-xs text-rose-100">{incidentNotice}</p>}
          </section>
        );
      case "visitor":
        return (
          <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-4">
            <h3 className="text-lg font-semibold">Visitor management</h3>
            <form className="space-y-2 text-sm" onSubmit={submitVisitor}>
              <input
                type="text"
                value={visitor.name}
                onChange={(event) => setVisitor((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Visitor name"
                className="input"
              />
              <input
                type="text"
                value={visitor.id}
                onChange={(event) => setVisitor((prev) => ({ ...prev, id: event.target.value }))}
                placeholder="ID / NRIC"
                className="input"
              />
              <input
                type="text"
                value={visitor.purpose}
                onChange={(event) => setVisitor((prev) => ({ ...prev, purpose: event.target.value }))}
                placeholder="Purpose"
                className="input"
              />
              <input
                type="text"
                value={visitor.host}
                onChange={(event) => setVisitor((prev) => ({ ...prev, host: event.target.value }))}
                placeholder="Host to notify"
                className="input"
              />
              <button
                type="submit"
                className="w-full rounded-2xl border border-blue-400/50 bg-blue-500/30 px-4 py-3 text-sm font-semibold text-blue-100"
              >
                Issue Visitor Pass
              </button>
            </form>
            {visitorNotice && <p className="text-xs text-blue-200">{visitorNotice}</p>}
          </section>
        );
      case "vehicle":
        return (
          <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-4">
            <h3 className="text-lg font-semibold">Vehicle log</h3>
            <form className="space-y-2 text-sm" onSubmit={submitVehicle}>
              <input
                type="text"
                value={vehicle.plate}
                onChange={(event) => setVehicle((prev) => ({ ...prev, plate: event.target.value }))}
                placeholder="Plate number"
                className="input"
              />
              <select
                value={vehicle.type}
                onChange={(event) => setVehicle((prev) => ({ ...prev, type: event.target.value }))}
                className="input"
              >
                <option>Van</option>
                <option>Truck</option>
                <option>Car</option>
                <option>Motorcycle</option>
              </select>
              <select
                value={vehicle.purpose}
                onChange={(event) => setVehicle((prev) => ({ ...prev, purpose: event.target.value }))}
                className="input"
              >
                <option>Delivery</option>
                <option>Pick-up</option>
                <option>Maintenance</option>
              </select>
              <button
                type="submit"
                className="w-full rounded-2xl border border-orange-400/60 bg-orange-500/30 px-4 py-3 text-sm font-semibold text-orange-50"
              >
                Log Vehicle Entry
              </button>
            </form>
            {vehicleNotice && <p className="text-xs text-orange-100">{vehicleNotice}</p>}
          </section>
        );
      case "occurrence":
        return (
          <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0b1327]/80 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Occurrence book</h3>
              <span className="text-xs text-slate-400">Edit history on</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              {occurrenceEntries.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{entry.type}</span>
                    <span>{entry.time}</span>
                  </div>
                  <p className="mt-1 font-semibold">{entry.summary}</p>
                </li>
              ))}
            </ul>
            <form onSubmit={submitOccurrence} className="space-y-2 text-sm">
              <textarea
                value={occurrenceDraft}
                onChange={(event) => setOccurrenceDraft(event.target.value)}
                placeholder="Add new entry… (Routine / Incident / Handover / Maintenance)"
                className="input min-h-[80px]"
              />
              <button
                type="submit"
                className="w-full rounded-2xl border border-cyan-400/60 bg-cyan-500/30 px-4 py-3 text-sm font-semibold text-cyan-50"
              >
                Save Entry
              </button>
            </form>
            {occurrenceNotice && <p className="text-xs text-cyan-100">{occurrenceNotice}</p>}
          </section>
        );
      case "handover":
        return (
          <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Handover & shift end</h3>
              <span className="text-xs text-slate-400">Shift handoff</span>
            </div>
            <div className="space-y-1 text-sm text-slate-300">
              <p>
                <span className="text-slate-500">Summary:</span> {handover.summary}
              </p>
              <p>
                <span className="text-slate-500">Pending issues:</span> {handover.issues}
              </p>
              <p>
                <span className="text-slate-500">Relief:</span> {handover.relief}
              </p>
            </div>
            <button
              onClick={() => setHandover((prev) => ({ ...prev, relief: "Confirmed" }))}
              className="w-full rounded-2xl border border-purple-400/60 bg-purple-500/30 px-4 py-3 text-sm font-semibold text-purple-100"
            >
              Confirm Relief Officer
            </button>
          </section>
        );
      default:
        return null;
    }
  };

  const renderReportTab = () => {
    return (
      <>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {reportPrimaryTabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => setReportSection(tab.key)}
              className={`rounded-2xl border px-3 py-2 font-semibold uppercase tracking-wide transition ${
                reportSection === tab.key
                  ? "border-slate-100 bg-slate-100/10 text-white"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {renderReportContent()}
      </>
    );
  };

  const renderMoreContent = () => {
    if (!moreSection) {
      return null;
    }

    switch (moreSection) {
      case "history":
        return (
          <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Attendance history</h3>
              <span className="text-xs text-slate-400">Last 14 days</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-200">
              {["Thu, Jan 2", "Wed, Jan 1", "Tue, Dec 31", "Mon, Dec 30"].map((day, index) => (
                <li
                  key={day}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-3 py-2"
                >
                  <div>
                    <p className="font-semibold">{day}</p>
                    <p className="text-xs text-slate-500">Pier 47 • 06:00 – 14:00</p>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wide rounded-full px-3 py-1 ${
                      index === 0
                        ? "bg-emerald-500/10 text-emerald-200 border border-emerald-400/40"
                        : "bg-indigo-500/10 text-indigo-200 border border-indigo-400/40"
                    }`}
                  >
                    {index === 0 ? "On time" : "Completed"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 text-xs text-slate-300">
              <p className="text-sm font-semibold">Missed or late</p>
              <p className="mt-1 text-slate-400">System flags any missed check-in so the guard knows their status.</p>
            </div>
          </section>
        );
      case "chat":
        return (
          <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0b1224] p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Chat / Contact OM</h3>
              <span className="text-xs text-slate-400">Secure line</span>
            </div>
            <div className="space-y-2 text-sm text-slate-200">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-3 py-2 text-xs ${
                    message.author === "Officer" ? "bg-emerald-500/20 text-emerald-50" : "bg-slate-800/80 text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wide">
                    <span>{message.author}</span>
                    <span>{message.time}</span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendChat} className="flex gap-2">
              <input
                type="text"
                value={newChat}
                onChange={(event) => setNewChat(event.target.value)}
                placeholder="Update OM..."
                className="input flex-1"
              />
              <button type="submit" className="rounded-2xl border border-slate-500/60 bg-slate-800/80 px-4 text-sm font-semibold">
                Send
              </button>
            </form>
          </section>
        );
      case "profile":
        return (
          <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Profile & history</h3>
              <button
                onClick={() => setLanguage((prev) => (prev === "EN" ? "MY" : "EN"))}
                className="rounded-full border border-slate-700/60 px-3 py-1 text-[11px] text-slate-300"
              >
                {language === "EN" ? "English" : "Burmese"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-2">
                <p className="text-slate-400">Shifts</p>
                <p className="text-lg font-semibold text-white">128</p>
              </div>
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-2">
                <p className="text-slate-400">Patrols</p>
                <p className="text-lg font-semibold text-white">642</p>
              </div>
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-2">
                <p className="text-slate-400">Incidents</p>
                <p className="text-lg font-semibold text-white">12</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">History shows last 30 days of activity. Export via OM console for audits.</p>
          </section>
        );
      case "login":
        return (
          <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Secure login</h3>
              <span className="text-xs text-slate-400">Encrypted</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(["email", "phone"] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setContactMethod(method)}
                  className={`rounded-2xl border px-3 py-2 font-semibold uppercase tracking-wide transition ${
                    contactMethod === method ? "border-indigo-400 bg-indigo-500/20 text-white" : "border-slate-700 text-slate-400"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(["password", "otp"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  className={`rounded-2xl border px-3 py-2 font-semibold uppercase tracking-wide transition ${
                    authMode === mode ? "border-emerald-400 bg-emerald-500/20 text-white" : "border-slate-700 text-slate-400"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <form className="space-y-3" onSubmit={handleLogin}>
              {contactMethod === "email" ? (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400" htmlFor="guard-email">
                    Email address
                  </label>
                  <input
                    id="guard-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => handleCredentialChange("email", event.target.value)}
                    placeholder="alex@guardly.com"
                    className="input"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400" htmlFor="guard-phone">
                    Phone number
                  </label>
                  <input
                    id="guard-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(event) => handleCredentialChange("phone", event.target.value)}
                    placeholder="+95 9 123 456 789"
                    className="input"
                  />
                </div>
              )}
              {authMode === "password" ? (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400" htmlFor="guard-password">
                    Password
                  </label>
                  <input
                    id="guard-password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(event) => handleCredentialChange("password", event.target.value)}
                    placeholder="••••••••"
                    className="input"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400" htmlFor="guard-otp">
                    One-time code
                  </label>
                  <input
                    id="guard-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={formData.otp}
                    onChange={(event) => handleCredentialChange("otp", event.target.value)}
                    placeholder="123456"
                    className="input tracking-[0.5em]"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full rounded-2xl border border-indigo-400/60 bg-indigo-500/30 px-4 py-3 text-sm font-semibold text-indigo-100 transition hover:border-indigo-300 hover:bg-indigo-500/40"
              >
                Secure Login
              </button>
            </form>
            {loginFeedback && <p className="text-xs text-slate-400">{loginFeedback}</p>}
          </section>
        );
      default:
        return null;
    }
  };

  const renderMoreTab = () => {
    if (!moreSection) {
      return (
        <div className="space-y-2">
          {moreOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setMoreSection(option.key)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-700 px-3 py-3 text-left text-sm font-semibold text-slate-200"
            >
              <span>{option.label}</span>
              <span className="text-[10px] uppercase tracking-wide">GO</span>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setMoreSection(null)}
          className="text-left text-xs uppercase tracking-wide text-slate-400"
        >
          &lt; Back
        </button>
        {renderMoreContent()}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return renderHomeTab();
      case "check":
        return renderCheckTab();
      case "patrol":
        return renderPatrolTab();
      case "report":
        return renderReportTab();
      case "more":
        return renderMoreTab();
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </div>

      <main className="relative mx-auto flex w-full max-w-sm flex-col gap-4 rounded-[32px] bg-[#070b15]/95 p-6 pb-32 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur">
        {activeTab !== "more" && (
          <header className="space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
              <span>guardly</span>
              <span>v0.4</span>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Today&apos;s assignment</p>
                  <h1 className="text-2xl font-semibold">{assignment.site}</h1>
                  <p className="text-sm text-slate-400">{assignment.post}</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/30 px-3 py-1 text-xs text-emerald-200">
                  {assignment.window}
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">Supervisor: {assignment.supervisor}</p>
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-xs">
                <span>Status</span>
                <span className="font-semibold text-emerald-200">{statusLabel}</span>
              </div>
            </div>
          </header>
        )}

        <div className="space-y-4">{renderTabContent()}</div>

        <nav className="tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="tab-button"
              data-active={activeTab === tab.key}
            >
              {tabIcons[tab.key]}
              <span className="text-[11px] uppercase tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
