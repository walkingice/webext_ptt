(() => {
    const OPTIONS_AUTO_ENABLED = 'enabled_auto_forward';
    const OPTIONS_FORWARD_DELAY = 'auto_forward_delay';
    const DEFAULT_DELAY = 5;

    let checkbox = document.getElementById('checkbox_auto_forward');
    let delay = document.getElementById('auto_forward_wait');

    browser.storage.local.get(OPTIONS_AUTO_ENABLED).then((r) => {
        checkbox.checked = !!r[OPTIONS_AUTO_ENABLED];

        checkbox.addEventListener('change', () => {
            var obj = {};
            obj[OPTIONS_AUTO_ENABLED] = checkbox.checked;
            browser.storage.local.set(obj);

            delay.disabled = !checkbox.checked;
        });
    });

    browser.storage.local.get(OPTIONS_FORWARD_DELAY).then((r) => {
        delay.value = r.hasOwnProperty(OPTIONS_FORWARD_DELAY) ? r[OPTIONS_FORWARD_DELAY] : DEFAULT_DELAY;

        delay.addEventListener('change', () => {
            var obj = {};
            try {
                obj[OPTIONS_FORWARD_DELAY] = parseInt(delay.value);
            } catch (e) {
                obj[OPTIONS_FORWARD_DELAY] = DEFAULT_DELAY;
            }

            browser.storage.local.set(obj);
        });
    });
})();
