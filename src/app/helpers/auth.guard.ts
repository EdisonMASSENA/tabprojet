import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {TokenStorageService } from './../services/token-storage.service';

import {Location} from '@angular/common';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
    

    constructor( private router: Router, private tokenStorageService: TokenStorageService, private location: Location ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.tokenStorageService.getToken();       
        const getuser = this.tokenStorageService.getUser();
        let username = getuser.username;

        if (user != null && username != 'Admin') {
           
            // console.log(this.tokenStorageService.getToken())
            return true;

        } else{

            this.router.navigate([this.location.back()], { queryParams: { returnUrl: state.url }});
            return false;
        }
        
        
    }
}


@Injectable({ providedIn: 'root' })

export class AdminGuard implements CanActivate {
    

    constructor( private router: Router, private tokenStorageService: TokenStorageService, private location: Location ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.tokenStorageService.getToken();
        const getuser = this.tokenStorageService.getUser();
        let username = getuser.username;
        if (user != null && username == 'Admin') {
           
            // console.log(this.tokenStorageService.getToken())
            return true;
        }
        else{

            this.router.navigate([this.location.back()], { queryParams: { returnUrl: state.url }});
            return false;
        }
        
        
    }
}