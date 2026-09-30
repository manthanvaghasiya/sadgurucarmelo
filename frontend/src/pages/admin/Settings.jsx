/**
 * @file frontend/src/pages/admin/Settings.jsx
 * @description Master Admin Settings orchestrator for credentials, security posture,
 * and multi-key Gemini AI auto-fill engine configuration.
 */

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Settings,
  Shield,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';
import SecurityCredentialsTab from '../../components/admin/settings/SecurityCredentialsTab';

export default function AdminSettings() {
  // ── Tab Management ──
  const [activeTab, setActiveTab] = useState('security');

  // ── AI Configuration State ──
  const [geminiKeys, setGeminiKeys] = useState(['']);
  const [geminiStates, setGeminiStates] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSaving, setAiSaving] = useState(false);

  const fetchAiSettings = useCallback(async () => {
    setAiLoading(true);
    try {
      const res = await axiosInstance.get('/ai/settings');
      if (res.data.success) {
        setGeminiKeys(res.data.data.keys && res.data.data.keys.length > 0 ? res.data.data.keys : ['']);
        setGeminiStates(res.data.data.keyStates || []);
      }
    } catch (err) {
      console.error('Failed to load AI settings:', err);
    } finally {
      setAiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'ai') fetchAiSettings();
  }, [activeTab, fetchAiSettings]);

  const onSaveAiSettings = async () => {
    setAiSaving(true);
    try {
      const validKeys = geminiKeys.filter((k) => k && k.trim().length > 0);
      const res = await axiosInstance.put('/ai/settings', { geminiApiKeys: validKeys });
      if (res.data.success) {
        toast.success('Gemini API keys saved successfully!');
        setGeminiKeys(validKeys.length > 0 ? validKeys : ['']);
        fetchAiSettings();
      }
    } catch (err) {
      toast.error('Failed to update Gemini API keys');
    } finally {
      setAiSaving(false);
    }
  };

  const updateGeminiKey = (index, value) => {
    const next = [...geminiKeys];
    next[index] = value;
    setGeminiKeys(next);
  };

  const addGeminiKey = () => {
    setGeminiKeys([...geminiKeys, '']);
  };

  const removeGeminiKey = (index) => {
    const next = geminiKeys.filter((_, i) => i !== index);
    setGeminiKeys(next.length > 0 ? next : ['']);
  };

  const tabs = [
    { id: 'security', label: 'Security & Credentials', icon: Shield },
    { id: 'ai', label: 'AI Configuration', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary animate-[spin_3s_linear_infinite]" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">Settings</h1>
          <p className="font-body text-sm text-text-muted">
            Manage your login credentials, account security, and AI configuration.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-surface rounded-2xl border border-gray-100 p-1.5 flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/15'
                  : 'text-text-muted hover:text-text hover:bg-background'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════ Security & Credentials Tab ═══════════════════════ */}
      {activeTab === 'security' && <SecurityCredentialsTab />}

      {/* ═══════════════════════ AI Configuration Tab ═══════════════════════ */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-text">Gemini AI Auto-Fill Engine</h2>
                  <p className="font-body text-xs text-text-muted mt-0.5">
                    Multi-key rotation system with automatic failover, rate-limit spacing (15 RPM), and smart fallback.
                  </p>
                </div>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 border border-brand-orange/20 font-body text-xs font-semibold transition-colors shrink-0"
              >
                Get Free Gemini API Key &rarr;
              </a>
            </div>

            <div className="p-4 rounded-xl bg-brand-orange/5 border border-brand-orange/15 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div className="font-body text-xs text-text-muted leading-relaxed">
                <strong className="text-text">How Multi-Key Rotation Works: </strong>
                You can configure multiple free Gemini API keys. When adding a car or pasting a dealer WhatsApp message,
                the system uses the first active key. If a key hits Google's free-tier rate limit (429) or quota
                exhaustion, it automatically penalties that key for 60 seconds and instantly rotates to your next key.
                If all keys are exhausted or offline, the smart regex pattern parser takes over with zero downtime.
              </div>
            </div>

            {aiLoading ? (
              <div className="py-12 flex items-center justify-center text-text-muted gap-2 font-body text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-brand-orange" />
                Loading AI configuration...
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block font-body text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Gemini API Keys ({geminiKeys.filter((k) => k.trim()).length} Active)
                </label>

                <div className="space-y-3">
                  {geminiKeys.map((key, index) => {
                    const state = geminiStates.find((s) => s.key === key);
                    const isExhausted = state?.exhaustedUntil && new Date(state.exhaustedUntil) > new Date();
                    const isInvalid = state?.isInvalid;

                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={key}
                            onChange={(e) => updateGeminiKey(index, e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full px-4 py-3 bg-background rounded-xl border border-gray-200 dark:border-white/10 font-mono text-xs text-text outline-none focus:border-brand-orange/40 focus:ring-2 focus:ring-brand-orange/10"
                          />
                          {state && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                              {isInvalid ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                  Invalid Key
                                </span>
                              ) : isExhausted ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Quota Cooldown (60s)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  Ready
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {geminiKeys.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGeminiKey(index)}
                            className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors shrink-0 cursor-pointer"
                            title="Remove Key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={addGeminiKey}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-gray-200 dark:border-white/10 font-body text-xs font-semibold text-text hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-brand-orange" />
                    Add Another Gemini Key
                  </button>

                  <button
                    type="button"
                    disabled={aiSaving}
                    onClick={onSaveAiSettings}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-body text-xs font-bold shadow-md shadow-primary/20 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {aiSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving Keys...
                      </>
                    ) : (
                      'Save Gemini Keys'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}