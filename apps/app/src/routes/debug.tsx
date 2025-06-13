/**
 * @fileoverview 開発者用デバッグページルートコンポーネント
 *
 * @description 開発者がアプリケーションの状態をデバッグするためのページです。
 * ビルド時の環境変数、ビルド時刻、アプリケーションバージョンを表示します。
 * TanStackRouterのファイルベースルーティングで /debug に対応します。
 *
 * @author Study GitHub Agent Team
 * @version 0.1.0
 */

import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { env } from '../env'

/**
 * デバッグページコンポーネント
 *
 * @description 開発者用のデバッグ情報を表示するページコンポーネントです。
 * 環境変数、ビルド情報、アプリケーション情報を見やすく整理して表示します。
 *
 * @returns Reactエレメント - デバッグページのコンテンツ
 */
const DebugPage: React.FC = () => {
  /**
   * ビルド時刻をフォーマットして表示用に整形
   *
   * @param buildTime - ISO形式のビルド時刻文字列
   * @returns フォーマット済みの日時文字列
   */
  const formatBuildTime = (buildTime: string): string => {
    try {
      const date = new Date(buildTime)
      return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    } catch {
      return buildTime
    }
  }

  /**
   * 環境変数の値を表示用に整形
   *
   * @param value - 環境変数の値
   * @returns 表示用の文字列
   */
  const formatEnvValue = (value: unknown): string => {
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false'
    }
    return String(value)
  }

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          color: '#343a40',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        🔧 開発者用デバッグページ
      </h1>

      <p
        style={{
          fontSize: '1.1rem',
          color: '#6c757d',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        アプリケーションのビルド情報と環境変数を確認できます
      </p>

      {/* アプリケーション情報セクション */}
      <section
        style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #dee2e6',
        }}
      >
        <h2
          style={{
            fontSize: '1.3rem',
            color: '#495057',
            marginBottom: '1rem',
            borderBottom: '2px solid #007bff',
            paddingBottom: '0.5rem',
          }}
        >
          📱 アプリケーション情報
        </h2>
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>バージョン:</span>
            <code
              style={{
                backgroundColor: '#e9ecef',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            >
              {__APP_VERSION__}
            </code>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>ビルド時刻:</span>
            <code
              style={{
                backgroundColor: '#e9ecef',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            >
              {formatBuildTime(__BUILD_TIME__)}
            </code>
          </div>
        </div>
      </section>

      {/* 環境変数セクション */}
      <section
        style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #dee2e6',
        }}
      >
        <h2
          style={{
            fontSize: '1.3rem',
            color: '#495057',
            marginBottom: '1rem',
            borderBottom: '2px solid #28a745',
            paddingBottom: '0.5rem',
          }}
        >
          ⚙️ ビルド時環境変数
        </h2>
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>VITE_ENABLE_PWA:</span>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <code
                style={{
                  backgroundColor: env.VITE_ENABLE_PWA ? '#d4edda' : '#f8d7da',
                  color: env.VITE_ENABLE_PWA ? '#155724' : '#721c24',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              >
                {formatEnvValue(env.VITE_ENABLE_PWA)}
              </code>
              <small style={{ color: '#6c757d' }}>(PWA機能の有効/無効)</small>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>GITHUB_PAGES:</span>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <code
                style={{
                  backgroundColor: env.GITHUB_PAGES ? '#d4edda' : '#f8d7da',
                  color: env.GITHUB_PAGES ? '#155724' : '#721c24',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              >
                {formatEnvValue(env.GITHUB_PAGES)}
              </code>
              <small style={{ color: '#6c757d' }}>
                (GitHub Pages用ビルド設定)
              </small>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>ANALYZE:</span>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <code
                style={{
                  backgroundColor: env.ANALYZE ? '#d4edda' : '#f8d7da',
                  color: env.ANALYZE ? '#155724' : '#721c24',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              >
                {formatEnvValue(env.ANALYZE)}
              </code>
              <small style={{ color: '#6c757d' }}>
                (バンドル分析の有効/無効)
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* 実行時環境情報セクション */}
      <section
        style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #dee2e6',
        }}
      >
        <h2
          style={{
            fontSize: '1.3rem',
            color: '#495057',
            marginBottom: '1rem',
            borderBottom: '2px solid #ffc107',
            paddingBottom: '0.5rem',
          }}
        >
          🌐 実行時環境情報
        </h2>
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>User Agent:</span>
            <code
              style={{
                backgroundColor: '#e9ecef',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                maxWidth: '60%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={navigator.userAgent}
            >
              {navigator.userAgent}
            </code>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>画面解像度:</span>
            <code
              style={{
                backgroundColor: '#e9ecef',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            >
              {window.screen.width} × {window.screen.height}
            </code>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>現在時刻:</span>
            <code
              style={{
                backgroundColor: '#e9ecef',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            >
              {new Date().toLocaleString('ja-JP')}
            </code>
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <div
        style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '2rem',
        }}
      >
        <h3
          style={{
            color: '#856404',
            marginBottom: '0.5rem',
            fontSize: '1rem',
          }}
        >
          ⚠️ 注意事項
        </h3>
        <p
          style={{
            color: '#856404',
            margin: 0,
            fontSize: '0.9rem',
          }}
        >
          このページは開発・デバッグ目的で使用してください。
          本番環境では機密情報が含まれる可能性があるため、アクセス制限を検討してください。
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/debug')({
  component: DebugPage,
})
