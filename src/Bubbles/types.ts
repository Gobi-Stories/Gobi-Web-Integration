import { InlinePlayerOptions } from "@/Player/types";

export interface BubbleOptions {
  id: string;
  viewKey: string;
  avatarSrc?: string;
  title?: string;
  description?: string;
  color?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export interface BubbleLayoutOptions {
  title?: string;
  color?: string;
  avatarSize?: string;
  wrap?: boolean;
  verticalOrientation?: boolean;
  stories: BubbleOptions[];
  playerOptions?: InlinePlayerOptions;
  container?: HTMLElement;
  showNewStoryQrBubble?: boolean;
  isFullHeight?: boolean;
}
