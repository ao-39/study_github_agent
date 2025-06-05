# クリーンアーキテクチャ方針

このドキュメントでは、今後実装予定のクリーンアーキテクチャパターンの設計方針と実装計画を説明します。

## クリーンアーキテクチャとは

### 基本概念
クリーンアーキテクチャは、Robert C. Martin（Uncle Bob）が提唱したアーキテクチャパターンで、以下の原則に基づいています：

1. **関心の分離**: 各レイヤーが明確な責任を持つ
2. **依存関係逆転**: 内側のレイヤーは外側のレイヤーに依存しない
3. **テスタビリティ**: 各レイヤーを独立してテスト可能
4. **フレームワーク独立**: 特定のフレームワークに依存しない設計

### フロントエンドでの適用意義
- **複雑性の管理**: 大規模アプリケーションでの保守性向上
- **変更への対応**: UIフレームワークやAPI変更への柔軟性
- **テスト性**: ビジネスロジックの効率的なテスト
- **チーム開発**: 明確な境界による並行開発の実現

## レイヤー構成

### 1. Entities（エンティティレイヤー）
**責務**: アプリケーションの核となるビジネスルールとデータ構造

```typescript
// entities/User.ts
export interface User {
  readonly id: UserId
  readonly email: Email
  readonly profile: UserProfile
  readonly createdAt: Date
  readonly updatedAt: Date
}

export class UserId {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('無効なユーザーIDです')
    }
  }

  private isValid(value: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(value) && value.length >= 3
  }

  toString(): string {
    return this.value
  }
}

export class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('無効なメールアドレスです')
    }
  }

  private isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  toString(): string {
    return this.value
  }
}
```

### 2. Use Cases（ユースケースレイヤー）
**責務**: アプリケーション固有のビジネスロジック

```typescript
// use-cases/user/GetUserUseCase.ts
export interface UserRepository {
  findById(id: UserId): Promise<User | null>
  save(user: User): Promise<void>
  delete(id: UserId): Promise<void>
}

export interface NotificationService {
  send(message: string, recipient: Email): Promise<void>
}

export class GetUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService
  ) {}

  async execute(userId: UserId): Promise<User> {
    const user = await this.userRepository.findById(userId)
    
    if (!user) {
      throw new UserNotFoundError(`ユーザーが見つかりません: ${userId}`)
    }

    // ビジネスルール: ユーザーアクセス時に通知送信
    await this.notificationService.send(
      'ユーザープロフィールが閲覧されました',
      user.email
    )

    return user
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserNotFoundError'
  }
}
```

### 3. Interface Adapters（インターフェースアダプターレイヤー）
**責務**: 外部とのデータ変換とフォーマット

```typescript
// adapters/repositories/ApiUserRepository.ts
import { UserRepository } from '../../use-cases/user/GetUserUseCase'

interface ApiUserResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
}

export class ApiUserRepository implements UserRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findById(id: UserId): Promise<User | null> {
    try {
      const response = await this.apiClient.get<ApiUserResponse>(
        `/users/${id.toString()}`
      )
      return this.toDomain(response.data)
    } catch (error) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  }

  async save(user: User): Promise<void> {
    const apiData = this.toApi(user)
    await this.apiClient.put(`/users/${user.id}`, apiData)
  }

  async delete(id: UserId): Promise<void> {
    await this.apiClient.delete(`/users/${id.toString()}`)
  }

  private toDomain(apiData: ApiUserResponse): User {
    return {
      id: new UserId(apiData.id),
      email: new Email(apiData.email),
      profile: {
        firstName: apiData.first_name,
        lastName: apiData.last_name,
      },
      createdAt: new Date(apiData.created_at),
      updatedAt: new Date(apiData.updated_at),
    }
  }

  private toApi(user: User): Partial<ApiUserResponse> {
    return {
      email: user.email.toString(),
      first_name: user.profile.firstName,
      last_name: user.profile.lastName,
    }
  }
}
```

### 4. Frameworks & Drivers（フレームワーク・ドライバーレイヤー）
**責務**: React、API、データベースなどの外部依存

```typescript
// frameworks/react/components/UserProfile.tsx
import { useQuery } from '@tanstack/react-query'
import { GetUserUseCase } from '../../../use-cases/user/GetUserUseCase'
import { UserId } from '../../../entities/User'

interface UserProfileProps {
  userId: string
  getUserUseCase: GetUserUseCase
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  getUserUseCase,
}) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserUseCase.execute(new UserId(userId)),
  })

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div>エラー: {error.message}</div>
  }

  if (!user) {
    return <div>ユーザーが見つかりません</div>
  }

  return (
    <div className="user-profile">
      <h2>{user.profile.firstName} {user.profile.lastName}</h2>
      <p>メール: {user.email.toString()}</p>
      <p>登録日: {user.createdAt.toLocaleDateString()}</p>
    </div>
  )
}
```

## ディレクトリ構造

### 推奨構成
```
src/
├── entities/               # エンティティレイヤー
│   ├── User.ts
│   ├── Post.ts
│   └── index.ts
├── use-cases/              # ユースケースレイヤー
│   ├── user/
│   │   ├── GetUserUseCase.ts
│   │   ├── UpdateUserUseCase.ts
│   │   └── DeleteUserUseCase.ts
│   └── post/
│       ├── CreatePostUseCase.ts
│       └── GetPostListUseCase.ts
├── adapters/               # インターフェースアダプター
│   ├── repositories/
│   │   ├── ApiUserRepository.ts
│   │   └── LocalStorageUserRepository.ts
│   ├── services/
│   │   ├── EmailNotificationService.ts
│   │   └── PushNotificationService.ts
│   └── presenters/
│       ├── UserPresenter.ts
│       └── PostPresenter.ts
├── frameworks/             # フレームワーク・ドライバー
│   ├── react/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── providers/
│   ├── api/
│   │   ├── client.ts
│   │   └── endpoints.ts
│   └── storage/
│       └── localStorage.ts
└── main.tsx               # 依存関係注入とアプリケーション起動
```

## 依存関係注入

### DIコンテナの実装
```typescript
// main.tsx
import { DIContainer } from './di/container'
import { ApiClient } from './frameworks/api/client'
import { ApiUserRepository } from './adapters/repositories/ApiUserRepository'
import { EmailNotificationService } from './adapters/services/EmailNotificationService'
import { GetUserUseCase } from './use-cases/user/GetUserUseCase'

// 依存関係の構築
const apiClient = new ApiClient(process.env.REACT_APP_API_BASE_URL)
const userRepository = new ApiUserRepository(apiClient)
const notificationService = new EmailNotificationService(apiClient)
const getUserUseCase = new GetUserUseCase(userRepository, notificationService)

// DIコンテナに登録
const container = new DIContainer()
container.register('getUserUseCase', getUserUseCase)

// Reactアプリケーションに提供
function App() {
  return (
    <DIProvider container={container}>
      <Router>
        <Routes>
          <Route path="/users/:id" element={<UserProfilePage />} />
        </Routes>
      </Router>
    </DIProvider>
  )
}
```

## テスト戦略

### ユニットテスト
```typescript
// use-cases/user/GetUserUseCase.test.ts
describe('GetUserUseCase', () => {
  let getUserUseCase: GetUserUseCase
  let mockUserRepository: MockUserRepository
  let mockNotificationService: MockNotificationService

  beforeEach(() => {
    mockUserRepository = new MockUserRepository()
    mockNotificationService = new MockNotificationService()
    getUserUseCase = new GetUserUseCase(
      mockUserRepository,
      mockNotificationService
    )
  })

  test('ユーザーが存在する場合、ユーザー情報を返す', async () => {
    // Arrange
    const userId = new UserId('test-user')
    const expectedUser = createTestUser({ id: userId })
    mockUserRepository.setUser(expectedUser)

    // Act
    const result = await getUserUseCase.execute(userId)

    // Assert
    expect(result).toEqual(expectedUser)
    expect(mockNotificationService.sendCalls).toHaveLength(1)
  })

  test('ユーザーが存在しない場合、エラーを投げる', async () => {
    // Arrange
    const userId = new UserId('non-existent')
    mockUserRepository.setUser(null)

    // Act & Assert
    await expect(getUserUseCase.execute(userId)).rejects.toThrow(
      UserNotFoundError
    )
  })
})
```

### 統合テスト
```typescript
// frameworks/react/components/UserProfile.test.tsx
describe('UserProfile 統合テスト', () => {
  test('正常にユーザー情報を表示する', async () => {
    // Arrange
    const testUser = createTestUser()
    const mockGetUserUseCase = {
      execute: vi.fn().mockResolvedValue(testUser)
    }

    // Act
    render(
      <UserProfile 
        userId="test-user" 
        getUserUseCase={mockGetUserUseCase}
      />
    )

    // Assert
    await waitFor(() => {
      expect(screen.getByText(testUser.profile.firstName)).toBeInTheDocument()
      expect(screen.getByText(testUser.email.toString())).toBeInTheDocument()
    })
  })
})
```

## 実装計画

### フェーズ1: 基盤整備（〜2024年Q2）
- [ ] エンティティレイヤーの設計と実装
- [ ] 基本的なユースケースの実装
- [ ] DIコンテナの実装
- [ ] テスト基盤の構築

### フェーズ2: 核機能実装（〜2024年Q3）
- [ ] ユーザー管理機能のクリーンアーキテクチャ化
- [ ] API層とRepository層の実装
- [ ] React層とPresentation層の分離
- [ ] エラーハンドリングの統一

### フェーズ3: 高度な機能（〜2024年Q4）
- [ ] 複雑なビジネスロジックの実装
- [ ] キャッシュ戦略の実装
- [ ] パフォーマンス最適化
- [ ] 監視とロギングの実装

### フェーズ4: 運用最適化（2025年〜）
- [ ] 運用データに基づく改善
- [ ] 新機能の段階的追加
- [ ] アーキテクチャの継続的改善
- [ ] チーム開発プロセスの最適化

## 利点と期待効果

### 開発効率
- **並行開発**: レイヤー間の明確な境界による作業分担
- **変更容易性**: 外部依存の変更が内部に影響しない
- **再利用性**: ビジネスロジックの他画面での再利用

### 品質向上
- **テスタビリティ**: 各レイヤーの独立したテスト
- **保守性**: 明確な責任分離による理解しやすさ
- **堅牢性**: 型安全性とドメインルールの強制

### 学習効果
- **アーキテクチャ理解**: 大規模開発での設計パターン習得
- **設計思考**: 抽象化と依存関係の管理スキル向上
- **実践経験**: 理論を実際のプロジェクトで適用

このクリーンアーキテクチャ方針により、保守性と拡張性を兼ね備えた高品質なフロントエンドアプリケーションの構築を目指します。