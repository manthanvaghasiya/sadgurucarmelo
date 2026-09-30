/**
 * @file frontend/src/components/admin/settings/PasswordStrengthMeter.jsx
 * @description Real-time interactive password strength analyzer and criteria validator
 * with visual progress meter and password match confirmation.
 */

import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function PasswordStrengthMeter({ password = '', confirmPassword = '' }) {
  if (!password) return null;

  const criteria = [
    {
      id: 'length',
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      id: 'cases',
      label: 'Uppercase and lowercase letters',
      met: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'At least one number (0-9)',
      met: /[0-9]/.test(password),
    },
    {
      id: 'special',
      label: 'Special symbol (!@#$%^&*)',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  let strengthLabel = 'Very Weak';
  let barColor = 'bg-red-500';
  let textColor = 'text-red-600';
  let percentage = '25%';

  if (metCount === 2) {
    strengthLabel = 'Fair';
    barColor = 'bg-amber-500';
    textColor = 'text-amber-600';
    percentage = '50%';
  } else if (metCount === 3) {
    strengthLabel = 'Good';
    barColor = 'bg-blue-500';
    textColor = 'text-blue-600';
    percentage = '75%';
  } else if (metCount === 4) {
    strengthLabel = 'Strong & Secure';
    barColor = 'bg-emerald-500';
    textColor = 'text-emerald-600';
    percentage = '100%';
  }

  const isMatching = confirmPassword && password === confirmPassword;
  const isMismatch = confirmPassword && password !== confirmPassword;

  return (
    <div className="mt-3 p-3.5 bg-background border border-gray-200 rounded-xl space-y-2.5">
      {/* Strength Bar & Label */}
      <div className="flex items-center justify-between text-xs font-heading">
        <span className="text-text-muted font-semibold flex items-center gap-1.5">
          {metCount >= 3 ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          )}
          Password Strength:
        </span>
        <span className={`font-bold ${textColor}`}>{strengthLabel}</span>
      </div>

      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out ${barColor}`}
          style={{ width: percentage }}
        />
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {criteria.map((c) => (
          <div
            key={c.id}
            className={`flex items-center gap-1.5 text-xs font-body transition-colors ${
              c.met ? 'text-emerald-700 font-medium' : 'text-slate-500'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                c.met ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'
              }`}
            >
              {c.met ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5" />}
            </div>
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Match Status Notice if Confirm is typed */}
      {confirmPassword && (
        <div
          className={`pt-2 mt-2 border-t border-slate-200/80 flex items-center gap-2 text-xs font-heading font-semibold ${
            isMatching ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          {isMatching ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Passwords match correctly!</span>
            </>
          ) : isMismatch ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Passwords do not match yet</span>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
