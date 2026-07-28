var UI = {
    buttons: [],
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
            }
        ]
    },

    draw: () => {
        UI.buttons.forEach((btn) => {
            Assets.draw(Canvas.main, ...btn.draw);
        });
    },

    click: (x, y) => {
        console.log('UI click at', { x, y });
        UI.buttons.forEach((btn) => {
            const [id, bx, by, bw, bh] = btn.draw;
            if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) {
                btn.action();
            }
        });
    }

    ,init: () => {UI.updateButtons();}
};


var uiJSLoaded = true;