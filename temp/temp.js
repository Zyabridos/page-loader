import * as cheerio from 'cheerio';

const html2 = 
'<meta property="og:image" content="https://cdn2.hexlet.io/assets/professions/program-f26fba51e364abcd7f15475edb68d93958426d54c75468dc5bc65e493a586226.png"></meta>'

const html = '<h2 class="title">Hello, world!</h2><input name="email" value="test@example.com">';

  const $ = cheerio.load(html);

  // Получить текст (то, что между открывающими и закрывающими скобками тега)
  console.log($('h2.title').text()); // => Hello, World!