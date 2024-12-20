import { api } from '../mock-api';
export function setupContactForm() {
    const contactModal = document.getElementById('contactModal');
    const contactForm = document.getElementById('contactForm');
    const carIdInput = document.getElementById('carId');
    function openContactModal(carId) {
        if (!contactModal || !carIdInput)
            return;
        carIdInput.value = carId;
        contactModal.classList.remove('hidden');
    }
    function closeContactModal() {
        if (!contactModal)
            return;
        contactModal.classList.add('hidden');
        contactForm.reset();
    }
    window.openContactModal = openContactModal;
    window.closeContactModal = closeContactModal;
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const note = document.getElementById('note').value;
        const carId = carIdInput.value;
        if (!email && !phone) {
            alert('Please provide either an email or phone number');
            return;
        }
        const request = {
            carId,
            email: email || undefined,
            phone: phone || undefined,
            note
        };
        await api.submitContactRequest(request);
        alert('Thank you for your interest! We will contact you soon.');
        closeContactModal();
    });
    return {
        openContactModal,
        closeContactModal
    };
}
//# sourceMappingURL=contact.js.map