// const [fileHandle] = await window.showOpenFilePicker(options);

let result = [];
$('.comment-item__content').each(function() {
    let title = $(this).find('.comment-item__author').eq(1).text().trim();
    let dateTime = $(this).find('.comment-item__time').attr('datetime');
    let text = $(this).find('.comment-item__content_text').text().trim();

    let photos = [];
    if ($(this).find('.js-comment-images')) {
        let $images = $(this).find('.js-comment-images');
        $images.find('.js-comment-image-link').each(function() {
            photos.push($(this).attr('data-view'));
        })
    }

    let obj = {
        title,
        date: dateTime,
        text
    };

    if (photos.length > 0) {
        obj.photos = photos;
    }


    result.push(obj);
});

console.log(result);