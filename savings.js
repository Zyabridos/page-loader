import request from 'request';
import * as cheerio from 'cheerio';
import { downloadFileFromFullLink } from './downloadFileFromFullLink.js'

const url = 'https://www.w3schools.com/';

// здесь я уже как-то разобралась с cheerio, но axios и cheerio вместе вообще не сходятся

export const extractImgLinks = (domain) => {

request(url, (err, resp, html)=>{

    if(!err && resp.statusCode == 200){
        console.log("Request of image downloading was success ");

        const $ = cheerio.load(html);

        $("img").each((index, image)=>{

            const img = $(image).attr('src');
            const fullLink = domain + img;

            downloadFileFromFullLink(fullLink);
        });

    } else { console.log("Requeston of image downloading has failed "); }
})
};

extractImgLinks((url))
