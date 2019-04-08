import {StoryComingOptions} from "@/Story/story.types";
import {ModulePlayerOptions} from "@/Module/gobi-module.types";

export interface MobileModuleOptions {
    title:string,
    color: string,
    stories: StoryComingOptions[],
    playerOptions: ModulePlayerOptions,
}

export interface MobileModuleComingOptions{
    title?:string,
    color?: string,
    stories: StoryComingOptions[],
    playerOptions?: ModulePlayerOptions,
}
