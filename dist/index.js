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
const url = 'https://jestjs.io/img/content/feature-fast.png';
const el = document.getElementById('app');
const tester = new index_1.default({
    url,
    onProgress: (progress) => {
        const p = `${progress.toFixed(2)}%`;
        if (el) {
            el.innerText = `testing: ${p}`;
        }
        console.log(p);
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
    console.log(result);
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
class SpeedTester {
    constructor(optional) {
        if (optional) {
            this.testFrequency = optional.testFrequency || 4;
            this.url = optional.url || '';
            this.onProgress = optional.onProgress;
        }
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.url) {
                const results = Array(this.testFrequency).fill(0);
                let currentProgress = 0;
                let i = 0;
                const onProgress = (progress) => {
                    currentProgress = (100 / this.testFrequency) * i + (progress / this.testFrequency);
                    if (this.onProgress) {
                        this.onProgress(currentProgress);
                    }
                };
                for (; i < this.testFrequency; i++) {
                    const result = yield this.withAjax(this.url, onProgress);
                    results[i] = result;
                }
                return results.reduce((p, c) => {
                    let current = p;
                    current += c;
                    return current;
                }) / this.testFrequency;
            }
            return this.withJsApi();
        });
    }
    canIUseConnection() {
        const conn = navigator.connection;
        if (conn)
            return conn;
        throw new Error('the current device does not support connection api');
    }
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
        }).catch(err => { throw err; });
    }
}
exports.default = SpeedTester;

},{}]},{},[1]);
