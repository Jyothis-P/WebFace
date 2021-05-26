let model;
let statusElement = document.getElementById('status');

function log(text) {
    console.log(text);
    statusElement.innerText = text;
}

(function () {
    let canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        video = document.getElementById('webcam'),
        flip = document.getElementById('flipCamera'),
        differenceElement = document.getElementById('roi'),
        differenceContext = differenceElement.getContext('2d');

    let availableDevices = [],
        selectedDevice = 0,
        frames = 0,
        time = Date.now(),
        timeout;

    const subtraction = Subtraction();

    function setCamera(index) {

        let constraints = {
            video: { deviceId: { exact: availableDevices[index].id } },
            audio: false
        };
        log(availableDevices[index].name);

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
                video.srcObject = stream;
                video.play();
                let { width, height } = stream.getTracks()[0].getSettings();
                // video.width = width;
                // video.height = height;
                // canvas.width = width;
                console.log(`${width}x${height}`); // 640x480
                log(video.height);
            })
            .then()
            .catch(error => {
                console.error(error);
            });


    }

    video.addEventListener("loadedmetadata", function (e) {
        var width = this.videoWidth,
            height = this.videoHeight;
        video.width = width;
        video.height = height;
        canvas.width = width;
        canvas.height = height;
        differenceElement.style.top = (height * 2) + 'px';
        canvas.style.top = height + 'px';
        console.log(width, height)
    }, false);

    // enumerate devices and select the first camera (mostly the back one)
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
        for (var i = 0; i !== devices.length; ++i) {
            if (devices[i].kind === 'videoinput') {
                console.log('Camera found: ', devices[i].label || 'label not found', devices[i].deviceId || 'id no found');
                availableDevices.push({
                    id: devices[i].deviceId,
                    name: devices[i].label || 'label not found'
                })
            }
        }

        if (availableDevices.length > 0) {
            flip.disabled = false;
            flip.innerText = 'Flip'
            setCamera(selectedDevice);
        }
        console.log(availableDevices);
    });

    flip.addEventListener('click', () => {
        log('Flipping camera.')
        selectedDevice = (selectedDevice + 1) % availableDevices.length;
        console.log('Selected camera -> ', availableDevices[selectedDevice].name);

        model = false;

        setCamera(selectedDevice);
    })



    video.addEventListener('play', function () {
        draw();
    }, false);


    function draw() {
        context.drawImage(video, 0, 0);

        let difference = subtraction.subtractFrame();
        let newImageData = new ImageData(difference, canvas.width, canvas.height);

        differenceContext.putImageData(newImageData, 0, 0);
        frames++;
        let t = Date.now();
        if (t - time > 1000){
            log(frames - 1 +  ' fps');
            time = t;
            frames = 0;
        }
        requestAnimationFrame(draw);
    }
})();




