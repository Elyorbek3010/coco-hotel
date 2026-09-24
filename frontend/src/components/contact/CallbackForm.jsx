import { useState } from 'react';
import { createCallbackRequest } from '../../api/guestRequests';

export default function CallbackForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    preferred_time: '',
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
    if (!formData.phone.trim()) {
      errors.phone = 'Please provide your contact phone number.';
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
      // Form security: strictly public fields only. Never send status or admin_note.
      const payload = {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        preferred_time: formData.preferred_time.trim(),
        message: formData.message.trim(),
        website: formData.website || '',
      };

      const response = await createCallbackRequest(payload);

      // Handle 201 (new request) or 200 (duplicate submission within window)
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setSuccessMessage(
          response.data?.detail ||
          'Your callback request has been received. Coco Hotel staff will contact you.'
        );
        setFormData({
          full_name: '',
          phone: '',
          preferred_time: '',
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
          'Too many requests sent recently. Please wait a short while before trying again, or call our front desk directly.'
        );
      } else {
        setGeneralError(
          'Unable to submit your callback request at this time. Please check your connection or contact our front desk directly.'
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
          Request a Callback
        </h2>
        <p className="text-xs text-stone-600">
          Leave your phone number and preferred time. A Coco Hotel staff member will call you directly.
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
              Request Received
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
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Honeypot field (hidden from normal users) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="callback_website">Website</label>
            <input
              id="callback_website"
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

          {/* Full Name */}
          <div>
            <label
              htmlFor="callback_full_name"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
            >
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              id="callback_full_name"
              type="text"
              name="full_name"
              autoComplete="name"
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

          {/* Phone Number */}
          <div>
            <label
              htmlFor="callback_phone"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
            >
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              id="callback_phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +998 90 123 4567"
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-stone-900'
              } rounded-sm focus:outline-none transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed`}
            />
            {fieldErrors.phone && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Preferred Time */}
          <div>
            <label
              htmlFor="callback_preferred_time"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
            >
              Preferred Call Time <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <input
              id="callback_preferred_time"
              type="text"
              name="preferred_time"
              value={formData.preferred_time}
              onChange={handleChange}
              placeholder="e.g. Morning 10:00 – 12:00, or ASAP"
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-sm focus:border-stone-900 focus:outline-none transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Message / Notes */}
          <div>
            <label
              htmlFor="callback_message"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
            >
              Inquiry Note <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="callback_message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Briefly describe what you would like to discuss..."
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-sm focus:border-stone-900 focus:outline-none transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed resize-y"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-sm hover:bg-stone-800 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-stone-800"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting Request...
                </span>
              ) : (
                'Request Callback'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
