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

#### ブランドタイプ（Brand Types）とZodバリデーションの統合

ブランドタイプとZodを組み合わせることで、型安全性とランタイムバリデーションを両立します。

```typescript
// entities/types/brand.ts
import { z } from 'zod'

/**
 * ブランドタイプを作成するためのユーティリティ型
 */
export type Brand<T, TBrand> = T & { readonly __brand: TBrand }

/**
 * Zodスキーマからブランドタイプを作成するヘルパー関数
 */
export function createBrandedSchema<T, TBrand extends string>(
  schema: z.ZodType<T>,
  brand: TBrand
) {
  return schema.transform((value): Brand<T, TBrand> => 
    value as Brand<T, TBrand>
  )
}

/**
 * ブランドタイプの値を安全に取得するヘルパー関数
 */
export function unwrapBrand<T, TBrand>(value: Brand<T, TBrand>): T {
  return value as T
}
```

```typescript
// entities/User.ts
import { z } from 'zod'
import { Brand, createBrandedSchema, unwrapBrand } from './types/brand'

// ブランドタイプの定義
export type UserId = Brand<string, 'UserId'>
export type Email = Brand<string, 'Email'>
export type UserName = Brand<string, 'UserName'>

// Zodスキーマの定義
export const UserIdSchema = createBrandedSchema(
  z.string()
    .min(3, 'ユーザーIDは3文字以上である必要があります')
    .max(50, 'ユーザーIDは50文字以下である必要があります')
    .regex(/^[a-zA-Z0-9_-]+$/, '英数字、アンダースコア、ハイフンのみ使用可能です'),
  'UserId'
)

export const EmailSchema = createBrandedSchema(
  z.string()
    .email('有効なメールアドレス形式で入力してください')
    .max(254, 'メールアドレスは254文字以下である必要があります'),
  'Email'
)

export const UserNameSchema = createBrandedSchema(
  z.string()
    .min(1, 'ユーザー名を入力してください')
    .max(100, 'ユーザー名は100文字以下である必要があります')
    .regex(/^[^\s].*[^\s]$/, 'ユーザー名の前後に空白は使用できません'),
  'UserName'
)

// UserProfileスキーマ
export const UserProfileSchema = z.object({
  firstName: UserNameSchema,
  lastName: UserNameSchema,
  bio: z.string().max(500, '自己紹介は500文字以下である必要があります').optional(),
  avatarUrl: z.string().url('有効なURL形式で入力してください').optional(),
})

export type UserProfile = z.infer<typeof UserProfileSchema>

// Userエンティティスキーマ
export const UserSchema = z.object({
  id: UserIdSchema,
  email: EmailSchema,
  profile: UserProfileSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

// ファクトリー関数（バリデーション付き）
export class UserFactory {
  /**
   * 新しいUserエンティティを作成します
   * @param data - ユーザーデータ
   * @returns 検証済みUserエンティティ
   * @throws ZodError バリデーションエラー時
   */
  static create(data: unknown): User {
    return UserSchema.parse(data)
  }

  /**
   * 既存データからUserエンティティを復元します
   * @param data - 既存ユーザーデータ
   * @returns 検証済みUserエンティティ
   */
  static fromExisting(data: {
    id: string
    email: string
    profile: {
      firstName: string
      lastName: string
      bio?: string
      avatarUrl?: string
    }
    createdAt: Date | string
    updatedAt: Date | string
  }): User {
    return this.create({
      ...data,
      createdAt: typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt,
      updatedAt: typeof data.updatedAt === 'string' ? new Date(data.updatedAt) : data.updatedAt,
    })
  }

  /**
   * ユーザーIDを安全に作成します
   * @param value - ユーザーID文字列
   * @returns 検証済みUserId
   */
  static createUserId(value: string): UserId {
    return UserIdSchema.parse(value)
  }

  /**
   * メールアドレスを安全に作成します
   * @param value - メールアドレス文字列
   * @returns 検証済みEmail
   */
  static createEmail(value: string): Email {
    return EmailSchema.parse(value)
  }

  /**
   * ユーザー名を安全に作成します
   * @param value - ユーザー名文字列
   * @returns 検証済みUserName
   */
  static createUserName(value: string): UserName {
    return UserNameSchema.parse(value)
  }
}

// ヘルパー関数
export const UserHelpers = {
  /**
   * ユーザーのフルネームを取得します
   */
  getFullName(user: User): string {
    return `${unwrapBrand(user.profile.firstName)} ${unwrapBrand(user.profile.lastName)}`
  },

  /**
   * ユーザーIDの文字列表現を取得します
   */
  getIdString(user: User): string {
    return unwrapBrand(user.id)
  },

  /**
   * メールアドレスの文字列表現を取得します
   */
  getEmailString(user: User): string {
    return unwrapBrand(user.email)
  },

  /**
   * ユーザーが管理者権限を持っているかチェックします
   */
  isAdmin(user: User): boolean {
    const email = unwrapBrand(user.email)
    return email.endsWith('@admin.example.com')
  },
}
```

### 2. Use Cases（ユースケースレイヤー）
**責務**: アプリケーション固有のビジネスロジック

#### ブランドタイプを活用したユースケース実装

```typescript
// use-cases/user/GetUserUseCase.ts
import { z } from 'zod'
import { User, UserId, UserIdSchema, UserFactory } from '../../entities/User'

// Repository インターフェースでブランドタイプを使用
export interface UserRepository {
  findById(id: UserId): Promise<User | null>
  save(user: User): Promise<void>
  delete(id: UserId): Promise<void>
  findByEmail(email: Email): Promise<User | null>
}

export interface NotificationService {
  send(message: string, recipient: Email): Promise<void>
}

// 入力検証スキーマ
export const GetUserInputSchema = z.object({
  userId: UserIdSchema,
})

export type GetUserInput = z.infer<typeof GetUserInputSchema>

// 出力スキーマ
export const GetUserOutputSchema = z.object({
  user: z.custom<User>(),
  lastAccessTime: z.date(),
})

export type GetUserOutput = z.infer<typeof GetUserOutputSchema>

// カスタムエラークラス
export class UserNotFoundError extends Error {
  constructor(userId: UserId) {
    super(`ユーザーが見つかりません: ${userId}`)
    this.name = 'UserNotFoundError'
  }
}

export class UserAccessDeniedError extends Error {
  constructor(userId: UserId) {
    super(`ユーザーへのアクセスが拒否されました: ${userId}`)
    this.name = 'UserAccessDeniedError'
  }
}

export class GetUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService
  ) {}

  /**
   * ユーザー情報を取得します
   * @param input - 取得対象のユーザーID
   * @returns ユーザー情報とアクセス時刻
   * @throws UserNotFoundError ユーザーが存在しない場合
   * @throws UserAccessDeniedError アクセスが拒否された場合
   */
  async execute(input: unknown): Promise<GetUserOutput> {
    // 入力バリデーション（Zodを使用）
    const validatedInput = GetUserInputSchema.parse(input)
    
    const user = await this.userRepository.findById(validatedInput.userId)
    
    if (!user) {
      throw new UserNotFoundError(validatedInput.userId)
    }

    // ビジネスルール: 削除されたユーザーはアクセス不可
    if (this.isUserDeleted(user)) {
      throw new UserAccessDeniedError(validatedInput.userId)
    }

    // ビジネスルール: ユーザーアクセス時に通知送信
    await this.notificationService.send(
      'ユーザープロフィールが閲覧されました',
      user.email
    )

    const result: GetUserOutput = {
      user,
      lastAccessTime: new Date(),
    }

    return GetUserOutputSchema.parse(result)
  }

  private isUserDeleted(user: User): boolean {
    // ビジネスロジック例: プロフィールが空の場合は削除済み扱い
    return !user.profile.firstName || !user.profile.lastName
  }
}
```

```typescript
// use-cases/user/UpdateUserUseCase.ts
import { z } from 'zod'
import { User, UserId, UserProfile, UserProfileSchema, UserFactory } from '../../entities/User'

// 更新入力スキーマ
export const UpdateUserInputSchema = z.object({
  userId: UserIdSchema,
  profileUpdates: UserProfileSchema.partial(), // 部分更新を許可
})

export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>

// 更新出力スキーマ
export const UpdateUserOutputSchema = z.object({
  updatedUser: z.custom<User>(),
  changeLog: z.array(z.string()),
})

export type UpdateUserOutput = z.infer<typeof UpdateUserOutputSchema>

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService
  ) {}

  /**
   * ユーザー情報を更新します
   * @param input - 更新対象のユーザーIDと更新内容
   * @returns 更新されたユーザー情報と変更ログ
   * @throws UserNotFoundError ユーザーが存在しない場合
   * @throws ZodError バリデーションエラーの場合
   */
  async execute(input: unknown): Promise<UpdateUserOutput> {
    // 入力バリデーション
    const validatedInput = UpdateUserInputSchema.parse(input)
    
    const existingUser = await this.userRepository.findById(validatedInput.userId)
    
    if (!existingUser) {
      throw new UserNotFoundError(validatedInput.userId)
    }

    // 変更ログの作成
    const changeLog: string[] = []

    // 更新されたプロフィールの作成
    const updatedProfile = {
      ...existingUser.profile,
      ...validatedInput.profileUpdates,
    }

    // 変更検知とログ作成
    if (validatedInput.profileUpdates.firstName) {
      changeLog.push(`名前を変更: ${existingUser.profile.firstName} → ${validatedInput.profileUpdates.firstName}`)
    }
    if (validatedInput.profileUpdates.lastName) {
      changeLog.push(`姓を変更: ${existingUser.profile.lastName} → ${validatedInput.profileUpdates.lastName}`)
    }
    if (validatedInput.profileUpdates.bio !== undefined) {
      changeLog.push('自己紹介を更新')
    }

    // 新しいUserエンティティの作成（バリデーション付き）
    const updatedUser = UserFactory.create({
      ...existingUser,
      profile: updatedProfile,
      updatedAt: new Date(),
    })

    // 保存
    await this.userRepository.save(updatedUser)

    // 通知送信
    await this.notificationService.send(
      'プロフィールが更新されました',
      updatedUser.email
    )

    const result: UpdateUserOutput = {
      updatedUser,
      changeLog,
    }

    return UpdateUserOutputSchema.parse(result)
  }
}
```

### 3. Interface Adapters（インターフェースアダプターレイヤー）
**責務**: 外部とのデータ変換とフォーマット

#### APIとのデータ変換におけるブランドタイプとZod活用

```typescript
// adapters/repositories/ApiUserRepository.ts
import { z } from 'zod'
import { UserRepository } from '../../use-cases/user/GetUserUseCase'
import { User, UserId, Email, UserFactory, unwrapBrand } from '../../entities/User'

// API レスポンススキーマ（外部形式）
export const ApiUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  bio: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean(),
})

export type ApiUserResponse = z.infer<typeof ApiUserResponseSchema>

// API リクエストスキーマ（外部形式）
export const ApiUserRequestSchema = z.object({
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
})

export type ApiUserRequest = z.infer<typeof ApiUserRequestSchema>

// エラーレスポンススキーマ
export const ApiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
})

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>

export interface ApiClient {
  get<T>(url: string): Promise<{ data: T; status: number }>
  put<T>(url: string, data: unknown): Promise<{ data: T; status: number }>
  delete(url: string): Promise<{ status: number }>
}

export class ApiUserRepository implements UserRepository {
  constructor(private readonly apiClient: ApiClient) {}

  /**
   * ユーザーIDでユーザーを取得
   * @param id - ブランドタイプのUserId
   * @returns ドメインエンティティのUser
   */
  async findById(id: UserId): Promise<User | null> {
    try {
      const response = await this.apiClient.get<unknown>(
        `/users/${unwrapBrand(id)}`
      )
      
      // APIレスポンスのバリデーション
      const validatedResponse = ApiUserResponseSchema.parse(response.data)
      
      // ドメインエンティティへの変換
      return this.toDomainEntity(validatedResponse)
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null
      }
      throw new Error(`ユーザー取得エラー: ${this.extractErrorMessage(error)}`)
    }
  }

  /**
   * メールアドレスでユーザーを取得
   * @param email - ブランドタイプのEmail
   * @returns ドメインエンティティのUser
   */
  async findByEmail(email: Email): Promise<User | null> {
    try {
      const response = await this.apiClient.get<unknown>(
        `/users/by-email/${encodeURIComponent(unwrapBrand(email))}`
      )
      
      const validatedResponse = ApiUserResponseSchema.parse(response.data)
      return this.toDomainEntity(validatedResponse)
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null
      }
      throw new Error(`ユーザー取得エラー: ${this.extractErrorMessage(error)}`)
    }
  }

  /**
   * ユーザーを保存
   * @param user - ドメインエンティティのUser
   */
  async save(user: User): Promise<void> {
    try {
      const apiData = this.toApiRequest(user)
      
      await this.apiClient.put(`/users/${unwrapBrand(user.id)}`, apiData)
    } catch (error) {
      throw new Error(`ユーザー保存エラー: ${this.extractErrorMessage(error)}`)
    }
  }

  /**
   * ユーザーを削除
   * @param id - ブランドタイプのUserId
   */
  async delete(id: UserId): Promise<void> {
    try {
      await this.apiClient.delete(`/users/${unwrapBrand(id)}`)
    } catch (error) {
      throw new Error(`ユーザー削除エラー: ${this.extractErrorMessage(error)}`)
    }
  }

  /**
   * APIレスポンスからドメインエンティティに変換
   * @param apiData - バリデーション済みAPIレスポンス
   * @returns ドメインエンティティ
   */
  private toDomainEntity(apiData: ApiUserResponse): User {
    return UserFactory.fromExisting({
      id: apiData.id,
      email: apiData.email,
      profile: {
        firstName: apiData.first_name,
        lastName: apiData.last_name,
        bio: apiData.bio || undefined,
        avatarUrl: apiData.avatar_url || undefined,
      },
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
    })
  }

  /**
   * ドメインエンティティからAPIリクエストに変換
   * @param user - ドメインエンティティ
   * @returns APIリクエスト形式
   */
  private toApiRequest(user: User): ApiUserRequest {
    const apiData: ApiUserRequest = {
      email: unwrapBrand(user.email),
      first_name: unwrapBrand(user.profile.firstName),
      last_name: unwrapBrand(user.profile.lastName),
    }

    // オプショナルフィールドの処理
    if (user.profile.bio) {
      apiData.bio = user.profile.bio
    }
    if (user.profile.avatarUrl) {
      apiData.avatar_url = user.profile.avatarUrl
    }

    return ApiUserRequestSchema.parse(apiData)
  }

  /**
   * 404エラーかどうかの判定
   */
  private isNotFoundError(error: unknown): boolean {
    return (error as any)?.status === 404
  }

  /**
   * エラーメッセージの抽出
   */
  private extractErrorMessage(error: unknown): string {
    try {
      const apiError = ApiErrorResponseSchema.parse(error)
      return apiError.error.message
    } catch {
      return error instanceof Error ? error.message : '不明なエラー'
    }
  }
}
```

```typescript
// adapters/services/EmailNotificationService.ts
import { z } from 'zod'
import { NotificationService } from '../../use-cases/user/GetUserUseCase'
import { Email, unwrapBrand } from '../../entities/User'

// 通知リクエストスキーマ
export const NotificationRequestSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  template: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type NotificationRequest = z.infer<typeof NotificationRequestSchema>

// 通知レスポンススキーマ
export const NotificationResponseSchema = z.object({
  messageId: z.string(),
  status: z.enum(['sent', 'queued', 'failed']),
  sentAt: z.string().datetime(),
})

export type NotificationResponse = z.infer<typeof NotificationResponseSchema>

export interface EmailApiClient {
  sendEmail(request: NotificationRequest): Promise<NotificationResponse>
}

export class EmailNotificationService implements NotificationService {
  constructor(private readonly emailClient: EmailApiClient) {}

  /**
   * メール通知を送信
   * @param message - 通知メッセージ
   * @param recipient - ブランドタイプのEmail
   * @throws Error 送信エラーの場合
   */
  async send(message: string, recipient: Email): Promise<void> {
    try {
      // 通知リクエストの作成とバリデーション
      const notificationRequest = NotificationRequestSchema.parse({
        to: unwrapBrand(recipient),
        subject: 'システム通知',
        body: message,
        template: 'system-notification',
        metadata: {
          timestamp: new Date().toISOString(),
          system: 'study-github-agent',
        },
      })

      // メール送信
      const response = await this.emailClient.sendEmail(notificationRequest)
      
      // レスポンスのバリデーション
      const validatedResponse = NotificationResponseSchema.parse(response)

      // 送信失敗の場合はエラーを投げる
      if (validatedResponse.status === 'failed') {
        throw new Error('メール送信に失敗しました')
      }

      console.log(`メール送信成功: ${validatedResponse.messageId}`)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`通知データのバリデーションエラー: ${error.message}`)
      }
      throw new Error(`メール送信エラー: ${error instanceof Error ? error.message : '不明なエラー'}`)
    }
  }
}
```

```typescript
// adapters/presenters/UserPresenter.ts
import { z } from 'zod'
import { User, unwrapBrand, UserHelpers } from '../../entities/User'

// プレゼンテーション用スキーマ
export const UserViewModelSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  isAdmin: z.boolean(),
  memberSince: z.string(),
  lastUpdated: z.string(),
})

export type UserViewModel = z.infer<typeof UserViewModelSchema>

export class UserPresenter {
  /**
   * ドメインエンティティをビューモデルに変換
   * @param user - ドメインエンティティ
   * @returns プレゼンテーション用データ
   */
  static present(user: User): UserViewModel {
    const viewModel: UserViewModel = {
      id: unwrapBrand(user.id),
      email: unwrapBrand(user.email),
      fullName: UserHelpers.getFullName(user),
      firstName: unwrapBrand(user.profile.firstName),
      lastName: unwrapBrand(user.profile.lastName),
      bio: user.profile.bio,
      avatarUrl: user.profile.avatarUrl,
      isAdmin: UserHelpers.isAdmin(user),
      memberSince: user.createdAt.toLocaleDateString('ja-JP'),
      lastUpdated: user.updatedAt.toLocaleDateString('ja-JP'),
    }

    // バリデーションして返す
    return UserViewModelSchema.parse(viewModel)
  }

  /**
   * 複数ユーザーのリスト表示用変換
   * @param users - ユーザーリスト
   * @returns プレゼンテーション用データリスト
   */
  static presentList(users: User[]): UserViewModel[] {
    return users.map(user => this.present(user))
  }

  /**
   * ユーザー検索結果の表示用変換
   * @param users - 検索結果
   * @param totalCount - 総件数
   * @returns 検索結果プレゼンテーション用データ
   */
  static presentSearchResult(users: User[], totalCount: number) {
    const searchResultSchema = z.object({
      users: z.array(UserViewModelSchema),
      totalCount: z.number(),
      hasMore: z.boolean(),
    })

    const result = {
      users: this.presentList(users),
      totalCount,
      hasMore: users.length < totalCount,
    }

    return searchResultSchema.parse(result)
  }
}
```

### 4. Frameworks & Drivers（フレームワーク・ドライバーレイヤー）
**責務**: React、API、データベースなどの外部依存

#### Reactコンポーネントでのブランドタイプとバリデーション活用

```typescript
// frameworks/react/components/UserProfile.tsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { GetUserUseCase } from '../../../use-cases/user/GetUserUseCase'
import { UserFactory } from '../../../entities/User'
import { UserPresenter, UserViewModel } from '../../../adapters/presenters/UserPresenter'

// プロパティスキーマ
const UserProfilePropsSchema = z.object({
  userId: z.string(),
  getUserUseCase: z.custom<GetUserUseCase>(),
  onUserUpdate: z.function().args(z.custom<UserViewModel>()).returns(z.void()).optional(),
})

type UserProfileProps = z.infer<typeof UserProfilePropsSchema>

// エラー表示コンポーネント
const ErrorDisplay: React.FC<{ error: Error }> = ({ error }) => (
  <div className="error-container" role="alert">
    <h3>エラーが発生しました</h3>
    <p>{error.message}</p>
    <button onClick={() => window.location.reload()}>
      再読み込み
    </button>
  </div>
)

// ローディング表示コンポーネント
const LoadingDisplay: React.FC = () => (
  <div className="loading-container" aria-label="読み込み中">
    <div className="spinner" />
    <p>ユーザー情報を読み込んでいます...</p>
  </div>
)

// ユーザー情報表示コンポーネント
const UserInfo: React.FC<{ user: UserViewModel }> = ({ user }) => (
  <div className="user-info">
    <div className="user-avatar">
      {user.avatarUrl ? (
        <img 
          src={user.avatarUrl} 
          alt={`${user.fullName}のアバター`}
          className="avatar-image"
        />
      ) : (
        <div className="avatar-placeholder">
          {user.fullName.charAt(0)}
        </div>
      )}
    </div>
    
    <div className="user-details">
      <h2 className="user-name">{user.fullName}</h2>
      
      {user.isAdmin && (
        <span className="admin-badge" role="img" aria-label="管理者">
          👑 管理者
        </span>
      )}
      
      <div className="user-meta">
        <p>
          <strong>メール:</strong>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
        <p><strong>登録日:</strong> {user.memberSince}</p>
        <p><strong>最終更新:</strong> {user.lastUpdated}</p>
      </div>
      
      {user.bio && (
        <div className="user-bio">
          <h3>自己紹介</h3>
          <p>{user.bio}</p>
        </div>
      )}
    </div>
  </div>
)

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  getUserUseCase,
  onUserUpdate,
}) => {
  // プロパティのバリデーション（開発時のデバッグ用）
  React.useEffect(() => {
    try {
      UserProfilePropsSchema.parse({ userId, getUserUseCase, onUserUpdate })
    } catch (error) {
      console.error('UserProfile プロパティエラー:', error)
    }
  }, [userId, getUserUseCase, onUserUpdate])

  const { 
    data: result, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      // ユーザーIDのバリデーション
      const validUserId = UserFactory.createUserId(userId)
      
      // ユースケース実行
      const userResult = await getUserUseCase.execute({ userId: validUserId })
      
      // プレゼンテーション用に変換
      const userViewModel = UserPresenter.present(userResult.user)
      
      return {
        user: userViewModel,
        lastAccessTime: userResult.lastAccessTime,
      }
    },
    retry: (failureCount, error) => {
      // バリデーションエラーはリトライしない
      if (error instanceof z.ZodError) {
        return false
      }
      return failureCount < 3
    },
  })

  // ユーザー更新通知
  React.useEffect(() => {
    if (result?.user && onUserUpdate) {
      onUserUpdate(result.user)
    }
  }, [result?.user, onUserUpdate])

  if (isLoading) {
    return <LoadingDisplay />
  }

  if (error) {
    return <ErrorDisplay error={error instanceof Error ? error : new Error('不明なエラー')} />
  }

  if (!result) {
    return (
      <div className="no-user">
        <p>ユーザーが見つかりません</p>
        <button onClick={() => refetch()}>再試行</button>
      </div>
    )
  }

  return (
    <div className="user-profile" data-testid="user-profile">
      <UserInfo user={result.user} />
      
      <div className="last-access">
        <small>
          最終アクセス: {result.lastAccessTime.toLocaleString('ja-JP')}
        </small>
      </div>
    </div>
  )
}
```

```typescript
// frameworks/react/hooks/useUserForm.ts
import React from 'react'
import { z } from 'zod'
import { UserProfileSchema, UserFactory } from '../../../entities/User'
import { UpdateUserUseCase } from '../../../use-cases/user/UpdateUserUseCase'

// フォーム入力スキーマ
const UserFormDataSchema = z.object({
  firstName: z.string().min(1, '名前を入力してください'),
  lastName: z.string().min(1, '姓を入力してください'),
  bio: z.string().max(500, '自己紹介は500文字以下で入力してください').optional(),
  avatarUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
})

type UserFormData = z.infer<typeof UserFormDataSchema>

// フォーム状態
interface FormState {
  data: UserFormData
  errors: Partial<Record<keyof UserFormData, string>>
  isValid: boolean
  isDirty: boolean
}

// フォームアクション
type FormAction = 
  | { type: 'SET_FIELD'; field: keyof UserFormData; value: string }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof UserFormData, string>> }
  | { type: 'RESET'; initialData: UserFormData }
  | { type: 'VALIDATE' }

// フォーム状態の初期値
function getInitialState(initialData: UserFormData): FormState {
  return {
    data: initialData,
    errors: {},
    isValid: true,
    isDirty: false,
  }
}

// フォーム状態のリデューサー
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      const newData = { ...state.data, [action.field]: action.value }
      return {
        ...state,
        data: newData,
        isDirty: true,
      }
    
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isValid: Object.keys(action.errors).length === 0,
      }
    
    case 'RESET':
      return getInitialState(action.initialData)
    
    case 'VALIDATE':
      try {
        UserFormDataSchema.parse(state.data)
        return {
          ...state,
          errors: {},
          isValid: true,
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Partial<Record<keyof UserFormData, string>> = {}
          error.errors.forEach(err => {
            if (err.path.length > 0) {
              const field = err.path[0] as keyof UserFormData
              errors[field] = err.message
            }
          })
          return {
            ...state,
            errors,
            isValid: false,
          }
        }
        return state
      }
    
    default:
      return state
  }
}

export function useUserForm(
  initialData: UserFormData,
  updateUseCase: UpdateUserUseCase,
  userId: string
) {
  const [state, dispatch] = React.useReducer(
    formReducer,
    getInitialState(initialData)
  )
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  // フィールド更新
  const setField = React.useCallback((field: keyof UserFormData, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }, [])

  // バリデーション実行
  const validate = React.useCallback(() => {
    dispatch({ type: 'VALIDATE' })
  }, [])

  // フォームリセット
  const reset = React.useCallback((newInitialData?: UserFormData) => {
    dispatch({ type: 'RESET', initialData: newInitialData || initialData })
  }, [initialData])

  // フォーム送信
  const submit = React.useCallback(async () => {
    // 送信前のバリデーション
    validate()
    
    if (!state.isValid) {
      return false
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // ブランドタイプでのバリデーション
      const validUserId = UserFactory.createUserId(userId)
      
      // プロフィールデータの変換
      const profileUpdates = UserProfileSchema.partial().parse({
        firstName: UserFactory.createUserName(state.data.firstName),
        lastName: UserFactory.createUserName(state.data.lastName),
        bio: state.data.bio,
        avatarUrl: state.data.avatarUrl || undefined,
      })

      // ユースケース実行
      await updateUseCase.execute({
        userId: validUserId,
        profileUpdates,
      })

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新に失敗しました'
      setSubmitError(errorMessage)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [state.isValid, state.data, userId, updateUseCase, validate])

  // リアルタイムバリデーション
  React.useEffect(() => {
    if (state.isDirty) {
      const timer = setTimeout(validate, 300) // デバウンス
      return () => clearTimeout(timer)
    }
  }, [state.data, state.isDirty, validate])

  return {
    // 状態
    data: state.data,
    errors: state.errors,
    isValid: state.isValid,
    isDirty: state.isDirty,
    isSubmitting,
    submitError,
    
    // アクション
    setField,
    validate,
    reset,
    submit,
  }
}
```

```typescript
// frameworks/react/providers/DIProvider.tsx
import React from 'react'
import { ApiClient } from '../../api/client'
import { ApiUserRepository } from '../../../adapters/repositories/ApiUserRepository'
import { EmailNotificationService } from '../../../adapters/services/EmailNotificationService'
import { GetUserUseCase } from '../../../use-cases/user/GetUserUseCase'
import { UpdateUserUseCase } from '../../../use-cases/user/UpdateUserUseCase'

// 依存関係の型定義
export interface Dependencies {
  getUserUseCase: GetUserUseCase
  updateUserUseCase: UpdateUserUseCase
}

// DIコンテキスト
const DIContext = React.createContext<Dependencies | null>(null)

// DIプロバイダーのプロパティ
interface DIProviderProps {
  children: React.ReactNode
  apiBaseUrl?: string
}

export const DIProvider: React.FC<DIProviderProps> = ({ 
  children, 
  apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'
}) => {
  const dependencies = React.useMemo(() => {
    // 外部依存の構築
    const apiClient = new ApiClient(apiBaseUrl)
    const emailClient = new EmailApiClient(apiClient) // 仮想的な実装
    
    // リポジトリとサービス
    const userRepository = new ApiUserRepository(apiClient)
    const notificationService = new EmailNotificationService(emailClient)
    
    // ユースケース
    const getUserUseCase = new GetUserUseCase(userRepository, notificationService)
    const updateUserUseCase = new UpdateUserUseCase(userRepository, notificationService)
    
    return {
      getUserUseCase,
      updateUserUseCase,
    }
  }, [apiBaseUrl])

  return (
    <DIContext.Provider value={dependencies}>
      {children}
    </DIContext.Provider>
  )
}

// DIフック
export function useDependencies(): Dependencies {
  const context = React.useContext(DIContext)
  if (!context) {
    throw new Error('useDependencies must be used within DIProvider')
  }
  return context
}

// 個別フック
export function useGetUserUseCase(): GetUserUseCase {
  return useDependencies().getUserUseCase
}

export function useUpdateUserUseCase(): UpdateUserUseCase {
  return useDependencies().updateUserUseCase
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

## ブランドタイプとZodの実装方針

### ブランドタイプの設計原則

#### 1. 型安全性の確保
ブランドタイプを使用することで、同じプリミティブ型でも意味の異なる値を区別できます。

```typescript
// 悪い例：プリミティブ型のみ使用
function transferMoney(fromAccount: string, toAccount: string, amount: number) {
  // fromAccountとtoAccountを間違えて渡すリスクがある
}

// 良い例：ブランドタイプ使用
type AccountId = Brand<string, 'AccountId'>
type Amount = Brand<number, 'Amount'>

function transferMoney(fromAccount: AccountId, toAccount: AccountId, amount: Amount) {
  // 型レベルで引数の間違いを防げる
}
```

#### 2. Zodスキーマとの統合
ランタイムバリデーションと型安全性を両立させる設計パターン：

```typescript
// スキーマ定義とブランドタイプの一体化
export const AccountIdSchema = createBrandedSchema(
  z.string()
    .min(8, 'アカウントIDは8文字以上である必要があります')
    .max(32, 'アカウントIDは32文字以下である必要があります')
    .regex(/^ACC[0-9A-Z]+$/, 'アカウントIDはACC+英数字の形式である必要があります'),
  'AccountId'
)

export const AmountSchema = createBrandedSchema(
  z.number()
    .positive('金額は正の数である必要があります')
    .max(1000000, '一度に転送できる金額は100万円以下です')
    .multipleOf(0.01, '金額は1円単位で指定してください'),
  'Amount'
)
```

#### 3. エラーハンドリング戦略

```typescript
// ドメイン固有エラーの定義
export class InvalidAccountIdError extends Error {
  constructor(value: string, validationErrors: string[]) {
    super(`無効なアカウントID: ${value}\n詳細: ${validationErrors.join(', ')}`)
    this.name = 'InvalidAccountIdError'
  }
}

export class InvalidAmountError extends Error {
  constructor(value: number, validationErrors: string[]) {
    super(`無効な金額: ${value}\n詳細: ${validationErrors.join(', ')}`)
    this.name = 'InvalidAmountError'
  }
}

// ファクトリー関数でのエラーハンドリング
export class TransferFactory {
  static createAccountId(value: string): AccountId {
    try {
      return AccountIdSchema.parse(value)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new InvalidAccountIdError(
          value,
          error.errors.map(e => e.message)
        )
      }
      throw error
    }
  }

  static createAmount(value: number): Amount {
    try {
      return AmountSchema.parse(value)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new InvalidAmountError(
          value,
          error.errors.map(e => e.message)
        )
      }
      throw error
    }
  }
}
```

### 高度なZodパターン

#### 1. 条件付きバリデーション

```typescript
// ユーザータイプに応じたバリデーション
export const UserRegistrationSchema = z.object({
  userType: z.enum(['individual', 'business']),
  email: EmailSchema,
  profile: z.discriminatedUnion('userType', [
    z.object({
      userType: z.literal('individual'),
      firstName: UserNameSchema,
      lastName: UserNameSchema,
      birthDate: z.date().max(new Date(), '生年月日は今日以前である必要があります'),
    }),
    z.object({
      userType: z.literal('business'),
      companyName: z.string().min(1, '会社名を入力してください'),
      businessNumber: z.string().regex(/^\d{13}$/, '法人番号は13桁の数字である必要があります'),
      representative: UserNameSchema,
    })
  ])
})
```

#### 2. カスタムバリデーター

```typescript
// 複雑なビジネスルールのバリデーション
export const BusinessHoursSchema = z.object({
  openTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, '時刻はHH:MM形式で入力してください'),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, '時刻はHH:MM形式で入力してください'),
}).refine((data) => {
  const openMinutes = timeToMinutes(data.openTime)
  const closeMinutes = timeToMinutes(data.closeTime)
  return closeMinutes > openMinutes
}, {
  message: '閉店時刻は開店時刻より後である必要があります',
  path: ['closeTime']
})

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}
```

#### 3. 非同期バリデーション

```typescript
// 一意性チェックなどの非同期バリデーション
export function createEmailUniqueSchema(checkEmailExists: (email: string) => Promise<boolean>) {
  return EmailSchema.refine(async (email) => {
    const exists = await checkEmailExists(unwrapBrand(email))
    return !exists
  }, {
    message: 'このメールアドレスは既に使用されています'
  })
}

// 使用例
const EmailUniqueSchema = createEmailUniqueSchema(async (email) => {
  const user = await userRepository.findByEmail(email)
  return user !== null
})
```

### パフォーマンス最適化

#### 1. バリデーションキャッシュ

```typescript
// バリデーション結果のキャッシュ
class ValidationCache {
  private cache = new Map<string, { result: any; timestamp: number }>()
  private readonly TTL = 5 * 60 * 1000 // 5分

  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }

    return cached.result
  }

  set<T>(key: string, result: T): void {
    this.cache.set(key, { result, timestamp: Date.now() })
  }
}

// キャッシュ付きファクトリー
export class CachedUserFactory {
  private static cache = new ValidationCache()

  static createUserId(value: string): UserId {
    const cacheKey = `userId:${value}`
    const cached = this.cache.get<UserId>(cacheKey)
    
    if (cached) return cached

    const result = UserIdSchema.parse(value)
    this.cache.set(cacheKey, result)
    return result
  }
}
```

#### 2. 段階的バリデーション

```typescript
// 軽いバリデーションから重いバリデーションへ
export const UserRegistrationStageSchema = {
  // ステージ1: 基本形式チェック（高速）
  basicFormat: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),

  // ステージ2: 複雑なルールチェック（中速）
  businessRules: z.object({
    email: EmailSchema,
    password: z.string()
      .min(8, 'パスワードは8文字以上である必要があります')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '大文字・小文字・数字を含む必要があります'),
  }),

  // ステージ3: 外部チェック（低速）
  externalValidation: z.object({
    email: createEmailUniqueSchema(checkEmailExists),
  }),
}

// 段階的実行
export async function validateUserRegistration(data: unknown) {
  // ステージ1
  const basicData = UserRegistrationStageSchema.basicFormat.parse(data)
  
  // ステージ2
  const validatedData = UserRegistrationStageSchema.businessRules.parse(basicData)
  
  // ステージ3（必要な場合のみ）
  const finalData = await UserRegistrationStageSchema.externalValidation.parseAsync(validatedData)
  
  return finalData
}
```

## エラーハンドリング戦略

### ドメイン層でのエラー設計

#### 1. エラー階層の構築

```typescript
// ベースエラークラス
export abstract class DomainError extends Error {
  abstract readonly code: string
  abstract readonly statusCode: number
  
  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message)
    this.name = this.constructor.name
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
    }
  }
}

// バリデーションエラー
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR'
  readonly statusCode = 400

  constructor(
    message: string,
    public readonly validationErrors: Array<{ field: string; message: string }>,
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

// ビジネスルールエラー
export class BusinessRuleError extends DomainError {
  readonly code = 'BUSINESS_RULE_VIOLATION'
  readonly statusCode = 422

  constructor(message: string, public readonly rule: string, context?: Record<string, unknown>) {
    super(message, context)
  }
}

// リソース未発見エラー
export class NotFoundError extends DomainError {
  readonly code = 'RESOURCE_NOT_FOUND'
  readonly statusCode = 404

  constructor(resource: string, identifier: string, context?: Record<string, unknown>) {
    super(`${resource}が見つかりません: ${identifier}`, context)
  }
}
```

#### 2. Zodエラーからドメインエラーへの変換

```typescript
export class ErrorMapper {
  static fromZodError(error: z.ZodError, context?: Record<string, unknown>): ValidationError {
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }))

    return new ValidationError(
      'バリデーションエラーが発生しました',
      validationErrors,
      context
    )
  }

  static fromUnknownError(error: unknown, context?: Record<string, unknown>): DomainError {
    if (error instanceof z.ZodError) {
      return this.fromZodError(error, context)
    }

    if (error instanceof DomainError) {
      return error
    }

    if (error instanceof Error) {
      return new class extends DomainError {
        readonly code = 'UNKNOWN_ERROR'
        readonly statusCode = 500
      }(error.message, context)
    }

    return new class extends DomainError {
      readonly code = 'UNKNOWN_ERROR'
      readonly statusCode = 500
    }('不明なエラーが発生しました', context)
  }
}
```

#### 3. エラーハンドリングのベストプラクティス

```typescript
// ユースケースでのエラーハンドリング
export class CreateUserUseCase {
  async execute(input: unknown): Promise<User> {
    try {
      // 入力バリデーション
      const validatedInput = CreateUserInputSchema.parse(input)
      
      // ビジネスルールチェック
      await this.validateBusinessRules(validatedInput)
      
      // エンティティ作成
      const user = UserFactory.create(validatedInput)
      
      // 保存
      await this.userRepository.save(user)
      
      return user
    } catch (error) {
      // ドメインエラーに統一
      const domainError = ErrorMapper.fromUnknownError(error, {
        useCase: 'CreateUserUseCase',
        input: JSON.stringify(input),
        timestamp: new Date().toISOString(),
      })
      
      // ログ出力
      this.logger.error('ユーザー作成エラー', {
        error: domainError.toJSON(),
        stackTrace: domainError.stack,
      })
      
      throw domainError
    }
  }

  private async validateBusinessRules(input: CreateUserInput): Promise<void> {
    // メールアドレスの重複チェック
    const existingUser = await this.userRepository.findByEmail(input.email)
    if (existingUser) {
      throw new BusinessRuleError(
        'このメールアドレスは既に使用されています',
        'email_uniqueness',
        { email: unwrapBrand(input.email) }
      )
    }

    // その他のビジネスルール...
  }
}
```

## 依存関係注入

### DIコンテナの実装

#### 1. 型安全なDIコンテナ

```typescript
// di/container.ts
import { z } from 'zod'

// 依存関係の型定義
export interface Dependencies {
  // Repositories
  userRepository: UserRepository
  
  // Services
  notificationService: NotificationService
  emailService: EmailService
  
  // Use Cases
  getUserUseCase: GetUserUseCase
  updateUserUseCase: UpdateUserUseCase
  createUserUseCase: CreateUserUseCase
  
  // External Services
  apiClient: ApiClient
  logger: Logger
}

// DIトークン（型安全なキー）
export const DITokens = {
  UserRepository: Symbol('UserRepository'),
  NotificationService: Symbol('NotificationService'),
  EmailService: Symbol('EmailService'),
  GetUserUseCase: Symbol('GetUserUseCase'),
  UpdateUserUseCase: Symbol('UpdateUserUseCase'),
  CreateUserUseCase: Symbol('CreateUserUseCase'),
  ApiClient: Symbol('ApiClient'),
  Logger: Symbol('Logger'),
} as const

type DIToken = typeof DITokens[keyof typeof DITokens]

// ライフサイクル管理
export enum Lifecycle {
  Singleton = 'singleton',
  Transient = 'transient',
  Scoped = 'scoped',
}

interface ServiceDescriptor<T = any> {
  token: DIToken
  factory: (container: DIContainer) => T
  lifecycle: Lifecycle
  dependencies?: DIToken[]
}

export class DIContainer {
  private services = new Map<DIToken, ServiceDescriptor>()
  private instances = new Map<DIToken, any>()
  private scoped = new Map<DIToken, any>()

  /**
   * サービスを登録します
   */
  register<T>(
    token: DIToken,
    factory: (container: DIContainer) => T,
    lifecycle: Lifecycle = Lifecycle.Singleton,
    dependencies: DIToken[] = []
  ): void {
    this.services.set(token, {
      token,
      factory,
      lifecycle,
      dependencies,
    })
  }

  /**
   * サービスを解決します
   */
  resolve<T>(token: DIToken): T {
    const descriptor = this.services.get(token)
    if (!descriptor) {
      throw new Error(`Service not registered: ${token.toString()}`)
    }

    switch (descriptor.lifecycle) {
      case Lifecycle.Singleton:
        return this.resolveSingleton(descriptor)
      
      case Lifecycle.Transient:
        return this.resolveTransient(descriptor)
      
      case Lifecycle.Scoped:
        return this.resolveScoped(descriptor)
      
      default:
        throw new Error(`Unknown lifecycle: ${descriptor.lifecycle}`)
    }
  }

  /**
   * スコープを開始します
   */
  beginScope(): DIScope {
    return new DIScope(this)
  }

  /**
   * 依存関係グラフの検証
   */
  validateDependencyGraph(): void {
    const visited = new Set<DIToken>()
    const visiting = new Set<DIToken>()

    for (const token of this.services.keys()) {
      this.validateDependencyGraphRecursive(token, visited, visiting)
    }
  }

  private resolveSingleton<T>(descriptor: ServiceDescriptor<T>): T {
    if (!this.instances.has(descriptor.token)) {
      const instance = descriptor.factory(this)
      this.instances.set(descriptor.token, instance)
    }
    return this.instances.get(descriptor.token)
  }

  private resolveTransient<T>(descriptor: ServiceDescriptor<T>): T {
    return descriptor.factory(this)
  }

  private resolveScoped<T>(descriptor: ServiceDescriptor<T>): T {
    if (!this.scoped.has(descriptor.token)) {
      const instance = descriptor.factory(this)
      this.scoped.set(descriptor.token, instance)
    }
    return this.scoped.get(descriptor.token)
  }

  private validateDependencyGraphRecursive(
    token: DIToken,
    visited: Set<DIToken>,
    visiting: Set<DIToken>
  ): void {
    if (visiting.has(token)) {
      throw new Error(`Circular dependency detected: ${token.toString()}`)
    }

    if (visited.has(token)) {
      return
    }

    visiting.add(token)

    const descriptor = this.services.get(token)
    if (descriptor?.dependencies) {
      for (const dependency of descriptor.dependencies) {
        this.validateDependencyGraphRecursive(dependency, visited, visiting)
      }
    }

    visiting.delete(token)
    visited.add(token)
  }
}

// スコープ管理
export class DIScope {
  constructor(private readonly container: DIContainer) {}

  resolve<T>(token: DIToken): T {
    return this.container.resolve<T>(token)
  }

  dispose(): void {
    // スコープ済みインスタンスのクリーンアップ
    this.container['scoped'].clear()
  }
}
```

#### 2. モジュラー設定

```typescript
// di/modules/infrastructure.module.ts
export function registerInfrastructureModule(container: DIContainer): void {
  // API Client
  container.register(
    DITokens.ApiClient,
    () => new ApiClient(
      process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'
    ),
    Lifecycle.Singleton
  )

  // Logger
  container.register(
    DITokens.Logger,
    () => new ConsoleLogger(),
    Lifecycle.Singleton
  )
}

// di/modules/repository.module.ts
export function registerRepositoryModule(container: DIContainer): void {
  // User Repository
  container.register(
    DITokens.UserRepository,
    (c) => new ApiUserRepository(c.resolve(DITokens.ApiClient)),
    Lifecycle.Singleton,
    [DITokens.ApiClient]
  )
}

// di/modules/service.module.ts
export function registerServiceModule(container: DIContainer): void {
  // Notification Service
  container.register(
    DITokens.NotificationService,
    (c) => new EmailNotificationService(c.resolve(DITokens.EmailService)),
    Lifecycle.Singleton,
    [DITokens.EmailService]
  )

  // Email Service
  container.register(
    DITokens.EmailService,
    (c) => new EmailService(c.resolve(DITokens.ApiClient)),
    Lifecycle.Singleton,
    [DITokens.ApiClient]
  )
}

// di/modules/use-case.module.ts
export function registerUseCaseModule(container: DIContainer): void {
  // Get User Use Case
  container.register(
    DITokens.GetUserUseCase,
    (c) => new GetUserUseCase(
      c.resolve(DITokens.UserRepository),
      c.resolve(DITokens.NotificationService)
    ),
    Lifecycle.Transient, // ユースケースは毎回新しいインスタンス
    [DITokens.UserRepository, DITokens.NotificationService]
  )

  // Update User Use Case
  container.register(
    DITokens.UpdateUserUseCase,
    (c) => new UpdateUserUseCase(
      c.resolve(DITokens.UserRepository),
      c.resolve(DITokens.NotificationService)
    ),
    Lifecycle.Transient,
    [DITokens.UserRepository, DITokens.NotificationService]
  )
}
```

#### 3. React統合

```typescript
// frameworks/react/providers/DIProvider.tsx
import React from 'react'
import { DIContainer, DITokens } from '../../../di/container'
import { 
  registerInfrastructureModule,
  registerRepositoryModule,
  registerServiceModule,
  registerUseCaseModule 
} from '../../../di/modules'

// DIコンテキスト
const DIContext = React.createContext<DIContainer | null>(null)

interface DIProviderProps {
  children: React.ReactNode
  config?: {
    apiBaseUrl?: string
    logLevel?: string
  }
}

export const DIProvider: React.FC<DIProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  const container = React.useMemo(() => {
    const container = new DIContainer()
    
    // 設定の注入
    process.env.REACT_APP_API_BASE_URL = config.apiBaseUrl || process.env.REACT_APP_API_BASE_URL
    
    // モジュール登録
    registerInfrastructureModule(container)
    registerRepositoryModule(container)
    registerServiceModule(container)
    registerUseCaseModule(container)
    
    // 依存関係グラフの検証
    container.validateDependencyGraph()
    
    return container
  }, [config])

  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  )
}

// DIフック
export function useDI(): DIContainer {
  const container = React.useContext(DIContext)
  if (!container) {
    throw new Error('useDI must be used within DIProvider')
  }
  return container
}

// 個別サービス取得フック
export function useService<T>(token: DIToken): T {
  const container = useDI()
  return React.useMemo(() => container.resolve<T>(token), [container, token])
}

// ユースケース専用フック
export function useGetUserUseCase() {
  return useService<GetUserUseCase>(DITokens.GetUserUseCase)
}

export function useUpdateUserUseCase() {
  return useService<UpdateUserUseCase>(DITokens.UpdateUserUseCase)
}
```

#### 4. テスト用DIコンテナ

```typescript
// test-utils/test-container.ts
export function createTestContainer(): DIContainer {
  const container = new DIContainer()

  // モックサービスの登録
  container.register(
    DITokens.UserRepository,
    () => new MockUserRepository(),
    Lifecycle.Singleton
  )

  container.register(
    DITokens.NotificationService,
    () => new MockNotificationService(),
    Lifecycle.Singleton
  )

  container.register(
    DITokens.GetUserUseCase,
    (c) => new GetUserUseCase(
      c.resolve(DITokens.UserRepository),
      c.resolve(DITokens.NotificationService)
    ),
    Lifecycle.Transient,
    [DITokens.UserRepository, DITokens.NotificationService]
  )

  return container
}

// テスト用プロバイダー
export const TestDIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const container = React.useMemo(() => createTestContainer(), [])
  
  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  )
}
```

#### 5. 環境別設定

```typescript
// di/config/development.ts
export const developmentConfig = {
  apiBaseUrl: 'http://localhost:3001',
  logLevel: 'debug',
  enableMocks: true,
}

// di/config/production.ts
export const productionConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
  logLevel: 'error',
  enableMocks: false,
}

// di/config/test.ts
export const testConfig = {
  apiBaseUrl: 'http://localhost:3001',
  logLevel: 'silent',
  enableMocks: true,
}

// 環境に応じた設定の選択
export function getConfig() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return developmentConfig
    case 'production':
      return productionConfig
    case 'test':
      return testConfig
    default:
      return developmentConfig
  }
}
```

### アプリケーション起動時の設定

```typescript
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { DIProvider } from './frameworks/react/providers/DIProvider'
import { getConfig } from './di/config'
import App from './App'

const config = getConfig()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DIProvider config={config}>
      <App />
    </DIProvider>
  </React.StrictMode>
)
```

## テスト戦略

### ブランドタイプとZodバリデーションを活用したテスト設計

#### ユニットテスト

```typescript
// entities/User.test.ts
import { describe, test, expect } from 'vitest'
import { z } from 'zod'
import { 
  UserFactory, 
  UserIdSchema, 
  EmailSchema, 
  UserNameSchema,
  UserHelpers 
} from './User'

describe('User エンティティ', () => {
  describe('ブランドタイプのバリデーション', () => {
    test('有効なUserIdが作成される', () => {
      const validId = 'user123'
      const userId = UserFactory.createUserId(validId)
      
      expect(userId).toBeDefined()
      expect(typeof userId).toBe('string')
    })

    test('無効なUserIdでエラーが発生する', () => {
      const invalidIds = ['ab', '', '123!@#', ' spaces ']
      
      invalidIds.forEach(invalidId => {
        expect(() => UserFactory.createUserId(invalidId))
          .toThrow(z.ZodError)
      })
    })

    test('有効なEmailが作成される', () => {
      const validEmail = 'test@example.com'
      const email = UserFactory.createEmail(validEmail)
      
      expect(email).toBeDefined()
    })

    test('無効なEmailでエラーが発生する', () => {
      const invalidEmails = ['invalid', '@invalid.com', 'test@', 'test@.com']
      
      invalidEmails.forEach(invalidEmail => {
        expect(() => UserFactory.createEmail(invalidEmail))
          .toThrow(z.ZodError)
      })
    })
  })

  describe('Userエンティティの作成', () => {
    test('有効なデータでUserが作成される', () => {
      const validUserData = {
        id: 'user123',
        email: 'test@example.com',
        profile: {
          firstName: '太郎',
          lastName: '田中',
          bio: 'Hello, world!',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const user = UserFactory.create(validUserData)
      
      expect(user).toBeDefined()
      expect(user.id).toBeDefined()
      expect(user.email).toBeDefined()
    })

    test('無効なデータでエラーが発生する', () => {
      const invalidUserData = {
        id: 'ab', // 短すぎる
        email: 'invalid-email',
        profile: {
          firstName: '',
          lastName: '',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(() => UserFactory.create(invalidUserData))
        .toThrow(z.ZodError)
    })
  })

  describe('UserHelpers', () => {
    const testUser = UserFactory.create({
      id: 'user123',
      email: 'test@example.com',
      profile: {
        firstName: '太郎',
        lastName: '田中',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    test('フルネームが正しく取得される', () => {
      const fullName = UserHelpers.getFullName(testUser)
      expect(fullName).toBe('太郎 田中')
    })

    test('管理者判定が正しく動作する', () => {
      const adminUser = UserFactory.create({
        ...testUser,
        email: 'admin@admin.example.com',
      })
      
      expect(UserHelpers.isAdmin(adminUser)).toBe(true)
      expect(UserHelpers.isAdmin(testUser)).toBe(false)
    })
  })
})
```

```typescript
// use-cases/user/GetUserUseCase.test.ts
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { z } from 'zod'
import { GetUserUseCase, UserNotFoundError } from './GetUserUseCase'
import { UserFactory } from '../../entities/User'
import type { UserRepository, NotificationService } from './GetUserUseCase'

// モックリポジトリ
class MockUserRepository implements UserRepository {
  private users = new Map()

  async findById(id: any) {
    return this.users.get(id) || null
  }

  async findByEmail(email: any) {
    return Array.from(this.users.values()).find(user => user.email === email) || null
  }

  async save(user: any) {
    this.users.set(user.id, user)
  }

  async delete(id: any) {
    this.users.delete(id)
  }

  // テスト用ヘルパー
  setUser(user: any) {
    if (user) {
      this.users.set(user.id, user)
    }
  }

  clear() {
    this.users.clear()
  }
}

// モック通知サービス
class MockNotificationService implements NotificationService {
  public sentNotifications: Array<{ message: string; recipient: any }> = []

  async send(message: string, recipient: any) {
    this.sentNotifications.push({ message, recipient })
  }

  clear() {
    this.sentNotifications = []
  }
}

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase
  let mockRepository: MockUserRepository
  let mockNotificationService: MockNotificationService

  beforeEach(() => {
    mockRepository = new MockUserRepository()
    mockNotificationService = new MockNotificationService()
    useCase = new GetUserUseCase(mockRepository, mockNotificationService)
  })

  const createTestUser = () => UserFactory.create({
    id: 'test-user-123',
    email: 'test@example.com',
    profile: {
      firstName: '太郎',
      lastName: '田中',
      bio: 'テストユーザーです',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  })

  describe('正常系', () => {
    test('存在するユーザーを正しく取得し、通知を送信する', async () => {
      // Arrange
      const testUser = createTestUser()
      mockRepository.setUser(testUser)

      const input = {
        userId: UserFactory.createUserId('test-user-123')
      }

      // Act
      const result = await useCase.execute(input)

      // Assert
      expect(result.user).toEqual(testUser)
      expect(result.lastAccessTime).toBeInstanceOf(Date)
      expect(mockNotificationService.sentNotifications).toHaveLength(1)
      expect(mockNotificationService.sentNotifications[0].message)
        .toBe('ユーザープロフィールが閲覧されました')
    })

    test('入力バリデーションが正しく動作する', async () => {
      // Arrange
      const testUser = createTestUser()
      mockRepository.setUser(testUser)

      const validInput = {
        userId: 'test-user-123' // 文字列でも自動変換される
      }

      // Act
      const result = await useCase.execute(validInput)

      // Assert
      expect(result.user).toEqual(testUser)
    })
  })

  describe('異常系', () => {
    test('存在しないユーザーでUserNotFoundErrorが発生する', async () => {
      // Arrange
      const input = {
        userId: UserFactory.createUserId('non-existent-user')
      }

      // Act & Assert
      await expect(useCase.execute(input))
        .rejects
        .toThrow(UserNotFoundError)
    })

    test('無効な入力でZodErrorが発生する', async () => {
      // Arrange
      const invalidInput = {
        userId: 'ab' // 短すぎる
      }

      // Act & Assert
      await expect(useCase.execute(invalidInput))
        .rejects
        .toThrow(z.ZodError)
    })

    test('削除されたユーザーでアクセス拒否エラーが発生する', async () => {
      // Arrange
      const deletedUser = UserFactory.create({
        id: 'deleted-user',
        email: 'deleted@example.com',
        profile: {
          firstName: '', // 空の名前（削除済み扱い）
          lastName: '',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      mockRepository.setUser(deletedUser)

      const input = {
        userId: UserFactory.createUserId('deleted-user')
      }

      // Act & Assert
      await expect(useCase.execute(input))
        .rejects
        .toThrow('UserAccessDeniedError')
    })
  })

  describe('バリデーション', () => {
    test('出力スキーマのバリデーションが正しく動作する', async () => {
      // Arrange
      const testUser = createTestUser()
      mockRepository.setUser(testUser)

      const input = {
        userId: UserFactory.createUserId('test-user-123')
      }

      // Act
      const result = await useCase.execute(input)

      // Assert
      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('lastAccessTime')
      expect(result.lastAccessTime).toBeInstanceOf(Date)
    })
  })
})
```

#### 統合テスト

```typescript
// adapters/repositories/ApiUserRepository.integration.test.ts
import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { ApiUserRepository } from './ApiUserRepository'
import { UserFactory } from '../../entities/User'
import { MockApiClient } from '../__mocks__/MockApiClient'

// MSWサーバーのセットアップ
const handlers = [
  http.get('/users/:id', ({ params }) => {
    const userId = params.id
    
    if (userId === 'test-user-123') {
      return HttpResponse.json({
        id: 'test-user-123',
        email: 'test@example.com',
        first_name: '太郎',
        last_name: '田中',
        bio: 'テストユーザーです',
        avatar_url: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        is_active: true,
      })
    }
    
    return new HttpResponse(null, { status: 404 })
  }),

  http.put('/users/:id', async ({ request, params }) => {
    const userId = params.id
    const body = await request.json()
    
    return HttpResponse.json({
      id: userId,
      ...body,
      updated_at: new Date().toISOString(),
    })
  }),
]

const server = setupServer(...handlers)

describe('ApiUserRepository 統合テスト', () => {
  let repository: ApiUserRepository
  let mockClient: MockApiClient

  beforeEach(() => {
    server.listen()
    mockClient = new MockApiClient('http://localhost:3001')
    repository = new ApiUserRepository(mockClient)
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('findById', () => {
    test('存在するユーザーを正しく取得しドメインエンティティに変換する', async () => {
      // Arrange
      const userId = UserFactory.createUserId('test-user-123')

      // Act
      const user = await repository.findById(userId)

      // Assert
      expect(user).toBeDefined()
      expect(user!.id).toBe(userId)
      expect(user!.email).toBeDefined()
      expect(user!.profile.firstName).toBeDefined()
      expect(user!.createdAt).toBeInstanceOf(Date)
    })

    test('存在しないユーザーでnullを返す', async () => {
      // Arrange
      const userId = UserFactory.createUserId('non-existent')

      // Act
      const user = await repository.findById(userId)

      // Assert
      expect(user).toBeNull()
    })
  })

  describe('save', () => {
    test('ユーザーを正しく保存する', async () => {
      // Arrange
      const user = UserFactory.create({
        id: 'save-test-user',
        email: 'save@example.com',
        profile: {
          firstName: '保存',
          lastName: 'テスト',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Act & Assert（エラーが発生しないことを確認）
      await expect(repository.save(user)).resolves.not.toThrow()
    })
  })

  describe('データ変換', () => {
    test('APIレスポンスからドメインエンティティへの変換が正しく動作する', async () => {
      // Arrange
      const userId = UserFactory.createUserId('test-user-123')

      // Act
      const user = await repository.findById(userId)

      // Assert
      expect(user).toBeDefined()
      
      // ブランドタイプの検証
      expect(() => UserFactory.createUserId(user!.id as string)).not.toThrow()
      expect(() => UserFactory.createEmail(user!.email as string)).not.toThrow()
      
      // プロパティの検証
      expect(user!.profile.firstName).toBe('太郎')
      expect(user!.profile.lastName).toBe('田中')
      expect(user!.profile.bio).toBe('テストユーザーです')
    })
  })
})
```

#### E2Eテスト

```typescript
// frameworks/react/components/UserProfile.e2e.test.ts
import { test, expect } from '@playwright/test'
import { setupTestDatabase, cleanupTestDatabase } from '../../../test-utils/database'
import { createTestUser } from '../../../test-utils/factories'

test.describe('UserProfile E2E', () => {
  test.beforeEach(async () => {
    await setupTestDatabase()
  })

  test.afterEach(async () => {
    await cleanupTestDatabase()
  })

  test('ユーザープロフィールが正しく表示される', async ({ page }) => {
    // Arrange
    const testUser = await createTestUser({
      id: 'e2e-test-user',
      email: 'e2e@example.com',
      profile: {
        firstName: 'E2E',
        lastName: 'テスト',
        bio: 'E2Eテスト用ユーザーです',
      },
    })

    // Act
    await page.goto(`/users/${testUser.id}`)

    // Assert
    await expect(page.getByTestId('user-profile')).toBeVisible()
    await expect(page.getByText('E2E テスト')).toBeVisible()
    await expect(page.getByText('e2e@example.com')).toBeVisible()
    await expect(page.getByText('E2Eテスト用ユーザーです')).toBeVisible()
  })

  test('存在しないユーザーでエラーが表示される', async ({ page }) => {
    // Act
    await page.goto('/users/non-existent-user')

    // Assert
    await expect(page.getByText('ユーザーが見つかりません')).toBeVisible()
    await expect(page.getByRole('button', { name: '再試行' })).toBeVisible()
  })

  test('管理者バッジが正しく表示される', async ({ page }) => {
    // Arrange
    const adminUser = await createTestUser({
      id: 'admin-user',
      email: 'admin@admin.example.com',
      profile: {
        firstName: '管理者',
        lastName: 'ユーザー',
      },
    })

    // Act
    await page.goto(`/users/${adminUser.id}`)

    // Assert
    await expect(page.getByText('👑 管理者')).toBeVisible()
  })

  test('バリデーションエラーが適切に処理される', async ({ page }) => {
    // Act - 無効なユーザーIDでアクセス
    await page.goto('/users/ab') // 短すぎるID

    // Assert
    await expect(page.getByText('エラーが発生しました')).toBeVisible()
  })
})
```

#### テストユーティリティ

```typescript
// test-utils/factories.ts
import { UserFactory } from '../entities/User'

export function createTestUser(overrides: Partial<any> = {}) {
  const defaultUser = {
    id: 'test-user-' + Math.random().toString(36).substr(2, 9),
    email: `test-${Date.now()}@example.com`,
    profile: {
      firstName: 'テスト',
      lastName: 'ユーザー',
      bio: 'テスト用ユーザーです',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return UserFactory.create({
    ...defaultUser,
    ...overrides,
  })
}

export function createTestUserId(suffix = '') {
  return UserFactory.createUserId(`test-user-${suffix || Math.random().toString(36).substr(2, 9)}`)
}

export function createTestEmail(domain = 'example.com') {
  return UserFactory.createEmail(`test-${Date.now()}@${domain}`)
}
```

```typescript
// test-utils/validation-helpers.ts
import { z } from 'zod'

/**
 * Zodエラーのテスト用ヘルパー
 */
export function expectZodError(
  fn: () => unknown,
  expectedErrors: Array<{ path: string; message: string }>
) {
  try {
    fn()
    throw new Error('Expected ZodError to be thrown')
  } catch (error) {
    if (!(error instanceof z.ZodError)) {
      throw new Error(`Expected ZodError, got ${error?.constructor?.name}`)
    }

    expectedErrors.forEach(expectedError => {
      const matchingError = error.errors.find(
        err => err.path.join('.') === expectedError.path
      )
      
      if (!matchingError) {
        throw new Error(`Expected error at path '${expectedError.path}' not found`)
      }
      
      if (!matchingError.message.includes(expectedError.message)) {
        throw new Error(
          `Expected message '${expectedError.message}' not found in '${matchingError.message}'`
        )
      }
    })
  }
}

/**
 * ブランドタイプのテスト用ヘルパー
 */
export function isBrandType<T, TBrand>(
  value: unknown,
  validator: (v: unknown) => value is T & { __brand: TBrand }
): value is T & { __brand: TBrand } {
  return validator(value)
}
```

## 実装計画

### フェーズ1: 基盤整備（1-2週間）

#### 1.1 ブランドタイプ基盤の構築
- [ ] `entities/types/brand.ts` - ブランドタイプユーティリティの実装
- [ ] 基本的なブランドタイプ（UserId, Email, UserName）の作成
- [ ] Zodスキーマとの統合ヘルパーの実装
- [ ] バリデーションエラーハンドリングの統一

**成果物:**
```bash
src/
├── entities/
│   ├── types/
│   │   └── brand.ts          # ブランドタイプの基盤
│   └── User.ts               # ユーザーエンティティとバリデーション
```

**検証基準:**
- すべてのブランドタイプが型安全であること
- Zodバリデーションが正常に動作すること
- エラーメッセージが日本語で適切に表示されること

#### 1.2 エンティティレイヤーの実装
- [ ] Userエンティティの完全実装
- [ ] UserFactoryクラスの実装
- [ ] UserHelpersユーティリティの実装
- [ ] 包括的なユニットテストの作成

**実装優先度:**
1. 最重要: UserId, Email のブランドタイプ
2. 重要: UserProfile の構造定義
3. 推奨: UserHelpers のビジネスロジック

#### 1.3 テスト基盤の構築
- [ ] テストユーティリティ（factories.ts）の作成
- [ ] バリデーションヘルパー（validation-helpers.ts）の実装
- [ ] モックオブジェクトの基盤作成
- [ ] テスト設定の最適化

### フェーズ2: ユースケース実装（2-3週間）

#### 2.1 基本ユースケースの実装
- [ ] GetUserUseCase - ユーザー取得ロジック
- [ ] UpdateUserUseCase - ユーザー更新ロジック
- [ ] CreateUserUseCase - ユーザー作成ロジック
- [ ] DeleteUserUseCase - ユーザー削除ロジック

**各ユースケースの実装項目:**
1. 入力バリデーションスキーマ
2. 出力バリデーションスキーマ
3. ビジネスルールの実装
4. エラーハンドリング
5. 包括的なユニットテスト

#### 2.2 高度なユースケース
- [ ] SearchUsersUseCase - ユーザー検索
- [ ] BulkUpdateUsersUseCase - 一括更新
- [ ] UserAnalyticsUseCase - ユーザー分析

**ビジネスルール例:**
- メールアドレスの一意性制約
- 管理者権限のチェック
- アカウント有効性の確認
- データ整合性の保証

### フェーズ3: アダプターレイヤー実装（2-3週間）

#### 3.1 Repository実装
- [ ] ApiUserRepository - REST API連携
- [ ] LocalStorageUserRepository - ローカルストレージ連携
- [ ] CacheUserRepository - キャッシュ機能付きリポジトリ

**実装パターン:**
```typescript
// 統合テスト例
describe('ApiUserRepository', () => {
  test('APIレスポンスからドメインエンティティへの変換', async () => {
    // APIレスポンスのモック
    // ドメインエンティティへの変換テスト
    // バリデーションエラーのテスト
  })
})
```

#### 3.2 Service実装
- [ ] EmailNotificationService - メール通知
- [ ] PushNotificationService - プッシュ通知
- [ ] AuditLogService - 監査ログ

#### 3.3 Presenter実装
- [ ] UserPresenter - ビュー変換ロジック
- [ ] UserListPresenter - リスト表示用
- [ ] UserSearchResultPresenter - 検索結果用

### フェーズ4: フレームワーク統合（2-3週間）

#### 4.1 React Components
- [ ] UserProfile - ユーザープロフィール表示
- [ ] UserForm - ユーザー編集フォーム
- [ ] UserList - ユーザーリスト表示
- [ ] UserSearch - ユーザー検索

**コンポーネント設計原則:**
- プレゼンテーション関心の分離
- 型安全なprops定義
- アクセシビリティ対応
- エラーハンドリング

#### 4.2 Custom Hooks
- [ ] useUserForm - フォーム状態管理
- [ ] useUserSearch - 検索機能
- [ ] useUserCache - キャッシュ管理

```typescript
// フック実装例
export function useUserForm(userId: string) {
  const updateUseCase = useUpdateUserUseCase()
  
  return useForm({
    validationSchema: UserFormSchema,
    onSubmit: async (data) => {
      await updateUseCase.execute(data)
    }
  })
}
```

#### 4.3 依存関係注入の統合
- [ ] DIContainer の実装
- [ ] モジュラー設定の構築
- [ ] 環境別設定の実装
- [ ] テスト用コンテナの作成

### フェーズ5: 高度な機能（3-4週間）

#### 5.1 パフォーマンス最適化
- [ ] バリデーションキャッシュの実装
- [ ] 段階的バリデーションの導入
- [ ] メモ化戦略の実装
- [ ] バンドルサイズ最適化

**最適化指標:**
- バリデーション実行時間: < 10ms
- コンポーネント再レンダリング回数: 最小化
- バンドルサイズ: < 500KB (gzip後)

#### 5.2 エラーハンドリングの高度化
- [ ] グローバルエラーハンドラー
- [ ] エラー監視との統合
- [ ] ユーザーフレンドリーなエラー表示
- [ ] エラー復旧機能

#### 5.3 デベロッパーエクスペリエンス向上
- [ ] TypeDoc自動生成の設定
- [ ] Storybook統合
- [ ] デバッグツールの作成
- [ ] 開発用モックの充実

### フェーズ6: 本格運用準備（2-3週間）

#### 6.1 品質保証
- [ ] E2Eテストの包括的実装
- [ ] パフォーマンステストの実行
- [ ] セキュリティテストの実施
- [ ] アクセシビリティテストの実行

**品質基準:**
- テストカバレッジ: 90%以上
- E2Eテスト: 主要機能すべて
- パフォーマンス: Core Web Vitals合格
- アクセシビリティ: WCAG 2.1 AA準拠

#### 6.2 ドキュメント整備
- [ ] API仕様書の完成
- [ ] 運用手順書の作成
- [ ] トラブルシューティングガイド
- [ ] 開発者向けドキュメント

#### 6.3 CI/CD最適化
- [ ] ビルドパフォーマンスの最適化
- [ ] テスト実行時間の短縮
- [ ] デプロイメント自動化
- [ ] 監視・アラート設定

### 継続的改善フェーズ（運用開始後）

#### 実際の利用データに基づく改善
- [ ] ユーザビリティ分析
- [ ] パフォーマンス監視
- [ ] エラー率の追跡
- [ ] 機能利用状況の分析

#### アーキテクチャの進化
- [ ] 新しいパターンの導入
- [ ] レガシーコードの段階的改善
- [ ] 依存関係の最新化
- [ ] セキュリティ対策の強化

### マイルストーン

| フェーズ | 期間 | 主要成果物 | 完了基準 |
|---------|------|-----------|----------|
| 1 | 1-2週間 | ブランドタイプ基盤 | 基本的なエンティティが動作 |
| 2 | 2-3週間 | ユースケース実装 | CRUDオペレーションが完了 |
| 3 | 2-3週間 | アダプター実装 | 外部連携が動作 |
| 4 | 2-3週間 | React統合 | UIコンポーネントが完成 |
| 5 | 3-4週間 | 高度な機能 | パフォーマンス目標達成 |
| 6 | 2-3週間 | 運用準備 | 本格運用開始可能 |

### 推奨開発順序

#### 週単位の作業計画

**第1週:** ブランドタイプとエンティティ
- Day 1-2: ブランドタイプユーティリティ
- Day 3-4: Userエンティティ実装
- Day 5: テスト基盤構築

**第2週:** ユースケース基盤
- Day 1-2: GetUserUseCase実装
- Day 3-4: UpdateUserUseCase実装
- Day 5: エラーハンドリング統一

**第3-4週:** アダプターとリポジトリ
- 外部API連携の実装
- データ変換ロジックの実装
- 統合テストの作成

**第5-6週:** React統合
- コンポーネント実装
- フック実装
- DI統合

この計画により、段階的に機能を構築し、各フェーズで動作可能な成果物を提供できます。

## 利点と期待効果

### ブランドタイプとZodバリデーションによる恩恵

#### 型安全性の向上
- **コンパイル時エラー検出**: 同じプリミティブ型でも意味の異なる値の混同を防止
- **関数シグネチャの明確化**: パラメータの意図が型レベルで表現される
- **リファクタリング安全性**: 型の変更が依存箇所に確実に伝播

```typescript
// Before: 引数の意味が不明確
function transferMoney(from: string, to: string, amount: number) { ... }

// After: 型レベルで意味が明確
function transferMoney(from: AccountId, to: AccountId, amount: Amount) { ... }
```

#### 実行時安全性の保証
- **バリデーションの自動化**: データ境界でのZodによる自動検証
- **エラーハンドリングの統一**: 一貫した日本語エラーメッセージ
- **データ整合性**: 不正なデータの早期検出と除外

#### 開発生産性の向上
- **IDEサポート**: 型情報による強力な自動補完とエラー検出
- **テスタビリティ**: モックオブジェクトの作成が容易
- **ドキュメント生成**: TypeDocによる自動API文書生成

### 開発効率への影響

#### 短期的効果（1-3ヶ月）
- **バグ削減**: 型エラーによる実行時エラーの90%減少
- **レビュー効率化**: 型安全性による品質担保でレビュー観点の簡素化
- **新規参加者の学習**: 型定義によるドメイン知識の可視化

#### 中期的効果（3-12ヶ月）
- **保守性向上**: 要求変更時の影響範囲の明確化
- **並行開発**: インターフェース契約による独立した開発作業
- **品質の安定**: 自動化されたバリデーションによる品質の底上げ

#### 長期的効果（1年以上）
- **技術的負債の抑制**: 型安全性による設計品質の維持
- **チーム知識の共有**: ドメインモデルの型による知識の明文化
- **新機能開発の加速**: 再利用可能なコンポーネントの蓄積

### クリーンアーキテクチャの利点

#### 関心の分離による恩恵
- **テスト性**: 各レイヤーの独立したテスト実行
- **交換可能性**: 外部依存の容易な置き換え
- **理解しやすさ**: 明確な責任境界による保守性向上

#### ビジネス価値への貢献
- **機能追加速度**: 新機能の安全で迅速な追加
- **技術的柔軟性**: UIフレームワークやデータソースの変更対応
- **障害対応**: 問題の分離と迅速な対応

### 学習効果とスキル向上

#### 個人スキルの向上
- **アーキテクチャ設計**: 大規模システム設計の実践経験
- **TypeScript熟練度**: 高度な型システムの活用スキル
- **関数型プログラミング**: 不変性と純粋関数の実践

#### チームスキルの向上
- **設計レビュー**: アーキテクチャ観点での建設的なレビュー
- **ドメイン駆動設計**: ビジネスロジックの適切なモデリング
- **テスト戦略**: 効果的なテストピラミッドの構築

### 品質指標の改善

#### 定量的指標
```
- バグ発生率: 70%減少（型安全性による）
- テストカバレッジ: 90%以上維持
- コードレビュー時間: 40%短縮
- 新機能開発時間: 30%短縮（再利用性による）
```

#### 定性的指標
- **コード品質**: 一貫性のある設計パターン
- **保守性**: 変更時の影響範囲の予測可能性
- **可読性**: ドメインロジックの明確な表現

### 組織への貢献

#### 技術的な貢献
- **標準化**: アーキテクチャパターンの組織内標準確立
- **知識共有**: ベストプラクティスの文書化と共有
- **技術負債管理**: 継続的な設計品質の維持

#### ビジネス的な貢献
- **開発速度**: 安定した機能開発スピードの実現
- **品質保証**: 顧客満足度向上に寄与する品質レベル
- **リスク軽減**: アーキテクチャによる技術リスクの管理

### 成功の測定指標

#### 短期指標（1-3ヶ月）
- [ ] 型エラーによるビルド失敗率: 週1回以下
- [ ] ユニットテストカバレッジ: 85%以上
- [ ] コンポーネント再利用率: 60%以上

#### 中期指標（3-12ヶ月）
- [ ] 新機能開発における設計時間: 全体の20%以下
- [ ] プロダクションバグ率: 月5件以下
- [ ] コードレビューでの設計指摘: 50%減少

#### 長期指標（1年以上）
- [ ] アーキテクチャの一貫性: 95%以上のモジュールで標準パターン使用
- [ ] 開発者オンボーディング時間: 50%短縮
- [ ] 技術的負債指標: 一定レベル以下で維持

このクリーンアーキテクチャ実装により、技術的な品質向上だけでなく、チーム全体のスキルアップと組織的な開発力強化を実現します。