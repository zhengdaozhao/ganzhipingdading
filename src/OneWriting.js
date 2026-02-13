import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function OneWriting({ navigation, route }) {
  // 从 route.params 中获取 sample，确保有默认值
  console.log('OneWriting route.params:', route.params);
  const writing = route.params.writing;
  const sample = writing && writing.sample ? writing.sample : '';
  
  // 确保 HTML 内容有默认值
  const htmlContent = sample && typeof sample === 'string' ? sample : '<p>No content available</p>';
  
  // 检查 HTML 内容是否为空
  const hasContent = htmlContent.trim().length > 0 && htmlContent !== '<p></p>';

  // 使用 WebView 渲染 HTML，完全保留所有样式
  const htmlPage = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          height: 100%;
          width: 100%;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 16px;
          background-color: #ffffff;
          line-height: 1.6;
          color: #333;
        }
        p {
          margin: 8px 0;
          color: #333;
          font-size: 16px;
        }
        h1, h2, h3, h4, h5, h6 {
          margin: 10px 0;
          color: #333;
        }
        h1 { font-size: 24px; font-weight: bold; }
        h2 { font-size: 22px; font-weight: bold; }
        h3 { font-size: 20px; font-weight: bold; }
        ul, ol {
          margin-left: 20px;
          margin: 8px 0;
        }
        li {
          font-size: 16px;
          color: #333;
          line-height: 24px;
          margin: 4px 0;
        }
        a {
          color: #007AFF;
        }
        blockquote {
          border-left: 4px solid #007AFF;
          padding-left: 12px;
          margin: 8px 0;
          color: #666;
        }
        pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
        code {
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 14px;
        }
        .ql-size-large {
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {hasContent ? (
          <WebView
            source={{ html: htmlPage }}
            style={styles.webview}
            scrollEnabled={true}
            scalesPageToFit={true}
            showsVerticalScrollIndicator={true}
            javaScriptEnabled={true}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No content available</Text>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});