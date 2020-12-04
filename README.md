# browser-speed-test
network speed test in browser with js

## Installation

```
npm install browser-speed-test
```

### Usage

#### npm install browser-speed-test 
```javascript
    import SpeedTester from 'browser-speed-test';
    /**
     * @param {object} optional - The tester config.
     * @param optional.url Links to resources such as downloaded images for testing.
     * @param optional.testFrequency Testing frequency.
     * @param optional.onProgress The testing progress callback function.
     */
    const tester = new SpeedTester({ url });
    tester.start();
```

Larger resources can test the network speed more accurately. If you do not fill in the url, it will try to use the downlink test.

[click here for demo](https://shiverzheng.github.io/browser-speed-test/demo/index.html)
