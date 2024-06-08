let initialDateTime = '';
let initialCoordinates = '';
let videoStream = null;
const photos = [];

// Open IndexedDB
let db;
const request = indexedDB.open('photoDB', 1);

request.onerror = function(event) {
    console.error('Database error:', event.target.error);
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadPhotosFromDB();
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('base64', 'base64', { unique: false });
};

function savePhotoToDB(photo) {
    const transaction = db.transaction(['photos'], 'readwrite');
    const objectStore = transaction.objectStore('photos');
    const request = objectStore.add({ base64: photo });

    request.onsuccess = function() {
        console.log('Photo saved to DB');
    };

    request.onerror = function(event) {
        console.error('Error saving photo to DB:', event.target.error);
    };
}

function loadPhotosFromDB() {
    const transaction = db.transaction(['photos'], 'readonly');
    const objectStore = transaction.objectStore('photos');
    const request = objectStore.openCursor();

    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            displayPhoto(cursor.value.base64);
            cursor.continue();
        }
    };

    request.onerror = function(event) {
        console.error('Error loading photos from DB:', event.target.error);
    };
}

function deletePhotoFromDB(id) {
    const transaction = db.transaction(['photos'], 'readwrite');
    const objectStore = transaction.objectStore('photos');
    const request = objectStore.delete(id);

    request.onsuccess = function() {
        console.log('Photo deleted from DB');
    };

    request.onerror = function(event) {
        console.error('Error deleting photo from DB:', event.target.error);
    };
}

function displayPhoto(photo) {
    const img = document.createElement('img');
    img.src = photo;
    img.className = 'thumbnail';
    img.style.objectFit = 'contain';
    document.getElementById('photoGallery').appendChild(img);
    photos.push(photo);
}

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
    const parts = [
        addressComponents.road || '',
        addressComponents.neighbourhood || '',
        addressComponents.city || addressComponents.town || addressComponents.village || '',
        addressComponents.state || addressComponents.region || ''
    ];

    return parts.filter(part => part.trim() !== '').join('\n');
}

function updateCompleteAddress() {
    const dateTime = document.getElementById('datetime').value;
    const coordinates = document.getElementById('coordinates').value;
    const address = document.getElementById('address').value;
    const group = document.getElementById('group').value.trim();
    const contractor = document.getElementById('contractor').value.trim();

    const lines = address.split('\n').filter(line => !line.startsWith('PRO-') && !line.startsWith('PROCISA'));
    const addressLines = lines.slice(2).filter(line => line.trim() !== '');
    const updatedAddress = `${dateTime}\n${coordinates}\n${addressLines.join('\n')}\n${group}\n${contractor}`;

    document.getElementById('address').value = updatedAddress;
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const formattedCoordinates = formatCoordinates(latitude, longitude);
    document.getElementById('coordinates').value = formattedCoordinates;
    initialCoordinates = formattedCoordinates;

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
            const group = document.getElementById('group').value.trim();
            const contractor = document.getElementById('contractor').value.trim();
            const completeAddress = `${dateTime}\n${formattedCoordinates}\n${formattedAddress}\n${group}\n${contractor}`;
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
        return true;
    }
    return false;
}

function updateCoordinates() {
    const coordinatesInput = document.getElementById('edit-coordinates').value;
    if (coordinatesInput) {
        const [latitude, longitude] = coordinatesInput.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(latitude) && !isNaN(longitude)) {
            const formattedCoordinates = formatCoordinates(latitude, longitude);
            document.getElementById('coordinates').value = formattedCoordinates;
            return true;
        } else {
            alert('Por favor, ingrese coordenadas válidas.');
            return false;
        }
    }
    return false;
}

function updateGroupAndContractor() {
    const group = document.getElementById('group').value.trim();
    const contractor = document.getElementById('contractor').value.trim();
    return { group, contractor };
}

function getCurrentData() {
    const currentDateTime = getCurrentDateTime();
    document.getElementById('datetime').value = currentDateTime;
    initialDateTime = currentDateTime;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            maximumAge: 60000,
            timeout: 5000,
            enableHighAccuracy: true
        });
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }

    document.getElementById('edit-datetime').value = '';
    document.getElementById('edit-coordinates').value = '';
}

function applyUpdates() {
    let updated = false;

    const currentDateTime = document.getElementById('datetime').value;
    const currentCoordinates = document.getElementById('coordinates').value;

    const isDateTimeUpdated = updateDateTime();
    if (isDateTimeUpdated || currentDateTime !== initialDateTime) updated = true;

    const isCoordinatesUpdated = updateCoordinates();
    if (isCoordinatesUpdated || currentCoordinates !== initialCoordinates) updated = true;

    const { group, contractor } = updateGroupAndContractor();
    if (group !== "PRO-01" || contractor !== "PROCISA") updated = true;

    if (updated) {
        updateCompleteAddress();
    }
}

function startCamera() {
    const video = document.getElementById('camera');

    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { exact: "environment" }
        }
    })
    .then(stream => {
        videoStream = stream;
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing the camera:', error);
    });
}

function toggleFlash() {
    const track = videoStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    if (capabilities.torch) {
        track.applyConstraints({
            advanced: [{ torch: !track.getSettings().torch }]
        });
    } else {
        alert("El flash no es compatible con esta cámara.");
    }
}

function focusCamera() {
    const track = videoStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    if (capabilities.focusMode) {
        track.applyConstraints({
            advanced: [{ focusMode: "continuous" }]
        });
    } else {
        alert("El enfoque no es compatible con esta cámara.");
    }
}

function applyZoom() {
    const track = videoStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    const zoomSlider = document.getElementById('zoomSlider');
    if (capabilities.zoom) {
        const zoomLevel = zoomSlider.value;
        track.applyConstraints({
            advanced: [{ zoom: zoomLevel }]
        });
    } else {
        alert("El zoom no es compatible con esta cámara.");
    }
}

function takePhoto() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('photoCanvas');
    const overlayText = document.getElementById('address').value;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    context.font = '16px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'right';
    const lines = overlayText.split('\n');
    let y = canvas.height - 20;
    lines.reverse().forEach(line => {
        context.fillText(line, canvas.width - 10, y);
        y -= 20;
    });

    const dataUrl = canvas.toDataURL('image/png');
    savePhotoToDB(dataUrl);
    displayPhoto(dataUrl);
}

document.addEventListener('DOMContentLoaded', (event) => {
    getCurrentData();
    startCamera();
});
