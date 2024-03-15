import fsp from 'fs/promises';
import request from 'request';
import * as cheerio from 'cheerio';
import { downloadFileFromFullLink } from './downloadFileFromFullLink.js';
import { createFileName, createFolderName } from './smallUtils.js';
import { join } from 'path';

const url = 'https://www.w3schools.com/';

// здесь я уже как-то разобралась с cheerio, но axios и cheerio вместе вообще не сходятся

export const downloadAllImg = (domain) => {

    const fileNameHTML = createFileName(domain) + '.html';
    const domainFolder = createFolderName(domain);

request(url, (err, resp, html)=>{

    if(!err && resp.statusCode == 200){
        console.log("Request of image downloading was success ");

        const $ = cheerio.load(html);

        $("img").each((index, image)=>{

            const img = $(image).attr('src');
            const fullLink = domain + img;
            downloadFileFromFullLink(fullLink);

        // const replacementLink = createFolderName(domain) + '_files/' + createFileName(fullLink);
        // $('img').attr('src', replacementLink);
        // const modifiedHtml = $.html();
        // fsp.writeFile(join(process.cwd(), domainFolder, fileNameHTML), modifiedHtml);


        });

    } else { console.log("Requeston of image downloading has failed "); }
})
};

downloadAllImg((url))
