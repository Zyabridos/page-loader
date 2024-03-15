import { URL } from 'url';

const createFileName = (fullLink) => {
  const url = new URL(fullLink);
  const folderName = url.hostname.split('.').join('-');
  let pathname = url.pathname;
  if (pathname.startsWith('//')) {
    pathname = pathname.slice(1, )
  }
  const fileName = pathname.split('/').join('-');
  return `${folderName}${fileName}`
};



console.log(createFileName('https://www.w3schools.com'));


'www-w3schools-com-images-colorpicker200.png'


        // console.log(`${domainFolder}${img}`)
        // $('img').attr('src', 'https://example.com/image.jpg');
        // const modifiedHtml = $.html();
        // fsp.writeFile(join(process.cwd(), domainFolder, fileNameHTML), modifiedHtml);