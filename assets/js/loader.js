/**
 * ローダー挙動（JS）
 * - 目的: ページ読み込み完了時（または安全タイムアウト到達時）に、
 *   CSS の `#loader.fade-out` 遷移を発火させ、アニメーション終了後に DOM から除去する。
 * - ポイント:
 *   1) IIFE でスコープを閉じ、副作用を最小化
 *   2) 読み込みが何らかの理由で完了しない場合でも約 1.2 秒で確実に閉じる（UX 安全策）
 *   3) `transitionend` を待ってから削除し、フェードアウトをきちんと見せる
 */
(function () {
  // ローダー要素を取得。存在しないページ（例: 別テンプレート）では即終了
  const loader = document.getElementById('loader');
  if (!loader) return;

  // インク演出（CSS animation）が 1s のため、最低1秒は表示させる
  const MIN_SHOW_MS = 1000;
  const startAt = performance.now();

  // 安全対策: 約 1.2 秒を上限として自動で閉じる
  // - ネットワーク遅延や画像プリロード失敗などのケースでも UI が固まらないようにする
  const safety = setTimeout(finishLoading, 1200);

  // 通常ルート: ウィンドウの load 完了でフェードアウト（最短1s後）を開始
  window.addEventListener('load', finishLoading);

  // フェードアウト → 遷移完了後に DOM から除去
  function finishLoading() {
    // 重複呼び出しを避けるため、まずタイマーを解除
    clearTimeout(safety);

    // インク演出が1秒完了するまで待ってからフェードアウトを開始
    const elapsed = performance.now() - startAt;
    const wait = Math.max(0, MIN_SHOW_MS - elapsed);
    setTimeout(() => {
      // CSS 側のフェードアウト（opacity/visibility のトランジション）を発火
      loader.classList.add('fade-out');

      // CSS トランジションの完了を待ってから確実にノードを削除
      loader.addEventListener('transitionend', () => {
        // 親が存在する場合のみ削除（念のための防御的コーディング）
        loader.parentNode && loader.parentNode.removeChild(loader);
      }, { once: true });
    }, wait);
  }
})();
