export function updateCarouselImage(carousel, images, index) {
    if (!carousel)
        return;
    const img = carousel.querySelector('img');
    const counter = carousel.querySelector('.image-counter');
    if (img && counter) {
        img.src = images[index];
        counter.textContent = `${index + 1}/${images.length}`;
        carousel.setAttribute('data-current-index', index.toString());
    }
}
export function setupCarouselControls() {
    window.nextImage = (carId) => {
        const carousel = document.querySelector(`[data-car-id="${carId}"]`);
        const currentIndex = parseInt(carousel?.getAttribute('data-current-index') || '0');
        const images = JSON.parse(carousel?.getAttribute('data-images') || '[]');
        const newIndex = (currentIndex + 1) % images.length;
        updateCarouselImage(carousel, images, newIndex);
    };
    window.prevImage = (carId) => {
        const carousel = document.querySelector(`[data-car-id="${carId}"]`);
        const currentIndex = parseInt(carousel?.getAttribute('data-current-index') || '0');
        const images = JSON.parse(carousel?.getAttribute('data-images') || '[]');
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarouselImage(carousel, images, newIndex);
    };
}
//# sourceMappingURL=carousel.js.map