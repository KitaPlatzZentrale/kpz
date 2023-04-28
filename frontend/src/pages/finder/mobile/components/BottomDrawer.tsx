import React from "react";
import {
  useSpring,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  PanInfo,
  useMotionValueEvent,
} from "framer-motion";

type BottomDrawerProps = {
  maxRestHeight: number;
};

const DEFAULT_VISIBLE_PART_HEIGHT = 75;

const useDragAndScroll = (maxTopPosition) => {
  const y = useMotionValue(0);
  const elementRef = React.useRef<HTMLDivElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const clampedY = useTransform(y, (value) =>
    Math.min(Math.max(value, -maxTopPosition), 0)
  );

  React.useEffect(() => {
    const element = elementRef.current;
    const container = containerRef.current;

    if (!element || !container) {
      return;
    }

    const handleScroll = (e) => {
      if (clampedY.get() <= 0) {
        y.set(y.get() - e.deltaY);
      }
    };

    container.addEventListener("wheel", handleScroll);

    return () => {
      container.removeEventListener("wheel", handleScroll);
    };
  }, [y, clampedY, maxTopPosition]);

  return { y: clampedY, elementRef, containerRef };
};

const BottomDrawer: React.FC<BottomDrawerProps> = ({ maxRestHeight = 400 }) => {
  // build a drawer with framer-motion that works like the Airbnb mobile drawer
  // in default position, the drawer is closed and only the top part is visible (56px as defined above)
  // when the user drags the drawer up, the drawer opens is as big as defined by maxRestHeight (usually half of the screen height)
  // when the user drags the drawer down, the drawer closes and only the top part is visible again
  // the drawer should be at the bottom of the screen and be full-width with white background

  const [isOpen, setIsOpen] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const drawerContentRef = React.useRef<HTMLDivElement | null>(null);

  const screenHeight = window.innerHeight;

  const spring = useSpring(screenHeight - DEFAULT_VISIBLE_PART_HEIGHT, {
    stiffness: 300,
    damping: 60,
  });

  const { scrollY } = useScroll({
    container: rootRef,
    axis: "y",
  });

  /*const clampedY = useTransform(spring, (value) =>
    Math.min(
      Math.max(value, screenHeight - maxRestHeight),
      screenHeight - DEFAULT_VISIBLE_PART_HEIGHT
    )
  );*/

  /*useMotionValueEvent(scrollY, "change", () => {
    console.log("scrollY", scrollY.get());
    spring.set(screenHeight - DEFAULT_VISIBLE_PART_HEIGHT - scrollY.get());
  });*/

  const handleOpen = (info?: PanInfo) => {
    console.log("open");
    spring.set(screenHeight - maxRestHeight);
    setIsOpen(true);
  };

  const handleClose = (info?: PanInfo) => {
    console.log("close");
    spring.set(screenHeight - DEFAULT_VISIBLE_PART_HEIGHT);
    setIsOpen(false);
  };

  const handleDrag = (_, info: PanInfo) => {
    console.log(info.offset.y);
    console.log(spring);
    console.log(isOpen);

    // if not drawn down to half of the size, dont close the drawer and reset back to open
    if (isOpen && info.offset.y > maxRestHeight / 2) return handleClose(info);

    if (!isOpen && info.offset.y < 0) return handleOpen(info);
  };

  const handleClick = () => {
    if (isOpen) return handleClose();
    if (!isOpen) return handleOpen();
  };

  return (
    <motion.div
      ref={rootRef}
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        y: spring,
        zIndex: 500,
        overflowY: isOpen ? "scroll" : "hidden",
      }}
      drag="y"
      dragConstraints={{
        top: screenHeight - maxRestHeight,
        bottom: screenHeight - DEFAULT_VISIBLE_PART_HEIGHT,
      }}
      onPanEnd={handleDrag}
      onDoubleClick={handleClick}
      dragElastic={0.8}
      dragMomentum={false}
    >
      <motion.div
        ref={drawerContentRef}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          height: "100%",
        }}
      >
        <motion.div className="mb-2 ml-auto mr-auto mt-3 h-[7px] w-[56px] cursor-move rounded-lg bg-slate-200" />
        <div className="mt-3 flex h-fit w-full justify-center px-8 font-semibold">
          Starten Sie Ihre Suche
        </div>
        <div className="mt-3 flex w-full flex-col gap-3 px-10">
          {Array.from({ length: 30 }).map((_, index) => {
            return (
              <div className="h-[300px] w-full animate-pulse bg-slate-200"></div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BottomDrawer;
