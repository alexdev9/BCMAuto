import { setupCarForm } from './car-form';
import { setupCarListings } from './car-listings';
export function initializeAdmin() {
    const carListings = setupCarListings();
    if (!carListings)
        return;
    setupCarForm(() => {
        carListings.renderCarListings();
    });
    carListings.renderCarListings();
}
//# sourceMappingURL=index.js.map