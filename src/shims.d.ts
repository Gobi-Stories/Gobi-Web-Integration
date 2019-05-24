interface Window {
  CustomEvent: typeof CustomEvent;
  Event: typeof Event;
}

declare module "promise-polyfill" {
  const Promise: PromiseConstructor;
  export = Promise;
}
