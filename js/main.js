(() => {
    const INTERVAL = 250; // 0.25 second
    const TIMEOUT = 5000; // 5 seconds
    const OPTIONS_AUTO_ENABLED = 'enabled_auto_forward';
    const OPTIONS_FORWARD_DELAY = 'auto_forward_delay';
    const DEFAULT_DELAY = 5;

    const COUNT_DOWN_SPAN_ID = 'countdown_span';

    function searchUrlFromDisp() {
        let doms = document.getElementsByClassName("record");
        let index;
        for (index = doms.length - 1; index >= 0; index--) {
            let match = doms[index].innerText.match(/https:\/\/www.ptt.cc.*html$/);
            if (match) {
                return match[0];
            }
        }
    }

    /**
     * To find out original PTT url from disp.cc, and prepend to page top
     */
    function prependUrl(url) {
        let fragment = document.createDocumentFragment();

        let link = document.createElement('a');
        link.href = url;
        link.innerText = url;

        let div = document.createElement("div");
        div.style.backgroundColor = '#EE0';
        div.style.position = 'fixed';
        div.style.top = '0px';
        div.style.left = '0px';
        div.style.width = '100%';

        let countDown = document.createElement('span');
        countDown.id = COUNT_DOWN_SPAN_ID;
        countDown.style.float = 'right';
        countDown.style.marginRight = '10px';

        div.appendChild(link);
        div.appendChild(countDown);
        fragment.appendChild(div);
        document.body.append(fragment);
    }

    function onUrlFound(url) {
        browser.storage.local.get(OPTIONS_AUTO_ENABLED).then((result)=>{
            if (!result[OPTIONS_AUTO_ENABLED]) {
                return;
            }

            waitAndLoad(url);
        });
    }

    function waitAndLoad(url) {
        browser.storage.local.get(OPTIONS_FORWARD_DELAY).then((result) => {
            let delay = result.hasOwnProperty(OPTIONS_FORWARD_DELAY) ? result[OPTIONS_FORWARD_DELAY] : DEFAULT_DELAY;

            if (delay == 0) {
                window.location.assign(url);
                return;
            }

            // create html: Wait <span>' + delay + '</span>...<button >Cancel</button>
            let fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode('Wait '));

            let countDownSec = document.createElement('span');
            countDownSec.innerText = delay;
            fragment.appendChild(countDownSec);

            fragment.appendChild(document.createTextNode('....'));

            let cancelBtn = document.createElement('button');
            cancelBtn.innerText = 'Cancel';
            fragment.appendChild(cancelBtn);

            let container = document.getElementById(COUNT_DOWN_SPAN_ID);
            container.appendChild(fragment);

            let countDown = setInterval(() => {
                delay--;
                console.log('wait', delay, 'then auto forward');
                countDownSec.innerText = delay;
                if (delay <= 0) {
                    clearInterval(countDown);
                    // auto forward to web PTT
                    window.location.assign(url);
                }
            }, 1000);

            cancelBtn.addEventListener('click', () => {
                clearInterval(countDown);
                container.innerHTML = '';
            });
        });
    }

    // keep trying to search PTT url
    let interval = setInterval(() => {
        let url = searchUrlFromDisp();
        if (url) {
            prependUrl(url);
            clearInterval(interval);
            onUrlFound(url);
        }
    }, INTERVAL);

    // reach time out, stop interval
    setTimeout(() => {
        clearInterval(interval);
    }, TIMEOUT);
})();
