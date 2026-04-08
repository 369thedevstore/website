'use client';

import { useState } from 'react';

type FormState = {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  budget: 'Standard',
  message: '',
};

export function EnquiryForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState('');
  const [tone, setTone] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending enquiry...');
    setTone('idle');

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error ?? 'Unable to send enquiry');
      }

      setForm(initialState);
      setTone('success');
      setStatus(result.message ?? 'Enquiry submitted successfully.');
    } catch (error) {
      setTone('error');
      setStatus(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={updateField('name')} placeholder="Your name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={updateField('email')} placeholder="you@company.com" required />
        </div>
      </div>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" value={form.company} onChange={updateField('company')} placeholder="Business name" />
        </div>
        <div className="field">
          <label htmlFor="budget">Package</label>
          <input id="budget" name="budget" value={form.budget} onChange={updateField('budget')} placeholder="Basic / Standard / Premium" required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">Project notes</label>
        <textarea id="message" name="message" value={form.message} onChange={updateField('message')} placeholder="Tell us what you need on the landing page." required />
      </div>

      <div className="form-footer">
        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Submit enquiry'}
        </button>
        <p className="form-status" data-tone={tone} aria-live="polite">
          {status || 'We will save the enquiry in Supabase and email it immediately.'}
        </p>
      </div>
    </form>
  );
}