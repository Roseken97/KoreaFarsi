/** Phone-sized frame for every auth screen: full screen on phones, a centered card on wider screens. */
export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="min-h-dvh bg-white md:grid md:place-items-center md:bg-cream-deep md:p-8">
      <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-white md:min-h-[min(820px,calc(100dvh-4rem))] md:max-w-[420px] md:rounded-[2rem] md:shadow-lift">
        {children}
      </div>
    </div>
  );
}
