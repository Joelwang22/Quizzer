interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}
