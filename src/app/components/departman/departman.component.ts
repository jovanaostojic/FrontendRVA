import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Departman } from 'src/app/models/departman';
import { Fakultet } from 'src/app/models/fakultet';
import { DepartmanService } from 'src/app/services/departman.service';
import { DepartmanDialogComponent } from '../dialogs/departman-dialog/departman-dialog.component';

@Component({
  selector: 'app-departman',
  templateUrl: './departman.component.html',
  styleUrls: ['./departman.component.css']
})
export class DepartmanComponent implements OnInit, OnDestroy {

  displayedColumns = ['id', 'naziv', 'oznaka', 'fakultet', 'actions'];
  dataSource: MatTableDataSource<Departman>;
  selektovaniDepartman: Departman;
  subscription: Subscription;

  @ViewChild(MatSort, {static:false}) sort:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator:MatPaginator;

  constructor(private departmanService: DepartmanService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loadData() {
    this.subscription = this.departmanService.getAllDepartman()
    .subscribe(data=> {
      console.log(data);
      this.dataSource= new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      // pretraga po nazivu ugnježdenog objekta
      this.dataSource.filterPredicate = (data, filter: string) => {
        const accumulator = (currentTerm, key) => {
          return key === 'fakultet' ? currentTerm + data.fakultet.naziv : currentTerm + data[key];
        };
        const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
        const transformedFilter = filter.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
      };

      // sortiranje po nazivu ugnježdenog objekta
      this.dataSource.sortingDataAccessor = (data, property) => {
        switch (property) {
          case 'fakultet': return data.fakultet.naziv.toLocaleLowerCase();
          default: return data[property];
        }
      };
    }),
    (error: Error) => {
      console.log(error.name + ' ' + error.message);
    }
  }

  public openDialog(falg: number, id?: number, naziv?: string, oznaka?: string, fakultet?: Fakultet) {
    const dialogRef = this.dialog.open(DepartmanDialogComponent, {data: {id, naziv, oznaka, fakultet}});
    dialogRef.componentInstance.flag=falg;
    dialogRef.afterClosed()
      .subscribe(result => {
        if(result==1){
          this.loadData();
      }
    })
  }

  public selectRow(row: any) {
    //console.log(row);
    this.selektovaniDepartman = row;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue;
  }
}
