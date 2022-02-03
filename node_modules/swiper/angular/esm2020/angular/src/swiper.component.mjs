import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, HostBinding, Inject, Input, Output, PLATFORM_ID, ViewChild, ViewEncapsulation, } from '@angular/core';
// @ts-ignore
import Swiper from 'swiper';
import { of, Subject } from 'rxjs';
import { getParams } from './utils/get-params';
import { SwiperSlideDirective } from './swiper-slide.directive';
import { extend, isObject, setProperty, ignoreNgOnChanges, coerceBooleanProperty, isShowEl, isEnabled, } from './utils/utils';
import { isPlatformBrowser } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class SwiperComponent {
    constructor(_ngZone, elementRef, _changeDetectorRef, _platformId) {
        this._ngZone = _ngZone;
        this.elementRef = elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._platformId = _platformId;
        this.slideClass = 'swiper-slide';
        this.wrapperClass = 'swiper-wrapper';
        this.showNavigation = true;
        this.showPagination = true;
        this.showScrollbar = true;
        this.s__beforeBreakpoint = new EventEmitter();
        this.s__containerClasses = new EventEmitter();
        this.s__slideClass = new EventEmitter();
        this.s__swiper = new EventEmitter();
        this.s_activeIndexChange = new EventEmitter();
        this.s_afterInit = new EventEmitter();
        this.s_autoplay = new EventEmitter();
        this.s_autoplayStart = new EventEmitter();
        this.s_autoplayStop = new EventEmitter();
        this.s_autoplayPause = new EventEmitter();
        this.s_autoplayResume = new EventEmitter();
        this.s_beforeDestroy = new EventEmitter();
        this.s_beforeInit = new EventEmitter();
        this.s_beforeLoopFix = new EventEmitter();
        this.s_beforeResize = new EventEmitter();
        this.s_beforeSlideChangeStart = new EventEmitter();
        this.s_beforeTransitionStart = new EventEmitter();
        this.s_breakpoint = new EventEmitter();
        this.s_changeDirection = new EventEmitter();
        this.s_click = new EventEmitter();
        this.s_doubleTap = new EventEmitter();
        this.s_doubleClick = new EventEmitter();
        this.s_destroy = new EventEmitter();
        this.s_fromEdge = new EventEmitter();
        this.s_hashChange = new EventEmitter();
        this.s_hashSet = new EventEmitter();
        this.s_imagesReady = new EventEmitter();
        this.s_init = new EventEmitter();
        this.s_keyPress = new EventEmitter();
        this.s_lazyImageLoad = new EventEmitter();
        this.s_lazyImageReady = new EventEmitter();
        this.s_loopFix = new EventEmitter();
        this.s_momentumBounce = new EventEmitter();
        this.s_navigationHide = new EventEmitter();
        this.s_navigationShow = new EventEmitter();
        this.s_observerUpdate = new EventEmitter();
        this.s_orientationchange = new EventEmitter();
        this.s_paginationHide = new EventEmitter();
        this.s_paginationRender = new EventEmitter();
        this.s_paginationShow = new EventEmitter();
        this.s_paginationUpdate = new EventEmitter();
        this.s_progress = new EventEmitter();
        this.s_reachBeginning = new EventEmitter();
        this.s_reachEnd = new EventEmitter();
        this.s_realIndexChange = new EventEmitter();
        this.s_resize = new EventEmitter();
        this.s_scroll = new EventEmitter();
        this.s_scrollbarDragEnd = new EventEmitter();
        this.s_scrollbarDragMove = new EventEmitter();
        this.s_scrollbarDragStart = new EventEmitter();
        this.s_setTransition = new EventEmitter();
        this.s_setTranslate = new EventEmitter();
        this.s_slideChange = new EventEmitter();
        this.s_slideChangeTransitionEnd = new EventEmitter();
        this.s_slideChangeTransitionStart = new EventEmitter();
        this.s_slideNextTransitionEnd = new EventEmitter();
        this.s_slideNextTransitionStart = new EventEmitter();
        this.s_slidePrevTransitionEnd = new EventEmitter();
        this.s_slidePrevTransitionStart = new EventEmitter();
        this.s_slideResetTransitionStart = new EventEmitter();
        this.s_slideResetTransitionEnd = new EventEmitter();
        this.s_sliderMove = new EventEmitter();
        this.s_sliderFirstMove = new EventEmitter();
        this.s_slidesLengthChange = new EventEmitter();
        this.s_slidesGridLengthChange = new EventEmitter();
        this.s_snapGridLengthChange = new EventEmitter();
        this.s_snapIndexChange = new EventEmitter();
        this.s_tap = new EventEmitter();
        this.s_toEdge = new EventEmitter();
        this.s_touchEnd = new EventEmitter();
        this.s_touchMove = new EventEmitter();
        this.s_touchMoveOpposite = new EventEmitter();
        this.s_touchStart = new EventEmitter();
        this.s_transitionEnd = new EventEmitter();
        this.s_transitionStart = new EventEmitter();
        this.s_update = new EventEmitter();
        this.s_zoomChange = new EventEmitter();
        this.s_swiper = new EventEmitter();
        this.s_unlock = new EventEmitter();
        this._activeSlides = new Subject();
        this.containerClasses = 'swiper';
        this.slidesChanges = (val) => {
            this.slides = val.map((slide, index) => {
                slide.slideIndex = index;
                slide.classNames = this.slideClass || '';
                return slide;
            });
            if (this.loop && !this.loopedSlides) {
                this.calcLoopedSlides();
            }
            if (!this.virtual) {
                if (this.loopedSlides) {
                    this.prependSlides = of(this.slides.slice(this.slides.length - this.loopedSlides));
                    this.appendSlides = of(this.slides.slice(0, this.loopedSlides));
                }
            }
            else if (this.swiperRef && this.swiperRef.virtual) {
                this._ngZone.runOutsideAngular(() => {
                    this.swiperRef.virtual.slides = this.slides;
                    this.swiperRef.virtual.update(true);
                });
            }
            this._changeDetectorRef.detectChanges();
        };
        this.style = null;
        this.updateVirtualSlides = (virtualData) => {
            // TODO: type virtualData
            if (!this.swiperRef ||
                (this.currentVirtualData &&
                    this.currentVirtualData.from === virtualData.from &&
                    this.currentVirtualData.to === virtualData.to &&
                    this.currentVirtualData.offset === virtualData.offset)) {
                return;
            }
            this.style = this.swiperRef.isHorizontal()
                ? {
                    [this.swiperRef.rtlTranslate ? 'right' : 'left']: `${virtualData.offset}px`,
                }
                : {
                    top: `${virtualData.offset}px`,
                };
            this.currentVirtualData = virtualData;
            this._activeSlides.next(virtualData.slides);
            this._ngZone.run(() => {
                this._changeDetectorRef.detectChanges();
            });
            this._ngZone.runOutsideAngular(() => {
                this.swiperRef.updateSlides();
                this.swiperRef.updateProgress();
                this.swiperRef.updateSlidesClasses();
                if (isEnabled(this.swiperRef.params.lazy)) {
                    this.swiperRef.lazy.load();
                }
                this.swiperRef.virtual.update(true);
            });
            return;
        };
    }
    set navigation(val) {
        const currentNext = typeof this._navigation !== 'boolean' && this._navigation !== ''
            ? this._navigation?.nextEl
            : null;
        const currentPrev = typeof this._navigation !== 'boolean' && this._navigation !== ''
            ? this._navigation?.prevEl
            : null;
        this._navigation = setProperty(val, {
            nextEl: currentNext || null,
            prevEl: currentPrev || null,
        });
        this.showNavigation = !(coerceBooleanProperty(val) !== true ||
            (this._navigation &&
                typeof this._navigation !== 'boolean' &&
                this._navigation.prevEl !== this._prevElRef?.nativeElement &&
                (this._navigation.prevEl !== null || this._navigation.nextEl !== null) &&
                (typeof this._navigation.nextEl === 'string' ||
                    typeof this._navigation.prevEl === 'string' ||
                    typeof this._navigation.nextEl === 'object' ||
                    typeof this._navigation.prevEl === 'object')));
    }
    get navigation() {
        return this._navigation;
    }
    set pagination(val) {
        const current = typeof this._pagination !== 'boolean' && this._pagination !== ''
            ? this._pagination?.el
            : null;
        this._pagination = setProperty(val, {
            el: current || null,
        });
        this.showPagination = isShowEl(val, this._pagination, this._paginationElRef);
    }
    get pagination() {
        return this._pagination;
    }
    set scrollbar(val) {
        const current = typeof this._scrollbar !== 'boolean' && this._scrollbar !== '' ? this._scrollbar?.el : null;
        this._scrollbar = setProperty(val, {
            el: current || null,
        });
        this.showScrollbar = isShowEl(val, this._scrollbar, this._scrollbarElRef);
    }
    get scrollbar() {
        return this._scrollbar;
    }
    set virtual(val) {
        this._virtual = setProperty(val);
    }
    get virtual() {
        return this._virtual;
    }
    set config(val) {
        this.updateSwiper(val);
        const { params } = getParams(val);
        Object.assign(this, params);
    }
    set prevElRef(el) {
        this._prevElRef = el;
        this._setElement(el, this.navigation, 'navigation', 'prevEl');
    }
    set nextElRef(el) {
        this._nextElRef = el;
        this._setElement(el, this.navigation, 'navigation', 'nextEl');
    }
    set scrollbarElRef(el) {
        this._scrollbarElRef = el;
        this._setElement(el, this.scrollbar, 'scrollbar');
    }
    set paginationElRef(el) {
        this._paginationElRef = el;
        this._setElement(el, this.pagination, 'pagination');
    }
    get activeSlides() {
        if (this.virtual) {
            return this._activeSlides;
        }
        return of(this.slides);
    }
    get zoomContainerClass() {
        return this.zoom && typeof this.zoom !== 'boolean'
            ? this.zoom.containerClass
            : 'swiper-zoom-container';
    }
    _setElement(el, ref, update, key = 'el') {
        if (!ref || !el)
            return;
        if (el.nativeElement) {
            if (ref[key] === el.nativeElement) {
                return;
            }
            ref[key] = el.nativeElement;
        }
        const updateObj = {};
        updateObj[update] = true;
        this.updateInitSwiper(updateObj);
    }
    ngOnInit() {
        const { params } = getParams(this);
        Object.assign(this, params);
    }
    ngAfterViewInit() {
        this.childrenSlidesInit();
        this.initSwiper();
        this._changeDetectorRef.detectChanges();
        setTimeout(() => {
            this.s_swiper.emit(this.swiperRef);
        });
    }
    childrenSlidesInit() {
        this.slidesChanges(this.slidesEl);
        this.slidesEl.changes.subscribe(this.slidesChanges);
    }
    get isSwiperActive() {
        return this.swiperRef && !this.swiperRef.destroyed;
    }
    initSwiper() {
        const { params: swiperParams, passedParams } = getParams(this);
        Object.assign(this, swiperParams);
        this._ngZone.runOutsideAngular(() => {
            swiperParams.init = false;
            if (!swiperParams.virtual) {
                swiperParams.observer = true;
            }
            swiperParams.onAny = (eventName, ...args) => {
                const emitter = this[('s_' + eventName)];
                if (emitter) {
                    emitter.emit([...args]);
                }
            };
            const _slideClasses = (_, updated) => {
                updated.forEach(({ slideEl, classNames }, index) => {
                    const dataIndex = slideEl.getAttribute('data-swiper-slide-index');
                    const slideIndex = dataIndex ? parseInt(dataIndex) : index;
                    if (this.virtual) {
                        const virtualSlide = this.slides.find((item) => {
                            return item.virtualIndex && item.virtualIndex === slideIndex;
                        });
                        if (virtualSlide) {
                            virtualSlide.classNames = classNames;
                            return;
                        }
                    }
                    if (this.slides[slideIndex]) {
                        this.slides[slideIndex].classNames = classNames;
                    }
                });
                this._changeDetectorRef.detectChanges();
            };
            const _containerClasses = (_, classes) => {
                setTimeout(() => {
                    this.containerClasses = classes;
                });
            };
            Object.assign(swiperParams.on, {
                _containerClasses,
                _slideClasses,
            });
            const swiperRef = new Swiper(swiperParams);
            swiperRef.loopCreate = () => { };
            swiperRef.loopDestroy = () => { };
            if (swiperParams.loop) {
                swiperRef.loopedSlides = this.loopedSlides;
            }
            const isVirtualEnabled = isEnabled(swiperRef.params.virtual);
            if (swiperRef.virtual && isVirtualEnabled) {
                swiperRef.virtual.slides = this.slides;
                const extendWith = {
                    cache: false,
                    slides: this.slides,
                    renderExternal: this.updateVirtualSlides,
                    renderExternalUpdate: false,
                };
                extend(swiperRef.params.virtual, extendWith);
                extend(swiperRef.originalParams.virtual, extendWith);
            }
            if (isPlatformBrowser(this._platformId)) {
                this.swiperRef = swiperRef.init(this.elementRef.nativeElement);
                const isVirtualEnabled = isEnabled(this.swiperRef.params.virtual);
                if (this.swiperRef.virtual && isVirtualEnabled) {
                    this.swiperRef.virtual.update(true);
                }
                this._changeDetectorRef.detectChanges();
            }
        });
    }
    ngOnChanges(changedParams) {
        this.updateSwiper(changedParams);
        this._changeDetectorRef.detectChanges();
    }
    updateInitSwiper(changedParams) {
        if (!(changedParams && this.swiperRef && !this.swiperRef.destroyed)) {
            return;
        }
        this._ngZone.runOutsideAngular(() => {
            const { params: currentParams, pagination, navigation, scrollbar, virtual, thumbs, } = this.swiperRef;
            if (changedParams.pagination) {
                if (this.pagination &&
                    typeof this.pagination !== 'boolean' &&
                    this.pagination.el &&
                    pagination &&
                    !pagination.el) {
                    this.updateParameter('pagination', this.pagination);
                    pagination.init();
                    pagination.render();
                    pagination.update();
                }
                else {
                    pagination.destroy();
                    pagination.el = null;
                }
            }
            if (changedParams.scrollbar) {
                if (this.scrollbar &&
                    typeof this.scrollbar !== 'boolean' &&
                    this.scrollbar.el &&
                    scrollbar &&
                    !scrollbar.el) {
                    this.updateParameter('scrollbar', this.scrollbar);
                    scrollbar.init();
                    scrollbar.updateSize();
                    scrollbar.setTranslate();
                }
                else {
                    scrollbar.destroy();
                    scrollbar.el = null;
                }
            }
            if (changedParams.navigation) {
                if (this.navigation &&
                    typeof this.navigation !== 'boolean' &&
                    this.navigation.prevEl &&
                    this.navigation.nextEl &&
                    navigation &&
                    !navigation.prevEl &&
                    !navigation.nextEl) {
                    this.updateParameter('navigation', this.navigation);
                    navigation.init();
                    navigation.update();
                }
                else if (navigation.prevEl && navigation.nextEl) {
                    navigation.destroy();
                    navigation.nextEl = null;
                    navigation.prevEl = null;
                }
            }
            if (changedParams.thumbs && this.thumbs && this.thumbs.swiper) {
                this.updateParameter('thumbs', this.thumbs);
                const initialized = thumbs.init();
                if (initialized)
                    thumbs.update(true);
            }
            if (changedParams.controller && this.controller && this.controller.control) {
                this.swiperRef.controller.control = this.controller.control;
            }
            this.swiperRef.update();
        });
    }
    updateSwiper(changedParams) {
        this._ngZone.runOutsideAngular(() => {
            if (changedParams.config) {
                return;
            }
            if (!(changedParams && this.swiperRef && !this.swiperRef.destroyed)) {
                return;
            }
            for (const key in changedParams) {
                if (ignoreNgOnChanges.indexOf(key) >= 0) {
                    continue;
                }
                const newValue = changedParams[key]?.currentValue ?? changedParams[key];
                this.updateParameter(key, newValue);
            }
            if (changedParams.allowSlideNext) {
                this.swiperRef.allowSlideNext = this.allowSlideNext;
            }
            if (changedParams.allowSlidePrev) {
                this.swiperRef.allowSlidePrev = this.allowSlidePrev;
            }
            if (changedParams.direction) {
                this.swiperRef.changeDirection(this.direction, false);
            }
            if (changedParams.breakpoints) {
                if (this.loop && !this.loopedSlides) {
                    this.calcLoopedSlides();
                }
                this.swiperRef.currentBreakpoint = null;
                this.swiperRef.setBreakpoint();
            }
            if (changedParams.thumbs || changedParams.controller) {
                this.updateInitSwiper(changedParams);
            }
            this.swiperRef.update();
        });
    }
    calcLoopedSlides() {
        if (!this.loop) {
            return false;
        }
        let slidesPerViewParams = this.slidesPerView;
        if (this.breakpoints) {
            const breakpoint = Swiper.prototype.getBreakpoint(this.breakpoints);
            const breakpointOnlyParams = breakpoint in this.breakpoints ? this.breakpoints[breakpoint] : undefined;
            if (breakpointOnlyParams && breakpointOnlyParams.slidesPerView) {
                slidesPerViewParams = breakpointOnlyParams.slidesPerView;
            }
        }
        if (slidesPerViewParams === 'auto') {
            this.loopedSlides = this.slides.length;
            return this.slides.length;
        }
        let loopedSlides = this.loopedSlides || slidesPerViewParams;
        if (!loopedSlides) {
            // ?
            return false;
        }
        if (this.loopAdditionalSlides) {
            loopedSlides += this.loopAdditionalSlides;
        }
        if (loopedSlides > this.slides.length) {
            loopedSlides = this.slides.length;
        }
        this.loopedSlides = loopedSlides;
        return true;
    }
    updateParameter(key, value) {
        if (!(this.swiperRef && !this.swiperRef.destroyed)) {
            return;
        }
        const _key = key.replace(/^_/, '');
        const isCurrentParamObj = isObject(this.swiperRef.params[_key]);
        if (_key === 'enabled') {
            if (value === true) {
                this.swiperRef.enable();
            }
            else if (value === false) {
                this.swiperRef.disable();
            }
            return;
        }
        if (isCurrentParamObj && isObject(value)) {
            extend(this.swiperRef.params[_key], value);
        }
        else {
            this.swiperRef.params[_key] = value;
        }
    }
    ngOnDestroy() {
        this._ngZone.runOutsideAngular(() => {
            this.swiperRef?.destroy(true, false);
        });
    }
}
SwiperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: SwiperComponent, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
SwiperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.2", type: SwiperComponent, selector: "swiper, [swiper]", inputs: { enabled: "enabled", on: "on", direction: "direction", touchEventsTarget: "touchEventsTarget", initialSlide: "initialSlide", speed: "speed", cssMode: "cssMode", updateOnWindowResize: "updateOnWindowResize", resizeObserver: "resizeObserver", nested: "nested", focusableElements: "focusableElements", width: "width", height: "height", preventInteractionOnTransition: "preventInteractionOnTransition", userAgent: "userAgent", url: "url", edgeSwipeDetection: "edgeSwipeDetection", edgeSwipeThreshold: "edgeSwipeThreshold", freeMode: "freeMode", autoHeight: "autoHeight", setWrapperSize: "setWrapperSize", virtualTranslate: "virtualTranslate", effect: "effect", breakpoints: "breakpoints", spaceBetween: "spaceBetween", slidesPerView: "slidesPerView", maxBackfaceHiddenSlides: "maxBackfaceHiddenSlides", grid: "grid", slidesPerGroup: "slidesPerGroup", slidesPerGroupSkip: "slidesPerGroupSkip", centeredSlides: "centeredSlides", centeredSlidesBounds: "centeredSlidesBounds", slidesOffsetBefore: "slidesOffsetBefore", slidesOffsetAfter: "slidesOffsetAfter", normalizeSlideIndex: "normalizeSlideIndex", centerInsufficientSlides: "centerInsufficientSlides", watchOverflow: "watchOverflow", roundLengths: "roundLengths", touchRatio: "touchRatio", touchAngle: "touchAngle", simulateTouch: "simulateTouch", shortSwipes: "shortSwipes", longSwipes: "longSwipes", longSwipesRatio: "longSwipesRatio", longSwipesMs: "longSwipesMs", followFinger: "followFinger", allowTouchMove: "allowTouchMove", threshold: "threshold", touchMoveStopPropagation: "touchMoveStopPropagation", touchStartPreventDefault: "touchStartPreventDefault", touchStartForcePreventDefault: "touchStartForcePreventDefault", touchReleaseOnEdges: "touchReleaseOnEdges", uniqueNavElements: "uniqueNavElements", resistance: "resistance", resistanceRatio: "resistanceRatio", watchSlidesProgress: "watchSlidesProgress", grabCursor: "grabCursor", preventClicks: "preventClicks", preventClicksPropagation: "preventClicksPropagation", slideToClickedSlide: "slideToClickedSlide", preloadImages: "preloadImages", updateOnImagesReady: "updateOnImagesReady", loop: "loop", loopAdditionalSlides: "loopAdditionalSlides", loopedSlides: "loopedSlides", loopFillGroupWithBlank: "loopFillGroupWithBlank", loopPreventsSlide: "loopPreventsSlide", rewind: "rewind", allowSlidePrev: "allowSlidePrev", allowSlideNext: "allowSlideNext", swipeHandler: "swipeHandler", noSwiping: "noSwiping", noSwipingClass: "noSwipingClass", noSwipingSelector: "noSwipingSelector", passiveListeners: "passiveListeners", containerModifierClass: "containerModifierClass", slideClass: "slideClass", slideBlankClass: "slideBlankClass", slideActiveClass: "slideActiveClass", slideDuplicateActiveClass: "slideDuplicateActiveClass", slideVisibleClass: "slideVisibleClass", slideDuplicateClass: "slideDuplicateClass", slideNextClass: "slideNextClass", slideDuplicateNextClass: "slideDuplicateNextClass", slidePrevClass: "slidePrevClass", slideDuplicatePrevClass: "slideDuplicatePrevClass", wrapperClass: "wrapperClass", runCallbacksOnInit: "runCallbacksOnInit", observeParents: "observeParents", observeSlideChildren: "observeSlideChildren", a11y: "a11y", autoplay: "autoplay", controller: "controller", coverflowEffect: "coverflowEffect", cubeEffect: "cubeEffect", fadeEffect: "fadeEffect", flipEffect: "flipEffect", creativeEffect: "creativeEffect", cardsEffect: "cardsEffect", hashNavigation: "hashNavigation", history: "history", keyboard: "keyboard", lazy: "lazy", mousewheel: "mousewheel", parallax: "parallax", thumbs: "thumbs", zoom: "zoom", class: "class", id: "id", navigation: "navigation", pagination: "pagination", scrollbar: "scrollbar", virtual: "virtual", config: "config" }, outputs: { s__beforeBreakpoint: "_beforeBreakpoint", s__containerClasses: "_containerClasses", s__slideClass: "_slideClass", s__swiper: "_swiper", s_activeIndexChange: "activeIndexChange", s_afterInit: "afterInit", s_autoplay: "autoplay", s_autoplayStart: "autoplayStart", s_autoplayStop: "autoplayStop", s_autoplayPause: "autoplayPause", s_autoplayResume: "autoplayResume", s_beforeDestroy: "beforeDestroy", s_beforeInit: "beforeInit", s_beforeLoopFix: "beforeLoopFix", s_beforeResize: "beforeResize", s_beforeSlideChangeStart: "beforeSlideChangeStart", s_beforeTransitionStart: "beforeTransitionStart", s_breakpoint: "breakpoint", s_changeDirection: "changeDirection", s_click: "click", s_doubleTap: "doubleTap", s_doubleClick: "doubleClick", s_destroy: "destroy", s_fromEdge: "fromEdge", s_hashChange: "hashChange", s_hashSet: "hashSet", s_imagesReady: "imagesReady", s_init: "init", s_keyPress: "keyPress", s_lazyImageLoad: "lazyImageLoad", s_lazyImageReady: "lazyImageReady", s_loopFix: "loopFix", s_momentumBounce: "momentumBounce", s_navigationHide: "navigationHide", s_navigationShow: "navigationShow", s_observerUpdate: "observerUpdate", s_orientationchange: "orientationchange", s_paginationHide: "paginationHide", s_paginationRender: "paginationRender", s_paginationShow: "paginationShow", s_paginationUpdate: "paginationUpdate", s_progress: "progress", s_reachBeginning: "reachBeginning", s_reachEnd: "reachEnd", s_realIndexChange: "realIndexChange", s_resize: "resize", s_scroll: "scroll", s_scrollbarDragEnd: "scrollbarDragEnd", s_scrollbarDragMove: "scrollbarDragMove", s_scrollbarDragStart: "scrollbarDragStart", s_setTransition: "setTransition", s_setTranslate: "setTranslate", s_slideChange: "slideChange", s_slideChangeTransitionEnd: "slideChangeTransitionEnd", s_slideChangeTransitionStart: "slideChangeTransitionStart", s_slideNextTransitionEnd: "slideNextTransitionEnd", s_slideNextTransitionStart: "slideNextTransitionStart", s_slidePrevTransitionEnd: "slidePrevTransitionEnd", s_slidePrevTransitionStart: "slidePrevTransitionStart", s_slideResetTransitionStart: "slideResetTransitionStart", s_slideResetTransitionEnd: "slideResetTransitionEnd", s_sliderMove: "sliderMove", s_sliderFirstMove: "sliderFirstMove", s_slidesLengthChange: "slidesLengthChange", s_slidesGridLengthChange: "slidesGridLengthChange", s_snapGridLengthChange: "snapGridLengthChange", s_snapIndexChange: "snapIndexChange", s_tap: "tap", s_toEdge: "toEdge", s_touchEnd: "touchEnd", s_touchMove: "touchMove", s_touchMoveOpposite: "touchMoveOpposite", s_touchStart: "touchStart", s_transitionEnd: "transitionEnd", s_transitionStart: "transitionStart", s_update: "update", s_zoomChange: "zoomChange", s_swiper: "swiper", s_unlock: "unlock" }, host: { properties: { "class": "this.containerClasses" } }, queries: [{ propertyName: "slidesEl", predicate: SwiperSlideDirective }], viewQueries: [{ propertyName: "prevElRef", first: true, predicate: ["prevElRef"], descendants: true }, { propertyName: "nextElRef", first: true, predicate: ["nextElRef"], descendants: true }, { propertyName: "scrollbarElRef", first: true, predicate: ["scrollbarElRef"], descendants: true }, { propertyName: "paginationElRef", first: true, predicate: ["paginationElRef"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<ng-content select=\"[slot=container-start]\"></ng-content>\n<ng-container *ngIf=\"navigation && showNavigation\">\n  <div class=\"swiper-button-prev\" #prevElRef></div>\n  <div class=\"swiper-button-next\" #nextElRef></div>\n</ng-container>\n<div *ngIf=\"scrollbar && showScrollbar\" class=\"swiper-scrollbar\" #scrollbarElRef></div>\n<div *ngIf=\"pagination && showPagination\" class=\"swiper-pagination\" #paginationElRef></div>\n<div [ngClass]=\"wrapperClass\" [attr.id]=\"id\">\n  <ng-content select=\"[slot=wrapper-start]\"></ng-content>\n  <ng-template\n    *ngTemplateOutlet=\"\n      slidesTemplate;\n      context: {\n        loopSlides: prependSlides,\n        key: 'prepend'\n      }\n    \"\n  ></ng-template>\n  <ng-template\n    *ngTemplateOutlet=\"\n      slidesTemplate;\n      context: {\n        loopSlides: activeSlides,\n        key: ''\n      }\n    \"\n  ></ng-template>\n  <ng-template\n    *ngTemplateOutlet=\"\n      slidesTemplate;\n      context: {\n        loopSlides: appendSlides,\n        key: 'append'\n      }\n    \"\n  ></ng-template>\n  <ng-content select=\"[slot=wrapper-end]\"></ng-content>\n</div>\n<ng-content select=\"[slot=container-end]\"></ng-content>\n\n<ng-template #slidesTemplate let-loopSlides=\"loopSlides\" let-slideKey=\"key\">\n  <div\n    *ngFor=\"let slide of loopSlides | async\"\n    [ngClass]=\"\n      (slide.class ? slide.class + ' ' : '') +\n      slideClass +\n      (slideKey !== '' ? ' ' + slideDuplicateClass : '')\n    \"\n    [attr.data-swiper-slide-index]=\"slide.virtualIndex ? slide.virtualIndex : slide.slideIndex\"\n    [attr.data-swiper-autoplay]=\"slide.autoplayDelay\"\n    [style]=\"style\"\n    [ngSwitch]=\"slide.zoom\"\n  >\n    <div *ngSwitchCase=\"true\" [ngClass]=\"zoomContainerClass\">\n      <ng-template\n        [ngTemplateOutlet]=\"slide.template\"\n        [ngTemplateOutletContext]=\"{\n          $implicit: slide.slideData\n        }\"\n      ></ng-template>\n    </div>\n    <ng-container *ngSwitchDefault>\n      <ng-template\n        [ngTemplateOutlet]=\"slide.template\"\n        [ngTemplateOutletContext]=\"{\n          $implicit: slide.slideData\n        }\"\n      ></ng-template>\n    </ng-container>\n  </div>\n</ng-template>\n", styles: ["swiper{display:block}\n"], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { type: i1.NgSwitchDefault, selector: "[ngSwitchDefault]" }], pipes: { "async": i1.AsyncPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: SwiperComponent, decorators: [{
            type: Component,
            args: [{ selector: 'swiper, [swiper]', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, styles: [
                        `
      swiper {
        display: block;
      }
    `,
                    ], template: "<ng-content select=\"[slot=container-start]\"></ng-content>\n<ng-container *ngIf=\"navigation && showNavigation\">\n  <div class=\"swiper-button-prev\" #prevElRef></div>\n  <div class=\"swiper-button-next\" #nextElRef></div>\n</ng-container>\n<div *ngIf=\"scrollbar && showScrollbar\" class=\"swiper-scrollbar\" #scrollbarElRef></div>\n<div *ngIf=\"pagination && showPagination\" class=\"swiper-pagination\" #paginationElRef></div>\n<div [ngClass]=\"wrapperClass\" [attr.id]=\"id\">\n  <ng-content select=\"[slot=wrapper-start]\"></ng-content>\n  <ng-template\n    *ngTemplateOutlet=\"\n      slidesTemplate;\n      context: {\n        loopSlides: prependSlides,\n        key: 'prepend'\n      }\n    \"\n  ></ng-template>\n  <ng-template\n    *ngTemplateOutlet=\"\n      slidesTemplate;\n      context: {\n        loopSlides: activeSlides,\n        key: ''\n      }\n    \"\n  ></ng-template>\n  <ng-template\n    *ngTemplateOutlet=\"\n      slidesTemplate;\n      context: {\n        loopSlides: appendSlides,\n        key: 'append'\n      }\n    \"\n  ></ng-template>\n  <ng-content select=\"[slot=wrapper-end]\"></ng-content>\n</div>\n<ng-content select=\"[slot=container-end]\"></ng-content>\n\n<ng-template #slidesTemplate let-loopSlides=\"loopSlides\" let-slideKey=\"key\">\n  <div\n    *ngFor=\"let slide of loopSlides | async\"\n    [ngClass]=\"\n      (slide.class ? slide.class + ' ' : '') +\n      slideClass +\n      (slideKey !== '' ? ' ' + slideDuplicateClass : '')\n    \"\n    [attr.data-swiper-slide-index]=\"slide.virtualIndex ? slide.virtualIndex : slide.slideIndex\"\n    [attr.data-swiper-autoplay]=\"slide.autoplayDelay\"\n    [style]=\"style\"\n    [ngSwitch]=\"slide.zoom\"\n  >\n    <div *ngSwitchCase=\"true\" [ngClass]=\"zoomContainerClass\">\n      <ng-template\n        [ngTemplateOutlet]=\"slide.template\"\n        [ngTemplateOutletContext]=\"{\n          $implicit: slide.slideData\n        }\"\n      ></ng-template>\n    </div>\n    <ng-container *ngSwitchDefault>\n      <ng-template\n        [ngTemplateOutlet]=\"slide.template\"\n        [ngTemplateOutletContext]=\"{\n          $implicit: slide.slideData\n        }\"\n      ></ng-template>\n    </ng-container>\n  </div>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { enabled: [{
                type: Input
            }], on: [{
                type: Input
            }], direction: [{
                type: Input
            }], touchEventsTarget: [{
                type: Input
            }], initialSlide: [{
                type: Input
            }], speed: [{
                type: Input
            }], cssMode: [{
                type: Input
            }], updateOnWindowResize: [{
                type: Input
            }], resizeObserver: [{
                type: Input
            }], nested: [{
                type: Input
            }], focusableElements: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], preventInteractionOnTransition: [{
                type: Input
            }], userAgent: [{
                type: Input
            }], url: [{
                type: Input
            }], edgeSwipeDetection: [{
                type: Input
            }], edgeSwipeThreshold: [{
                type: Input
            }], freeMode: [{
                type: Input
            }], autoHeight: [{
                type: Input
            }], setWrapperSize: [{
                type: Input
            }], virtualTranslate: [{
                type: Input
            }], effect: [{
                type: Input
            }], breakpoints: [{
                type: Input
            }], spaceBetween: [{
                type: Input
            }], slidesPerView: [{
                type: Input
            }], maxBackfaceHiddenSlides: [{
                type: Input
            }], grid: [{
                type: Input
            }], slidesPerGroup: [{
                type: Input
            }], slidesPerGroupSkip: [{
                type: Input
            }], centeredSlides: [{
                type: Input
            }], centeredSlidesBounds: [{
                type: Input
            }], slidesOffsetBefore: [{
                type: Input
            }], slidesOffsetAfter: [{
                type: Input
            }], normalizeSlideIndex: [{
                type: Input
            }], centerInsufficientSlides: [{
                type: Input
            }], watchOverflow: [{
                type: Input
            }], roundLengths: [{
                type: Input
            }], touchRatio: [{
                type: Input
            }], touchAngle: [{
                type: Input
            }], simulateTouch: [{
                type: Input
            }], shortSwipes: [{
                type: Input
            }], longSwipes: [{
                type: Input
            }], longSwipesRatio: [{
                type: Input
            }], longSwipesMs: [{
                type: Input
            }], followFinger: [{
                type: Input
            }], allowTouchMove: [{
                type: Input
            }], threshold: [{
                type: Input
            }], touchMoveStopPropagation: [{
                type: Input
            }], touchStartPreventDefault: [{
                type: Input
            }], touchStartForcePreventDefault: [{
                type: Input
            }], touchReleaseOnEdges: [{
                type: Input
            }], uniqueNavElements: [{
                type: Input
            }], resistance: [{
                type: Input
            }], resistanceRatio: [{
                type: Input
            }], watchSlidesProgress: [{
                type: Input
            }], grabCursor: [{
                type: Input
            }], preventClicks: [{
                type: Input
            }], preventClicksPropagation: [{
                type: Input
            }], slideToClickedSlide: [{
                type: Input
            }], preloadImages: [{
                type: Input
            }], updateOnImagesReady: [{
                type: Input
            }], loop: [{
                type: Input
            }], loopAdditionalSlides: [{
                type: Input
            }], loopedSlides: [{
                type: Input
            }], loopFillGroupWithBlank: [{
                type: Input
            }], loopPreventsSlide: [{
                type: Input
            }], rewind: [{
                type: Input
            }], allowSlidePrev: [{
                type: Input
            }], allowSlideNext: [{
                type: Input
            }], swipeHandler: [{
                type: Input
            }], noSwiping: [{
                type: Input
            }], noSwipingClass: [{
                type: Input
            }], noSwipingSelector: [{
                type: Input
            }], passiveListeners: [{
                type: Input
            }], containerModifierClass: [{
                type: Input
            }], slideClass: [{
                type: Input
            }], slideBlankClass: [{
                type: Input
            }], slideActiveClass: [{
                type: Input
            }], slideDuplicateActiveClass: [{
                type: Input
            }], slideVisibleClass: [{
                type: Input
            }], slideDuplicateClass: [{
                type: Input
            }], slideNextClass: [{
                type: Input
            }], slideDuplicateNextClass: [{
                type: Input
            }], slidePrevClass: [{
                type: Input
            }], slideDuplicatePrevClass: [{
                type: Input
            }], wrapperClass: [{
                type: Input
            }], runCallbacksOnInit: [{
                type: Input
            }], observeParents: [{
                type: Input
            }], observeSlideChildren: [{
                type: Input
            }], a11y: [{
                type: Input
            }], autoplay: [{
                type: Input
            }], controller: [{
                type: Input
            }], coverflowEffect: [{
                type: Input
            }], cubeEffect: [{
                type: Input
            }], fadeEffect: [{
                type: Input
            }], flipEffect: [{
                type: Input
            }], creativeEffect: [{
                type: Input
            }], cardsEffect: [{
                type: Input
            }], hashNavigation: [{
                type: Input
            }], history: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], lazy: [{
                type: Input
            }], mousewheel: [{
                type: Input
            }], parallax: [{
                type: Input
            }], thumbs: [{
                type: Input
            }], zoom: [{
                type: Input
            }], class: [{
                type: Input
            }], id: [{
                type: Input
            }], navigation: [{
                type: Input
            }], pagination: [{
                type: Input
            }], scrollbar: [{
                type: Input
            }], virtual: [{
                type: Input
            }], config: [{
                type: Input
            }], s__beforeBreakpoint: [{
                type: Output,
                args: ['_beforeBreakpoint']
            }], s__containerClasses: [{
                type: Output,
                args: ['_containerClasses']
            }], s__slideClass: [{
                type: Output,
                args: ['_slideClass']
            }], s__swiper: [{
                type: Output,
                args: ['_swiper']
            }], s_activeIndexChange: [{
                type: Output,
                args: ['activeIndexChange']
            }], s_afterInit: [{
                type: Output,
                args: ['afterInit']
            }], s_autoplay: [{
                type: Output,
                args: ['autoplay']
            }], s_autoplayStart: [{
                type: Output,
                args: ['autoplayStart']
            }], s_autoplayStop: [{
                type: Output,
                args: ['autoplayStop']
            }], s_autoplayPause: [{
                type: Output,
                args: ['autoplayPause']
            }], s_autoplayResume: [{
                type: Output,
                args: ['autoplayResume']
            }], s_beforeDestroy: [{
                type: Output,
                args: ['beforeDestroy']
            }], s_beforeInit: [{
                type: Output,
                args: ['beforeInit']
            }], s_beforeLoopFix: [{
                type: Output,
                args: ['beforeLoopFix']
            }], s_beforeResize: [{
                type: Output,
                args: ['beforeResize']
            }], s_beforeSlideChangeStart: [{
                type: Output,
                args: ['beforeSlideChangeStart']
            }], s_beforeTransitionStart: [{
                type: Output,
                args: ['beforeTransitionStart']
            }], s_breakpoint: [{
                type: Output,
                args: ['breakpoint']
            }], s_changeDirection: [{
                type: Output,
                args: ['changeDirection']
            }], s_click: [{
                type: Output,
                args: ['click']
            }], s_doubleTap: [{
                type: Output,
                args: ['doubleTap']
            }], s_doubleClick: [{
                type: Output,
                args: ['doubleClick']
            }], s_destroy: [{
                type: Output,
                args: ['destroy']
            }], s_fromEdge: [{
                type: Output,
                args: ['fromEdge']
            }], s_hashChange: [{
                type: Output,
                args: ['hashChange']
            }], s_hashSet: [{
                type: Output,
                args: ['hashSet']
            }], s_imagesReady: [{
                type: Output,
                args: ['imagesReady']
            }], s_init: [{
                type: Output,
                args: ['init']
            }], s_keyPress: [{
                type: Output,
                args: ['keyPress']
            }], s_lazyImageLoad: [{
                type: Output,
                args: ['lazyImageLoad']
            }], s_lazyImageReady: [{
                type: Output,
                args: ['lazyImageReady']
            }], s_loopFix: [{
                type: Output,
                args: ['loopFix']
            }], s_momentumBounce: [{
                type: Output,
                args: ['momentumBounce']
            }], s_navigationHide: [{
                type: Output,
                args: ['navigationHide']
            }], s_navigationShow: [{
                type: Output,
                args: ['navigationShow']
            }], s_observerUpdate: [{
                type: Output,
                args: ['observerUpdate']
            }], s_orientationchange: [{
                type: Output,
                args: ['orientationchange']
            }], s_paginationHide: [{
                type: Output,
                args: ['paginationHide']
            }], s_paginationRender: [{
                type: Output,
                args: ['paginationRender']
            }], s_paginationShow: [{
                type: Output,
                args: ['paginationShow']
            }], s_paginationUpdate: [{
                type: Output,
                args: ['paginationUpdate']
            }], s_progress: [{
                type: Output,
                args: ['progress']
            }], s_reachBeginning: [{
                type: Output,
                args: ['reachBeginning']
            }], s_reachEnd: [{
                type: Output,
                args: ['reachEnd']
            }], s_realIndexChange: [{
                type: Output,
                args: ['realIndexChange']
            }], s_resize: [{
                type: Output,
                args: ['resize']
            }], s_scroll: [{
                type: Output,
                args: ['scroll']
            }], s_scrollbarDragEnd: [{
                type: Output,
                args: ['scrollbarDragEnd']
            }], s_scrollbarDragMove: [{
                type: Output,
                args: ['scrollbarDragMove']
            }], s_scrollbarDragStart: [{
                type: Output,
                args: ['scrollbarDragStart']
            }], s_setTransition: [{
                type: Output,
                args: ['setTransition']
            }], s_setTranslate: [{
                type: Output,
                args: ['setTranslate']
            }], s_slideChange: [{
                type: Output,
                args: ['slideChange']
            }], s_slideChangeTransitionEnd: [{
                type: Output,
                args: ['slideChangeTransitionEnd']
            }], s_slideChangeTransitionStart: [{
                type: Output,
                args: ['slideChangeTransitionStart']
            }], s_slideNextTransitionEnd: [{
                type: Output,
                args: ['slideNextTransitionEnd']
            }], s_slideNextTransitionStart: [{
                type: Output,
                args: ['slideNextTransitionStart']
            }], s_slidePrevTransitionEnd: [{
                type: Output,
                args: ['slidePrevTransitionEnd']
            }], s_slidePrevTransitionStart: [{
                type: Output,
                args: ['slidePrevTransitionStart']
            }], s_slideResetTransitionStart: [{
                type: Output,
                args: ['slideResetTransitionStart']
            }], s_slideResetTransitionEnd: [{
                type: Output,
                args: ['slideResetTransitionEnd']
            }], s_sliderMove: [{
                type: Output,
                args: ['sliderMove']
            }], s_sliderFirstMove: [{
                type: Output,
                args: ['sliderFirstMove']
            }], s_slidesLengthChange: [{
                type: Output,
                args: ['slidesLengthChange']
            }], s_slidesGridLengthChange: [{
                type: Output,
                args: ['slidesGridLengthChange']
            }], s_snapGridLengthChange: [{
                type: Output,
                args: ['snapGridLengthChange']
            }], s_snapIndexChange: [{
                type: Output,
                args: ['snapIndexChange']
            }], s_tap: [{
                type: Output,
                args: ['tap']
            }], s_toEdge: [{
                type: Output,
                args: ['toEdge']
            }], s_touchEnd: [{
                type: Output,
                args: ['touchEnd']
            }], s_touchMove: [{
                type: Output,
                args: ['touchMove']
            }], s_touchMoveOpposite: [{
                type: Output,
                args: ['touchMoveOpposite']
            }], s_touchStart: [{
                type: Output,
                args: ['touchStart']
            }], s_transitionEnd: [{
                type: Output,
                args: ['transitionEnd']
            }], s_transitionStart: [{
                type: Output,
                args: ['transitionStart']
            }], s_update: [{
                type: Output,
                args: ['update']
            }], s_zoomChange: [{
                type: Output,
                args: ['zoomChange']
            }], s_swiper: [{
                type: Output,
                args: ['swiper']
            }], s_unlock: [{
                type: Output,
                args: ['unlock']
            }], prevElRef: [{
                type: ViewChild,
                args: ['prevElRef', { static: false }]
            }], nextElRef: [{
                type: ViewChild,
                args: ['nextElRef', { static: false }]
            }], scrollbarElRef: [{
                type: ViewChild,
                args: ['scrollbarElRef', { static: false }]
            }], paginationElRef: [{
                type: ViewChild,
                args: ['paginationElRef', { static: false }]
            }], slidesEl: [{
                type: ContentChildren,
                args: [SwiperSlideDirective, { descendants: false, emitDistinctChangesOnly: true }]
            }], containerClasses: [{
                type: HostBinding,
                args: ['class']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpcGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hbmd1bGFyL3NyYy9zd2lwZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL2FuZ3VsYXIvc3JjL3N3aXBlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxlQUFlLEVBRWYsWUFBWSxFQUNaLFdBQVcsRUFDWCxNQUFNLEVBQ04sS0FBSyxFQUdMLE1BQU0sRUFDTixXQUFXLEVBR1gsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQ0wsTUFBTSxFQUNOLFFBQVEsRUFDUixXQUFXLEVBQ1gsaUJBQWlCLEVBQ2pCLHFCQUFxQixFQUNyQixRQUFRLEVBQ1IsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBU3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFjcEQsTUFBTSxPQUFPLGVBQWU7SUFpZjFCLFlBQ1UsT0FBZSxFQUNmLFVBQXNCLEVBQ3RCLGtCQUFxQyxFQUNoQixXQUFtQjtRQUh4QyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ2hCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBeGF6QyxlQUFVLEdBQWdDLGNBQWMsQ0FBQztRQVV6RCxp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biAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBQTEFURk9STV9JRCxcbiAgUXVlcnlMaXN0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBTd2lwZXIgZnJvbSAnc3dpcGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBnZXRQYXJhbXMgfSBmcm9tICcuL3V0aWxzL2dldC1wYXJhbXMnO1xuaW1wb3J0IHsgU3dpcGVyU2xpZGVEaXJlY3RpdmUgfSBmcm9tICcuL3N3aXBlci1zbGlkZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHtcbiAgZXh0ZW5kLFxuICBpc09iamVjdCxcbiAgc2V0UHJvcGVydHksXG4gIGlnbm9yZU5nT25DaGFuZ2VzLFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGlzU2hvd0VsLFxuICBpc0VuYWJsZWQsXG59IGZyb20gJy4vdXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtcbiAgU3dpcGVyT3B0aW9ucyxcbiAgU3dpcGVyRXZlbnRzLFxuICBOYXZpZ2F0aW9uT3B0aW9ucyxcbiAgUGFnaW5hdGlvbk9wdGlvbnMsXG4gIFNjcm9sbGJhck9wdGlvbnMsXG4gIFZpcnR1YWxPcHRpb25zLFxufSBmcm9tICdzd2lwZXIvdHlwZXMnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc3dpcGVyLCBbc3dpcGVyXScsXG4gIHRlbXBsYXRlVXJsOiAnLi9zd2lwZXIuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgc3dpcGVyIHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICB9XG4gICAgYCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgU3dpcGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgZW5hYmxlZDogU3dpcGVyT3B0aW9uc1snZW5hYmxlZCddO1xuICBASW5wdXQoKSBvbjogU3dpcGVyT3B0aW9uc1snb24nXTtcbiAgQElucHV0KCkgZGlyZWN0aW9uOiBTd2lwZXJPcHRpb25zWydkaXJlY3Rpb24nXTtcbiAgQElucHV0KCkgdG91Y2hFdmVudHNUYXJnZXQ6IFN3aXBlck9wdGlvbnNbJ3RvdWNoRXZlbnRzVGFyZ2V0J107XG4gIEBJbnB1dCgpIGluaXRpYWxTbGlkZTogU3dpcGVyT3B0aW9uc1snaW5pdGlhbFNsaWRlJ107XG4gIEBJbnB1dCgpIHNwZWVkOiBTd2lwZXJPcHRpb25zWydzcGVlZCddO1xuICBASW5wdXQoKSBjc3NNb2RlOiBTd2lwZXJPcHRpb25zWydjc3NNb2RlJ107XG4gIEBJbnB1dCgpIHVwZGF0ZU9uV2luZG93UmVzaXplOiBTd2lwZXJPcHRpb25zWyd1cGRhdGVPbldpbmRvd1Jlc2l6ZSddO1xuICBASW5wdXQoKSByZXNpemVPYnNlcnZlcjogU3dpcGVyT3B0aW9uc1sncmVzaXplT2JzZXJ2ZXInXTtcbiAgQElucHV0KCkgbmVzdGVkOiBTd2lwZXJPcHRpb25zWyduZXN0ZWQnXTtcbiAgQElucHV0KCkgZm9jdXNhYmxlRWxlbWVudHM6IFN3aXBlck9wdGlvbnNbJ2ZvY3VzYWJsZUVsZW1lbnRzJ107XG4gIEBJbnB1dCgpIHdpZHRoOiBTd2lwZXJPcHRpb25zWyd3aWR0aCddO1xuICBASW5wdXQoKSBoZWlnaHQ6IFN3aXBlck9wdGlvbnNbJ2hlaWdodCddO1xuICBASW5wdXQoKSBwcmV2ZW50SW50ZXJhY3Rpb25PblRyYW5zaXRpb246IFN3aXBlck9wdGlvbnNbJ3ByZXZlbnRJbnRlcmFjdGlvbk9uVHJhbnNpdGlvbiddO1xuICBASW5wdXQoKSB1c2VyQWdlbnQ6IFN3aXBlck9wdGlvbnNbJ3VzZXJBZ2VudCddO1xuICBASW5wdXQoKSB1cmw6IFN3aXBlck9wdGlvbnNbJ3VybCddO1xuICBASW5wdXQoKSBlZGdlU3dpcGVEZXRlY3Rpb246IGJvb2xlYW4gfCBzdHJpbmc7XG4gIEBJbnB1dCgpIGVkZ2VTd2lwZVRocmVzaG9sZDogbnVtYmVyO1xuICBASW5wdXQoKSBmcmVlTW9kZTogU3dpcGVyT3B0aW9uc1snZnJlZU1vZGUnXTtcbiAgQElucHV0KCkgYXV0b0hlaWdodDogU3dpcGVyT3B0aW9uc1snYXV0b0hlaWdodCddO1xuICBASW5wdXQoKSBzZXRXcmFwcGVyU2l6ZTogU3dpcGVyT3B0aW9uc1snc2V0V3JhcHBlclNpemUnXTtcbiAgQElucHV0KCkgdmlydHVhbFRyYW5zbGF0ZTogU3dpcGVyT3B0aW9uc1sndmlydHVhbFRyYW5zbGF0ZSddO1xuICBASW5wdXQoKSBlZmZlY3Q6IFN3aXBlck9wdGlvbnNbJ2VmZmVjdCddO1xuICBASW5wdXQoKSBicmVha3BvaW50czogU3dpcGVyT3B0aW9uc1snYnJlYWtwb2ludHMnXTtcbiAgQElucHV0KCkgc3BhY2VCZXR3ZWVuOiBTd2lwZXJPcHRpb25zWydzcGFjZUJldHdlZW4nXTtcbiAgQElucHV0KCkgc2xpZGVzUGVyVmlldzogU3dpcGVyT3B0aW9uc1snc2xpZGVzUGVyVmlldyddO1xuICBASW5wdXQoKSBtYXhCYWNrZmFjZUhpZGRlblNsaWRlczogU3dpcGVyT3B0aW9uc1snbWF4QmFja2ZhY2VIaWRkZW5TbGlkZXMnXTtcbiAgQElucHV0KCkgZ3JpZDogU3dpcGVyT3B0aW9uc1snZ3JpZCddO1xuICBASW5wdXQoKSBzbGlkZXNQZXJHcm91cDogU3dpcGVyT3B0aW9uc1snc2xpZGVzUGVyR3JvdXAnXTtcbiAgQElucHV0KCkgc2xpZGVzUGVyR3JvdXBTa2lwOiBTd2lwZXJPcHRpb25zWydzbGlkZXNQZXJHcm91cFNraXAnXTtcbiAgQElucHV0KCkgY2VudGVyZWRTbGlkZXM6IFN3aXBlck9wdGlvbnNbJ2NlbnRlcmVkU2xpZGVzJ107XG4gIEBJbnB1dCgpIGNlbnRlcmVkU2xpZGVzQm91bmRzOiBTd2lwZXJPcHRpb25zWydjZW50ZXJlZFNsaWRlc0JvdW5kcyddO1xuICBASW5wdXQoKSBzbGlkZXNPZmZzZXRCZWZvcmU6IFN3aXBlck9wdGlvbnNbJ3NsaWRlc09mZnNldEJlZm9yZSddO1xuICBASW5wdXQoKSBzbGlkZXNPZmZzZXRBZnRlcjogU3dpcGVyT3B0aW9uc1snc2xpZGVzT2Zmc2V0QWZ0ZXInXTtcbiAgQElucHV0KCkgbm9ybWFsaXplU2xpZGVJbmRleDogU3dpcGVyT3B0aW9uc1snbm9ybWFsaXplU2xpZGVJbmRleCddO1xuICBASW5wdXQoKSBjZW50ZXJJbnN1ZmZpY2llbnRTbGlkZXM6IFN3aXBlck9wdGlvbnNbJ2NlbnRlckluc3VmZmljaWVudFNsaWRlcyddO1xuICBASW5wdXQoKSB3YXRjaE92ZXJmbG93OiBTd2lwZXJPcHRpb25zWyd3YXRjaE92ZXJmbG93J107XG4gIEBJbnB1dCgpIHJvdW5kTGVuZ3RoczogU3dpcGVyT3B0aW9uc1sncm91bmRMZW5ndGhzJ107XG4gIEBJbnB1dCgpIHRvdWNoUmF0aW86IFN3aXBlck9wdGlvbnNbJ3RvdWNoUmF0aW8nXTtcbiAgQElucHV0KCkgdG91Y2hBbmdsZTogU3dpcGVyT3B0aW9uc1sndG91Y2hBbmdsZSddO1xuICBASW5wdXQoKSBzaW11bGF0ZVRvdWNoOiBTd2lwZXJPcHRpb25zWydzaW11bGF0ZVRvdWNoJ107XG4gIEBJbnB1dCgpIHNob3J0U3dpcGVzOiBTd2lwZXJPcHRpb25zWydzaG9ydFN3aXBlcyddO1xuICBASW5wdXQoKSBsb25nU3dpcGVzOiBTd2lwZXJPcHRpb25zWydsb25nU3dpcGVzJ107XG4gIEBJbnB1dCgpIGxvbmdTd2lwZXNSYXRpbzogU3dpcGVyT3B0aW9uc1snbG9uZ1N3aXBlc1JhdGlvJ107XG4gIEBJbnB1dCgpIGxvbmdTd2lwZXNNczogU3dpcGVyT3B0aW9uc1snbG9uZ1N3aXBlc01zJ107XG4gIEBJbnB1dCgpIGZvbGxvd0ZpbmdlcjogU3dpcGVyT3B0aW9uc1snZm9sbG93RmluZ2VyJ107XG4gIEBJbnB1dCgpIGFsbG93VG91Y2hNb3ZlOiBTd2lwZXJPcHRpb25zWydhbGxvd1RvdWNoTW92ZSddO1xuICBASW5wdXQoKSB0aHJlc2hvbGQ6IFN3aXBlck9wdGlvbnNbJ3RocmVzaG9sZCddO1xuICBASW5wdXQoKSB0b3VjaE1vdmVTdG9wUHJvcGFnYXRpb246IFN3aXBlck9wdGlvbnNbJ3RvdWNoTW92ZVN0b3BQcm9wYWdhdGlvbiddO1xuICBASW5wdXQoKSB0b3VjaFN0YXJ0UHJldmVudERlZmF1bHQ6IFN3aXBlck9wdGlvbnNbJ3RvdWNoU3RhcnRQcmV2ZW50RGVmYXVsdCddO1xuICBASW5wdXQoKSB0b3VjaFN0YXJ0Rm9yY2VQcmV2ZW50RGVmYXVsdDogU3dpcGVyT3B0aW9uc1sndG91Y2hTdGFydEZvcmNlUHJldmVudERlZmF1bHQnXTtcbiAgQElucHV0KCkgdG91Y2hSZWxlYXNlT25FZGdlczogU3dpcGVyT3B0aW9uc1sndG91Y2hSZWxlYXNlT25FZGdlcyddO1xuICBASW5wdXQoKSB1bmlxdWVOYXZFbGVtZW50czogU3dpcGVyT3B0aW9uc1sndW5pcXVlTmF2RWxlbWVudHMnXTtcbiAgQElucHV0KCkgcmVzaXN0YW5jZTogU3dpcGVyT3B0aW9uc1sncmVzaXN0YW5jZSddO1xuICBASW5wdXQoKSByZXNpc3RhbmNlUmF0aW86IFN3aXBlck9wdGlvbnNbJ3Jlc2lzdGFuY2VSYXRpbyddO1xuICBASW5wdXQoKSB3YXRjaFNsaWRlc1Byb2dyZXNzOiBTd2lwZXJPcHRpb25zWyd3YXRjaFNsaWRlc1Byb2dyZXNzJ107XG4gIEBJbnB1dCgpIGdyYWJDdXJzb3I6IFN3aXBlck9wdGlvbnNbJ2dyYWJDdXJzb3InXTtcbiAgQElucHV0KCkgcHJldmVudENsaWNrczogU3dpcGVyT3B0aW9uc1sncHJldmVudENsaWNrcyddO1xuICBASW5wdXQoKSBwcmV2ZW50Q2xpY2tzUHJvcGFnYXRpb246IFN3aXBlck9wdGlvbnNbJ3ByZXZlbnRDbGlja3NQcm9wYWdhdGlvbiddO1xuICBASW5wdXQoKSBzbGlkZVRvQ2xpY2tlZFNsaWRlOiBTd2lwZXJPcHRpb25zWydzbGlkZVRvQ2xpY2tlZFNsaWRlJ107XG4gIEBJbnB1dCgpIHByZWxvYWRJbWFnZXM6IFN3aXBlck9wdGlvbnNbJ3ByZWxvYWRJbWFnZXMnXTtcbiAgQElucHV0KCkgdXBkYXRlT25JbWFnZXNSZWFkeTogU3dpcGVyT3B0aW9uc1sndXBkYXRlT25JbWFnZXNSZWFkeSddO1xuICBASW5wdXQoKSBsb29wOiBTd2lwZXJPcHRpb25zWydsb29wJ107XG4gIEBJbnB1dCgpIGxvb3BBZGRpdGlvbmFsU2xpZGVzOiBTd2lwZXJPcHRpb25zWydsb29wQWRkaXRpb25hbFNsaWRlcyddO1xuICBASW5wdXQoKSBsb29wZWRTbGlkZXM6IFN3aXBlck9wdGlvbnNbJ2xvb3BlZFNsaWRlcyddO1xuICBASW5wdXQoKSBsb29wRmlsbEdyb3VwV2l0aEJsYW5rOiBTd2lwZXJPcHRpb25zWydsb29wRmlsbEdyb3VwV2l0aEJsYW5rJ107XG4gIEBJbnB1dCgpIGxvb3BQcmV2ZW50c1NsaWRlOiBTd2lwZXJPcHRpb25zWydsb29wUHJldmVudHNTbGlkZSddO1xuICBASW5wdXQoKSByZXdpbmQ6IFN3aXBlck9wdGlvbnNbJ3Jld2luZCddO1xuICBASW5wdXQoKSBhbGxvd1NsaWRlUHJldjogU3dpcGVyT3B0aW9uc1snYWxsb3dTbGlkZVByZXYnXTtcbiAgQElucHV0KCkgYWxsb3dTbGlkZU5leHQ6IFN3aXBlck9wdGlvbnNbJ2FsbG93U2xpZGVOZXh0J107XG4gIEBJbnB1dCgpIHN3aXBlSGFuZGxlcjogU3dpcGVyT3B0aW9uc1snc3dpcGVIYW5kbGVyJ107XG4gIEBJbnB1dCgpIG5vU3dpcGluZzogU3dpcGVyT3B0aW9uc1snbm9Td2lwaW5nJ107XG4gIEBJbnB1dCgpIG5vU3dpcGluZ0NsYXNzOiBTd2lwZXJPcHRpb25zWydub1N3aXBpbmdDbGFzcyddO1xuICBASW5wdXQoKSBub1N3aXBpbmdTZWxlY3RvcjogU3dpcGVyT3B0aW9uc1snbm9Td2lwaW5nU2VsZWN0b3InXTtcbiAgQElucHV0KCkgcGFzc2l2ZUxpc3RlbmVyczogU3dpcGVyT3B0aW9uc1sncGFzc2l2ZUxpc3RlbmVycyddO1xuICBASW5wdXQoKSBjb250YWluZXJNb2RpZmllckNsYXNzOiBTd2lwZXJPcHRpb25zWydjb250YWluZXJNb2RpZmllckNsYXNzJ107XG4gIEBJbnB1dCgpIHNsaWRlQ2xhc3M6IFN3aXBlck9wdGlvbnNbJ3NsaWRlQ2xhc3MnXSA9ICdzd2lwZXItc2xpZGUnO1xuICBASW5wdXQoKSBzbGlkZUJsYW5rQ2xhc3M6IFN3aXBlck9wdGlvbnNbJ3NsaWRlQmxhbmtDbGFzcyddO1xuICBASW5wdXQoKSBzbGlkZUFjdGl2ZUNsYXNzOiBTd2lwZXJPcHRpb25zWydzbGlkZUFjdGl2ZUNsYXNzJ107XG4gIEBJbnB1dCgpIHNsaWRlRHVwbGljYXRlQWN0aXZlQ2xhc3M6IFN3aXBlck9wdGlvbnNbJ3NsaWRlRHVwbGljYXRlQWN0aXZlQ2xhc3MnXTtcbiAgQElucHV0KCkgc2xpZGVWaXNpYmxlQ2xhc3M6IFN3aXBlck9wdGlvbnNbJ3NsaWRlVmlzaWJsZUNsYXNzJ107XG4gIEBJbnB1dCgpIHNsaWRlRHVwbGljYXRlQ2xhc3M6IFN3aXBlck9wdGlvbnNbJ3NsaWRlRHVwbGljYXRlQ2xhc3MnXTtcbiAgQElucHV0KCkgc2xpZGVOZXh0Q2xhc3M6IFN3aXBlck9wdGlvbnNbJ3NsaWRlTmV4dENsYXNzJ107XG4gIEBJbnB1dCgpIHNsaWRlRHVwbGljYXRlTmV4dENsYXNzOiBTd2lwZXJPcHRpb25zWydzbGlkZUR1cGxpY2F0ZU5leHRDbGFzcyddO1xuICBASW5wdXQoKSBzbGlkZVByZXZDbGFzczogU3dpcGVyT3B0aW9uc1snc2xpZGVQcmV2Q2xhc3MnXTtcbiAgQElucHV0KCkgc2xpZGVEdXBsaWNhdGVQcmV2Q2xhc3M6IFN3aXBlck9wdGlvbnNbJ3NsaWRlRHVwbGljYXRlUHJldkNsYXNzJ107XG4gIEBJbnB1dCgpIHdyYXBwZXJDbGFzczogU3dpcGVyT3B0aW9uc1snd3JhcHBlckNsYXNzJ10gPSAnc3dpcGVyLXdyYXBwZXInO1xuICBASW5wdXQoKSBydW5DYWxsYmFja3NPbkluaXQ6IFN3aXBlck9wdGlvbnNbJ3J1bkNhbGxiYWNrc09uSW5pdCddO1xuICBASW5wdXQoKSBvYnNlcnZlUGFyZW50czogU3dpcGVyT3B0aW9uc1snb2JzZXJ2ZVBhcmVudHMnXTtcbiAgQElucHV0KCkgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IFN3aXBlck9wdGlvbnNbJ29ic2VydmVTbGlkZUNoaWxkcmVuJ107XG4gIEBJbnB1dCgpIGExMXk6IFN3aXBlck9wdGlvbnNbJ2ExMXknXTtcbiAgQElucHV0KCkgYXV0b3BsYXk6IFN3aXBlck9wdGlvbnNbJ2F1dG9wbGF5J107XG4gIEBJbnB1dCgpIGNvbnRyb2xsZXI6IFN3aXBlck9wdGlvbnNbJ2NvbnRyb2xsZXInXTtcbiAgQElucHV0KCkgY292ZXJmbG93RWZmZWN0OiBTd2lwZXJPcHRpb25zWydjb3ZlcmZsb3dFZmZlY3QnXTtcbiAgQElucHV0KCkgY3ViZUVmZmVjdDogU3dpcGVyT3B0aW9uc1snY3ViZUVmZmVjdCddO1xuICBASW5wdXQoKSBmYWRlRWZmZWN0OiBTd2lwZXJPcHRpb25zWydmYWRlRWZmZWN0J107XG4gIEBJbnB1dCgpIGZsaXBFZmZlY3Q6IFN3aXBlck9wdGlvbnNbJ2ZsaXBFZmZlY3QnXTtcbiAgQElucHV0KCkgY3JlYXRpdmVFZmZlY3Q6IFN3aXBlck9wdGlvbnNbJ2NyZWF0aXZlRWZmZWN0J107XG4gIEBJbnB1dCgpIGNhcmRzRWZmZWN0OiBTd2lwZXJPcHRpb25zWydjYXJkc0VmZmVjdCddO1xuICBASW5wdXQoKSBoYXNoTmF2aWdhdGlvbjogU3dpcGVyT3B0aW9uc1snaGFzaE5hdmlnYXRpb24nXTtcbiAgQElucHV0KCkgaGlzdG9yeTogU3dpcGVyT3B0aW9uc1snaGlzdG9yeSddO1xuICBASW5wdXQoKSBrZXlib2FyZDogU3dpcGVyT3B0aW9uc1sna2V5Ym9hcmQnXTtcbiAgQElucHV0KCkgbGF6eTogU3dpcGVyT3B0aW9uc1snbGF6eSddO1xuICBASW5wdXQoKSBtb3VzZXdoZWVsOiBTd2lwZXJPcHRpb25zWydtb3VzZXdoZWVsJ107XG4gIEBJbnB1dCgpIHBhcmFsbGF4OiBTd2lwZXJPcHRpb25zWydwYXJhbGxheCddO1xuICBASW5wdXQoKSB0aHVtYnM6IFN3aXBlck9wdGlvbnNbJ3RodW1icyddO1xuICBASW5wdXQoKSB6b29tOiBTd2lwZXJPcHRpb25zWyd6b29tJ107XG4gIEBJbnB1dCgpIGNsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGlkOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHNldCBuYXZpZ2F0aW9uKHZhbCkge1xuICAgIGNvbnN0IGN1cnJlbnROZXh0ID1cbiAgICAgIHR5cGVvZiB0aGlzLl9uYXZpZ2F0aW9uICE9PSAnYm9vbGVhbicgJiYgdGhpcy5fbmF2aWdhdGlvbiAhPT0gJydcbiAgICAgICAgPyB0aGlzLl9uYXZpZ2F0aW9uPy5uZXh0RWxcbiAgICAgICAgOiBudWxsO1xuICAgIGNvbnN0IGN1cnJlbnRQcmV2ID1cbiAgICAgIHR5cGVvZiB0aGlzLl9uYXZpZ2F0aW9uICE9PSAnYm9vbGVhbicgJiYgdGhpcy5fbmF2aWdhdGlvbiAhPT0gJydcbiAgICAgICAgPyB0aGlzLl9uYXZpZ2F0aW9uPy5wcmV2RWxcbiAgICAgICAgOiBudWxsO1xuICAgIHRoaXMuX25hdmlnYXRpb24gPSBzZXRQcm9wZXJ0eSh2YWwsIHtcbiAgICAgIG5leHRFbDogY3VycmVudE5leHQgfHwgbnVsbCxcbiAgICAgIHByZXZFbDogY3VycmVudFByZXYgfHwgbnVsbCxcbiAgICB9KTtcbiAgICB0aGlzLnNob3dOYXZpZ2F0aW9uID0gIShcbiAgICAgIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpICE9PSB0cnVlIHx8XG4gICAgICAodGhpcy5fbmF2aWdhdGlvbiAmJlxuICAgICAgICB0eXBlb2YgdGhpcy5fbmF2aWdhdGlvbiAhPT0gJ2Jvb2xlYW4nICYmXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24ucHJldkVsICE9PSB0aGlzLl9wcmV2RWxSZWY/Lm5hdGl2ZUVsZW1lbnQgJiZcbiAgICAgICAgKHRoaXMuX25hdmlnYXRpb24ucHJldkVsICE9PSBudWxsIHx8IHRoaXMuX25hdmlnYXRpb24ubmV4dEVsICE9PSBudWxsKSAmJlxuICAgICAgICAodHlwZW9mIHRoaXMuX25hdmlnYXRpb24ubmV4dEVsID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgIHR5cGVvZiB0aGlzLl9uYXZpZ2F0aW9uLnByZXZFbCA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICB0eXBlb2YgdGhpcy5fbmF2aWdhdGlvbi5uZXh0RWwgPT09ICdvYmplY3QnIHx8XG4gICAgICAgICAgdHlwZW9mIHRoaXMuX25hdmlnYXRpb24ucHJldkVsID09PSAnb2JqZWN0JykpXG4gICAgKTtcbiAgfVxuICBnZXQgbmF2aWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbmF2aWdhdGlvbjtcbiAgfVxuICBwcml2YXRlIF9uYXZpZ2F0aW9uOiBOYXZpZ2F0aW9uT3B0aW9ucyB8IGJvb2xlYW4gfCAnJztcbiAgc2hvd05hdmlnYXRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBwYWdpbmF0aW9uKHZhbCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPVxuICAgICAgdHlwZW9mIHRoaXMuX3BhZ2luYXRpb24gIT09ICdib29sZWFuJyAmJiB0aGlzLl9wYWdpbmF0aW9uICE9PSAnJ1xuICAgICAgICA/IHRoaXMuX3BhZ2luYXRpb24/LmVsXG4gICAgICAgIDogbnVsbDtcbiAgICB0aGlzLl9wYWdpbmF0aW9uID0gc2V0UHJvcGVydHkodmFsLCB7XG4gICAgICBlbDogY3VycmVudCB8fCBudWxsLFxuICAgIH0pO1xuICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBpc1Nob3dFbCh2YWwsIHRoaXMuX3BhZ2luYXRpb24sIHRoaXMuX3BhZ2luYXRpb25FbFJlZik7XG4gIH1cbiAgZ2V0IHBhZ2luYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2luYXRpb247XG4gIH1cbiAgcHJpdmF0ZSBfcGFnaW5hdGlvbjogUGFnaW5hdGlvbk9wdGlvbnMgfCBib29sZWFuIHwgJyc7XG4gIHNob3dQYWdpbmF0aW9uOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBzZXQgc2Nyb2xsYmFyKHZhbCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPVxuICAgICAgdHlwZW9mIHRoaXMuX3Njcm9sbGJhciAhPT0gJ2Jvb2xlYW4nICYmIHRoaXMuX3Njcm9sbGJhciAhPT0gJycgPyB0aGlzLl9zY3JvbGxiYXI/LmVsIDogbnVsbDtcbiAgICB0aGlzLl9zY3JvbGxiYXIgPSBzZXRQcm9wZXJ0eSh2YWwsIHtcbiAgICAgIGVsOiBjdXJyZW50IHx8IG51bGwsXG4gICAgfSk7XG4gICAgdGhpcy5zaG93U2Nyb2xsYmFyID0gaXNTaG93RWwodmFsLCB0aGlzLl9zY3JvbGxiYXIsIHRoaXMuX3Njcm9sbGJhckVsUmVmKTtcbiAgfVxuICBnZXQgc2Nyb2xsYmFyKCkge1xuICAgIHJldHVybiB0aGlzLl9zY3JvbGxiYXI7XG4gIH1cbiAgcHJpdmF0ZSBfc2Nyb2xsYmFyOiBTY3JvbGxiYXJPcHRpb25zIHwgYm9vbGVhbiB8ICcnO1xuICBzaG93U2Nyb2xsYmFyOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBzZXQgdmlydHVhbCh2YWwpIHtcbiAgICB0aGlzLl92aXJ0dWFsID0gc2V0UHJvcGVydHkodmFsKTtcbiAgfVxuICBnZXQgdmlydHVhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlydHVhbDtcbiAgfVxuICBwcml2YXRlIF92aXJ0dWFsOiBWaXJ0dWFsT3B0aW9ucyB8IGJvb2xlYW4gfCAnJztcblxuICBASW5wdXQoKVxuICBzZXQgY29uZmlnKHZhbDogU3dpcGVyT3B0aW9ucykge1xuICAgIHRoaXMudXBkYXRlU3dpcGVyKHZhbCk7XG4gICAgY29uc3QgeyBwYXJhbXMgfSA9IGdldFBhcmFtcyh2YWwpO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgcGFyYW1zKTtcbiAgfVxuICBAT3V0cHV0KCdfYmVmb3JlQnJlYWtwb2ludCcpIHNfX2JlZm9yZUJyZWFrcG9pbnQgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydfYmVmb3JlQnJlYWtwb2ludCddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnX2NvbnRhaW5lckNsYXNzZXMnKSBzX19jb250YWluZXJDbGFzc2VzID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snX2NvbnRhaW5lckNsYXNzZXMnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ19zbGlkZUNsYXNzJykgc19fc2xpZGVDbGFzcyA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ19zbGlkZUNsYXNzJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdfc3dpcGVyJykgc19fc3dpcGVyID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snX3N3aXBlciddPj4oKTtcblxuICBAT3V0cHV0KCdhY3RpdmVJbmRleENoYW5nZScpIHNfYWN0aXZlSW5kZXhDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydhY3RpdmVJbmRleENoYW5nZSddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnYWZ0ZXJJbml0Jykgc19hZnRlckluaXQgPSBuZXcgRXZlbnRFbWl0dGVyPFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydhZnRlckluaXQnXT4+KCk7XG5cbiAgQE91dHB1dCgnYXV0b3BsYXknKSBzX2F1dG9wbGF5ID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snYXV0b3BsYXknXT4+KCk7XG5cbiAgQE91dHB1dCgnYXV0b3BsYXlTdGFydCcpIHNfYXV0b3BsYXlTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ2F1dG9wbGF5U3RhcnQnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ2F1dG9wbGF5U3RvcCcpIHNfYXV0b3BsYXlTdG9wID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snYXV0b3BsYXlTdG9wJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdhdXRvcGxheVBhdXNlJykgc19hdXRvcGxheVBhdXNlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snYXV0b3BsYXlQYXVzZSddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnYXV0b3BsYXlSZXN1bWUnKSBzX2F1dG9wbGF5UmVzdW1lID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snYXV0b3BsYXlSZXN1bWUnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ2JlZm9yZURlc3Ryb3knKSBzX2JlZm9yZURlc3Ryb3kgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydiZWZvcmVEZXN0cm95J10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdiZWZvcmVJbml0Jykgc19iZWZvcmVJbml0ID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snYmVmb3JlSW5pdCddPj4oKTtcblxuICBAT3V0cHV0KCdiZWZvcmVMb29wRml4Jykgc19iZWZvcmVMb29wRml4ID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snYmVmb3JlTG9vcEZpeCddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnYmVmb3JlUmVzaXplJykgc19iZWZvcmVSZXNpemUgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydiZWZvcmVSZXNpemUnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ2JlZm9yZVNsaWRlQ2hhbmdlU3RhcnQnKSBzX2JlZm9yZVNsaWRlQ2hhbmdlU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydiZWZvcmVTbGlkZUNoYW5nZVN0YXJ0J10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdiZWZvcmVUcmFuc2l0aW9uU3RhcnQnKSBzX2JlZm9yZVRyYW5zaXRpb25TdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ2JlZm9yZVRyYW5zaXRpb25TdGFydCddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnYnJlYWtwb2ludCcpIHNfYnJlYWtwb2ludCA9IG5ldyBFdmVudEVtaXR0ZXI8UGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ2JyZWFrcG9pbnQnXT4+KCk7XG5cbiAgQE91dHB1dCgnY2hhbmdlRGlyZWN0aW9uJykgc19jaGFuZ2VEaXJlY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydjaGFuZ2VEaXJlY3Rpb24nXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ2NsaWNrJykgc19jbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8UGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ2NsaWNrJ10+PigpO1xuXG4gIEBPdXRwdXQoJ2RvdWJsZVRhcCcpIHNfZG91YmxlVGFwID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snZG91YmxlVGFwJ10+PigpO1xuXG4gIEBPdXRwdXQoJ2RvdWJsZUNsaWNrJykgc19kb3VibGVDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ2RvdWJsZUNsaWNrJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdkZXN0cm95Jykgc19kZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snZGVzdHJveSddPj4oKTtcblxuICBAT3V0cHV0KCdmcm9tRWRnZScpIHNfZnJvbUVkZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydmcm9tRWRnZSddPj4oKTtcblxuICBAT3V0cHV0KCdoYXNoQ2hhbmdlJykgc19oYXNoQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snaGFzaENoYW5nZSddPj4oKTtcblxuICBAT3V0cHV0KCdoYXNoU2V0Jykgc19oYXNoU2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snaGFzaFNldCddPj4oKTtcblxuICBAT3V0cHV0KCdpbWFnZXNSZWFkeScpIHNfaW1hZ2VzUmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydpbWFnZXNSZWFkeSddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnaW5pdCcpIHNfaW5pdCA9IG5ldyBFdmVudEVtaXR0ZXI8UGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ2luaXQnXT4+KCk7XG5cbiAgQE91dHB1dCgna2V5UHJlc3MnKSBzX2tleVByZXNzID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1sna2V5UHJlc3MnXT4+KCk7XG5cbiAgQE91dHB1dCgnbGF6eUltYWdlTG9hZCcpIHNfbGF6eUltYWdlTG9hZCA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ2xhenlJbWFnZUxvYWQnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ2xhenlJbWFnZVJlYWR5Jykgc19sYXp5SW1hZ2VSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ2xhenlJbWFnZVJlYWR5J10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdsb29wRml4Jykgc19sb29wRml4ID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snbG9vcEZpeCddPj4oKTtcblxuICBAT3V0cHV0KCdtb21lbnR1bUJvdW5jZScpIHNfbW9tZW50dW1Cb3VuY2UgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydtb21lbnR1bUJvdW5jZSddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnbmF2aWdhdGlvbkhpZGUnKSBzX25hdmlnYXRpb25IaWRlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snbmF2aWdhdGlvbkhpZGUnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ25hdmlnYXRpb25TaG93Jykgc19uYXZpZ2F0aW9uU2hvdyA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ25hdmlnYXRpb25TaG93J10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdvYnNlcnZlclVwZGF0ZScpIHNfb2JzZXJ2ZXJVcGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydvYnNlcnZlclVwZGF0ZSddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnb3JpZW50YXRpb25jaGFuZ2UnKSBzX29yaWVudGF0aW9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snb3JpZW50YXRpb25jaGFuZ2UnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3BhZ2luYXRpb25IaWRlJykgc19wYWdpbmF0aW9uSGlkZSA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3BhZ2luYXRpb25IaWRlJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdwYWdpbmF0aW9uUmVuZGVyJykgc19wYWdpbmF0aW9uUmVuZGVyID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1sncGFnaW5hdGlvblJlbmRlciddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgncGFnaW5hdGlvblNob3cnKSBzX3BhZ2luYXRpb25TaG93ID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1sncGFnaW5hdGlvblNob3cnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3BhZ2luYXRpb25VcGRhdGUnKSBzX3BhZ2luYXRpb25VcGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydwYWdpbmF0aW9uVXBkYXRlJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdwcm9ncmVzcycpIHNfcHJvZ3Jlc3MgPSBuZXcgRXZlbnRFbWl0dGVyPFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydwcm9ncmVzcyddPj4oKTtcblxuICBAT3V0cHV0KCdyZWFjaEJlZ2lubmluZycpIHNfcmVhY2hCZWdpbm5pbmcgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydyZWFjaEJlZ2lubmluZyddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgncmVhY2hFbmQnKSBzX3JlYWNoRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1sncmVhY2hFbmQnXT4+KCk7XG5cbiAgQE91dHB1dCgncmVhbEluZGV4Q2hhbmdlJykgc19yZWFsSW5kZXhDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydyZWFsSW5kZXhDaGFuZ2UnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3Jlc2l6ZScpIHNfcmVzaXplID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1sncmVzaXplJ10+PigpO1xuXG4gIEBPdXRwdXQoJ3Njcm9sbCcpIHNfc2Nyb2xsID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snc2Nyb2xsJ10+PigpO1xuXG4gIEBPdXRwdXQoJ3Njcm9sbGJhckRyYWdFbmQnKSBzX3Njcm9sbGJhckRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydzY3JvbGxiYXJEcmFnRW5kJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdzY3JvbGxiYXJEcmFnTW92ZScpIHNfc2Nyb2xsYmFyRHJhZ01vdmUgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydzY3JvbGxiYXJEcmFnTW92ZSddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnc2Nyb2xsYmFyRHJhZ1N0YXJ0Jykgc19zY3JvbGxiYXJEcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydzY3JvbGxiYXJEcmFnU3RhcnQnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3NldFRyYW5zaXRpb24nKSBzX3NldFRyYW5zaXRpb24gPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydzZXRUcmFuc2l0aW9uJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdzZXRUcmFuc2xhdGUnKSBzX3NldFRyYW5zbGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3NldFRyYW5zbGF0ZSddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnc2xpZGVDaGFuZ2UnKSBzX3NsaWRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snc2xpZGVDaGFuZ2UnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3NsaWRlQ2hhbmdlVHJhbnNpdGlvbkVuZCcpIHNfc2xpZGVDaGFuZ2VUcmFuc2l0aW9uRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snc2xpZGVDaGFuZ2VUcmFuc2l0aW9uRW5kJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdzbGlkZUNoYW5nZVRyYW5zaXRpb25TdGFydCcpIHNfc2xpZGVDaGFuZ2VUcmFuc2l0aW9uU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydzbGlkZUNoYW5nZVRyYW5zaXRpb25TdGFydCddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnc2xpZGVOZXh0VHJhbnNpdGlvbkVuZCcpIHNfc2xpZGVOZXh0VHJhbnNpdGlvbkVuZCA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3NsaWRlTmV4dFRyYW5zaXRpb25FbmQnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3NsaWRlTmV4dFRyYW5zaXRpb25TdGFydCcpIHNfc2xpZGVOZXh0VHJhbnNpdGlvblN0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snc2xpZGVOZXh0VHJhbnNpdGlvblN0YXJ0J10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdzbGlkZVByZXZUcmFuc2l0aW9uRW5kJykgc19zbGlkZVByZXZUcmFuc2l0aW9uRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snc2xpZGVQcmV2VHJhbnNpdGlvbkVuZCddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnc2xpZGVQcmV2VHJhbnNpdGlvblN0YXJ0Jykgc19zbGlkZVByZXZUcmFuc2l0aW9uU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydzbGlkZVByZXZUcmFuc2l0aW9uU3RhcnQnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3NsaWRlUmVzZXRUcmFuc2l0aW9uU3RhcnQnKSBzX3NsaWRlUmVzZXRUcmFuc2l0aW9uU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydzbGlkZVJlc2V0VHJhbnNpdGlvblN0YXJ0J10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdzbGlkZVJlc2V0VHJhbnNpdGlvbkVuZCcpIHNfc2xpZGVSZXNldFRyYW5zaXRpb25FbmQgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydzbGlkZVJlc2V0VHJhbnNpdGlvbkVuZCddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnc2xpZGVyTW92ZScpIHNfc2xpZGVyTW92ZSA9IG5ldyBFdmVudEVtaXR0ZXI8UGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3NsaWRlck1vdmUnXT4+KCk7XG5cbiAgQE91dHB1dCgnc2xpZGVyRmlyc3RNb3ZlJykgc19zbGlkZXJGaXJzdE1vdmUgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWydzbGlkZXJGaXJzdE1vdmUnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3NsaWRlc0xlbmd0aENoYW5nZScpIHNfc2xpZGVzTGVuZ3RoQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snc2xpZGVzTGVuZ3RoQ2hhbmdlJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCdzbGlkZXNHcmlkTGVuZ3RoQ2hhbmdlJykgc19zbGlkZXNHcmlkTGVuZ3RoQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snc2xpZGVzR3JpZExlbmd0aENoYW5nZSddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgnc25hcEdyaWRMZW5ndGhDaGFuZ2UnKSBzX3NuYXBHcmlkTGVuZ3RoQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snc25hcEdyaWRMZW5ndGhDaGFuZ2UnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3NuYXBJbmRleENoYW5nZScpIHNfc25hcEluZGV4Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snc25hcEluZGV4Q2hhbmdlJ10+XG4gID4oKTtcblxuICBAT3V0cHV0KCd0YXAnKSBzX3RhcCA9IG5ldyBFdmVudEVtaXR0ZXI8UGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3RhcCddPj4oKTtcblxuICBAT3V0cHV0KCd0b0VkZ2UnKSBzX3RvRWRnZSA9IG5ldyBFdmVudEVtaXR0ZXI8UGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3RvRWRnZSddPj4oKTtcblxuICBAT3V0cHV0KCd0b3VjaEVuZCcpIHNfdG91Y2hFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWyd0b3VjaEVuZCddPj4oKTtcblxuICBAT3V0cHV0KCd0b3VjaE1vdmUnKSBzX3RvdWNoTW92ZSA9IG5ldyBFdmVudEVtaXR0ZXI8UGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3RvdWNoTW92ZSddPj4oKTtcblxuICBAT3V0cHV0KCd0b3VjaE1vdmVPcHBvc2l0ZScpIHNfdG91Y2hNb3ZlT3Bwb3NpdGUgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIFBhcmFtZXRlcnM8U3dpcGVyRXZlbnRzWyd0b3VjaE1vdmVPcHBvc2l0ZSddPlxuICA+KCk7XG5cbiAgQE91dHB1dCgndG91Y2hTdGFydCcpIHNfdG91Y2hTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8UGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3RvdWNoU3RhcnQnXT4+KCk7XG5cbiAgQE91dHB1dCgndHJhbnNpdGlvbkVuZCcpIHNfdHJhbnNpdGlvbkVuZCA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgUGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3RyYW5zaXRpb25FbmQnXT5cbiAgPigpO1xuXG4gIEBPdXRwdXQoJ3RyYW5zaXRpb25TdGFydCcpIHNfdHJhbnNpdGlvblN0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1sndHJhbnNpdGlvblN0YXJ0J10+XG4gID4oKTtcblxuICBAT3V0cHV0KCd1cGRhdGUnKSBzX3VwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8UGFyYW1ldGVyczxTd2lwZXJFdmVudHNbJ3VwZGF0ZSddPj4oKTtcblxuICBAT3V0cHV0KCd6b29tQ2hhbmdlJykgc196b29tQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1snem9vbUNoYW5nZSddPj4oKTtcblxuICBAT3V0cHV0KCdzd2lwZXInKSBzX3N3aXBlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoJ3VubG9jaycpIHNfdW5sb2NrID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJhbWV0ZXJzPFN3aXBlckV2ZW50c1sndW5sb2NrJ10+PigpO1xuXG4gIEBWaWV3Q2hpbGQoJ3ByZXZFbFJlZicsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBzZXQgcHJldkVsUmVmKGVsOiBFbGVtZW50UmVmKSB7XG4gICAgdGhpcy5fcHJldkVsUmVmID0gZWw7XG4gICAgdGhpcy5fc2V0RWxlbWVudChlbCwgdGhpcy5uYXZpZ2F0aW9uLCAnbmF2aWdhdGlvbicsICdwcmV2RWwnKTtcbiAgfVxuICBfcHJldkVsUmVmOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCduZXh0RWxSZWYnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgc2V0IG5leHRFbFJlZihlbDogRWxlbWVudFJlZikge1xuICAgIHRoaXMuX25leHRFbFJlZiA9IGVsO1xuICAgIHRoaXMuX3NldEVsZW1lbnQoZWwsIHRoaXMubmF2aWdhdGlvbiwgJ25hdmlnYXRpb24nLCAnbmV4dEVsJyk7XG4gIH1cbiAgX25leHRFbFJlZjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnc2Nyb2xsYmFyRWxSZWYnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgc2V0IHNjcm9sbGJhckVsUmVmKGVsOiBFbGVtZW50UmVmKSB7XG4gICAgdGhpcy5fc2Nyb2xsYmFyRWxSZWYgPSBlbDtcbiAgICB0aGlzLl9zZXRFbGVtZW50KGVsLCB0aGlzLnNjcm9sbGJhciwgJ3Njcm9sbGJhcicpO1xuICB9XG4gIF9zY3JvbGxiYXJFbFJlZjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgncGFnaW5hdGlvbkVsUmVmJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHNldCBwYWdpbmF0aW9uRWxSZWYoZWw6IEVsZW1lbnRSZWYpIHtcbiAgICB0aGlzLl9wYWdpbmF0aW9uRWxSZWYgPSBlbDtcbiAgICB0aGlzLl9zZXRFbGVtZW50KGVsLCB0aGlzLnBhZ2luYXRpb24sICdwYWdpbmF0aW9uJyk7XG4gIH1cbiAgX3BhZ2luYXRpb25FbFJlZjogRWxlbWVudFJlZjtcbiAgQENvbnRlbnRDaGlsZHJlbihTd2lwZXJTbGlkZURpcmVjdGl2ZSwgeyBkZXNjZW5kYW50czogZmFsc2UsIGVtaXREaXN0aW5jdENoYW5nZXNPbmx5OiB0cnVlIH0pXG4gIHNsaWRlc0VsOiBRdWVyeUxpc3Q8U3dpcGVyU2xpZGVEaXJlY3RpdmU+O1xuICBwcml2YXRlIHNsaWRlczogU3dpcGVyU2xpZGVEaXJlY3RpdmVbXTtcblxuICBwcmVwZW5kU2xpZGVzOiBPYnNlcnZhYmxlPFN3aXBlclNsaWRlRGlyZWN0aXZlW10+O1xuICBhcHBlbmRTbGlkZXM6IE9ic2VydmFibGU8U3dpcGVyU2xpZGVEaXJlY3RpdmVbXT47XG5cbiAgc3dpcGVyUmVmOiBTd2lwZXI7XG4gIHJlYWRvbmx5IF9hY3RpdmVTbGlkZXMgPSBuZXcgU3ViamVjdDxTd2lwZXJTbGlkZURpcmVjdGl2ZVtdPigpO1xuXG4gIGdldCBhY3RpdmVTbGlkZXMoKSB7XG4gICAgaWYgKHRoaXMudmlydHVhbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVNsaWRlcztcbiAgICB9XG4gICAgcmV0dXJuIG9mKHRoaXMuc2xpZGVzKTtcbiAgfVxuXG4gIGdldCB6b29tQ29udGFpbmVyQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuem9vbSAmJiB0eXBlb2YgdGhpcy56b29tICE9PSAnYm9vbGVhbidcbiAgICAgID8gdGhpcy56b29tLmNvbnRhaW5lckNsYXNzXG4gICAgICA6ICdzd2lwZXItem9vbS1jb250YWluZXInO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIGNvbnRhaW5lckNsYXNzZXM6IHN0cmluZyA9ICdzd2lwZXInO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgX3BsYXRmb3JtSWQ6IE9iamVjdCxcbiAgKSB7fVxuXG4gIHByaXZhdGUgX3NldEVsZW1lbnQoZWw6IEVsZW1lbnRSZWYsIHJlZjogYW55LCB1cGRhdGU6IHN0cmluZywga2V5ID0gJ2VsJykge1xuICAgIGlmICghcmVmIHx8ICFlbCkgcmV0dXJuO1xuICAgIGlmIChlbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBpZiAocmVmW2tleV0gPT09IGVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVmW2tleV0gPSBlbC5uYXRpdmVFbGVtZW50O1xuICAgIH1cbiAgICBjb25zdCB1cGRhdGVPYmo6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge307XG4gICAgdXBkYXRlT2JqW3VwZGF0ZV0gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlSW5pdFN3aXBlcih1cGRhdGVPYmopO1xuICB9XG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgcGFyYW1zIH0gPSBnZXRQYXJhbXModGhpcyk7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBwYXJhbXMpO1xuICB9XG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmNoaWxkcmVuU2xpZGVzSW5pdCgpO1xuICAgIHRoaXMuaW5pdFN3aXBlcigpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc19zd2lwZXIuZW1pdCh0aGlzLnN3aXBlclJlZik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNoaWxkcmVuU2xpZGVzSW5pdCgpIHtcbiAgICB0aGlzLnNsaWRlc0NoYW5nZXModGhpcy5zbGlkZXNFbCk7XG4gICAgdGhpcy5zbGlkZXNFbC5jaGFuZ2VzLnN1YnNjcmliZSh0aGlzLnNsaWRlc0NoYW5nZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBzbGlkZXNDaGFuZ2VzID0gKHZhbDogUXVlcnlMaXN0PFN3aXBlclNsaWRlRGlyZWN0aXZlPikgPT4ge1xuICAgIHRoaXMuc2xpZGVzID0gdmFsLm1hcCgoc2xpZGU6IFN3aXBlclNsaWRlRGlyZWN0aXZlLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBzbGlkZS5zbGlkZUluZGV4ID0gaW5kZXg7XG4gICAgICBzbGlkZS5jbGFzc05hbWVzID0gdGhpcy5zbGlkZUNsYXNzIHx8ICcnO1xuICAgICAgcmV0dXJuIHNsaWRlO1xuICAgIH0pO1xuICAgIGlmICh0aGlzLmxvb3AgJiYgIXRoaXMubG9vcGVkU2xpZGVzKSB7XG4gICAgICB0aGlzLmNhbGNMb29wZWRTbGlkZXMoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnZpcnR1YWwpIHtcbiAgICAgIGlmICh0aGlzLmxvb3BlZFNsaWRlcykge1xuICAgICAgICB0aGlzLnByZXBlbmRTbGlkZXMgPSBvZih0aGlzLnNsaWRlcy5zbGljZSh0aGlzLnNsaWRlcy5sZW5ndGggLSB0aGlzLmxvb3BlZFNsaWRlcykpO1xuICAgICAgICB0aGlzLmFwcGVuZFNsaWRlcyA9IG9mKHRoaXMuc2xpZGVzLnNsaWNlKDAsIHRoaXMubG9vcGVkU2xpZGVzKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLnN3aXBlclJlZiAmJiB0aGlzLnN3aXBlclJlZi52aXJ0dWFsKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLnN3aXBlclJlZi52aXJ0dWFsLnNsaWRlcyA9IHRoaXMuc2xpZGVzO1xuICAgICAgICB0aGlzLnN3aXBlclJlZi52aXJ0dWFsLnVwZGF0ZSh0cnVlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH07XG5cbiAgZ2V0IGlzU3dpcGVyQWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLnN3aXBlclJlZiAmJiAhdGhpcy5zd2lwZXJSZWYuZGVzdHJveWVkO1xuICB9XG5cbiAgaW5pdFN3aXBlcigpIHtcbiAgICBjb25zdCB7IHBhcmFtczogc3dpcGVyUGFyYW1zLCBwYXNzZWRQYXJhbXMgfSA9IGdldFBhcmFtcyh0aGlzKTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHN3aXBlclBhcmFtcyk7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHN3aXBlclBhcmFtcy5pbml0ID0gZmFsc2U7XG4gICAgICBpZiAoIXN3aXBlclBhcmFtcy52aXJ0dWFsKSB7XG4gICAgICAgIHN3aXBlclBhcmFtcy5vYnNlcnZlciA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHN3aXBlclBhcmFtcy5vbkFueSA9IChldmVudE5hbWU6IGtleW9mIFN3aXBlckNvbXBvbmVudCwgLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgY29uc3QgZW1pdHRlciA9IHRoaXNbKCdzXycgKyBldmVudE5hbWUpIGFzIGtleW9mIFN3aXBlckNvbXBvbmVudF0gYXMgRXZlbnRFbWl0dGVyPGFueT47XG4gICAgICAgIGlmIChlbWl0dGVyKSB7XG4gICAgICAgICAgZW1pdHRlci5lbWl0KFsuLi5hcmdzXSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBfc2xpZGVDbGFzc2VzOiBTd2lwZXJFdmVudHNbJ19zbGlkZUNsYXNzZXMnXSA9IChfLCB1cGRhdGVkKSA9PiB7XG4gICAgICAgIHVwZGF0ZWQuZm9yRWFjaCgoeyBzbGlkZUVsLCBjbGFzc05hbWVzIH0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0YUluZGV4ID0gc2xpZGVFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jyk7XG4gICAgICAgICAgY29uc3Qgc2xpZGVJbmRleCA9IGRhdGFJbmRleCA/IHBhcnNlSW50KGRhdGFJbmRleCkgOiBpbmRleDtcbiAgICAgICAgICBpZiAodGhpcy52aXJ0dWFsKSB7XG4gICAgICAgICAgICBjb25zdCB2aXJ0dWFsU2xpZGUgPSB0aGlzLnNsaWRlcy5maW5kKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtLnZpcnR1YWxJbmRleCAmJiBpdGVtLnZpcnR1YWxJbmRleCA9PT0gc2xpZGVJbmRleDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHZpcnR1YWxTbGlkZSkge1xuICAgICAgICAgICAgICB2aXJ0dWFsU2xpZGUuY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXM7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5zbGlkZXNbc2xpZGVJbmRleF0pIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzW3NsaWRlSW5kZXhdLmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBfY29udGFpbmVyQ2xhc3NlczogU3dpcGVyRXZlbnRzWydfY29udGFpbmVyQ2xhc3NlcyddID0gKF8sIGNsYXNzZXMpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb250YWluZXJDbGFzc2VzID0gY2xhc3NlcztcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXJQYXJhbXMub24sIHtcbiAgICAgICAgX2NvbnRhaW5lckNsYXNzZXMsXG4gICAgICAgIF9zbGlkZUNsYXNzZXMsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHN3aXBlclJlZiA9IG5ldyBTd2lwZXIoc3dpcGVyUGFyYW1zKTtcbiAgICAgIHN3aXBlclJlZi5sb29wQ3JlYXRlID0gKCkgPT4ge307XG4gICAgICBzd2lwZXJSZWYubG9vcERlc3Ryb3kgPSAoKSA9PiB7fTtcbiAgICAgIGlmIChzd2lwZXJQYXJhbXMubG9vcCkge1xuICAgICAgICBzd2lwZXJSZWYubG9vcGVkU2xpZGVzID0gdGhpcy5sb29wZWRTbGlkZXM7XG4gICAgICB9XG4gICAgICBjb25zdCBpc1ZpcnR1YWxFbmFibGVkID0gaXNFbmFibGVkKHN3aXBlclJlZi5wYXJhbXMudmlydHVhbCk7XG4gICAgICBpZiAoc3dpcGVyUmVmLnZpcnR1YWwgJiYgaXNWaXJ0dWFsRW5hYmxlZCkge1xuICAgICAgICBzd2lwZXJSZWYudmlydHVhbC5zbGlkZXMgPSB0aGlzLnNsaWRlcztcbiAgICAgICAgY29uc3QgZXh0ZW5kV2l0aCA9IHtcbiAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgc2xpZGVzOiB0aGlzLnNsaWRlcyxcbiAgICAgICAgICByZW5kZXJFeHRlcm5hbDogdGhpcy51cGRhdGVWaXJ0dWFsU2xpZGVzLFxuICAgICAgICAgIHJlbmRlckV4dGVybmFsVXBkYXRlOiBmYWxzZSxcbiAgICAgICAgfTtcbiAgICAgICAgZXh0ZW5kKHN3aXBlclJlZi5wYXJhbXMudmlydHVhbCwgZXh0ZW5kV2l0aCk7XG4gICAgICAgIGV4dGVuZChzd2lwZXJSZWYub3JpZ2luYWxQYXJhbXMudmlydHVhbCwgZXh0ZW5kV2l0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKSkge1xuICAgICAgICB0aGlzLnN3aXBlclJlZiA9IHN3aXBlclJlZi5pbml0KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgY29uc3QgaXNWaXJ0dWFsRW5hYmxlZCA9IGlzRW5hYmxlZCh0aGlzLnN3aXBlclJlZi5wYXJhbXMudmlydHVhbCk7XG4gICAgICAgIGlmICh0aGlzLnN3aXBlclJlZi52aXJ0dWFsICYmIGlzVmlydHVhbEVuYWJsZWQpIHtcbiAgICAgICAgICB0aGlzLnN3aXBlclJlZi52aXJ0dWFsLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdHlsZTogYW55ID0gbnVsbDtcbiAgY3VycmVudFZpcnR1YWxEYXRhOiBhbnk7IC8vIFRPRE86IHR5cGUgdmlydHVhbERhdGE7XG4gIHByaXZhdGUgdXBkYXRlVmlydHVhbFNsaWRlcyA9ICh2aXJ0dWFsRGF0YTogYW55KSA9PiB7XG4gICAgLy8gVE9ETzogdHlwZSB2aXJ0dWFsRGF0YVxuICAgIGlmIChcbiAgICAgICF0aGlzLnN3aXBlclJlZiB8fFxuICAgICAgKHRoaXMuY3VycmVudFZpcnR1YWxEYXRhICYmXG4gICAgICAgIHRoaXMuY3VycmVudFZpcnR1YWxEYXRhLmZyb20gPT09IHZpcnR1YWxEYXRhLmZyb20gJiZcbiAgICAgICAgdGhpcy5jdXJyZW50VmlydHVhbERhdGEudG8gPT09IHZpcnR1YWxEYXRhLnRvICYmXG4gICAgICAgIHRoaXMuY3VycmVudFZpcnR1YWxEYXRhLm9mZnNldCA9PT0gdmlydHVhbERhdGEub2Zmc2V0KVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnN0eWxlID0gdGhpcy5zd2lwZXJSZWYuaXNIb3Jpem9udGFsKClcbiAgICAgID8ge1xuICAgICAgICAgIFt0aGlzLnN3aXBlclJlZi5ydGxUcmFuc2xhdGUgPyAncmlnaHQnIDogJ2xlZnQnXTogYCR7dmlydHVhbERhdGEub2Zmc2V0fXB4YCxcbiAgICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgICAgdG9wOiBgJHt2aXJ0dWFsRGF0YS5vZmZzZXR9cHhgLFxuICAgICAgICB9O1xuICAgIHRoaXMuY3VycmVudFZpcnR1YWxEYXRhID0gdmlydHVhbERhdGE7XG4gICAgdGhpcy5fYWN0aXZlU2xpZGVzLm5leHQodmlydHVhbERhdGEuc2xpZGVzKTtcbiAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5zd2lwZXJSZWYudXBkYXRlU2xpZGVzKCk7XG4gICAgICB0aGlzLnN3aXBlclJlZi51cGRhdGVQcm9ncmVzcygpO1xuICAgICAgdGhpcy5zd2lwZXJSZWYudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xuICAgICAgaWYgKGlzRW5hYmxlZCh0aGlzLnN3aXBlclJlZi5wYXJhbXMubGF6eSkpIHtcbiAgICAgICAgdGhpcy5zd2lwZXJSZWYubGF6eS5sb2FkKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnN3aXBlclJlZi52aXJ0dWFsLnVwZGF0ZSh0cnVlKTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH07XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlZFBhcmFtczogU2ltcGxlQ2hhbmdlcykge1xuICAgIHRoaXMudXBkYXRlU3dpcGVyKGNoYW5nZWRQYXJhbXMpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHVwZGF0ZUluaXRTd2lwZXIoY2hhbmdlZFBhcmFtczogYW55KSB7XG4gICAgaWYgKCEoY2hhbmdlZFBhcmFtcyAmJiB0aGlzLnN3aXBlclJlZiAmJiAhdGhpcy5zd2lwZXJSZWYuZGVzdHJveWVkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHBhcmFtczogY3VycmVudFBhcmFtcyxcbiAgICAgICAgcGFnaW5hdGlvbixcbiAgICAgICAgbmF2aWdhdGlvbixcbiAgICAgICAgc2Nyb2xsYmFyLFxuICAgICAgICB2aXJ0dWFsLFxuICAgICAgICB0aHVtYnMsXG4gICAgICB9ID0gdGhpcy5zd2lwZXJSZWY7XG5cbiAgICAgIGlmIChjaGFuZ2VkUGFyYW1zLnBhZ2luYXRpb24pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMucGFnaW5hdGlvbiAmJlxuICAgICAgICAgIHR5cGVvZiB0aGlzLnBhZ2luYXRpb24gIT09ICdib29sZWFuJyAmJlxuICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5lbCAmJlxuICAgICAgICAgIHBhZ2luYXRpb24gJiZcbiAgICAgICAgICAhcGFnaW5hdGlvbi5lbFxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVBhcmFtZXRlcigncGFnaW5hdGlvbicsIHRoaXMucGFnaW5hdGlvbik7XG4gICAgICAgICAgcGFnaW5hdGlvbi5pbml0KCk7XG4gICAgICAgICAgcGFnaW5hdGlvbi5yZW5kZXIoKTtcbiAgICAgICAgICBwYWdpbmF0aW9uLnVwZGF0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhZ2luYXRpb24uZGVzdHJveSgpO1xuICAgICAgICAgIHBhZ2luYXRpb24uZWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VkUGFyYW1zLnNjcm9sbGJhcikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5zY3JvbGxiYXIgJiZcbiAgICAgICAgICB0eXBlb2YgdGhpcy5zY3JvbGxiYXIgIT09ICdib29sZWFuJyAmJlxuICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyLmVsICYmXG4gICAgICAgICAgc2Nyb2xsYmFyICYmXG4gICAgICAgICAgIXNjcm9sbGJhci5lbFxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVBhcmFtZXRlcignc2Nyb2xsYmFyJywgdGhpcy5zY3JvbGxiYXIpO1xuICAgICAgICAgIHNjcm9sbGJhci5pbml0KCk7XG4gICAgICAgICAgc2Nyb2xsYmFyLnVwZGF0ZVNpemUoKTtcbiAgICAgICAgICBzY3JvbGxiYXIuc2V0VHJhbnNsYXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2Nyb2xsYmFyLmRlc3Ryb3koKTtcbiAgICAgICAgICBzY3JvbGxiYXIuZWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VkUGFyYW1zLm5hdmlnYXRpb24pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMubmF2aWdhdGlvbiAmJlxuICAgICAgICAgIHR5cGVvZiB0aGlzLm5hdmlnYXRpb24gIT09ICdib29sZWFuJyAmJlxuICAgICAgICAgIHRoaXMubmF2aWdhdGlvbi5wcmV2RWwgJiZcbiAgICAgICAgICB0aGlzLm5hdmlnYXRpb24ubmV4dEVsICYmXG4gICAgICAgICAgbmF2aWdhdGlvbiAmJlxuICAgICAgICAgICFuYXZpZ2F0aW9uLnByZXZFbCAmJlxuICAgICAgICAgICFuYXZpZ2F0aW9uLm5leHRFbFxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVBhcmFtZXRlcignbmF2aWdhdGlvbicsIHRoaXMubmF2aWdhdGlvbik7XG4gICAgICAgICAgbmF2aWdhdGlvbi5pbml0KCk7XG4gICAgICAgICAgbmF2aWdhdGlvbi51cGRhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChuYXZpZ2F0aW9uLnByZXZFbCAmJiBuYXZpZ2F0aW9uLm5leHRFbCkge1xuICAgICAgICAgIG5hdmlnYXRpb24uZGVzdHJveSgpO1xuICAgICAgICAgIG5hdmlnYXRpb24ubmV4dEVsID0gbnVsbDtcbiAgICAgICAgICBuYXZpZ2F0aW9uLnByZXZFbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VkUGFyYW1zLnRodW1icyAmJiB0aGlzLnRodW1icyAmJiB0aGlzLnRodW1icy5zd2lwZXIpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJhbWV0ZXIoJ3RodW1icycsIHRoaXMudGh1bWJzKTtcbiAgICAgICAgY29uc3QgaW5pdGlhbGl6ZWQgPSB0aHVtYnMuaW5pdCgpO1xuICAgICAgICBpZiAoaW5pdGlhbGl6ZWQpIHRodW1icy51cGRhdGUodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VkUGFyYW1zLmNvbnRyb2xsZXIgJiYgdGhpcy5jb250cm9sbGVyICYmIHRoaXMuY29udHJvbGxlci5jb250cm9sKSB7XG4gICAgICAgIHRoaXMuc3dpcGVyUmVmLmNvbnRyb2xsZXIuY29udHJvbCA9IHRoaXMuY29udHJvbGxlci5jb250cm9sO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN3aXBlclJlZi51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVN3aXBlcihjaGFuZ2VkUGFyYW1zOiBTaW1wbGVDaGFuZ2VzIHwgYW55KSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGlmIChjaGFuZ2VkUGFyYW1zLmNvbmZpZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIShjaGFuZ2VkUGFyYW1zICYmIHRoaXMuc3dpcGVyUmVmICYmICF0aGlzLnN3aXBlclJlZi5kZXN0cm95ZWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGNoYW5nZWRQYXJhbXMpIHtcbiAgICAgICAgaWYgKGlnbm9yZU5nT25DaGFuZ2VzLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBjaGFuZ2VkUGFyYW1zW2tleV0/LmN1cnJlbnRWYWx1ZSA/PyBjaGFuZ2VkUGFyYW1zW2tleV07XG4gICAgICAgIHRoaXMudXBkYXRlUGFyYW1ldGVyKGtleSwgbmV3VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlZFBhcmFtcy5hbGxvd1NsaWRlTmV4dCkge1xuICAgICAgICB0aGlzLnN3aXBlclJlZi5hbGxvd1NsaWRlTmV4dCA9IHRoaXMuYWxsb3dTbGlkZU5leHQ7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlZFBhcmFtcy5hbGxvd1NsaWRlUHJldikge1xuICAgICAgICB0aGlzLnN3aXBlclJlZi5hbGxvd1NsaWRlUHJldiA9IHRoaXMuYWxsb3dTbGlkZVByZXY7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlZFBhcmFtcy5kaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zd2lwZXJSZWYuY2hhbmdlRGlyZWN0aW9uKHRoaXMuZGlyZWN0aW9uLCBmYWxzZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlZFBhcmFtcy5icmVha3BvaW50cykge1xuICAgICAgICBpZiAodGhpcy5sb29wICYmICF0aGlzLmxvb3BlZFNsaWRlcykge1xuICAgICAgICAgIHRoaXMuY2FsY0xvb3BlZFNsaWRlcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3dpcGVyUmVmLmN1cnJlbnRCcmVha3BvaW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zd2lwZXJSZWYuc2V0QnJlYWtwb2ludCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlZFBhcmFtcy50aHVtYnMgfHwgY2hhbmdlZFBhcmFtcy5jb250cm9sbGVyKSB7XG4gICAgICAgIHRoaXMudXBkYXRlSW5pdFN3aXBlcihjaGFuZ2VkUGFyYW1zKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3dpcGVyUmVmLnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsY0xvb3BlZFNsaWRlcygpIHtcbiAgICBpZiAoIXRoaXMubG9vcCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgc2xpZGVzUGVyVmlld1BhcmFtcyA9IHRoaXMuc2xpZGVzUGVyVmlldztcbiAgICBpZiAodGhpcy5icmVha3BvaW50cykge1xuICAgICAgY29uc3QgYnJlYWtwb2ludCA9IFN3aXBlci5wcm90b3R5cGUuZ2V0QnJlYWtwb2ludCh0aGlzLmJyZWFrcG9pbnRzKTtcbiAgICAgIGNvbnN0IGJyZWFrcG9pbnRPbmx5UGFyYW1zID1cbiAgICAgICAgYnJlYWtwb2ludCBpbiB0aGlzLmJyZWFrcG9pbnRzID8gdGhpcy5icmVha3BvaW50c1ticmVha3BvaW50XSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChicmVha3BvaW50T25seVBhcmFtcyAmJiBicmVha3BvaW50T25seVBhcmFtcy5zbGlkZXNQZXJWaWV3KSB7XG4gICAgICAgIHNsaWRlc1BlclZpZXdQYXJhbXMgPSBicmVha3BvaW50T25seVBhcmFtcy5zbGlkZXNQZXJWaWV3O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2xpZGVzUGVyVmlld1BhcmFtcyA9PT0gJ2F1dG8nKSB7XG4gICAgICB0aGlzLmxvb3BlZFNsaWRlcyA9IHRoaXMuc2xpZGVzLmxlbmd0aDtcbiAgICAgIHJldHVybiB0aGlzLnNsaWRlcy5sZW5ndGg7XG4gICAgfVxuICAgIGxldCBsb29wZWRTbGlkZXMgPSB0aGlzLmxvb3BlZFNsaWRlcyB8fCBzbGlkZXNQZXJWaWV3UGFyYW1zO1xuICAgIGlmICghbG9vcGVkU2xpZGVzKSB7XG4gICAgICAvLyA/XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubG9vcEFkZGl0aW9uYWxTbGlkZXMpIHtcbiAgICAgIGxvb3BlZFNsaWRlcyArPSB0aGlzLmxvb3BBZGRpdGlvbmFsU2xpZGVzO1xuICAgIH1cbiAgICBpZiAobG9vcGVkU2xpZGVzID4gdGhpcy5zbGlkZXMubGVuZ3RoKSB7XG4gICAgICBsb29wZWRTbGlkZXMgPSB0aGlzLnNsaWRlcy5sZW5ndGg7XG4gICAgfVxuICAgIHRoaXMubG9vcGVkU2xpZGVzID0gbG9vcGVkU2xpZGVzO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdXBkYXRlUGFyYW1ldGVyKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgaWYgKCEodGhpcy5zd2lwZXJSZWYgJiYgIXRoaXMuc3dpcGVyUmVmLmRlc3Ryb3llZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgX2tleSA9IGtleS5yZXBsYWNlKC9eXy8sICcnKSBhcyBrZXlvZiBTd2lwZXJPcHRpb25zO1xuICAgIGNvbnN0IGlzQ3VycmVudFBhcmFtT2JqID0gaXNPYmplY3QodGhpcy5zd2lwZXJSZWYucGFyYW1zW19rZXldKTtcblxuICAgIGlmIChfa2V5ID09PSAnZW5hYmxlZCcpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnN3aXBlclJlZi5lbmFibGUoKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuc3dpcGVyUmVmLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzQ3VycmVudFBhcmFtT2JqICYmIGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgZXh0ZW5kKHRoaXMuc3dpcGVyUmVmLnBhcmFtc1tfa2V5XSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcy5zd2lwZXJSZWYucGFyYW1zW19rZXldIGFzIGFueSkgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5zd2lwZXJSZWY/LmRlc3Ryb3kodHJ1ZSwgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59XG4iLCI8bmctY29udGVudCBzZWxlY3Q9XCJbc2xvdD1jb250YWluZXItc3RhcnRdXCI+PC9uZy1jb250ZW50PlxuPG5nLWNvbnRhaW5lciAqbmdJZj1cIm5hdmlnYXRpb24gJiYgc2hvd05hdmlnYXRpb25cIj5cbiAgPGRpdiBjbGFzcz1cInN3aXBlci1idXR0b24tcHJldlwiICNwcmV2RWxSZWY+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzd2lwZXItYnV0dG9uLW5leHRcIiAjbmV4dEVsUmVmPjwvZGl2PlxuPC9uZy1jb250YWluZXI+XG48ZGl2ICpuZ0lmPVwic2Nyb2xsYmFyICYmIHNob3dTY3JvbGxiYXJcIiBjbGFzcz1cInN3aXBlci1zY3JvbGxiYXJcIiAjc2Nyb2xsYmFyRWxSZWY+PC9kaXY+XG48ZGl2ICpuZ0lmPVwicGFnaW5hdGlvbiAmJiBzaG93UGFnaW5hdGlvblwiIGNsYXNzPVwic3dpcGVyLXBhZ2luYXRpb25cIiAjcGFnaW5hdGlvbkVsUmVmPjwvZGl2PlxuPGRpdiBbbmdDbGFzc109XCJ3cmFwcGVyQ2xhc3NcIiBbYXR0ci5pZF09XCJpZFwiPlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJbc2xvdD13cmFwcGVyLXN0YXJ0XVwiPjwvbmctY29udGVudD5cbiAgPG5nLXRlbXBsYXRlXG4gICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJcbiAgICAgIHNsaWRlc1RlbXBsYXRlO1xuICAgICAgY29udGV4dDoge1xuICAgICAgICBsb29wU2xpZGVzOiBwcmVwZW5kU2xpZGVzLFxuICAgICAgICBrZXk6ICdwcmVwZW5kJ1xuICAgICAgfVxuICAgIFwiXG4gID48L25nLXRlbXBsYXRlPlxuICA8bmctdGVtcGxhdGVcbiAgICAqbmdUZW1wbGF0ZU91dGxldD1cIlxuICAgICAgc2xpZGVzVGVtcGxhdGU7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgIGxvb3BTbGlkZXM6IGFjdGl2ZVNsaWRlcyxcbiAgICAgICAga2V5OiAnJ1xuICAgICAgfVxuICAgIFwiXG4gID48L25nLXRlbXBsYXRlPlxuICA8bmctdGVtcGxhdGVcbiAgICAqbmdUZW1wbGF0ZU91dGxldD1cIlxuICAgICAgc2xpZGVzVGVtcGxhdGU7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgIGxvb3BTbGlkZXM6IGFwcGVuZFNsaWRlcyxcbiAgICAgICAga2V5OiAnYXBwZW5kJ1xuICAgICAgfVxuICAgIFwiXG4gID48L25nLXRlbXBsYXRlPlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJbc2xvdD13cmFwcGVyLWVuZF1cIj48L25nLWNvbnRlbnQ+XG48L2Rpdj5cbjxuZy1jb250ZW50IHNlbGVjdD1cIltzbG90PWNvbnRhaW5lci1lbmRdXCI+PC9uZy1jb250ZW50PlxuXG48bmctdGVtcGxhdGUgI3NsaWRlc1RlbXBsYXRlIGxldC1sb29wU2xpZGVzPVwibG9vcFNsaWRlc1wiIGxldC1zbGlkZUtleT1cImtleVwiPlxuICA8ZGl2XG4gICAgKm5nRm9yPVwibGV0IHNsaWRlIG9mIGxvb3BTbGlkZXMgfCBhc3luY1wiXG4gICAgW25nQ2xhc3NdPVwiXG4gICAgICAoc2xpZGUuY2xhc3MgPyBzbGlkZS5jbGFzcyArICcgJyA6ICcnKSArXG4gICAgICBzbGlkZUNsYXNzICtcbiAgICAgIChzbGlkZUtleSAhPT0gJycgPyAnICcgKyBzbGlkZUR1cGxpY2F0ZUNsYXNzIDogJycpXG4gICAgXCJcbiAgICBbYXR0ci5kYXRhLXN3aXBlci1zbGlkZS1pbmRleF09XCJzbGlkZS52aXJ0dWFsSW5kZXggPyBzbGlkZS52aXJ0dWFsSW5kZXggOiBzbGlkZS5zbGlkZUluZGV4XCJcbiAgICBbYXR0ci5kYXRhLXN3aXBlci1hdXRvcGxheV09XCJzbGlkZS5hdXRvcGxheURlbGF5XCJcbiAgICBbc3R5bGVdPVwic3R5bGVcIlxuICAgIFtuZ1N3aXRjaF09XCJzbGlkZS56b29tXCJcbiAgPlxuICAgIDxkaXYgKm5nU3dpdGNoQ2FzZT1cInRydWVcIiBbbmdDbGFzc109XCJ6b29tQ29udGFpbmVyQ2xhc3NcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJzbGlkZS50ZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgICAgJGltcGxpY2l0OiBzbGlkZS5zbGlkZURhdGFcbiAgICAgICAgfVwiXG4gICAgICA+PC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgICA8bmctY29udGFpbmVyICpuZ1N3aXRjaERlZmF1bHQ+XG4gICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwic2xpZGUudGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICAgICRpbXBsaWNpdDogc2xpZGUuc2xpZGVEYXRhXG4gICAgICAgIH1cIlxuICAgICAgPjwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==