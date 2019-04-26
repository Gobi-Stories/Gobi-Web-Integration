import {StoryOptions} from "@/Story/story.types";
import {ModulePlayerOptions} from "@/Module/gobi-module.types";

export interface DesktopModuleOptions {
    title:string,
    color: string,
    activeColor: string,
    stories: StoryOptions[],
    playerOptions: ModulePlayerOptions,
    titleSize?: string,
    descriptionSize?: string,
    avatarSize?: string,
}

export interface DesktopModuleComingOptions{
    title?:string,
    color?: string,
    activeColor?: string,
    playerOptions?: ModulePlayerOptions,
    stories: StoryOptions[],
    titleSize?: string,
    descriptionSize?: string,
    avatarSize?: string,
}


