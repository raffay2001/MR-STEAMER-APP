import React, { createContext, useContext, useMemo, useState } from 'react';

type Ctx = { langVersion: number; bumpLangVersion: () => void };

const LangRefreshContext = createContext<Ctx | null>(null);

export const LangRefreshProvider = ({ children }: { children: React.ReactNode }) => {
    const [langVersion, setLangVersion] = useState(0);
    const value = useMemo(
        () => ({ langVersion, bumpLangVersion: () => setLangVersion(v => v + 1) }),
        [langVersion]
    );
    return <LangRefreshContext.Provider value={value}>{children}</LangRefreshContext.Provider>;
};

export const useLangRefresh = () => {
    const ctx = useContext(LangRefreshContext);
    if (!ctx) throw new Error('useLangRefresh must be used within LangRefreshProvider');
    return ctx;
};
