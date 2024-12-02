// Инициализация карты
const map = L.map('map').setView([51.505, -0.09], 5);

// Добавление карты OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Обработка кликов по карте
map.on('click', async (e) => {
    const { lat, lng } = e.latlng;

    // Удаление предыдущих маркеров
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Отправка запроса на сервер
    const response = await fetch('/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lon: lng }),
    });

    const data = await response.json();
    if (data.error) {
        alert(data.error);
    } else {
        const { name, main, weather } = data;
        const description = weather[0].description;
        const temp = main.temp;

        // Добавление маркера на карту
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${name}</b><br>${description}<br>Температура: ${temp}°C`)
            .openPopup();
    }
});
