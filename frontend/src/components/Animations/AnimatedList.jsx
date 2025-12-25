//react
import { useRef, useState, useEffect, useContext } from "react";

//Library
import { motion, useInView } from "framer-motion";
import { AiOutlineClockCircle } from "react-icons/ai";
import { ThemeContext } from "../../context/ThemeContext";

const AnimatedItem = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3, delay }}
      className="transition-transform duration-300 ease-in-out"
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
  selectedIndex: controlledIndex, // <- receive selectedIndex from parent
}) => {
  const {theme} = useContext(ThemeContext);


  const listRef = useRef(null);
  const [internalIndex, setInternalIndex] = useState(initialSelectedIndex);
  const selectedIndex =
    typeof controlledIndex === "number" ? controlledIndex : internalIndex;

  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const maxVisibleItems = 5;
  const itemHeight = 70;

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setInternalIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setInternalIndex((prev) => Math.max(prev - 1, 0));
      } else if (
        e.key === "Enter" &&
        selectedIndex >= 0 &&
        selectedIndex < items.length
      ) {
        e.preventDefault();
        onItemSelect?.(items[selectedIndex], selectedIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (
        itemBottom >
        containerScrollTop + containerHeight - extraMargin
      ) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div
      className={`relative w-full max-w-[500px] rounded-xl shadow-lg bg-white ${className}`}
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen",
        color: "#222",
        minHeight: "350px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        ref={listRef}
        className={`py-3 px-5 space-y-3 rounded-xl border border-gray-200
          ${items.length > maxVisibleItems ? "overflow-y-auto" : ""}
          ${
            displayScrollbar
              ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-indigo-500 [&::-webkit-scrollbar-thumb]:rounded-full"
              : "scrollbar-hide"
          }`}
        style={{
          scrollbarWidth: displayScrollbar ? "thin" : "none",
          scrollbarColor: "#5a67d8 #f0f0f0",
          maxHeight:
            items.length > maxVisibleItems
              ? `${itemHeight * maxVisibleItems}px`
              : "auto",
          overflowY: items.length > maxVisibleItems ? "auto" : "visible",
          backgroundColor: "#fff",
        }}
        onScroll={handleScroll}
      >
        {items.map((item, index) => {
          const isActive = selectedIndex === index;
          return (
            <AnimatedItem
              key={index}
              delay={index * 0.05}
              index={index}
              onMouseEnter={() => setInternalIndex(index)}
              onClick={() => {
                setInternalIndex(index);
                onItemSelect?.(item, index);
              }}
            >
              <div
                className={`p-4 min-h-[60px] rounded-lg transition-transform duration-300 ease-in-out cursor-pointer text-base select-none
                  ${
                    isActive
                      ? "scale-[1.03] shadow-lg font-semibold"
                      : "hover:bg-gray-100 text-gray-800"
                  } ${itemClassName}`}
                style={{
                  border: "1px solid #e2e8f0",
                  userSelect: "none",
                  width: "100%",
                  background : isActive
                    ? `${theme.linearGradient}`
                    : "transparent",
                  color: isActive ? "#fff" : "#1a202c",
                }}
              >
                <div className="flex justify-between items-center w-full gap-3">
                  <p className="m-0 truncate text-base flex-grow min-w-0">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1 text-sm flex-shrink-0 whitespace-nowrap">
                    <AiOutlineClockCircle
                      className={isActive ? "text-white" : "text-gray-500"}
                    />
                    <span className={isActive ? "text-white" : "text-gray-500"}>
                      {item.duration}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedItem>
          );
        })}
      </div>

      {showGradients && items.length > maxVisibleItems && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] pointer-events-none transition-opacity duration-300 ease-in-out"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.95), transparent)",
              opacity: topGradientOpacity,
              zIndex: 20,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none transition-opacity duration-300 ease-in-out"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,0.95), transparent)",
              opacity: bottomGradientOpacity,
              zIndex: 20,
            }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedList;
