import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center regular-button',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function RedButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'h-10 items-center red-button',
        className,
      )}
    >
      {children}
    </button>
  );
}
