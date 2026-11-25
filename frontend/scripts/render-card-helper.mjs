import fs from 'fs';
import path from 'path';

let priceMap = {};
const possiblePaths = [
  path.resolve('frontend/.cache/all-sku-prices.json'),
  path.resolve('.cache/all-sku-prices.json'),
  path.resolve(path.dirname(new URL(import.meta.url).pathname), '../.cache/all-sku-prices.json')
];
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    try {
      priceMap = JSON.parse(fs.readFileSync(p, 'utf8'));
      break;
    } catch {}
  }
}

export function reloadPriceMap() {
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        priceMap = JSON.parse(fs.readFileSync(p, 'utf8'));
        return priceMap;
      } catch {}
    }
  }
  return priceMap;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeLink(rawLink, title) {
  if (!rawLink) return '#';
  let link = String(rawLink).trim().replace(/^https:\/\/rog\.asus\.com/i, '');
  if (!link || link === '/' || link === '/vn' || link === '/vn/') {
    const slug = String(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return slug ? `/vn/search?q=${encodeURIComponent(title)}` : '/vn/';
  }
  return link.startsWith('/') ? link : `/vn/${link}`;
}

export function renderAuthenticCard(sku, index, overridePriceMap = null) {
  const activePrices = overridePriceMap || priceMap;
  const title = sku.mktName || '';
  const subName = sku.name || '';
  const partNo = sku.partNo || `PART-${sku.id || index}`;
  const img = sku.productImgUrl || '';
  const secondImg = sku.secondProductImgUrl || img;
  const link = normalizeLink(sku.skuLink, title);

  const priceInfo = activePrices[partNo] || null;
  const hasPrice = Boolean(priceInfo && priceInfo.price && String(priceInfo.price).trim().length > 0 && !priceInfo.hidePrice);
  const priceDouble = Number(priceInfo?.priceDouble || 0) || (hasPrice ? parseInt(String(priceInfo.price).replace(/[^0-9]/g, ''), 10) || 0 : 0);
  const hasStore = Boolean(priceInfo && priceInfo.storeLink && String(priceInfo.storeLink).trim().length > 0);
  const buttonStatus = priceInfo?.buttonStatus || '';
  const buttonStatusCode = Number(priceInfo?.buttonStatusCode || 0);
  const buttonName =
    buttonStatus === 'notify_me'
      ? 'Nhận Thông Báo'
      : buttonStatus === 'pre_order'
      ? 'Đặt Trước'
      : 'Mua ngay';

  let stockCategory = 'all';
  let stockLabel = '';
  if (buttonStatus === 'buy' || buttonStatusCode === 1) {
    stockCategory = 'in_stock';
    stockLabel = 'Còn hàng';
  } else if (buttonStatus === 'pre_order' || buttonStatus === 'preorder') {
    stockCategory = 'pre_order';
    stockLabel = 'Đặt trước';
  } else if (buttonStatus === 'notify_me') {
    stockCategory = 'out_of_stock';
    stockLabel = 'Tạm hết hàng';
  } else if (hasPrice) {
    stockCategory = 'in_stock';
    stockLabel = 'Còn hàng';
  }

  const specsArr = (sku.keySpec || []).map((s) => s.name).filter(Boolean);
  const specs = specsArr
    .slice(0, 5)
    .map((text) => `<li style="display:;"><p>${text}</p></li>`)
    .join('\n');

  const isDeal = Boolean(priceInfo && priceInfo.amountOff && String(priceInfo.amountOff).trim().length > 0);
  const isNew = Boolean(sku.productCardTag && (sku.productCardTag.newTag || sku.productCardTag.customTag === 'Mới'));
  const rawWtb = sku.wtbLink || (link && link.startsWith('/vn/') && !link.includes('/search?') ? `${link.replace(/\/$/, '')}/wtb/` : '');
  const wtbLink = rawWtb ? String(rawWtb).replace(/^https:\/\/rog\.asus\.com/i, '') : '';

  return `
<li data-number="${index}" data-partno="${escapeHtml(partNo)}" data-price="${priceDouble}" data-stock="${stockCategory}" data-deal="${isDeal ? '1' : '0'}" class="productItem ProductResultItem__productItem__Wc51h">
  <input type="hidden" name="${escapeHtml(partNo)}">
  <div class="ProductStatus__tagContainer__p294a ProductStatus__isProductCard__D2l41">
    ${(stockLabel || isDeal || isNew) ? `
    <div class="ProductStatus__tagBox__ImV8V">
      ${stockLabel ? `<div class="stockTag ProductStatus__stock__voZSe ${stockCategory === 'out_of_stock' ? 'ProductStatus__outOfStock__3e5t_' : ''}"><span class="">${stockLabel}</span></div>` : ''}
      ${isDeal ? '<div class="ProductStatus__tagName__aGXQy"><div class="ProductStatus__tagNameBorder__Ljm-m"><span>Deal</span></div></div>' : ''}
      ${isNew ? '<div class="ProductStatus__tagName__aGXQy"><div class="ProductStatus__tagNameBorder__Ljm-m"><span>Mới</span></div></div>' : ''}
    </div>` : '<!----> <!---->'}
  </div>
  <div tabindex="0" role="button" aria-label="${escapeHtml(title)}" class="ProductResultItem__productItemImage__ha34S ProductResultItem__isECSite__jaAKc">
    <div class="ProductResultItem__productItemImageWrapper__eeMJe" style="display:;">
      <a aria-hidden="true" tabindex="-1" href="${escapeHtml(link)}" class="ProductResultItem__productItemLink__mbXkd">
        <picture class="ProductResultItem__show__K8KZO">
          <source srcset="${img}/w240/fwebp" media="(max-width: 540px)">
          <source srcset="${img}/w260/fwebp" media="(max-width: 780px)">
          <source srcset="${img}/w273/fwebp" media="(max-width: 1235px)">
          <source srcset="${img}/w273/fwebp" media="(max-width: 1535px)">
          <source srcset="${img}/w273/fwebp">
          <img src="${img}" alt="${escapeHtml(title)}" loading="lazy" style="width: 100%; aspect-ratio: 717/525; object-fit: contain;">
        </picture>
        ${secondImg && secondImg !== img ? `
        <picture aria-hidden="true" tabindex="-1" class="">
          <source srcset="${secondImg}/w240/fwebp" media="(max-width: 540px)">
          <source srcset="${secondImg}/w260/fwebp" media="(max-width: 780px)">
          <source srcset="${secondImg}/w273/fwebp" media="(max-width: 1235px)">
          <source srcset="${secondImg}/w273/fwebp" media="(max-width: 1535px)">
          <source srcset="${secondImg}/w273/fwebp">
          <img src="${secondImg}" alt="${escapeHtml(title)}" loading="lazy" style="width: 100%; aspect-ratio: 717/525; object-fit: contain;">
        </picture>
        ` : ''}
      </a>
    </div>
  </div>
  <div class="ProductResultItem__productBadge__R7+Nc ProductResultItem__noData__8tfJ2"></div>
  <div class="ProductResultItem__productScreenWidth__kYYSe ProductResultItem__noData__8tfJ2"><span></span></div>
  <div class="ProductResultItem__productItemTitle__75icn ProductResultItem__subTitle__NpiB7">
    <a href="${escapeHtml(link)}"><span class="ProductResultItem__mktName__bqftk">${title}</span></a>
  </div>
  ${subName ? `
  <div tabindex="0" role="button" aria-label="${escapeHtml(subName)}" class="ProductResultItem__productItemTitle__75icn">
    <a href="${escapeHtml(link)}" aria-hidden="true" tabindex="-1"><span class="ProductResultItem__subName__Y3lzj">${subName}</span></a>
  </div>
  ` : ''}
  <div tabindex="-1" role="button" aria-label="Rating" class="ProductResultItem__productItemRatingContent__XA7kv">
    <div class="rogRating" style="display:none;"></div>
  </div>
  <div class="ProductResultItem__fpsWrapper__4sIU3"></div>
  <div></div>
  <div class="ProductResultItem__tagLine__Q56Li"></div>
  <div class="ProductResultItem__productItemWrapper__+TBGp">
    <div class="ProductResultItem__productItemContent__k1c74">
      <div class="ProductResultItem__productItemIntroduction__Mh6XZ ProductResultItem__active__q75dC ${specsArr.length <= 5 ? 'ProductResultItem__noSeeAllButton__+Pr+M' : ''}">
        <div>
          <ul class="ProductResultItem__keySpecItems__wR8pI">
            ${specs}
          </ul>
        </div>
      </div>
      <div class="seeAllButton__seeAllButton__dIrKX seeAllButton__productCardSeeMore__URrIn ${specsArr.length <= 5 ? 'seeAllButton__hidden__uiL3a' : ''}" style="${specsArr.length <= 5 ? 'display:none;' : ''}">
        <button tabindex="0" aria-label="" class="robotoFont seeAllButton__text__TNQDv">
          <span>Rút gọn</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" svg-inline="" alt="" role="presentation" focusable="false" class="seeAllButton__horizontal__Km1Ge seeAllButton__more__twUy+"><path d="M6 9.55l-5-5V2.5l5 5 5-5v2.05l-5 5z" fill="#181818"></path></svg>
        </button>
      </div>
    </div>
  </div>
  <div class="productContent">
    <div class="ProductResultItem__buyContent__vf5xN ${hasPrice ? 'ProductResultItem__BuyPrice__87qJ5' : 'ProductResultItem__noType__YiOvE'}">
      ${hasPrice ? `
      <div class="ProductResultItem__productItemPriceContent__AKvn+">
        <div class="ProductResultItem__line__1W-2U"></div>
        <div class="ProductResultItem__productStartingAtWrapper__KW1qL">
          <span class="ProductResultItem__productStartingAt__vGbdH eShop">Giá trên ASUS estore</span>
          <div role="button" tabindex="0" aria-describedby="tooltip-${escapeHtml(partNo)}" class="tooltip">
            <span class="sr-only">tooltip</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" svg-inline="" alt="info" role="presentation" focusable="false"><path d="M0 6a6 6 0 116 6 6.007 6.007 0 01-6-6zm1.2 0a4.8 4.8 0 109.6 0 4.8 4.8 0 00-9.6 0zm4.2 3.6V4.8h1.2v4.8H5.4zm0-6V2.4h1.2v1.2H5.4z" fill="#666"></path></svg>
          </div>
          <div id="tooltip-${escapeHtml(partNo)}" class="tooltipText"><span>Giá trên ASUS estore là giá của sản phẩm do ASUS estore cung cấp; đây là cửa hàng do các đối tác bán lại hoặc đơn vị phân phối của chúng tôi vận hành. Các thông số kỹ thuật được liệt kê tại đây có thể không có sẵn trên eStore và chỉ mang tính tham khảo.</span></div>
        </div>
        <div class="ProductResultItem__productHowMuch__fwgpj ProductResultItem__skuBase__dSiNX">
          <span class="ProductResultItem__finallyPriceValue__6sADl">${priceInfo.price}</span>
          ${isDeal ? `
          <div class="ProductResultItem__originalPrice__NZa0Y">
            <span class="ProductResultItem__savePriceValue__aDwIQ">Save ${priceInfo.amountOff}</span>
            <span class="ProductResultItem__originalPriceValue__HVhh7">${priceInfo.regularPrice || ''}</span>
          </div>` : ''}
        </div>
      </div>` : ''}
      ${hasStore ? `
      <div class="ProductResultItem__productBuyButton__43iX3">
        <div class="ButtonRed__redFullButton__0lMzl ButtonRed__isProductListButton__1rCeF">
          <a tabindex="0" href="${escapeHtml(priceInfo.storeLink)}" target="_blank" rel="noopener noreferrer" class="btn ButtonRed__btnRed__SXGza ButtonRed__isFull__6Glcz ButtonRed__maxWidth__D1j8R ButtonRed__isFilter__EzHBw ButtonRed__storeButton__KCNOS">
            <div class="ButtonRed__inner__U++OE">
              <span class="buttonName">${buttonName}</span>
            </div>
            <div class="ButtonRed__hoverColor__0DIt8"></div>
          </a>
        </div>
      </div>` : ''}
      <div class="ProductResultItem__productBuyButton__43iX3 ProductResultItem__marginTopAuto__mIAoX ProductResultItem__productLearnMoreButton__4oNOn">
        <div aria-hidden="true" class="ButtonBorderRed__borderRedButton__mg7A9 ButtonBorderRed__isLearnMore__RFCmc">
          <a tabindex="-1" href="${escapeHtml(link)}" aria-label="Xem thêm ${escapeHtml(title)}" class="btn ButtonBorderRed__btnBorderRed__zkcIA ButtonBorderRed__isRed__NoKph ButtonBorderRed__maxWidth__3+GoD ButtonBorderRed__isFilter__SONNI ButtonBorderRed__isLearnMore__RFCmc">
            <div class="ButtonBorderRed__inner__-s0h8">
              <span class="buttonName">Xem thêm</span>
              <span aria-hidden="true" style="width:0;height:0;opacity:0;">${title}</span>
            </div>
            <div class="ButtonBorderRed__hoverColor__CfY9D"></div>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="ProductResultItem__line__1W-2U"></div>
  <div class="ProductResultItem__productCardBottom__myM5C">
    <div class="ProductResultItem__productCheckBox__yqNsf">
      <label for="checkbox-${escapeHtml(partNo)}" class="checkBoxCompare">So sánh</label>
      <div tabindex="-1" aria-hidden="false" class="ProductResultItem__checkBoxIcon__zArFs">
        <svg xmlns="http://www.w3.org/2000/svg" data-name="圖層 1" viewBox="0 0 32 32" svg-inline="" alt="check" role="presentation" focusable="false"><path d="M32 5.96l-5.23-4.25-15.38 18.93-6.67-5.77L0 19.71l12.24 10.58 2.79-3.43L32 5.96z"></path><path d="M0 0h32v32H0z" fill="none"></path></svg>
      </div>
      <input tabindex="0" type="checkbox" name="productCheckBox" id="checkbox-${escapeHtml(partNo)}">
    </div>
    ${wtbLink ? `
    <a href="${escapeHtml(wtbLink)}" class="ProductResultItem__productWhereToBuyButton__IMKWt">
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" svg-inline="" alt="landmark" role="presentation" focusable="false"><path d="M19.03 13.817a7.941 7.941 0 00-1.23-9.51 7.736 7.736 0 00-11.022 0 7.94 7.94 0 00-1.23 9.51L12.288 22l6.741-8.182z" stroke="#181818" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.201 12.706a3.146 3.146 0 100-6.292 3.146 3.146 0 000 6.292z" stroke="#181818" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      <span>Nơi mua</span>
    </a>` : ''}
  </div>
</li>`.trim();
}
