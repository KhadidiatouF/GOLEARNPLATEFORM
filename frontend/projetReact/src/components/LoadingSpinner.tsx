import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

export default function LoadingSpinner({
  label = 'Chargement...',
  className = '',
  size = 'md',
  fullPage = false
}: LoadingSpinnerProps) {
  const wrapperClassName = fullPage
    ? 'flex min-h-[40vh] items-center justify-center'
    : 'flex items-center justify-center py-8';

  return (
    <div className={`${wrapperClassName} ${className}`.trim()}>
      <div className="flex flex-col items-center gap-3 text-center text-gray-500">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-600`} />
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}
