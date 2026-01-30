import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next'; // ✅ Import

export default function Newsletter() {
  const { t } = useTranslation('common'); // ✅ Hook
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-100 p-4 rounded text-green-700" data-testid="newsletter-success">
        {t('newsletter_success') || 'Thank you for subscribing!'}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 p-6 bg-gray-50 rounded-lg" data-testid="newsletter-form">
      {/* ✅ Translated Title */}
      <h3 className="text-lg font-bold mb-4">{t('newsletter_title')}</h3>
      <div className="flex gap-2">
        <input
          {...register('email', { 
            required: true, 
            pattern: /^\S+@\S+$/i 
          })}
          // ✅ Translated Placeholder
          placeholder={t('newsletter_placeholder') || 'Enter your email'}
          className="border p-2 rounded flex-1"
          data-testid="newsletter-email"
        />
        <button 
          type="submit" 
          className="bg-black text-white px-4 py-2 rounded"
          data-testid="newsletter-submit"
        >
          {/* ✅ Translated Button */}
          {t('newsletter_button') || 'Subscribe'}
        </button>
      </div>
      {errors.email && (
        <p className="text-red-500 text-sm mt-2" data-testid="newsletter-error">
          {t('newsletter_error') || 'Please enter a valid email address.'}
        </p>
      )}
    </form>
  );
}