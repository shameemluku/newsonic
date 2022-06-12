const fpPromise = import("https://openfpcdn.io/fingerprintjs/v3").then(
  (FingerprintJS) => FingerprintJS.load()
);

fpPromise
  .then((fp) => fp.get())
  .then((result) => {
    const visitorId = result.visitorId;
  });
