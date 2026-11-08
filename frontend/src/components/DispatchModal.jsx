import React from 'react';
import { CheckCircle2, Database, X } from 'lucide-react';

export default function DispatchModal({ dispatchResult, onClose }) {
  if (!dispatchResult) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/90 rounded-3xl max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-black text-slate-900 text-center tracking-tight">
          Bridge Deployment Authorized
        </h3>
        <p className="text-[11px] text-slate-500 text-center mt-1">
          Zero-interest liquidity bridge dispatched to prevent predatory debt spiral.
        </p>

        {/* Audit Details Box */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 my-3.5 space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Dispatch Audit ID:</span>
            <span className="font-mono font-bold text-slate-800">{dispatchResult.id}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Registered Vendors:</span>
            <span className="font-bold text-emerald-600">{dispatchResult.vendors_count} Hawkers Protected</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Total Capital:</span>
            <span className="font-bold text-slate-900">Rs {(dispatchResult.capital_authorized_lkr || 2500000).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Database Status:</span>
            <span className="text-emerald-700 font-semibold flex items-center space-x-1">
              <Database className="w-3 h-3 inline" />
              <span>Synced to Supabase</span>
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-2xl transition shadow-sm"
        >
          Confirm & Return to Map
        </button>
      </div>
    </div>
  );
}
