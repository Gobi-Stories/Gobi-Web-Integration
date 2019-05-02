import {ModulePlayerOptions} from "@/Module/gobi-module.types";

export interface MobileLayoutStoryOption {
    id: string
    avatarSrc?: string,
    title?: string,
    description?: string,
    color?: string,
    titleColor?: string,
    descriptionColor?: string,
}

export interface MobileLayoutOptions{
    title?:string,
    color?: string,
    avatarSize?: string
    verticalOrientation?: boolean
    stories: MobileLayoutStoryOption[],
    playerOptions?: ModulePlayerOptions,
    container?: HTMLElement,
}
