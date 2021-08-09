import { Status } from 'src/app/models/status';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StatusService } from 'src/app/services/status.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent } from '../dialogs/status-dialog/status-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {

  displayedColumns = ['id', 'naziv', 'oznaka', 'actions'];
  dataSource: MatTableDataSource<Status>;
  subscription: Subscription;

  @ViewChild(MatSort, {static:false}) sort:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator:MatPaginator;

  constructor(private statusService: StatusService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loadData() {
    this.subscription = this.statusService.getAllStatus()
    .subscribe(data=> {
      console.log(data);
      this.dataSource= new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }),
    (error: Error) => {
      console.log(error.name + ' ' + error.message);
    }
  }

  public openDialog(falg: number, id?: number, naziv?: string, oznaka?: string) {
    const dialogRef = this.dialog.open(StatusDialogComponent, {data: {id, naziv, oznaka}});
    dialogRef.componentInstance.flag=falg;
    dialogRef.afterClosed()
      .subscribe(result => {
        if(result==1){
          this.loadData();
      }
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue;
  }

}
