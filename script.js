// ===== PRELOADER =====
window.addEventListener('load', function () {
  var pre = document.getElementById('preloader');
  if (pre) setTimeout(function () { pre.classList.add('hidden'); }, 1500);
});

// ===== CUSTOM CURSOR =====
(function () {
  var dot  = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  var mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = (mx - 3) + 'px';
    dot.style.top  = (my - 3) + 'px';
  });

  function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = (rx - 17) + 'px';
    ring.style.top  = (ry - 17) + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .project-card, input, textarea').forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
  });
})();

// ===== PARTICLES =====
(function () {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var colors = ['rgba(124,58,237,','rgba(6,182,212,','rgba(245,158,11,','rgba(255,255,255,','rgba(236,72,153,'];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function Particle() { this.reset(); }
  Particle.prototype.reset = function () {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 2 + 0.3;
    this.sx    = (Math.random() - 0.5) * 0.35;
    this.sy    = (Math.random() - 0.5) * 0.35;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.tw    = Math.random() * Math.PI * 2;
    this.tws   = Math.random() * 0.04 + 0.01;
    this.op    = Math.random() * 0.5 + 0.1;
  };
  Particle.prototype.update = function () {
    this.x  += this.sx; this.y += this.sy;
    this.tw += this.tws;
    this.op  = 0.2 + Math.abs(Math.sin(this.tw)) * 0.5;
    if (this.x < 0 || this.x > canvas.width)  this.sx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.sy *= -1;
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.op + ')';
    ctx.fill();
    if (this.size > 1.5) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = this.color + (this.op * 0.15) + ')';
      ctx.fill();
    }
  };

  function init() {
    particles = [];
    var n = Math.min(90, Math.floor(canvas.width * canvas.height / 12000));
    for (var i = 0; i < n; i++) particles.push(new Particle());
  }
  init();
  window.addEventListener('resize', init);

  var stars = [];
  function Star() {
    this.x     = Math.random() * canvas.width * 0.7;
    this.y     = Math.random() * canvas.height * 0.4;
    this.len   = Math.random() * 120 + 60;
    this.speed = Math.random() * 7 + 5;
    this.op    = 1;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
  }
  Star.prototype.update = function () {
    this.x  += Math.cos(this.angle) * this.speed;
    this.y  += Math.sin(this.angle) * this.speed;
    this.op -= 0.018;
  };
  Star.prototype.draw = function () {
    var g = ctx.createLinearGradient(
      this.x, this.y,
      this.x - Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len
    );
    g.addColorStop(0,   'rgba(255,255,255,' + this.op + ')');
    g.addColorStop(0.4, 'rgba(124,58,237,'  + (this.op * 0.6) + ')');
    g.addColorStop(1,   'rgba(6,182,212,0)');
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len
    );
    ctx.strokeStyle = g;
    ctx.lineWidth   = 1.5;
    ctx.stroke();
  };
  setInterval(function () { if (Math.random() < 0.5) stars.push(new Star()); }, 3500);

  function connect() {
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(124,58,237,' + (0.06 * (1 - d / 90)) + ')';
          ctx.lineWidth   = 0.4;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars = stars.filter(function (s) { return s.op > 0; });
    stars.forEach(function (s) { s.update(); s.draw(); });
    particles.forEach(function (p) { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== SPOTLIGHT ON PROJECT CARDS =====
document.addEventListener('mousemove', function (e) {
  document.querySelectorAll('.project-card').forEach(function (card) {
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left)  + 'px');
    card.style.setProperty('--my', (e.clientY - r.top)   + 'px');
  });
});

// ===== TYPING EFFECT =====
(function () {
  var texts = [
    'Full Stack Developer Trainee',
    'Frontend Enthusiast',
    'Backend Explorer',
    'Problem Solver',
    'Space Code Explorer 🚀'
  ];
  var i = 0, j = 0, del = false;
  var el = document.getElementById('typingText');
  if (!el) return;
  function type() {
    var cur = texts[i];
    el.textContent = del ? cur.substring(0, j - 1) : cur.substring(0, j + 1);
    del ? j-- : j++;
    var spd = del ? 28 : 58;
    if (!del && j === cur.length)  { spd = 2000; del = true; }
    else if (del && j === 0)       { del = false; i = (i + 1) % texts.length; spd = 500; }
    setTimeout(type, spd);
  }
  setTimeout(type, 2500);
})();

// ===== SCROLL EFFECTS =====
window.addEventListener('scroll', function () {
  var st = document.documentElement.scrollTop;
  var sh = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('scrollProgress').style.width = (st / sh * 100) + '%';
  document.getElementById('header').classList.toggle('scrolled', st > 50);
  document.getElementById('backToTop').classList.toggle('show', st > 400);
});

// ===== SCROLL REVEAL =====
var revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

// ===== SKILL BARS =====
var skillsDone = false;
function checkSkills() {
  if (skillsDone) return;
  var sec = document.getElementById('skills');
  if (!sec) return;
  if (sec.getBoundingClientRect().top < window.innerHeight - 80) {
    skillsDone = true;
    document.querySelectorAll('.skill-fill').forEach(function (b) {
      b.style.width = b.getAttribute('data-width') + '%';
    });
  }
}
window.addEventListener('scroll', checkSkills);
window.addEventListener('load',   checkSkills);

// ===== COUNTERS =====
var countersDone = false;
function checkCounters() {
  if (countersDone) return;
  var sec = document.getElementById('achievements');
  if (!sec) return;
  if (sec.getBoundingClientRect().top < window.innerHeight - 80) {
    countersDone = true;
    document.querySelectorAll('.ach-value').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'));
      var count  = 0;
      var inc    = Math.ceil(target / 60);
      function update() {
        count = Math.min(count + inc, target);
        el.textContent = count < target ? count : target + '+';
        if (count < target) requestAnimationFrame(update);
      }
      update();
    });
  }
}
window.addEventListener('scroll', checkCounters);
window.addEventListener('load',   checkCounters);

// ===== ACTIVE NAV HIGHLIGHT =====
window.addEventListener('scroll', function () {
  var scrollY = window.scrollY + 160;
  document.querySelectorAll('section[id]').forEach(function (sec) {
    var link = document.querySelector('nav a[href="#' + sec.id + '"]');
    if (link) {
      link.classList.toggle(
        'active',
        scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight
      );
    }
  });
});

// ===== PROJECT MODAL =====
var projectData = {
  'To-Do List':              { desc: 'A clean and interactive task manager with local storage.',                      tech: 'HTML • CSS • JavaScript',             link: 'https://yashwantchatti005.github.io/To-Do-List/'                          },
  'E-Commerce Website':      { desc: 'Mini shopping website with products, cart and checkout.',                       tech: 'HTML • CSS • Bootstrap • JavaScript',  link: 'https://yashwantchatti005.github.io/Yash-mart/'                           },
  'Chat Application':        { desc: 'Real-time chat app using Firebase for instant messaging.',                      tech: 'HTML • CSS • JavaScript • Firebase',   link: 'https://yashwantchatti005.github.io/chatapplication/'                     },
  'MyExpense':               { desc: 'Personal expense tracker with interactive charts.',                             tech: 'HTML • CSS • JavaScript • Chart.js',   link: 'https://yashwantchatti005.github.io/MyExpense/'                           },
  'Portfolio':               { desc: 'This portfolio — fully responsive with space galaxy theme.',                    tech: 'HTML • CSS • JavaScript',             link: '#'                                                                        },
  'College Lost and Found':  { desc: 'A web platform for college students to report and find lost items on campus.',  tech: 'HTML • CSS • JavaScript',             link: 'https://college-lost-and-found-production.up.railway.app/'                },
  'Google Clone':            { desc: "A responsive React app replicating Google's core UI and search experience.",    tech: 'React • JavaScript • CSS',            link: 'https://google-clone-ds6l.vercel.app/'                                    },
  'Inventory Logistics Java':{ desc: 'Console-based Java app for inventory management and order tracking using OOP.', tech: 'Java • OOP • Collections',            link: 'https://github.com/yashwantchatti005/Inventory-Logistics-Java'            },
  'BMW Car Showcase':        { desc: 'A responsive BMW car showcase webpage with sleek design and animations.',       tech: 'HTML • CSS • JavaScript',             link: 'https://yashwantchatti005.github.io/BMW-car/'                             }
};

function openModal(name) {
  var d = projectData[name];
  if (!d) return;
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalDesc').textContent  = d.desc;
  document.getElementById('modalTech').textContent  = d.tech;
  document.getElementById('modalLink').href         = d.link;
  document.getElementById('projectModal').classList.add('show');
}
function closeModal() { document.getElementById('projectModal').classList.remove('show'); }
document.getElementById('projectModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ===== EMAILJS =====
if (typeof emailjs !== 'undefined') emailjs.init('kVWcWG8suc_OpURt_');

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var btn  = this.querySelector('button');
  var orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled  = true;

  if (typeof emailjs !== 'undefined') {
    emailjs.send('service_lie3zjj', 'template_18b1jim', {
      name:    document.getElementById('name').value,
      email:   document.getElementById('email').value,
      message: document.getElementById('message').value
    }).then(function () {
      showEmailModal('✅ Sent!', "Thanks! I'll get back to you soon.");
      btn.innerHTML = orig; btn.disabled = false;
      document.getElementById('contactForm').reset();
    }).catch(function () {
      showEmailModal('❌ Failed', 'Something went wrong. Try again.');
      btn.innerHTML = orig; btn.disabled = false;
    });
  } else {
    showEmailModal('✅ Sent!', 'Thanks for reaching out!');
    btn.innerHTML = orig; btn.disabled = false;
    document.getElementById('contactForm').reset();
  }
});

function showEmailModal(title, msg) {
  document.getElementById('emailTitle').textContent   = title;
  document.getElementById('emailMessage').textContent = msg;
  document.getElementById('emailModal').classList.add('show');
}
function closeEmailModal() { document.getElementById('emailModal').classList.remove('show'); }
document.getElementById('emailModal').addEventListener('click', function (e) {
  if (e.target === this) closeEmailModal();
});

// ===== HAMBURGER / MOBILE NAV =====
(function () {
  var hamburger = document.getElementById('hamburger');
  var nav       = document.getElementById('nav');
  if (!hamburger || !nav) return;

  function closeMenu() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  // Close when a nav link is clicked (smooth-scroll to section)
  document.querySelectorAll('nav a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href   = this.getAttribute('href');
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerHeight = document.getElementById('header').offsetHeight;
        window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' });
      }
      closeMenu();
    });
  });

  // Close on outside click (tap outside nav on mobile)
  document.addEventListener('click', function (e) {
    if (
      nav.classList.contains('active') &&
      !nav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

// ===== BACK TO TOP =====
document.getElementById('backToTop').addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== CERTIFICATE IMAGE MODAL =====
;(function () {
  var modal   = document.getElementById('certImgModal');
  var closeBtn = document.getElementById('certImgClose');
  var imgEl   = document.getElementById('certImgEl');
  var titleEl = document.getElementById('certImgTitle');
  var orgEl   = document.getElementById('certImgOrg');

  function openCert(card) {
    imgEl.src            = card.dataset.img;
    titleEl.textContent  = card.dataset.title;
    orgEl.textContent    = card.dataset.org;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeCert() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(function () { imgEl.src = ''; }, 400);
  }

  document.querySelectorAll('.cert-card2').forEach(function (card) {
    card.addEventListener('click', function () { openCert(card); });
  });

  closeBtn.addEventListener('click', closeCert);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeCert(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCert(); });
})();
