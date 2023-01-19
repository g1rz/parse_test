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



def random_delay():
    time.sleep(random.randint(1,2) + random.random())

def download(url, path):
    # fileName = url.split('/')[-1]
    # fullPath = path + fileName + '.png'
    try: 
        urllib.request.urlretrieve('https:' + url, path)
    except (urllib.error.URLError, urllib.error.HTTPError):
        print('{} failure'.format(url))
    else:
        print('{} saved.'.format(path))



for album in data['albums']:
    albumPath = './files/' + album['title'] + '/'
    # Создание папки альбома
    # os.mkdir(albumPath) 
    previewImagePath = albumPath + '/0_preview.png'
    download(album['preview_image'], previewImagePath)
    random_delay()
    # for photo in album['photos']:
    #     fileName = photo.split('/')[-1]
    #     fullPath = albumPath + fileName + '.png'
    #     print(fullPath)

    #     download(photo, fullPath)
    #     random_delay()


