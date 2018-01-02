(() => {
    const INTERVAL = 250; // 0.25 second
    const TIMEOUT = 5000; // 5 seconds
    const OPTIONS_AUTO_ENABLED = 'enabled_auto_forward';
    const OPTIONS_FORWARD_DELAY = 'auto_forward_delay';
    const DEFAULT_DELAY = 5;

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
        let href = '<a href="' + url + '">' + url + "</a>";
        let div = document.createElement("div");
        let style = 'style="color:blue; background-color:#EE0; position: fixed; top:0px;left:0px; width:100%;"';
        let countDownSpan = '<span id="countdown_span" style="float:right; margin-right:10px"></span>';
        div.innerHTML='<div ' + style + '>' + href + countDownSpan + '</div>';
        document.body.append(div);
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

            let container = document.getElementById("countdown_span");
            container.innerHTML = 'Wait <span id="count_down">' + delay + '</span>...<button id="cancel">Cancel</button>';
            let countDownSec = document.getElementById('count_down');
            let cancelBtn = document.getElementById('cancel');

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
