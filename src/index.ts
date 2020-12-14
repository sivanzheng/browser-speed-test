interface Optional {
    url?: string;
    fileSize?: number;
    testFrequency?: number;
    onProgress?: (progress: number) => void;
}

/** Class representing a speed tester. */
export default class SpeedTester {
    private url?: string;
    private fileSize?: number;
    private testFrequency!: number;
    private onProgress?: (progress: number) => void;

    /**
     * Create a tester.
     * @param {object} optional - The tester config.
     * @param optional.url Links to resources such as downloaded images for testing.
     * @param optional.fileSize When CORS requests is blocked, will use the img tag to test, the fileSize is required.
     * @param optional.testFrequency Testing frequency, default 4.
     * @param optional.onProgress The testing progress callback function.
     */
    constructor(
        optional?: Optional,
    ) {
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
    public async start(): Promise<number> {
        if (this.url) {
            try {
                const results: number[] = Array(this.testFrequency).fill(0);
                let currentProgress = 0;
                let i = 0;
                const onProgress = (progress: number) => {
                    currentProgress = (100 / this.testFrequency) * i + (progress / this.testFrequency);
                    if (this.onProgress) {
                        this.onProgress(currentProgress);
                    }
                };
                if (!this.corsEnabled(this.url)) {
                    if (!this.fileSize) {
                        throw new Error('When CORS requests is blocked, will use the img tag to test, the fileSize is required!');
                    }
                    for (; i < this.testFrequency; i++) {
                        const result = await this.withImgTag(this.url, this.fileSize, onProgress);
                        results[i] = result;
                    }
                } else {
                    for (; i < this.testFrequency; i++) {
                        const result = await this.withAjax(this.url, onProgress);
                        results[i] = result;
                    }
                }
                return results.reduce((p, c) => {
                    let current = p;
                    current += c;
                    return current;
                }) / this.testFrequency;
            } catch (error) {
                throw new Error(error);
            }
        }
        return this.withJsApi();
    }

    /**
     * Can i use the connection api.
     * @return {object} The connection api.
     */
    public canIUseConnection(): any {
        const conn = (navigator as any).connection;
        if (conn) return conn;
        throw new Error('the current device does not support connection api');
    }

    /**
     * Preflight request.
     * @return {boolean} whether cors is enabled.
     */
    public corsEnabled(url: string): boolean {
        const xhr = new XMLHttpRequest();
        try {
            xhr.open('HEAD', url, false);
            xhr.send();
        } catch (e) {
            return false;
        }
        return xhr.status >= 200 && xhr.status <= 299;
    }

    /**
     * Use connection api to test speed.
     * @return {number} The testing result.
     */
    public withJsApi(): number {
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
     * Use img tag to test speed.
     * @param {string} imgUrl - image link for testing.
     * @param {number} fileSize - image size.
     * @param {string} cb - The testing progress callback function.
     * @return {number} The testing result.
     */
    public withImgTag(imgUrl: string, fileSize: number, cb: (progress: number) => void): Promise<number> {
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
        );
    }
}
