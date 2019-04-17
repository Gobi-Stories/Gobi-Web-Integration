import {addListener, scrollDisabler, returnHighestZIndex} from "@/utils/utils";
import SimpleEventEmitter from "@/utils/event-emitter.ts";
import {GobiPopupOptions, GobiPopupComingOptions} from "@/GobiPopup/gobi-popup.types";
import Player from "@/GobiPlayer/gobi-player";

export default class GobiPopup {
    private _isOpen = false;
    private _defaultOptions = {
        classes: '',
        openers: '',
        closers: ''
    };
    private _eventEmitter = new SimpleEventEmitter();
    private _listeners:Array<() => void> = [];

    el:HTMLDivElement;
    content:HTMLDivElement;
    iframeContainer:HTMLDivElement;
    player:Player;

    get isOpen():boolean {
        return this._isOpen;
    }

    constructor(options:GobiPopupComingOptions) {
        const _options:GobiPopupOptions = Object.assign({}, this._defaultOptions, options);
        this.el = this._createDiv(_options.classes);
        this.content = this._createDiv('gobi-popup__content');
        this.iframeContainer = this._createDiv('gobi-popup__iframe-container');
        this._createTemplate();
        this.player = _options.player;
        this.appendPlayer(this.player);
        this._initClosers(_options.closers);
    }

    appendPlayer(player:Player) {
        this.player = player;
        this.iframeContainer.insertBefore(this.player.el, this.iframeContainer.lastElementChild);
    }

    open() {
        scrollDisabler.disable();
        this.el.style.zIndex = (returnHighestZIndex() + 1).toString();
        this.el.classList.add('gobi-popup--active');
        this._listeners.push(addListener(window, 'keyup', this._onKeyUpClose.bind(this)));
        this._isOpen = true;
        this._eventEmitter.emit('open', this, this);
    }
    close() {
        this.el.style.zIndex = '';
        this.el.classList.remove('gobi-popup--active');
        this.el.style.padding = '';
        scrollDisabler.enable();
        this._removeListeners();
        this.player.pause();
        this._isOpen = false;
        this._eventEmitter.emit('close', this, this);
    }

    on(eventName:string, callback:(event?:any)=>void) {
        this._eventEmitter.on(eventName, callback);
    }

    off(eventName:string, callback?:(event?:any)=>void) {
        this._eventEmitter.off(eventName, callback)
    }
    private _removeListeners() {
        for (let i = this._listeners.length; i--;) {
            this._listeners[i]();
        }
    }
    private _createTemplate() {
        const closeBtn = this._createElement('button', 'gobi-popup__close-btn');
        addListener(closeBtn, 'click', this.close.bind(this));
        this._calcPlayerSize();
        this.iframeContainer.appendChild(closeBtn);
        this.content.appendChild(this.iframeContainer);
        this.el.classList.add('gobi-popup');
        this.el.appendChild(this.content);
        window.addEventListener('resize', this._calcPlayerSize.bind(this));
    }
    private _createDiv(classes:string):HTMLDivElement {
        return this._createElement('div', classes);
    }
    private _createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, classes:string):HTMLElementTagNameMap[K] {
        const elem = document.createElement(tagName);
        elem.className = classes;
        return elem;
    }

    private _initClosers(closersSelector:string) {
        this.el.addEventListener('click', this._onOutsideClose.bind(this));
        this.content.addEventListener('click', this._onOutsideClose.bind(this));
    }
    private _onOutsideClose(event:MouseEvent) {
        if (event.target === event.currentTarget) {
            this.close();
        }
    }
    private _onKeyUpClose(event:KeyboardEvent) {
        let isEscape = false;
        if (event.key !== undefined) {
            isEscape = (event.key === 'Escape' || event.key === 'Esc');
        }
        else {
            isEscape = (event.keyCode === 27);
        }
        if (isEscape) {
            this.close();
        }
    }

    private _calcPlayerSize() {
        const videoAspectRatio = 0.5625; // 9:16
        const containerHeight = window.innerHeight - 100;
        const containerWidth = window.innerWidth;
        const containerAspectRatio = containerWidth / containerHeight;
        let width;
        let height;
        if (videoAspectRatio < containerAspectRatio) {
            width = containerHeight * videoAspectRatio;
            height = containerHeight;
        } else {
            width = containerWidth;
            height = containerWidth / videoAspectRatio;
        }
        this.iframeContainer.style.width = width + 'px';
        this.iframeContainer.style.height = height + 'px';
    }

}
