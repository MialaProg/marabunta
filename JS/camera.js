
var Camera = {
    x: 0,
    y: 0,
    // Controle de la camera
    clampCamera: () => {
        Camera.x = Math.max(0, Math.min(Camera.x, config.mapSize[1] - Canvas.main.canvas.width));
        Camera.y = Math.max(0, Math.min(Camera.y, config.mapSize[0] - Canvas.main.canvas.height));
        sendActionToWorker('CAMERA_UPDATE', { x: Camera.x, y: Camera.y });
    },
    init: () => {
        Object.assign(Camera, config.camera);

        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') {
                Camera.y -= Camera.speed;
            } else if (event.key === 'ArrowDown') {
                Camera.y += Camera.speed;
            } else if (event.key === 'ArrowLeft') {
                Camera.x -= Camera.speed;
            } else if (event.key === 'ArrowRight') {
                Camera.x += Camera.speed;
            } else {
                return;
            }

            Camera.clampCamera();
        });

        let isPointerDown = false;
        let pointerStart = { x: 0, y: 0 };
        let cameraStart = { x: 0, y: 0 };

        Canvas.main.canvas.addEventListener('pointerdown', (event) => {
            isPointerDown = true;
            pointerStart = { x: event.clientX, y: event.clientY };
            cameraStart = { x: Camera.x, y: Camera.y };
            Canvas.main.canvas.setPointerCapture(event.pointerId);
        });

        Canvas.main.canvas.addEventListener('pointermove', (event) => {
            if (!isPointerDown) return;
            const dx = event.clientX - pointerStart.x;
            const dy = event.clientY - pointerStart.y;
            Camera.x = cameraStart.x - dx;
            Camera.y = cameraStart.y - dy;
            Camera.clampCamera();
        });

        Canvas.main.canvas.addEventListener('pointerup', (event) => {
            isPointerDown = false;
            Canvas.main.canvas.releasePointerCapture(event.pointerId);
        });

        Canvas.main.canvas.addEventListener('pointercancel', (event) => {
            isPointerDown = false;
            Canvas.main.canvas.releasePointerCapture(event.pointerId);
        });
    }

}



var cameraJSLoaded = true;