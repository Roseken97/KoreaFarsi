import { BottomNav } from "@/components/shell/BottomNav";
import { Sidebar } from "@/components/shell/Sidebar";
import { PageTransition } from "@/components/motion/PageTransition";
import { CartProvider } from "@/lib/bookstore/cart";

export default function AppShellLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <div className="flex min-h-dvh bg-white">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pt-6 pb-32 sm:px-6 md:px-10 md:pt-10 md:pb-12">
          <div className="mx-auto w-full max-w-5xl">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
        <BottomNav />
      </div>
    </CartProvider>
  );
}
