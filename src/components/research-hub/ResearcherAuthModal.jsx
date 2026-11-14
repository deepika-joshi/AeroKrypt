import { useState } from 'react'
import { authApi } from '../../services/apiClient.js'

export default function ResearcherAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [institution, setInstitution] = useState('')
  const [role, setRole] = useState('RESEARCHER')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const handleQuickFill = (demoEmail, demoPw) => {
    setEmail(demoEmail)
    setPassword(demoPw)
    setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      if (mode === 'login') {
        const res = await authApi.login(email, password)
        if (res.success) {
          setSuccessMsg('Authentication confirmed. Initializing private workspace...')
          setTimeout(() => {
            onAuthSuccess(res.data.researcher)
            onClose()
          }, 600)
        } else {
          setErrorMsg(res.error || 'Authentication failed. Please check your credentials.')
        }
      } else {
        const res = await authApi.register({
          email,
          password,
          full_name: fullName,
          institution,
          role,
        })
        if (res.success) {
          setSuccessMsg('Researcher registered successfully! Authenticating...')
          setTimeout(() => {
            onAuthSuccess(res.data.researcher)
            onClose()
          }, 600)
        } else {
          setErrorMsg(res.error || 'Registration failed. Email may already be registered.')
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network communication error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 bg-slate-900/95 border border-cyan-500/30 rounded-xl shadow-2xl text-slate-100 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base font-semibold tracking-wider text-cyan-300 uppercase">
              {mode === 'login' ? 'Researcher Portal // Secure Login' : 'Institutional Registration // New Researcher'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`py-2 text-center rounded transition-colors ${mode === 'login' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            SECURE LOGIN
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`py-2 text-center rounded transition-colors ${mode === 'register' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            NEW REGISTRATION
          </button>
        </div>

        {/* Demo Fast-Login Pills */}
        {mode === 'login' && (
          <div className="mb-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Quick-Fill Verified Demo Credentials:</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('dr.pascal.lee@seti.org', 'AeroKrypt2026!')}
                className="px-2.5 py-1 text-[11px] rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 transition-colors"
              >
                Dr. Pascal Lee (Principal Investigator)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('reviewer.osinski@aerokrypt.org', 'ReviewerSecure2026!')}
                className="px-2.5 py-1 text-[11px] rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:bg-purple-900/60 transition-colors"
              >
                Dr. Gordon Osinski (Review Committee)
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block mb-1 text-slate-400 uppercase tracking-wider text-[10px]">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Carl Sagan"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-400 uppercase tracking-wider text-[10px]">Institution / Affiliation</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. NASA Ames / Lunar & Planetary Institute"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-400 uppercase tracking-wider text-[10px]">Platform Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="RESEARCHER">RESEARCHER (Workspace Author)</option>
                  <option value="REVIEWER">REVIEWER (Peer Review Committee)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 text-slate-400 uppercase tracking-wider text-[10px]">Institutional Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@institute.edu"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-400 uppercase tracking-wider text-[10px]">
              Password {mode === 'register' && '(min 8 characters)'}
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Feedback & Error display */}
          {errorMsg && (
            <div className="p-2.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
              {successMsg}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-wider uppercase transition-all shadow-lg shadow-cyan-950/50 disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : mode === 'login' ? 'AUTHORIZE & LOG IN' : 'REGISTER & INITIALIZE WORKSPACE'}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
          Security: RFC 7519 JWT Session • HttpOnly Cookie • NIST SP 800-132 PBKDF2 Hashing
        </div>
      </div>
    </div>
  )
}
