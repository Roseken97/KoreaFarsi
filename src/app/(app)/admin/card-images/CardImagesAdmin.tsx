"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { Notice } from "@/components/ui/Notice";
import { saveCardImage } from "@/lib/card-images/admin-actions";
import { CARD_IMAGE_SLOTS, type CardImageSlot, type CardImages } from "@/lib/card-images/slots";
import { createUploadTicket } from "@/lib/products/admin-actions";
import { createClient } from "@/lib/supabase/client";

const GROUPS = [...new Set(CARD_IMAGE_SLOTS.map((s) => s.group))];

export function CardImagesAdmin({ images: initial }: { images: CardImages }) {
  const [images, setImages] = useState<CardImages>(initial);
  const [busy, setBusy] = useState<CardImageSlot | null>(null);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function save(slot: CardImageSlot, url: string | null, label: string) {
    const result = await saveCardImage(slot, url);
    if (!result.ok) return setStatus({ tone: "error", text: result.error === "forbidden" ? "This page is only available to KoreaFarsi admins." : "Couldn't save. Please try again." });
    setImages((all) => {
      const next = { ...all };
      if (url) next[slot] = url;
      else delete next[slot];
      return next;
    });
    setStatus({ tone: "success", text: url ? `${label}: photo saved.` : `${label}: photo removed.` });
  }

  async function onFile(slot: CardImageSlot, label: string, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(slot);
    setStatus(null);
    const ticket = await createUploadTicket("cover", `cards/${slot}`, file.name);
    if (!ticket.ok) {
      setBusy(null);
      return setStatus({ tone: "error", text: "Couldn't start the upload." });
    }
    const supabase = createClient();
    const { error } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file);
    if (error) {
      setBusy(null);
      return setStatus({ tone: "error", text: `Upload failed: ${error.message}` });
    }
    const { data } = supabase.storage.from("covers").getPublicUrl(ticket.path);
    await save(slot, data.publicUrl, label);
    setBusy(null);
  }

  async function onRemove(slot: CardImageSlot, label: string) {
    setBusy(slot);
    await save(slot, null, label);
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-8">
      {status && <Notice tone={status.tone}>{status.text}</Notice>}
      {GROUPS.map((group) => (
        <section key={group}>
          <h2 className="mb-3 font-display text-lg font-semibold">{group}</h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CARD_IMAGE_SLOTS.filter((s) => s.group === group).map(({ slot, label }) => {
              const url = images[slot];
              return (
                <li key={slot} className="flex flex-col gap-2 rounded-card bg-surface p-3 shadow-soft">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-deep">
                    {url ? (
                      <Image src={url} alt="" fill sizes="200px" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-xs text-ink-faint">No photo</span>
                    )}
                    {busy === slot && <span className="absolute inset-0 grid place-items-center bg-white/70 text-xs font-medium text-ink">Saving…</span>}
                  </div>
                  <span className="text-sm font-semibold">{label}</span>
                  <div className="flex items-center justify-between gap-2 text-xs font-medium">
                    <label className={`cursor-pointer text-violet ${busy ? "pointer-events-none opacity-50" : ""}`}>
                      {url ? "Replace" : "Upload"}
                      <input type="file" accept="image/*" className="sr-only" disabled={busy !== null} onChange={(e) => onFile(slot, label, e)} />
                    </label>
                    {url && (
                      <button type="button" disabled={busy !== null} onClick={() => onRemove(slot, label)} className="text-danger disabled:opacity-50">
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
