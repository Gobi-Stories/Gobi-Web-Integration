import {StoryComingOptions} from "@/Story/story.types";

export interface DesktopStoryOptions {
    selected: boolean,
    titleSize?: string,
    descriptionSize?: string,
    avatarSize?: string,
}
export interface DesktopStoryComingOptions extends StoryComingOptions {
    selected?: boolean,
    titleSize?: string,
    descriptionSize?: string,
    avatarSize?: string,
}
