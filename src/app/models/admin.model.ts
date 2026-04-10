// Admin DTOs
export interface AdminLoginDto {
    email: string;
    password: string;
}

export interface AdminTokenResponse {
    token: string;
    username: string;
    email: string;
    expiresAt: Date;
}

export interface UserDto {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
    createdAt: Date;
    role: string;
    friendsCount: number;
    playlistsCount: number;
}

export interface ArtistDto {
    id: string;
    name: string;
    genre?: string;
    profileImage?: string;
    subscribersCount: number;
    songsCount: number;
    isLive: boolean;
    createdAt: Date;
}

export interface SongDto {
    id: string;
    title: string;
    artistName: string;
    genreName: string;
    duration: string;
    totalPlays: number;
    totalLikes: number;
    createdAt: Date;
}

export interface PlaylistDto {
    id: string;
    name: string;
    description?: string;
    ownerUsername: string;
    status: string;
    tracksCount: number;
    viewCount: number;
    createdAt: Date;
}

export interface DashboardStatsDto {
    totalUsers: number;
    totalArtists: number;
    totalSongs: number;
    totalPlaylists: number;
    onlineUsers: number;
    liveArtists: number;
    recentUsers: { username: string; email: string; createdAt: Date }[];
    topArtists: { name: string; subscribersCount: number }[];
}

export interface PlatformSettingDto {
    key: string;
    value: string;
    updatedAt: Date;
}

export interface UpdateSettingDto {
    key: string;
    value: string;
}

export interface ArtistEarningsDto {
    artistId: string;
    artistName: string;
    profileImage?: string;
    email?: string;
    songsCount: number;
    totalRevenue: number;
    platformCommission: number;
    artistNetEarnings: number;
    withdrawnAmount: number;
    pendingWithdrawal: number;
    availableBalance: number;
}

export interface EarningsSummaryDto {
    totalRevenue: number;
    platformCommission: number;
    totalArtistEarnings: number;
    totalWithdrawn: number;
    pendingWithdrawals: number;
    commissionPercent: number;
}

export interface WithdrawalDto {
    id: string;
    artistId: string;
    artistName: string;
    amount: number;
    currency: string;
    cardNumber: string;
    status: string;
    createdAt: Date;
    reviewedAt?: Date;
}

export interface SongReportDto {
    id: string;
    songId: string;
    songTitle: string;
    artistName: string;
    reportedByUserId: string;
    reportedByUsername: string;
    reason: string;
    description: string;
    evidenceUrl?: string;
    status: string;
    createdAt: Date;
    totalPlays: number;
    songUploadDate: Date;
}
