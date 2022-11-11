import { createContext } from 'react';

interface ContextProps {
  modelContext: {
    isLoaded: boolean;
    isLoading: boolean;
  };
  setModelContext: (a: ContextProps['modelContext']) => void;
}

export const defaultContext: ContextProps = {
  modelContext: {
    isLoaded: false,
    isLoading: false
  },
  setModelContext: (newState: ContextProps['modelContext'] = defaultContext.modelContext) => newState
};

export const ModelContext = createContext(defaultContext);
