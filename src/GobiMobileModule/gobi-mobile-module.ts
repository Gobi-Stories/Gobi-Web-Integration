import {GobiMobileModuleComingOptions, GobiMobileModuleOptions, ResponseModuleStory} from "@/Module/gobi-module.types";
import {decorateResponseStories, getModule, mergeStoriesOptions} from "@/utils/utils";
import MobileModule from "@/Module/MobileModule/mobile-module";

export default class GobiMobileModule {

    private static readonly _defaultOptions = {
        title: '',
        color: '#15d6ea',
        stories: []
    };

    constructor(options:GobiMobileModuleComingOptions) {
        this.load(options)
    }

    load(options:GobiMobileModuleComingOptions) {
        getModule(options.moduleId).then((stories:ResponseModuleStory[]) => {
            const _options:GobiMobileModuleOptions = Object.assign({}, GobiMobileModule._defaultOptions, options);
            const responseStoryOptions = decorateResponseStories(stories);
            const storiesOptions = mergeStoriesOptions(responseStoryOptions, _options.stories);
            new MobileModule({
                title:  options.title,
                color: options.color,
                stories: storiesOptions,
                playerOptions: options.playerOptions,
            }).append(_options.container);
        });
    }
}
