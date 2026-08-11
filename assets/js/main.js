// Sticky nav solid background on scroll
const siteNav = document.getElementById('site-nav');
const onScrollNav = () => {
  siteNav?.classList.toggle('is-scrolled', window.scrollY > 24);
};
onScrollNav();
window.addEventListener('scroll', onScrollNav, { passive: true });

// Animated custom cursor (desktop only)
(() => {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  const root = document.createElement('div');
  root.className = 'site-cursor';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<div class="site-cursor__ring"></div><div class="site-cursor__pointer"></div>';
  document.body.appendChild(root);
  document.body.classList.add('has-site-cursor');

  const ring = root.querySelector('.site-cursor__ring');
  const pointer = root.querySelector('.site-cursor__pointer');
  const hoverSelector = 'a, button, [role="button"], summary, label[for], input, textarea, select, .site-nav__btn, .burger-btn';

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let rx = x;
  let ry = y;
  let visible = false;

  const setPointerTransform = () => {
    const rotate = root.classList.contains('is-down') ? -4 : root.classList.contains('is-hover') ? -8 : 0;
    const scale = root.classList.contains('is-down') ? 0.92 : root.classList.contains('is-hover') ? 1.14 : 1;
    pointer.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
  };

  const tick = () => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    setPointerTransform();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  window.addEventListener(
    'mousemove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        root.classList.add('is-visible');
      }
      const over = e.target.closest?.(hoverSelector);
      root.classList.toggle('is-hover', Boolean(over));
    },
    { passive: true }
  );

  window.addEventListener('mousedown', () => root.classList.add('is-down'));
  window.addEventListener('mouseup', () => root.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => {
    visible = false;
    root.classList.remove('is-visible', 'is-hover', 'is-down');
  });
  document.addEventListener('mouseenter', () => {
    visible = true;
    root.classList.add('is-visible');
  });
})();

// Mobile nav
const menuBtn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');

const setMenuOpen = (open) => {
  mobileNav?.classList.toggle('open', open);
  menuBtn?.classList.toggle('is-open', open);
  menuBtn?.setAttribute('aria-expanded', String(open));
  menuBtn?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};

menuBtn?.addEventListener('click', () => {
  const willOpen = !mobileNav?.classList.contains('open');
  setMenuOpen(willOpen);
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach((el) => io.observe(el));

// Testimonials
const quotes = [
  {
    text: '“Before joining Kinfield, I wasn’t sure I was developing the right skills for my future career. Through hands-on projects and real-world problem solving, I built confidence in my abilities. The mentors were responsive and genuinely invested in my growth, and the campus community felt welcoming and supportive from day one.”',
    name: 'Melanie Howirtz',
    meta: 'Undergraduate Student,\nComputer Science',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  },
  {
    text: '“The clinical placements and research labs made every semester feel connected to the world I wanted to work in after graduation.”',
    name: 'Marcus Chen',
    meta: 'Graduate Student,\nData Science',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
  },
  {
    text: '“I found a creative community here that challenged my craft and opened doors I did not know existed.”',
    name: 'Sofia Alvarez',
    meta: 'Undergraduate Student,\nBusiness Administration',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80',
  },
];

let quoteIndex = 0;
const quoteText = document.getElementById('quote-text');
const quoteName = document.getElementById('quote-name');
const quoteMeta = document.getElementById('quote-meta');
const quoteAvatar = document.getElementById('quote-avatar');

function renderQuote(i, animate = true) {
  const q = quotes[i];
  if (!quoteText) return;

  const apply = () => {
    quoteText.textContent = q.text;
    quoteName.textContent = q.name;
    quoteMeta.textContent = q.meta;
    quoteAvatar.src = q.avatar;
    quoteAvatar.alt = q.name;
    quoteText.style.opacity = '1';
  };

  if (!animate) {
    apply();
    return;
  }

  quoteText.style.opacity = '0';
  setTimeout(apply, 180);
}

if (quoteText) {
  quoteText.style.transition = 'opacity 0.2s ease';
  renderQuote(quoteIndex, false);
}

document.getElementById('quote-prev')?.addEventListener('click', () => {
  quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length;
  renderQuote(quoteIndex);
});
document.getElementById('quote-next')?.addEventListener('click', () => {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  renderQuote(quoteIndex);
});

// Events
const events = [
  {
    index: '02',
    day: 'Wed,',
    date: 'April 16 2035',
    time: '14:00–15:15 WIB',
    title: 'Humanities Forum: Culture, Storytelling in the Digital Age',
    description: 'A look at how digital platforms are reshaping culture and storytelling today.',
    status: 'Open for Public',
    speakerName: 'Dr. Amaya Laurent',
    speakerRole: 'Dean of Humanities',
    speakerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=640&q=80',
  },
  {
    index: '03',
    day: 'Mon,',
    date: 'April 28 2035',
    time: '10:00–12:00 WIB',
    title: 'Open Campus Day',
    description: 'Tour classrooms, labs, and student spaces while meeting faculty and current students.',
    status: 'Open for Public',
    speakerName: 'James Whit',
    speakerRole: 'Admissions Lead',
    speakerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=640&q=80',
  },
  {
    index: '04',
    day: 'Fri,',
    date: 'May 09 2035',
    time: '17:30–19:00 WIB',
    title: 'Research Showcase',
    description: 'Explore student and faculty projects spanning science, design, and community impact.',
    status: 'Open for Public',
    speakerName: 'Omar Reyes',
    speakerRole: 'Research Director',
    speakerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=640&q=80',
  },
];

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const eventsList = document.getElementById('events-list');
if (eventsList) {
  eventsList.innerHTML = events
    .map(
      (event) => `
    <li class="last:border-b last:border-line">
      <div class="mx-auto max-w-site border-x border-[#EBF2F5] px-5 py-9 md:px-8 lg:px-9">
        <div class="grid grid-cols-1 items-stretch bg-[#F8FBFC] md:grid-cols-2 lg:grid-cols-[minmax(0,243px)_minmax(0,336px)_minmax(0,335px)_minmax(0,1fr)] xl:grid-cols-[243px_336px_335px_minmax(0,1fr)] lg:p-7 rounded-[8px]">
          <div class="flex flex-col justify-between border-line px-5 py-6 md:px-6 lg:border-r">
            <p class="m-0 font-sans text-[28px] font-semibold leading-none tracking-normal text-navy">${escapeHtml(event.index)}</p>
            <div>
              <div class="mb-4 h-px w-full bg-line"></div>
              <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-navy">${escapeHtml(event.day)}</p>
              <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-navy">${escapeHtml(event.date)}</p>
              <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-[#555555]">${escapeHtml(event.time)}</p>
            </div>
          </div>

          <div class="flex flex-col justify-between gap-8 border-line px-5 py-6 md:px-6 lg:border-r">
            <div>
              <h3 class="m-0 font-sans text-[20px] font-medium leading-7 tracking-normal text-navy">${escapeHtml(event.title)}</h3>
              <p class="m-0 mt-3 font-sans text-base font-normal leading-[22.4px] tracking-normal text-[#555555]">${escapeHtml(event.description)}</p>
            </div>
            <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-navy">${escapeHtml(event.status)}</p>
          </div>

          <div class="flex flex-col justify-between gap-8 border-line px-5 py-6 md:px-6 lg:border-r">
            <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-[#555555]">Speaker</p>
            <div class="flex items-center gap-3">
              <img
                src="${escapeHtml(event.speakerImage)}"
                loading="lazy"
                alt="${escapeHtml(event.speakerName)}"
                width="48"
                height="48"
                class="h-12 w-12 rounded-[8px] object-cover"
              />
              <div>
                <p class="m-0 font-sans text-[20px] font-medium leading-7 tracking-normal text-navy">${escapeHtml(event.speakerName)}</p>
                <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-[#555555]">${escapeHtml(event.speakerRole)}</p>
              </div>
            </div>
          </div>

          <div class="flex min-w-0 items-center p-5 md:p-6">
            <img
              src="${escapeHtml(event.image)}"
              alt="${escapeHtml(event.title)}"
              width="379"
              height="300"
              loading="lazy"
              class="aspect-[379/300] h-auto w-full max-h-[180px] rounded-[8px] object-cover object-center sm:max-h-[220px] lg:max-h-[240px] xl:max-h-[280px]"
            />
          </div>
        </div>
      </div>
    </li>`
    )
    .join('');
}

// One FAQ open at a time
document.querySelectorAll('details.faq').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (detail.open) {
      document.querySelectorAll('details.faq').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    }
  });
});

// Watch Intro — play inline without YouTube controls; custom mute toggle
const campusMedia = document.getElementById('campus-media');
const campusVideoWrap = document.getElementById('campus-video-wrap');
const watchIntroBtn = document.getElementById('watch-intro-btn');
const campusMuteBtn = document.getElementById('campus-mute-btn');
const INTRO_VIDEO_ID = '9GeYQGDg6mE';

let campusPlayer = null;
let campusIsMuted = true;
let campusIsPlaying = false;

const loadYouTubeAPI = () =>
  new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous();
      resolve();
    };
    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

const showMuteBtn = () => {
  campusMuteBtn?.classList.remove('hidden');
  campusMuteBtn?.classList.add('inline-flex');
};

const setMuteUI = (muted) => {
  campusIsMuted = muted;
  if (!campusMuteBtn) return;
  campusMuteBtn.setAttribute('aria-pressed', String(muted));
  campusMuteBtn.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');
  campusMuteBtn.querySelector('[data-icon="muted"]')?.classList.toggle('hidden', !muted);
  campusMuteBtn.querySelector('[data-icon="unmuted"]')?.classList.toggle('hidden', muted);
};

const setPlayUI = (playing) => {
  campusIsPlaying = playing;
  if (!watchIntroBtn) return;
  const label = watchIntroBtn.querySelector('[data-label]');
  if (label) label.textContent = playing ? 'Pause' : 'Watch Intro';
  watchIntroBtn.setAttribute('aria-label', playing ? 'Pause' : 'Watch Intro');
  watchIntroBtn.querySelector('[data-icon="play"]')?.classList.toggle('hidden', playing);
  watchIntroBtn.querySelector('[data-icon="pause"]')?.classList.toggle('hidden', !playing);
};

const createCampusPlayer = () =>
  new Promise((resolve) => {
    campusPlayer = new YT.Player('campus-video-player', {
      width: '100%',
      height: '100%',
      videoId: INTRO_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        iv_load_policy: 3,
        cc_load_policy: 0,
      },
      events: {
        onReady: (event) => {
          event.target.mute();
          setMuteUI(true);
          event.target.playVideo();
          showMuteBtn();
          setPlayUI(true);
          resolve(event.target);
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) setPlayUI(true);
          if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            setPlayUI(false);
          }
        },
      },
    });
  });

const toggleCampusVideo = async () => {
  if (!campusMedia || !campusVideoWrap || !watchIntroBtn) return;

  if (!campusPlayer) {
    campusVideoWrap.hidden = false;
    campusMedia.classList.add('is-playing');
    await loadYouTubeAPI();
    await createCampusPlayer();
    return;
  }

  if (campusIsPlaying) {
    campusPlayer.pauseVideo();
    setPlayUI(false);
  } else {
    campusPlayer.playVideo();
    setPlayUI(true);
    showMuteBtn();
  }
};

watchIntroBtn?.addEventListener('click', toggleCampusVideo);

campusMuteBtn?.addEventListener('click', () => {
  if (!campusPlayer) return;
  if (campusIsMuted) {
    campusPlayer.unMute();
    setMuteUI(false);
  } else {
    campusPlayer.mute();
    setMuteUI(true);
  }
});
