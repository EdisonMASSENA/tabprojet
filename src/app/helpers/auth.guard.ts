import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {TokenStorageService } from './../services/token-storage.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    

    constructor( private router: Router, private tokenStorageService: TokenStorageService ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.tokenStorageService.getToken();
        if (user != null) {
           
            // console.log(this.tokenStorageService.getToken())
            return true;
        }
        else{

            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }
        
        
    }
}