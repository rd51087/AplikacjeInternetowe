var map = L.map('map').setView([53.44, 14.54], 11);
L.tileLayer('https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=8W1Jk94dT6ExX9ZKfXJQ', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 19,
}).addTo(map);

let marker;
function getLocation() {
    map.locate({setView: true, maxZoom: 18});
    map.on('locationfound', function (ev) {
        marker = L.marker(ev.latlng).addTo(map);
        map.flyTo(ev.latlng, 18);
        document.getElementById("w").value = ev.latlng.lat;
        document.getElementById("h").value = ev.latlng.lng;
    })
    document.getElementById("location").disabled = true;
}
function doImage(){
    map.zoomControl.remove()
    leafletImage(map, function(err, canvas){
        var img = document.createElement("img")
        var dims = map.getSize()
        img.id = "image"
        img.width = dims.x
        img.height = dims.y
        img.src = canvas.toDataURL()
        document.getElementById("map").style.display = "none"
        var res = document.getElementById("result")
        res.style.width = "auto"
        res.style.height = "auto"
        res.style.float = "left"
        res.style.marginLeft = "40px"
        res.appendChild(img)
        document.getElementById("raster").disabled = true;
        document.getElementById("puzzle").disabled = false;
    })
}
function makePuzzle(){
    var image = document.getElementById("image")
    var imagePieces = [];
    var pieceWidth = image.width/4
    var pieceHeight = image.height/4
    var count = 0
    for(var x = 0; x < 4; ++x) {
        for(var y = 0; y < 4; ++y) {
            var canvas = document.createElement('canvas');
            canvas.width = pieceWidth
            canvas.height = pieceHeight
            var context = canvas.getContext('2d');
            context.drawImage(image, x * pieceWidth, y * pieceHeight, pieceWidth,
                pieceHeight, 0, 0, canvas.width, canvas.height);
            imagePieces.push(canvas.toDataURL());
        }
    }
    for (var i = 0; i < 16; i++){
        var img = document.createElement("img")
        img.src = imagePieces[i]
        img.style.position = "absolute"
        img.draggable = true
        img.className = "draggable"
        img.id = i.toString()
        document.getElementById('mixp').children[i].innerHTML = ''
        document.getElementById('mixp').children[i].appendChild(img)
    }
    const grid = document.querySelector('#mixp')
    for(let i = 16; i >= 0; i--) {
        grid.appendChild(grid.children[Math.random() * i | 0]);
    }
    document.getElementById("puzzle").disabled = true;

    const draggables = document.querySelectorAll('.draggable')
    const containers = document.querySelectorAll('.sp')
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging')
        })
    })
    draggables.forEach(draggable => {
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
    })
    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault()
            const draggable = document.querySelector('.dragging')
            container.appendChild(draggable)
        })
    })

    var points = 0
    containers.forEach(container => {
        container.addEventListener('drop', () => {
            if(container.id === container.children[0].id){
                points++
            }
            if(isSolution(points)){
                alert("Congratulations! The map has been arranged correctly!")
            }
        })
    })

}

function isSolution(points) {
    console.log("Congratulations! The map has been arranged correctly!");
    return (points===16) ? true : false
}
Notification.requestPermission().then((result) => {
    console.log(result);
});
