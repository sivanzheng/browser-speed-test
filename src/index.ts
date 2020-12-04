interface Optional {
    url?: string;
    testFrequency?: number;
    onProgress?: (progress: number) => void;
}

/** Class representing a speed tester. */
export default class SpeedTester {
    private url?: string;
    private testFrequency!: number;
    private onProgress?: (progress: number) => void;

    /**
     * Create a tester.
     * @param {object} optional - The tester config.
     * @param optional.url Links to resources such as downloaded images for testing.
     * @param optional.testFrequency Testing frequency.
     * @param optional.onProgress The testing progress callback function.
     */
    constructor(
        optional?: Optional,
    ) {
        if (optional) {
            this.testFrequency = optional.testFrequency || 4;
            this.url = optional.url || '';
            this.onProgress = optional.onProgress;
        }
    }

    /**
     * Start testing.
     * @return {number} The testing result.
     */
    public async start() {
        if (this.url) {
            const results: number[] = Array(this.testFrequency).fill(0);
            let currentProgress = 0;
            let i = 0;
            const onProgress = (progress: number) => {
                currentProgress = (100 / this.testFrequency) * i + (progress / this.testFrequency);
                if (this.onProgress) {
                    this.onProgress(currentProgress);
                }
            };
            for (; i < this.testFrequency; i++) {
                const result = await this.withAjax(this.url, onProgress);
                results[i] = result;
            }
            return results.reduce((p, c) => {
                let current = p;
                current += c;
                return current;
            }) / this.testFrequency;
        }
        return this.withJsApi();
    }

    /**
     * Can i use the connection api.
     * @return {object} The connection api.
     */
    private canIUseConnection() {
        const conn = (navigator as any).connection;
        if (conn) return conn;
        throw new Error('the current device does not support connection api');
    }

    /**
     * Use connection api to test speed.
     * @return {number} The testing result.
     */
    public withJsApi() {
        const conn = this.canIUseConnection();
        if (this.onProgress) this.onProgress(0);
        const results: number[] = Array(this.testFrequency)
            .fill(0)
            .map(_ => conn.downlink);
        if (this.onProgress) this.onProgress(100);
        return (results.reduce((p, c) => {
            let current = p;
            current += c;
            return current;
        }) / this.testFrequency) * 1024 / 8;
    }

    /**
     * Use ajax to test speed.
     * @param {string} url - Links to resources such as downloaded images for testing.
     * @param {string} cb - The testing progress callback function.
     * @return {number} The testing result.
     */
    public withAjax(url: string, cb: (progress: number) => void): Promise<number> {
        return new Promise<number>(
            (resolve, reject) => {
                const start = new Date().getTime();
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        const end = new Date().getTime();
                        const contentLength = xhr.getResponseHeader('Content-Length');
                        const size = (contentLength ? parseInt(xhr.getResponseHeader('Content-Length') as string) : 0) / 1024;
                        const speed = size * 1000 / (end - start);
                        resolve(speed);
                    }
                };
                xhr.onerror = (e) => reject(e);
                xhr.onprogress = (e) => {
                    if (cb && e.lengthComputable) cb(e.loaded / e.total * 100);
                };
                xhr.open('GET', `${url}?v=${Math.random()}`);
                xhr.send();
            },
        ).catch(err => { throw err; });
    }
}
