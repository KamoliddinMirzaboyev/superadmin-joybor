import { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { Skeleton } from './Skeleton';

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">{title}</h1>
        {subtitle && <p className="text-sm text-surface-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Alert({
  children,
  tone = 'danger',
}: {
  children: ReactNode;
  tone?: 'danger' | 'warning' | 'info';
}) {
  const cls = {
    danger: 'bg-danger-50 text-danger-700 border-danger-100',
    warning: 'bg-warning-50 text-warning-800 border-warning-200',
    info: 'bg-info-50 text-info-600 border-brand-100',
  }[tone];
  return <div className={`mb-4 p-3 rounded-xl border text-sm ${cls}`}>{children}</div>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-surface-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 border-transparent',
    secondary:
      'bg-white text-surface-700 hover:bg-surface-50 border-surface-200',
    ghost: 'bg-transparent text-surface-600 hover:bg-surface-100 border-transparent',
    danger: 'bg-danger-50 text-danger-700 hover:bg-danger-100 border-danger-100',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors duration-150 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand-500/40 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function IconBtn({
  children,
  onClick,
  title,
  spinning,
}: {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  spinning?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="p-2 rounded-xl border border-surface-200 text-surface-600 hover:bg-surface-50 transition-colors duration-150"
    >
      <span className={spinning ? 'inline-flex animate-spin' : 'inline-flex'}>{children}</span>
    </button>
  );
}

export function Field({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-xl border border-surface-200 bg-white text-surface-900 text-sm outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors duration-150 ${className}`}
    />
  );
}

export function SelectField({
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`px-3 py-2 rounded-xl border border-surface-200 bg-white text-surface-900 text-sm outline-none focus:ring-2 focus:ring-brand-500/40 ${className}`}
    >
      {children}
    </select>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
}) {
  const cls = {
    success: 'bg-success-50 text-success-700',
    danger: 'bg-danger-50 text-danger-700',
    warning: 'bg-warning-50 text-warning-800',
    info: 'bg-info-50 text-info-600',
    neutral: 'bg-surface-100 text-surface-600',
  }[tone];
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wide">
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm text-surface-700 ${className}`}>{children}</td>;
}

export function LoadingRow({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function EmptyRow({ cols, text }: { cols: number; text: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-10 text-center text-surface-500 text-sm">
        {text}
      </td>
    </tr>
  );
}
