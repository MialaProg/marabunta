
var Camera = {
    x: 0,
    y: 0,
    speed = 40,
    // Controle de la camera
    clampCamera: () => {
        Camera.x = Math.max(0, Math.min(Camera.x, globalMapCanvas.width - mainCanvas.width));
        Camera.y = Math.max(0, Math.min(Camera.y, globalMapCanvas.height - mainCanvas.height));
        worker.postMessage({ type: 'CAMERA_UPDATE', camera: Camera });
    },
    init: () => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') {
                Camera.y -= cameraMoveSpeed;
            } else if (event.key === 'ArrowDown') {
                Camera.y += cameraMoveSpeed;
            } else if (event.key === 'ArrowLeft') {
                Camera.x -= cameraMoveSpeed;
            } else if (event.key === 'ArrowRight') {
                Camera.x += cameraMoveSpeed;
            } else {
                return;
            }

            clampCamera();
            if (Grid) renderGame(Grid);
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
            clampCamera();
            if (Grid) renderGame(Grid);
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