import {addPrefixToClassName} from "@/utils/utils";
import Story from "@/Story/story";
import {DesktopStoryComingOptions} from "@/Story/DesktopStory/desktop-story.types";

export default class DesktopStory extends Story {

    private _elems:{
        title: HTMLElement,
        description: HTMLElement,
        avatar: HTMLElement,
        avatarContainer: HTMLElement,
    };

    _selected = false;

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

    get selected():boolean {
        return this._selected;
    }
    set selected(selected:boolean) {
        if (selected) {
            this.el.classList.add('gobi-story--selected');
        }
        else {
            this.el.classList.remove('gobi-story--selected');
        }
        this._selected = selected;
    }

    constructor(options:DesktopStoryComingOptions) {
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
        if (options.titleSize) {
            this._elems.title.style.fontSize = options.titleSize;
        }
        if (options.descriptionSize) {
            this._elems.description.style.fontSize = options.descriptionSize;
        }
        if (options.avatarSize) {
            this._elems.avatarContainer.style.width = options.avatarSize;
        }
        this._selected = !!options.selected;
        this.title = this._title;
        this.description = this._description;
        this.avatarSrc = this._avatarSrc;
        this.color = this._color;
    }

    protected _createTemplate():HTMLElement {
        const classPrefix = 'gobi-story';
        const container = document.createElement('div');
        container.classList.add(classPrefix);
        container.innerHTML = DesktopStory._HTML;
        addPrefixToClassName(container.querySelectorAll('*'), classPrefix + '__');
        return container;
    }

    private static get _HTML():string {
        return '<div class="avatar-container" data-select-area data-avatarContainer><div class="avatar" data-avatar></div></div>' +
               '<div class="title" data-title></div>' +
               '<div class="description" data-description></div>';
    }
}
