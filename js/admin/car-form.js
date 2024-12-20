import { api } from '../mock-api';
export function setupCarForm(onCarAdded) {
    const addCarForm = document.getElementById('addCarForm');
    if (!addCarForm)
        return;
    addCarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addCarForm);
        const imagesStr = formData.get('images');
        const images = imagesStr.split(',').map(url => url.trim());
        const comfort = formData.get('comfort').split(',').map(item => item.trim());
        const entertainment = formData.get('entertainment').split(',').map(item => item.trim());
        const safety = formData.get('safety').split(',').map(item => item.trim());
        const extras = formData.get('extras').split(',').map(item => item.trim());
        const car = {
            make: formData.get('make'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            price: parseInt(formData.get('price')),
            images,
            description: formData.get('description'),
            mileage: parseInt(formData.get('mileage')),
            transmission: formData.get('transmission'),
            fuelType: formData.get('fuelType'),
            bodyType: formData.get('bodyType'),
            vehicleCondition: formData.get('vehicleCondition'),
            driveType: formData.get('driveType'),
            seats: parseInt(formData.get('seats')),
            doors: parseInt(formData.get('doors')),
            offerNumber: crypto.randomUUID(),
            power: {
                kw: parseInt(formData.get('powerKw')),
                hp: parseInt(formData.get('powerHp'))
            },
            engineSize: parseInt(formData.get('engineSize')),
            gears: parseInt(formData.get('gears')),
            cylinders: parseInt(formData.get('cylinders')),
            weight: parseInt(formData.get('weight')),
            emissionClass: formData.get('emissionClass'),
            fuelConsumption: parseFloat(formData.get('fuelConsumption')),
            co2Emissions: parseInt(formData.get('co2Emissions')),
            comfort,
            entertainment,
            safety,
            extras,
            color: formData.get('color'),
            specificColor: formData.get('specificColor'),
            paintType: formData.get('paintType'),
            interiorColor: formData.get('interiorColor'),
            upholstery: formData.get('upholstery')
        };
        await api.addCar(car);
        addCarForm.reset();
        onCarAdded();
    });
}
//# sourceMappingURL=car-form.js.map