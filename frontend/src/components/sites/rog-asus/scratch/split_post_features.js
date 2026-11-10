const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../rog-ally-2023/RogAlly2023PostFeatures.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Find split index
const recComment = '{/* 3. RECOMMENDED HANDHELDS & RELATED ECOSYSTEM                 */}';
const recIdx = code.indexOf(recComment);
if (recIdx === -1) {
  throw new Error('Could not find split index in RogAlly2023PostFeatures.tsx');
}

// Find start of RogAlly2023PostFeatures function
const funcStart = 'export default function RogAlly2023PostFeatures() {';
const funcIdx = code.indexOf(funcStart);

const head = code.substring(0, funcIdx);

// The awards & reviews JSX is from line after return ( <div id="awards" to right before recComment
const awardsStart = code.indexOf('<div id="awards"', funcIdx);
const awardsJSX = code.substring(awardsStart, recIdx).trim();

// The footer JSX is from recComment to right before closing </div>\n  );
const modalIdx = code.lastIndexOf('{/* YOUTUBE VIDEO MODAL OVERLAY */}');
let footerJSX, modalJSX;
if (modalIdx !== -1) {
  footerJSX = code.substring(recIdx, modalIdx).trim();
  const endModalIdx = code.lastIndexOf('</div>\n  );');
  modalJSX = code.substring(modalIdx, endModalIdx).trim();
} else {
  const endIdx = code.lastIndexOf('</div>\n  );');
  footerJSX = code.substring(recIdx, endIdx).trim();
  modalJSX = '';
}

const newCode = `${head}
export function RogAllyAwardsAndReviews() {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  return (
    ${awardsJSX}
      ${modalJSX}
    </div>
  );
}

export function RogAllyFooterContent() {
  const [recPage, setRecPage] = useState(0);
  const recPerPage = 4;
  const totalRecPages = Math.ceil(RECOMMEND_PRODUCTS.length / recPerPage);
  const currentRecs = RECOMMEND_PRODUCTS.slice(
    recPage * recPerPage,
    (recPage + 1) * recPerPage
  );

  return (
    <div className="ally-footer-content-wrap" style={{ backgroundColor: "#000", color: "#fff" }}>
      ${footerJSX}
    </div>
  );
}

export default function RogAlly2023PostFeatures() {
  return (
    <>
      <RogAllyAwardsAndReviews />
      <RogAllyFooterContent />
    </>
  );
}
`;

fs.writeFileSync(filePath, newCode, 'utf8');
console.log('Successfully refactored RogAlly2023PostFeatures.tsx!');

