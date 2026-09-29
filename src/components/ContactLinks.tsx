import { GlobeIcon, InstagramIcon, MailIcon, SendIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";
import { ListGroup, RowContent } from "@/components/ui/ListRow";
import { CONTACT, CONTACT_LINKS } from "@/config/contact";
import type { Messages } from "@/lib/i18n/config";

const ICONS = { website: GlobeIcon, instagram: InstagramIcon, youtube: YouTubeIcon, telegram: SendIcon, whatsapp: WhatsAppIcon, email: MailIcon };
const HANDLE_STYLE: Record<Channel, "handle" | "raw"> = { website: "raw", instagram: "handle", youtube: "handle", telegram: "handle", whatsapp: "raw", email: "raw" };
type Channel = keyof typeof CONTACT;

export function configuredChannels(): Channel[] {
  return (Object.keys(CONTACT) as Channel[]).filter((k) => CONTACT[k]);
}

export function channelHref(k: Channel) {
  return CONTACT_LINKS[k](CONTACT[k]);
}

function channelBody(k: Channel) {
  return HANDLE_STYLE[k] === "handle" ? `@${CONTACT[k]}` : CONTACT[k];
}

/** List of configured KoreaFarsi contact channels; renders nothing when none are set. */
export function ContactLinks({ m }: { m: Messages }) {
  const channels = configuredChannels();
  if (channels.length === 0) return null;
  return (
    <ListGroup>
      {channels.map((k) => (
        <li key={k}>
          <a
            href={channelHref(k)}
            target={k === "email" ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-cream/70"
          >
            <RowContent Icon={ICONS[k]} title={m.account.helpPage.channels[k]} body={channelBody(k)} />
          </a>
        </li>
      ))}
    </ListGroup>
  );
}
