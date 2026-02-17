import { Facebook, Instagram, Twitter, Linkedin, Youtube, Globe } from "lucide-react";
import type { LucideProps } from "lucide-react";

const PLATFORM_ICONS: Record<string, { icon: React.FC<LucideProps>; color: string; label: string }> = {
  instagram:  { icon: Instagram, color: "#E4405F", label: "Instagram" },
  facebook:   { icon: Facebook,  color: "#1877F2", label: "Facebook" },
  tiktok:     { icon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1em] w-[1em]">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.86.11V9a6.27 6.27 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
    </svg>
  ), color: "#000000", label: "TikTok" },
  twitter:    { icon: Twitter,   color: "#1DA1F2", label: "X / Twitter" },
  linkedin:   { icon: Linkedin,  color: "#0A66C2", label: "LinkedIn" },
  youtube:    { icon: Youtube,   color: "#FF0000", label: "YouTube" },
  pinterest:  { icon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1em] w-[1em]">
      <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.4.04-3.44l1.4-5.96s-.36-.72-.36-1.78c0-1.66.96-2.9 2.16-2.9 1.02 0 1.52.76 1.52 1.68 0 1.04-.66 2.58-1 4.02-.28 1.2.6 2.18 1.78 2.18 2.14 0 3.78-2.26 3.78-5.5 0-2.88-2.06-4.88-5.02-4.88-3.42 0-5.42 2.56-5.42 5.22 0 1.04.4 2.14.9 2.74.1.12.12.22.08.34l-.34 1.36c-.04.18-.16.22-.36.14-1.32-.62-2.14-2.56-2.14-4.1 0-3.34 2.44-6.42 7.02-6.42 3.68 0 6.56 2.62 6.56 6.14 0 3.66-2.32 6.62-5.52 6.62-1.08 0-2.1-.56-2.44-1.22l-.66 2.54c-.24.92-.9 2.08-1.34 2.78A12 12 0 1 0 12 0z" />
    </svg>
  ), color: "#E60023", label: "Pinterest" },
};

interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export function PlatformIcon({ platform, size = 16, className = "" }: PlatformIconProps) {
  const config = PLATFORM_ICONS[platform.toLowerCase()];
  if (!config) return <Globe className={className} style={{ width: size, height: size, color: "hsl(var(--muted-foreground))" }} />;

  const Icon = config.icon;
  return <Icon className={className} style={{ width: size, height: size, color: config.color }} />;
}

export function getPlatformLabel(platform: string): string {
  return PLATFORM_ICONS[platform.toLowerCase()]?.label || platform;
}

export { PLATFORM_ICONS };
