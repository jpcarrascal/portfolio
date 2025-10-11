// Template Engine for Portfolio Site
// Loads JSON data and renders category/project pages dynamically

class TemplateEngine {
    static async fetchJSON(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading JSON from ${path}:`, error);
            throw error;
        }
    }

    static sortByOrderDateFolder(a, b) {
        // First respect explicit order if defined
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        } 
        // Second, prioritize date sorting when available
        else if (a.date !== undefined && b.date !== undefined) {
            return b.date.localeCompare(a.date); // Descending order (newest first)
        } 
        // Use project folder name as last resort
        else if (a.project_folder && b.project_folder) {
            return a.project_folder.localeCompare(b.project_folder);
        }
        // Fallback to title
        else {
            return (a.title || '').localeCompare(b.title || '');
        }
    }

    static createProjectHTML(project, basePath, colorIndex) {
        const bgColors = [
            "rgba(166, 130, 255, 0.85)", 
            "rgba(113, 90, 255, 0.85)",
            "rgba(88, 135, 255, 0.85)",
            "rgba(85, 193, 255, 0.85)",
            "rgba(16, 46, 74, 0.85)"
        ];

        // Determine image path
        const projectFolder = project.project_folder || "";
        let imgPath = basePath;
        
        // Special handling for "other" category which combines web/graphic
        if (basePath.includes('/other/') && projectFolder) {
            imgPath = `${projectFolder}/`;
        } else if (projectFolder) {
            imgPath += projectFolder + "/";
        }
        imgPath += project.img_small;

        // Build links section
        let linksHTML = '';
        const links = [];
        
        if (project.ext_link && project.ext_link.trim()) {
            links.push(`<a href="${project.ext_link}" target="_blank" class="linkable">link</a>`);
        }
        if (project.video_link && project.video_link.trim()) {
            links.push(`<a href="${project.video_link}" target="_blank" class="linkable">video</a>`);
        }
        if (project.publication_link && project.publication_link.trim()) {
            links.push(`<a href="${project.publication_link}" target="_blank" class="linkable">publication</a>`);
        }

        if (links.length > 1) {
            // Multiple links - show them with brackets so user can choose
            linksHTML = '<br /><br />[' + links.join('] [') + ']';
        }
        // Single link - show no link text since the whole tile is clickable

        // Build title with date
        let title = project.title;
        if (project.date && project.date.trim()) {
            title += ` (${project.date})`;
        }

        // Priority order: project folder > external link > image overlay
        let linkTarget = '';
        let clickableDiv = '';
        
        if (project.items && project.items.length > 0) {
            // This is a category with sub-projects, link to project folder
            linkTarget = `<a href="${projectFolder}/">`;
            clickableDiv = `<div class="item-text darken">`;
        } else if (project.ext_link && project.ext_link.trim()) {
            // This project has an external link, make it clickable
            linkTarget = `<a href="${project.ext_link}" target="_blank">`;
            clickableDiv = `<div class="item-text darken">`;
        } else if (project.video_link && project.video_link.trim()) {
            // No external link, but has video link
            linkTarget = `<a href="${project.video_link}" target="_blank">`;
            clickableDiv = `<div class="item-text darken">`;
        } else if (project.publication_link && project.publication_link.trim()) {
            // No external or video link, but has publication link
            linkTarget = `<a href="${project.publication_link}" target="_blank">`;
            clickableDiv = `<div class="item-text darken">`;
        } else {
            // No external links, use image overlay
            clickableDiv = `<div img="${imgPath}" url="">
                <div class="item-text darken">`;
        }

        // Determine closing tags based on whether we have a link target
        let closingTags = '';
        if (linkTarget) {
            // We have a link target, so close div then a
            closingTags = '</div></a>';
        } else {
            // No link target, but we have nested divs from clickableDiv
            closingTags = '</div></div>';
        }

        return `
        <div class="item item-project">
            <img class="item-img-bg greyscale-ish" src="${imgPath}" />
            ${linkTarget}
            ${clickableDiv}
                <div class="item-text-wrapper">
                    <h3 class="item-title">${title}</h3>
                    <p class="item-description">${project.description}${linksHTML}</p>
                </div>
            </div>
            ${closingTags}
        </div>`;
    }

    static createProjectItemHTML(item, basePath, colorIndex) {
        // Build links section for project items
        let linksHTML = '';
        const links = [];
        
        if (item.ext_link && item.ext_link.trim()) {
            links.push(`<a href="${item.ext_link}" target="_blank" class="linkable">link</a>`);
        }
        if (item.video_link && item.video_link.trim()) {
            links.push(`<a href="${item.video_link}" target="_blank" class="linkable">video</a>`);
        }
        if (item.publication_link && item.publication_link.trim()) {
            links.push(`<a href="${item.publication_link}" target="_blank" class="linkable">publication</a>`);
        }

        if (links.length > 1) {
            // Multiple links - show them with brackets so user can choose
            linksHTML = '<br /><br />[' + links.join('] [') + ']';
        }
        // Single link - show no link text since the whole tile is clickable

        // Build title with date
        let title = item.title;
        if (item.date && item.date.trim()) {
            title += ` (${item.date})`;
        }

        const imgPath = basePath + item.img_small;
        const imgBig = item.img_big || item.img_small;
        const imgBigPath = basePath + imgBig;

        return `
        <div class="item item-project">
            <img class="item-img-bg greyscale-ish" src="${imgPath}" />
            <div img="${imgBigPath}" url="${item.url || ''}">
                <div class="item-text darken">
                    <div class="item-text-wrapper">
                        <h3 class="item-title">${title}</h3>
                        <p class="item-description">${item.description}${linksHTML}</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static showError(message) {
        document.getElementById('content').innerHTML = `
            <div class="error" role="alert">
                <h3>Unable to load content</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-button">Try Again</button>
            </div>
        `;
    }

    static hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }
}

// Category Renderer
class CategoryRenderer {
    static async init(categoryPath) {
        try {
            // Load the category's info.json
            const categoryData = await TemplateEngine.fetchJSON(`../${categoryPath}/info.json`);
            
            // Update page title and header
            document.title = `${categoryData.title} — JP Carrascal`;
            document.querySelector('.project_title').textContent = categoryData.title;
            
            // Update meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = `${categoryData.description || categoryData.title} — JP Carrascal`;
            }

            // Update breadcrumbs
            const breadcrumbs = document.getElementById('breadcrumbs');
            breadcrumbs.innerHTML = `
                <a href="../">Portfolio</a>
                <span class="sep">&#9667;</span>
                <a href="#">${categoryData.title}</a>
            `;

            await this.renderCategory(categoryData, categoryPath);
            
        } catch (error) {
            console.error('Error initializing category page:', error);
            TemplateEngine.showError(error.message);
        } finally {
            TemplateEngine.hideLoading();
        }
    }

    static async renderCategory(categoryData, categoryPath) {
        const contentDiv = document.getElementById('content');
        let html = '';

        // Check if this category has items (like sound projects)
        if (categoryData.items && categoryData.items.length > 0) {
            // This is a category with direct items (like sound)
            const items = [...categoryData.items];
            items.sort(TemplateEngine.sortByOrderDateFolder);

            items.forEach((project, index) => {
                if (project.title && project.title.trim()) {
                    html += TemplateEngine.createProjectHTML(project, `../${categoryPath}/`, index % 5);
                }
            });
        } else if (categoryData.categories && categoryData.categories.length > 0) {
            // This category has subcategories (like web, graphic)
            const projects = [];
            
            for (const folder of categoryData.categories) {
                try {
                    const folderPath = `../${categoryPath}/${folder}/`;
                    const itemInfo = await TemplateEngine.fetchJSON(folderPath + 'info.json');
                    itemInfo.project_folder = folder;
                    projects.push(itemInfo);
                } catch (err) {
                    console.error(`Error loading info.json for folder ${folder}:`, err);
                }
            }

            projects.sort(TemplateEngine.sortByOrderDateFolder);
            
            projects.forEach((project, index) => {
                html += TemplateEngine.createProjectHTML(project, `../${categoryPath}/`, index % 5);
            });
        }

        // Add spacer
        html += '<div class="item item-main" style="height: 1.5em;"></div>';

        contentDiv.innerHTML = html;

        // Set up handlers after content is loaded
        if (window.setupImageHandlers) {
            setupImageHandlers();
        }
        if (window.setupProjectGrid) {
            setupProjectGrid();
        }
    }
}

// Project Renderer
class ProjectRenderer {
    static async init(categoryPath, projectPath) {
        try {
            // Load the project's info.json
            const projectData = await TemplateEngine.fetchJSON(`../../${categoryPath}/${projectPath}/info.json`);
            
            // Update page title and header
            document.title = `${projectData.title} — JP Carrascal`;
            document.querySelector('.project_title').textContent = projectData.title;
            
            // Update meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = `${projectData.description || projectData.title} — JP Carrascal`;
            }

            // Load category data for breadcrumbs
            const categoryData = await TemplateEngine.fetchJSON(`../../${categoryPath}/info.json`);

            // Update breadcrumbs
            const breadcrumbs = document.getElementById('breadcrumbs');
            breadcrumbs.innerHTML = `
                <a href="../../">Portfolio</a>
                <span class="sep">&#9667;</span>
                <a href="../">${categoryData.title}</a>
                <span class="sep">&#9667;</span>
                <a href="#">${projectData.title}</a>
            `;

            await this.renderProject(projectData, categoryPath, projectPath);
            
        } catch (error) {
            console.error('Error initializing project page:', error);
            TemplateEngine.showError(error.message);
        } finally {
            TemplateEngine.hideLoading();
        }
    }

    static async renderProject(projectData, categoryPath, projectPath) {
        const contentDiv = document.getElementById('content');
        let html = '';

        // Add project description
        let title = projectData.title;
        if (projectData.date && projectData.date.trim()) {
            title += ` (${projectData.date})`;
        }

        html += `
        <div class="item item-main project-description">
            <h3 class="item-title">${title}</h3>
            <p class="item-description">${projectData.description}</p>
        </div>`;

        // Add project items if they exist
        if (projectData.items && projectData.items.length > 0) {
            const items = [...projectData.items];
            items.sort(TemplateEngine.sortByOrderDateFolder);

            items.forEach((item, index) => {
                if (item.title && item.title.trim()) {
                    html += TemplateEngine.createProjectItemHTML(item, `../../${categoryPath}/${projectPath}/`, index % 5);
                }
            });
        }

        // Add spacer
        html += '<div class="item item-main" style="height: 1.5em;"></div>';

        contentDiv.innerHTML = html;

        // Set up handlers after content is loaded
        if (window.setupImageHandlers) {
            setupImageHandlers();
        }
        if (window.setupProjectGrid) {
            setupProjectGrid();
        }
    }
}

// Make classes available globally
window.TemplateEngine = TemplateEngine;
window.CategoryRenderer = CategoryRenderer;
window.ProjectRenderer = ProjectRenderer;