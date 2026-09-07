document$.subscribe(function () {

  /* ===== 1. 滚动进度条 ===== */
  var progressBar = document.createElement('div');
  progressBar.className = 'yi-scroll-progress';
  document.body.appendChild(progressBar);

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    var header = document.querySelector('.md-header');
    if (header) {
      if (scrollTop > 50) header.classList.add('scroll-transparent');
      else header.classList.remove('scroll-transparent');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== 2. Hero Banner ===== */
  var hero = document.querySelector('.hero-banner');
  if (hero) {
    var glow = document.createElement('div');
    glow.className = 'hero-glow';
    hero.appendChild(glow);

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      hero.style.transform = 'perspective(1200px) rotateX(' + ((0.5 - y) * 5).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 5).toFixed(2) + 'deg)';
      glow.style.left = (x * 100) + '%';
      glow.style.top = (y * 100) + '%';
      glow.style.transform = 'translate(-50%, -50%)';
    });
    hero.addEventListener('mouseleave', function () {
      hero.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
    });
  }

  /* ===== 3. 打字机 ===== */
  document.querySelectorAll('[data-typing]').forEach(function (el) {
    var text = el.getAttribute('data-typing') || el.textContent;
    el.textContent = '';
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.appendChild(cursor);

    function startType() {
      var i = 0;
      function step() {
        if (i < text.length) {
          el.insertBefore(document.createTextNode(text[i]), cursor);
          i++;
          setTimeout(step, 70 + Math.random() * 40);
        }
      }
      step();
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(startType, 400);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  /* ===== 4. 数字计数 ===== */
  var statObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count') || el.textContent);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = performance.now();
        function anim(now) {
          var p = Math.min((now - start) / 1600, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(target * e) + suffix;
          if (p < 1) requestAnimationFrame(anim);
        }
        requestAnimationFrame(anim);
        statObs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stat-number').forEach(function (n) { statObs.observe(n); });

  /* ===== 5. Feature Cards 3D + 光晕 ===== */
  document.querySelectorAll('.feature-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      var cx = r.width / 2, cy = r.height / 2;
      var ry = ((x - cx) / cx * 4).toFixed(2);
      var rx = ((cy - y) / cy * 4).toFixed(2);
      card.style.transform = 'translateY(-6px) perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

  /* ===== 6. 滚动入场 ===== */
  document.querySelectorAll('.feature-grid, .stat-bar, .yi-terminal, .yi-timeline, .yi-manage-grid, .yi-progress-grid, .yi-reveal').forEach(function (el) {
    el.classList.add('yi-reveal');
  });

  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('yi-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.yi-reveal').forEach(function (el) { revealObs.observe(el); });

  if (hero) { hero.classList.add('yi-visible'); }

  /* ===== 7. 纳新悬浮卡 ===== */
  var fc = document.querySelector('.yi-float-card');
  if (!fc) {
    fc = document.createElement('a');
    fc.className = 'yi-float-card';
    fc.href = 'https://qm.qq.com/q/1021582644';
    fc.target = '_blank';
    fc.innerHTML = '<span class="yi-float-card-dot"></span><span>27级纳新中</span><span>加入QQ群</span>';
    document.body.appendChild(fc);
    setTimeout(function () { fc.classList.add('yi-show'); }, 800);
  } else {
    fc.classList.add('yi-show');
  }

  /* ===== 8. Tab 涟漪 ===== */
  document.querySelectorAll('.md-tabs__link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var r = link.getBoundingClientRect();
      var size = Math.max(r.width, r.height);
      var ripple = document.createElement('span');
      ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.2);pointer-events:none;' +
        'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - r.left - size / 2) + 'px;' +
        'top:' + (e.clientY - r.top - size / 2) + 'px;transform:scale(0);animation:tabRipple 0.6s ease-out;';
      link.style.position = 'relative';
      link.style.overflow = 'hidden';
      link.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  /* ===== 9. 终端逐行 ===== */
  document.querySelectorAll('.yi-terminal').forEach(function (term) {
    var lines = term.querySelectorAll('.yi-terminal-line');
    lines.forEach(function (line) {
      line.style.opacity = '0';
      line.style.transform = 'translateX(-10px)';
      line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    var termObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          lines.forEach(function (line, idx) {
            setTimeout(function () {
              line.style.opacity = '1';
              line.style.transform = 'translateX(0)';
            }, idx * 200 + 200);
          });
          termObs.unobserve(term);
        }
      });
    }, { threshold: 0.4 });
    termObs.observe(term);
  });

  /* ===== 10. 平滑滚动 ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.getElementById(this.getAttribute('href').substring(1));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ===== 11. 进度条动画 ===== */
  document.querySelectorAll('.yi-progress-fill').forEach(function (bar) {
    var target = bar.style.width || bar.getAttribute('data-width') || '0%';
    bar.style.width = '0%';
    var pObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () { bar.style.width = target; }, 200);
          pObs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    pObs.observe(bar);
  });

  /* ===== 12. Timeline 入场 ===== */
  document.querySelectorAll('.yi-timeline-item').forEach(function (item, idx) {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    item.style.transitionDelay = (idx * 0.1) + 's';

    var tObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
          tObs.unobserve(item);
        }
      });
    }, { threshold: 0.2 });
    tObs.observe(item);
  });

  /* ===== 全局 keyframes ===== */
  if (!document.getElementById('yi-anim-styles')) {
    var s = document.createElement('style');
    s.id = 'yi-anim-styles';
    s.textContent = '@keyframes tabRipple { to { transform: scale(4); opacity: 0; } }';
    document.head.appendChild(s);
  }

});