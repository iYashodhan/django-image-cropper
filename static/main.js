const alertBox = document.getElementById('alert-box')
const imageBox = document.getElementById('image-box')
const imageForm = document.getElementById('image-form')
const downloadBtn = document.getElementById('download-btn')
const input = document.getElementById('id_file')

const csrf = document.getElementsByName('csrfmiddlewaretoken')

const leftBtn = document.getElementById('left')
const rightBtn = document.getElementById('right')

const btnContainer = document.getElementById('btn-container')


input.addEventListener('change', ()=>{
    
    alertBox.innerHTML = ""
    downloadBtn.classList.remove('not-visible')

    const img_data = input.files[0]
    const url = URL.createObjectURL(img_data)

    // intial display of image
    imageBox.innerHTML = `<img src="${url}" id="image" width="700px" >`


    var $image = $('#image')
    console.log($image)

    $image.cropper({
        aspectRatio: 16 / 9,
        crop: function(event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);
        }
    });
    
    var cropper = $image.data('cropper');
    downloadBtn.addEventListener('click', ()=>{
        cropper.getCroppedCanvas().toBlob((blob) => {

            console.log('confirmed')
            const fd = new FormData();
            fd.append('csrfmiddlewaretoken', csrf[0].value)
            fd.append('file', blob, 'my-image.png');

            $.ajax({
                type:'POST',
                url: imageForm.action,
                enctype: 'multipart/form-data',
                data: fd,
                success: function(response){

                    console.log('success', response)
                    alertBox.innerHTML = `<div class="alert alert-success" role="alert">
                                            Successfully saved and downlaoded the selected image

                                            <a id="download" href="" download="my-image.png">Click here if image don't get downlaoded</a>
                                        </div>`


                    const download = document.getElementById('download')
                    download.click()
                },
                error: function(error){
                    console.log('error', error)
                    alertBox.innerHTML = `<div class="alert alert-danger" role="alert">
                                            Ups...something went wrong
                                        </div>`
                },
                cache: false,
                contentType: false,
                processData: false,
            })
        })
    })
})