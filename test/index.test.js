import SpeedTester from '../lib/index';

const url = 'https://jestjs.io/img/content/feature-fast.png';

function createXHRmock(status) {
    const open = jest.fn();
    const response = JSON.stringify([]);
    let setRequestHeader = jest.fn();
    const send = jest.fn().mockImplementation(function () {
        setRequestHeader = this.setRequestHeader.bind(this);
    });

    const xhrMockClass = function () {
        return {
            open,
            send,
            status,
            setRequestHeader,
            response,
        };
    };

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
}

describe('Pass preflight request will get truthy otherwise falsy.', () => {
    test('to be falsy', (done) => {
        createXHRmock(400);
        const tester = new SpeedTester();
        const res = tester.corsEnabled(url);
        expect(res).toBeFalsy();
        done();
    });
    test('to be truthy', (done) => {
        createXHRmock(200);
        const tester = new SpeedTester();
        const res = tester.corsEnabled(url);
        expect(res).toBeTruthy();
        done();
    });
});

test(
    'If the current device does not support connection api, an error should be reported.',
    () => {
        const tester = new SpeedTester();
        tester.start().then(data => {
            expect(data).toThrowError();
        });
    },
);
