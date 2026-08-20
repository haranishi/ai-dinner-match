const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const purposeLabel = {
  friends: "友人づくり",
  founders: "起業家交流",
  career: "キャリア相談",
  local: "近所のつながり",
};

const vibeLabel = {
  calm: "落ち着き",
  balanced: "バランス",
  lively: "にぎやか",
};

const dietLabel = {
  none: "なし",
  vegetarian: "ベジ対応",
  "no-pork": "豚肉なし",
  "non-alcohol": "ノンアル",
};

function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const restaurants = [
  {
    id: "r1",
    name: "mado 渋谷",
    area: "渋谷",
    budget: 6200,
    capacity: 6,
    vibe: "balanced",
    diets: ["none", "vegetarian", "non-alcohol"],
    tags: ["AI", "スタートアップ", "食"],
    note: "半個室あり。初参加者が多いテーブル向き。",
  },
  {
    id: "r2",
    name: "hachi lab 新宿",
    area: "新宿",
    budget: 4800,
    capacity: 5,
    vibe: "lively",
    diets: ["none", "no-pork", "non-alcohol"],
    tags: ["映画", "旅行", "地域"],
    note: "大皿シェア型。会話量が多いグループ向き。",
  },
  {
    id: "r3",
    name: "kuon 銀座",
    area: "銀座",
    budget: 8500,
    capacity: 6,
    vibe: "calm",
    diets: ["none", "vegetarian", "no-pork"],
    tags: ["投資", "健康", "食"],
    note: "静かな席を確保しやすい。キャリア相談系に合う。",
  },
  {
    id: "r4",
    name: "bridge 日本橋",
    area: "日本橋",
    budget: 6800,
    capacity: 6,
    vibe: "balanced",
    diets: ["none", "vegetarian", "non-alcohol", "no-pork"],
    tags: ["地域", "投資", "スタートアップ"],
    note: "駅近で集合しやすい。法人会員の招待枠に使いやすい。",
  },
];

const demoParticipants = [
  profile("佐藤 はるか", "渋谷", "friends", 6500, "balanced", "none", "デザイン", [
    "映画",
    "食",
    "旅行",
  ]),
  profile("田中 亮", "渋谷", "founders", 6500, "lively", "none", "SaaS", [
    "AI",
    "スタートアップ",
    "投資",
  ]),
  profile("鈴木 美緒", "新宿", "career", 4500, "calm", "vegetarian", "人事", [
    "健康",
    "映画",
    "AI",
  ]),
  profile("高橋 蓮", "銀座", "founders", 9000, "balanced", "none", "VC", [
    "投資",
    "スタートアップ",
    "食",
  ]),
  profile("伊藤 直人", "日本橋", "local", 6500, "calm", "non-alcohol", "建築", [
    "地域",
    "旅行",
    "健康",
  ]),
  profile("渡辺 亜希", "新宿", "friends", 4500, "lively", "no-pork", "教育", [
    "映画",
    "地域",
    "食",
  ]),
  profile("山本 航", "渋谷", "career", 6500, "balanced", "none", "プロダクト", [
    "AI",
    "健康",
    "スタートアップ",
  ]),
  profile("中村 梨奈", "銀座", "friends", 9000, "calm", "vegetarian", "医療", [
    "健康",
    "旅行",
    "食",
  ]),
  profile("小林 陸", "日本橋", "founders", 6500, "lively", "none", "不動産", [
    "投資",
    "地域",
    "スタートアップ",
  ]),
  profile("加藤 葵", "新宿", "local", 4500, "balanced", "non-alcohol", "メディア", [
    "映画",
    "旅行",
    "地域",
  ]),
  profile("吉田 誠", "渋谷", "career", 6500, "calm", "none", "コンサル", [
    "AI",
    "投資",
    "健康",
  ]),
  profile("山田 紗季", "銀座", "friends", 9000, "balanced", "none", "広告", [
    "食",
    "映画",
    "スタートアップ",
  ]),
];

const state = {
  participants: loadParticipants(),
  groups: [],
};

const els = {
  form: document.querySelector("#participant-form"),
  participantList: document.querySelector("#participant-list"),
  participantCount: document.querySelector("#participant-count"),
  restaurantList: document.querySelector("#restaurant-list"),
  matchResults: document.querySelector("#match-results"),
  eventDate: document.querySelector("#event-date"),
  eventArea: document.querySelector("#event-area"),
  groupSize: document.querySelector("#group-size"),
  platformFee: document.querySelector("#platform-fee"),
  metricGroups: document.querySelector("#metric-groups"),
  metricScore: document.querySelector("#metric-score"),
  metricRevenue: document.querySelector("#metric-revenue"),
  messageCopy: document.querySelector("#message-copy"),
  generateMatches: document.querySelector("#generate-matches"),
  exportJson: document.querySelector("#export-json"),
  exportCsv: document.querySelector("#export-csv"),
  resetDemo: document.querySelector("#reset-demo"),
  clearParticipants: document.querySelector("#clear-participants"),
};

function profile(name, area, purpose, budget, vibe, diet, industry, tags) {
  return {
    id: randomId(),
    name,
    area,
    purpose,
    budget,
    vibe,
    diet,
    industry,
    tags,
    verified: true,
    joinedAt: new Date().toISOString(),
  };
}

function loadParticipants() {
  const stored = localStorage.getItem("tablesync-participants");
  if (!stored) return demoParticipants;

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : demoParticipants;
  } catch {
    return demoParticipants;
  }
}

function saveParticipants() {
  localStorage.setItem("tablesync-participants", JSON.stringify(state.participants));
}

function initDate() {
  const date = new Date();
  const day = date.getDay();
  const daysUntilWednesday = (3 - day + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilWednesday);
  els.eventDate.value = date.toISOString().slice(0, 10);
}

function sharedTags(a, b) {
  return a.tags.filter((tag) => b.tags.includes(tag));
}

function pairScore(a, b) {
  let score = 38;
  score += Math.min(sharedTags(a, b).length * 14, 34);
  if (a.purpose === b.purpose) score += 10;
  if (a.industry !== b.industry) score += 7;
  if (a.area === b.area) score += 7;
  if (a.vibe === b.vibe) score += 5;
  if (a.vibe === "balanced" || b.vibe === "balanced") score += 4;
  score -= Math.min(Math.abs(a.budget - b.budget) / 500, 12);
  if (a.diet !== "none" && b.diet !== "none" && a.diet !== b.diet) score -= 4;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function groupScore(group) {
  if (group.length < 2) return 0;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < group.length; i += 1) {
    for (let j = i + 1; j < group.length; j += 1) {
      total += pairScore(group[i], group[j]);
      pairs += 1;
    }
  }
  return Math.round(total / pairs);
}

function buildGroups(participants, size) {
  const pool = [...participants].sort((a, b) => {
    if (a.purpose !== b.purpose) return a.purpose.localeCompare(b.purpose, "ja");
    return a.area.localeCompare(b.area, "ja");
  });
  const groups = [];

  while (pool.length >= Math.max(3, size - 1)) {
    const seed = pool.shift();
    const group = [seed];

    while (group.length < size && pool.length) {
      let bestIndex = 0;
      let bestScore = -Infinity;

      pool.forEach((candidate, index) => {
        const average =
          group.reduce((sum, member) => sum + pairScore(candidate, member), 0) /
          group.length;
        const industryBonus = group.some((member) => member.industry === candidate.industry) ? -4 : 4;
        const purposeBonus = group.some((member) => member.purpose === candidate.purpose) ? 3 : 0;
        const score = average + industryBonus + purposeBonus;
        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });

      group.push(pool.splice(bestIndex, 1)[0]);
    }

    groups.push(group);
  }

  if (pool.length && groups.length) {
    pool.forEach((participant, index) => {
      groups[index % groups.length].push(participant);
    });
  }

  return groups;
}

function mostCommon(values) {
  const counts = values.reduce((memo, item) => {
    memo[item] = (memo[item] || 0) + 1;
    return memo;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || values[0];
}

function assignRestaurant(group, preferredArea, usedIds) {
  const averageBudget = group.reduce((sum, member) => sum + member.budget, 0) / group.length;
  const diets = [...new Set(group.map((member) => member.diet))];
  const tags = [...new Set(group.flatMap((member) => member.tags))];
  const area = preferredArea || mostCommon(group.map((member) => member.area));

  const ranked = restaurants
    .filter((restaurant) => restaurant.capacity >= group.length)
    .map((restaurant) => {
      let score = 50;
      if (restaurant.area === area) score += 20;
      score -= Math.min(Math.abs(restaurant.budget - averageBudget) / 500, 16);
      score += diets.every((diet) => diet === "none" || restaurant.diets.includes(diet)) ? 14 : -18;
      score += tags.filter((tag) => restaurant.tags.includes(tag)).length * 4;
      if (usedIds.has(restaurant.id)) score -= 10;
      return { restaurant, score };
    })
    .sort((a, b) => b.score - a.score);

  const selected = ranked[0]?.restaurant || restaurants[0];
  usedIds.add(selected.id);
  return selected;
}

function makeIcebreakers(group) {
  const tags = group.flatMap((member) => member.tags);
  const commonTags = [...new Set(tags)].filter((tag) => tags.filter((item) => item === tag).length > 1);
  const industries = [...new Set(group.map((member) => member.industry))];
  const purposes = [...new Set(group.map((member) => purposeLabel[member.purpose]))];

  return [
    `${commonTags.slice(0, 2).join("・") || "最近ハマっていること"}から会話を始める`,
    `${industries.slice(0, 3).join(" / ")}の視点で最近の仕事の変化を話す`,
    `${purposes.slice(0, 2).join("・")}の参加理由を一人ずつ共有する`,
  ];
}

function generateMatches() {
  const groupSize = Number(els.groupSize.value);
  const preferredArea = els.eventArea.value;
  const usedRestaurantIds = new Set();
  const rawGroups = buildGroups(state.participants, groupSize);

  state.groups = rawGroups.map((members, index) => {
    const restaurant = assignRestaurant(members, preferredArea, usedRestaurantIds);
    return {
      id: `table-${String.fromCharCode(65 + index)}`,
      label: `Table ${String.fromCharCode(65 + index)}`,
      members,
      restaurant,
      score: groupScore(members),
      icebreakers: makeIcebreakers(members),
    };
  });

  renderMatches();
  updateMessageCopy();
}

function renderParticipants() {
  els.participantCount.textContent = `${state.participants.length}人`;
  els.participantList.innerHTML = state.participants
    .map(
      (participant) => `
        <article class="participant-row">
          <div>
            <strong>${escapeHtml(participant.name)}</strong>
            <div class="participant-meta">
              <span class="chip">${escapeHtml(participant.area)}</span>
              <span class="chip blue">${purposeLabel[participant.purpose]}</span>
              <span class="chip gold">${yen.format(participant.budget)}</span>
              <span class="chip">${escapeHtml(participant.industry)}</span>
            </div>
            <div class="participant-meta">
              ${participant.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
          <button class="remove-button" type="button" data-remove="${participant.id}" title="削除">×</button>
        </article>
      `,
    )
    .join("");
}

function renderRestaurants() {
  els.restaurantList.innerHTML = restaurants
    .map(
      (restaurant) => `
        <article class="restaurant-row">
          <strong>${escapeHtml(restaurant.name)}</strong>
          <div class="restaurant-meta">
            <span class="chip">${escapeHtml(restaurant.area)}</span>
            <span class="chip gold">${yen.format(restaurant.budget)}</span>
            <span class="chip blue">${restaurant.capacity}席</span>
          </div>
          <p>${escapeHtml(restaurant.note)}</p>
        </article>
      `,
    )
    .join("");
}

function renderMatches() {
  const totalMembers = state.groups.reduce((sum, group) => sum + group.members.length, 0);
  const averageScore = state.groups.length
    ? Math.round(state.groups.reduce((sum, group) => sum + group.score, 0) / state.groups.length)
    : 0;
  const fee = Number(els.platformFee.value);

  els.metricGroups.textContent = state.groups.length;
  els.metricScore.textContent = averageScore;
  els.metricRevenue.textContent = yen.format(totalMembers * fee);

  document.querySelectorAll(".table-node").forEach((node, index) => {
    node.classList.toggle("active", index < state.groups.length);
  });

  if (!state.groups.length) {
    els.matchResults.innerHTML = `
      <div class="empty-state">
        <strong>未生成</strong>
        <span>参加者を追加してマッチングを生成</span>
      </div>
    `;
    return;
  }

  els.matchResults.innerHTML = state.groups
    .map(
      (group) => `
        <article class="group-row">
          <div class="group-title">
            <div>
              <strong>${group.label}</strong>
              <div class="group-meta">
                <span class="chip blue">${escapeHtml(group.restaurant.name)}</span>
                <span class="chip">${escapeHtml(group.restaurant.area)}</span>
                <span class="chip gold">${yen.format(group.restaurant.budget)}</span>
              </div>
            </div>
            <span class="score">${group.score}</span>
          </div>
          <div class="member-grid">
            ${group.members
              .map(
                (member) => `
                  <div class="member">
                    <strong>${escapeHtml(member.name)}</strong>
                    <span>${escapeHtml(member.industry)} / ${purposeLabel[member.purpose]} / ${vibeLabel[member.vibe]}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
          <ul class="icebreakers">
            ${group.icebreakers.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function updateMessageCopy() {
  if (!state.groups.length) {
    els.messageCopy.value = "マッチング生成後に案内文が表示されます。";
    return;
  }

  const date = els.eventDate.value || "次回水曜";
  const lines = [
    `【TableSync】${date} のテーブルが決まりました。`,
    "",
    ...state.groups.flatMap((group) => [
      `${group.label}: ${group.restaurant.name} / ${group.restaurant.area}`,
      `参加者: ${group.members.map((member) => member.name).join("、")}`,
      `会話テーマ: ${group.icebreakers[0]}`,
      "",
    ]),
    "集合10分前までに店舗前へお越しください。変更がある場合は運営チャットで連絡します。",
  ];

  els.messageCopy.value = lines.join("\n");
}

function exportData(type) {
  const payload = {
    event: {
      date: els.eventDate.value,
      area: els.eventArea.value,
      groupSize: Number(els.groupSize.value),
      platformFee: Number(els.platformFee.value),
    },
    groups: state.groups,
    participants: state.participants,
  };

  if (type === "json") {
    download("tablesync-matches.json", JSON.stringify(payload, null, 2), "application/json");
    return;
  }

  const header = ["table", "restaurant", "name", "area", "purpose", "industry", "budget", "tags"];
  const rows = state.groups.flatMap((group) =>
    group.members.map((member) => [
      group.label,
      group.restaurant.name,
      member.name,
      member.area,
      purposeLabel[member.purpose],
      member.industry,
      member.budget,
      member.tags.join("|"),
    ]),
  );
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  download("tablesync-matches.csv", csv, "text/csv");
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(els.form);
  const tags = form.getAll("tags");
  const participant = profile(
    form.get("name").trim(),
    form.get("area"),
    form.get("purpose"),
    Number(form.get("budget")),
    form.get("vibe"),
    form.get("diet"),
    form.get("industry").trim(),
    tags.length ? tags : ["食"],
  );

  state.participants.unshift(participant);
  saveParticipants();
  els.form.reset();
  renderParticipants();
});

els.participantList.addEventListener("click", (event) => {
  const id = event.target.dataset.remove;
  if (!id) return;
  state.participants = state.participants.filter((participant) => participant.id !== id);
  saveParticipants();
  renderParticipants();
});

els.generateMatches.addEventListener("click", generateMatches);
els.platformFee.addEventListener("change", renderMatches);
els.eventDate.addEventListener("change", updateMessageCopy);
els.eventArea.addEventListener("change", () => {
  if (state.groups.length) generateMatches();
});
els.groupSize.addEventListener("change", () => {
  if (state.groups.length) generateMatches();
});
els.exportJson.addEventListener("click", () => exportData("json"));
els.exportCsv.addEventListener("click", () => exportData("csv"));
els.resetDemo.addEventListener("click", () => {
  state.participants = demoParticipants.map((participant) => ({ ...participant, id: randomId() }));
  state.groups = [];
  saveParticipants();
  renderParticipants();
  renderMatches();
  updateMessageCopy();
});
els.clearParticipants.addEventListener("click", () => {
  state.participants = [];
  state.groups = [];
  saveParticipants();
  renderParticipants();
  renderMatches();
  updateMessageCopy();
});

initDate();
renderParticipants();
renderRestaurants();
renderMatches();
updateMessageCopy();
