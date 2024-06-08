body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.camera-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 80px); /* Adjust height to fit the viewport minus some space for the button */
    overflow: hidden;
    margin-bottom: 20px;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.overlay {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.8em;
    text-align: right;
}

.camera-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#zoomSlider {
    margin-top: 10px;
    writing-mode: bt-lr; /* This makes the slider vertical */
    -webkit-appearance: slider-vertical; /* For Safari */
    width: 8px;
    height: 150px; /* Increase height for better control */
}

#zoomSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #007BFF;
    cursor: pointer;
    border-radius: 50%;
}

#zoomSlider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #007BFF;
    cursor: pointer;
    border-radius: 50%;
}

#takePhotoButton {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.2em;
    text-align: center;
    margin: 0 auto 20px auto;
}

#takePhotoButton:hover {
    background-color: #218838;
}

#takePhotoButton:active {
    background-color: #1e7e34;
}

.container {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card {
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    background-color: #fff;
}

.field-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.field {
    flex: 1;
    margin-right: 10px;
}

.field label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

.field input,
.field textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.field textarea {
    resize: none;
    height: auto;
}

.buttons {
    display: flex;
    justify-content: space-between;
}

button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    display: block;
    width: 48%;
    margin-bottom: 15px;
    transition: background-color 0.3s, transform 0.1s;
}

button:focus {
    outline: none;
    box-shadow: none;
}

button:hover {
    transform: scale(0.98);
}

button:active {
    transform: scale(0.96);
}

.btn-blue {
    background-color: #007BFF;
    color: white;
}

.btn-blue:hover {
    background-color: #0056b3;
}

.btn-blue:active {
    background-color: #004080;
}

.btn-red {
    background-color: #FF0000;
    color: white;
}

.btn-red:hover {
    background-color: #cc0000;
}

.btn-red:active {
    background-color: #990000;
}

.btn-green {
    background-color: #28a745;
    color: white;
    margin-top: 10px;
}

.btn-green:hover {
    background-color: #218838;
}

.btn-green:active {
    background-color: #1e7e34;
}

.btn-camera {
    background-color: transparent;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5em;
    margin: 5px;
}

.btn-camera:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

.btn-camera:active {
    background-color: rgba(255, 255, 255, 0.5);
}

.overlay-text {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.8em;
    text-align: right;
}

.photo-gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.photo-gallery img {
    width: 100%;
    height: 200px;
    object-fit: contain;
    border: 1px solid #ccc;
    border-radius: 5px;
}

@media (min-width: 768px) {
    .container {
        max-width: 600px;
        margin: 40px auto;
    }
}

