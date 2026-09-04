const SLACK_OAUTH_CONNECTIONS_URL =
  'https://api2.notifications.benjaminreinecke.click/providers/slack/oauth-connections';

// const waitForPopupClose = (popup, signal) =>
//   new Promise((resolve, reject) => {
//     const intervalId = window.setInterval(() => {
//       if (popup.closed) {
//         cleanup();
//         resolve();
//       }
//     }, 500);
//
//     const onAbort = () => {
//       cleanup();
//       reject(signal.reason);
//     };
//
//     const cleanup = () => {
//       window.clearInterval(intervalId);
//       signal?.removeEventListener('abort', onAbort);
//     };
//
//     signal?.addEventListener('abort', onAbort);
//   });

const openSlackOAuthPopup = () =>
  window.open(
    'about:blank',
    'slack-oauth',
    'width=600,height=800,scrollbars=yes'
  );

const startSlackOAuth = async ([popup], { accessToken }, { signal }) => {
  try {
    const response = await fetch(SLACK_OAUTH_CONNECTIONS_URL, {
      method: 'POST',
      signal,
      headers: {
        Authorization: accessToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Failed to start Slack OAuth (${response.status})`);
    }

    const data = await response.json();

    if (!data.authorizationUrl) {
      throw new Error('Slack OAuth did not return an authorization URL');
    }

    if (popup.closed) {
      return;
    }

    popup.location.href = data.authorizationUrl;
  } catch (error) {
    if (!popup.closed) {
      popup.close();
    }

    throw error;
  }
};

export { openSlackOAuthPopup, startSlackOAuth };
