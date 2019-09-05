import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import { LoginResponse } from '../models/loginResponse';
import {RestaurateurService} from '../restaurateur.service';
import {HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public user;
  public password;
  private language = 'es';
  loginResponse: HttpResponse<LoginResponse>;

  constructor(private router: Router, private alertController: AlertController, private translate: TranslateService,
    private restaurateurService: RestaurateurService) { }

  ngOnInit() {
  }

  async login() {
    let responseOfService = new LoginResponse();
    this.restaurateurService.login(this.user, this.password).subscribe((data : HttpResponse<LoginResponse>) => {
      if (data.status == 204) {
        this.router.navigate(['/home',this.language]);
      }
    }, error => {
      this.failedLogin();
    });
  }

  englishLanguage() {
    this.translate.use('en');
    this.language = 'en';
  }

  spanishLanguage() {
    this.translate.use('es');
    this.language = 'es';
  }

  async failedLogin() {
    let keysToTranslate = ['message_access_denied', 'message_User_or_password_invalids'];
    let translations = new Array();
    for(let i = 0; i < keysToTranslate.length; i++) {
      this.translate.get(keysToTranslate[i]).subscribe((res: string) => {
        translations.push(res);
      });
    }
    const alert = await this.alertController.create({
      header: 'Restaurateur Waiter',
      subHeader: translations[0],
      message: translations[1],
      buttons: ['OK']
    });
    await alert.present();
  }
}
