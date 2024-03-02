import * as fs from 'fs'
import request from 'request';
import * as cheerio from 'cheerio';


// Create a Write Stream 
var WriteStream  = fs.createWriteStream("ImagesLink.txt", "UTF-8");



request('https://www.bridgeport.edu/', (err, resp, html)=>{

    if(!err && resp.statusCode == 200){
        console.log("Request was success ");
        
        // Define Cherio or $ Object 
        const $ = cherio.load(html);

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


// const app = express()

// app.get('/', (req, res) => {
//   const url = 'https://codingshiksha.com/';

//   // making a request

//   request(url, (error, response, html) => {
//     if (!error) {
//       const $ = cheerio.load(html);
//       const imagesrc = $('.oceanwp-about-me-avatar img').attr('src');

//       download({
//         imgs:[
//           {
//             uri: imagesrc
//           }
//         ],
//         dest: './temp'
//       })
//       .then ((infor) => {
//         console.log('Done!')
//         process.exit(1)
//       })
//     }
//   })
// })

// app.listen(5000);