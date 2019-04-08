import {addPrefixToClassName} from "@/utils/utils";
import Story from "@/Story/story";
import {StoryComingOptions} from "@/Story/story.types";

export default class MobileStory extends Story {

    private _elems: {
        title: HTMLElement,
        description: HTMLElement,
        avatar: HTMLElement,
        avatarContainer: HTMLElement,
    };

    get avatarSrc():string {
        return this._avatarSrc;
    }
    set avatarSrc(src:string) {
        this._avatarSrc = src;
        this._elems.avatar.style.backgroundImage = `url(${src})`;
    }
    get title():string {
        return this._title;
    }
    set title(title:string) {
        this._title = title;
        this._elems.title.textContent = title;
    }
    get description():string {
        return this._description;
    }
    set description(description:string) {
        this._description = description;
        this._elems.description.textContent = description
    }
    get color():string {
        return this._color;
    }
    set color(color:string) {
        this._color = color;
        this._elems.avatarContainer.style.borderColor = color;
    }

    constructor(options:StoryComingOptions) {
        super(options);
        this._elems = {
            title: this._getElem('title'),
            description: this._getElem('description'),
            avatar: this._getElem('avatar'),
            avatarContainer: this._getElem('avatarContainer'),
        };
        if (options.titleColor) {
            this._elems.title.style.color = options.titleColor;
        }
        if (options.descriptionColor) {
            this._elems.description.style.color = options.descriptionColor;
        }
        this.title = this._title;
        this.description = this._description;
        this.avatarSrc = this._avatarSrc;
        this.color = this._color;
    }

    protected _createTemplate():HTMLElement {
        const classPrefix = 'gobi-popup-story';
        const container = document.createElement('div');
        container.classList.add(classPrefix);
        container.innerHTML = MobileStory._HTML;
        addPrefixToClassName(container.querySelectorAll('*'), classPrefix + '__');
        return container;
    }

    private static get _HTML():string {
        return '<div class="avatar-container" data-select-area data-avatarContainer><div class="avatar" data-avatar></div></div>' +
               '<div class="title" data-title></div>' +
               '<div class="description"><div class="description-text" data-description></div></div>';
    }
}
