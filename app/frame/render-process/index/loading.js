let loading = null;

/**
 *
 * @type {{show: ((p1?:*)), hide: (())}}
 */
module.exports = {
    show: (text = "Loading...") => {
        if (loading) loading.remove();
        loading = document.createElement("div");
        loading.innerHTML =
            `<div>` +
            `<div style="position: absolute;top: 0; left: 0; height: 100%; width: 100%; background-color: #dddddd; opacity: 0.8; z-index: 998;"></div>` +
            `<div style="position: absolute;top: 50%; left: 50%; -ms-transform: translate(-50%,-50%); -moz-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);z-index: 999;">` +
            `<div style="font-size: 20px; font-weight: 400; padding: 20px;">${text}</div>` +
            `</div>` +
            `</div>`;
        document.body.appendChild(loading);
    },
    hide: () => {
        loading && loading.remove();
    }
};