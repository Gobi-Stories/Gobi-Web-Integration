export function forEach<T>(list:ArrayLike<T>, callback:(listItem?:T, index?:number, list?:ArrayLike<T>) => void) {
  const max = list.length;
  for (let i = 0; i < max; i++) {
    callback(list[i], i, list);
  }
}

export function addPrefixToClassName(list:ArrayLike<HTMLElement>, prefix:string) {
  const max = list.length;
  let elem:HTMLElement;
  for (let i = 0; i < max; i++) {
    elem = list[i];
    elem.className = prefix + elem.className;
  }
}

export function addListener(object:Window | Document | HTMLElement,
                            eventName:string,
                            listener: (event?:any) => void):() => void {
  const callback = (event: Event) => listener(event);
  object.addEventListener(eventName, callback);
  return () => object.removeEventListener(eventName, callback);
}

export const scrollDisabler = {
  scrollTop: 0,
  bodyOverflow: '' as string | null,
  disable: function() {
    this.isIOS ? this.IOSDisable() : this.classicDisable();
  },
  enable: function() {
    this.isIOS ? this.IOSEnable() : this.classicEnable();
  },
  classicDisable: function() {
    this.bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  },
  classicEnable: function() {
    document.body.style.overflow = this.bodyOverflow;
  },
  IOSEnable: function() {
    document.documentElement.classList.remove('disabled-scroll');
    document.body.classList.remove('disabled-scroll');
    window.scrollTo(0, this.scrollTop);
  },
  IOSDisable: function() {
    this.scrollTop = window.pageYOffset;
    document.documentElement.classList.add('disabled-scroll');
    document.body.classList.add('disabled-scroll');
  },
  isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
};

