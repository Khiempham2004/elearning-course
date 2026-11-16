import { Component } from '@angular/core';
interface Course {
  id: number;
  name: string;
  instructor: string;
  progress: number;
  category: string;
  color: string;
}

interface Schedule {
  id: number;
  subject: string;
  instructor: string;
  date: string;
  time: string;
  method: 'Online' | 'Offline';
}

interface Assignment {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  status: 'Pending' | 'Submitted';
}
@Component({
  selector: 'app-student-overview',
  imports: [],
  templateUrl: './student-overview.component.html',
  styleUrl: './student-overview.component.css'
})
export class StudentOverviewComponent {
 studentName = 'Nguyễn An';

  stats = [
    {
      title: 'Khóa học đang học',
      value: 5,
      icon: '📚',
      color: 'blue'
    },
    {
      title: 'Bài tập cần hoàn thành',
      value: 3,
      icon: '📝',
      color: 'orange'
    },
    {
      title: 'Khóa học hoàn thành',
      value: 2,
      icon: '✓',
      color: 'green'
    },
    {
      title: 'Tiến độ học tập',
      value: '86%',
      icon: '📈',
      color: 'purple'
    }
  ];

  courses: Course[] = [
    {
      id: 1,
      name: 'Angular cơ bản đến nâng cao',
      instructor: 'Nguyễn Văn A',
      progress: 75,
      category: 'Frontend',
      color: '#2563eb'
    },
    {
      id: 2,
      name: 'JavaScript ES6+',
      instructor: 'Trần Văn B',
      progress: 90,
      category: 'Programming',
      color: '#e9a23b'
    },
    {
      id: 3,
      name: 'UI/UX Design Fundamentals',
      instructor: 'Lê Thị C',
      progress: 45,
      category: 'Design',
      color: '#8b5cf6'
    }
  ];

  schedules: Schedule[] = [
    {
      id: 1,
      subject: 'Angular nâng cao',
      instructor: 'Nguyễn Văn A',
      date: '17/11/2026',
      time: '09:00 - 11:00',
      method: 'Online'
    },
    {
      id: 2,
      subject: 'JavaScript ES6+',
      instructor: 'Trần Văn B',
      date: '18/11/2026',
      time: '14:00 - 16:00',
      method: 'Offline'
    },
    {
      id: 3,
      subject: 'UI/UX Design',
      instructor: 'Lê Thị C',
      date: '19/11/2026',
      time: '08:00 - 10:00',
      method: 'Online'
    }
  ];

  assignments: Assignment[] = [
    {
      id: 1,
      title: 'Xây dựng ứng dụng Angular CRUD',
      subject: 'Angular nâng cao',
      deadline: '18/11/2026',
      status: 'Pending'
    },
    {
      id: 2,
      title: 'Thực hành JavaScript ES6',
      subject: 'JavaScript',
      deadline: '20/11/2026',
      status: 'Submitted'
    },
    {
      id: 3,
      title: 'Thiết kế giao diện Dashboard',
      subject: 'UI/UX Design',
      deadline: '22/11/2026',
      status: 'Pending'
    }
  ];

  get pendingAssignments(): number {
    return this.assignments.filter(
      item => item.status === 'Pending'
    ).length;
  }
}
