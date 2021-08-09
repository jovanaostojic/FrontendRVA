import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from 'src/app/models/status';
import { Student } from 'src/app/models/student';
import { StatusService } from 'src/app/services/status.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.css']
})
export class StudentDialogComponent implements OnInit {

  statusi:Status[];
  public flag: number;

  constructor(public snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<StudentDialogComponent>,
              @Inject (MAT_DIALOG_DATA) public data: Student,
              public studentService: StudentService,
              public statusService: StatusService) { }

  ngOnInit(): void {
    this.statusService.getAllStatus()
    .subscribe(statusi => {
      this.statusi=statusi;
    }),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
    }
  }

  compareTo(a,b) {
    return a.id==b.id;
  }

  public add(): void {
    this.studentService.addStudent(this.data)
      .subscribe(()=> {
        this.snackBar.open('Uspešno dodat student: ' + this.data.brojIndeksa, 'U redu', {
          duration: 2500
        });
      }),
      (error: Error) => {
        console.log(error.name + '-->' + error.message);
        this.snackBar.open('Greška. Pokušajte ponovo!', 'Zatvori', {
          duration: 2500
        });
      }; 
  }

  public update(): void {
    this.studentService.updateStudent(this.data)
      .subscribe(()=> {
        this.snackBar.open('Uspešno modifikovan student: ' + this.data.brojIndeksa, 'U redu', {
          duration: 2500
        });
      }),
      (error: Error) => {
        console.log(error.name + '-->' + error.message);
        this.snackBar.open('Greška. Pokušajte ponovo!', 'Zatvori', {
          duration: 2500
        });
      }; 
  }

  public delete(): void {
    this.studentService.deleteStudent(this.data.id)
      .subscribe(() => {
        this.snackBar.open('Uspešno obrisan student.', 'U redu', {
          duration: 2500
        });
      }),
      (error: Error) => {
        console.log(error.name + '-->' + error.message);
        this.snackBar.open('Greška. Pokušajte ponovo!', 'Zatvori', {
          duration: 2500
        });
      }; 
  }

  public cancel(): void {
    this.dialogRef.close();
    this.snackBar.open('Odustali ste od izmena.', 'U redu', {
      duration: 1000
    });
  }

}
