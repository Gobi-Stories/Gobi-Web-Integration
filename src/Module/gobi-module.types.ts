export interface ModuleOptions {
    moduleId: string,
    container: HTMLElement,
    title: string,
    color: string,
    activeColor: string,
    stories: ModuleStoriesOptionsObj,
    playerOptions?: ModulePlayerOptions,
    desktopStoryStyle: {
        titleSize?: string,
        descriptionSize?: string,
        avatarSize?: string,
    }
}

export interface ModuleComingOptions {
    moduleId: string,
    container: HTMLElement,
    title?: string,
    color?: string,
    activeColor?: string,
    stories?: ModuleStoriesOptionsObj,
    playerOptions?: ModulePlayerOptions,
    desktopStoryStyle?: {
        titleSize?: string,
        descriptionSize?: string,
        avatarSize?: string,
    }
}
export interface ModulePlayerOptions {
    loop?: boolean,
    autoStart?: boolean,
    hideOverlay?: boolean,
    roundedCorners?: boolean,
    shadow?: boolean
}

export interface ModuleStoriesOptionsObj {
    [index:number]:ModuleStoriesOptions
}

export interface ModuleStoriesOptions {
    avatarSrc?: string,
    title?: string,
    description?: string,
    titleColor: string,
    descriptionColor:string,
}

export interface ResponseModuleStory {
    story_name: string,
    story_id: string
    title: string,
    description: string,
    thumbnail: string
}
