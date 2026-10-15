import { AppFrame } from "@/components/shell/AppFrame";
import { BottomNav } from "@/components/shell/BottomNav";
import { PageTransition } from "@/components/motion/PageTransition";
import { OfflineBanner } from "@/components/offline/OfflineBanner";
import { CartProvider } from "@/lib/bookstore/cart";
import { ConnectivityProvider } from "@/lib/offline/connectivity";

export default function AppShellLayout({ children }: LayoutProps<"/">) {
  return (
    <ConnectivityProvider>
      <CartProvider>
        <AppFrame>
          <main className="min-w-0 px-4 pt-6 pb-32">
            <OfflineBanner />
            <PageTransition>{children}</PageTransition>
          </main>
          <BottomNav />
        </AppFrame>
      </CartProvider>
    </ConnectivityProvider>
  );
}
