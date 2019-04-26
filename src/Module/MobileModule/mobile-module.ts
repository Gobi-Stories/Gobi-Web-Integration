import {ResponseModuleStory} from "@/Module/gobi-module.types";
import {decorateResponseStories, getModule, mergeStoriesOptions} from "@/utils/utils";
import MobileLayout from "@/Layouts/MobileLayout/mobile-layout";
import {MobileModuleOptions} from "@/Story/MobileStory/mobile-story.types";

export default class MobileModule {
    constructor(options:MobileModuleOptions) {
        this.load(options)
    }

    load(options:MobileModuleOptions) {
        getModule(options.moduleId).then((stories:ResponseModuleStory[]) => {
            const responseStoryOptions = decorateResponseStories(stories);
            const storiesOptions = mergeStoriesOptions(responseStoryOptions, options.stories);
            new MobileLayout({
                verticalOrientation: options.verticalOrientation,
                title:  options.title,
                color: options.color,
                stories: storiesOptions,
                playerOptions: options.playerOptions,
                container: options.container
            });
        });
    }
}
