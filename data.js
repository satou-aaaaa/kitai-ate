// 気体あての問題を作る（ブラウザと node の両方で使う）。
// 中身は、大阪府教育委員会の中学1年理科「物質のすがた②」確認プリント（解答）と、千葉県教育委員会「やる気アップ 理科」1年の気体のプリント（解答）（下の SRC。2026-11-17 に読んだ）で確かめたことだけ。
// 扱うのは「どの気体か」（酸素・二酸化炭素・水素・アンモニア・窒素）と「空気と比べた重さ」だけ。気体の作り方の手順・危険な実験は書かない（発生に使う薬品の名前だけ）。
// 1問は、気体の性質や確かめ方を見て、どの気体かを選ぶ。正解したら2段目「空気と比べて重さは？」を選ぶ。
// 選び肢は、ほかの4つの気体から選ぶ（やさしいは3つ、ふつう・むずかしいは4つ）。
// 乱数 R は呼ぶ回数が毎回同じになるように使う（sort の比較の中では引かない）。同じ tag なら、どの端末でも同じ問題になる。
// KINDS・言い回しの並びは最後に足すだけにする（並べ替え・削除をすると過去の日の問題が変わる）。
(function (root) {
  "use strict";
  const LV = ["やさしい", "ふつう", "むずかしい"];

  // 出典（画面の「なぜ」に出す）
  const SRC = {
    osaka: ["大阪府教育委員会「中学1年理科 物質のすがた②」確認プリント（解答）", "https://www.pref.osaka.lg.jp/documents/25642/bussitu_kakunin_kai_02.pdf"],
    chiba: ["千葉県教育委員会「やる気アップ 理科」中学1年 気体の性質（解答つき）", "https://www.pref.chiba.lg.jp/kyouiku/shidou/gakuryoku/yaruki/rika/documents/06r01.pdf"],
  };

  // 答えになる5つの気体
  const CLASSES = ["酸素", "二酸化炭素", "水素", "アンモニア", "窒素"];

  // 2段目「空気と比べて重さは？」の3つ（千葉県のプリントの表「空気と比べた質量」）
  const GROUPS = {
    omo: { name: "空気より重い", sub: "同じ体積で比べて大きい" },
    kar: { name: "空気より軽い", sub: "同じ体積で比べて小さい" },
    oni: { name: "ほぼ同じ", sub: "空気とほとんど変わらない" },
  };
  // もう1つの分け方（水へのとけ方）。千葉県のプリントの表・大阪府の解答。「なぜ」に出す
  const CATS = { yas: "水にとけやすい", suk: "水に少しとける", nik: "水にとけにくい" };
  // 気体ごとの決まり。答えと2段目・とけ方はこの表で決まる（qa/run.mjs が別に持った表でも確かめる）
  const RULE = {
    "酸素": { grp: "omo", cat: "nik", key: "色もにおいもなく、水にとけにくい。ものを燃やすはたらきがあり、火のついた線香が激しく燃えます。" },
    "二酸化炭素": { grp: "omo", cat: "suk", key: "色もにおいもなく、水に少しとける。空気より密度が大きく、石灰水を白くにごらせます。" },
    "水素": { grp: "kar", cat: "nik", key: "色もにおいもなく、水にとけにくい。空気より軽く、火を近づけると音を立てて燃えます。" },
    "アンモニア": { grp: "kar", cat: "yas", key: "刺激臭があり、水にひじょうによくとける。空気より軽く、水溶液はアルカリ性です。" },
    "窒素": { grp: "oni", cat: "nik", key: "色もにおいもなく、水にとけにくい。空気と比べた質量はほぼ同じで、空気のおよそ80％をしめます。" },
  };

  // part:ri:begin（shared-workflows の template/parts/data/ri.js の写し。ここでは直さない。node scripts/sync-template.mjs で写す）
  const ri = (R, a, b) => a + Math.floor(R() * (b - a + 1));
  // part:ri:end
  // part:shuffle:begin（shared-workflows の template/parts/data/shuffle.js の写し。ここでは直さない。node scripts/sync-template.mjs で写す）
  function shuffle(R, a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = ri(R, 0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; }
  // part:shuffle:end
  // part:pickN:begin（shared-workflows の template/parts/data/pickN.js の写し。ここでは直さない。node scripts/sync-template.mjs で写す）
  function pickN(R, a, n) { return shuffle(R, a).slice(0, n); }
  // part:pickN:end
  const MEDIA = ["理科室で", "理科の授業で", "実験ノートで", "教科書で", "テスト勉強で"];
  // 問いの前につく言い方（どれでも答えは同じ）
  const PRE = ["ある気体について。", "試験管に集めた気体を調べた。", "気体Aについて。", "びんに集めた気体を調べた。", "実験で出てきた気体について。"];

  // どの気体かを当てる問題。ans：答え、sit：言い方。選び肢は、ほかの4つの気体から（やさしいは2つ、ふつう・むずかしいは3つ）
  function which(ans, sit) {
    const near = CLASSES.filter((c) => c !== ans);
    return (R, lv) => {
      const si = ri(R, 0, sit.length - 1), mi = ri(R, 0, MEDIA.length - 1);
      const n = lv === 0 ? 2 : 3, ds = pickN(R, near, n);
      const q = sit[si] + "　この気体は何？";
      return { type: "act", media: MEDIA[mi], q, opts: shuffle(R, [ans, ...ds]), ans, rev: false, v: `${si}:${mi}` };
    };
  }
  // 1つの種類（手がかり）を作る。grp・cat・key は気体の決まり RULE から。clue は手がかりの文（PRE と組む）
  function K(id, lv, ans, name, src, look, why, clue) {
    const r = RULE[ans];
    return { id, lv, grp: r.grp, cat: r.cat, ans, name, src, look, key: r.key, why, make: which(ans, clue.flatMap((c) => PRE.map((p) => p + c))) };
  }

  const KINDS = [
    // ---- やさしい（よく出る確かめ方） ----
    K("o_senko", 0, "酸素", "線香が激しく燃える", ["osaka", "chiba"], "ものを燃やすはたらきがある気体です。",
      "火のついた線香が激しく燃えるのは酸素です（大阪府の確認プリント）。酸素にはものを燃やすはたらきがあります。",
      ["火のついた線香を入れると、線香が激しく燃えた。"]),
    K("c_sekkai", 0, "二酸化炭素", "石灰水が白くにごる", ["osaka", "chiba"], "石灰水の変わり方に注目。",
      "石灰水を入れてふると白くにごるのは二酸化炭素です（大阪府の確認プリント）。",
      ["石灰水を入れてよくふると、石灰水が白くにごった。"]),
    K("h_oto", 0, "水素", "音を立てて燃える", ["osaka", "chiba"], "火を近づけたときのようすに注目。",
      "マッチの火を近づけると音を立てて燃えるのは水素です（大阪府の確認プリント）。",
      ["マッチの火を近づけると、音を立てて燃えた。"]),
    K("a_nioi", 0, "アンモニア", "刺激臭がある", ["chiba", "osaka"], "においがある気体です。",
      "刺激臭があり、水にひじょうによくとけるのはアンモニアです（千葉県のプリント・大阪府の確認プリント）。",
      ["鼻をさすようなにおい（刺激臭）がする。"]),
    K("n_80", 0, "窒素", "空気のおよそ80％", ["chiba"], "空気の中にいちばん多い気体です。",
      "空気のおよそ80％をしめるのは窒素です（千葉県のプリント）。色もにおいもありません。",
      ["空気の体積のおよそ80％をしめている。"]),
    // ---- ふつう（発生のさせ方・水溶液） ----
    K("o_mn", 1, "酸素", "二酸化マンガンとオキシドール", ["osaka", "chiba"], "二酸化マンガンに何を加えたでしょう。",
      "二酸化マンガンにオキシドールを加えると酸素が出ます（大阪府の確認プリント）。",
      ["二酸化マンガンにオキシドールを加えると出てきた。", "オキシドールに二酸化マンガンを入れると出てきた。"]),
    K("c_ishi", 1, "二酸化炭素", "石灰石とうすい塩酸", ["osaka", "chiba"], "石灰石に塩酸を加えると出る気体です。",
      "石灰石にうすい塩酸を加えると二酸化炭素が出ます（大阪府の確認プリント）。",
      ["石灰石にうすい塩酸を加えると出てきた。", "うすい塩酸に石灰石を入れると出てきた。"]),
    K("h_metal", 1, "水素", "金属とうすい塩酸", ["osaka", "chiba"], "金属に酸を加えると出る気体です。",
      "亜鉛や鉄などの金属にうすい塩酸を加えると水素が出ます（大阪府の確認プリント・千葉県はマグネシウムリボン）。",
      ["亜鉛にうすい塩酸を加えると出てきた。", "マグネシウムリボンにうすい塩酸を加えると出てきた。"]),
    K("a_phen", 1, "アンモニア", "フェノールフタレインが赤", ["osaka", "chiba"], "水にとかすとアルカリ性になる気体です。",
      "水にとかしてフェノールフタレイン溶液を加えると赤くなるのはアンモニアです（大阪府の確認プリント）。水溶液はアルカリ性です。",
      ["水にとかしてフェノールフタレイン溶液を加えると、赤色になった。", "水にとかすと、その水溶液はアルカリ性だった。"]),
    K("n_onaji", 1, "窒素", "空気とほぼ同じ質量", ["chiba"], "空気と比べた質量がほぼ同じ気体です。",
      "色もにおいもなく、空気と比べた質量がほぼ同じなのは窒素です（千葉県のプリントの表）。",
      ["色もにおいもない。同じ体積で空気と比べると、質量はほぼ同じ。", "水にとけにくく、空気と比べた質量はほぼ同じ。"]),
    // ---- むずかしい（性質の組み合わせ） ----
    K("o_mix", 2, "酸素", "重い・とけにくい・においなし", ["chiba", "osaka"], "空気より重く、水にとけにくい。二酸化炭素とのちがいは？",
      "色もにおいもなく、空気より重く、水にとけにくいのは酸素です（千葉県のプリントの表）。二酸化炭素は水に少しとけます。",
      ["色もにおいもない。空気より重く、水にとけにくい。", "水上置換法で集める。空気と比べた質量は大きい。"]),
    K("c_mix", 2, "二酸化炭素", "重い・少しとける", ["osaka", "chiba"], "空気より重く、水に少しとける気体です。",
      "空気より密度が大きく、水に少ししかとけないのは二酸化炭素です（大阪府の確認プリント）。下方置換法でも、水上置換法でも集められます。",
      ["空気よりも密度が大きく、水に少しとける。", "においはない。下方置換法でも、水上置換法でも集められる。"]),
    K("h_mix", 2, "水素", "軽い・とけにくい", ["chiba", "osaka"], "空気より軽い気体は2つ。水へのとけ方で分けます。",
      "空気より軽く、水にとけにくいのは水素です（千葉県のプリントの表）。アンモニアも軽いですが、水によくとけます。",
      ["色もにおいもない。空気より軽く、水にとけにくい。", "空気と比べた質量が小さく、水上置換法で集める。"]),
    K("a_heat", 2, "アンモニア", "上方置換法で集める", ["osaka", "chiba"], "水によくとけて、空気より軽い気体の集め方です。",
      "水にひじょうによくとけ、空気より軽いので上方置換法で集めるのはアンモニアです（大阪府の確認プリント）。",
      ["塩化アンモニウムと水酸化カルシウムを混ぜて熱すると出てきた。", "水にひじょうによくとけ、空気より軽いので、上方置換法で集める。"]),
    K("n_mix", 2, "窒素", "とけにくい・重さほぼ同じ", ["chiba"], "酸素とのちがいは、空気と比べた重さです。",
      "水にとけにくく、空気と比べた質量がほぼ同じなのは窒素です（千葉県のプリントの表）。酸素は空気より重い気体です。",
      ["水上置換法で集める。空気と比べた質量はほぼ同じ。", "色もにおいもなく、水にとけにくい。空気より重くも軽くもない。"]),
  ];
  const BY = Object.fromEntries(KINDS.map((k) => [k.id, k]));
  const kindsOf = (lv) => KINDS.filter((k) => k.lv === lv).map((k) => k.id);

  // part:seedOf:begin（shared-workflows の template/parts/data/seedOf.js の写し。ここでは直さない。node scripts/sync-template.mjs で写す）
  function seedOf(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  // part:seedOf:end
  // part:rng:begin（shared-workflows の template/parts/data/rng.js の写し。ここでは直さない。node scripts/sync-template.mjs で写す）
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  // part:rng:end

  // 1問を作る。tag は「種類|種」（例 "o_senko|2026-11-18:d0"）。同じ tag ならいつも同じ問題
  function make(tag) {
    const [kind] = String(tag).split("|"), k = BY[kind];
    if (!k) return null;
    const p = k.make(rng(seedOf(tag)), k.lv);
    return { tag, kind, lv: k.lv, name: k.name, look: k.look, key: k.key, why: k.why, grp: k.grp, cat: k.cat, src: k.src.map((s) => SRC[s]), ...p };
  }
  const keyOf = (P) => `${P.kind}:${P.q}:${P.opts.slice().sort().join("/")}`;

  // 今日の5問（やさしい2・ふつう2・むずかしい1）。種類は重ねない
  function dailyTags(date) {
    const R = rng(seedOf("day:" + date)), e = pickN(R, kindsOf(0), 2), n = pickN(R, kindsOf(1), 2), h = pickN(R, kindsOf(2), 1);
    return [...e, ...n, ...h].map((id, i) => `${id}|${date}:d${i}`);
  }
  // 上級の3問（むずかしいだけ・今日の5問のむずかしいとは別の種類）
  function hardTags(date) {
    const dh = dailyTags(date)[4].split("|")[0], R = rng(seedOf("hard:" + date)), h = pickN(R, kindsOf(2).filter((x) => x !== dh), 3);
    return h.map((id, i) => `${id}|${date}:h${i}`);
  }

  const KTA = { KINDS, BY, GROUPS, CATS, RULE, LV, SRC, CLASSES, kindsOf, seedOf, rng, make, keyOf, dailyTags, hardTags, pickN };
  if (typeof module !== "undefined" && module.exports) module.exports = KTA; else root.KTA = KTA;
})(typeof self !== "undefined" ? self : this);
