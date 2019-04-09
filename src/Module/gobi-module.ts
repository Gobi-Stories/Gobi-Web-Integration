import {
    ModuleComingOptions,
    ModuleOptions,
    ModuleStoriesOptionsObj,
    ResponseModuleStory
} from "@/Module/gobi-module.types";
import Promise from 'promise-polyfill';
import DesktopModule from "@/Module/DesktopModule/desktop-module";
import {StoryComingOptions} from "@/Story/story.types";
import MobileModule from "@/Module/MobileModule/mobile-module";

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
        this._getModule(options.moduleId).then((stories:ResponseModuleStory[]) => {
            const _options:ModuleOptions = Object.assign({}, Module._defaultOptions, options);
            const container = _options.container;
            const responseStoryOptions = this._decorateResponseStories(stories);
            const storiesOptions = this._mergeStoriesOptions(responseStoryOptions, _options.stories);
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
                         storiesOptions:StoryComingOptions[]):{ desktop:DesktopModule, mobile:MobileModule }{
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
    private _getModule(moduleId:string):Promise<Array<ResponseModuleStory>> {
        return new Promise(function(resolve, reject) {
            const xhr = new XMLHttpRequest();
            const url = 'https://live.gobiapp.com/projector/player/storyModules/' + moduleId;
            xhr.open('GET', url, true);
            xhr.send();
            xhr.onload = function() {
                if (this.status < 400) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(Error('Module didn\'t load successfully; error code:' + xhr.statusText));
                }
            };
            xhr.onerror = function() {
                reject(Error('There was a network error.'));
            };
        })
    }

    private _mergeStoriesOptions(responseStoryOptions:StoryComingOptions[],
                                 comingStoryOptions:ModuleStoriesOptionsObj):StoryComingOptions[] {
        const mergedOptions:StoryComingOptions[] = [];
        for (const key in responseStoryOptions) {
            const responseOption = responseStoryOptions[key];
            if (comingStoryOptions[key]) {
                const comingOptions = comingStoryOptions[key];
                mergedOptions.push(Object.assign(responseOption, comingOptions))
            }
            else {
                mergedOptions.push(responseOption);
            }
        }
        return mergedOptions;
    }

    private _decorateResponseStories(responseStories:ResponseModuleStory[]):Array<StoryComingOptions> {
        return responseStories.map((responseStory, index):StoryComingOptions => {
            return {
                title: responseStory.title,
                avatarSrc: responseStory.thumbnail,
                description: responseStory.description,
                name: responseStory.story_id
            };
        })
    }

}
