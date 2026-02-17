import {
  FileText, MessageCircle, Circle, Megaphone,
  Film, User, Hash, Mail, Image,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ContentType } from "@/lib/api/contentLab";

const CONTENT_TYPE_ICONS: Record<ContentType, React.FC<LucideProps>> = {
  post: FileText,
  caption: MessageCircle,
  story: Circle,
  ad: Megaphone,
  reel_script: Film,
  bio: User,
  hashtags: Hash,
  email: Mail,
  image: Image,
};

interface ContentTypeIconProps {
  type: ContentType;
  size?: number;
  className?: string;
}

export function ContentTypeIcon({ type, size = 16, className = "" }: ContentTypeIconProps) {
  const Icon = CONTENT_TYPE_ICONS[type] || FileText;
  return <Icon className={className} style={{ width: size, height: size }} />;
}
