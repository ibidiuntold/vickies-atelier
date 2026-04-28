(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Carousel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Carousel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function Carousel({ images }) {
    _s();
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // null = not yet measured (server render + first paint).
    // Buttons are hidden until after mount so server and client render identical HTML.
    const [atStart, setAtStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [atEnd, setAtEnd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const updateButtons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Carousel.useCallback[updateButtons]": ()=>{
            const el = trackRef.current;
            if (!el) return;
            setAtStart(el.scrollLeft <= 4);
            setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
        }
    }["Carousel.useCallback[updateButtons]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Carousel.useEffect": ()=>{
            updateButtons();
            const el = trackRef.current;
            if (!el) return;
            el.addEventListener("scroll", updateButtons, {
                passive: true
            });
            return ({
                "Carousel.useEffect": ()=>el.removeEventListener("scroll", updateButtons)
            })["Carousel.useEffect"];
        }
    }["Carousel.useEffect"], [
        updateButtons,
        images
    ]);
    const scroll = (dir)=>{
        const el = trackRef.current;
        if (!el) return;
        const slideWidth = el.querySelector("div")?.offsetWidth ?? 300;
        el.scrollBy({
            left: dir === "right" ? slideWidth + 16 : -(slideWidth + 16),
            behavior: "smooth"
        });
    };
    const navBtnBase = "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border flex items-center justify-center shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]";
    const navBtnActive = "bg-[var(--bg)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--brand)] hover:text-[var(--brand)] cursor-pointer";
    const navBtnDisabled = "bg-[var(--bg)] border-[var(--border)] text-[var(--muted)] opacity-30 cursor-not-allowed pointer-events-none";
    // Before mount: buttons are not rendered at all — server and client agree on null state.
    // After mount: buttons appear with correct measured state.
    const mounted = atStart !== null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative px-6",
        children: [
            mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>scroll("left"),
                disabled: atStart === true,
                "aria-label": "Scroll left",
                "aria-disabled": atStart === true,
                className: `${navBtnBase} -left-2 ${atStart ? navBtnDisabled : navBtnActive}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowLeftIcon"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/components/Carousel.tsx",
                    lineNumber: 66,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Carousel.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: trackRef,
                className: "flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2",
                style: {
                    scrollbarWidth: "none"
                },
                children: images.map((img)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative shrink-0 snap-start rounded-[18px] overflow-hidden",
                        style: {
                            width: 300,
                            height: 400
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: img.src,
                            alt: img.alt,
                            fill: true,
                            className: "object-cover object-top",
                            loading: "lazy",
                            sizes: "300px",
                            quality: 75
                        }, void 0, false, {
                            fileName: "[project]/src/components/Carousel.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this)
                    }, img.src, false, {
                        fileName: "[project]/src/components/Carousel.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/Carousel.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>scroll("right"),
                disabled: atEnd === true,
                "aria-label": "Scroll right",
                "aria-disabled": atEnd === true,
                className: `${navBtnBase} -right-2 ${atEnd ? navBtnDisabled : navBtnActive}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowRightIcon"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/components/Carousel.tsx",
                    lineNumber: 104,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Carousel.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Carousel.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(Carousel, "7rZEL3KkTC4pi000M81Wrr3bonk=");
_c = Carousel;
var _c;
__turbopack_context__.k.register(_c, "Carousel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_Carousel_tsx_08cc7e33._.js.map