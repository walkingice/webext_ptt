(() => {
    const OPTIONS_AUTO_ENABLED = 'enabled_auto_forward';

    let checkbox = document.getElementById('checkbox_auto_forward');

    browser.storage.local.get(OPTIONS_AUTO_ENABLED).then((r) => {
        checkbox.checked = !!r[OPTIONS_AUTO_ENABLED];

        checkbox.addEventListener('change', () => {
            var obj = {};
            obj[OPTIONS_AUTO_ENABLED] = checkbox.checked;
            browser.storage.local.set(obj);
        });
    });

})();
