   
   // ===== PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 1500);
  }
});

    // ===== CUSTOM CURSOR =====
    (function() {
      const dot = document.getElementById('cursorDot');
      const ring = document.getElementById('cursorRing');
      if (!dot || !ring) return;
      let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

      document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX - 3 + 'px';
        dot.style.top = mouseY - 3 + 'px';
      });

      function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX - 17 + 'px';
        ring.style.top = ringY - 17 + 'px';
        requestAnimationFrame(animateRing);
      }
      animateRing();

      document.querySelectorAll('a, button, .project-card, input, textarea').forEach(function(el) {
        el.addEventListener('mouseenter', function() { ring.classList.add('hover'); });
        el.addEventListener('mouseleave', function() { ring.classList.remove('hover'); });
      });
    })();

    // ===== PARTICLES =====
    (function() {
      const canvas = document.getElementById('particles');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let particles = [];

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      var colors = [
        'rgba(124,58,237,',
        'rgba(6,182,212,',
        'rgba(245,158,11,',
        'rgba(255,255,255,',
        'rgba(236,72,153,'
      ];

      function Particle() {
        this.reset();
      }

      Particle.prototype.reset = function() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = (Math.random() - 0.5) * 0.35;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.04 + 0.01;
        this.opacity = Math.random() * 0.5 + 0.1;
      };

      Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.twinkle += this.twinkleSpeed;
        this.opacity = 0.2 + Math.abs(Math.sin(this.twinkle)) * 0.5;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      };

      Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
        if (this.size > 1.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
          ctx.fill();
        }
      };

      function init() {
        particles = [];
        var count = Math.min(90, Math.floor(canvas.width * canvas.height / 12000));
        for (var i = 0; i < count; i++) particles.push(new Particle());
      }
      init();

      // Shooting stars
      var shootingStars = [];

      function ShootingStar() {
        this.x = Math.random() * canvas.width * 0.7;
        this.y = Math.random() * canvas.height * 0.4;
        this.len = Math.random() * 120 + 60;
        this.speed = Math.random() * 7 + 5;
        this.opacity = 1;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      }

      ShootingStar.prototype.update = function() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.018;
      };

      ShootingStar.prototype.draw = function() {
        var grad = ctx.createLinearGradient(
          this.x, this.y,
          this.x - Math.cos(this.angle) * this.len,
          this.y - Math.sin(this.angle) * this.len
        );
        grad.addColorStop(0, 'rgba(255,255,255,' + this.opacity + ')');
        grad.addColorStop(0.4, 'rgba(124,58,237,' + (this.opacity * 0.6) + ')');
        grad.addColorStop(1, 'rgba(6,182,212,0)');
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.angle) * this.len, this.y - Math.sin(this.angle) * this.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };

      setInterval(function() {
        if (Math.random() < 0.5) shootingStars.push(new ShootingStar());
      }, 3500);

      function connect() {
        for (var a = 0; a < particles.length; a++) {
          for (var b = a + 1; b < particles.length; b++) {
            var dx = particles[a].x - particles[b].x;
            var dy = particles[a].y - particles[b].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              ctx.beginPath();
              ctx.strokeStyle = 'rgba(124,58,237,' + (0.06 * (1 - dist / 90)) + ')';
              ctx.lineWidth = 0.4;
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
        }
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shootingStars = shootingStars.filter(function(s) { return s.opacity > 0; });
        shootingStars.forEach(function(s) { s.update(); s.draw(); });
        particles.forEach(function(p) { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(animate);
      }
      animate();

      window.addEventListener('resize', init);
    })();

    // ===== SPOTLIGHT ON CARDS =====
    document.addEventListener('mousemove', function(e) {
      document.querySelectorAll('.project-card').forEach(function(card) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });

    // ===== TYPING EFFECT =====
    (function() {
      var texts = [
        "Full Stack Developer Trainee",
        "Frontend Enthusiast",
        "Backend Explorer",
        "Problem Solver",
        "Space Code Explorer 🚀"
      ];
      var i = 0, j = 0, del = false;
      var el = document.getElementById('typingText');
      if (!el) return;

      function type() {
        var cur = texts[i];
        el.textContent = del ? cur.substring(0, j - 1) : cur.substring(0, j + 1);
        del ? j-- : j++;
        var speed = del ? 28 : 58;
        if (!del && j === cur.length) { speed = 2000; del = true; }
        else if (del && j === 0) { del = false; i = (i + 1) % texts.length; speed = 500; }
        setTimeout(type, speed);
      }
      setTimeout(type, 2500);
    })();

    // ===== SCROLL EFFECTS =====
    window.addEventListener('scroll', function() {
      var st = document.documentElement.scrollTop;
      var sh = document.documentElement.scrollHeight - window.innerHeight;
      document.getElementById('scrollProgress').style.width = (st / sh * 100) + '%';
      document.getElementById('header').classList.toggle('scrolled', st > 50);
      document.getElementById('backToTop').classList.toggle('show', st > 400);
    });

    // ===== SCROLL REVEAL =====
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function(el) {
      revealObserver.observe(el);
    });

    // ===== SKILL BARS =====
    var skillsDone = false;

    function checkSkills() {
      if (skillsDone) return;
      var sec = document.getElementById('skills');
      if (!sec) return;
      if (sec.getBoundingClientRect().top < window.innerHeight - 80) {
        skillsDone = true;
        document.querySelectorAll('.skill-fill').forEach(function(bar) {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
      }
    }
    window.addEventListener('scroll', checkSkills);
    window.addEventListener('load', checkSkills);

    // ===== COUNTERS =====
    var countersDone = false;

    function checkCounters() {
      if (countersDone) return;
      var sec = document.getElementById('achievements');
      if (!sec) return;
      if (sec.getBoundingClientRect().top < window.innerHeight - 80) {
        countersDone = true;
        document.querySelectorAll('.ach-value').forEach(function(el) {
          var target = parseInt(el.getAttribute('data-target'));
          var count = 0;
          var inc = Math.ceil(target / 60);
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
    window.addEventListener('load', checkCounters);

    // ===== ACTIVE NAV =====
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY + 160;
      document.querySelectorAll('section[id]').forEach(function(sec) {
        var link = document.querySelector('nav a[href="#' + sec.id + '"]');
        if (link) {
          link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
        }
      });
    });

    // ===== PROJECT MODAL =====
    var projectData = {
      "To-Do List": {
        desc: "A clean and interactive task manager with local storage.",
        tech: "HTML • CSS • JavaScript",
        link: "https://yashwantchatti005.github.io/To-Do-List/"
      },
      "E-Commerce Website": {
        desc: "Mini shopping website with products, cart and checkout.",
        tech: "HTML • CSS • Bootstrap • JavaScript",
        link: "https://yashwantchatti005.github.io/Yash-mart/"
      },
      "Chat Application": {
        desc: "Real-time chat app using Firebase for instant messaging.",
        tech: "HTML • CSS • JavaScript • Firebase",
        link: "https://yashwantchatti005.github.io/chatapplication/"
      },
      "MyExpense": {
        desc: "Personal expense tracker with interactive charts.",
        tech: "HTML • CSS • JavaScript • Chart.js",
        link: "https://yashwantchatti005.github.io/MyExpense/"
      },
      "Portfolio": {
        desc: "This portfolio — fully responsive with space galaxy theme.",
        tech: "HTML • CSS • JavaScript",
        link: "#"
      }
    };

    function openModal(name) {
      var d = projectData[name];
      document.getElementById('modalTitle').textContent = name;
      document.getElementById('modalDesc').textContent = d.desc;
      document.getElementById('modalTech').textContent = d.tech;
      document.getElementById('modalLink').href = d.link;
      document.getElementById('projectModal').classList.add('show');
    }

    function closeModal() {
      document.getElementById('projectModal').classList.remove('show');
    }

    document.getElementById('projectModal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });

    // ===== EMAILJS =====
    if (typeof emailjs !== 'undefined') emailjs.init("kVWcWG8suc_OpURt_");

    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = this.querySelector('button');
      var orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      if (typeof emailjs !== 'undefined') {
        emailjs.send("service_lie3zjj", "template_18b1jim", {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          message: document.getElementById('message').value
        }).then(function() {
          showEmailModal("✅ Sent!", "Thanks! I'll get back to you soon.");
          btn.innerHTML = orig; btn.disabled = false;
          document.getElementById('contactForm').reset();
        }).catch(function() {
          showEmailModal("❌ Failed", "Something went wrong. Try again.");
          btn.innerHTML = orig; btn.disabled = false;
        });
      } else {
        showEmailModal("✅ Sent!", "Thanks for reaching out!");
        btn.innerHTML = orig; btn.disabled = false;
        document.getElementById('contactForm').reset();
      }
    });

    function showEmailModal(title, msg) {
      document.getElementById('emailTitle').textContent = title;
      document.getElementById('emailMessage').textContent = msg;
      document.getElementById('emailModal').classList.add('show');
    }

    function closeEmailModal() {
      document.getElementById('emailModal').classList.remove('show');
    }

    document.getElementById('emailModal').addEventListener('click', function(e) {
      if (e.target === this) closeEmailModal();
    });

    // ===== MOBILE NAV =====
    document.getElementById('hamburger').addEventListener('click', function() {
      this.classList.toggle('active');
      document.getElementById('nav').classList.toggle('active');
      document.getElementById('navOverlay').classList.toggle('active');
    });

    document.getElementById('navOverlay').addEventListener('click', function() {
      document.getElementById('hamburger').classList.remove('active');
      document.getElementById('nav').classList.remove('active');
      this.classList.remove('active');
    });

document.querySelectorAll('#nav a').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    const header = document.getElementById('header');
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {

      // Force header into scrolled state BEFORE calculating height
      header.classList.add('scrolled');

      // Wait for header transition to finish (important)
      setTimeout(() => {

        const headerHeight = header.offsetHeight;
        const sectionTop = targetSection.offsetTop;

        window.scrollTo({
          top: sectionTop - headerHeight,
          behavior: 'smooth'
        });

      }, 200); // matches your header transition timing
    }

    // close mobile nav
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('nav').classList.remove('active');
    document.getElementById('navOverlay').classList.remove('active');
  });
});

    // ===== BACK TO TOP =====
    document.getElementById('backToTop').addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
