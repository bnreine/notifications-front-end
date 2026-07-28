import { createContext, useContext } from 'react';

const sessionContext = createContext({});

const useSessionContext = () => useContext(sessionContext);

export { useSessionContext, sessionContext };
