export interface InlinePlayerOptions {
  loop?: boolean;
  autoStart?: boolean;
  hideOverlay?: boolean;
  roundedCorners?: boolean;
  shadow?: boolean;
}

export interface PlayerOptions extends InlinePlayerOptions {
  checkViewPort?: boolean;
  container?: HTMLElement;
  height?: number;
  storyName: string;
  viewKey: string;
  width?: number;
}

export interface PlayerLoadOptions {
  storyName: string;
  viewKey: string;
  autoStart?: boolean;
  hideOverlay?: boolean;
  loop?: boolean;
}
