import SpeedTester from '../src/index';

const url = 'https://jestjs.io/img/content/feature-fast.png';
const el = document.getElementById('app');
const tester = new SpeedTester({
    url,
    onProgress: (progress: number) => {
        const p = `${progress.toFixed(2)}%`;
        if (el) { el.innerText = `testing: ${p}`; }
        console.log(p);
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
    console.log(result);
})();
