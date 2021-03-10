let model;

(function () {
    let canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        video = document.getElementById('webcam');

    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    navigator.getMedia({
            video: true,
            audio: false
        }, function (stream) {
            video.srcObject = stream;
            video.play();
        }, function (error) {
            //error.code
        }
    );

    video.addEventListener('play', function () {
        draw(this, context, 640, 480);
    }, false);

    async function draw(video, context, width, height) {
        // context.drawImage(video, 0, 0, width / 2, height / 2);

        if (!model) {
            console.log('Loading Model...')
            model = await blazeface.load();
            console.log('Done.')
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
                context.strokeStyle="green";
                context.lineWidth = "4";
                context.rect(start[0], start[1],size[0], size[1]);
                context.stroke();
            }
        }

        setTimeout(draw, 100, video, context, width, height);
    }
})();




