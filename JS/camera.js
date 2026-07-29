
var Camera = {
    x: 0,
    y: 0,
    // Controle de la camera
    clampCamera: () => {
        Camera.x = Math.max(0, Math.min(Camera.x, config.mapSize[1] - Canvas.main.canvas.width / Canvas.scale));
        Camera.y = Math.max(0, Math.min(Camera.y, config.mapSize[0] - Canvas.main.canvas.height / Canvas.scale));
        Camera.updateSW();
    },
    updateSW: () => {
        Camera.lvl = Camera.viewUnd ? 'undgd' : 'gd';
        sendActionToWorker('CAMERA_UPDATE', {
            x: Camera.x, y: Camera.y, viewUnd: Camera.viewUnd,
            viewUnd: Camera.viewUnd, lvl: Camera.lvl
        });
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

            console.log(event.key, 'pressed, Camera at', { x: Camera.x, y: Camera.y });

            Camera.clampCamera();
        });

        let isPointerDown = false;
        let pointerStart = { x: 0, y: 0 };
        let cameraStart = { x: 0, y: 0 };

        const canvas = Canvas.main.canvas;
        const preventDefaultGesture = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        canvas.style.touchAction = 'none';
        canvas.style.userSelect = 'none';
        canvas.style.webkitUserSelect = 'none';
        canvas.style.webkitTouchCallout = 'none';

        canvas.addEventListener('pointerdown', (event) => {
            preventDefaultGesture(event);
            isPointerDown = true;
            pointerStart = { x: event.clientX, y: event.clientY };
            cameraStart = { x: Camera.x, y: Camera.y };
            canvas.setPointerCapture(event.pointerId);
        });

        canvas.addEventListener('pointermove', (event) => {
            if (!isPointerDown) return;
            preventDefaultGesture(event);
            const dx = event.clientX - pointerStart.x;
            const dy = event.clientY - pointerStart.y;
            Camera.x = cameraStart.x - dx / Canvas.scale;
            Camera.y = cameraStart.y - dy / Canvas.scale;
            Camera.clampCamera();
        });

        canvas.addEventListener('pointerup', (event) => {
            preventDefaultGesture(event);
            isPointerDown = false;
            canvas.releasePointerCapture(event.pointerId);
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * (canvas.width / rect.width);
            const y = (event.clientY - rect.top) * (canvas.height / rect.height);
            UI.click(x, y);
        });

        canvas.addEventListener('pointercancel', (event) => {
            preventDefaultGesture(event);
            isPointerDown = false;
            canvas.releasePointerCapture(event.pointerId);
        });


        Camera.clampCamera();
    }

}



var cameraJSLoaded = true;