document.getElementById('year').textContent = new Date().getFullYear();
const projects = [...document.querySelectorAll('.project')];
const grid = document.querySelector('.project-grid');
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active', b === button);b.setAttribute('aria-pressed', b === button ? 'true' : 'false');});
 const category = button.dataset.filter;
 grid.classList.toggle('filtered', category !== 'all');
 projects.forEach(p => p.hidden = category !== 'all' && p.dataset.category !== category);
}));
const dialog = document.getElementById('project-dialog');
const detailImage = document.getElementById('detail-image');
let activeImage = null;
let currentView = 'render';
function showImage(view) {
 if (!activeImage) return;
 currentView = view;
 const original = view === 'original';
 detailImage.src = original ? activeImage.original : activeImage.render;
 detailImage.alt = (original ? 'Originalfoto: ' : 'KI-Visualisierung: ') + activeImage.alt;
 document.getElementById('image-label').textContent = original ? 'Originalfoto · 2 / 2' : 'KI-Visualisierung · 1 / 2';
 dialog.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
}
function openProject(project) {
 const img = project.querySelector('img');
 activeImage = {render: img.src, original: img.src.replace('-render.png', '.jpg'), alt: img.alt};
 showImage('render');
 document.getElementById('detail-title').textContent = project.dataset.title;
 document.getElementById('detail-description').textContent = project.dataset.description;
 dialog.setAttribute('aria-labelledby', 'detail-title');
 dialog.showModal();
}
projects.forEach(project => project.addEventListener('click', () => openProject(project)));
document.querySelector('.hero-preview').addEventListener('click', () => openProject(projects[0]));
dialog.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => showImage(button.dataset.view)));
function toggleImage() { showImage(currentView === 'render' ? 'original' : 'render'); }
document.getElementById('image-prev').addEventListener('click', toggleImage);
document.getElementById('image-next').addEventListener('click', toggleImage);
dialog.addEventListener('keydown', event => {
 if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault(); toggleImage();}
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if(event.target === dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
