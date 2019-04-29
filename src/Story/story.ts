import SimpleEventEmitter from "@/utils/event-emitter";
import {StoryOptions} from "@/Story/story.types";
import {addListener, fetchAvatarSrc} from "@/utils/utils";

export default abstract class Story {
    el:HTMLElement;
    id:string;

    protected _elems:{
        title: HTMLElement,
        description: HTMLElement,
        avatar: HTMLElement,
        avatarContainer: HTMLElement,
    };

    protected _listeners:Array<() => void> = [];

    protected _eventEmitter = new SimpleEventEmitter();
    on = this._eventEmitter.on.bind(this._eventEmitter);
    off = this._eventEmitter.off.bind(this._eventEmitter);
    protected _title:string;
    protected _description:string;
    protected _avatarSrc:string = '';
    protected _color:string;

    get avatarSrc():string {
        return this._avatarSrc;
    }
    set avatarSrc(src:string) {
        this._avatarSrc = src;
        this._elems.avatar.style.backgroundImage = `url(${src})`;
    }

    abstract get title():string;
    abstract set title(title:string);
    abstract get description():string;
    abstract set description(description:string);
    abstract get color():string;
    abstract set color(color:string);

    protected abstract _createTemplate():HTMLElement;

    protected constructor(options:StoryOptions) {
        this.el = this._createTemplate();
        this._elems = {
            title: this._getElem('title'),
            description: this._getElem('description'),
            avatar: this._getElem('avatar'),
            avatarContainer: this._getElem('avatarContainer'),
        };
        this.id = options.id;
        this._title = options.title || '';
        this._description = options.description || '';
        this.avatarSrc = options.avatarSrc || '';
        if (!options.avatarSrc) {
            fetchAvatarSrc(this.id).then((src) => {
                this.avatarSrc = src;
            })
        }
        this._color = options.color || '';
        this._addSelectEmitter();
        if (typeof options.onSelect === 'function') {
            this._eventEmitter.on('select', options.onSelect);
        }
        if (options.container) {
            options.container.appendChild(this.el);
        }
    }

    destroy() {
        if (this.el.parentElement) {
            this.el.parentElement.removeChild(this.el)
        }
        this._eventEmitter.off();
        for (let i = this._listeners.length; i--;) {
            this._listeners[i]();
        }
    }

    private _addSelectEmitter() {
        const selectAreas = this.el.querySelectorAll('[data-select-area]') as NodeListOf<HTMLElement>;
        const selectClickCallback = () => {
            this._eventEmitter.emit('select', this);
        };
        for (let i = selectAreas.length; i--;) {
            this._listeners.push(addListener(selectAreas[i],'click', selectClickCallback));
        }

    }

    protected _getElem(name:string):HTMLElement {
        const attr = `data-${name}`;
        const elem = this.el.querySelector(`[${attr}]`) as HTMLElement;
        if (elem) {
            elem.removeAttribute(attr);
            return elem;
        }
        else {
            throw new Error('Story does not contain element with name:' + name);
        }
    }
}
