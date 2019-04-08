import Story from "./story";

export interface StoryOptions {
    name: string
    container?: HTMLElement | null,
    avatarSrc: string,
    title: string,
    description: string,
    color: string,
    titleColor: string,
    descriptionColor: string
    onSelect?: (story:Story) => void | any
}
export interface StoryComingOptions {
    name: string
    container?: HTMLElement | null,
    avatarSrc?: string,
    title?: string,
    description?: string,
    color?: string,
    titleColor?: string,
    descriptionColor?: string,
    onSelect?: (story:Story) => void | any
}
