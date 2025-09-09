// ログインリダイレクト時のURLハッシュによる自動スクロールを防止する処理
// URLにaccess_token、id_token、loginが含まれている場合、ハッシュを削除してページトップに移動
if (window.location.hash && /(access_token|id_token|login)/.test(window.location.hash)) {
    history.replaceState(null, '', window.location.pathname); // URLからハッシュを削除
    window.scrollTo(0, 0); // ページ最上部にスクロール
}

// Service Worker の一括削除処理（クリーンアップ）
// 以前に登録されたService Workerがある場合、全て解除する
(function(){
  if ('serviceWorker' in navigator) { // Service Worker がサポートされているかチェック
    navigator.serviceWorker.getRegistrations() // 登録済みの全Service Workerを取得
      .then(regs => Promise.all(regs.map(r => r.unregister()))) // 全てのService Workerを解除
      .catch(() => {}); // エラーが発生しても処理を継続
  }
})();

// Three.js ライブラリの条件付き遅延読み込みシステム
(function(){
  var loaded = false; // 読み込み済みフラグ
  var cdnBase = 'https://cdn.jsdelivr.net/npm/three@0.130.0'; // Three.js CDN のベースURL
  
  // Three.js を読み込むべきかどうかを判定する関数
  function shouldLoad(){
    try {
      // アクセシビリティ: モーション削減設定が有効な場合は読み込まない
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      
      // ネットワーク配慮: データ節約モードが有効な場合は読み込まない
      var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn && conn.saveData) return false;
      
      // WebGL サポート確認: WebGLが利用できない場合は読み込まない
      var canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return false;
    } catch (e) {} // エラーが発生した場合は続行
    return true; // 上記の条件をクリアした場合は読み込みOK
  }
  
  // 外部スクリプトを動的に読み込む関数
  function loadScript(src){
    return new Promise(function(resolve, reject){
      var s = document.createElement('script'); // script要素を作成
      s.src = src; // 読み込み先URLを設定
      s.async = true; // 非同期読み込みを有効
      s.onload = function(){ resolve(); }; // 読み込み成功時の処理
      s.onerror = function(){ reject(new Error('Failed '+ src)); }; // 読み込み失敗時の処理
      document.head.appendChild(s); // HTML head に script 要素を追加
    });
  }
  
  // イベントリスナーとオブザーバーをクリーンアップする関数
  function cleanup(){
    if (io) { try { io.disconnect(); } catch(e) {} io = null; } // IntersectionObserverを停止
    window.removeEventListener('scroll', onUser, { passive: true }); // スクロールイベント削除
    window.removeEventListener('pointerdown', onUser, { passive: true }); // ポインターダウンイベント削除
    window.removeEventListener('mousemove', onUser, { passive: true }); // マウス移動イベント削除
  }
  
  // Three.js の読み込みを実行する関数
  function tryLoad(){
    if (loaded) return; // 既に読み込み済みの場合は処理しない
    if (!shouldLoad()) { cleanup(); return; } // 読み込み条件を満たさない場合はクリーンアップして終了
    loaded = true; // 読み込み済みフラグを設定
    
    // Three.js 関連ファイルを順次読み込み
    Promise.resolve()
      .then(function(){ return loadScript(cdnBase + '/build/three.min.js'); }) // Three.js本体
      .then(function(){ return loadScript(cdnBase + '/examples/js/loaders/STLLoader.js'); }) // STLローダー
      .then(function(){ return loadScript('./assets/js/three-scene.js'); }) // カスタム3Dシーンファイル
      .then(function(){
        // 3Dシーン初期化関数が存在する場合は実行
        if (typeof window.initThreeJsScene === 'function') {
          window.initThreeJsScene();
        }
      })
      .catch(function(e){ console.error('Three.js stack load failed', e); }) // エラーログ出力
      .finally(cleanup); // 処理完了後にクリーンアップ実行
  }
  
  // ユーザーアクションが検出された時の処理
  function onUser(){ tryLoad(); }
  
  var io = null; // IntersectionObserver のインスタンス保存用
  
  // IntersectionObserver を使用した viewport 内表示検出
  if ('IntersectionObserver' in window){
    var hero = document.getElementById('home') || document.body; // 監視対象要素（ヒーローセクションまたはbody）
    try {
      // 要素が viewport に入った時に Three.js を読み込む
      io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){ tryLoad(); } // 要素が表示されたら読み込み実行
        });
      }, { rootMargin: '0px 0px -40% 0px', threshold: 0.1 }); // viewport の60%以上に入った時に発火
      if (hero) io.observe(hero); // 監視開始
    } catch(e) {} // エラーが発生しても処理を継続
  }
  
  // ユーザーインタラクション検出用のイベントリスナー設定
  window.addEventListener('scroll', onUser, { once: true, passive: true }); // スクロール検出（1回のみ）
  window.addEventListener('pointerdown', onUser, { once: true, passive: true }); // ポインター押下検出（1回のみ）
  window.addEventListener('mousemove', onUser, { once: true, passive: true }); // マウス移動検出（1回のみ）
  
  // アイドル時間を利用した遅延読み込み
  if ('requestIdleCallback' in window){
    // ブラウザがアイドル状態の時に読み込み（最大5秒後）
    requestIdleCallback(function(){ tryLoad(); }, { timeout: 5000 });
  } else {
    // requestIdleCallback が非対応の場合は4秒後に実行
    setTimeout(function(){ tryLoad(); }, 4000);
  }
})();