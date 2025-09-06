/**
 * 季節データ設定
 * 四季ごとの楽曲・動画・画像データを一元管理するオブジェクト
 *
 * 目的:
 * - 四季ごとの表示情報（アイコン/名称/説明/ポスター/動画/音源）を一元管理
 * - UI生成ロジック（ギャラリーやナビ）から定数参照で扱いやすくする
 *
 * パフォーマンス配慮:
 * - 画像/動画ファイルはここでパスを定義するのみ。実ロードは必要時に行う（遅延ロード）
 * - 動画は `<source data-src>` を使い、可視化/操作時にのみ `src` をセットする設計（ネットワーク競合を抑制）
 * 
 * データ構造:
 * - icon: 季節を表すアイコン
 * - name: 季節の名前
 * - title: 季節のタイトル
 * - description: 季節の説明
 * - poster: 季節のポスター画像
 * - video: 季節の動画ファイル
 * - tracks: その季節に属する楽曲の配列
 */
const SEASON_DATA = {
  spring: {
    icon: '🌸',
    name: '春',
    title: '春の調べ',
    description: '桜咲く季節の温かな希望と新しい始まりを表現した楽曲集',
    poster: './img/秀歌-春.webp',
    video: {
      webm: null,
      mp4: './video/光のほうへ.mp4'
    },
    tracks: [
      {
        title: '光のほうへ',
        description: '新緑の季節に響く希望のメロディー',
        src: './audio/光のほうへ.mp3'
      },
      {
        title: 'ひかりのあと',
        description: '春の陽だまりで感じる穏やかな時間',
        src: './audio/ひかりのあと.mp3'
      }
    ]
  },
  tsuyu: {
    icon: '☔️',
    name: '梅雨',
    title: '梅雨の音色',
    description: '雨の季節の静けさと潤いを感じる楽曲集',
    poster: './img/秀歌-梅雨.webp',
    video: {
      webm: null,
      mp4: './video/夏庭園の歌.mp4'
    },
    tracks: [
      {
        title: 'ひかりのあと',
        description: '春の陽だまりで感じる穏やかな時間',
        src: './audio/ひかりのあと.mp3'
      },
      {
        title: '緑の中のひととき',
        description: '木陰で過ごす静寂な時間',
        src: './audio/緑の中のひととき.mp3'
      }
    ]
  },
  summer: {
    icon: '🌻',
    name: '夏',
    title: '夏の響き',
    description: '緑豊かな季節の生命力と情熱を込めた楽曲集',
    poster: './img/秀歌-夏.webp',
    video: {
      webm: null,
      mp4: './video/夏庭園の歌.mp4'
    },
    tracks: [
      {
        title: '夏庭園の詩',
        description: '緑陰の中で感じる夏の情景',
        src: './audio/夏庭園の詩.mp3'
      },
      {
        title: '緑の中のひととき',
        description: '木陰で過ごす静寂な時間',
        src: './audio/緑の中のひととき.mp3'
      }
    ]
  },
  autumn: {
    icon: '🍁',
    name: '秋',
    title: '秋の詩',
    description: '色づく季節の深い情感と静寂を表現した楽曲集',
    poster: './img/秀歌-秋.webp',
    video: {
      webm: null,
      mp4: './video/洛陽の宵.mp4'
    },
    tracks: [
      {
        title: '洛陽の宵（よい）',
        description: '秋の夜に響く古都の響き',
        src: './audio/落葉の宵(よい).mp3'
      },
      {
        title: '風の庭にて',
        description: '秋風に舞う葉音のハーモニー',
        src: './audio/風の庭にて.mp3'
      }
    ]
  },
  winter: {
    icon: '❄️',
    name: '冬',
    title: '冬の静寂',
    description: '雪景色の中の静けさと内省を込めた楽曲集',
    poster: './img/秀歌-冬.webp',
    video: {
      webm: null,
      mp4: './video/白のなかで.mp4'
    },
    tracks: [
      {
        title: '白のなかで',
        description: '雪に包まれた世界の静寂',
        src: './audio/白のなかで.mp3'
      },
      {
        title: 'しろのことば',
        description: '雪降る夜の静寂な語らい',
        src: './audio/しろのことば.mp3'
      }
    ]
  }
};

/**
 * アクセシビリティ機能強化
 * 
 * 目的:
 * - キーボードナビゲーションとスクリーンリーダー対応を改善
 * - マウスとキーボードの使用状況を追跡してフォーカス表示を最適化
 */
function initAccessibilityFeatures() {
  // マウス使用状況の追跡（フォーカス管理のため）
  // マウスクリック時は視覚的なフォーカス表示を無効化
  document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
  
}



/**
 * Navigation Module
 *
 * 役割:
 * - アンカースクロールのスムーズ化
 * - スクロール位置に応じたヘッダー挙動（必要に応じて）
 * - アクティブナビゲーションの更新
 *
 * パフォーマンス配慮:
 * - スクロール/ポインタイベントは `passive: true` を基本にし、
 *   レイアウトスラッシングを避けるため `requestAnimationFrame`/スロットリングの検討余地あり。
 */

class Navigation {
  /**
   * コンストラクタ - ナビゲーション要素の初期化
   */
  constructor() {
    // DOM要素の取得
    this.navMenu = document.getElementById('nav-menu'); // メニュー要素
    this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]'); // アンカーリンク群
    this.header = document.getElementById('header'); // ヘッダー要素
    
    // 初期化処理の実行
    this.init();
  }
  
  /**
   * 初期化処理
   * - イベントバインディング
   * - スクロール処理の初期実行
   */
  init() {
    this.bindEvents();
    this.handleScroll();
  }
  
  /**
   * イベントリスナーのバインディング
   * - スムーズスクロール
   * - 外部クリック検知
   * - スクロール検知
   * - キーボード操作
   */
  bindEvents() {
    
    // アンカーリンクでのスムーズスクロール
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });
    
    
    // スクロール時のヘッダースタイル変更
    window.addEventListener('scroll', () => this.handleScroll());
    
  }
  
  
  
  
  /**
   * スムーズスクロール処理
   * アンカーリンククリック時の処理
   * - ページ内の指定セクションにスムーズにスクロール
   * - URLを更新してブックマーク対応
   * - アクティブなナビゲーションリンクを更新
   */
  handleSmoothScroll(e) {
    e.preventDefault(); // デフォルトのリンク動作を無効化
    
    const targetId = e.target.getAttribute('href').substring(1); // #を除いたIDを取得
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      
      // 固定ヘッダーの高さを考慮したオフセット計算
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      // ネイティブのスムーズスクロール（遅延最小化）
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      
      // スクロールをトリガーせずにURLを更新
      history.pushState(null, null, `#${targetId}`);
      
      // アクティブなナビゲーションリンクを更新
      this.updateActiveNavLink(targetId);
    }
  }
  
  /**
   * カスタムスムーズスクロール（イージング付き）
   * - より細かなアニメーション制御が必要な場合に使用
   * - ease-in-out-cubic イージング関数を使用
   */
  // smoothScrollTo は未使用のため削除しました（ネイティブの window.scrollTo を使用）
  
  /**
   * アクティブナビゲーションリンクの更新
   * - 現在のセクションに対応するナビゲーションリンクにアクティブクラスを付与
   * - アクセシビリティのためにaria-current属性を設定
   */
  updateActiveNavLink(activeId) {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1); // #を除いたリンクのID
      if (href === activeId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page'); // 現在のページを示すARIA属性
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
  
  
  
  /**
   * スクロールイベント処理
   * - ヘッダーのスタイル変更（スクロール時の背景変更など）
   * - スクロール位置に応じたアクティブナビゲーションの更新
   */
  handleScroll() {
    const scrolled = window.pageYOffset; // 現在のスクロール位置
    const threshold = 100; // ヘッダースタイル変更の閾値
    
    // 閾値を超えたらヘッダーにスクロールクラスを追加
    if (scrolled > threshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // スクロール位置に基づくアクティブナビゲーションの更新
    this.updateActiveNavOnScroll();
  }
  
  /**
   * スクロール位置に基づくアクティブナビゲーションの更新
   * - 現在表示されているセクションを判定
   * - 対応するナビゲーションリンクをアクティブ状態にする
   */
  updateActiveNavOnScroll() {
    const sections = ['home', 'about', 'gallery', 'contact']; // チェック対象のセクションID
    const headerHeight = this.header.offsetHeight; // ヘッダーの高さ
    const scrollPosition = window.pageYOffset + headerHeight + 100; // 判定位置（オフセット付き）
    
    let activeSection = 'home'; // デフォルトはホームセクション
    
    // 各セクションの位置をチェックして現在のセクションを特定
    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section && scrollPosition >= section.offsetTop) {
        activeSection = sectionId;
      }
    }
    
    // アクティブナビゲーションリンクを更新
    this.updateActiveNavLink(activeSection);
  }
}

/**
 * 外部使用用のユーティリティ関数
 * - 外部からセクションにスクロールする際に使用
 * - ヘッダーの高さを考慮したスムーズスクロール
 */
window.scrollToSection = function(sectionId) {
  const targetElement = document.getElementById(sectionId);
  const header = document.getElementById('header');
  
  if (targetElement && header) {
    const headerHeight = header.offsetHeight; // ヘッダー高さ取得
    const targetPosition = targetElement.offsetTop - headerHeight; // オフセット計算
    
    // スムーズスクロールでターゲット位置に移動
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};


// モジュールシステム用のエクスポート設定
// CommonJS環境での利用を可能にする
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
/**
 * 季節モジュール
 * 季節ごとのギャラリー切替、アニメーション、アクセシビリティ対応を処理
 * 
 * 主な機能:
 * - 季節ギャラリーの動的生成と切替
 * - 動画・音楽ファイルの遅延読み込み
 * - リソース管理による同時再生防止
 * - バリアフリー対応（キーボード操作、スクリーンリーダー支援）
 */

// 冬の季節ギャラリー動画を「白のなかで」に設定
// 冬の動画ファイルパスを「白のなかで」に上書き設定
SEASON_DATA.winter.video.mp4 = './video/白のなかで.mp4';

/**
 * SeasonsGallery
 *
 * 役割:
 * - 季節ナビ/パネルの動的生成、切替、アクセシビリティ対応。
 * - 動画/音声の遅延ロードとリソース解放（同時再生防止）。
 *
 * パフォーマンス配慮:
 * - `<video>` は `preload="none"` + `loading="lazy"`、`width/height` 指定でCLS低減。
 * - `<source>` には `data-src` を使い、可視化/再生要求時にのみ実URLを充当。
 * - 和紙背景は `requestIdleCallback` + `Save-Data` 尊重でアイドル時にプリロード。
 */
class SeasonsGallery {
  /**
   * コンストラクタ - 季節ギャラリーの初期化
   * DOM要素の取得と初期状態の設定
   */
  constructor() {
    // DOM要素の取得
    this.seasonButtons = document.querySelectorAll('.season-btn'); // 季節選択ボタン群
    this.seasonPanels = document.querySelectorAll('.season-panel'); // 季節パネル群
    this.currentSeason = 'tsuyu'; // 現在の季節（初期値は梅雨）
    this.audioElements = []; // 音楽プレーヤー要素の配列
    this.videoElements = []; // 動画要素の配列
    
    // 初期化処理の実行
    this.init();
  }
  
  /**
   * 初期化処理
   * - イベントバインディング
   * - オーディオ・ビデオ要素の設定
   * - 和紙背景のプリロード
   * - 初期季節の設定
   */
  init() {
    this.bindEvents();
    this.setupAudioElements();
    this.preloadWashiBackgrounds(); // 和紙背景をプリロード
    this.loadInitialSeason();
  }
  
  /**
   * イベントリスナーのバインディング
   * - 季節ボタンのクリック・キーボード操作
   * - オーディオ・ビデオの再生制御
   * - イベントデリゲーションによる動的要素の処理
   */
  bindEvents() {
    // 季節ボタンのイベント設定
    this.seasonButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleSeasonChange(e));
    });
    
    // オーディオイベントの処理（UX向上のため）
    document.addEventListener('play', (e) => this.handleAudioPlay(e), true);
    document.addEventListener('pause', (e) => this.handleAudioPause(e), true);
    
    // 動的生成された動画要素のイベントデリゲーション
    document.addEventListener('click', (e) => {
      // 動画への直接クリック
      if (e.target.classList.contains('season-video')) {
        e.preventDefault();
        this.handleVideoClick(e);
        return;
      }
      
      // コンテナクリック（ポスター画像含む）
      const visualContainer = e.target.closest('.season-visual');
      if (visualContainer) {
        const video = visualContainer.querySelector('.season-video');
        if (video && e.target !== video) {
          e.preventDefault();
          // 一貫した処理のための合成イベント作成
          const syntheticEvent = { target: video, preventDefault: () => {} };
          this.handleVideoClick(syntheticEvent);
        }
      }
    });
    
  }
  
  /**
   * オーディオ・ビデオ要素の設定
   * - 初期音量の設定
   * - プリロードの無効化（パフォーマンス向上）
   * - アクセシビリティ属性の追加
   */
  setupAudioElements() {
    this.audioElements = Array.from(document.querySelectorAll('audio')); // 音楽要素を配列化
    this.videoElements = Array.from(document.querySelectorAll('.season-video')); // 動画要素を配列化
    
    // 音楽要素の設定
    this.audioElements.forEach(audio => {
      audio.volume = 0.5; // デフォルト音量を50%に設定
      audio.preload = 'none'; // パフォーマンス向上のためプリロード無効
      
      // アクセシビリティ属性の追加
      const trackTitleEl = audio.parentElement.querySelector('.track-title');
      const trackTitle = trackTitleEl ? trackTitleEl.textContent : 'Track';
      audio.setAttribute('aria-label', `${trackTitle}の音楽プレーヤー`);
    });

    // 動画要素の設定
    this.videoElements.forEach(video => {
      video.volume = 0.5; // デフォルト音量を50%に設定
      video.preload = 'none'; // 再生まで動画データをロードしない
      video.muted = false; // 音声付きで再生可能

      // イベントハンドラーはbindEvents()でイベントデリゲーションによって管理

      // アクセシビリティ属性の追加
      const seasonPanel = video.closest('.season-panel');
      const seasonTitleEl = seasonPanel ? seasonPanel.querySelector('.season-title') : null;
      const seasonTitle = seasonTitleEl ? seasonTitleEl.textContent : 'Video';
      video.setAttribute('aria-label', `${seasonTitle}のデモ動画`);
    });
  }
  
  /**
   * DOM要素の再取得とイベントの再バインド
   * - 動的生成後のDOM要素を再取得
   * - イベントリスナーの再設定
   */
  refresh() {
    // 動的生成後のDOM要素を再取得
    this.seasonButtons = document.querySelectorAll('.season-btn');
    this.seasonPanels = document.querySelectorAll('.season-panel');
    
    // イベントの再バインド
    this.bindEvents();
    this.setupAudioElements();
  }

  preloadWashiBackgrounds() {
    // 和紙背景のアイドル時プリロード
    // - LCP競合を避けるため初期レンダリング直後は取得しない
    // - Data Saver有効時はスキップ
    const run = () => {
      try {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn && conn.saveData) return; // データ節約モードを尊重
      } catch (e) {}

      const washiImages = [
        './img/和紙-春.webp',
        './img/和紙-夏.webp',
        './img/和紙-秋.webp',
        './img/和紙-冬.webp',
        './img/和紙-梅雨.webp'
      ];

      // 画像は非同期デコード指定でメインスレッド負荷を軽減
      washiImages.forEach(src => {
        const img = new Image();
        img.decoding = 'async';
        img.loading = 'eager';
        img.src = src;
      });
    };

    // アイドルコールバックが利用可能な場合は優先して使用
    // ブラウザがアイドル状態の時に実行してパフォーマンスへの影響を最小化
    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 8000 }); // 8秒以内に必ず実行
    } else {
      setTimeout(run, 5000); // フォールバック: 5秒後に実行
    }
  }
  
  /**
   * 初期季節の読み込み処理
   * - デフォルトで梅雨季節のスタイリングを適用
   * - パネルは非選択状態でユーザーの選択を待機
   * - 適切な季節エフェクトを有効化
   */
  loadInitialSeason() {
    // 梅雨季節のスタイリングを適用するが、パネルは選択しない
    this.currentSeason = '';

    // URLを梅雨季節を反映して更新
    this.updateURL('tsuyu');

    // スタイリングと背景を更新
    this.updateSeasonBackground('tsuyu');

    // 梅雨季節の雨エフェクトを有効化
    if (typeof window.enableRain === 'function') {
      window.enableRain();
    }
    // 桃の花エフェクトが無効化されていることを確認
    if (typeof window.disableSakura === 'function') {
      window.disableSakura();
    }

    // 春季節の桃の花エフェクトを有効化（春が選択されている場合のみ）
    if (typeof window.enableSakura === 'function' && this.currentSeason === 'spring') {
      window.enableSakura();
    }

    // ユーザーが季節を選択するまで、すべてのパネルを非表示
    this.updateSeasonButtons('');
    this.updateSeasonPanels('', false);
  }
  
  /**
   * URLパラメータから季節を取得
   * - URLクエリパラメータ「season」の値を確認
   * - 有効な季節名の場合のみ返却
   */
  // getSeasonFromURL は未使用のため削除しました

  /**
   * ローカルストレージから最後に選択された季節を取得
   * - 前回のユーザー選択を記憶
   * - ストレージアクセスエラー時も安全に処理
   */
  // getSeasonFromStorage は未使用のため削除しました
  
  
  /**
   * 季節変更イベントの処理
   * - ボタンクリック時の季節切り替え
   * - 現在の季節と異なる場合のみ処理
   */
  handleSeasonChange(e) {
    e.preventDefault(); // デフォルトのボタン動作を無効化
    
    const button = e.currentTarget;
    const season = button.getAttribute('data-season'); // data-season属性から季節を取得
    
    // 有効な季節で現在の季節と異なる場合のみ切り替え
    if (season && season !== this.currentSeason) {
      this.switchToSeason(season);
    }
  }
  
  
  /**
   * 季節の切り替え処理
   * 
   * 機能:
   * - 指定された季節への切り替えと関連する全ての要素の更新
   * - 音楽・動画の停止、UI状態の更新、季節演出の制御
   * - アクセシビリティ対応とブラウザ履歴の管理
   * 
   * @param {string} season - 切り替え先の季節 ('spring', 'summer', 'autumn', 'winter', 'tsuyu')
   * @param {boolean} animate - アニメーション有無 (デフォルト: true)
   */
  switchToSeason(season, animate = true) {
    // 季節の有効性をチェック
    if (!['spring', 'summer', 'autumn', 'winter', 'tsuyu'].includes(season)) {
      return;
    }
    
    // 再生中の全ての音楽・動画を停止
    this.stopAllAudio();
    
    // 季節ボタンの状態を更新
    this.updateSeasonButtons(season);
    
    // 季節パネルの表示状態をアニメーション付きで更新
    this.updateSeasonPanels(season, animate);

    // 現在の季節を更新
    this.currentSeason = season;

    // ユーザーの選択をローカルストレージに保存
    try {
      localStorage.setItem('lastSeason', season);
    } catch (e) {
      // ストレージアクセスエラーは無視
    }
    
    // ページリロードなしでURLを更新（ブックマーク対応）
    this.updateURL(season);
    
    // ユーザーの季節ボタン操作時にアバウト画像を更新
    if (animate) {
      this.updateAboutImage(season);
    }

    // 背景スタイル（和紙背景含む）を季節に合わせて更新
    this.updateSeasonBackground(season);

    // 季節に応じた視覚効果の切り替え
    if (season === 'spring') {
      // 春：桜エフェクトを有効化
      if (typeof window.enableSakura === 'function') {
        window.enableSakura(); // シンプルな桜エフェクト有効化
      }
      // 他の季節演出を全て無効化
      if (typeof window.disableRain === 'function') window.disableRain();
      if (typeof window.disableSnow === 'function') window.disableSnow();
      if (typeof window.disableAutumnLeaves === 'function') window.disableAutumnLeaves();
      if (typeof window.disableSummerWillow === 'function') window.disableSummerWillow();
    } else if (season === 'tsuyu') {
      // 梅雨：雨滴演出を有効化
      if (typeof window.enableRain === 'function') window.enableRain();
      if (typeof window.disableSakura === 'function') window.disableSakura();
      if (typeof window.disableSnow === 'function') window.disableSnow();
    } else if (season === 'winter') {
      // 冬：雪花演出を有効化
      if (typeof window.enableSnow === 'function') window.enableSnow();
      if (typeof window.disableRain === 'function') window.disableRain();
      if (typeof window.disableSakura === 'function') window.disableSakura();
      if (typeof window.disableAutumnLeaves === 'function') window.disableAutumnLeaves();
    } else if (season === 'autumn') {
      // 秋：紅葉演出を有効化
      if (typeof window.enableAutumnLeaves === 'function') window.enableAutumnLeaves();
      if (typeof window.disableRain === 'function') window.disableRain();
      if (typeof window.disableSakura === 'function') window.disableSakura();
      if (typeof window.disableSnow === 'function') window.disableSnow();
      if (typeof window.disableSummerWillow === 'function') window.disableSummerWillow();
    } else if (season === 'summer') {
      // 夏：柳の葉演出を有効化
      if (typeof window.enableSummerWillow === 'function') window.enableSummerWillow();
      if (typeof window.disableRain === 'function') window.disableRain();
      if (typeof window.disableSakura === 'function') window.disableSakura();
      if (typeof window.disableSnow === 'function') window.disableSnow();
      if (typeof window.disableAutumnLeaves === 'function') window.disableAutumnLeaves();
    } else {
      // その他：全ての季節演出を無効化
      if (typeof window.disableRain === 'function') window.disableRain();
      if (typeof window.disableSakura === 'function') window.disableSakura();
      if (typeof window.disableSnow === 'function') window.disableSnow();
      if (typeof window.disableAutumnLeaves === 'function') window.disableAutumnLeaves();
      if (typeof window.disableSummerWillow === 'function') window.disableSummerWillow();
    }
    
    // スクリーンリーダー用に季節変更を音声通知
    this.announceSeasonChange(season);
  }
  
  /**
   * 季節ボタンの状態更新
   * 
   * 機能:
   * - アクティブな季節ボタンの視覚的状態とARIA属性を更新
   * - キーボードナビゲーション用のtabindex管理
   * - アクセシビリティ対応のaria-selected属性設定
   */
  updateSeasonButtons(activeSeason) {
    this.seasonButtons.forEach(button => {
      const buttonSeason = button.getAttribute('data-season');
      const isActive = buttonSeason === activeSeason;
      
      // 視覚的状態の更新: CSSスタイリング用のアクティブクラスを切り替え
      button.classList.toggle('active', isActive);
      // アクセシビリティ: スクリーンリーダーに選択状態を通知
      // aria-selected: タブリストや選択可能要素での選択状態を示すARIA属性
      // "true"/"false"文字列で設定する必要がある（ブール値ではなく）
      button.setAttribute('aria-selected', isActive.toString());
      
      // キーボードナビゲーション用のtabindex設定
      if (isActive) {
        button.setAttribute('tabindex', '0'); // アクティブなボタンのみキーボードフォーカス可能
      } else {
        button.setAttribute('tabindex', '-1'); // 非アクティブボタンはTabキーでスキップ（プログラム的フォーカスのみ）
      }
    });
  }
  
  /**
   * 季節パネルの表示状態更新
   * 
   * 機能:
   * - アクティブな季節に対応するパネルの表示・非表示を制御
   * - アニメーション付きでの滑らかな切り替え
   */
  updateSeasonPanels(activeSeason, animate) {
    this.seasonPanels.forEach(panel => {
      const panelSeason = panel.getAttribute('data-season');
      const isActive = panelSeason === activeSeason;
      
      // アクティブな季節のパネルを表示、その他を非表示
      if (isActive) {
        this.showPanel(panel, animate);
      } else {
        this.hidePanel(panel, animate);
      }
    });
  }
  
  /**
   * パネルの表示処理
   * 
   * 機能:
   * - 季節パネルをアニメーション付きで表示
   * - 子要素のアニメーション制御
   * - 動画の遅延読み込み（パフォーマンス向上）
   * - アクセシビリティ属性の更新
   */
  showPanel(panel, animate) {
    // パフォーマンス向上のため動画読み込みはユーザー操作まで遅延
    panel.style.display = 'grid';
    panel.classList.add('active');

    // アニメーション付きで表示
    if (animate) {
      panel.style.opacity = '0';
      panel.style.transform = 'scale(0.97)';
      panel.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      requestAnimationFrame(() => {
        panel.style.opacity = '1';
        panel.style.transform = 'scale(1)';
      });
      // アニメーション完了後にスタイルをリセット
      setTimeout(() => {
        panel.style.transition = '';
        panel.style.opacity = '';
        panel.style.transform = '';
      }, 400);

      // 子要素のアニメーション実行
      this.animatePanelChildren(panel, true);
    }

    // スクリーンリーダー用の表示状態を更新
    panel.setAttribute('aria-hidden', 'false');

    // パネル表示時に動画ソースを読み込み（プレーヤー準備）
    this.loadVideoForPanel(panel, false);
  }
  
  /**
   * パネルの非表示処理
   * 
   * 機能:
   * - 季節パネルをアニメーション付きで非表示
   * - 子要素の退場アニメーション制御
   * - アクセシビリティ属性の更新
   */
  hidePanel(panel, animate) {
    if (animate) {
      // 子要素の退場アニメーション
      this.animatePanelChildren(panel, false);
      panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      panel.style.opacity = '0';
      panel.style.transform = 'scale(0.97)';

      // アニメーション完了後にパネルを完全に非表示
      setTimeout(() => {
        panel.style.transition = '';
        panel.style.display = 'none';
        panel.classList.remove('active');
        panel.style.opacity = '';
        panel.style.transform = '';
      }, 300);
    } else {
      // アニメーションなしで即座に非表示
      panel.style.display = 'none';
      panel.classList.remove('active');
    }

    // スクリーンリーダー用の非表示状態を更新
    panel.setAttribute('aria-hidden', 'true');
  }

  /**
   * パネル子要素のアニメーション制御
   * 
   * 機能:
   * - 季節パネル内の各要素（動画、タイトル、説明、楽曲リスト）の登場・退場アニメーション
   * - 時間差アニメーションによる美しい演出効果
   * - cubic-bezierイージングによる滑らかな動き
   * 
   * @param {HTMLElement} panel - アニメーション対象のパネル要素
   * @param {boolean} isEntering - true: 登場アニメーション, false: 退場アニメーション
   */
  animatePanelChildren(panel, isEntering) {
    const videoElement = panel.querySelector('.season-visual');
    const trackList = panel.querySelector('.season-tracks');
    const seasonTitle = panel.querySelector('.season-title');
    const seasonDesc = panel.querySelector('.season-description');

    if (isEntering) {
      // 動画要素の登場アニメーション（左からスライドイン）
      if (videoElement) {
        videoElement.style.opacity = '0';
        videoElement.style.transform = 'translateX(-80px)';
        videoElement.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s, transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s';
        requestAnimationFrame(() => {
          videoElement.style.opacity = '1';
          videoElement.style.transform = 'translateX(0)';
        });
        // アニメーション完了後にスタイルをリセット
        setTimeout(() => {
          videoElement.style.transition = '';
          videoElement.style.opacity = '';
          videoElement.style.transform = '';
        }, 800);
      }

      if (trackList) {
        // 季節タイトルと説明文の登場アニメーション（右からスライドイン、時間差）
        [seasonTitle, seasonDesc].forEach((el, idx) => {
          if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateX(60px)';
            el.style.transition = `opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.2 + idx * 0.1}s, transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.2 + idx * 0.1}s`;
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateX(0)';
            });
            // 要素ごとに異なるタイミングでリセット
            setTimeout(() => {
              el.style.transition = '';
              el.style.opacity = '';
              el.style.transform = '';
            }, 700 + idx * 100);
          }
        });

        // 楽曲リストコンテナの登場アニメーション（右から大きくスライドイン）
        trackList.style.opacity = '0';
        trackList.style.transform = 'translateX(100px)';
        trackList.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.3s, transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.3s';
        requestAnimationFrame(() => {
          trackList.style.opacity = '1';
          trackList.style.transform = 'translateX(0)';
        });
        setTimeout(() => {
          trackList.style.transition = '';
          trackList.style.opacity = '';
          trackList.style.transform = '';
        }, 1100);

        // 個別楽曲の連続登場アニメーション（順次表示）
        const tracks = trackList.querySelectorAll('.track');
        tracks.forEach((track, idx) => {
          track.style.opacity = '0';
          track.style.transform = 'translateX(40px)';
          track.style.transition = `opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.5 + idx * 0.08}s, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.5 + idx * 0.08}s`;
          requestAnimationFrame(() => {
            track.style.opacity = '1';
            track.style.transform = 'translateX(0)';
          });
          setTimeout(() => {
            track.style.transition = '';
            track.style.opacity = '';
            track.style.transform = '';
          }, 1000 + idx * 80);
        });
      }
    } else {
      // 退場アニメーション
      if (videoElement) {
        // 動画要素の退場（左へフェードアウト）
        videoElement.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        videoElement.style.opacity = '0';
        videoElement.style.transform = 'translateX(-60px)';
      }
      if (trackList) {
        // 個別楽曲の順次退場アニメーション
        const tracks = trackList.querySelectorAll('.track');
        tracks.forEach((track, idx) => {
          track.style.transition = `opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${idx * 0.03}s, transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${idx * 0.03}s`;
          track.style.opacity = '0';
          track.style.transform = 'translateX(30px)';
        });
        // テキスト要素とリストコンテナの退場（右へスライドアウト）
        [seasonTitle, seasonDesc, trackList].forEach((el, idx) => {
          if (el) {
            el.style.transition = `opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.1 + idx * 0.05}s, transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.1 + idx * 0.05}s`;
            el.style.opacity = '0';
            el.style.transform = 'translateX(50px)';
          }
        });
      }
    }
  }

  /**
   * パネル内動画の遅延読み込み処理
   * 
   * 機能:
   * - パフォーマンス向上のための動画ソース遅延設定
   * - data-src属性からsrc属性への変換
   * - 読み込み状態の管理と視覚的フィードバック
   * - 自動再生オプション対応
   * 
   * @param {HTMLElement} panel - 対象パネル要素
   * @param {boolean} autoPlay - 読み込み完了後に自動再生するかどうか
   */
  loadVideoForPanel(panel, autoPlay = false) {
    const video = panel.querySelector('.season-video');
    if (!video || video.dataset.loaded === 'true') {
      // 既に読み込み済みで自動再生が要求されている場合は即座に再生
      if (autoPlay && video && video.paused) {
        video.play().catch(error => {
          console.error('Video play failed:', error);
        });
      }
      return;
    }

    // 読み込み中の視覚的フィードバック（透明度を下げる）
    video.style.opacity = '0.7';

    // data-src属性からsrc属性に変換して動画読み込みを開始
    const sources = video.querySelectorAll('source[data-src]');
    sources.forEach(source => {
      const src = source.getAttribute('data-src');
      if (src) source.src = src;
    });

    // 動画ファイルの読み込み実行
    video.load();
    video.dataset.loaded = 'true'; // 読み込み完了マーク
    video.style.opacity = '1'; // 透明度を元に戻す

    // 自動再生が要求されている場合は再生開始
    if (autoPlay) {
      video.play().catch(error => {
        console.error('Video play failed:', error);
      });
    }
  }
  
  /**
   * URLクエリパラメータの更新
   * 
   * 機能:
   * - 現在の季節をURLクエリパラメータ「season」に反映
   * - ページのリロードなしでURLを更新（ブックマーク・共有対応）
   * - ブラウザ履歴の管理
   */
  updateURL(season) {
    const url = new URL(window.location);
    url.searchParams.set('season', season);
    
    // ナビゲーションを発生させずにURLを更新
    history.replaceState(null, '', url.toString());
  }

  /**
   * 季節背景の更新処理
   * 
   * 機能:
   * - 季節に対応する和紙背景画像のプリロード
   * - body要素とheader要素にdata-season属性を設定
   * - CSS背景変更のスムーズな切り替え
   * - 季節セレクタの状態同期
   */
  updateSeasonBackground(season) {
    // スムーズな切り替えのため和紙背景をプリロード
    const washiImages = {
      spring: './img/和紙-春.webp',
      summer: './img/和紙-夏.webp', 
      autumn: './img/和紙-秋.webp',
      winter: './img/和紙-冬.webp',
      tsuyu: './img/和紙-梅雨.webp'
    };

    const imageUrl = washiImages[season];
    if (imageUrl) {
      // 和紙画像をプリロード
      const img = new Image();
      img.onload = () => {
        // CSSスタイリング用のボディ季節属性を更新
        document.body.setAttribute('data-season', season);
        const header = document.getElementById('header');
        if (header)
          header.setAttribute('data-season', season);
        const selector = document.getElementById('season-selector');
        if (selector && typeof selector.updateActive === 'function')
          selector.updateActive(season);
      };
      img.src = imageUrl;
    } else {
      // フォールバック：直接更新
      document.body.setAttribute('data-season', season);
      const header = document.getElementById('header');
      if (header)
        header.setAttribute('data-season', season);
      const selector = document.getElementById('season-selector');
      if (selector && typeof selector.updateActive === 'function')
        selector.updateActive(season);
    }

    this.updateFavicon(season);
  }

  updateFavicon(season) {
    const icons = {
      spring: '🌸',
      tsuyu: '☔️',
      summer: '🌻',
      autumn: '🍁',
      winter: '❄️'
    };
    const emoji = icons[season] || '🌸';
    const svg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text y="14" font-size="16">${emoji}</text></svg>`
    );
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.setAttribute('href', `data:image/svg+xml,${svg}`);
  }
  
  updateAboutImage(season) {
    const aboutImage = document.querySelector('.about-image');
    if (!aboutImage) return;
    
    const seasonImages = {
      spring: './img/秀歌-春-btn.webp',
      summer: './img/秀歌-夏-btn.webp',
      autumn: './img/秀歌-秋-btn.webp',
      winter: './img/秀歌-冬-btn.webp',
      tsuyu: './img/秀歌-梅雨.webp'
    };
    
    const imageUrl = seasonImages[season];
    if (imageUrl) {
      // 変更前に画像をプリロード
      const img = new Image();
      img.onload = () => {
        aboutImage.src = imageUrl;
        aboutImage.srcset = imageUrl;
        
        // picture要素のソースも更新
        const pictureSource = aboutImage.parentElement.querySelector('source');
        if (pictureSource) {
          pictureSource.srcset = imageUrl;
        }
      };
      img.src = imageUrl;
    }
  }
  
  announceSeasonChange(season) {
    const seasonNames = {
      spring: '春',
      summer: '夏',
      autumn: '秋',
      winter: '冬',
      tsuyu: '梅雨'
    };
    
    const announcement = `${seasonNames[season]}の楽曲に切り替わりました`;
    
    // スクリーンリーダー用のライブリージョンを作成または更新
    let liveRegion = document.getElementById('season-announcer');
    
    liveRegion.textContent = announcement;
  }
  
  /**
   * 音楽・動画再生開始イベントの処理
   * 
   * 機能:
   * - 複数メディアの同時再生を防止
   * - 音楽再生時は全ての動画を停止
   * - 動画再生時は全ての音楽と他の動画を停止
   * - 再生状態のUI表示管理
   */
  handleAudioPlay(e) {
    // 他の音楽・動画要素を停止して同時再生を防止
    if (e.target.tagName === 'AUDIO') {
      // 他の音楽を停止
      this.audioElements.forEach(audio => {
        if (audio !== e.target && !audio.paused) {
          audio.pause();
        }
      });
      
      // 音楽再生開始時は全ての動画を停止
      this.videoElements.forEach(video => {
        if (!video.paused) {
          video.pause();
        }
      });
      
      // 再生状態のクラスを追加（UI表示用）
      const trackEl = e.target.closest('.track');
      if (trackEl) trackEl.classList.add('playing');
    }
    
    // 動画再生イベントの処理
    if (e.target.tagName === 'VIDEO') {
      // 動画再生開始時は全ての音楽を停止
      this.audioElements.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
        }
      });
      
      // 他の動画を停止
      this.videoElements.forEach(video => {
        if (video !== e.target && !video.paused) {
          video.pause();
        }
      });
      
      // 再生状態のクラスを追加（UI表示用）
      const panelEl = e.target.closest('.season-panel');
      if (panelEl) panelEl.classList.add('video-playing');
    }
  }
  
  /**
   * 音楽・動画一時停止イベントの処理
   * 
   * 機能:
   * - 再生停止時のUI状態リセット
   * - 再生状態を示すCSSクラスの削除
   */
  handleAudioPause(e) {
    if (e.target.tagName === 'AUDIO') {
      // 再生状態クラスを削除
      const trackEl = e.target.closest('.track');
      if (trackEl) trackEl.classList.remove('playing');
    }
    
    if (e.target.tagName === 'VIDEO') {
      // 再生状態クラスを削除
      const panelEl = e.target.closest('.season-panel');
      if (panelEl) panelEl.classList.remove('video-playing');
    }
  }
  
  /**
   * 動画クリックイベントの処理
   * 
   * 機能:
   * - 動画の再生/一時停止の切り替え
   * - 初回クリック時の動画遅延読み込み
   * - エラーハンドリング
   */
  handleVideoClick(e) {
    const video = e.target;
    
    // 有効な動画要素かどうかを確認
    if (!video || !video.tagName || video.tagName.toLowerCase() !== 'video') {
      console.warn('handleVideoClick called without valid video element');
      return;
    }
    
    // 初回操作時の動画遅延読み込み
    if (video.dataset.loaded !== 'true') {
      const panel = video.closest('.season-panel');
      if (panel) {
        // 動画を読み込みつつ自動再生
        this.loadVideoForPanel(panel, true);
      }
    } else {
      // 読み込み済み動画の再生/一時停止切り替え
      if (video.paused) {
        // 動画再生開始
        video.play().catch(error => {
          console.error('Video play failed:', error);
        });
      } else {
        // 動画一時停止
        console.log('Pausing video...');
        video.pause();
      }
    }
    
    // ブラウザのデフォルト動作を防止
    if (e.preventDefault) {
      e.preventDefault();
    }
  }
  





  /**
   * 全オーディオ・ビデオの停止処理
   * 
   * 機能:
   * - 再生中の全ての音楽を一時停止
   * - 再生中の全ての動画を一時停止
   * - 季節切り替え時の重複再生防止
   */
  stopAllAudio() {
    // 全ての音楽要素を停止
    this.audioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
      }
    });
    
    // 全ての動画要素も停止
    this.videoElements.forEach(video => {
      if (!video.paused) {
        video.pause();
      }
    });
  }
  
  /**
   * 外部アクセス用のパブリックメソッド
   */
  
  /**
   * 現在の季節を取得
   * 
   * @returns {string} 現在の季節識別子
   */
  getCurrentSeason() {
    return this.currentSeason;
  }
  
  /**
   * 利用可能な季節一覧を取得
   * 
   * 機能:
   * - 梅雨シーズンはギャラリーのナビゲーションには表示しない
   * - UI生成で使用される季節リスト
   * 
   * @returns {string[]} 利用可能な季節の配列
   */
  getAvailableSeasons() {
    // 梅雨シーズンはギャラリーのナビゲーションには表示しない
    return ['spring', 'summer', 'autumn', 'winter'];
  }
}

// 外部使用用のグローバル関数（例：フッターリンク）
/**
 * グローバル季節切り替え関数
 * 
 * 機能:
 * - 外部からの季節切り替えを可能にする
 * - フッターリンクやその他の要素から利用
 * 
 * @param {string} season - 切り替え先の季節
 */
function switchSeason(season) {
  if (window.seasonsGallery && typeof window.seasonsGallery.switchToSeason === 'function') {
    window.seasonsGallery.switchToSeason(season);
  }
}
window.switchSeason = switchSeason;

/**
 * 季節セレクタの初期化
 * 
 * 機能:
 * - season-selectorコンテナ内のボタンイベント設定
 * - アクティブ状態の更新メソッド追加
 * - アクセシビリティ対応（aria-checked）
 */
function initSeasonSelector() {
  const selector = document.getElementById('season-selector');
  if (!selector)
    return;
    
  const buttons = selector.querySelectorAll('button[data-season]');
  
  // アクティブ状態更新メソッドを追加
  selector.updateActive = (season) => {
    buttons.forEach(btn => {
      const isActive = btn.getAttribute('data-season') === season;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive); // アクセシビリティ対応
    });
  };
  
  // デフォルト季節（梅雨）で初期状態を設定
  if (window.seasonsGallery && typeof window.seasonsGallery.getCurrentSeason === 'function')
    selector.updateActive(window.seasonsGallery.getCurrentSeason());
    
  // クリックイベントの設定
  selector.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-season]');
    if (!button)
      return;
    const season = button.getAttribute('data-season');
    if (typeof window.switchSeason === 'function')
      window.switchSeason(season);
  });
}
window.initSeasonSelector = initSeasonSelector;

/**
 * モジュールシステム対応のエクスポート処理
 * 
 * 機能:
 * - CommonJS環境でのモジュールエクスポート
 * - ブラウザ環境でのグローバル変数設定
 */
// CommonJS環境でのエクスポート設定
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SeasonsGallery;
}
// ブラウザ環境でのグローバル変数設定
window.SeasonsGallery = SeasonsGallery;
/**
 * Main JavaScript Module
 * Coordinates all site functionality and provides utility functions
 */

/**
 * ShukaAppクラス - メインアプリケーション制御
 * 
 * 役割:
 * - アプリケーション全体の初期化とライフサイクル管理
 * - 交差監視によるアニメーション制御
 * - フォーム処理とバリデーション
 * - パフォーマンス最適化とアクセシビリティ強化
 * - エラーハンドリングと監視
 */
class ShukaApp {
  /**
   * コンストラクタ - アプリケーションの基本設定
   */
  constructor() {
    this.isLoaded = false; // アプリケーション読み込み完了状態
    this.observers = new Map(); // 監視オブザーバーの管理マップ
    this.init();
  }
  
  /**
   * アプリケーション初期化処理
   * - DOMの読み込み状況に応じて適切なタイミングでsetup実行
   */
  init() {
    // DOM読み込み完了を待機
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }
  
  /**
   * DOM読み込み完了時の処理
   * - 各種機能モジュールの初期化を順次実行
   * - アプリケーション準備完了の通知
   */
  onDOMReady() {
    this.setupIntersectionObserver(); // 交差監視による要素アニメーション
    this.setupPerformanceOptimizations(); // パフォーマンス最適化
    this.setupAccessibilityEnhancements(); // アクセシビリティ機能強化
    this.setupErrorHandling(); // エラーハンドリング設定
    
    // メインコンテンツへの自動スクロール
    const main = document.getElementById('main-content');
    if (main) {
      main.scrollIntoView({ behavior: 'auto' });
    }
    this.isLoaded = true; // アプリケーション読み込み完了フラグ
    
    // 他のモジュール用にアプリケーション準備完了カスタムイベントを発行
    document.dispatchEvent(new CustomEvent('shukaAppReady'));
  }
  
  /**
   * 交差監視オブザーバーの設定
   * 
   * 機能:
   * - 要素がビューポートに入った時のアニメーション実行
   * - パフォーマンスを考慮した閾値設定
   * - 複数要素の効率的な監視管理
   */
  setupIntersectionObserver() {
    // 交差監視のオプション設定
    const observerOptions = {
      threshold: 0.1, // 要素の10%が見えたらアニメーション開始
      rootMargin: '0px 0px -50px 0px' // 下側50px余裕を持たせる
    };
    
    // アニメーション用オブザーバーの作成
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target); // ビューポート内の要素をアニメーション
        }
      });
    }, observerOptions);
    
    // アニメーション対象要素の監視開始
    const animatedElements = document.querySelectorAll('.feature, .track, .about-visual, .contact-form');
    animatedElements.forEach(el => {
      animationObserver.observe(el);
    });
    
    // オブザーバーをマップに保存（後でクリーンアップ可能）
    this.observers.set('animation', animationObserver);
  }
  
  /**
   * 要素のアニメーション実行処理
   * 
   * 機能:
   * - ユーザーのアニメーション設定を尊重（reduced-motion対応）
   * - 要素タイプに応じた適切なアニメーション選択
   * - アニメーション完了後のクリーンアップ
   * 
   * @param {HTMLElement} element - アニメーション対象要素
   */
  animateElement(element) {
    // ユーザーがアニメーション無効化を設定している場合は簡素化
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }
    
    // 要素タイプに基づいてアニメーションクラスを追加
    if (element.classList.contains('feature')) {
      element.classList.add('animate-slide-in-left'); // 特徴カードは左からスライド
    } else if (element.classList.contains('about-visual')) {
      element.classList.add('animate-slide-in-right'); // アバウト画像は右からスライド
    } else {
      element.classList.add('animate-fade-in'); // その他の要素はフェードイン
    }
    
    // アニメーション完了後にクラスを削除（再アニメーション可能にする）
    setTimeout(() => {
      element.classList.remove('animate-slide-in-left', 'animate-slide-in-right', 'animate-fade-in');
    }, 600); // 600ms後にクリーンアップ
  }
  
  
  /**
   * パフォーマンス最適化機能の初期化
   * 
   * 機能:
   * - IntersectionObserverを使用した画像の遅延読み込み
   * - ビューポート内に入った画像の自動読み込み
   * - ユーザーインタラクション時の重要リソースプリロード
   * - タッチデバイス対応のリソース先読み
   */
  setupPerformanceOptimizations() {
    // 遅延画像読み込みの設定
    if ('IntersectionObserver' in window) {
      // 画像が表示領域に入った際の処理を定義
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              // data-srcからsrcに画像URLを移動して読み込み開始
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img); // 監視終了
            }
          }
        });
      });
      
      // data-src属性を持つ全画像を監視対象に追加
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
      
      // 後でクリーンアップできるようにオブザーバーを保存
      this.observers.set('images', imageObserver);
    }
    
    // ユーザーインタラクション時の重要リソースプリロード
    document.addEventListener('mouseover', this.preloadOnHover, { once: true });
    // タッチデバイス対応：適切なthisコンテキストでのプリロード実行
    document.addEventListener('touchstart', () => this.preloadOnTouch(), { once: true });
  }
  
  /**
   * マウスホバー時の画像プリロード
   * 
   * 機能:
   * - ユーザーのホバー操作を契機とした季節画像の先読み
   * - prefetchリンクによる効率的なリソース読み込み
   * - 季節切り替え時の表示速度向上
   */
  preloadOnHover() {
    // プリロード対象の季節画像リスト
    const seasonImages = [
      './img/秀歌-春.webp',
      './img/秀歌-夏.webp',
      './img/秀歌-秋.webp',
      './img/秀歌-冬.webp'
    ];
    
    // 各季節画像をprefetchで先読み
    seasonImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = src;
      document.head.appendChild(link);
    });
  }
  
  /**
   * タッチ操作時の画像プリロード
   * 
   * 機能:
   * - タッチデバイス向けのリソース先読み処理
   * - ホバー処理と同様の画像プリロード実行
   */
  preloadOnTouch() {
    // タッチデバイス向けもホバー時と同様の処理を実行
    this.preloadOnHover();
  }
  
  /**
   * アクセシビリティ機能の拡張設定
   * 
   * 機能:
   * - スキップリンクの設定と動作制御
   * - モーダル・オーバーレイのフォーカス管理
   * - タブキー操作時のフォーカストラップ処理
   * - ページ変更時のスクリーンリーダー向けアナウンス
   */
  setupAccessibilityEnhancements() {
    // スキップリンクは未採用のため、関連バインドは削除済み
    
    // スクリーンリーダー向けのページ変更アナウンス設定
    this.setupRouteAnnouncements();
  }
  
  
  
  /**
   * ルート変更時のスクリーンリーダー向けアナウンス設定
   * 
   * 機能:
   * - ハッシュ変更時の自動セクション検出
   * - 見出し要素からのコンテンツ名取得
   * - スクリーンリーダー向けの適切なナビゲーション通知
   */
  setupRouteAnnouncements() {
    // ハッシュ変更時のナビゲーションアナウンス
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1); // '#'を除去
      if (hash) {
        const section = document.getElementById(hash);
        if (section) {
          // セクション内の見出し要素を検索
          const heading = section.querySelector('h1, h2, h3');
          if (heading) {
            // 見出しテキストを使用してセクション移動をアナウンス
            this.announceToScreenReader(`${heading.textContent}セクションに移動しました`);
          }
        }
      }
    });
  }
  
  /**
   * スクリーンリーダー向けメッセージアナウンス
   * 
   * 機能:
   * - 視覚的に隠されたアナウンサー要素の動的生成
   * - スクリーンリーダーでの自動メッセージ読み上げ
   * 
   * @param {string} message - アナウンスするメッセージ
   */
  announceToScreenReader(message) {
    // 既存のアナウンサー要素を検索
    let announcer = document.getElementById('screen-reader-announcer');
    if (!announcer) {
      // アナウンサー要素が存在しない場合は新規作成
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.className = 'sr-only'; // 視覚的に隠蔽（既存ユーティリティクラス）
      document.body.appendChild(announcer);
    }
    
    // メッセージを設定してスクリーンリーダーに通知
    announcer.textContent = message;
  }
  
  /**
   * グローバルエラーハンドリングの設定
   * 
   * 機能:
   * - 未処理のJavaScriptエラーの捕捉
   * - プロミス拒否の未処理エラーの監視
   * - エラートラッキングサービスへの送信準備
   * - アプリケーション全体の安定性向上
   */
  setupErrorHandling() {
    // グローバルJavaScriptエラーハンドラー
    window.addEventListener('error', () => {
      // エラートラッキングサービスに送信可能
      // 本格運用時にはログ収集システムとの連携を追加
    });
    
    // 未処理のプロミス拒否エラーハンドラー
    window.addEventListener('unhandledrejection', () => {
      // エラートラッキングサービスに送信可能
      // 非同期処理のエラーを適切に監視・報告
    });
  }
  
  /**
   * パブリックユーティリティメソッド群
   */
  
  /**
   * デバウンス関数 - 連続実行の制御
   * 
   * 機能:
   * - 指定時間内の連続呼び出しを無視し、最後の呼び出しのみ実行
   * - スクロール・リサイズイベントでのパフォーマンス最適化
   * - タイマーベースの遅延実行制御
   * 
   * @param {Function} func - 実行対象の関数
   * @param {number} wait - 待機時間（ミリ秒）
   * @returns {Function} デバウンス処理が適用された関数
   */
  /**
   * デバウンス処理の実装詳細
   * 
   * 動作原理:
   * 1. 新しい呼び出しがあるたびに前のタイマーをキャンセル
   * 2. 新しいタイマーを設定し、指定時間後に関数を実行
   * 3. 連続呼び出しが停止して初めて実行される
   * 
   * 使用例: ユーザー入力の完了待ち、リサイズイベントの遅延実行
   */
  debounce(func, wait) {
    let timeout;  // タイマーIDを保持するクロージャ変数
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);    // タイマーをクリア（必須ではないが安全のため）
        func(...args);             // 最終的な引数で元関数を実行
      };
      clearTimeout(timeout);       // 既存タイマーをキャンセル（連続呼び出しでのリセット）
      timeout = setTimeout(later, wait); // waitミリ秒後に実行する新タイマーを設定
    };
  }
  
  /**
   * スロットル関数 - 実行頻度の制限
   * 
   * 機能:
   * - 指定時間間隔での関数実行を保証
   * - 高頻度イベント（スクロール・マウス移動）でのパフォーマンス制御
   * - 一定間隔での確実な処理実行
   * 
   * @param {Function} func - 実行対象の関数
   * @param {number} limit - 実行間隔（ミリ秒）
   * @returns {Function} スロットル処理が適用された関数
   */
  /**
   * スロットル処理の実装詳細
   * 
   * 動作原理:
   * 1. 初回呼び出しは即座に実行
   * 2. 実行後はinThrottleフラグをtrueに設定
   * 3. フラグがtrueの間は後続の呼び出しを無視
   * 4. limitミリ秒後にフラグをリセットして再び実行可能に
   * 
   * 使用例: スクロールイベント、マウス移動の頻度制限
   */
  throttle(func, limit) {
    let inThrottle;  // スロットル中かどうかを表すフラグ
    return function() {
      const args = arguments;        // 引数を保持
      const context = this;          // thisコンテキストを保持
      if (!inThrottle) {             // スロットル中でない場合のみ実行
        func.apply(context, args);   // 元のコンテキストと引数で関数を実行
        inThrottle = true;           // スロットル状態に移行
        // limitミリ秒後にスロットルを解除し、次回実行を可能に
        setTimeout(() => inThrottle = false, limit);
      }
      // inThrottleがtrueの場合は何もしない（呼び出しを無視）
    };
  }
  
  /**
   * クリーンアップメソッド - リソースの適切な解放
   * 
   * 機能:
   * - 全ての登録済みObserverの切断
   * - メモリリークの防止
   * - アプリケーション終了時の適切なリソース管理
   */
  destroy() {
    // 全てのObserverを切断してメモリリークを防止
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear(); // 観察者Mapをクリア
  }
}

/**
 * メインアプリケーションの初期化
 * 
 * 機能:
 * - ShukaAppクラスのインスタンス生成
 * - グローバルアクセス用にウィンドウオブジェクトに登録
 * - アプリケーションのメイン機能を自動起動
 */
window.shukaApp = new ShukaApp();

/**
 * フォーム状態とアニメーション用のCSS追加
 * 
 * 機能:
 * - フォームエラー状態のスタイリング
 * - 送信成功メッセージのデザイン
 * - トラック再生状態の表示スタイル
 * - 動的に生成されるUI要素のスタイリング統一
 */
const additionalCSS = `
  /* フォームエラーメッセージのスタイル */
  .field-error {
    color: var(--accent);
    font-size: var(--text-sm);
    margin-top: var(--space-1);
  }
  
  /* エラー状態の入力フィールドスタイル */
  .form-input.error,
  .form-textarea.error {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
  
  /* 送信成功メッセージのスタイル */
  .form-success {
    background: var(--spring);
    color: white;
    padding: var(--space-8);
    border-radius: var(--radius-xl);
    text-align: center;
    animation: fadeIn 0.5s ease-out;
  }
  
  /* 成功メッセージコンテンツのレイアウト */
  .success-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }
  
  /* 成功アイコンのスタイル */
  .success-icon {
    font-size: var(--text-4xl);
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 再生中トラックのハイライト表示 */
  .track.playing {
    background: var(--primary-light);
    color: white;
  }
`;

/**
 * 追加CSSのインジェクション
 * 
 * 機能:
 * - 動的に生成されるフォーム状態スタイルをDOMに追加
 * - 実行時にスタイルシートを文書のheadに注入
 */
// 追加CSSのインジェクション
const additionalStyle = document.createElement('style');
additionalStyle.textContent = additionalCSS;
/**
 * デフォルト季節設定 - 梅雨
 * 
 * 機能:
 * - サイトアクセス時のデフォルト季節を梅雨に設定
 * - ボディ要素にdata-season属性を設定
 */
// 季節カラーモジュール開始
(function setDefaultSeason(){
  // デフォルトは梅雨（tsuyu）
  document.body.dataset.season = "tsuyu";
})();
// 季節カラーモジュール終了

/**
 * 水面波紋エフェクトモジュール
 * 
 * 機能:
 * - マウス操作に連動した美しい波紋エフェクト
 * - 和風の静寂感を表現する控えめな動作
 * - パフォーマンス配慮とアクセシビリティ対応
 */
class WaterRippleEffect {
  /**
   * コンストラクタ - 波紋エフェクトの初期化
   */
  constructor() {
    this.container = document.getElementById('ripple-container'); // 波紋表示用コンテナ
    this.isActive = true; // エフェクトの有効状態
    this.lastRippleTime = 0; // 最後の波紋生成時刻
    this.throttleDelay = 400; // 波紋生成間隔（ミリ秒）- 和風の静寂感を演出
    this.maxRipples = 12; // 同時表示可能な最大波紋数
    this.ripples = []; // 波紋オブジェクトの配列
    this.petalLimit = 100; // 最大アクティブ花びら数
    this.frameTime = 0; // フレーム時間管理
    this.performanceOptimized = false; // パフォーマンス最適化フラグ
    
    this.init();
  }
  
  /**
   * 初期化処理
   * - コンテナの存在確認
   * - ユーザー設定のチェック
   * - イベント設定
   */
  init() {
    if (!this.container) {
      return; // コンテナが存在しない場合は終了
    }
    
    this.checkUserPreferences();
    this.bindEvents();
  }
  
  /**
   * ユーザー設定の確認
   * - アニメーション削減設定の尊重
   * - 小画面での無効化
   * - 低スペック端末でのパフォーマンス調整
   */
  checkUserPreferences() {
    // ユーザーのアニメーション削減設定を尊重
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.isActive = false;
      this.container.style.display = 'none';
      return;
    }

    // 小画面（スマートフォン）では波紋を無効化
    const smallScreenQuery = window.matchMedia('(max-width: 768px)');
    if (smallScreenQuery.matches) {
      this.isActive = false;
      this.container.style.display = 'none';
      return;
    }
    
    // 低スペック端末の判定 - 静寂感を保ちつつパフォーマンスを最適化
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      this.throttleDelay = 600; // より低い頻度で生成
      this.maxRipples = 8; // 最大波紋数を削減
    }
  }
  
  /**
   * イベントリスナーの設定
   * 
   * 機能:
   * - マウス・タッチ操作に対する波紋生成イベント
   * - ユーザー設定変更の監視
   * - デバイス特性変更への動的対応
   */
  bindEvents() {
    if (!this.isActive) return;
    
    // マウス移動イベント: カーソルの軌跡に沿った波紋生成（スロットル処理付き）
    // スロットルで程よく制限し、パフォーマンスと静寂感をバランスよく保つ
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // クリックイベント: ユーザーアクション時の即座波紋生成
    // マウス移動と異なりスロットルなしで直ちに反応、ユーザーフィードバックを重視
    document.addEventListener('click', (e) => this.handleClick(e));
    
    // タッチイベント: スマートフォン・タブレットでの波紋生成
    // passive: trueでスクロールパフォーマンスを最適化（preventDefault()を呼ばないことを保証）
    document.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: true });
    
    // ユーザーのアニメーション設定変更を監視
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        this.disable(); // アニメーション削減設定時は無効化
      } else {
        this.enable(); // 設定解除時は有効化
      }
    });

    // ビューポートサイズ変更による自動調整
    const smallScreenQuery = window.matchMedia('(max-width: 768px)');
    smallScreenQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.disable(); // 小画面時は無効化
      } else {
        this.enable(); // 大画面復帰時は有効化
      }
    });
    
    // 定期的な古い波紋のクリーンアップ（2秒間隔）
    setInterval(() => this.cleanupRipples(), 2000);
    
    // パフォーマンスモニタリングと動的調整
    this.monitorPerformance();
  }
  
  /**
   * マウス移動イベントハンドラー - 静謐な水面の波紋エフェクト
   * 鯉の泳ぐ日本庭園の池をイメージした優雅な波紋を生成
   * @param {MouseEvent} e - マウスイベントオブジェクト
   * @description 和風の美意識に基づいた繊細な波紋表現で、過度な重複を避けながら
   *              自然な水面の動きを再現。パフォーマンスを考慮したスロットリング制御
   */
  handleMouseMove(e) {
    if (!this.isActive || !this.shouldCreateRipple()) return;
    
    // 静謐な鯉の池の波紋を最小限の重複で生成
    this.createTranquilRipples(e.clientX, e.clientY);
    this.lastRippleTime = Date.now();
  }
  
  /**
   * クリックイベントハンドラー - 豪華な和風クリックエフェクト
   * クリック位置に特別な日本風の豪華な波紋エフェクトを生成
   * @param {MouseEvent} e - マウスクリックイベント
   * @description ユーザーのクリック操作に対して、金箔を散らしたような
   *              贅沢で印象的な波紋エフェクトで応答。和の美学を体現
   */
  handleClick(e) {
    if (!this.isActive) return;

    const { clientX: x, clientY: y } = e;
    // 豪華な日本風クリックエフェクトを生成
    this.createLuxuriousClickEffect(x, y);
  }
  
  /**
   * タッチイベントハンドラー - モバイル端末での波紋生成
   * タッチ操作に応じて中程度の波紋エフェクトを作成
   * @param {TouchEvent} e - タッチイベントオブジェクト
   * @description スマートフォンやタブレットでの直感的な操作体験を提供。
   *              指先の動きに自然に反応する和風の水面エフェクト
   */
  handleTouch(e) {
    if (!this.isActive || !e.touches[0]) return;
    
    const touch = e.touches[0];
    this.createRipple(touch.clientX, touch.clientY, 'medium');
  }
  
  /**
   * 波紋生成の可否判定 - パフォーマンス最適化のスロットリング制御
   * 前回の波紋生成から十分な時間が経過しているかを確認
   * @returns {boolean} 波紋を生成すべきかどうかの判定結果
   * @description 穏やかで静謐なタイミング制御により、過度な波紋の重複を防ぎ
   *              自然な水面の動きを演出。CPUリソースの効率的な利用
   */
  shouldCreateRipple() {
    const now = Date.now();
    return (now - this.lastRippleTime) > this.throttleDelay; // 穏やかで静謐なタイミング制御
  }
  
  /**
   * 波紋エレメントの生成 - 和風の水面エフェクトのコア機能
   * 指定された位置、サイズ、色で美しい波紋を作成し、DOMに追加
   * @param {number} x - 波紋の中心X座標
   * @param {number} y - 波紋の中心Y座標  
   * @param {string} size - 波紋のサイズ (small/medium/large/huge)
   * @param {string} color - 波紋の色テーマ (default/rainbow/gold)
   * @description 日本庭園の池に石を投げ入れた時の美しい波紋を再現。
   *              サイズに応じた自然な拡散パターンと、金箔や虹色などの
   *              豪華な視覚効果オプション。メモリ効率を考慮した自動削除機能付き
   */
  createRipple(x, y, size = 'medium', color = 'default') {
    if (!this.isActive || this.ripples.length >= this.maxRipples) return;
    
    const ripple = document.createElement('div');
    ripple.className = `ripple ${size} ${color}`;
    
    // タイプに基づく波紋サイズの確率的計算
    // Math.random()で各範囲内のランダム値を生成し、自然なバリエーションを実現
    // 公式: baseSize + Math.random() * variationRange
    const sizeMap = {
      small: Math.random() * 120 + 80,     // 80-200px: 80 + (0-120)の範囲
      medium: Math.random() * 200 + 150,   // 150-350px: 150 + (0-200)の範囲
      large: Math.random() * 300 + 200,    // 200-500px: 200 + (0-300)の範囲
      huge: Math.random() * 400 + 300      // 300-700px: 300 + (0-400)の範囲
    };
    
    const rippleSize = sizeMap[size] || sizeMap.medium;
    
    // 波紋の配置 - 中心座標を基準とした正確な位置決め
    // 円形要素の中心をクリック地点に合わせるため、半径分を減算
    ripple.style.width = `${rippleSize}px`;                    // 波紋の幅
    ripple.style.height = `${rippleSize}px`;                   // 波紋の高さ
    ripple.style.left = `${x - rippleSize / 2}px`;             // X座標: 中心 - 半径
    ripple.style.top = `${y - rippleSize / 2}px`;              // Y座標: 中心 - 半径
    
    // 回転と初期スケールの設定
    // 0°-360°のランダム回転で自然な動きを演出
    // 初期スケール0から開始して後のCSSアニメーションで拡大
    const rotation = Math.random() * 360;                       // 0-360度のランダム回転角
    ripple.style.transform = `scale(0) rotate(${rotation}deg)`;  // 初期状態: 非表示 + 回転設定
    
    // 色彩効果の動的生成 - HSL色空間を利用した鮮やかなグラデーション
    if (color === 'rainbow') {
      // 虹色モード: HSLでランダムな色相と補色を組み合わせたグラデーション
      const hue = Math.random() * 360;                          // 0-360度のランダム色相
      // 中心から外側に向かって: メインカラー → 補色(+60度) → 透明
      ripple.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 70%, 0.8) 0%, hsla(${hue + 60}, 70%, 60%, 0.4) 40%, transparent 80%)`;
    } else if (color === 'gold') {
      // 金色モード: 金色系で統一したグラデーション (富貴な印象)
      // RGB値: (255,215,0)金 → (255,165,0)オレンジ金 → (255,140,0)濃いオレンジ金
      ripple.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.6) 30%, rgba(255, 140, 0, 0.3) 60%, transparent 90%)';
    }
    
    // コンテナへの追加と追跡配列への登録
    this.container.appendChild(ripple);
    this.ripples.push({
      element: ripple,
      createdAt: Date.now()
    });
    
    // アニメーション完了後の自動削除 - メモリリーク防止
    const animationDuration = size === 'huge' ? 3500 : size === 'large' ? 2800 : size === 'small' ? 1200 : 1800;
    setTimeout(() => {
      this.removeRipple(ripple);
    }, animationDuration);
  }
  
  /**
   * 波紋エレメントの削除 - メモリとDOM要素の適切な管理
   * 指定された波紋要素をDOMから削除し、追跡配列からも除去
   * @param {HTMLElement} rippleElement - 削除対象の波紋DOM要素
   * @description パフォーマンス維持のため、不要になった波紋要素を確実に削除。
   *              メモリリークを防ぎ、長時間の利用でも快適な動作を保証
   */
  removeRipple(rippleElement) {
    if (rippleElement && rippleElement.parentNode) {
      rippleElement.parentNode.removeChild(rippleElement);
    }
    
    // 追跡配列からも除去
    this.ripples = this.ripples.filter(ripple => ripple.element !== rippleElement);
  }
  
  /**
   * 波紋のクリーンアップ処理 - 古い波紋の自動削除
   * 一定時間経過した波紋を自動的に検出・削除し、メモリを最適化
   * @description 3秒以上経過した波紋を一括クリーンアップし、パフォーマンスを維持。
   *              長時間のインタラクションでもDOM要素のたまりやメモリリークを防止
   */
  cleanupRipples() {
    const now = Date.now();
    const oldRipples = this.ripples.filter(ripple => {
      return (now - ripple.createdAt) > 3000; // 3秒以上経過した波紋を削除
    });
    
    oldRipples.forEach(ripple => {
      this.removeRipple(ripple.element);
    });
  }

  /**
   * 静謐な鯉の池の波紋生成 - 日本の美意識に基づくエレガントな水面演出
   * マウス移動時に静寂で美しい水面の波紋を作成
   * @param {number} x - 波紋の中心X座標
   * @param {number} y - 波紋の中心Y座標
   * @description 日本庭園の池に石を静かに落とした時の美しい波紋を再現。
   *              墨絵のような繊細な滿ち効果と、穏やかな次第波紋で自然な感情を表現
   */
  createTranquilRipples(x, y) {
    // 主要な穏やかな波紋 - 静水に石を落としたような美しさ
    this.createRipple(x, y, 'small', 'elegant');
    
    // 時折発生する第二波紋 - 墨絵の滿ち効果を再現
    if (Math.random() < 0.12) { // 静寂さを増すため、発生頻度を低めに設定
      setTimeout(() => {
        const offsetX = (Math.random() * 20 - 10); // 繊細さを出すための小さなオフセット
        const offsetY = (Math.random() * 20 - 10);
        this.createRipple(x + offsetX, y + offsetY, 'small', 'subtle');
      }, Math.random() * 500 + 200); // 自然な感覺のための遺延時間
    }
    
    // 非常に稀な大きな波紋 - 水面の深みを表現するバリエーション
    if (Math.random() < 0.05) {
      setTimeout(() => {
        this.createRipple(x, y, 'medium', 'subtle');
      }, Math.random() * 800 + 400);
    }
  }

  /**
   * 禅に着想を得た繊細なクリックエフェクト生成
   * 禅の美学に基づく上品で静寂なクリック演出
   * @param {number} x - エフェクトの中心X座標
   * @param {number} y - エフェクトの中心Y座標
   * @description 墨絵、浮遊する葉、微かな光の滿み、静寂の点を組み合わせた
   *              豪華でありながら静謐な日本の美意識を体現するエフェクト
   */
  createZenClickEffect(x, y) {
    // 墨滴の滿み - 書道の美しさを表現
    this.createInkDrops(x, y, 6);

    // 浮遊する葉 - 清涼な風のような動き
    setTimeout(() => {
      this.createFloatingLeaves(x, y, 4);
    }, 200);

    // 微かな光の滿み - 柔らかな光の演出
    setTimeout(() => {
      this.createSubtleGlow(x, y, 120);
    }, 100);

    // 静寂の点 - 穏やかな余韻の表現
    this.createTranquilDots(x, y, 8);
  }

  /**
   * 墨滴の滿みエフェクト生成 - 書道の美しさをデジタルで再現
   * 中心点から穏やかに拡散する小さな墨滴を作成
   * @param {number} x - 墨滴の中心X座標
   * @param {number} y - 墨滴の中心Y座標
   * @param {number} count - 墨滴の数
   * @description 日本の書道や墨絵の美意識を参考に、穏やかで上品な
   *              墨の滿み効果をアニメーションで表現。控えめなサイズと動き
   */
  createInkDrops(x, y, count) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.className = 'ink-drop';

      // 控えめなサイズ
      const size = Math.random() * 4 + 3; // 3-7px
      drop.style.width = `${size}px`;
      drop.style.height = `${size}px`;
      drop.style.left = `${x - size / 2}px`;
      drop.style.top = `${y - size / 2}px`;

      // 穏やかな拡散
      const angle = (360 / count) * i + (Math.random() * 60 - 30);
      const distance = 30 + Math.random() * 50; // 控えめな距離
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.8 + 1.5).toFixed(2); // 1.5-2.3秒

      drop.style.setProperty('--dx', `${dx}px`);
      drop.style.setProperty('--dy', `${dy}px`);
      drop.style.animationDuration = `${duration}s`;

      this.container.appendChild(drop);
      setTimeout(() => drop.remove(), duration * 1000);
    }
  }

  /**
   * 微かな光の滿みエフェクト生成 - 柔らかな光の演出
   * 中心から緊やかに広がる幻想的な光りを作成
   * @param {number} x - 光の中心X座標
   * @param {number} y - 光の中心Y座標
   * @param {number} size - 光のサイズ
   * @description 表情豊かで神秘的な光の演出で、クリック体験に魅力を追加。
   *              和の美学における「光と影」の繊細な表現をデジタルで再現
   */
  createSubtleGlow(x, y, size) {
    if (!this.container) return;

    const glow = document.createElement('div');
    glow.className = 'subtle-glow';
    glow.style.width = `${size}px`;
    glow.style.height = `${size}px`;
    glow.style.left = `${x - size / 2}px`;
    glow.style.top = `${y - size / 2}px`;

    this.container.appendChild(glow);
    setTimeout(() => glow.remove(), 2000);
  }

  /**
   * Create floating leaves - 浮遊する葉
   */
  createFloatingLeaves(x, y, count) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'floating-leaf';

      // 自然なサイズの葉
      const width = Math.random() * 4 + 2; // 2-6px
      const height = Math.random() * 3 + 2; // 2-5px
      leaf.style.width = `${width}px`;
      leaf.style.height = `${height}px`;
      leaf.style.left = `${x - width / 2}px`;
      leaf.style.top = `${y - height / 2}px`;

      // ゆっくりと舞い散る
      const angle = Math.random() * 360;
      const distance = 40 + Math.random() * 60; // 控えめな距離
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 1.5 + 2).toFixed(2); // 2-3.5秒

      leaf.style.setProperty('--dx', `${dx}px`);
      leaf.style.setProperty('--dy', `${dy}px`);
      leaf.style.animationDuration = `${duration}s`;

      // ランダムなグラデーション角度
      const leafAngle = Math.random() * 360;
      leaf.style.setProperty('--leaf-angle', `${leafAngle}deg`);

      this.container.appendChild(leaf);
      setTimeout(() => leaf.remove(), duration * 1000);
    }
  }

  /**
   * 静寂の点エフェクト生成 - 穏やかな余韻を表現する点の演出
   * 中心から放射状に静かに拡散する小さな点を配置
   * @param {number} x - 点の中心X座標
   * @param {number} y - 点の中心Y座標
   * @param {number} count - 点の数
   * @description 禅の思想における「空」や「無」を表現する繊細な点のアニメーション。
   *              控えめながら印象深い、静謐な美しさを演出する日本の美意識の体現
   */
  createTranquilDots(x, y, count) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'tranquil-dot';
      dot.style.left = `${x - 1}px`;
      dot.style.top = `${y - 1}px`;

      // 静かに放射状に拡散
      const angle = (360 / count) * i;
      const distance = 20 + Math.random() * 40; // 控えめな距離
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.5 + 1).toFixed(2); // 1-1.5秒

      dot.style.setProperty('--dx', `${dx}px`);
      dot.style.setProperty('--dy', `${dy}px`);
      dot.style.animationDuration = `${duration}s`;

      this.container.appendChild(dot);
      setTimeout(() => dot.remove(), duration * 1000);
    }
  }

  /**
   * 桜の花びらバーストエフェクト生成 - 豪華なクリック演出
   * 中心から桜の花びらが華やかに舞い散るエフェクトを作成
   * @param {number} x - 花びらの中心X座標
   * @param {number} y - 花びらの中心Y座標
   * @param {number} count - 花びらの数（デフォルト: 8）
   * @description 日本の春の象徴である桜の花びらが舞い散る美しい瞬間を表現。
   *              ユーザーのクリック操作に対して、贅沢で印象的な視覚体験を提供
   */
  createSakuraBurst(x, y, count = 8) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'sakura-petal';

      const size = Math.random() * 12 + 8;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.left = `${x - size / 2}px`;
      petal.style.top = `${y - size / 2}px`;

      const angle = Math.random() * 360;
      const distance = 80 + Math.random() * 80;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 1 + 2).toFixed(2);

      petal.style.setProperty('--dx', `${dx}px`);
      petal.style.setProperty('--dy', `${dy}px`);
      petal.style.animationDuration = `${duration}s`;

      this.container.appendChild(petal);
      setTimeout(() => petal.remove(), duration * 1000);
    }
  }

  /**
   * 壮麗な日本風クリックエフェクト生成 - 複数のエフェクトを組み合わせた豪華な演出
   * 金色の巨大波紋、桜の花びら、歌舞伎風の渦、浮遊要素などを総合した華やかなエフェクト
   * @param {number} x - エフェクトの中心X座標
   * @param {number} y - エフェクトの中心Y座標
   * @description ユーザーのクリック操作に対して最も豪華で印象的な体験を提供。
   *              日本の伝統的な美意識を現代のデジタル表現で昇華させた、記憶に残る視覚演出
   */
  createLuxuriousClickEffect(x, y) {
    this.createRipple(x, y, 'huge', 'gold');
    this.createSakuraBurst(x, y, 14);
    this.createKabukiSwirls(x, y, 2);
    this.createFloatingElements(x, y, 12);
    this.createSubtleGlow(x, y, 200);
    this.createClickFlash(x, y);
  }

  /**
   * 歌舞伎風の渦エフェクト生成 - 伝統芸能の動的美しさをデジタル表現
   * 歌舞伎の舞台演出に着想を得た螺旋状の渦エフェクト
   * @param {number} x - 渦の中心X座標
   * @param {number} y - 渦の中心Y座標
   * @param {number} count - 渦の数（デフォルト: 2）
   * @description 日本の伝統芸能である歌舞伎の力強く美しい動きを参考にした
   *              螺旋状の渦エフェクトで、クリック体験に文化的な深みを追加
   */
  createKabukiSwirls(x, y, count = 2) {
    if (!this.container) return;
    for (let i = 0; i < count; i++) {
      const swirl = document.createElement('div');
      swirl.className = 'kabuki-swirl';
      const size = 40 + Math.random() * 20;
      swirl.style.width = `${size}px`;
      swirl.style.height = `${size}px`;
      swirl.style.left = `${x - size / 2}px`;
      swirl.style.top = `${y - size / 2}px`;
      swirl.style.animationDuration = `${(Math.random() * 0.4 + 0.8).toFixed(2)}s`;
      this.container.appendChild(swirl);
      setTimeout(() => swirl.remove(), 1000);
    }
  }

  /**
   * Create intense gold foil sparkle effect - キラン！金箔の煌めき演出
   */
  createGoldFoilEffect(x, y) {
    // メイン中央スパークル - より大きく強烈に
    this.createGoldSparkle(x, y, 60);
    
    // 瞬間爆発エフェクト
    this.createGoldBurst(x, y, 20);
    
    // 金箔粒子の舞い散り - より多く
    this.createGoldParticles(x, y, 18);
    
    // 金箔のかけら
    setTimeout(() => {
      this.createGoldFlakes(x, y, 15);
    }, 50);
    
    // 背景シマー - より強烈に
    setTimeout(() => {
      this.createGoldShimmer(x, y, 120);
    }, 80);
    
    // セカンドウェーブ
    setTimeout(() => {
      this.createGoldSparkle(x, y, 35);
      this.createGoldParticles(x, y, 10);
    }, 150);
    
    // サードウェーブ - 余韻
    setTimeout(() => {
      this.createGoldFlakes(x, y, 8);
    }, 300);
  }

  /**
   * Create central gold sparkle - メイン金箔煌めき
   */
  createGoldSparkle(x, y, size) {
    if (!this.container) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'gold-sparkle';
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${x - size / 2}px`;
    sparkle.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }

  /**
   * Create floating gold particles - 金箔粒子 - 強化版
   */
  createGoldParticles(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'gold-particle';
      
      // より大きな粒子でキラキラ感アップ
      const size = Math.random() * 6 + 4; // 4-10px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x - size / 2}px`;
      particle.style.top = `${y - size / 2}px`;
      
      // より広範囲に散る
      const angle = (360 / count) * i + (Math.random() * 90 - 45);
      const distance = 80 + Math.random() * 120; // より遠くまで飛ぶ
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.6 + 1.2).toFixed(2); // 1.2-1.8秒
      
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.animationDuration = `${duration}s`;
      
      // ランダムなグラデーション角度
      const gradientAngle = Math.random() * 360;
      particle.style.setProperty('--particle-angle', `${gradientAngle}deg`);
      
      this.container.appendChild(particle);
      setTimeout(() => particle.remove(), duration * 1000);
    }
  }

  /**
   * Create gold shimmer background - 金箔シマー背景 - 強化版
   */
  createGoldShimmer(x, y, size) {
    if (!this.container) return;
    
    const shimmer = document.createElement('div');
    shimmer.className = 'gold-shimmer';
    shimmer.style.width = `${size}px`;
    shimmer.style.height = `${size}px`;
    shimmer.style.left = `${x - size / 2}px`;
    shimmer.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(shimmer);
    setTimeout(() => shimmer.remove(), 1000);
  }

  /**
   * Create gold flakes - 金箔のかけら
   */
  createGoldFlakes(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const flake = document.createElement('div');
      flake.className = 'gold-flake';
      
      // 不規則なサイズの金箔
      const width = Math.random() * 8 + 3; // 3-11px
      const height = Math.random() * 6 + 2; // 2-8px
      flake.style.width = `${width}px`;
      flake.style.height = `${height}px`;
      flake.style.left = `${x - width / 2}px`;
      flake.style.top = `${y - height / 2}px`;
      
      // ゆっくりと舞い散る
      const angle = Math.random() * 360;
      const distance = 60 + Math.random() * 100;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 1 + 1.5).toFixed(2); // 1.5-2.5秒
      
      flake.style.setProperty('--dx', `${dx}px`);
      flake.style.setProperty('--dy', `${dy}px`);
      flake.style.animationDuration = `${duration}s`;
      
      // ランダムなグラデーション角度
      const flakeAngle = Math.random() * 360;
      flake.style.setProperty('--flake-angle', `${flakeAngle}deg`);
      
      this.container.appendChild(flake);
      setTimeout(() => flake.remove(), duration * 1000);
    }
  }

  /**
   * Create gold burst explosion - 金箔爆発エフェクト
   */
  createGoldBurst(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const burst = document.createElement('div');
      burst.className = 'gold-burst';
      burst.style.left = `${x - 2}px`;
      burst.style.top = `${y - 2}px`;
      
      // 放射状に爆発
      const angle = (360 / count) * i;
      const distance = 40 + Math.random() * 60;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.3 + 0.4).toFixed(2); // 0.4-0.7秒
      
      burst.style.setProperty('--dx', `${dx}px`);
      burst.style.setProperty('--dy', `${dy}px`);
      burst.style.animationDuration = `${duration}s`;
      
      this.container.appendChild(burst);
      setTimeout(() => burst.remove(), duration * 1000);
    }
  }

  /**
   * Create floating elements like cherry blossom petals on water
   */
  createFloatingElements(x, y, count = 6) {
    if (!this.container) return;
    const activeParticles = this.container.querySelectorAll('.refined-particle').length;
    if (activeParticles >= 15) return; // 静寂感のための低めの上限

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'refined-particle';
      const size = Math.random() * 3 + 2; // 2-5px - very small and delicate
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x - size / 2}px`;
      particle.style.top = `${y - size / 2}px`;

      // より有機的で、整理されすぎない拡散パターン
      const angle = Math.random() * 360; // 完全にランダムな方向
      const distance = 60 + Math.random() * 60; // より優しい拡散
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const dur = (Math.random() * 1.2 + 2).toFixed(2); // 2-3.2s - very slow and graceful
      
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.animationDuration = `${dur}s`;

      // 自然らしさのための微細な色彩変化を追加
      const opacity = 0.3 + Math.random() * 0.3; // 0.3-0.6 opacity
      particle.style.background = `radial-gradient(
        circle,
        rgba(75, 85, 99, ${opacity}) 0%,
        rgba(107, 114, 128, ${opacity * 0.6}) 50%,
        transparent 100%
      )`;

      this.container.appendChild(particle);
      setTimeout(() => particle.remove(), dur * 1000);
    }
  }

  /**
   * Creates a brief radial flash at click location
   */
  createClickFlash(x, y){
    if(!this.container) return;
    const flash=document.createElement('div');
    flash.className='click-flash';
    const size=20;
    flash.style.width=`${size}px`;
    flash.style.height=`${size}px`;
    flash.style.left=`${x-size/2}px`;
    flash.style.top=`${y-size/2}px`;
    this.container.appendChild(flash);
    setTimeout(()=>flash.remove(),600);
  }

  enable() {
    this.isActive = true;
    if (this.container) {
      this.container.style.display = 'block';
    }
  }
  
  disable() {
    this.isActive = false;
    if (this.container) {
      this.container.style.display = 'none';
    }
    
    // 既存の全ての波紋をクリア
    this.ripples.forEach(ripple => {
      this.removeRipple(ripple.element);
    });
  }
  
  // 外部制御用のパブリックメソッド
  toggle() {
    if (this.isActive) {
      this.disable();
    } else {
      this.enable();
    }
  }
  
  createCustomRipple(x, y, color, size = 200) {
    if (!this.isActive) return;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.background = `radial-gradient(circle, ${color}40 0%, ${color}20 20%, ${color}10 40%, transparent 80%)`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(ripple);
    
    setTimeout(() => {
      this.removeRipple(ripple);
    }, 1500);
  }
  
  /**
   * Monitor performance and dynamically optimize for 60fps
   */
  monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkPerformance = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) { // Check every second
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // FPSが50を下回った場合は最適化を実行
        if (fps < 50 && !this.performanceOptimized) {
          this.optimizeForPerformance();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkPerformance);
    };
    
    requestAnimationFrame(checkPerformance);
  }
  
  /**
   * Optimize settings for better performance
   */
  optimizeForPerformance() {
    this.performanceOptimized = true;
    this.throttleDelay = Math.max(this.throttleDelay * 1.5, 600); // Slower ripples
    this.maxRipples = Math.max(this.maxRipples - 3, 6); // Fewer ripples
    
    // 既存の波紋数を削減
    while (this.ripples.length > this.maxRipples) {
      const oldestRipple = this.ripples.shift();
      this.removeRipple(oldestRipple.element);
    }
  }
}

// DOM読み込み完了時に波紋エフェクトを初期化
let waterRipples;
document.addEventListener('DOMContentLoaded', () => {
  waterRipples = new WaterRippleEffect();
  window.waterRipples = waterRipples; // Make globally accessible
});

/**
 * 水面波紋エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 外部から水面波紋エフェクトを制御可能
 * - カスタム波紋の任意の場所での生成
 * - UIインタラクションやユーザー設定からのエフェクト制御
 */

/**
 * 水面波紋エフェクトのオン/オフを切り替え
 */
window.toggleRipples = function() {
  if (window.waterRipples) {
    window.waterRipples.toggle();
  }
};

/**
 * 指定した位置でカスタム波紋を生成
 * 
 * @param {number} x - 波紋のX座標
 * @param {number} y - 波紋のY座標
 * @param {string} color - 波紋の色（CSSカラー形式）
 * @param {number} size - 波紋のサイズ（ピクセル）
 */
window.createCustomRipple = function(x, y, color, size) {
  if (window.waterRipples) {
    window.waterRipples.createCustomRipple(x, y, color, size);
  }
};


/**
 * DOM読み込み完了時のアプリケーション初期化
 * 
 * 処理順序:
 * 1. ページ状態の設定（トランジション有効化）
 * 2. アクセシビリティ機能の初期化
 * 3. リソースプリフェッチの開始
 * 4. ナビゲーション・UI要素の初期化
 * 5. 動的コンテンツの生成
 * 6. 季節ギャラリー機能の初期化
 * 
 * 注意:
 * - 処理順序が重要：DOM生成 → クラス初期化 → イベントバインド
 * - 動的生成された要素に対するイベントの再設定が必須
 */
document.addEventListener('DOMContentLoaded', () => {
  // ページ読み込み完了状態をマーク（CSSトランジションを有効化）
  document.body.classList.add('loaded');
  
  // アクセシビリティ機能の初期化（スキップリンク、フォーカス管理など）
  initAccessibilityFeatures();
  

  // スクロールボタンイベントハンドラーの初期化
  initScrollButtons();

  // モバイルナビゲーションシステムの初期化
  if (typeof Navigation !== 'undefined') {
    window.navigationInstance = new Navigation();
  }
  
  // 動的コンテンツの生成（必ずDOM生成が先）
  generateSocialLinks(); // SNSリンク一覧の動的生成
  generateSeasonGallery(); // 季節別ギャラリーのHTML生成
  
  // 画像読み込みエラーのハンドリング設定
  setupImageErrorHandling();

  // DOM要素生成完了後に季節ギャラリークラスを初期化
  window.seasonsGallery = new SeasonsGallery();
  if (typeof initSeasonSelector === 'function')
    initSeasonSelector(); // 季節セレクターコンポーネントの初期化
  
  // 動的生成された要素に対するイベントの再バインド
  if (window.seasonsGallery && typeof window.seasonsGallery.refresh === 'function') {
    window.seasonsGallery.refresh();
  }

  // フッター季節ボタンは現在DOMに存在しないため未初期化（安全に無効化）
  // setupFooterSeasonButtons();
});

/**
 * スクロールボタンハンドラーの初期化
 * 
 * 機能:
 * - data-scroll-target属性を持つ全ボタンにイベントリスナー追加
 * - クリック時に指定されたセクションへのスムーススクロール実行
 * - ナビゲーションリンクやCTAボタンの統一処理
 */
function initScrollButtons() {
  // data-scroll-target属性を持つ全要素を取得
  document.querySelectorAll('[data-scroll-target]').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-scroll-target');
      scrollToSection(target); // スムーススクロール関数を呼び出し
    });
  });
}

/**
 * 季節ギャラリーナビゲーションとコンテンツの動的生成
 * 
 * 機能:
 * - SEASON_DATAから季節別ナビゲーションボタンを動的生成
 * - 季節別コンテンツパネル（動画・音声・説明）を動的生成
 * - アクセシビリティ属性の適切な設定
 * - 遅延読み込みやフォールバック処理の統合
 * - 梅雨シーズンの適切な除外処理
 * 
 * 注意:
 * - 梅雨（tsuyu）シーズンはボタンやコンテンツを生成しない
 * - 動的生成後に音声・動画要素の再設定が必要
 */
function generateSeasonGallery() {
  const seasonNav = document.getElementById('season-nav');
  const seasonContent = document.getElementById('season-content');
  
  // 必要なコンテナ要素が存在しない場合は処理を終了
  if (!seasonNav || !seasonContent) return;
  
  // HTML文字列とフラグの初期化
  let navHTML = '';
  let contentHTML = '';
  let isFirst = true; // 最初のアイテムをアクティブ状態にするためのフラグ

  // SEASON_DATA内の各季節データをループ処理
  for (const [key, season] of Object.entries(SEASON_DATA)) {
    if (key === 'tsuyu') {
      // 梅雨シーズンはボタンとコンテンツを生成しない
      continue;
    }
    
    // 季節ナビゲーションボタンのHTML生成
    navHTML += `
      <button class="season-btn ${isFirst ? 'active' : ''}" 
              data-season="${key}" 
              role="tab" 
              aria-controls="${key}-content" 
              aria-selected="${isFirst ? 'true' : 'false'}" 
              aria-label="${season.name}の楽曲を再生">
        <span class="season-icon" aria-hidden="true">${season.icon}</span>
        <span class="season-name">${season.name}</span>
      </button>
    `;
    
    // 季節コンテンツパネルのHTML生成
    contentHTML += `
      <div class="season-panel ${isFirst ? 'active' : ''}" 
           id="${key}-content" 
           role="tabpanel" 
           aria-labelledby="${key}-tab" 
           data-season="${key}">
        <div class="season-visual">
          <!-- 季節テーマ動画の設定 -->
          <video class="season-video"
                 controls
                 preload="none"
                 loading="lazy"
                 poster="${season.poster}"
                 width="1280" height="720"
                 playsinline>
           <!-- WebM動画ソースが存在する場合のみ追加 -->
           ${season.video.webm ? `<source data-src="${season.video.webm}" type="video/webm">` : ''}
           <!-- MP4動画ソースをフォールバックとして追加 -->
           <source data-src="${season.video.mp4}" type="video/mp4">
           <!-- ブラウザが動画再生に対応していない場合のエラーメッセージ -->
           お使いのブラウザは動画再生に対応していません。
          </video>
        </div>
        <!-- 季節トラックと説明のコンテナ -->
        <div class="season-tracks">
          <!-- 季節タイトルの表示 -->
          <h3 class="season-title">${season.title}</h3>
          <!-- 季節説明の表示 -->
          <p class="season-description">${season.description}</p>
          <div class="track-list">
            ${season.tracks.map(track => `
              <div class="track">
                <audio controls preload="none">
                  <source src="${track.src}" type="audio/mpeg">
                  お使いのブラウザは音声再生に対応していません。
                </audio>
                <div class="track-info">
                  <h4 class="track-title">${track.title}</h4>
                  <p class="track-description">${track.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    isFirst = false; // 最初のアイテム処理後はフラグをオフ
  }
  
  // 生成したHTMLをDOMに挿入
  seasonNav.innerHTML = navHTML;
  seasonContent.innerHTML = contentHTML;
  
  // 動的生成後に音声・動画要素の再設定
  if (window.seasonsGallery && typeof window.seasonsGallery.setupAudioElements === 'function') {
    window.seasonsGallery.setupAudioElements();
  }
}

/**
 * ソーシャルメディアリンクの動的生成
 * 
 * 機能:
 * - サポートしているソーシャルメディアプラットフォームのリンク一覧を生成
 * - SVGアイコンや画像アイコンを適切に表示
 * - アクセシビリティラベルやaria属性の適切な設定
 * - リンクの有効/無効状態の制御
 * - 新しいタブでの安全なリンク開く設定
 * 
 * サポートプラットフォーム:
 * - YouTube：公式チャンネル
 * - Instagram：アーティストアカウント
 * - Suno AI：AI音楽生成プラットフォーム
 * - Spotify：ユーザープロフィール
 */
function generateSocialLinks() {
  const socialContainer = document.getElementById('social-links');
  if (!socialContainer) return; // コンテナが存在しない場合は処理を終了
  
  // ソーシャルメディアリンクの定義データ
  const socialLinks = [
    {
      url: 'https://www.youtube.com/@project-shuka',
      label: 'YouTube チャンネル', // アクセシビリティラベル
      name: 'YouTube',
      icon: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>' , // YouTube SVGアイコン
      enabled: true,
      class: 'youtube'
    },
    {
      url: 'https://www.instagram.com/shuka_sounds?igsh=MXhrd29oeWJuNHB5OQ==',
      label: 'Instagram アカウント',
      name: 'Instagram',
      icon: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>' , // Instagram SVGアイコン
      enabled: true,
      class: 'instagram'
    },
    {
      url: 'https://suno.com/@shuka_sounds',
      label: 'Suno アカウント', // AI音楽プラットフォーム
      name: 'Suno',
      icon: null, // SVGアイコンではなく画像アイコンを使用
      image: './img/suno-small.webp', // Sunoロゴ画像
      enabled: true,
      class: 'suno'
    },
    {
      url: 'https://open.spotify.com/user/31fn263kaqklxmvqkwyhixpt3oke',
      label: 'Spotify プロフィール',
      name: 'Spotify',
      icon: '<path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm5.177 17.364a.748.748 0 0 1-1.029.246c-2.811-1.72-6.354-2.107-10.522-1.152a.75.75 0 0 1-.33-1.464c4.61-1.04 8.54-.602 11.64 1.255a.748.748 0 0 1 .241 1.115zm1.474-3.282a.935.935 0 0 1-1.284.307c-3.222-1.973-8.135-2.547-11.943-1.39a.937.937 0 0 1-.546-1.796c4.357-1.323 9.763-.676 13.45 1.62a.936.936 0 0 1 .323 1.259zm.127-3.354a1.122 1.122 0 0 1-1.541.369c-3.676-2.247-9.29-2.75-13.62-1.502a1.124 1.124 0 1 1-.642-2.154c4.924-1.468 11.126-.9 15.3 1.636a1.122 1.122 0 0 1 .503 1.651z"/>',
      enabled: true,
      class: 'spotify'
    }
  ];
  
  // 各ソーシャルメディアリンクのHTMLを生成
  const socialHTML = socialLinks.map(link => {
    // 有効なリンクの場合のhref等の属性設定
    const attrs = link.enabled ?
      `href="${link.url}" rel="noopener noreferrer" target="_blank"` : '';
    const classes = `social-link${link.enabled ? '' : ' disabled'}${link.class ? ' ' + link.class : ''}`;
    
    // アイコンのHTML生成：画像またはSVGアイコン
    const iconHTML = link.image ? 
      `<img src="${link.image}" alt="${link.name}" class="social-icon-img" width="24" height="24" aria-hidden="true">` :
      `<svg class="social-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        ${link.icon}
      </svg>`;
    
    // 完成したリンクHTMLを返す
    return `
    <a ${attrs} class="${classes}" aria-label="${link.label}">
      ${iconHTML}
    </a>`;
  }).join('');
  
  // 生成したHTMLをコンテナに挿入
  socialContainer.innerHTML = socialHTML;
}


/**
 * 画像読み込みエラーの個別ハンドリング
 * 
 * 機能:
 * - 破損した画像やネットワークエラー時のフォールバック処理
 * - 重複エラーハンドリングの防止（一度処理した画像の再処理を回避）
 * - 特定クラスを持つ要素の適切な非表示処理
 * - エラー情報のコンソール出力でデバッグ支援
 * 
 * @param {HTMLImageElement} img - エラーが発生した画像要素
 */
function handleImageError(img) {
  // 重複エラーハンドリングを防止（同じ画像に対して一度だけ処理）
  if (!img.dataset.errorHandled) {
    img.dataset.errorHandled = 'true'; // 処理済みフラグを設定
    console.warn('Failed to load image:', img.src); // デバッグ用エラー情報出力
    
    // フォールバック処理：特定クラスの要素は完全に非表示
    if (img.classList.contains('about-image') || img.classList.contains('creator-avatar')) {
      img.style.display = 'none'; // レイアウトを崩さないように非表示
    }
  }
}

/**
 * 全サイトの画像エラーハンドリングの初期化
 * 
 * 機能:
 * - ページ内の全画像要素を取得してエラーイベントリスナーを一括登録
 * - 画像読み込み失敗時の自動フォールバック処理を設定
 * - 動的に生成された画像を含む全ての画像に対応
 * - ネットワークエラーやファイル破損時のユーザー体験向上
 */
function setupImageErrorHandling() {
  // ページ内の全画像要素にエラーハンドラーを一括追加
  document.querySelectorAll('img').forEach(img => {
    // 各画像にエラーイベントリスナーを登録
    img.addEventListener('error', () => handleImageError(img));
  });
}

