import SpeedTester from '../src/index';

const remoteUrl = 'https://jestjs.io/img/content/feature-fast.png';
const localImage = 'http://localhost:3030/test.png';

const el = document.getElementById('app');
const tester = new SpeedTester({
    url: remoteUrl,
    fileSize: 349738,
    onProgress: (progress: number) => {
        const p = `${progress.toFixed(2)}%`;
        if (el) { el.innerText = `testing: ${p}`; }
    },
    testFrequency: 4,
});


(async () => {
    const result = await tester.start();
    const d = document.createElement('p');
    if (el) {
        d.innerHTML = `test completed: ${result.toFixed(2)} kb/s</p>`;
        el.appendChild(d);
    }
})();
