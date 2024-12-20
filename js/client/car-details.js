import { formatPrice } from '../utils';
let currentCar = null;
const carDetailsModal = document.getElementById('carDetailsModal');
function closeCarDetailsModal() {
    if (!carDetailsModal)
        return;
    carDetailsModal.classList.add('hidden');
    currentCar = null;
}
function openCarDetailsModal(car) {
    if (!carDetailsModal)
        return;
    currentCar = car;
    const title = document.getElementById('carDetailsTitle');
    const content = document.getElementById('carDetailsContent');
    if (title && content) {
        title.textContent = `${car.year} ${car.make} ${car.model}`;
        content.innerHTML = `
            <div class="relative h-96">
                <div class="image-carousel h-full" data-car-id="details-${car.id}" data-images='${JSON.stringify(car.images)}' data-current-index="0">
                    <img src="${car.images[0]}" alt="${car.make} ${car.model}" 
                         class="w-full h-full object-cover rounded-lg">
                    <button onclick="prevImage('details-${car.id}')" 
                            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button onclick="nextImage('details-${car.id}')" 
                            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="image-counter absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                        1/${car.images.length}
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-6 mt-6">
                <!-- Basic Information -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-4">Informazioni Base</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <span class="text-gray-600">Tipo Carrozzeria:</span>
                            <p class="font-medium">${car.bodyType}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Condizione:</span>
                            <p class="font-medium">${car.vehicleCondition}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Tipo Trazione:</span>
                            <p class="font-medium">${car.driveType}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Posti:</span>
                            <p class="font-medium">${car.seats}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Porte:</span>
                            <p class="font-medium">${car.doors}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Chilometraggio:</span>
                            <p class="font-medium">${car.mileage.toLocaleString()} km</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Prezzo:</span>
                            <p class="font-medium">${formatPrice(car.price)}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Numero Offerta:</span>
                            <p class="font-medium">${car.offerNumber}</p>
                        </div>
                    </div>
                </div>

                <!-- Technical Specifications -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-4">Specifiche Tecniche</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <span class="text-gray-600">Potenza:</span>
                            <p class="font-medium">${car.power.hp} CV (${car.power.kw} kW)</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Cilindrata:</span>
                            <p class="font-medium">${car.engineSize} cm³</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Trasmissione:</span>
                            <p class="font-medium">${car.transmission === 'automatic' ? 'Automatica' : 'Manuale'}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Marce:</span>
                            <p class="font-medium">${car.gears}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Cilindri:</span>
                            <p class="font-medium">${car.cylinders}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Peso:</span>
                            <p class="font-medium">${car.weight} kg</p>
                        </div>
                    </div>
                </div>

                <!-- Environmental Data -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-4">Dati Ambientali</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <span class="text-gray-600">Tipo Carburante:</span>
                            <p class="font-medium">${car.fuelType === 'petrol' ? 'Benzina' :
            car.fuelType === 'diesel' ? 'Diesel' :
                car.fuelType === 'electric' ? 'Elettrica' :
                    car.fuelType === 'hybrid' ? 'Ibrida' : car.fuelType}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Classe Emissioni:</span>
                            <p class="font-medium">${car.emissionClass}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Consumo Carburante:</span>
                            <p class="font-medium">${car.fuelConsumption} l/100km</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Emissioni CO₂:</span>
                            <p class="font-medium">${car.co2Emissions} g/km</p>
                        </div>
                    </div>
                </div>

                <!-- Equipment -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-4">Equipaggiamento</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Comfort</h4>
                            <ul class="list-disc list-inside space-y-1">
                                ${car.comfort.map(item => `<li class="text-gray-600">${item}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Intrattenimento</h4>
                            <ul class="list-disc list-inside space-y-1">
                                ${car.entertainment.map(item => `<li class="text-gray-600">${item}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Sicurezza</h4>
                            <ul class="list-disc list-inside space-y-1">
                                ${car.safety.map(item => `<li class="text-gray-600">${item}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Extra</h4>
                            <ul class="list-disc list-inside space-y-1">
                                ${car.extras.map(item => `<li class="text-gray-600">${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Color and Interior -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-4">Colore e Interni</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <span class="text-gray-600">Colore:</span>
                            <p class="font-medium">${car.color}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Colore Specifico:</span>
                            <p class="font-medium">${car.specificColor}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Tipo Vernice:</span>
                            <p class="font-medium">${car.paintType === 'Solid' ? 'Pastello' :
            car.paintType === 'Metallic' ? 'Metallizzato' :
                car.paintType === 'Pearl' ? 'Perlato' :
                    car.paintType === 'Matte' ? 'Opaco' : car.paintType}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Colore Interni:</span>
                            <p class="font-medium">${car.interiorColor}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Rivestimenti:</span>
                            <p class="font-medium">${car.upholstery === 'Fabric' ? 'Tessuto' :
            car.upholstery === 'Leather' ? 'Pelle' :
                car.upholstery === 'Full leather' ? 'Pelle totale' :
                    car.upholstery === 'Premium synthetic leather' ? 'Pelle sintetica premium' : car.upholstery}</p>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-4">Descrizione</h3>
                    <p class="text-gray-600">${car.description}</p>
                </div>

                <!-- Contact Button -->
                <button onclick="openContactModalFromDetails()" 
                        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Contatta per Quest'Auto
                </button>
            </div>
        `;
    }
    carDetailsModal.classList.remove('hidden');
}
function openContactModalFromDetails() {
    if (!currentCar)
        return;
    closeCarDetailsModal();
    window.openContactModal(currentCar.id);
}
export function setupCarDetails() {
    window.openCarDetailsModal = openCarDetailsModal;
    window.closeCarDetailsModal = closeCarDetailsModal;
    window.openContactModalFromDetails = openContactModalFromDetails;
    return {
        openCarDetailsModal,
        closeCarDetailsModal,
        openContactModalFromDetails
    };
}
//# sourceMappingURL=car-details.js.map