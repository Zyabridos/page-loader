import * as fs from 'fs'
import request from 'request';
import * as cheerio from 'cheerio';

const url = 'https://www.bridgeport.edu/';

const WriteStream = fs.createWriteStream("xxx.txt", "utf-8")
request(url, (err, resp, html)=>{

    if(!err && resp.statusCode == 200){
        console.log("Request was success ");

        // Define Cherio or $ Object 
        const $ = cheerio.load(html);

        $("img").each((index, image)=>{

            var img = $(image).attr('src');
            var baseUrl = 'https://www.bridgeport.edu';
            var Links = baseUrl + img;
            WriteStream.write(Links);
            WriteStream.write("\n");
        });

    }else{
        console.log("Request Failed ");
    }

});
