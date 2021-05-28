const Subtraction = (canvas) => (function () {
    let previousImageData = false,
        context = canvas.getContext('2d');

    function getFrameDifference(data, previousData) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] -= previousData[i];
            data[i + 1] -= previousData[i + 1];
            data[i + 2] -= previousData[i + 2];
        }
        return data;
    }

    return {
        subtractFrame: () => {
            let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            if (!previousImageData) {
                console.log('no');
                previousImageData = imageData;
                return imageData.data;
            }
            let diff = context.getImageData(0, 0, canvas.width, canvas.height);
            diff.data = getFrameDifference(diff.data, previousImageData.data);
            previousImageData = imageData;
            return diff.data
        }
    }
})(canvas);






