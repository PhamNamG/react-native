import { Pressable, Dimensions, StyleSheet, Platform } from 'react-native';
import { useState } from 'react';
import React from 'react';
import { WebView } from 'react-native-webview';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface IframeVideoPlayerProps {
  videoUrl: string;
  episodeNumber: string;
  seriesName: string;
  seriesNameChinese?: string;
  onBack: () => void;
}

export const IframeVideoPlayer: React.FC<IframeVideoPlayerProps> = ({
  videoUrl,
  episodeNumber,
  seriesName,
  seriesNameChinese,
  onBack,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  const handlePlayPause = () => {
    // Toggle play state
    setIsPlaying(!isPlaying);
  };
  // Kiểm tra xem có phải CDN whitelist không
  const isWhitelistedCDN = (url: string) => {
    const cdnDomains = [
      'loadvid.com', 'cdn.loadvid.com',
      'vevocloud.com', 'voe.sx',
      'streamtape.com', 'mixdrop.co',
      'doodstream.com'
    ];
    return cdnDomains.some(domain => url.toLowerCase().includes(domain));
  };

  // Script chặn popup, quảng cáo và video ads
  const adBlockScript = `
    (function() {
      'use strict';
      
      // Whitelist các CDN video
      var whitelistedCDNs = [
        'loadvid.com', 'cdn.loadvid.com',
        'vevocloud.com', 'voe.sx',
        'streamtape.com', 'mixdrop.co',
        'doodstream.com'
      ];
      
      var currentURL = window.location.href.toLowerCase();
      var isWhitelisted = whitelistedCDNs.some(function(cdn) {
        return currentURL.includes(cdn);
      });
      
      // Nếu là CDN whitelist, không chạy ad blocker
      if (isWhitelisted) {
        console.log('✅ Whitelisted CDN detected, ad blocker disabled');
        return;
      }
      
      // Chặn window.open (popup) - aggressive blocking
      var originalOpen = window.open;
      window.open = function() {
        console.log('⛔ Popup blocked');
        return { 
          closed: false,
          close: function() {},
          focus: function() {},
          blur: function() {}
        };
      };
      
      // Chặn alert, confirm, prompt
      window.alert = function() { return true; };
      window.confirm = function() { return true; };
      window.prompt = function() { return null; };
      
      // Chặn redirect và navigation
      var originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        get: function() { return originalLocation; },
        set: function(value) {
          console.log('⛔ Redirect blocked:', value);
          return originalLocation;
        }
      });
      
      // Chặn window.location methods
      ['assign', 'replace', 'reload'].forEach(function(method) {
        var original = window.location[method];
        window.location[method] = function(url) {
          if (url && url.toString().includes(window.location.hostname)) {
            return original.apply(this, arguments);
          }
          console.log('⛔ Navigation blocked:', method, url);
          return false;
        };
      });
      
      // Whitelist các CDN video được phép
      var allowedCDNs = [
        'loadvid.com',
        'cdn.loadvid.com',
        'dailymotion.com',
        'dmcdn.net',
        'vevocloud.com',
        'voe.sx',
        'streamtape.com',
        'mixdrop.co',
        'doodstream.com'
      ];
      
      // Chặn các domain quảng cáo
      var blockedDomains = [
        'doubleclick.net',
        'googlesyndication.com',
        'googleadservices.com',
        'google-analytics.com',
        'adnxs.com',
        'advertising.com',
        'popads.net',
        'popcash.net',
        'propellerads.com',
        'mgid.com',
        'exoclick.com',
        'ads-click.com',
        'adservice',
        'adsystem',
        'adserver',
        'banner',
        'popup',
        'popunder',
        'prebid',
        'outbrain',
        'taboola',
        'revcontent',
        'zergnet'
      ];
      
      // Override fetch
      var originalFetch = window.fetch;
      window.fetch = function(url) {
        var urlString = url.toString().toLowerCase();
        
        // Cho phép các CDN whitelist
        var isAllowedCDN = allowedCDNs.some(function(cdn) {
          return urlString.includes(cdn);
        });
        if (isAllowedCDN) {
          return originalFetch.apply(this, arguments);
        }
        
        // Block ads
        for (var i = 0; i < blockedDomains.length; i++) {
          if (urlString.includes(blockedDomains[i])) {
            console.log('⛔ Ad fetch blocked:', urlString);
            return Promise.reject('Ad blocked');
          }
        }
        return originalFetch.apply(this, arguments);
      };
      
      // Override XMLHttpRequest
      var originalXHR = window.XMLHttpRequest;
      window.XMLHttpRequest = function() {
        var xhr = new originalXHR();
        var originalOpen = xhr.open;
        xhr.open = function(method, url) {
          var urlString = url.toString().toLowerCase();
          
          // Cho phép các CDN whitelist
          var isAllowedCDN = allowedCDNs.some(function(cdn) {
            return urlString.includes(cdn);
          });
          if (isAllowedCDN) {
            return originalOpen.apply(this, arguments);
          }
          
          // Block ads
          for (var i = 0; i < blockedDomains.length; i++) {
            if (urlString.includes(blockedDomains[i])) {
              console.log('⛔ XHR ad blocked:', urlString);
              return;
            }
          }
          return originalOpen.apply(this, arguments);
        };
        return xhr;
      };
      
      // Chặn document.write/writeln
      document.write = function() { console.log('⛔ document.write blocked'); return false; };
      document.writeln = function() { console.log('⛔ document.writeln blocked'); return false; };
      
      // Chặn createElement cho iframe ads
      var originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        var element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'iframe') {
          var originalSetAttribute = element.setAttribute;
          element.setAttribute = function(name, value) {
            if (name === 'src') {
              var valueLower = value.toString().toLowerCase();
              
              // Cho phép các CDN whitelist
              var isAllowedCDN = allowedCDNs.some(function(cdn) {
                return valueLower.includes(cdn);
              });
              if (isAllowedCDN) {
                return originalSetAttribute.apply(this, arguments);
              }
              
              // Block ads
              for (var i = 0; i < blockedDomains.length; i++) {
                if (valueLower.includes(blockedDomains[i])) {
                  console.log('⛔ Iframe ad blocked:', value);
                  return;
                }
              }
            }
            return originalSetAttribute.apply(this, arguments);
          };
        }
        return element;
      };
      
      // Chặn addEventListener cho click events (popup triggers)
      var originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'click' || type === 'mousedown' || type === 'touchstart') {
          var wrappedListener = function(e) {
            // Nếu event không phải từ user interaction thực sự, block nó
            if (!e.isTrusted) {
              console.log('⛔ Fake click blocked');
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
            return listener.apply(this, arguments);
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.apply(this, arguments);
      };
      
      // Prevent context menu
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
      }, true);
      
      // Remove ads elements - aggressive cleanup
      function removeAds() {
        var adSelectors = [
          // Iframe ads
          'iframe[src*="ad"]',
          'iframe[src*="banner"]',
          'iframe[src*="popup"]',
          'iframe[src*="doubleclick"]',
          'iframe[src*="googlesyndication"]',
          'iframe[id*="ad"]',
          'iframe[class*="ad"]',
          // Video ads
          'video[src*="ad"]',
          'video[id*="ad"]',
          'video[class*="ad"]',
          // Div/container ads
          '[id*="google_ads"]',
          '[class*="adsbygoogle"]',
          '[id*="ad-"]',
          '[class*="ad-"]',
          '[id*="ads-"]',
          '[class*="ads-"]',
          '[id*="banner"]',
          '[class*="banner"]',
          '[id*="popup"]',
          '[class*="popup"]',
          '.advertisement',
          '#advertisement',
          '[data-ad]',
          '[data-ads]'
        ];
        
        adSelectors.forEach(function(selector) {
          try {
            var elements = document.querySelectorAll(selector);
            elements.forEach(function(el) {
              console.log('⛔ Removed ad element:', el.tagName, el.id || el.className);
              el.remove();
            });
          } catch(e) {}
        });
      }
      
      // Run cleanup multiple times
      setTimeout(removeAds, 500);
      setTimeout(removeAds, 1000);
      setTimeout(removeAds, 2000);
      setTimeout(removeAds, 3000);
      
      // Monitor DOM changes
      var observer = new MutationObserver(function(mutations) {
        removeAds();
      });
      
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      
      window.addEventListener('load', function() {
        removeAds();
        console.log('✅ Advanced ad blocker initialized');
      });
      
      // Chặn video autoplay ads
      document.addEventListener('play', function(e) {
        var video = e.target;
        if (video.tagName === 'VIDEO') {
          var src = video.src || video.currentSrc || '';
          var srcLower = src.toLowerCase();
          
          // Cho phép các CDN video whitelist
          var isAllowedCDN = allowedCDNs.some(function(cdn) {
            return srcLower.includes(cdn);
          });
          
          if (isAllowedCDN) {
            console.log('✅ Video from allowed CDN:', src);
            return true;
          }
          
          // Block ads từ blocked domains
          for (var i = 0; i < blockedDomains.length; i++) {
            if (srcLower.includes(blockedDomains[i])) {
              console.log('⛔ Video ad blocked:', src);
              video.pause();
              video.remove();
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }
        }
      }, true);
      
    })();
  `;

  // Kiểm tra xem video URL có phải từ CDN whitelist không
  const isWhitelistedVideo = isWhitelistedCDN(videoUrl);

  // HTML cho iframe với full screen support và ad blocking
  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background-color: #000;
            overflow: hidden;
          }
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            pointer-events: auto;
          }
          /* Aggressive ad hiding */
          [id*="ad-"], [class*="ad-"],
          [id*="ads"], [class*="ads"],
          [id*="banner"], [class*="banner"],
          [id*="popup"], [class*="popup"],
          [id*="overlay"], [class*="overlay"],
          [data-ad], [data-ads],
          .advertisement, #advertisement,
          .adsbygoogle,
          iframe[src*="ad"],
          iframe[src*="banner"],
          iframe[src*="popup"],
          video[src*="ad"],
          div[id*="google_ads"],
          div[class*="ad_"],
          div[class*="_ad"],
          a[href*="ads"],
          a[href*="ad."],
          a[href*="banner"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
            pointer-events: none !important;
          }
          
          /* Block overlay popups */
          body > div[style*="position: fixed"],
          body > div[style*="position: absolute"][style*="z-index"] {
            pointer-events: none !important;
          }
        </style>
        <script>${adBlockScript}</script>
      </head>
      <body>
        <iframe 
          src="${videoUrl}" 
          allowfullscreen
          ${isWhitelistedVideo 
            ? '' 
            : 'sandbox="allow-same-origin allow-scripts allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox allow-modals allow-top-navigation allow-top-navigation-by-user-activation"'
          }
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; display-capture"
          webkitallowfullscreen
          mozallowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          loading="eager"
        ></iframe>
      </body>
    </html>
  `;

  // Handle navigation để chặn redirect
  const handleShouldStartLoadWithRequest = (request: any) => {
    const { url } = request;
    
    // Danh sách domain được phép
    const allowedDomains = [
      'dailymotion.com',
      'dai.ly',
      'dmcdn.net',
      'about:blank',
      'blob:',
      'data:',
      'loadvid.com',
      'cdn.loadvid.com',
      'vevocloud.com',
      'voe.sx',
      'voe-unblock.com',
      'streamtape.com',
      'mixdrop.co',
      'mixdrop.to',
      'doodstream.com'
    ];
    
    // Danh sách keywords ads cần block
    const blockedKeywords = [
      'ad',
      'ads',
      'banner',
      'popup',
      'click',
      'track',
      'analytics',
      'doubleclick',
      'googlesyndication',
      'adservice',
      'advertising',
      'popunder',
      'redirect'
    ];
    
    const urlLower = url.toLowerCase();
    
    // Cho phép các domain whitelist
    const isAllowed = allowedDomains.some(domain => urlLower.includes(domain));
    if (isAllowed) {
      return true;
    }
    
    // Chặn URLs chứa keywords ads
    const hasBlockedKeyword = blockedKeywords.some(keyword => urlLower.includes(keyword));
    if (hasBlockedKeyword) {
      console.log('⛔ Ad URL blocked:', url);
      return false;
    }
    
    // Block tất cả navigation khác (an toàn hơn)
    console.log('⛔ External navigation blocked:', url);
    return false;
  };

  // Handle errors để không crash app
  const handleError = (error: any) => {
    console.log('WebView error:', error);
  };

  const handleHttpError = (error: any) => {
    console.log('WebView HTTP error:', error);
  };

  return (
    <Pressable
      onPress={handleVideoPress}
      style={[styles.container, { width: SCREEN_WIDTH, height: SCREEN_WIDTH * (9 / 16) }]}
    >
      {/* WebView with iframe */}
      <WebView
        source={{ html: iframeHtml }}
        style={styles.webview}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        // Chặn popup và new window
        setSupportMultipleWindows={false}
        // Handle navigation để chặn redirect (chỉ khi không phải CDN whitelist)
        onShouldStartLoadWithRequest={isWhitelistedVideo ? undefined : handleShouldStartLoadWithRequest}
        // Handle errors
        onError={handleError}
        onHttpError={handleHttpError}
        // Android specific
        mixedContentMode="always"
        // Chặn các sự kiện có thể gây crash
        onContentProcessDidTerminate={() => console.log('Content process terminated')}
        // Cache settings: enable cho CDN whitelist
        cacheEnabled={isWhitelistedVideo}
        incognito={!isWhitelistedVideo}
        thirdPartyCookiesEnabled={isWhitelistedVideo}
        sharedCookiesEnabled={isWhitelistedVideo}
        // Injected JavaScript để reinforce ad blocking (chỉ cho non-whitelist)
        injectedJavaScript={isWhitelistedVideo ? 'true;' : `
          // Extra protection after page load
          (function() {
            // Block new windows/tabs
            window.open = function() { return null; };
            
            // Remove all ad iframes that might load after initial block
            setInterval(function() {
              document.querySelectorAll('iframe').forEach(function(iframe) {
                var src = iframe.src.toLowerCase();
                if (src.includes('ad') || src.includes('banner') || src.includes('popup')) {
                  iframe.remove();
                }
              });
            }, 1000);
            
            // Block video ads
            document.querySelectorAll('video').forEach(function(video) {
              var src = (video.src || video.currentSrc || '').toLowerCase();
              if (src.includes('ad')) {
                video.remove();
              }
            });
          })();
          true; // Required for injected script
        `}
        // Extra message handler
        onMessage={(event) => {
          console.log('WebView message:', event.nativeEvent.data);
        }}
      />

      {/* Video Controls Overlay */}
      {/* <VideoPlayerControls
        showControls={showControls}
        isPlaying={isPlaying}
        episodeNumber={episodeNumber}
        seriesName={seriesName}
        seriesNameChinese={seriesNameChinese}
        onPlayPause={handlePlayPause}
        onBack={onBack}
      /> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});

