/**
 * Domain Validation Engine
 * Validates whether an email belongs strictly to the authorized corporate domain (@hbplus.fit).
 */

export interface DomainValidationResult {
  isValid: boolean;
  email: string;
  domain: string;
  errorMessage?: string;
  normalizedEmail: string;
}

export const RESTRICTED_DOMAIN_ERROR_MESSAGE =
  'Access restricted. Please login using your official domain email.';

/**
 * Validates an email address against the allowed domain (default: hbplus.fit).
 * Checks:
 * 1. Valid email format with @ symbol and domain part
 * 2. Case-insensitivity and whitespace trimming
 * 3. Exact matching of domain (e.g. hbplus.fit) or optional subdomains
 */
export function validateEmailDomain(
  rawEmail: string,
  allowedDomain: string = 'hbplus.fit',
  allowSubdomains: boolean = false
): DomainValidationResult {
  const email = (rawEmail || '').trim().toLowerCase();

  // Basic email structure validation
  const emailRegex = /^[^\s@]+@([^\s@]+)$/;
  const match = email.match(emailRegex);

  if (!match) {
    return {
      isValid: false,
      email: rawEmail,
      domain: '',
      normalizedEmail: email,
      errorMessage: 'Please enter a valid email address.',
    };
  }

  const emailDomain = match[1].toLowerCase();
  const target = allowedDomain.trim().toLowerCase().replace(/^@/, '');

  let isMatch = false;

  if (emailDomain === target) {
    isMatch = true;
  } else if (allowSubdomains && emailDomain.endsWith('.' + target)) {
    isMatch = true;
  }

  if (!isMatch) {
    return {
      isValid: false,
      email: rawEmail,
      domain: emailDomain,
      normalizedEmail: email,
      errorMessage: `Access denied. Only @${target} company accounts are authorized to access this application. Account domain '@${emailDomain}' is not permitted.`,
    };
  }

  return {
    isValid: true,
    email: rawEmail,
    domain: emailDomain,
    normalizedEmail: email,
  };
}

/**
 * Parses a Google JWT (id_token) and checks if the 'hd' (Hosted Domain) claim or email domain matches.
 */
export function validateGooglePayloadDomain(
  payload: { email?: string; hd?: string },
  allowedDomain: string = 'hbplus.fit'
): { isValid: boolean; error?: string } {
  const target = allowedDomain.toLowerCase().replace(/^@/, '');

  // 1. Check Google Hosted Domain claim if present
  if (payload.hd && payload.hd.toLowerCase() === target) {
    return { isValid: true };
  }

  // 2. Validate email domain directly
  if (payload.email) {
    const res = validateEmailDomain(payload.email, target);
    if (res.isValid) return { isValid: true };
  }

  return {
    isValid: false,
    error: RESTRICTED_DOMAIN_ERROR_MESSAGE,
  };
}
