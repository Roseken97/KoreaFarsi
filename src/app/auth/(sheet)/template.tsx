/** Re-mounts on every move between sign-in screens, so each one rises in part by part. */
export default function SheetTemplate({ children }: { children: React.ReactNode }) {
  return <div className="kf-stagger flex flex-1 flex-col">{children}</div>;
}
