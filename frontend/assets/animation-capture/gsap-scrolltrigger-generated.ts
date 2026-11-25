// Generated GSAP ScrollTrigger timeline matching ASUS ROG pinned sequence
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initRogScrollAnimation(triggerElement: HTMLElement, targetElement: HTMLElement) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: 1, // Smooth inertia scrub
      anticipatePin: 1,
    }
  });

  tl.to(targetElement, {
    scale: 1.2,
    opacity: 0,
    ease: 'power2.out',
    duration: 1
  });

  return tl;
}