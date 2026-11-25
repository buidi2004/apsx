
	(function (win, doc, callback) {
	'use strict';

	function detach() {
		doc.addEventListener ? doc.removeEventListener('DOMContentLoaded', complete) : doc.detachEvent('onreadystatechange', complete);
	}

	function complete() {
		(doc.addEventListener || 'load' === event.type || 'complete' === doc.readyState) && (detach(), callback(window, window.jQuery));
	}

	function attach() {
		doc.addEventListener ? doc.addEventListener('DOMContentLoaded', complete) : doc.attachEvent('onreadystatechange', complete)
	}
		callback = callback || function () { };
		attach();
	})(window, document, function (win, $) {
		window.flagship = window.flagship || {};
window.flagship.features = window.flagship.features || {};
flagship.features.common = (function () {
	let status = {};
	const utils = window.flagship.common.utils;

	const addLoadStatusClass = function () {
		if (utils.isLowNetwork()) document.documentElement.classList.add('low_network');
		document.documentElement.classList.add('load');
	};

	const setResolution = function (currRes) {
		status.currentRes = currRes;
		if (status.currentRes != status.prevRes) {
			document.documentElement.classList.add(status.currentRes);
			document.documentElement.classList.remove(status.prevRes);
			status.prevRes = status.currentRes;
		}
	};

	const clickSup = function (e) {
		e.preventDefault();
		e.stopPropagation();

		let destIndex = parseFloat(e.target.innerText),
			disclaimer = document.querySelectorAll('#desc-section li')[destIndex - 1],
			disclaimerReturnCta = disclaimer.querySelector('button'),
			isPopup = window.pageYOffset === 0 ? true : false,
			timing = isPopup ? 350 : 0,
			scrollTopBeforePopupOpen = window.flagship.features.scrollTop !== null ? window.flagship.features.scrollTop : null;

		disclaimerReturnCta.addEventListener('click', clickReturnCta);

		disclaimerReturnCta.disclaimer = disclaimer;
		disclaimerReturnCta.sup = e.target;
		disclaimerReturnCta.isPopup = isPopup;
		disclaimerReturnCta.supTop = window.pageYOffset === 0 ? scrollTopBeforePopupOpen : window.pageYOffset;

		disclaimerReturnCta.addEventListener('click', function () {
			if (isPopup !== false) {
				setTimeout(() => {
					const opener = window.flagship.features.popupOpener;
					window.flagship.features.popupOpener = null;

					requestAnimationFrame(function () {
						const navHeight = utils.getNavHeight();
						const scrollTarget = window.pageYOffset + opener.getBoundingClientRect().top - navHeight - ((window.innerHeight - navHeight) / 2);

						window.scrollTo(0, scrollTarget);
						if (opener) opener.focus();
					});
				}, timing);
			}
		});

		// remove active
		disclaimerReturnCta.addEventListener('focusout', function () {
			setTimeout(function () {
				if (disclaimerReturnCta.disclaimer.classList.contains('is-active')) {
					disclaimerReturnCta.disclaimer.classList.remove('is-active');
				}
			}, 200);
		});


		setTimeout(function () {
			// active + focus
			if (!disclaimer.classList.contains('is-active')) {
				disclaimer.classList.add('is-active');
			}

			centeredFocus.call(disclaimerReturnCta);
			disclaimerReturnCta.focus();
		}, timing);
	};

	const clickReturnCta = function () {
		let target = this;

		if (target.disclaimer.classList.contains('is-active')) {
			target.disclaimer.classList.remove('is-active');
		}

		if (!target.isPopup) {
			setTimeout(() => {
				window.scrollTo(0, target.supTop);
				target.sup.focus();
			}, 10);
		}
	};

	const anchorPosition = function (e) {
		const resize = window.flagship.common.resize;
		let popupOpener = document.querySelectorAll('[data-popup-id]');
		let hashTimeout = null;

		if (e && !e.isTrusted) return;

		if (window.location.hash != '') {
			const hash = location.hash.split('#')[1];
			const targetElement = document.querySelector('#' + hash);

			if (!targetElement) return;

			const popupElement = targetElement.classList.contains('js-popup') ? targetElement : targetElement.closest('.js-popup'),
				oldPopup = document.querySelector('.is-init.is-open');

			if (oldPopup) oldPopup.hide();

			clearTimeout(hashTimeout);
			if (popupElement) {
				let opener;

				popupOpener.forEach(el => {
					if (el.getAttribute('data-popup-id') === hash) {
						return opener = el;
					};
				});

				hashTimeout = setTimeout(() => {
					popupElement.show.call(opener);

					hashTimeout = null;
				}, 0);
			} else {
				let hashSection = document.querySelector('#contents #' + hash);

				if (hashSection.hasAttribute('data-anchor')) {
					const targetValue = hashSection.getAttribute('data-anchor');
					const targetSection = document.querySelector(`[data-anchor-target="${targetValue}"]`);

					if (targetSection) {
						hashSection = targetSection;
					}
				}

				const sectionStyle = window.getComputedStyle(hashSection);
				const navHeight = utils.getStaticNavHeight();
				const sectionTop = hashSection.getBoundingClientRect().top;
				const fixedOuterContainer = hashSection.closest('.js-fixed-inner');
				const isDesktop = resize.checkResolution().indexOf('desktop') > -1;
				const isTouchDevice = utils.detector.isTouchDevice || false;
				const lowNetwork = utils.isLowNetwork();
				const hasRevealParent = isDesktop && fixedOuterContainer && !lowNetwork && !isTouchDevice;

				let hashScroll = 0;

				if (hasRevealParent) {
					const containerAbsoluteTop = window.pageYOffset + fixedOuterContainer.getBoundingClientRect().top;
					const sectionOffsetFromParent = hashSection.offsetTop;
					const revealMarginOffset = window.innerHeight;

					hashScroll = containerAbsoluteTop + sectionOffsetFromParent - navHeight + revealMarginOffset;
				} else {
					hashScroll = window.pageYOffset + sectionTop - navHeight;
				}

				window.scrollTo(0, hashScroll);
			}
		};
	};

	const centeredFocus = function (e) {
		e && e.preventDefault();
		const navHeight = document.documentElement.classList.contains('browser-zoomed-300') ? 0 : utils.getNavHeight();
		status.winOffsetTop = window.pageYOffset + navHeight;
		status.winOffsetBottom = window.pageYOffset + window.innerHeight;
		if (!document.documentElement.classList.contains('ios') && e && e.relatedTarget == null) return;
		let targetRect = this.getBoundingClientRect(),
			targetOffsetTop = window.pageYOffset + targetRect.top,
			targetOffsetMid = targetOffsetTop + (targetRect.height / 2);
		if ((status.winOffsetTop >= targetOffsetMid || targetOffsetMid >= status.winOffsetBottom)) {
			setTimeout(function () {
				let winHeight = (window.innerHeight - utils.getNavHeight()) / 2;
				window.scrollTo(0, targetOffsetMid - winHeight);
			}, 10);
		}
	};

	const isZoom = function () {
		let zoomLevel = 100 / ((window.innerWidth / window.outerWidth) * 100);

		const isFireFox = document.documentElement.classList.contains('firefox') || document.documentElement.classList.contains('Firefox');
		const isTouchDevice = utils.detector.isTouchDevice;

		if (isFireFox && !isTouchDevice) {
			const outerWidth = window.devicePixelRatio * window.outerWidth;
			zoomLevel = 100 / ((window.innerWidth / outerWidth) * 100);
		}
		if (zoomLevel != 1) {
			document.documentElement.classList.add('browser-zoomed-with-subfixel');
		} else {
			document.documentElement.classList.remove('browser-zoomed-with-subfixel');
		}

		if (zoomLevel >= 1.1 || window.devicePixelRatio > 1.1) {
			document.documentElement.classList.add('browser-zoomed-110');
		} else {
			document.documentElement.classList.remove('browser-zoomed-110');
		}

		if (zoomLevel >= 1.25 || window.devicePixelRatio > 1.25) {
			document.documentElement.classList.add('browser-zoomed-125');
		} else {
			document.documentElement.classList.remove('browser-zoomed-125');
		}

		if (zoomLevel >= 1.7) {
			document.documentElement.classList.add('browser-zoomed-175');
		} else {
			document.documentElement.classList.remove('browser-zoomed-175');
		}

		if (zoomLevel >= 3) {
			document.documentElement.classList.add('browser-zoomed-300');
		} else {
			document.documentElement.classList.remove('browser-zoomed-300');
		}

		if (zoomLevel >= 4) {
			document.documentElement.classList.add('browser-zoomed-400');
		} else {
			document.documentElement.classList.remove('browser-zoomed-400');
		}
	};

	const toUTC = (localDateStr, timeZone)=>{

        const getOffsetMin = (date, timeZone)=>{
            const dtf = new Intl.DateTimeFormat('en-US', {
                timeZone,
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'

            });

            const parts = {};

            for(const {type, value} of dtf.formatToParts(date)) {
                parts[type] = value;
            }

            const hour = parts.hour === '24' ? '00' : parts.hour;

            const asUTC = Date.UTC(
                Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(hour), Number(parts.minute), Number(parts.second)
            );

            return (asUTC - date.getTime()) / 60000;
        };

        const [datePart, timePart] = localDateStr.trim().split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        const naive = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

        const offsetMin = getOffsetMin(naive, timeZone);

        const utcDate = new Date(naive.getTime() - offsetMin * 60000);

        const pad = n => String(n).padStart(2, '0');

        return [
            utcDate.getUTCFullYear(),
            pad(utcDate.getUTCMonth() + 1),
            pad(utcDate.getUTCDate())
        ].join('-') + ' ' + [
            pad(utcDate.getUTCHours()),
            pad(utcDate.getUTCMinutes()),
            pad(utcDate.getUTCSeconds())
        ].join(':');

		// toUTC('2026-06-07 00:00:00', 'Asia/Seoul')
	};

	const setSeeMore = function () {
		const resize = window.flagship.common.resize;
		let els = {};

		const init = function () {
			els.contents = document.querySelector('#contents');
			els.blindContainer = els.contents.querySelectorAll('.js-blind-container');
			if (!!els.blindContainer) {
				setElements();
				bindEvent();
			}
		};

		const hasLocalvari = typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI,
			localSeeMore = hasLocalvari ? LOCAL_VARI.seeMore : '...See more';

		const bindEvent = function () {
			resize.add(eventList.responsive);
			eventList.setBlind();
		};

		const setElements = function () {
			for (let i = 0; i < els.blindContainer.length; i++) {
				const isParagraphCut = els.blindContainer[i].classList.contains('is-paragraph-cut');

				if (!isParagraphCut) {
					els.blindContainer[i].blind = els.blindContainer[i].querySelector('.js-blind');
					els.blindContainer[i].blindText = els.blindContainer[i].querySelector('.js-blind-text');
					els.blindContainer[i].supTag = els.blindContainer[i].querySelector('sup');
				} else {
					els.blindContainer[i].blindTextList = els.blindContainer[i].querySelectorAll('.js-blind-text');
				}
				els.blindContainer[i].seeMore = els.blindContainer[i].querySelector('.js-see-more');
			}
		};

		const eventList = {
			responsive: function () {
				const isMobile = resize.checkResolution().indexOf('mobile') > -1;

				if (!isMobile) {
					els.blindContainer.forEach(function (el) {
						if (el.classList.contains('is-paragraph-cut')) {
							el.seeMore.classList.add('is-hide');
							el.blindTextList.forEach(function (item) {
								item.classList.add('is-show');
							});
						} else {
							if (el.originalHtml) {
								el.blindText.innerHTML = el.originalHtml;
								if (el.savedSupTag) el.blindText.append(el.savedSupTag);
							}
						}
					})
				}
			},
			setBlind: function () {
				els.blindContainer.forEach(function (el) {
					el.seeMore.children[0].innerHTML = localSeeMore;
					if (el.classList.contains('is-paragraph-cut')) {
						el.seeMore.addEventListener('click', function () {
							el.blindTextList.forEach(function (item) {
								item.classList.add('is-show');
								item.setAttribute('tabindex', 0);
							});
							el.blindTextList[0].focus();
							el.seeMore.classList.add('is-hide');
						});
						el.blindTextList.forEach(function (item) {
							item.addEventListener('focusout', function () {
								item.removeAttribute('tabindex');
							});
						});
					} else {
						el.blind.classList.add('is-hide');
						const isMobile = resize.checkResolution().indexOf('mobile') > -1;

						let lineNumber;

						if (el.blind.classList.contains('common-blind--line-five')) {
							lineNumber = 5;
						} else {
							lineNumber = 3;
						}

						const lineHeight = parseFloat(getComputedStyle(el.blindText).lineHeight);
						const maxHeight = Math.ceil(lineHeight * lineNumber);

						const isNotOverHeight = el.blindText.scrollHeight <= maxHeight;
						if (isNotOverHeight || !isMobile) {
							el.seeMore.classList.add('is-hide');
							return;
						}

						el.savedSupTag = '';

						if (el.supTag) {
							el.savedSupTag = el.supTag;
							el.supTag.remove();
						}
						el.originalHtml = el.blindText.innerHTML;

						let wordsArray = Array.from(el.originalHtml);

						let limitIndex = 0;
						let minIndex = 0;
						let maxIndex = el.originalHtml.length;

						let finalHtml = "";

						while (minIndex <= maxIndex) {
							const midIndex = Math.floor((minIndex + maxIndex) / 2);

							let halfText = wordsArray.slice(0, midIndex).join('');

							const lastOpen = halfText.lastIndexOf('<');
							const lastClose = halfText.lastIndexOf('>');

							if (lastOpen > lastClose) {
								if (halfText.charAt(lastOpen + 1) === '/') {
									const realCloseIndex = el.originalHtml.indexOf('>', lastOpen);

									if (realCloseIndex !== -1) {
										halfText = el.originalHtml.slice(0, realCloseIndex + 1);
									} else {
										halfText = halfText.slice(0, lastOpen);
									}
								} else {
									const openCount = (halfText.match(/<strong>/g) || []).length;
									const closeCount = (halfText.match(/<\/strong>/g) || []).length;

									if (openCount > closeCount) {
										halfText = halfText.slice(0, lastOpen) + '</strong>';
									} else {
										halfText = halfText.slice(0, lastOpen);
									}
								}
							}

							el.blindText.innerHTML = halfText;
							el.blindText.append(el.seeMore);

							if (el.blindText.scrollHeight <= maxHeight) {
								limitIndex = midIndex;
								finalHtml = halfText;
								minIndex = midIndex + 1;
							} else {
								maxIndex = midIndex - 1;
							}

							if (midIndex === 0 && (el.blindText.scrollHeight > maxHeight)) {
								break;
							}
						}

						el.blindText.innerHTML = finalHtml;
						el.blindText.append(el.seeMore);
						el.seeMore.classList.add('is-show');

						el.seeMore.addEventListener('click', function () {
							if (el.classList.contains('is-paragraph-cut')) return;
							if (!(el.originalHtml)) return;
							const parentSwiper = el.closest('.swiper-container');
							if (parentSwiper) {
								const swiperBlindContainers = parentSwiper.querySelectorAll('.js-blind-container');
								swiperBlindContainers.forEach(function (container) {
									container.blindText.innerHTML = container.originalHtml;
									container.blindText.append(container.savedSupTag);
									el.setAttribute('tabindex', 0);
									el.focus();
								})
							} else {
								el.blindText.innerHTML = el.originalHtml;
								el.blindText.append(el.savedSupTag);
								el.setAttribute('tabindex', 0);
								el.focus();
							}
						});
						el.blindText.addEventListener('focusout', function () {
							el.blindText.removeAttribute('tabindex');
						})

					}

				});
			}
		}

		init();
	};

	return {
		addLoadStatusClass: addLoadStatusClass,
		setResolution: setResolution,
		clickSup: clickSup,
		anchorPosition: anchorPosition,
		centeredFocus: centeredFocus,
		isZoom: isZoom,
		toUTC: toUTC,
		setSeeMore: setSeeMore
	}
})();
flagship.features.setting = (function () {
	const resize = window.flagship.common.resize,
		common = window.flagship.features.common,
		utils = window.flagship.common.utils,
		agent = navigator.userAgent.toLowerCase(),
		maxOs = agent.indexOf('mac os') > -1,
		touchDevice = ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));

	let els = {},
		dataSupTagArr = [],
		dataSupArr = [];

	const init = function () {
		common.addLoadStatusClass();

		if (!maxOs && !touchDevice) {
			setScrollControl();
		}

		setElements();
		setResize();
		setImageLoader();
		setVideoLoader();
		setMp4VideoLoader();
		setZoom();
		setCenteredfocus();
		setAnchorPosition();

		setPageContents()
			.then(() => {
				setDisclaimer();
			}).then(() => {
				setDetectedText();
				common.setSeeMore();
				window.flagship.features.floatingCta.init();
				window.flagship.features.floatingCtaDesign.init();
			});
	};

	const setScrollControl = function () {
		window.scrollController = utils.scrollController();

		scrollController.init({
			speed: 120,
			duration: 0.7
		});
	};

	const setElements = function () {
		els.html = document.documentElement;
		els.contents = document.querySelector('#contents');

		els.allClickables = els.contents.querySelectorAll('a, button, input, select');
		els.detectedText = els.contents.querySelectorAll('.common-device-brand');
		els.supClicker = els.contents.querySelectorAll('.click_sup');
		els.disclaimer = els.contents.querySelector('ol.common-bottom-disclaimer__list');
		els.backCtaBlindText = els.contents.querySelectorAll('.common-bottom-disclaimer__back-cta > .sr-only');
	};

	const setResize = function () {
		resize.init([{
			resolution: 1920,
			resolutionName: 'desktop',
			eventFunction: ''
		}, {
			resolution: 1023,
			resolutionName: 'tablet',
			eventFunction: ''
		}, {
			resolution: 767,
			resolutionName: 'mobile',
			eventFunction: ''
		}, {
			resolution: 320,
			resolutionName: 'mobileS',
			eventFunction: ''
		}], 200);

		resize.add(common.setResolution);
	};

	const setImageLoader = function () {
		window.imageLoader = utils.mediaLoader({
			lazyClass: '.js-img-src',
			responsiveClass: '.js-res-img',
			preset: '?imbypass=true',
			loadOption: [{
				resolution: 1920,
				attribute: 'data-src-pc'
			}, {
				resolution: 767,
				attribute: 'data-src-mo'
			}],
			visiblePoint: 2
		});

		window.bgLoader = utils.mediaLoader({
			type: 'bgImage',
			lazyClass: '.js-bg-img',
			loadOption: [{
				resolution: 1920,
				attribute: '',
				bgOpts: ''
			}],
			visiblePoint: 2
		});
	};

	const setVideoLoader = function () {
		window.videoLoader = utils.mediaLoader({
			type: 'video',
			lazyClass: '.js-video-src',
			responsiveClass: '.js-res-video',
			preset: '?imbypass=true',
			loadOption: [{
				resolution: 1920,
				attribute: 'data-video-src-pc'
			}, {
				resolution: 767,
				attribute: 'data-video-src-mo'
			}],
			visiblePoint: 1,
			endCallback: function (video) {
				if (!!video.videoHandler && !video.videoHandler.wrap.classList.contains('is-loaded')) {
					video.videoHandler.wrap.classList.add('is-loaded');
				}
			}
		});
	};

	const setMp4VideoLoader = function () {
		window.mp4VideoLoader = utils.mediaLoader({
			type: 'mp4Video',
			lazyClass: '.js-mp4-video-src',
			responsiveClass: '.js-res-video',
			preset: '?imbypass=true',
			loadOption: [{
				resolution: 1920,
				attribute: 'data-video-src-pc'
			}, {
				resolution: 767,
				attribute: 'data-video-src-mo'
			}],
			visiblePoint: 1,
			endCallback: function (video) {
				if (!!video.videoHandler && !video.videoHandler.wrap.classList.contains('is-loaded')) {
					video.videoHandler.wrap.classList.add('is-loaded');
				}
			}
		});
	};

	const setZoom = function () {
		resize.add(common.isZoom);
	};

	const setCenteredfocus = function () {
		for (let i = 0; i < els.allClickables.length; i++) {
			els.allClickables[i].addEventListener('focusin', common.centeredFocus);
		}
	};

	const setAnchorPosition = function () {
		window.addEventListener('load', function () {
			if (window.sg && window.sg.common && window.sg.common.utils && window.sg.common.utils.getStickyNavHeightPromise) {
				window.sg.common.utils.getStickyNavHeightPromise(true).then(() => {
					setTimeout(() => {
						common.anchorPosition();
					}, 200);
				});
			} else {
				setTimeout(() => {
					common.anchorPosition();
				}, 200);
			}
		});

		window.addEventListener('hashchange', function (e) {
			common.anchorPosition(e);
		});
	};

	const setPageContents = async function () {
		const isAbrand = await utils.detector.isIosDevice;
		const isCbrand = await utils.detector.isCdevice;
		const miuibrowser = els.html.classList.contains('miuibrowser');

		if (miuibrowser) els.html.classList.add('low_network');

		els.supClicker = document.querySelectorAll('.click_sup');
	};

	const setDetectedText = function () {
		const hasIosClass = document.documentElement.classList.contains('isIosDevice') || document.documentElement.classList.contains('safari') || document.documentElement.classList.contains('oldSafari');

		els.detectedText.forEach((element) => {
			const isIosText = element.classList.contains('common-device-brand--a');

			if (hasIosClass) {
				if (!isIosText) element.remove();
			} else {
				if (isIosText) element.remove();
			}
		});
	};

	const getSupNumber = function (el) {
		if (!el) return;

		const num = parseInt(el.match(/\d+$/)[0]);
		return num;
	};

	const sortOrderDisclaimer = function () {
		const featuresSupArr = Array.from(els.supClicker).filter(sup => !sup.closest('.js-faq-answer')),
			featuresLastSupNumber = Math.max(...featuresSupArr.map(sup => getSupNumber(sup.dataset.supTag)));

		els.supClicker.forEach(element => {
			let dataSupTag = element.dataset.supTag;

			if (!dataSupTagArr.includes(dataSupTag)) {
				let supNumber = getSupNumber(dataSupTag);

				if (featuresSupArr.includes(element)) {
					dataSupTagArr.push(dataSupTag);
				} else {
					if (supNumber >= featuresLastSupNumber) {
						dataSupTagArr.push(dataSupTag);
					} else {
						removeSup(dataSupTag);
					}
				}

				els.dataSup = document.querySelector(`[data-sup=${dataSupTag}]`);

				if (els.dataSup !== null) {
					els.disclaimer.appendChild(els.dataSup);
				} else {
					removeSup(dataSupTag);
				}
			}
		});
	};

	const removeSup = function (dataSupTag) {
		els.removeSup = document.querySelectorAll(`[data-sup-tag=${dataSupTag}]`);

		els.removeSup.forEach(element => {
			let supChildCount = element.parentElement.childElementCount;

			if (supChildCount == 1) {
				element.parentElement.remove();
			} else {
				let supAllNodes = element.parentElement.childNodes;
				let index = [...supAllNodes].indexOf(element);

				if (index != 0 && index % 2 == 0) {
					supAllNodes[index].remove();
					supAllNodes[index - 1].remove();
				} else {
					if (index != supAllNodes.length) supAllNodes[index + 1].remove();
					supAllNodes[index].remove();
				}
			}
		});
	};

	const removeDisclaimer = function () {
		els.disclaimerList = document.querySelectorAll('li.common-bottom-disclaimer__list-item');

		els.disclaimerList.forEach(element => {
			let dataSup = element.dataset.sup

			if (!dataSupTagArr.includes(dataSup)) {
				element.remove();
			} else {
				dataSupArr.push(dataSup);
			}
		});
	};

	const setDisclaimerNumber = function () {
		els.supClicker.forEach(element => {
			let finalDataSupTag = element.dataset.supTag;

			if (dataSupArr.indexOf(finalDataSupTag) > -1) {
				element.innerText = dataSupArr.indexOf(finalDataSupTag) + 1;
			}
		});
	};

	const setDisclaimer = function () {
		const hasLocalvari = typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI,
			localBacktoLocation = hasLocalvari ? LOCAL_VARI.backToLocation : 'Back To Location',
			localSeeDisclaimer = hasLocalvari ? LOCAL_VARI.seeDisclaimer : 'See Disclaimer';

		for (let i = 0; i < els.backCtaBlindText.length; i++) {
			els.backCtaBlindText[i].innerText = localBacktoLocation;
		}

		for (let i = 0; i < els.supClicker.length; i++) {
			els.supClicker[i].setAttribute('title', localSeeDisclaimer);
			els.supClicker[i].addEventListener('click', common.clickSup)
		}

		sortOrderDisclaimer();
		removeDisclaimer();
		setDisclaimerNumber();
	};

	return {
		init: init
	}
})();

flagship.features.setting.init();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};
	window.flagship.features.carouselExtensions = window.flagship.features.carouselExtensions || [];

	window.flagship.features.carouselCore = (function () {
		const utils = flagship.common.utils,
			resize = flagship.common.resize,
			Swiper = flagship.Swiper;

		let els = {};
		let prevDevice = resize.checkResolution();
		let currDevice = resize.checkResolution();
		let globalOptions = {};
		let lowNetwork = document.documentElement.classList.contains('low_network');
		let playVideoTimer = null;

		const DEFAULT_OPTIONS = {
			target: '.js-common-carousel',
			swiper: {
				slidesPerView: 'auto',
				a11y: false,
				mobileOnly: false,
				speed: null,
				moSpeed: null,
				mousewheel: {
					enabled: true,
					forceToAxis: true,
					sensitivity: 1,
					thresholdDelta: 10,
					thresholdTime: 500
				}
			},
			pagination: {
				type: 'dot',
				progressbar: false
			},
			media: {
				preloadAhead: 1
			},
			video: {
				playCallback: null,
				pauseCallback: null,
				resetCallback: null,
				endCallback: null,
				delayPlay: false,
				delayPlayTime: 1000,
				delayPlayOnMobile: false
			},
			autoslide: {
				enabled: false,
				createButton: true,
				indicatorButton: false,
				imageDelay: 3000,
				moImageDelay: null,
				videoDelay: 1000,
				moVideoDelay: null,
				observerThreshold: 0.99,
				progressStart: 40,
				progressEnd: 55,
				moProgressStart: 40,
				moProgressEnd: 55
			},
			imageProgress: {
				start: 30,
				end: 100,
				moStart: 30,
				moEnd: 100,
			},
			useBridgeSlide: false,
			plugins: []
		};

		const init = function (customOptions) {
			globalOptions = mergeOptions(DEFAULT_OPTIONS, customOptions || {});
			els.carousels = document.querySelectorAll(globalOptions.target);

			if (els.carousels.length > 0) {
				setProperty();
				bindEvents();
			}
		};

		const isMobile = function () {
			return currDevice === 'mobile' || currDevice === 'mobileS';
		};

		const isDesktop = function () {
			return currDevice === 'desktop';
		};

		const setProperty = function () {
			els.carousels.forEach(function (carousel) {
				carousel.container = carousel.querySelector('.swiper-container');
				carousel.wrapper = carousel.querySelector('.swiper-wrapper');
				carousel.slides = carousel.querySelectorAll('.swiper-slide');
				carousel.arrowNext = carousel.querySelector('.swiper-button-next');
				carousel.arrowPrevious = carousel.querySelector('.swiper-button-prev');
				carousel.paginationWrap = carousel.querySelector('.swiper-pagination-wrap');
				carousel.pagination = carousel.querySelector('.swiper-pagination');
				carousel.scrollbar = carousel.querySelector('.swiper-scrollbar');
				carousel.autoSlideControl = carousel.querySelector('.js-autoslide-control');
				carousel.paginationProgressbar = [];

				carousel.videoWrap = Array.from(carousel.querySelectorAll('.js-video-wrap'));
				carousel.videoWrap.forEach(function (videoWrap) {
					videoWrap.video = videoWrap.querySelector('.js-res-video');
					videoWrap.controller = videoWrap.querySelector('.js-video-control');

					if (videoWrap.video) {
						videoWrap.video.progressFrameRequestId = null;
						videoWrap.video.progressPlayingHandler = null;
					}

					if (videoWrap.controller) {
						videoWrap.controller.video = videoWrap.video;
					}

					videoWrap.startPoint = videoWrap.getAttribute('data-start-point');
					videoWrap.reversePoint = videoWrap.getAttribute('data-reverse-point');
					videoWrap.moStartPoint = videoWrap.getAttribute('data-mo-start-point');
					videoWrap.moReversePoint = videoWrap.getAttribute('data-mo-reverse-point');
				});

				carousel.swiperInstance = null;
				carousel.swiperState = {
					activeSlides: [],
					columns: 1
				};

				carousel.autoSlideBtn = null;
				carousel.autoSlideStopped = false;
				carousel.lowNetworkAutoSlideEnabled = false;
				carousel.autoSlideTimer = null;
				carousel.swipeStartPosition = '';
				carousel.swipeEndPosition = '';
				carousel.isInView = false;
				carousel.wasInView = false;
				carousel.wasInsideTrack = false;
				carousel.noSwiperActiveIndex = 0;
				carousel.scrollProgress = null;
				carousel.intersectionObserver = null;
				carousel.progressDelayTimer = null;
				carousel.isProgressPending = false;
				carousel.isBridgeMoving = false;
				carousel.isStepPassed = false;
				carousel.finalTargetIndex = null;
				carousel.intermediateIndex = null;

				carousel.swiperHooks = {
					init: [],
					slideChange: [],
					resize: [],
					destroy: []
				};

				carousel.carouselOptions = getCarouselOptions(carousel);

				setupPlugins(carousel);
			});
		};

		const bindEvents = function () {
			eventList.setScene();
			eventList.bindObserver();
			eventList.setVideo();
			eventList.updateLayoutState();
			eventList.loadInitialMediaAssets();
			swiperEvents.set();
			eventHandler.click();
			eventHandler.scroll();
			eventHandler.focusin();
			eventList.syncScroll();
			eventHandler.hashchange();
			resize.add(eventList.resize);
		};

		const getCarouselOptions = function (carousel) {
			const baseOptions = mergeOptions(DEFAULT_OPTIONS, globalOptions || {});
			const extensions = window.flagship.features.carouselExtensions || [];
			let mergedOptions = mergeOptions({}, baseOptions);
			extensions.forEach(function (extension) {
				let extensionOptions = {};

				if (!extension || typeof extension.getCarouselOptions !== 'function') return;

				extensionOptions = extension.getCarouselOptions(carousel) || {};
				mergedOptions = mergeOptions(mergedOptions, extensionOptions);
			});

			return mergedOptions;
		};

		const setupPlugins = function (carousel) {
			const plugins = carousel.carouselOptions.plugins || [];

			plugins.forEach(function (plugin) {
				if (typeof plugin === 'function') {
					plugin(createPluginContext(carousel));
				}
			});
		};

		const createPluginContext = function (carousel) {
			return {
				carousel: carousel,
				getSwiper: function () {
					return carousel.swiperInstance;
				},
				getState: function () {
					return carousel.swiperState;
				},
				onInit: function (handler) {
					carousel.swiperHooks.init.push(handler);
				},
				onSlideChange: function (handler) {
					carousel.swiperHooks.slideChange.push(handler);
				},
				onDestroy: function (handler) {
					carousel.swiperHooks.destroy.push(handler);
				}
			};
		};

		const runHooks = function (carousel, hookName) {
			const hooks = carousel.swiperHooks[hookName] || [];

			hooks.forEach(function (handler) {
				if (typeof handler === 'function') {
					handler({
						carousel: carousel,
						swiper: carousel.swiperInstance,
						state: carousel.swiperState,
						options: carousel.carouselOptions
					});
				}
			});
		};

		const callVideoCallback = function (callback, carousel, videoWrap) {
			if (typeof callback !== 'function') return;

			callback({
				carousel: carousel,
				videoWrap: videoWrap,
				video: videoWrap.video,
				controller: videoWrap.controller
			});
		};

		const eventHandler = {
			click: function () {
				els.carousels.forEach(function (carousel) {
					if (carousel.arrowPrevious) {
						carousel.arrowPrevious.addEventListener('click', function () {
							accessibility.arrowFocus(this, carousel.arrowNext);
							eventList.stopAutoSlide(carousel);
						});
					}

					if (carousel.arrowNext) {
						carousel.arrowNext.addEventListener('click', function () {
							accessibility.arrowFocus(this, carousel.arrowPrevious);
							eventList.stopAutoSlide(carousel);
						});
					}

					if (carousel.pagination) {
						carousel.pagination.addEventListener('click', function () {
							eventList.stopAutoSlide(carousel);
						}, true);
					}

					carousel.videoWrap.forEach(function (videoWrap) {
						if (!videoWrap.controller) return;

						videoWrap.controller.addEventListener('click', function (e) {
							eventList.clickVideoCta(e);
							eventList.stopAutoSlide(carousel, false);
						});
					});

					eventList.bindIndicatorAutoSlideButton(carousel);
				});
			},
			scroll: function () {
				window.addEventListener('scroll', eventList.syncScroll);
			},
			hashchange: function () {
				window.addEventListener('hashchange', function () {
					const targetData = eventList.findTargetCarouselByHash();
					if (targetData) {
						eventList.moveToHashTarget(targetData.carousel, targetData.hash);
					}
				});
			},
			focusin: function () {
				els.carousels.forEach(function (carousel) {
					if (carousel.videoWrap) {
						carousel.videoWrap.forEach(function (videoWrap) {
							if (videoWrap.controller) {
								videoWrap.controller.addEventListener('focusin', function () {
									eventList.stopAutoSlide(carousel);
								});
							}
						});
					}
				});
			}
		};

		const eventList = {
			refresh: function (carousel, slides) {
				if (!carousel || !carousel.swiperInstance) return;

				if (slides) {
					carousel.slides = slides;
				}

				carousel.swiperInstance.update();

				eventList.updateLayoutState(carousel);
				eventList.updateSwiperState(carousel);

				accessibility.slide(carousel);
				accessibility.updatePaginationAria(carousel);
			},
			resize: function () {
				currDevice = resize.checkResolution();

				if (currDevice === prevDevice) return;

				eventList.updateLayoutState();
				eventList.loadInitialMediaAssets();
				eventList.bindObserver();
				swiperEvents.reInit();

				els.carousels.forEach(function (carousel) {
					eventList.clearAutoSlideState(carousel);
					eventList.clearDelayedPlayTimer();
					eventList.clearProgressTimer(carousel);
					carousel.autoSlideStopped = false;
					eventList.setIndicatorAutoSlideButtonState(carousel, !eventList.isLowNetworkAutoSlideBlocked(carousel));

					if (carousel.swiperInstance) {
						if (carousel.swiperInstance.params.loop) {
							carousel.swiperInstance.slideToLoop(0, 0);
						} else {
							carousel.swiperInstance.slideTo(0, 0);
						}

						eventList.updateSwiperState(carousel);
						accessibility.slide(carousel);
					}

					runHooks(carousel, 'resize');
				});

				prevDevice = currDevice;
			},
			setScene: function () {
				els.carousels.forEach(function (carousel) {
					if (typeof SCROLLER === 'function') {
						carousel.scene = SCROLLER({
							trackElement: carousel,
							useFixed: false
						});
					}
				});
			},
			bindObserver: function () {
				els.carousels.forEach(function (carousel) {
					const autoSlideOptions = carousel.carouselOptions.autoslide || {};
					const threshold = typeof autoSlideOptions.observerThreshold === 'number'
						? autoSlideOptions.observerThreshold
						: 0.99;

					if (carousel.intersectionObserver) {
						carousel.intersectionObserver.disconnect();
						carousel.intersectionObserver = null;
					}

					carousel.intersectionObserver = new IntersectionObserver(function (entries) {
						const entry = entries[0];
						const isFullVisible = entry && entry.intersectionRatio >= threshold;

						carousel.isInView = !!(entry && entry.isIntersecting && isFullVisible);
					}, {
						root: null,
						threshold: [0, threshold, 1.0],
						rootMargin: '0px'
					});

					carousel.intersectionObserver.observe(carousel);
				});
			},
			setVideo: function () {
				els.carousels.forEach(function (carousel) {
					carousel.videoWrap.forEach(function (videoWrap) {
						const mobileStatus = isMobile();
						const videoOptions = carousel.carouselOptions.video || {};
						let videoHandlerOptions = null;

						if (!videoWrap.video || !videoWrap.controller || !utils.videoHandler) return;

						videoHandlerOptions = {
							playType: 'scrollPlay',
							startPoint: mobileStatus ? videoWrap.moStartPoint : videoWrap.startPoint,
							reversePoint: mobileStatus ? videoWrap.moReversePoint : videoWrap.reversePoint,
							wrap: videoWrap,
							video: videoWrap.video,
							controller: videoWrap.controller,
							playCallback: function () {
								setTagging.pause(this.controller);
								eventList.setProgressDuration(carousel, this.video);
								eventList.startVideoPaginationProgress(carousel, this.video);
								this.video.removeEventListener('canplay', eventList.playVideoOnce);

								callVideoCallback(videoOptions.playCallback, carousel, videoWrap);
							},
							pauseCallback: function () {
								setTagging.play(this.controller);
								eventList.cancelVideoPaginationProgressStart(this.video);

								if (eventList.isActiveSlideVideo(carousel, this.video)) {
									eventList.stopPaginationProgress(carousel);
								}

								callVideoCallback(videoOptions.pauseCallback, carousel, videoWrap);
							},
							endCallback: function () {
								eventList.stopPaginationProgress(carousel);

								if (
									carousel.swiperInstance &&
									eventList.canPlayActiveVideo(carousel) &&
									eventList.playNextActiveVideo(carousel, this.video)
								) {
									callVideoCallback(videoOptions.endCallback, carousel, videoWrap);
									return;
								}

								if (eventList.canAutoSlide(carousel)) {
									if (!carousel.swiperInstance) {
										eventList.playNextVisibleVideo(carousel, this.video);
									} else {
										eventList.moveNextAfterVideoEnd(carousel);
									}
								}

								callVideoCallback(videoOptions.endCallback, carousel, videoWrap);
							},
							resetCallback: function () {
								if (!carousel.swiperInstance) {
									eventList.setInitialVideoIndex(carousel);
								}

								eventList.resetPaginationProgress(carousel);
								eventList.setProgressDuration(carousel);
								callVideoCallback(videoOptions.resetCallback, carousel, videoWrap);
							}
						};

						utils.videoHandler(videoHandlerOptions);
					});
				});
			},
			syncScroll: function () {
				els.carousels.forEach(function (carousel) {
					if (carousel.swiperInstance) {
						eventList.updateSwiperState(carousel);
					}

					eventList.syncAutoSlide(carousel);

					if (!carousel.scene) return;

					carousel.scene.trackAnimation(function () {
						let activeSlide = null;
						let video = null;
						let videoHandler = null;

						carousel.scrollProgress = this.progress;

						if (!carousel.swiperInstance) {
							const isInsideNow = this.progress > 0 && this.progress < 100;

							if (isInsideNow) {
								if (!carousel.wasInsideTrack) {
									eventList.setInitialVideoIndex(carousel);
									eventList.resetActiveSlideVideo(carousel);

									carousel.wasInsideTrack = true;
								}
							} else {
								eventList.setInitialVideoIndex(carousel);
							}
						}

						if (carousel.swiperInstance) {
							video = eventList.getPlaybackVideo(carousel);
						} else {
							activeSlide = eventList.getActiveSlide(carousel);
							video = eventList.getSlideVideo(activeSlide);
						}

						videoHandler = video && video.videoHandler;

						if (!eventList.isLowNetworkAutoSlideBlocked(carousel) && videoHandler) {
							videoHandler.scrollActive(this.progress);
						}
					});
				});
			},
			setInitialVideoIndex: function (carousel) {
				carousel.wasInView = false;
				carousel.wasInsideTrack = false;

				if (carousel.slides) {
					const firstVideoIndex = Array.from(carousel.slides).findIndex(function (slide) {
						return !!(slide.querySelector('.js-video-wrap') || slide.querySelector('.js-res-video'));
					});
					carousel.noSwiperActiveIndex = firstVideoIndex !== -1 ? firstVideoIndex : 0;
				} else {
					carousel.noSwiperActiveIndex = 0;
				}
			},
			playVideoOnce: function () {
				this.play();
			},
			playVideo: function (video) {
				if (!video) return;

				if (video.readyState >= 1) {
					video.play();
				} else {
					video.addEventListener('canplay', eventList.playVideoOnce, {
						once: true
					});
				}
			},
			clearDelayedPlayTimer: function () {
				if (playVideoTimer) {
					clearTimeout(playVideoTimer);
					playVideoTimer = null;
				}
			},
			clearProgressTimer: function (carousel) {
				if (!carousel) return;

				carousel.isProgressPending = false;

				if (!carousel.progressDelayTimer) return;

				clearTimeout(carousel.progressDelayTimer);
				carousel.progressDelayTimer = null;
			},
			isActiveSlideVideo: function (carousel, video) {
				if (carousel.swiperInstance) {
					const targetSlide = video ? video.closest('.swiper-slide') : null;

					return !!targetSlide && carousel.swiperState.activeSlides.includes(targetSlide);
				}

				const mediaInfo = eventList.getActiveSlideMediaType(carousel);

				if (mediaInfo.type !== 'video' || !mediaInfo.video) return false;

				return mediaInfo.video === video;
			},
			cancelVideoPaginationProgressStart: function (video) {
				if (!video) return;

				if (
					video.progressFrameRequestId !== null &&
					typeof video.cancelVideoFrameCallback === 'function'
				) {
					video.cancelVideoFrameCallback(video.progressFrameRequestId);
				}

				video.progressFrameRequestId = null;

				if (video.progressPlayingHandler) {
					video.removeEventListener('playing', video.progressPlayingHandler);
					video.progressPlayingHandler = null;
				}
			},
			startVideoPaginationProgress: function (carousel, video) {
				if (!carousel || !video) return;

				eventList.cancelVideoPaginationProgressStart(video);

				const startProgress = function () {
					video.progressFrameRequestId = null;
					video.progressPlayingHandler = null;

					if (video.paused) return;
					if (!eventList.isActiveSlideVideo(carousel, video)) return;

					eventList.startPaginationProgress(carousel);
				};

				if (typeof video.requestVideoFrameCallback === 'function') {
					video.progressFrameRequestId = video.requestVideoFrameCallback(startProgress);
					return;
				}

				video.progressPlayingHandler = startProgress;
				video.addEventListener('playing', video.progressPlayingHandler, {
					once: true
				});
			},
			delayProgress: function (carousel) {
				const videoOptions = carousel.carouselOptions.video || {};
				let delayPlay = !!videoOptions.delayPlay;
				const delayPlayTime = typeof videoOptions.delayPlayTime === 'number' ? videoOptions.delayPlayTime : 1000;
				const delayPlayOnMobile = videoOptions.delayPlayOnMobile !== false;
				const mobileStatus = isMobile();

				if (mobileStatus && !delayPlayOnMobile) {
					delayPlay = false;
				}

				eventList.clearProgressTimer(carousel);

				if (!delayPlay) {
					eventList.startPaginationProgress(carousel);
					return;
				}

				carousel.isProgressPending = true;

				carousel.progressDelayTimer = setTimeout(function () {
					carousel.progressDelayTimer = null;
					eventList.startPaginationProgress(carousel);
				}, delayPlayTime);
			},
			playActiveSlideVideo: function (carousel) {
				const slideChangeVideo = eventList.getSlideChangeVideo(carousel);
				const targetVideo = slideChangeVideo || eventList.getPlaybackVideo(carousel);
				const videoOptions = carousel.carouselOptions.video || {};
				let delayPlay = !!videoOptions.delayPlay;
				const delayPlayTime = typeof videoOptions.delayPlayTime === 'number' ? videoOptions.delayPlayTime : 1000;
				const delayPlayOnMobile = videoOptions.delayPlayOnMobile !== false;
				const mobileStatus = isMobile();

				if (mobileStatus && !delayPlayOnMobile) {
					delayPlay = false;
				}

				eventList.clearDelayedPlayTimer();

				if (!targetVideo) return;
				if (eventList.isLowNetworkAutoSlideBlocked(carousel)) return;

				const videoWraps = carousel.videoWrap;

				videoWraps.forEach(function (videoWrap) {
					const video = videoWrap.video;

					if (!video || video === targetVideo || video.paused) return;

					video.pause();
				});

				if (!slideChangeVideo && !targetVideo.paused && !targetVideo.ended) return;

				if (targetVideo.readyState >= 1) {
					targetVideo.currentTime = 0;
				}

				if (!delayPlay) {
					eventList.playVideo(targetVideo);
					return;
				}

				playVideoTimer = setTimeout(function () {
					const targetSlide = targetVideo.closest('.swiper-slide');

					playVideoTimer = null;

					if (carousel.swiperInstance && targetSlide && !carousel.swiperState.activeSlides.includes(targetSlide)) return;

					eventList.playVideo(targetVideo);
				}, delayPlayTime);
			},
			isEndedVideo: function (video) {
				if (!video) return false;
				if (isNaN(video.duration) || video.duration <= 0) return false;

				return Math.abs(video.duration - video.currentTime) < 0.1;
			},
			clickVideoCta: function (e) {
				const carousel = e.currentTarget.closest('.js-common-carousel');
				const video = e.currentTarget.video;

				if (!video) return;

				eventList.clearDelayedPlayTimer();

				if (video.paused) {
					if (carousel) {
						const videoWraps = carousel.videoWrap;

						videoWraps.forEach(function (videoWrap) {
							const otherVideo = videoWrap.video;

							if (!otherVideo || otherVideo === video || otherVideo.paused) return;

							otherVideo.pause();
						});
					}

					if (carousel && eventList.isEndedVideo(video)) {
						const activeIndex = carousel.swiperInstance
							? carousel.swiperInstance.realIndex
							: carousel.noSwiperActiveIndex || 0;
						const targetDot = carousel.paginationProgressbar && carousel.paginationProgressbar.length > 0
							? carousel.paginationProgressbar[activeIndex]
							: null;

						if (targetDot) {
							eventList.clearDotStyle(targetDot);
						}

						eventList.setProgressDuration(carousel, video);
					}

					eventList.playVideo(video);
				} else {
					video.pause();
				}
			},
			updateLayoutState: function (targetCarousel) {
				const carousels = targetCarousel ? [targetCarousel] : Array.from(els.carousels);

				carousels.forEach(function (carousel) {
					carousel.swiperState.columns = eventList.getColumnCount(carousel);
				});
			},
			updateSwiperState: function (carousel) {
				if (!carousel.swiperInstance) return;

				swiperEvents.setActiveSlides(carousel);
			},
			getColumnCount: function (carousel) {
				if (!carousel.slides || !carousel.slides.length) return 1;
				if (!carousel.container) return 1;

				const containerWidth = carousel.container.getBoundingClientRect().width;
				const firstSlide = carousel.slides[0];

				if (!firstSlide) return 1;

				const slideStyle = getComputedStyle(firstSlide);
				const slideWidth = firstSlide.getBoundingClientRect().width;
				const marginLeft = parseFloat(slideStyle.marginLeft) || 0;
				const marginRight = parseFloat(slideStyle.marginRight) || 0;
				const gapWidth = marginLeft + marginRight;
				const columnWidth = slideWidth + gapWidth;

				if (columnWidth <= 0) return 1;

				return Math.max(1, Math.floor((containerWidth + gapWidth) / columnWidth));
			},
			getMediaLoadRange: function (carousel, startIndex) {
				const slides = carousel.slides;
				const columns = carousel.swiperState.columns || 1;
				const preloadAhead = carousel.carouselOptions.media && typeof carousel.carouselOptions.media.preloadAhead === 'number' ? carousel.carouselOptions.media.preloadAhead : 0;
				const loadStartIndex = Math.max(0, startIndex);
				const loadEndIndex = Math.min(slides.length - 1, loadStartIndex + columns + preloadAhead - 1);

				return {
					start: loadStartIndex,
					end: loadEndIndex
				};
			},
			isCarouselInViewport: function (carousel) {
				const rect = carousel.getBoundingClientRect();
				const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

				return rect.top < viewportHeight && rect.bottom > 0;
			},
			getAutoSlideProgressRange: function (carousel) {
				const autoSlideOptions = carousel.carouselOptions.autoslide || {};
				const mobileStatus = isMobile();

				return {
					start: mobileStatus
						? (typeof autoSlideOptions.moProgressStart === 'number' ? autoSlideOptions.moProgressStart : 40)
						: (typeof autoSlideOptions.progressStart === 'number' ? autoSlideOptions.progressStart : 40),
					end: mobileStatus
						? (typeof autoSlideOptions.moProgressEnd === 'number' ? autoSlideOptions.moProgressEnd : 55)
						: (typeof autoSlideOptions.progressEnd === 'number' ? autoSlideOptions.progressEnd : 55)
				};
			},
			getImageProgressRange: function (carousel) {
				const activeSlide = eventList.getActiveSlide(carousel);
				const imageProgressOptions = carousel.carouselOptions.imageProgress || {};
				const mobileStatus = isMobile();
				const startAttr = mobileStatus ? 'data-mo-image-progress-start' : 'data-image-progress-start';
				const endAttr = mobileStatus ? 'data-mo-image-progress-end' : 'data-image-progress-end';
				const startOptionKey = mobileStatus ? 'moStart' : 'start';
				const endOptionKey = mobileStatus ? 'moEnd' : 'end';
				const startAttrValue = activeSlide ? activeSlide.getAttribute(startAttr) : null;
				const endAttrValue = activeSlide ? activeSlide.getAttribute(endAttr) : null;
				const startValue = startAttrValue !== null ? Number(startAttrValue) : NaN;
				const endValue =  endAttrValue !== null ? Number(endAttrValue) : NaN;
				const defaultStart = typeof imageProgressOptions[startOptionKey] === 'number' ? imageProgressOptions[startOptionKey] : 30;
				const defaultEnd = typeof imageProgressOptions[endOptionKey] === 'number' ? imageProgressOptions[endOptionKey] : 80;

				return {
					start: !isNaN(startValue) ? startValue : defaultStart,
					end: !isNaN(endValue) ? endValue : defaultEnd
				}
			},
			isAutoSlideTriggerCondition: function (carousel) {
				const progressRange = eventList.getAutoSlideProgressRange(carousel);
				const hasProgress = typeof carousel.scrollProgress === 'number';
				const isProgressInRange = hasProgress &&
					carousel.scrollProgress > progressRange.start &&
					carousel.scrollProgress < progressRange.end;

				return carousel.isInView || isProgressInRange;
			},
			loadMediaAssetsByRange: function (carousel, startIndex, endIndex) {
				const slides = carousel.slides;

				for (let i = startIndex; i <= endIndex; i++) {
					const slide = slides[i];
					const isLoadedSlide = slide && slide.dataset.assetsLoaded !== 'true';

					if (!isLoadedSlide) continue;

					if (slide.classList.contains('swiper-slide-duplicate')) continue;

					const assets = [
						{
							selector: '.js-res-img:not(.is-img-load-complete)',
							loader: typeof imageLoader !== 'undefined' ? imageLoader : null
						},
						{
							selector: '.js-res-video:not(.js-mp4-video):not(.is-video-load-complete)',
							loader: typeof videoLoader !== 'undefined' ? videoLoader : null
						},
						{
							selector: '.js-mp4-video:not(.is-mp4video-load-complete)',
							loader: typeof mp4VideoLoader !== 'undefined' ? mp4VideoLoader : null
						}
					];

					assets.forEach(function (asset) {
						if (!asset.loader) return;

						const assetTargets = slide.querySelectorAll(asset.selector);

						if (assetTargets.length > 0) {
							asset.loader.setResponsiveMedia(assetTargets);
						}
					});

					slide.dataset.assetsLoaded = 'true';
				}
			},
			markInitialMediaAssetsByRange: function (carousel, startIndex, endIndex) {
				const slides = carousel.slides;

				for (let i = startIndex; i <= endIndex; i++) {
					const slide = slides[i];
					const isPreparedSlide = slide && slide.dataset.assetsPrepared !== 'true';

					if (!isPreparedSlide) continue;
					if (slide.classList.contains('swiper-slide-duplicate')) continue;

					const imageTargets = slide.querySelectorAll('.js-res-img:not(.is-img-load-complete)');
					const videoTargets = slide.querySelectorAll('.js-res-video:not(.js-mp4-video):not(.is-video-load-complete)');
					const mp4VideoTargets = slide.querySelectorAll('.js-mp4-video:not(.is-mp4video-load-complete)');

					imageTargets.forEach(function (image) {
						image.classList.add('js-img-src');
					});

					videoTargets.forEach(function (video) {
						video.classList.add('js-video-src');
					});

					mp4VideoTargets.forEach(function (video) {
						video.classList.add('js-mp4-video-src');
					});

					slide.dataset.assetsPrepared = 'true';
				}
			},
			loadInitialMediaAssets: function () {
				els.carousels.forEach(function (carousel) {
					const range = eventList.getMediaLoadRange(carousel, 0);

					eventList.markInitialMediaAssetsByRange(
						carousel,
						range.start,
						range.end
					);

					if (eventList.isCarouselInViewport(carousel)) {
						eventList.loadMediaAssetsByRange(
							carousel,
							range.start,
							range.end
						);
					}
				});
			},
			loadSlideChangeMediaAssets: function (carousel) {
				if (!carousel.swiperInstance) return;

				const activeIndex = carousel.swiperInstance.realIndex;
				const range = eventList.getMediaLoadRange(carousel, activeIndex);

				eventList.loadMediaAssetsByRange(
					carousel,
					range.start,
					range.end
				);
			},
			loadPassedSlideMediaAssets: function (carousel) {
				let previousIndex = -1;
				let currentIndex = -1;
				let startIndex = 0;
				let endIndex = 0;

				if (!carousel.swiperInstance) return;

				previousIndex = carousel.swiperInstance.previousIndex;
				currentIndex = carousel.swiperInstance.realIndex;

				if (previousIndex < 0 || previousIndex === currentIndex) return;

				startIndex = Math.min(previousIndex, currentIndex);
				endIndex = Math.max(previousIndex, currentIndex);

				eventList.loadMediaAssetsByRange (
					carousel,
					startIndex,
					endIndex
				);
			},
			clearAutoSlideState: function (carousel) {
				if (carousel.autoSlideTimer) {
					clearTimeout(carousel.autoSlideTimer);
					carousel.autoSlideTimer = null;
				}
			},
			stopAutoSlide: function (carousel, stopProgress) {
				carousel.autoSlideStopped = true;
				eventList.clearAutoSlideState(carousel);
				eventList.clearProgressTimer(carousel);

				if (eventList.isIndicatorAutoSlideButtonEnabled(carousel)) {
					if (stopProgress !== false) {
						eventList.stopPaginationProgress(carousel);
					}

					eventList.setAutoSlideControlState(carousel, false);
				}
			},
			startAutoSlide: function (carousel) {
				if (lowNetwork) {
					carousel.lowNetworkAutoSlideEnabled = true;
				}

				carousel.autoSlideStopped = false;
				eventList.setAutoSlideControlState(carousel, true);

				const mediaInfo = eventList.getActiveSlideMediaType(carousel);

				if (mediaInfo.type !== 'video') {
					eventList.startPaginationProgress(carousel);
				}

				eventList.syncAutoSlide(carousel);

				if (carousel.swiperInstance) {
					eventList.playActiveSlideVideo(carousel);
				}
			},
			isIndicatorAutoSlideButtonEnabled: function (carousel) {
				const options = carousel.carouselOptions || {};
				const autoSlideOptions = options.autoslide || {};
				const isAutoSlideEnabled = !!autoSlideOptions.enabled;
				const isIndicatorButtonEnabled = autoSlideOptions.indicatorButton === true;
 
				return isAutoSlideEnabled && isIndicatorButtonEnabled;
			},
			isLowNetworkAutoSlideBlocked: function (carousel) {
				if (!lowNetwork) return false;
				if (!eventList.isIndicatorAutoSlideButtonEnabled(carousel)) return true;

				return !carousel.lowNetworkAutoSlideEnabled;
			},
			setIndicatorAutoSlideButtonState: function (carousel, isPlaying) {
				const button = carousel.autoSlideControl;
				const blindText = button ? button.querySelector('.sr-only') : null;
				const attributeText = button
					? button.getAttribute(isPlaying ? 'data-stop-autoplay' : 'data-start-autoplay')
					: null;
				const disableText = (typeof LOCAL_VARI != 'undefined' && LOCAL_VARI.stopAutoplay)
					? LOCAL_VARI.stopAutoplay
					: 'Stop see what people are saying';
				const enableText = (typeof LOCAL_VARI != 'undefined' && LOCAL_VARI.startAutoplay)
					? LOCAL_VARI.startAutoplay
					: 'Start see what people are saying';
				const targetText = attributeText || (isPlaying ? disableText : enableText);

				if (!eventList.isIndicatorAutoSlideButtonEnabled(carousel) || !button) return;

				button.classList.toggle('is-playing', isPlaying);
				button.classList.toggle('is-paused', !isPlaying);

				if (isPlaying) {
					setTagging.stop(button);
				} else {
					setTagging.start(button);
				}

				if (blindText && blindText.textContent !== targetText) {
					blindText.textContent = targetText;
				}
			},
			getAutoSlideButtonText: function (carousel, isPlaying) {
				const attributeName = isPlaying
					? 'data-disable-automatic'
					: 'data-enable-automatic';
				const localKey = isPlaying
					? 'disableAutoSlide'
					: 'enableAutoSlide';
				const fallbackText = isPlaying
					? 'disable automatic slideshow'
					: 'enable automatic slideshow';
				const attributeText = carousel.getAttribute(attributeName);
				const localText = (typeof LOCAL_VARI !== 'undefined' && LOCAL_VARI[localKey])
					? LOCAL_VARI[localKey]
					: null;

				if (attributeText !== null) return attributeText;
				if (localText) return localText;

				return fallbackText;
			},
			setAutoSlideButtonState: function (carousel, isPlaying) {
				const button = carousel.autoSlideBtn;
				const buttonText = button ? button.querySelector('.common-text') : null;
				const targetText = eventList.getAutoSlideButtonText(carousel, isPlaying);

				if (!button || !buttonText) return;

				if (buttonText.textContent !== targetText) {
					buttonText.textContent = targetText;
				}
			},
			setAutoSlideControlState: function (carousel, isPlaying) {
				eventList.setIndicatorAutoSlideButtonState(carousel, isPlaying);

				if (eventList.isIndicatorAutoSlideButtonEnabled(carousel)) {
					eventList.setAutoSlideButtonState(carousel, isPlaying);
				}
			},
			bindIndicatorAutoSlideButton: function (carousel) {
				const button = carousel.autoSlideControl;

				if (!eventList.isIndicatorAutoSlideButtonEnabled(carousel) || !button) return;

				eventList.setIndicatorAutoSlideButtonState(carousel, !eventList.isLowNetworkAutoSlideBlocked(carousel));

				if (button.dataset.autoSlideControlBound === 'true') return;

				button.addEventListener('click', function () {
					const isPlaying = this.classList.contains('is-playing');

					if (isPlaying) {
						eventList.stopAutoSlide(carousel);
						return;
					}

					eventList.startAutoSlide(carousel);
				});

				button.dataset.autoSlideControlBound = 'true';
			},
			canAutoSlide: function (carousel) {
				const autoSlideOptions = carousel.carouselOptions.autoslide || {};

				if (!autoSlideOptions.enabled) return false;

				if (eventList.isLowNetworkAutoSlideBlocked(carousel)) return false;

				if (carousel.autoSlideStopped) return false;

				if (!eventList.isAutoSlideTriggerCondition(carousel)) return false;

				return true;
			},
			getActiveSlide: function (carousel) {
				if (carousel.swiperInstance) {
					return carousel.swiperInstance.slides[carousel.swiperInstance.realIndex] || null;
				}

				if (carousel.slides && carousel.slides.length > 0) {
					const currentIndex = typeof carousel.noSwiperActiveIndex === 'number' ? carousel.noSwiperActiveIndex : 0;
					return carousel.slides[currentIndex] || carousel.slides[0];
				}

				return null;
			},
			getSlideVideo: function (slide) {
				if (!slide) return null;

				const videoWrap = slide.querySelector('.js-video-wrap');

				return videoWrap && videoWrap.video
					? videoWrap.video
					: slide.querySelector('.js-res-video');
			},
			getPlaybackVideo: function (carousel) {
				if (!carousel.swiperInstance) {
					return eventList.getSlideVideo(eventList.getActiveSlide(carousel));
				}

				const activeSlides = carousel.swiperState.activeSlides || [];

				for (let i = 0; i < activeSlides.length; i++) {
					const video = eventList.getSlideVideo(activeSlides[i]);

					if (video && !video.paused && !video.ended) return video;
				}

				for (let i = 0; i < activeSlides.length; i++) {
					const video = eventList.getSlideVideo(activeSlides[i]);

					if (video) return video;
				}

				return null;
			},
			getSlideChangeVideo: function (carousel) {
				if (!carousel.swiperInstance) return null;

				const activeSlides = carousel.swiperState.activeSlides || [];
				const slides = Array.from(carousel.slides || []);
				const columns = carousel.swiperState.columns || 1;
				const currentIndex = carousel.swiperInstance.realIndex;
				const previousRealIndex = carousel.swiperInstance.previousRealIndex;
				const previousIndex = typeof previousRealIndex === 'number'
					? previousRealIndex
					: carousel.swiperInstance.previousIndex;
				const isBridgeTarget = carousel.isBridgeMoving &&
					!carousel.isStepPassed &&
					currentIndex === carousel.finalTargetIndex;

				if (isBridgeTarget) {
					for (let i = 0; i < activeSlides.length; i++) {
						const video = eventList.getSlideVideo(activeSlides[i]);

						if (video) return video;
					}

					return null;
				}

				if (typeof previousIndex !== 'number' || previousIndex === currentIndex) return null;

				const previousEndIndex = previousIndex + columns - 1;

				for (let i = 0; i < activeSlides.length; i++) {
					const slide = activeSlides[i];
					const slideIndex = slides.indexOf(slide);

					if (slideIndex >= previousIndex && slideIndex <= previousEndIndex) continue;

					const video = eventList.getSlideVideo(slide);

					if (video) return video;
				}

				return null;
			},
			getActiveSlideMediaType: function (carousel) {
				const activeSlide = eventList.getActiveSlide(carousel);
				let videoWrap = null;
				let video = null;
				let image = null;

				if (!activeSlide) {
					return {
						type: '',
						slide: null,
						video: null,
						image: null
					};
				}

				videoWrap = activeSlide.querySelector('.js-video-wrap');
				video = videoWrap && videoWrap.video ? videoWrap.video : activeSlide.querySelector('.js-res-video');
				image = activeSlide.querySelector('.js-res-img');

				if (video) {
					return {
						type: 'video',
						slide: activeSlide,
						video: video,
						image: null
					};
				}

				if (image) {
					return {
						type: 'image',
						slide: activeSlide,
						video: null,
						image: image
					};
				}

				return {
					type: '',
					slide: activeSlide,
					video: null,
					image: null
				};
			},
			resetActiveSlideVideo: function (carousel) {
				const mediaInfo = eventList.getActiveSlideMediaType(carousel);

				if (mediaInfo.type !== 'video' || !mediaInfo.video) return;
				if (mediaInfo.video.readyState < 1) return;

				mediaInfo.video.currentTime = 0;
			},
			moveNextAfterVideoEnd: function (carousel) {
				const autoSlideOptions = carousel.carouselOptions.autoslide || {};
				const videoDelay = isMobile() && typeof autoSlideOptions.moVideoDelay === 'number'
					? autoSlideOptions.moVideoDelay
					: autoSlideOptions.videoDelay;
				const delay = typeof videoDelay === 'number' ? videoDelay : 1000;

				eventList.clearAutoSlideState(carousel);

				carousel.autoSlideTimer = setTimeout(function () {
					carousel.autoSlideTimer = null;

					if (!carousel.swiperInstance) return;
					if (!eventList.canAutoSlide(carousel)) return;

					carousel.swiperInstance.slideNext();
				}, delay);
			},
			canPlayActiveVideo: function (carousel) {
				if (eventList.isLowNetworkAutoSlideBlocked(carousel)) return false;
				if (!eventList.isAutoSlideTriggerCondition(carousel)) return false;

				return true;
			},
			playNoSwiperFirstVideo: function (carousel) {
				const triggerCondition = eventList.isAutoSlideTriggerCondition(carousel);

				if (triggerCondition) {
					if (carousel.wasInView === false || typeof carousel.wasInView === 'undefined') {
						const videoWraps = carousel.videoWrap;
						let foundFirstVideo = false;

						let startSearchIndex = carousel.noSwiperActiveIndex || 0;
						if (startSearchIndex >= videoWraps.length) startSearchIndex = 0;

						for (let i = startSearchIndex; i < videoWraps.length; i++) {
							const wrap = videoWraps[i];
							const video = wrap.video;
							const slide = wrap.closest('.swiper-slide');

							if (video && slide && eventList.isCarouselInViewport(slide)) {
								carousel.noSwiperActiveIndex = Array.from(carousel.slides).indexOf(slide);
								eventList.playVideo(video);
								foundFirstVideo = true;
								break;
							}
						}

						carousel.wasInView = true;
						return foundFirstVideo;
					}
				}

				return false;
			},
			syncAutoSlide: function (carousel) {
				let mediaInfo = eventList.getActiveSlideMediaType(carousel);
				const playbackVideo = carousel.swiperInstance ? eventList.getPlaybackVideo(carousel) : null;

				let imageProgressRange = null;
				let isImageProgressInRange = false;

				if (playbackVideo) {
					mediaInfo = {
						type: 'video',
						slide: playbackVideo.closest('.swiper-slide'),
						video: playbackVideo,
						image: null
					};
				}

				eventList.pauseInactiveSlideVideos(carousel);

				if (!carousel.swiperInstance && !mediaInfo.video) {
					const isInitialized = eventList.playNoSwiperFirstVideo(carousel);
					if (isInitialized) return;
				}

				if (!mediaInfo.slide) {
					eventList.clearAutoSlideState(carousel);
					return;
				}

				if (mediaInfo.type === 'video') {
					if (!eventList.canPlayActiveVideo(carousel)) {
						eventList.clearAutoSlideState(carousel);
						return;
					}


					if (!eventList.canAutoSlide(carousel)) {
						eventList.clearAutoSlideState(carousel);
						return;
					}

					return;
				}

				if (eventList.isLowNetworkAutoSlideBlocked(carousel)) {
					eventList.clearAutoSlideState(carousel);
					eventList.clearDelayedPlayTimer(carousel);
					eventList.resetPaginationProgress(carousel);
					return;
				}

				imageProgressRange = eventList.getImageProgressRange(carousel);
				isImageProgressInRange = carousel.scrollProgress > imageProgressRange.start && carousel.scrollProgress < imageProgressRange.end;


				if (!isImageProgressInRange) {
					eventList.clearAutoSlideState(carousel);
					eventList.clearProgressTimer(carousel);
					eventList.resetPaginationProgress(carousel);
					return;
				}

				if (eventList.isIndicatorAutoSlideButtonEnabled(carousel) && carousel.autoSlideStopped) {
					eventList.clearProgressTimer(carousel);
					return;
				}

				if (!carousel.isProgressPending) {
					eventList.delayProgress(carousel);
				}

				if (!eventList.canAutoSlide(carousel)) {
					eventList.clearAutoSlideState(carousel);
					return;
				}

				eventList.clearAutoSlideState(carousel);
			},
			pauseInactiveSlideVideos: function (carousel) {
				const slides = carousel.slides || [];
				const activeSlides = carousel.swiperInstance
					? carousel.swiperState.activeSlides || []
					: [eventList.getActiveSlide(carousel)];

				eventList.clearDelayedPlayTimer();

				slides.forEach(function (slide) {
					const video = eventList.getSlideVideo(slide);

					if (activeSlides.includes(slide)) return;
					if (!video || video.paused) return;

					video.pause();
				});
			},
			createAutoSlideButton: function (carousel) {
				const options = carousel.carouselOptions || {};
				const autoSlideOptions = options.autoslide || {};
				const isAutoSlideEnabled = !!autoSlideOptions.enabled;
				const isAutoSlideButtonEnabled = autoSlideOptions.createButton !== false;
				const isIndicatorButtonEnabled = eventList.isIndicatorAutoSlideButtonEnabled(carousel);

				if (!carousel.swiperInstance || !isAutoSlideEnabled || !isAutoSlideButtonEnabled) return;
				if (carousel.swiperInstance.isLocked) return;
				if (carousel.autoSlideBtn) return;

				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'common-carousel__autoplay-button';

				const span = document.createElement('span');
				span.className = 'common-text';
				span.textContent = eventList.getAutoSlideButtonText(carousel, true);

				btn.appendChild(span);

				btn.addEventListener('click', function () {
					if (isIndicatorButtonEnabled) {
						if (carousel.autoSlideStopped) {
							eventList.startAutoSlide(carousel);
						} else {
							eventList.stopAutoSlide(carousel);
						}

						return;
					}

					this.setAttribute('aria-disabled', 'true');
					this.setAttribute('tabindex', '-1');

					if (carousel.autoSlideStopped) return;

					eventList.stopAutoSlide(carousel);
				});

				if (carousel.container) {
					carousel.container.parentNode.insertBefore(btn, carousel.container);
				} else {
					carousel.appendChild(btn);
				}

				carousel.autoSlideBtn = btn;

				if (isIndicatorButtonEnabled) {
					const isAutoSlidePlaying = !eventList.isLowNetworkAutoSlideBlocked(carousel) && !carousel.autoSlideStopped;

					eventList.setAutoSlideButtonState(carousel, isAutoSlidePlaying);
				}
			},
			removeAutoSlideButton: function (carousel) {
				if (carousel.autoSlideBtn && carousel.autoSlideBtn.parentNode) {
					carousel.autoSlideBtn.parentNode.removeChild(carousel.autoSlideBtn);
				}
				carousel.autoSlideBtn = null;
			},
			setPaginationProgressNodes: function (carousel) {
				if (!carousel || !carousel.pagination) return;

				carousel.paginationProgressbar = carousel.pagination.querySelectorAll('.js-common-carousel-pagination-progressbar');
			},
			togglePaginationActive: function (carousel, isActive) {
				const bullets = carousel.pagination
					? carousel.pagination.querySelectorAll('.swiper-pagination-bullet')
					: [];
				const activeIndex = carousel.swiperInstance ? carousel.swiperInstance.realIndex : 0;
				const activeBullet = bullets[activeIndex];
				let i = 0;

				if (!bullets.length) return;

				if (!isActive) {
					for (i = 0; i < bullets.length; i++) {
						if (bullets[i].classList.contains('is-active')) {
							bullets[i].classList.remove('is-active');
						}
					}
					return;
				}

				if (!activeBullet) return;

				if (activeBullet.classList.contains('is-active')) return;

				activeBullet.classList.add('is-active');
			},
			clearDotStyle: function (dot) {
				if (!dot) return;

				dot.durationSet = false;
				dot.style.animation = 'none';
				dot.style.transform = 'scaleX(0)';

				void dot.offsetWidth;

				dot.style.animation = '';
			},
			cleanInactiveBullets: function (carousel) {
				let i = 0;
				let bullets = null;
				let activeIndex = 0;

				if (!carousel || !carousel.pagination) return;

				bullets = carousel.pagination.querySelectorAll('.swiper-pagination-bullet');
				activeIndex = carousel.swiperInstance ? carousel.swiperInstance.realIndex : 0;

				for (i = 0; i < bullets.length; i++) {
					if (i !== activeIndex && bullets[i].classList.contains('is-active')) {
						bullets[i].classList.remove('is-active');
					}
				}
			},
			resetPaginationProgress: function (carousel) {
				let i = 0;
				let dot = null;

				if (!carousel || !carousel.pagination) return;

				eventList.unbindImageProgressEnd(carousel);
				eventList.cleanInactiveBullets(carousel);

				if (!carousel.paginationProgressbar || !carousel.paginationProgressbar.length) return;

				for (i = 0; i < carousel.paginationProgressbar.length; i++) {
					dot = carousel.paginationProgressbar[i];
					eventList.clearDotStyle(dot);
				}
			},
			setProgressDuration: function (carousel, targetVideo) {
				const paginationOptions = carousel.carouselOptions.pagination || {};

				if (!paginationOptions.progressbar) return;

				if (!carousel.paginationProgressbar || carousel.paginationProgressbar.length === 0) {
					eventList.setPaginationProgressNodes(carousel);
				}

				const playbackVideo = targetVideo || eventList.getPlaybackVideo(carousel);
				const autoSlideOptions = carousel.carouselOptions.autoslide || {};
				const imageDelayOption = isMobile() && typeof autoSlideOptions.moImageDelay === 'number'
					? autoSlideOptions.moImageDelay
					: autoSlideOptions.imageDelay;
				const activeIndex = carousel.swiperInstance ? carousel.swiperInstance.realIndex : 0;
				const targetDot = carousel.paginationProgressbar && carousel.paginationProgressbar.length
					? carousel.paginationProgressbar[activeIndex]
					: null;
				const imageDelay = typeof imageDelayOption === 'number'
					? imageDelayOption / 1000
					: 3;

				if (!targetDot) return;

				if (playbackVideo) {
					if (!isNaN(playbackVideo.duration) && playbackVideo.duration > 0) {
						targetDot.style.animationDuration = playbackVideo.duration + 's';
						targetDot.durationSet = true;
						return;
					}

					if (playbackVideo.progressMetadataHandler) {
						playbackVideo.removeEventListener('loadedmetadata', playbackVideo.progressMetadataHandler);
					}

					playbackVideo.progressMetadataHandler = function (dot) {
						return function () {
							if (isNaN(this.duration) || this.duration <= 0) return;

							dot.style.animationDuration = this.duration + 's';
							dot.durationSet = true;
							this.removeEventListener('loadedmetadata', this.progressMetadataHandler);
						};
					} (targetDot);

					playbackVideo.addEventListener('loadedmetadata', playbackVideo.progressMetadataHandler);
					return;
				}

				targetDot.style.animationDuration = imageDelay + 's';
				targetDot.durationSet = true;
			},
			startPaginationProgress: function (carousel) {
				const paginationOptions = carousel.carouselOptions.pagination || {};
				const activeIndex = carousel.swiperInstance ? carousel.swiperInstance.realIndex : 0;
				const targetDot = carousel.paginationProgressbar && carousel.paginationProgressbar.length
					? carousel.paginationProgressbar[activeIndex]
					: null;

				if (!paginationOptions.progressbar) return;
				if (eventList.isIndicatorAutoSlideButtonEnabled(carousel) && carousel.autoSlideStopped) return;

				if (targetDot && !targetDot.durationSet) {
					eventList.setProgressDuration(carousel);
				}

				eventList.togglePaginationActive(carousel, true);
				eventList.bindImageProgressEnd(carousel);
			},
			stopPaginationProgress: function (carousel) {
				const paginationOptions = carousel.carouselOptions.pagination || {};

				if (!paginationOptions.progressbar) return;

				eventList.togglePaginationActive(carousel, false);
				eventList.unbindImageProgressEnd(carousel);
			},
			bindImageProgressEnd: function (carousel) {
				const activeIndex = carousel.swiperInstance ? carousel.swiperInstance.realIndex : 0;
				const mediaInfo = eventList.getActiveSlideMediaType(carousel);
				const playbackVideo = carousel.swiperInstance ? eventList.getPlaybackVideo(carousel) : null;
				const targetDot = carousel.paginationProgressbar ? carousel.paginationProgressbar[activeIndex] : null;

				if (!targetDot) return;

				if (targetDot.imageProgressEndHandler) {
					targetDot.removeEventListener('animationend', targetDot.imageProgressEndHandler);
					targetDot.imageProgressEndHandler = null;
				}

				if (playbackVideo || mediaInfo.type === 'video') return;

				targetDot.imageProgressEndHandler = function () {
					if (!carousel.swiperInstance) return;
					if (!eventList.canAutoSlide(carousel)) return;

					carousel.swiperInstance.slideNext();
				};

				targetDot.addEventListener('animationend', targetDot.imageProgressEndHandler);
			},
			unbindImageProgressEnd: function (carousel) {
				let i = 0;
				let targetDot = null;

				if (!carousel.paginationProgressbar || !carousel.paginationProgressbar.length) return;

				for (i = 0; i < carousel.paginationProgressbar.length; i++) {
					targetDot = carousel.paginationProgressbar[i];

					if (!targetDot || !targetDot.imageProgressEndHandler) continue;

					targetDot.removeEventListener('animationend', targetDot.imageProgressEndHandler);
					targetDot.imageProgressEndHandler = null;
				}
			},
			getCleanedHash: function () {
				const currentHash = window.location.hash;
				if (!currentHash) return '';

				const hashParts = currentHash.split('#');

				return hashParts.find(Boolean) || '';
			},
			findTargetCarouselByHash: function () {
				const cleanedHash = eventList.getCleanedHash();
				if (!cleanedHash) return;

				const targetSlide = document.querySelector('[data-slide-hash="' + cleanedHash + '"]');
				if (!targetSlide) return;

				const targetCarousel = targetSlide.closest(globalOptions.target);
				if (!targetCarousel) return;

				return {
					carousel: targetCarousel,
					hash: cleanedHash
				};
			},
			moveToHashTarget: function (carousel, hash) {
				const slides = carousel.slides || [];
				if (!slides.length) return;

				const cleanedHash = hash || eventList.getCleanedHash();
				if (!cleanedHash) return;

				const targetIndex = Array.from(slides).findIndex(function (slide) {
					return slide.getAttribute('data-slide-hash') === cleanedHash;
				});

				if (targetIndex !== -1) {
					const carouselStyle = window.getComputedStyle(carousel);
					const paddingTop = parseFloat(carouselStyle.paddingTop) || 0;
					const navHeight = utils.getStaticNavHeight();
					const sectionTop = carousel.getBoundingClientRect().top;
					const fixedOuterContainer = carousel.closest('.js-fixed-inner');
					const isTouchDevice = utils.detector.isTouchDevice || false;
					const hasRevealParent = isDesktop() && fixedOuterContainer && !lowNetwork && !isTouchDevice;

					let hashScroll = 0;

					if (hasRevealParent) {
						const containerAbsoluteTop = window.pageYOffset + fixedOuterContainer.getBoundingClientRect().top;
						const carouselOffsetFromParent = carousel.offsetTop;
						const revealMarginOffset = window.innerHeight;

						hashScroll = containerAbsoluteTop + carouselOffsetFromParent - paddingTop - navHeight + revealMarginOffset;
					} else {
						hashScroll = window.pageYOffset + sectionTop - paddingTop - navHeight;
					}

					setTimeout(()=>{
						window.scrollTo(0, hashScroll);
					}, 400);

					if (carousel.swiperInstance) {
						const isLoop = carousel.swiperInstance.params.loop;
						if (isLoop) {
							carousel.swiperInstance.slideToLoop(targetIndex, 0);
						} else {
							carousel.swiperInstance.slideTo(targetIndex, 0);
						}
					}
				}
			},
			playNextActiveVideo: function (carousel, currentVideo) {
				if (!carousel.swiperInstance || !currentVideo) return false;

				const activeSlides = carousel.swiperState.activeSlides || [];
				let currentFound = false;

				for (let i = 0; i < activeSlides.length; i++) {
					const video = eventList.getSlideVideo(activeSlides[i]);

					if (!video) continue;

					if (video === currentVideo) {
						currentFound = true;
						continue;
					}

					if (!currentFound) continue;

					if (video.readyState >= 1) {
						video.currentTime = 0;
					}

					const paginationOptions = carousel.carouselOptions.pagination || {};

					if (paginationOptions.progressbar) {
						eventList.resetPaginationProgress(carousel);
					}

					eventList.playVideo(video);
					return true;
				}

				return false;
			},
			playNextVisibleVideo: function (carousel, currentVideo) {
				const videoWraps = carousel.videoWrap;

				const currentIndex = videoWraps.findIndex(function (wrap) {
					return wrap.video === currentVideo;
				});

				if (currentIndex === -1) return;

				for (let i = currentIndex + 1; i < videoWraps.length; i++) {
					const nextWrap = videoWraps[i];
					const nextVideo = nextWrap.video;
					const targetSlide = nextWrap.closest('.swiper-slide');

					if (!nextVideo || !targetSlide) continue;

					if (!eventList.isCarouselInViewport(targetSlide)) {
						continue;
					}

					carousel.noSwiperActiveIndex = Array.from(carousel.slides).indexOf(targetSlide);

					eventList.playVideo(nextVideo);
					return;
				}
			},
			getStepMoveInfo: function (carousel, currentIndex, targetIndex) {
				const slideLength = carousel.slides ? carousel.slides.length : 0;
				const distance = Math.abs(targetIndex - currentIndex);

				const isTooShortDistance = slideLength < 5 || distance < 3;
				let middleIndex = 0;

				if (isTooShortDistance) {
					return null;
				}

				if (currentIndex < targetIndex) {
					middleIndex = targetIndex - 1;
				} else {
					middleIndex = targetIndex + 1;
				}

				return {
					middleIndex: middleIndex,
					targetIndex: targetIndex
				};
			},
			moveStepSlide: function (carousel, middleIndex, targetIndex) {
				const isAlreadyMoving = carousel.isBridgeMoving && carousel.isStepPassed;

				if (!carousel.swiperInstance || isAlreadyMoving) {
					return;
				}

				carousel.isBridgeMoving = true;
				carousel.isStepPassed = true;
				carousel.intermediateIndex = middleIndex;
				carousel.finalTargetIndex = targetIndex;

				carousel.swiperInstance.slideTo(middleIndex, 0);
			},
			isCustomPassingSlide: function (carousel) {
				const isPassing = carousel.isBridgeMoving && carousel.isStepPassed;
				return isPassing;
			},
			resetStepState: function (carousel) {
				carousel.isBridgeMoving = false;
				carousel.finalTargetIndex = null;
				carousel.intermediateIndex = null;
				carousel.isStepPassed = false;
			},
			bindBulletStepMove: function (carousel) {
				if (!carousel.pagination || !carousel.swiperInstance) {
					return;
				}

				const bullets = carousel.pagination.querySelectorAll('.swiper-pagination-bullet');
				const options = carousel.carouselOptions || {};
				const useBridgeSlide = !!options.useBridgeSlide;

				if (!useBridgeSlide) {
					return;
				}

				bullets.forEach(function (bullet, index) {
					if (bullet.dataset.stepAttached === 'true') {
						return;
					}

					bullet.addEventListener('click', function (e) {
						const isActive = bullet.classList.contains('swiper-pagination-bullet-active');

						let currentIndex = 0;
						let targetIndex = 0;
						let stepMoveInfo = null;

						if (isActive || !carousel.swiperInstance) {
							return;
						}

						e.preventDefault();
						e.stopPropagation();
						e.stopImmediatePropagation();

						eventList.stopAutoSlide(carousel);

						currentIndex = carousel.swiperInstance.realIndex;
						targetIndex = index;
						stepMoveInfo = eventList.getStepMoveInfo(carousel, currentIndex, targetIndex);

						if (stepMoveInfo) {
							eventList.moveStepSlide(carousel, stepMoveInfo.middleIndex, stepMoveInfo.targetIndex);
						} else {
							eventList.resetStepState(carousel);

							if (carousel.swiperInstance.params.loop) {
								carousel.swiperInstance.slideToLoop(targetIndex);
							} else {
								carousel.swiperInstance.slideTo(targetIndex);
							}
						}
					}, true);

					bullet.dataset.stepAttached = 'true';
				});
			}
		};

		const swiperEvents = {
			isSwiperEnabled: function (carousel) {
				const swiperOptions = carousel.carouselOptions.swiper || {};

				if (swiperOptions.mobileOnly) {
					return isMobile();
				}

				return true;
			},
			destroySingleSwiper: function (carousel) {
				if (!carousel.swiperInstance) return;

				eventList.removeAutoSlideButton(carousel);
				eventList.clearAutoSlideState(carousel);
				eventList.clearDelayedPlayTimer();
				eventList.clearProgressTimer(carousel);
				eventList.stopPaginationProgress(carousel);

				if (carousel.intersectionObserver) {
					carousel.intersectionObserver.disconnect();
					carousel.intersectionObserver = null;
				}

				accessibility.slideReset(carousel);

				carousel.swiperInstance.destroy(false, true);

				runHooks(carousel, 'destroy');

				carousel.swiperInstance = null;
			},
			set: function () {
				els.carousels.forEach(function (carousel) {
					if (!carousel.container) return;

					if (!swiperEvents.isSwiperEnabled(carousel)) {
						swiperEvents.destroySingleSwiper(carousel);
						return;
					}

					if (carousel.swiperInstance) return;

					const swiperOptions = mergeOptions({}, carousel.carouselOptions.swiper || {});
					const swiperSpeed = isMobile() && typeof swiperOptions.moSpeed === 'number'
						? swiperOptions.moSpeed
						: swiperOptions.speed;

					if (typeof swiperSpeed === 'number') {
						swiperOptions.speed = swiperSpeed;
					} else {
						delete swiperOptions.speed;
					}

					delete swiperOptions.moSpeed;

					carousel.swiperInstance = new Swiper(
						carousel.container,
						mergeOptions(
							swiperEvents.getBaseOptions(carousel),
							swiperOptions
						)
					);
				});
			},
			getPaginationLabelTitles: function (slides, bulletIndex, columns, isLoop) {
				const titles = [];
				const endIndex = bulletIndex + columns;

				for (let i = bulletIndex; i < endIndex; i++) {
					const slideIndex = isLoop ? i % slides.length : i;
					const slide = slides[slideIndex];

					if (!slide) continue;

					const slideTitle = slide.getAttribute('data-slide-title') || '';

					if (!slideTitle) continue;

					titles.push(slideTitle);
				}

				return titles;
			},
			getBaseOptions: function (carousel) {
				const paginationOptions = swiperEvents.getPaginationOptions(carousel);

				return {
					slidesPerView: 'auto',
					a11y: false,
					navigation: {
						nextEl: carousel.arrowNext,
						prevEl: carousel.arrowPrevious
					},
					pagination: paginationOptions.pagination,
					scrollbar: paginationOptions.scrollbar,
					on: {
						init: function (swiper) {
							carousel.swiperInstance = swiper;

							requestAnimationFrame(function () {
								if (!carousel.swiperInstance) return;
								eventList.createAutoSlideButton(carousel);
								eventList.clearDelayedPlayTimer();
								eventList.updateSwiperState(carousel);

								eventList.setPaginationProgressNodes(carousel);
								eventList.setProgressDuration(carousel);

								accessibility.slide(carousel);
								accessibility.updatePaginationAria(carousel);
								eventList.syncAutoSlide(carousel);

								eventList.bindBulletStepMove(carousel);

								runHooks(carousel, 'init');
							});
						},
						slideChange: function (swiper) {
							carousel.swiperInstance = swiper;

							const options = carousel.carouselOptions || {};
							const useBridgeSlide = !!options.useBridgeSlide;
							const isPassingSlide = eventList.isCustomPassingSlide(carousel);

							eventList.clearDelayedPlayTimer();
							eventList.clearProgressTimer(carousel);
							eventList.updateSwiperState(carousel);

							if (useBridgeSlide && isPassingSlide) {
								eventList.resetPaginationProgress(carousel);

								if (typeof eventList.togglePaginationActive === 'function') {
									eventList.togglePaginationActive(carousel, false);
								}

								swiperEvents.moveToStepTarget(carousel);
								return;
							}

							if (eventList.isLowNetworkAutoSlideBlocked(carousel)) {
								eventList.cleanInactiveBullets(carousel);
							} else {
								eventList.resetPaginationProgress(carousel);
							}

							eventList.setProgressDuration(carousel);
							eventList.loadPassedSlideMediaAssets(carousel);
							eventList.loadSlideChangeMediaAssets(carousel);

							accessibility.slide(carousel);
							accessibility.updatePaginationAria(carousel);
							eventList.syncAutoSlide(carousel);

							if (!eventList.isLowNetworkAutoSlideBlocked(carousel)) {
								eventList.playActiveSlideVideo(carousel);
							}

							if (useBridgeSlide) {
								swiperEvents.finishStepMove(carousel);
							}

							runHooks(carousel, 'slideChange');
						},
						paginationUpdate: function () {
							accessibility.updatePaginationAria(carousel);
						},
						touchStart: function () {
							carousel.swipeStartPosition = carousel.swiperInstance && carousel.swiperInstance.wrapperEl
								? carousel.swiperInstance.wrapperEl.style.transform
								: '';
						},
						touchEnd: function () {
							carousel.swipeEndPosition = carousel.swiperInstance && carousel.swiperInstance.wrapperEl
								? carousel.swiperInstance.wrapperEl.style.transform
								: '';

							if (carousel.swipeStartPosition !== carousel.swipeEndPosition) {
								eventList.stopAutoSlide(carousel);
							}
						}
					}
				};
			},
			getActiveSlidesByIndex: function (slides, activeIndex, columns, isLoop) {
				const activeSlides = [];

				if (!slides || !slides.length) return activeSlides;

				for (let i = 0; i < columns; i++) {
					const slideIndex = isLoop ? (activeIndex + i) % slides.length : activeIndex + i;
					const slide = slides[slideIndex];

					if (!slide) break;

					activeSlides.push(slide);
				}

				return activeSlides;
			},
			setActiveSlides: function (carousel) {
				const swiper = carousel.swiperInstance;
				const slides = carousel.slides;
				const columns = carousel.swiperState.columns || 1;
				const activeSlideIndex = swiper ? swiper.realIndex : 0;
				const isLoop = !!(swiper && swiper.params.loop);

				carousel.swiperState.activeSlides = swiperEvents.getActiveSlidesByIndex(
					slides,
					activeSlideIndex,
					columns,
					isLoop
				);
			},
			destroySwiper: function () {
				els.carousels.forEach(function (carousel) {
					swiperEvents.destroySingleSwiper(carousel);
				});
			},
			reInit: function () {
				swiperEvents.destroySwiper();
				swiperEvents.set();
			},
			getSlideMediaType: function (slide) {
				let videoWrap = null;
				let video = null;
				let image = null;

				if (!slide) return '';

				videoWrap = slide.querySelector('.js-video-wrap');
				video = videoWrap && videoWrap.video ? videoWrap.video : slide.querySelector('.js-res-video');
				image = slide.querySelector('.js-res-img');

				if (video) return 'video';
				if (image) return 'image';

				return 'copy';
			},
			getPaginationType: function (carousel) {
				if (
					carousel.carouselOptions.pagination &&
					typeof carousel.carouselOptions.pagination.type === 'string' &&
					carousel.carouselOptions.pagination.type
				) {
					return carousel.carouselOptions.pagination.type;
				}

				if (carousel.paginationWrap && carousel.paginationWrap.dataset.pagination) {
					return carousel.paginationWrap.dataset.pagination;
				}

				return 'dot';
			},
			renderBulletItem: function (swiper, index, className, carousel, hasDot) {
				const slide = swiper.slides[index];
				const slideTitle = slide ? slide.getAttribute('data-slide-title') || '' : '';
				const slideTagging = slide ? slide.getAttribute('data-slide-tagging-feature') : '';
				const featureTagging = carousel.container ? carousel.container.getAttribute('data-tagging-feature') || '' : '';
				const paginationOptions = carousel.carouselOptions.pagination || {};
				const useProgressbar = !!paginationOptions.progressbar;
				const slideMedia = useProgressbar ? swiperEvents.getSlideMediaType(slide) : '';
				const bulletMediaClass = slideMedia ? ' is-media-' + slideMedia : '';
				const tagging = {
					omniType: 'microsite_contentinter',
					actionType: 'gallery',
					contentType: 'feature gallery',
					taggingValue: featureTagging + ':index:' + (slideTagging || index + 1)
				};
				let innerMarkup = '';

				if (useProgressbar) {
					innerMarkup =
					'<span class="swiper-pagination-bullet-button-dot">' +
						'<span class="swiper-pagination-progressbar js-common-carousel-pagination-progressbar"></span>' +
					'</span>';
				} else if ((hasDot)) {
					innerMarkup = '<span class="swiper-pagination-bullet-button-dot"></span>';
				}

				return '' +
					'<li role="listitem" class="' + className + bulletMediaClass + '">' +
						'<button type="button" ' + utils.setTagging(tagging) +
							' class="swiper-pagination-bullet-button"' +
							' aria-label="Slide' + (index + 1) + ': ' + slideTitle + '">' +
							innerMarkup +
						'</button>' +
					'</li>';
			},
			getPaginationOptions: function (carousel) {
				const paginationType = swiperEvents.getPaginationType(carousel);

				if (paginationType === 'scrollbar') {
					return {
						pagination: carousel.pagination ? {
							el: carousel.pagination,
							clickable: true,
							renderBullet: function (index, className) {
								return swiperEvents.renderBulletItem(this, index, className, carousel, false);
							}
						} : false,
						scrollbar: carousel.scrollbar ? {
							el: carousel.scrollbar,
							draggable: true
						} : false
					};
				}

				return {
					pagination: carousel.pagination ? {
						el: carousel.pagination,
						clickable: true,
						renderBullet: function (index, className) {
							return swiperEvents.renderBulletItem(this, index, className, carousel, true);
						}
					} : false,
					scrollbar: false
				};
			},
			moveToStepTarget: function (carousel) {
				if (!carousel.swiperInstance) {
					return;
				}

				const currentIndex = carousel.swiperInstance.realIndex;
				const isTargetValid = carousel.isBridgeMoving && carousel.isStepPassed;
				const isAtIntermediate = currentIndex === carousel.intermediateIndex;

				if (!isTargetValid || !isAtIntermediate) {
					return;
				}

				carousel.isStepPassed = false;

				requestAnimationFrame(function () {
					if (!carousel.swiperInstance) {
						return;
					}

					const targetSpeed = carousel.swiperInstance.params.speed || 600;
					const targetIndex = carousel.finalTargetIndex;

					if (carousel.swiperInstance.params.loop) {
						carousel.swiperInstance.slideToLoop(targetIndex, targetSpeed);
					} else {
						carousel.swiperInstance.slideTo(targetIndex, targetSpeed);
					}
				});
			},
			finishStepMove: function (carousel) {
				if (!carousel.swiperInstance) {
					return;
				}

				const currentIndex = carousel.swiperInstance.realIndex;
				const isMoveFinished = carousel.isBridgeMoving && !carousel.isStepPassed;
				const isAtFinalTarget = currentIndex === carousel.finalTargetIndex;

				if (isMoveFinished && isAtFinalTarget) {
					eventList.resetStepState(carousel);
				}
			}
		};

		const setTagging = {
			play: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					let dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace('pause', 'play'));
				}

				if (targetController.hasAttribute('ga-la')) {
					let gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace('pause', 'play'));
				}
			},
			pause: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					let dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace(/play(?!.*play)/, 'pause'));
				}

				if (targetController.hasAttribute('ga-la')) {
					let gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace(/play(?!.*play)/, 'pause'));
				}
			},
			start: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					let dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace(/\bstop\b/, 'start'));
				}

				if (targetController.hasAttribute('ga-la')) {
					let gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace(/\bstop\b/, 'start'));
				}
			},
			stop: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					let dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace(/\bstart\b/, 'stop'));
				}

				if (targetController.hasAttribute('ga-la')) {
					let gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace(/\bstart\b/, 'stop'));
				}
			}
		};

		const accessibility = {
			arrowFocus: function (currentArrow, fallbackArrow) {
				if (!currentArrow || !fallbackArrow) return;

				if (currentArrow.classList.contains('swiper-button-disabled')) {
					fallbackArrow.focus();
				}
			},
			slide: function (carousel) {
				const swiper = carousel.swiperInstance;

				if (!swiper) return;

				const slides = swiper.slides;
				const columns = carousel.swiperState.columns || 1;
				const activeSlides = swiperEvents.getActiveSlidesByIndex(
					slides,
					swiper.activeIndex,
					columns,
					!!swiper.params.loop
				);

				slides.forEach(function (slide) {
					if (activeSlides.includes(slide)) {
						utils.offAccessibility(slide);
					} else {
						utils.onAccessibility(slide);
					}
				});
			},
			slideReset: function (carousel) {
				if (!carousel.swiperInstance) return;

				carousel.swiperInstance.slides.forEach(function (slide) {
					utils.offAccessibility(slide);
				});
			},
			updatePaginationAria: function (carousel) {
				if (!carousel || !carousel.swiperInstance || !carousel.swiperInstance.pagination) return;

				const bullets = carousel.swiperInstance.pagination.bullets || [];
				const isLoop = carousel.swiperInstance.params.loop;
				const slides = isLoop ? carousel.slides || [] : carousel.swiperInstance.slides || [];
				const columns = carousel.swiperState.columns || 1;
				const selectedTextClean = (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) ? LOCAL_VARI.selected : 'Selected';
				const slideTextClean = (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) ? LOCAL_VARI.slide : 'Slide';

				for (let i = 0; i < bullets.length; i++) {
					const bullet = bullets[i];
					const button = bullet ? bullet.querySelector('button') : null;
					const titles = swiperEvents.getPaginationLabelTitles(slides, i, columns, isLoop);
					const isActive = bullet && bullet.classList.contains('swiper-pagination-bullet-active');
					const selectedText = isActive ? ' ' + selectedTextClean : '';

					if (!button) continue;

					button.setAttribute(
						'aria-label',
						slideTextClean + (i + 1) + selectedText + ': ' + titles.join(', ')
					);
				}
			}
		};

		const mergeOptions = function (base, extra) {
			const result = {};

			for (const key in base) {
				if (Object.prototype.hasOwnProperty.call(base, key)) {
					if (isPlainObject(base[key])) {
						result[key] = mergeOptions(base[key], {});
					} else if (Array.isArray(base[key])) {
						result[key] = base[key].slice();
					} else {
						result[key] = base[key];
					}
				}
			}

			for (const key in extra) {
				if (Object.prototype.hasOwnProperty.call(extra, key)) {
					if (isPlainObject(extra[key]) && isPlainObject(result[key])) {
						result[key] = mergeOptions(result[key], extra[key]);
					} else if (Array.isArray(extra[key])) {
						result[key] = extra[key].slice();
					} else {
						result[key] = extra[key];
					}
				}
			}

			return result;
		};

		const isPlainObject = function (value) {
			return Object.prototype.toString.call(value) === '[object Object]';
		};

		return {
			init: init,
			destroy: swiperEvents.destroySwiper,
			reInit: swiperEvents.reInit,
			refresh: eventList.refresh
		};
	})();
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};
	window.flagship.features.carouselPlugins = window.flagship.features.carouselPlugins || {};

	window.flagship.features.carouselPlugins.dimmed = function (context) {
		function setDimmedState(payload) {
			const carousel = payload.carousel;
			const activeSlides = payload.state.activeSlides || [];

			if (!carousel || !carousel.slides || !carousel.slides.length) return;

			carousel.slides.forEach(function (slide) {
				slide.classList.add('is-dimmed');
			});

			activeSlides.forEach(function (slide) {
				if (slide) {
					slide.classList.remove('is-dimmed');
				}
			});
		}

		function resetDimmedState(payload) {
			const carousel = payload.carousel;
			if (!carousel || !carousel.slides || !carousel.slides.length) return;

			carousel.slides.forEach(function (slide) {
				slide.classList.remove('is-dimmed');
			});
		}

		context.onInit(function (payload) {
			setDimmedState(payload);
		});

		context.onSlideChange(function (payload) {
			setDimmedState(payload);
		});

		context.onDestroy(function (payload) {
			resetDimmedState(payload);
		});
	};
})();

(function () {
	window.flagship.features.clickToVideo = (function () {
		const utils = window.flagship.common.utils;

		let els = {
			clickToVideosWrap: [],
			clickToVideo: [],
		};

		const init = function () {
			els.clickToVideosWrap = document.querySelectorAll('.js-click-video');

			if (els.clickToVideosWrap.length > 0) {
				setProperty();
				bindEvents();
			}
		};

		const setProperty = function () {
			for (let i = 0; i < els.clickToVideosWrap.length; i++) {
				els.clickToVideosWrap[i].video = els.clickToVideosWrap[i].querySelector('video');
				els.clickToVideosWrap[i].controller = els.clickToVideosWrap[i].querySelector('.js-video-control');
				els.clickToVideosWrap[i].controller.video = els.clickToVideosWrap[i].video;
			}
		};

		const bindEvents = function () {
			eventList.setVideo();
			eventHandler.click();
		};

		const eventHandler = {
			click: function () {
				for (let i = 0; i < els.clickToVideosWrap.length; i++) {
					els.clickToVideosWrap[i].controller.addEventListener('click', eventList.clickVideoCta);
				}
			}
		};

		const eventList = {
			setVideo: function () {
				for (let i = 0; i < els.clickToVideosWrap.length; i++) {
					els.clickToVideo[i] = utils.videoHandler({
						wrap: els.clickToVideosWrap[i],
						video: els.clickToVideosWrap[i].video,
						controller: els.clickToVideosWrap[i].controller,
						playCallback: function () {
							setTagging.pause(this.controller);
						},
						pauseCallback: function () {
							setTagging.play(this.controller);
						}
					});
				}
			},
			clickVideoCta: function (e) {
				if (e.target == e.currentTarget) {
					if (e.currentTarget.video.paused) {
						e.currentTarget.video.play();
					} else {
						e.currentTarget.video.pause();
					}
				}
			}
		};

		const setTagging = {
			play: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					let dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace('pause', 'play'));
				}

				if (targetController.hasAttribute('ga-la')) {
					let gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace('pause', 'play'));
				}
			},
			pause: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					let dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace(/play(?!.*play)/, 'pause'));
				}

				if (targetController.hasAttribute('ga-la')) {
					let gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace(/play(?!.*play)/, 'pause'));
				}
			}
		};

		return {
			init: init
		}
	})();
})();
;
(function () {
	window.flagship.features.faqBanner = (function () {
		const resize = window.flagship.common.resize;

		let faqInstances = [];

		const init = function () {
			const faqSections = document.querySelectorAll('.js-faq-banner');

			for (let i = 0; i < faqSections.length; i++) {
				const instance = createInstance(faqSections[i]);
				faqInstances.push(instance);
			}
		};

		const createInstance = function (section) {
			let els = {},
				obj = {},
				prevDevice = resize.checkResolution(),
				currDevice = resize.checkResolution();

			const initInstance = function () {
				els.section = section;

				if (!!els.section) {
					setElements();
					bindEvents();
				}
			};

			const setElements = function () {
				els.accordionList = els.section.querySelector('.js-accordion-list');
			};

			const bindEvents = function () {
				resize.add(eventList.resize);
				eventList.setAccordion();
				eventList.setHeight();
			};

			const eventList = {
				resize: function (currRes) {
					currDevice = currRes;

					if (currDevice != prevDevice) {
						eventList.destroyAccordion();
						eventList.setAccordion();
						eventList.setHeight();
						prevDevice = currDevice;
					}
				},
				setHeight: function () {
					if (!els.accordionList) return;

					const items = els.accordionList.querySelectorAll('.js-accordion-item');

					items.forEach(function (item) {
						const content = item.querySelector('.js-accordion-content');
						if (!content) return;

						if (item.classList.contains('is-open')) {
							const scrollHeight = content.scrollHeight;
							content.style.height = `${scrollHeight}px`;
						} else {
							content.style.height = '0px';
						}
					});
				},
				setAccordion: function () {
					if (!els.accordionList) return;

					obj.accordion = new window.flagship.common.accordion({
						wrap: els.accordionList,
						openType: 'toggle',
					});
					obj.accordion.init();
				},
				destroyAccordion: function () {
					if (obj.accordion) {
						obj.accordion.destroy();
						obj.accordion = null;
					}
				}
			};
			
			initInstance();

			return {
				els: els
			};
		};

		return {
			init: init
		};
	})();
})();

(function () {
	window.flagship.features.featureInteraction = (function () {
		const resize = window.flagship.common.resize;
		let els = {},
			currDevice = resize.checkResolution(),
			prevDevice = resize.checkResolution(),
			prevY = window.scrollY,
			fadeInObserver = null,
			currentTargets = null;

		const init = function () {
			setElements();
			bindEvents();
		};

		const setElements = function () {
			els.pcTargets = document.querySelectorAll('.js-feature-pc');
			els.moTargets = document.querySelectorAll('.js-feature-mo');
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			eventList.setupInteractionObserver();
		};

		const stateCheck = {
			isMobile: function () {
				return currDevice === 'mobile' || currDevice === 'mobileS';
			},
			checkY: function (target) {
				const vh10 = window.innerHeight * .1;
				if (target.isChangeY) {
					return 50;
				} else {
					if (vh10 > 90) return 90;
					else return vh10;
				}
			}
		};

		const eventList = {
			resize: function () {
				currDevice = resize.checkResolution();

				if (currDevice !== prevDevice) {
					eventList.destroy();
					eventList.setupInteractionObserver();
					prevDevice = currDevice;
				}
			},
			triggerFadeIn: (targets) => {
				let delayCount = 0;
				gsap.to(targets, {
					y: 0,
					opacity: 1,
					duration: stateCheck.isMobile() ? .4 : .6,
					ease: 'cubic-bezier(0.37, 0, 0.63, 1)',
					stagger: (index, target) => {
						if (stateCheck.isMobile()) return 0;
						if (target.dataset.delay === 'true') {
							const currentDelay = delayCount * 0.2;
							delayCount++;
							return currentDelay;
						}

						return 0;
					},
				});
			},
			resetFadeIn: (target) => {
				gsap.set(target, {
					y: stateCheck.checkY(target),
					opacity: 0,
				});
			},
			createObserver: () => {
				const observerOptions = {
					rootMargin: '15% 0px 0px 0px'
				};

				return new IntersectionObserver(entries => {
					const fadeInList = [];
					const currentY = window.scrollY;
					let isScrollDown = currentY > prevY;

					entries.forEach(entry => {
						const targetHeight = entry.boundingClientRect.height;
						if (targetHeight < 20) {
							entry.target.isChangeY = true;
						}

						if(entry.isIntersecting) {
							fadeInList.push(entry.target);
						}
						
						if (window.location.hash && entry.isIntersecting) {
							fadeInList.push(entry.target);
						}

						if (entry.boundingClientRect.bottom < 0) {
							gsap.set(entry.target, {
								y: 0,
								opacity: 1,
							});
						} else if (entry.isIntersecting && isScrollDown) {
							fadeInList.push(entry.target);
						} else if ((entry.boundingClientRect.top > window.innerHeight) && !isScrollDown) {
							eventList.resetFadeIn(entry.target)
						}

						prevY = currentY;
					});

					if (fadeInList.length > 0) eventList.triggerFadeIn(fadeInList);

				}, observerOptions);
			},
			setupInteractionObserver: () => {
				fadeInObserver = eventList.createObserver();
				currentTargets = stateCheck.isMobile() ? els.moTargets : els.pcTargets;
				currentTargets.forEach(el => fadeInObserver.observe(el));
			},
			destroy: () => {
				if (fadeInObserver && currentTargets) {
					fadeInObserver.disconnect();
					gsap.killTweensOf(currentTargets);
					gsap.set(currentTargets, {
						clearProps: 'all'
					});
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};

	window.flagship.features.commonPopup = (function () {
		const utils = window.flagship.common.utils;

		let els = {},
			startY,
			currentY,
			endY,
			matchedPopup = [];

		const init = function () {
			els.popups = document.querySelectorAll('.js-common-popup');

			if (els.popups && els.popups.length > 0) {
				setElements();
				setProperty();
				bindEvents();
			}
		};

		const bindEvents = function () {
			eventList.setPopup();
		};

		const setElements = function () {
			els.openers = document.querySelectorAll('.js-popup-cta');
		};

		const setProperty = function () {
			els.popups.forEach((popup) => {
				const popupMatch = popup.getAttribute('data-popup-match');
				const matchedOpeners = [];

				els.openers.forEach((opener) => {
					if (opener.getAttribute('data-popup-match') === popupMatch) {
						matchedOpeners.push(opener);
					}
				});

				if (matchedOpeners.length === 0) return;

				matchedPopup.push(popup);
				popup.slider = popup.querySelector('.js-common-popup-slider');
				popup.inner = popup.querySelector('.js-popup-inner');
				popup.opener = matchedOpeners;
				popup.closeCta = popup.querySelectorAll('.js-common-popup-close-cta');
				popup.dimmed = popup.querySelector('.js-common-popup-dimmed');

				matchedOpeners.forEach(function (opener) {
					opener.popup = popup;
				});
			});
		};

		const eventList = {
			setPopup: function () {
				els.popups.forEach((popup) => {
					if (!!!matchedPopup.includes(popup)) return;

					utils.layerPopup({
						layerPopup: popup,
						openCta: popup.opener,
						closeCta: popup.closeCta,
						dimmed: popup.dimmed,
						opts: {},
						show: {
							start: function () {
								setTimeout(() => {
									if (!!!popup.opts) return;
									if (!!popup.opts.show && !!popup.opts.show.start) popup.opts.show.start();
								})
							},
							end: function () {
								setTimeout(() => {
									eventList.closeToScroll(popup);
									if (!!!popup.opts) return;

									if (!!popup.opts.show && !!popup.opts.show.end) popup.opts.show.end();
								})

							}
						},
						hide: {
							start: function () {
								setTimeout(() => {
									if (!!!popup.opts) return;
									if (!!popup.opts.hide && !!popup.opts.hide.start) popup.opts.hide.start();
								})
							},
							end: function () {
								setTimeout(() => {
									if (!!!popup.opts) return;
									if (!!popup.opts.hide && !!popup.opts.hide.end) popup.opts.hide.end();
								})
							}
						}
					});
				});
			},
			closeToScroll: function (popup) {
				popup.slider.addEventListener('touchstart', (e) => {
					startY = e.touches[0].clientY;
					popup.currentY = 0;
				});

				popup.slider.addEventListener('touchmove', (e) => {
					currentY = e.changedTouches[0].clientY;

					let moveY = popup.currentY + startY - currentY;
					if (startY < currentY) popup.inner.style.bottom = `calc(0% + ${moveY}px)`;
				});

				popup.slider.addEventListener('touchend', (e) => {
					endY = e.changedTouches[0].clientY;

					function swipe() {
						const diffX = endY - startY;

						if (diffX > 200) {
							popup.inner.style.transition = '.3s';
							popup.inner.style.top = '100%';

							setTimeout(() => {
								popup.inner.style.transition = '';
								popup.style.visibility = 'hidden';
								popup.classList.remove('is-init', 'is-open');
								popup.hide();
								popup.inner.style.top = '';
							}, 300);
							setTimeout(() => {
								popup.style.visibility = '';
								popup.inner.style.bottom = '';
							}, 1000);

							if (popup.openCta) popup.openCta.focus();
						} else {
							popup.inner.style.bottom = '';
						}
					}
					swipe();
				});
			}
		}

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship.features.scrollVideo = (function () {
		const utils = window.flagship.common.utils,
			resize = window.flagship.common.resize;
		let els = {
				scrollVideoWraps: [],
			},
			obj = {
				scrollVideo: [],
				scene: [],
			},
			currDevice = resize.checkResolution();

		const init = function () {
			els.scrollVideoWraps = document.querySelectorAll('.js-scroll-video');

			if (els.scrollVideoWraps.length > 0) {
				setProperty();
				eventList.setVideo();
				eventList.setScene();
				bindEvents();
			}
		};

		const setProperty = function () {
			for (let i = 0; i < els.scrollVideoWraps.length; i++) {
				els.scrollVideoWraps[i].video = els.scrollVideoWraps[i].querySelector('video');
				els.scrollVideoWraps[i].controller = els.scrollVideoWraps[i].querySelector('.js-video-control');
				els.scrollVideoWraps[i].controller.video = els.scrollVideoWraps[i].video;
				els.scrollVideoWraps[i].startPoint = !!els.scrollVideoWraps[i].getAttribute('data-start-point') ? parseInt(els.scrollVideoWraps[i].getAttribute('data-start-point')) : undefined;
				els.scrollVideoWraps[i].reversePoint = !!els.scrollVideoWraps[i].getAttribute('data-reverse-point') ? parseInt(els.scrollVideoWraps[i].getAttribute('data-reverse-point')) : undefined;
				els.scrollVideoWraps[i].moStartPoint = !!els.scrollVideoWraps[i].getAttribute('data-mo-start-point') ? parseInt(els.scrollVideoWraps[i].getAttribute('data-mo-start-point')) : undefined;
				els.scrollVideoWraps[i].moReversePoint = !!els.scrollVideoWraps[i].getAttribute('data-mo-reverse-point') ? parseInt(els.scrollVideoWraps[i].getAttribute('data-mo-reverse-point')) : undefined;
			}
		};

		const bindEvents = function () {
			eventHandler.scroll();
			eventList.scroll();
			eventHandler.click();
			resize.add(eventList.resize);
		};

		const eventHandler = {
			scroll: function () {
				window.addEventListener('scroll', eventList.scroll);
			},
			click: function () {
				for (let i = 0; i < els.scrollVideoWraps.length; i++) {
					els.scrollVideoWraps[i].controller.addEventListener('click', eventList.clickVideoCta);
				}
			}
		};

		const eventList = {
			setVideo: function () {
				for (let i = 0; i < els.scrollVideoWraps.length; i++) {
					obj.scrollVideo[i] = utils.videoHandler({
						playType: 'scrollPlay',
						startPoint: (currDevice.indexOf('mobile') > -1) ? els.scrollVideoWraps[i].moStartPoint : els.scrollVideoWraps[i].startPoint,
						reversePoint: (currDevice.indexOf('mobile') > -1) ? els.scrollVideoWraps[i].moReversePoint : els.scrollVideoWraps[i].reversePoint,
						wrap: els.scrollVideoWraps[i],
						video: els.scrollVideoWraps[i].video,
						controller: els.scrollVideoWraps[i].controller,
						resetCallback: function () {},
						playCallback: function () {
							setTagging.pause(this.controller);
						},
						pauseCallback: function () {
							setTagging.play(this.controller);
						},
						endCallback: function () {}
					});
				}
			},
			setScene: function () {
				for (let i = 0; i < els.scrollVideoWraps.length; i++) {
					obj.scene[i] = SCROLLER({
						trackElement: els.scrollVideoWraps[i].video,
						useFixed: false,
						resize: utils.detector.isTouchDevice ? false : true
					});
				}
			},
			scroll: function () {
				for (let i = 0; i < els.scrollVideoWraps.length; i++) {
					obj.scene[i].trackAnimation(function () {
						obj.scrollVideo[i].scrollActive(this.progress);
					});
				}
			},
			resize: function (currRes) {
				currDevice = currRes;
			},
			clickVideoCta: function (e) {
				if (e.target == e.currentTarget) {
					if (e.currentTarget.video.paused) {
						e.currentTarget.video.play();
					} else {
						e.currentTarget.video.pause();
					}
				}
			}
		};

		const setTagging = {
			play: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					let dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace('pause', 'play'));
				}

				if (targetController.hasAttribute('ga-la')) {
					let gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace('pause', 'play'));
				}
			},
			pause: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					let dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace(/play(?!.*play)/, 'pause'));
				}

				if (targetController.hasAttribute('ga-la')) {
					let gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace(/play(?!.*play)/, 'pause'));
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship.features.commonSectionIntraction = (function () {
		const resize = window.flagship.common.resize,
			utils = window.flagship.common.utils;

		let els = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution(),
			isDestroyed = false;

		const INNER_SCROLL_OFFSETS = [0, 1];

		const init = function () {
			els.bottom = document.querySelectorAll('.js-reveal-bottom');
			els.top = document.querySelectorAll('.js-reveal-top');

			if (els.bottom.length != els.top.length) return;
				isDestroyed = false;
				setElements();
				bindEvents();

		};

		const setElements = function () {
			els.onlyTop = document.querySelectorAll('.js-reveal-top:not(.js-reveal-bottom)');
			els.videoTrack = document.querySelectorAll('.js-reveal-video-wrap');
			els.inner = null;
		};

		const bindEvents = function () {
			eventList.createInner();
			eventList.setDefault();

			eventList.brokenFixed();
			resize.add(eventList.resize);
			eventHandler.load();
			eventHandler.focus();
		};

		const eventHandler = {
			load: function () {
				window.addEventListener('load', eventList.setInnerHeight);
			},
			focus: function () {
				for (let i = 0; i < els.videoTrack.length; i++) {
					const clickables = els.videoTrack[i].querySelectorAll('button, a, [role="button"]')

					clickables.forEach(function (clickable) {
						clickable.addEventListener('focus', function (event) {
							eventList.controlFocus(i);
						});
					});
				}
			}
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;

				if (isDestroyed) {
					if (currDevice != prevDevice) {
						prevDevice = currDevice;
						eventList.brokenFixed();
					}
					return;
				}

				eventList.setDefault();
				eventList.setInnerHeight();
				eventList.brokenFixed();

				if (currDevice !== prevDevice) {
					prevDevice = currDevice;
				}
			},
			createInner: function () {
				for (let i = 0; i < els.bottom.length; i++) {
					if (els.bottom[i].parentNode.classList.contains('js-fixed-inner')) {
						continue;
					}

					const inner = document.createElement("div");
					inner.className = "js-fixed-inner";

					const originParent = els.bottom[i].parentNode;
					if (originParent) {
						originParent.insertBefore(inner, els.bottom[i]);
						inner.appendChild(els.bottom[i]);
					}
				}
				els.inner = document.querySelectorAll('.js-fixed-inner');
			},
			setDefault: function () {
				if (isDestroyed) return;

				for (let i = 0; i < els.bottom.length; i++) {
					const trackHeight = els.videoTrack[i]?.clientHeight;
					const videoPosition = (window.innerHeight > trackHeight) ? window.innerHeight - trackHeight : "0";

					gsap.set(els.bottom[i], {
						position: "sticky",
						top: `${videoPosition}px`,
						left: 0,
						right: 0,
					});
					gsap.set(els.top[i], {
						zIndex: els.top.length - i + 1,
						marginBottom: - window.innerHeight
					});
				}

				if (els.onlyTop) {
					for (let i = 0; i < els.onlyTop.length; i++) {
						gsap.set(els.onlyTop[i], {
							position: "relative",
						});
					}
				}
			},
			setInnerHeight: function () {
				if (isDestroyed || !els.inner) return;

				for (let i = 0; i < els.bottom.length; i++) {
					if (!els.inner[i]) continue;
					const sectionHeight = els.bottom[i].clientHeight;
					const offsetRatio = (INNER_SCROLL_OFFSETS[i] !== undefined) ? INNER_SCROLL_OFFSETS[i] : 1;
					const innerHeight = sectionHeight + (window.innerHeight * offsetRatio);
					const themeBlack = els.inner[i].querySelector('.theme-black');

					if (themeBlack) {
						els.inner[i].style.backgroundColor = 'black'
					} else {
						els.inner[i].style.backgroundColor = 'white'
					}

					els.inner[i].style.height = `${innerHeight}px`;
				}
			},
			brokenFixed: function () {

				const contentsHeight = [];
				const isDesktop = currDevice.indexOf('desktop') > -1;
				const isTouchDevice = utils.detector.isTouchDevice;
				const notDevice = isDesktop && !isTouchDevice;
				const zoom = document.querySelector('html').classList.contains('browser-zoomed-300');
				const lowNetwork = document.querySelector('html').classList.contains('low_network');

				for (let i = 0; i < els.bottom.length; i++) {
					const bottomHeight = els.bottom[i].clientHeight;
					const innerHeight = window.innerHeight * 0.90;

					const CheckViewport = bottomHeight > innerHeight;
					contentsHeight.push(CheckViewport);
				}
				const notBroken = contentsHeight.every(Boolean);

				if (notBroken && !zoom && !lowNetwork && notDevice ) {
					if (isDestroyed) {
						isDestroyed = false;


						setElements();
						eventList.createInner();
						eventList.setDefault();
						eventList.setInnerHeight();
					}
				} else {
					if (!isDestroyed) {
						destroy.all();
					}
				}
			},
			controlFocus: function (index) {
				const lastFeature = els.top[index].lastElementChild;
				const revealClose = lastFeature.getBoundingClientRect().bottom;
				const revealOpen = els.videoTrack[index].getBoundingClientRect().top;
				const navHeight = utils.getStaticNavHeight();

				if (revealOpen < revealClose || revealOpen < 0) {
					const targetFocus = window.scrollY + revealClose - navHeight;

					window.scrollTo({
						top: targetFocus,
					});
				}
			}
		};

		const destroy = {
			all: function () {
				if (isDestroyed) return;
				isDestroyed = true;

				gsap.killTweensOf(els.bottom);
				gsap.set(els.bottom, { clearProps: "position,top,left,right" });

				gsap.killTweensOf(els.top);
				gsap.set(els.top, { clearProps: "zIndex,marginBottom,y" });

				if (els.onlyTop) {
					gsap.killTweensOf(els.onlyTop);
					gsap.set(els.onlyTop, { clearProps: "position" });
				}

				if (els.videoTrack) {
					gsap.killTweensOf(els.videoTrack);
					gsap.set(els.videoTrack, { clearProps: "marginTop" });
				}

				if (els.inner) {
					Array.prototype.forEach.call(els.inner, inner => {
						const parent = inner.parentNode;

						if (parent && inner.childNodes.length > 0) {
							inner.replaceWith(...inner.childNodes);
						}
					});
				}

				els.inner = null;
				setElements();
			}
		};

		return {
			init: init
		};
	})();
})();

(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};

	window.flagship.features.seriesCta = (function () {
		const utils = window.flagship.common.utils,
			resize = window.flagship.common.resize;

		let els = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution(),
			state = {
				instances: [],
				resizeTimer: null
			}

		const init = function () {
			els.sections = document.querySelectorAll('.js-cta-interaction-wrap');

			if (!!els.sections.length) {
				setElements();
				bindEvents();
			}
		};

		const setElements = function () {
			for (let i = 0; i < els.sections.length; i++) {
				const section = els.sections[i],
					instance = {
						section: section,
						inner: section.querySelector('.js-cta-interaction-inner'),
						button: section.querySelector('.js-cta-interaction-button'),
						textWrap: section.querySelector('.js-cta-text-wrap'),
						tl: null,
						sceneObj: null,
						isFirstScan: true,
						isProcessing: false,
						isLocked: false,
						isAnimated: false,
						lastProgress: null,
						resizeTimer: null,
						scrollTicking: false,
						lastInnerWidth: window.innerWidth,
						isthemeBlack: section.closest('.theme-black'),
					};

				state.instances.push(instance);
			}
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			eventList.setEntrance();
			eventHandler.scroll();
		};

		const eventHandler = {
			scroll: function () {
				window.addEventListener('scroll', eventList.scroll);
			},
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;

				if (window.innerWidth === state.lastInnerWidth) {
					for (let i = 0; i < state.instances.length; i++) {
						const instance = state.instances[i];
						
						eventList.resetEntrance(instance);
					}
					return;
				}
				state.lastInnerWidth = window.innerWidth;

				if (state.resizeTimer) {
					clearTimeout(state.resizeTimer);
				}

				state.resizeTimer = setTimeout(function () {
					prevDevice = currDevice;
					
					eventList.destroyEntrance();
					eventList.setEntrance();
					eventHandler.scroll();

					for (let i = 0; i < state.instances.length; i++) {
						const instance = state.instances[i];
						if (!instance.tl) continue;

						instance.tl.progress(1, true);
						gsap.set(instance.inner, {
							boxShadow: ''
						})
					}
				}, 50)
			},
			scroll: function () {
				if (state.scrollTicking) return;
				state.scrollTicking = true;
				
				requestAnimationFrame(function () {
					for (let i = 0; i < state.instances.length; i++) {
						const instance = state.instances[i];
						if (!instance.sceneObj) continue;
						instance.sceneObj.activeAnimation();
					}
					state.scrollTicking = false;
				});
			},
			resetEntrance: function (instance) {
				if (!instance.section || !instance.inner || !instance.button) return;
				if (instance.isAnimated) return;

				const targetSize = eventList.getTargetSize(instance),
					targetWidth = targetSize.width,
					targetHeight = targetSize.height,
					initSize = 15;

				gsap.set(instance.inner, {
					width: initSize,
					height: initSize,
					overflow: 'hidden',
					"--gradient-opacity": "0",
					"--inset-opacity": "0",
					boxShadow: 'none',
					background: 'linear-gradient(45deg, rgb(214, 241, 225, var(--gradient-opacity)) 0%, rgb(202, 229, 246, var(--gradient-opacity)) 50%, rgb(221, 216, 254, var(--gradient-opacity)) 100%'
				});

				gsap.set(instance.button, {
					width: targetWidth,
					height: targetHeight,
				})

				gsap.set(instance.textWrap, {
					position: 'absolute',
					left: '50%',
					transform: 'translateX(-50%)',
					opacity: 0
				});
			},
			setEntrance: function () {
				for (let i = 0; i < state.instances.length; i++) {
					const instance = state.instances[i];

					state.instances[i].isProcessing = false;
					state.instances[i].isAnimated = false;
					state.instances[i].lastProgress = null;
					eventList.setEntranceInstance(state.instances[i]);
				}
			},
			setEntranceInstance: function (instance) {
				if (!instance.section || !instance.inner || !instance.button || !instance.textWrap) return;
				if (instance.button.classList.contains('is-active')) return;
				instance.isLocked = false;

				const targetSize = eventList.getTargetSize(instance),
					targetWidth = targetSize.width,
					targetHeight = targetSize.height,
					initSize = 15,
					pillRadius = targetHeight / 2,
					wasAnimated = instance.isAnimated;

				if (!wasAnimated) {
					eventList.resetEntrance(instance);
				}

				instance.tl = gsap.timeline({
					paused: true
				});

				const tl = instance.tl;

				tl.fromTo(instance.inner, {
					y: 100
				}, {
					y: 0,
					duration: .4,
					onStart: function () {
						gsap.set(instance.inner, {
							boxShadow: ''
						});
					},
					onComplete: function () {
						gsap.set(instance.inner, {
							overflow: 'visible'
						});
					}
				})

				tl.fromTo(instance.inner, {
					width: initSize,
					height: initSize,
				}, {
					width: targetWidth,
					height: targetHeight,
					borderRadius: pillRadius + 'px',
					duration: .4,
					delay: .1,
					ease: 'power2.out',
					onComplete: function () {
						tl.to(instance.button, {
							width: targetWidth,
							height: targetHeight,
						})
					}
				}, '<');

				tl.to(instance.inner, {
					"--gradient-opacity": "1",
					duration: .4,
					delay: 0,
				}, '<')

				if (!instance.isthemeBlack) {
					tl.to(instance.textWrap, {
						opacity: 1,
						duration: .2,
						delay: .3,
						ease: 'none'
					}, '<');
				}

				tl.to(instance.inner, {
					"--inset-opacity": "1",
					"--gradient-opacity": "0",
					duration: instance.isthemeBlack ? .5 : 1,
					delay: 0,
					ease: instance.isthemeBlack ? "none" : "power2.inOut",
					onStart: function () {
						if (!instance.isthemeBlack) {
							instance.isProcessing = false;
							instance.isLocked = true;
						}
					}
				})

				if (instance.isthemeBlack) {
					tl.to(instance.textWrap, {
						opacity: 1,
						duration: .2,
						delay: .15,
						ease: 'none',
						onStart: function () {
							if (instance.isthemeBlack) {
								instance.isProcessing = false;
								instance.isLocked = true;
							}
						}
					}, '<');
				}
				
				instance.sceneObj = SCROLLER({
					trackElement: instance.section,
					activeElement: instance.section,
					activeCallback: function () {
						const currentDirection = this.wheelDirection;

						if (currentDirection === 'up') {
							if (instance.isProcessing) return;

							instance.isAnimated = true;
							if (instance.tl) instance.tl.progress(1, true);
							gsap.set(instance.inner, {
								boxShadow: ''
							})
							return;
						}

						if (instance.isProcessing) return;

						instance.isAnimated = false;
						instance.isProcessing = true;
						instance.isLocked = false;

						if (instance.tl) {
							instance.tl.eventCallback('onStart', function () {
								instance.isAnimated = true;
							});

							instance.tl.eventCallback('onComplete', function () {
								if (instance.tl) instance.tl.progress(1, true);
							});
							
							if (instance.tl) {
								instance.tl.play(0);
							}
						}
					},
					endCallback: function () {
						if (instance.isProcessing) return;

						instance.isAnimated = false;
						instance.isLocked = false;

						if (instance.tl) instance.tl.pause(0);
						eventList.resetEntrance(instance);
					}
				});
			},
			clearMeasureStyles: function (instance) {
				if (!instance.section || !instance.inner || !instance.button || !instance.textWrap) return;

				instance.inner.style.removeProperty('width');
				instance.inner.style.removeProperty('height');
				instance.inner.style.removeProperty('border-radius');
				instance.inner.style.removeProperty('overflow');
				instance.inner.style.removeProperty('transform');
				instance.inner.style.removeProperty('boxShadow');

				instance.button.style.removeProperty('width');
				instance.button.style.removeProperty('height');
				instance.button.style.removeProperty('transform');

				instance.textWrap.style.removeProperty('position');
				instance.textWrap.style.removeProperty('left');
				instance.textWrap.style.removeProperty('transform');
				instance.textWrap.style.removeProperty('opacity');
			},
			getTargetSize: function (instance) {
				eventList.clearMeasureStyles(instance);

				const buttonRect = instance.button.getBoundingClientRect();

				return {
					width: Math.ceil(buttonRect.width),
					height: Math.ceil(buttonRect.height)
				};
			},
			clearCtaStyles: function (instance, killTimeline) {
				if (!!instance.tl) {
					instance.tl.pause(0);
					if (killTimeline) {
						instance.tl.kill();
						instance.tl = null;
					}
				}

				if (instance.sceneObj && killTimeline) {
					instance.sceneObj.destroy();
					instance.sceneObj = null;
				}

				gsap.killTweensOf(instance.inner);
				gsap.killTweensOf(instance.button);
				gsap.killTweensOf(instance.textWrap);

				gsap.set(instance.inner, {
					clearProps: 'all'
				});

				gsap.set(instance.button, {
					clearProps: 'transform,opacity,height'
				});

				gsap.set(instance.textWrap, {
					clearProps: 'all'
				});
			},
			pauseCta: function () {
				if (!state.instances.length) return;
				
				for (let i = 0; i < state.instances.length; i++) {
					const instance = state.instances[i];
					if (!instance.section) continue;

					eventList.clearCtaStyles(instance, false);
				}
			},
			resumeCta: function () {
				if (!state.instances.length) return;

				for (let i = 0; i < state.instances.length; i++) {
					const instance = state.instances[i];
					if (!instance.section) continue;

					instance.isFirstScan = true;
					instance.isAnimated = false;
					instance.lastProgress = 0;

					eventList.setEntranceInstance(instance);
					if (instance.tl) instance.tl.progress(1, true);
					gsap.set(instance.inner, {
						boxShadow: ''
					})
				}
				
				eventList.guardCompletedStyle();
			},
			guardCompletedStyle: function () {
				for (let i = 0; i < state.instances.length; i++) {
					const instance = state.instances[i],
						wrapElement = instance.section;

					if (!wrapElement || wrapElement.dataset.isObserved === 'true') continue;
					wrapElement.dataset.isObserved = 'true';

					if (wrapElement.classList.contains('callback-active') && !instance.isProcessing) {
						eventList.removeInlineStyle(instance);
					}

					const observer = new MutationObserver(function () {
						const hasActive = wrapElement.classList.contains('callback-active');

						if (hasActive) {
							if (!instance.isProcessing) {
								eventList.removeInlineStyle(instance);
							}
						} else {
							observer.disconnect();
							delete wrapElement.dataset.isObserved;
						}
					});

					observer.observe(wrapElement, {
						attributes: true,
						attributeFilter: ['class', 'style'],
						subtree: true
					});
				}
			},
			removeInlineStyle: function (instance) {
				if (instance.inner) instance.inner.removeAttribute('style');
				if (instance.button) instance.button.removeAttribute('style');
				if (instance.textWrap) instance.textWrap.removeAttribute('style');
			},
			destroyEntrance: function () {
				window.removeEventListener('scroll', eventList.scroll);

				for (let i = 0; i < state.instances.length; i++) {
					eventList.clearCtaStyles(state.instances[i], true);
				}
			}
		};

		return {
			init: init,
			pauseCta: eventList.pauseCta,
			resumeCta: eventList.resumeCta
		}
	})();
})();

(function () {
	window.flagship.features.navHandler = (function () {
		const resize = window.flagship.common.resize;

		let els = {},
			currDevice = resize.checkResolution(),
			prevDevice = resize.checkResolution(),
			state = {
				lnbByScroll: false,
				lnbShow: false
			},
			prevScrollY = 0,
			lnbScrollTimer = null,
			showTime = null,
			THRESHOLD = 0;

		const init = function () {
			setElements();
			bindEvents();
		};

		const setElements = function () {
			els.gnb = document.querySelector('.nv00-gnb-v4__wrap, .nv00-gnb-v5__wrap');
			els.lnb = document.querySelector('.pd-g-floating-nav');
		};

		const bindEvents = function () {
			eventHandler.scroll();
			eventHandler.focusin();
			eventList.setShowTime();
			resize.add(eventList.responsive);
		};

		const eventHandler = {
			scroll: function () {
				window.addEventListener('scroll', eventList.handleScroll, {
					passive: true
				});
			},
			focusin: function () {
				els.lnb.addEventListener('focusin', eventList.activeFocus);
			}
		};

		const eventList = {
			responsive: function (currRes) {
				currDevice = currRes;
				if (currDevice != prevDevice) {
					eventList.setShowTime();
					prevDevice = currDevice;
				}
			},
			setShowTime: function () {
				const isMobile = resize.checkResolution().indexOf('mobile') > -1;
				if (isMobile) {
					THRESHOLD = 25;
					showTime = 400;
				} else {
					THRESHOLD = 0;
					showTime = 100;
				}
			},
			activeFocus: function (e) {
				const gnbAbsoluteBottom = els.gnb.getBoundingClientRect().bottom + window.scrollY;

				if (!e.target.matches(':focus-visible') || window.scrollY >= gnbAbsoluteBottom) return;
				window.scrollTo(0, gnbAbsoluteBottom);
			},
			handleScroll: function () {
				if (!els.gnb) return;

				const gnbAbsoluteBottom = els.gnb.getBoundingClientRect().bottom + window.scrollY;
				state.lnbByScroll = window.scrollY >= gnbAbsoluteBottom;

				const scrollDiff = window.scrollY - prevScrollY;
				const isScrollUp = scrollDiff < 0;
				const isPopup = prevScrollY == 0;
				if (!isPopup) {
					if (state.lnbByScroll) {
						if (Math.abs(scrollDiff) < THRESHOLD) return
						if (isScrollUp) {
							eventList.lnbShow();
						} else {
							eventList.lnbHide();
						}
					} else {
						eventList.lnbHide();
					}
				}
				prevScrollY = window.scrollY;

				clearTimeout(lnbScrollTimer);
				lnbScrollTimer = setTimeout(function () {
					if (state.lnbByScroll && !state.lnbShow) {
						eventList.lnbFadeShow();
					}
				}, showTime)
			},
			lnbFadeShow: function () {
				state.lnbShow = true;
				els.lnb.classList.add('is-fade-show');
				els.lnb.classList.remove('is-show');
			},
			lnbFadeHide: function () {
				state.lnbShow = false;
				els.lnb.classList.remove('is-fade-show');
				els.lnb.classList.remove('is-show');
			},
			lnbShow: function () {
				state.lnbShow = true;
				els.lnb.classList.add('is-show');
				els.lnb.classList.remove('is-fade-show');
			},
			lnbHide: function () {
				state.lnbShow = false;
				els.lnb.classList.remove('is-show');
				els.lnb.classList.remove('is-fade-show');
			}
		};

		return {
			init: init
		};
	})();
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};

	window.flagship.features.seriesCompare = (function () {
		const utils = window.flagship.common.utils,
			resize = window.flagship.common.resize,
			Swiper = flagship.Swiper;

		const init = function () {
			const popup = document.querySelector('.js-series-popup');
			if (!popup) return;

			createInstance(popup);
		};

		const createInstance = function (popup) {
			let els = {},
				prevDevice = resize.checkResolution(),
				currDevice = resize.checkResolution(),
				resizeTimer = null;

			const swiperInstances = {
				main: null,
				tab: null
			};

			const isMobile = function () {
				return currDevice === 'mobile' || currDevice === 'mobileS';
			};

			const initInstance = function () {
				if (!!popup) {
					setElements();
					bindEvents();
				}
			};

			const setElements = function () {
				els.popup = popup;

				const popupMatch = els.popup.getAttribute('data-popup-match');
				els.openerButtons = popupMatch
					? document.querySelectorAll('.js-compare-opener[data-popup-match="' + popupMatch + '"]')
					: document.querySelectorAll('.js-compare-opener');

				els.seriesCarousel = els.popup.querySelector('.js-series-carousel');

				if (els.seriesCarousel) {
					els.seriesContainer = els.seriesCarousel.querySelector('.js-series-container');
					els.seriesPagination = els.seriesCarousel.querySelector('.js-series-pagination');
				}

				els.seriesTabCarousel = els.popup.querySelector('.js-series-tab-carousel');
				if (els.seriesTabCarousel) {
					els.nextArrow = els.seriesTabCarousel.querySelector('.js-series-tab-arrow-next');
					els.prevArrow = els.seriesTabCarousel.querySelector('.js-series-tab-arrow-prev');
				}

				els.supClicker = els.popup.querySelectorAll('a.click_sup');
			};

			const bindEvents = function () {
				resize.add(eventList.resize);
				eventHandler.resizeSeries();

				if (els.popup) {
					els.popup.opts = {
						show: {
							start: function () {
								window.flagship.features.scrollTop = utils.saveScrollTop;
								els.popup.children[0].scrollTop = 0;
								eventList.loadImage();
							},
							end: function () {
								const opener = els.popup.openCta;
								const compareType = opener ? opener.getAttribute('data-compare-type') : null;
								let startIndex = eventList.getInitialIndex();

								if (compareType && els.seriesPagination) {
									const bullets = els.seriesPagination.querySelectorAll('.js-series-bullet');
									for (let i = 0; i < bullets.length; i++) {
										if (bullets[i].getAttribute('data-compare-type') === compareType) {
											startIndex = i;
											break;
										}
									}
								}

								opener.classList.add('is-active');
								if (window.flagship?.features?.seriesCta?.pauseCta) {
									window.flagship.features.seriesCta.pauseCta();
								}

								setTimeout(function () {
									setSwipers.mainSwiper(startIndex);

									if (isMobile()) {
										setSwipers.tabSwiper(startIndex);

										if (swiperInstances.main && swiperInstances.tab) {
											swiperInstances.tab.slideTo(swiperInstances.main.activeIndex, 0);
										}
									}
								}, 50);

								setTimeout(function () {
									if (swiperInstances.main) {
										accessibility.updateSlide(swiperInstances.main);
									}
								}, 350);
							}
						},
						hide: {
							start: function () {
								const opener = els.popup.openCta;

								opener.classList.remove('is-active');
								
								if (window.flagship?.features?.seriesCta?.resumeCta) {
									window.flagship.features.seriesCta.resumeCta();
								}
							},
							end: function () {
								setTimeout(function () {
									setSwipers.destroyAll();
									els.popup.children[0].scrollTop = 0;
								}, 300);
							}
						}
					};
				}

				for (let i = 0; i < els.supClicker.length; i++) {
					if (!!els.supClicker) {
						els.supClicker[i].addEventListener('click', eventList.onClickSup);
					}
				}
			};

			const eventHandler = {
				resizeSeries: function () {
					window.addEventListener('resize', eventList.resizeSeries);
				}
			};

			const eventList = {
				loadImage: function () {
					const bgImages = els.popup.querySelectorAll('.js-compare-popup-bg-img');
					for (let i = 0; i < bgImages.length; i++) {
						if (!bgImages[i].classList.contains('is-bg-load-complete')) {
							window.imageLoader.setResponsiveMedia(bgImages[i]);
							bgImages[i].classList.add('is-bg-load-complete');
							bgImages[i].classList.remove('js-compare-popup-bg-img');
						}
					}

					const resImages = els.popup.querySelectorAll('.js-compare-popup-res-img');
					for (let i = 0; i < resImages.length; i++) {
						if (!resImages[i].classList.contains('is-img-load-complete')) {
							window.imageLoader.setResponsiveMedia(resImages[i]);
							resImages[i].classList.add('is-img-load-complete');
							resImages[i].classList.remove('js-compare-popup-res-img');
						}
					}
				},
				resizeSeries: function () {
					if (resizeTimer) {
						clearTimeout(resizeTimer);
					}

					resizeTimer = setTimeout(function () {
						if (isMobile() && swiperInstances.main && swiperInstances.tab) {
							swiperInstances.tab.slideTo(swiperInstances.main.activeIndex, 0);
						}
					}, 300);
				},
				resize: function (currRes) {
					currDevice = currRes;

					if (currDevice !== prevDevice) {
						prevDevice = currDevice;

						if (els.popup && els.popup.classList.contains('is-open')) {
							setSwipers.destroyAll();

							setTimeout(function () {
								setSwipers.mainSwiper();
								setSwipers.tabSwiper();
							}, 50);
						}
					}
				},
				getInitialIndex: function () {
					if (els.seriesPagination) {
						const bullets = els.seriesPagination.querySelectorAll('.js-series-bullet');
						for (let i = 0; i < bullets.length; i++) {
							if (bullets[i].classList.contains('is-active')) {
								return i;
							}
						}
					}
					return 0;
				},
				getBulletIndex: function (event) {
					const bullet = event.target.closest('.js-series-bullet');
					if (!bullet) return -1;
					const bullets = els.seriesPagination.querySelectorAll('.js-series-bullet');
					for (let i = 0; i < bullets.length; i++) {
						if (bullets[i] === bullet) return i;
					}
					return -1;
				},
				updateActiveState: function (activeIndex) {
					const bullets = els.seriesPagination.querySelectorAll('.js-series-bullet');
					for (let i = 0; i < bullets.length; i++) {
						const isActive = (i === activeIndex);
						const button = bullets[i].querySelector('button');

						bullets[i].classList.toggle('is-active', isActive);

						if (button) {
							if (isActive) {
								accessibility.setSelectedTitle(button);
							} else {
								button.removeAttribute('title');
							}
						}
					}
				},
				handleButtonClick: function (event) {
					const index = eventList.getBulletIndex(event);
					if (index !== -1 && swiperInstances.main) {
						event.preventDefault();
						swiperInstances.main.slideTo(index);
					}
				},
				handleButtonFocus: function (event) {
					if (!event.target.classList.contains('focus-visible')) return;
					const index = eventList.getBulletIndex(event);
					if (index !== -1 && swiperInstances.tab) {
						swiperInstances.tab.slideTo(index);
					}
				},
				handleSlideChange: function (swiper) {
					eventList.updateActiveState(swiper.activeIndex);
					accessibility.updateSlide(swiper);

					if (swiperInstances.tab) {
						swiperInstances.tab.slideTo(swiper.activeIndex);
					}
				},
				setMatchHeight: function () {
					const sliders = els.seriesCarousel.querySelectorAll('.features-common-series-compare__content');

					for (let i = 0; i < sliders.length; i++) {
						const bodyCopys = sliders[i].querySelectorAll('.features-common-series-compare__card-body');

						utils.matchHeight(bodyCopys, 0);
					}
				},
				onClickSup: function () {
					const activeBullet = els.seriesPagination ? els.seriesPagination.querySelector('.js-series-bullet.is-active') : null;
					const activeCompareType = activeBullet ? activeBullet.getAttribute('data-compare-type') : null;

					let matchedOpener = els.popup.openCta;

					if (activeCompareType) {
						for (let i = 0; i < els.openerButtons.length; i++) {
							if (els.openerButtons[i].getAttribute('data-compare-type') === activeCompareType) {
								matchedOpener = els.openerButtons[i];
								break;
							}
						}
					}

					window.flagship.features.popupOpener = matchedOpener;
					els.popup.hide();
				}
			};

			const setSwipers = {
				mainSwiper: function (startIndex) {
					if (!els.seriesContainer || swiperInstances.main) return;

					const index = (startIndex !== undefined && !isNaN(startIndex)) ? startIndex : eventList.getInitialIndex();
					eventList.updateActiveState(index);

					swiperInstances.main = new Swiper(els.seriesContainer, {
						slidesPerView: 1,
						spaceBetween: 20,
						speed: isMobile() ? 400 : 600,
						a11y: false,
						effect: 'slide',
						initialSlide: index,
						on: {
							init: function (swiper) {
								accessibility.updateSlide(swiper);

								if (!isMobile() && els.popup.refreshFocusLoop) {
									els.popup.refreshFocusLoop();
									eventList.setMatchHeight();
								}
							},
							slideChange: function (swiper) {
								eventList.handleSlideChange(swiper);
							}
						}
					});

					if (els.seriesPagination) {
						els.seriesPagination.addEventListener('click', eventList.handleButtonClick);
						els.seriesPagination.addEventListener('focus', eventList.handleButtonFocus, true);
					}
				},
				tabSwiper: function (startIndex) {
					if (!els.seriesTabCarousel) return;
					if (!isMobile()) {
						setSwipers.destroyTab();
						return;
					}

					if (swiperInstances.tab) return;

					const index = (startIndex !== undefined && !isNaN(startIndex)) ? startIndex : eventList.getInitialIndex();

					swiperInstances.tab = new Swiper(els.seriesTabCarousel, {
						slidesPerView: 'auto',
						initialSlide: index,
						a11y: false,
						navigation: {
							nextEl: els.nextArrow,
							prevEl: els.prevArrow
						},
						on: {
							init: function () {
								if (els.popup.refreshFocusLoop) {
									els.popup.refreshFocusLoop();
								}
							}
						}
					});
				},
				destroyTab: function () {
					if (swiperInstances.tab) {
						swiperInstances.tab.destroy(true, true);
						swiperInstances.tab = null;
					}
				},
				destroyAll: function () {
					if (swiperInstances.main) {
						swiperInstances.main.destroy(true, true);
						swiperInstances.main = null;
					}

					setSwipers.destroyTab();

					if (els.seriesPagination) {
						els.seriesPagination.removeEventListener('click', eventList.handleButtonClick);
						els.seriesPagination.removeEventListener('focus', eventList.handleButtonFocus, true);
					}
				}
			};

			const accessibility = {
				setSelectedTitle: function (target) {
					const selectedText = (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) ? LOCAL_VARI.selected : 'Selected';
					target.setAttribute('title', selectedText);
				},
				updateSlide: function (swiperInstance) {
					if (!swiperInstance) return;
					const activeIndex = swiperInstance.activeIndex;
					for (let i = 0; i < swiperInstance.slides.length; i++) {
						if (i === activeIndex) {
							utils.offAccessibility(swiperInstance.slides[i]);
						} else {
							utils.onAccessibility(swiperInstance.slides[i]);
						}
					}
				}
			};

			initInstance();
			return {
				els: els
			};
		};

		return {
			init: init
		};
	})();
})();

(function () {
	window.flagship.features.carouselExtensions = window.flagship.features.carouselExtensions || [];

	window.flagship.features.accessories = (function () {
		let els = {};

		const init = function () {
			els.carousel = document.querySelector('.js-accessories-carousel');
		};

		const getCarouselOptions = function (carousel) {
			if (!carousel.classList.contains('js-accessories-carousel')) {
				return {};
			}

			return {
				swiper: {
					mobileOnly: true
				},
				media: {
					preloadAhead: 2
				}
			};
		};

		return {
			getCarouselOptions: getCarouselOptions,
			init: init
		};
	})();

	if (window.flagship.features.carouselExtensions.indexOf(window.flagship.features.accessories) === -1) {
		window.flagship.features.carouselExtensions.push(window.flagship.features.accessories);
	}
})();
(function () {
	flagship.features.aiOverview = (function () {
		const resize = window.flagship.common.resize;

		let els = {},
			obj = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution();

		const init = function () {
			els.section = document.querySelector('.features-ai-overview');

			if (!!els.section) {
				setElement();
				bindEvents();
			}
		};

		const setElement = function () {
			els.galaxyAi = els.section.querySelector('.js-ai-overview-content');
			els.track = els.section.querySelector('.js-ai-overview-track');
			els.bubbles = els.section.querySelector('.features-ai-overview__images');
			els.bubble1 = els.section.querySelector('.js-ai-overview-bubble-1');
			els.bubble2 = els.section.querySelector('.js-ai-overview-bubble-2');
			els.bubble3 = els.section.querySelector('.js-ai-overview-bubble-3');
			els.bubble4 = els.section.querySelector('.js-ai-overview-bubble-4');
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			objList.setScene();
			eventHandler.scroll();
		};

		const eventHandler = {
			scroll: function () {
				window.addEventListener('scroll', eventList.scroll);
			}
		};

		const objList = {
			setScene: function () {
				obj.track = SCROLLER({
					trackElement: els.track,
					useFixed: false
				});
			}
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;
				if (currDevice != prevDevice) {

					prevDevice = currDevice;
				}
			},
			bubbleAnimation: function (progress) {
				if (currDevice === 'mobile' || currDevice === 'mobileS') {
					if (progress > 16) {
						if (!els.galaxyAi.classList.contains('is-active')) {
							els.galaxyAi.classList.add('is-active');
						}
					}
					if (!!els.bubbles) {
						if (progress > 30) {
							if (!els.bubble1.classList.contains('is-active')) {
								els.bubble1.classList.add('is-active');
							}
							if (!els.bubble2.classList.contains('is-active')) {
								els.bubble2.classList.add('is-active');
							}
						}
						if (progress > 39) {
							if (!els.bubble3.classList.contains('is-active')) {
								els.bubble3.classList.add('is-active');
							}
							if (!els.bubble4.classList.contains('is-active')) {
								els.bubble4.classList.add('is-active');
							}
						}
					}
					if (progress <= 1) {
						els.galaxyAi.classList.remove('is-active');
						if (!!els.bubble1) els.bubble1.classList.remove('is-active');
						if (!!els.bubble2) els.bubble2.classList.remove('is-active');
						if (!!els.bubble3) els.bubble3.classList.remove('is-active');
						if (!!els.bubble4) els.bubble4.classList.remove('is-active');
					}
				} else {
					if (progress > 12) {
						if (!els.galaxyAi.classList.contains('is-active')) {
							els.galaxyAi.classList.add('is-active');
						}
					}
					if (!!els.bubbles) {
						if (progress > 24) {
							if (!els.bubble1.classList.contains('is-active')) {
								els.bubble1.classList.add('is-active');
							}
						}
						if (progress > 30) {
							if (!els.bubble2.classList.contains('is-active')) {
								els.bubble2.classList.add('is-active');
							}
						}
						if (progress > 42) {
							if (!els.bubble3.classList.contains('is-active')) {
								els.bubble3.classList.add('is-active');
							}
						}
						if (progress > 50) {
							if (!els.bubble4.classList.contains('is-active')) {
								els.bubble4.classList.add('is-active');
							}
						}
					}
					if (progress <= 1) {
						els.galaxyAi.classList.remove('is-active');
						if (!!els.bubble1) els.bubble1.classList.remove('is-active');
						if (!!els.bubble2) els.bubble2.classList.remove('is-active');
						if (!!els.bubble3) els.bubble3.classList.remove('is-active');
						if (!!els.bubble4) els.bubble4.classList.remove('is-active');
					}
				}
			},
			scroll: function () {
				obj.track.trackAnimation(function(){
					let progress = this.progress;
					eventList.bubbleAnimation(progress);
				});
			}
		};

		return {
			init: init,
		}
	})();
})();
(function () {
	window.flagship.features.carouselExtensions = window.flagship.features.carouselExtensions || [];

	window.flagship.features.aiReviewSummary = (function () {
		let els = {};

		const init = function () {
			els.section = document.querySelector('.features-ai-review-summary');

			if (els.section != null) {
				setElements();

				if(els.compReview) {
					const hasRatingData = checkRatingData();
					const addAiSummaryCardCase = hasAiReviewSummaryData() && hasSwiperObject();

					if(hasRatingData) setSummaryRating();
					else hideSummaryRating();

					if(addAiSummaryCardCase) {
						showAiReviewSummary();
						addReviewSummarySlides();
						showAiReviewSummaryContent();
					}
				}

				if(hasSwiperObject()) {
					window.flagship.features.carouselCore.refresh(els.carousel, els.reviewSlides);
				}
			}
		};

		const setElements = function () {
			els.summaryContent = els.section.querySelector('.js-ai-review-summary-content');
			els.summaryRating = els.section.querySelector('.js-ai-review-summary-rating');
			els.summaryRatingStarBg = els.section.querySelector('.js-ai-review-summary-rating-bg');
			els.summaryRatingNum = els.section.querySelector('.js-ai-review-summary-rating-num');
			els.summaryReviewCount = els.section.querySelector('.js-ai-review-summary-review-count');
			els.summaryRecommendedPer = els.section.querySelector('.js-ai-review-summary-recommended-per');

			els.carousel = els.section.querySelector('.js-ai-review-summary-carousel');
			if(els.carousel) {
				els.swiperContainer = els.carousel.querySelector('.swiper-container');
				els.swiperWrapper = els.carousel.querySelector('.swiper-wrapper');
			}

			els.compReview = document.querySelector('.pdd44-review');
			if(els.compReview) {
				els.reviewRatingNum = els.compReview.querySelector('.pdd44-review__overall-star-num');
				els.reviewStarInner = els.compReview.querySelector('.rating__inner');
				els.reviewSummaryListItems = els.compReview.querySelectorAll('.pdd44-review__ai-summary-item');
				els.reviewSummaryCount = els.compReview.querySelector('.pdd44-review__overall-star-text');
				els.reviewSummaryDesc = els.compReview.querySelector('.pdd44-review__overall-description');
			}
		}

		const checkRatingData = function() {
			return els.reviewRatingNum && els.reviewSummaryCount && els.reviewSummaryDesc;
		}

		const hasAiReviewSummaryData = function() {
			return els.reviewSummaryListItems.length > 0;
		}

		const hasSwiperObject = function() {
			return els.swiperContainer && els.swiperContainer.swiper;
		}

		const setSummaryRating = function () {
			const reviewRatingText = els.reviewRatingNum.textContent;
			const regex = /[0-9]*\.?[0-9]+/g;
			const matchRatingNum = reviewRatingText.match(regex);
			const ratingNum = matchRatingNum ? parseFloat(matchRatingNum) : null;
			if(ratingNum) {
				els.summaryRatingNum.textContent = ratingNum;
				setRatingStars(ratingNum + '');
			}

			const reviewCountText = els.reviewSummaryCount.textContent;
			const matchReviewCount = reviewCountText.match(/\d{1,3}(,\d{3})*|\d+/g).map((numStr) => numStr.replace(/,/g, ''));
			const reviewCountStr = matchReviewCount ? matchReviewCount[0] : null;
			const floorCount = Number(reviewCountStr[0] + '0'.repeat(reviewCountStr.length - 1));

			const recommendedText = els.reviewSummaryDesc.textContent;
			const recommendedPer = recommendedText.replace(/[^0-9]/g, "");
			els.summaryReviewCount.textContent = `${floorCount.toLocaleString()}+`;
			els.summaryRecommendedPer.textContent = `${recommendedPer}%`;
		}

		const setRatingStars = function() {
			els.reviewStarInner.querySelectorAll('.rating__star-item').forEach((starItemEl, idx) => {
				const starFilled = starItemEl.querySelector('.rating__star-filled');

				if(idx === 0) {
					const starRatingBlindTextEl = els.summaryRatingStarBg.querySelector('.sr-only');
					const cloneStarBgEl = starFilled.cloneNode(true);
					starFilled.style.width = '100%';
					els.summaryRatingStarBg.insertBefore(cloneStarBgEl, starRatingBlindTextEl);
				}

				starItemEl.classList.add('features-ai-review-summary__rating-star-item');
				starFilled.classList.add('features-ai-review-summary__rating-star-filled');
			});
		}

		const addReviewSummarySlides = function () {
			const reviewSummaryTexts = Array.from(els.reviewSummaryListItems).map((el) => el.innerText);
			const reviewSummaryLabel = els.swiperContainer.getAttribute('data-review-summary-label') || '';
			els.reviewSlides = [];

			reviewSummaryTexts.forEach((text, index) => {
				const slideItemHtml = `
					<li role="listitem" class="swiper-slide">
						<div class="features-ai-review-summary__carousel-content">
							<p class="features-ai-review-summary__carousel-description">
								<span class="common-text">${text}</span>
							</p>
						</div>
					</li>
				`;
				const template = document.createElement('template');
				template.innerHTML = slideItemHtml;

				const slide = template.content.firstElementChild;
				slide.setAttribute('data-slide-title', reviewSummaryLabel + ' ' + (index + 1));

				els.reviewSlides.push(slide);
				els.swiperContainer.swiper.appendSlide(slide);
			});
		}

		const hideSummaryRating = function() {
			els.summaryRating.style.display = 'none';
		}

		const showAiReviewSummary = function () {
			els.section.classList.add('is-show');
		}

		const showAiReviewSummaryContent = function () {
			els.summaryContent.classList.add('is-show');

			const observer = new IntersectionObserver(function (entries) {
				if (!entries[0].isIntersecting) return;

				observer.disconnect();
				window.dispatchEvent(new Event('scroll'));
			});

			observer.observe(els.summaryContent);
		};

		return {
			init: init,
		}
	})();

	window.flagship.features.aiReviewSummaryCarousel = (function () {
		const getCarouselOptions = function (carousel) {

			if (!carousel.classList.contains('js-ai-review-summary-carousel')) {
				return {};
			}
			return {
				swiper: {
					loop: true
				},
				pagination: {
					progressbar: true
				},
				autoslide: {
					enabled: true,
					indicatorButton: true,
					imageDelay: 5000,
					moImageDelay: 4000
				},
				imageProgress: {
					start: 5,
					moStart: 3
				},
			};
		};

		return {
			getCarouselOptions: getCarouselOptions
		};
	})();

	if (window.flagship.features.carouselExtensions.indexOf(window.flagship.features.aiReviewSummaryCarousel) === -1) {
		window.flagship.features.carouselExtensions.push(window.flagship.features.aiReviewSummaryCarousel);
	}
})();
(function () {
	window.flagship.features.ap = (function () {
		const resize = window.flagship.common.resize,
			utils = window.flagship.common.utils;

		let els = {},
			obj = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution();


		const init = function () {
			els.section = document.querySelector('.features-ap');

			if (!!els.section) {
				setElement();
				bindEvents();
			}
		};

		const setElement = function () {
			els.video = els.section.querySelector('.common-video');
			els.videoTag = els.section.querySelector('.common-video video');
			els.videoController = els.section.querySelector('.common-video__control');
			els.track = document.querySelector('.features-common-comparison-module--design');
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			eventHandler.scroll();
			eventList.setScene();
			eventList.setVideo();
		};

		const eventHandler = {
			scroll: function () {
				window.addEventListener('scroll', eventList.scroll);
			}
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;
				if (currDevice != prevDevice) {
					
					const isDesktop = currDevice.indexOf('desktop') > -1;
					const isTouchDevice = utils.detector.isTouchDevice;
					const notDevice = isDesktop && !isTouchDevice;

					if (!notDevice && els.video) {
						gsap.killTweensOf(els.video);
						gsap.set(els.video, { clearProps: "scale,transform" });
					}
					
					eventList.scroll();
					prevDevice = currDevice;
				}
			},
			scroll: function () {
				obj.scene.trackAnimation(function () {
					progress = this.progress
					const isDesktop = currDevice.indexOf('desktop') > -1;
					const isTouchDevice = utils.detector.isTouchDevice;
					const notDevice = isDesktop && !isTouchDevice;

					if (notDevice) {
						eventList.activeScale(progress);
					}
					if (progress >= 100) {
						progress = 99.9;
					}
					if (els.videoTag.readyState >= 4) {
						obj.video.scrollActive(progress);
						if (progress < 40) {
							obj.video.eventList.reset.call(obj.video);
						}
					}
				})

				obj.endScene.trackAnimation(function () {
					let progress = this.progress; 
					if (els.endHandler) {
						els.endHandler.scrollActive(progress);
					}
				});
			},
			setScene: function () {
				obj.scene = SCROLLER({
					trackElement: els.track,
					useFixed: false
				})
				obj.endScene = SCROLLER({
					trackElement: els.video,
					resize: utils.detector.isTouchDevice ? false : true
				});
			},
			activeScale: function (progress) {
				let imageSacle = utils.calRange({
					targetValue: 0.5,
					progress: progress,
					startPoint: 60,
					endPoint: 80
				});
				gsap.to (els.videoTag, 0.3, {
					scale: `${1.5 - imageSacle}`
				})
			},
			setVideo: function() {
				obj.video = utils.videoHandler({
					wrap: els.video,
					video: els.videoTag,
					playType: 'scrollPlay',
					controller: els.videoController,  
					startPoint: 65,
				});
				els.endHandler = utils.videoHandler({
					wrap: els.video,
					video: els.videoTag,
					playType: 'scrollPlay',
					controller: els.videoController, 
					startPoint: 100,
					reversePoint: 100,
				});
			},			
		};

		return {
			init: init
		}
	})();
})();

(function () {
	flagship.features.arBanner = (function () {

		let els = {};

		const init = function () {
			els.section = document.querySelector('.features-bottom-banner');

			if (!!els.section) {
				setElement();
				bindEvents();
			}
		};

		const setElement = function () {
			els.arBanner = els.section.querySelector('.features-bottom-banner__item--ar');
		}

		const bindEvents = function () {
			eventList.setArBanner();
		}

		const eventList = {
			setArBanner: function () {
				if (!!els.arBanner) {
					let arCta = els.arBanner.querySelector('.features-bottom-banner__ar-link');
					let userAgent = navigator.userAgent;
					let isAndroid = /Android/i.test(userAgent);
					let isIos = 'MacIntel' == navigator.platform && navigator.maxTouchPoints > 1 || /iPhone|iPad|iPod/i.test(userAgent);

					let encodingUrl = '';
					if (isAndroid) {
						encodingUrl = 'intent://arvr.google.com/scene-vie' + 'wer/1.0?file='.concat('ht' + 'tps://images.samsung.com/common/smartphones/compare/galaxy-z-fold8-flip8/viewer/models/galaxy-z-fold8-ultra/galaxy-z-fold8-ultra-techno-violet.glb&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=ht' + 'tps://www.samsung.com;end;');
					} else if (isIos) {
						encodingUrl = 'ht' + 'tps://images.samsung.com/common/smartphones/compare/galaxy-z-fold8-flip8/viewer/models/galaxy-z-fold8-ultra/galaxy-z-fold8-ultra-techno-violet.usdz';
					}

					if (!!encodingUrl) {
						arCta && arCta.setAttribute('href', encodingUrl);
						els.arBanner.classList.add('is-touch-device');
					} else {
						(typeof $ === "function") ? $(arCta).replaceWith($('<div class="features-bottom-banner__ar-link">' + arCta.innerHTML + '</div>')) : (arCta && arCta.parentNode && (function(){ var d = document.createElement('div'); d.className = 'features-bottom-banner__ar-link'; d.innerHTML = arCta.innerHTML; arCta.parentNode.replaceChild(d, arCta); })());
					}
				}
			}
		}

		return {
			init: init,
		}
	})();
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};

	window.flagship.features.battery = (function () {
		const resize = window.flagship.common.resize;

		let els = {},
			obj = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution(),
			state = {
				animationFrame: null,
				startTime: 0,
				duration: 1000,
				isPlayed: false
			};


		const init = function () {
			els.section = document.querySelector('.features-battery');

			if (!!els.section) {
				setElements();
				setProperty();
				bindEvents();
			}
		};

		const setElements = function () {
			els.counter = els.section.querySelector('.js-battery-counter');
		};

		const setProperty = function () {
			if (!els.counter) return;

			obj.startValue = Number(els.counter.getAttribute('data-start-value'));
			obj.endValue = Number(els.counter.getAttribute('data-end-value'));
			obj.stepValue = Number(els.counter.getAttribute('data-step-value'));
			obj.valueList = eventList.createValueList(obj.startValue, obj.endValue, obj.stepValue);
			obj.digitList = [];

			eventList.createCounterMarkup();
			eventList.setCounterIndex(0);
		};

		const bindEvents = function () {
			if (!els.counter) return;

			eventList.bindObserver();
			window.addEventListener('resize', eventList.resizeWindow);
		};

		const eventList = {
			resizeWindow: function () {
				currDevice = resize.checkResolution();

				if (prevDevice !== currDevice) {
					prevDevice = currDevice;
				}

				if (state.isPlayed) {
					eventList.setCounterIndex(obj.valueList.length - 1);
					return;
				}

				eventList.setCounterIndex(0);
			},
			bindObserver: function () {
				obj.observer = new IntersectionObserver(function (entries) {
					const entry = entries[0]; 

					if (entry.isIntersecting) {
						const isEnterFromTop = entry.boundingClientRect.top < 50; 

						if (isEnterFromTop) {
							eventList.setCounterToEnd(); 
						} else {
							eventList.resetCounter();
							
							requestAnimationFrame(function () {
								requestAnimationFrame(function () {
									eventList.playCounter();
								});
							});
						}

					} else {
						const isExitToTop = entry.boundingClientRect.top < 0;

						if (isExitToTop) {
							eventList.setCounterToEnd();
						} else {
							eventList.resetCounter();
						}
					}
				}, {
					root: null,
					rootMargin: '0px',
					threshold: 0
				});
				obj.observer.observe(els.counter);
			},
			createValueList: function (startValue, endValue, stepValue) {
				let valueList = [];

				for (let value = startValue; value <= endValue; value += stepValue) {
					valueList.push(String(value));
				}

				return valueList;
			},
			createCounterMarkup: function () {
				const digitValueList = [
					['4', '5', '5', '5', '5', '5', '5'],
					['4', '5', '6', '7', '8', '9', '0'],
					['0', '0', '0', '0', '0', '0', '0'],
					['0', '0', '0', '0', '0', '0', '0']
				];
				let html = '';

				for (let i = 0; i < digitValueList.length; i++) {
					html += '<span class="features-battery__value-digit">';
					html += '<span class="features-battery__value-strip">';

					for (let j = 0; j < digitValueList[i].length; j++) {
						html += '<span class="features-battery__value-number">' + digitValueList[i][j] + '</span>';
					}

					html += '</span>';
					html += '</span>';
				}

				els.counter.innerHTML = html;
				obj.digitList = els.counter.querySelectorAll('.features-battery__value-strip');
			},
			setStripPosition: function (strip, index) {
				const number = strip.querySelector('.features-battery__value-number'),
					digit = strip.parentElement,
					numberHeight = number.getBoundingClientRect().height;

				digit.style.height = numberHeight + 'px';
				strip.style.transform = 'translateY(' + (-numberHeight * index) + 'px)';
			},
			setCounterIndex: function (index) {
				for (let i = 0; i < obj.digitList.length; i++) {
					eventList.setStripPosition(obj.digitList[i], index);
				}
			},
			easeInOut: function (progress) {
				const isFirstHalf = progress < 0.5;

				if (isFirstHalf) {
					return 2 * progress * progress;
				}
				
				return 1 - Math.pow(-2 * progress + 2, 2) / 2;
			},
			setCounterToEnd: function () {
				cancelAnimationFrame(state.animationFrame);
				state.isPlayed = true;
				const lastIndex = obj.valueList.length - 1;
				
				eventList.setStripPosition(obj.digitList[0], 1);
				eventList.setStripPosition(obj.digitList[1], lastIndex);
				eventList.setStripPosition(obj.digitList[2], lastIndex);
				eventList.setStripPosition(obj.digitList[3], lastIndex);
			},
			resetCounter: function () {
				cancelAnimationFrame(state.animationFrame);
				state.isPlayed = false;
				state.startTime = 0;
				eventList.setCounterIndex(0);
			},
			playCounter: function () {
				cancelAnimationFrame(state.animationFrame);

				state.startTime = performance.now();

				const updateCounter = function (currentTime) {
					const elapsedTime = currentTime - state.startTime,
						rawProgress = Math.min(elapsedTime / state.duration, 1),
						progress = eventList.easeInOut(rawProgress),
						lastIndex = obj.valueList.length - 1,
						currentIndex = progress * lastIndex,
						firstDigitIndex = Math.max(0, (progress - 0.5) / 0.5);

					for (let i = 0; i < obj.digitList.length; i++) {
						if (i === 0) {
							eventList.setStripPosition(obj.digitList[i], Math.min(firstDigitIndex, 1));
							continue;
						}

						eventList.setStripPosition(obj.digitList[i], currentIndex);
					}

					if (rawProgress < 1) {
						state.animationFrame = requestAnimationFrame(updateCounter);
						return;
					}

					state.isPlayed = true;
					eventList.setStripPosition(obj.digitList[0], 1);
					eventList.setStripPosition(obj.digitList[1], lastIndex);
					eventList.setStripPosition(obj.digitList[2], lastIndex);
					eventList.setStripPosition(obj.digitList[3], lastIndex);
				};

				state.animationFrame = requestAnimationFrame(updateCounter);
			}
		};

		return {
			init: init
		}
	})();
})();
;
(function () {
	window.flagship.features.benefit = (function () {
		const resize = window.flagship.common.resize;

		let els = {},
			obj = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution();

		const init = function () {
			els.section = document.querySelector('.js-benefit');

			if(!!els.section) {
				setElements();
				bindEvents();
			}
		};

		const isMobile = function () {
			return currDevice.indexOf('mobile') > -1;
		};

		const setElements = function () {
			els.accordionList = els.section.querySelector('.js-accordion-list');
			els.accordionItem = els.section.querySelectorAll('.js-accordion-item');
			els.benefitTitle = els.section.querySelectorAll('.js-title');
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			if(els.accordionItem.length > 1) eventList.setTitle();
			eventList.runByDevice();
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;

				if (currDevice != prevDevice) {
					if(els.accordionItem.length > 1) eventList.setTitle();
					eventList.runByDevice();
					prevDevice = currDevice;
				}
			},
			runByDevice: function () {
				if(!!isMobile() && els.accordionItem.length > 1) {
					eventList.setAccordion();
					eventList.initialOpen();
					eventList.setHeight();
				} else {
					eventList.destroy();
				}
			},
			initialOpen: function () {
				if(!els.accordionItem[0].classList.contains('is-open')) {
					els.accordionItem[0].classList.add('is-open');
				}
			},
			setHeight: function () {
				const isOpenedItem = els.accordionList.querySelector('.is-open');

				if (!!isOpenedItem) {
					const isOpenedItemContent = isOpenedItem.querySelector('.js-accordion-content');
					const clientHeight = isOpenedItemContent.children[0].clientHeight;

					isOpenedItemContent.style.height = `${clientHeight}px`;
				}
			},
			setAccordion: function () {
				obj.accordion = new window.flagship.common.accordion({
					wrap: els.accordionList,
					openType: 'toggle',
					transition: {
						duration: '0.35s',
						timingFnc: 'ease',
						delay: '',
					},
				});
				obj.accordion.init();
			},
			setTitle: function () {
				els.benefitTitle.forEach(el => {
					const headline = el.querySelector('.common-text');
					const button = el.nextElementSibling.querySelector('.common-text');
					if(!el.titleText) el.titleText = headline.innerText;

					if (!!isMobile()) {
						button.innerText = el.titleText;
						headline.innerText = '';
					} else {
						headline.innerText = el.titleText;
						button.innerText = '';
					}
				});
			},
			destroy: function () {
				if (obj.accordion) {
					obj.accordion.destroy();
					obj.accordion = null;
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship.features.carouselExtensions = window.flagship.features.carouselExtensions || [];

	window.flagship.features.cameraCarousel = (function () {

		let els = {};

		const init = function () {
			els.carousel = document.querySelector('.features-camera-carousel');

			if (els.carousel != null) {}
		};

		const getCarouselOptions = function (carousel) {

			if (!carousel.classList.contains('js-camera-carousel')) {
				return {};
			}

			return {
				swiper: {
					mobileOnly: true
				},
				pagination: {
					progressbar: true
				},
				media: {
					preloadAhead: 1
				},
				video: {
					playCallback: function (payload) {},
					pauseCallback: function (payload) {}
				},
				autoslide: {
					enabled: true,
					progressStart: 15,
					progressEnd: 60,
					moProgressStart: 15,
					moProgressEnd: 55
				},
				plugins: []
			};
		};

		return {
			getCarouselOptions: getCarouselOptions,
			init: init
		};
	})();

	if (window.flagship.features.carouselExtensions.indexOf(window.flagship.features.cameraCarousel) === -1) {
		window.flagship.features.carouselExtensions.push(window.flagship.features.cameraCarousel);
	}
})();
(function () {
	window.flagship.features.cameraOverview = (function () {
		const resize = window.flagship.common.resize,
			utils = window.flagship.common.utils;

		let els = {},
			obj = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution();


		const init = function () {
			els.section = document.querySelector('.features-camera-overview');

			if (!!els.section) {
				setElement();
				bindEvents();
			}
		};

		const setElement = function () {
			els.video = els.section.querySelector('.common-video');
			els.videoTag = els.section.querySelector('.common-video video');
			els.videoController = els.section.querySelector('.common-video__control');
			els.track = document.querySelector('.features-common-comparison-module--battery');
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			eventHandler.scroll();
			eventList.setScene();
			eventList.setVideo();
		};

		const eventHandler = {
			scroll: function () {
				window.addEventListener('scroll', eventList.scroll);
			}
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;
				if (currDevice != prevDevice) {
					
					eventList.scroll();
					prevDevice = currDevice;
				}
			},
			scroll: function () {
				obj.scene.trackAnimation(function () {
					progress = this.progress
					if (progress >= 100) {
						progress = 99.9;
					}
					if (els.videoTag.readyState >= 4) {
						obj.video.scrollActive(progress);
						if (progress < 40) {
							obj.video.eventList.reset.call(obj.video);
						}
					}
				})

				obj.endScene.trackAnimation(function () {
					let progress = this.progress; 
					if (els.endHandler) {
						els.endHandler.scrollActive(progress);
					}
				});
			},
			setScene: function () {
				obj.scene = SCROLLER({
					trackElement: els.track,
					useFixed: false
				})
				obj.endScene = SCROLLER({
					trackElement: els.video,
					resize: utils.detector.isTouchDevice ? false : true
				});
			},
			setVideo: function() {
				obj.video = utils.videoHandler({
					wrap: els.video,
					video: els.videoTag,
					playType: 'scrollPlay',
					controller: els.videoController,  
					startPoint: 65,
				});
				els.endHandler = utils.videoHandler({
					wrap: els.video,
					video: els.videoTag,
					playType: 'scrollPlay',
					controller: els.videoController, 
					startPoint: 100,
					reversePoint: 100,
				});
			},			
		};

		return {
			init: init
		}
	})();
})();

(function () {
	window.flagship.features.cameraSpec = (function () {
		const resize = window.flagship.common.resize;

		let els = {},
			obj = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution();


		const init = function () {
			els.section = document.querySelector('.js-camera-spec');

			if (!!els.section) {
				setElement();
				bindEvents();
			}
		};

		const setElement = function () {
			els.wrap = els.section.querySelector('.js-wrap');
			els.items = els.section.querySelectorAll('.js-item');
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			eventHandler.scroll();
			eventList.setScene();
		};

		const eventHandler = {
			scroll: function () {
				window.addEventListener('scroll', eventList.scroll);
			}
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;
				if (currDevice != prevDevice) {
					prevDevice = currDevice;
				}
			},
			scroll: function () {
				obj.scene.trackAnimation(function () {
					progress = this.progress
					eventList.activeSpec(progress);
				})
			},
			setScene: function () {
				obj.scene = SCROLLER({
					trackElement: els.section,
					useFixed: false
				})
			},
			activeSpec: function (progress) {
				const isMobile = currDevice.indexOf('mobile') > -1;
				const threshold = isMobile ? 10 : 18;
				const order = isMobile ? [3, 4, 0, 1, 2] : [0, 1, 2, 3, 4];
				const delayMap = isMobile ? [0, 0, 300, 600, 900] : [0, 300, 600, 900, 900];

				if (progress > threshold && !els.wrap.classList.contains('is-active')) {
					els.wrap.classList.add('is-active');
					for (let i = 0; i < els.items.length; i++) {
						const item = els.items[i];
						const orderIndex = (order.indexOf(i));
						const delay = delayMap[orderIndex];
						setTimeout(() => {
							item.classList.add('is-active');
						}, delay);
					}
				} else if (progress <= 10) {
					els.wrap.classList.remove('is-active');
					for (let i = 0; i < els.items.length; i++) {
						const item = els.items[i];
						item.classList.remove('is-active');
					}
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship.features.colors = (function () {
		const utils = window.flagship.common.utils,
			resize = window.flagship.common.resize,
			Swiper = flagship.Swiper;
			const PROJECT_NAME = 'galaxy-z-fold8-ultra';
			const swipeThreshold = 50;
			const swipeRestraint = 75;
			const swipeAllowedTime = 300;

		let els = {},
			activeClass = 'is-active',
			currDevice = resize.checkResolution() || '',
			prevDevice = null,
			isMiuibrowser = document.documentElement.classList.contains('miuibrowser'),
			isLowNetwork = !isMiuibrowser && utils.isLowNetwork(),
			isLoadEnd = isLowNetwork ? true : false,
			isBgLoad = false,
			pdViewer,
			viewerInitModel,
			viewerInitColor,
			slideBounceTimeout,
			swipeStartX = 0,
			swipeStartY = 0,
			swipeStartTime = 0,
			isTouchMode,
			swiperUpdateTimeout,
			isFirstRun = true,
			isBouncePlayed,
			isUserPaused = false,
			firstFocusableElement,
			lastFocusableElement;

		const isSmallTb = () => window.outerWidth > 534 && window.outerWidth <= 768;

		const init = function () {
			els.section = document.querySelector('.js-colors');

			if(!!els.section) {
				setElements();
				setProperty();
				eventList.setContentsByBand();
				bindEvents();

				if(!isLowNetwork) eventList.insertViewer();

				eventList.checkColorchipCount();
				eventList.setActiveClass();
				eventList.resize(currDevice);
				eventList.hideViewerBtns();

				eventList.setVideoHandler();

				const currentItemIdx = eventList.getCurrentSelectorIdx();
				accessibility.activeSelectorItem(currentItemIdx);

				eventList.setScene();
			}
		}

		const setElements = function() {
			els.wrapEl = document.querySelector('#wrap');
			els.contents = document.querySelector('#contents');

			// selector
			els.selectorContainer = els.section.querySelector('.js-selector-container');
			els.selectorItems = els.selectorContainer.querySelectorAll('.js-selector-item');
			els.selectorBtns = els.section.querySelectorAll('.js-selector-btn');
			els.selectorColorBtn = els.section.querySelector('.js-selector-color-btn');
			els.selectorContents = els.section.querySelectorAll('.js-selector-content');

			els.colorchipWrap = els.selectorContainer.querySelector('.js-colorchip');
			els.swiperContainer = els.colorchipWrap.querySelector('.js-colorchip-container');
			els.colorchipBtns = els.colorchipWrap.querySelectorAll('.js-colorchip-button');
			els.colorchipNames = els.colorchipWrap.querySelectorAll('.js-colorchip-name');

			els.indication = els.selectorContainer.querySelector('.js-selector-pagination');

			els.contentWrap = els.section.querySelector('.js-content-wrap');
			els.contentItems = els.section.querySelectorAll('.js-content-item');

			// viewer
			els.viewerParent = document.querySelector('.features-colors__viewer360-content');
			els.viewerSection = els.section.querySelector('.js-colors-viewer');
			els.viewerWrap = els.viewerSection.querySelector('.features-colors__viewer360-content');
			els.viewerBtnWrap = els.section.querySelector('.js-viewer-controls');
			els.viewerPresetWrap = els.section.querySelector('.js-preset-layer');
			els.selectorColorchip = els.section.querySelector('.features-colors__selector-chip');

			// panel
			els.panelWrap = els.section.querySelector('.js-panel-wrap');
			els.panelItems = els.panelWrap.querySelectorAll('.js-panel-item');

			els.colorSelectorItem = els.selectorContainer.querySelector('.js-color-tab');
			els.exclusiveText = els.section.querySelector('.js-exclusive-text');

			// low image
			els.imgSection = els.section.querySelector('.js-colors-image');

			els.featureTagging = els.selectorContainer.getAttribute('data-tagging-feature');

			if(!isLowNetwork) {
				// angle preset
				els.viewerBtnWrap = els.section.querySelector('.js-viewer-controls');
				els.presetOpen = els.section.querySelector('.js-preset-open');
				els.presetClose = els.section.querySelector('.js-preset-close');
				els.viewerPresetWrap = els.section.querySelector('.js-preset-layer');
				els.angleCta = els.section.querySelectorAll('.js-angle-cta');

				// viewer controls
				els.foldBtn = els.section.querySelector('.js-fold-btn');
				els.resetBtn = els.section.querySelector('.js-reset-btn');
			}
		}

		const setProperty = function () {
			for(let i = 0; i < els.contentItems.length; i++) {
				const item = els.contentItems[i];

				item.videoWrap = item.querySelector('.js-video-wrap');
				item.video = item.querySelector('.common-video__video');
				item.highThumbnail = item.querySelector('.common-video__cover-image--highband');
				item.lowThumbnail = item.querySelector('.common-video__cover-image--lowband');
				item.controller = item.querySelector('.js-video-control');
				if(item.controller) item.controller.video = item.video;
				item.img = item.querySelector('.js-res-img');

				item.startPoint = item.getAttribute('data-start-point') || undefined;
				item.reversePoint = item.getAttribute('data-reverse-point') || undefined;
				item.moStartPoint = item.getAttribute('data-mo-start-point') || undefined;
				item.moReversePoint = item.getAttribute('data-mo-reverse-point') || undefined;
			}

			for (let i = 0; i < els.colorchipBtns.length; i++) {
				els.colorchipBtns[i].index = i;
			}

			const focusableElements = Array.from(els.viewerPresetWrap.querySelectorAll('button, a, input, select, iframe'));
			firstFocusableElement = focusableElements[0];
			lastFocusableElement = focusableElements[focusableElements.length - 1];
		};

		const bindEvents = function() {
			resize.add(eventList.resize);
			eventHandler.contentTransitionEnd();

			let defaultColorIdx;

			if (isLowNetwork) {
				defaultColorIdx = Array.from(els.panelItems).findIndex((el) => el.classList.contains('is-active')) || 0;
			} else {
				defaultColorIdx = Array.from(els.colorchipBtns).findIndex((el) => el.classList.contains('is-active')) || 0;
			}
			eventList.setColors(defaultColorIdx);
			eventHandler.click();
			eventHandler.scroll();

			if(!isLowNetwork) {
				eventHandler.viewerEvents();
				eventHandler.mousedown();
				eventHandler.mouseup();
			}
		}

		const eventHandler = {
			click: function() {
				for(let i = 0; i < els.selectorBtns.length; i++) {
					els.selectorBtns[i].addEventListener('click', function(e) {
						const isClickColorchip = e.target.closest('.js-colorchip-container');
						!isClickColorchip && eventList.clickSelectorBtn(i);
					});
				}
				for (let i = 0; i < els.colorchipBtns.length; i++) {
					els.colorchipBtns[i].addEventListener('click', eventList.clickColorchip);
				}

				if(!isLowNetwork) {
					els.foldBtn && els.foldBtn.addEventListener('click', eventList.clickFold);
					els.presetOpen && els.presetOpen.addEventListener('click', eventList.openPresetPopup);

					for (let i = 0; i < els.angleCta.length; i++) {
						els.angleCta[i].addEventListener('click', eventList.setAngle);
					}
				}
			},
			scroll: function () {
				window.addEventListener('scroll', eventList.scroll);
			},
			viewerEvents: function () {
				window.addEventListener('viewerLoadEnd', eventList.viewerLoadEnd);
				window.addEventListener('mixerStart', eventList.mixerStart);
			},
			contentTransitionEnd: function () {
				els.selectorItems[0].addEventListener('transitionend', eventList.resetViewerContent);
			},
			mousedown: function () {
				els.contents.addEventListener('mousedown', eventList.checkContentsPointerdown);
				els.contents.addEventListener('touchstart', eventList.checkContentsPointerdown, {
					passive: true
				});
				els.contentWrap.addEventListener('mousedown', eventList.contentPointerdown);
				els.contentWrap.addEventListener('touchstart', eventList.contentPointerdown);
			},
			mouseup: function () {
				els.contentWrap.addEventListener('mouseup', eventList.contentPointerup);
				els.contentWrap.addEventListener('touchend', eventList.contentPointerup);
			},
			doubleClick: function () {
				if (!pdViewer || !pdViewer.viewer.domElement) return;
				pdViewer.viewer.domElement.addEventListener('dblclick', eventList.doubleClick);
			},
			presetOpen: function () {
				window.addEventListener('keydown', eventList.presetFocusLoop);
			},
			presetClose: function () {
				window.removeEventListener('keydown', eventList.presetFocusLoop);
			}
		}

		const eventList = {
			setContentsByBand: function() {
				const activeTarget = !isLowNetwork ? els.viewerSection : els.imgSection;
				activeTarget.classList.add('is-active');

				if(!isLowNetwork) {
					els.colorchipBtns.forEach((colorchipBtnEl) => {
						const colorKey = colorchipBtnEl.dataset.colors;
						const isExclusive = colorchipBtnEl.classList.contains('features-colors__chip-exclusive-icon');
						const ariaDescribedbyValue = !isExclusive ? `color-${colorKey}-highband` : `color-${colorKey}-highband exclusive-to`
						colorchipBtnEl.removeAttribute('aria-controls');
						colorchipBtnEl.setAttribute('aria-describedby', ariaDescribedbyValue);
					});
					els.colorchipNames.forEach((colorchipNameEl) => {
						colorchipNameEl.setAttribute('id', `${colorchipNameEl.id}-highband`);
					});
				}
			},
			scroll: function () {
				let winOffsetBottom = window.pageYOffset + window.innerHeight,
					kv = document.querySelector('.features-kv'),
					kvHeight = kv.getBoundingClientRect().height + utils.getNavHeight();

					eventList.handleContentVideoScroll();
				if (isBgLoad && winOffsetBottom >= kvHeight) {
					// bg load
					els.colorchipWrap.bgImgs = els.colorchipWrap.querySelectorAll('.js-bg-img');
					if (!!els.colorchipWrap.bgImgs) bgLoader.setResponsiveMedia(els.colorchipWrap.bgImgs);

					isBgLoad = true;
				}
			},
			checkColorchipCount: function () {
				if(els.colorchipBtns.length < 5) {
					els.colorSelectorItem.classList.add('features-colors__selector-item--two-column');
				}
			},
			setActiveClass: function() {
				els.selectorItems.forEach(function(item){
					if (item.dataset.active == 'true') {
						item.classList.add('is-active');
					}
				});
			},
			resize: function(currRes) {
				clearTimeout(swiperUpdateTimeout);

				currDevice = currRes;
				const isChangedBreakPoint = prevDevice != currDevice;

				els.selectorSwiper && els.selectorSwiper.update();
				swiperUpdateTimeout = setTimeout(() => els.selectorSwiper && els.selectorSwiper.update(), 400);
				eventList.updateSelectorHeight();

				eventList.setViewerZoom();

				if (isChangedBreakPoint) {
					const isMobile = currDevice.indexOf('mobile') > -1;
					accessibility.activeSelectorItem(eventList.getCurrentSelectorIdx());

					if(isMobile) {
						swiperEvents.set();
					} else {
						swiperEvents.destroy();
					}
					currentSlidesPerView = currDevice.indexOf('mobile') > -1 ? 5 : 7;
					prevDevice = currDevice;
				}
			},
			insertViewer: function () {
				const viewerAssetsPath = `/samsung/resources/global/${PROJECT_NAME}/common/viewer/`;
				const viewerBackupPath = `/samsung/resources/global/${PROJECT_NAME}/common/vendor/viewer/assets/`;
				const viewerInitModel = els.viewerSection.getAttribute('data-product-name') || PROJECT_NAME;
				const viewerInitColor = Array.from(els.colorchipBtns).find((el) => el.classList.contains('is-active')).getAttribute('data-colors') || 'violet-shadow';

				const viewerOptions = {
					assetsPath: viewerAssetsPath,
					backupPath: viewerBackupPath,
					bgcolor: 'transparent',
					gestureGuide: null,
					useZoom: false,
					usePan: false,
					x: -180,
					y: 0,
					minAngleX: -180,
					minAngleY: -90,
					maxAngleX: 180,
					maxAngleY: 90,
					zoom: isSmallTb() ? 100 : currDevice === 'mobile' ? 88 : 107
				};

				const modelOptionList = [{
					modelName: viewerInitModel,
					autoRotation: null,
					color: viewerInitColor,
					screen: true,
					screenMode: 'halfEnd',
					statusToggle: 1,
					rotation: {
						x: 0,
						y: 0,
						z: 0
					},
					position: {
						x: 0,
						y: isSmallTb() ? -0.8 : currDevice === 'mobile' ? -0.2 : 0,
						z: 0
					}
				}, ];

				const viewerLoaderImageHTML = `<div class="v3d-loader__background-image-inner js-bg-img is-${viewerInitModel}-${viewerInitColor}"></div>`;
				els.section.querySelector('.v3d-loader__background-image').innerHTML = viewerLoaderImageHTML;

				// Flip Fold must be different because statusToggle has the opposite value
				if (!!viewerOptions.statusToggle) {
					eventList.setFoldInActiveClass();
				} else {
					eventList.setFoldActiveClass();
				}

				PDVIEWER.makeViewer(null, viewerOptions, modelOptionList);
				pdViewer = PDVIEWER.getViewer();

				eventHandler.doubleClick();

				// Viewer Loader image lazy load
				imageLoader.getLazyMedia();
				imageLoader.setLazyMedia();
				bgLoader.getLazyMedia();
				bgLoader.setLazyMedia();
				els.viewerSection.querySelector('.v3d-loader-icon').style.display = 'none';
			},
			viewerLoadEnd: function () {
				pdViewer.hideLoader();

				isLoadEnd = true;
				if(els.selectorSwiper) {
					els.selectorSwiper.allowTouchMove = true;
					eventList.setClickableSelectorItems(true);
					if(els.indication) els.indication.style.pointerEvents = 'auto';
				}

				els.viewerSection.classList.add('is-loaded');
				accessibility.fold.ariaLabel();

				eventList.viewerLoadendAfter();
			},
			viewerLoadendAfter: function () {
				els.section.classList.add('is-viewer-ready');
				eventList.setFoldClass();
				els.viewerBtnWrap.classList.add('is-show');
				eventList.showViewerBtns();

				const direction = eventList.getViewerDirection();
				const targetAngleBtn = Array.from(els.angleCta).find((el) => el.dataset.jsAngle === direction);
				accessibility.angleSelected(targetAngleBtn);
			},
			getViewerDirection: function() {
				return pdViewer.getModelDirection();
			},
			setViewerZoom: function() {
				const viewerObj = PDVIEWER.getViewer();
				if(!viewerObj) return;

				const isMobile = currDevice.indexOf('mobile') > -1;
				const zoomValue = isSmallTb() ? 30 : isMobile ? 34.09 : 28.03;
				const viewerCamera = viewerObj.viewer.camera;

				if(viewerCamera.position.z !== zoomValue) {
					viewerCamera.position.z = zoomValue;
					viewerCamera.updateProjectionMatrix();
				}
			},
			getCurrentSelectorIdx: function() {
				const currentIndex = Array.from(els.selectorItems).findIndex((itemEl) => itemEl.classList.contains('is-active'));
				return currentIndex > -1 ? currentIndex : 0;
			},
			clickSelectorBtn: function(activeIndex) {
				const isMobile = currDevice.indexOf('mobile') > -1;
				if(isMobile && els.selectorSwiper) {
					els.selectorSwiper.slideTo(activeIndex, 300);
				}

				eventList.hideExclusiveText();
				eventList.activeSelectorItem(activeIndex);
				eventList.activeContentItem(activeIndex);

				const activeInnerContent = els.selectorContents[activeIndex];
				!els.selectorSwiper && activeInnerContent.focus();
			},
			hideExclusiveText: function() {
				const isShowing = els.exclusiveText.classList.contains('is-show');
				if(isShowing) {
					els.exclusiveText.classList.remove('is-show');
				}
			},
			activeSelectorItem: function(activeIndex) {
				if(!isLowNetwork && !isLoadEnd) return;

				const activeItem = els.selectorItems[activeIndex];
				const wasActive = els.selectorItems[activeIndex].classList.contains('is-active');
				if(wasActive) return;

				for(let i = 0; i < els.selectorItems.length; i++) {
					const isColorBtnBgLoaded = els.selectorColorBtn?.classList.contains('is-img-load-complete');
					els.selectorItems[i].classList.remove('is-active');
					eventList.setSelectorHeight(i, false);

					if(i === 0 && els.selectorColorBtn && !isColorBtnBgLoaded) {
						bgLoader.setResponsiveMedia(els.selectorColorBtn);
					}
				}

				if(!wasActive) {
					activeItem.classList.add('is-active');
					els.selectorContainer.classList.add('is-slide-active');
					eventList.setSelectorHeight(activeIndex, true);
				} else {
					activeItem.classList.remove('is-active');
					els.selectorContainer.classList.remove('is-slide-active');
					eventList.setSelectorHeight(activeIndex, false);
				}
				els.selectorSwiper?.update();

				accessibility.activeSelectorItem(activeIndex);
			},
			activeContentItem: function(activeIndex) {
				if(!isLowNetwork && !isLoadEnd) return;

				const activeContent = els.contentItems[activeIndex];
				const wasActive = activeContent.classList.contains('is-active');
				if(wasActive) return;

				eventList.controlViewerByIdx(activeIndex);

				for(let i = 0; i < els.contentItems.length; i++) {
					const targetItem = els.contentItems[i];
					if(targetItem !== activeContent) {
						utils.onAccessibility(targetItem);
						targetItem.classList.remove('is-active');
					}
				}

				if(!isLowNetwork && activeIndex !== 0) {
					const contentImg = activeContent.querySelector('.features-colors__content--image .js-res-img');
					if (contentImg && !contentImg.classList.contains('is-img-load-complete')) {
						imageLoader.setResponsiveMedia(contentImg);
					}
				}

				const contentVideo = els.contentItems[activeIndex].video;
				if(contentVideo) {
					const currentPlayItem = Array.from(els.contentItems).find((contentItemEl) => contentItemEl.video && !contentItemEl.video.paused);

					currentPlayItem && eventList.stopContentVideo(currentPlayItem.video);
				}
				if(!isLowNetwork) {
					activeContent.addEventListener('transitionend', eventList.onContentFadeIn);
				}

				activeContent.classList.add('is-active');
				utils.offAccessibility(activeContent);
			},
			stopContentVideo(video) {
				video.pause();
			},
			stopAllContentVideos() {
				els.contentItems.forEach((contentItemEl) => contentItemEl.video && eventList.stopContentVideo(contentItemEl.video));
			},
			resetContentVideo(video) {
				video.currentTime = 0;
			},
			resetAllContentVideos() {
				els.contentItems.forEach((contentItemEl) => contentItemEl.video && eventList.resetContentVideo(contentItemEl.video));
			},
			onContentFadeIn: function () {
				eventList.resetAllContentVideos();

				const currentIndex = Array.from(els.contentItems).findIndex((itemEl) => itemEl?.classList.contains('is-active'));
				const activeContent = els.contentItems[currentIndex];
				const contentVideo = activeContent.video;
				if (!contentVideo) return;

				eventList.playContentVideo(contentVideo);
				activeContent.removeEventListener('transitionend', eventList.onContentFadeIn);
			},
			clickVideoCta: function (e) {
				if (e.target == e.currentTarget) {
					const video = e.currentTarget.video;

					if (video.paused) {
						eventList.playContentVideo(video);
						isUserPaused = false;
					} else {
						video.pause();
						isUserPaused = true;
					}
				}
			},
			canVideoPlayOnce: function () {
				const scope = this;
				scope.play();
			},
			playContentVideo: function (contentVideo) {
				if(!contentVideo) return;

				if (contentVideo.readyState >= 1) {
					contentVideo.play();
				} else {
					contentVideo.addEventListener('canplay', eventList.canVideoPlayOnce, { once: true });
				}
			},
			setVideoHandler: function() {
				for(let i = 0; i < els.contentItems.length; i++) {
					const contentVideo = els.contentItems[i].video;
					if(!contentVideo) continue;

					const contentItem = els.contentItems[i];
					const controller = contentItem.controller;
					controller.addEventListener('click', eventList.clickVideoCta);

					const videoControlAccBtn = document.createElement('button');
					videoControlAccBtn.classList.add('sr-only');
					videoControlAccBtn.classList.add('is-clone-vid-control');
					videoControlAccBtn.setAttribute('title', controller.getAttribute('title'));
					videoControlAccBtn.setAttribute('tabindex', -1);

					const ctrlTextObserver = new MutationObserver((mutationsList) => {
						for (const mutation of mutationsList) {
							if (mutation.type === 'childList' || mutation.type === 'characterData') {
								videoControlAccBtn.textContent = controller.textContent.trim();
							}
						  }
					});
					const config = {
					  childList: true,
					  characterData: true,
					  subtree: true
					};

					ctrlTextObserver.observe(controller, config);

					const insertTargetNode = els.selectorContents[i];
					els.selectorContents[i].cloneController = videoControlAccBtn;
					insertTargetNode.after(videoControlAccBtn);
					videoControlAccBtn.addEventListener('click', () => controller.click());

					utils.videoHandler({
						playType: 'scrollPlay',
						startPoint: (currDevice.indexOf('mobile') > -1) ? content.moStartPoint : content.startPoint,
						reversePoint: (currDevice.indexOf('mobile') > -1) ? content.moReversePoint : content.reversePoint,
						wrap: contentItem.videoWrap,
						video: contentItem.video,
						controller: controller,
						playCallback: function () {
							tagging.pause(this.controller);
							this.video.removeEventListener('canplay', eventList.canVideoPlayOnce);
							controller.removeAttribute('tabindex');
							controller.setAttribute('aria-hidden', true);
						},
						pauseCallback: function () {
							tagging.play(this.controller);
						}
					});
				}
				accessibility.setTabFocusFlow();
			},
			setScene: function () {
				els.section.scene = SCROLLER({
					trackElement: els.section,
					useFixed: false
				});
			},
			handleContentVideoScroll: function () {
				const currentIndex = Array.from(els.contentItems).findIndex((itemEl) => itemEl?.classList.contains('is-active'));
				const content = els.contentItems[currentIndex];

				els.section.scene.trackAnimation(function () {
					scrollProgress = this.progress;

					const videoHandler = content.video?.videoHandler;
					if(!videoHandler) return;

					if (!isLowNetwork && !isUserPaused) {
						videoHandler.scrollActive(scrollProgress);
					}
				});
			},
			controlViewerByIdx: function(index) {
				const viewerObj = PDVIEWER.getViewer();
				if(!viewerObj) return;

				switch(index) {
					case 0:
						const isMobile = currDevice.indexOf('mobile') > -1;

						viewerObj.viewer.render();

						if(!isMobile) eventList.showViewerBtns();
						const zoomValue = isSmallTb() ? 30 : isMobile ? 34.09 : 28.03;

						requestAnimationFrame(() => viewerObj.setPosition({angleX: 0, angleY: -Math.PI, zoom: zoomValue, panY: 0 }, 800));
						break;
					default:
						viewerObj.viewer.stopRender();
						eventList.hideViewerBtns();
						break;
				}
			},
			updateSelectorHeight: function() {
				const activeSelectorIdx = Array.from(els.selectorItems).findIndex((itemEl) => itemEl?.classList.contains('is-active'));
				const targetIdx = activeSelectorIdx > -1 ? activeSelectorIdx : 0;
				eventList.setSelectorHeight(targetIdx, true)
			},
			setSelectorHeight: function(targetIndex, isOpen = false) {
				if (targetIndex === -1) return;

				const targetSelectorItem = els.selectorItems[targetIndex];
				if(isOpen) {
					const clientHeight = els.selectorContents[targetIndex].clientHeight;
					targetSelectorItem.style.minHeight = `${clientHeight}px`;
					requestAnimationFrame(() => targetSelectorItem.style.minHeight = `${clientHeight}px`);
				} else {
					targetSelectorItem.style.removeProperty('min-height');
				}
			},
			resetViewerContent: function() {
				const viewerContentWrap = els.selectorItems[0];
				const isActiveViewerCall = viewerContentWrap.classList.contains('is-active');
				if(isActiveViewerCall) return;

				const defaultColorchip = Array.from(els.colorchipBtns).find((colorchipEl) => colorchipEl.dataset.colors === 'violet-shadow');
				defaultColorchip.click();
			},
			showViewerBtns: function () {
				const isViewerLoadEnd = !isLowNetwork && isLoadEnd;
				if(!isViewerLoadEnd) return;

				els.viewerBtnWrap.classList.remove('no-transition');
				els.viewerBtnWrap && els.viewerBtnWrap.classList.add('is-show');

				utils.offAccessibility(els.viewerBtnWrap);
				utils.offAccessibility(els.viewerPresetWrap);
			},
			hideViewerBtns: function () {
				els.viewerBtnWrap.classList.add('no-transition');
				els.viewerBtnWrap && els.viewerBtnWrap.classList.remove('is-show');
				els.viewerPresetWrap && els.viewerPresetWrap.classList.remove('is-active');

				utils.onAccessibility(els.viewerBtnWrap);
				utils.onAccessibility(els.viewerPresetWrap);
			},
			setClickableSelectorItems: function (enable = false) {
				for(let i = 0; i < els.selectorItems.length; i++) {
					els.selectorItems[i].style.pointerEvents = !enable ? 'none' : 'auto';
				}
			},
			setColors: function (activeIndex) {
				eventList.setColorchip(activeIndex);
				eventList.setPanel(activeIndex);
				eventList.setColorName(activeIndex);

				// viewer
				if (PDVIEWER.getViewer()) {
					eventList.setViewerColor(activeIndex)
				}
				accessibility.colorTabBlindText(activeIndex);
			},
			clickColorchip: async function () {
				if (!isLoadEnd && !isLowNetwork) return;
				if (!isLowNetwork && PDVIEWER.getViewer()) {
					if (PDVIEWER.getViewer().viewer.isChanging) return;
					if (PDVIEWER.getViewer().viewer.viewerModel.isMixerRun) return;
				}

				const targetColor = this;
				eventList.setColors(targetColor.index);
			},
			setViewerColor: async function (activeIndex) {
				const modelName = els.viewerSection.getAttribute('data-product-name');
				const colorName = els.colorchipBtns[activeIndex].getAttribute('data-colors');
				await PDVIEWER.getViewer().changeColor(modelName, colorName);
			},
			setColorchip: function (activeIndex) {
				const targetcolorchipButton = els.colorchipBtns[activeIndex];
				const isExclusive = targetcolorchipButton.classList.contains('features-colors__chip-exclusive-icon');

				for (let i = 0; i < els.colorchipBtns.length; i++) {
					els.colorchipBtns[i].classList.remove(activeClass);
					els.colorchipBtns[i].removeAttribute('title');
				}

				if (!targetcolorchipButton.classList.contains(activeClass)) {
					targetcolorchipButton.classList.add(activeClass);
					accessibility.selected(targetcolorchipButton);
				}

				if(isExclusive) {
					els.exclusiveText.classList.add('is-show');
				} else {
					els.exclusiveText.classList.remove('is-show');
				}
			},
			setPanel: function (activeIndex) {
				for (let i = 0; i < els.panelItems.length; i++) {
					if (els.panelItems[i].classList.contains(activeClass)) {
						els.panelItems[i].classList.remove(activeClass);
						els.panelItems[i].setAttribute('aria-hidden', true);
					}
				}

				if (!els.panelItems[activeIndex].classList.contains(activeClass)) {
					els.panelItems[activeIndex].classList.add(activeClass);
					els.panelItems[activeIndex].setAttribute('aria-hidden', false);
				}
			},
			setColorName: function (activeIndex) {
				for (let i = 0; i < els.colorchipNames.length; i++) {
					if (i !== activeIndex) {
						utils.onAccessibility(els.colorchipNames[i]);
					}

					if (els.colorchipNames[i].classList.contains(activeClass)) {
						els.colorchipNames[i].classList.remove(activeClass);
					}
				}

				if (!els.colorchipNames[activeIndex].classList.contains(activeClass)) {
					els.colorchipNames[activeIndex].classList.add(activeClass);
					utils.offAccessibility(els.colorchipNames[activeIndex]);
				}
			},
			doubleClick: function () {},
			clickFold: function () {
				if (!pdViewer.viewer.isInit || !isLoadEnd) return;

				if (!pdViewer.getStatusToggleState()) {
					pdViewer.statusToggleActive();
				} else {
					pdViewer.statusToggleInactive();
				}

				accessibility.fold.ariaLabel();
				eventList.setFoldClass();
				accessibility.fold.tagging();
			},
			mixerStart: function () {
				if (!pdViewer.viewer.isInit || !isLoadEnd) return;

				accessibility.fold.ariaLabel();
				eventList.setFoldClass();
				accessibility.fold.tagging();
			},
			contentPointerdown: function (e) {
				if(!els.selectorSwiper || els.selectorSwiper.activeIndex === 0) return;

				const isTouch = e.type.startsWith('touch');
				if(isTouch) isTouchMode = true;
				else if(isTouchMode) return;

				const touch = e.touches && e.touches[0];
				const clientX = touch ? touch.clientX : e.clientX;
				const clientY = touch ? touch.clientY : e.clientY;

				swipeStartX = clientX;
				swipeStartY = clientY;
				swipeStartTime = new Date().getTime();
			},
			contentPointerup: function (e) {
				if(!els.selectorSwiper || els.selectorSwiper.activeIndex === 0) return;

				const touch = e.changedTouches && e.changedTouches[0];
				const clientX = touch ? touch.clientX : e.clientX;
				const clientY = touch ? touch.clientY : e.clientY;

				if (clientX === undefined || clientY === undefined) return;

				const distX = clientX - swipeStartX;
				const distY = clientY - swipeStartY;
				const elapsedTime = new Date().getTime() - swipeStartTime;

				const isAllowedHorizontalSwipe = Math.abs(distX) >= swipeThreshold;
				if (elapsedTime <= swipeAllowedTime) {
					if (isAllowedHorizontalSwipe && Math.abs(distY) <= swipeRestraint) {
						const swipeDirection = distX > 0 ? 'right' : 'left';
						eventList.onContentSwipe(swipeDirection);
					}
				}
			},
			onContentSwipe: function(direction) {
				if(!els.selectorSwiper) return;

				const activeIndex = els.selectorSwiper.activeIndex;
				if(direction === 'left' && !els.selectorSwiper.isEnd) {
					els.selectorSwiper.slideTo(activeIndex + 1, 300);
				} else if(direction === 'right') {
					els.selectorSwiper.slideTo(activeIndex - 1, 300);
				}
			},
			presetFocusLoop: function (e) {
				if (e.key === 'Tab') {
					const activeElement = document.activeElement;
					if (e.shiftKey) {
						if (activeElement === firstFocusableElement) {
							e.preventDefault();
							lastFocusableElement.focus();
						}
					} else {
						if (activeElement === lastFocusableElement) {
							e.preventDefault();
							firstFocusableElement.focus();
						}
					}
				}
			},
			openPresetPopup: function () {
				const isCloseBtnBgLoaded = els.presetClose?.classList.contains('is-img-load-complete');
				if (els.presetClose && !isCloseBtnBgLoaded) {
					bgLoader.setResponsiveMedia(els.presetClose);
				}

				if (!els.viewerPresetWrap.classList.contains('is-active')) {
					els.presetOpen.classList.remove('common-icon__more--off');
					els.presetOpen.classList.add('common-icon__more--on');

					els.viewerPresetWrap.classList.add('is-active');
					els.presetOpen.setAttribute('aria-expanded', true);
					utils.offAccessibility(els.viewerPresetWrap);
					eventHandler.presetOpen();
					els.presetClose.focus();
				} else {
					eventList.closePresetPopup();
				}

				tagging.angle();

				els.presetClose && els.presetClose.addEventListener('click', eventList.handleCloseClick);
			},
			handleCloseClick: function (e) {
				eventList.closePresetPopup(e);
				els.presetOpen.focus();
			},
			closePresetPopup: function (e) {
				if (els.viewerPresetWrap.classList.contains('is-active')) {
					els.presetOpen.classList.remove('common-icon__more--on');
					els.presetOpen.classList.add('common-icon__more--off');

					els.viewerPresetWrap.classList.remove('is-active');
					els.presetOpen.setAttribute('aria-expanded', false);
					utils.onAccessibility(els.viewerPresetWrap);

					tagging.angle();
					eventHandler.presetClose();

					els.presetClose && els.presetClose.removeEventListener('click', eventList.handleCloseClick);
				}
			},
			setFoldClass: function () {
				if (!isLoadEnd) return;
				if (!pdViewer.getStatusToggleState()) {
					this.setFoldInActiveClass();
				} else {
					this.setFoldActiveClass();
				}
			},
			setFoldInActiveClass: function () {
				if (els.foldBtn.classList.contains('common-icon__fold--folded')) els.foldBtn.classList.remove('common-icon__fold--folded');
				els.foldBtn.classList.add('common-icon__fold--unfold');
			},
			setFoldActiveClass: function () {
				if (els.foldBtn.classList.contains('common-icon__fold--unfold')) els.foldBtn.classList.remove('common-icon__fold--unfold');
				els.foldBtn.classList.add('common-icon__fold--folded');
			},
			setAngle: function () {
				if (!isLoadEnd) return;

				let target = this,
					targetAngle = target.getAttribute('data-js-angle');
				pdViewer.setModelDirection(targetAngle);

				accessibility.angleSelected(target);
			},
			checkContentsPointerdown: function (e) {
				if (e.target.classList.contains('js-reset-btn') || e.target.classList.contains('js-fold-btn') || e.target.classList.contains('js-preset-open') || e.target.closest('.js-preset-layer') || e.target.tagName === 'CANVAS') return;
				eventList.closePresetPopup();
			}
		}

		const swiperSpeed = 300;
		const swiperEvents = {
			set: function () {
				if (els.selectorSwiper == null) {
					const initialSlideIdx = Array.from(els.contentItems).findIndex((contentEl) => contentEl.classList.contains('is-active'));
					els.selectorSwiper = new Swiper(els.selectorContainer, {
						init: false,
						initialSlide: initialSlideIdx > -1 ? initialSlideIdx : 0,
						slidesPerView: 'auto',
						centeredSlides: true,
						allowTouchMove: isLoadEnd ? true : false,
						pagination: {
							el: els.indication,
							clickable: true,
							renderBullet: function (index, className) {
								const totalSlides = this.slides.length;
								if (index >= totalSlides) {
									return '';
								}

								const slide = this.slides[index];
								const slideTitle = slide.getAttribute('data-slide-title') || '';
								const slideTagging = slide.getAttribute('data-slide-tagging-feature') || '';
								const tagging = {
									omniType: "microsite_contentinter",
									actionType: "gallery",
									contentType: "feature gallery",
									taggingValue: `${els.featureTagging}:index:${slideTagging}`
								}

								return `
								<li role="listitem" class="swiper-pagination-bullet">
									<button type="button" ${utils.setTagging(tagging)} class="swiper-pagination-bullet-button" aria-label="${LOCAL_VARI.slide}${index + 1}: ${slideTitle}">
										<span class="swiper-pagination-bullet-button-dot"></span>
									</button>
								</li>`;
							}
						},
						a11y: false,
						speed: swiperSpeed,
					});

					els.selectorSwiper.on('init', swiperEvents.init);
					els.selectorSwiper.on('sliderMove', swiperEvents.sliderMove);
					els.selectorSwiper.on('slideChange', swiperEvents.slideChange);
					els.selectorSwiper.on('slideChangeTransitionStart', swiperEvents.slideChangeTransitionStart);
					els.selectorSwiper.on('transitionEnd', swiperEvents.transitionEnd);
					els.selectorSwiper.on('paginationUpdate', swiperEvents.paginationUpdate);
					els.selectorSwiper.on('touchStart', swiperEvents.touchStart);
					els.selectorSwiper.on('touchEnd', swiperEvents.touchEnd);
					els.selectorSwiper.init();
				}
			},
			init: function () {
				if (!isLowNetwork && !isLoadEnd) {
					els.indication.style.pointerEvents = 'none';
					eventList.setClickableSelectorItems(false);
				}

				swiperEvents.checkSlidesPerView();
				eventList.updateSelectorHeight();
				swiperEvents.setIntersectObserver();
			},
			slideChange: function () {
				clearTimeout(slideBounceTimeout);
				els.selectorContainer.classList.remove('slide-bounce-active');
				eventList.stopAllContentVideos();

				const previousIndex = els.selectorSwiper.previousIndex;
				const activeIndex = els.selectorSwiper.activeIndex;
				if(previousIndex === 0 && previousIndex < activeIndex) {
					els.selectorSwiper.wrapperEl.classList.add('is-offset');
				} else {
					els.selectorSwiper.wrapperEl.classList.remove('is-offset');
				}

				eventList.hideExclusiveText();
				eventList.activeSelectorItem(activeIndex);
				eventList.activeContentItem(activeIndex);
				els.selectorSwiper.update();

				if (!isFirstRun) return;

				const isForward = els.selectorSwiper.previousIndex < els.selectorSwiper.activeIndex;
				const isFirstSlide = els.selectorSwiper.isBeginning;
				const isLastSlide = els.selectorSwiper.isEnd;
				const isMiddleSlide = !isFirstSlide && !isLastSlide;

				if (isForward && isMiddleSlide) {
					swiperEvents.setBounceTimer(0);
					swiperEvents.setBounceTimer(3000);
				}

				if (isLastSlide) isFirstRun = false;
			},
			sliderMove: function (swiper, event) {
				if (event.touches && event.touches.length > 1) return;
				eventList.hideViewerBtns();
			},
			touchStart: function () {
				clearTimeout(slideBounceTimeout);
				els.selectorContainer.classList.remove('slide-bounce-active');
			},
			slideChangeTransitionStart: function () {
				swiperEvents.checkSlidesPerView();
			},
			transitionEnd: function () {
				if(els.selectorSwiper.activeIndex === 0) {
					eventList.showViewerBtns();
				} else {
					eventList.hideViewerBtns();
				}
			},
			touchEnd: function () {
				const isViewerLoadEnd = !isLowNetwork && isLoadEnd;
				const isColorTab = els.selectorSwiper.activeIndex === 0;
				const isCallSliderMove = els.selectorSwiper.progress >= 0.02;
				if(!isViewerLoadEnd || !isColorTab || isCallSliderMove) return;

				eventList.showViewerBtns();
			},
			paginationUpdate: function () {
				const pagination = els.selectorSwiper?.pagination;
				if(!pagination) return;

				for(let i = 0; i < pagination.bullets.length; i++) {
					const paginationBtnWrap = pagination.bullets[i];
					const paginationBtn = paginationBtnWrap.querySelector('button');
					const isActivePaginationBtn = paginationBtnWrap.classList.contains('swiper-pagination-bullet-active');
					const selectedText = LOCAL_VARI.selected || ' Selected';
					const ariaText = paginationBtn.getAttribute('aria-label') || '';

					if(!isActivePaginationBtn) {
						paginationBtn.setAttribute('aria-label', ariaText.replace(' ' + selectedText, ''));
					} else {
						paginationBtn.setAttribute('aria-label', `${ariaText} ${selectedText}`);
					}
				}
			},
			setIntersectObserver: function() {
				els.selectorSwiper.intersectObserver = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						if(entry.isIntersecting) {
							if(!els.selectorSwiper) return;

							const activeIndex = els.selectorSwiper.activeIndex;
							!isBouncePlayed && isLoadEnd && activeIndex !== 0 && swiperEvents.setBounceTimer(3000);
						} else {
							clearTimeout(slideBounceTimeout);
						}
					});
				});
				els.selectorSwiper.intersectObserver.observe(els.section);
			},
			setBounceTimer: function (time = 0) {
				clearTimeout(slideBounceTimeout);

				if(time === 0) {
					swiperEvents.playBounceAnimation();
				} else {
					slideBounceTimeout = setTimeout(() => swiperEvents.playBounceAnimation(), time);
				}
			},
			playBounceAnimation: function() {
				els.selectorContainer.classList.remove('slide-bounce-active');
				requestAnimationFrame(() => {
					requestAnimationFrame(() => els.selectorContainer.classList.add('slide-bounce-active'));
				});
				isBouncePlayed = true;
			},
			checkSlidesPerView: function () {
				const currentItemIdx = eventList.getCurrentSelectorIdx();
				const swiperWrapper = els.selectorItems[0].parentElement;
				if(currentItemIdx === 0) {
					swiperWrapper.classList.add('is-colorchip-active');
				} else {
					swiperWrapper.classList.remove('is-colorchip-active');
				}
			},
			matchSnapSlide: function () {
				const slideLength = els.selectorSwiper.slides.length;
				const snapGridLength = els.selectorSwiper.snapGrid.length;
				if(slideLength !== snapGridLength) {
					for(let i = 0; i < snapGridLength - slideLength; i++) {
						els.selectorSwiper.snapGrid.pop();
					}
				}
			},
			destroy: function () {
				if(els.selectorSwiper && els.selectorSwiper.intersectObserver) {
					els.selectorSwiper.intersectObserver.disconnect();
					els.selectorSwiper.intersectObserver = null;
				}

				els.selectorSwiper?.destroy(true);
				els.selectorSwiper = null;

				for(let i = 0; i < els.selectorItems.length; i++) {
					utils.offAccessibility(els.selectorItems[i]);
				}
			}
		};

		const accessibility = {
			activeSelectorItem: function(activeIndex) {
				const isMobile = currDevice.indexOf('mobile') > -1;

				if(!isMobile) {
					accessibility.activeSelectorBtn(activeIndex);
				} else {
					for(let i = 0; i < els.selectorBtns.length; i++) {
						utils.onAccessibility(els.selectorItems[i]);
					}

					const activeItem = els.selectorItems[activeIndex];
					const controller = els.selectorContents[activeIndex].cloneController;

					utils.offAccessibility(activeItem);
					if(controller) controller.setAttribute('tabindex', -1);

					accessibility.activeSelectorBtn(activeIndex);
				}

				for(let i = 0; i < els.selectorItems.length; i++) {
					const isActiveTarget = i === activeIndex;
					const blindTexts = els.selectorItems[i].querySelectorAll('.sr-only');

					blindTexts.forEach((blindText) => {
						if(!isActiveTarget) {
							utils.onAccessibility(blindText);
						} else {
							const isCloneVidControl = blindText.classList.contains('is-clone-vid-control');
							if(!isCloneVidControl) utils.offAccessibility(blindText);
							else blindText.removeAttribute('aria-hidden');
						}
					});
				}

				accessibility.activeContent(activeIndex);
			},
			activeSelectorBtn: function(activeIndex) {
				for(let i = 0; i < els.selectorBtns.length; i++) {
					els.selectorBtns[i].setAttribute('aria-expanded', false);
					els.selectorContents[i].removeAttribute('tabindex');
				}

				const activeBtn = els.selectorBtns[activeIndex];
				activeBtn.setAttribute('aria-expanded', true);

				const activeInnerContent = els.selectorContents[activeIndex];
				activeInnerContent.setAttribute('tabindex', -1);
			},
			activeContent: function(activeIndex) {
				for(let i = 0; i < els.selectorBtns.length; i++) {
					utils.onAccessibility(els.contentItems[i]);
				}

				const activeContent = els.contentItems[activeIndex];
				utils.offAccessibility(activeContent);
			},
			colorchip: function (swiperObj) {
				let isNotActivedColorchips = null;

				for (let i = 0; i < swiperObj.slides.length; i++) {
					if (currDevice.indexOf('mobile') > -1) {
						isNotActivedColorchips = (i != swiperObj.activeIndex) && (i > swiperObj.activeIndex + 4) || (swiperObj.activeIndex > i);
					} else {
						isNotActivedColorchips = (i != swiperObj.activeIndex) && (i > swiperObj.activeIndex + 6) || (swiperObj.activeIndex > i);
					}

					if (isNotActivedColorchips) {
						utils.onAccessibility(swiperObj.slides[i]);

						setTimeout(function () {
							utils.onAccessibility(swiperObj.slides[i]);
						}, 300);
					} else {
						utils.offAccessibility(swiperObj.slides[i]);

						setTimeout(function () {
							utils.offAccessibility(swiperObj.slides[i]);
						}, 300);
					}
				}
			},
			selected: function (target) {
				if (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) {
					target.setAttribute('title', LOCAL_VARI.selected);
				} else {
					target.setAttribute('title', 'Selected');
				}
			},
			colorTabBlindText: function (activeIndex) {
				if(!isLowNetwork) return;

				const activePanelItem = els.panelItems[activeIndex];
				const targetImgEl = activePanelItem.querySelector('img');
				const targetImgAlt = targetImgEl ? targetImgEl.getAttribute('alt') : '';
				const blindTextEl = els.colorSelectorItem.querySelector('.js-selector-alt');

				if(blindTextEl) {
					blindTextEl.innerText = targetImgAlt;
				}
			},
			fold: {
				ariaLabel: function () {
					if (!pdViewer.getStatusToggleState()) {
						els.foldBtn.setAttribute('aria-label', `${els.foldBtn.getAttribute('data-unfolded')}`);
					} else {
						els.foldBtn.setAttribute('aria-label', `${els.foldBtn.getAttribute('data-folded')}`);
					}
				},
				tagging: function () {
					let dataOmni = els.foldBtn.getAttribute('data-omni'),
						gaLa = els.foldBtn.getAttribute('ga-la');

					if (!pdViewer.getStatusToggleState()) {
						if (dataOmni.indexOf('unfolded') === -1) {
							els.foldBtn.setAttribute('data-omni', dataOmni.replace('folded', 'unfolded'));
							els.foldBtn.setAttribute('ga-la', gaLa.replace('folded', 'unfolded'));
						}
					} else {
						els.foldBtn.setAttribute('data-omni', dataOmni.replace('unfolded', 'folded'));
						els.foldBtn.setAttribute('ga-la', gaLa.replace('unfolded', 'folded'));
					}
				},
			},
			angleSelected: function (target) {
				for (let i = 0; i < els.angleCta.length; i++) {
					els.angleCta[i].removeAttribute('title');

					if (els.angleCta[i].classList.contains('is-selected')) {
						els.angleCta[i].classList.remove('is-selected');
					}
				}

				if (!target.classList.contains('is-selected')) {
					target.classList.add('is-selected');
				}

				if (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) {
					target.setAttribute('title', LOCAL_VARI.selected);
				} else {
					target.setAttribute('title', 'Selected');
				}
			},
			handleKeydownInSelector: function (e) {
				if(els.selectorSwiper) return;

				const activeElement = document.activeElement;
				const isInColorsKeydown = activeElement.closest('.js-colors');
				const isFocusedHasPrevTarget = activeElement.prevFocusElement;
				if(!isInColorsKeydown && !isFocusedHasPrevTarget) return;

				const vidControllers = Array.from(els.contentItems).map((contentItemEl) => contentItemEl.controller);
				const focusableLastChildren = Array.from(els.selectorContents).map((contentEl) => {
					let result = null;
					if(contentEl) {
						const items = contentEl.querySelectorAll('button, a, input, select, iframe');
						result = items.length === 0 ? null : items[items.length - 1];
					}
					return result;
				});
				const isFocusedBtn = Array.from(els.selectorBtns).includes(activeElement);
				const isFocusedVidCtrl = vidControllers.includes(activeElement);
				const isFocusedContent = Array.from(els.selectorContents).includes(activeElement);
				const isFocusedLastChild = focusableLastChildren.includes(activeElement);
				if(!isFocusedBtn && !isFocusedVidCtrl && !isFocusedContent && !isFocusedLastChild && !isFocusedHasPrevTarget) return;

				if (e.key === 'Tab') {
					if (e.shiftKey) {
						if(isFocusedBtn) {
							const currentIdx = Array.from(els.selectorBtns).findIndex((selectorBtnEl) => selectorBtnEl === activeElement);
							const prevSelectorItemEl = currentIdx > 0 ? els.selectorItems[currentIdx - 1] : null;
							const isPrevActive = prevSelectorItemEl?.classList.contains('is-active');
							const prevVidCtrlEl = currentIdx > 0 ? vidControllers[currentIdx - 1] : null;

							if(isPrevActive && prevVidCtrlEl) {
								e.preventDefault();
								prevVidCtrlEl.focus();
								return;
							}
						} else if (isFocusedVidCtrl) {
							const currentIdx = vidControllers.findIndex((contentEl) => contentEl === activeElement);
							const contentEl = els.selectorContents[currentIdx];
							const focusableChildren = contentEl?.querySelectorAll('button, a, input, select, iframe');

							if(focusableChildren.length > 0) {
								const prevFocusableLastChild = focusableChildren[focusableChildren.length - 1];
								e.preventDefault();
								prevFocusableLastChild.focus();
								return;
							} else {
								const prevSelectorBtnEl = els.selectorBtns[currentIdx - 1];
								if(prevSelectorBtnEl) {
									e.preventDefault();
									prevSelectorBtnEl.focus();
									return;
								}
							}
						} else if(isFocusedHasPrevTarget) {
							e.preventDefault();
							activeElement.prevFocusElement.focus();
							return;
						}
					} else {
						if(isFocusedBtn) {
							const currentIdx = Array.from(els.selectorBtns).findIndex((selectorBtnEl) => selectorBtnEl === activeElement);
							const isFocusedLastBtn = currentIdx === els.selectorBtns.length - 1;
							if(isFocusedLastBtn) {
								const lastSelectorBtnEl = els.selectorBtns[currentIdx];

								e.preventDefault();
								accessibility.focusNextSectionSiblingEl(lastSelectorBtnEl);
								return;
							}

							const selectorItemEl = els.selectorItems[currentIdx];
							const isActive = selectorItemEl.classList.contains('is-active');
							const selectorContentEl = els.selectorContents[currentIdx];
							const itemFocusableChildren = selectorContentEl.querySelectorAll('button, a, input, select, iframe');
							const nextSelectorItemEl = els.selectorItems[currentIdx + 1];

							if(isActive && itemFocusableChildren.length > 0) {
								e.preventDefault();
								itemFocusableChildren[0].focus();
								return;
							} else if(nextSelectorItemEl) {
								const isNextActive = nextSelectorItemEl.classList.contains('is-active');
								const nextSelectorContentEl = els.selectorContents[currentIdx + 1];
								const itemFocusableChildren = nextSelectorContentEl?.querySelectorAll('button, a, input, select, iframe');
								const nextVidCtrlEl = vidControllers[currentIdx + 1];

								if(isNextActive && itemFocusableChildren.length > 0) {
									e.preventDefault();
									itemFocusableChildren[0]?.focus();
								} else if(isNextActive && nextVidCtrlEl) {
									e.preventDefault();
									nextVidCtrlEl.focus();
									return;
								}
							}
						} else if(isFocusedContent) {
							const currentIdx = Array.from(els.selectorContents).findIndex((contentEl) => contentEl === activeElement);
							const selectorContentEl = els.selectorContents[currentIdx];
							const itemFocusableChildren = selectorContentEl.querySelectorAll('button, a, input, select, iframe');
							if(itemFocusableChildren.length === 0) {
								const contentItemEl = els.contentItems[currentIdx];
								if(contentItemEl && contentItemEl.controller) {
									e.preventDefault();
									contentItemEl.controller.focus();
									return;
								} else {
									e.preventDefault();
									els.selectorBtns[currentIdx + 1]?.focus();
									return;
								}
							} else if(itemFocusableChildren.length === 1) {
								e.preventDefault();
								itemFocusableChildren[0].focus();
								return;
							}
						} else if(isFocusedVidCtrl) {
							const currentIdx = vidControllers.findIndex((contentEl) => contentEl === activeElement);
							const nextSelectorBtnEl = els.selectorBtns[currentIdx + 1];
							const isLastVidCtrl = vidControllers[vidControllers.length - 1] === activeElement;
							if(nextSelectorBtnEl) {
								e.preventDefault();
								nextSelectorBtnEl?.focus();
								return;
							} else if(isLastVidCtrl) {
								e.preventDefault();
								accessibility.focusNextSectionSiblingEl(activeElement);
								return;
							}
						} else if(isFocusedLastChild) {
							const currentIdx = focusableLastChildren.findIndex((childEl) => childEl === activeElement);
							const isFirst = currentIdx === 0;
							if(isFirst) return;

							const controller = vidControllers[currentIdx];

							if(currentIdx === els.selectorBtns.length - 1) {
								setTimeout(() => {
									const nextFocusedElement = document.activeElement;
									nextFocusedElement.prevFocusElement = controller;
								});
								return;
							}

							if(controller) {
								e.preventDefault();
								controller.focus();
								return;
							} else {
								const nextSelectorBtnEl = els.selectorBtns[currentIdx + 1];
								if(nextSelectorBtnEl) {
									e.preventDefault();
									nextSelectorBtnEl.focus();
									return;
								}
							}
						}
					}
				}
			},
			focusNextSectionSiblingEl: function(returnFocusEl) {
				let sibling = els.section.nextElementSibling;
				let focusableEl = null;
				while (sibling) {
					const isNotHideEl = sibling.offsetWidth > 0 && sibling.offsetHeight > 0;
					if (isNotHideEl) {
						focusableEl = sibling.querySelectorAll('button, a, input, select, iframe')[0];

						if (focusableEl) {
							break;
						}
					}
					sibling = sibling.nextElementSibling;
				}

				focusableEl.prevFocusElement = returnFocusEl;
				focusableEl.focus();
			},
			setTabFocusFlow: function () {
				window.addEventListener('keydown', accessibility.handleKeydownInSelector);
			}
		}

		const tagging = {
			play: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					const dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace('pause', 'play'));
				}
				if (targetController.hasAttribute('ga-la')) {
					const gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace('pause', 'play'));
				}
			},
			pause: function (targetController) {
				if (targetController.hasAttribute('data-omni')) {
					const dataOmni = targetController.getAttribute('data-omni').toLowerCase();
					targetController.setAttribute('data-omni', dataOmni.replace(/play(?!.*play)/, 'pause'));
				}
				if (targetController.hasAttribute('ga-la')) {
					const gaLa = targetController.getAttribute('ga-la').toLowerCase();
					targetController.setAttribute('ga-la', gaLa.replace(/play(?!.*play)/, 'pause'));
				}
			},
			angle: function () {
				let dataOmni = els.presetOpen.getAttribute('data-omni'),
					gaLa = els.presetOpen.getAttribute('ga-la');

				if (els.presetOpen.classList.contains('common-icon__more--off')) {
					els.presetOpen.setAttribute('data-omni', dataOmni.replace('close1', 'open'));
					els.presetOpen.setAttribute('ga-la', gaLa.replace('close1', 'open'));
				} else {
					els.presetOpen.setAttribute('data-omni', dataOmni.replace('open', 'close1'));
					els.presetOpen.setAttribute('ga-la', gaLa.replace('open', 'close1'));
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship.features.commonExpandingButton = (function () {
		const resize = window.flagship.common.resize;

		let els = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution(),
			state = {
				bodyWidth: [],
				headlineWidth: []
			},
			timer = null,
			isinit = null;

		const init = function () {
			els.section = document.querySelectorAll('.js-expanding-banner');

			if (!!els.section) {
				setElements();
				bindEvents();
			}
		};

		const setElements = function () {
			els.section.forEach(banner => {
				banner.inner = banner.querySelector('.js-expanding-inner');
				banner.headline = banner.querySelector('.js-expanding-title');
				banner.body = banner.querySelector('.js-expanding-body');
				banner.bodyText = banner.querySelector('.js-expanding-text');
			});
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			eventHandler.load()
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;

				if (currDevice != prevDevice) {
					eventList.resetSize();
					eventList.setSize();

					prevDevice = currDevice;
				}

				if (!!!isinit) return;
				eventList.resizingSize();
			},
			expandedBanner: function () {
				eventList.setSize();

				els.section.forEach((banner, index) => {
					const observerOptions = {
						root: null,
						rootMargin: "0px 0px -20% 0px",
						threshold: 0
					};
					const observer = new IntersectionObserver((entries) => {
						entries.forEach((entry) => {
							let banner = entry.target;

							if (entry.isIntersecting) {
								isinit = true;
								banner.classList.add('is-expanded');

								eventList.openMotion(banner);
							} else {
								const isOutsideTop = entry.boundingClientRect.top > 0;

								if (isOutsideTop) {
									banner.classList.remove('is-expanded');

									eventList.closeMotion(banner, index);
								}
							}
						});
					}, observerOptions);
					observer.observe(banner);
				})
			},
			setSize: function () {
				els.section.forEach((banner, index) => {
					document.fonts.ready.then(() => {
						const borderThickness = 2;
						state.bodyWidth[index] = Math.ceil(banner.bodyText.getBoundingClientRect().width);
						state.headlineWidth[index] = banner.headline.clientWidth + borderThickness;

						if (state.bodyWidth[index] < state.headlineWidth[index]) state.bodyWidth[index] = state.headlineWidth[index];

						gsap.set(banner.bodyText, {
							width: state.bodyWidth[index]
						});

						gsap.set(banner.body, {
							height: 0
						});

						gsap.set(banner.inner, {
							width: state.headlineWidth[index]
						});
					});
				});
			},
			openMotion: function (banner) {
				gsap.to(banner.inner, {
					width: () => banner.clientWidth,
					duration: .5
				});

				gsap.to(banner.body, {
					opacity: 1,
					height: banner.bodyText.clientHeight,
					duration: .5
				});
			},
			closeMotion: function (banner, index) {
				const borderThickness = 2;
				gsap.killTweensOf(banner.inner);
				gsap.killTweensOf(banner.body);

				gsap.to(banner.inner, {
					width: banner.headline.clientWidth + borderThickness,
					duration: .5
				});

				gsap.to(banner.body, {
					opacity: '',
					height: 0,
					duration: .5
				});
			},
			resizingSize: function () {
				els.section.forEach(banner => {
					if (!banner.classList.contains('is-expanded')) return;

					gsap.set(banner.inner, {
						width: () => banner.clientWidth
					});
					gsap.set(banner.body, {
						height: () => banner.bodyText.clientHeight
					});
				});
			},
			resetSize: function () {
				els.section.forEach((banner) => {
					if (banner.classList.contains('is-expanded')) banner.classList.remove('is-expanded');
					gsap.set([banner.body, banner.inner, banner.bodyText], {
						clearProps: 'all'
					});
				});
			}
		};

		const eventHandler = {
			load: function () {
				window.addEventListener('load', eventList.expandedBanner);
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};

	window.flagship.features.comparisonModule = (function () {
		const utils = window.flagship.common.utils,
		resize = window.flagship.common.resize;

		let compareInstances = [];

		const init = function () {
			const compareSections = document.querySelectorAll('.js-compare');

			for (let i = 0; i < compareSections.length; i++) {
				const instance = createInstance(compareSections[i]);
				compareInstances.push(instance);
			}
		};

		const createInstance = function (section) {
			let els = {},
				prevDevice = resize.checkResolution(),
				currDevice = resize.checkResolution(),
				oldValue = null,
				isMousedown = false,
				agent = navigator.userAgent.toLowerCase(),
				maxOs = agent.indexOf('mac os') > -1,
				touchDevice = ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));

			const initInstance = function () {
				els.section = section;

				if (!!els.section) {
					setElements();
					setProperty();
					bindEvents();

					if (els.dropdown) {
						helpers.getDeviceInfo().then(function (deviceId) {
							if (deviceId) {
								eventList.setDeviceDefault(deviceId);
							}

							const selectedValue = helpers.getSelectedValue();

							if (selectedValue) {
								eventList.selectItem(selectedValue);
								eventList.setDefault(selectedValue);

								const selectedItem = helpers.getSelectedItem();
								if (selectedItem && !selectedItem.classList.contains('is-selected')) {
									selectedItem.classList.add('is-selected');
								}
							}
						});
					}
				}
			};

			const setElements = function () {
				els.dropdown = els.section.querySelector('.js-dropdown');
			};

			const setProperty = function () {
				if (els.dropdown) {
					els.dropdown.button = els.dropdown.querySelector('.js-select-button');
					els.dropdown.list = els.dropdown.querySelector('.js-select-list');
				}
			};

			const bindEvents = function () {
				resize.add(eventList.resize);
				eventHandler.click();

				if (els.dropdown) {
					eventHandler.mousedown();
					eventHandler.mouseup();
					eventHandler.resizeWindow();
					eventHandler.keydown();
					eventHandler.listKeydown();
					eventHandler.innerScrollHandler();
				}
			};

			const eventHandler = {
				click: function () {
					els.section.addEventListener('click', eventList.clickSection);
				},
				resizeWindow: function () {
					window.addEventListener('resize', eventList.resizeWindow);
				},
				mousedown: function () {
					els.dropdown.button.addEventListener('mousedown', eventList.mousedown);
				},
				mouseup: function () {
					els.dropdown.button.addEventListener('mouseup', eventList.mouseup);
				},
				keydown: function () {
					els.dropdown.button.addEventListener('keydown', eventList.buttonKeydown);
				},
				listKeydown: function () {
					const dropdownItems = els.dropdown.list.querySelectorAll('.js-select-item');
					for (let i = 0; i < dropdownItems.length; i++) {
						dropdownItems[i].addEventListener('keydown', eventList.listKeydown);
					}
				},
				innerScrollHandler: function () {
					if (!maxOs && !touchDevice) {
						els.dropdown.list.addEventListener('mouseenter', function () {scrollController.destroy(true);}, {capture: true});
						els.dropdown.list.addEventListener('mouseleave', function () {
							scrollController.init({speed: 120, duration: 0.5});
						}, {capture: true});
					}
				},
				onDropdownClickCheck: function () {
					document.addEventListener('click', eventList.checkDropdownClick);
				},
				offDropdownClickCheck: function () {
					document.addEventListener('click', eventList.checkDropdownClick);
				}
			};

			const helpers = {
				getTargetType: function (target) {
					return {
						isButton: target.classList.contains('js-select-button'),
						isOption: target.classList.contains('js-select-item')
					}
				},
				getModelText: function (modelValue) {
					if (!els.dropdown || !els.dropdown.list) return '';

					const items = Array.from(els.dropdown.list.querySelectorAll('.js-select-item'));
					const targetItem = items.find(function (item) {
						return item.getAttribute('data-value') === modelValue;
					})

					return targetItem ? targetItem.innerText : '';
				},
				getSelectedItem: function () {
					if (!els.dropdown || !els.dropdown.list) return null;

					let selectedItem = els.dropdown.list.querySelector('.js-select-item.is-selected');

					if (!selectedItem) {
						selectedItem = els.dropdown.list.querySelector('.js-select-item');
					}

					return selectedItem;
				},
				getSelectedValue: function () {
					const selectedItem = helpers.getSelectedItem();
					return selectedItem ? selectedItem.getAttribute('data-value') : '';
				},
				getDeviceInfo: function () {
					return new Promise(function (resolve, reject) {
						if (navigator.userAgentData) {
							navigator.userAgentData.getHighEntropyValues(['model']).then(function (uaData) {
								const modelCode = uaData.model ? uaData.model.slice(0, 7) : null;
								resolve(modelCode);
							}).catch(function(err) {
								reject(err);
							});
						} else {
							const dropdownItems = els.dropdown ? els.dropdown.list.querySelectorAll('.js-select-item') : [];
							let foundModelCode = null;

							for (let i = 0; i < dropdownItems.length; i++) {
								const modelCode = dropdownItems[i].getAttribute('data-value');
								if (modelCode && navigator.userAgent.includes(modelCode)) {
									foundModelCode = modelCode;
									break;
								}
							}

							resolve(foundModelCode);
						}
					});
				}
			};

			const eventList = {
				loadImage: function () {
					let bgImage = els.section.querySelectorAll('.js-bg-img');
					for (i = 0; i < bgImage.length; i++) {
						if (!bgImage[i].classList.contains('.is-bg-load-complete')) {
							window.imageLoader.setResponsiveMedia(bgImage[i]);
							bgImage[i].classList.add('is-bg-load-complete');
							bgImage[i].classList.remove('js-bg-img');
						}
					}
				},
				clickSection: function (event) {
					if (!els.dropdown) return;
					const targetType = helpers.getTargetType(event.target);
					eventList.loadImage();

					if (targetType.isButton) {
						eventHandler.onDropdownClickCheck();
						eventList.dropdownToggle();
					} else if (targetType.isOption) {
						eventList.selectListItem(event.target);
						eventList.clickCompareModel(event.target);
						eventList.closeDropdown();
					}
				},
				resizeWindow: function () {
					accessibility.changeAriaHidden();
				},
				mousedown: function () {
					isMousedown = true;
					eventList.setButtonPosition(this);
				},
				mouseup: function () { isMousedown = false; },
				setButtonPosition: function (target) {
					if (!target) return;
					
					const navHeight = document.documentElement.classList.contains('browser-zoomed-300') ? 0 : utils.getNavHeight();
					const targetRect = target.getBoundingClientRect();
					const targetHeight = targetRect.height;
					const targetOffsetTop = window.pageYOffset + targetRect.top;
					const isHiddenByNav = targetRect.top < navHeight;
					
					if (isHiddenByNav) {
						const handleScrollEnd = function () {
							eventList.dropdownToggle(); 
							window.removeEventListener('scrollend', handleScrollEnd);
						};

						window.addEventListener('scrollend', handleScrollEnd);

						setTimeout(function () {
							window.scrollTo({
								top: targetOffsetTop - navHeight - targetHeight,
								behavior : 'smooth'
							});
						}, 10)
						
					}
				},
				buttonKeydown: function (e) {
					const isOpen = els.dropdown.button.getAttribute('aria-expanded') === 'true';

					if ((e.key === 'Enter' || e.key === ' ') && !isOpen) {
						e.preventDefault();
						eventList.openDropdown();
					} else if (e.key === 'Escape' && isOpen) {
						eventList.closeDropdown();
					}
				},
				listKeydown: function (e) {
					if (e.key === 'Escape') {
						e.preventDefault();
						eventList.closeDropdown(true);
					} else if (e.key === 'Tab' && !e.shiftKey) {
						const dropdownItems = Array.from(els.dropdown.list.querySelectorAll('.js-select-item'));
						const currentIndex = dropdownItems.indexOf(e.target);
						const lastIndex = dropdownItems.length - 1;

						if (currentIndex === lastIndex) {
							e.preventDefault();
							eventList.closeDropdown(true);
							els.dropdown.button.focus();
						}
					}
				},
				openDropdown: function () {
					els.dropdown.button.setAttribute('aria-expanded', 'true');
					els.dropdown.button.classList.add('is-active');
					setTagging.close(els.dropdown.button);
					accessibility.changeAriaHidden();
				},
				closeDropdown: function (skipFocus) {
					els.dropdown.button.setAttribute('aria-expanded', 'false');
					els.dropdown.button.classList.remove('is-active');

					setTagging.open(els.dropdown.button);
					eventList.mouseup();
					eventHandler.offDropdownClickCheck();

					accessibility.changeAriaHidden();
					if (!skipFocus) {
						accessibility.dropdownFocus();
					}
				},
				dropdownToggle: function () {
					const isExpanded = els.dropdown.button.getAttribute('aria-expanded') === 'true';

					if (isExpanded) {
						eventList.closeDropdown();
					} else {
						eventList.openDropdown();
					}
				},
				checkDropdownClick: function (event) {
					const targetType = helpers.getTargetType(event.target);

					if (!targetType.isButton && !targetType.isOption) {
						eventList.closeDropdown();
					}
				},
				selectListItem: function (target) {
					const dataValue = target.getAttribute('data-value');

					const allItems = els.dropdown.list.querySelectorAll('.js-select-item');
					for (let i = 0; i < allItems.length; i++) {
						allItems[i].classList.remove('is-selected');
					}

					target.classList.add('is-selected');
					els.dropdown.button.textContent = target.textContent;
				},
				setDefault: function (selectedValue) {
					if (!els.dropdown || !els.dropdown.button) return;

					const modelText = helpers.getModelText(selectedValue);
					if (modelText) {
						els.dropdown.button.innerText = modelText;
					}

					const items = els.dropdown.list.querySelectorAll('.js-select-item');
					for (let i = 0; i < items.length; i++) {
						const item = items[i];
						if (item.getAttribute('data-value') === selectedValue) {
							item.classList.add('is-selected');
						} else {
							item.classList.remove('is-selected');
						}
					}

					accessibility.changeAriaHidden();
				},
				setDeviceDefault: function (deviceId) {
					if (!els.dropdown || !els.dropdown.list || !deviceId) return false;

					const dropdownItems = els.dropdown.list.querySelectorAll('.js-select-item');
					for (let i = 0; i < dropdownItems.length; i++) {
						const item = dropdownItems[i];
						const itemValue = item.getAttribute('data-value');

						if (itemValue === deviceId) {
							for (let j = 0; j < dropdownItems.length; j++) {
								dropdownItems[j].classList.remove('is-selected');
							}

							item.classList.add('is-selected');
							return true;
						}
					}

					return false;
				},
				clickCompareModel: function (optionEl) {
					const modelValue = optionEl.getAttribute('data-value') || '';
					eventList.selectItem(modelValue);
				},
				resize: function (currRes) {
					currDevice = currRes;

					if (currDevice != prevDevice) {
						prevDevice = currDevice;
					}

					if (els.dropdown) {
						eventList.closeDropdown();
					}
				},
				selectItem: function (modelValue) {
					const items = els.section.querySelectorAll('.js-compare-content-item');
					if (items.length === 0) return;
					if (oldValue === modelValue) return;

					accessibility.changeSelected(modelValue);

					for (let i = 0; i < items.length; i++) {
						const item = items[i];
						const textAreaList = item.querySelectorAll('.js-text-change');

						if (item.dataset.value === modelValue) {
							item.classList.add('is-active');
							setTimeout(function () {
								for (let j = 0; j < textAreaList.length; j++) {
									textAreaList[j].classList.add('is-active');
								}
							}, 0);
						} else {
							item.classList.remove('is-active');
							for (let j = 0; j < textAreaList.length; j++) {
								textAreaList[j].classList.remove('is-active');
							}
						}
					}

					oldValue = modelValue;
				}
			};

			const accessibility = {
				changeSelected: function () {
					if (!els.dropdown || !els.dropdown.list) return;

					const dropdownItems = els.dropdown.list.querySelectorAll('.js-select-item');
					for (let i = 0; i < dropdownItems.length; i++) {
						dropdownItems[i].removeAttribute('title');
					}

					const selectedItem = helpers.getSelectedItem();
					if (selectedItem) {
						accessibility.setSelectedTitle(selectedItem);
					}
				},
				changeAriaHidden: function () {
					if (!els.dropdown || !els.dropdown.button || !els.dropdown.list) return;

					const isOpened = els.dropdown.button.getAttribute('aria-expanded') === 'true';

					setTimeout(function () {
						utils.offAccessibility(els.dropdown.button);

						if (isOpened) {
							utils.offAccessibility(els.dropdown.list);
						} else {
							utils.onAccessibility(els.dropdown.list);
						}
					});
				},
				dropdownFocus: function () {
					if (!els.dropdown || !els.dropdown.button) return;
					const activeElement = document.activeElement;
					const isInDropdown = els.dropdown.contains(activeElement);

					if (isInDropdown) {
						els.dropdown.button.focus();
					}
				},
				setSelectedTitle: function (target) {
					const selectedText = (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) ? LOCAL_VARI.selected : 'Selected';
					target.setAttribute('title', selectedText);
				}
			};

			const setTagging = {
				open: function (target) {
					if (target.hasAttribute('data-omni')) {
						let dataOmni = target.getAttribute('data-omni').toLowerCase();
						target.setAttribute('data-omni', dataOmni.replace('close', 'open'));
					}
					if (target.hasAttribute('ga-la')) {
						let gaLa = target.getAttribute('ga-la').toLowerCase();
						target.setAttribute('ga-la', gaLa.replace('close', 'open'));
					}
				},
				close: function (target) {
					if (target.hasAttribute('data-omni')) {
						let dataOmni = target.getAttribute('data-omni').toLowerCase();
						target.setAttribute('data-omni', dataOmni.replace('open', 'close'));
					}
					if (target.hasAttribute('ga-la')) {
						let gaLa = target.getAttribute('ga-la').toLowerCase();
						target.setAttribute('ga-la', gaLa.replace('open', 'close'));
					}
				}
			};
			
			initInstance();
			return {
				els: els
			};
		};

		return {
			init: init
		};
	})();
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};

	window.flagship.features.eightGenerations = (function () {
		const utils = window.flagship.common.utils;
		const resize = window.flagship.common.resize;

		const els = {};
		const state = {
			isIntroComplete: false,
			selectedGeneration: 1,
			previewGeneration: null,
			activePointerId: null,
			isDragging: false,
			pointerStartX: 0,
			pressedGeneration: 1,
			pendingReplay: false
		};
		let videoHandler = null;
		let prevDevice = resize.checkResolution();
		let currDevice = resize.checkResolution();
		let restartFrame = null;

		const init = function () {
			els.section = document.querySelector('.features-eight-generations');

			if (!!els.section) {
				setElements();
				bindEvents();
			}
		};

		const isMobile = function (device) {
			return device === 'mobile' || device === 'mobileS';
		};

		const setElements = function () {
			els.videoWrap = els.section.querySelector('.js-video-wrap');
			els.video = els.videoWrap && els.videoWrap.querySelector('.js-eight-generations-video');
			els.videoController = els.videoWrap && els.videoWrap.querySelector('.js-video-control');
			els.videoFigure = els.videoWrap && els.videoWrap.querySelector('.js-eight-generations-video-figure');
			els.controls = els.section.querySelector('.js-eight-generations-controls');
			els.slider = els.section.querySelector('.js-eight-generations-slider');
			els.sliderWrap = els.section.querySelector('.js-eight-generations-slider-wrap');
			els.images = els.section.querySelector('.js-eight-generations-images');
			els.imageItems = Array.from(els.section.querySelectorAll('.js-eight-generations-image'));
		};

		const bindEvents = function () {
			eventList.setIndicators();
			eventHandler.pointer();
			eventHandler.click();
			eventHandler.keydown();
			eventHandler.video();
			eventHandler.controls();
			resize.add(eventList.resize);
			eventList.setInitialState();
		};

		const eventHandler = {
			controls: function () {
				els.controls.addEventListener('animationend', eventList.revealEnd);
				els.controls.addEventListener('animationcancel', eventList.revealEnd);
				els.controls.addEventListener('focusin', eventList.finishReveal);
			},
			video: function () {
				if (!els.video) return;
				els.video.addEventListener('play', video.playCallback);
				els.video.addEventListener('ended', video.endCallback);
				els.video.addEventListener('loadedmetadata', video.ready);
				els.video.addEventListener('canplay', video.replay);
				els.videoController.addEventListener('click', video.clickReplay, true);
			},
			pointer: function () {
				els.slider.addEventListener('pointerdown', eventList.pointerDown);
				els.slider.addEventListener('pointermove', eventList.pointerMove);
				els.slider.addEventListener('pointerup', eventList.pointerUp);
				els.slider.addEventListener('pointercancel', eventList.cancelDrag);
				els.slider.addEventListener('lostpointercapture', eventList.cancelDrag);
			},
			click: function () {
				els.buttons.forEach(function (button) {
					button.addEventListener('click', eventList.clickButton);
				});
			},
			keydown: function () {
				els.buttons.forEach(function (button) {
					button.addEventListener('keydown', eventList.keyDown);
				});
			}
		};

		const eventList = {
			setIndicators: function () {
				const featureTagging = els.images.dataset.taggingFeature;
				const markup = els.imageItems.map(function (img, index) {
					const generation = index + 1;
					const slideTagging = img.dataset.slideTaggingFeature || generation;
					const tagging = {
						omniType: 'microsite_contentinter',
						actionType: 'gallery',
						contentType: 'feature gallery',
						taggingValue: featureTagging + ':index:' + slideTagging
					};

					return '<li role="listitem" class="features-eight-generations__controls-slider--item">' +
						'<button type="button" ' + utils.setTagging(tagging) +
							' class="features-eight-generations__controls-slider--button js-eight-generations-button"' +
							' data-generation="' + generation + '">' +
							'<span class="features-eight-generations__controls-slider--dot" aria-hidden="true"></span>' +
						'</button>' +
					'</li>';
				}).join('');

				els.slider.innerHTML = markup;
				els.buttons = Array.from(els.slider.querySelectorAll('.js-eight-generations-button'));
				els.buttons.forEach(function (button, index) {
					button.setAttribute('aria-controls', els.imageItems[index].id);
				});
			},
			revealControls: function () {
				eventList.finishReveal();
				const hasControlsFocus = els.controls.contains(document.activeElement);

				if (hasControlsFocus) return;

				const controlsHeight = els.sliderWrap.getBoundingClientRect().height;
				els.controls.style.setProperty('--generations-controls-height', `${controlsHeight}px`);
				els.controls.classList.add('is-revealing');
			},
			hideControls: function () {
				const controlsHeight = els.sliderWrap.getBoundingClientRect().height;
				els.controls.style.setProperty('--generations-controls-height', controlsHeight + 'px');
				els.controls.classList.add('is-hiding');
			},
			revealEnd: function (e) {
				if (e.target !== els.controls) return;
				const animationClasses = {
					'generations-controls-reveal': 'is-revealing',
					'generations-controls-hide': 'is-hiding'
				};
				const activeClass = animationClasses[e.animationName];

				if (!activeClass) return;
				if (!els.controls.classList.contains(activeClass)) return;
				eventList.finishReveal();
			},
			finishReveal: function () {
				if (els.controls.classList.contains('is-hiding')) {
					els.controls.hidden = !state.isIntroComplete;
				}
				els.controls.classList.remove('is-revealing');
				els.controls.classList.remove('is-hiding');
				els.controls.style.removeProperty('--generations-controls-height');
			},
			setInitialState: function () {
				image.show(state.selectedGeneration);
				video.init();
				eventList.syncControlsVisibility();
				eventList.updateIndicator();
			},
			resize: function () {
				eventList.finishReveal();
				currDevice = resize.checkResolution();

				if (currDevice === prevDevice) return;

				if (isMobile(currDevice) !== isMobile(prevDevice)) {
					eventList.reset();
				}

				prevDevice = currDevice;
			},
			reset: function () {
				const hasControlsFocus = els.controls.contains(document.activeElement);

				eventList.cancelDrag();
				state.isIntroComplete = false;
				state.selectedGeneration = 1;
				state.pressedGeneration = 1;
				state.pendingReplay = true;

				els.slider.style.removeProperty('--generations-thumb-x');
				els.slider.style.removeProperty('--generations-slider-width');

				video.show(hasControlsFocus);
				eventList.syncControlsVisibility();
				eventList.updateIndicator();
				image.show(state.selectedGeneration);
				video.scheduleRestart();
			},
			syncControlsVisibility: function () {
				const isHiding = els.controls.classList.contains('is-hiding');
				els.controls.hidden = !state.isIntroComplete && !isHiding;
				els.buttons.forEach(function (button) {
					button.disabled = !state.isIntroComplete;
				});
				if (state.isIntroComplete) {
					utils.offAccessibility(els.controls);
				} else {
					utils.onAccessibility(els.controls);
				}
				if (!state.isIntroComplete) eventList.cancelDrag();
			},
			getGeneration: function (value) {
				return Math.max(1, Math.min(els.buttons.length, value));
			},
			getPointerGeneration: function (e) {
				let generation = state.selectedGeneration;
				let nearestDistance = Infinity;
				els.buttons.forEach(function (button, index) {
					const rect = button.getBoundingClientRect();
					const isBeforeButton = e.clientX < rect.left;
					const isAfterButton = e.clientX > rect.right;
					let distance = 0;

					if (isBeforeButton) {
						distance = rect.left - e.clientX;
					} else if (isAfterButton) {
						distance = e.clientX - rect.right;
					}

					if (distance < nearestDistance) {
						nearestDistance = distance;
						generation = index + 1;
					}
				});
				return generation;
			},
			moveThumb: function (e) {
				const rect = els.slider.getBoundingClientRect();
				const first = els.buttons[0].getBoundingClientRect();
				const last = els.buttons[els.buttons.length - 1].getBoundingClientRect();
				const firstCenter = (first.left + first.right) / 2;
				const lastCenter = (last.left + last.right) / 2;
				if (!rect.width) return;
				const minPosition = Math.min(firstCenter, lastCenter);
				const maxPosition = Math.max(firstCenter, lastCenter);
				const boundedPosition = Math.min(maxPosition, e.clientX);
				const position = Math.max(minPosition, boundedPosition);
				const scale = els.slider.offsetWidth / rect.width;
				const offset = (position - rect.left) * scale;
				const thumbPosition = offset - els.slider.clientLeft;

				els.slider.style.setProperty('--generations-thumb-x', `${thumbPosition}px`);
			},
			updateIndicator: function () {
				els.slider.classList.toggle('is-dragging', state.isDragging);
				els.buttons.forEach(function (button, index) {
					const isSelected = index + 1 === state.selectedGeneration;
					button.closest('li').classList.toggle('is-active', isSelected);
				});
				accessibility.buttons(state.selectedGeneration);
			},
			selectGeneration: function (generation, isDrag) {
				if (!state.isIntroComplete) return;
				const nextGeneration = eventList.getGeneration(generation);
				const isSameGeneration = nextGeneration === state.selectedGeneration;

				if (isSameGeneration && !isDrag) return;

				state.selectedGeneration = nextGeneration;
				eventList.updateIndicator();
				image.show(state.selectedGeneration);
			},
			releasePointer: function () {
				const pointerId = state.activePointerId;
				state.activePointerId = null;
				state.previewGeneration = null;
				state.isDragging = false;
				if (pointerId !== null && els.slider.hasPointerCapture(pointerId)) {
					els.slider.releasePointerCapture(pointerId);
				}
			},
			pointerDown: function (e) {
				const isPrimaryButton = e.button === 0;
				const hasActivePointer = state.activePointerId !== null;

				if (!state.isIntroComplete || !isPrimaryButton || hasActivePointer) return;
				eventList.finishReveal();
				e.preventDefault();
				state.activePointerId = e.pointerId;
				state.isDragging = false;
				state.pointerStartX = e.clientX;
				state.previewGeneration = state.selectedGeneration;
				els.slider.style.setProperty('--generations-slider-width', `${els.slider.getBoundingClientRect().width}px`);
				state.pressedGeneration = eventList.getPointerGeneration(e);
				els.slider.setPointerCapture(state.activePointerId);
				els.buttons[state.pressedGeneration - 1].focus({ preventScroll: true });
			},
			pointerMove: function (e) {
				if (e.pointerId !== state.activePointerId) return;
				const moveDistance = Math.abs(e.clientX - state.pointerStartX);
				const isBelowDragThreshold = moveDistance < 6;

				if (!state.isDragging && isBelowDragThreshold) return;
				if (!state.isDragging) {
					state.isDragging = true;
					els.slider.classList.add('is-dragging');
				}
				eventList.moveThumb(e);
				const generation = eventList.getPointerGeneration(e);

				if (generation !== state.previewGeneration) {
					state.previewGeneration = generation;
					image.show(generation);
					accessibility.buttons(generation);
				}
			},
			pointerUp: function (e) {
				if (e.pointerId !== state.activePointerId) return;
				const moveDistance = Math.abs(e.clientX - state.pointerStartX);
				const hasPassedDragThreshold = moveDistance >= 6;
				const hasMoved = state.isDragging || hasPassedDragThreshold;
				let generation = state.pressedGeneration;

				if (hasMoved) {
					generation = eventList.getPointerGeneration(e);
				}

				eventList.releasePointer();
				eventList.selectGeneration(generation, hasMoved);
				els.buttons[generation - 1].focus({ preventScroll: true });
			},
			cancelDrag: function () {
				if (state.activePointerId === null) return;
				eventList.releasePointer();
				eventList.updateIndicator();
				image.show(state.selectedGeneration);
			},
			clickButton: function (e) {
				if (e.detail !== 0) return;
				eventList.selectGeneration(Number(e.currentTarget.dataset.generation), false);
			},
			keyDown: function (e) {
				if (e.key === 'Escape' && state.activePointerId !== null) {
					e.preventDefault();
					eventList.cancelDrag();
				}
			}
		};

		const image = {
			show: function (generation) {
				els.imageItems.forEach(function (img, index) {
					const isSelected = state.isIntroComplete && index + 1 === generation;
					img.classList.toggle('is-active', isSelected);
					accessibility.image(img, isSelected);
				});

				els.videoWrap.classList.toggle('is-image-visible', state.isIntroComplete);
				accessibility.videoController(generation);
			}
		};

		const video = {
			clickReplay: function (e) {
				if (!state.isIntroComplete) return;
				if (!els.videoWrap.classList.contains('is-replay-visible')) return;

				eventList.finishReveal();
				eventList.cancelDrag();
				state.isIntroComplete = false;
				state.pendingReplay = false;
				video.show(false);
				eventList.hideControls();
				eventList.syncControlsVisibility();
				image.show(state.selectedGeneration);
				els.video.currentTime = 0;

				if (e.target !== e.currentTarget) {
					els.video.play().catch(function () {});
				}
			},
			init: function () {
				if (els.video) els.video.loop = false;
				video.setHandler();
				if (els.video && els.video.ended) video.endCallback();
			},
			setHandler: function () {
				const handler = els.video.videoHandler;
				if (!handler || handler === videoHandler) return;
				videoHandler = handler;
				const previousScrollActive = handler.scrollActive;
				const previousReset = handler.eventList.reset;
				handler.scrollActive = function () {
					if (state.isIntroComplete) return;
					return previousScrollActive.apply(this, arguments);
				};
				handler.eventList = Object.assign({}, handler.eventList, {
					reset: function () {
						if (state.isIntroComplete) return;
						return previousReset.apply(this, arguments);
					}
				});
			},
			show: function (moveFocus) {
				els.videoWrap.hidden = false;
				els.videoWrap.classList.remove('is-replay-visible');
				els.videoWrap.classList.remove('is-image-visible');
				els.videoWrap.removeAttribute('aria-hidden');

				if (!els.videoController) return;

				els.videoController.disabled = false;
				els.videoController.removeAttribute('tabindex');
				if (moveFocus) els.videoController.focus({ preventScroll: true });
			},
			scheduleRestart: function () {
				cancelAnimationFrame(restartFrame);
				restartFrame = requestAnimationFrame(video.restart);
			},
			restart: function () {
				restartFrame = null;
				video.setHandler();
				state.pendingReplay = true;
				els.video.pause();
				els.video.currentTime = 0;
				if (videoHandler) videoHandler.eventList.reset.call(videoHandler);
				video.replay();
			},
			replay: function () {
				const isRestartScheduled = restartFrame !== null;
				const isVideoReady = els.video.readyState >= 3;

				if (!state.pendingReplay || state.isIntroComplete) return;
				if (isRestartScheduled || !isVideoReady) return;
				els.video.play().catch(function () {});
			},
			endCallback: function () {
				if (state.isIntroComplete || state.pendingReplay) return;
				state.isIntroComplete = true;
				state.selectedGeneration = els.buttons.length;
				els.video.pause();
				eventList.syncControlsVisibility();
				eventList.updateIndicator();
				image.show(state.selectedGeneration);
				eventList.revealControls();
			},
			playCallback: function () {
				video.setHandler();
				if (state.isIntroComplete) {
					els.video.pause();
				} else {
					state.pendingReplay = false;
				}
			},
			ready: function () {
				video.setHandler();
				video.replay();
			}
		};

		const accessibility = {
			videoBlind: function (generation) {
				const isLastGeneration = generation === els.imageItems.length;

				if (!state.isIntroComplete) {
					els.videoFigure.setAttribute('aria-hidden', false);
				} else if (!isLastGeneration) {
					els.videoFigure.setAttribute('aria-hidden', true);
				}
			},
			videoController: function (generation) {
				const isReplayVisible = state.isIntroComplete && generation === els.imageItems.length;
				const isControllerVisible = !state.isIntroComplete || isReplayVisible;
				const hasVideoFocus = els.videoController.contains(document.activeElement);

				els.videoWrap.classList.toggle('is-replay-visible', isReplayVisible);
				accessibility.videoBlind(generation);
                els.videoController.hidden = !isControllerVisible;
				els.videoController.disabled = !isControllerVisible;

				if (isControllerVisible) {
					els.videoWrap.removeAttribute('aria-hidden');
					utils.offAccessibility(els.videoController);
				} else {
					if (hasVideoFocus) els.buttons[generation - 1].focus({ preventScroll: true });

					els.videoWrap.setAttribute('aria-hidden', true);
					utils.onAccessibility(els.videoController);
				}
			},
			image: function (img, isSelected) {
				if (isSelected) {
					utils.offAccessibility(img);
				} else {
					utils.onAccessibility(img);
				}
			},
			buttons: function (selectedGeneration) {
				const selectedText = (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) ? LOCAL_VARI.selected : 'Selected';
				const slideText = (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) ? LOCAL_VARI.slide : 'Slide';

				els.buttons.forEach(function (button, index) {
					const generation = index + 1;
					const isSelected = generation === selectedGeneration;
					const slideTitle = els.imageItems[index].dataset.slideTitle;
					let slideLabel = slideText + generation;

					if (isSelected) {
						slideLabel += ' ' + selectedText;
					}

					button.setAttribute('aria-label', `${slideLabel}: ${slideTitle}`);
				});
			}
		};

		return {
			init: init
		};
	})();
})();
;
(function () {
	window.flagship.features.faq = (function () {
		const resize = window.flagship.common.resize,
			utils = window.flagship.common.utils,
			Swiper = flagship.Swiper;

		let els = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution(),
			swiperObj = null;

		const init = function () {
			els.section = document.querySelector('.js-faq');

			if (!!els.section) {
				setElements();
				setProperty();
				bindEvents();
			}
		};

		const isMobile = function () {
			return currDevice === 'mobile' || currDevice === 'mobileS';
		};

		const setElements = function () {
			els.faqList = els.section.querySelector('.js-faq-list');
			els.faqListAll = els.section.querySelectorAll('.js-faq-item');
			els.tabButton = els.section.querySelectorAll('.js-category-btn');
			els.newWindowButton = els.section.querySelectorAll('[target="_blank"]');
			els.faqCategory = els.section.querySelector('.js-faq-carousel');
			els.prevArrow = els.faqCategory.querySelector('.js-faq-arrow-prev');
			els.nextArrow = els.faqCategory.querySelector('.js-faq-arrow-next');
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			eventList.setAccordion();
			accessibility.newWindow();
			eventHandler.click();

			if (isMobile()) {
				swiperEvents.set();
			}
		};

		const eventHandler = {
			click: function () {
				els.tabButton.forEach(element => {
					element.addEventListener('click', eventList.tab);
				});
			}
		};

		const setProperty = function () {
			els.tabButton.forEach(function (el, index) {
				el.slideIndex = index;
			});
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;

				if (currDevice != prevDevice) {
					swiperEvents.destroySwiper();
					eventList.responsive();
					prevDevice = currDevice;
				}
			},
			responsive: function () {
				let isOpenedItems = els.faqList.querySelectorAll('.js-faq-item.is-open');

				if (isOpenedItems.length > 0) {
					for (let i = 0; i < isOpenedItems.length; i++) {
						let isOpenedItemContent = isOpenedItems[i].querySelector('.js-faq-answer'),
							clientHeight = isOpenedItemContent.children[0].clientHeight;

						isOpenedItemContent.style.height = `${clientHeight}px`;
					}
				}
			},
			setAccordion: function () {
				els.accordion = new window.flagship.common.accordion({
					wrap: els.faqList,
					classList: {
						item: 'js-faq-item',
						button: 'js-faq-open',
						contents: 'js-faq-answer',
						activeClass: 'is-open'
					},
					open: {
						start: function (target) {
							let targetInnerCta = target.querySelector('.js-featue-cta');
							if (targetInnerCta) targetInnerCta.addEventListener('click', accessibility.moveFocus);
						}
					}
				});

				els.accordion.init();
			},
			closeAccordion: function () {
				const openLists = els.section.querySelectorAll('.is-open');

				openLists.forEach(openList => {
					if ([...openLists].length > 0) {
						els.accordion.closeEvent(openList);
					}
				});
			},
			tab: function (e) {
				const target = e.currentTarget;
				const filter = target.dataset.filter;

				const self = this;
				const swiperSlide = self.closest('.swiper-slide');

				if (swiperObj) {
					if (!swiperSlide.classList.contains('swiper-slide-fully-visible')) {
						swiperObj.slideTo(self.slideIndex);
					}
				}

				if (target.classList.contains('is-active')) return;

				els.faqListAll.forEach(element => {
					if (filter === 'all') {
						element.style.display = '';
						accessibility.tabPanel(element, true);
					} else {
						if (element.dataset.category === filter) {
							element.style.display = '';
							accessibility.tabPanel(element, true);
						} else {
							element.style.display = 'none';
							accessibility.tabPanel(element, false);
						}
					}
				});

				eventList.closeAccordion();

				els.tabButton.forEach(element => {
					element.classList.remove('is-active');
					element.removeAttribute('title');
				});
				target.classList.add('is-active');
				accessibility.selected(target);
			}
		};

		const swiperEvents = {
			set: function () {
				if (swiperObj == null) {
					swiperObj = new Swiper(els.faqCategory, {
						slidesPerView: 'auto',
						watchSlidesProgress: true,
						centeredSlides: false,
						a11y: false,
						roundLengths: true,
						navigation: {
							nextEl: els.nextArrow,
							prevEl: els.prevArrow
						},
						on: {
							init: function (swiper) {
								accessibility.slideTabIndex(swiper);
								swiper.update();
							},
							transitionEnd: function (swiper) {
								accessibility.slideTabIndex(swiper);
								swiper.update();
							},
							reachEnd: function (swiper) {
								accessibility.setNextArrowFocus(swiper);
							},
							reachBeginning: function (swiper) {
								accessibility.setPrevArrowFocus(swiper);
							}
						}
					});
				}
			},
			destroySwiper: function () {
				const mobileStatus = isMobile();

				if (!mobileStatus) {
				 	if (swiperObj) {
						swiperObj.destroy(false, true);
						swiperObj = null;
					}
				} else {
					swiperEvents.set();
				}
			}
		};

		const accessibility = {
			moveFocus: function (e) {
				const hash = accessibility.getHash(this);

				if (!hash || hash === '#') return;

				e.preventDefault();

				accessibility.changeHash(hash);
				accessibility.moveToHashSection(hash);
				accessibility.focusHashSlide(hash);
			},
			getHash: function (target) {
				const href = target.getAttribute('href');

				if (href && href.indexOf('#') === 0) {
					return href;
				}

				return '';
			},
			changeHash: function (hash) {
				const oldUrl = window.location.href;
				const currentHash = window.location.hash;
				const newUrl = window.location.origin + window.location.pathname + window.location.search + hash;

				if (currentHash === hash) {
					accessibility.refreshHash(hash);

					return;
				}

				window.location.replace(hash);
			},
			refreshHash: function(hash) {
				const tempHash = '#faq-hash-refresh';

				window.location.replace(tempHash);
				window.location.replace(hash);
			},
			isPopupHash: function (hash) {
				const popupId = hash.replace('#', '');
				const popupTriggers = document.querySelectorAll('[data-popup-id]');

				if (!popupId || popupTriggers.length ===0) return false;

				for (let i = 0; i < popupTriggers.length; i++) {
					if (popupTriggers[i].getAttribute('data-popup-id') === popupId) {
						return true;
					}
				}

				return false;
			},
			moveToHashSection: function (hash) {
				const section = document.querySelector('#contents ' + hash);

				if (!section) return;

				const sectionTop = section.getBoundingClientRect().top;
				const navHeight = hash === '#highlights' ? 0 : utils.getNavHeight();
				const movePosition = sectionTop + window.pageYOffset - navHeight;

				accessibility.focusTargetIn(section);

				window.scrollTo(0, movePosition);
			},
			focusHashSlide: function (hash) {
				const hashName = hash.replace('#', '');
				const targetSlide = document.querySelector('[data-slide-hash="' + hashName + '"]');

				if (!targetSlide) return;

				const setFocus = function () {
					accessibility.focusTargetIn(targetSlide, targetSlide.firstElementChild);
				};

				setTimeout(setFocus, 300);
			},
			focusTargetIn: function (target, fallbackTarget) {
				const setHeadline = target.querySelector('[data-cta-focus]');
				const title = target.querySelector('h2') || target.querySelector('h3');
				const clickable = target.querySelectorAll('a, button');

				if (!!setHeadline) {
					accessibility.changeFocus(setHeadline);
					return;
				}

				if (!!title) {
					accessibility.changeFocus(title);
					return;
				}

				if (clickable.length > 0) {
					try {
						clickable[0].focus({
							preventScroll: true
						});
					} catch (e) {
						clickable[0].focus();
					}

					return;
				}

				if (!!fallbackTarget) {
					accessibility.changeFocus(fallbackTarget);
				}
			},
			changeFocus: function (target) {
				const focusOut = function () {
					target.removeAttribute('tabindex');
					target.removeEventListener('focusout', focusOut);
				};

				target.addEventListener('focusout', focusOut);
				target.setAttribute('tabindex', -1);

				target.focus();
			},
			tabPanel: function (target, visibleBoolean) {
				if (visibleBoolean) {
					utils.offAccessibility(target);
				} else {
					utils.onAccessibility(target);
				}
			},
			slideTabIndex: function (swiper) {
				swiper.slides.forEach(slide => {
					const tabButton = slide.querySelector('.js-category-btn');
					if (tabButton) utils.onAccessibility(tabButton);
				});
				swiper.visibleSlides.forEach(visibleSlide => {
					if (visibleSlide.classList.contains('swiper-slide-fully-visible') || visibleSlide.classList.contains('swiper-slide-active')) {
						const visibleTabButton = visibleSlide.querySelector('.js-category-btn');
						if (visibleTabButton) utils.offAccessibility(visibleTabButton);
					}
				});
			},
			newWindow: function () {
				const hasLocalvari = typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI,
					localNewWindow = hasLocalvari ? LOCAL_VARI.newWindow : 'Open in a new window';

				els.newWindowButton.forEach(element => {
					element.setAttribute('title', localNewWindow);
				});
			},
			selected: function (target) {
				if (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) {
					target.setAttribute('title', LOCAL_VARI.selected);
				} else {
					target.setAttribute('title', 'Selected');
				}
			},
			setNextArrowFocus: function (swiper) {
				if (document.activeElement === swiper.navigation.nextEl) {
					swiper.navigation.prevEl.focus();
				}
			},
			setPrevArrowFocus: function (swiper) {
				if (document.activeElement === swiper.navigation.prevEl) {
					swiper.navigation.nextEl.focus();
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship.features.floatingCtaDesign = (function () {
		const utils = window.flagship.common.utils,
			resize = window.flagship.common.resize;
		let els = {},
			prevScrollY = null,
			prevInnerHeight = window.innerHeight,
			prevInnerWidth = window.innerWidth,
			showScrollY = null,
			expandScrollY = null,
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution(),
			skipCount = 0,
			showTime = null,
			agent = navigator.userAgent.toLowerCase(),
			maxOs = agent.indexOf('mac os') > -1,
			touchDevice = ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)),
			timer = {
				scroll: null,
				show: null,
				hide: null,
				shrink: null
			},
			state = {
				isExpanded: null,
				isVisible: null,
				isMoved: null,
				isShrinked: null,
				isFocusing: null,
				isClickToClose: null
			};

		const init = function () {
			els.section = document.querySelector('.js-floating-cta-design');
			if (!!els.section) {
				setElements();
				bindEvents();
			}
		};

		const setElements = function () {
			els.lnb = document.querySelector('.pd-g-floating-nav');
			els.gnb = document.querySelector('.nv00-gnb-v4, .nv00-gnb-v5');

			els.floatingCta = document.querySelector('.js-floating-cta');
			els.relativeSection = document.querySelector('.js-floating-cta-design-relative');

			els.highlightsArea = document.querySelector('.highlights-area');
			els.designArea = document.querySelector('.design-area');

			els.wrap = els.section.querySelector('.js-wrap');
			els.toggleButton = els.section.querySelector('.js-toggle-button');
			els.icon = els.section.querySelector('.js-icon');
			els.lendingCta = els.section.querySelector('.js-lending-cta');
			els.container = els.section.querySelector('.js-floating-cta-container');
			els.headlineBox = els.section.querySelector('.js-headline-box');
			els.headline = els.section.querySelector('.js-headline');
			els.cloneHeadline = els.section.querySelector('.js-headline-clone');
			els.textBoxWrap = els.section.querySelector('.js-textbox-wrap');
			els.headlineWrap = els.section.querySelector('.js-headline-wrap');
			els.popupHeadline = els.section.querySelector('.js-popup-headline');
			els.capsuleHeadline = els.section.querySelector('.js-capsule-headline');
		};

		const bindEvents = function () {
			eventHandler.click();
			eventHandler.show();
			eventHandler.handleKeyUpShow();
			eventList.setAccessbility();
			eventList.observeLnb();
			eventList.innerScrollHandler();
			eventList.setShowTime();
			eventList.checkFontOverFlow();
			eventList.returnHide();
			eventHandler.focusin();
			eventHandler.focusout();
			eventHandler.keydown();
			resize.add(eventList.resize);
			eventList.setTitle();
		};

		const eventHandler = {
			documentClick: function () {
				window.addEventListener('click', eventList.documentClick);
			},
			removeDocumentClick: function () {
				window.removeEventListener('click', eventList.documentClick);
			},
			show: function () {
				window.addEventListener('scroll', eventList.show);
			},
			removeShow: function () {
				window.removeEventListener('scroll', eventList.show);
			},
			hide: function () {
				window.addEventListener('scroll', eventList.hide);
			},
			removeHide: function () {
				window.removeEventListener('scroll', eventList.hide);
			},
			shrink: function () {
				window.addEventListener('scroll', eventList.shrink);
			},
			removeShrink: function () {
				window.removeEventListener('scroll', eventList.shrink);
			},
			scrollClose: function () {
				window.addEventListener('scroll', eventList.scrollClose);
			},
			removeScrollClose: function () {
				window.removeEventListener('scroll', eventList.scrollClose);
			},
			click: function () {
				els.toggleButton.addEventListener('click', eventList.toggle);
			},
			removeClick: function () {
				els.toggleButton.removeEventListener('click', eventList.toggle);
			},
			handleKeyUpShow: function () {
				document.addEventListener('keyup', eventList.keyup);
			},
			focusin: function () {
				document.addEventListener('focusin', eventList.focusin);
			},
			removeFocusin: function () {
				document.removeEventListener('focusin', eventList.focusin);
			},
			focusout: function () {
				document.addEventListener('focusout', eventList.focusout);
			},
			removeFocusout: function () {
				document.removeEventListener('focusout', eventList.focusout);
			},
			keydown: function () {
				document.addEventListener('keydown', eventList.keydown);
			},
			containerFocusout: function () {
				els.container.addEventListener('focusout', eventList.containerFocusout);
			},
			removeContainerFocusout: function () {
				els.container.removeEventListener('focusout', eventList.containerFocusout);
			}
		};

		const eventList = {
			setTitle: function () {
				const capsuleHeadlineText = els.capsuleHeadline.innerText;
				const popupHeadlineText = els.popupHeadline.innerText;

				if (capsuleHeadlineText == popupHeadlineText) return;

				els.toggleButton.setAttribute('title', popupHeadlineText);
			},
			returnHide: function () {
				els.section.hide = function () {
					motion.hide();
					action.hide();
				}
			},
			checkFontOverFlow: function () {
				const headlineWrapMaxWidth = parseFloat(getComputedStyle(els.headlineWrap).maxWidth);
				const headlineScrollWidth = parseFloat(els.headline.scrollWidth);

				const boundaryWidth = els.headlineWrap.clientWidth + parseFloat(getComputedStyle(els.toggleButton).paddingRight);

				const isOverFlow = (headlineWrapMaxWidth < headlineScrollWidth) && (boundaryWidth < headlineScrollWidth);
				const isBoundary = (headlineWrapMaxWidth < headlineScrollWidth) && (boundaryWidth > headlineScrollWidth);

				if (els.headline.classList.contains('is-small-font-size')) {
					els.headline.classList.remove('is-small-font-size');
				}

				if (isBoundary) {
					els.headline.classList.add('is-small-font-size');
				} else if (isOverFlow) {
					els.headlineWrap.classList.add('is-animate');
					const headlineWrapScrollWidth = els.headlineWrap.scrollWidth;

					const headlineText = els.headline.querySelector('.common-text');
					const moveX = headlineWrapScrollWidth - headlineWrapMaxWidth;

					headlineText.style.setProperty('--move-x', `${moveX}px`);
				}
			},
			containerFocusout: function (e) {
				if (resize.checkResolution().indexOf('mobile') > -1) return;
				const relatedTarget = e.relatedTarget;
				if (!relatedTarget || !els.container.contains(relatedTarget)) {
					motion.close();
					state.isExpanded = false;
					state.isVisible = false;

					setTagging.open(els.toggleButton);
					eventHandler.show();

					eventList.setAccessbility();
					els.toggleButton.setAttribute('aria-expanded', false);
					eventList.setTitle();

					setTimeout(() => {
						els.section.classList.remove('is-expand');
					}, 300);
				}
			},
			documentClick: function (e) {
				const visibleState = (window.scrollY >= (els.highlightsArea.getBoundingClientRect().bottom + window.scrollY)) && (window.scrollY <= (els.designArea.getBoundingClientRect().bottom + window.scrollY));
				if (!visibleState) return;
				const el = e.target;
				const clickable = el.closest(`a[href], button, input, select, textarea, [role="button"], [role="link"], [onclick], [tabindex]`);
				if (clickable) {
					clearTimeout(timer.scroll);
					timer.scroll = setTimeout(function () {
						if ((prevScrollY == window.scrollY) && (window.scrollY > 0)) {
							if (state.isVisible) return;
							if (document.documentElement.classList.contains('is-layer-open')) return;
							action.show();
							motion.show();
							showScrollY = window.scrollY;
						}
					}, showTime);
				}
			},
			setShowTime: function () {
				const isMobile = resize.checkResolution().indexOf('mobile') > -1;
				if (isMobile) {
					showTime = 1500;
				} else {
					showTime = 1500;
				}
			},
			innerScrollHandler: function () {
				if (!maxOs && !touchDevice) {
					els.container.addEventListener('mouseenter', function () {
						scrollController.destroy(true);
					}, {
						capture: true
					});
					els.container.addEventListener('mouseleave', function () {
						scrollController.init({
							speed: 120,
							duration: 0.5
						});
					}, {
						capture: true
					});
				}
			},
			keydown: function (e) {
				if (e.key === 'Tab') {
					if (e.target === els.toggleButton || e.target === els.lendingCta) return;
					els.activeElement = document.activeElement;
				}
			},
			focusout: function () {
				state.isFocusing = false;
			},
			focusin: function (e) {
				if (e.target.matches(":focus-visible")) {
					state.isFocusing = true;
					if (e.target == els.toggleButton) return;
					if (state.isVisible) {
						const targetRect = e.target.getBoundingClientRect();
						const sectionRect = els.section.getBoundingClientRect()
						const isOverlappingX = targetRect.right > sectionRect.left && targetRect.left < sectionRect.right;
						const isOverlappingY = targetRect.bottom > sectionRect.top && targetRect.top < sectionRect.bottom;

						if (isOverlappingX && isOverlappingY) {
							window.scrollTo(0, window.scrollY - els.section.clientHeight);
						}
					}
				}
			},
			keyup: function (e) {
				if (!state.isVisible) {
					if (e.key === 'Tab') {
						if (e.target === els.toggleButton) {
							if (state.isVisible || state.isMoved) return;
							const moveScrollY = els.relativeSection.getBoundingClientRect().bottom + scrollY;
							showScrollY = window.scrollY;
							motion.show();
							action.show();
							window.scrollTo(0, moveScrollY);
							eventHandler.containerFocusout();
						}
					}
				}
				prevScrollY = window.scrollY;
			},
			resize: function (currRes) {
				currDevice = currRes;
				const isMobile = currDevice.indexOf('mobile') > -1;
				if (currDevice != prevDevice) {
					eventList.responsive();
					if (isMobile) {
						showTime = 1500;
						if (skipCount >= 2) showTime = 400 + 3000;
					} else {
						showTime = 1500;
						if (skipCount >= 2) showTime = 100 + 5000;
					}
					prevDevice = currDevice;
				}
				if (!isMobile && (prevInnerHeight === window.innerHeight) && (prevInnerWidth !== window.innerWidth)) {
					eventList.responsive();
				}
				prevInnerHeight = window.innerHeight;
				prevInnerWidth = window.innerWidth;
			},
			responsive: function () {
				eventList.checkFontOverFlow();
				if (!state.isVisible) return;

				if (state.isExpanded) {
					gsap.to(els.container, {
						width: function () {
							return `${els.wrap.clientWidth}px`
						},
						height: function () {
							return `${els.wrap.clientHeight + 3}px`;
						}
					});
					gsap.to(els.headlineBox, {
						width: () => `${els.wrap.clientWidth}px`
					});
					return;
				}
				motion.init();
				els.section.classList.remove('is-init');
				els.section.classList.remove('is-open');
				els.section.classList.remove('is-expand');
				els.section.classList.add('is-sr-only');
				state.isVisible = false;
				state.isExpanded = false;
				eventHandler.show();
				eventHandler.removeHide();
			},
			observeLnb: function () {
				const callback = function (mutationsList) {
					for (const mutation of mutationsList) {
						if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
							if (els.lnb.classList.contains('is-show') || els.lnb.classList.contains('is-fade-show')) {
								els.section.classList.add('is-nav-show');
							} else if (!els.lnb.classList.contains('is-show') || !els.lnb.classList.contains('is-fade-show')) {
								els.section.classList.remove('is-nav-show');
							}
						}
					}
				};
				const observer = new MutationObserver(callback);
				observer.observe(els.lnb, {
					attributes: true,
					attributeFilter: ['class']
				});
			},
			setAccessbility: function () {
				utils.onAccessibility(els.textBoxWrap);
			},
			show: function () {
				const visibleState = (window.scrollY >= (els.highlightsArea.getBoundingClientRect().bottom + window.scrollY)) && (window.scrollY <= (els.designArea.getBoundingClientRect().bottom + window.scrollY));
				if (visibleState) {
					eventHandler.documentClick();
				} else {
					eventHandler.removeDocumentClick();
					return;
				}
				clearTimeout(timer.scroll);
				timer.scroll = setTimeout(function () {
					if ((prevScrollY == window.scrollY) && (window.scrollY > 0)) {
						if (els.floatingCta.classList.contains('is-init')) return;
						if (state.isVisible) return;
						if (document.documentElement.classList.contains('is-layer-open')) return;
						action.show();
						motion.show();
						showScrollY = window.scrollY;
					}
				}, showTime);

				prevScrollY = window.scrollY;
			},
			expand: function () {
				action.expand();
				motion.expand();
			},
			shrink: function () {
				if (state.isVisible && !state.isMoved && !state.isExpanded) {
					action.shrink();
					motion.shrink();
					eventHandler.removeShrink();
				}
			},
			hide: function () {
				if (!els.gnb) return;

				const moveScroll = Math.abs(showScrollY - window.scrollY);
				const isOverMoveScroll = moveScroll > window.innerHeight / 2;
				const isGnbSection = window.scrollY <= (els.gnb.getBoundingClientRect().bottom + window.scrollY);

				if (isOverMoveScroll && state.isVisible && !state.isMoved && (window.scrollY > 0) || isGnbSection) {
					motion.hide();
					action.hide();
				}
			},
			scrollClose: function () {
				const moveScroll = Math.abs(expandScrollY - window.scrollY);
				const isOverMoveScroll = moveScroll > window.innerHeight / 2;

				if (isOverMoveScroll && state.isVisible && !state.isMoved && state.isExpanded && (window.scrollY > 0)) {
					motion.close();
					state.isExpanded = false;
					state.isVisible = false;

					setTagging.open(els.toggleButton);

					eventHandler.removeShow();
					eventHandler.removeFocusin();
					eventHandler.removeFocusout();
					eventHandler.removeHide();
					eventHandler.removeScrollClose();
					eventHandler.removeContainerFocusout();

					eventList.setAccessbility();
					els.toggleButton.removeAttribute('aria-expanded');
					els.toggleButton.tabIndex = -1;
					eventList.setTitle();

					setTimeout(() => {
						els.section.classList.remove('is-expand');
					}, 300);
					eventHandler.removeScrollClose();
				}
			},
			close: function () {
				motion.close();
				action.close();
			},
			toggle: function () {
				if (state.isExpanded) {
					state.isClickToClose = true;
					eventList.close();
				} else {
					eventList.expand();
				}
			},
		};

		const action = {
			show: function () {
				state.isVisible = true;
				state.isMoved = true;
				els.icon.classList.add('is-bg-load-complete');

				eventHandler.removeShow();
				eventHandler.hide();
				eventHandler.shrink();

				if (state.isFocusing) {
					const targetRect = document.activeElement.getBoundingClientRect();
					const sectionRect = els.section.getBoundingClientRect()
					const isOverlappingX = targetRect.right > sectionRect.left && targetRect.left < sectionRect.right;
					const isOverlappingY = targetRect.bottom > sectionRect.top && targetRect.top < sectionRect.bottom;

					if (isOverlappingX && isOverlappingY) {
						window.scrollTo(0, window.scrollY - els.section.clientHeight);
					}
				}
			},
			hide: function () {
				eventHandler.show();
				eventHandler.removeHide();
				skipCount += 1;
				state.isVisible = false;
				state.isShrinked = false;

				if (skipCount >= 2) {
					const isMobile = currDevice.indexOf('mobile') > -1;
					if (isMobile) {
						showTime = 400 + 3000;
					} else {
						showTime = 100 + 5000;
					}
				}
			},
			close: function () {
				state.isExpanded = false;
				state.isVisible = false;

				setTagging.open(els.toggleButton);

				eventHandler.removeShow();
				eventHandler.removeFocusin();
				eventHandler.removeFocusout();
				eventHandler.removeHide();
				eventHandler.removeScrollClose();
				eventHandler.removeClick();
				eventHandler.removeContainerFocusout();
				accessibility.off();


				setTimeout(() => {
					els.section.classList.remove('is-expand');
				}, 300);

				if (els.activeElement) {
					setTimeout(() => {
						els.activeElement.focus();
					}, 300);
				} else {
					if (!(resize.checkResolution().indexOf('mobile') > -1)) {
						els.relativeSection.tabIndex = -1;
						setTimeout(() => {
							els.relativeSection.focus({
								preventScroll: true
							});
						}, 300);
					}
				}

			},
			expand: function () {
				state.isExpanded = true;
				state.isVisible = true;
				state.isMoved = false;
				expandScrollY = window.scrollY;

				els.section.classList.add('is-expand');
				setTagging.close(els.toggleButton);

				eventHandler.scrollClose();
				eventHandler.removeDocumentClick();
				eventHandler.removeHide();
				accessibility.on();
				els.toggleButton.removeAttribute('title');
			},
			shrink: function () {
				state.isShrinked = true;
			}
		};

		const motion = {
			show: function () {
				CustomEase.create(
					"lateStop",
					"M0,0 C0.06,0.04 0.86,0.995 1,1"
				);
				els.section.classList.add('is-init');
				els.section.classList.remove('is-sr-only');
				gsap.set(els.section, {
					height: () => `${els.toggleButton.clientHeight}px`
				});
				gsap.set(els.container, {
					height: () => `${els.toggleButton.clientHeight}px`
				});
				gsap.to(els.section, {
					display: 'grid',
				});
				gsap.fromTo(els.container, {
					opacity: 0,
				}, {
					opacity: 1,
					duration: .4,
					delay: 0,
					ease: "power1.out",
				});
				gsap.fromTo(els.container, {
					scale: 0.2,
					y: '50',
				}, {
					scale: 1,
					y: '0',
					duration: .65,
					delay: 0,
					ease: "power1.out",
				});
				if (document.documentElement.classList.contains('rtl')) {
					gsap.to(els.container, {
						width: () => `${els.headlineWrap.clientWidth + (parseFloat(getComputedStyle(els.toggleButton).paddingLeft) * 3)}px`,
						duration: 1,
						delay: 0,
						ease: "lateStop",
					});
					gsap.to(els.headlineBox, {
						width: () => `${els.headlineWrap.clientWidth + (parseFloat(getComputedStyle(els.toggleButton).paddingLeft) * 3)}px`,
						duration: 0,
						delay: 0,
					});
				} else {
					gsap.to(els.container, {
						width: () => `${els.headlineWrap.clientWidth + (parseFloat(getComputedStyle(els.toggleButton).paddingRight) * 3)}px`,
						duration: 1,
						delay: 0,
						ease: "lateStop",
					});
					gsap.to(els.headlineBox, {
						width: () => `${els.headlineWrap.clientWidth + (parseFloat(getComputedStyle(els.toggleButton).paddingRight) * 3)}px`,
						duration: 0,
						delay: 0,
					});
				}
				gsap.to(els.headlineBox, {
					opacity: 1,
					delay: .8,
					duration: .2,
				});
				gsap.fromTo(els.textBoxWrap, {
					opacity: 0
				}, {
					opacity: 1,
					delay: .3,
				});

				clearTimeout(timer.show);
				timer.hide = null,
					timer.show = setTimeout(() => {
						timer.hide = null,
							state.isMoved = false;
					}, 800);
			},
			expand: function () {
				if (state.isShrinked) {
					els.section.classList.remove('is-shrink');
					gsap.to(els.toggleButton, {
						opacity: 1,
						duration: .1,
					});
				}
				gsap.to(els.headlineBox, {
					width: els.wrap.clientWidth,
					duration: 0,
				});
				gsap.to(els.container, {
					width: () => `${els.wrap.clientWidth}px`,
					height: () => `${els.wrap.clientHeight + 3}px`,
					duration: .3,
				});
				setTimeout(() => {
					els.section.classList.add('is-open');
					gsap.to(els.section, {
						height: els.toggleButton.clientHeight,
					});
				}, 300);
			},
			hide: function () {
				gsap.to(els.container, {
					opacity: 0,
					duration: .3,
					delay: 0,
				});
				clearTimeout(timer.hide);
				timer.hide = setTimeout(function () {
					motion.init();
					els.section.classList.remove('is-init');
					els.section.classList.add('is-sr-only');
				}, 250);
			},
			close: function () {
				gsap.to(els.container, {
					height: '0',
					duration: .3,
				});
				gsap.to(els.container, {
					outlineWidth: 0,
					duration: .2,
					delay: .2,
				});
				setTimeout(() => {
					motion.init();
					els.section.classList.remove('is-init');
					els.section.classList.add('is-sr-only');
				}, 250);
				els.section.classList.remove('is-open');
			},
			shrink: function () {
				const minHeight = parseFloat(getComputedStyle(els.toggleButton).minHeight);
				let shrinkTimeNum = 0;
				if (!els.lnb.classList.contains('is-show')) {
					shrinkTimeNum = .15;
				}
				gsap.to(els.container, {
					width: () => `${minHeight}px`,
					height: () => `${minHeight}px`,
					duration: .4,
					delay: shrinkTimeNum,
					ease: "power1.out",
				});
				gsap.to(els.toggleButton, {
					opacity: 0,
					duration: .05,
					delay: shrinkTimeNum,
					ease: "power1.out",
					onStart: function () {
						els.section.classList.add('is-shrink');
					},
				});
			},
			init: function () {
				gsap.set([els.container, els.toggleButton, els.headlineBox, els.section, els.textBoxWrap], {
					clearProps: 'all',
					delay: 0,
					duration: 0
				});
				els.section.classList.remove('is-shrink');
			}
		};

		const accessibility = {
			on: function () {
				utils.offAccessibility(els.textBoxWrap);
				els.toggleButton.setAttribute('aria-expanded', 'true');
			},
			off: function () {
				eventList.setAccessbility();
				els.toggleButton.removeAttribute('aria-expanded');
				els.toggleButton.setAttribute('aria-disabled', 'true');
				els.toggleButton.tabIndex = -1;
			}
		};

		const setTagging = {
			open: function (target) {
				if (target.hasAttribute('data-omni')) {
					let dataOmni = target.getAttribute('data-omni').toLowerCase();
					target.setAttribute('data-omni', dataOmni.replace('close', 'open'));
				}
				if (target.hasAttribute('ga-la')) {
					let gaLa = target.getAttribute('ga-la').toLowerCase();
					target.setAttribute('ga-la', gaLa.replace('close', 'open'));
				}
			},
			close: function (target) {
				if (target.hasAttribute('data-omni')) {
					let dataOmni = target.getAttribute('data-omni').toLowerCase();
					target.setAttribute('data-omni', dataOmni.replace('open', 'close'));
				}
				if (target.hasAttribute('ga-la')) {
					let gaLa = target.getAttribute('ga-la').toLowerCase();
					target.setAttribute('ga-la', gaLa.replace('open', 'close'));
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship.features.floatingCta = (function () {
		const utils = window.flagship.common.utils,
			resize = window.flagship.common.resize;
		document.addEventListener("DOMContentLoaded", () => {
			gsap.registerPlugin(CustomEase);
		});
		let els = {},
			prevScrollY = null,
			prevInnerHeight = window.innerHeight,
			prevInnerWidth = window.innerWidth,
			showScrollY = null,
			expandScrollY = null,
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution(),
			skipCount = 0,
			showTime = null,
			agent = navigator.userAgent.toLowerCase(),
			maxOs = agent.indexOf('mac os') > -1,
			touchDevice = ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)),
			timer = {
				scroll: null,
				show: null,
				hide: null,
				shrink: null
			},
			state = {
				isExpanded: null,
				isVisible: null,
				isMoved: null,
				isShrinked: null,
				isFocusing: null,
				isLendingCtaClick: null
			};

		const init = function () {
			els.section = document.querySelector('.js-floating-cta');
			if (!!els.section) {
				setElements();
				bindEvents();
			}
		};

		const setElements = function () {
			els.lnb = document.querySelector('.pd-g-floating-nav');
			els.gnb = document.querySelector('.nv00-gnb-v4, .nv00-gnb-v5');
			els.designFloatingCta = document.querySelector('.js-floating-cta-design');
			els.relativeSection = document.querySelector('.js-floating-cta-relative');

			els.designArea = document.querySelector('.design-area');

			els.wrap = els.section.querySelector('.js-wrap');
			els.toggleButton = els.section.querySelector('.js-toggle-button');
			els.icon = els.section.querySelector('.js-icon');
			els.lendingCta = els.section.querySelector('.js-lending-cta');
			els.container = els.section.querySelector('.js-floating-cta-container');
			els.headlineBox = els.section.querySelector('.js-headline-box');
			els.headline = els.section.querySelector('.js-headline');
			els.cloneHeadline = els.section.querySelector('.js-headline-clone');
			els.textBoxWrap = els.section.querySelector('.js-textbox-wrap');
			els.headlineWrap = els.section.querySelector('.js-headline-wrap');
		};

		const bindEvents = function () {
			eventHandler.click();
			eventHandler.ctaClick();
			eventHandler.show();
			eventHandler.handleKeyUpShow();
			eventList.setAccessbility();
			eventList.observeLnb();
			eventList.innerScrollHandler();
			eventList.setShowTime();
			eventList.checkFontOverFlow();
			eventList.returnHide();
			eventHandler.focusin();
			eventHandler.focusout();
			eventHandler.keydown();
			resize.add(eventList.resize);
		};

		const eventHandler = {
			documentClick: function () {
				window.addEventListener('click', eventList.documentClick);
			},
			removeDocumentClick: function () {
				window.removeEventListener('click', eventList.documentClick);
			},
			show: function () {
				window.addEventListener('scroll', eventList.show);
			},
			removeShow: function () {
				window.removeEventListener('scroll', eventList.show);
			},
			hide: function () {
				window.addEventListener('scroll', eventList.hide);
			},
			removeHide: function () {
				window.removeEventListener('scroll', eventList.hide);
			},
			shrink: function () {
				window.addEventListener('scroll', eventList.shrink);
			},
			removeShrink: function () {
				window.removeEventListener('scroll', eventList.shrink);
			},
			scrollClose: function () {
				window.addEventListener('scroll', eventList.scrollClose);
			},
			removeScrollClose: function () {
				window.removeEventListener('scroll', eventList.scrollClose);
			},
			click: function () {
				els.toggleButton.addEventListener('click', eventList.toggle);
			},
			ctaClick: function () {
				els.lendingCta.addEventListener('click', eventList.ctaClick);
			},
			removeClick: function () {
				els.toggleButton.removeEventListener('click', eventList.toggle);
			},
			handleKeyUpShow: function () {
				document.addEventListener('keyup', eventList.keyup);
			},
			focusin: function () {
				document.addEventListener('focusin', eventList.focusin);
			},
			removeFocusin: function () {
				document.removeEventListener('focusin', eventList.focusin);
			},
			focusout: function () {
				document.addEventListener('focusout', eventList.focusout);
			},
			removeFocusout: function () {
				document.removeEventListener('focusout', eventList.focusout);
			},
			keydown: function () {
				document.addEventListener('keydown', eventList.keydown);
			},
			containerFocusout: function () {
				els.container.addEventListener('focusout', eventList.containerFocusout);
			},
			removeContainerFocusout: function () {
				els.container.removeEventListener('focusout', eventList.containerFocusout);
			}
		};

		const eventList = {
			returnHide: function () {
				els.section.hide = function () {
					motion.hide();
					action.hide();
				}
			},
			checkFontOverFlow: function () {
				const headlineWrapMaxWidth = parseFloat(getComputedStyle(els.headlineWrap).maxWidth);
				const headlineScrollWidth = parseFloat(els.headline.scrollWidth);

				const boundaryWidth = els.headlineWrap.clientWidth + parseFloat(getComputedStyle(els.toggleButton).paddingRight);

				const isOverFlow = (headlineWrapMaxWidth < headlineScrollWidth) && (boundaryWidth < headlineScrollWidth);
				const isBoundary = (headlineWrapMaxWidth < headlineScrollWidth) && (boundaryWidth > headlineScrollWidth);

				if (els.headline.classList.contains('is-small-font-size')) {
					els.headline.classList.remove('is-small-font-size');
				}

				if (isBoundary) {
					els.headline.classList.add('is-small-font-size');
				} else if (isOverFlow) {
					els.headlineWrap.classList.add('is-animate');
					const headlineWrapScrollWidth = els.headlineWrap.scrollWidth;

					const headlineText = els.headline.querySelector('.common-text');
					const moveX = headlineWrapScrollWidth - headlineWrapMaxWidth;

					headlineText.style.setProperty('--move-x', `${moveX}px`);
				}
			},
			containerFocusout: function (e) {
				if (resize.checkResolution().indexOf('mobile') > -1) return;
				const relatedTarget = e.relatedTarget;
				if (!relatedTarget || !els.container.contains(relatedTarget)) {
					motion.close();
					state.isExpanded = false;
					state.isVisible = false;

					setTagging.open(els.toggleButton);
					eventHandler.show();

					eventList.setAccessbility();
					els.toggleButton.setAttribute('aria-expanded', false);

					setTimeout(() => {
						els.section.classList.remove('is-expand');
					}, 300);
				}
			},
			documentClick: function (e) {
				const visibleState = window.scrollY >= (els.designArea.getBoundingClientRect().bottom + window.scrollY);
				if (!visibleState) return;
				const el = e.target;
				const clickable = el.closest(`a[href], button, input, select, textarea, [role="button"], [role="link"], [onclick], [tabindex]`);
				if (clickable) {
					clearTimeout(timer.scroll);
					timer.scroll = setTimeout(function () {
						if ((prevScrollY == window.scrollY) && (window.scrollY > 0)) {
							if (state.isVisible) return;
							if (document.documentElement.classList.contains('is-layer-open')) return;
							action.show();
							motion.show();
							showScrollY = window.scrollY;
						}
					}, showTime);
				}
			},
			setShowTime: function () {
				const isMobile = resize.checkResolution().indexOf('mobile') > -1;
				if (isMobile) {
					showTime = 1500;
				} else {
					showTime = 1500;
				}
			},
			innerScrollHandler: function () {
				if (!maxOs && !touchDevice) {
					els.container.addEventListener('mouseenter', function () {
						scrollController.destroy(true);
					}, {
						capture: true
					});
					els.container.addEventListener('mouseleave', function () {
						scrollController.init({
							speed: 120,
							duration: 0.5
						});
					}, {
						capture: true
					});
				}
			},
			keydown: function (e) {
				if (e.key === 'Tab') {
					if (e.target === els.toggleButton || e.target === els.lendingCta) return;
					els.activeElement = document.activeElement;
				}
			},
			focusout: function () {
				state.isFocusing = false;
			},
			focusin: function (e) {
				if (e.target.matches(":focus-visible")) {
					state.isFocusing = true;
					if (e.target == els.toggleButton) return;
					if (state.isVisible) {
						const targetRect = e.target.getBoundingClientRect();
						const sectionRect = els.section.getBoundingClientRect()
						const isOverlappingX = targetRect.right > sectionRect.left && targetRect.left < sectionRect.right;
						const isOverlappingY = targetRect.bottom > sectionRect.top && targetRect.top < sectionRect.bottom;

						if (isOverlappingX && isOverlappingY) {
							window.scrollTo(0, window.scrollY - els.section.clientHeight);
						}
					}
				}
			},
			keyup: function (e) {
				if (!state.isVisible) {
					if (e.key === 'Tab') {
						if (e.target === els.toggleButton) {
							if (state.isVisible || state.isMoved) return;
							if (els.designFloatingCta.classList.contains('is-init')) {
								els.designFloatingCta.hide();
							}
							const moveScrollY = els.relativeSection.getBoundingClientRect().bottom + scrollY;
							showScrollY = window.scrollY;
							window.scrollTo(0, moveScrollY);
							motion.show();
							action.show();
							eventHandler.containerFocusout();
						}
					}
				}
				prevScrollY = window.scrollY;
			},
			resize: function (currRes) {
				currDevice = currRes;
				const isMobile = currDevice.indexOf('mobile') > -1;
				if (currDevice != prevDevice) {
					eventList.responsive();
					if (isMobile) {
						showTime = 1500;
						if (skipCount >= 2) showTime = 400 + 3000;
					} else {
						showTime = 1500;
						if (skipCount >= 2) showTime = 100 + 5000;
					}
					prevDevice = currDevice;
				}
				if (!isMobile && (prevInnerHeight === window.innerHeight) && (prevInnerWidth !== window.innerWidth)) {
					eventList.responsive();
				}
				prevInnerHeight = window.innerHeight;
				prevInnerWidth = window.innerWidth;
			},
			responsive: function () {
				eventList.checkFontOverFlow();
				if (!state.isVisible) return;

				if (state.isExpanded) {
					gsap.to(els.container, {
						width: function () {
							return `${els.wrap.clientWidth}px`
						},
						height: function () {
							return `${els.wrap.clientHeight + 3}px`;
						}
					});
					gsap.to(els.headlineBox, {
						width: () => `${els.wrap.clientWidth}px`
					});
					return;
				}
				motion.init();
				els.section.classList.remove('is-init');
				els.section.classList.remove('is-open');
				els.section.classList.remove('is-expand');
				els.section.classList.add('is-sr-only');
				state.isVisible = false;
				state.isExpanded = false;
				eventHandler.show();
				eventHandler.removeHide();
			},
			observeLnb: function () {
				const callback = function (mutationsList) {
					for (const mutation of mutationsList) {
						if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
							if (els.lnb.classList.contains('is-show') || els.lnb.classList.contains('is-fade-show')) {
								els.section.classList.add('is-nav-show');
							} else if (!els.lnb.classList.contains('is-show') || !els.lnb.classList.contains('is-fade-show')) {
								els.section.classList.remove('is-nav-show');
							}
						}
					}
				};
				const observer = new MutationObserver(callback);
				observer.observe(els.lnb, {
					attributes: true,
					attributeFilter: ['class']
				});
			},
			setAccessbility: function () {
				utils.onAccessibility(els.textBoxWrap);
			},
			show: function () {
				const visibleState = window.scrollY >= (els.designArea.getBoundingClientRect().bottom + window.scrollY);
				if (visibleState) {
					eventHandler.documentClick();
				} else {
					eventHandler.removeDocumentClick();
					return;
				}
				clearTimeout(timer.scroll);
				timer.scroll = setTimeout(function () {
					if ((prevScrollY == window.scrollY) && (window.scrollY > 0)) {
						if (els.designFloatingCta.classList.contains('is-init')) return;
						if (state.isVisible) return;
						if (document.documentElement.classList.contains('is-layer-open')) return;
						action.show();
						motion.show();
						showScrollY = window.scrollY;
					}
				}, showTime);

				prevScrollY = window.scrollY;
			},
			expand: function () {
				action.expand();
				motion.expand();
			},
			shrink: function () {
				if (state.isVisible && !state.isMoved && !state.isExpanded) {
					action.shrink();
					motion.shrink();
					eventHandler.removeShrink();
				}
			},
			hide: function () {
				if (!els.gnb) return;

				const moveScroll = Math.abs(showScrollY - window.scrollY);
				const isOverMoveScroll = moveScroll > window.innerHeight / 2;

				if (isOverMoveScroll && state.isVisible && !state.isMoved && (window.scrollY > 0)) {
					motion.hide();
					action.hide();
				}
			},
			scrollClose: function () {
				const moveScroll = Math.abs(expandScrollY - window.scrollY);
				const isOverMoveScroll = moveScroll > window.innerHeight / 2;

				if (isOverMoveScroll && state.isVisible && !state.isMoved && state.isExpanded && (window.scrollY > 0)) {
					motion.close();
					state.isExpanded = false;
					state.isVisible = false;

					setTagging.open(els.toggleButton);

					eventHandler.removeShow();
					eventHandler.removeFocusin();
					eventHandler.removeFocusout();
					eventHandler.removeHide();
					eventHandler.removeScrollClose();
					eventHandler.removeContainerFocusout();

					eventList.setAccessbility();
					els.toggleButton.removeAttribute('aria-expanded');
					els.toggleButton.tabIndex = -1;

					setTimeout(() => {
						els.section.classList.remove('is-expand');
					}, 300);
					eventHandler.removeScrollClose();
				}
			},
			close: function () {
				motion.close();
				action.close();
			},
			ctaClick: function (e) {
				eventHandler.removeScrollClose();

				const hash = this.getAttribute('href');
				const section = document.querySelector('#contents ' + hash);
				const sectionHeadline = section.querySelector('h2') || section.querySelector('h3');

				const focusOut = function () {
					sectionHeadline.removeAttribute('tabindex');
					sectionHeadline.removeEventListener('focusout', focusOut);
				};

				sectionHeadline.addEventListener('focusout', focusOut);
				sectionHeadline.setAttribute('tabindex', -1);
				state.isLendingCtaClick = true;

				motion.close();
				action.close();

				setTimeout(() => {
					sectionHeadline.focus();
				}, 0);
			},
			toggle: function () {
				if (state.isExpanded) {
					eventList.close();
				} else {
					eventList.expand();
				}
			},
		};

		const action = {
			show: function () {
				state.isVisible = true;
				state.isMoved = true;
				els.icon.classList.add('is-bg-load-complete');

				eventHandler.removeShow();
				eventHandler.hide();
				eventHandler.shrink();

				if (state.isFocusing) {
					const targetRect = document.activeElement.getBoundingClientRect();
					const sectionRect = els.section.getBoundingClientRect()
					const isOverlappingX = targetRect.right > sectionRect.left && targetRect.left < sectionRect.right;
					const isOverlappingY = targetRect.bottom > sectionRect.top && targetRect.top < sectionRect.bottom;

					if (isOverlappingX && isOverlappingY) {
						window.scrollTo(0, window.scrollY - els.section.clientHeight);
					}
				}
			},
			hide: function () {
				eventHandler.show();
				eventHandler.removeHide();
				skipCount += 1;
				state.isVisible = false;
				state.isShrinked = false;

				if (skipCount >= 2) {
					const isMobile = currDevice.indexOf('mobile') > -1;
					if (isMobile) {
						showTime = 400 + 3000;
					} else {
						showTime = 100 + 5000;
					}
				}
			},
			close: function () {
				state.isExpanded = false;
				state.isVisible = false;

				setTagging.open(els.toggleButton);

				eventHandler.removeShow();
				eventHandler.removeFocusin();
				eventHandler.removeFocusout();
				eventHandler.removeHide();
				eventHandler.removeScrollClose();
				eventHandler.removeClick();
				eventHandler.removeContainerFocusout();
				accessibility.off();


				setTimeout(() => {
					els.section.classList.remove('is-expand');
				}, 300);

				if (state.isLendingCtaClick) return;

				if (els.activeElement) {
					setTimeout(() => {
						els.activeElement.focus();
					}, 300);
				} else {
					if (!(resize.checkResolution().indexOf('mobile') > -1)) {
						els.relativeSection.tabIndex = -1;
						setTimeout(() => {
							els.relativeSection.focus({
								preventScroll: true
							});
						}, 300);
					}
				}

			},
			expand: function () {
				state.isExpanded = true;
				state.isVisible = true;
				state.isMoved = false;
				expandScrollY = window.scrollY;

				if (els.lendingCta && !els.lendingCta.classList.contains('.is-bg-load-complete')) {
					els.lendingCta.classList.add('is-bg-load-complete');
				}
				els.section.classList.add('is-expand');
				setTagging.close(els.toggleButton);

				eventHandler.scrollClose();
				eventHandler.removeDocumentClick();
				eventHandler.removeHide();
				accessibility.on();
			},
			shrink: function () {
				state.isShrinked = true;
			}
		};

		const motion = {
			show: function () {
				CustomEase.create(
					"lateStop",
					"M0,0 C0.06,0.04 0.86,0.995 1,1"
				);
				els.section.classList.add('is-init');
				els.section.classList.remove('is-sr-only');
				gsap.set(els.section, {
					height: () => `${els.toggleButton.clientHeight}px`
				});
				gsap.set(els.container, {
					height: () => `${els.toggleButton.clientHeight}px`
				});
				gsap.to(els.section, {
					display: 'grid',
				});
				gsap.fromTo(els.container, {
					opacity: 0,
				}, {
					opacity: 1,
					duration: .4,
					delay: 0,
					ease: "power1.out",
				});
				gsap.fromTo(els.container, {
					scale: 0.2,
					y: '50',
				}, {
					scale: 1,
					y: '0',
					duration: .65,
					delay: 0,
					ease: "power1.out",
				});
				if (document.documentElement.classList.contains('rtl')) {
					gsap.to(els.container, {
						width: () => `${els.headlineWrap.clientWidth + (parseFloat(getComputedStyle(els.toggleButton).paddingLeft) * 3)}px`,
						duration: 1,
						delay: 0,
						ease: "lateStop",
					});
					gsap.to(els.headlineBox, {
						width: () => `${els.headlineWrap.clientWidth + (parseFloat(getComputedStyle(els.toggleButton).paddingLeft) * 3)}px`,
						duration: 0,
						delay: 0,
					});
				} else {
					gsap.to(els.container, {
						width: () => `${els.headlineWrap.clientWidth + (parseFloat(getComputedStyle(els.toggleButton).paddingRight) * 3)}px`,
						duration: 1,
						delay: 0,
						ease: "lateStop",
					});
					gsap.to(els.headlineBox, {
						width: () => `${els.headlineWrap.clientWidth + (parseFloat(getComputedStyle(els.toggleButton).paddingRight) * 3)}px`,
						duration: 0,
						delay: 0,
					});
				}
				gsap.to(els.headlineBox, {
					opacity: 1,
					delay: .8,
					duration: .2,
				});
				gsap.fromTo(els.textBoxWrap, {
					opacity: 0
				}, {
					opacity: 1,
					delay: .3,
				});

				clearTimeout(timer.show);
				timer.hide = null,
					timer.show = setTimeout(() => {
						timer.hide = null,
							state.isMoved = false;
					}, 800);
			},
			expand: function () {
				if (state.isShrinked) {
					els.section.classList.remove('is-shrink');
					gsap.to(els.toggleButton, {
						opacity: 1,
						duration: .1,
					});
				}
				gsap.to(els.headlineBox, {
					width: els.wrap.clientWidth,
					duration: 0,
				});
				gsap.to(els.container, {
					width: () => `${els.wrap.clientWidth}px`,
					height: () => `${els.wrap.clientHeight + 3}px`,
					duration: .3,
				});
				setTimeout(() => {
					els.section.classList.add('is-open');
					gsap.to(els.section, {
						height: els.toggleButton.clientHeight,
					});
				}, 300);
			},
			hide: function () {
				gsap.to(els.container, {
					opacity: 0,
					duration: .3,
					delay: 0,
				});
				clearTimeout(timer.hide);
				timer.hide = setTimeout(function () {
					motion.init();
					els.section.classList.remove('is-init');
					els.section.classList.add('is-sr-only');
				}, 250);
			},
			close: function () {
				gsap.to(els.container, {
					height: '0',
					duration: .3,
				});
				gsap.to(els.container, {
					outlineWidth: 0,
					duration: .2,
					delay: .2,
				});
				setTimeout(() => {
					motion.init();
					els.section.classList.remove('is-init');
					els.section.classList.add('is-sr-only');
				}, 250);
				els.section.classList.remove('is-open');
			},
			shrink: function () {
				const minHeight = parseFloat(getComputedStyle(els.toggleButton).minHeight);
				let shrinkTimeNum = 0;
				if (!els.lnb.classList.contains('is-show')) {
					shrinkTimeNum = .15;
				}
				gsap.to(els.container, {
					width: () => `${minHeight}px`,
					height: () => `${minHeight}px`,
					duration: .4,
					delay: shrinkTimeNum,
					ease: "power1.out",
				});
				gsap.to(els.toggleButton, {
					opacity: 0,
					duration: .05,
					delay: shrinkTimeNum,
					ease: "power1.out",
					onStart: function () {
						els.section.classList.add('is-shrink');
					},
				});
			},
			init: function () {
				gsap.set([els.container, els.toggleButton, els.headlineBox, els.section, els.textBoxWrap], {
					clearProps: 'all',
					delay: 0,
					duration: 0
				});
				els.section.classList.remove('is-shrink');
			}
		};

		const accessibility = {
			on: function () {
				utils.offAccessibility(els.textBoxWrap);
				els.toggleButton.setAttribute('aria-expanded', 'true');
			},
			off: function () {
				eventList.setAccessbility();
				els.toggleButton.removeAttribute('aria-expanded');
				els.toggleButton.setAttribute('aria-disabled', 'true');
				els.toggleButton.tabIndex = -1;
			}
		};

		const setTagging = {
			open: function (target) {
				if (target.hasAttribute('data-omni')) {
					let dataOmni = target.getAttribute('data-omni').toLowerCase();
					target.setAttribute('data-omni', dataOmni.replace('close', 'open'));
				}
				if (target.hasAttribute('ga-la')) {
					let gaLa = target.getAttribute('ga-la').toLowerCase();
					target.setAttribute('ga-la', gaLa.replace('close', 'open'));
				}
			},
			close: function (target) {
				if (target.hasAttribute('data-omni')) {
					let dataOmni = target.getAttribute('data-omni').toLowerCase();
					target.setAttribute('data-omni', dataOmni.replace('open', 'close'));
				}
				if (target.hasAttribute('ga-la')) {
					let gaLa = target.getAttribute('ga-la').toLowerCase();
					target.setAttribute('ga-la', gaLa.replace('open', 'close'));
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship.features.carouselExtensions = window.flagship.features.carouselExtensions || [];

	window.flagship.features.galaxyEcosystem = (function () {
		const resize = window.flagship.common.resize;

		let els = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution();

		const init = function () {
			els.section = document.querySelector('.js-galaxy-ecosystem')
			els.carousel = document.querySelector('.js-galaxy-ecosystem-carousel');

			if (!!els.section) {
				setElements();
				bindEvents();
			}
		};

		const setElements = function () {
			els.cta = els.section.querySelector('.js-ecosystem-cta')
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			eventList.setCtaColor();
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;
				if (currDevice != prevDevice) {
					eventList.setCtaColor();
					prevDevice = currDevice;
				}
			},
			setCtaColor: function () {
				if (!els.cta) return;

				const isMobile = currDevice.indexOf('mobile') > -1;
				const isWhite = els.cta.classList.contains('common-cta-underline--white');
				const isBlack = els.cta.classList.contains('common-cta-underline--black');

				if (isMobile && isWhite) {
					els.cta.classList.replace('common-cta-underline--white', 'common-cta-underline--black');
				} else if (isBlack) {
					els.cta.classList.replace('common-cta-underline--black', 'common-cta-underline--white');
				}
			}
		};

		const getCarouselOptions = function (carousel) {
			if (!carousel.classList.contains('js-galaxy-ecosystem-carousel')) {
				return {};
			}

			return {
				swiper: {
					mobileOnly: true
				},
				media: {
					preloadAhead: 1
				}
			};
		};

		return {
			getCarouselOptions: getCarouselOptions,
			init: init
		};
	})();

	if (window.flagship.features.carouselExtensions.indexOf(window.flagship.features.galaxyEcosystem) === -1) {
		window.flagship.features.carouselExtensions.push(window.flagship.features.galaxyEcosystem);
	}
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};
	window.flagship.features.carouselExtensions = window.flagship.features.carouselExtensions || [];

	window.flagship.features.highlights = (function () {
		const utils = flagship.common.utils;

		let els = {};

		const init = function () {
			els.highlights = document.querySelector('.features-highlights');

			if (els.highlights) {
				setElements();
				bindEvents();
			}
		};

		const setElements = function () {
			els.slides = els.highlights.querySelectorAll('.swiper-slide');
			els.headlines = els.highlights.querySelectorAll('.js-headline');
			els.pagiNation = els.highlights.querySelector('.swiper-pagination');
		};


		const bindEvents = function () {
			eventList.applyMatchHeight();
		};

		const eventList = {
			applyMatchHeight: function () {
				const hasHeadlines = els.headlines && els.headlines.length > 0;
				const isUtilsReady = utils && typeof utils.matchHeight === 'function';

				if (hasHeadlines && isUtilsReady) {
					utils.matchHeight(els.headlines);
				}
			}
		};

		const getCarouselOptions = function (carousel) {
			if (!carousel.classList.contains('js-highlights-carousel')) {
				return {};
			}

			return {
				swiper: {
					speed: 600
				},
				pagination: {
					progressbar: true
				},
				media: {
					preloadAhead: 1
				},
				video: {
					delayPlay: true
				},
				autoslide: {
					enabled: true
				},
				useBridgeSlide: true,
				plugins: [
					window.flagship.features.carouselPlugins.dimmed
				]
			};
		};


		return {
			getCarouselOptions: getCarouselOptions,
			init: init
		};
	})();

	if (window.flagship.features.carouselExtensions.indexOf(window.flagship.features.highlights) === -1) {
		window.flagship.features.carouselExtensions.push(window.flagship.features.highlights);
	}
})();
(function () {
	window.flagship.features.carouselExtensions = window.flagship.features.carouselExtensions || [];

	window.flagship.features.mediaQuoteCarousel = (function () {
		const resize = window.flagship.common.resize;
		let els = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution();

		const init = function () {
			els.carousel = document.querySelector('.js-media-quote-carousel');

			if (!els.carousel) return;

			setElements();
			bindEvents();
		};
		const setElements = function () {
			els.logos = els.carousel.querySelectorAll('.js-award-logo');
			els.metadatas = els.carousel.querySelectorAll('.features-media-quote__carousel-metadata');
		};

		const bindEvents = function () {
			if (!els.logos.length) return;

			resize.add(eventList.resize);
			eventList.setLogoMargin();
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;
				if (currDevice != prevDevice) {
					prevDevice = currDevice;
					eventList.setLogoMargin();
				}
			},
			setLogoMargin: function () {
				let maxHeight = 0;

				els.metadatas.forEach(function (metadata) {
					const marginTop = parseFloat(window.getComputedStyle(metadata).marginTop) || 0;
					maxHeight = Math.max(maxHeight, metadata.offsetHeight + marginTop);
				});

				els.carousel.querySelectorAll('.js-award-logo').forEach(function (logoEl) {
					logoEl.style.setProperty('--metadata-height', maxHeight + 'px');
				});
			}
		};

		const getCarouselOptions = function (carousel) {

			if (!carousel.classList.contains('js-media-quote-carousel')) {
				return {};
			}
			return {
				swiper: {
					loop: true
				},
				pagination: {
					progressbar: true
				},
				autoslide: {
					enabled: true,
					indicatorButton: true,
					imageDelay: 3000,
					moImageDelay: 2000
				},
				imageProgress: {
					start: 5,
					moStart: 3
				},
			};
		};

		return {
			getCarouselOptions: getCarouselOptions,
			init: init
		};
	})();

	if (window.flagship.features.carouselExtensions.indexOf(window.flagship.features.mediaQuoteCarousel) === -1) {
		window.flagship.features.carouselExtensions.push(window.flagship.features.mediaQuoteCarousel);
	}
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};
	window.flagship.features.carouselExtensions = window.flagship.features.carouselExtensions || [];

	window.flagship.features.performanceCarousel = (function () {
		const getCarouselOptions = function (carousel) {

			if (!carousel.classList.contains('js-performance-carousel')) {
				return {};
			}

			return {
				swiper: {
					mobileOnly: true
				},

			};
		};

		return {
			getCarouselOptions: getCarouselOptions
		};
	})();

	if (window.flagship.features.carouselExtensions.indexOf(window.flagship.features.performanceCarousel) === -1) {
		window.flagship.features.carouselExtensions.push(window.flagship.features.performanceCarousel);
	}
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};

	window.flagship.features.privacy = (function () {
		const resize = window.flagship.common.resize;

		let els = {},
			obj = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution();


		const init = function () {
			els.section = document.querySelector('.features-privacy');

			if (!!els.section) {
				setElements();
				bindEvents();
			}
		};

		const setElements = function () {
			els.privacyWrap = els.section.querySelector('.js-privacy-wrap');
			els.privacyTexts = els.section.querySelectorAll('.js-privacy-title');
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			if (currDevice.indexOf('mobile') > -1) {
				eventList.setAccordion();
				eventList.setText();
			}
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;
				if (currDevice != prevDevice) {
					eventList.setText();
					eventList.checkAccordionInit();
					prevDevice = currDevice;
				}
			},
			checkAccordionInit: function () {
				if (currDevice.indexOf('mobile') > -1) {
					const items = els.privacyWrap.querySelectorAll('.js-privacy-item');
					items[0].classList.add('is-open');
					eventList.setAccordion();
				} else {
					eventList.destroyAccordion();
				}
			},
			setAccordion: function () {
				if (!obj.accordion) {
					obj.accordion = new window.flagship.common.accordion({
						wrap: els.privacyWrap,
						classList: {
							item: 'js-privacy-item',
							button: 'js-privacy-open',
							contents: 'js-privacy-content',
							activeClass: 'is-open'
						},
						openType: 'toggle',
						transition: {
							duration: '0.35s',
							timingFnc: 'ease',
							delay: '',
						},
					});

					obj.accordion.init();
				}
			},
			setText: function () {
				els.privacyTexts.forEach(text => {
					const headTitle = text.querySelector('.common-text');
					const buttonTitle = text.nextElementSibling.querySelector('.common-text');

					text.emptyText = '';

					if (!text.originText) {
						text.originText = headTitle.innerText;
					}

					if (currDevice.indexOf('mobile') > -1) {
						headTitle.innerText = text.emptyText;
						buttonTitle.innerText = text.originText;
					} else {
						headTitle.innerText = text.originText;
						buttonTitle.innerText = text.emptyText;
					}
				});
			},
			destroyAccordion: function () {
				if (obj.accordion) {
					obj.accordion.destroy();
					obj.accordion = null;
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};

	window.flagship.features.reviews = (function () {
		const utils = window.flagship.common.utils,
			resize = window.flagship.common.resize;

		let els = {},
			prevDevice = null,
			currDevice = resize.checkResolution(),
			reviewMoreTimeout = null;

		const init = function () {
			els.sectionArea = document.querySelector('.reviews-area');
			els.section = document.querySelector('.features-reviews');

			if (els.section !== null) {
				setElements();
				bindEvents();
			} else {
				eventList.hideReviews();
				eventList.hideSeeReviewWrap();
				eventList.removeTitle();
			}
		};

		const setElements = function () {
			els.compReview = document.querySelector('.pdd44-review');
			els.compReviewHeader = els.compReview?.querySelector('.pdd44-review__header');
			els.compReviewStars = els.compReview?.querySelector('.rating__star-list');
			els.compReviewAvgRating = els.compReview?.querySelector('.pdd44-review__overall-star-num');
			els.compReviewNumReviews = els.compReview?.querySelector('.pdd44-review__overall-star-text');
			els.bvReviewsMoreBtn = els.compReview?.querySelector('#BV-viewMore');

			els.kvSection = document.querySelector('.features-kv');
			els.kvOfferWrap = els.kvSection.querySelector('.js-kv-offer-wrap');
			els.seeReviewsWrap = els.kvSection.querySelector('.js-see-reviews-wrap');

			if(els.seeReviewsWrap) {
				els.seeReviewsAnchor = els.seeReviewsWrap.querySelector('.js-see-reviews');
				els.kvReviewWrap = els.seeReviewsWrap.querySelector('.js-kv-review-wrap');
				els.kvReviewAnchor = els.kvReviewWrap.querySelector('.js-kv-review-cta');
				els.kvReviewInner = els.kvReviewAnchor.querySelector('.js-kv-review-cta-inner');
				els.kvReviewStar = els.kvReviewInner.querySelector('.js-kv-review-star');
				els.kvReviewAvg = els.kvReviewInner.querySelector('.js-kv-review-avg');
			}

			els.innerWrap = els.section.querySelector('.common-inner');
			els.reviewsArea = els.section.querySelector('.js-reviews-area');
			els.reviewsOpener = els.section.querySelector('.js-reviews-open');
			els.reviewsTitle = els.section.querySelector('.js-reviews-title');
			els.reviewsContent = els.section.querySelector('.js-reviews-content');
			els.reviewsInner = els.section.querySelector('.features-reviews__content-inner');
		}

		const bindEvents = function () {
			resize.add(eventList.resize);

			eventHandler.load();
		};

		const eventHandler = {
			load: function () {
				window.addEventListener('load', function () {
					try {
						eventList.setReviews();
					} catch(err) {
						eventList.hideReviews();
						eventList.hideSeeReviewWrap();
						eventList.removeTitle();
					}
					if (window.sg && window.sg.common && window.sg.common.utils && window.sg.common.utils.getStickyNavHeightPromise) {
						window.sg.common.utils.getStickyNavHeightPromise(true).then(() => {
							setTimeout(() => eventList.scrollAnchor(), 630);
						});
					} else {
						setTimeout(() => eventList.scrollAnchor(), 630);
					}
				});
			}
		}

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;

				if (currDevice != prevDevice) {
					eventList.responsive();
					prevDevice = currDevice;
				}
			},
			responsive: function () {
				let isOpenedItem = els.reviewsArea.querySelector('.js-reviews-info.is-open');

				if (isOpenedItem) {
					let isOpenedItemContent = isOpenedItem.querySelector('.js-reviews-content'),
						clientHeight = isOpenedItemContent.children[0].clientHeight;

					isOpenedItemContent.style.height = `${clientHeight}px`;
				}
			},
			// Modified version that allows static access to the floating navigation height from the utils function
			getNavHeight: function () {
				let navHeight = 0;
				let navigation = document.querySelector('.pd-g-header-navigation') || document.querySelector('#subnav') || document.querySelector('.sticky-menu') || document.querySelector('.floating-navigation');
				if (!!navigation) {
					if (navigation.classList.contains('pd-g-header-navigation')) {
						const headerNav = navigation.querySelector('.pd-header-navigation');
						const menuWrap = headerNav.querySelector('.pd-header-navigation__menu-wrap');
						navHeight = headerNav.clientHeight + menuWrap.clientHeight;
					} else {
						navHeight = navigation.clientHeight;
					}
				}
				return navHeight;
			},
			setReviews: function() {
				if(!els.compReview) {
					eventList.hideReviews();
					eventList.hideSeeReviewWrap();
					eventList.removeTitle();
					return;
				}

				eventList.setAccordion();

				els.compReviewHeader?.remove();
				els.reviewsInner.appendChild(els.compReview);
				els.bvReviewsMoreBtn?.addEventListener('click', eventList.clickReviewMoreBtn);

				eventList.setKvReviewsCTA();
				eventList.showReviews();

				if(els.accordion) {
					els.accordion.els.item[0]?.classList.add('is-open');
					els.accordion.openDefalutItem();
					bgLoader.getLazyMedia();
					bgLoader.setLazyMedia();
				}
			},
			setAccordion: function () {
				els.accordion = new window.flagship.common.accordion({
					wrap: els.reviewsArea,
					classList: {
						item: 'js-reviews-info',
						button: 'js-reviews-open',
						contents: 'js-reviews-content',
						activeClass: 'is-open'
					},
					open: {
						start: function () {
							accessibility.accordion(true);
						}
					},
					close: {
						start: function () {
							accessibility.accordion(false);
						}
					}
				});

				els.accordion.init();
			},
			setKvReviewsCTA: function() {
				if(!els.compReviewAvgRating || !els.compReviewStars) {
					eventList.showSeeReviewsWrap();
				} else {
					const ratingAvgVal = Array.from(els.compReviewAvgRating.childNodes)
						.filter(node => node.nodeType === Node.TEXT_NODE)
						.map(node => node.textContent.trim())
						.join('');
					const [ integerNum, decimalNum ] = ratingAvgVal.split('.');
					const kvStarListEl = els.compReviewStars.cloneNode(true);
					const fillStarEls = kvStarListEl.querySelectorAll('.rating__star-filled');
					if(fillStarEls.length < 1) return;

					for(let i = 0; i < fillStarEls.length; i++) {
						const oneBasedIndex = i + 1;

						if(oneBasedIndex < integerNum) {
							fillStarEls[i].style.width = '100%';
						}
					}

					if(decimalNum && decimalNum != 0) {
						const decimalToPer = Math.round(decimalNum) * 10;
						fillStarEls[fillStarEls.length - 1].style.width = `${decimalToPer}%`;
					}

					els.seeReviewsAnchor && els.seeReviewsAnchor.remove();

					els.kvReviewStar.appendChild(kvStarListEl);
					els.kvReviewAvg.textContent = ratingAvgVal;

					els.kvReviewAnchor && els.kvReviewAnchor.addEventListener('click', eventList.clickReviewCta);
					eventList.showkvReviewStarCta();
					eventList.showSeeReviewsWrap();
				};
			},
			setReviewsInitialHeight: function() {
				const reviewsContent = document.querySelector('.js-reviews-content');
				reviewsContent?.classList.add('is-loaded');
			},
			clickReviewCta: function(e) {
				e.preventDefault();
				const isClose =  els.reviewsContent.style.height == '0px' || els.reviewsContent.style.height == 0;

				if(isClose) {
					els.reviewsOpener.click();
					els.reviewsContent.addEventListener('transitionend', eventList.goToReviewsSection);
				} else {
					eventList.goToReviewsSection();
				}
			},
			clickReviewMoreBtn: function() {
				if(!els.reviewsInner) return;
				clearTimeout(reviewMoreTimeout);

				if(els.reviewsContent) {
					reviewMoreTimeout = setTimeout(() => {
						const clientHeight = els.reviewsInner.clientHeight;
						els.reviewsContent.style.height = `${clientHeight}px`
					}, 300);
				}
			},
			showkvReviewStarCta: function() {
				els.kvReviewWrap.classList.add('is-show');
			},
			showSeeReviewsWrap: function () {
				if(!els.seeReviewsWrap) return;

				els.seeReviewsWrap.classList.add('is-bv-checked');
			},
			showReviews: function () {
				els.sectionArea?.classList.add('is-show');
			},
			hideReviews: function () {
				els.sectionArea?.classList.remove('is-show');
			},
			goToReviewsSection: function() {
				const sectionTop = els.section.getBoundingClientRect().top,
					hashScroll = window.pageYOffset + sectionTop - eventList.getNavHeight();
				window.scrollTo(0, hashScroll);
				els.reviewsOpener.focus();

				els.reviewsContent.removeEventListener('transitionend', eventList.goToReviewsSection);
			},
			scrollAnchor: function (e) {
				if (e && !e.isTrusted) return;
				const hash = location.hash.split('#')[1];

				if (hash === 'reviews') {
					if (!els.section) return;
					eventList.goToReviewsSection();
				}
			},
			hideSeeReviewWrap: function () {
				if(!els.seeReviewsWrap) return;
				els.seeReviewsWrap.style.display = 'none';
			},
			removeTitle: function () {
				els.reviewsTitle.remove();
			}
		};

		const accessibility = {
			accordion: function (isOpen) {
				if (isOpen) {
					utils.offAccessibility(els.reviewsInner);
				} else {
					utils.onAccessibility(els.reviewsInner);
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship = window.flagship || {};
	window.flagship.features = window.flagship.features || {};

	window.flagship.features.switchToGalaxy = (function () {
		const resize = window.flagship.common.resize;

		let els = {},
			obj = {},
			prevDevice = resize.checkResolution(),
			currDevice = resize.checkResolution();


		const init = function () {
			els.section = document.querySelector('.features-switch-to-galaxy');

			if (!!els.section) {
				setElements();
				bindEvents();
			}
		};

		const setElements = function () {
			els.switchWrap = els.section.querySelector('.js-switch-wrap');
			els.switchTexts = els.section.querySelectorAll('.js-switch-title');
		};

		const bindEvents = function () {
			resize.add(eventList.resize);
			if (currDevice.indexOf('mobile') > -1) {
				eventList.setAccordion();
				eventList.setText();
			}
		};

		const eventList = {
			resize: function (currRes) {
				currDevice = currRes;
				if (currDevice != prevDevice) {
					eventList.setText();
					eventList.checkAccordionInit();
					prevDevice = currDevice;
				}
			},
			checkAccordionInit: function () {
				if (currDevice.indexOf('mobile') > -1) {
					const items = els.switchWrap.querySelectorAll('.js-switch-item');
					items[0].classList.add('is-open');
					eventList.setAccordion();
				} else {
					eventList.destroyAccordion();
				}
			},
			setAccordion: function () {
				if (!obj.accordion) {
					obj.accordion = new window.flagship.common.accordion({
						wrap: els.switchWrap,
						classList: {
							item: 'js-switch-item',
							button: 'js-switch-open',
							contents: 'js-switch-content',
							activeClass: 'is-open'
						},
						openType: 'toggle',
						transition: {
							duration: '0.35s',
							timingFnc: 'ease',
							delay: '',
						},
					});

					obj.accordion.init();
				}
			},
			setText: function () {
				els.switchTexts.forEach(text => {
					const headTitle = text.querySelector('.common-text');
					const buttonTitle = text.nextElementSibling.querySelector('.common-text');

					text.emptyText = '';

					if (!text.originText) {
						text.originText = headTitle.innerText;
					}

					if (currDevice.indexOf('mobile') > -1) {
						headTitle.innerText = text.emptyText;
						buttonTitle.innerText = text.originText;
					} else {
						headTitle.innerText = text.originText;
						buttonTitle.innerText = text.emptyText;
					}
				});
			},
			destroyAccordion: function () {
				if (obj.accordion) {
					obj.accordion.destroy();
					obj.accordion = null;
				}
			}
		};

		return {
			init: init
		}
	})();
})();
(function () {
	window.flagship.features.howtoPopup = (function () {
		const utils = window.flagship.common.utils,
			resize = window.flagship.common.resize,
			Swiper = window.flagship.Swiper;

		let els = {},
			currDevice = resize.checkResolution(),
			prevDevice = resize.checkResolution(),
			currOpener = null,
			notMobile = currDevice.includes('desktop') || currDevice.includes('tablet'),
			obj = [],
			state = {
				initialWidth: [],
				initialHeight: []
			};

		const init = function () {
			els.layerPopup = document.querySelector('.js-howto-popup');

			if (!!els.layerPopup) {
				setElements();
				setProperty();
				bindEvents();
			}
		};

		const setElements = function () {
			els.contents = document.querySelector('#contents');
			els.openCtas = document.querySelectorAll('.js-howto-cta');
			els.openCtaButton = document.querySelectorAll('.js-howto-popup-opener');
			els.popupData = document.querySelectorAll('.js-howto-popup-data');
			els.openCtaImage = document.querySelectorAll('.js-howto-thumb-image');
			els.ctaTitle = document.querySelectorAll('.js-howto-title');

			// popup content
			els.popupTemplate = document.querySelector('.js-howto-template');
			els.popupInner = document.querySelector('.js-howto-popup-inner');
			els.closeCta = document.querySelectorAll('.js-howto-popup-close-cta');
			els.ytIframe = els.layerPopup.querySelector('iframe');
			els.ytDesc = els.layerPopup.querySelector('.js-howto-popup-youtube-desc');
			els.dimmed = els.layerPopup.querySelector('.js-howto-popup-dimmed');

			// swiper
			els.swiperContainer = els.layerPopup.querySelector('.js-howto-popup-swiper');
			els.featureTagging = els.swiperContainer.getAttribute('data-tagging-feature');
			els.swiperWrapper = els.swiperContainer.querySelector('.js-howto-popup-swiper-wrapper');
			els.navigationWrap = els.layerPopup.querySelector('.js-arrow-wrap');
			els.swiperNextArrow = els.layerPopup.querySelector('.js-howto-next');
			els.swiperPrevArrow = els.layerPopup.querySelector('.js-howto-prev');
			els.indicationWrap = els.swiperContainer.querySelector('.js-howto-popup-pagination-wrap');
			els.indication = els.swiperContainer.querySelector('.js-howto-popup-pagination');

			// template
			let tempPopupThumb = [];

			for (let i = 0; i < els.openCtas.length; i++) {
				tempPopupThumb[i] = document.importNode(els.popupTemplate.content, true);

				els.swiperWrapper.append(tempPopupThumb[i]);
			};

			// swiper-slide after set template
			els.popupThumb = [],
				els.thumbImage = [],
				els.thumbTitle = [],
				els.thumbBtn = [];

			els.popupThumb = els.swiperWrapper.querySelectorAll('.js-howto-popup-swiper-slide');
			for (let j = 0; j < els.openCtas.length; j++) {
				els.thumbImage[j] = els.popupThumb[j].querySelector('.js-howto-popup-thumb-image img');
				els.thumbTitle[j] = els.popupThumb[j].querySelector('.js-howto-popup-thumb-title');
				els.thumbBtn[j] = els.popupThumb[j].querySelector('button');
			}
		};

		const setProperty = function () {
			els.openCtas.forEach((cta, index) => {
				cta.titleEl = els.ctaTitle[index];
				cta.inner = cta.querySelector('.js-howto-cta-inner');
				cta.desc = cta.querySelector('.js-howto-thumb-desc')
				cta.container = cta.querySelector('.js-howto-cta-container');
				cta.button = cta.querySelector('.js-howto-popup-opener');
			});
			els.layerPopup.inner = els.popupInner;
		}

		const bindEvents = function () {
			eventList.setThumb();
			eventList.setPopup();

			eventList.setInitialSize();
			eventList.setScroller();
			eventHandler.scroll();

			swiperEventList.activeCheck();

			eventHandler.clickButtons();
			eventHandler.clickArrows();

			resize.add(eventList.resize);
		};

		const eventHandler = {
			clickArrows: function () {
				if (!!els.swiperNextArrow) {
					els.swiperNextArrow.addEventListener('click', function () {
						accessibility.arrowFocus(this, els.swiperPrevArrow);
					})
				}
				if (!!els.swiperPrevArrow) {
					els.swiperPrevArrow.addEventListener('click', function () {
						accessibility.arrowFocus(this, els.swiperNextArrow);
					})
				}
			},
			clickButtons: function () {
				for (let i = 0; i < els.openCtas.length; i++) {
					els.popupThumb[i].button.addEventListener('click', function () {
						eventList.setYoutube(els.popupThumb[i]);
						swiperEventList.clickThumbnail(i);
					});
				}
			},
			scroll: function () {
				window.addEventListener('scroll', eventList.setScrollTrack);
			}
		};

		const eventList = {
			setThumb: function () {
				for (let i = 0; i < els.openCtas.length; i++) {
					els.popupThumb[i].dataset.slideTitle = els.openCtaButton[i].dataset.youtubeTitle;
					els.popupThumb[i].dataset.howtoPopupSlide = els.openCtaButton[i].dataset.howtoPopupSlide;

					els.thumbImage[i].setAttribute('data-src-pc', els.openCtaButton[i].dataset.srcPc);

					els.thumbTitle[i].innerText = els.popupThumb[i].dataset.slideTitle;

					els.thumbBtn[i].parent = els.openCtaButton[i];
					els.thumbBtn[i].id = els.openCtaButton[i].getAttribute('data-howto-popup-slide');

					setTagging.buttonTagging(els.thumbBtn[i], els.openCtaButton[i]);
				}
				eventList.matchBtn();
			},
			setPopup: function () {
				els.layerPopup.opts = {
					show: {
						start: function () {
							els.layerPopup.children[0].scrollTop = 0;

							let allVideos = document.querySelectorAll('video');

							for (let i = 0; i < allVideos.length; i++) {
								if (!allVideos[i].paused) allVideos[i].pause();
							}

							els.layerPopup.removeAttribute('aria-hidden');
							els.layerPopup.removeAttribute('tabindex');
							eventList.loadImages(els.popupThumb);
							els.popupInner.classList.add('is-bg-load-complete');

							setTimeout(function () {
								accessibility.slide();
								accessibility.slideArrow(els.swiperContainer.swiper);
							}, 350);
						},
						end: function () {
							currOpener = els.layerPopup.openCta;
							swiperEventList.isOpendSlide();

							els.popupInner.addEventListener('transitionend', function () {
								setTimeout(() => {
									eventList.setYoutube(els.layerPopup);
								}, 400)
							}, {
								once: true
							});
						}
					},
					hide: {
						start: function () {},
						end: function () {
							if (utils.detector.isIosDevice) els.layerPopup.openCta.style.display = '';

							setTimeout(function () {
								eventList.removeYoutube();
								els.layerPopup.children[0].scrollTop = 0;
							}, 300);
						}
					}
				};
			},
			matchBtn: function () {
				els.openCtas.forEach((cta) => {
					const howtoAtrr = cta.button.getAttribute('data-howto-popup-slide');

					els.popupThumb.forEach((thumb) => {
						if (thumb.getAttribute('data-howto-popup-slide') === howtoAtrr) {
							thumb.openCta = cta.button;
							thumb.button = thumb.querySelector('button');
							cta.button.thumb = thumb;
							cta.thumb = thumb;
						}
					});
				});
			},
			setYoutube: function (target) {
				let opener = target.openCta,
					ytSrc = 'htt' + 'ps://www.youtube.com/embed/' + opener.getAttribute('data-youtube-id') + `?wmode=opaque&rel=0&enablejsapi=1&version=3&autoplay=1&origin=${encodeURIComponent(location.origin)}`,
                    ytTitle = opener.getAttribute('data-youtube-title'),
					ytBlind = opener.querySelector('.sr-only').innerHTML;
				els.ytIframe.setAttribute('src', ytSrc);
				els.ytIframe.setAttribute('title', ytTitle);
				els.ytDesc.innerHTML = ytBlind;

				let oldActive = els.swiperContainer.querySelector('.js-howto-popup-swiper-slide.is-active');

				if (!!oldActive) {
					oldActive.classList.remove('is-active');
					oldActive.button.removeAttribute('title');
				}
				opener.thumb.classList.add('is-active');

				accessibility.setTitle(opener.thumb.button);
			},
			removeYoutube: function () {
				els.ytIframe.removeAttribute('src');
				els.ytIframe.title = '';
				els.ytDesc.innerHTML = '';

				accessibility.removeTitle(els.popupThumb);
			},
			resize: function (currRes) {
				currDevice = currRes;

				if (prevDevice != currDevice) {
					swiperEventList.destroy();
					swiperEventList.activeCheck();
					swiperEventList.isOpendSlide();

					notMobile = currDevice.includes('desktop') || currDevice.includes('tablet')
					eventList.destroyExpandMotion();
					eventList.setInitialSize();
					eventList.clearScroll();
					eventList.setScroll();
					prevDevice = currDevice;

					if (els.swiperContainer.swiper && els.layerPopup.classList.contains('is-open')) {
						for (let i = 0; i < els.popupThumb.length; i++) {
							if (els.popupThumb[i].classList.contains('is-active')) {
								els.swiperContainer.swiper.slideTo(i, 0);
							};
						};
					};
				};
			},
			loadImages: function (target) {
				for (let i = 0; i < target.length; i++) {
					if (!target[i].querySelector('.js-howto-popup-res-img').classList.contains('is-img-load-complete')) {
						imageLoader.setResponsiveMedia([target[i].querySelector('.js-howto-popup-res-img')]);
					}
				}
			},
			setScroller: function () {
				els.openCtas.forEach(function (cta, index) {
					obj[index] = SCROLLER({
						trackElement: cta,
						useFixed: false,
						resize: utils.detector.isTouchDevice ? false : true
					});
				})
			},
			setScrollTrack: function () {
				els.openCtas.forEach(function (cta, index) {
					obj[index].trackAnimation(function () {
						let progress = this.progress;

						eventList.setMotion(cta, index, progress);
					});
				})
			},
			clearScroll: function () {
				els.openCtas.forEach(function (cta, index) {
					if (!obj[index]) return;

					obj[index] = [];
					window.removeEventListener('scroll', eventList.setScrollTrack);
				});
			},
			setScroll: function () {
				eventList.setScroller();
				window.addEventListener('scroll', eventList.setScrollTrack);
			},
			setInitialSize: function () {
				els.openCtas.forEach((cta, index) => {
					state.initialWidth.push(Math.ceil(parseFloat(getComputedStyle(cta.titleEl).width)));

					const paddingLeft = parseInt(getComputedStyle(cta.inner).paddingLeft);
					const paddingRight = parseInt(getComputedStyle(cta.inner).paddingRight);
					const descWidth = cta.clientWidth - (paddingLeft + paddingRight);

					gsap.set(cta.desc, {
						width: descWidth
					});

					gsap.set(cta.container, {
						width: state.initialWidth[index]
					});

					state.initialHeight.push(cta.inner.clientHeight);
					gsap.set(cta.inner, {
						height: 0
					});
				});
			},
			setMotion: function (cta, index, progress) {
				if (progress >= 10) {
					if (cta.classList.contains('is-expanded')) return;

					if (!cta.classList.contains('is-expanded')) cta.classList.add('is-expanded');

					gsap.killTweensOf(cta.container);
					gsap.killTweensOf(cta.inner);

					gsap.to(cta.container, {
						width: cta.clientWidth,
						duration: .5,
					});
					gsap.to(cta.inner, {
						height: state.initialHeight[index],
						duration: .5,
					});
				}

				if (progress <= 5) {
					if (!cta.classList.contains('is-expanded')) return;

					if (document.documentElement.classList.contains('is-layer-open')) return;
					if (cta.classList.contains('is-expanded')) cta.classList.remove('is-expanded');

					gsap.killTweensOf(cta.container);
					gsap.killTweensOf(cta.inner);

					gsap.to(cta.container, {
						width: state.initialWidth[index],
						duration: .4,
					});
					gsap.to(cta.inner, {
						height: 0,
						duration: .4,
					});
				}
			},
			destroyExpandMotion: function () {
				if (!els.openCtas) return;

				state.initialWidth = [];
				state.initialHeight = [];
				els.openCtas.forEach(function (cta, index) {
					if (!cta) return;

					gsap.killTweensOf(cta.container);
					gsap.killTweensOf(cta.inner);

					gsap.set(cta.desc, {
						clearProps: 'all'
					});
					gsap.set(cta.container, {
						clearProps: 'all'
					});
					gsap.set(cta.inner, {
						clearProps: 'all'
					});
				});
			},
		};

		const swiperEventList = {
			set: function () {
				if (els.swiperContainer.swiper == null) {
					els.swiperContainer.swiper = new Swiper(els.swiperContainer, {
						init: false,
						slidesPerView: 'auto',
						navigation: {
							nextEl: els.swiperNextArrow,
							prevEl: els.swiperPrevArrow,
						},
						pagination: {
							el: els.indication,
							clickable: true,
							renderBullet: function (index, className) {
								const slide = this.slides[index];
								const slideTitle = slide.getAttribute('data-slide-title') || '';
								const tagging = {
									omniType: "microsite_contentinter",
									actionType: "gallery",
									contentType: "feature gallery",
									taggingValue: els.featureTagging + ":index:" + `${index + 1}`
								}
								this.slideTitle = slideTitle;

								return `
								<li role="listitem" class="${className} common-carousel__pagination-bullet">
									<button type="button" ${utils.setTagging(tagging)} class="swiper-pagination-bullet-button" aria-label="${LOCAL_VARI.slide}${index + 1}: ${slideTitle}">
										<span class="swiper-pagination-bullet-button-dot"></span>
									</button>
								</li>`;
							}
						},
						a11y: false,
					});

					els.swiperContainer.swiper.on('init', swiperEventList.init);
					els.swiperContainer.swiper.on('slideChange', swiperEventList.slideChange);
					els.swiperContainer.swiper.on('paginationUpdate', swiperEventList.paginationUpdate);
					els.swiperContainer.swiper.init();
				}
			},
			destroy: function () {
				if (els.swiperContainer.swiper != null) {
					els.swiperContainer.swiper.navigation.destroy(true);
					els.swiperContainer.swiper.destroy(true);
					els.swiperContainer.swiper = null;
				}
			},
			init: function () {
				let self = this,
					notification = self.el.querySelector('.swiper-notification');
				if (!!notification) self.el.removeChild(notification);
			},
			paginationUpdate: function () {
				const bullets = this.pagination.bullets;
				const slides = this.slides;

				let arrSlidesTitle = [];
				for (let i = 0; i < slides.length; i++) {
					arrSlidesTitle.push(slides[i].dataset.slideTitle)
				}

				for (let i = 0; i < bullets.length; i++) {
					const bullet = bullets[i];
					const button = bullet.querySelector('button');
					const isActive = bullet.classList.contains('swiper-pagination-bullet-active');
					const selected = isActive ? ` ${LOCAL_VARI.selected}` : '';

					if (currDevice.indexOf('mobile') > -1) {
						button.setAttribute('aria-label', `${LOCAL_VARI.slide}${i + 1}${selected}: ${arrSlidesTitle[i]}, ${arrSlidesTitle[i+1]}`);
					} else {
						button.setAttribute('aria-label', `${LOCAL_VARI.slide}${i + 1}${selected}: ${arrSlidesTitle[i]}, ${arrSlidesTitle[i+1]}, ${arrSlidesTitle[i+2]}, ${arrSlidesTitle[i+3]}`);
					}
				}
			},
			slideChange: function () {
				accessibility.slide();
				accessibility.slideArrow(els.swiperContainer.swiper);
			},
			activeCheck: function () {
				let isSlide = ((currDevice.indexOf('mobile') > -1) && (els.popupThumb.length >= 3)) ||
					((currDevice.indexOf('desktop') > -1 || currDevice == 'tablet') && (els.popupThumb.length >= 5));

				if (isSlide) {
					els.swiperWrapper.style.justifyContent = '';
					swiperEventList.set();
					els.navigationWrap.style.display = '';
					els.indicationWrap.style.display = '';
				} else {
					swiperEventList.destroy();
					els.swiperWrapper.style.justifyContent = 'center';
					els.navigationWrap.style.display = 'none';
					els.indicationWrap.style.display = 'none';
				}
			},
			isOpendSlide: function () {
				if (els.swiperContainer.swiper != null) {
					let buttonIndex;

					if (currOpener != null) {
						for (let i = 0; i < els.popupThumb.length; i++) {
							if (els.popupThumb[i] === currOpener.thumb) {
								buttonIndex = i;
							}
						}
						els.swiperContainer.swiper.slideTo(buttonIndex, 0);
					}
				}
			},
			clickThumbnail: function (index) {
				els.swiperContainer.swiper.slideTo(index - 1, 300);
			}
		};

		const setTagging = {
			buttonTagging: function (button, data) {
				button.setAttribute('data-omni-type', 'microsite_contentinter');
				button.setAttribute('data-omni', `${FLAGSHIP_PROD_NAME}:${FLAGSHIP_PAGE_NAME}:how-to-popup:slct-video:${data.getAttribute('data-popup-button-tagging')}`);
				button.setAttribute('ga-ca', 'content click');
				button.setAttribute('ga-ac', 'feature');
				button.setAttribute('ga-la', `${FLAGSHIP_PROD_NAME}:${FLAGSHIP_PAGE_NAME}:how-to-popup:slct-video:${data.getAttribute('data-popup-button-tagging')}`);
			}
		};

		const accessibility = {
			arrowFocus: function (isFocusArrow, nextFocusArrow) {
				if (isFocusArrow.classList.contains('swiper-button-disabled')) {
					nextFocusArrow.focus();
				}
			},
			setTitle: function (target) {
				if (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) {
					target.setAttribute('title', LOCAL_VARI.selected);
				} else {
					target.setAttribute('title', 'Selected');
				}
			},
			removeTitle: function (target) {
				for (let i = 0; i < target.length; i++) {
					if (typeof LOCAL_VARI != 'undefined' && !!LOCAL_VARI) {
						target[i].button.removeAttribute('title', LOCAL_VARI.selected);
					} else {
						target[i].button.removeAttribute('title', 'Selected');
					}
				};
			},
			slide: function () {
				let slidePerviewValue = currDevice.indexOf('mobile') > -1 ? 2 : 4;

				let getPerviewIndex = function () {
					return slidePerviewValue - 1;
				}
				if (els.swiperContainer.swiper) {
					for (let i = 0; i < els.swiperContainer.swiper.slides.length; i++) {
						if (i >= els.swiperContainer.swiper.activeIndex && i <= (els.swiperContainer.swiper.activeIndex + getPerviewIndex())) {
							utils.offAccessibility(els.swiperContainer.swiper.slides[i]);
						} else {
							utils.onAccessibility(els.swiperContainer.swiper.slides[i]);
						}
					}
				}
			},
			slideArrow: function (swiperObj) {
				if (!swiperObj) return;

				if (swiperObj.isBeginning && !swiperObj.isEnd) {
					utils.onAccessibility(els.swiperPrevArrow);
					utils.offAccessibility(els.swiperNextArrow);
				} else if (!swiperObj.isBeginning && !swiperObj.isEnd) {
					utils.offAccessibility(els.swiperPrevArrow);
					utils.offAccessibility(els.swiperNextArrow);
				} else {
					utils.onAccessibility(els.swiperNextArrow);
					utils.offAccessibility(els.swiperPrevArrow);
				}
			},
		};

		return {
			init: init,
		}
	})();
})();
flagship.features.initialize = (function () {
	window.flagship.common.resize.bindEvent();

	const init = function () {
		flagship.features.commonPopup.init();
		flagship.features.carouselCore.init();
		flagship.features.clickToVideo.init();
		flagship.features.scrollVideo.init();
		flagship.features.commonExpandingButton.init();
		flagship.features.faqBanner.init();
		flagship.features.seriesCta.init();
		flagship.features.seriesCompare.init();
		flagship.features.arBanner.init();
		flagship.features.navHandler.init();
		flagship.features.highlights.init();
		flagship.features.colors.init();
		flagship.features.battery.init();
		flagship.features.eightGenerations.init();
		flagship.features.comparisonModule.init();
		flagship.features.cameraOverview.init();
		flagship.features.cameraCarousel.init();
		flagship.features.cameraSpec.init();
		flagship.features.aiOverview.init();
		flagship.features.benefit.init();
		flagship.features.faq.init();
		flagship.features.switchToGalaxy.init();
		flagship.features.privacy.init();
		flagship.features.commonSectionIntraction.init();
		flagship.features.ap.init();
		flagship.features.accessories.init();
		flagship.features.galaxyEcosystem.init();
		flagship.features.featureInteraction.init();
		flagship.features.reviews.init();
		flagship.features.howtoPopup.init();
		flagship.features.aiReviewSummary.init();
		flagship.features.mediaQuoteCarousel.init();
	};

	return {
		init: init
	}
})();

flagship.features.initialize.init();
	});
