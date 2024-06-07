function getCurrentDateTime(date = new Date()) {
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'short' });
    const year = date.getFullYear();

    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'p. m.' : 'a. m.';

    return `${day}. ${month} ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

function formatCoordinates(latitude, longitude) {
    const latDirection = latitude >= 0 ? 'N' : 'S';
    const lonDirection = longitude >= 0 ? 'E' : 'W';
    return `${Math.abs(latitude).toFixed(5)}${latDirection} ${Math.abs(longitude).toFixed(5)}${lonDirection}`;
}

function formatAddress(data) {
    const addressComponents = data.address;
    const street = addressComponents.road || '';
    const neighborhood = addressComponents.neighbourhood || '';
    const city = addressComponents.city || addressComponents.town || addressComponents.village || '';
    const province = addressComponents.state || addressComponents.region || '';

    return `${street}\n${neighborhood}\n${city}\n${province}`;
}

function updateCompleteAddress() {
    const dateTime = document.getElementById('datetime').value;
    const coordinates = document.getElementById('coordinates').value;
    const address = document.getElementById('address').value.split('\n').slice(3).join('\n'); // Remove previous datetime and coordinates

    const completeAddress = `${dateTime}\n${coordinates}\n${address}`;
    document.getElementById('address').value = completeAddress;
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const formattedCoordinates = formatCoordinates(latitude, longitude);
    document.getElementById('coordinates').value = formattedCoordinates;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la dirección');
            }
            return response.json();
        })
        .then(data => {
            const formattedAddress = formatAddress(data);
            const dateTime = document.getElementById('datetime').value;
            const completeAddress = `${dateTime}\n${formattedCoordinates}\n${formattedAddress}`;
            document.getElementById('address').value = completeAddress;
        })
        .catch(error => {
            document.getElementById('address').value = 'No se pudo obtener la dirección';
            console.error('Error:', error);
        });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Permiso denegado para obtener la ubicación.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("La información de ubicación no está disponible.");
            break;
        case error.TIMEOUT:
            alert("La solicitud para obtener la ubicación ha caducado.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Se ha producido un error desconocido.");
            break;
    }
}

function updateDateTime() {
    const inputDateTime = document.getElementById('edit-datetime').value;
    if (inputDateTime) {
        const date = new Date(inputDateTime);
        const formattedDateTime = getCurrentDateTime(date);
        document.getElementById('datetime').value = formattedDateTime;
        updateCompleteAddress();
    } else {
        alert('Por favor, ingrese una fecha y hora válidas.');
    }
}

function updateCoordinates() {
    const coordinatesInput = document.getElementById('edit-coordinates').value;
    const [latitude, longitude] = coordinatesInput.split(',').map(coord => parseFloat(coord.trim()));
    if (!isNaN(latitude) && !isNaN(longitude)) {
        const formattedCoordinates = formatCoordinates(latitude, longitude);
        document.getElementById('coordinates').value = formattedCoordinates;

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener la dirección');
                }
                return response.json();
            })
            .then(data => {
                const formattedAddress = formatAddress(data);
                const dateTime = document.getElementById('datetime').value;
                const completeAddress = `${dateTime}\n${formattedCoordinates}\n${formattedAddress}`;
                document.getElementById('address').value = completeAddress;
            })
            .catch(error => {
                document.getElementById('address').value = 'No se pudo obtener la dirección';
                console.error('Error:', error);
            });
    } else {
        alert('Por favor, ingrese coordenadas válidas.');
    }
}

function getCurrentData() {
    document.getElementById('datetime').value = getCurrentDateTime();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            maximumAge: 60000,
            timeout: 5000,
            enableHighAccuracy: true
        });
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    getCurrentData();
});
