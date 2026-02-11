import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    DashboardStatsDto,
    UserDto,
    ArtistDto,
    SongDto,
    PlaylistDto
} from '../models/admin.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
    constructor(private http: HttpClient) { }

    // Dashboard
    getDashboardStats(): Observable<DashboardStatsDto> {
        return this.http.get<DashboardStatsDto>(`${environment.apiUrl}/dashboard/stats`);
    }

    // Users
    getUsers(page = 1, pageSize = 20, search?: string): Observable<UserDto[]> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (search) params = params.set('search', search);
        return this.http.get<UserDto[]>(`${environment.apiUrl}/users`, { params });
    }

    getUsersCount(search?: string): Observable<number> {
        let params = new HttpParams();
        if (search) params = params.set('search', search);
        return this.http.get<number>(`${environment.apiUrl}/users/count`, { params });
    }

    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
    }

    // Artists
    getArtists(page = 1, pageSize = 20, search?: string): Observable<ArtistDto[]> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (search) params = params.set('search', search);
        return this.http.get<ArtistDto[]>(`${environment.apiUrl}/artists`, { params });
    }

    getArtistsCount(search?: string): Observable<number> {
        let params = new HttpParams();
        if (search) params = params.set('search', search);
        return this.http.get<number>(`${environment.apiUrl}/artists/count`, { params });
    }

    deleteArtist(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/artists/${id}`);
    }

    // Songs
    getSongs(page = 1, pageSize = 20, search?: string): Observable<SongDto[]> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (search) params = params.set('search', search);
        return this.http.get<SongDto[]>(`${environment.apiUrl}/songs`, { params });
    }

    getSongsCount(search?: string): Observable<number> {
        let params = new HttpParams();
        if (search) params = params.set('search', search);
        return this.http.get<number>(`${environment.apiUrl}/songs/count`, { params });
    }

    deleteSong(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/songs/${id}`);
    }

    // Playlists
    getPlaylists(page = 1, pageSize = 20, search?: string): Observable<PlaylistDto[]> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (search) params = params.set('search', search);
        return this.http.get<PlaylistDto[]>(`${environment.apiUrl}/playlists`, { params });
    }

    getPlaylistsCount(search?: string): Observable<number> {
        let params = new HttpParams();
        if (search) params = params.set('search', search);
        return this.http.get<number>(`${environment.apiUrl}/playlists/count`, { params });
    }

    deletePlaylist(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/playlists/${id}`);
    }
}
