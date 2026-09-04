import { useEffect } from 'react';

const OAuthSlack = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status === 'success') {
      window.opener?.postMessage(
        { type: 'slack-oauth-success' },
        window.location.origin
      );
    } else {
      window.opener?.postMessage(
        { type: 'slack-oauth-error' },
        window.location.origin
      );
    }

    window.close();
  }, []);

  return 'Authorizing Slack...';
};

export default OAuthSlack;
