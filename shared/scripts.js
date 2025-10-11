// Simplified Portfolio JavaScript - Only Image Overlay Functionality

function showImage(imgSrc, url) {
    const showElement = document.getElementById('show');
    const showImage = document.getElementById('show-image');
    
    // Set overlay height to window height
    showElement.style.height = window.innerHeight + 'px';
    
    // Reset image properties
    showImage.style.cursor = '';
    showImage.onclick = function(e) {
        e.preventDefault();
        return false;
    };
    
    // Remove any existing size classes
    showImage.classList.remove('fill-wide');
    showImage.classList.remove('fill-tall');
    showImage.classList.remove('fill-wide-show');
    showImage.classList.remove('fill-tall-show');
    
    // Set the image source
    showImage.src = imgSrc;
    
    // Handle image load
    showImage.onload = function() {
        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
            alert('Error loading image!');
        } else {
            // Add click handler for external URL if provided
            if (url != "") {
                showImage.style.cursor = 'pointer';
                showImage.onclick = function() {
                    window.open(url, '_blank');
                    return false;
                };
            }
            
            // Determine image sizing based on dimensions
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
            
            // Show the overlay
            document.getElementById('veil').style.visibility = 'visible';
        }
    };
}

function closeImageOverlay() {
    document.getElementById('veil').style.visibility = 'hidden';
}

function setupImageHandlers() {
    // Set up image view handlers for elements with 'img' attribute
    document.querySelectorAll('[img]').forEach(item => {
        item.addEventListener('click', function(e) {
            const imgSrc = this.getAttribute('img');
            const url = this.getAttribute('url') || '';
            
            // Only handle if this is not inside an <a> tag to avoid conflicts
            if (!e.target.closest('a')) {
                e.preventDefault();
                showImage(imgSrc, url);
                return false;
            }
        });
    });
}

function setupProjectGrid() {
    // Auto-size project items to be square
    const itemProjects = document.querySelectorAll('.item-project');
    if (itemProjects.length > 0) {
        const width = itemProjects[0].offsetWidth;
        itemProjects.forEach(item => {
            item.style.height = width + 'px';
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Handle scroll animation for title
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const titleLetters = document.querySelectorAll('.title-letter');
        
        if (scrollTop > 10 && currentScroll != scrollTop) {
            titleLetters.forEach(letter => {
                letter.classList.add('smaller');
            });
        } else {
            titleLetters.forEach(letter => {
                letter.classList.remove('smaller');
            });
        }
        currentScroll = scrollTop;
    });
    
    // Set up close button for image overlay
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', function() {
            closeImageOverlay();
        });
    });
    
    // Set up ESC key to close image overlay
    document.addEventListener('keyup', function(e) {
        if (e.keyCode === 27) { // ESC key
            closeImageOverlay();
        }
    });
    
    // Click outside image to close overlay
    document.getElementById('veil').addEventListener('click', function(e) {
        if (e.target === this) {
            closeImageOverlay();
        }
    });
    
    // Set up image handlers
    setupImageHandlers();
    
    // Set up project grid sizing
    setupProjectGrid();
    
    // Re-setup grid sizing on window resize
    window.addEventListener('resize', function() {
        setupProjectGrid();
    });
});
