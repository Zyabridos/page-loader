import fsp from 'fs/promises';
import { downloadFileFromFullLink } from './downloadFileFromFullLink.js';
import { join } from 'path';
import { isAbsolute, changeLinksToLocal, createFileName, createFolderName } from './smallUtils.js';
import request from 'request';
import * as cheerio from 'cheerio';

const url = 'https://www.w3schools.com/';

const downloadPageResourses = (domain) => {
    const fileNameHTML = createFileName(domain) + '.html';
    const domainFolder = createFolderName(domain);
    
    const regexpForFiles = new RegExp(".[a-z]{1,3}$", "g");
    
    request(url, (err, resp, html) => {

        if (!err && resp.statusCode == 200) {
            console.log("Request on local resourses downloading was successfull ");
            const $ = cheerio.load(html);
            $("link").each((index, link) => {
                const linkSource = $(link).attr('href');
                let absoluteURL;
                if (isAbsolute(linkSource)) {
                    absoluteURL = linkSource
                }
                else { absoluteURL = domain + linkSource; }
                // вот здесь надо сделать нормально = через регулярные выражения
                if (absoluteURL.endsWith('.css') || absoluteURL.endsWith('.png') || absoluteURL.endsWith('.js')) {
                            downloadFileFromFullLink(absoluteURL); }
            });


            $("script").each((index, script) => {
                const singleScriptLink = $(script).attr('src');
                // if (!singleScriptLink) {
                // downloadFileFromFullLink(singleScriptLink);};
            });

            $("img").each((index, image) => {

                const imgSource = $(image).attr('src');
                let absoluteURL;
                if (isAbsolute(imgSource)) {
                    absoluteURL = imgSource;
                }
                else { absoluteURL = domain + imgSource; };
                downloadFileFromFullLink(absoluteURL);
            });

                // const replacementLink = 'AAAAAAAAAAAAAAAA';
                // $('img').attr('src', replacementLink);
                // const modifiedHtml = $.html();
                // fsp.writeFile(join(process.cwd(), domainFolder, fileNameHTML), modifiedHtml);
        }
    })
};

export default downloadPageResourses;

downloadPageResourses(url);
