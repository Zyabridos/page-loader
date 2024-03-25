import { downloadFileFromFullLink } from './downloadSingleLink.js';
import extractLinks from './extractLinks.js';

// const url = 'https://ru.hexlet.io/courses';

const url = 'https://www.w3schools.com';

const downloadAllLinks = (domain) => {
    // по условию проекта, нало только эти файлы скачивать. Почему бы и не добавить .gif
    const regex = /\.js$|.css|.png|.jpg/
    extractLinks(url).then((links) => {
        links.map((currentLink) => {
            if (regex.test(currentLink))
            downloadFileFromFullLink(currentLink)
        });
});
}

downloadAllLinks(url)