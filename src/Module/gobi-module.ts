import {
    ModuleComingOptions,
    ModuleOptions,
    ResponseModuleStory
} from "@/Module/gobi-module.types";
import DesktopModule from "@/Module/DesktopModule/desktop-module";
import {StoryComingOptions} from "@/Story/story.types";
import MobileModule from "@/Module/MobileModule/mobile-module";
import {decorateResponseStories, getModule, mergeStoriesOptions} from "@/utils/utils";

export default class Module {
    private static readonly _defaultOptions = {
        title: '',
        color: '#999999',
        activeColor: '#15d6ea',
        stories: [],
        desktopStoryStyle: {}
    };

    constructor(options:ModuleComingOptions) {
        this.load(options)
    }


    load(options:ModuleComingOptions) {
        getModule(options.moduleId).then((stories:ResponseModuleStory[]) => {
            const _options:ModuleOptions = Object.assign({}, Module._defaultOptions, options);
            const container = _options.container;
            const responseStoryOptions = decorateResponseStories(stories);
            const storiesOptions = mergeStoriesOptions(responseStoryOptions, _options.stories);
            let isMobileView = window.innerWidth < 768;
            const module = this._initModules(_options, storiesOptions);
            if (window.innerWidth < 768) {
                module.mobile.append(container);
            }
            if (window.innerWidth > 767) {
                module.desktop.append(container);
            }
            window.addEventListener('resize',  () => {
                if (window.innerWidth < 768 && !isMobileView) {
                    module.desktop.remove();
                    module.mobile.append(container);
                    isMobileView = true;
                }
                if (window.innerWidth > 767 && isMobileView) {
                    module.mobile.remove();
                    module.desktop.append(container);
                    isMobileView = false;
                }
            });
        });
    }

    private _initModules(options:ModuleOptions,
                         storiesOptions:StoryComingOptions[]):{ desktop:DesktopModule, mobile:MobileModule } {
        return {
            desktop: new DesktopModule({
                title: options.title,
                color: options.color,
                activeColor: options.activeColor,
                stories: storiesOptions,
                playerOptions: options.playerOptions,
                titleSize: options.desktopStoryStyle.titleSize,
                avatarSize: options.desktopStoryStyle.avatarSize,
                descriptionSize: options.desktopStoryStyle.descriptionSize
            }),
            mobile: new MobileModule({
                title:  options.title,
                color: options.activeColor,
                stories: storiesOptions,
                playerOptions: options.playerOptions,
            })
        };
    }

}
