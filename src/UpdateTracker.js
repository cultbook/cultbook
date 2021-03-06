// copied pretty much wholesale from https://github.com/solid/react-components/blob/master/src/UpdateTracker.js
// and therefore Copyright ©2018–present Ruben Verborgh, MIT License
import auth from 'solid-auth-client';

// Wildcard for tracking all resources
const ALL = '*';
// Subscribers per resource URL
const subscribers = {};
// WebSockets per host
const webSockets = {};
// All fetched URLs
const fetchedUrls = new Set();

/**
 * Notifies a subscriber of updates to resources on a Solid server,
 * by listening to its WebSockets.
 */
export default class UpdateTracker {
  /** Create a tracker that sends updates to the given subscriber function. */
  constructor(subscriber) {
    this.subscriber = subscriber;
  }

  /** Subscribes to changes in the given resources */
  async subscribe(...urls) {
    for (let url of urls) {
      // Create a new subscription to the resource if none existed
      url = url.replace(/#.*/, '');
      if (!(url in subscribers)) {
        subscribers[url] = new Set();
        const tracked = url !== ALL ? [url] : [...fetchedUrls];
        await Promise.all(tracked.map(trackResource));
      }
      // Add the new subscriber
      subscribers[url].add(this.subscriber);
    }
  }

  /** Unsubscribes to changes in the given resources */
  async unsubscribe(...urls) {
    for (let url of urls) {
      url = url.replace(/#.*/, '');
      if (url in subscribers)
        subscribers[url].delete(this.subscriber);
    }
  }
}

/** Tracks updates to the given resource */
async function trackResource(url, options) {
  // Obtain a WebSocket for the given host
  const { host } = new URL(url);
  if (!(host in webSockets)) {
    webSockets[host] = Promise.resolve(null).then(() =>
      createWebSocket(url, { host, ...options }));
  }
  const webSocket = await webSockets[host];

  // Track subscribed resources to resubscribe later if needed
  webSocket.resources.add(url);
  // Subscribe to updates on the resource
  webSocket.enqueue(`sub ${url}`);
}

/** Creates a WebSocket for the given URL. */
async function createWebSocket(resourceUrl, options) {
  const webSocketUrl = await getWebSocketUrl(resourceUrl);
  const webSocket = new WebSocket(webSocketUrl);
  return Object.assign(webSocket, {
    resources: new Set(),
    reconnectionAttempts: 0,
    reconnectionDelay: 1000,
    enqueue,
    onmessage: processMessage,
    onclose: reconnect,
    ready: new Promise(resolve => {
      webSocket.onopen = () => {
        webSocket.reconnectionAttempts = 0;
        webSocket.reconnectionDelay = 1000;
        resolve();
      };
    }),
  }, options);
}

/** Retrieves the WebSocket URL for the given resource. */
async function getWebSocketUrl(resourceUrl) {
  const response = await auth.fetch(resourceUrl);
  const webSocketUrl = response.headers.get('Updates-Via');
  if (!webSocketUrl)
    throw new Error(`No WebSocket found for ${resourceUrl}`);
  return webSocketUrl;
}

/** Enqueues data on the WebSocket */
async function enqueue(data) {
  await this.ready;
  this.send(data);
}

/** Processes an update message from the WebSocket */
function processMessage({ data }) {
  // Verify the message is an update notification
  const match = /^pub +(.+)/.exec(data);
  if (!match)
    return;

  // Invalidate the cache for the resource
  const url = match[1];
  // This was in the original code, and might still be useful later?
  //ldflex.clearCache(url);

  // Notify the subscribers
  const update = { timestamp: new Date(), url };
  for (const subscriber of subscribers[url] || [])
    subscriber(update);
  for (const subscriber of subscribers[ALL] || [])
    subscriber(update);
}

/** Reconnects a socket after a backoff delay */
async function reconnect() {
  // Ensure this socket is no longer marked as active
  delete webSockets[this.host];

  // Try setting up a new socket
  if (this.reconnectionAttempts < 6) {
    // Wait a given backoff period before reconnecting
    await new Promise(done => (setTimeout(done, this.reconnectionDelay)));
    // Try reconnecting, and back off exponentially
    await Promise.all([...this.resources].map(url =>
      trackResource(url, {
        reconnectionAttempts: this.reconnectionAttempts + 1,
        reconnectionDelay: this.reconnectionDelay * 2,
      })
    ));
  }
}

/** Closes all sockets */
export async function resetWebSockets() {
  for (const url in subscribers)
    delete subscribers[url];
  for (const host in webSockets) {
    let socket = webSockets[host];
    delete webSockets[host];
    try {
      socket = await socket;
      delete socket.onclose;
      socket.close();
    }
    catch { /**/ }
  }
  fetchedUrls.clear();
}

// Keep track of all fetched resources
auth.on('request', url => {
  if (!fetchedUrls.has(url)) {
    if (ALL in subscribers)
      trackResource(url);
    fetchedUrls.add(url);
  }
});
