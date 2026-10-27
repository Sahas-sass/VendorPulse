import React from 'react';
import { CheckCircle2, ShieldCheck, Database, Send, X } from 'lucide-react';

export default function DispatchModal({ dispatchResult, onClose }) {
  if (!dispatchResult) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-emerald-500/50 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[#70E000] flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h3 className="text-base font-black text-white text-center tracking-tight">
          Bridge Deployment Authorized
        </h3>
        <p className="text-[11px] text-slate-300 text-center mt-1">
          Zero-interest liquidity bridge dispatched to prevent predatory debt spiral.
        </p>

        {/* Audit Details Box */}
        <div className="bg-[#182130] rounded-xl p-3 border border-slate-800 my-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Dispatch Audit ID:</span>
            <span className="font-mono font-bold text-slate-200">{dispatchResult.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Registered Vendors:</span>
            <span className="font-bold text-[#70E000]">{dispatchResult.vendors_count} Hawkers Protected</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Total Capital:</span>
            <span className="font-bold text-white">Rs {(dispatchResult.capital_authorized_lkr || 2500000).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Database Status:</span>
            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
              <Database className="w-3 h-3 inline" />
              <span>Synced to Supabase</span>
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#70E000] hover:bg-[#60c400] text-black font-extrabold text-xs py-2.5 rounded-xl transition shadow"
        >
          Confirm & Return to Map
        </button>
      </div>
    </div>
  );
}
