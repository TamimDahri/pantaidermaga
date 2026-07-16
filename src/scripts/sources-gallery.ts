document.querySelectorAll(".sources-carousel-wrap").forEach((wrapper) => {
  const scroller = wrapper.querySelector<HTMLElement>("[data-gallery]");
  const prev = wrapper.querySelector<HTMLButtonElement>(".gallery-prev");
  const next = wrapper.querySelector<HTMLButtonElement>(".gallery-next");

  if (!scroller) return;

  const scrollGallery = (direction: "prev" | "next") => {
    const amount = scroller.clientWidth * 0.85;

    scroller.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  prev?.addEventListener("click", () => scrollGallery("prev"));
  next?.addEventListener("click", () => scrollGallery("next"));
});

/* ===========================
   Gallery Lightbox
=========================== */

const lightbox = document.getElementById("gallery-lightbox");

const lightboxImg =
  document.getElementById("gallery-image") as HTMLImageElement;

const caption =
  document.getElementById("gallery-caption") as HTMLElement;

const closeBtn =
  document.getElementById("gallery-close") as HTMLButtonElement;

if (!lightbox || !lightboxImg || !caption || !closeBtn) {
  console.warn("Lightbox not found");
} else {

  document.querySelectorAll<HTMLImageElement>(".clickable-gallery img")
    .forEach((img) => {

      img.addEventListener("click", () => {

        lightbox?.classList.add("active");

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;

        caption.textContent = img.dataset.title || img.alt;

        document.body.style.overflow = "hidden";

      });

    });

  function closeGallery() {
    lightbox?.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeGallery);

  document
    .querySelector(".gallery-overlay")
    ?.addEventListener("click", closeGallery);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeGallery();
  });
}

document.addEventListener("DOMContentLoaded", () => {

  const articleLightbox = document.getElementById("article-lightbox");
  const articleImage = document.getElementById("article-image") as HTMLImageElement;
  const articleTitle = document.getElementById("article-title");
  const articleBody = document.getElementById("article-body");
  const articleClose = document.getElementById("article-close");

  if (
    !articleLightbox ||
    !articleImage ||
    !articleTitle ||
    !articleBody ||
    !articleClose
  ) return;

  document.querySelectorAll(".evidence-open").forEach((card) => {

    card.addEventListener("click", () => {

      const el = card as HTMLElement;

      articleImage.src = el.dataset.image || "";

      articleTitle.textContent = el.dataset.title || "";

      articleBody.innerHTML = "";

      const paragraphs = JSON.parse(el.dataset.content || "[]");

      paragraphs.forEach((text: string) => {

        const p = document.createElement("p");

        p.textContent = text;

        articleBody.appendChild(p);

      });

      articleLightbox!.classList.add("active");

      document.body.style.overflow = "hidden";

    });

  });

  function closeArticle() {

    articleLightbox!.classList.remove("active");

    document.body.style.overflow = "";

  }

  articleClose.addEventListener("click", closeArticle);

  articleLightbox.addEventListener("click", (e) => {

    if (e.target === articleLightbox) {

      closeArticle();

    }

  });

  document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

      closeArticle();

    }

  });

});

/* ==========================================
   Evidence Article Popup
========================================== */

const articleLightbox = document.getElementById("article-lightbox");
const articleImage = document.getElementById("article-image") as HTMLImageElement | null;
const articleTitle = document.getElementById("article-title");
const articleCategory = document.getElementById("article-category");
const articleContent = document.getElementById("article-content");
const articleClose = document.getElementById("article-close");
const articleOverlay = document.querySelector(".article-overlay");

document.querySelectorAll<HTMLElement>(".evidence-open").forEach((card) => {

  card.style.cursor = "pointer";

  card.addEventListener("click", () => {

    if (
      !articleLightbox ||
      !articleImage ||
      !articleTitle ||
      !articleCategory ||
      !articleContent
    ) return;

    articleImage.src = card.dataset.image || "";
    articleImage.alt = card.dataset.title || "";

    articleTitle.textContent = card.dataset.title || "";
    articleCategory.textContent = card.dataset.category || "";

    articleContent.innerHTML = "";

    try {

      const paragraphs = JSON.parse(card.dataset.content || "[]");

      paragraphs.forEach((text: string) => {

        const p = document.createElement("p");
        p.textContent = text;
        articleContent.appendChild(p);

      });

    } catch {

      articleContent.innerHTML =
        "<p>Artikel tidak dapat dipaparkan.</p>";

    }

    articleLightbox.classList.add("active");

    document.body.style.overflow = "hidden";

  });

});

function closeArticlePopup() {

  articleLightbox?.classList.remove("active");

  document.body.style.overflow = "";

}

articleClose?.addEventListener("click", closeArticlePopup);

articleOverlay?.addEventListener("click", closeArticlePopup);

document.addEventListener("keydown", (e) => {

  if (e.key === "Escape") {

    closeArticlePopup();

  }

});