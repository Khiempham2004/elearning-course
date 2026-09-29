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
  statistics = {
    totalCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeClass: 0,
  };

  courses: any[] = [];
  students: any[] = [];
  teachers: any[] = [];
  classActive : any[]=[];
  constructor(
    private studentService: StudentsService,
    private courseService: CorusesService,
    private teacherService: TeachersService,
  ) {}

  ngOnInit() {}

  getAllCourse() {
    this.courseService.getAllCourses().subscribe({
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
        console.log('tong  hoc vien', this.courses.length);
      },
    });
  }
  getAllTeacher() {
    this.teacherService.getAllTeachers().subscribe({
      next: (res: any) => {
        this.teachers = res || [];
        console.log('tong giao vien', this.courses.length);
      },
    });
  }

  getAllClass(){
    this.studentService.getAllClass().subscribe({
      next : (res:any) => {
        this.classActive = res || [];
        console.log('tong lop hoc ', this.classActive.length);
      }
    })
  }
}
