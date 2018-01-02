(() => {
    const INTERVAL = 250; // 0.25 second
    const TIMEOUT = 5000; // 5 seconds


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
        div.innerHTML='<div ' + style + '>' + href + '</div>';
        document.body.append(div);
    }

    // keep trying to search PTT url
    let interval = setInterval(() => {
        let url = searchUrlFromDisp();
        if (url) {
            prependUrl(url);
            clearInterval(interval);
        }
    }, INTERVAL);

    // reach time out, stop interval
    setTimeout(() => {
        clearInterval(interval);
    }, TIMEOUT);
})();
