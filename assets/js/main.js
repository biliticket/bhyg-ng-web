// 粒子背景：参考 27.hoshioto 的星空氛围，以轻量原生实现
(function initParticles() {
  const container = document.getElementById('particles-js');
  if (!container) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  let width = window.innerWidth;
  let height = window.innerHeight;
  const particles = [];
  const maxParticles = Math.min(240, Math.floor(width / 6));

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };

  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      speedY: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.6 + 0.4,
      twinkle: Math.random() * 0.4 + 0.6
    });
  }

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y += p.speedY;
      if (p.y > height + 10) {
        p.y = -10;
        p.x = Math.random() * width;
      }
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 8);
      gradient.addColorStop(0, `rgba(124, 242, 255, ${0.8 * p.twinkle})`);
      gradient.addColorStop(1, 'rgba(6, 4, 20, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.radius * 8, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(render);
  };

  render();
})();

// 移动端导航折叠
(function initGlobalNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('globalNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
})();

// 倒计时设置，默认指向两天后的上午 10 点，可根据需求修改
(function initCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  const target = new Date();
  target.setDate(target.getDate() + 2);
  target.setHours(10, 0, 0, 0);

  const update = () => {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      countdownEl.textContent = '即将开售，敬请期待';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    countdownEl.textContent = `${String(days).padStart(2, '0')}天 ${String(hours).padStart(2, '0')}时 ${String(minutes).padStart(2, '0')}分 ${String(seconds).padStart(2, '0')}秒`;
  };

  update();
  setInterval(update, 1000);
})();

// 滚动淡入动画，提升仪式感
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('#mainVisual, #information, #topics, #movie, #features, #guide, #security, #timeline, #faq, #download, .banner, .topicCard').forEach((el) => {
    if (!el.classList.contains('willReveal')) {
      el.classList.add('willReveal');
    }
    observer.observe(el);
  });
})();

// CLI 动画文本渲染
(function initHeroTerminal() {
  const outputEl = document.getElementById('terminalOutput');
  if (!outputEl) return;

  const script = [
    { text: '$ ./bhyg -ui cll', deleteAfter: 1, appendAfter: 'i' },
    { text: '' },
    { text: '请选择功能模块:' },
    { text: '  1. 票务配置' },
    { text: '  2. 抢票执行' },
    { text: '  3. 大会员任务' },
    { text: '  4. 系统设置' },
    { text: '  5. 账号管理' },
    { text: '  6. 退出', pauseAfter: 420 },
    { text: '' },
    { text: '正在载入票务配置...' },
    { text: '项目 ID: 921134 · 热门项目' },
    { text: '票种明细: VIP 套票 (SKU 5180) · 数量 2 张' },
    { text: '抢票节奏: 0.30s / 请求 · 库存跟踪已开启', pauseAfter: 600 }
  ];

  const typeEntry = (index) => {
    if (index >= script.length) {
      const cursor = outputEl.querySelector('.terminal__cursor');
      if (cursor) cursor.remove();
      return;
    }

    const entry = script[index];
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal__line';
    const cursorEl = document.createElement('span');
    cursorEl.className = 'terminal__cursor';
    lineEl.appendChild(cursorEl);
    outputEl.appendChild(lineEl);

    let current = '';

    const updateLine = () => {
      lineEl.textContent = current;
      lineEl.appendChild(cursorEl);
      outputEl.scrollTop = outputEl.scrollHeight;
    };

    const typeChars = (chars, onComplete) => {
      if (!chars.length) {
        onComplete();
        return;
      }
      const [first, ...rest] = chars;
      current += first;
      updateLine();
      setTimeout(() => typeChars(rest, onComplete), 42 + Math.random() * 32);
    };

    const deleteChars = (count, onComplete) => {
      if (!count) {
        onComplete();
        return;
      }
      current = current.slice(0, -1);
      updateLine();
      setTimeout(() => deleteChars(count - 1, onComplete), 55 + Math.random() * 28);
    };

    const appendChars = (text, onComplete) => {
      if (!text) {
        onComplete();
        return;
      }
      typeChars(text.split(''), onComplete);
    };

    const finishEntry = () => {
      const pause = entry.pauseAfter ?? 240;
      setTimeout(() => typeEntry(index + 1), pause);
    };

    const startTyping = () => {
      if (entry.text) {
        typeChars(entry.text.split(''), () => {
          if (entry.deleteAfter) {
            deleteChars(entry.deleteAfter, () => {
              appendChars(entry.appendAfter || '', finishEntry);
            });
          } else {
            appendChars(entry.appendAfter || '', finishEntry);
          }
        });
      } else {
        appendChars(entry.appendAfter || '', finishEntry);
      }
    };

    startTyping();
  };

  typeEntry(0);
})();

// Loading 遮罩延迟消失
(function hideLoading() {
  const loading = document.getElementById('loading');
  if (!loading) return;
  setTimeout(() => {
    loading.style.display = 'none';
  }, 2200);
})();
