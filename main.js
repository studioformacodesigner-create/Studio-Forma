/* Forma Design · animações (fade in/out e parallax) e botão fixo */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  // Fade in ao entrar na tela, fade out ao sair por cima (e volta ao rolar para cima)
  var items = document.querySelectorAll('.rv');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('in'); e.target.classList.remove('out-up'); }
        else if (e.boundingClientRect.top < 0) { e.target.classList.add('out-up'); e.target.classList.remove('in'); }
        else { e.target.classList.remove('in','out-up'); }
      });
    }, { rootMargin: '-6% 0px -8% 0px', threshold: 0.12 });
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('in'); });
  }

  // Parallax suave nas imagens
  var px = [].slice.call(document.querySelectorAll('[data-px]'));
  if (!reduce && px.length) {
    var ticking = false;
    function update(){
      var vh = window.innerHeight;
      px.forEach(function(img){
        var box = img.parentElement.getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) return;
        var speed = parseFloat(img.getAttribute('data-px')) || 0.1;
        var center = box.top + box.height / 2 - vh / 2;
        var max = box.height * 0.15;
        var y = Math.max(-max, Math.min(max, -center * speed)) - max / 2;
        img.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Menu some ao rolar para baixo e volta ao rolar para cima
  var nav = document.querySelector('.nav'), lastY = window.scrollY;
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    nav.classList.toggle('hide', y > 120 && y > lastY);
    lastY = y;
  }, { passive: true });

  // Slideshow: troca suave de imagem (crossfade)
  var slides = document.querySelectorAll('.topshow .slide');
  if (slides.length > 1) {
    var cur = 0;
    setInterval(function(){
      if (document.hidden) return;
      slides[cur].classList.remove('on');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('on');
    }, 2000);
  }

  // Botão fixo do WhatsApp aparece depois da abertura
  var fab = document.querySelector('.fab');
  var heroBtn = document.querySelector('.hero .btn');
  var finalSec = document.querySelector('.final');
  if (fab && 'IntersectionObserver' in window) {
    var heroVisible = true, finalVisible = false;
    function setFab(){ fab.classList.toggle('show', !heroVisible && !finalVisible); }
    new IntersectionObserver(function(e){ heroVisible = e[0].isIntersecting || e[0].boundingClientRect.top > 0; setFab(); }).observe(heroBtn);
    new IntersectionObserver(function(e){ finalVisible = e[0].isIntersecting; setFab(); }, { threshold: 0.25 }).observe(finalSec);
  } else if (fab) { fab.classList.add('show'); }
})();

/* Formulário do ebook (Formspree): envia sem sair da página e leva ao download */
(function () {
  var f = document.querySelector('form.lead');
  if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = f.querySelector('button[type=submit]');
    if (f.action.indexOf('SEU_ID') > -1) { location.href = 'obrigado.html'; return; }
    btn.disabled = true; btn.textContent = 'Enviando...';
    fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw r; location.href = 'obrigado.html'; })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Baixar o ebook';
        var m = f.querySelector('.erro') || f.appendChild(Object.assign(document.createElement('p'), { className: 'erro lgpd' }));
        m.innerHTML = 'Não conseguimos enviar agora. Tente de novo ou <a class="ul" href="https://wa.me/5519984498731" target="_blank" rel="noopener">fale no WhatsApp</a>.';
      });
  });
})();
