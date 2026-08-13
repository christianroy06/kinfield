// Silence console output (does not prevent viewing/copying client-side source)
(() => {
  const noop = () => {};
  ['log', 'info', 'warn', 'error', 'debug', 'table', 'dir', 'trace', 'group', 'groupCollapsed', 'groupEnd'].forEach((method) => {
    try {
      console[method] = noop;
    } catch (_) {
      /* ignore */
    }
  });
})();

// Light inspect deterrents + funny prompts (bypassable; not real protection)
(() => {
  const funnyLines = [
    'Are you finding something? hahaha',
    'Looking for treasure in the DevTools? Nice try',
    'Psst… the secrets are not in Inspect Element',
    'Caught you peeking. Nothing to see here',
    'Code’s shy today. Come back never',
    'F12 won’t unlock the final boss, champ',
  ];

  const STORAGE_KEY = 'kinfield-inspect-unlocked';
  // Always start locked; unlock only via secret shortcut for this page load
  sessionStorage.removeItem(STORAGE_KEY);
  let unlocked = false;
  let toastTimer = 0;
  let lastShown = 0;

  const showFunnyPrompt = (message) => {
    const now = Date.now();
    if (now - lastShown < 900) return;
    lastShown = now;

    let toast = document.getElementById('inspect-funny-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'inspect-funny-toast';
      toast.setAttribute('role', 'status');
      toast.style.cssText = [
        'position:fixed',
        'left:50%',
        'bottom:28px',
        'transform:translateX(-50%) translateY(12px)',
        'z-index:100001',
        'max-width:min(92vw,420px)',
        'padding:14px 18px',
        'border-radius:8px',
        'background:#01293A',
        'color:#fff',
        'font:600 15px/1.4 Manrope,system-ui,sans-serif',
        'text-align:center',
        'box-shadow:0 12px 32px rgba(1,41,58,.28)',
        'opacity:0',
        'pointer-events:none',
        'transition:opacity .25s ease, transform .25s ease',
      ].join(';');
      document.body.appendChild(toast);
    }

    toast.textContent =
      message || funnyLines[Math.floor(Math.random() * funnyLines.length)];
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(12px)';
    }, 2200);
  };

  const setUnlocked = (value) => {
    unlocked = value;
    // In-memory only so refresh always returns to locked
    if (!unlocked) sessionStorage.removeItem(STORAGE_KEY);
    showFunnyPrompt(
      unlocked
        ? 'Secret unlocked. Inspect away'
        : 'Inspect locked again. Are you finding something? hahaha'
    );
  };

  // Secret shortcut: Ctrl + Alt + K (toggle inspect unlock)
  document.addEventListener('keydown', (event) => {
    const key = event.key?.toLowerCase?.() || '';
    if ((event.ctrlKey || event.metaKey) && event.altKey && key === 'k') {
      event.preventDefault();
      event.stopPropagation();
      setUnlocked(!unlocked);
    }
  });

  document.addEventListener('contextmenu', (event) => {
    if (unlocked) return;
    event.preventDefault();
    showFunnyPrompt();
  });

  document.addEventListener('keydown', (event) => {
    if (unlocked) return;

    const key = event.key?.toLowerCase?.() || '';
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    const isDevtoolsShortcut =
      key === 'f12' ||
      (ctrlOrMeta && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
      (ctrlOrMeta && key === 'u') ||
      (ctrlOrMeta && key === 's');

    if (isDevtoolsShortcut) {
      event.preventDefault();
      event.stopPropagation();
      showFunnyPrompt();
    }
  });

  document.addEventListener('dragstart', (event) => {
    if (unlocked) return;
    event.preventDefault();
    showFunnyPrompt();
  });
})();

// Sticky nav solid background on scroll
const siteNav = document.getElementById('site-nav');
const onScrollNav = () => {
  siteNav?.classList.toggle('is-scrolled', window.scrollY > 24);
};
onScrollNav();
window.addEventListener('scroll', onScrollNav, { passive: true });

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

// Testimonials slider (Swiper)
const quotes = [
  {
    text: '“Before joining Kinfield, I wasn’t sure I was developing the right skills for my future career. Through hands-on projects and real-world problem solving, I built confidence in my abilities. The mentors were responsive and genuinely invested in my growth, and the campus community felt welcoming and supportive from day one.”',
    name: 'Melanie Howirtz',
    meta: 'Undergraduate Student,\nComputer Science',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  },
  {
    text: '“The clinical placements and research labs made every semester feel connected to the world I wanted to work in after graduation. Faculty treated us like collaborators, not just students, and that changed how I approached every challenge.”',
    name: 'Marcus Chen',
    meta: 'Graduate Student,\nData Science',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
  },
  {
    text: '“I found a creative community here that challenged my craft and opened doors I did not know existed. Group studios, mentorship, and real client work helped me grow faster than I thought possible.”',
    name: 'Sofia Alvarez',
    meta: 'Undergraduate Student,\nBusiness Administration',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80',
  },
];

const quoteTrack = document.getElementById('quote-track');

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

if (quoteTrack && typeof Swiper !== 'undefined') {
  quoteTrack.innerHTML = quotes
    .map(
      (q, i) => `
    <article class="swiper-slide quote-slide">
      <blockquote class="m-0 font-sans text-[22px] font-normal not-italic leading-[1.4] tracking-normal text-navy sm:text-[24px] md:text-[28px] md:leading-[39.2px]">${escapeHtml(q.text)}</blockquote>
      <div class="mt-12 sm:mt-16 md:mt-24 lg:mt-32">
        <div class="flex min-w-0 items-start gap-4 md:gap-5">
          <img
            src="${escapeHtml(q.avatar)}"
            alt="${escapeHtml(q.name)}"
            width="120"
            height="120"
            class="h-20 w-20 shrink-0 rounded-[8px] object-cover sm:h-[120px] sm:w-[120px]"
            loading="${i === 0 ? 'eager' : 'lazy'}"
          />
          <div class="min-w-0 pt-0.5">
            <p class="m-0 font-sans text-[18px] font-medium leading-7 tracking-normal text-navy md:text-[20px]">${escapeHtml(q.name)}</p>
            <p class="m-0 mt-1 whitespace-pre-line font-sans text-base font-normal leading-[22.4px] tracking-normal text-[#555555]">${escapeHtml(q.meta)}</p>
          </div>
        </div>
      </div>
    </article>`
    )
    .join('');

  const quoteSwiper = new Swiper('#quote-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 650,
    loop: true,
    grabCursor: true,
    autoHeight: true,
    watchOverflow: true,
    observer: true,
    observeParents: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      prevEl: '#quote-prev',
      nextEl: '#quote-next',
    },
  });
}

// Events
const events = [
  {
    index: '01',
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
    index: '02',
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
    index: '03',
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

const eventsList = document.getElementById('events-list');
if (eventsList) {
  eventsList.innerHTML = events
    .map(
      (event) => `
    <li class="pt-6 md:pt-8 lg:pt-9 last:pb-6 last:md:pb-8 last:lg:pb-9">
      <div class="grid grid-cols-1 items-stretch overflow-hidden rounded-[8px] bg-[#F8FBFC] md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1.35fr)_minmax(0,1.5fr)] lg:py-7 lg:pl-7 xl:grid-cols-[243px_336px_335px_minmax(0,1fr)]">
          <div class="flex flex-col gap-8 border-line px-5 py-5 md:gap-10 md:px-6 md:py-6 lg:justify-between lg:gap-0 lg:border-r">
            <p class="m-0 font-sans text-[24px] font-semibold leading-none tracking-normal text-navy md:text-[28px]">${escapeHtml(event.index)}</p>
            <div>
              <div class="mb-4 h-px w-full bg-line"></div>
              <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-navy">${escapeHtml(event.day)}</p>
              <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-navy">${escapeHtml(event.date)}</p>
              <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-[#555555]">${escapeHtml(event.time)}</p>
            </div>
          </div>

          <div class="flex flex-col justify-between gap-6 border-line px-5 py-5 md:gap-8 md:px-6 md:py-6 lg:border-r">
            <div>
              <h3 class="m-0 font-sans text-[18px] font-medium leading-7 tracking-normal text-navy md:text-[20px]">${escapeHtml(event.title)}</h3>
              <p class="m-0 mt-3 font-sans text-base font-normal leading-[22.4px] tracking-normal text-[#555555]">${escapeHtml(event.description)}</p>
            </div>
            <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-navy">${escapeHtml(event.status)}</p>
          </div>

          <div class="flex flex-col justify-between gap-6 border-line px-5 py-5 md:gap-8 md:px-6 md:py-6 lg:border-r">
            <p class="m-0 font-sans text-[18px] font-normal leading-[25.2px] tracking-normal text-navy">Speaker</p>
            <div class="flex items-center gap-3">
              <img
                src="${escapeHtml(event.speakerImage)}"
                loading="lazy"
                alt="${escapeHtml(event.speakerName)}"
                width="48"
                height="48"
                class="h-12 w-12 shrink-0 rounded-[8px] object-cover"
              />
              <div class="min-w-0">
                <p class="m-0 font-sans text-[18px] font-medium leading-7 tracking-normal text-navy md:text-[20px]">${escapeHtml(event.speakerName)}</p>
                <p class="m-0 font-sans text-base font-normal leading-[22.4px] tracking-normal text-[#555555]">${escapeHtml(event.speakerRole)}</p>
              </div>
            </div>
          </div>

          <div class="flex w-full min-h-0 min-w-0 self-stretch max-lg:px-5 max-lg:pb-5 md:max-lg:px-6 md:max-lg:pb-6 lg:-my-7">
            <img
              src="${escapeHtml(event.image)}"
              alt="${escapeHtml(event.title)}"
              width="379"
              height="300"
              loading="lazy"
              class="aspect-[379/300] h-auto w-full rounded-[8px] object-cover object-center max-lg:max-h-[220px] lg:aspect-auto lg:h-full lg:min-h-full"
            />
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
