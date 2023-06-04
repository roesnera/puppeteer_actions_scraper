import axios from "axios";
import puppeteer from "puppeteer";
import 'dotenv/config';

const getTikTokMetrics = async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto("https://www.tiktok.com/@mariahthemystic",
    {waitUntil: "domcontentloaded"});

    const tikTokMetrics = await page.evaluate(() => {
        const metricData = []
        // const following = document.querySelector("#main-content-others_homepage > div > div.tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2.enm41492 > h3 > div:nth-child(1) > strong");
        const metricHTML = document.querySelectorAll("#main-content-others_homepage .tiktok-1kd69nj-DivNumber");
        // const followingNumber = following.childNodes[0].innerText;
        for(element of metricHTML) {
            const number = element.childNodes[0].innerText;
            metricData.push(number);
        }

        return metricData;
    });
    await browser.close();
    
    // console.log(tikTokMetrics);

    const metrics = {
        tikTokLikes: tikTokMetrics[2],
        tikTokFollowers: tikTokMetrics[1],
        instagramFollowers: "1.8k"
    }

    const headers = {
        headers: {
            Authorization: `Bearer ${process.env.API_JWT}`
        }
    }

    axios.post("https://adamsapi.xyz/api/v1/metrics/new", metrics, headers)

    return metrics;
}

getTikTokMetrics();

export default getTikTokMetrics;