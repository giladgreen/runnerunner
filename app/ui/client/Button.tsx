import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'my-button flex h-10 items-center regular-button',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function RedButton({ children, className, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        `h-10 items-center ${disabled ? 'red-button-disabled' : 'red-button'}`,
        className,
      )}
    >
      {children}
    </button>
  );
}
