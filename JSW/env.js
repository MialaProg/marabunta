var Env = {
    create: (type, color, srcID, w, h) => {
        return { type, color,
            isEnv: true, srcID, w, h
        };
    },


    isEnv: (env) => {
        return env && env.isEnv;
    }
}