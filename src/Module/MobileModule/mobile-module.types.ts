import {ModulePlayerOptions, ModuleStoriesOptionsObj} from "@/Module/gobi-module.types";

export interface MobileModuleOptions {
    moduleId: string,
    container: HTMLElement,
    title?: string,
    color?: string,
    avatarSize?:string,
    verticalOrientation?: boolean,
    wrap?:boolean
    playerOptions?: ModulePlayerOptions,
    stories?: ModuleStoriesOptionsObj,
}
