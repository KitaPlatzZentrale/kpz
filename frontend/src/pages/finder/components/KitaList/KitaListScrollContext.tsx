import React from "react";

type KitaListScrollContext = {
  listRef: React.RefObject<HTMLDivElement>;
  lastScrollPosition: number;
  scrollTo: (anchorId: string) => void;
  generateElementScrollAnchor: (id: string) => string | undefined;
};

const KitaListScrollContext = React.createContext<KitaListScrollContext>(
  {} as KitaListScrollContext
);

type KitaListScrollContextProviderProps = React.PropsWithChildren<{
  startScrollPosition?: number;
}>;

const KitaListScrollContextProvider: React.FC<
  KitaListScrollContextProviderProps
> = ({ startScrollPosition = 0, children }) => {
  const [lastScrollPosition, setScrollPosition] =
    React.useState<number>(startScrollPosition);

  const listRef = React.useRef<HTMLDivElement>(null);

  const scrollTo = (anchorId: string) => {
    const list = listRef.current;
    const anchorElement = document.getElementById(anchorId);

    console.log("attempted to scroll to", anchorId);

    console.log(anchorId);
    console.log(listRef, anchorElement);
    if (!list) return;
    if (!anchorElement) return;

    console.log("scrolling to", anchorId);

    // scroll to anchor within list element
    const offset = anchorElement.offsetTop - list.offsetTop;

    setScrollPosition(offset);

    const gap = 8;

    list.scrollTo({
      top: offset - gap / 2,
      behavior: "smooth",
    });
  };

  const generateElementScrollAnchor = (id: string) =>
    id.length > 0 ? "list-anchor-" + id : undefined;

  return (
    <KitaListScrollContext.Provider
      value={{
        listRef,
        lastScrollPosition,
        scrollTo,
        generateElementScrollAnchor,
      }}
    >
      {children}
    </KitaListScrollContext.Provider>
  );
};

export const useKitaListScrollContext = () =>
  React.useContext(KitaListScrollContext);
export default KitaListScrollContextProvider;
