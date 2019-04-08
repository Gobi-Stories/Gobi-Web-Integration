import {addPrefixToClassName} from "@/utils/utils";
import GobiPopup from "@/GobiPopup/gobi-popup";
import {MobileModuleComingOptions, MobileModuleOptions} from "@/Module/MobileModule/mobile-module.types";
import MobileStory from "@/Story/MobileStory/mobile-story";
import Player from "@/GobiPlayer/gobi-player";
import {StoryComingOptions} from "@/Story/story.types";
import Story from "@/Story/story";

export default class MobileModule {
    private static readonly _defaultMobileModuleOptions = {
        title: '',
        color: '',
        playerOptions: {}
    };

    private _currentStory:MobileStory;
    private _title:string;
    private _color:string;

    el:HTMLElement;
    popup:GobiPopup;
    player:Player;
    stories:MobileStory[];

    get title():string {
        return this._title;
    }
    set title(title:string) {
        const titleEl = this.el.querySelector('[data-title]');
        if (titleEl) {
            this._title = title;
            titleEl.textContent = title;
        }
    }
    get currentStory():MobileStory {
        return this._currentStory;
    }
    set currentStory(story:MobileStory) {
        this._currentStory = story;
        this.player.load({
            storyName: this._currentStory.name
        });
    }

    constructor(options:MobileModuleComingOptions) {
        const _options:MobileModuleOptions = Object.assign({}, MobileModule._defaultMobileModuleOptions, options);
        this.el = this._createTemplate();
        this._title = _options.title;
        this.title = _options.title;
        this._color = _options.color;
        this.stories = this._createStories(_options.stories);
        this._currentStory = this.stories[0];
        this.player = new Player(Object.assign({
            storyName: this.currentStory.name,
            checkViewPort: false
        }, _options.playerOptions));
        this.popup = new GobiPopup({
            player: this.player
        });
    }

    append(container:HTMLElement) {
        document.body.appendChild(this.popup.el);
        container.appendChild(this.el);
    }

    remove() {
        const container = this.el.parentElement;
        if (container) {
            document.body.removeChild(this.popup.el);
            container.removeChild(this.el);
            this.popup.close();
        }
    }

    private _createStories(storiesOptions:StoryComingOptions[]):MobileStory[] {
        const storiesBlock = this.el.querySelector('[data-stories]') as HTMLElement;
        return storiesOptions.map((story) => {
            return new MobileStory({
                name: story.name,
                container: storiesBlock,
                avatarSrc: story.avatarSrc,
                title: story.title,
                description: story.description,
                titleColor: story.titleColor,
                descriptionColor: story.descriptionColor,
                color: this._color,
                onSelect: this._onStorySelect.bind(this)
            });
        });
    }

    private _onStorySelect(story:Story) {
        this.currentStory = story as MobileStory;
        this.popup.open();
    }

    private _createTemplate():HTMLElement {
        const container = document.createElement('div');
        const classPrefix = 'gobi-popup-module';
        container.classList.add(classPrefix);
        container.innerHTML = MobileModule._HTML;
        addPrefixToClassName(container.querySelectorAll('*'), classPrefix + '__');
        return container;
    }

    private static get _HTML():string {
        return `<div class="title" data-title></div>
                <div class="stories" data-stories></div>`;
    }
}
