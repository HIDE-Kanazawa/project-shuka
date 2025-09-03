/**
 * Season Data Configuration
 *
 * 目的:
 * - 四季ごとの表示情報（アイコン/名称/説明/ポスター/動画/音源）を一元管理。
 * - UI生成ロジック（ギャラリーやナビ）から定数参照で扱いやすくする。
 *
 * パフォーマンス配慮:
 * - 画像/動画ファイルはここでパスを定義するのみ。実ロードは必要時に行う（遅延）。
 * - 動画は `<source data-src>` を使い、可視化/操作時にのみ `src` をセットする設計（ネットワーク競合を抑制）。
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
 * - ARIAライブリージョンを設定して動的コンテンツ変更を通知
 */
function initAccessibilityFeatures() {
  // マウス使用状況の追跡（フォーカス管理のため）
  // マウスクリック時は視覚的なフォーカス表示を無効化
  document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
  // キーボード使用時は視覚的なフォーカス表示を有効化
  document.addEventListener('keydown', () => document.body.classList.remove('using-mouse'));
  
  // 拡張キーボードナビゲーションの設定
  document.addEventListener('keydown', handleGlobalKeyboard);
  
  // ARIAライブリージョンの設定（動的コンテンツ変更通知用）
  if (!document.getElementById('aria-live-region')) {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite'); // 丁寧な読み上げモード
    liveRegion.setAttribute('aria-atomic', 'true'); // コンテンツ全体を読み上げ
    liveRegion.className = 'sr-only'; // スクリーンリーダー専用（視覚的には非表示）
    document.body.appendChild(liveRegion);
  }
}

/**
 * グローバルキーボードイベントハンドラー
 * 
 * 機能:
 * - Alt+数字キーによるセクション間ショートカットナビゲーション
 * - Escapeキーによるオーバーレイ・メニューの閉じる操作
 */
function handleGlobalKeyboard(e) {
  // キーボードショートカット（Alt+数字）
  if (e.altKey) {
    switch(e.key) {
      case '1':
        e.preventDefault();
        const homeEl = document.getElementById('home');
        if (homeEl) homeEl.focus(); // ホームセクションにフォーカス
        break;
      case '2':
        e.preventDefault();
        const aboutEl = document.getElementById('about');
        if (aboutEl) aboutEl.focus(); // アバウトセクションにフォーカス
        break;
      case '3':
        e.preventDefault();
        const galleryEl = document.getElementById('gallery');
        if (galleryEl) galleryEl.focus(); // ギャラリーセクションにフォーカス
        break;
      case '4':
        e.preventDefault();
        const contactEl = document.getElementById('contact');
        if (contactEl) contactEl.focus(); // コンタクトセクションにフォーカス
        break;
    }
  }
  
  // Escapeキーで開いているオーバーレイを閉じる
  if (e.key === 'Escape') {
    // モバイルメニューが開いている場合は閉じる
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (navToggle) {
        navToggle.classList.remove('active');
        navToggle.focus(); // フォーカスをトグルボタンに戻す
      }
    }
  }
}

/**
 * initResourcePrefetching()
 *
 * 目的:
 * - 初期表示に不要だが近い将来参照される軽量画像を、アイドル時間に `prefetch` で取得。
 *
 * ポイント:
 * - `requestIdleCallback` によりメインスレッドが空いたタイミングでリンク要素を挿入し、
 *   ユーザー操作に影響しにくい形で後方取得を促す。
 * - ここでは小さめのWebP画像のみを対象とし、太いアセット（動画/音声）は含めない。
 */
function initResourcePrefetching() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Prefetch lightweight image assets during idle time
      const images = [
        './img/秀歌-春.webp',
        './img/秀歌-夏.webp',
        './img/秀歌-秋.webp',
        './img/秀歌-冬.webp'
      ];

      images.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);
      });
    });
  }
}

/**
 * Navigation Module
 *
 * 役割:
 * - ハンバーガーメニュー（モバイル）トグル
 * - アンカースクロールのスムーズ化
 * - スクロール位置に応じたヘッダー挙動（必要に応じて）
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
    this.navToggle = document.getElementById('nav-toggle'); // モバイルメニューのトグルボタン
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
   * - モバイルメニューの開閉
   * - スムーズスクロール
   * - 外部クリック検知
   * - スクロール検知
   * - キーボード操作
   */
  bindEvents() {
    // モバイルメニューのトグル機能
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // アンカーリンクでのスムーズスクロール
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });
    
    // メニュー外クリックでメニューを閉じる
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    
    // スクロール時のヘッダースタイル変更
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Escapeキーでモバイルメニューを閉じる
    document.addEventListener('keydown', (e) => this.handleEscapeKey(e));
  }
  
  /**
   * モバイルメニューの開閉トグル
   * 現在の状態に応じて開く・閉じるを切り替える
   */
  toggleMobileMenu() {
    const isActive = this.navMenu.classList.contains('active');
    
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  /**
   * モバイルメニューを開く
   * - メニューを表示状態にする
   * - ARIAアトリビュートを更新
   * - ページスクロールを無効化
   * - フォーカス管理
   */
  openMobileMenu() {
    this.navMenu.classList.add('active');
    if (this.navToggle) {
      this.navToggle.classList.add('active');
      this.navToggle.setAttribute('aria-expanded', 'true'); // 展開状態を通知
      this.navToggle.setAttribute('aria-label', 'メニューを閉じる');
    }
    
    // メニュー表示中はページのスクロールを無効化
    document.body.style.overflow = 'hidden';
    
    // フォーカス管理 - メニュー内の最初のフォーカス可能要素にフォーカス
    const firstFocusableElement = this.navMenu.querySelector('a, button');
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
  }
  
  /**
   * モバイルメニューを閉じる
   * - メニューを非表示状態にする
   * - ARIAアトリビュートを更新
   * - ページスクロールを復元
   * - フォーカスをトグルボタンに戻す
   */
  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    if (this.navToggle) {
      this.navToggle.classList.remove('active');
      this.navToggle.setAttribute('aria-expanded', 'false'); // 折りたたみ状態を通知
      this.navToggle.setAttribute('aria-label', 'メニューを開く');
    }
    
    // ページスクロールを復元
    document.body.style.overflow = '';
    
    // フォーカスをトグルボタンに戻す
    if (this.navToggle) {
      this.navToggle.focus();
    }
  }
  
  /**
   * スムーズスクロール処理
   * アンカーリンククリック時の処理
   * - ページ内の指定セクションにスムーズにスクロール
   * - モバイルメニューが開いている場合は閉じる
   * - URLを更新してブックマーク対応
   * - アクティブなナビゲーションリンクを更新
   */
  handleSmoothScroll(e) {
    e.preventDefault(); // デフォルトのリンク動作を無効化
    
    const targetId = e.target.getAttribute('href').substring(1); // #を除いたIDを取得
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // モバイルメニューが開いている場合は閉じる
      if (this.navMenu.classList.contains('active')) {
        this.closeMobileMenu();
      }
      
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
  smoothScrollTo(targetPosition) {
    const startPosition = window.pageYOffset; // 開始位置
    const distance = targetPosition - startPosition; // 移動距離
    const duration = 400; // アニメーション時間（ミリ秒）
    let start = null;
    
    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start; // 経過時間
      const progress = Math.min(timeElapsed / duration, 1); // 進行度（0-1）
      
      // イージング関数（ease-in-out-cubic）
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
      
      // 計算された位置にスクロール
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      // アニメーション継続判定
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  }
  
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
   * メニュー外クリック処理
   * - ナビゲーション以外の場所をクリックした時にモバイルメニューを閉じる
   */
  handleOutsideClick(e) {
    const isClickInsideNav = this.navMenu.contains(e.target) || (this.navToggle && this.navToggle.contains(e.target));
    
    if (!isClickInsideNav && this.navMenu.classList.contains('active')) {
      this.closeMobileMenu();
    }
  }
  
  /**
   * Escapeキー処理
   * - Escapeキーでモバイルメニューを閉じる
   */
  handleEscapeKey(e) {
    if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
      this.closeMobileMenu();
    }
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


// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
/**
 * Seasons Module
 * Handles seasonal gallery switching with animations and accessibility
 */

// Set winter season gallery video to "白のなかで"
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
      button.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
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
    
    // 動画要素でのキーボードイベントのデリゲーション
    document.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('season-video')) {
        this.handleVideoKeydown(e);
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
        if (conn && conn.saveData) return; // Respect Data Saver
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

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 8000 });
    } else {
      setTimeout(run, 5000);
    }
  }
  
  loadInitialSeason() {
    // Style page for tsuyu season but don't select a panel
    this.currentSeason = '';

    // Update URL to reflect tsuyu season
    this.updateURL('tsuyu');

    // Update styling / background
    this.updateSeasonBackground('tsuyu');

    // Enable rain effect for tsuyu season
    if (typeof window.enableRain === 'function') {
      window.enableRain();
    }
    // Ensure sakura effect is disabled
    if (typeof window.disableSakura === 'function') {
      window.disableSakura();
    }

    // Enable sakura effect only for spring (no burst on initial load)
    if (typeof window.enableSakura === 'function' && this.currentSeason === 'spring') {
      window.enableSakura(false);
    }

    // Hide all panels until user selects a season
    this.updateSeasonButtons('');
    this.updateSeasonPanels('', false);
  }
  
  /**
   * URLパラメータから季節を取得
   * - URLクエリパラメータ「season」の値を確認
   * - 有効な季節名の場合のみ返却
   */
  getSeasonFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const season = urlParams.get('season');
    
    // 有効な季節名のチェック
    if (['spring', 'summer', 'autumn', 'winter', 'tsuyu'].includes(season)) {
      return season;
    }
    
    return null; // 無効または未設定の場合
  }

  /**
   * ローカルストレージから最後に選択された季節を取得
   * - 前回のユーザー選択を記憶
   * - ストレージアクセスエラー時も安全に処理
   */
  getSeasonFromStorage() {
    try {
      const s = localStorage.getItem('lastSeason');
      if (['spring','summer','autumn','winter','tsuyu'].includes(s)) {
        return s;
      }
    } catch (e) {
      // ストレージアクセスエラー時は無視
    }
    return null; // 未保存または無効な値の場合
  }
  
  /**
   * 現在の月から季節を自動判定
   * - 3-5月: 春
   * - 6-8月: 夏  
   * - 9-11月: 秋
   * - 12-2月: 冬
   */
  getSeasonFromDate() {
    const now = new Date();
    const month = now.getMonth() + 1; // 月を1-12で取得
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter'; // 12, 1, 2月
  }
  
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
   * キーボードナビゲーションの処理
   * - 矢印キー: 前後の季節ボタンに移動
   * - Home/End: 最初/最後のボタンに移動
   * - Enter/Space: 季節を選択
   */
  handleKeyboardNavigation(e) {
    const currentIndex = Array.from(this.seasonButtons).indexOf(e.currentTarget);
    let nextIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        // 次のボタンに移動（循環）
        nextIndex = (currentIndex + 1) % this.seasonButtons.length;
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        // 前のボタンに移動（循環）
        nextIndex = (currentIndex - 1 + this.seasonButtons.length) % this.seasonButtons.length;
        break;
        
      case 'Home':
        e.preventDefault();
        nextIndex = 0; // 最初のボタンに移動
        break;
        
      case 'End':
        e.preventDefault();
        nextIndex = this.seasonButtons.length - 1; // 最後のボタンに移動
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.handleSeasonChange(e); // 現在のボタンを選択
        return;
        
      default:
        return; // その他のキーは無視
    }
    
    // 計算された次のボタンにフォーカス
    this.seasonButtons[nextIndex].focus();
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

    // 前の季節を保存（演出制御用）
    const previousSeason = this.currentSeason;
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
      // 春への新しい切り替えかどうかをチェック（初期ページ読み込みではない）
      const isSeasonChange = previousSeason !== season && previousSeason !== null;
      if (typeof window.enableSakura === 'function') {
        window.enableSakura(isSeasonChange); // 季節切り替え時は桜の花びら散布演出を有効化
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
      
      // アクティブクラスの切り替え
      button.classList.toggle('active', isActive);
      // スクリーンリーダー用の選択状態を通知
      button.setAttribute('aria-selected', isActive.toString());
      
      // キーボードナビゲーション用のtabindex設定
      if (isActive) {
        button.setAttribute('tabindex', '0'); // フォーカス可能
      } else {
        button.setAttribute('tabindex', '-1'); // フォーカス不可
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
        // CSSスタイリング用のbody季節属性を更新
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
      // Preload image before changing
      const img = new Image();
      img.onload = () => {
        aboutImage.src = imageUrl;
        aboutImage.srcset = imageUrl;
        
        // Update picture source as well
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
    
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('season-announcer');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'season-announcer';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'visually-hidden';
      document.body.appendChild(liveRegion);
    }
    
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
   * 動画要素のキーボード操作処理
   * 
   * 機能:
   * - スペースキーまたはEnterキーで再生/一時停止切り替え
   * - 左右矢印キーで5秒単位のシーク操作
   * - デフォルトキー動作の抑制
   * 
   * @param {KeyboardEvent} e - キーボードイベント
   */
  handleVideoKeydown(e) {
    const video = e.target;
    
    // スペースキーまたはEnterキーで再生/一時停止切り替え
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      this.handleVideoClick(e);
    }
    
    // 左矢印キーで5秒巻き戻し
    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      video.currentTime = Math.max(0, video.currentTime - 5);
    }
    
    // 右矢印キーで5秒早送り
    if (e.code === 'ArrowRight') {
      e.preventDefault();
      video.currentTime = Math.min(video.duration, video.currentTime + 5);
    }
  }

  /**
   * 再生ノートの表示処理
   * 
   * 機能:
   * - マウスホバー時に音符アイコンを表示
   * - マウス位置に追従する視覚的なフィードバック
   * - アクセシビリティ対応のスクリーンリーダー用テキスト
   * - カスタム波紋エフェクトとの連携
   * 
   * @param {MouseEvent} e - マウスイベント
   */
  showPlayNote(e) {
    const video = e.currentTarget;
    if (video._playNote) return; // 既に表示中の場合は処理をスキップ

    // 音符アイコン要素の作成
    const note = document.createElement('div');
    note.className = 'play-note';
    note.innerHTML = '♪<span class="visually-hidden">クリックで再生</span>';
    document.body.appendChild(note);
    
    // マウス位置に配置
    note.style.left = `${e.clientX}px`;
    note.style.top = `${e.clientY}px`;

    // 動画要素にノート要素への参照を保存
    video._playNote = note;

    // カスタム波紋エフェクトが利用可能な場合は実行
    if (typeof window.createCustomRipple === 'function') {
      window.createCustomRipple(e.clientX, e.clientY, getComputedStyle(note).color);
    }
  }

  /**
   * 再生ノートの移動処理
   * 
   * 機能:
   * - マウス移動に合わせて音符アイコンの位置を更新
   * - スムーズなマウス追従の視覚効果
   * 
   * @param {MouseEvent} e - マウス移動イベント
   */
  movePlayNote(e) {
    const note = e.currentTarget._playNote;
    if (note) {
      // マウス位置に音符を移動
      note.style.left = `${e.clientX}px`;
      note.style.top = `${e.clientY}px`;
    }
  }

  /**
   * 再生ノートの非表示処理
   * 
   * 機能:
   * - マウスがビデオ要素から離れた際の処理
   * - 音符アイコンの削除
   * 
   * @param {MouseEvent} e - マウスリーブイベント
   */
  hidePlayNote(e) {
    this.removePlayNote(e.currentTarget);
  }

  /**
   * 再生ノートの削除処理
   * 
   * 機能:
   * - DOM要素からの音符アイコン削除
   * - ビデオ要素の参照をクリア
   * 
   * @param {HTMLVideoElement} video - 対象の動画要素
   */
  removePlayNote(video) {
    const note = video._playNote;
    if (note) {
      note.remove(); // DOMから削除
      video._playNote = null; // 参照をクリア
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

// Global function for external use (e.g., footer links)
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
  
  // 現在の季節で初期状態を設定
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
 * フッター季節ボタンの初期化
 * 
 * 機能:
 * - フッター内の季節切り替えボタンにイベントリスナーを追加
 * - デフォルトリンク動作を無効化
 * - グローバル季節切り替え関数を呼び出し
 */
function setupFooterSeasonButtons() {
  const footerSeasonButtons = document.querySelectorAll('.footer-season-btn');
  footerSeasonButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault(); // デフォルトリンク動作を防止
      const season = button.getAttribute('data-season');
      if (season && window.switchSeason) {
        window.switchSeason(season);
      }
    });
  });
}

/**
 * モジュールシステム対応のエクスポート処理
 * 
 * 機能:
 * - CommonJS環境でのモジュールエクスポート
 * - ブラウザ環境でのグローバル変数設定
 */
// CommonJS環境でのエクスポート
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
    this.setupFormHandling(); // フォーム処理とバリデーション
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
   * フォーム処理の初期化
   * 
   * 機能:
   * - コンタクトフォームの送信イベント処理
   * - リアルタイムフィールド検証の設定
   * - フォーカス離脱時とリアルタイム入力時のバリデーション
   */
  setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      // フォーム送信イベントの設定
      contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
      
      // リアルタイム検証の追加
      const inputs = contactForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        // フォーカス離脱時にフィールド検証実行
        input.addEventListener('blur', () => this.validateField(input));
        // 入力時にエラー表示をクリア
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    }
  }
  
  /**
   * フォーム送信処理
   * 
   * 機能:
   * - フォーム送信の完全な処理フロー
   * - バリデーション → ローディング状態 → 送信 → 成功表示
   * - 送信完了後のフォームリセット
   * 
   * @param {Event} e - フォーム送信イベント
   */
  handleFormSubmit(e) {
    e.preventDefault(); // デフォルト送信を防止
    
    const form = e.target;
    
    // フォーム全体のバリデーション実行
    if (!this.validateForm(form)) {
      return; // バリデーション失敗時は処理を中断
    }
    
    // ローディング状態の表示
    this.setFormLoadingState(form, true);
    
    // フォーム送信のシミュレーション（実際のエンドポイントに置換）
    setTimeout(() => {
      this.showFormSuccess(form); // 成功メッセージ表示
      this.setFormLoadingState(form, false); // ローディング状態解除
      form.reset(); // フォームリセット
    }, 2000);
  }
  
  /**
   * フォーム全体のバリデーション
   * 
   * 機能:
   * - 必須フィールドの一括検証
   * - 個別フィールド検証結果の統合判定
   * 
   * @param {HTMLFormElement} form - 検証対象のフォーム
   * @returns {boolean} フォーム全体の有効性
   */
  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // 全ての必須フィールドを検証
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false; // 1つでも無効な場合は全体を無効とする
      }
    });
    
    return isValid;
  }
  
  /**
   * 個別フィールドのバリデーション
   * 
   * 機能:
   * - 必須フィールドの入力チェック
   * - メールアドレス形式の検証
   * - エラーメッセージの表示制御
   * 
   * @param {HTMLInputElement} field - 検証対象のフィールド
   * @returns {boolean} フィールドの有効性
   */
  validateField(field) {
    const value = field.value.trim(); // 前後の空白を除去して値を取得
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // 必須フィールドの検証
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'この項目は必須です';
    }
    
    // メールアドレス形式の検証
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 基本的なメール形式の正規表現
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'メールアドレスの形式が正しくありません';
      }
    }
    
    // エラーメッセージの表示/非表示切り替え
    this.showFieldError(field, isValid ? '' : errorMessage);
    return isValid;
  }
  
  /**
   * フィールドエラーメッセージの表示
   * 
   * 機能:
   * - 既存エラーの自動クリア
   * - フィールドへのエラー状態クラス追加
   * - アクセシビリティ属性の適切な設定
   * - エラーメッセージ要素の動的生成と表示
   * 
   * @param {HTMLInputElement} field - 対象フィールド
   * @param {string} message - 表示するエラーメッセージ（空文字の場合はエラー非表示）
   */
  showFieldError(field, message) {
    // 既存のエラー表示をクリア
    this.clearFieldError(field);
    
    if (message) {
      // フィールドにエラー状態を追加
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true'); // アクセシビリティ：無効値の明示
      
      // エラーメッセージ要素の作成
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      errorElement.id = `${field.id}-error`;
      field.setAttribute('aria-describedby', errorElement.id); // スクリーンリーダー対応
      
      // フィールドの親要素にエラーメッセージを追加
      field.parentNode.appendChild(errorElement);
    }
  }
  
  /**
   * フィールドエラー状態のクリア
   * 
   * 機能:
   * - エラー状態クラスの除去
   * - アクセシビリティ属性のリセット
   * - エラーメッセージ要素の削除
   * 
   * @param {HTMLInputElement} field - クリア対象のフィールド
   */
  clearFieldError(field) {
    // エラー状態クラスを除去
    field.classList.remove('error');
    // アクセシビリティ属性をリセット
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    
    // 既存のエラーメッセージ要素を削除
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }
  
  /**
   * フォームローディング状態の制御
   * 
   * 機能:
   * - 送信ボタンテキストの動的変更
   * - フォーム要素の有効/無効状態制御
   * - ユーザー操作の適切な制限/解除
   * 
   * @param {HTMLFormElement} form - 対象フォーム
   * @param {boolean} isLoading - ローディング状態のフラグ
   */
  setFormLoadingState(form, isLoading) {
    const submitButton = form.querySelector('.form-submit');
    const inputs = form.querySelectorAll('input, textarea, button');
    
    if (isLoading) {
      // ローディング状態：送信ボタンテキスト変更＆全要素無効化
      submitButton.textContent = '送信中...';
      submitButton.disabled = true;
      inputs.forEach(input => input.disabled = true);
    } else {
      // 通常状態：送信ボタンテキスト復元＆全要素有効化
      submitButton.textContent = '送信する';
      submitButton.disabled = false;
      inputs.forEach(input => input.disabled = false);
    }
  }
  
  /**
   * フォーム送信成功メッセージの表示
   * 
   * 機能:
   * - 成功メッセージ要素の動的生成
   * - チェックマークアイコンと感謝メッセージの表示
   * - フォームの一時的非表示
   * - 自動的な成功メッセージの削除とフォーム復元
   * 
   * @param {HTMLFormElement} form - 対象フォーム
   */
  showFormSuccess(form) {
    // 成功メッセージ要素の作成
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
      <div class="success-content">
        <span class="success-icon">✓</span>
        <p>お問い合わせありがとうございます。<br>お返事まで今しばらくお待ちください。</p>
      </div>
    `;
    
    // フォームを非表示にして成功メッセージを表示
    form.style.display = 'none';
    form.parentNode.appendChild(successMessage);
    
    // 5秒後に成功メッセージを削除してフォームを復元
    setTimeout(() => {
      successMessage.remove();
      form.style.display = 'block';
    }, 5000);
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
    // スキップリンクの設定
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // デフォルトのリンク動作を防止
        const targetId = link.getAttribute('href').substring(1); // '#'を除去してID取得
        const target = document.getElementById(targetId);
        if (target) {
          target.focus(); // 対象要素にフォーカス設定
          target.scrollIntoView(); // 対象要素へスクロール
        }
      });
    });
    
    // モーダル・オーバーレイのフォーカス管理
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.handleTabKey(e); // タブキー操作の処理
      }
    });
    
    // スクリーンリーダー向けのページ変更アナウンス設定
    this.setupRouteAnnouncements();
  }
  
  /**
   * タブキー操作時の処理
   * 
   * 機能:
   * - アクティブなモーダル内でのフォーカストラップ
   * - モーダル外への不適切なフォーカス移動を防止
   * - キーボードナビゲーションの改善
   * 
   * @param {KeyboardEvent} e - タブキー押下イベント
   */
  handleTabKey(e) {
    // アクティブなモーダルの存在確認
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      // モーダル内でのフォーカストラップを実行
      this.trapFocus(e, activeModal);
    }
  }
  
  /**
   * フォーカストラップの実装
   * 
   * 機能:
   * - 指定されたコンテナ内でのフォーカス循環
   * - Shift+Tabでの逆方向フォーカス移動対応
   * - 最初/最後の要素間での自動ループ処理
   * 
   * @param {KeyboardEvent} e - タブキーイベント
   * @param {HTMLElement} container - フォーカストラップ対象のコンテナ
   */
  trapFocus(e, container) {
    // コンテナ内のフォーカス可能な要素をすべて取得
    const focusableElements = container.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0]; // 最初のフォーカス可能要素
    const lastFocusable = focusableElements[focusableElements.length - 1]; // 最後のフォーカス可能要素
    
    if (e.shiftKey) {
      // Shift+Tab（逆方向）の場合：最初の要素にいるときは最後の要素にジャンプ
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab（順方向）の場合：最後の要素にいるときは最初の要素にジャンプ
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
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
   * - aria-live属性による適切なライブリージョン設定
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
      announcer.setAttribute('aria-live', 'polite'); // 丁寧な読み上げモード
      announcer.setAttribute('aria-atomic', 'true'); // 全体を一度に読み上げ
      announcer.className = 'visually-hidden'; // 視覚的に隠蔽
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
   * - スクロール・リサイズ・入力イベントでのパフォーマンス最適化
   * - タイマーベースの遅延実行制御
   * 
   * @param {Function} func - 実行対象の関数
   * @param {number} wait - 待機時間（ミリ秒）
   * @returns {Function} デバウンス処理が適用された関数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args); // 指定された引数で元関数を実行
      };
      clearTimeout(timeout); // 既存タイマーをクリア
      timeout = setTimeout(later, wait); // 新しいタイマーを設定
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
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args); // 即座に実行
        inThrottle = true; // スロットル状態に設定
        setTimeout(() => inThrottle = false, limit); // 指定時間後に解除
      }
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
    this.observers.clear(); // Mapをクリア
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
 * 自動季節判定機能
 * 
 * 機能:
 * - 現在の月を取得して適切な季節を判定
 * - ボディ要素にdata-season属性を設定
 * - CSSでの季節別スタイリングを可能に
 * - 季節別エフェクトの自動適用の基礎
 */
// WINDSURF_START SeasonColor
(function setSeason(){
  const month = new Date().getMonth()+1; // 現在の月を取得（1-12で数値化）
  let season = "spring"; // デフォルトは春
  
  // 月に基づいた季節判定
  if([6,7,8].includes(month)) season = "summer";     // 6-8月：夏
  else if([9,10,11].includes(month)) season = "autumn"; // 9-11月：秋
  else if([12,1,2].includes(month)) season = "winter";  // 12-2月：冬
  
  // ボディ要素に季節データを設定
  document.body.dataset.season = season;
})();
// WINDSURF_END SeasonColor

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
    
    // マウス移動による波紋生成（スロットル処理）
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // クリック時の即座の波紋生成
    document.addEventListener('click', (e) => this.handleClick(e));
    
    // タッチデバイス対応の波紋生成
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
    
    // タイプに基づく波紋サイズの計算 - 自然な大きさのバリエーション
    const sizeMap = {
      small: Math.random() * 120 + 80,     // 80-200px (小さめ)
      medium: Math.random() * 200 + 150,   // 150-350px (標準)
      large: Math.random() * 300 + 200,    // 200-500px (大きめ)
      huge: Math.random() * 400 + 300      // 300-700px (特大・壮観)
    };
    
    const rippleSize = sizeMap[size] || sizeMap.medium;
    
    // 波紋の配置 - 中心座標を基準とした正確な位置決め
    ripple.style.width = `${rippleSize}px`;
    ripple.style.height = `${rippleSize}px`;
    ripple.style.left = `${x - rippleSize / 2}px`;
    ripple.style.top = `${y - rippleSize / 2}px`;
    
    // 回転と初期スケールの設定 - 自然な動きの演出
    const rotation = Math.random() * 360;
    ripple.style.transform = `scale(0) rotate(${rotation}deg)`;
    
    // 色彩効果の追加 - 虹色や金色の特別な演出
    if (color === 'rainbow') {
      const hue = Math.random() * 360;
      ripple.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 70%, 0.8) 0%, hsla(${hue + 60}, 70%, 60%, 0.4) 40%, transparent 80%)`;
    } else if (color === 'gold') {
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
    if (activeParticles >= 15) return; // Lower limit for tranquility

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'refined-particle';
      const size = Math.random() * 3 + 2; // 2-5px - very small and delicate
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x - size / 2}px`;
      particle.style.top = `${y - size / 2}px`;

      // More organic, less organized spread pattern
      const angle = Math.random() * 360; // Completely random direction
      const distance = 60 + Math.random() * 60; // Gentler spread
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const dur = (Math.random() * 1.2 + 2).toFixed(2); // 2-3.2s - very slow and graceful
      
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.animationDuration = `${dur}s`;

      // Add subtle color variation for naturalism
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
    
    // Clear all existing ripples
    this.ripples.forEach(ripple => {
      this.removeRipple(ripple.element);
    });
  }
  
  // Public methods for external control
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
        
        // If FPS drops below 50, optimize
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
    
    // Reduce existing ripples
    while (this.ripples.length > this.maxRipples) {
      const oldestRipple = this.ripples.shift();
      this.removeRipple(oldestRipple.element);
    }
  }
}

// Initialize ripple effect when DOM is loaded
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
 * 雨エフェクトモジュール（梅雨季専用）
 * 
 * 機能:
 * - Canvas上に降雨アニメーションを描画
 * - マウス操作に反応する雨粒インタラクション
 * - 風の変化による自然な雨の動き
 * - 梅雨の季節感を演出する没入感のある密度
 */
class RainEffect {
  /**
   * コンストラクタ - 雨エフェクトの初期化
   */
  constructor() {
    // Canvas要素の作成と設定
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'rain-canvas';
    this.ctx = this.canvas.getContext('2d'); // 2D描画コンテキスト
    document.body.appendChild(this.canvas);

    // キャンバスサイズの設定
    this.resize();
    this.sizeMultiplier = this.getSizeMultiplier(); // デバイスサイズに応じた倍率
    window.addEventListener('resize', () => this.resize()); // リサイズ対応

    // 雨粒の初期化
    this.drops = []; // 雨粒オブジェクトの配列
    // より没入感のある梅雨エフェクトのために雨粒密度を増加
    this.dropCount = Math.floor(window.innerWidth / 2.5); // 密度の高い雨を生成
    for (let i = 0; i < this.dropCount; i++) {
      this.drops.push(this.createDrop(true));
    }

    // マウス・タッチインタラクションの設定
    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleMouseMove(e.touches[0]);
      }
    }, { passive: true }); // パッシブモードでパフォーマンス向上

    // 風の動きを管理する変数
    this.wind = 0; // 現在の風力
    this.windTarget = 0; // 目標風力
    this.lastWindChange = performance.now(); // 最後の風変化時刻
    this.animate = this.animate.bind(this); // アニメーション関数のバインド
    requestAnimationFrame(this.animate);
  }

  /**
   * キャンバスサイズのリサイズ処理 - ウィンドウサイズ変更への動的対応
   * ブラウザのリサイズ時にキャンバスをウィンドウ全体に合わせ、サイズ倍率を再計算
   * @description レスポンシブデザインに対応し、あらゆるデバイスで適切な雨の演出を保証。
   *              スマートフォンから大画面まで、一貫した美しい雨の表現を実現
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.sizeMultiplier = this.getSizeMultiplier();
  }

  /**
   * デバイスサイズ倍率の計算 - 画面サイズに応じた適切なスケーリング
   * 768pxを基準として画面サイズに応じたスケール倍率を算出
   * @returns {number} 0.6から1.2の範囲で制限されたサイズ倍率
   * @description モバイル端末では小さめに、大画面では大きめに調整し、
   *              どのデバイスでも快適な雨の演出を提供。パフォーマンスと美しさのバランスを保持
   */
  getSizeMultiplier() {
    const ratio = window.innerWidth / 768;
    return Math.min(Math.max(ratio, 0.6), 1.2);
  }

  /**
   * 雨粒オブジェクトの生成 - リアルな雨の物理的特性を再現
   * 梅雨の特徴的な長い雨粒と多様な速度を持つリアルな雨粒を作成
   * @param {boolean} randomY - Y座標をランダムに設定するかどうか（初期化時用）
   * @returns {Object} 雨粒のプロパティを含むオブジェクト
   * @description 日本の梅雨特有の特徴を反映し、線状の長い雨粒で湿潤な季節感を表現。
   *              透明度、厚み、速度にバリエーションを持たせて自然な動きを再現
   */
  createDrop(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      length: 15 + Math.random() * 25, // 梅雨のための長い雨粒
      speed: 3 + Math.random() * 5, // 自然な感覚のためのバラエティに富んだ速度
      opacity: 0.3 + Math.random() * 0.4, // やや目立つ透明度
      thickness: 0.8 + Math.random() * 0.7 // 変化に富んだ厚み
    };
  }

  /**
   * マウス移動イベントハンドラー - ユーザーのマウス操作で風の方向を制御
   * マウスの水平位置に応じて風の目標値を設定し、雨の傾きを動的に変化
   * @param {MouseEvent|Touch} e - マウスイベントまたはタッチイベント
   * @description ユーザーがマウスを左右に動かすと、その方向に応じて風が吹き、
   *              雨が斜めに降るインタラクティブな体験を提供。参加型の雨の演出
   */
  handleMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const normalized = (e.clientX - centerX) / centerX;
    this.windTarget = normalized * 2;
  }

  /**
   * 雨のアニメーションメインループ - リアルな梅雨の動きをキャンバスに描画
   * 風の変化、雨粒の移動、水しぶき効果などを統合した梅雨の総合演出
   * @description 60FPSで実行されるアニメーションループで、自然な風の変化、
   *              線状の雨籲、水面でのしぶき、動的な色彩変化を組み合わせ、
   *              梅雨の湿潤で神秘的な美しさをデジタルで再現
   */
  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.lineCap = 'round';

    // 数秒ごとの風の更新 - 自然な風の変化を演出
    const now = performance.now();
    if (now - this.lastWindChange > 3000) {
      this.windTarget = (Math.random() * 2 - 1) * 2; // 梅雨のための強い風
      this.lastWindChange = now;
    }
    // 現在の風を目標に向かって緑やかに移行 - スムーズな突風の表現
    this.wind += (this.windTarget - this.wind) * 0.015;

    for (const d of this.drops) {
      ctx.globalAlpha = d.opacity;
      ctx.lineWidth = d.thickness;
      
      // 梅雨の雰囲気のための青白い雨 - 日本の湿潤な季節表現
      ctx.strokeStyle = `rgba(200, 220, 255, ${d.opacity})`;
      
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + this.wind * 3, d.y + d.length); // より顕著な斜めの傾き
      ctx.stroke();

      // 底部での水しぶき効果を時折追加 - 水面での雨粒の跳ね返り
      if (d.y > this.canvas.height - 50 && Math.random() < 0.02) {
        ctx.globalAlpha = d.opacity * 0.5;
        ctx.strokeStyle = `rgba(123, 167, 212, ${d.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(d.x, this.canvas.height - 10, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update drop position
      d.x += this.wind * (d.speed / 4);
      d.y += d.speed;

      // Wrap around horizontally
      if (d.x < -30) d.x = this.canvas.width + 30;
      if (d.x > this.canvas.width + 30) d.x = -30;

      // Reset drop when it falls below viewport
      if (d.y > this.canvas.height + 10) {
        Object.assign(d, this.createDrop());
      }
    }

    requestAnimationFrame(this.animate);
  }
}

/**
 * 桜エフェクトモジュール（春季専用）
 * 
 * 機能:
 * - 舞い散る桜の花びらアニメーション
 * - 初期バースト機能（季節切り替え時の演出）
 * - 風の変化による自然な動き
 * - 春の季節感を演出するエレガントな密度
 */
class SakuraEffect {
  /**
   * コンストラクタ - 桜エフェクトの初期化
   * @param {boolean} withBurst - 初期バーストエフェクトの有無
   */
  constructor(withBurst = false) {
    // Canvas要素の作成と設定
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'sakura-canvas';
    this.ctx = this.canvas.getContext('2d'); // 2D描画コンテキスト
    document.body.appendChild(this.canvas);

    // キャンバスサイズの設定
    this.resize();
    this.sizeMultiplier = this.getSizeMultiplier(); // デバイスサイズに応じた倍率
    window.addEventListener('resize', () => this.resize()); // リサイズ対応

    // 花びらの初期化
    this.petals = []; // 花びらオブジェクトの配列
    // エレガントな春エフェクトのための桜の花びら密度
    this.petalCount = Math.floor(window.innerWidth / 15);
    this.isInBurstPhase = withBurst; // バーストフェーズの状態
    
    // 春のそよ風のための風変数
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    
    this.initializePetals(withBurst);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleMouseMove(e.touches[0]);
      }
    }, { passive: true });
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /**
   * キャンバスサイズのリサイズ処理 - ウィンドウサイズ変更への動的対応
   * ブラウザのリサイズ時にキャンバスをウィンドウ全体に合わせ、花びらのサイズ倍率を再計算
   * @description レスポンシブデザインに対応し、あらゆるデバイスで適切な桜の演出を保証。
   *              スマートフォンから大画面まで、一貫した美しい春の花びらの演出
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.sizeMultiplier = this.getSizeMultiplier();
  }

  /**
   * デバイスサイズ倍率の計算 - 画面サイズに応じた適切なスケーリング
   * 768pxを基準として画面サイズに応じた花びらのスケール倍率を算出
   * @returns {number} 0.6から1.2の範囲で制限されたサイズ倍率
   * @description モバイル端末では小さめの花びら、大画面では大きめの花びらで調整。
   *              どのデバイスでも美しい桜の演出を提供し、春の美しさを最大化
   */
  getSizeMultiplier() {
    const ratio = window.innerWidth / 768;
    return Math.min(Math.max(ratio, 0.6), 1.2);
  }

  /**
   * 花びらの初期化 - 春の美しい桜の花びらを初期配置
   * バーストモードの場合は花びらの数を倍にして華やかなシーンを演出
   * @param {boolean} withBurst - バーストエフェクトで花びらを倍増するかどうか
   * @description 春の訪れとともに桜が満開する美しい情景を再現。
   *              バースト時は花吹雪のような壮麗な花びらの舞いを表現
   */
  initializePetals(withBurst) {
    const count = withBurst ? this.petalCount * 2 : this.petalCount;
    for (let i = 0; i < count; i++) {
      this.petals.push(this.createPetal(true, withBurst));
    }
  }

  /**
   * 桜の花びらオブジェクトの生成 - 繊細で優美な花びらの物理的特性を再現
   * 春のそよ風に舞う桜の花びらの自然な動きを総合的に表現
   * @param {boolean} randomY - Y座標をランダムに設定するかどうか（初期化時用）
   * @param {boolean} isBurst - バーストエフェクトの花びらかどうか
   * @returns {Object} 花びらの物理プロパティを含むオブジェクト
   * @description 日本の春を代表する桜の花びらの繰々な動きを再現。風への反応、
   *              穏やかな回転、優雅な揺れ、変化に富んだ色彩などを統合した美しい演出
   */
  createPetal(randomY = false, isBurst = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      size: (6 + Math.random() * 11) * this.sizeMultiplier, // レスポンシブな花びらサイズ
      speed: 0.3 + Math.random() * 0.7, // 穏やかな落下速度
      opacity: 0.7 + Math.random() * 0.3, // 視認性向上のための高い透明度
      drift: Math.random() * 1.5 - 0.75, // 左右の揺らぐ動き
      rotationSpeed: (Math.random() - 0.5) * 2, // 穏やかな回転
      rotation: Math.random() * Math.PI * 2,
      swayAmplitude: 40 + Math.random() * 50, // 桜のための優雅な揺れ
      swaySpeed: 0.01 + Math.random() * 0.02, // ユックリとしたエレガントな揺れ
      swayOffset: Math.random() * Math.PI * 2,
      windResistance: 0.4 + Math.random() * 0.6, // 春のそよ風への反応性
      turbulence: Math.random() * 0.4, // 穏やかな乱気流
      petalType: Math.floor(Math.random() * 3), // 異なる花びらの形
      color: this.getSakuraColor(),
      isBurst: isBurst
    };
  }

  /**
   * 桜の伝統色の取得 - 日本の桜に忠実な美しいカラーパレット
   * 伝統的な桜の色合いからランダムに選択し、自然な色合いのバラエティを作成
   * @returns {Object} RGB値を含む色情報オブジェクト
   * @description 深いピンクから純白まで、桜の花びらが持つ繊細な色合いのグラデーションを再現。
   *              日本の春の美しさを忠実に表現する精巧な色彩設計
   */
  getSakuraColor() {
    // 伝統的な桜の色合い - 柔らかなピンクと白
    const colors = [
      { r: 255, g: 182, b: 193 }, // 淡いピンク
      { r: 255, g: 192, b: 203 }, // ピンク
      { r: 255, g: 240, b: 245 }, // ラベンダーブラッシュ
      { r: 255, g: 228, b: 225 }, // ミスティローズ
      { r: 255, g: 255, b: 255 }, // 純白
      { r: 250, g: 218, b: 221 }, // 非常に淡いピンク
      { r: 255, g: 235, b: 238 }  // 柔らかなピンク
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * マウス移動イベントハンドラー - 春のそよ風をユーザー操作で制御
   * マウスの水平位置に応じて春の風の方向を設定し、花びらの舞いを動的に制御
   * @param {MouseEvent|Touch} e - マウスイベントまたはタッチイベント
   * @description ユーザーがマウスを動かすとその方向に春のそよ風が吹き、
   *              桜の花びらが美しく舞い散るインタラクティブな春の体験を提供
   */
  handleMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const normalized = (e.clientX - centerX) / centerX;
    this.windTarget = normalized * 2.5;
  }
  
  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update wind every few seconds - gentle spring breeze
    const now = performance.now();
    if (now - this.lastWindChange > 4000) {
      this.windTarget = (Math.random() * 2 - 1) * 2.5; // Moderate spring wind
      this.lastWindChange = now;
    }
    // Ease current wind toward target
    this.wind += (this.windTarget - this.wind) * 0.015;

    for (const petal of this.petals) {
      ctx.globalAlpha = petal.opacity;
      
      const time = now * 0.001; // Convert to seconds
      const swayX = Math.sin(time * petal.swaySpeed + petal.swayOffset) * petal.swayAmplitude;
      
      ctx.save();
      ctx.translate(petal.x + swayX, petal.y);
      
      // Add wind-influenced rotation - petals tilt in wind direction
      const windTilt = this.wind * 0.08;
      ctx.rotate(petal.rotation + windTilt);
      
      // Set petal color
      const { r, g, b } = petal.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${petal.opacity})`;
      
      // Draw sakura petal
      this.drawSakuraPetal(ctx, 0, 0, petal.size, petal.petalType);
      
      ctx.restore();

      // Update petal position - wind-blown movement
      const windForce = this.wind * petal.windResistance;
      const turbulenceX = Math.sin(now * 0.0008 * petal.turbulence) * 0.3;
      const turbulenceY = Math.cos(now * 0.001 * petal.turbulence) * 0.2;
      
      petal.x += windForce + petal.drift + turbulenceX;
      petal.y += petal.speed + Math.abs(windForce) * 0.05 + turbulenceY;
      petal.rotation += petal.rotationSpeed * 0.015 + Math.abs(windForce) * 0.008;

      // Wrap around horizontally
      if (petal.x < -30) petal.x = this.canvas.width + 30;
      if (petal.x > this.canvas.width + 30) petal.x = -30;

      // Reset petal when it falls below viewport
      if (petal.y > this.canvas.height + 30) {
        Object.assign(petal, this.createPetal());
      }
    }

    requestAnimationFrame(this.animate);
  }

  /**
   * リアルな桜の花びらの描画
   * 
   * 機能:
   * - 日本の桜の品種に基づいた3つの花びらタイプを描画
   * - type 0: ソメイヨシノ風のハート型花びら
   * - type 1: ヤマザクラ風の深い切れ込みを持つ花びら
   * - type 2: シダレザクラ風の丸みを帯びた花びら
   * 
   * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} size - 花びらサイズ
   * @param {number} type - 花びらの種類（0-2）
   */
  drawSakuraPetal(ctx, cx, cy, size, type) {
    const scale = size / 10;
    
    ctx.beginPath();
    
    if (type === 0) {
      // Type A: Classic heart-shaped sakura petal (ソメイヨシノ風)
      const width = 4 * scale;
      const height = 6 * scale;
      
      // Start from bottom tip
      ctx.moveTo(cx, cy + height * 0.4);
      
      // Left side curve - realistic sakura petal curve
      ctx.bezierCurveTo(
        cx - width * 0.3, cy + height * 0.1,
        cx - width * 0.7, cy - height * 0.2,
        cx - width * 0.4, cy - height * 0.4
      );
      
      // Top left notch (characteristic sakura indent)
      ctx.quadraticCurveTo(cx - width * 0.1, cy - height * 0.5, cx, cy - height * 0.3);
      
      // Top right notch
      ctx.quadraticCurveTo(cx + width * 0.1, cy - height * 0.5, cx + width * 0.4, cy - height * 0.4);
      
      // Right side curve
      ctx.bezierCurveTo(
        cx + width * 0.7, cy - height * 0.2,
        cx + width * 0.3, cy + height * 0.1,
        cx, cy + height * 0.4
      );
      
    } else if (type === 1) {
      // Type B: Double-notched sakura petal (ヤマザクラ風)
      const width = 3.5 * scale;
      const height = 5.5 * scale;
      
      // Start from bottom
      ctx.moveTo(cx, cy + height * 0.5);
      
      // Left side with double curve
      ctx.bezierCurveTo(
        cx - width * 0.4, cy + height * 0.1,
        cx - width * 0.8, cy - height * 0.1,
        cx - width * 0.5, cy - height * 0.3
      );
      
      // Deep notch characteristic of some sakura varieties
      ctx.quadraticCurveTo(cx - width * 0.2, cy - height * 0.4, cx - width * 0.1, cy - height * 0.2);
      ctx.quadraticCurveTo(cx, cy - height * 0.5, cx + width * 0.1, cy - height * 0.2);
      ctx.quadraticCurveTo(cx + width * 0.2, cy - height * 0.4, cx + width * 0.5, cy - height * 0.3);
      
      // Right side
      ctx.bezierCurveTo(
        cx + width * 0.8, cy - height * 0.1,
        cx + width * 0.4, cy + height * 0.1,
        cx, cy + height * 0.5
      );
      
    } else {
      // Type C: Simple rounded sakura petal (シダレザクラ風)
      const width = 3 * scale;
      const height = 5 * scale;
      
      // Start from bottom
      ctx.moveTo(cx, cy + height * 0.5);
      
      // Gentle curved sides
      ctx.bezierCurveTo(
        cx - width * 0.5, cy + height * 0.2,
        cx - width * 0.6, cy - height * 0.1,
        cx - width * 0.3, cy - height * 0.4
      );
      
      // Gentle top curve with slight notch
      ctx.quadraticCurveTo(cx, cy - height * 0.45, cx + width * 0.3, cy - height * 0.4);
      
      // Right side
      ctx.bezierCurveTo(
        cx + width * 0.6, cy - height * 0.1,
        cx + width * 0.5, cy + height * 0.2,
        cx, cy + height * 0.5
      );
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add subtle petal veins for realism
    if (size > 6) { // Only add veins to larger petals
      const width = type === 0 ? 4 * scale : type === 1 ? 3.5 * scale : 3 * scale;
      const height = type === 0 ? 6 * scale : type === 1 ? 5.5 * scale : 5 * scale;
      
      ctx.strokeStyle = `rgba(255, 182, 193, 0.3)`;
      ctx.lineWidth = 0.5 * scale;
      
      ctx.beginPath();
      // Center vein
      ctx.moveTo(cx, cy + height * 0.3);
      ctx.lineTo(cx, cy - height * 0.2);
      
      // Side veins
      ctx.moveTo(cx - width * 0.2, cy + height * 0.1);
      ctx.quadraticCurveTo(cx - width * 0.1, cy, cx - width * 0.15, cy - height * 0.2);
      
      ctx.moveTo(cx + width * 0.2, cy + height * 0.1);
      ctx.quadraticCurveTo(cx + width * 0.1, cy, cx + width * 0.15, cy - height * 0.2);
      
      ctx.stroke();
    }
  }

  /**
   * バーストフェーズの開始処理
   * 
   * 機能:
   * - 画面幅に応じた追加花びらを生成（豪華な桜吹雪演出）
   * - 2.5秒間のバーストエフェクト実行
   * - その後通常モードに自動復帰
   */
  startBurstPhase() {
    this.isInBurstPhase = true;
    
    // バーストエフェクト用に追加の花びらを生成（画面幅の1/8個）
    const burstCount = Math.floor(window.innerWidth / 8);
    for (let i = 0; i < burstCount; i++) {
      this.petals.push(this.createPetal(false, true));
    }
    
    // 2.5秒後にバーストフェーズから通常フェーズへ移行
    setTimeout(() => {
      this.isInBurstPhase = false;
    }, 2500);
  }
  
  /**
   * 桜エフェクトの破棄処理
   * 
   * 機能:
   * - Canvasエレメントの適切な削除
   * - メモリリークの防止
   */
  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

/**
 * 桜エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 春の桜エフェクトの有効化/無効化
 * - バーストモードでの豪華な桜吹雪エフェクト
 * - 季節変更時のスムーズなエフェクト切り替え
 */
let sakuraEffect;
/**
 * 桜エフェクトを有効化
 * 
 * @param {boolean} withBurst - 初期バーストエフェクトの有無
 */
window.enableSakura = function(withBurst = false) {
  if (!sakuraEffect) {
    // 新しい桜エフェクトインスタンスを作成
    sakuraEffect = new SakuraEffect(withBurst);
    window.sakuraEffect = sakuraEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    sakuraEffect.canvas.style.display = '';
    
    // 既存エフェクトでバーストを要求された場合のバーストトリガー
    if (withBurst && !sakuraEffect.isInBurstPhase) {
      sakuraEffect.startBurstPhase();
    }
  }
};

/**
 * 桜エフェクトを無効化してリソースを解放
 */
window.disableSakura = function() {
  if (sakuraEffect) {
    sakuraEffect.destroy(); // インスタンスの適切な破棄処理
    sakuraEffect = null;
    window.sakuraEffect = null; // グローバル参照をクリア
  }
};

/**
 * 桜エフェクト用CSSスタイルの追加
 * 
 * 機能:
 * - フルスクリーン固定位置での桜Canvas表示
 * - マウスイベント無効化（pointer-events: none）
 * - 適切なz-indexとopacityによる美しい重ね表示
 */
// 桜エフェクト用CSSの定義
const sakuraCSS = `
.sakura-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.9;
}
`;

// CSSを動的にドキュメントヘッドに追加
const sakuraStyle = document.createElement('style');
sakuraStyle.textContent = sakuraCSS;
document.head.appendChild(sakuraStyle);

/**
 * 雨エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 梅雨シーズンの雨エフェクト有効化/無効化
 * - 没入感のある雨のアニメーションと水しぶきエフェクト
 * - 日本の梅雨の情悩を表現する雨音と雰囲気
 */
let rainEffect;
/**
 * 雨エフェクトを有効化
 */
window.enableRain = function() {
  if (!rainEffect) {
    // 新しい雨エフェクトインスタンスを作成
    rainEffect = new RainEffect();
    window.rainEffect = rainEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    rainEffect.canvas.style.display = '';
  }
};

/**
 * 雨エフェクトを無効化してリソースを解放
 */
window.disableRain = function() {
  if (rainEffect) {
    rainEffect.canvas.remove(); // Canvas要素をDOMから削除
    rainEffect = null; // インスタンスを破棄
    window.rainEffect = null; // グローバル参照もクリア
  }
};

/**
 * モジュールシステム対応のエクスポート処理
 * 
 * 機能:
 * - Node.js環境でのRainEffectとSakuraEffectクラスのエクスポート
 * - テスト環境やサーバーサイドでの利用を想定
 */
// CommonJS環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RainEffect, SakuraEffect };
}

/**
 * ロゴクリックイベントハンドラー
 * 
 * 機能:
 * - ホームページへのスクロールと梅雨モード設定
 * - 季節ギャラリーを梅雨（tsuyu）に設定
 * - 雨エフェクトの有効化
 * - アバウト画像のメイン画像へのリセット
 * - モバイルメニューの自動クローズ
 * - URLの適切な更新
 * 
 * @param {Event} event - クリックイベント
 */
window.handleLogoClick = function(event) {
  event.preventDefault(); // デフォルトのリンク動作を防止
  
  // 梅雨シーズンの設定（夏ギャラリーを表示したままでスクロールなし）
  if (window.seasonsGallery && typeof window.seasonsGallery.switchToSeason === 'function') {
    // 雨エフェクトとボディ属性用に現在の季節を梅雨に設定
    window.seasonsGallery.currentSeason = 'tsuyu';
    
    // スタイリング用のボディ季節データ更新
    document.body.setAttribute('data-season', 'tsuyu');
    
    // アバウト画像をメイン画像にリセット
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
      aboutImage.src = './img/秀歌.webp';
      aboutImage.srcset = './img/秀歌.webp';
      
      // picture要素のsourceも合わせて更新
      const pictureSource = aboutImage.parentElement.querySelector('source');
      if (pictureSource) {
        pictureSource.srcset = './img/秀歌.webp';
      }
    }
    
    // 雨エフェクトの有効化
    if (typeof window.enableRain === 'function') {
      window.enableRain();
    }
    
    // 夏ギャラリーパネルを表示状態に保持
    window.seasonsGallery.updateSeasonButtons('summer');
    window.seasonsGallery.updateSeasonPanels('summer', false);
    
    // 梅雨シーズンを反映したURL更新
    window.seasonsGallery.updateURL('tsuyu');
  }
  
  // モバイルメニューが開いている場合はクローズ
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  if (navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // スクロールを再有効化
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
  
  // リソースプリフェッチの初期化（重要画像の先読みで表示速度向上）
  initResourcePrefetching();

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
  
  // フッターの季節切り替えボタンのイベント設定
  setupFooterSeasonButtons();
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
                 tabindex="0"
                 playsinline
                 aria-label="${season.name}をテーマにしたデモ動画 - クリックまたはEnterキーで再生">
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
                <audio controls preload="none" aria-label="${track.title} - ${season.name}の楽曲">
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
      <span class="sr-only">${link.name}</span>
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

/**
 * 雪エフェクトモジュール（冬季専用）
 * 
 * 機能:
 * - Canvas上に美しい雪の結晶アニメーションを描画
 * - マウス操作に反応して風の強さを変化
 * - 雪片のサイズに応じてシンプルな円形または星形で描画
 * - 冬の季節感を演出する穏やかな密度と動き
 */
/**
 * 雪エフェクトモジュール（冬季専用）
 * 
 * 機能:
 * - Canvas上に美しい雪の結晶アニメーションを描画
 * - マウス操作に反応する雪片インタラクション
 * - 穏やかな風の変化による自然な雪の舞い
 * - 日本の冬の静寂で美しい雪景を演出
 */
class SnowEffect {
  /**
   * コンストラクタ - 雪エフェクトの初期化
   * 日本の冬の美しい雪景を再現するための設定と初期化
   */
  constructor() {
    // Canvas要素の作成と設定
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'snow-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // キャンバスサイズの設定
    this.resize();
    this.sizeMultiplier = this.getSizeMultiplier();
    window.addEventListener('resize', () => this.resize());

    // 雪片の初期化
    this.flakes = [];
    // 画面幅に基づく雪の密度 - 雨よりも稀な密度で静寂な冬を表現
    this.flakeCount = Math.floor(window.innerWidth / 8);
    for (let i = 0; i < this.flakeCount; i++) {
      this.flakes.push(this.createFlake(true));
    }

    // マウス・タッチインタラクションの設定
    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleMouseMove(e.touches[0]);
      }
    }, { passive: true });

    // 穏やかな漂いのための風変数
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /**
   * キャンバスサイズのリサイズ処理 - ウィンドウサイズ変更への動的対応
   * ブラウザのリサイズ時にキャンバスをウィンドウ全体に合わせ、雪片のサイズ倍率を再計算
   * @description レスポンシブデザインに対応し、あらゆるデバイスで適切な雪の演出を保証。
   *              スマートフォンから大画面まで、一貫した美しい冬の雪景の演出
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.sizeMultiplier = this.getSizeMultiplier();
  }

  /**
   * デバイスサイズ倍率の計算 - 画面サイズに応じた適切なスケーリング
   * 768pxを基準として画面サイズに応じた雪片のスケール倍率を算出
   * @returns {number} 0.6から1.2の範囲で制限されたサイズ倍率
   * @description モバイル端末では小さめの雪片、大画面では大きめの雪片で調整。
   *              どのデバイスでも美しい雪の演出を提供し、冬の静寂な美しさを最大化
   */
  getSizeMultiplier() {
    const ratio = window.innerWidth / 768;
    return Math.min(Math.max(ratio, 0.6), 1.2);
  }

  /**
   * 雪片オブジェクトの生成 - 本物の雪の結晶の美しさを再現
   * 日本の冬に特有の繊細で美しい雪片の物理的特性を総合的に表現
   * @param {boolean} randomY - Y座標をランダムに設定するかどうか（初期化時用）
   * @returns {Object} 雪片の物理プロパティを含むオブジェクト
   * @description 雪らしい穏やかな落下速度、繊細な回転動作、横方向への漂いなど、
   *              真の雪が持つ美しい特性をすべて再現したリアルな雪片オブジェクト
   */
  createFlake(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      size: (2 + Math.random() * 6) * this.sizeMultiplier, // レスポンシブな雪片サイズ
      speed: 0.5 + Math.random() * 1.5, // 雨よりも遅い穏やかな落下
      opacity: 0.4 + Math.random() * 0.6, // 雨よりも目立つ透明度
      drift: Math.random() * 0.5 - 0.25, // 左右への漂い動作
      rotationSpeed: (Math.random() - 0.5) * 2, // リアルさのための回転
      rotation: 0
    };
  }

  /**
   * マウス移動イベントハンドラー - 冬の穏やかな風をユーザー操作で制御
   * マウスの水平位置に応じて冬の風の方向を設定し、雪片の漂いを動的に制御
   * @param {MouseEvent|Touch} e - マウスイベントまたはタッチイベント
   * @description ユーザーがマウスを動かすとその方向に穏やかな冬の風が吹き、
   *              雪片が美しく漂うインタラクティブな冬の体験を提供
   */
  handleMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const normalized = (e.clientX - centerX) / centerX;
    this.windTarget = normalized * 0.5;
  }

  /**
   * 雪エフェクトのアニメーション処理 - 冬の静寂で美しい雪景の表現
   * 各フレームでの雪片の物理シミュレーションと描画を担当
   * @description 穏やかな風の変化、雪片の自然な落下、マウス操作への反応など、
   *              真の雪の美しい動きを総合的に表現する高品質な冬の演出
   */
  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 穏やかな風の更新 - 雨よりもゆっくりとした自然な風変化
    const now = performance.now();
    if (now - this.lastWindChange > 4000) {
      this.windTarget = (Math.random() * 2 - 1) * 0.5; // 冬らしい穏やかな風力
      this.lastWindChange = now;
    }
    // 現在の風を目標値に向けて徐々に変化させる（冬の静寂な風の表現）
    this.wind += (this.windTarget - this.wind) * 0.01;

    // 各雪片の描画と物理シミュレーション
    for (const flake of this.flakes) {
      ctx.globalAlpha = flake.opacity;
      
      // 純白の雪にわずかな青味を加えた自然な雪色
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      
      ctx.save();
      ctx.translate(flake.x, flake.y);
      ctx.rotate(flake.rotation);
      
      // 雪の結晶の形状描画 - サイズに応じて形状を変更
      if (flake.size > 4) {
        // 大きな雪片は美しい6角形の星形状で結晶を表現
        this.drawStar(ctx, 0, 0, flake.size / 2, flake.size / 4, 6);
      } else {
        // 小さな雪片はシンプルな円形で遠くの雪を表現
        ctx.beginPath();
        ctx.arc(0, 0, flake.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();

      // 雪片の位置更新 - 風と自然な漂いによる動き
      flake.x += this.wind + flake.drift;
      flake.y += flake.speed;
      flake.rotation += flake.rotationSpeed * 0.02;

      // 画面の左右端での循環処理 - 連続した雪の演出
      if (flake.x < -20) flake.x = this.canvas.width + 20;
      if (flake.x > this.canvas.width + 20) flake.x = -20;

      // 画面下端に到達した雪片を画面上部でリセット
      if (flake.y > this.canvas.height + 20) {
        Object.assign(flake, this.createFlake());
      }
    }

    requestAnimationFrame(this.animate);
  }

  /**
   * 雪の結晶形状の描画 - 美しい6角形の星形状で雪の結晶を表現
   * より大きな雪片に対して精密な結晶形状を描画し、冬の美しさを強調
   * @param {CanvasRenderingContext2D} ctx - キャンバス描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} outerRadius - 外側の頂点までの距離
   * @param {number} innerRadius - 内側の頂点までの距離
   * @param {number} spikes - 結晶の角数（通常は6角形）
   * @description 本物の雪の結晶のような美しい幾何学形状を描画し、
   *              冬の静寂で神秘的な雪景の演出を最大化
   */
  drawStar(ctx, cx, cy, outerRadius, innerRadius, spikes) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * 雪エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 雪エフェクトの有効化/無効化
 * - インスタンスの適切な管理とメモリリーク防止
 * - 季節変更時のスムーズなエフェクト切り替え
 */
let snowEffect;
/**
 * 雪エフェクトを有効化
 */
window.enableSnow = function() {
  if (!snowEffect) {
    // 新しい雪エフェクトインスタンスを作成
    snowEffect = new SnowEffect();
    window.snowEffect = snowEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    snowEffect.canvas.style.display = '';
  }
};

/**
 * 雪エフェクトを無効化してリソースを解放
 */
window.disableSnow = function() {
  if (snowEffect) {
    snowEffect.canvas.remove(); // Canvas要素をDOMから削除
    snowEffect = null; // インスタンスを破棄
    window.snowEffect = null; // グローバル参照もクリア
  }
};

/**
 * 雪エフェクト用CSSの動的注入
 * 雪のキャンバスのスタイルを動的に設定し、全画面に美しい雪の演出を提供
 * @description 固定位置でポインターイベントを無効化し、適切な透明度で冬の雪を表現
 */
const snowCSS = `
.snow-canvas {
  position: fixed;     /* 画面全体に固定 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* マウスイベントを通す */
  z-index: 1;          /* 背景の上、コンテンツの下 */
  opacity: 0.8;        /* 雪らしい穏やかな透明度 */
}
`;

// CSSスタイルの動的注入
const snowStyle = document.createElement('style');
snowStyle.textContent = snowCSS;
document.head.appendChild(snowStyle);

/**
 * 紅葉エフェクトモジュール（秋季専用）
 * 
 * 機能:
 * - もみじとイチョウの落ち葉アニメーション
 * - リアルな葉の形状をCanvasで描画（ベジェ曲線使用）
 * - 風による自然な舞い散りと回転動作
 * - 節節の英情を表現する適度な密度と色合い
 */
/**
 * 秋の落ち葉エフェクトモジュール（秋季専用）
 * 
 * 機能:
 * - Canvas上にもみじとイチョウの美しい落ち葉アニメーションを描画
 * - マウス操作に反応する落ち葉インタラクション
 * - 秋風の変化による自然な落ち葉の舞い
 * - 日本の秋の情緒ある紅葉シーンを演出
 */
class AutumnLeavesEffect {
  /**
   * コンストラクタ - 秋の落ち葉エフェクトの初期化
   * もみじとイチョウの美しい紅葉シーンを再現するための設定と初期化
   */
  constructor() {
    // Canvas要素の作成と設定
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'autumn-leaves-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // キャンバスサイズの設定
    this.resize();
    this.sizeMultiplier = this.getSizeMultiplier();
    window.addEventListener('resize', () => this.resize());

    // 落ち葉の初期化
    this.leaves = [];
    // 画面幅に基づく落ち葉の密度 - 適度な密度で秋の情緒を表現
    this.leafCount = Math.floor(window.innerWidth / 12);
    for (let i = 0; i < this.leafCount; i++) {
      this.leaves.push(this.createLeaf(true));
    }

    // マウス・タッチインタラクションの設定
    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleMouseMove(e.touches[0]);
      }
    }, { passive: true });

    // 自然な落ち葉の動きのための風変数
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /**
   * キャンバスサイズのリサイズ処理 - ウィンドウサイズ変更への動的対応
   * ブラウザのリサイズ時にキャンバスをウィンドウ全体に合わせ、落ち葉のサイズ倍率を再計算
   * @description レスポンシブデザインに対応し、あらゆるデバイスで適切な秋の紅葉演出を保証。
   *              スマートフォンから大画面まで、一貫した美しい秋の情緒ある演出
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.sizeMultiplier = this.getSizeMultiplier();
  }

  /**
   * デバイスサイズ倍率の計算 - 画面サイズに応じた適切な落ち葉スケーリング
   * 768pxを基準として画面サイズに応じた落ち葉のスケール倍率を算出
   * @returns {number} 0.6から1.2の範囲で制限されたサイズ倍率
   * @description モバイル端末では小さめの落ち葉、大画面では大きめの落ち葉で調整。
   *              どのデバイスでも美しい秋の紅葉演出を提供し、日本の秋の情緒を最大化
   */
  getSizeMultiplier() {
    const ratio = window.innerWidth / 768;
    return Math.min(Math.max(ratio, 0.6), 1.2);
  }

  /**
   * 落ち葉オブジェクトの生成 - もみじとイチョウの美しい紅葉の表現
   * 日本の秋に特有の美しいもみじ（楓）とイチョウ（銀杏）の物理的特性を総合的に表現
   * @param {boolean} randomY - Y座標をランダムに設定するかどうか（初期化時用）
   * @returns {Object} 落ち葉の物理プロパティと視覚的特性を含むオブジェクト
   * @description 自然な落下速度、風による揺れ、回転動作、季節の色合いなど、
   *              真の紅葉が持つ美しい特性をすべて再現した情緒ある秋の落ち葉オブジェクト
   */
  createLeaf(randomY = false) {
    const leafTypes = ['maple', 'ginkgo']; // もみじとイチョウ - 日本の代表的な紅葉樹
    const type = leafTypes[Math.floor(Math.random() * leafTypes.length)];
    
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -50,
      type: type, // 葉の種類（もみじまたはイチョウ）
      size: (8 + Math.random() * 16) * this.sizeMultiplier, // レスポンシブな落ち葉サイズ
      speed: 0.8 + Math.random() * 1.2, // 自然な落下速度
      opacity: 0.6 + Math.random() * 0.4, // 十分な視認性
      drift: Math.random() * 1 - 0.5, // 左右への漂い動作
      rotationSpeed: (Math.random() - 0.5) * 3, // 回転運動
      rotation: Math.random() * Math.PI * 2, // 初期回転角
      swayAmplitude: 20 + Math.random() * 30, // 揺れの振幅
      swaySpeed: 0.02 + Math.random() * 0.03, // 揺れの速度
      swayOffset: Math.random() * Math.PI * 2, // 位相オフセット（多様な動きのため）
      color: this.getLeafColor(type) // 葉の種類に応じた季節の色彩
    };
  }

  /**
   * 葉の季節色取得 - もみじとイチョウの美しい秋色を再現
   * 日本の秋の紅葉で見られる自然な色合いをリアルに表現
   * @param {string} type - 葉の種類（'maple': もみじ, 'ginkgo': イチョウ）
   * @returns {Object} RGB値を持つ色オブジェクト
   * @description 各樹種の特徴的な紅葉色を精密に再現。もみじは赤〜オレンジ系、
   *              イチョウは黄色〜金色系で、日本の秋の美しい自然色を完全表現
   */
  getLeafColor(type) {
    if (type === 'maple') {
      // もみじ（楓）の色 - 深い赤から鮮やかなオレンジまでの紅葉色
      const colors = [
        { r: 200, g: 30, b: 30 },   // 深い赤（深紅）
        { r: 220, g: 20, b: 60 },   // クリムゾン（紅色）
        { r: 255, g: 69, b: 0 },    // オレンジ赤（朱色）
        { r: 255, g: 120, b: 0 },   // 鮮やかなオレンジ
        { r: 255, g: 160, b: 0 }    // 明るいオレンジ
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      // イチョウ（銀杏）の色 - 金色から薄黄色までの美しい黄葉色
      const colors = [
        { r: 255, g: 215, b: 0 },   // 金色（きんいろ）
        { r: 255, g: 223, b: 0 },   // 明るい金色
        { r: 255, g: 255, b: 0 },   // 純黄色
        { r: 238, g: 221, b: 130 }, // 薄い黄色
        { r: 255, g: 239, b: 145 }  // クリーム色
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  /**
   * マウス移動イベントハンドラー - 秋風をユーザー操作で制御
   * マウスの水平位置に応じて秋風の方向を設定し、落ち葉の舞いを動的に制御
   * @param {MouseEvent|Touch} e - マウスイベントまたはタッチイベント
   * @description ユーザーがマウスを動かすとその方向に秋風が吹き、
   *              もみじとイチョウが美しく舞い散るインタラクティブな秋の体験を提供
   */
  handleMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const normalized = (e.clientX - centerX) / centerX;
    this.windTarget = normalized * 1.5; // 秋風の強さ設定
  }

  /**
   * 紅葉エフェクトのアニメーション処理 - 秋の情緒ある紅葉景の表現
   * 各フレームでの落ち葉の物理シミュレーションと精密な描画を担当
   * @description 秋風の変化、落ち葉の自然な舞い、マウス操作への反応など、
   *              もみじとイチョウの美しい舞い散りを総合的に表現する高品質な秋の演出
   */
  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 秋風の更新 - 雨よりも動的で多彩な風変化
    const now = performance.now();
    if (now - this.lastWindChange > 3500) {
      this.windTarget = (Math.random() * 2 - 1) * 1.5; // 適度な秋風の強さ
      this.lastWindChange = now;
    }
    // 現在の風を目標値に向けて徐々に変化させる（秋風の自然な流れ）
    this.wind += (this.windTarget - this.wind) * 0.015;

    // 各落ち葉の描画と物理シミュレーション
    for (const leaf of this.leaves) {
      ctx.globalAlpha = leaf.opacity;
      
      const time = now * 0.001; // ミリ秒を秒に変換
      const swayX = Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude;
      
      ctx.save();
      ctx.translate(leaf.x + swayX, leaf.y);
      ctx.rotate(leaf.rotation);
      
      // 葉の季節色設定 - 秋の美しい紅葉色
      const { r, g, b } = leaf.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${leaf.opacity})`;
      
      // 葉の種類に応じた形状描画 - もみじとイチョウの特徴的な形状
      if (leaf.type === 'maple') {
        this.drawMapleLeaf(ctx, 0, 0, leaf.size); // もみじの手のひら形状
      } else {
        this.drawGinkgoLeaf(ctx, 0, 0, leaf.size); // イチョウの扇形状
      }
      
      ctx.restore();

      // 落ち葉の位置更新 - 風と自然な漂いによる動き
      leaf.x += this.wind + leaf.drift;
      leaf.y += leaf.speed;
      leaf.rotation += leaf.rotationSpeed * 0.02;

      // 画面の左右端での循環処理 - 連続した紅葉の演出
      if (leaf.x < -50) leaf.x = this.canvas.width + 50;
      if (leaf.x > this.canvas.width + 50) leaf.x = -50;

      // 画面下端に到達した落ち葉を画面上部でリセット
      if (leaf.y > this.canvas.height + 50) {
        Object.assign(leaf, this.createLeaf());
      }
    }

    requestAnimationFrame(this.animate);
  }

  /**
   * もみじ（楓）の葉形描画 - 日本の秋を代表する美しい手のひら形状
   * もみじの特徴的な5裂の手のひら形状を精密に描画し、秋の情緒を表現
   * @param {CanvasRenderingContext2D} ctx - キャンバス描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} size - 葉のサイズ
   * @description 本物のもみじの葉のような美しい幾何学形状を描画し、
   *              日本の秋の伝統的な美しさを表現する紅葉のシンボル
   */
  drawMapleLeaf(ctx, cx, cy, size) {
    const s = size / 15;

      ctx.beginPath();
      ctx.moveTo(cx, cy - 9 * s);
      ctx.lineTo(cx - 2 * s, cy - 6 * s);
      ctx.lineTo(cx - 7 * s, cy - 8 * s);
      ctx.lineTo(cx - 4 * s, cy - 3 * s);
      ctx.lineTo(cx - 9 * s, cy - 2 * s);
      ctx.lineTo(cx - 5 * s, cy + 1 * s);
      ctx.lineTo(cx - 7 * s, cy + 6 * s);
      ctx.lineTo(cx, cy + 3 * s);
      ctx.lineTo(cx + 7 * s, cy + 6 * s);
      ctx.lineTo(cx + 5 * s, cy + 1 * s);
      ctx.lineTo(cx + 9 * s, cy - 2 * s);
      ctx.lineTo(cx + 4 * s, cy - 3 * s);
      ctx.lineTo(cx + 7 * s, cy - 8 * s);
      ctx.lineTo(cx + 2 * s, cy - 6 * s);
      ctx.closePath();
      ctx.fill();
  }

  /**
   * イチョウ（銀杏）の葉形描画 - 秋の黄金色の美しい扇形状
   * イチョウの特徴的な扇形と中央の切り込みを精密に描画し、秋の黄葉を表現
   * @param {CanvasRenderingContext2D} ctx - キャンバス描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} size - 葉のサイズ
   * @description 本物のイチョウの葉のような美しい扇形状と特徴的な切り込みを描画し、
   *              日本の秋の黄金色の美しさを表現する黄葉のシンボル
   */
  drawGinkgoLeaf(ctx, cx, cy, size) {
    const scale = size / 20;
    
      ctx.beginPath();

      // Soft fan-shaped ginkgo leaf
      ctx.moveTo(cx, cy + 8 * scale);
      ctx.quadraticCurveTo(cx - 8 * scale, cy + 6 * scale, cx - 8 * scale, cy);
      ctx.quadraticCurveTo(cx - 8 * scale, cy - 6 * scale, cx, cy - 8 * scale);
      ctx.quadraticCurveTo(cx + 8 * scale, cy - 6 * scale, cx + 8 * scale, cy);
      ctx.quadraticCurveTo(cx + 8 * scale, cy + 6 * scale, cx, cy + 8 * scale);
      ctx.closePath();
      ctx.fill();

      // Characteristic notch at the center
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(cx - 2 * scale, cy - 2 * scale, cx, cy - 4 * scale);
      ctx.quadraticCurveTo(cx + 2 * scale, cy - 2 * scale, cx, cy);
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
  }
}

/**
 * 紅葉エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 秋の紅葉エフェクトの有効化/無効化
 * - もみじとイチョウの美しい落ち葉アニメーション制御
 * - メモリリークを防止する適切なリソース管理
 */
let autumnLeavesEffect;
/**
 * 紅葉エフェクトを有効化
 */
window.enableAutumnLeaves = function() {
  if (!autumnLeavesEffect) {
    // 新しい紅葉エフェクトインスタンスを作成
    autumnLeavesEffect = new AutumnLeavesEffect();
    window.autumnLeavesEffect = autumnLeavesEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    autumnLeavesEffect.canvas.style.display = '';
  }
};

/**
 * 紅葉エフェクトを無効化してリソースを解放
 */
window.disableAutumnLeaves = function() {
  if (autumnLeavesEffect) {
    autumnLeavesEffect.canvas.remove(); // Canvas要素をDOMから削除
    autumnLeavesEffect = null; // インスタンスを破棄
    window.autumnLeavesEffect = null; // グローバル参照もクリア
  }
};

/**
 * 紅葉エフェクト用CSSの動的注入
 * 秋の落ち葉のキャンバスのスタイルを動的に設定し、全画面に美しい紅葉の演出を提供
 * @description 固定位置でポインターイベントを無効化し、秋の情緒を表現する透明度を設定
 */
const autumnLeavesCSS = `
.autumn-leaves-canvas {
  position: fixed;     /* 画面全体に固定 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* マウスイベントを通す */
  z-index: 1;          /* 背景の上、コンテンツの下 */
  opacity: 0.9;        /* 紅葉らしいやや高めの透明度 */
}
`;

// CSSスタイルの動的注入
const autumnLeavesStyle = document.createElement('style');
autumnLeavesStyle.textContent = autumnLeavesCSS;
document.head.appendChild(autumnLeavesStyle);

/**
 * 夏の柳エフェクトモジュール（青柳エフェクト）
 * 
 * 機能:
 * - 青々とした柳の葉が風にそよぐアニメーション
 * - 細長い柳の葉の形状を精密に描画
 * - 夏の風による大きな揺れと流れるような動き
 * - 夏の涼しさを表現する緑のグラデーションと清涼感
 */
class SummerWillowEffect {
  /**
   * コンストラクタ - 夏の柳エフェクトの初期化
   * 青々とした柳の葉が風にそよぐ美しい夏の情景を再現するための設定と初期化
   * @description 日本の夏の涼しげと流れるような柳の葉の動きを表現し、
   *              涼風を感じる夏の美しい情景をつくり出す。細長い柳葉の特徴を生かした豊かなアニメーション
   */
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'summer-willow-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.willowLeaves = [];
    // 柳葉の密度 - 繊細で流れるような夏の表現
    this.leafCount = Math.floor(window.innerWidth / 10); // 適度な密度で涼しげを表現
    for (let i = 0; i < this.leafCount; i++) {
      this.willowLeaves.push(this.createWillowLeaf(true));
    }

    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleMouseMove(e.touches[0]);
      }
    }, { passive: true });

    // 穏やかな夏風のための風変数 - 涼風の表現
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /**
   * キャンバスサイズのリサイズ処理 - ウィンドウサイズ変更への動的対応
   * ブラウザのリサイズ時にキャンバスをウィンドウ全体に合わせ、柳葉の流れるような動きを保持
   * @description レスポンシブデザインに対応し、あらゆるデバイスで適切な夏の柳演出を保証。
   *              スマートフォンから大画面まで、一貫した涼しげのある夏の情景演出
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * 柳葉オブジェクトの生成 - 細長い柳葉の美しい流れる動きを表現
   * 日本の夏に特有の柳の葉の物理的特性と美しい動きを総合的に表現
   * @param {boolean} randomY - Y座標をランダムに設定するかどうか（初期化時用）
   * @returns {Object} 柳葉の物理プロパティと視覚的特性を含むオブジェクト
   * @description 柳らしい細長い形状、風に大きく反応する性質、涼しげを表現する青緑色など、
   *              真の柳葉が持つ美しい特性をすべて再現した夏らしい柳葉オブジェクト
   */
  createWillowLeaf(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -30,
      length: 15 + Math.random() * 25, // 柳葉の特徴的な細長い形状
      width: 3 + Math.random() * 4, // 他の葉よりも非常に細い
      speed: 0.4 + Math.random() * 0.8, // 水平方向の動きを強調するためのゲっくりした落下
      opacity: 0.5 + Math.random() * 0.4, // 控えめな視認性
      drift: Math.random() * 2 - 1, // 左右への動きを強化
      rotationSpeed: (Math.random() - 0.5) * 2.5, // よりダイナミックな回転
      rotation: Math.random() * Math.PI * 2, // 初期回転角
      swayAmplitude: 50 + Math.random() * 60, // 非常に目立つ揺れ
      swaySpeed: 0.02 + Math.random() * 0.025, // わずかに速い揺れ
      swayOffset: Math.random() * Math.PI * 2, // 位相オフセット
      curvature: 0.1 + Math.random() * 0.3, // 柳葉の自然な曲線
      windResistance: 0.3 + Math.random() * 0.7, // 葉が風に反応する程度
      turbulence: Math.random() * 0.5, // ランダムな乱流要素
      color: this.getWillowColor() // 夏らしい青緑色
    };
  }

  /**
   * 柳葉の夏色取得 - 青柳の涼しげある美しい青緑色を再現
   * 日本の夏の柳で見られる涼しげを表現する自然な青緑色をリアルに表現
   * @returns {Object} RGB値を持つ色オブジェクト
   * @description 青柳（あおやのぎ）の特徴的な緑色を精密に再現。深い緑から新緑まで、
   *              青緑色を含む幅広い色合いで、夏の涼しげと柳の美しい自然色を完全表現
   */
  getWillowColor() {
    // 青柳 - 青みを含んだ様々な緑の陰影で涼しげを表現
    const colors = [
      { r: 50, g: 150, b: 50 },   // 深い緑（深緑）
      { r: 60, g: 180, b: 60 },   // 明るい緑（明緑）
      { r: 40, g: 140, b: 80 },   // 青緑（清涼な青緑）
      { r: 70, g: 160, b: 70 },   // 柔らかい緑
      { r: 80, g: 200, b: 80 },   // 新緑（若葉色）
      { r: 45, g: 130, b: 90 },   // 深い青緑
      { r: 90, g: 190, b: 90 }    // 薄い緑（淡緑）
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * マウス移動イベントハンドラー - 夏風をユーザー操作で制御
   * マウスの水平位置に応じて夏風の方向を設定し、柳葉の流れを動的に制御
   * @param {MouseEvent|Touch} e - マウスイベントまたはタッチイベント
   * @description ユーザーがマウスを動かすとその方向に涼しい夏風が吹き、
   *              柳の葉が美しく流れるようにそよぐインタラクティブな夏の体験を提供
   */
  handleMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const normalized = (e.clientX - centerX) / centerX;
    this.windTarget = normalized * 3.5; // 夏風の強さ設定（秋よりも強め）
  }

  /**
   * 夏の柳エフェクトのアニメーション処理 - 涼しげのある夏の柳景の表現
   * 各フレームでの柳葉の物理シミュレーションと流らかな描画を担当
   * @description 夏風の変化、柳葉の美しい流れ、マウス操作への反応など、
   *              青柳の美しいそよぎを総合的に表現する高品質な夏の演出
   */
  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 夏風の更新 - 流れるような効果のための強めの夏風
    const now = performance.now();
    if (now - this.lastWindChange > 3000) {
      this.windTarget = (Math.random() * 2 - 1) * 3.5; // 流れる効果のための強い風
      this.lastWindChange = now;
    }
    // 現在の風を目標値に向けて弐々に変化させる（夏風の自然な流れ）
    this.wind += (this.windTarget - this.wind) * 0.02;

    // 各柳葉の描画と物理シミュレーション
    for (const leaf of this.willowLeaves) {
      ctx.globalAlpha = leaf.opacity;
      
      const time = now * 0.001; // ミリ秒を秒に変換
      const swayX = Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude;
      
      ctx.save();
      ctx.translate(leaf.x + swayX, leaf.y);
      
      // 風の影響を受けた回転 - 葉が風の方向に傾く
      const windTilt = this.wind * 0.1;
      ctx.rotate(leaf.rotation + windTilt);
      
      // 柳葉の夏色設定 - 涼しげのある青緑色
      const { r, g, b } = leaf.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${leaf.opacity})`;
      ctx.strokeStyle = `rgba(${r - 20}, ${g - 20}, ${b - 10}, ${leaf.opacity * 0.8})`;
      ctx.lineWidth = 0.5;
      
      // 柳葉の描画 - 長く、細く、わずかに曲がった特徴的な形状
      this.drawWillowLeaf(ctx, 0, 0, leaf.length, leaf.width, leaf.curvature);
      
      ctx.restore();

      // 柳葉の位置更新 - 風に吹かれる動き
      const windForce = this.wind * leaf.windResistance;
      const turbulenceX = Math.sin(now * 0.001 * leaf.turbulence) * 0.5;
      const turbulenceY = Math.cos(now * 0.0015 * leaf.turbulence) * 0.3;
      
      leaf.x += windForce + leaf.drift + turbulenceX;
      leaf.y += leaf.speed + Math.abs(windForce) * 0.1 + turbulenceY; // 風は垂直方向の動きにも影響
      leaf.rotation += leaf.rotationSpeed * 0.02 + Math.abs(windForce) * 0.01; // 風は回転にも影響

      // 画面の左右端での循環処理 - 連続した柳の演出
      if (leaf.x < -60) leaf.x = this.canvas.width + 60;
      if (leaf.x > this.canvas.width + 60) leaf.x = -60;

      // 画面下端に到達した柳葉を画面上部でリセット
      if (leaf.y > this.canvas.height + 60) {
        Object.assign(leaf, this.createWillowLeaf());
      }
    }

    requestAnimationFrame(this.animate);
  }

  /**
   * 柳葉形状の描画 - 細長い柳葉の美しい曲線を表現
   * 青柳の特徴的な細長い形状と自然な曲線を精密に描画し、夏の涼しげを表現
   * @param {CanvasRenderingContext2D} ctx - キャンバス描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} length - 葉の長さ
   * @param {number} width - 葉の幅
   * @param {number} curvature - 葉の曲がり具合
   * @description 本物の柳葉のような美しい細長い形状と特徴的な中央線を描画し、
   *              日本の夏の涼しげと柳の美しさを表現する青緑色のシンボル
   */
  drawWillowLeaf(ctx, cx, cy, length, width, curvature) {
    ctx.beginPath();
    
    // 曲線的で細長い葉の形状を作成
    const halfLength = length / 2;
    const halfWidth = width / 2;
    
    // 曲線的な柳葉の制御点
    ctx.moveTo(cx, cy - halfLength);
    
    // 右側の曲線 - 柳葉の自然な曲がりを表現
    ctx.quadraticCurveTo(
      cx + halfWidth + curvature * 10, cy - halfLength * 0.3,
      cx + halfWidth, cy
    );
    ctx.quadraticCurveTo(
      cx + halfWidth - curvature * 5, cy + halfLength * 0.3,
      cx, cy + halfLength
    );
    
    // 左側の曲線 - 対称的で美しい柳葉の形状
    ctx.quadraticCurveTo(
      cx - halfWidth + curvature * 5, cy + halfLength * 0.3,
      cx - halfWidth, cy
    );
    ctx.quadraticCurveTo(
      cx - halfWidth - curvature * 10, cy - halfLength * 0.3,
      cx, cy - halfLength
    );
    
    ctx.closePath();
    ctx.fill();
    
    // リアルさのための微細な中央線描画
    ctx.beginPath();
    ctx.moveTo(cx, cy - halfLength * 0.8);
    ctx.quadraticCurveTo(
      cx + curvature * 3, cy,
      cx, cy + halfLength * 0.8
    );
    ctx.stroke();
  }
}

/**
 * 夏の柳エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 夏の青柳エフェクトの有効化/無効化
 * - 風にそよぐ柳の葉の美しいアニメーション制御
 * - 夏の涼しさを表現する緑のエフェクト管理
 */
let summerWillowEffect;
/**
 * 夏の柳エフェクトを有効化
 */
window.enableSummerWillow = function() {
  if (!summerWillowEffect) {
    // 新しい夏柳エフェクトインスタンスを作成
    summerWillowEffect = new SummerWillowEffect();
    window.summerWillowEffect = summerWillowEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    summerWillowEffect.canvas.style.display = '';
  }
};

/**
 * 夏の柳エフェクトを無効化してリソースを解放
 */
window.disableSummerWillow = function() {
  if (summerWillowEffect) {
    summerWillowEffect.canvas.remove(); // Canvas要素をDOMから削除
    summerWillowEffect = null; // インスタンスを破棄
    window.summerWillowEffect = null; // グローバル参照もクリア
  }
};

/**
 * 夏の柳エフェクト用CSSの動的注入
 * 夏の柳葉のキャンバスのスタイルを動的に設定し、全画面に涼しげのある柳の演出を提供
 * @description 固定位置でポインターイベントを無効化し、夏の涼しげを表現する透明度を設定
 */
const summerWillowCSS = `
.summer-willow-canvas {
  position: fixed;     /* 画面全体に固定 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* マウスイベントを通す */
  z-index: 1;          /* 背景の上、コンテンツの下 */
  opacity: 0.85;       /* 柳らしい涼しげのある透明度 */
}
`;

// CSSスタイルの動的注入
const summerWillowStyle = document.createElement('style');
summerWillowStyle.textContent = summerWillowCSS;
document.head.appendChild(summerWillowStyle);