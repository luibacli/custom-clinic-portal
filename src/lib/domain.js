const MAIN_DOMAINS = ['careboard.dev', 'www.careboard.dev', 'localhost', '127.0.0.1'];

export const getCurrentHost = () => window.location.hostname.replace(/^www\./, '');

export const isMainDomain = () => {
  const host = getCurrentHost();
  return MAIN_DOMAINS.includes(host);
};

export const isTenantDomain = () => !isMainDomain();
