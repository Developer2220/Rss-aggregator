import { DOMParser } from 'xmldom';


// const xmlData = `<?xml version="1.0" encoding="UTF-8"?>\n' +
// '<rss version="2.0">\n' +
// '  <channel>\n' +
// '    <title>Новые уроки на Хекслете</title>\n' +
// '    <description>Практические уроки по программированию</description>\n' +
// '    <link>https://ru.hexlet.io/</link>\n' +
// '    <webMaster>info@hexlet.io</webMaster>\n' +
// '    <item>\n' +
// '      <title>Неустаревающие знания / Место в Python разработке</title>\n' +
// '      <guid isPermaLink="false">4953</guid>\n' +
// '      <link>https://ru.hexlet.io/courses/python-development-overview/lessons/knowledge/theory_unit</link>\n' +
// '      <description>Цель: Знакомимся с навыками, которые не устаревают и не зависят от времени</description>\n' +
// '      <pubDate>Mon, 24 Jun 2024 16:46:38 +0000</pubDate>\n' +
// '    </item>\n' +
// '    <!-- остальные элементы <item> идут здесь -->
// '  </channel>\n' +
// '</rss>\n';`

const xmlData = '<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title><![CDATA[Lorem ipsum feed for an interval of 1 minutes with 10 item(s)]]></title><description><![CDATA[This is a constantly updating lorem ipsum feed]]></description><link>http://example.com/</link><generator>RSS for Node</generator><lastBuildDate>Wed, 14 Aug 2024 09:00:29 GMT</lastBuildDate><pubDate>Wed, 14 Aug 2024 09:00:00 GMT</pubDate><copyright><![CDATA[Michael Bertolacci, licensed under a Creative Commons Attribution 3.0 Unported License.]]></copyright><ttl>1</ttl><item><title><![CDATA[Lorem ipsum 2024-08-14T09:00:00Z]]></title><description><![CDATA[Culpa mollit culpa pariatur excepteur adipisicing sint nulla voluptate consectetur.]]></description><link>http://example.com/test/1723626000</link><guid isPermaLink="true">http://example.com/test/1723626000</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 09:00:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-08-14T08:59:00Z]]></title><description><![CDATA[Esse irure cillum adipisicing esse velit eiusmod qui do proident culpa excepteur mollit.]]></description><link>http://example.com/test/1723625940</link><guid isPermaLink="true">http://example.com/test/1723625940</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 08:59:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-08-14T08:58:00Z]]></title><description><![CDATA[Est duis ex ullamco officia magna.]]></description><link>http://example.com/test/1723625880</link><guid isPermaLink="true">http://example.com/test/1723625880</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 08:58:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-08-14T08:57:00Z]]></title><description><![CDATA[Veniam labore duis sit reprehenderit consequat consequat est duis et dolore.]]></description><link>http://example.com/test/1723625820</link><guid isPermaLink="true">http://example.com/test/1723625820</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 08:57:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-08-14T08:56:00Z]]></title><description><![CDATA[Amet officia laboris amet aliqua adipisicing.]]></description><link>http://example.com/test/1723625760</link><guid isPermaLink="true">http://example.com/test/1723625760</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 08:56:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-08-14T08:55:00Z]]></title><description><![CDATA[Enim amet nulla labore ea officia consequat consequat sit adipisicing deserunt.]]></description><link>http://example.com/test/1723625700</link><guid isPermaLink="true">http://example.com/test/1723625700</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 08:55:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-08-14T08:54:00Z]]></title><description><![CDATA[Fugiat dolor voluptate nisi consectetur laboris occaecat labore velit mollit.]]></description><link>http://example.com/test/1723625640</link><guid isPermaLink="true">http://example.com/test/1723625640</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 08:54:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-08-14T08:53:00Z]]></title><description><![CDATA[Sunt elit dolor sunt mollit quis labore ex non velit sunt sint.]]></description><link>http://example.com/test/1723625580</link><guid isPermaLink="true">http://example.com/test/1723625580</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 08:53:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-08-14T08:52:00Z]]></title><description><![CDATA[Id sint reprehenderit incididunt duis officia ipsum sit culpa id voluptate incididunt sunt.]]></description><link>http://example.com/test/1723625520</link><guid isPermaLink="true">http://example.com/test/1723625520</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 08:52:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-08-14T08:51:00Z]]></title><description><![CDATA[Reprehenderit esse tempor amet esse reprehenderit.]]></description><link>http://example.com/test/1723625460</link><guid isPermaLink="true">http://example.com/test/1723625460</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 14 Aug 2024 08:51:00 GMT</pubDate></item></channel></rss>'


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
