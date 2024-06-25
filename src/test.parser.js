import { DOMParser } from 'xmldom';


const xmlData = `<?xml version="1.0" encoding="UTF-8"?>\n' +
'<rss version="2.0">\n' +
'  <channel>\n' +
'    <title>Новые уроки на Хекслете</title>\n' +
'    <description>Практические уроки по программированию</description>\n' +
'    <link>https://ru.hexlet.io/</link>\n' +
'    <webMaster>info@hexlet.io</webMaster>\n' +
'    <item>\n' +
'      <title>Неустаревающие знания / Место в Python разработке</title>\n' +
'      <guid isPermaLink="false">4953</guid>\n' +
'      <link>https://ru.hexlet.io/courses/python-development-overview/lessons/knowledge/theory_unit</link>\n' +
'      <description>Цель: Знакомимся с навыками, которые не устаревают и не зависят от времени</description>\n' +
'      <pubDate>Mon, 24 Jun 2024 16:46:38 +0000</pubDate>\n' +
'    </item>\n' +
'    <!-- остальные элементы <item> идут здесь -->
'  </channel>\n' +
'</rss>\n';`


const getParsedData = (data) => {
    const parser = new DOMParser();
    const parsedData = parser.parseFromString(data, 'application/xml');

      // check for errors
//   const parserError = parsedData.querySelector('parsererror');
//   if (parserError) {
//     throw new Error('Error parsing XML');
//   }

  return parsedData;
}

const parsedDocument = getParsedData(xmlData)

const channelTitle = parsedDocument.getElementsByTagName('title')[0].textContent;
console.log(`Channel Title: ${channelTitle}`);

const items = parsedDocument.getElementsByTagName('item');
Array.from(items).forEach((item) => {
  const title = item.getElementsByTagName('title')[0].textContent;
  const link = item.getElementsByTagName('link')[0].textContent;
  const description = item.getElementsByTagName('description')[0].textContent;
  const pubDate = item.getElementsByTagName('pubDate')[0].textContent;

  console.log(`Title: ${title}`);
  console.log(`Link: ${link}`);
  console.log(`Description: ${description}`);
  console.log(`Publication Date: ${pubDate}`);
});
