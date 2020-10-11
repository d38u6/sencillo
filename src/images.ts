import images from "./assets/images/*.jpg";

function createImage(src: string, alt: string): HTMLAnchorElement {
  const a = document.createElement("a");
  a.href = `game.html?images=${src.slice(1)}`;

  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;

  a.appendChild(img);

  return a;
}

function renderImages(parentEl: HTMLDivElement): void {
  (Object.entries(images) as [string, string][]).forEach(([alt, imageSrc]) => {
    const img = createImage(imageSrc, alt);
    parentEl.appendChild(img);
  });
}

renderImages(document.querySelector(".images") as HTMLDivElement);
