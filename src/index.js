import React from "react";
import ReactDOM from "react-dom";
import {
  useEffect,
  useState,
  useRef,
  useReducer,
  useContext,
  useCallback,
  useMemo,
  useLayoutEffect,
  useMutationEffect
} from "react";
import { EventEmitter } from "events";
import { createStore } from "redux";
import "./styles.css";

function useWindowScrollHook() {
  let [currentXY, setXY] = useState([window.scrollX, window.scrollY]);

  let [currentWindowX, currentWindowY] = currentXY;

  let cb = useCallback(event => setXY([window.scrollX, window.scrollY]));

  useEffect(
    () => {
      window.addEventListener("scroll", cb);
      return () => window.removeEventListener("scroll", cb);
    },
    [currentWindowX, currentWindowY]
  );

  return currentXY;
}

function useHasReachedElementHook(ref) {
  let [hasReachedElement, setHasReachedElement] = useState(false);
  let [intersectionObserver] = useState(() => {
    var options = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.2, 0.8, 1]
    };

    function callback(data) {
      data.forEach(function(entry) {
        if (entry.isIntersecting) {
          setHasReachedElement(true);
        } else {
          setHasReachedElement(false);
        }
      });
    }
    return new IntersectionObserver(callback, options);
  });

  useEffect(
    () => {
      intersectionObserver.observe(ref.current);
      return () => {
        intersectionObserver.disconnect();
      };
    },
    [intersectionObserver, ref.current]
  );
  return hasReachedElement;
}

function ElementReachedTrasitionComponent(props) {
  let ref = useRef();
  let hasReachedElement = useHasReachedElementHook(ref);

  return (
    <div
      className={hasReachedElement ? props.reached : props.beforeReach}
      ref={ref}
    >
      {props.children}
    </div>
  );
}

function App() {
  return (
    <div>
      {Array(10)
        .fill(0)
        .map((i, _indx) => {
          return (
            <ElementReachedTrasitionComponent
              key={_indx}
              beforeReach={"left"}
              reached={"original"}
            >
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </ElementReachedTrasitionComponent>
          );
        })}
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
