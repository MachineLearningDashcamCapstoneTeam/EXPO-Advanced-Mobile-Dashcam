import React, { createContext, useState, useMemo } from 'react';
//* Context for access token
const AccessContext = createContext({
    accessTokenContextValue: '',
    setAccessTokenContextValue: () => { },
  });

const AccessTokenContextProvider = ({ children }) => {
  
    //* Context value with system
    const [accessTokenContextValue, setAccessTokenContextValue] = useState();
    const value = useMemo(
        () => ({ accessTokenContextValue, setAccessTokenContextValue }),
        [accessTokenContextValue]
    );
    return (
        //* the Provider gives access to the context to its children
        <AccessContext.Provider value={value}>
          {children}
        </AccessContext.Provider>
      );
}

export { AccessContext, AccessTokenContextProvider };