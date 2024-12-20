import { api } from '../mock-api';
import { formatPrice } from '../utils';
import { setupCarouselControls } from './carousel';
import { setupContactForm } from './contact';
import { setupCarDetails } from './car-details';
function isSortField(value) {
    return ['price', 'year', 'mileage'].includes(value);
}
function getTransmissionValue(value) {
    if (['automatic', 'manual'].includes(value)) {
        return value;
    }
    return undefined;
}
function getFuelTypeValue(value) {
    if (['petrol', 'diesel', 'electric', 'hybrid'].includes(value)) {
        return value;
    }
    return undefined;
}
export async function initializeClient() {
    const carList = document.getElementById('carList');
    const searchInput = document.getElementById('searchInput');
    const filterToggle = document.getElementById('filterToggle');
    const filterPanel = document.getElementById('filterPanel');
    const sortField = document.getElementById('sortField');
    const sortDirection = document.getElementById('sortDirection');
    if (!carList)
        return;
    setupCarouselControls();
    setupContactForm();
    setupCarDetails();
    const loadingSentinel = document.createElement('div');
    loadingSentinel.className = 'loading-sentinel';
    loadingSentinel.style.height = '10px';
    loadingSentinel.style.marginTop = '20px';
    let filterState = {
        make: '',
        model: '',
        minYear: undefined,
        maxYear: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        transmission: undefined,
        fuelType: undefined
    };
    function showLoadingState() {
        const loadingTemplate = document.getElementById('loadingCardTemplate');
        if (!loadingTemplate || !carList)
            return;
        const existingPlaceholders = carList.querySelectorAll('.loading-card');
        existingPlaceholders.forEach(placeholder => placeholder.remove());
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) {
            const clone = loadingTemplate.content.cloneNode(true);
            fragment.appendChild(clone);
        }
        carList.appendChild(fragment);
    }
    function clearListContent() {
        if (!carList)
            return;
        const loadingCards = Array.from(carList.querySelectorAll('.loading-card'));
        carList.innerHTML = '';
        loadingCards.forEach(card => carList.appendChild(card.cloneNode(true)));
    }
    if (filterToggle && filterPanel) {
        filterToggle.addEventListener('click', () => {
            const isHidden = filterPanel.classList.contains('hidden');
            if (isHidden) {
                filterPanel.classList.remove('hidden');
                requestAnimationFrame(() => {
                    filterPanel.classList.add('opacity-100', 'translate-y-0');
                    filterPanel.classList.remove('opacity-0', '-translate-y-4');
                });
            }
            else {
                filterPanel.classList.add('opacity-0', '-translate-y-4');
                filterPanel.classList.remove('opacity-100', 'translate-y-0');
                setTimeout(() => {
                    filterPanel.classList.add('hidden');
                }, 300);
            }
        });
    }
    const setupFilterHandlers = () => {
        const makeInput = document.getElementById('makeFilter');
        const modelInput = document.getElementById('modelFilter');
        const minYearInput = document.getElementById('minYear');
        const maxYearInput = document.getElementById('maxYear');
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        const transmissionSelect = document.getElementById('transmissionFilter');
        const fuelTypeSelect = document.getElementById('fuelTypeFilter');
        const resetFiltersBtn = document.getElementById('resetFilters');
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                makeInput.value = '';
                modelInput.value = '';
                minYearInput.value = '';
                maxYearInput.value = '';
                minPriceInput.value = '';
                maxPriceInput.value = '';
                transmissionSelect.value = '';
                fuelTypeSelect.value = '';
                filterState = {
                    make: '',
                    model: '',
                    minYear: undefined,
                    maxYear: undefined,
                    minPrice: undefined,
                    maxPrice: undefined,
                    transmission: undefined,
                    fuelType: undefined
                };
                resetAndReload();
            });
        }
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                filterState = {
                    make: makeInput.value,
                    model: modelInput.value,
                    minYear: minYearInput.value ? parseInt(minYearInput.value) : undefined,
                    maxYear: maxYearInput.value ? parseInt(maxYearInput.value) : undefined,
                    minPrice: minPriceInput.value ? parseInt(minPriceInput.value) : undefined,
                    maxPrice: maxPriceInput.value ? parseInt(maxPriceInput.value) : undefined,
                    transmission: getTransmissionValue(transmissionSelect.value),
                    fuelType: getFuelTypeValue(fuelTypeSelect.value)
                };
                resetAndReload();
            });
        }
    };
    let currentPage = 1;
    let searchTerm = '';
    let isLoading = false;
    let hasMoreCars = true;
    function createCarCard(car) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-lg shadow-lg overflow-hidden car-card cursor-pointer transform transition-all duration-200 hover:scale-102 opacity-0';
        div.onclick = () => {
            window.openCarDetailsModal(car);
        };
        div.innerHTML = `
            <div class="relative">
                <div class="image-carousel" data-car-id="${car.id}" data-images='${JSON.stringify(car.images)}' data-current-index="0">
                    <img src="${car.images[0]}" alt="${car.make} ${car.model}" 
                         class="w-full h-48 object-cover transition-opacity duration-200">
                    <button onclick="prevImage('${car.id}'); event.stopPropagation();" 
                            class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button onclick="nextImage('${car.id}'); event.stopPropagation();" 
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="image-counter absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        1/${car.images.length}
                    </div>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-2">${car.year} ${car.make} ${car.model}</h3>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <i class="fas fa-car text-gray-500"></i>
                        <span class="ml-2">${car.bodyType}</span>
                    </div>
                    <div>
                        <i class="fas fa-tachometer-alt text-gray-500"></i>
                        <span class="ml-2">${car.mileage.toLocaleString()} km</span>
                    </div>
                    <div>
                        <i class="fas fa-gas-pump text-gray-500"></i>
                        <span class="ml-2">${car.fuelType === 'petrol' ? 'Benzina' :
            car.fuelType === 'diesel' ? 'Diesel' :
                car.fuelType === 'electric' ? 'Elettrica' :
                    car.fuelType === 'hybrid' ? 'Ibrida' : car.fuelType}</span>
                    </div>
                    <div>
                        <i class="fas fa-cog text-gray-500"></i>
                        <span class="ml-2">${car.transmission === 'automatic' ? 'Automatica' : 'Manuale'}</span>
                    </div>
                    <div>
                        <i class="fas fa-horse text-gray-500"></i>
                        <span class="ml-2">${car.power.hp} CV (${car.power.kw} kW)</span>
                    </div>
                    <div>
                        <i class="fas fa-tag text-gray-500"></i>
                        <span class="ml-2">${formatPrice(car.price)}</span>
                    </div>
                </div>
                <button onclick="event.stopPropagation(); openContactModal('${car.id}')" 
                        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200">
                    Contatta per Quest'Auto
                </button>
            </div>
        `;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                div.style.opacity = '1';
            });
        });
        return div;
    }
    async function loadMoreCars() {
        if (!carList || isLoading || !hasMoreCars)
            return;
        isLoading = true;
        loadingSentinel.remove();
        if (currentPage === 1) {
            showLoadingState();
        }
        try {
            const sortFieldValue = sortField?.value;
            const response = await api.getCars({
                page: currentPage,
                limit: 3,
                search: searchTerm,
                ...filterState,
                sortBy: sortFieldValue && isSortField(sortFieldValue) ? sortFieldValue : undefined,
                sortDirection: sortDirection?.value
            });
            const fragment = document.createDocumentFragment();
            response.data.forEach(car => {
                const cardElement = createCarCard(car);
                fragment.appendChild(cardElement);
            });
            const loadingCards = carList.querySelectorAll('.loading-card');
            loadingCards.forEach(card => card.remove());
            carList.appendChild(fragment);
            currentPage++;
            hasMoreCars = currentPage <= response.totalPages;
            if (hasMoreCars) {
                carList.appendChild(loadingSentinel);
            }
            if (response.data.length === 0 && currentPage === 1) {
                carList.innerHTML = `
                    <div class="col-span-3 text-center py-8 animate-fade-in">
                        <p class="text-gray-500">Nessuna auto trovata${searchTerm ? ` corrispondente a "${searchTerm}"` : ''}.</p>
                    </div>
                `;
            }
        }
        catch (error) {
            console.error('Error loading cars:', error);
            if (currentPage === 1) {
                carList.innerHTML = `
                    <div class="col-span-3 text-center py-8 animate-fade-in">
                        <p class="text-red-500">Errore nel caricamento delle auto. Riprova più tardi.</p>
                    </div>
                `;
            }
        }
        finally {
            isLoading = false;
        }
    }
    function resetAndReload() {
        currentPage = 1;
        hasMoreCars = true;
        isLoading = false;
        clearListContent();
        loadMoreCars();
    }
    const observerOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && hasMoreCars) {
                loadMoreCars();
            }
        });
    }, observerOptions);
    observer.observe(loadingSentinel);
    if (searchInput) {
        let debounceTimeout;
        searchInput.addEventListener('input', (e) => {
            const target = e.target;
            clearTimeout(debounceTimeout);
            debounceTimeout = window.setTimeout(() => {
                if (target.value === searchTerm)
                    return;
                searchTerm = target.value;
                resetAndReload();
            }, 150);
        });
    }
    if (sortField && sortDirection) {
        sortField.addEventListener('change', resetAndReload);
        sortDirection.addEventListener('change', resetAndReload);
    }
    setupFilterHandlers();
    showLoadingState();
    await loadMoreCars();
}
//# sourceMappingURL=index.js.map