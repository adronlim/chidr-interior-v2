import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategories } from '@/hooks/use-categories';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().max(30).optional().or(z.literal('')),
  projectInterest: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'A few more words, please'),
});

type FormValues = z.infer<typeof schema>;

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? '/.netlify/functions/contact';

export default function ContactForm() {
  const { data: categories } = useCategories();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-line p-8">
        <h3 className="font-display text-2xl tracking-tighter">Thank you.</h3>
        <p className="mt-2 text-ash">We'll be in touch within one working day.</p>
        <button type="button" className="btn-ghost mt-6" onClick={() => setStatus('idle')}>
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Field label="Name" error={errors.name?.message}>
        <input type="text" {...register('name')} className={inputCls} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input type="email" {...register('email')} className={inputCls} />
      </Field>
      <Field label="Phone (optional)" error={errors.phone?.message}>
        <input type="tel" {...register('phone')} className={inputCls} />
      </Field>
      <Field label="Project interest" error={errors.projectInterest?.message}>
        <select {...register('projectInterest')} className={inputCls}>
          <option value="">Select one…</option>
          {categories?.map((category) => (
            <option key={category._id} value={category.slug}>
              {category.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <textarea rows={5} {...register('message')} className={inputCls} />
      </Field>

      {status === 'error' && (
        <p className="text-sm text-brass">
          Something went wrong. Email us at hello@chidr.com.my and we'll reply.
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn disabled:opacity-50">
        {isSubmitting ? 'Sending…' : 'Send inquiry →'}
      </button>
    </form>
  );
}

const inputCls =
  'w-full bg-transparent border-0 border-b border-line py-2 focus:outline-none focus:border-ink transition-colors';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-brass">{error}</span>}
    </label>
  );
}
