import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as string[] | undefined;
  const role = auth.getUserRole();
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return router.createUrlTree([auth.getHomeForRole(role)]);
  }

  return true;
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.getToken()) return true;
  const destination = auth.getHomeForRole(auth.getUserRole());
  return destination === '/login' ? true : router.createUrlTree([destination]);
};

export const signout: CanActivateFn = () => {
  const router = inject(Router);
  return router.createUrlTree(['/login']);
};
