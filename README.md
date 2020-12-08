# browser-speed-test
network speed test in browser with js

## Installation

yarn
```
yarn add browser-speed-test
```
npm
```
npm install browser-speed-test
```

------------


### Usage

```javascript
    import SpeedTester from 'browser-speed-test';
    /**
     * @param {object} optional - The tester config.
     * @param optional.url Links to resources such as downloaded images for testing.
     * @param optional.fileSize When CROS is disabled, we use the img tag to test, the fileSize is required.
     * @param optional.testFrequency Testing frequency.
     * @param optional.onProgress The testing progress callback function.
     */
    const tester = new SpeedTester({ url });
    tester.start();
```

------------


### Tips

1. Larger resources can test the network speed more accurately.
2. If you do not fill in the url, it will try to use the downlink test.
3. When CROS is disabled, it use the img tag to test, the fileSize is required.

------------


### Local test server

Here are some usage examples in the demo folder, you can execute ```yarn server``` to start a simple test server.
If you want to disable CROS, just comment out ```response.setHeader('Access-Control-Allow-Origin', '*');``` in ```demo/server/index.ts```.


------------



####[click here for demo](https://shiverzheng.github.io/browser-speed-test/demo/index.html)
