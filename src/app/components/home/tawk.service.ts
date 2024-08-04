import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

interface TawkAPI {
    minimize?: () => void;
    logout?: (callback: (error: any) => void) => void;
    login?: (data: { hash: string; userId: string; name?: string; email?: string }, callback: (error: any) => void) => void;
    showWidget?: () => void;
    hideWidget?: () => void;
}

declare global {
    interface Window {
        Tawk_API: TawkAPI;
    }
}



interface User {
    uid: string;
}

@Injectable({
    providedIn: 'root'
})
export class TawkService {
    isLogin = false;

    constructor() { }

    ready({ maxWait = 5000, interval = 100 }: { maxWait?: number; interval?: number } = {}): Observable<boolean> {
        const startTime = Date.now();

        return new Observable<boolean>(observer => {
            const checkReady = () => {
                if (window.Tawk_API && window.Tawk_API.minimize) {
                    observer.next(true);
                    observer.complete();
                    return;
                }
                if (Date.now() - startTime > maxWait) {
                    observer.next(false);
                    observer.complete();
                    return;
                }
                timer(interval).subscribe(() => checkReady());
            };
            checkReady();
        });
    }

    logout(): Observable<void> {
        return this.ready().pipe(
            switchMap(ready => {
                if (ready) {
                    return new Observable<void>(observer => {
                        window.Tawk_API.logout?.((error: any) => {
                            if (error) {
                                console.error('Tawk.to logout error:', error);
                            }
                            this.isLogin = false;
                            observer.next();
                            observer.complete();
                        });
                    });
                }
                return of(void 0);
            })
        );
    }

    login(userData: any): Observable<void> {
        let hasError = false;
        if (window.Tawk_API) {
            return new Observable<void>(observer => {
                window.Tawk_API.login?.(
                    {

                        hash: userData.hash as any,
                        userId: userData.userId,
                        name: userData.name || '',
                        email: userData.email || '',
                    },
                    (error: any) => {
                        if (error) {
                            console.error('Tawk.to login error:', error);
                            hasError = true;
                        }
                        if (!hasError) this.isLogin = true;
                        observer.next();
                        observer.complete();
                    }
                );
            });
        }
        return of(void 0);
    }

    loginSeq(userData: any): Observable<void> {
        return this.ready().pipe(
            switchMap(ready => {
                if (ready) {
                    return this.login(userData).pipe(
                        switchMap(() => this.login(userData))
                    );
                }
                return of(void 0);
            })
        );
    }

    showWidget(): Observable<void> {
        if (this.isLogin) {
            return new Observable<void>(observer => {
                window.Tawk_API.showWidget?.();
                observer.next();
                observer.complete();
            });
        } else {
            return new Observable<void>(observer => {
                timer(100).subscribe(() => this.showWidget().subscribe(() => observer.next()));
            });
        }
    }

    hideWidget(): Observable<void> {
        return this.ready().pipe(
            switchMap(ready => {
                if (ready) {
                    return new Observable<void>(observer => {
                        window.Tawk_API.minimize?.();
                        window.Tawk_API.hideWidget?.();
                        observer.next();
                        observer.complete();
                    });
                }
                return of(void 0);
            })
        );
    }
}