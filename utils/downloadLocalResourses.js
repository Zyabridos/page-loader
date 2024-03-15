import { downloadFileFromFullLink } from './downloadFileFromFullLink.js'
import request from 'request';
import * as cheerio from 'cheerio';

const url = 'https://www.w3schools.com';

export const downloadLocalResourses = (domain) => {
request(url, (err, resp, html)=>{

    if(!err && resp.statusCode == 200){
        console.log("Request on local resourses downloading was successfull ");

        // вот как скачать локальные ресурсы? Все загрузки падают с кодом 404?
        // Даже если ссылка не битая, например https://www.w3schools.com//lib/w3codecolor.js
        const $ = cheerio.load(html);
        $("link").each((index, link)=>{
            const singleLinkLink = $(link).attr('href');
            const fullLinkLinks = domain + singleLinkLink;
            // вот здесь я вообще не понимаю, какую из ссылок качать??? Что из этого css 
            console.log(fullLinkLinks);
            // downloadFileFromFullLink(Links);
        });
        
        $("script").each((index, script)=>{
            const singleScriptLink = $(script).attr('src');
            const fullScriptLinks = domain + singleScriptLink;
            // const arr = Array.from(fullScriptLinks);
            // console.log(arr[0].join())
            // console.log(fullScriptLinks)
            // downloadFileFromFullLink(fullScriptLinks);

            // вот не битая ссылка, и все загружается, но она же и единственная во всем документе на локальном хосте 
            // downloadFileFromFullLink('https://www.w3schools.com//lib/w3codecolor.js')
        });

    } else{ console.log("Requeston on local resourses downloading has failed "); }
})
};

downloadLocalResourses(url)