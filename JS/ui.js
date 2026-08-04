var UI = {
    buttons: [],
    popup: false,
    updateButtons: () => {
        const cv = Canvas.main.canvas;
        UI.buttons = [
            {
                draw: [Camera.viewUnd ? 'btnNoUnd' : 'btnUnd',
                cv.width - 60, cv.height - 60, 50, 50],
                action: () => {
                    console.log('Button clicked: Toggle viewUnd');
                    Camera.viewUnd = !Camera.viewUnd;
                    Camera.updateSW();
                    UI.updateButtons();
                }
            },
            {
                draw: ['btnProd', 10, cv.height - 60, 50, 50],
                action: () => {
                    UI.popup = true;
                    UI.updateButtons();
                }
            }
        ]
        if (UI.popup) UI.buttons.push(
            {
                draw: ['popup', 0, 0, cv.width, cv.height],
                drawf: (canvas) => {
                    if (UI.popup) {
                        canvas.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                        canvas.ctx.fillRect(0, 0, canvas.canvas.width,
                            canvas.canvas.height
                        );
                    }
                },
                action: () => {
                    UI.popup = false;
                    UI.updateButtons();
                }
            });
    },

    draw: () => {
        //for (let i = UI.buttons.length; i > 0; i--) {
        UI.buttons.forEach((btn) => {
            // const btn = UI.buttons[i - 1];
            if (btn.drawf) {
                btn.drawf(Canvas.main);
            } else if (btn.draw) {
                Assets.draw(Canvas.main, ...btn.draw);
            }
        }
        );
    },

    click: (x, y) => {
        // console.log('UI click at', { x, y });
        //UI.buttons.forEach((btn) => {
        for (let i = UI.buttons.length; i > 0; i--) {
            const btn = UI.buttons[i - 1];
            const [id, bx, by, bw, bh] = btn.draw;
            if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) {
                btn.action();
                return;
            }
        }
        //);
    }
};


var uiJSLoaded = true;