export type SocialPlatform = 'youtube' | 'instagram' | 'twitter';

export interface SocialIcon {
  type: SocialPlatform;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  hasContent: boolean;
}

export interface SidebarState {
  activePanel: SocialPlatform | null;
  isExpanded: boolean;
  isMobile: boolean;
}

export interface SidebarConfig {
  position: 'left' | 'right';
  defaultWidth: number;
  mobileBreakpoint: number;
  animationDuration: number;
} 