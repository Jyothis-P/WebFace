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
        flip = document.getElementById('flipCamera');

    let availableDevices = [],
        selectedDevice = 0,
        timeout;

    function setCamera(index) {

        let constraints = {
            video: {deviceId: {exact: availableDevices[index].id}},
            audio: false
        };
        log(availableDevices[index].name);

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
                video.srcObject = stream;
                video.play();
                let {width, height} = stream.getTracks()[0].getSettings();
                video.width = width;
                video.height = height;
                canvas.width = width;
                canvas.height = height;
                console.log(`${width}x${height}`); // 640x480
            })
            .then()
            .catch(error => {
                console.error(error);
            });
    }

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

        // Clear the timeout so that the old video element isn't passed to tfjs.
        clearTimeout(timeout);
        model = false;

        setCamera(selectedDevice);
    })

    // navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    //
    // navigator.getMedia({
    //         video: true,
    //         audio: false
    //     }, function (stream) {
    //         video.srcObject = stream;
    //         video.play();
    //     }, function (error) {
    //         //error.code
    //     }
    // );


    video.addEventListener('play', function () {
        draw(this, context, 640, 480);
    }, false);

    async function draw(video, context, width, height) {
        if (!model) {
            log('Loading Model...')
            model = await blazeface.load();
            log('Done.')
        }

        const returnTensors = false;
        const predictions = await model.estimateFaces(video, returnTensors);

        // Clear the canvas before drawing new boxes.
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (predictions.length > 0) {
            for (const prediction of predictions) {

                const start = prediction.topLeft;
                const end = prediction.bottomRight;
                let confidence = prediction.probability;

                const size = [end[0] - start[0], end[1] - start[1]];

                // Render a rectangle over each detected face.
                context.beginPath();
                context.strokeStyle = "green";
                context.lineWidth = "4";
                context.rect(start[0], start[1], size[0], size[1]);
                context.stroke();
            }
        }

        timeout = setTimeout(draw, 100, video, context, width, height);
    }
})();




