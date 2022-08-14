const assert = require('assert');
const crypto = require('crypto');

describe('cmd(method[, params[, options]])', function() {

	it('echo', function() {
		return this.page.evaluate(() => {
			const { bleskomat } = window;
			return bleskomat.cmd('echo', ['e2e test 123']);
		}).then(result => {
			assert.strictEqual(result, 'e2e test 123');
		});
	});

	it('getinfo', function() {
		return this.page.evaluate(() => {
			const { bleskomat } = window;
			return bleskomat.cmd('getinfo');
		}).then(result => {
			assert.strictEqual(typeof result, 'object');
			assert.ok(result.firmwareName);
			assert.ok(result.firmwareCommitHash);
			assert.ok(result.firmwareVersion);
			assert.notStrictEqual(typeof result.spiffsInitialized, 'undefined');
		});
	});

	it('getconfig', function() {
		return this.page.evaluate(() => {
			const { bleskomat } = window;
			return bleskomat.cmd('getconfig');
		}).then(result => {
			assert.strictEqual(typeof result, 'object');
			assert.ok(result.logLevel);
			assert.ok(result['apiKey.id']);
		});
	});

	it('setconfig', function() {
		const apiKeyId = crypto.randomBytes(20).toString('base64');
		return this.page.evaluate(apiKeyId => {
			const { bleskomat } = window;
			return bleskomat.cmd('setconfig', { 'apiKey.id': apiKeyId });
		}, apiKeyId).then(result => {
			assert.strictEqual(result, true);
			return this.page.evaluate(() => {
				const { bleskomat } = window;
				return bleskomat.cmd('getconfig');
			}).then(config => {
				assert.strictEqual(config['apiKey.id'], apiKeyId);
			});
		});
	});
});
