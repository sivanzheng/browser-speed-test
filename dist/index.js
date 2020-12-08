(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const remoteUrl = 'https://jestjs.io/img/content/feature-fast.png';
const localImage = 'http://localhost:3030/test.png';
const el = document.getElementById('app');
const tester = new index_1.default({
    url: localImage,
    fileSize: 349738,
    onProgress: (progress) => {
        const p = `${progress.toFixed(2)}%`;
        if (el) {
            el.innerText = `testing: ${p}`;
        }
    },
    testFrequency: 4,
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tester.start();
    const d = document.createElement('p');
    if (el) {
        d.innerHTML = `test completed: ${result.toFixed(2)} kb/s</p>`;
        el.appendChild(d);
    }
}))();

},{"../src/index":2}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Class representing a speed tester. */
class SpeedTester {
    /**
     * Create a tester.
     * @param {object} optional - The tester config.
     * @param optional.url Links to resources such as downloaded images for testing.
     * @param optional.fileSize When cros is disabled, we use the img tag to test, the fileSize is required.
     * @param optional.testFrequency Testing frequency, default 4.
     * @param optional.onProgress The testing progress callback function.
     */
    constructor(optional) {
        if (optional) {
            this.testFrequency = optional.testFrequency || 4;
            this.url = optional.url || '';
            this.fileSize = optional.fileSize || 0;
            this.onProgress = optional.onProgress;
        }
    }
    /**
     * Start testing.
     * @return {number} The testing result.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.url) {
                try {
                    const results = Array(this.testFrequency).fill(0);
                    let currentProgress = 0;
                    let i = 0;
                    const onProgress = (progress) => {
                        currentProgress = (100 / this.testFrequency) * i + (progress / this.testFrequency);
                        if (this.onProgress) {
                            this.onProgress(currentProgress);
                        }
                    };
                    if (!this.corsEnabled(this.url)) {
                        if (!this.fileSize)
                            throw new Error('When cros is detected, we use the img tag to test, the fileSize is required!');
                        for (; i < this.testFrequency; i++) {
                            const result = yield this.withImgTag(this.url, this.fileSize, onProgress);
                            results[i] = result;
                        }
                    }
                    else {
                        for (; i < this.testFrequency; i++) {
                            const result = yield this.withAjax(this.url, onProgress);
                            results[i] = result;
                        }
                    }
                    return results.reduce((p, c) => {
                        let current = p;
                        current += c;
                        return current;
                    }) / this.testFrequency;
                }
                catch (error) {
                    throw new Error(error);
                }
            }
            return this.withJsApi();
        });
    }
    /**
     * Can i use the connection api.
     * @return {object} The connection api.
     */
    canIUseConnection() {
        const conn = navigator.connection;
        if (conn)
            return conn;
        throw new Error('the current device does not support connection api');
    }
    /**
     * Preflight request.
     * @return {boolean} whether cors is enabled.
     */
    corsEnabled(url) {
        const xhr = new XMLHttpRequest();
        try {
            xhr.open('HEAD', url, false);
            xhr.send();
        }
        catch (e) {
            return false;
        }
        return xhr.status >= 200 && xhr.status <= 299;
    }
    /**
     * Use connection api to test speed.
     * @return {number} The testing result.
     */
    withJsApi() {
        const conn = this.canIUseConnection();
        if (this.onProgress)
            this.onProgress(0);
        const results = Array(this.testFrequency)
            .fill(0)
            .map(_ => conn.downlink);
        if (this.onProgress)
            this.onProgress(100);
        return (results.reduce((p, c) => {
            let current = p;
            current += c;
            return current;
        }) / this.testFrequency) * 1024 / 8;
    }
    /**
     * Use img tag to test speed.
     * @param {string} imgUrl - image link for testing.
     * @param {number} fileSize - image size.
     * @param {string} cb - The testing progress callback function.
     * @return {number} The testing result.
     */
    withImgTag(imgUrl, fileSize, cb) {
        return new Promise((resolve, reject) => {
            cb(0);
            const imgEl = document.createElement('img');
            const start = new Date().getTime();
            let end = null;
            imgEl.onerror = (e) => reject(e);
            imgEl.onload = () => {
                end = new Date().getTime();
                const speed = fileSize / (end - start);
                resolve(speed);
                cb(100);
            };
            imgEl.src = `${imgUrl}?v=${Math.random()}`;
        });
    }
    /**
     * Use ajax to test speed.
     * @param {string} url - Links to resources such as downloaded images for testing.
     * @param {string} cb - The testing progress callback function.
     * @return {number} The testing result.
     */
    withAjax(url, cb) {
        return new Promise((resolve, reject) => {
            const start = new Date().getTime();
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    const end = new Date().getTime();
                    const contentLength = xhr.getResponseHeader('Content-Length');
                    const size = (contentLength ? parseInt(xhr.getResponseHeader('Content-Length')) : 0) / 1024;
                    const speed = size * 1000 / (end - start);
                    resolve(speed);
                }
            };
            xhr.onerror = (e) => reject(e);
            xhr.onprogress = (e) => {
                if (cb && e.lengthComputable)
                    cb(e.loaded / e.total * 100);
            };
            xhr.open('GET', `${url}?v=${Math.random()}`);
            xhr.send();
        });
    }
}
exports.default = SpeedTester;

},{}]},{},[1]);
