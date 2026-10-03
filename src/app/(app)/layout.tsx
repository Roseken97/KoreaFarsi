import { BottomNav } from "@/components/shell/BottomNav";
import { PageTransition } from "@/components/motion/PageTransition";
import { CartProvider } from "@/lib/bookstore/cart";

// Always rendered at mobile width, even on desktop: a centered "device frame"
// on wider screens rather than a separate desktop layout (no Sidebar).
export default function AppShellLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <div className="min-h-dvh bg-cream-deep sm:flex sm:items-center sm:justify-center sm:p-6">
        <div className="mx-auto flex h-dvh w-full flex-col overflow-hidden bg-white sm:h-[min(920px,calc(100dvh-3rem))] sm:w-[430px] sm:rounded-[2.75rem] sm:border-[10px] sm:border-ink sm:shadow-[0_40px_80px_-20px_rgb(0_0_0_/_0.45)]">
          <main className="min-w-0 flex-1 overflow-y-auto px-4 pt-6 pb-6">
            <PageTransition>{children}</PageTransition>
          </main>
          <BottomNav />
        </div>
      </div>
    </CartProvider>
  );
}
