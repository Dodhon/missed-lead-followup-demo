import { useMemo, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  DollarSign,
  Mail,
  PhoneCall,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import './App.css'

type LeadStatus = 'New' | 'Needs quote' | 'Waiting reply' | 'Booked' | 'Dormant'
type Channel = 'Email' | 'SMS' | 'Call'
type Filter = 'All' | 'At risk' | 'Quote due' | 'Booked'

type Lead = {
  id: string
  businessLine: string
  customerName: string
  source: string
  request: string
  estimateValue: number
  status: LeadStatus
  ageHours: number
  lastTouch: string
  owner: string
  nextStep: string
  riskReason: string
  channel: Channel
  probability: number
}

const leads: Lead[] = [
  {
    id: 'L-1048',
    businessLine: 'Prairie Home HVAC',
    customerName: 'Maya Chen',
    source: 'Website form',
    request: 'No-cool call for a two-story condo',
    estimateValue: 860,
    status: 'Needs quote',
    ageHours: 31,
    lastTouch: 'Auto-reply sent, no human follow-up',
    owner: 'Sam',
    nextStep: 'Send quote window and call before 2 PM',
    riskReason: 'Quote request is older than one business day',
    channel: 'Call',
    probability: 68,
  },
  {
    id: 'L-1049',
    businessLine: 'Northline Dental',
    customerName: 'Jordan Patel',
    source: 'Missed call',
    request: 'Asked about emergency crown repair',
    estimateValue: 480,
    status: 'New',
    ageHours: 4,
    lastTouch: 'Voicemail transcribed',
    owner: 'Nina',
    nextStep: 'Text callback link and offer two slots',
    riskReason: 'High-intent call has no booked appointment',
    channel: 'SMS',
    probability: 82,
  },
  {
    id: 'L-1050',
    businessLine: 'Canal Street Auto Glass',
    customerName: 'Evan Brooks',
    source: 'Google Business Profile',
    request: 'Windshield replacement quote',
    estimateValue: 390,
    status: 'Waiting reply',
    ageHours: 18,
    lastTouch: 'Quote texted yesterday afternoon',
    owner: 'Alex',
    nextStep: 'Send proof-of-insurance checklist',
    riskReason: 'Quote sent without confirmation sequence',
    channel: 'SMS',
    probability: 54,
  },
  {
    id: 'L-1051',
    businessLine: 'Ada Street Med Spa',
    customerName: 'Priya Shah',
    source: 'Instagram DM',
    request: 'Laser consultation and package pricing',
    estimateValue: 720,
    status: 'Dormant',
    ageHours: 76,
    lastTouch: 'Manual reply drafted but not sent',
    owner: 'Mia',
    nextStep: 'Send consult reminder and limited booking window',
    riskReason: 'Lead went quiet after pricing question',
    channel: 'Email',
    probability: 35,
  },
  {
    id: 'L-1052',
    businessLine: 'Bridgeport Pet Grooming',
    customerName: 'Noah Williams',
    source: 'Website chat',
    request: 'Recurring grooming for two dogs',
    estimateValue: 260,
    status: 'Booked',
    ageHours: 9,
    lastTouch: 'Appointment confirmed',
    owner: 'Jess',
    nextStep: 'Send prep instructions 24 hours before visit',
    riskReason: 'Booked, low risk',
    channel: 'Email',
    probability: 92,
  },
  {
    id: 'L-1053',
    businessLine: 'Ravenswood Roofing',
    customerName: 'Camila Ortiz',
    source: 'Referral',
    request: 'Leak inspection after storm',
    estimateValue: 1450,
    status: 'Needs quote',
    ageHours: 27,
    lastTouch: 'Estimator note added',
    owner: 'Sam',
    nextStep: 'Email inspection recap and schedule roof visit',
    riskReason: 'High-value lead is waiting on estimate',
    channel: 'Email',
    probability: 61,
  },
]

const filters: Filter[] = ['All', 'At risk', 'Quote due', 'Booked']
const channels: Channel[] = ['Email', 'SMS', 'Call']

const rules = [
  {
    label: 'Capture',
    detail: 'Pull website forms, missed calls, and DMs into one queue.',
    metric: '1 inbox',
  },
  {
    label: 'Prioritize',
    detail: 'Flag stale, high-value, and quote-ready leads for same-day action.',
    metric: '4 risk rules',
  },
  {
    label: 'Follow up',
    detail: 'Draft the next email, text, or call task with owner and deadline.',
    metric: '3 channels',
  },
  {
    label: 'Report',
    detail: 'Show open pipeline, booked value, and overdue work every morning.',
    metric: '5 KPIs',
  },
]

const currency = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

function App() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(leads[0].id)
  const [channel, setChannel] = useState<Channel>('Email')

  const filteredLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return leads.filter((lead) => {
      const matchesSearch =
        normalized.length === 0 ||
        [
          lead.id,
          lead.businessLine,
          lead.customerName,
          lead.source,
          lead.request,
          lead.owner,
          lead.status,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized)

      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'At risk' && lead.status !== 'Booked' && lead.ageHours >= 24) ||
        (activeFilter === 'Quote due' && lead.status === 'Needs quote') ||
        (activeFilter === 'Booked' && lead.status === 'Booked')

      return matchesSearch && matchesFilter
    })
  }, [activeFilter, query])

  const selectedLead =
    leads.find((lead) => lead.id === selectedId) ?? filteredLeads[0] ?? leads[0]

  const openLeads = leads.filter((lead) => lead.status !== 'Booked')
  const atRiskLeads = leads.filter((lead) => lead.status !== 'Booked' && lead.ageHours >= 24)
  const bookedValue = leads
    .filter((lead) => lead.status === 'Booked')
    .reduce((total, lead) => total + lead.estimateValue, 0)
  const atRiskValue = atRiskLeads.reduce((total, lead) => total + lead.estimateValue, 0)

  const message = buildMessage(selectedLead, channel)

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Missed lead follow-up automation</p>
          <h1>Lead Rescue Console</h1>
        </div>
        <div className="header-actions" aria-label="Demo actions">
          <button type="button" className="icon-button" title="Send follow-up">
            <Send size={18} aria-hidden="true" />
            <span>Queue</span>
          </button>
          <button type="button" className="icon-button" title="Schedule review">
            <CalendarClock size={18} aria-hidden="true" />
            <span>Review</span>
          </button>
        </div>
      </header>

      <section className="kpi-grid" aria-label="Pipeline summary">
        <MetricCard icon={<Clock3 size={18} />} label="Open leads" value={openLeads.length.toString()} tone="blue" />
        <MetricCard icon={<AlertTriangle size={18} />} label="At-risk value" value={currency.format(atRiskValue)} tone="amber" />
        <MetricCard icon={<CheckCircle2 size={18} />} label="Booked value" value={currency.format(bookedValue)} tone="green" />
        <MetricCard icon={<DollarSign size={18} />} label="Weighted pipeline" value={currency.format(weightedPipeline())} tone="red" />
      </section>

      <section className="workspace" aria-label="Lead operations">
        <div className="queue-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Today</p>
              <h2>Follow-up queue</h2>
            </div>
            <SlidersHorizontal size={18} aria-hidden="true" />
          </div>

          <div className="controls">
            <label className="search-box">
              <Search size={16} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search leads"
                aria-label="Search leads"
              />
            </label>

            <div className="segment" aria-label="Lead filter">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={filter === activeFilter ? 'active' : ''}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="lead-list">
            {filteredLeads.map((lead) => (
              <button
                type="button"
                key={lead.id}
                className={`lead-row ${lead.id === selectedLead.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(lead.id)}
              >
                <span className={`status-dot ${riskTone(lead)}`} aria-hidden="true" />
                <span>
                  <strong>{lead.businessLine}</strong>
                  <small>{lead.customerName} - {lead.request}</small>
                </span>
                <span className="lead-value">{currency.format(lead.estimateValue)}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="detail-panel" aria-label="Selected lead details">
          <div className="detail-top">
            <div>
              <p className="eyebrow">{selectedLead.id}</p>
              <h2>{selectedLead.businessLine}</h2>
              <p className="muted">{selectedLead.customerName} - {selectedLead.source}</p>
            </div>
            <span className={`pill ${riskTone(selectedLead)}`}>{selectedLead.status}</span>
          </div>

          <dl className="detail-grid">
            <div>
              <dt>Estimate</dt>
              <dd>{currency.format(selectedLead.estimateValue)}</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>{selectedLead.ageHours}h</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{selectedLead.owner}</dd>
            </div>
            <div>
              <dt>Probability</dt>
              <dd>{selectedLead.probability}%</dd>
            </div>
          </dl>

          <div className="risk-box">
            <AlertTriangle size={18} aria-hidden="true" />
            <div>
              <strong>{selectedLead.riskReason}</strong>
              <span>{selectedLead.nextStep}</span>
            </div>
          </div>

          <div className="message-panel">
            <div className="panel-heading compact">
              <div>
                <p className="eyebrow">Draft</p>
                <h3>Next follow-up</h3>
              </div>
              <div className="channel-switch" aria-label="Message channel">
                {channels.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={item === channel ? 'active' : ''}
                    onClick={() => setChannel(item)}
                    title={`Use ${item}`}
                  >
                    {channelIcon(item)}
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
            <p>{message}</p>
          </div>
        </aside>
      </section>

      <section className="rule-strip" aria-label="Automation runbook">
        {rules.map((rule) => (
          <article key={rule.label}>
            <span><Sparkles size={16} aria-hidden="true" /> {rule.metric}</span>
            <h3>{rule.label}</h3>
            <p>{rule.detail}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode
  label: string
  value: string
  tone: 'blue' | 'amber' | 'green' | 'red'
}) {
  return (
    <article className={`metric ${tone}`}>
      <span className="metric-icon">{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  )
}

function weightedPipeline() {
  return leads.reduce((total, lead) => total + lead.estimateValue * (lead.probability / 100), 0)
}

function riskTone(lead: Lead) {
  if (lead.status === 'Booked') return 'green'
  if (lead.ageHours >= 48 || lead.status === 'Dormant') return 'red'
  if (lead.ageHours >= 24 || lead.status === 'Needs quote') return 'amber'
  return 'blue'
}

function buildMessage(lead: Lead, channel: Channel) {
  const firstName = lead.customerName.split(' ')[0]

  if (channel === 'SMS') {
    return `Hi ${firstName}, this is ${lead.owner}. I saw your ${lead.request.toLowerCase()} request and can help today. Want me to send two available times?`
  }

  if (channel === 'Call') {
    return `Call ${firstName}. Confirm the request, offer the next available appointment window, and log whether the quote should be emailed or texted.`
  }

  return `Hi ${firstName}, thanks for reaching out about ${lead.request.toLowerCase()}. ${lead.owner} can move this forward today: ${lead.nextStep.toLowerCase()}. Does that work for you?`
}

function channelIcon(channel: Channel) {
  if (channel === 'SMS') return <Send size={15} aria-hidden="true" />
  if (channel === 'Call') return <PhoneCall size={15} aria-hidden="true" />
  return <Mail size={15} aria-hidden="true" />
}

export default App
