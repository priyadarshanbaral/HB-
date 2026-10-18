import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateEmailDomain, validateGooglePayloadDomain, RESTRICTED_DOMAIN_ERROR_MESSAGE } from '../src/utils/domainValidator.ts';

describe('Domain Validator - HB+ Company Authorization', () => {
  const ALLOWED_DOMAIN = 'hbplus.fit';

  it('allows authorized company emails ending in @hbplus.fit', () => {
    const validEmails = [
      'employee@hbplus.fit',
      'alex.morgan@hbplus.fit',
      'sarah_chen123@hbplus.fit',
      'dev+test@hbplus.fit',
    ];

    for (const email of validEmails) {
      const res = validateEmailDomain(email, ALLOWED_DOMAIN);
      assert.equal(res.isValid, true, `Expected ${email} to be authorized`);
      assert.equal(res.domain, 'hbplus.fit');
      assert.equal(res.normalizedEmail, email.toLowerCase());
    }
  });

  it('normalizes uppercase and mixed-case company emails', () => {
    const res = validateEmailDomain('Alex.Morgan@HBPLUS.FIT', ALLOWED_DOMAIN);
    assert.equal(res.isValid, true);
    assert.equal(res.normalizedEmail, 'alex.morgan@hbplus.fit');
    assert.equal(res.domain, 'hbplus.fit');
  });

  it('denies common external email domains (@gmail.com, @yahoo.com)', () => {
    const unauthorized = [
      'employee@gmail.com',
      'employee@yahoo.com',
      'employee@outlook.com',
      'employee@hotmail.com',
    ];

    for (const email of unauthorized) {
      const res = validateEmailDomain(email, ALLOWED_DOMAIN);
      assert.equal(res.isValid, false, `Expected ${email} to be denied`);
      assert.equal(res.errorMessage, RESTRICTED_DOMAIN_ERROR_MESSAGE);
    }
  });

  it('denies lookalike and spoofed domains', () => {
    const lookalikes = [
      'employee@hbplus.fit.example.com',
      'employee@not-hbplus.fit',
      'employee@fakehbplus.fit',
      'employee@hbplus.fitness',
      'employee@hbplus.fit.evil.com',
      'hbplus.fit@gmail.com',
      'admin@hbplus-fit.com',
    ];

    for (const email of lookalikes) {
      const res = validateEmailDomain(email, ALLOWED_DOMAIN);
      assert.equal(res.isValid, false, `Expected lookalike ${email} to be rejected`);
      assert.equal(res.errorMessage, RESTRICTED_DOMAIN_ERROR_MESSAGE);
    }
  });

  it('rejects missing, empty, or malformed email addresses', () => {
    const malformed = [
      '',
      '   ',
      'employee',
      'employee@',
      '@hbplus.fit',
      'employee@@hbplus.fit',
      'employee@hbplus@fit.com',
      'employee with space@hbplus.fit',
      'employee@hbplus fit',
      'employee@hbplus',
    ];

    for (const email of malformed) {
      const res = validateEmailDomain(email, ALLOWED_DOMAIN);
      assert.equal(res.isValid, false, `Expected malformed ${email} to be invalid`);
      assert.ok(res.errorMessage, 'Error message must be present for malformed email');
    }
  });

  it('validates Google payload with hosted domain claim or email', () => {
    const validPayload = { email: 'alex.morgan@hbplus.fit', hd: 'hbplus.fit' };
    const invalidPayload = { email: 'intruder@gmail.com', hd: 'gmail.com' };

    const validRes = validateGooglePayloadDomain(validPayload, ALLOWED_DOMAIN);
    assert.equal(validRes.isValid, true);

    const invalidRes = validateGooglePayloadDomain(invalidPayload, ALLOWED_DOMAIN);
    assert.equal(invalidRes.isValid, false);
    assert.equal(invalidRes.error, RESTRICTED_DOMAIN_ERROR_MESSAGE);
  });
});
