type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  children: React.ReactNode;
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-700",
    ghost: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
