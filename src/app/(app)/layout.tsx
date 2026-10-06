import { AppFrame } from "@/components/shell/AppFrame";
import { BottomNav } from "@/components/shell/BottomNav";
import { PageTransition } from "@/components/motion/PageTransition";
import { CartProvider } from "@/lib/bookstore/cart";

export default function AppShellLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <AppFrame>
        <main className="min-w-0 px-4 pt-6 pb-32">
          <PageTransition>{children}</PageTransition>
        </main>
        <BottomNav />
      </AppFrame>
    </CartProvider>
  );
}
