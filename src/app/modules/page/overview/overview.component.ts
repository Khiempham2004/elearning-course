import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../core/services/students.service';
import { CorusesService } from '../../../core/services/coruses.service';
import { TeachersService } from '../../../core/services/teachers.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  totalStudents: any[] = [];
  totalCourses: any[] = [];
  totalTeachers: any[] = [];
  totalActiveClasses: any[] = [];

  filterSearch: string = '';
  page = 1;
  pageSize = 10;
  toal = 0;
  constructor(
    private studentService: StudentsService,
    private courseService: CorusesService,
    private teacherService: TeachersService,
  ) {}

  ngOnInit() {
    this.getAllCourse();
    this.getAllStudent();
    this.getAllTeacher();
  }

  getAllCourse() {
    this.courseService
      .getAllCourses(this.filterSearch, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          this.totalCourses = res || [];
          console.log('Tong cac khoa hoc :', this.totalCourses.length);
        },
      });
  }
  getAllStudent() {
    this.studentService.getAllStudents().subscribe({
      next: (res: any) => {
        this.totalStudents = res || [];
        console.log('Tong cac khoa hoc :', this.totalStudents.length);
      },
    });
  }
  getAllTeacher() {
    this.teacherService.getAllTeachers().subscribe({
      next: (res: any) => {
        this.totalTeachers = res || [];
        console.log('Tong cac khoa hoc :', this.totalTeachers.length);
      },
    });
  }
}
