import {addPrefixToClassName} from "@/utils/utils";
import Player from "@/GobiPlayer/gobi-player";
import {StoryOptions} from "@/Story/story.types";
import Story from "@/Story/story";
import DesktopStory from "@/Story/DesktopStory/desktop-story";
import {DesktopModuleComingOptions, DesktopModuleOptions} from "@/Module/DesktopModule/desktop-module.types";

export default class DesktopModule {
    private static readonly _defaultOptions = {
        title: '',
        color: '',
        activeColor: '',
        playerOptions: {}
    };

    private _currentStory:DesktopStory;
    private _title:string;
    private _color:string;
    private _activeColor:string;
    private _playerContainer:HTMLElement;

    el:HTMLElement;
    player:Player;
    stories:DesktopStory[];

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
    get currentStory():DesktopStory {
        return this._currentStory;
    }
    set currentStory(story:DesktopStory) {
        this._currentStory.color = this._color;
        this._currentStory.selected = false;
        this._currentStory = story;
        this._currentStory.selected = true;
        this._currentStory.color = this._activeColor;
        this.player.load({
            storyName: this._currentStory.id
        });
    }

    constructor(options:DesktopModuleComingOptions) {
        const _options:DesktopModuleOptions = Object.assign({}, DesktopModule._defaultOptions, options);
        this.el = this._createTemplate();
        this._title = _options.title;
        this.title = _options.title;
        this._color = _options.color;
        this._activeColor = _options.activeColor;
        this.stories = this._createStories(_options.stories, _options);
        this._currentStory = this.stories[0];
        this._playerContainer = this.el.querySelector('[data-player]') as HTMLElement;
        this.player = new Player(Object.assign({
            storyName: this._currentStory.id,
            container: this._playerContainer,
        }, _options.playerOptions));


        this._playerContainer.style.maxWidth = Math.min(window.innerHeight * 0.53, 350) + 'px';
        window.addEventListener('resize',  () => {
            this._playerContainer.style.maxWidth = Math.min(window.innerHeight * 0.53, 350) + 'px';
        });
        this.currentStory = this._currentStory;
    }

    append(container:HTMLElement) {
        container.appendChild(this.el);
    }

    remove() {
        const container = this.el.parentElement;
        if (container) {
            container.removeChild(this.el);
        }
    }

    private _createStories(storiesOptions:StoryOptions[], options:DesktopModuleOptions):DesktopStory[] {
        const storiesBlock = this.el.querySelector('[data-stories]') as HTMLElement;
        return storiesOptions.map((story) => {
            return new DesktopStory({
                id: story.id,
                container: storiesBlock,
                avatarSrc: story.avatarSrc,
                title: story.title,
                description: story.description,
                titleColor: story.titleColor,
                descriptionColor: story.descriptionColor,
                color: this._color,
                titleSize: options.titleSize,
                avatarSize: options.avatarSize,
                descriptionSize: options.descriptionSize,
                onSelect: this._onStorySelect.bind(this)
            });
        });
    }

    private _onStorySelect(story:Story) {
        this.currentStory = story as DesktopStory;
    }

    private _createTemplate():HTMLElement {
        const container = document.createElement('div');
        const classPrefix = 'gobi-module';
        container.classList.add(classPrefix);
        container.innerHTML = DesktopModule._HTML;
        addPrefixToClassName(container.querySelectorAll('*'), classPrefix + '__');
        return container;
    }

    private static get _HTML():string {
        return '<div class="player-block">' +
                   '<div class="player" data-player></div>' +
               '</div>' +
               '<div class="stories-block">' +
                   '<div class="title" data-title></div>' +
                   '<div class="stories" data-stories></div>' +
               '</div>';
    }
}
