import Story from "./";

export interface AbstractStoryOptions {
  id?: string;
  viewKey?: string;
  secretKey?: string;
  container?: HTMLElement;
  avatarSrc?: string;
  avatarSize?: string;
  title?: string;
  description?: string;
  color?: string;
  titleColor?: string;
  descriptionColor?: string;
  onSelect?: (story: Story) => void | any;
}

export interface StoryOptions extends AbstractStoryOptions {
  selected?: boolean;
  titleSize?: string;
  descriptionSize?: string;
  avatarSize?: string;
}
