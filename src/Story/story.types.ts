import Story from "./story";

export interface StoryOptions {
    id: string
    container?: HTMLElement,
    avatarSrc?: string,
    avatarSize?: string,
    title?: string,
    description?: string,
    color?: string,
    titleColor?: string,
    descriptionColor?: string,
    onSelect?: (story:Story) => void | any
}
