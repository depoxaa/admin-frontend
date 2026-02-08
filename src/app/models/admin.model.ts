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
