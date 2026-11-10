// ROG Zephyrus Duo 2026 Core Animation & Interaction Engine
(function() {
  function initDuoEngine() {
    const wrap = document.querySelector('#ASUS-features');
    if (!wrap) return;

    // Prevent duplicate initializations on the same DOM element
    if (wrap.getAttribute('data-duo-engine-ready') === 'true') {
      window.dispatchEvent(new Event('scroll'));
      return;
    }
    wrap.setAttribute('data-duo-engine-ready', 'true');

    const _gsap = window.gsap;
    const _ScrollTrigger = window.ScrollTrigger;
    const _SplitText = window.SplitText;

    if (_gsap && _ScrollTrigger) {
      try {
        if (_SplitText) {
          _gsap.registerPlugin(_ScrollTrigger, _SplitText);
        } else {
          _gsap.registerPlugin(_ScrollTrigger);
        }
      } catch (err) {
        console.warn('GSAP registerPlugin warning:', err);
      }
    }

    // 1. Observe Fade on scroll
    function observeFade() {
      const fades = wrap.querySelectorAll('[observe-fade], .u-fade');
      if (fades.length === 0) return;
      const intersection = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.05) {
            entry.target.classList.add('is-fade');
            intersection.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      fades.forEach(el => intersection.observe(el));
    }

    // 2. Accordion Component
    function initAccordion() {
      const accordions = wrap.querySelectorAll('.js-accordion');
      accordions.forEach((accordion) => {
        const btns = accordion.querySelectorAll('.js-accordion-btn');
        btns.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            const item = e.currentTarget.closest('.js-accordion-item');
            if (!item) return;
            const wasActive = item.classList.contains('is-active');
            accordion.querySelectorAll('.js-accordion-item').forEach(it => it.classList.remove('is-active'));
            if (!wasActive) {
              item.classList.add('is-active');
            }
          });
        });
      });
    }

    // 3. Hero Video & SplitText (handleNew)
    function handleNew() {
      const video = wrap.querySelector('.new__video video');
      if (!video) return;

      const videoSrc = 'https://dlcdnwebimgs.asus.com/files/media/202511/fdb65e54-ad78-4bbc-9403-05c252096e92/v5/video/video.mp4';
      if (!video.getAttribute('src') || video.getAttribute('src') === '') {
        video.src = videoSrc;
      }
      video.muted = true;
      video.setAttribute('playsinline', '');

      let split = null;
      if (window.SplitText && window.gsap) {
        try {
          split = new SplitText('.js-split', {
            type: 'lines, words, chars',
            mask: 'lines',
            autoSplit: true,
          });
          if (split.words && split.words.length && window.gsap) {
            window.gsap.set(split.words, { y: 60, opacity: 0 });
          }
        } catch (e) {
          console.warn('SplitText init skipped:', e);
        }
      }

      function triggerSplit() {
        if (split && split.words && split.words.length && window.gsap) {
          window.gsap.to(split.words, {
            duration: 1,
            y: 0,
            opacity: 1,
            stagger: 0.04,
            ease: 'power2.out'
          });
        }
      }

      video.addEventListener('ended', () => {
        triggerSplit();
      });

      const tryPlay = () => {
        const p = video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tryPlay();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(video);
      tryPlay();

      // Fallback split reveal after 1.5s
      setTimeout(() => {
        triggerSplit();
      }, 1500);
    }

    // 4. Performance Tab
    function handlePerformance() {
      const performance = wrap.querySelector('.js-performance');
      if (!performance) return;
      const tab = performance.querySelectorAll('.performance__tab button.c-hightlight');
      const tabContent = performance.querySelectorAll('.performance__tab-content-item');

      tab.forEach((tabItem, index) => {
        tabItem.addEventListener('click', () => {
          tab.forEach(t => t.classList.remove('is-active'));
          tabContent.forEach(c => c.classList.remove('is-active'));
          tabItem.classList.add('is-active');
          if (tabContent[index]) {
            tabContent[index].classList.add('is-active');
          }
        });
      });
    }

    // 5. Mode Swiper & Accordion Preview
    function handleModeSwiper() {
      const swiperEl = wrap.querySelector('.js-mode-swiper');
      if (swiperEl && window.Swiper) {
        new Swiper(swiperEl, {
          slidesPerView: 'auto',
          spaceBetween: 10,
          centerInsufficientSlides: true,
          observer: true,
          observeParents: true,
          lazy: true,
          rewind: true,
          on: {
            click: function() {
              setTimeout(() => {
                if (typeof this.slideTo === 'function' && typeof this.clickedIndex === 'number') {
                  this.slideTo(this.clickedIndex);
                }
              }, 50);
            },
          },
          breakpoints: {
            1200: {
              direction: 'vertical',
            }
          },
          navigation: {
            nextEl: swiperEl.querySelector('.swiper-button-next'),
            prevEl: swiperEl.querySelector('.swiper-button-prev'),
          },
          pagination: {
            el: swiperEl.querySelector('.swiper-pagination'),
            type: 'progressbar',
          },
        });
      }

      const accordionItem = wrap.querySelectorAll('.mode .c-accordion');
      const modeImg = wrap.querySelectorAll('.mode__img');
      accordionItem.forEach((item, index) => {
        item.addEventListener('click', () => {
          accordionItem.forEach(a => a.classList.remove('is-active'));
          item.classList.add('is-active');
          modeImg.forEach(img => img.classList.remove('is-active'));
          if (modeImg[index]) {
            modeImg[index].classList.add('is-active');
          }
        });
      });
    }

    // 6. Performance Dual Swiper
    function handlePerformanceSwiper() {
      const performanceSwiper = wrap.querySelector('.js-performance-swiper');
      const performanceSwiperThumb = wrap.querySelector('.js-performance-swiper-thumb');
      if (!performanceSwiper || !performanceSwiperThumb || !window.Swiper) return;

      const swiperTab = performanceSwiperThumb.querySelectorAll('.c-swiper__tab');

      let swiper = new Swiper(performanceSwiperThumb, {
        spaceBetween: 20,
        slidesPerView: 'auto',
        freeMode: true,
        watchSlidesProgress: true,
        centerInsufficientSlides: true,
        observer: true,
        observeParents: true,
        rewind: true,
        breakpoints: {
          768: {
            spaceBetween: 40,
          }
        },
      });

      let swiper2 = new Swiper(performanceSwiper, {
        effect: 'fade',
        autoHeight: true,
        observer: true,
        observeParents: true,
        rewind: true,
        thumbs: {
          swiper: swiper,
        },
      });

      swiperTab.forEach((tabItem, index) => {
        tabItem.addEventListener('click', () => {
          swiper.slideTo(index);
          swiper2.slideTo(index);
        });
      });
    }

    // 7. Panel Dual Swiper
    function handlePanelSwiper() {
      const panelSwiper = wrap.querySelector('.js-panel-swiper');
      const panelSwiperThumb = wrap.querySelector('.js-panel-swiper-thumb');
      if (!panelSwiper || !panelSwiperThumb || !window.Swiper) return;

      const swiperTab = panelSwiperThumb.querySelectorAll('.c-swiper__tab');

      let swiper = new Swiper(panelSwiperThumb, {
        spaceBetween: 20,
        slidesPerView: 'auto',
        freeMode: true,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        rewind: true,
        breakpoints: {
          768: {
            spaceBetween: 0,
          }
        },
      });

      let swiper2 = new Swiper(panelSwiper, {
        effect: 'fade',
        autoHeight: true,
        observer: true,
        observeParents: true,
        thumbs: {
          swiper: swiper,
        },
      });

      swiperTab.forEach((tabItem, index) => {
        tabItem.addEventListener('click', () => {
          swiper.slideTo(index);
          swiper2.slideTo(index);
        });
      });
    }

    // 8. Thermal Swiper & Thermal More Parts
    function handleThermalSwiper() {
      const swiperEl = wrap.querySelector('.js-thermal-swiper');
      if (swiperEl && window.Swiper) {
        new Swiper(swiperEl, {
          slidesPerView: 'auto',
          spaceBetween: 10,
          centerInsufficientSlides: true,
          observer: true,
          observeParents: true,
          lazy: true,
          rewind: true,
          on: {
            click: function() {
              setTimeout(() => {
                if (typeof this.slideTo === 'function' && typeof this.clickedIndex === 'number') {
                  this.slideTo(this.clickedIndex);
                }
              }, 50);
            },
          },
          breakpoints: {
            992: {
              direction: 'vertical',
            }
          },
          navigation: {
            nextEl: swiperEl.querySelector('.swiper-button-next'),
            prevEl: swiperEl.querySelector('.swiper-button-prev'),
          },
          pagination: {
            el: swiperEl.querySelector('.swiper-pagination'),
            type: 'progressbar',
          },
        });
      }
    }

    function handleThermalMore() {
      const thermalMore = wrap.querySelector('.thermal-more');
      if (!thermalMore) return;
      const buttons = thermalMore.querySelectorAll('.thermal-more__content .js-accordion-btn');
      const images = thermalMore.querySelectorAll('.thermal-more__img [data-thermal-img]');

      buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          images.forEach(img => img.classList.remove('is-active'));
          if (images[index]) {
            images[index].classList.add('is-active');
          }
        });
      });
    }

    // 9. Design Swiper
    function handleDesignSwiper() {
      const swiperEl = wrap.querySelector('.js-design-swiper');
      if (!swiperEl || !window.Swiper) return;

      let designSwiper = new Swiper(swiperEl, {
        slidesPerView: 1,
        lazy: true,
        rewind: true,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: swiperEl.querySelector('.swiper-button-next'),
          prevEl: swiperEl.querySelector('.swiper-button-prev'),
        },
        pagination: {
          el: swiperEl.querySelector('.swiper-pagination'),
          type: 'progressbar',
        },
      });

      const modalBtns = wrap.querySelectorAll('.design [data-modal-target]');
      modalBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          designSwiper.slideTo(index, 0);
        });
      });
    }

    // 10. Software Swiper
    function handleSoftwareSwiper() {
      const softwareSwiper = wrap.querySelector('.js-software-swiper');
      const softwareSwiperThumb = wrap.querySelector('.js-software-swiper-thumb');
      if (!softwareSwiper || !softwareSwiperThumb || !window.Swiper) return;

      const swiperTab = softwareSwiperThumb.querySelectorAll('.c-swiper__tab');

      let swiper = new Swiper(softwareSwiperThumb, {
        spaceBetween: 20,
        slidesPerView: 'auto',
        freeMode: true,
        watchSlidesProgress: true,
        centerInsufficientSlides: true,
        observer: true,
        observeParents: true,
        rewind: true,
        breakpoints: {
          768: {
            spaceBetween: 40,
          }
        },
      });

      let swiper2 = new Swiper(softwareSwiper, {
        effect: 'fade',
        autoHeight: true,
        observer: true,
        observeParents: true,
        thumbs: {
          swiper: swiper,
        },
        on: {
          slideChange: function () {
            const iframe = softwareSwiper.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
          }
        }
      });

      swiperTab.forEach((tabItem, index) => {
        tabItem.addEventListener('click', () => {
          swiper.slideTo(index);
          swiper2.slideTo(index);
        });
      });
    }

    // 11. Connectivity I/O Hotspot
    function handleConnectivityIo() {
      const ioBtn = wrap.querySelectorAll('.io');
      if (!ioBtn.length) return;
      const ioTag = wrap.querySelectorAll('.connectivity__tag');

      ioBtn.forEach((btnItem, index) => {
        btnItem.addEventListener('click', () => {
          ioBtn.forEach((btn2, idx2) => {
            btn2.classList.remove('is-active');
            if (ioTag[idx2]) ioTag[idx2].classList.remove('is-active');
          });
          btnItem.classList.add('is-active');
          if (ioTag[index]) ioTag[index].classList.add('is-active');
        });
      });
    }

    // 12. Modal Focus Trap & Scroll Lock
    function handleModal() {
      const btns = wrap.querySelectorAll('[data-modal-target]');
      if (!btns.length) return;

      let savedScrollY = 0;
      function lockScroll() {
        savedScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + savedScrollY + 'px';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
      }

      function unlockScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, savedScrollY);
      }

      btns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget.dataset.modalTarget;
          const modal = wrap.querySelector('[data-modal="' + target + '"]');
          if (!modal) return;
          if (modal.classList.contains('is-open')) {
            modal.classList.remove('is-open');
            modal.removeAttribute('aria-modal');
            unlockScroll();
          } else {
            modal.classList.add('is-open');
            modal.setAttribute('aria-modal', 'true');
            lockScroll();
            const focusable = modal.querySelector('button, [href], input, select, textarea');
            if (focusable) focusable.focus();
          }
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openModal = wrap.querySelector('[data-modal].is-open');
          if (!openModal) return;
          openModal.classList.remove('is-open');
          openModal.removeAttribute('aria-modal');
          unlockScroll();
        }
      });
    }

    // 13. Anchor Navigation & ScrollSpy Sync
    function getNavH() {
      const nav = document.querySelector('.rog-pd-subbar') || document.querySelector('#productTabBarContainer');
      return nav ? nav.offsetHeight : 0;
    }

    function getElTop(element) {
      let distance = 0;
      while (element) {
        distance += element.offsetTop;
        element = element.offsetParent;
      }
      return distance;
    }

    function activeAnchor(name) {
      const anchors = wrap.querySelectorAll('[data-anchor]');
      if (!anchors.length) return;
      anchors.forEach((el) => {
        const anchorName = el.getAttribute('href').replace('#', '');
        if (anchorName === name) {
          el.classList.add('is-active');
          el.setAttribute('aria-current', 'true');
        } else {
          el.classList.remove('is-active');
          el.removeAttribute('aria-current');
        }
      });
    }

    function goToSection(name) {
      const section = wrap.querySelector('[data-section="' + name + '"]');
      if (!section) return;
      window.scrollTo({
        top: Math.max(0, getElTop(section) - getNavH()),
        behavior: 'smooth',
      });
    }

    function handleAnchor() {
      const anchors = wrap.querySelectorAll('[data-anchor]');
      if (anchors.length === 0) return;
      const sections = wrap.querySelectorAll('[data-section]');

      anchors.forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const name = e.currentTarget.getAttribute('href').replace('#', '');
          activeAnchor(name);
          goToSection(name);
        });
      });

      sections.forEach((section) => {
        const intersection = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio > 0.1) {
              const name = entry.target.getAttribute('data-section');
              activeAnchor(name);
            }
          });
        }, { threshold: 0.1 });
        intersection.observe(section);
      });
    }

    // Run all initializations
    observeFade();
    initAccordion();
    handleNew();
    handlePerformance();
    handleModeSwiper();
    handlePerformanceSwiper();
    handlePanelSwiper();
    handleThermalSwiper();
    handleThermalMore();
    handleDesignSwiper();
    handleSoftwareSwiper();
    handleConnectivityIo();
    handleModal();
    handleAnchor();
  }

  // Expose globally
  window.initDuoEngine = initDuoEngine;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDuoEngine);
  } else {
    initDuoEngine();
  }
  window.addEventListener('load', initDuoEngine);
})();
