import React from "react";

type SearchOverlayContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchOverlayContext = React.createContext<SearchOverlayContext>(
  {} as SearchOverlayContext
);

type SearchOverlayContextProviderProps = React.PropsWithChildren<{}>;

const SearchOverlayContextProvider: React.FC<
  SearchOverlayContextProviderProps
> = ({ children }) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <SearchOverlayContext.Provider
      value={{
        open,
        setOpen,
      }}
    >
      {children}
    </SearchOverlayContext.Provider>
  );
};

export const useSearchOverlayContext = () =>
  React.useContext(SearchOverlayContext);
export default SearchOverlayContextProvider;
