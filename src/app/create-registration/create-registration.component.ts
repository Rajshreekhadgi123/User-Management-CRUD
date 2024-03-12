import { User } from './../models/register.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.css'],
})
export class CreateRegistrationComponent implements OnInit {
  selectedGender!: string;
  Roles: string[] = ['Admin', 'User'];

  registrationForm!: FormGroup;
  private userIdToUpdate!: number;
  public isUpdateActive: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: NgToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    this.activatedRoute.params.subscribe((val) => {
      this.userIdToUpdate = val['id'];
      if (this.userIdToUpdate) {
        this.isUpdateActive = true;
        this.api.getRegisteredUserId(this.userIdToUpdate).subscribe({
          next: (res) => {
            this.fillFormToUpdate(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }
  submit() {
    if (this.registrationForm.valid) {
      this.api
        .postRegistration(this.registrationForm.value)
        .subscribe((res) => {
          this.toastService.success({
            detail: 'SUCCESS',
            summary: 'User Registration Successful',
            duration: 3000,
          });
          this.registrationForm.reset();
        });
    }
    else{
      this.toastService.warning({
        detail: 'WARNING',
        summary: 'Please fill the required fields',
        duration: 3000,
      });
    }
  }

  fillFormToUpdate(user: User) {
    this.registrationForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  }

  update() {
    this.api
      .updateRegisterUser(this.registrationForm.value, this.userIdToUpdate)
      .subscribe((res) => {
        this.toastService.success({
          detail: 'SUCCESS',
          summary: 'User Details Updated Successful',
          duration: 3000,
        });
        this.router.navigate(['list']);
        this.registrationForm.reset();
      });
  }
}
