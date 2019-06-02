import { addPrefixToClassName } from "@/utils/utils";
import AbstractStory from "@/Story/abstract-story";
import { StoryOptions } from "@/Story/types";

export default class Story extends AbstractStory {
  _selected = false;

  get selected(): boolean {
    return this._selected;
  }
  set selected(selected: boolean) {
    if (selected) {
      this.rootElement.classList.add("gobi-story--selected");
    } else {
      this.rootElement.classList.remove("gobi-story--selected");
    }
    this._selected = selected;
  }

  get title(): string {
    return this._title;
  }
  set title(title: string) {
    this._title = title;
    if (title.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
      this._elems.title.href = title;
      this._elems.title.textContent = title.replace(new RegExp('^https?://'), '');
    } else {
      this._elems.title.textContent = title;
      delete this._elems.title.href;
    }
  }
  get description(): string {
    return this._description;
  }
  set description(description: string) {
    this._description = description;
    this._elems.description.textContent = description;
  }
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color;
    this._elems.avatarContainer.style.borderColor = color;
  }

  constructor(options: StoryOptions) {
    super(options);
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
      const s = options.avatarSize;
      let css = "";
      css += ".gobi-popup-story__avatar-container {";
      css += " width: " + s + ";";
      css += " margin: calc(0.1 * " + s + ") calc(.2*" + s + ");";
      css += "}";
      css +=
        ".gobi-popup-module--hoverable .gobi-popup-story__avatar-container:hover {";
      css += "  width: calc(1.2 * " + s + ");";
      css += "  margin: 0px calc(.1*" + s + ");";
      css += "}";
      css += "@media all and (max-width: 767px) {";
      css += "  &__avatar-container {";
      css += "    width: " + s + ";";
      css += "    margin: calc(0.1 * " + s + ") calc(.2*" + s + ");";
      css += "  }";
      css += "  .gobi-popup-module--hoverable &__avatar-container:hover {";
      css += "    width: calc(1.2 * " + s + "); // compute from bubble size";
      css += "    margin: 0px calc(.1*" + s + ");";
      css += "  }";
      css += "}";
      const hoverStyle = document.createElement("style");
      hoverStyle.appendChild(document.createTextNode(css));
      document.getElementsByTagName("head")[0].appendChild(hoverStyle);
    }
    this._selected = !!options.selected;
    this.title = this._title;
    this.description = this._description;
    this.color = this._color;
  }

  protected _createTemplate(): HTMLElement {
    // "desktop": const classPrefix = 'gobi-story';
    const classPrefix = "gobi-popup-story";
    const container = document.createElement("div");
    container.classList.add(classPrefix);
    container.innerHTML = Story._HTML;
    addPrefixToClassName(container.querySelectorAll("*"), classPrefix + "__");
    return container;
  }

  private static get _HTML(): string {
    return (
      '<div class="avatar-container" data-select-area data-avatarContainer><div class="avatar" data-avatar></div></div>' +
      '<a class="title" target="_blank" data-title></a>' +
      '<div class="description"><div class="description-text" data-description></div></div>'
    );
  }
}
