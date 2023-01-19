/* Парсер статей журнала «Журналист» (https://jrnlst.ru) */
// Записывает заголовки и ссылки на статьи в HTML-файл
// Написан на Node.js с использованием модулей axios и jsdom

const axios = require('axios'); // Подключение модуля axios для скачивания страницы
const fs = require('fs'); // Подключение встроенного в Node.js модуля fs для работы с файловой системой

const client = require('https');

const osmosis = require('osmosis');

// const fetch = require('node-fetch');

const COUNT_PAGES = 3; // Количество страниц со статьями на сайте журнала на текущий день. На каждой странице до 18 статей
const BASE_LINK = 'https://www.okraska-sten.ru/photoalbums/page/'; // Типовая ссылка на страницу со статьями (без номера в конце)

const time = 5000;

var page = 1; // Номер первой страницы для старта перехода по страницам с помощью пагинатора
var parsingTimeout = 0; // Стартовое значение задержки следующего запроса (увеличивается с каждым запросом, чтобы не отправлять их слишком часто)

let arAlbumLinks = [];

init();

async function init() {
    
    console.log('start');


    let albums = await getAlbumsInfo();

    let photos = await getPhotos(albums);
    console.log(albums);
}

async function getAlbumsInfo() {
    let requests = [];
    for (let i = 1; i <= COUNT_PAGES; i++) {
        let link = BASE_LINK + i;
        requests.push(new Promise(resolve => {
            let albums = [];
            osmosis
                .get(link)
                .delay(5000)
                .find('.albums__item')
                .set({
                    preview_image: 'picture img@src',
                    title: '.album-item__title',
                    link: '.album-item__title @href',
                })
                .data(function(data) {
                    albums.push(data);
                    // albums = [...albums, ...data];
                    // console.log(data);
                })
                .log(console.log) // включить логи
                .error(console.error) // на случай нахождения ошибки
                .done(function () {
                    resolve(albums);
                });
        }));
    }


    Promise.all(requests).then((responses) => {

        // console.log(responses);
        let result = [];
        responses.forEach(response => {
            result = [...result, ...response];
        })


        getPhotos(result);
        // fs.writeFile('data.json', JSON.stringify(result, null, 4), function (err) {
        //     if (err) console.error(err);
        //     else console.log('Data Saved to data.json file');
        // });
        // return result;
    });
}

async function getPhotos(albums) {
    let requests = [];

    albums.forEach(item => {
        let album = {...item};
        requests.push(new Promise(resolve => {
            let photos = [];
            osmosis
                .get(item.link)
                .delay(5000)
                .find('.pictures__item')
                .set({
                    image: '.picture-item a @href',
                })
                .data(function(data) {
                    photos.push(data.image);
                    // albums = [...albums, ...data];
                    // console.log(data);
                })
                .log(console.log) // включить логи
                .error(console.error) // на случай нахождения ошибки
                .done(function () {
                    album.photos = photos;
                    resolve(album);
                });
        }))
    });

    Promise.all(requests).then((responses) => {
        console.log('done');
        fs.writeFile('albums.json', JSON.stringify(responses, null, 4), function (err) {
            if (err) console.error(err);
            else console.log('Data Saved to data.json file');
        });

        // responses.forEach(item => {
        //     fs.mkdir(`./files/${item.name}`, (err) => {
        //         if (err) throw err; // не удалось создать папку
        //         console.log('Папка успешно создана');
        //     });
        //     item.photos.forEach(photo => {
        //         let fileName = photo.split('/').pop();
        //         download_image(photo, `./files/${item.name}/${fileName}`);
        //     });
        // })
        // return result;
    });
}



async function download_image(url, image_path) {
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}




// function downloadFile(url, path) {
//     return fetch(url).then((res) => {
//         res.body.pipe(fs.createWriteStream(path));
//     });
// }
