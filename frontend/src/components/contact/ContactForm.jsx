import { useState } from 'react';
import { createContactMessage } from '../../api/guestRequests';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '', // anti-spam honeypot
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.full_name.trim()) {
      errors.full_name = 'Please provide your full name.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) {
      errors.subject = 'Please provide a subject.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please provide your message.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setGeneralError('');
    setFieldErrors({});

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setSubmitting(true);

    try {
      // Form security: strictly public fields only. Never send status, admin_note, etc.
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        website: formData.website || '',
      };

      const response = await createContactMessage(payload);

      // Handle 201 (new message) or 200 (duplicate submission within window)
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setSuccessMessage(
          response.data?.detail ||
          'Your message has been received. Coco Hotel staff will respond as soon as possible.'
        );
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          website: '',
        });
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 400 && data) {
        const backendErrors = {};
        if (typeof data === 'object') {
          Object.keys(data).forEach((field) => {
            const errVal = data[field];
            backendErrors[field] = Array.isArray(errVal) ? errVal.join(' ') : String(errVal);
          });
        }
        setFieldErrors(backendErrors);
        if (data.detail) {
          setGeneralError(data.detail);
        }
      } else if (status === 429) {
        setGeneralError(
          'Too many messages sent recently. Please wait a short while before trying again, or contact our front desk directly.'
        );
      } else {
        setGeneralError(
          'Unable to send your message at this time. Please check your connection or contact our front desk directly.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setSuccessMessage('');
    setGeneralError('');
    setFieldErrors({});
  };

  return (
    <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-1">
          Send a Message
        </h2>
        <p className="text-xs text-stone-600">
          Have an inquiry, group booking question, or special request? Send us a note and we will reply promptly.
        </p>
      </div>

      {success ? (
        <div
          role="status"
          aria-live="polite"
          className="p-6 bg-emerald-50 border border-emerald-200 rounded-sm text-center space-y-4"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-emerald-900">
              Message Delivered
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
              {successMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 hover:text-emerald-950 underline underline-offset-4"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Honeypot field (hidden from normal users) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="contact_website">Website</label>
            <input
              id="contact_website"
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>

          {generalError && (
            <div
              role="alert"
              className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-sm"
            >
              {generalError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="contact_full_name"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="contact_full_name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                  fieldErrors.full_name ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-stone-900'
                } rounded-sm focus:outline-none transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed`}
              />
              {fieldErrors.full_name && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                  {fieldErrors.full_name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="contact_email"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
              >
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                id="contact_email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. guest@example.com"
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                  fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-stone-900'
                } rounded-sm focus:outline-none transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed`}
              />
              {fieldErrors.email && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone (optional) */}
            <div>
              <label
                htmlFor="contact_phone"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
              >
                Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                id="contact_phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +998 90 123 4567"
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                  fieldErrors.phone ? 'border-red-500' : 'border-stone-300 focus:border-stone-900'
                } rounded-sm focus:outline-none transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed`}
              />
              {fieldErrors.phone && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="contact_subject"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
              >
                Subject <span className="text-red-600">*</span>
              </label>
              <input
                id="contact_subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Reservation Inquiry"
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                  fieldErrors.subject ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-stone-900'
                } rounded-sm focus:outline-none transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed`}
              />
              {fieldErrors.subject && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                  {fieldErrors.subject}
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="contact_message"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
            >
              Message <span className="text-red-600">*</span>
            </label>
            <textarea
              id="contact_message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we assist you with your stay or inquiry?"
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                fieldErrors.message ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-stone-900'
              } rounded-sm focus:outline-none transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed resize-y`}
            />
            {fieldErrors.message && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {fieldErrors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber-700 text-white rounded-sm hover:bg-amber-800 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-amber-600"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending Message...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
