import SpeedTester from '../lib/index';

test(
    'If the current device does not support connection api, an error should be reported.',
    () => {
        const tester = new SpeedTester();
        tester.start().then(data => {
            expect(data).toThrowError();
        });
    },
);
