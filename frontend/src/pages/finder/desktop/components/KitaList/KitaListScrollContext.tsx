import React from "react";
import useSmoothScroll from "react-smooth-scroll-hook";

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

  const { scrollTo: _scrollTo } = useSmoothScroll({
    ref: listRef,
    speed: 300,
    direction: "y",
  });

  const scrollTo = (anchorId: string) => {
    const list = listRef.current;
    const anchorElement = document.getElementById(anchorId);

    console.log("attempted to scroll to", anchorId);

    console.log(anchorId);
    console.log(listRef, anchorElement);
    if (!list) return;
    if (!anchorElement) return;

    console.log("scrolling to", anchorId);

    const gap = 8;
    //TODO: Somehow, all scroll events cause a great lag in the map interaction
    //_scrollTo("#" + anchorId);
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
