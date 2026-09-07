document$.subscribe(function () {
  var heroBanner = document.querySelector('.hero-banner');
  if (heroBanner) {
    heroBanner.addEventListener('mousemove', function (e) {
      var rect = heroBanner.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroBanner.style.transform = 'perspective(1000px) rotateY(' + (x * 3) + 'deg) rotateX(' + (-y * 3) + 'deg)';
    });
    heroBanner.addEventListener('mouseleave', function () {
      heroBanner.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    });
  }

  var statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count') || el.textContent);
          var duration = 1500;
          var start = performance.now();
          function animate(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + (el.getAttribute('data-suffix') || '');
            if (progress < 1) requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    statNumbers.forEach(function (n) { observer.observe(n); });
  }
});