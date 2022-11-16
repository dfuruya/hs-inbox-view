import { useEffect } from "react";

export function useIntersectionObserver({ root, items }) {
  useEffect(() => {
    if (items?.length) {
      const options = {
        root,
        // rootMargin: "0px",
        threshold: 1.0,
      };

      const top = document.createElement("button");
      const bottom = document.createElement("button");

      top.classList.add("inbox-scroll", "scroll-to-bottom");
      bottom.classList.add("inbox-scroll", "scroll-to-top");

      const topText = document.createTextNode("top");
      const bottomText = document.createTextNode("bottom");

      top.appendChild(topText);
      bottom.appendChild(bottomText);

      top.addEventListener("click", () => console.log("to bottom"));
      bottom.addEventListener("click", () => console.log("to top"));

      root.appendChild(top);
      root.appendChild(bottom);

      const callback = (entries) => {
        for (let i = 0; i < entries.length; i++) {
          console.log(entries[i].target.innerText);
          console.log(entries[i].target === firstUser);
          console.log(entries[i].target === lastUser);
        }
      };

      const observer = new IntersectionObserver(callback, options);

      const firstUser = document.querySelector(".inbox-user:first-of-type");
      const lastUser = document.querySelector(".inbox-user:last-of-type");

      firstUser && observer.observe(firstUser);
      lastUser && observer.observe(lastUser);

      return () => {
        firstUser && observer.unobserve(firstUser);
        lastUser && observer.unobserve(lastUser);
      };
    }
  }, [items]);
}
