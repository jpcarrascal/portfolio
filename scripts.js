// Helper functions
function fetchJSON(path) {
    return fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

function sortByOrderDateFolder(a, b) {
    // First respect explicit order if defined
    if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
    } 
    // Second, prioritize date sorting when available
    else if (a.date !== undefined && b.date !== undefined) {
        return b.date.localeCompare(a.date); // Descending order (newest first)
    } 
    // Use project folder name as last resort
    else {
        return a.project_folder.localeCompare(b.project_folder);
    }
}

// Core functionality
async function loadContent() {
    // Parse URL to determine current path
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const pathParam = urlParams.get('path') || '';
    const paths = pathParam.split('/').filter(p => p);
    
    // Set up breadcrumbs
    const breadcrumbs = [];
    let currentPath = '';
    
    // If viewing an image directly
    if (viewParam) {
        showImage(viewParam, '');
    }
    
    try {
        // Load root info.json
        const rootInfo = await fetchJSON('info.json');
        document.title = `${rootInfo.title}—JP Carrascal`;
        
        // Build breadcrumbs and nested path
        let dirInfo = rootInfo;
        let basePath = '';
        
        // Process each path segment to build full path and load appropriate content
        for (let i = 0; i < paths.length; i++) {
            const segment = paths[i];
            currentPath = basePath + segment + '/';
            
            // Fetch this directory's info.json
            try {
                dirInfo = await fetchJSON(currentPath + 'info.json');
                
                // Add to breadcrumbs if not Portfolio (root)
                if (dirInfo.title !== "Portfolio") {
                    breadcrumbs.push({
                        url: currentPath,
                        title: dirInfo.title
                    });
                }
                
                basePath = currentPath;
            } catch (err) {
                console.error(`Error loading info.json for path ${currentPath}:`, err);
                break;
            }
        }
        
        // Update breadcrumb navigation
        updateBreadcrumbs(breadcrumbs);
        
        // Check if we're in a project directory (has items) or category directory
        const isProject = dirInfo.items && dirInfo.items.length > 0;
        
        // Update container class for proper styling
        const container = document.querySelector('.container');
        container.className = `container ${isProject ? 'grid' : 'list'}`;
        
        // Render appropriate content
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = '';
        
        if (isProject) {
            // We're in a project directory - display project items
            renderProjectContent(contentDiv, dirInfo, basePath);
        } else {
            // We're in a category directory - scan and display subdirectories
            await renderCategoryContent(contentDiv, dirInfo, basePath);
        }
    } catch (err) {
        console.error('Error loading content:', err);
        document.getElementById('content').innerHTML = `<div class="error">Error loading content: ${err.message}</div>`;
    }
}

async function renderProjectContent(container, dirInfo, basePath) {
    // Add project description
    const descDiv = document.createElement('div');
    descDiv.className = 'item item-main project-description';
    descDiv.innerHTML = `
        <h3 class='item-title'>${dirInfo.title}</h3>
        <p class='item-description'>${dirInfo.description}</p>
    `;
    container.appendChild(descDiv);
    
    // Add project items
    const items = dirInfo.items;
    items.sort(sortByOrderDateFolder);
    const bgColors = [
        "rgba(166, 130, 255, 0.85)", 
        "rgba(113, 90, 255, 0.85)",
        "rgba(88, 135, 255, 0.85)",
        "rgba(85, 193, 255, 0.85)",
        "rgba(16, 46, 74, 0.85)"
    ];
    
    let colorIndex = 0;
    
    // Process each project item
    items.forEach(project => {
        if (project.title === "") return;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item item-project';
        
        // Create item inner HTML
        let html = '';
        
        if (project.img_small !== "") {
            // Make sure project_folder is defined before using it
            const projectFolder = project.project_folder || "";
            const imgSrc = basePath + projectFolder + (projectFolder ? "/" : "") + project.img_small;
            const imgSrcBig = project.img_big !== "" ? 
                basePath + projectFolder + (projectFolder ? "/" : "") + project.img_big : 
                imgSrc;
                
            html += `<img class='item-img-bg greyscale-ish' src='${imgSrc}' />`;
            
            // Check if there's an external link
            const hasExtLink = project.ext_link && /^((https?|ftp):\/\/)/.test(project.ext_link);
            const hasVidLink = project.video_link && /^((https?|ftp):\/\/)/.test(project.video_link);
            const hasPubLink = project.publication_link && /^((https?|ftp):\/\/)/.test(project.publication_link);
            
            html += `<div img='${imgSrcBig}' url='${project.url || ""}'>`;
            
            var extLinks = '<br /><br />';
            if (hasExtLink) {
                extLinks += `[<a href='${project.ext_link}' target='_blank' class='linkable'>link</a>]`;
            }
            if (hasVidLink) {
                extLinks += ` [<a href='${project.video_link}' target='_blank' class='linkable'>video</a>]`;
            }
            if (hasPubLink) {
                extLinks += ` [<a href='${project.publication_link}' target='_blank' class='linkable'>publication</a>]`;
            }
            
            /*else if (project.img_big !== "") {
                extLink = `<a href='${imgSrcBig}' target='_blank'>[img]</a>`;
            }*/
            
            html += `<div class='item-text darken'>
                <div class='item-text-wrapper'>
                    <h3 class='item-title'>${project.title} ${project.date ? " (" + project.date + ")" : ""}</h3>
                    <p class='item-description'>${project.description}${extLinks}</p>
                </div>
            </div>`;
            
            html += `</div>`;
        }
        
        itemDiv.innerHTML = html;
        container.appendChild(itemDiv);
        
        // Cycle through background colors
        colorIndex = (colorIndex + 1) % bgColors.length;
    });
    
    // Add spacer at the end
    const spacer = document.createElement('div');
    spacer.className = 'item item-main';
    spacer.style.height = '1.5em';
    container.appendChild(spacer);
    
    // Set up click handlers for view items
    setupViewHandlers();
}

async function renderCategoryContent(container, dirInfo, basePath) {
    const items = [];
    
    // If we have explicit categories listed, use those
    if (dirInfo.categories && dirInfo.categories.length > 0) {
        for (const folder of dirInfo.categories) {
            try {
                const folderPath = basePath + folder + "/";
                const itemInfo = await fetchJSON(folderPath + 'info.json');
                
                // Add folder name to the project info
                itemInfo.project_folder = folder;
                items.push(itemInfo);
            } catch (err) {
                console.error(`Error loading info.json for folder ${folder}:`, err);
            }
        }
    } else {
        // If no explicit categories, we could scan the directory (not implemented in this static version)
        console.warn('Directory scanning not implemented in static version');
    }
    
    // Sort items by order, date, or folder name
    items.sort(sortByOrderDateFolder);
    
    // Background colors for categories
    const bgColors = [
        "rgba(166, 130, 255, 0.85)", 
        "rgba(113, 90, 255, 0.85)",
        "rgba(88, 135, 255, 0.85)",
        "rgba(85, 193, 255, 0.85)",
        "rgba(16, 46, 74, 0.85)"
    ];
    
    let colorIndex = 0;
    
    // Render each category
    items.forEach(project => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item item-main';
        
        let html = '';
        
        if (project.img_small) {
            // Make sure project_folder is defined before using it
            const projectFolder = project.project_folder || "";
            const imgSrc = basePath + projectFolder + (projectFolder ? "/" : "") + project.img_small;
            html += `<img class='item-img-bg greyscale fill-wide' src='${imgSrc}' />`;
        }
        
        // Determine the link target
        let linkHref = '';
        if (/^((https?|ftp):\/\/)/.test(project.img_big)) {
            linkHref = project.img_big;
            html += `<a href='${linkHref}' target='_blank'>`;
        } else if (project.url !== "") {
            linkHref = project.url;
            html += `<a href='${linkHref}' target='_blank'>`;
        } else {
            linkHref = `?path=${encodeURIComponent(basePath + project.project_folder)}`;
            html += `<a href='${linkHref}'>`;
        }
        
        html += `<div class='item-text' style='background-color:${bgColors[colorIndex]}'>
            <div class='item-text-wrapper'>
                <h3 class='item-title'>${project.title}</h3>
                <p class='item-description'>${project.description}</p>
            </div>
        </div>
        </a>`;
        
        itemDiv.innerHTML = html;
        container.appendChild(itemDiv);
        
        // Cycle through background colors
        colorIndex = (colorIndex + 1) % bgColors.length;
    });
    
    // Add spacer at the end
    const spacer = document.createElement('div');
    spacer.className = 'item item-main';
    spacer.style.height = '1.5em';
    container.appendChild(spacer);
}

function updateBreadcrumbs(breadcrumbs) {
    const breadcrumbsDiv = document.getElementById('breadcrumbs');
    let html = '';
    
    if (breadcrumbs.length > 0) {
        html = `<a href='./'>Portfolio</a>`;
        
        for (let i = 0; i < breadcrumbs.length - 1; i++) {
            html += `<span class='sep'>&#9667;</span>`;
            html += `<a href='?path=${encodeURIComponent(breadcrumbs[i].url)}'>${breadcrumbs[i].title}</a>`;
        }
        
        if (breadcrumbs.length > 0) {
            html += `<span class='sep'>&#9667;</span>`;
            html += `<a href='#'>${breadcrumbs[breadcrumbs.length - 1].title}</a>`;
        }
    }
    
    breadcrumbsDiv.innerHTML = html;
}

function showImage(imgSrc, url) {
    const showElement = document.getElementById('show');
    showElement.style.height = window.innerHeight + 'px';
    
    const showImage = document.getElementById('show-image');
    
    showImage.style.cursor = '';
    showImage.onclick = function(e) {
        e.preventDefault();
        return false;
    };
    
    showImage.classList.remove('fill-wide');
    showImage.classList.remove('fill-tall');
    
    showImage.src = imgSrc;
    
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
    
    // Update URL if needed
    if (imgSrc) {
        const imgParts = imgSrc.split('/');
        const imgName = imgParts[imgParts.length - 1];
        history.pushState({page: 1}, imgName, "?view=" + imgName);
    }
}

function setupViewHandlers() {
    // Set up image view handlers
    document.querySelectorAll('[img]').forEach(item => {
        item.addEventListener('click', function(e) {
            const imgSrc = this.getAttribute('img');
            const url = this.getAttribute('url') || '';
            
            // Only handle if this is not inside an <a> tag
            if (!e.target.closest('a')) {
                e.preventDefault();
                showImage(imgSrc, url);
                return false;
            }
        });
    });
}

function autofill() {
    const itemProjects = document.querySelectorAll('.item-project');
    itemProjects.forEach(item => {
        if (itemProjects.length > 0) {
            const width = itemProjects[0].offsetWidth;
            item.style.height = width + 'px';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    let curscroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Handle scroll for title animation
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
    
    // Handle back button and close overlay
    window.addEventListener('popstate', function(event) {
        document.getElementById('veil').style.visibility = 'hidden';
        // Also reload content if needed
        loadContent();
    });
    
    // Set up close button for image viewer
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('veil').style.visibility = 'hidden';
            window.history.back();
        });
    });
    
    // Set up ESC key to close image viewer
    document.addEventListener('keyup', function(e) {
        if (e.keyCode === 27) {
            document.getElementById('veil').style.visibility = 'hidden';
        }
    });
    
    // Initial load of content
    loadContent().then(() => {
        // Run autofill after content is loaded
        autofill();
        
        // Re-autofill on window resize
        window.addEventListener('resize', function() {
            autofill();
        });
    });
});