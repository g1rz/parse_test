import urllib.request
import urllib.error
import json
import os
import random
import time

path = './albums.json'


with open(path, encoding='utf-8') as file:

    data = json.loads(file.read())

print(len(data['albums']))

url = 'https://i.siteapi.org/oCLVGdfdQSo4Q3AMeiGoxXFTV2c=/fit-in/900x1000/center/top/filters:format(png):watermark(s.siteapi.org/bcdd21e3699156f.ru/watermark/9g4t1zjwcr8ckcg4sg04o4sccs8wo0,-1,-1,0,15,none)/s.siteapi.org/bcdd21e3699156f.ru/gallery/ennf4f0lwpkcww48wcw0wgs8kkss4w'



def random_delay():
    time.sleep(random.randint(1,2) + random.random())

def download(url, path):
    fileName = url.split('/')[-1]
    fullPath = path + fileName + '.png'
    try: 
        urllib.request.urlretrieve('https:' + url, fullPath)
    except (urllib.error.URLError, urllib.error.HTTPError):
        print('{} failure'.format(url))
    else:
        print('{} saved.'.format(fileName))



for album in data['albums']:
    albumPath = './files/' + album['title'] + '/'
    # os.mkdir(albumPath)
    for photo in album['photos']:
        fileName = photo.split('/')[-1]
        print(fileName)

        destination = './files/test.png'

        download(photo, albumPath)
        random_delay()
        # url = 'https://i.siteapi.org/oCLVGdfdQSo4Q3AMeiGoxXFTV2c=/fit-in/900x1000/center/top/filters:format(png):watermark(s.siteapi.org/bcdd21e3699156f.ru/watermark/9g4t1zjwcr8ckcg4sg04o4sccs8wo0,-1,-1,0,15,none)/s.siteapi.org/bcdd21e3699156f.ru/gallery/ennf4f0lwpkcww48wcw0wgs8kkss4w'
        # urllib.request.urlretrieve('https:' + photo, albumPath)
        # request = urllib.urlopen('https:' + photo, timeout=500)
        # with open(albumPath, 'wb') as f:
        #     try:
        #         f.write(request.read())
        #     except:
        #         print("error")


