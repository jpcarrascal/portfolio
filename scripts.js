function autofill() {
    const itemProjects = document.querySelectorAll('.item-project');
    itemProjects.forEach(item => {
        const width = itemProjects[0].offsetWidth;
        item.style.height = width + 'px';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    let curscroll = window.pageYOffset || document.documentElement.scrollTop;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const titleLetters = document.querySelectorAll('.title-letter');
        
        if (scrollTop > 10 && curscroll != scrollTop) {
            titleLetters.forEach(letter => {
                letter.classList.add('smaller');
            });
        } else {
            titleLetters.forEach(letter => {
                letter.classList.remove('smaller');
            });
        }
        curscroll = scrollTop;
    });

    autofill();
    
    window.addEventListener('resize', function() {
        autofill();
    });

    window.addEventListener('popstate', function(event) {
        document.getElementById('veil').style.visibility = 'hidden';
    });

    const viewButtons = document.querySelectorAll('.view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const showElement = document.getElementById('show');
            showElement.style.height = window.innerHeight + 'px';
            
            const url = this.getAttribute('url');
            const showImage = document.getElementById('show-image');
            
            showImage.style.cursor = '';
            showImage.onclick = function(e) {
                e.preventDefault();
                return false;
            };
            
            showImage.classList.remove('fill-wide');
            showImage.classList.remove('fill-tall');
            
            showImage.src = this.getAttribute('img');
            
            showImage.onload = function() {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    alert('broken image!');
                } else {
                    if (url != "") {
                        showImage.style.cursor = 'pointer';
                        showImage.onclick = function() {
                            window.open(url, '_blank');
                            return false;
                        };
                    }
                    
                    if (this.naturalWidth > window.innerWidth) {
                        if (this.naturalHeight > window.innerHeight) {
                            showImage.classList.remove('fill-wide-show');
                            showImage.classList.add('fill-tall-show');
                        } else {
                            showImage.classList.add('fill-wide-show');
                            showImage.classList.remove('fill-tall-show');
                        }
                    } else {
                        showImage.classList.remove('fill-wide-show');
                        showImage.classList.add('fill-tall-show');
                    }
                    
                    document.getElementById('veil').style.visibility = 'visible';
                }
            };
            
            const imgArr = this.getAttribute('img').split('/');
            const imgName = imgArr[imgArr.length - 1];
            history.pushState({page: 1}, imgName, "?view=" + imgName);
        });
    });

    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('veil').style.visibility = 'hidden';
            window.history.back();
        });
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.keyCode === 27) {
            document.getElementById('veil').style.visibility = 'hidden';
        }
    });
});