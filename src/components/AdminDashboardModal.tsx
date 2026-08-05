import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Search,
  Phone,
  Mail,
  KeyRound,
  Trash2,
  CheckCircle2,
  Clock,
  Car,
  Filter,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { InquiryRecord, InquiryStatus, Language } from '../types';
import { subscribeToInquiries, updateInquiryStatus, deleteInquiryRecord } from '../services/inquiryService';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const ALLOWED_EMAIL = 'adityarana0104@gmail.com';
  const ALLOWED_PHONE = '9890577265';
  const REQUIRED_PASSWORD = '425310';

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    setLoading(true);
    const unsubscribe = subscribeToInquiries((data) => {
      setInquiries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const trimmedPassword = passwordInput.trim();

    if (trimmedPassword !== REQUIRED_PASSWORD) {
      setAuthError('Incorrect Password. Please try again.');
      return;
    }

    if (loginMethod === 'email') {
      const trimmedEmail = emailInput.trim().toLowerCase();
      if (trimmedEmail === ALLOWED_EMAIL) {
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Access Denied: Email address is not authorized.');
      }
    } else {
      const cleanPhone = phoneInput.replace(/\D/g, '');
      if (cleanPhone === ALLOWED_PHONE || cleanPhone.endsWith(ALLOWED_PHONE)) {
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Access Denied: Phone number is not authorized.');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmailInput('');
    setPhoneInput('');
    setPasswordInput('');
    setAuthError('');
  };

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      await updateInquiryStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry record?')) {
      setDeletingId(id);
      try {
        await deleteInquiryRecord(id);
      } catch (err) {
        console.error('Failed to delete inquiry:', err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      (item.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mobileNumber || '').includes(searchTerm) ||
      (item.vehicleName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.pickupLocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.destinationLocation || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === 'new').length;
  const contactedCount = inquiries.filter((i) => i.status === 'contacted').length;
  const confirmedCount = inquiries.filter((i) => i.status === 'confirmed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#00173d] backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 text-white overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                Sarvdnya Admin Dashboard
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                  Live Firestore Sync
                </span>
              </h3>
              <p className="text-xs text-blue-200/80">
                Real-time management and tracking of customer booking inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white transition-all text-xs font-bold border border-rose-500/30 shadow-sm"
                title="Log out of Admin Panel"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Login View with Email & Phone Sections */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto my-6 space-y-6 w-full">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 text-orange-400 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-white tracking-tight">Admin Login Portal</h4>
              <p className="text-xs text-blue-200/80 mt-1">
                Select your login method and enter authorized credentials to access
              </p>
            </div>

            {/* Login Method Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-white/10 rounded-2xl border border-white/15 w-full">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('email');
                  setAuthError('');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all ${
                  loginMethod === 'email'
                    ? 'bg-orange-500 text-white shadow-lg border border-orange-400/40'
                    : 'text-blue-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>1. Email Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMethod('phone');
                  setAuthError('');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all ${
                  loginMethod === 'phone'
                    ? 'bg-orange-500 text-white shadow-lg border border-orange-400/40'
                    : 'text-blue-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>2. Phone Login</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="w-full space-y-4 text-left">
              {loginMethod === 'email' ? (
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-orange-400" /> Admin Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter admin email address"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setAuthError('');
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-blue-100/30 focus:ring-2 focus:ring-orange-400 outline-none"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-400" /> Admin Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter admin phone number"
                    value={phoneInput}
                    onChange={(e) => {
                      setPhoneInput(e.target.value);
                      setAuthError('');
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-blue-100/30 focus:ring-2 focus:ring-orange-400 outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-orange-400" /> Admin Password
                </label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError('');
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-mono tracking-widest text-white placeholder-blue-100/30 focus:ring-2 focus:ring-orange-400 outline-none"
                  required
                />
              </div>

              {authError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold py-3.5 rounded-xl shadow-xl transition-all border border-orange-400/30 flex items-center justify-center gap-2 text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Login</span>
              </button>
            </form>

            <div className="text-[11px] text-blue-200/60 bg-white/5 p-3 rounded-xl border border-white/10 w-full text-center space-y-1">
              <p className="font-semibold text-blue-100">Restricted Admin Access</p>
              <p>Authorized access only. Log in with registered administrator credentials.</p>
            </div>
          </div>
        ) : (
          /* Main Dashboard Content */
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
            {/* Stats Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-200/80 font-medium">Total Inquiries</p>
                  <p className="text-2xl font-black text-white mt-1">{totalCount}</p>
                </div>
                <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30">
                  <Car className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-amber-500/10 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-200 font-medium">New Pending</p>
                  <p className="text-2xl font-black text-amber-300 mt-1">{newCount}</p>
                </div>
                <div className="p-3 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-sky-500/10 backdrop-blur-xl p-4 rounded-2xl border border-sky-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs text-sky-200 font-medium">Contacted</p>
                  <p className="text-2xl font-black text-sky-300 mt-1">{contactedCount}</p>
                </div>
                <div className="p-3 bg-sky-500/20 text-sky-300 rounded-xl border border-sky-500/30">
                  <Phone className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-emerald-500/10 backdrop-blur-xl p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-200 font-medium">Confirmed</p>
                  <p className="text-2xl font-black text-emerald-300 mt-1">{confirmedCount}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10">
              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-blue-200/60 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, phone, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>

              {/* Status filter tabs */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs text-blue-200/70 mr-1 flex items-center gap-1 font-semibold">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>

                {[
                  { id: 'all', label: 'All' },
                  { id: 'new', label: '🟡 New' },
                  { id: 'contacted', label: '🔵 Contact Done' },
                  { id: 'confirmed', label: '🟢 Trip Confirmed' },
                  { id: 'cancelled', label: '🔴 Cancelled' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      statusFilter === st.id
                        ? 'bg-orange-500 text-white border-orange-400 shadow'
                        : 'bg-white/5 text-blue-100/70 border-white/10 hover:bg-white/15'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Table / Cards List */}
            {loading ? (
              <div className="py-16 text-center text-blue-200/80 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-orange-400" />
                <p className="text-sm font-medium">Loading Firestore data...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-16 text-center bg-white/5 rounded-2xl border border-white/10 text-blue-100/70 space-y-2">
                <Car className="w-10 h-10 mx-auto text-blue-200/40" />
                <p className="text-base font-bold text-white">No inquiries found</p>
                <p className="text-xs">Inquiries submitted by customers will appear here in real-time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInquiries.map((inq) => {
                  const createdDate = inq.createdAt
                    ? new Date(inq.createdAt).toLocaleString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Just now';

                  return (
                    <div
                      key={inq.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                        inq.status === 'new'
                          ? 'bg-amber-500/10 border-amber-500/40 shadow-lg'
                          : inq.status === 'confirmed'
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : inq.status === 'cancelled'
                          ? 'bg-rose-500/10 border-rose-500/20 opacity-75'
                          : 'bg-white/10 border-white/15'
                      }`}
                    >
                      {/* Top Row: Customer Name, Date & Status Dropdown */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-black text-base shrink-0">
                            {inq.fullName ? inq.fullName.charAt(0).toUpperCase() : 'G'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-base text-white">{inq.fullName}</h4>
                              <span className="text-[10px] bg-white/10 text-blue-200 px-2 py-0.5 rounded border border-white/10 font-semibold">
                                {inq.source === 'contact_section' ? 'Contact Form' : 'Vehicle Booking'}
                              </span>
                            </div>
                            <p className="text-xs text-blue-200/70 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-orange-400" /> {createdDate}
                            </p>
                          </div>
                        </div>

                        {/* Status badge & selector */}
                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                          {/* Prominent Status Badge */}
                          <div className="flex items-center gap-1.5">
                            {inq.status === 'new' && (
                              <span className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full text-xs shadow-md border border-amber-300 flex items-center gap-1">
                                🟡 New Inquiry
                              </span>
                            )}
                            {inq.status === 'contacted' && (
                              <span className="bg-sky-400 text-slate-950 font-black px-3 py-1 rounded-full text-xs shadow-md border border-sky-300 flex items-center gap-1">
                                🔵 Contact Done
                              </span>
                            )}
                            {inq.status === 'confirmed' && (
                              <span className="bg-emerald-400 text-slate-950 font-black px-3 py-1 rounded-full text-xs shadow-md border border-emerald-300 flex items-center gap-1">
                                🟢 Trip Confirmed
                              </span>
                            )}
                            {inq.status === 'cancelled' && (
                              <span className="bg-rose-500 text-white font-black px-3 py-1 rounded-full text-xs shadow-md border border-rose-300 flex items-center gap-1">
                                🔴 Cancelled
                              </span>
                            )}
                          </div>

                          <select
                            value={inq.status || 'new'}
                            onChange={(e) =>
                              inq.id && handleStatusChange(inq.id, e.target.value as InquiryStatus)
                            }
                            className={`text-xs font-bold px-3 py-1 rounded-xl border outline-none cursor-pointer transition-all ${
                              inq.status === 'new'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                                : inq.status === 'contacted'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                                : inq.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                            }`}
                          >
                            <option value="new" className="bg-slate-900 text-white">🟡 New Inquiry</option>
                            <option value="contacted" className="bg-slate-900 text-white">🔵 Contact Done</option>
                            <option value="confirmed" className="bg-slate-900 text-white">🟢 Confirm Trip</option>
                            <option value="cancelled" className="bg-slate-900 text-white">🔴 Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Middle Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                          <span className="text-blue-200/70 block text-[11px]">Vehicle & Type:</span>
                          <span className="font-bold text-white text-sm">
                            {inq.vehicleName} ({inq.vehicleType})
                          </span>
                        </div>

                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                          <span className="text-blue-200/70 block text-[11px]">Route:</span>
                          <span className="font-semibold text-white">
                            📍 {inq.pickupLocation || 'N/A'} ➔ {inq.destinationLocation || 'N/A'}
                          </span>
                        </div>

                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                          <span className="text-blue-200/70 block text-[11px]">Travel Date:</span>
                          <span className="font-bold text-orange-300 text-sm">
                            📅 {inq.travelDate || 'None'}
                          </span>
                        </div>
                      </div>

                      {inq.additionalRequirements && (
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs">
                          <span className="text-blue-200/70 font-semibold">Special Notes / Message: </span>
                          <span className="text-blue-100">{inq.additionalRequirements}</span>
                        </div>
                      )}

                      {/* Bottom Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                        {/* Call & WhatsApp actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`tel:${inq.mobileNumber}`}
                            className="bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-blue-400/30"
                          >
                            <Phone className="w-3.5 h-3.5 text-orange-400" />
                            <span>Call ({inq.mobileNumber})</span>
                          </a>

                          <a
                            href={`https://wa.me/91${inq.mobileNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${inq.fullName},\nGreetings from Sarvdnya Tours & Travels regarding your inquiry for ${inq.vehicleName}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-emerald-400/30"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        {/* Quick Status Change Actions & Delete */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {inq.status !== 'contacted' && (
                            <button
                              onClick={() => inq.id && handleStatusChange(inq.id, 'contacted')}
                              className="bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-sky-400/40 transition-all flex items-center gap-1"
                              title="Mark Contact Done"
                            >
                              <span>🔵 Contact Done</span>
                            </button>
                          )}

                          {inq.status !== 'confirmed' && (
                            <button
                              onClick={() => inq.id && handleStatusChange(inq.id, 'confirmed')}
                              className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-emerald-400/40 transition-all flex items-center gap-1"
                              title="Mark Trip Confirmed"
                            >
                              <span>🟢 Confirm Trip</span>
                            </button>
                          )}

                          {inq.status !== 'cancelled' && (
                            <button
                              onClick={() => inq.id && handleStatusChange(inq.id, 'cancelled')}
                              className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs px-2.5 py-1.5 rounded-xl border border-rose-400/40 transition-all flex items-center gap-1"
                              title="Mark Cancelled"
                            >
                              <span>🔴 Cancel</span>
                            </button>
                          )}

                          {/* Delete Button */}
                          {inq.id && (
                            <button
                              onClick={() => handleDelete(inq.id!)}
                              disabled={deletingId === inq.id}
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border border-rose-500/20 flex items-center gap-1 ml-1"
                              title="Delete inquiry record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
