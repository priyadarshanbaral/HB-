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
  if (!rawEmail || typeof rawEmail !== 'string') {
    return {
      isValid: false,
      email: rawEmail || '',
      domain: '',
      normalizedEmail: '',
      errorMessage: 'Please enter a valid email address.',
    };
  }

  const email = rawEmail.trim().toLowerCase();

  // Validate format and ensure single @ separator
  const atParts = email.split('@');
  if (atParts.length !== 2 || !atParts[0] || !atParts[1]) {
    return {
      isValid: false,
      email: rawEmail,
      domain: '',
      normalizedEmail: email,
      errorMessage: 'Please enter a valid email address.',
    };
  }

  const [localPart, domainPart] = atParts;

  // Basic check on local part and domain part
  if (localPart.includes(' ') || domainPart.includes(' ') || !domainPart.includes('.')) {
    return {
      isValid: false,
      email: rawEmail,
      domain: domainPart,
      normalizedEmail: email,
      errorMessage: 'Please enter a valid email address.',
    };
  }

  const target = allowedDomain.trim().toLowerCase().replace(/^@/, '');

  let isMatch = false;

  if (domainPart === target) {
    isMatch = true;
  } else if (allowSubdomains && domainPart.endsWith('.' + target)) {
    isMatch = true;
  }

  if (!isMatch) {
    return {
      isValid: false,
      email: rawEmail,
      domain: domainPart,
      normalizedEmail: email,
      errorMessage: RESTRICTED_DOMAIN_ERROR_MESSAGE,
    };
  }

  return {
    isValid: true,
    email: rawEmail,
    domain: domainPart,
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
