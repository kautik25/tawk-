import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment'
import { TawkService } from './tawk.service';
import { FormGroup } from '@angular/forms';
import { bindCallback } from 'rxjs';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userData: any
  propertyId = environment.propertyId
  widgetId = environment.widgetId
  secretKey = environment.secretKey

  constructor(private router: Router, private renderer: Renderer2, private tawkService: TawkService) { }

  ngOnInit(): void {
    const userDataString = sessionStorage.getItem('userData');
    this.userData = JSON.parse(userDataString as any);
    this.userData = {
      hash: `${this.hashInBase64()}`,
      userId: `${this.userData.id}`,
      email: `${this.userData.email}`,
      name: `${this.userData.fullName}`
    }
    console.log(this.userData);
  }

  loginSequence(): void {
    this.tawkService.loginSeq(this.userData).subscribe({
      next: () => {
        console.log('Login sequence completed.');
        this.showWidget();
      },
      error: (err) => console.error('Error in login sequence:', err)
    });
  }

  login(): void {
    this.tawkService.login(this.userData).subscribe({
      next: () => console.log('Logged in successfully.'),
      error: (err) => console.error('Login error:', err)
    });
  }

  logout(): void {
    this.tawkService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully.')
        this.hideWidget()
      },
      error: (err) => console.error('Logout error:', err)
    });
  }

  showWidget(): void {
    this.tawkService.showWidget().subscribe({
      next: () => console.log('Widget is now visible.'),
      error: (err) => console.error('Error showing widget:', err)
    });
  }

  hideWidget(): void {
    this.tawkService.hideWidget().subscribe({
      next: () => console.log('Widget is now hidden.'),
      error: (err) => console.error('Error hiding widget:', err)
    });
  }


  hashInBase64() {

    var hash = CryptoJS.HmacSHA256(this.userData.id, this.secretKey);
    return CryptoJS.enc.Hex.stringify(hash);
  }
  onChat() {
    this.loginSequence()
  }
  logOut1() {
    sessionStorage.clear();
    this.logout()

    this.router.navigate(['login']);
  }

  onSubmit() {
    if (this.paymentForm.invalid || !this.paymentList.length) {
      if (!this.paymentList.length) {
        this.paymentform.control.term.seterror({ required: true })
      }
      this.paymentform.markAllAsTouched()
      this.paymentform.updateValueandvalidity()
      return
    }
  }

  Formvalidation(form: FormGroup, condition: boolean, callback?: suggest me what to write here) // suggest me ){
  if(condition) {
    this.form.markAllAsTouched()
    this.form.updateValueandvalidity()
    return true
  }else{
  return false
}

}

now i wil use something like this  for use it if i dont have any bindCallback
onplay(){
  const condition = !this.billForm.invalid
  if (Formvalidation(this.billForm, condition)) {
    return
  }
}
but here in callback func case as you can see this extra   if (!this.paymentList.length) {
  this.paymentform.control.term.seterror({ required: true })
} how should i write it.

const additionalValidation = () => {
  if (!this.paymentList.length) {
    this.paymentForm.controls.term.setErrors({ required: true });
  }
}; here this thing i have tried to wirte like this 