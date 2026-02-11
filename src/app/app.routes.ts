import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
    { path: 'users', loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent), canActivate: [authGuard] },
    { path: 'artists', loadComponent: () => import('./components/artists/artists.component').then(m => m.ArtistsComponent), canActivate: [authGuard] },
    { path: 'songs', loadComponent: () => import('./components/songs/songs.component').then(m => m.SongsComponent), canActivate: [authGuard] },
    { path: 'playlists', loadComponent: () => import('./components/playlists/playlists.component').then(m => m.PlaylistsComponent), canActivate: [authGuard] },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' }
];
