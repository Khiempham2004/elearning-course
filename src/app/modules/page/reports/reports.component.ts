import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../core/services/students.service';
import { CorusesService } from '../../../core/services/coruses.service';
import { TeachersService } from '../../../core/services/teachers.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  statistics = {
    totalCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeClass: 0,
  };

  courses: any[] = [];
  students: any[] = [];
  teachers: any[] = [];
  classActive: any[] = [];

  page = 1;
  pageSize = 10;
  total = 0;
  filterKeyword: string = '';
  constructor(
    private studentService: StudentsService,
    private courseService: CorusesService,
    private teacherService: TeachersService,
  ) {}

  ngOnInit() {
    this.getAllCourse();
    this.getAllStudent();
    this.getAllTeacher();
    this.getAllClass();
  }

  getAllCourse() {
    this.courseService
      .getAllCourses(this.filterKeyword, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          this.courses = res || [];
          console.log('tong khoa hoc', this.courses.length);
        },
      });
  }
  getAllStudent() {
    this.studentService.getAllStudents().subscribe({
      next: (res: any) => {
        this.students = res || [];
        console.log('tong  hoc vien', this.students.length);
      },
    });
  }
  getAllTeacher() {
    this.teacherService.getAllTeachers().subscribe({
      next: (res: any) => {
        this.teachers = res || [];
        console.log('danh sach giang vien : ', this.teachers);

        console.log('tong giao vien', this.teachers.length);
      },
    });
  }

  getAllClass() {
    this.studentService.getAllClass().subscribe({
      next: (res: any) => {
        this.classActive = res || [];
        console.log('tong lop hoc ', this.classActive.length);
      },
    });
  }
}
