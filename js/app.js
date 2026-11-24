// 자기소개 웹앱 (S01~S05) 동작 스크립트
// 방명록은 다음 단계에서 AppSync(GraphQL)와 DynamoDB에 연결한다.
// 연결 전까지 GUESTBOOK.apiUrl이 비어 있으면 입력 검사만 하고 저장은 하지 않는다.
const GUESTBOOK = {
  apiUrl: "",   // AppSync GraphQL 엔드포인트 (다음 주차에 입력)
  apiKey: "",   // AppSync API 키 (다음 주차에 입력)
  pageSize: 10,
  cooldownMs: 30000,
};

const $ = (sel) => document.querySelector(sel);

/* ---------- S03 프로젝트 ---------- */
let projects = [];
let lastFocused = null;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderProjects() {
  const list = $("#project-list");
  list.replaceChildren();
  projects.forEach((p) => {
    const card = el("article", "card");
    const thumb = el("div", "card-thumb", p.thumb.label);
    thumb.style.background = p.thumb.color;
    const body = el("div", "card-body");
    body.append(el("h3", "card-title", p.title), el("p", "card-period", p.period),
      el("p", "card-summary", p.summary));
    const tags = el("ul", "tags");
    p.tags.forEach((t) => tags.append(el("li", "", t)));
    const btn = el("button", "btn btn-ghost", "자세히 보기");
    btn.type = "button";
    btn.addEventListener("click", () => openModal(p.id, btn));
    body.append(tags, btn);
    card.append(thumb, body);
    list.append(card);
  });
}

async function loadProjects() {
  try {
    const res = await fetch("data/projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    projects = await res.json();
    renderProjects();
  } catch (e) {
    $("#project-list").replaceChildren(el("p", "muted", "프로젝트를 불러오지 못했습니다. 잠시 후 새로고침해 주세요."));
  }
}

const DETAIL_LABELS = [
  ["overview", "소개"], ["team", "팀 구성"], ["role", "담당 역할"],
  ["tech", "사용 기술"], ["result", "결과"], ["link", "링크"],
];

function openModal(id, trigger) {
  const p = projects.find((x) => x.id === id);
  if (!p) return;
  lastFocused = trigger;
  $("#modal-title").textContent = p.title;
  $("#modal-period").textContent = p.period;
  const info = $("#modal-info");
  info.replaceChildren();
  DETAIL_LABELS.forEach(([key, label]) => {
    const value = p.detail[key];
    if (!value) return;
    const dd = el("dd");
    if (key === "link") {
      const a = el("a", "", "GitHub에서 보기");
      a.href = value; a.target = "_blank"; a.rel = "noopener noreferrer";
      dd.append(a);
    } else {
      dd.textContent = value;
    }
    info.append(el("dt", "", label), dd);
  });
  $("#project-modal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  $("#modal-close").focus();
}

function closeModal() {
  $("#project-modal").classList.add("hidden");
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
}

$("#modal-close").addEventListener("click", closeModal);
$("#project-modal").addEventListener("click", (e) => {
  if (e.target.id === "project-modal") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("#project-modal").classList.contains("hidden")) closeModal();
});

/* ---------- S04 연락처 ---------- */
$("#copy-email").addEventListener("click", async () => {
  const email = $("#email-text").textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    $("#copy-status").textContent = "이메일 주소를 복사했습니다.";
  } catch {
    $("#copy-status").textContent = email + " 를 직접 복사해 주세요.";
  }
  setTimeout(() => { $("#copy-status").textContent = ""; }, 2000);
});

/* ---------- S05 방명록 ---------- */
const gbEnabled = () => Boolean(GUESTBOOK.apiUrl && GUESTBOOK.apiKey);

function validate(name, message) {
  const errors = {};
  if (name.length < 1 || name.length > 20) errors.name = "이름은 1~20자로 입력해 주세요.";
  if (message.length < 1 || message.length > 200) errors.message = "메시지는 1~200자로 입력해 주세요.";
  return errors;
}

$("#gb-message").addEventListener("input", (e) => {
  $("#gb-counter").textContent = `${e.target.value.length} / 200`;
});

$("#gb-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#gb-name").value.trim();
  const message = $("#gb-message").value.trim();
  const errors = validate(name, message);
  $("#gb-name-error").textContent = errors.name || "";
  $("#gb-message-error").textContent = errors.message || "";
  if (Object.keys(errors).length) return;
  if (!gbEnabled()) {
    $("#gb-status").textContent = "방명록 저장 기능은 준비 중입니다.";
    return;
  }
  // 다음 주차: AppSync createEntry 뮤테이션 호출 후 목록 맨 위에 추가
});

function initGuestbook() {
  if (!gbEnabled()) {
    $("#gb-submit").disabled = true;
    return;
  }
  $("#guestbook-notice").textContent = "이름과 메시지를 남겨 주세요.";
  // 다음 주차: AppSync listEntries 쿼리로 최신순 10개 조회
}

loadProjects();
initGuestbook();
