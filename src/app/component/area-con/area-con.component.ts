import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-area-con',
  templateUrl: './area-con.component.html',
  styleUrls: ['./area-con.component.css'],
})
export class AreaConComponent implements OnInit {
  form!: FormGroup;
  coruses: any[] = [];
  listOfCourse: any[] = [];
  fiterSearchCourse: any[] = [];
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      courseCode: [''],
      courseName: ['', Validators.required],
      category: [''],
      teacherId: [null],
      teacherName: [null, Validators.required],
      duration: [null, Validators.required],
      maxStudents: [null, Validators.required],
      price: [null],
      startDate: [null],
      endDate: [null],
      status: [null],
    });
  }

  ngOnInit() {

  }
  
}
