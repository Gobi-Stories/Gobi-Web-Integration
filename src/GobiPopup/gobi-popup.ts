import {addListener, scrollDisabler, returnHighestZIndex} from "@/utils/utils";
import SimpleEventEmitter from "@/utils/event-emitter.ts";
import {GobiPopupOptions, GobiPopupComingOptions} from "@/GobiPopup/gobi-popup.types";
import Player from "@/GobiPlayer/gobi-player";

// GobiPopup is the overlay that contains the iframe with the Gobi Player.
// The overlay is a half-transparent black fullpage background.
// GobiPopup puts a close X button on the player, adds an Escape button listener, and also quits if
// the background overlay is clicked.
// GobiPopup does not contain the player itself, it only shows it using an iframe.

// Classes for this component start with gobi-popup__.
// The other components are not part of this popup, and thus should be renamed from
// gobi-popup-* to gobi-storyset-*, or something else.

export default class GobiPopup {
    private _isOpen = false;
    private _defaultOptions = {
        classes: '',
        openers: ''
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
        this.el = document.createElement('div');
        this.el.className = _options.classes;
        this.content = document.createElement('div');
        this.content.className = 'gobi-popup__content';
        this.iframeContainer = document.createElement('div');
        this.iframeContainer.className = 'gobi-popup__iframe-container';
        this._createTemplate();
        this.player = _options.player;
        this.appendPlayer(this.player);
        this.el.addEventListener('click', this._onDirectClickClose.bind(this));
        this.content.addEventListener('click', this._onDirectClickClose.bind(this));
    }

    appendPlayer(player:Player) {
        this.player = player;
        this.iframeContainer.insertBefore(this.player.el, this.iframeContainer.lastElementChild);
    }

    open() {
        scrollDisabler.disable();
        this.el.style.zIndex = (returnHighestZIndex() + 1).toString();
        this.el.classList.add('gobi-popup--active');
        this._listeners.push(addListener(window, 'keyup', this._onEscapeClose.bind(this)));
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
        const closeButton = document.createElement('button');
        closeButton.className = 'gobi-popup__close-btn';
        closeButton.addEventListener('click', this.close.bind(this));
        this._calculatePlayerSize();
        this.iframeContainer.appendChild(closeButton);
        this.content.appendChild(this.iframeContainer);
        this.el.classList.add('gobi-popup');
        this.el.appendChild(this.content);
        window.addEventListener('resize', this._calculatePlayerSize.bind(this));
    }

    private _onDirectClickClose(event:MouseEvent) {
        // currentTarget is element that the event listener was attached to.
        // target is the child-most element clicked
        if (event.target === event.currentTarget) {
            this.close();
        }
    }
    private _onEscapeClose(event:KeyboardEvent) {
        let isEscape = false;
        if (typeof event.key !== 'undefined') {
            isEscape = ('Escape' === event.key || 'Esc' === event.key);
        } else {
            isEscape = (event.keyCode === 27);
        }
        if (isEscape) {
            this.close();
        }
    }

    private _calculatePlayerSize() {
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
