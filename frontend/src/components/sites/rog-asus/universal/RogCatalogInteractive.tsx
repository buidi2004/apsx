"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import facetMapRaw from "./rog-facet-map.json";

type FacetItem = {
  itemId: number | string;
  name: string;
  isSeries?: number | boolean;
  partNos: string[];
  count: number;
};

type FacetSubGroup = {
  subGroupId: number | string;
  name: string;
  items: FacetItem[];
};

type FacetGroup = {
  groupId: number | string;
  name: string;
  items: FacetItem[];
  subGroup: FacetSubGroup[];
};

type CategoryFacetData = {
  levelTagId: number;
  name: string;
  totalSkus: number;
  groups: FacetGroup[];
};

type FacetMapJson = {
  byCategory: Record<string, CategoryFacetData>;
  byItemId: Record<string, string[]>;
};

const FACET_MAP = facetMapRaw as unknown as FacetMapJson;

const PAGE_SIZE = 9;
const MAX_COMPARE_ITEMS = 4;

const STOCK_PRIORITY: Record<string, number> = {
  in_stock: 0,
  pre_order: 1,
  out_of_stock: 2,
  all: 3,
};

interface ProductCardMeta {
  el: HTMLElement;
  idx: number;
  partNo: string;
  title: string;
  sku: string;
  img: string;
  link: string;
  priceNum: number;
  stock: string;
  hasDeal: boolean;
}

interface FilterOptionSpec {
  id: string;
  kind: "stock" | "deal" | "priceBucket" | "facet";
  groupKey: string;
  label: string;
  count: number;
  disabled?: boolean;
  itemId?: string;
  partNosSet?: Set<string>;
  minVal?: number;
  maxVal?: number;
  stockValue?: string;
  checkboxEl?: HTMLInputElement;
  iconEl?: HTMLElement;
}

const CHECK_SVG = `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="FilterCheckBox__checkIcon__-H9hv"><path d="M1.326 4.42L0 5.744l5.745 5.746L15.91 1.326 14.584 0 5.745 8.839l-4.42-4.42z" fill="#fff"></path></svg>`;

function normalizeLabel(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function formatVndShort(n: number): string {
  return `${Math.round(n).toLocaleString("vi-VN")} ₫`;
}

function buildPriceBuckets(prices: number[]): Array<{ id: string; label: string; min: number; max: number }> {
  if (prices.length === 0) return [];
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  if (maxP <= minP) {
    return [
      {
        id: "price_single",
        label: `Khoảng ${formatVndShort(minP)}`,
        min: 0,
        max: maxP * 2,
      },
    ];
  }

  // Round boundaries to neat 5M or 1M steps based on span
  const span = maxP - minP;
  const rawStep = span / 4;
  const unit = rawStep >= 5_000_000 ? 5_000_000 : rawStep >= 1_000_000 ? 1_000_000 : 250_000;
  const step = Math.max(unit, Math.ceil(rawStep / unit) * unit);
  const start = Math.floor(minP / unit) * unit;

  const buckets: Array<{ id: string; label: string; min: number; max: number }> = [];
  for (let i = 0; i < 5; i++) {
    const low = i === 0 ? 0 : start + i * step;
    const high = i === 4 ? Number.MAX_SAFE_INTEGER : start + (i + 1) * step;
    const count = prices.filter((p) => p >= low && p < high).length;
    if (count === 0) continue;
    const label =
      i === 0
        ? `Dưới ${formatVndShort(high)}`
        : i === 4 || high >= Number.MAX_SAFE_INTEGER
        ? `Trên ${formatVndShort(low)}`
        : `${formatVndShort(low)} - ${formatVndShort(high)}`;
    buckets.push({ id: `price_${i}_${low}`, label, min: low, max: high });
    if (high >= maxP && i > 0) break;
  }
  return buckets;
}

function detectCategoryKey(): string {
  const mainEl = document.querySelector<HTMLElement>("main[data-rog-cat]");
  const attr = mainEl?.getAttribute("data-rog-cat")?.trim();
  if (attr && FACET_MAP.byCategory[attr]) return attr;

  const parts = window.location.pathname.replace(/^\/vn\/?/, "").split("/").filter(Boolean);
  const first = (parts[0] || "").replace(/-group$/, "");
  if (window.location.pathname.includes("gaming-handhelds/accessories")) return "gaming-handhelds-acc";
  if (FACET_MAP.byCategory[first]) return first;
  return "";
}

function createCheckboxListItem(
  opt: FilterOptionSpec,
  onChange: () => void
): HTMLLIElement {
  const li = document.createElement("li");
  li.className = `FilterCheckBox__filterCheckBox__Pn+X4${opt.disabled ? " FilterCheckBox__chkBoxDisable__-t4gB" : ""}`;
  li.innerHTML = `
    <div class="filterCheckBoxName">
      <label for="${opt.id}">${opt.label}</label>
      <i aria-hidden="true" class="FilterCheckBox__chkBox__t1vpH FilterCheckBox__checkBoxIcon__pmC64">
        ${CHECK_SVG}
      </i>
      <input tabindex="${opt.disabled ? -1 : 0}" type="checkbox" ${opt.disabled ? 'disabled="disabled"' : ""} name="rogSidebarFilterCheckBox" id="${opt.id}" value="${opt.id}">
      <p${opt.disabled ? ' class="FilterCheckBox__disable__hWnfr"' : ""} style="padding-left: 5px;">(${opt.count})</p>
    </div>
  `;

  const checkbox = li.querySelector<HTMLInputElement>("input[type='checkbox']")!;
  const icon = li.querySelector<HTMLElement>(".FilterCheckBox__chkBox__t1vpH")!;
  opt.checkboxEl = checkbox;
  opt.iconEl = icon;

  if (!opt.disabled) {
    const syncUiAndFilter = () => {
      syncCheckboxClasses(checkbox, icon);
      onChange();
    };
    checkbox.addEventListener("change", syncUiAndFilter);
    li.querySelector(".filterCheckBoxName")?.addEventListener("click", (e) => {
      if (e.target !== checkbox && e.target !== li.querySelector("label")) {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        syncUiAndFilter();
      }
    });
  }

  return li;
}

function syncCheckboxClasses(checkbox: HTMLInputElement, icon?: HTMLElement | null) {
  if (!icon) return;
  const svg = icon.querySelector("svg");
  if (checkbox.checked) {
    icon.classList.add("FilterCheckBox__active__qE00Y", "FilterCheckBox__chkBoxActived__n36yT", "active");
    svg?.classList.add("FilterCheckBox__chkBoxActived__n36yT");
  } else {
    icon.classList.remove("FilterCheckBox__active__qE00Y", "FilterCheckBox__chkBoxActived__n36yT", "active");
    svg?.classList.remove("FilterCheckBox__chkBoxActived__n36yT");
  }
}

export default function RogCatalogInteractive() {
  const { addLine } = useCart();

  useEffect(() => {
    if (!document.documentElement.getAttribute("dir")) {
      document.documentElement.setAttribute("dir", "ltr");
    }

    const cardEls = Array.from(
      document.querySelectorAll<HTMLElement>(
        "ul.ProductResult__productResultGroupItems__g7jzg > li.productItem, .SeriesHome__seriesHomeGroupItems__lXu3g > li.productItem, li[class*='ProductResultItem__productItem__']"
      )
    );
    if (cardEls.length === 0) return;

    // 1. Parse card metadata using stamped authentic data attributes
    const products: ProductCardMeta[] = cardEls.map((el, idx) => {
      const partNo =
        el.getAttribute("data-partno") ||
        el.querySelector<HTMLInputElement>("input[type='hidden']")?.name ||
        `PART-${idx}`;

      const title =
        el.querySelector(".ProductResultItem__mktName__bqftk, h2, h3")?.textContent?.trim() ||
        `ROG Gaming Product ${idx + 1}`;
      const sku = el.querySelector(".ProductResultItem__subName__Y3lzj")?.textContent?.trim() || "";
      const img = el.querySelector("img")?.src || "";
      const link = el.querySelector("a")?.getAttribute("href") || "#";

      let priceNum = Number(el.getAttribute("data-price") || "0");
      if (!Number.isFinite(priceNum) || priceNum <= 0) {
        const priceText = el.querySelector(".ProductResultItem__finallyPriceValue__6sADl")?.textContent || "";
        const parsed = parseInt(priceText.replace(/[^0-9]/g, ""), 10);
        priceNum = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
      }

      const stock = el.getAttribute("data-stock") || "all";
      const hasDeal = el.getAttribute("data-deal") === "1";

      // Image hover swap
      const imgWrapper = el.querySelector<HTMLElement>(".ProductResultItem__productItemImageWrapper__eeMJe");
      if (imgWrapper) {
        const pics = imgWrapper.querySelectorAll<HTMLElement>("picture");
        if (pics.length >= 2) {
          imgWrapper.onmouseenter = () => {
            pics[0].classList.remove("ProductResultItem__show__K8KZO");
            pics[0].style.opacity = "0";
            pics[1].classList.add("ProductResultItem__show__K8KZO");
            pics[1].style.opacity = "1";
          };
          imgWrapper.onmouseleave = () => {
            pics[0].classList.add("ProductResultItem__show__K8KZO");
            pics[0].style.opacity = "1";
            pics[1].classList.remove("ProductResultItem__show__K8KZO");
            pics[1].style.opacity = "0";
          };
        }
      }

      // Cart fallback only for inline # buy actions
      const existingBuyBtn = el.querySelector<HTMLElement>(".ButtonRed__btnRed__SXGza");
      if (existingBuyBtn) {
        const href = existingBuyBtn.getAttribute("href");
        if (!href || href === "#" || href.startsWith("javascript")) {
          existingBuyBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            addLine({
              slug: partNo || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              name: title,
              image: img,
              price: priceNum > 0 ? priceNum : 19990000,
              href: link,
            });
          };
        }
      }

      // Specs accordion: keep hidden when specs <= 5 (noSeeAllButton)
      const seeAllContainer = el.querySelector<HTMLElement>(".seeAllButton__seeAllButton__dIrKX");
      const seeAllBtn = seeAllContainer?.querySelector<HTMLElement>("button");
      const introEl = el.querySelector<HTMLElement>(".ProductResultItem__productItemIntroduction__Mh6XZ");
      const specsWrapper = el.querySelector<HTMLElement>(".ProductResultItem__productItemWrapper__\\+TBGp");
      const hasOverflowSpecs =
        Boolean(seeAllContainer) &&
        !seeAllContainer?.className.includes("seeAllButton__hidden") &&
        !introEl?.className.includes("noSeeAllButton");

      if (seeAllBtn && seeAllContainer && specsWrapper && hasOverflowSpecs) {
        seeAllContainer.style.display = "block";
        seeAllBtn.onclick = (e) => {
          e.preventDefault();
          const isCollapsed = specsWrapper.style.maxHeight === "130px";
          specsWrapper.style.maxHeight = isCollapsed ? "2000px" : "130px";
          specsWrapper.style.overflow = isCollapsed ? "visible" : "hidden";
          const span = seeAllBtn.querySelector("span");
          if (span) span.textContent = isCollapsed ? "Rút gọn" : "Xem thêm";
          const svg = seeAllBtn.querySelector("svg");
          if (svg) svg.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
        };
      } else if (seeAllContainer) {
        seeAllContainer.style.display = "none";
      }

      return { el, idx, partNo, title, sku, img, link, priceNum, stock, hasDeal };
    });

    const catKey = detectCategoryKey();
    const catFacets = catKey ? FACET_MAP.byCategory[catKey] : undefined;
    const catalogPartSet = new Set(products.map((p) => p.partNo));
    const registeredOptions: FilterOptionSpec[] = [];

    let minPriceFilter: number | null = null;
    let maxPriceFilter: number | null = null;
    let visibleCount = PAGE_SIZE;
    let currentSortMode = "date";

    // URL initial itemId filter support (?items=... or ?itemId=...)
    const params = new URLSearchParams(window.location.search);
    const urlItemIds = new Set<string>(
      [...(params.get("items") || "").split(","), ...(params.get("itemId") || "").split(",")]
        .map((s) => s.trim())
        .filter(Boolean)
    );

    // 2. Wire & Populate ALL Filter Sidebar Sections
    const filterToggles = Array.from(
      document.querySelectorAll<HTMLElement>(".Toggle__filterToggle__mce5C")
    );

    const usedFacetGroupIds = new Set<string>();

    const wireAccordionToggle = (toggle: HTMLElement, btn: HTMLButtonElement, contentList: HTMLElement) => {
      const syncIcons = (open: boolean) => {
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        contentList.style.display = open ? "block" : "none";
        const svgs = btn.querySelectorAll("svg");
        if (svgs.length >= 2) {
          (svgs[0] as unknown as HTMLElement).style.display = open ? "none" : "block";
          (svgs[1] as unknown as HTMLElement).style.display = open ? "block" : "none";
        }
      };

      const isInitiallyOpen = btn.getAttribute("aria-expanded") !== "false" && contentList.style.display !== "none";
      syncIcons(isInitiallyOpen);

      btn.onclick = (e) => {
        e.preventDefault();
        const currentlyOpen = contentList.style.display !== "none";
        syncIcons(!currentlyOpen);
      };
    };

    filterToggles.forEach((toggle, tIdx) => {
      const btn = toggle.querySelector<HTMLButtonElement>("button.Toggle__filterToggleName__JCEpr");
      if (!btn) return;
      const rawTitle = btn.querySelector("span")?.textContent?.trim() || "";
      const normTitle = normalizeLabel(rawTitle);

      let contentList = toggle.querySelector<HTMLElement>(":scope > .toggleList");
      if (!contentList) {
        contentList = document.createElement("div");
        contentList.className = "toggleList";
        contentList.style.display = "none";
        toggle.appendChild(contentList);
      }

      // Section A: Store availability ("Có sẵn tại ROG Store")
      if (normTitle.includes("co san") || normTitle.includes("in stock") || toggle.querySelector(".OnlineProduct__filterList__WZZtw")) {
        const ul = toggle.querySelector<HTMLElement>(".OnlineProduct__filterList__WZZtw") || document.createElement("ul");
        if (!ul.parentElement) {
          ul.className = "OnlineProduct__filterList__WZZtw";
          contentList.appendChild(ul);
        }
        ul.innerHTML = "";
        const inStockCount = products.filter((p) => p.stock === "in_stock").length;
        const preOrderCount = products.filter((p) => p.stock === "pre_order").length;
        const oosCount = products.filter((p) => p.stock === "out_of_stock").length;

        const stockOptions: Array<{ val: string; label: string; count: number; disabled?: boolean }> = [
          { val: "in_stock", label: "Còn hàng tại ROG eShop", count: inStockCount, disabled: inStockCount === 0 },
          { val: "pre_order", label: "Đặt trước tại ROG eShop", count: preOrderCount, disabled: preOrderCount === 0 },
          { val: "out_of_stock", label: "Tạm hết hàng", count: oosCount, disabled: oosCount === 0 },
          { val: "all", label: "Tất cả sản phẩm", count: products.length, disabled: false },
        ];

        stockOptions.forEach((s, idx) => {
          const spec: FilterOptionSpec = {
            id: `rog-stock-${tIdx}-${idx}`,
            kind: "stock",
            groupKey: "stock",
            label: s.label,
            count: s.count,
            disabled: s.disabled,
            stockValue: s.val,
          };
          registeredOptions.push(spec);
          ul.appendChild(createCheckboxListItem(spec, handleFilterAndSort));
        });
        wireAccordionToggle(toggle, btn, contentList);
        return;
      }

      // Section B: Shop / Deals ("Mua")
      if (normTitle === "mua" || normTitle === "shop" || toggle.querySelector(".FilterShop__filterList__fiQpr")) {
        const ul = toggle.querySelector<HTMLElement>(".FilterShop__filterList__fiQpr") || document.createElement("ul");
        if (!ul.parentElement) {
          ul.className = "FilterShop__filterList__fiQpr";
          contentList.appendChild(ul);
        }
        ul.innerHTML = "";
        const dealCount = products.filter((p) => p.hasDeal).length;
        const spec: FilterOptionSpec = {
          id: `rog-deal-${tIdx}`,
          kind: "deal",
          groupKey: "deal",
          label: "Deals / Khuyến mãi",
          count: dealCount,
          disabled: dealCount === 0,
        };
        registeredOptions.push(spec);
        ul.appendChild(createCheckboxListItem(spec, handleFilterAndSort));
        wireAccordionToggle(toggle, btn, contentList);
        return;
      }

      // Section C: Price ("Giá") + Min/Max inputs + ÁP DỤNG
      if (normTitle === "gia" || normTitle === "price" || toggle.querySelector(".PriceChangeModule__filterList__kcSvP")) {
        const ul = toggle.querySelector<HTMLElement>(".PriceChangeModule__filterList__kcSvP");
        const pricedValues = products.map((p) => p.priceNum).filter((n) => n > 0);
        if (ul) {
          ul.innerHTML = "";
          const buckets = buildPriceBuckets(pricedValues);
          buckets.forEach((b) => {
            const count = pricedValues.filter((p) => p >= b.min && p < b.max).length;
            const spec: FilterOptionSpec = {
              id: `rog-${b.id}`,
              kind: "priceBucket",
              groupKey: "priceBucket",
              label: b.label,
              count,
              minVal: b.min,
              maxVal: b.max,
            };
            registeredOptions.push(spec);
            ul.appendChild(createCheckboxListItem(spec, handleFilterAndSort));
          });
        }

        const minInput = toggle.querySelector<HTMLInputElement>("#minInput");
        const maxInput = toggle.querySelector<HTMLInputElement>("#maxInput");
        const applyBtn = toggle.querySelector<HTMLElement>(".ButtonRed__isFilterPrice__-fvAf .btn, .PriceChangeModule__changePriceWrapper__Nk3fE .btn");

        if (minInput && pricedValues.length > 0 && (minInput.value === "0" || !minInput.value)) {
          minInput.placeholder = formatVndShort(Math.min(...pricedValues));
        }
        if (maxInput && pricedValues.length > 0 && (maxInput.value === "0" || !maxInput.value)) {
          maxInput.placeholder = formatVndShort(Math.max(...pricedValues));
        }

        const applyCustomPrice = () => {
          const minParsed = parseInt((minInput?.value || "").replace(/[^0-9]/g, ""), 10);
          const maxParsed = parseInt((maxInput?.value || "").replace(/[^0-9]/g, ""), 10);
          minPriceFilter = Number.isFinite(minParsed) && minParsed > 0 ? minParsed : null;
          maxPriceFilter = Number.isFinite(maxParsed) && maxParsed > 0 ? maxParsed : null;
          if (minPriceFilter !== null && maxPriceFilter !== null && minPriceFilter > maxPriceFilter) {
            [minPriceFilter, maxPriceFilter] = [maxPriceFilter, minPriceFilter];
          }
          handleFilterAndSort();
        };

        if (applyBtn) {
          applyBtn.onclick = (e) => {
            e.preventDefault();
            applyCustomPrice();
          };
        }
        [minInput, maxInput].forEach((inp) => {
          inp?.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyCustomPrice();
            }
          });
        });

        wireAccordionToggle(toggle, btn, contentList);
        return;
      }

      // Section D: Match exact ASUS Facet Group from rog-facet-map.json
      const matchedGroup = catFacets?.groups.find((g) => {
        if (usedFacetGroupIds.has(String(g.groupId))) return false;
        const gn = normalizeLabel(g.name);
        return gn === normTitle || gn.includes(normTitle) || normTitle.includes(gn);
      });

      if (matchedGroup) {
        usedFacetGroupIds.add(String(matchedGroup.groupId));
        contentList.innerHTML = "";
        const groupKey = `group_${matchedGroup.groupId}`;

        // Render direct items
        if (matchedGroup.items.length > 0) {
          const ul = document.createElement("ul");
          ul.className = "FilterItem__filterList__oO-Qz";
          ul.style.cssText = "list-style: none; padding: 4px 0 8px; margin: 0;";
          matchedGroup.items.forEach((it) => {
            const set = new Set(it.partNos);
            const localCount = products.filter((p) => set.has(p.partNo)).length;
            const idStr = String(it.itemId);
            const spec: FilterOptionSpec = {
              id: `rog-facet-${matchedGroup.groupId}-${idStr}`,
              kind: "facet",
              groupKey,
              label: it.name,
              count: localCount || it.count,
              disabled: catalogPartSet.size > 0 && localCount === 0,
              itemId: idStr,
              partNosSet: set,
            };
            const li = createCheckboxListItem(spec, handleFilterAndSort);
            if (urlItemIds.has(idStr) && spec.checkboxEl && !spec.disabled) {
              spec.checkboxEl.checked = true;
              syncCheckboxClasses(spec.checkboxEl, spec.iconEl);
            }
            registeredOptions.push(spec);
            ul.appendChild(li);
          });
          contentList.appendChild(ul);
        }

        // Render subGroup hierarchies (e.g. GeForce RTX 50 Series -> 5090, 5080...)
        if (matchedGroup.subGroup.length > 0) {
          const sgContainer = document.createElement("div");
          sgContainer.style.cssText = "padding: 2px 0 8px;";
          matchedGroup.subGroup.forEach((sg, sgIdx) => {
            const sgWrapper = document.createElement("div");
            sgWrapper.style.cssText = "margin-bottom: 4px;";

            const sgBtn = document.createElement("button");
            sgBtn.type = "button";
            sgBtn.className = "FilterCheckBox__subGroupHeaderRog";
            sgBtn.setAttribute("aria-expanded", sgIdx === 0 ? "true" : "false");
            sgBtn.innerHTML = `<span>${sg.name}</span><span>${sgIdx === 0 ? "−" : "+"}</span>`;

            const sgUl = document.createElement("ul");
            sgUl.className = "FilterCheckBox__subListRog";
            sgUl.style.display = sgIdx === 0 ? "block" : "none";

            let hasActiveFromUrl = false;
            sg.items.forEach((it) => {
              const set = new Set(it.partNos);
              const localCount = products.filter((p) => set.has(p.partNo)).length;
              const idStr = String(it.itemId);
              const spec: FilterOptionSpec = {
                id: `rog-facet-${matchedGroup.groupId}-${sg.subGroupId}-${idStr}`,
                kind: "facet",
                groupKey,
                label: it.name,
                count: localCount || it.count,
                disabled: catalogPartSet.size > 0 && localCount === 0,
                itemId: idStr,
                partNosSet: set,
              };
              const li = createCheckboxListItem(spec, handleFilterAndSort);
              if (urlItemIds.has(idStr) && spec.checkboxEl && !spec.disabled) {
                spec.checkboxEl.checked = true;
                syncCheckboxClasses(spec.checkboxEl, spec.iconEl);
                hasActiveFromUrl = true;
              }
              registeredOptions.push(spec);
              sgUl.appendChild(li);
            });

            if (hasActiveFromUrl) {
              sgUl.style.display = "block";
              sgBtn.setAttribute("aria-expanded", "true");
              const sign = sgBtn.querySelector("span:last-child");
              if (sign) sign.textContent = "−";
            }

            sgBtn.onclick = (e) => {
              e.preventDefault();
              const isOpen = sgUl.style.display !== "none";
              sgUl.style.display = isOpen ? "none" : "block";
              sgBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
              const sign = sgBtn.querySelector("span:last-child");
              if (sign) sign.textContent = isOpen ? "+" : "−";
            };

            sgWrapper.appendChild(sgBtn);
            sgWrapper.appendChild(sgUl);
            sgContainer.appendChild(sgWrapper);
          });
          contentList.appendChild(sgContainer);
        }

        // Open Series or URL-preselected toggle initially
        const hasChecked = Array.from(contentList.querySelectorAll<HTMLInputElement>("input[type='checkbox']")).some((c) => c.checked);
        if (normTitle.includes("series") || normTitle === "gpu" || hasChecked) {
          contentList.style.display = "block";
          btn.setAttribute("aria-expanded", "true");
        }
        wireAccordionToggle(toggle, btn, contentList);
        return;
      }

      wireAccordionToggle(toggle, btn, contentList);
    });

    const resetAllFilters = (e?: Event) => {
      e?.preventDefault();
      registeredOptions.forEach((opt) => {
        if (opt.checkboxEl) {
          opt.checkboxEl.checked = false;
          syncCheckboxClasses(opt.checkboxEl, opt.iconEl);
        }
      });
      minPriceFilter = null;
      maxPriceFilter = null;
      document.querySelectorAll<HTMLInputElement>("#minInput, #maxInput").forEach((inp) => (inp.value = "0"));
      handleFilterAndSort();
    };

    // 3. Render active filter chips inside .filterTabList__filterListContainer__0zk85
    function renderActiveFilterPills() {
      const checkedOpts = registeredOptions.filter((o) => o.checkboxEl?.checked);
      const hasCustomRange = minPriceFilter !== null || maxPriceFilter !== null;
      const hasAnyFilter = checkedOpts.length > 0 || hasCustomRange;
      const tabContainers = Array.from(
        document.querySelectorAll<HTMLElement>(".filterTabList__filterListContainer__0zk85")
      );

      tabContainers.forEach((container) => {
        container.innerHTML = "";
        checkedOpts.forEach((opt) => {
          const pill = document.createElement("button");
          pill.type = "button";
          pill.className = "filterTabList__filterTabRog";
          pill.innerHTML = `<span>${opt.label}</span><span class="filterTabList__closeIcon__TxQf0" aria-label="Xóa ${opt.label}"></span>`;
          pill.onclick = () => {
            if (opt.checkboxEl) {
              opt.checkboxEl.checked = false;
              syncCheckboxClasses(opt.checkboxEl, opt.iconEl);
              handleFilterAndSort();
            }
          };
          container.appendChild(pill);
        });

        if (hasCustomRange) {
          const minTxt = minPriceFilter ? formatVndShort(minPriceFilter) : "0 ₫";
          const maxTxt = maxPriceFilter ? formatVndShort(maxPriceFilter) : "Tối đa";
          const pill = document.createElement("button");
          pill.type = "button";
          pill.className = "filterTabList__filterTabRog";
          pill.innerHTML = `<span>Giá: ${minTxt} - ${maxTxt}</span><span class="filterTabList__closeIcon__TxQf0" aria-label="Xóa khoảng giá"></span>`;
          pill.onclick = () => {
            minPriceFilter = null;
            maxPriceFilter = null;
            document.querySelectorAll<HTMLInputElement>("#minInput, #maxInput").forEach((inp) => (inp.value = "0"));
            handleFilterAndSort();
          };
          container.appendChild(pill);
        }

        if (hasAnyFilter) {
          const clearPill = document.createElement("button");
          clearPill.type = "button";
          clearPill.className = "filterTabList__clearAllBtnRog";
          clearPill.textContent = "Xóa tất cả";
          clearPill.onclick = resetAllFilters;
          container.appendChild(clearPill);
        }
      });

      document
        .querySelectorAll<HTMLElement>(".ProductResult__mobileClearFilterButton__ll6e-, .SeriesHome__mobileClearFilterButton__\\+OZxX")
        .forEach((btn) => {
          btn.style.visibility = hasAnyFilter ? "visible" : "";
        });
    }

    // 4. Visibility, Counter Sync & Authentic 9-per-page Load More Button Reuse
    function updateCardVisibility(list: ProductCardMeta[]) {
      products.forEach((p) => {
        p.el.style.display = "none";
      });
      list.slice(0, visibleCount).forEach((p) => {
        p.el.style.display = "";
      });

      // Empty filter message
      document
        .querySelectorAll<HTMLElement>(".SeriesHome__notAnyMetaMessage__ST7w-, .ProductResult__notAnyMetaMessage__")
        .forEach((msg) => {
          msg.style.display = list.length === 0 ? "block" : "none";
        });

      // Reuse existing SSR loadMore wrapper rather than creating duplicate elements
      let loadMoreWrapper =
        document.querySelector<HTMLElement>(".ProductResult__loadMoreButtonWrapper__W1KMM") ||
        document.querySelector<HTMLElement>(".SeriesHome__loadMoreButtonWrapper__ktKLE") ||
        document.querySelector<HTMLElement>("#rog-catalog-load-more-wrapper");

      const container = products[0]?.el.parentElement;
      if (!container) return;

      if (visibleCount < list.length) {
        if (!loadMoreWrapper) {
          loadMoreWrapper = document.createElement("div");
          loadMoreWrapper.id = "rog-catalog-load-more-wrapper";
          loadMoreWrapper.className = "ProductResult__loadMoreButtonWrapper__W1KMM";
          loadMoreWrapper.innerHTML = `
            <div class="ButtonBorderRed__borderRedButton__mg7A9">
              <div role="button" tabindex="0" aria-label="View More Products" class="btn ButtonBorderRed__btnBorderRed__zkcIA ButtonBorderRed__isRed__NoKph ButtonBorderRed__isProductLearnMore__9hfAx">
                <div class="ButtonBorderRed__inner__-s0h8">
                  <span class="buttonName">Xem Thêm Sản Phẩm</span>
                </div>
                <div class="ButtonBorderRed__hoverColor__CfY9D"></div>
              </div>
            </div>
          `;
          container.parentElement?.appendChild(loadMoreWrapper);
        }

        const remaining = list.length - visibleCount;
        const btnText = loadMoreWrapper.querySelector(".ButtonBorderRed__inner__-s0h8 span, .buttonName");
        if (btnText) {
          btnText.textContent = `Xem Thêm Sản Phẩm (${remaining})`;
        }
        loadMoreWrapper.style.display = "flex";

        const clickable = loadMoreWrapper.querySelector<HTMLElement>(".btn");
        if (clickable) {
          clickable.onclick = (e) => {
            e.preventDefault();
            visibleCount += PAGE_SIZE;
            updateCardVisibility(list);
          };
        }
      } else if (loadMoreWrapper) {
        loadMoreWrapper.style.display = "none";
      }

      // Update product counters ONLY (preserve SEO .filterDescription untouched)
      document.querySelectorAll<HTMLElement>("h2.ProductResult__filtersTotal__geyCI").forEach((h2) => {
        h2.textContent = `${list.length} Sản phẩm`;
      });
      document
        .querySelectorAll<HTMLElement>(".ProductResult__mobileApplyFilterButton__prVwN, .SeriesHome__mobileApplyFilterButton__cxOeS")
        .forEach((btn) => {
          btn.textContent = `See Result(${list.length})`;
        });
    }

    // 5. Combined Multi-Group Filtering & Sorting Engine
    function handleFilterAndSort() {
      const activeByGroup = new Map<string, FilterOptionSpec[]>();
      registeredOptions.forEach((opt) => {
        if (opt.checkboxEl?.checked) {
          const arr = activeByGroup.get(opt.groupKey) || [];
          arr.push(opt);
          activeByGroup.set(opt.groupKey, arr);
        }
      });

      const filtered = products.filter((p) => {
        // Group-based AND across groups, OR within each group
        for (const [, opts] of activeByGroup.entries()) {
          const matchesGroup = opts.some((opt) => {
            if (opt.kind === "stock") {
              return opt.stockValue === "all" || p.stock === opt.stockValue;
            }
            if (opt.kind === "deal") {
              return p.hasDeal;
            }
            if (opt.kind === "priceBucket") {
              return p.priceNum > 0 && p.priceNum >= (opt.minVal || 0) && p.priceNum < (opt.maxVal || Number.MAX_SAFE_INTEGER);
            }
            if (opt.kind === "facet" && opt.partNosSet) {
              return opt.partNosSet.has(p.partNo);
            }
            return true;
          });
          if (!matchesGroup) return false;
        }

        // Custom min/max price input filter
        if (minPriceFilter !== null || maxPriceFilter !== null) {
          if (p.priceNum <= 0) return false;
          if (minPriceFilter !== null && p.priceNum < minPriceFilter) return false;
          if (maxPriceFilter !== null && p.priceNum > maxPriceFilter) return false;
        }

        return true;
      });

      // Apply Sort
      if (currentSortMode === "highprice") {
        filtered.sort((a, b) => (b.priceNum || -1) - (a.priceNum || -1));
      } else if (currentSortMode === "lowprice") {
        filtered.sort((a, b) => {
          const pa = a.priceNum > 0 ? a.priceNum : Number.MAX_SAFE_INTEGER;
          const pb = b.priceNum > 0 ? b.priceNum : Number.MAX_SAFE_INTEGER;
          return pa - pb;
        });
      } else if (currentSortMode === "stock") {
        filtered.sort((a, b) => (STOCK_PRIORITY[a.stock] ?? 3) - (STOCK_PRIORITY[b.stock] ?? 3) || a.idx - b.idx);
      } else if (currentSortMode === "discount") {
        filtered.sort((a, b) => Number(b.hasDeal) - Number(a.hasDeal) || a.idx - b.idx);
      } else {
        filtered.sort((a, b) => a.idx - b.idx);
      }

      const parentUl = products[0]?.el.parentElement;
      if (parentUl) {
        filtered.forEach((p) => parentUl.appendChild(p.el));
      }

      renderActiveFilterPills();
      visibleCount = PAGE_SIZE;
      updateCardVisibility(filtered);
    }

    // 6. Wire Sort Selects & Custom Sort Switchers (syncing mobile & desktop widgets together)
    function syncAllSortWidgets(mode: string, labelText: string) {
      currentSortMode = mode;
      document.querySelectorAll<HTMLSelectElement>("select[name^='productListSort']").forEach((sel) => {
        sel.value = mode;
      });
      document.querySelectorAll<HTMLElement>(".ProductResultSort__sortButton__CQ2ED").forEach((sortBox) => {
        const lbl = sortBox.querySelector<HTMLElement>(".ProductResultSort__sortSwitch__fEvvM label");
        if (lbl && labelText) lbl.textContent = labelText;
        sortBox.querySelectorAll<HTMLElement>("li.listSort").forEach((li) => {
          const btn = li.querySelector("button");
          const txt = btn?.textContent?.trim() || "";
          const isMatch = txt === labelText;
          li.classList.toggle("ProductResultSort__active__AP-+F", isMatch);
          if (btn) {
            if (isMatch) btn.setAttribute("disabled", "disabled");
            else btn.removeAttribute("disabled");
          }
        });
      });
    }

    document.querySelectorAll<HTMLSelectElement>("select[name^='productListSort']").forEach((select) => {
      select.onchange = () => {
        const opt = select.options[select.selectedIndex];
        syncAllSortWidgets(select.value, opt?.textContent?.trim() || "Mới nhất");
        handleFilterAndSort();
      };
    });

    document.querySelectorAll<HTMLElement>(".ProductResultSort__sortButton__CQ2ED").forEach((sortContainer) => {
      const sortSwitch = sortContainer.querySelector<HTMLElement>(".ProductResultSort__sortSwitch__fEvvM");
      const sortList = sortContainer.querySelector<HTMLElement>(".ProductResultSort__sortList__cBS6q");
      if (!sortSwitch || !sortList) return;

      // Ensure sort dropdown starts hidden
      sortList.style.display = "none";

      sortSwitch.onclick = (e) => {
        e.stopPropagation();
        const isClosed = sortList.style.display === "none" || !sortList.style.display;
        document.querySelectorAll<HTMLElement>(".ProductResultSort__sortList__cBS6q").forEach((l) => {
          l.style.display = "none";
        });
        sortList.style.display = isClosed ? "block" : "none";
      };

      sortList.querySelectorAll<HTMLElement>("li button").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const text = btn.textContent?.trim() || "";
          let nextMode = "date";
          if (/cao đến thấp|highprice/i.test(text)) nextMode = "highprice";
          else if (/thấp đến cao|lowprice/i.test(text)) nextMode = "lowprice";
          else if (/còn hàng|stock/i.test(text)) nextMode = "stock";
          else if (/discount/i.test(text)) nextMode = "discount";
          else if (/phổ biến|popularity/i.test(text)) nextMode = "popularity";

          syncAllSortWidgets(nextMode, text);
          sortList.style.display = "none";
          handleFilterAndSort();
        };
      });
    });

    const handleDocClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(".ProductResultSort__sortButton__CQ2ED")) return;
      document.querySelectorAll<HTMLElement>(".ProductResultSort__sortList__cBS6q").forEach((list) => {
        list.style.display = "none";
      });
    };
    document.addEventListener("click", handleDocClick);

    // 7. Wire Clear All ("Xóa tất cả") buttons
    document
      .querySelectorAll<HTMLElement>(
        ".ProductResult__clearAllContent__ZlfqK, .ProductResult__mobileClearFilterButton__ll6e-, .SeriesHome__mobileClearFilterButton__\\+OZxX"
      )
      .forEach((btn) => {
        btn.onclick = resetAllFilters;
      });

    // 8. Mobile Filter Drawer Toggle (Light theme #ffffff, auto-reset on resize)
    const mobileFilterBtn = document.querySelector<HTMLElement>(
      ".SeriesHome__mobileFilterButton__4yqQf, .ProductResult__mobileFilterButton__vF83w"
    );
    const filterContainer = document.querySelector<HTMLElement>(
      ".filterLeftContent.ProductResult__productResultFilter__yMvPq, .filterLeftContent.SeriesHome__productResultFilter__QQCJz, .filterLeftContent"
    );

    const openMobileFilter = (e: Event) => {
      e.preventDefault();
      if (!filterContainer) return;
      filterContainer.style.display = "block";
      filterContainer.style.position = "fixed";
      filterContainer.style.top = "0";
      filterContainer.style.left = "0";
      filterContainer.style.width = "100%";
      filterContainer.style.height = "100vh";
      filterContainer.style.zIndex = "14000";
      filterContainer.style.background = "#ffffff";
      filterContainer.style.color = "#181818";
      filterContainer.style.overflowY = "auto";
      filterContainer.style.padding = "16px";
    };

    const closeMobileFilter = () => {
      if (!filterContainer) return;
      filterContainer.style.cssText = "";
    };

    if (mobileFilterBtn) mobileFilterBtn.onclick = openMobileFilter;
    document
      .querySelectorAll<HTMLElement>(
        ".ProductResult__closeLightBox__FH9fP, .SeriesHome__closeLightBox__0hWxk, .ProductResult__mobileApplyFilterButton__prVwN, .SeriesHome__mobileApplyFilterButton__cxOeS, .Filter__backFilterButton__NNovJ"
      )
      .forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          closeMobileFilter();
        };
      });

    const handleResize = () => {
      if (window.innerWidth >= 1024 && filterContainer) {
        filterContainer.style.cssText = "";
      }
    };
    window.addEventListener("resize", handleResize);

    // 9. Floating Compare Bar (#rog-floating-compare-panel, max 4 items)
    const compareCheckboxes = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        "input[name='productCheckBox'], input[id^='checkbox-'][type='checkbox']"
      )
    );

    const syncCompareCheckboxVisual = (cb: HTMLInputElement) => {
      const lbl = cb.closest(".ProductResultItem__productCheckBox__yqNsf")?.querySelector("label");
      if (lbl) lbl.classList.toggle("ProductResultItem__isCheck__YYlKd", cb.checked);
    };

    function updateComparePanel(changedCb?: HTMLInputElement) {
      let checkedBoxes = compareCheckboxes.filter((cb) => cb.checked);
      if (checkedBoxes.length > MAX_COMPARE_ITEMS && changedCb) {
        changedCb.checked = false;
        syncCompareCheckboxVisual(changedCb);
        checkedBoxes = compareCheckboxes.filter((cb) => cb.checked);
      }

      let panel = document.getElementById("rog-floating-compare-panel") as HTMLElement | null;
      if (checkedBoxes.length === 0) {
        if (panel) panel.style.display = "none";
        return;
      }

      if (!panel) {
        panel = document.createElement("div");
        panel.id = "rog-floating-compare-panel";
        panel.className = "ComparePanel__comparePanel__BycQ3 ComparePanel__active__RqFfs";
        panel.style.cssText =
          "position: fixed; bottom: 0; left: 0; width: 100%; z-index: 9999; background: #121212; border-top: 2px solid #ff0036; padding: 14px 24px; box-shadow: 0 -8px 24px rgba(0,0,0,0.45);";
        document.body.appendChild(panel);
      }

      const selectedItems = checkedBoxes.map((cb) => {
        const cardLi = cb.closest("li");
        const meta = products.find((p) => p.el === cardLi);
        return {
          id: cb.id,
          partNo: meta?.partNo || cb.id.replace(/^checkbox-/, ""),
          title: meta?.title || cardLi?.querySelector(".ProductResultItem__mktName__bqftk")?.textContent?.trim() || "ROG Product",
          sub: meta?.sku || cardLi?.querySelector(".ProductResultItem__subName__Y3lzj")?.textContent?.trim() || "",
          img: meta?.img || cardLi?.querySelector("img")?.src || "",
        };
      });

      const compareQuery = encodeURIComponent(selectedItems.map((s) => s.partNo || s.title).join(","));

      panel.innerHTML = `
        <div style="max-width: 1440px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
          <div style="display: flex; flex-direction: column;">
            <span style="color: #fff; font-weight: 700; font-size: 15px; text-transform: uppercase;">So sánh sản phẩm (${selectedItems.length}/${MAX_COMPARE_ITEMS})</span>
            <p style="color: #aaa; font-size: 12px; margin: 2px 0 0;">Chọn tối đa 4 sản phẩm để so sánh thông số chi tiết</p>
          </div>
          <div style="display: flex; gap: 12px; align-items: center; flex: 1; justify-content: center; overflow-x: auto; padding: 4px 0;">
            ${selectedItems
              .map(
                (item) => `
              <div style="display: flex; align-items: center; gap: 10px; background: #1c1c1c; border: 1px solid #333; padding: 6px 12px;">
                ${item.img ? `<img src="${item.img}" alt="${item.title}" style="width: 44px; height: 34px; object-fit: contain;" />` : ""}
                <div style="font-size: 12px; color: #fff; max-width: 155px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  <div>${item.title}</div>
                  <div style="color: #999; font-size: 10px;">${item.sub}</div>
                </div>
                <button type="button" data-remove-id="${item.id}" aria-label="Bỏ chọn ${item.title}" style="background: transparent; border: none; color: #ff0036; font-size: 16px; cursor: pointer; padding: 0 4px; font-weight: bold;">✕</button>
              </div>`
              )
              .join("")}
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button type="button" id="rog-clear-compare-btn" style="background: transparent; border: 1px solid #555; color: #ddd; padding: 10px 16px; cursor: pointer; font-size: 12px; text-transform: uppercase; font-weight: 600;">
              Xóa tất cả
            </button>
            <a href="/vn/compare?products=${compareQuery}" class="btn ButtonRed__btnRed__SXGza" style="background: #ff0036; color: #fff; text-decoration: none; padding: 10px 22px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
              Xem so sánh (${selectedItems.length})
            </a>
          </div>
        </div>
      `;
      panel.style.display = "block";

      panel.querySelectorAll<HTMLElement>("button[data-remove-id]").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const cb = document.getElementById(btn.getAttribute("data-remove-id") || "") as HTMLInputElement | null;
          if (cb) {
            cb.checked = false;
            syncCompareCheckboxVisual(cb);
            updateComparePanel();
          }
        };
      });

      const clearBtn = panel.querySelector<HTMLElement>("#rog-clear-compare-btn");
      if (clearBtn) {
        clearBtn.onclick = (e) => {
          e.preventDefault();
          compareCheckboxes.forEach((cb) => {
            cb.checked = false;
            syncCompareCheckboxVisual(cb);
          });
          updateComparePanel();
        };
      }
    }

    compareCheckboxes.forEach((cb) => {
      cb.onchange = () => {
        syncCompareCheckboxVisual(cb);
        updateComparePanel(cb);
      };
    });

    // Initial render (applies URL ?items= filter if present + shows first 9 cards)
    handleFilterAndSort();

    return () => {
      document.removeEventListener("click", handleDocClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [addLine]);

  return null;
}
