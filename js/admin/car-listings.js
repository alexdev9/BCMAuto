import { api } from '../mock-api';
import { formatPrice } from '../utils';
export function setupCarListings() {
    const carListings = document.getElementById('carListings');
    const searchInput = document.getElementById('adminSearchInput');
    if (!carListings)
        return;
    let currentPage = 1;
    let searchTerm = '';
    async function renderCarListings() {
        if (!carListings)
            return;
        try {
            const response = await api.getCars({
                page: currentPage,
                limit: 10,
                search: searchTerm
            });
            carListings.innerHTML = response.data.map((car) => `
                <tr>
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <img class="h-10 w-10 rounded-full object-cover" 
                                 src="${car.images[0]}" 
                                 alt="${car.make} ${car.model}">
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">
                                    ${car.year} ${car.make} ${car.model}
                                </div>
                                <div class="text-sm text-gray-500">
                                    ${car.mileage.toLocaleString()} km
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        ${formatPrice(car.price)}
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <button onclick="deleteCar('${car.id}')" 
                                class="text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
            const paginationContainer = document.getElementById('adminPagination');
            if (paginationContainer) {
                paginationContainer.innerHTML = generatePaginationControls(response.page, response.totalPages);
            }
            if (response.data.length === 0) {
                carListings.innerHTML = `
                    <tr>
                        <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                            No cars found${searchTerm ? ` matching "${searchTerm}"` : ''}.
                        </td>
                    </tr>
                `;
            }
        }
        catch (error) {
            console.error('Error loading cars:', error);
            carListings.innerHTML = `
                <tr>
                    <td colspan="3" class="px-6 py-4 text-center text-red-500">
                        Error loading cars. Please try again later.
                    </td>
                </tr>
            `;
        }
    }
    function generatePaginationControls(currentPage, totalPages) {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(`
                <button 
                    onclick="changeAdminPage(${i})" 
                    class="px-3 py-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}"
                >
                    ${i}
                </button>
            `);
        }
        return pages.join('');
    }
    if (searchInput) {
        let debounceTimeout;
        searchInput.addEventListener('input', (e) => {
            const target = e.target;
            clearTimeout(debounceTimeout);
            debounceTimeout = window.setTimeout(() => {
                searchTerm = target.value;
                currentPage = 1;
                renderCarListings();
            }, 300);
        });
    }
    window.deleteCar = async (carId) => {
        if (confirm('Are you sure you want to delete this car?')) {
            await api.deleteCar(carId);
            renderCarListings();
        }
    };
    window.changeAdminPage = (page) => {
        currentPage = page;
        renderCarListings();
    };
    return {
        renderCarListings
    };
}
//# sourceMappingURL=car-listings.js.map