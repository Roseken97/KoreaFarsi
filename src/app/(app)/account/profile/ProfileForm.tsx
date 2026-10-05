"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, useRef } from "react";
import { CheckIcon, CloseIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { authErrorMessage } from "@/lib/auth/errors";
import { AVATAR_KEYS, type AvatarKey } from "@/lib/avatars";
import { useI18n } from "@/lib/i18n/client";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({
  userId,
  initialName,
  email,
  initialAvatarKey,
  initialCustomAvatarUrl,
}: {
  userId: string;
  initialName: string;
  email: string;
  initialAvatarKey: AvatarKey | null;
  initialCustomAvatarUrl?: string | null;
}) {
  const router = useRouter();
  const { m } = useI18n();
  const t = m.account.profile;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);
  const [avatarKey, setAvatarKey] = useState<AvatarKey | null>(initialAvatarKey);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(initialCustomAvatarUrl || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [nameError, setNameError] = useState("");
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus({ tone: "error", text: m.errors.validation.invalidImageType || "Invalid image type" });
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      setStatus({ tone: "error", text: m.errors.validation.imageTooLarge || "Image too large (max 2MB)" });
      return;
    }

    setUploadingImage(true);
    setStatus(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        setStatus({ tone: "error", text: authErrorMessage(m, uploadError) });
        setUploadingImage(false);
        return;
      }

      const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setCustomAvatarUrl(publicUrl.publicUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus({ tone: "success", text: t.imageUploaded || "Image uploaded" });
    } catch (err) {
      setStatus({ tone: "error", text: "Upload failed" });
    }

    setUploadingImage(false);
  }

  async function removeCustomAvatar() {
    setUploadingImage(true);
    try {
      const supabase = createClient();
      const ext = customAvatarUrl?.split(".").pop() || "jpg";
      await supabase.storage.from("avatars").remove([`${userId}/avatar.${ext}`]);
      setCustomAvatarUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus({ tone: "success", text: "Avatar removed" });
    } catch (err) {
      // File might already be deleted, that's fine
      setCustomAvatarUrl(null);
    }
    setUploadingImage(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    setNameError(trimmed ? "" : m.errors.validation.nameRequired);
    setStatus(null);
    if (!trimmed) return;

    setLoading(true);
    const supabase = createClient();
    // profiles is the source of truth; metadata is kept in sync for places that read the session only.
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, name: trimmed, avatar_key: avatarKey, custom_avatar_url: customAvatarUrl });
    if (!error) await supabase.auth.updateUser({ data: { name: trimmed } });
    setLoading(false);

    if (error) return setStatus({ tone: "error", text: authErrorMessage(m, error) });
    setStatus({ tone: "success", text: t.saved });
    router.refresh();
  }

  async function copyUserId() {
    await navigator.clipboard.writeText(userId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-card bg-surface p-5 shadow-soft md:p-6">
      <div className="flex justify-center">
        <Avatar name={name || initialName} email={email} avatarKey={avatarKey} size={88} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{t.chooseAvatar}</span>
        <div className="flex flex-wrap justify-center gap-3">
          {AVATAR_KEYS.map((key) => {
            const selected = avatarKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setAvatarKey(selected ? null : key)}
                aria-pressed={selected}
                className={`relative rounded-full transition ${selected ? "ring-2 ring-teal ring-offset-2 ring-offset-surface" : ""}`}
              >
                <Avatar avatarKey={key} size={48} />
                {selected && (
                  <span className="absolute -end-0.5 -bottom-0.5 grid size-5 place-items-center rounded-full bg-teal text-white ring-2 ring-surface">
                    <CheckIcon width={11} height={11} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{t.uploadImage}</span>
        <div className="flex flex-col gap-2">
          {customAvatarUrl && (
            <div className="relative inline-w-fit mx-auto">
              <Avatar customAvatarUrl={customAvatarUrl} size={120} />
              <button
                type="button"
                onClick={removeCustomAvatar}
                disabled={uploadingImage}
                className="absolute -top-2 -end-2 rounded-full bg-error text-white p-1 hover:bg-error-dark transition disabled:opacity-50"
                aria-label="Remove custom avatar"
              >
                <CloseIcon width={14} height={14} />
              </button>
            </div>
          )}
          <label className="flex items-center justify-center gap-2 cursor-pointer rounded-field border-2 border-dashed border-ink-soft px-4 py-3.5 transition hover:border-teal hover:bg-teal/5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-ink-soft">
              <path d="M12 3v12M6 9l6-6 6 6M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium text-ink-soft">{uploadingImage ? m.common.uploading : t.uploadImage}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>
          <p className="text-xs text-ink-faint">{t.imageNote}</p>
        </div>
      </div>

      {status && <Notice tone={status.tone}>{status.text}</Notice>}
      <Field
        label={m.auth.fields.fullName}
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={nameError}
      />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">{m.auth.fields.email}</span>
        <p dir="ltr" className="rounded-field bg-cream px-4 py-3.5 text-start text-[15px] text-ink-soft">
          {email}
        </p>
        <p className="text-xs text-ink-faint">{t.emailNote}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">{t.userId}</span>
        <div className="flex items-center gap-2 rounded-field bg-cream px-4 py-3.5">
          <p dir="ltr" className="min-w-0 flex-1 truncate text-start text-[13px] text-ink-soft">
            {userId}
          </p>
          <button type="button" onClick={copyUserId} className="shrink-0 text-xs font-semibold text-teal-deep">
            {copied ? t.copied : t.copy}
          </button>
        </div>
        <p className="text-xs text-ink-faint">{t.userIdNote}</p>
      </div>
      <Button type="submit" loading={loading}>
        {t.save}
      </Button>
    </form>
  );
}
