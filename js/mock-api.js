import { bmwM3, teslaModelS, porsche911, audiRsEtronGt, mercedesAmgGt, lamborghiniHuracan, ferrariF8, maseratiMc20, mclaren720s, astonMartinDb11, bentleyContinentalGt, rollsRoyceWraith } from './data';
const mockCars = [
    bmwM3,
    teslaModelS,
    porsche911,
    audiRsEtronGt,
    mercedesAmgGt,
    lamborghiniHuracan,
    ferrariF8,
    maseratiMc20,
    mclaren720s,
    astonMartinDb11,
    bentleyContinentalGt,
    rollsRoyceWraith
];
const mockContactRequests = [];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const api = {
    getCars: async (params = {}) => {
        const { page = 1, limit = 6, search = '', make, model, minYear, maxYear, minPrice, maxPrice, transmission, fuelType, bodyType, sortBy, sortDirection = 'asc' } = params;
        await delay(300);
        let filteredCars = [...mockCars];
        if (search) {
            const searchLower = search.toLowerCase();
            filteredCars = filteredCars.filter(car => car.make.toLowerCase().includes(searchLower) ||
                car.model.toLowerCase().includes(searchLower) ||
                car.bodyType.toLowerCase().includes(searchLower) ||
                car.fuelType.toLowerCase().includes(searchLower) ||
                car.year.toString().includes(searchLower));
        }
        if (make) {
            filteredCars = filteredCars.filter(car => car.make.toLowerCase() === make.toLowerCase());
        }
        if (model) {
            filteredCars = filteredCars.filter(car => car.model.toLowerCase() === model.toLowerCase());
        }
        if (minYear) {
            filteredCars = filteredCars.filter(car => car.year >= minYear);
        }
        if (maxYear) {
            filteredCars = filteredCars.filter(car => car.year <= maxYear);
        }
        if (minPrice) {
            filteredCars = filteredCars.filter(car => car.price >= minPrice);
        }
        if (maxPrice) {
            filteredCars = filteredCars.filter(car => car.price <= maxPrice);
        }
        if (transmission) {
            filteredCars = filteredCars.filter(car => car.transmission === transmission);
        }
        if (fuelType) {
            filteredCars = filteredCars.filter(car => car.fuelType === fuelType);
        }
        if (bodyType) {
            filteredCars = filteredCars.filter(car => car.bodyType.toLowerCase() === bodyType.toLowerCase());
        }
        if (sortBy) {
            filteredCars.sort((a, b) => {
                const aValue = a[sortBy];
                const bValue = b[sortBy];
                const multiplier = sortDirection === 'asc' ? 1 : -1;
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return (aValue - bValue) * multiplier;
                }
                return 0;
            });
        }
        const total = filteredCars.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedCars = filteredCars.slice(startIndex, endIndex);
        return {
            data: paginatedCars,
            total,
            page,
            totalPages
        };
    },
    addCar: async (car) => {
        await delay(300);
        const newCar = {
            ...car,
            id: crypto.randomUUID()
        };
        mockCars.push(newCar);
        return newCar;
    },
    deleteCar: async (id) => {
        await delay(300);
        const initialLength = mockCars.length;
        const index = mockCars.findIndex(car => car.id === id);
        if (index !== -1) {
            mockCars.splice(index, 1);
        }
        return initialLength > mockCars.length;
    },
    submitContactRequest: async (request) => {
        await delay(300);
        const newRequest = {
            ...request,
            timestamp: new Date()
        };
        mockContactRequests.push(newRequest);
        return newRequest;
    },
    getContactRequests: async () => {
        await delay(300);
        return [...mockContactRequests];
    }
};
//# sourceMappingURL=mock-api.js.map