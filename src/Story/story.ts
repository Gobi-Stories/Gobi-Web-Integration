import SimpleEventEmitter from "@/utils/event-emitter";
import {StoryComingOptions, StoryOptions} from "@/Story/story.types";
import {addListener} from "@/utils/utils";

export default abstract class Story {
    el:HTMLElement;
    name:string;

    private static readonly _defaultStoryOptions = {
        avatarSrc: '',
        title: '',
        description: '',
        color: '',
        selected: false,
        titleColor: '',
        descriptionColor: ''
    };
    protected _listeners:Array<() => void> = [];

    protected _eventEmitter = new SimpleEventEmitter();
    on = this._eventEmitter.on.bind(this._eventEmitter);
    off = this._eventEmitter.off.bind(this._eventEmitter);
    protected _title:string;
    protected _description:string;
    protected _avatarSrc:string;
    protected _color:string;

    abstract get avatarSrc():string;
    abstract set avatarSrc(src:string);
    abstract get title():string;
    abstract set title(title:string);
    abstract get description():string;
    abstract set description(description:string);
    abstract get color():string;
    abstract set color(color:string);

    protected abstract _createTemplate():HTMLElement;

    protected constructor(options:StoryComingOptions) {
        const _options:StoryOptions = Object.assign({}, Story._defaultStoryOptions, options);
        this.el = this._createTemplate();
        this.name = _options.name;
        this._title = _options.title;
        this._description = _options.description;
        this._avatarSrc = _options.avatarSrc;
        this._color = _options.color;
        this._addSelectEmitter();
        if (typeof _options.onSelect === 'function') {
            this._eventEmitter.on('select', _options.onSelect);
        }
        if (_options.container) {
            _options.container.appendChild(this.el);
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
