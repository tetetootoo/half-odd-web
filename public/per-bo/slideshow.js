(() => {
 const gallery = document.querySelector('.workshop-slider');
 if (!gallery) return;
 const slides = [...gallery.querySelectorAll('.workshop-slide')];
 const prev = gallery.querySelector('.slide-prev');
 const next = gallery.querySelector('.slide-next');
 const count = gallery.querySelector('.slider-count');
 let index = 0;
 function show(value) {
  index = (value + slides.length) % slides.length;
  slides.forEach((slide,i) => { slide.hidden = i !== index; });
  count.textContent = `${index + 1} / ${slides.length}`;
 }
 function labels() {
  const english = document.documentElement.lang === 'en';
  prev.textContent = english ? 'Previous' : 'Forrige';
  next.textContent = english ? 'Next' : 'Næste';
  gallery.setAttribute('aria-label',english ? 'Workshop boutique and showroom' : 'Værkstedsbutik og showroom');
  slides.forEach((slide,i) => { slide.alt = english ? `Per Bo workshop boutique and showroom, photo ${i+1}` : `Per Bos værkstedsbutik og showroom, foto ${i+1}`; });
 }
 prev.addEventListener('click',() => show(index-1));
 next.addEventListener('click',() => show(index+1));
 gallery.addEventListener('keydown',event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
   event.preventDefault();show(index + (event.key === 'ArrowRight' ? 1 : -1));
  }
 });
 let startX = 0;
 gallery.addEventListener('touchstart',event => {startX = event.changedTouches[0].clientX;},{passive:true});
 gallery.addEventListener('touchend',event => {
  const delta = event.changedTouches[0].clientX-startX;
  if(Math.abs(delta)>50) show(index + (delta<0 ? 1 : -1));
 },{passive:true});
 new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 labels();show(0);
})();
