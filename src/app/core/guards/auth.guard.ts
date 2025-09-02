import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');


  if (!token) {
    router.navigate(['login']);
    return false;
  }

  try {
    console.log(token);
    const decoded: any = jwtDecode(token);
    console.log('Se decodifico', decoded);
    if (Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem('token');
      router.navigate(['login'])
      return false;
    }
  } catch {
    router.navigate(['login']);
    
    return false;
  }
  return true;
};
