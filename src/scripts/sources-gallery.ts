const scroller = document.querySelector<HTMLElement>("[data-sources-scroll]");
const prev = document.querySelector<HTMLButtonElement>(".gallery-prev");
const next = document.querySelector<HTMLButtonElement>(".gallery-next");

const scrollGallery = (direction: "prev" | "next") => {
  if (!scroller) return;

  const amount = scroller.clientWidth * 0.85;

  scroller.scrollBy({
    left: direction === "next" ? amount : -amount,
    behavior: "smooth",
  });
};

prev?.addEventListener("click", () => scrollGallery("prev"));
next?.addEventListener("click", () => scrollGallery("next"));