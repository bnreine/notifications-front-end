import { sessionContext } from './session-context.js';
import { useAsync } from 'react-async';
import { fetchAuthSession } from 'aws-amplify/auth';

const getSessionInfo = async () => {
  try {
    const session = await fetchAuthSession();

    if (!session.tokens?.accessToken) {
      return null;
    }

    return session;
  } catch (error) {
    console.log('Not signed in or error fetching access token:', error);
    return null;
  }
};

export const SessionContextProvider = ({ children }) => {
  const { data, reload, isPending } = useAsync({
    promiseFn: getSessionInfo,
  });

  const accessToken = data?.tokens?.accessToken?.toString();
  const email = data?.tokens?.idToken?.payload?.email?.toString();

  return (
    <sessionContext.Provider
      value={{
        accessToken,
        email,
        reloadSession: reload,
        isSessionLoading: isPending,
      }}
    >
      {children}
    </sessionContext.Provider>
  );
};
