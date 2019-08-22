import {addPrefixToClassName, isInViewport} from "@/utils/utils";
import Popup from "@/Popup";
import Story from "@/Story";
import Player from "@/Player";
import {StoryOptions} from "@/Story/types";
import AbstractStory from "@/Story/abstract-story";
import {BubbleLayoutOptions} from "@/Bubbles/types";

export default class Bubbles {
  private _currentStory: Story;
  private _title: string;

  rootElement: HTMLElement;
  popup: Popup;
  player: Player;
  stories: Story[];

  get title(): string {
    return this._title;
  }
  set title(title: string) {
    const titleEl = this.rootElement.querySelector("[data-title]") as HTMLElement;
    if (titleEl) {
      this._title = title || "";
      titleEl.textContent = this._title;
      titleEl.style.display = this._title ? "" : "none";
    }
  }
  get currentStory(): Story {
    return this._currentStory;
  }
  set currentStory(story: Story) {
    this._currentStory = story;
    this.player.load({
      viewKey: this._currentStory.viewKey,
      storyName: this._currentStory.id
    });
  }

  constructor(options: BubbleLayoutOptions) {
    this.rootElement = this._createTemplate(options.verticalOrientation, !!options.wrap);
    this._title = options.title || "";
    this.title = this._title;
    this.stories = this._createStories(
      options.stories,
      options.color,
      options.avatarSize,
      options.showNewStoryQrBubble
    );
    this._currentStory = this.stories[0];
    this.player = new Player(
      Object.assign(
        {
          viewKey: this.currentStory.viewKey,
          storyName: this.currentStory.id,
          checkViewPort: false
        },
        options.playerOptions
      )
    );
    this.popup = new Popup({
      player: this.player
    });
    if (options.container) {
      this.append(options.container);
    }

    this.viewPortChecker();

    window.addEventListener('scroll', this.customDebounce(this.viewPortChecker.bind(this), 500, false));
  }

  viewPortChecker() {
    isInViewport(this.rootElement) ? this.showAnimBorder() : this.hideAnimBorder();
  }

  showAnimBorder() {
    const bubblesBorder = Array.prototype.slice.call(this.rootElement.querySelectorAll('.gobi-popup-story__avatar-circle'), 0);

    bubblesBorder.forEach(function (bubble) {
      bubble.style.animation = 'bubbleBorderDraw 800ms ease-in-out 100ms forwards';
    });
  }

  hideAnimBorder() {
    const bubblesBorder = Array.prototype.slice.call(this.rootElement.querySelectorAll('.gobi-popup-story__avatar-circle'), 0);

    bubblesBorder.forEach(function (bubble) {
      bubble.style.animation = 'none';
    });
  }

  customDebounce(func, wait, immediate) {
    let timeout;
    return function () {
      // @ts-ignore
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  getViewKeys() {
    return this.stories.map((story) => story.viewKey);
  }

  getKeys() {
    return this.stories.map((story) => ({viewKey: story.viewKey, secretKey: story.secretKey}));
  }

  append(container: HTMLElement) {
    document.body.appendChild(this.popup.rootElement);
    container.appendChild(this.rootElement);
  }

  remove() {
    const container = this.rootElement.parentElement;
    if (container) {
      document.body.removeChild(this.popup.rootElement);
      container.removeChild(this.rootElement);
      this.popup.close();
    }
  }

  private _createStories(
    storyOptionsArray: StoryOptions[],
    color?: string,
    avatarSize?: string,
    showNewStoryQrBubble?: boolean
  ): Story[] {
    const storiesContainer = this.rootElement.querySelector(
      "[data-stories]"
    ) as HTMLElement;
    const stories = storyOptionsArray.map(storyOptions => {
      return new Story({
        viewKey: storyOptions.viewKey,
        secretKey: storyOptions.secretKey,
        id: storyOptions.id,
        container: storiesContainer,
        avatarSrc: storyOptions.avatarSrc,
        title: storyOptions.title,
        description: storyOptions.description,
        titleColor: storyOptions.titleColor,
        descriptionColor: storyOptions.descriptionColor,
        color: color,
        avatarSize: avatarSize,
        onSelect: this._onStorySelect.bind(this)
      });
    });
    if (showNewStoryQrBubble) {
      const qrStory = new Story({
        container: storiesContainer,
        color: color,
        avatarSize: avatarSize,
        onSelect: this._onStorySelect.bind(this)
      });
      stories.push(qrStory);
    }
    return stories;
  }

  private _onStorySelect(abstractStory: AbstractStory) {
    this.currentStory = abstractStory as Story;
    this.popup.open();
  }

  private _createTemplate(
    isVertical: boolean = false,
    isWrap: boolean
  ): HTMLElement {
    const container = document.createElement("div");
    const classPrefix = "gobi-popup-module";
    container.classList.add(classPrefix);
    container.classList.add(classPrefix + "--hoverable");
    container.innerHTML = Bubbles._HTML;
    addPrefixToClassName(container.querySelectorAll("*"), classPrefix + "__");
    const storiesContainerEl = container.lastElementChild as HTMLElement;
    if (isVertical) {
      storiesContainerEl.classList.add(classPrefix + "__stories--vertical");
    } else {
      storiesContainerEl.classList.add(classPrefix + "__stories--horizontal");
    }
    if (!isWrap) {
      storiesContainerEl.classList.add(classPrefix + "__stories--no-wrap");
    }
    if ("ontouchstart" in window || navigator.maxTouchPoints) {
      window.addEventListener("touchstart", onTouch);
      window.addEventListener("mousemove", removeListeners);
    }
    function onTouch() {
      container.classList.remove(classPrefix + "--hoverable");
      removeListeners();
    }
    function removeListeners() {
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("mousemove", removeListeners);
    }
    return container;
  }

  private static get _HTML(): string {
    return `<div class="title" data-title></div>
                <div class="stories" data-stories></div>`;
  }
}
