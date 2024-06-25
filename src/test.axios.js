import axios from 'axios'; 
import { DOMParser } from 'xmldom';

const value = 'https://ru.hexlet.io/lessons.rss';
// const url = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(value)}`;

// axios.get(url)
//   .then((response) => {
//     console.log(response.data); // Обработка успешного ответа
//   })
//   .catch((error) => {
//     console.error('Error fetching data:', error); // Обработка ошибки
//   });

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

// const request = axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(value)}`)
// .then((response)=> {
//   if(response.status === 200) {
//     return response.data.contents;
//   }
//   else {
//     console.error('Error getting data')
//   }
// })


const getAxiosResponse = (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data.contents;
      } else {
        console.error('Error getting data');
        return null;
      }
    })
    .catch((error) => {
      console.error('Error getting data', error);
      return null;
    });
};

// Пример использования
getAxiosResponse(value)
  .then((data) => {
    if (data) {
      const xmlDocument = getParsedData(data)
//       const channelTitle = parsedDocument.getElementsByTagName('title')[0].textContent;
// console.log(`Channel Title: ${channelTitle}`);
      // console.log('Data received:', xmlDocument);
      // Парсинг и обработка данных здесь



    } else {
      console.log('No data received');
    }
    
  });



// const parsedDocument = getParsedData(request)
// console.log(parsedDocument)


// .catch((error)=> {
//   console.log('Error feching data:', error)
// })

// const getParsedData = (data) => {
//   const parser = new DOMParser();
//   const parsedData = parser.parseFromString(data, 'application/xml');
  