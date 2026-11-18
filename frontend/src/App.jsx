
import { useMemo, useState } from "react";
import {
  LayoutDashboard, Users, BrainCircuit, Target, Settings,
  Search, Bell, Plus, ArrowUpRight, ArrowDownRight,
  TrendingUp, Clock, CheckCircle2, Sparkles, Menu,
  X, Send, Zap, Activity
} from "lucide-react";
import "./index.css";

const API_URL = "http://127.0.0.1:8000/api/analyze";

const initialLeads = [
  {
    id: 1,
    name: "Rahul Sharma",
    company: "FashionKart",
    service: "E-commerce Development",
    budget: "₹1,00,000",
    score: 94,
    priority: "High",
    status: "New",
    message: "Need an e-commerce website with payment gateway within 30 days."
  },
  {
    id: 2,
    name: "Priya Verma",
    company: "GrowthHub",
    service: "AI Automation",
    budget: "₹75,000",
    score: 86,
    priority: "High",
    status: "Contacted",
    message: "Looking for AI automation for customer support."
  },
  {
    id: 3,
    name: "Amit Gupta",
    company: "TechNova",
    service: "Web Development",
    budget: "₹40,000",
    score: 62,
    priority: "Medium",
    status: "New",
    message: "Need a modern business website."
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    company: "EduSmart",
    service: "AI Solutions",
    budget: "₹25,000",
    score: 38,
    priority: "Low",
    status: "Pending",
    message: "Exploring AI solutions for a future project."
  }
];

function App() {
  const [leads, setLeads] = useState(initialLeads);
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [notification, setNotification] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    service: "Web Development",
    budget: "",
    message: ""
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) =>
      `${lead.name} ${lead.company} ${lead.service}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [leads, search]);

  const highPriority = leads.filter(
    lead => lead.priority === "High"
  ).length;

  const averageScore = leads.length
    ? Math.round(
        leads.reduce((sum, lead) => sum + lead.score, 0) /
        leads.length
      )
    : 0;

  function notify(message) {
    setNotification(message);
    setTimeout(() => setNotification(""), 3500);
  }

  async function analyzeLead(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      notify("Please enter customer name and requirements.");
      return;
    }

    if (analyzing) return;

    setAnalyzing(true);

    try {
      const analysisMessage = form.budget.trim()
        ? `${form.message}. Customer budget: ${form.budget}`
        : form.message;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: analysisMessage
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.analysis) {
        throw new Error(
          result.message || "AI analysis could not be completed."
        );
      }

      const ai = result.analysis;

      const newLead = {
        id: Date.now(),
        name: form.name.trim(),
        company: form.company.trim() || "Independent Client",
        service: ai.service,
        budget: ai.budget || form.budget || "Not specified",
        score: ai.lead_score,
        priority: ai.priority,
        status: "New",
        message: form.message,
        timeline: ai.timeline,
        confidence: ai.confidence,
        recommendedAction: ai.recommended_action,
        suggestedReply: ai.suggested_reply
      };

      setLeads(previous => [newLead, ...previous]);
      setSelectedLead(newLead);
      setShowForm(false);

      setForm({
        name: "",
        company: "",
        service: "Web Development",
        budget: "",
        message: ""
      });

      setActiveTab("Leads");
      notify("AI successfully analyzed the new lead!");

    } catch (error) {
      console.error("AI Analysis Error:", error);

      notify(
        "AI connection failed. Check that Python backend is running."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Leads", icon: Users },
    { label: "AI Intelligence", icon: BrainCircuit },
    { label: "Analytics", icon: Activity }
  ];

  return (
    <div className="app-shell">

      {mobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>

        <div className="brand">
          <div className="brand-icon">
            <BrainCircuit size={25} />
          </div>

          <div>
            <h2>Cynbit<span>AI</span></h2>
            <small>INTELLIGENCE PLATFORM</small>
          </div>

          <button
            className="close-menu"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  activeTab === item.label ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(item.label);
                  setMobileMenu(false);
                  setSelectedLead(null);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.label === "Leads" && (
                  <span className="nav-count">{leads.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">

          <div className="upgrade-card">
            <Sparkles size={21} />
            <h4>AI Powered Growth</h4>
            <p>Turn customer inquiries into business opportunities.</p>
          </div>

          <button className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">MS</div>
            <div>
              <strong>Admin User</strong>
              <small>Administrator</small>
            </div>
          </div>

        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">

          <div className="top-left">
            <button
              className="menu-toggle"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={22} />
            </button>

            <div className="breadcrumb">
              Workspace <span>/</span> {activeTab}
            </div>
          </div>

          <div className="top-actions">
            <div className="system-status">
              <span /> AI System Online
            </div>

            <button
              className="icon-button"
              onClick={() => notify("You're all caught up!")}
            >
              <Bell size={19} />
            </button>

            <div className="avatar top-avatar">MS</div>
          </div>

        </header>

        <div className="page-content">

          <section className="welcome-row">

            <div>
              <div className="eyebrow">
                <Sparkles size={14} />
                INTELLIGENT BUSINESS PLATFORM
              </div>

              <h1>
                {activeTab === "Overview"
                  ? "Business Overview"
                  : activeTab}
              </h1>

              <p>
                Manage opportunities. Discover insights. Grow smarter with AI.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} /> Add New Lead
            </button>

          </section>

          {activeTab === "Overview" && (
            <>
              <section className="stats-grid">

                <StatCard
                  title="Total Leads"
                  value={leads.length}
                  icon={Users}
                  trend="Live records"
                  positive
                />

                <StatCard
                  title="High Priority"
                  value={highPriority}
                  icon={Target}
                  trend="Needs attention"
                  positive
                />

                <StatCard
                  title="Average AI Score"
                  value={`${averageScore}/100`}
                  icon={BrainCircuit}
                  trend="Calculated score"
                  positive
                />

                <StatCard
                  title="Contacted Leads"
                  value={leads.filter(l => l.status === "Contacted").length}
                  icon={CheckCircle2}
                  trend="Follow-up activity"
                  positive
                />

              </section>

              <section className="content-grid">

                <div className="panel lead-panel">

                  <div className="panel-heading">
                    <div>
                      <h3>Recent Opportunities</h3>
                      <p>AI-scored customer inquiries</p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => setActiveTab("Leads")}
                    >
                      View all <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <LeadTable
                    leads={filteredLeads.slice(0, 5)}
                    onSelect={setSelectedLead}
                  />

                </div>

                <div className="panel insight-panel">

                  <div className="panel-heading">
                    <div>
                      <h3>
                        <Sparkles size={17} className="purple-icon" />
                        AI Insights
                      </h3>
                      <p>Business intelligence</p>
                    </div>

                    <span className="live-tag">LIVE</span>
                  </div>

                  <div className="insight-highlight">
                    <div className="insight-icon">
                      <TrendingUp size={21} />
                    </div>

                    <div>
                      <strong>{highPriority} high-priority leads</strong>
                      <p>
                        Review these opportunities first to focus your sales efforts.
                      </p>
                    </div>
                  </div>

                  <div className="insight-item">
                    <Zap size={17} />
                    <div>
                      <strong>AI lead classification</strong>
                      <p>Python ML model identifies customer service requirements.</p>
                    </div>
                  </div>

                  <div className="insight-item">
                    <Clock size={17} />
                    <div>
                      <strong>Recommended action</strong>
                      <p>Prioritize customer follow-ups based on AI lead scores.</p>
                    </div>
                  </div>

                  <button
                    className="outline-button"
                    onClick={() => setActiveTab("AI Intelligence")}
                  >
                    Explore AI Intelligence <ArrowUpRight size={16} />
                  </button>

                </div>
              </section>
            </>
          )}

          {activeTab === "Leads" && (
            <section className="panel full-panel">

              <div className="panel-heading">
                <div>
                  <h3>Lead Management</h3>
                  <p>Search, analyze and manage customer inquiries.</p>
                </div>

                <button
                  className="primary-button small-button"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} /> New Lead
                </button>
              </div>

              <div className="search-box">
                <Search size={18} />

                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, company or service..."
                />
              </div>

              <LeadTable
                leads={filteredLeads}
                onSelect={setSelectedLead}
              />

            </section>
          )}

          {activeTab === "AI Intelligence" && (
            <section className="ai-page">

              <div className="ai-hero">
                <div className="ai-orb">
                  <BrainCircuit size={42} />
                </div>

                <div className="eyebrow">
                  CYNBIT INTELLIGENCE ENGINE
                </div>

                <h2>AI-Powered Lead Intelligence</h2>

                <p>
                  Analyze customer requirements, identify business opportunities
                  and prioritize sales leads.
                </p>

                <button
                  className="primary-button"
                  onClick={() => setShowForm(true)}
                >
                  <Sparkles size={17} /> Analyze New Inquiry
                </button>
              </div>

              <div className="stats-grid">

                <StatCard
                  title="Analyzed Inquiries"
                  value={leads.length}
                  icon={BrainCircuit}
                  trend="Lead records"
                  positive
                />

                <StatCard
                  title="High Potential"
                  value={highPriority}
                  icon={Target}
                  trend="Priority leads"
                  positive
                />

                <StatCard
                  title="Average Score"
                  value={`${averageScore}/100`}
                  icon={Activity}
                  trend="Lead score"
                  positive
                />

              </div>

              <div className="panel methodology">
                <h3>How the AI engine works</h3>

                <div className="method-grid">

                  <Method
                    icon={Search}
                    title="Requirement Analysis"
                    desc="Extracts relevant information from customer inquiries."
                  />

                  <Method
                    icon={Target}
                    title="Lead Qualification"
                    desc="Calculates priority based on budget, urgency and intent."
                  />

                  <Method
                    icon={BrainCircuit}
                    title="Business Insights"
                    desc="Uses TF-IDF and Logistic Regression to classify service requirements."
                  />

                  <Method
                    icon={Send}
                    title="Response Generation"
                    desc="Prepares a contextual customer response for review."
                  />

                </div>
              </div>

            </section>
          )}

          {activeTab === "Analytics" && (
            <section className="panel full-panel">

              <div className="panel-heading">
                <div>
                  <h3>Business Analytics</h3>
                  <p>Current lead distribution and performance.</p>
                </div>
              </div>

              {["High", "Medium", "Low"].map(priority => {
                const count = leads.filter(
                  l => l.priority === priority
                ).length;

                const percent = leads.length
                  ? Math.round(count / leads.length * 100)
                  : 0;

                return (
                  <div className="analytics-row" key={priority}>
                    <div className="analytics-label">
                      <span>{priority} Priority</span>
                      <strong>{count} leads · {percent}%</strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-fill ${priority.toLowerCase()}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <p className="analytics-note">
                Analytics are calculated from current lead records.
              </p>

            </section>
          )}

        </div>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onClick={() => !analyzing && setShowForm(false)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <h2>Analyze New Inquiry</h2>
                <p>Enter customer requirements for AI lead scoring.</p>
              </div>

              <button
                className="icon-button"
                disabled={analyzing}
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={analyzeLead}>

              <label>Customer Name *</label>

              <input
                required
                value={form.name}
                onChange={e => setForm({
                  ...form,
                  name: e.target.value
                })}
                placeholder="Enter customer name"
              />

              <label>Company</label>

              <input
                value={form.company}
                onChange={e => setForm({
                  ...form,
                  company: e.target.value
                })}
                placeholder="Company name"
              />

              <label>Required Service (Reference)</label>

              <select
                value={form.service}
                onChange={e => setForm({
                  ...form,
                  service: e.target.value
                })}
              >
                <option>Web Development</option>
                <option>E-commerce Development</option>
                <option>AI Automation</option>
                <option>AI Solutions</option>
                <option>Mobile App Development</option>
                <option>Digital Marketing</option>
              </select>

              <label>Estimated Budget</label>

              <input
                value={form.budget}
                onChange={e => setForm({
                  ...form,
                  budget: e.target.value
                })}
                placeholder="e.g. ₹50,000"
              />

              <label>Customer Requirements *</label>

              <textarea
                required
                rows="4"
                value={form.message}
                onChange={e => setForm({
                  ...form,
                  message: e.target.value
                })}
                placeholder="Describe what the customer needs..."
              />

              <button
                type="submit"
                className="primary-button submit-button"
                disabled={analyzing}
              >
                <Sparkles size={17} />
                {analyzing
                  ? "AI is analyzing..."
                  : "Analyze & Score Lead"}
              </button>

              <p className="analytics-note">
                This inquiry will be analyzed by the Python AI backend.
              </p>

            </form>
          </div>
        </div>
      )}

      {selectedLead && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <h2>Lead Details</h2>
                <p>Customer opportunity information</p>
              </div>

              <button
                className="icon-button"
                onClick={() => setSelectedLead(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="detail-profile">
              <div className="avatar large-avatar">
                {selectedLead.name.slice(0, 1)}
              </div>

              <div>
                <h3>{selectedLead.name}</h3>
                <p>{selectedLead.company}</p>
              </div>
            </div>

            <div className="detail-grid">

              <Detail label="Service" value={selectedLead.service} />

              <Detail label="Budget" value={selectedLead.budget} />

              <Detail
                label="AI Score"
                value={`${selectedLead.score}/100`}
              />

              <Detail label="Priority" value={selectedLead.priority} />

              <Detail label="Status" value={selectedLead.status} />

              {selectedLead.timeline && (
                <Detail
                  label="Timeline"
                  value={selectedLead.timeline}
                />
              )}

              {selectedLead.confidence !== undefined && (
                <Detail
                  label="Model Confidence"
                  value={`${selectedLead.confidence}%`}
                />
              )}

            </div>

            <div className="requirement-box">
              <strong>Customer requirements</strong>
              <p>{selectedLead.message}</p>
            </div>

            <div className="recommendation">
              <Sparkles size={18} />

              <div>
                <strong>AI Recommended Next Action</strong>

                <p>
                  {selectedLead.recommendedAction ||
                    (selectedLead.priority === "High"
                      ? "Schedule a discovery call and send a project proposal."
                      : selectedLead.priority === "Medium"
                        ? "Contact the customer to clarify requirements and budget."
                        : "Add the inquiry to the nurturing pipeline and follow up later.")}
                </p>
              </div>
            </div>

            {selectedLead.suggestedReply && (
              <div className="requirement-box">
                <strong>
                  <Send size={15} /> AI Suggested Customer Reply
                </strong>

                <p>{selectedLead.suggestedReply}</p>

                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedLead.suggestedReply
                    );
                    notify("Suggested reply copied!");
                  }}
                >
                  Copy Reply
                </button>
              </div>
            )}

            <button
              className="outline-button full-width"
              onClick={() => {
                setLeads(prev =>
                  prev.map(lead =>
                    lead.id === selectedLead.id
                      ? { ...lead, status: "Contacted" }
                      : lead
                  )
                );

                setSelectedLead({
                  ...selectedLead,
                  status: "Contacted"
                });

                notify("Lead marked as contacted.");
              }}
            >
              Mark as Contacted <CheckCircle2 size={17} />
            </button>

          </div>
        </div>
      )}

      {notification && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, positive }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon">
          <Icon size={20} />
        </div>
      </div>

      <h2>{value}</h2>

      <div className="stat-trend">
        {positive
          ? <ArrowUpRight size={15} />
          : <ArrowDownRight size={15} />}
        {trend}
      </div>
    </div>
  );
}

function LeadTable({ leads, onSelect }) {
  if (!leads.length) {
    return (
      <div className="empty-state">
        No leads found. Add a new customer inquiry.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>AI Score</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leads.map(lead => (
            <tr
              key={lead.id}
              onClick={() => onSelect(lead)}
            >
              <td>
                <div className="customer-cell">
                  <div className="mini-avatar">
                    {lead.name.slice(0, 1)}
                  </div>

                  <div>
                    <strong>{lead.name}</strong>
                    <small>{lead.company}</small>
                  </div>
                </div>
              </td>

              <td>{lead.service}</td>

              <td>
                <strong className="score-number">
                  {lead.score}
                </strong>
                <span className="score-out"> /100</span>
              </td>

              <td>
                <span className={`priority ${lead.priority.toLowerCase()}`}>
                  {lead.priority}
                </span>
              </td>

              <td>
                <span className="status-pill">{lead.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Method({ icon: Icon, title, desc }) {
  return (
    <div className="method-item">
      <div className="method-icon">
        <Icon size={20} />
      </div>

      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-cell">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
