import { View, Pressable, Dimensions, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import { VideoPlayerControls } from './video-player-controls';
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
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Kiểm tra CDN whitelist
  const isWhitelistedCDN = (url: string) => {
    const cdnDomains = [
      'loadvid.com', 'cdn.loadvid.com',
      'vevocloud.com', 'voe.sx',
      'streamtape.com', 'mixdrop.co',
      'doodstream.com', 'dailymotion.com',
      'dmcdn.net'
    ];
    return cdnDomains.some(domain => url.toLowerCase().includes(domain));
  };

  // Thêm params vào URL để giảm ads (như web version)
  const addAdBlockParams = (url: string): string => {
    try {
      const urlObj = new URL(url);
      
      // Các params giảm ads
      const params: Record<string, string> = {
        'autoplay': '1',
        'mute': '0',
        'controls': '1',
        'modestbranding': '1',
        'rel': '0',
        'showinfo': '0',
        'playsinline': '1',
        'widget': '1',
        'app': 'embed'
      };

      Object.entries(params).forEach(([key, value]) => {
        if (!urlObj.searchParams.has(key)) {
          urlObj.searchParams.set(key, value);
        }
      });

      return urlObj.toString();
    } catch {
      return url;
    }
  };

  const processedUrl = addAdBlockParams(videoUrl);
  const isWhitelisted = isWhitelistedCDN(videoUrl);

  // Simple HTML - KHÔNG aggressive ad blocking để tránh crash
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
          }
          /* Chỉ hide các element rõ ràng là ads */
          [id*="google_ads"],
          [class*="adsbygoogle"],
          .advertisement,
          #advertisement {
            display: none !important;
          }
        </style>
        <script>
          // Minimal blocking - chỉ chặn popup
          (function() {
            'use strict';
            
            // Chặn window.open (popup)
            window.open = function() {
              console.log('⛔ Popup blocked');
              return null;
            };
            
            // Chặn alert/confirm/prompt spam
            window.alert = function() { return true; };
            window.confirm = function() { return true; };
            window.prompt = function() { return null; };
          })();
        </script>
      </head>
      <body>
        <iframe 
          src="${processedUrl}" 
          allowfullscreen
          ${isWhitelisted ? '' : 'sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          webkitallowfullscreen
          mozallowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </body>
    </html>
  `;

  // Handle navigation - chỉ cho phép whitelist domains
  const handleShouldStartLoadWithRequest = (request: any) => {
    const { url } = request;
    
    const allowedDomains = [
      'loadvid.com', 'cdn.loadvid.com',
      'dailymotion.com', 'dai.ly', 'dmcdn.net',
      'vevocloud.com', 'voe.sx',
      'streamtape.com', 'mixdrop.co', 
      'mixdrop.to', 'doodstream.com',
      'about:blank', 'blob:', 'data:'
    ];

    const urlLower = url.toLowerCase();
    const isAllowed = allowedDomains.some(domain => urlLower.includes(domain));
    
    if (isAllowed) {
      return true;
    }

    // Block ads keywords
    const blockedKeywords = [
      'doubleclick', 'googlesyndication',
      'advertising', 'popads', 'popcash'
    ];
    
    const hasBlockedKeyword = blockedKeywords.some(kw => urlLower.includes(kw));
    if (hasBlockedKeyword) {
      console.log('⛔ Ad blocked:', url);
      return false;
    }

    // Block mọi navigation khác
    console.log('⛔ External blocked:', url);
    return false;
  };

  const handleError = (error: any) => {
    console.log('WebView error:', error);
    setHasError(true);
  };

  const handleHttpError = (error: any) => {
    console.log('WebView HTTP error:', error);
  };

  if (hasError) {
    return (
      <View style={[styles.container, { width: SCREEN_WIDTH, height: SCREEN_WIDTH * (9 / 16) }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ Lỗi tải video</Text>
          <Text style={styles.errorSubtext}>Thử chuyển sang server khác</Text>
          <Pressable onPress={() => setHasError(false)} style={styles.retryButton}>
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={handleVideoPress}
      style={[styles.container, { width: SCREEN_WIDTH, height: SCREEN_WIDTH * (9 / 16) }]}
    >
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
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onError={handleError}
        onHttpError={handleHttpError}
        mixedContentMode="always"
        cacheEnabled={true}
        incognito={false}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        // KHÔNG inject JavaScript aggressive để tránh crash
        injectedJavaScript={'true;'}
        onContentProcessDidTerminate={() => {
          console.log('Content process terminated');
          setHasError(true);
        }}
        onMessage={(event) => {
          console.log('WebView message:', event.nativeEvent.data);
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#f59e0b',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
