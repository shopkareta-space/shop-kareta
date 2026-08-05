"use client";

import { useActionState } from "react";
import { submitContactMessage } from "@/app/actions/contact.action";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, null);

  return (
    <form action={formAction} className="bg-white p-8 rounded-3xl border border-brand-gray/10 shadow-xl space-y-6">
      {state && (
        <div className={`p-4 rounded-xl flex items-start gap-3 ${state.success ? 'bg-brand-green/10 text-[#0F6B46]' : 'bg-red-50 text-red-600'}`}>
          {state.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium">{state.message}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-brand-blue">Full Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-brand-blue">Email Address *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-semibold text-brand-blue">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            placeholder="+91 95292 85971"
            className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-semibold text-brand-blue">Subject *</label>
          <input 
            type="text" 
            id="subject" 
            name="subject" 
            required 
            placeholder="How can we help you?"
            className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-brand-blue">Message *</label>
        <textarea 
          id="message" 
          name="message" 
          required 
          rows={5}
          placeholder="Please describe your inquiry in detail..."
          className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isPending || state?.success}
        className="w-full bg-brand-green text-white py-4 rounded-xl font-semibold hover:bg-[#148356] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending Message...
          </>
        ) : state?.success ? (
          "Message Sent"
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
