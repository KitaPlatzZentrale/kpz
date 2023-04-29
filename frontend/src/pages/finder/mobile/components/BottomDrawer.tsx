import React from "react";
import {
  useSpring,
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";

type Anchor = {
  y: number;
  offset?: number;
};

type BottomDrawerAnchors = {
  fullscreen: Anchor;
  open: Anchor;
  closed: Anchor;
};

const DEFAULT_VISIBLE_PART_HEIGHT = 75;

export const DEFAULT_DRAWER_ANCHORS = (
  windowHeight: number = window?.innerHeight
): BottomDrawerAnchors => ({
  fullscreen: {
    y: 0,
    offset: -50,
  },
  open: {
    y: (windowHeight / 5) * 3,
  },
  closed: {
    y: windowHeight,
    offset: DEFAULT_VISIBLE_PART_HEIGHT,
  },
});

type BottomDrawerProps = React.PropsWithChildren<{
  windowHeight?: number;
  anchors?: BottomDrawerAnchors;
  startAnchor?: keyof BottomDrawerAnchors;
  onClose?: () => void;
  onOpen?: () => void;
  onFullscreen?: () => void;
}>;

/**
 * Drawer attached to bottom of the window that can be dragged up and down
 * Enters multiple stages depending on the drag direction and the current position
 * Stages: Closed (Rest Mode), Open (Halfway), Fullscreen (Top)
 * In fullscreen mode, the drawer is scrollable
 * Drawer can be closed by dragging it down, or by clicking on the handle
 * Drawer will close in "Open" mode to "Closed" if dragged at least halfway down
 */
const BottomDrawer: React.FC<BottomDrawerProps> = ({
  windowHeight = window?.innerHeight,
  anchors = DEFAULT_DRAWER_ANCHORS(windowHeight),
  startAnchor = "open",
  children,
}) => {
  const getAnchorPosition = (anchorKey: keyof typeof anchors) => {
    return anchors[anchorKey].y - (anchors[anchorKey].offset ?? 0);
  };

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const drawerContentRef = React.useRef<HTMLDivElement | null>(null);

  const drawerContentHeight = drawerContentRef.current?.clientHeight ?? 0;

  const [openState, setOpenState] = React.useState<
    "fullscreen" | "open" | "closed"
  >("closed");

  // use spring animation if not in fullscreen, otherwise make spring configs appear like drag animation
  const offset = useSpring(
    getAnchorPosition(startAnchor),
    openState === "fullscreen"
      ? {
          duration: 0.1,
          bounce: 0,
          velocity: 200,
        }
      : {
          stiffness: 300,
          damping: 30,
        }
  );

  const currentDragOffset = useMotionValue(0);

  // work with positive value of currentDragOffset
  // if value is higher than half of the screen height, opacity is 0.75
  // if value is 0, opacity 0.25
  // make opacity flow gradual
  const drawerHandleOpacity = useTransform(
    currentDragOffset,
    [(windowHeight / 2) * -1, 0, windowHeight / 2],
    [0.6, 0.2, 0.6]
  );

  useTransform(offset, (value) =>
    openState === "closed"
      ? Math.min(
          Math.max(value, getAnchorPosition("open")),
          getAnchorPosition("closed")
        )
      : openState === "open"
      ? Math.min(
          Math.max(value, getAnchorPosition("fullscreen")),
          getAnchorPosition("closed")
        )
      : openState === "fullscreen" &&
        Math.min(
          Math.max(value, windowHeight - drawerContentHeight),
          getAnchorPosition("fullscreen")
        )
  );

  const handleClose = (info?: PanInfo) => {
    console.log("close");
    offset.set(getAnchorPosition("closed"));
    setOpenState("closed");
  };

  const handleOpen = (info?: PanInfo) => {
    console.log("open");
    offset.set(getAnchorPosition("open"));
    setOpenState("open");
  };

  const handleFullscreen = (info?: PanInfo) => {
    console.log("fullscreen");
    offset.set(getAnchorPosition("fullscreen"));
    setOpenState("fullscreen");
  };

  const handlePanEnd = (_, info: PanInfo) => {
    currentDragOffset.set(0);

    if (
      openState === "closed" &&
      info.offset.y < 0 &&
      offset.get() > getAnchorPosition("open")
    )
      return handleOpen(info);
    if (
      openState === "closed" &&
      info.offset.y < 0 &&
      offset.get() < getAnchorPosition("open")
    )
      return handleFullscreen(info);
    if (openState === "closed" && info.offset.y > 0) return handleClose(info);

    if (
      openState === "open" &&
      info.offset.y > 0 &&
      info.offset.y >
        (getAnchorPosition("closed") - getAnchorPosition("open")) / 2
    )
      return handleClose(info);
    if (openState === "open" && info.offset.y > 0) return handleOpen(info);

    if (openState === "open" && info.offset.y < 0)
      return handleFullscreen(info);

    if (
      openState === "fullscreen" &&
      info.offset.y > 0 &&
      offset.get() > getAnchorPosition("fullscreen")
    )
      return handleOpen(info);
  };

  const handlePan = (_, info: PanInfo) => {
    currentDragOffset.set(info.offset.y);
  };

  const handleClick = () => {
    if (openState === "fullscreen") return handleOpen();
    if (openState === "open") return handleFullscreen();
    if (openState === "closed") return handleOpen();
  };

  return (
    <motion.div
      ref={rootRef}
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        y: offset,
        zIndex: 200,
        overflowY: openState === "fullscreen" ? "scroll" : "hidden",
        paddingBottom: 200, // long padding at the bottom of the root container so even an aggressive swipe-up on mobile won't reveal the content underneath (due to dragMomentum)
        backgroundColor: "#fff",
      }}
      className="rounded-t-2xl"
      drag="y"
      dragConstraints={{
        top:
          openState === "fullscreen"
            ? windowHeight - drawerContentHeight
            : openState === "open"
            ? getAnchorPosition("fullscreen")
            : getAnchorPosition("open"),
        bottom:
          openState === "fullscreen"
            ? getAnchorPosition("open")
            : getAnchorPosition("closed"),
      }}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      onDoubleClick={handleClick}
      dragElastic={{
        top: openState === "fullscreen" ? 0 : 0.8,
        bottom: openState === "fullscreen" ? 0 : 0.8,
      }}
      dragMomentum={
        openState === "fullscreen" &&
        offset.get() > getAnchorPosition("fullscreen")
          ? true
          : false
      }
    >
      <motion.div
        className="pb-8"
        ref={drawerContentRef}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: windowHeight,
        }}
      >
        <motion.div
          className="mb-2 ml-auto mr-auto mt-3 h-[7px] w-[56px] cursor-move rounded-lg bg-slate-400"
          style={{ opacity: drawerHandleOpacity }}
        />
        {children}
      </motion.div>
    </motion.div>
  );
};

export default BottomDrawer;
