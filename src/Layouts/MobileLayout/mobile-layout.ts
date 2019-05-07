import {addPrefixToClassName} from "@/utils/utils";
import GobiPopup from "@/GobiPopup/gobi-popup";
import MobileStory from "@/Story/MobileStory/mobile-story";
import Player from "@/GobiPlayer/gobi-player";
import {StoryOptions} from "@/Story/story.types";
import Story from "@/Story/story";
import {MobileLayoutOptions} from "@/Layouts/MobileLayout/mobile-layout.types";

export default class MobileLayout {
    private _currentStory:MobileStory;
    private _title:string;

    el:HTMLElement;
    popup:GobiPopup;
    player:Player;
    stories:MobileStory[];

    get title():string {
        return this._title;
    }
    set title(title:string) {
        const titleEl = this.el.querySelector('[data-title]') as HTMLElement;
        if (titleEl) {
            this._title = title || '';
            titleEl.textContent = this._title;
            titleEl.style.display = this._title ? '' : 'none';
        }
    }
    get currentStory():MobileStory {
        return this._currentStory;
    }
    set currentStory(story:MobileStory) {
        this._currentStory = story;
        this.player.load({
            storyName: this._currentStory.id
        });
    }

    constructor(options:MobileLayoutOptions) {
        this.el = this._createTemplate(options.verticalOrientation, !!options.wrap);
        this._title = options.title || '' ;
        this.title = this._title;
        this.stories = this._createStories(options.stories, options.color, options.avatarSize);
        this._currentStory = this.stories[0];
        this.player = new Player(Object.assign({
            storyName: this.currentStory.id,
            checkViewPort: false
        }, options.playerOptions));
        this.popup = new GobiPopup({
            player: this.player
        });
        if (options.container) {
            this.append(options.container);
        }
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

    private _createStories(storiesOptions:StoryOptions[], color?:string, avatarSize?:string):MobileStory[] {
        const storiesBlock = this.el.querySelector('[data-stories]') as HTMLElement;
        return storiesOptions.map((story) => {
            return new MobileStory({
                id: story.id,
                container: storiesBlock,
                avatarSrc: story.avatarSrc,
                title: story.title,
                description: story.description,
                titleColor: story.titleColor,
                descriptionColor: story.descriptionColor,
                color: color,
                avatarSize: avatarSize,
                onSelect: this._onStorySelect.bind(this)
            });
        });
    }

    private _onStorySelect(story:Story) {
        this.currentStory = story as MobileStory;
        this.popup.open();
    }

    private _createTemplate(isVertical:boolean = false, isWrap:boolean):HTMLElement {
        const container = document.createElement('div');
        const classPrefix = 'gobi-popup-module';
        container.classList.add(classPrefix);
        container.innerHTML = MobileLayout._HTML;
        addPrefixToClassName(container.querySelectorAll('*'), classPrefix + '__');
        const storiesContainerEl = container.lastElementChild as HTMLElement;
        if (isVertical) {
            storiesContainerEl.classList.add(classPrefix + '__stories--vertical');
        }
        else {
            storiesContainerEl.classList.add(classPrefix + '__stories--horizontal');
        }
        if (!isWrap) {
            storiesContainerEl.classList.add(classPrefix + '__stories--no-wrap');
        }
        return container;
    }

    private static get _HTML():string {
        return `<div class="title" data-title></div>
                <div class="stories" data-stories></div>`;
    }
}
