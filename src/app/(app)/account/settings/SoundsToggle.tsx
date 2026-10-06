"use client";

import { useSyncExternalStore } from "react";
import { SpeakerIcon } from "@/components/icons";
import { RowContent } from "@/components/ui/ListRow";
import { useI18n } from "@/lib/i18n/client";
import { playSound, setSoundsEnabled, soundsEnabled } from "@/lib/ui/sound";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Settings row with an on/off switch for the UI sounds (saved on this device). */
export function SoundsToggle() {
  const { m } = useI18n();
  const t = m.account.settingsPage.sounds;
  // localStorage is browser-only: the server renders "on", the browser reads the saved choice.
  const on = useSyncExternalStore(subscribe, soundsEnabled, () => true);

  function flip() {
    const next = !on;
    setSoundsEnabled(next);
    listeners.forEach((l) => l());
    if (next) playSound("tick");
  }

  return (
    <li>
      <button type="button" role="switch" aria-checked={on} data-sound="off" onClick={flip} className="flex w-full items-center gap-3 px-4 py-3.5 text-start">
        <RowContent Icon={SpeakerIcon} title={t.title} body={t.body} tone="bg-violet-soft text-violet" wrap />
        <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-violet" : "bg-line"}`} aria-hidden="true">
          <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${on ? "end-1" : "end-6"}`} />
        </span>
      </button>
    </li>
  );
}
