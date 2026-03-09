import Head from 'next/head'
import { useState, useEffect, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, Lock, X, Calendar, Building2, Briefcase, MessageSquare } from 'lucide-react'
// Building2, Briefcase still used in QuestionCard tags

interface InterviewQuestion {
  id: string
  question: string
  company: string
  jobTitle: string
  dateAsked: string
  createdAt: string
}

const SEED_DATA: InterviewQuestion[] = [
  {
    id: '1',
    question: 'Design a system that can handle 1 million concurrent users. Walk me through your architecture decisions and how you would scale each component.',
    company: 'Google',
    jobTitle: 'Software Engineer',
    dateAsked: '2024-11-12',
    createdAt: '2024-11-12',
  },
  {
    id: '2',
    question: 'Walk me through a DCF analysis and explain what its key limitations are in practice.',
    company: 'Goldman Sachs',
    jobTitle: 'Investment Banking Analyst',
    dateAsked: '2024-10-03',
    createdAt: '2024-10-03',
  },
  {
    id: '3',
    question: 'Tell me about a time you used data to drive a complex business decision. What was the outcome?',
    company: 'McKinsey',
    jobTitle: 'Business Analyst',
    dateAsked: '2024-09-18',
    createdAt: '2024-09-18',
  },
  {
    id: '4',
    question: 'How would you redesign the Facebook News Feed algorithm to improve engagement without harming mental health metrics?',
    company: 'Meta',
    jobTitle: 'Product Manager',
    dateAsked: '2024-12-01',
    createdAt: '2024-12-01',
  },
  {
    id: '5',
    question: 'Describe a time when you had to make a high-stakes decision with incomplete information. How did you handle the uncertainty?',
    company: 'Amazon',
    jobTitle: 'Operations Manager',
    dateAsked: '2024-08-22',
    createdAt: '2024-08-22',
  },
  {
    id: '6',
    question: 'How would you design the software architecture for an elevator system in a 100-story skyscraper? What edge cases would you handle?',
    company: 'Apple',
    jobTitle: 'Software Engineer',
    dateAsked: '2024-07-14',
    createdAt: '2024-07-14',
  },
  {
    id: '7',
    question: 'If you were the CEO of Microsoft for one year, what would be your top three strategic priorities and why?',
    company: 'Microsoft',
    jobTitle: 'Program Manager',
    dateAsked: '2024-11-28',
    createdAt: '2024-11-28',
  },
  {
    id: '8',
    question: 'How do you approach valuing a company with consistently negative earnings? What alternative methodologies would you apply?',
    company: 'JPMorgan',
    jobTitle: 'Financial Analyst',
    dateAsked: '2024-06-09',
    createdAt: '2024-06-09',
  },
  {
    id: '9',
    question: 'How would you decide whether to ship a new feature on Netflix? Walk me through your prioritization framework.',
    company: 'Netflix',
    jobTitle: 'Senior Product Manager',
    dateAsked: '2025-01-07',
    createdAt: '2025-01-07',
  },
  {
    id: '10',
    question: 'A major client is resistant to the digital transformation strategy you are recommending. How do you approach that conversation and build alignment?',
    company: 'Deloitte',
    jobTitle: 'Consulting Analyst',
    dateAsked: '2024-10-29',
    createdAt: '2024-10-29',
  },
  {
    id: '11',
    question: 'Tell me about a time when you were facing a challenge where you had to convince someone with an opposing opinion. How did you approach it and what was the result?',
    company: 'McKinsey',
    jobTitle: 'Business Analyst',
    dateAsked: '2024-09-05',
    createdAt: '2024-09-05',
  },
  {
    id: '12',
    question: 'Walk me through how synergies impact a merger model and explain whether they affect enterprise value.',
    company: 'Goldman Sachs',
    jobTitle: 'Investment Banking Analyst',
    dateAsked: '2024-11-14',
    createdAt: '2024-11-14',
  },
  {
    id: '13',
    question: 'Tell me about a time where you had to choose between two options and, even though you didn\'t prefer one of them, you understood it was the best choice. How did you evaluate the tradeoffs?',
    company: 'Goldman Sachs',
    jobTitle: 'Investment Banking Analyst',
    dateAsked: '2025-01-22',
    createdAt: '2025-01-22',
  },
  {
    id: '14',
    question: 'Name a time you had to navigate an unexpected situation at work. What did you do and what was the outcome?',
    company: 'Meta',
    jobTitle: 'Product Manager',
    dateAsked: '2024-10-17',
    createdAt: '2024-10-17',
  },
  {
    id: '15',
    question: 'Tell me about a time a team member wasn\'t pulling their weight on a project. How did you handle it?',
    company: 'Amazon',
    jobTitle: 'Software Engineer',
    dateAsked: '2025-02-03',
    createdAt: '2025-02-03',
  },
  {
    id: '16',
    question: 'Talk about a time when you worked to achieve something that was outside your comfort zone. What did you learn?',
    company: 'McKinsey',
    jobTitle: 'Associate',
    dateAsked: '2024-08-11',
    createdAt: '2024-08-11',
  },
]

const PREVIEW_COUNT = 1
const STORAGE_KEY = 'ib_unlocked'
const QUESTIONS_KEY = 'ib_questions'

type SortField = 'dateAsked' | 'company' | 'jobTitle'
type SortDir = 'asc' | 'desc'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function IBLogo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded-xl text-[#2DD4BF] font-extrabold text-lg tracking-tight select-none"
        style={{
          width: 44,
          height: 44,
          background: '#0F1E3C',
          letterSpacing: '-0.5px',
        }}
      >
        IB
      </div>
    </div>
  )
}

function SortButton({
  label,
  field,
  sortField,
  sortDir,
  onClick,
}: {
  label: string
  field: SortField
  sortField: SortField
  sortDir: SortDir
  onClick: (f: SortField) => void
}) {
  const active = sortField === field
  return (
    <button
      onClick={() => onClick(field)}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        active ? 'sort-active shadow-sm' : 'sort-inactive'
      }`}
    >
      {label}
      {active ? (
        sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
      ) : (
        <ChevronDown size={14} className="opacity-30" />
      )}
    </button>
  )
}

function QuestionCard({ q, index, locked, onUnlock }: { q: InterviewQuestion; index: number; locked: boolean; onUnlock?: () => void }) {
  return (
    <div
      className={`relative bg-white rounded-2xl p-5 card-shadow border border-slate-100 transition-all ${
        locked ? 'select-none cursor-pointer' : ''
      }`}
      onClick={locked ? onUnlock : undefined}
    >
      {locked && (
        <div className="absolute inset-0 rounded-2xl z-10 flex items-center justify-center bg-white/70 backdrop-blur-[3px]">
          <div className="flex items-center gap-2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full font-medium">
            <Lock size={12} />
            Unlock to view
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <p className="text-slate-800 font-medium leading-relaxed text-sm">{q.question}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="tag-company flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium">
            <Building2 size={11} />
            {q.company}
          </span>
          <span className="flex items-center gap-1.5 text-xs bg-navy-50 bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-full font-medium">
            <Briefcase size={11} />
            {q.jobTitle}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400 px-2.5 py-1">
            <Calendar size={11} />
            {formatDate(q.dateAsked)}
          </span>
        </div>
      </div>
    </div>
  )
}

interface FormErrors {
  email?: string
  question?: string
  company?: string
  jobTitle?: string
  dateAsked?: string
  terms?: string
}

export default function Home() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [unlocked, setUnlocked] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Filter/sort state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('dateAsked')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Form state
  const [email, setEmail] = useState('')
  const [terms, setTerms] = useState(false)
  const [formQuestion, setFormQuestion] = useState('')
  const [formCompany, setFormCompany] = useState('')
  const [formJobTitle, setFormJobTitle] = useState('')
  const [formDateAsked, setFormDateAsked] = useState('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const storedUnlocked = localStorage.getItem(STORAGE_KEY) === 'true'
    setUnlocked(storedUnlocked)

    fetch('/api/questions')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: InterviewQuestion[] = data.map((q: {
            id: string; question: string; company: string;
            job_title: string; date_asked: string; created_at: string;
          }) => ({
            id: q.id,
            question: q.question,
            company: q.company,
            jobTitle: q.job_title,
            dateAsked: q.date_asked,
            createdAt: q.created_at,
          }))
          setQuestions(mapped)
        } else {
          setQuestions(SEED_DATA)
        }
      })
      .catch(() => setQuestions(SEED_DATA))
  }, [])

  const filteredAndSorted = useMemo(() => {
    let result = [...questions]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.question.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.jobTitle.toLowerCase().includes(q)
      )
    }
    result.sort((a, b) => {
      let cmp = 0
      if (sortField === 'dateAsked') {
        cmp = a.dateAsked.localeCompare(b.dateAsked)
      } else if (sortField === 'company') {
        cmp = a.company.localeCompare(b.company)
      } else {
        cmp = a.jobTitle.localeCompare(b.jobTitle)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [questions, searchQuery, sortField, sortDir])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  function validate(): boolean {
    const errors: FormErrors = {}
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!terms) {
      errors.terms = 'You must agree to the terms to continue.'
    }
    if (!formQuestion.trim() || formQuestion.trim().length < 20) {
      errors.question = 'Question must be at least 20 characters.'
    }
    if (formQuestion.trim().length > 500) {
      errors.question = 'Question must be 500 characters or fewer.'
    }
    if (!formCompany.trim() || formCompany.trim().length < 1) {
      errors.company = 'Company name is required.'
    }
    if (formCompany.trim().length > 100) {
      errors.company = 'Company name must be 100 characters or fewer.'
    }
    if (!formJobTitle.trim() || formJobTitle.trim().length < 3) {
      errors.jobTitle = 'Job title must be at least 3 characters.'
    }
    if (formJobTitle.trim().length > 100) {
      errors.jobTitle = 'Job title must be 100 characters or fewer.'
    }
    if (!formDateAsked) {
      errors.dateAsked = 'Please select the date you were asked this question.'
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const picked = new Date(formDateAsked + 'T00:00:00')
      if (picked > today) {
        errors.dateAsked = 'Date cannot be in the future.'
      }
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: formQuestion.trim(),
          company: formCompany.trim(),
          job_title: formJobTitle.trim(),
          date_asked: formDateAsked,
          email: email.trim(),
        }),
      })
      const saved = await res.json()
      if (res.ok) {
        const newQ: InterviewQuestion = {
          id: saved.id,
          question: saved.question,
          company: saved.company,
          jobTitle: saved.job_title,
          dateAsked: saved.date_asked,
          createdAt: saved.created_at,
        }
        setQuestions((prev) => [...prev, newQ])
      }
    } catch {
      // submission failed silently — still unlock
    }
    localStorage.setItem(STORAGE_KEY, 'true')
    setUnlocked(true)
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      setShowModal(false)
      setSubmitted(false)
    }, 1800)
  }

  const today = new Date().toISOString().slice(0, 10)
  const previewQuestions = filteredAndSorted.slice(0, PREVIEW_COUNT)
  const lockedQuestions = filteredAndSorted.slice(PREVIEW_COUNT)
  const totalCount = filteredAndSorted.length

  return (
    <>
      <Head>
        <title>Interview Bank — by Wonsulting</title>
        <meta name="description" content="Real interview questions, from real interviews. Browse, filter, and contribute to the Interview Bank by Wonsulting." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Hero */}
        <header className="gradient-hero text-white px-4 pt-6 pb-7 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight">Interview Bank</h1>
            <p className="text-sm font-medium mt-1" style={{color:'#5ea59c'}}>
              Real questions, from real interviews &middot; by{' '}
              <a
                href="https://www.wonsulting.com/?utm_source=interview-bank&utm_medium=hero&utm_campaign=interview-bank-tool"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
              >
                Wonsulting
              </a>
            </p>
          </div>
        </header>

        {/* Stats bar */}
        <div className="bg-white border-b border-slate-100 px-4 py-3">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span>
              <strong className="text-slate-800 font-semibold">{questions.length}</strong> questions &bull;{' '}
              {Array.from(new Set(questions.map((q) => q.company))).length} companies
            </span>
            <div className="flex items-center gap-2">
              {unlocked && (
                <span className="badge-unlocked flex items-center gap-1.5 font-medium text-xs px-3 py-1 rounded-full">
                  ✓ Access unlocked
                </span>
              )}
              {unlocked && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  + Submit a Question
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-20 shadow-sm">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by question, company, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-slate-50"
                style={{ '--tw-ring-color': '#2a8176' } as React.CSSProperties}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Sort:</span>
              <SortButton label="Date" field="dateAsked" sortField={sortField} sortDir={sortDir} onClick={handleSort} />
              <SortButton label="Company" field="company" sortField={sortField} sortDir={sortDir} onClick={handleSort} />
              <SortButton label="Job Title" field="jobTitle" sortField={sortField} sortDir={sortDir} onClick={handleSort} />
            </div>
          </div>
        </div>

        {/* Question list */}
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-3">
            {filteredAndSorted.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No questions found.</p>
                <p className="text-sm mt-1">Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                {previewQuestions.map((q, i) => (
                  <QuestionCard key={q.id} q={q} index={i} locked={false} />
                ))}

                {!unlocked && lockedQuestions.length > 0 && (
                  <>
                    {lockedQuestions.slice(0, 3).map((q, i) => (
                      <QuestionCard key={q.id} q={q} index={i + PREVIEW_COUNT} locked={true} onUnlock={() => setShowModal(true)} />
                    ))}

                    <div className="rounded-2xl bg-gradient-to-b from-white to-slate-50 border-2 border-dashed border-teal-200 p-8 text-center mt-2">
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor:'#e5f2ea'}}>
                          <Lock size={20} style={{color:'#2a8176'}} />
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">
                        {lockedQuestions.length} more question{lockedQuestions.length !== 1 ? 's' : ''} locked
                      </h3>
                      <p className="text-slate-500 text-sm mb-5 max-w-sm mx-auto">
                        Share one question you&apos;ve been asked to unlock the full bank. It&apos;s free.
                      </p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary inline-flex items-center gap-2 font-semibold px-7 py-3 rounded-xl transition-colors"
                      >
                        Unlock Full Access
                      </button>
                    </div>
                  </>
                )}

                {unlocked &&
                  lockedQuestions.map((q, i) => (
                    <QuestionCard key={q.id} q={q} index={i + PREVIEW_COUNT} locked={false} />
                  ))}
              </>
            )}
          </div>
        </main>

        {/* CTA Banner */}
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto rounded-2xl p-6 sm:p-8 text-center" style={{background:'linear-gradient(135deg, #fff7f0 0%, #fff0e8 100%)', border:'1.5px solid #fbd5b8'}}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{color:'#f3894f'}}>Interview Prep</p>
            <h3 className="text-xl font-extrabold mb-2" style={{color:'#073b5d'}}>
              Want help prepping for questions just like these?
            </h3>
            <p className="text-sm mb-5 max-w-md mx-auto" style={{color:'#5e606e'}}>
              Our team has helped thousands land roles at top companies. Book a free call and let&apos;s see how we can help you prep smarter.
            </p>
            <a
              href="https://form.typeform.com/to/IOFKyxFJ?utm_source=interview-bank&utm_medium=cta&utm_campaign=interview-bank-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold px-7 py-3 rounded-xl text-white transition-opacity hover:opacity-90"
              style={{backgroundColor:'#f3894f'}}
            >
              Book a Free Call →
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-slate-400 border-t border-slate-100 bg-white">
          Made with ♥ by{' '}
          <a
            href="https://www.wonsulting.com/?utm_source=interview-bank&utm_medium=footer&utm_campaign=interview-bank-tool"
            target="_blank"
            rel="noopener noreferrer"
            style={{color:'#2a8176'}} className="font-medium hover:opacity-80"
          >
            Wonsulting
          </a>
        </footer>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {submitted ? (
              <div className="flex flex-col items-center justify-center p-12 gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{backgroundColor:'#e5f2ea'}}>
                  <span className="text-2xl">🎉</span>
                </div>
                <p className="text-lg font-bold text-slate-800">You&apos;re in!</p>
                <p className="text-slate-500 text-sm text-center">Full access unlocked. Thanks for contributing.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Unlock Full Access</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Share one question to see them all.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Your Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                        formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  {/* Terms */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={terms}
                        onChange={(e) => setTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded cursor-pointer flex-shrink-0"
                        style={{ accentColor: '#2a8176' }}
                      />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        By submitting your email, you consent to receive relevant updates and resources from us. You can unsubscribe anytime.
                      </span>
                    </label>
                    {formErrors.terms && <p className="text-red-500 text-xs mt-1">{formErrors.terms}</p>}
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <MessageSquare size={14} className="text-teal-500" />
                      Your Interview Question
                    </p>

                    {/* Question */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Question <span className="text-red-400">*</span>
                        <span className="text-slate-400 font-normal ml-1">(20–500 characters)</span>
                      </label>
                      <textarea
                        value={formQuestion}
                        onChange={(e) => setFormQuestion(e.target.value)}
                        placeholder="e.g. Tell me about a time you led a team through a difficult situation..."
                        rows={3}
                        maxLength={500}
                        className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none ${
                          formErrors.question ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                        }`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {formErrors.question ? (
                          <p className="text-red-500 text-xs">{formErrors.question}</p>
                        ) : (
                          <span />
                        )}
                        <span className="text-xs text-slate-400">{formQuestion.length}/500</span>
                      </div>
                    </div>

                    {/* Company + Job Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Company <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formCompany}
                          onChange={(e) => setFormCompany(e.target.value)}
                          placeholder="e.g. Google"
                          maxLength={100}
                          className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                            formErrors.company ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                          }`}
                        />
                        {formErrors.company && <p className="text-red-500 text-xs mt-1">{formErrors.company}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Job Title <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formJobTitle}
                          onChange={(e) => setFormJobTitle(e.target.value)}
                          placeholder="e.g. Software Engineer"
                          maxLength={100}
                          className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                            formErrors.jobTitle ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                          }`}
                        />
                        {formErrors.jobTitle && <p className="text-red-500 text-xs mt-1">{formErrors.jobTitle}</p>}
                      </div>
                    </div>

                    {/* Date Asked */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Date Asked <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formDateAsked}
                        onChange={(e) => setFormDateAsked(e.target.value)}
                        max={today}
                        className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                          formErrors.dateAsked ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                        }`}
                      />
                      {formErrors.dateAsked && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.dateAsked}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit & Unlock'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
