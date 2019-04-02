import {PlayerComingOptions, PlayerLoadOptions, PlayerOptions} from "@/GobiPlayer/gobi-player.types";
import SimpleEventEmitter from "@/utils/event-emitter";
import {addListener} from "@/utils/utils";

export default class Player {

    private readonly _defaultOptions = {
        autoStart: false,
        hideOverlay: false,
        loop: false,
        width: 0,
        height: 0,
        roundedCorners: true,
        shadow: true,
        checkViewPort: true
    };
    private readonly _options: PlayerOptions;

    private _eventEmitter = new SimpleEventEmitter();
    on = this._eventEmitter.on.bind(this._eventEmitter);
    off = this._eventEmitter.off.bind(this._eventEmitter);
    el: HTMLIFrameElement;

    get storyURL() {
        return `http://gobi-player.scrij.com/story/id/${this._options.storyName}?autoStart=${this._options.autoStart}&addLooping=${this._options.loop}&hideOverlay=${this._options.hideOverlay}&roundedCorners=${this._options.roundedCorners}`;
    }

    constructor(options: PlayerComingOptions) {
        this._options = Object.assign({}, this._defaultOptions, options);
        this.el = this._createIframe();
        if (this._options.container) {
            this._options.container.appendChild(this.el);
        }
        window.addEventListener('message', (event: MessageEvent) => {
            if (this.el.contentWindow !== event.source) return;
            const data = event.data;
            if (data.event) {
                this._eventEmitter.emit(data.event, data.value, this);
                if (this._options.checkViewPort) {
                    this._viewPortChecker(data.event);
                }
            }
        });
    }

    load(options:PlayerLoadOptions) {
        Object.assign(this._options, options);
        this.el.src = this.storyURL;
    }

    play() {
        this._callPlayerMethod('play');
    }

    pause() {
        this._callPlayerMethod('pause');
    }

    reload() {
        this._callPlayerMethod('reset');
    }

    setMute(flag: boolean) {
        this._callPlayerMethod('setMute', flag);
    }

    isInViewport () {
        const distance = this.el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const hiddenHeight = distance.height * 0.8;
        const hiddenWidth = distance.width * 0.8;
        return (
            distance.top >= 0 - hiddenHeight &&
            distance.left >= 0 - hiddenWidth &&
            distance.bottom <= viewportHeight + hiddenHeight  &&
            distance.right <= viewportWidth + hiddenWidth
        );
    }

    private _callPlayerMethod(name: string, arg: any = undefined) {
        this._sendMessage({
            method: name,
            value: arg
        });
    }

    private _sendMessage(message: object) {
        const target = this.el.contentWindow;
        if (target) {
            target.postMessage(message, '*');
        }
    }
    private _createIframe(): HTMLIFrameElement {
        const iframe = document.createElement('iframe');
        const size = this._calcPlayerSize();
        iframe.src = this.storyURL;
        iframe.width = size.width.toString();
        iframe.height = size.height.toString();
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        iframe.style.overflow = 'hidden';
        iframe.style.background = '#000';
        iframe.style.border = '0';
        if (this._options.shadow) {
            iframe.classList.add('gobi-player-shadow');
        }
        if (this._options.roundedCorners) {
            iframe.style.borderRadius = '10px';
        }
        iframe.setAttribute('allow', 'autoplay;');
        return iframe;
    }

    private _viewPortChecker(playerEventName:string) {
        switch (playerEventName) {
            case 'play':
                this._addIsOutOfScreenChecker();
                break;
            case 'pause':
                if (this.isInViewport()) {
                    this._removeIsOnScreenChecker();
                    this._removeIsOutOfScreenChecker();
                }
                break;
            case 'ended':
                this._removeIsOnScreenChecker();
                this._removeIsOutOfScreenChecker();
                break;
        }
    }

    private _removeIsOnScreenChecker = () => {};
    private _removeIsOutOfScreenChecker = () => {};

    private _addIsOutOfScreenChecker() {
        this._removeIsOutOfScreenChecker();
        this._removeIsOnScreenChecker();
        this._removeIsOutOfScreenChecker = addListener(window, 'scroll', () => {
            if (!this.isInViewport()) {
                this.pause();
                this._removeIsOutOfScreenChecker();
                this._addIsOnScreenChecker();
            }
        });
    }
    private _addIsOnScreenChecker() {
        this._removeIsOnScreenChecker = addListener(window, 'scroll', () => {
            if (this.isInViewport()) {
                this.play();
                this._removeIsOnScreenChecker();
                this._addIsOutOfScreenChecker()
            }
        });
    }

    private _calcPlayerSize() {
        let width = 612;
        let height = 1088;
        let aspectRatio = 0.5625; // 9/16
        if (this._options.width && this._options.height) {
            width = this._options.width;
            height = this._options.height;
        } else if (this._options.width) {
            width = this._options.width;
            height = width / aspectRatio;
        } else if (this._options.height) {
            height = this._options.height;
            width = height * aspectRatio;
        }
        return {width: width, height: height};
    }
}
