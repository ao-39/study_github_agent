/**
 * @fileoverview Aboutページルートコンポーネント
 *
 * @description アプリケーションのAboutページを表示するルートコンポーネントです。
 * TanStackRouterのファイルベースルーティングで/aboutパスに対応します。
 *
 * @author Study GitHub Agent Team
 * @version 0.1.0
 */

import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

/**
 * プロジェクト情報を表示するカードコンポーネント
 *
 * @description プロジェクトの技術的な詳細情報を視覚的に表示します。
 *
 * @param title - カードのタイトル
 * @param children - カードの内容
 * @returns Reactエレメント - 情報カード
 */
const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3
        style={{
          fontSize: '1.3rem',
          color: '#495057',
          marginBottom: '1rem',
          borderBottom: '2px solid #007bff',
          paddingBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

/**
 * 技術スタック項目を表示するコンポーネント
 *
 * @description 使用している技術とそのバージョンを表示します。
 *
 * @param name - 技術名
 * @param version - バージョン番号
 * @param description - 技術の説明
 * @returns Reactエレメント - 技術スタック項目
 */
const TechStackItem: React.FC<{
  name: string
  version: string
  description: string
}> = ({ name, version, description }) => {
  return (
    <div
      style={{
        padding: '0.8rem',
        backgroundColor: '#f8f9fa',
        borderLeft: '3px solid #007bff',
        marginBottom: '0.8rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.3rem',
        }}
      >
        <strong style={{ color: '#495057' }}>{name}</strong>
        <span
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '0.2rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.8rem',
          }}
        >
          {version}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: '0.9rem',
          color: '#6c757d',
        }}
      >
        {description}
      </p>
    </div>
  )
}

/**
 * Aboutページコンポーネント
 *
 * @description プロジェクトの概要、技術スタック、学習目標などの
 * 詳細情報を表示するページです。
 *
 * @returns Reactエレメント - Aboutページのコンテンツ
 */
const AboutPage: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          color: '#343a40',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        📚 プロジェクトについて
      </h1>

      <p
        style={{
          fontSize: '1.1rem',
          color: '#6c757d',
          marginBottom: '3rem',
          textAlign: 'center',
          lineHeight: '1.6',
        }}
      >
        このプロジェクトは、GitHub Copilot agentとの効果的な協働を学習するための
        実践的なWebアプリケーションです。
      </p>

      <InfoCard title="🎯 プロジェクトの目的">
        <ul
          style={{
            fontSize: '1rem',
            color: '#495057',
            lineHeight: '1.8',
            paddingLeft: '1.5rem',
          }}
        >
          <li>TanStackRouterを使用したモダンなSPAルーティングの学習</li>
          <li>
            ファイルベースルーティングによる直感的なプロジェクト構造の実現
          </li>
          <li>ハッシュルーティングでのクライアントサイドナビゲーション</li>
          <li>TypeScriptによる型安全なルート定義</li>
          <li>GitHub Copilot agentとの協働開発の実践</li>
        </ul>
      </InfoCard>

      <InfoCard title="🛠️ 技術スタック">
        <TechStackItem
          name="TanStack Router"
          version="1.120.16"
          description="型安全なファイルベースルーティングライブラリ"
        />
        <TechStackItem
          name="React"
          version="19.1.0"
          description="ユーザーインターフェース構築のためのJavaScriptライブラリ"
        />
        <TechStackItem
          name="TypeScript"
          version="5.8.3"
          description="JavaScriptに型安全性を追加する言語"
        />
        <TechStackItem
          name="Vite"
          version="6.3.5"
          description="高速な開発サーバーとビルドツール"
        />
      </InfoCard>

      <InfoCard title="🚀 ルーティング機能">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#e7f3ff',
              borderRadius: '5px',
              border: '1px solid #b3d9ff',
            }}
          >
            <h4 style={{ color: '#004085', marginBottom: '0.5rem' }}>
              ファイルベース
            </h4>
            <p style={{ color: '#004085', fontSize: '0.9rem', margin: 0 }}>
              ディレクトリ構造がそのままルート構造になる直感的な設計
            </p>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#e7f3ff',
              borderRadius: '5px',
              border: '1px solid #b3d9ff',
            }}
          >
            <h4 style={{ color: '#004085', marginBottom: '0.5rem' }}>
              ハッシュルーティング
            </h4>
            <p style={{ color: '#004085', fontSize: '0.9rem', margin: 0 }}>
              静的ホスティングに適した #/ 形式のURL
            </p>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#e7f3ff',
              borderRadius: '5px',
              border: '1px solid #b3d9ff',
            }}
          >
            <h4 style={{ color: '#004085', marginBottom: '0.5rem' }}>
              型安全性
            </h4>
            <p style={{ color: '#004085', fontSize: '0.9rem', margin: 0 }}>
              TypeScriptによる完全な型推論とエラー検出
            </p>
          </div>
        </div>
      </InfoCard>

      <div
        style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
        }}
      >
        <h3
          style={{
            fontSize: '1.3rem',
            color: '#495057',
            marginBottom: '1rem',
          }}
        >
          🤝 一緒に学習しましょう！
        </h3>
        <p
          style={{
            fontSize: '1rem',
            color: '#6c757d',
            margin: 0,
          }}
        >
          このプロジェクトは継続的に発展していきます。 GitHub Copilot
          agentと一緒に、最新のWeb開発技術を学んでいきましょう。
        </p>
      </div>
    </div>
  )
}

/**
 * Aboutページルートの定義
 *
 * @description TanStackRouterのファイルベースルーティングで
 * /aboutパスに対応するルートを定義します。
 */
export const Route = createFileRoute('/about')({
  component: AboutPage,
})
