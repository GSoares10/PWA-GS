if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log("[PWA Builder] active service worker found, no need to register");
  } else {
    // Register the service worker
    navigator.serviceWorker
      .register("serviceWorker/pwabuilder-sw.js")
      .then(function () {
        console.log("[PWA Builder] Service worker has been registered for scope: ");
      });
  }
}
