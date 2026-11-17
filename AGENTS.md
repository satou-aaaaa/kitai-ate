# AGENTS.md

気体あて：気体の性質や確かめ方を見て、酸素・二酸化炭素・水素・アンモニア・窒素のどれかを当てる1日5問の学習ゲーム。正解したら「空気と比べて重さは？」（空気より重い・空気より軽い・ほぼ同じ）も選ぶ。`index.html` と `data.js`（問題の種類）を GitHub Pages で公開する。

## 準備（最初に一度）

```bash
bash scripts/setup.sh   # Node.js（版は .nvmrc）を確かめ、検査の依存とブラウザを入れる。何度実行してもよい
```

Claude Code のクラウドセッションでは `.claude/settings.json` のフックが自動で実行する。

## push する前の確認

```bash
node qa/run.mjs   # 問題（15種類×3000問：選び肢・答えは1つ・答えと重さととけ方が気体の表どおり・出典）・今日の5問と上級（3年分）・とことん・通しで遊ぶ・続きから・2段目・復習・幅320px・PWA・引き継ぎ・見やすさ（CI の QA と同じ）
```

## このリポジトリの決まり

- 中身は大阪府教育委員会「中学1年理科 物質のすがた②」確認プリント（解答。<https://www.pref.osaka.lg.jp/documents/25642/bussitu_kakunin_kai_02.pdf>）と、千葉県教育委員会「やる気アップ 理科」1年の気体のプリント（解答）で確かめたことだけ（2026-11-17 に読んだ）。手がかりを足すときも出典に書いてあることだけにし、`qa/run.mjs` の `TB`（別に書いた表）にも足す。出典メモは共有フォルダ games/kitai-research.md。
- 扱うのは5つの気体（酸素・二酸化炭素・水素・アンモニア・窒素）だけ。塩素はまめ知識にだけ出す。気体を作る実験の手順・量・危険な実験は書かない（発生に使う薬品の名前だけ）。二酸化炭素の集め方は出典で2通り（下方・水上）なので、2段目は集め方でなく「空気と比べた重さ」にした。
- 気体の決まり（重さ・とけ方・決め手）は `data.js` の `RULE` だけに書き、種類はそこから読む。`qa/run.mjs` の `CL` が別に書いた表で確かめる。
- 問題は、やさしいが選び肢3つ、ふつう・むずかしいが4つ（5つの気体から）。問いに気体の名前を書かない（「過酸化水素」のように名前をふくむ薬品名も書かない。QA が見る）。2回目のヒントはまちがいを消して2つにしぼり、決め手（`key`）も見せる。2段目は「空気と比べて重さは？」（3つ）で、気体（`grp`）で決まる。
- 今日の5問（やさしい2・ふつう2・むずかしい1、種類は重ねない）・上級（むずかしい3、今日のむずかしいと別）は日本時間の日付の種で決まり、だれでも同じ。`Math.random()` は練習・とことんの種だけ。乱数は `sort` の比較の中で引かない。`KINDS`・言い回しの並びは最後に足すだけ（QA の `PIN` が第1回の1問目を見る）。`data.js` を変える PR は自動ではマージされない（`hold_paths`）。
- ★はまちがい＋ヒントの数（0で★3・1で★2・2以上で★1）。上級はヒントなし。時間制限なし。
- 好きなだけ遊べる：チケット・ライフ・回数制限・🔒で開くモードを入れない（shared-workflows `routines/game-dev.md` F1〜F7。QA が見る）。とことん（`runs.e`）はまちがえても続き、「ここで降りる」で終わる。
- 1問を深くする：`depth.js` と `qa/depth-check.mjs` は shared-workflows `template/` の写しで、ここでは直さない。自信あり・2段目「空気と比べて重さは？」・復習（1→3→7日後）。記録 `kta-v1`・文字 `kta-fs`・復習 `kta-depth`。
- 共有は遊ぶ人が押したときに開くリンクだけ。シェアの文に問題・答えを出さない。感想は Issue フォーム（`.github/ISSUE_TEMPLATE/feedback.yml`）を開くだけ。応援は Ko-fi へのただのリンクだけ。
- 外へ通信しない（CSP の `connect-src 'self'` を広げない）。見やすさ（`<!-- a11y:begin -->`〜`end`・`qa/a11y.mjs`）と引き継ぎ（`transfer.js`・`qa/transfer-check.mjs`）は shared-workflows `template/` の写しで、ここでは直さない。
- 画面の土台は液性よみ（ekisei-yomi。もとは植物なかま分け・動物なかま分け・なに税？）から写した。写し元の言葉が残っていないかを QA が見る。
- PWA：画面のファイルを足したら `sw.js` の `SHELL` にも足し、中身を大きく変えたら `CACHE` の版を上げる。アイコンは `node tools/make-icons.cjs`、`og.png` は `node tools/make-og.cjs`。
- 公開リポジトリなので、個人情報・鍵を入れない。

## 公開

- GitHub Pages は `main` のルート（`/`）を公開する。PR の QA と Secret scan が ✅ になると `automerge.yml` が自動でマージする。止めたいときは下書きにするか、ラベル「自動マージしない」を付ける。
- `sw.js`・`manifest.webmanifest`・`data.js` を変える PR は自動ではマージされない（`hold_paths`）。CodeRabbit のレビューを読み、手でマージする直前に今の head へのレビューを読み直す。CodeRabbit は PR に `@coderabbitai review` とコメントして頼む。

## 共通のきまり

- PR の作り方・マージの仕方は satou-aaaaa/shared-workflows の `routines/pr.md`、全体のきまりは `routines/common.md` に従う。
- CI の部品は shared-workflows の共通部品を呼ぶ。リポジトリ側の .github/workflows には呼び出しと設定値だけを書く。
- Claude 以外の AI・人が作業するときは、shared-workflows の `routines/tool-map.md` と `routines/without-claude.md` を読む。
