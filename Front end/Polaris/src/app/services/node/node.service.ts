import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from '../message/message.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { __param } from 'tslib';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private baseAddress = 'https://localhost:5001/api/v1';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  public async getType(): Promise<JSON> {
    let url = `${this.baseAddress}/nodes/typing`;
    return new Promise<JSON>((resolve) => {
      this.http
        .get(url)
        .pipe(
          tap((_) => this.log(`got type`)),
          catchError(this.handleError<JSON>('getType'))
        )
        .subscribe((json: JSON) => {
          resolve(json);
        });
    });
  }

  public async getNode(nodeId: string): Promise<JSON> {
    let url = `${this.baseAddress}/nodes/${nodeId}`;
    return new Promise<JSON>((resolve) => {
      this.http
        .get(url)
        .pipe(
          tap((_) => this.log(`got node id=${nodeId}`)),
          catchError(this.handleError<JSON>('deleteNode'))
        )
        .subscribe((json: JSON) => {
          console.log(json);
          resolve(json);
        });
    });
  }

  public deleteNode(nodeId: string) {
    let url = `${this.baseAddress}/nodes/${nodeId}`;
    this.http
      .delete(url)
      .pipe(
        tap((_) => this.log(`deleted node id=${nodeId}`)),
        catchError(this.handleError<JSON>('deleteNode'))
      )
      .subscribe();
  }

  public addNode(node: JSON) {
    let url = `${this.baseAddress}/nodes`;
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.http
      .post<JSON>(url, node, httpOptions)
      .pipe(
        tap((_) => this.log(`added node`)),
        catchError(this.handleError<JSON>('addNode', JSON))
      )
      .subscribe();
  }

  public updateNode(node: JSON) {
    let url = `${this.baseAddress}/nodes`;
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    this.http
      .put<JSON>(url, node, httpOptions)
      .pipe(
        tap((_) => this.log('updated node')),
        catchError(this.handleError<JSON>('updateNode'))
      )
      .subscribe();
  }

  public async getNodes(filter: string[]): Promise<JSON> {
    let url = `${this.baseAddress}/nodes?`;
    for(let element of filter) {
      url += `filter=${element}&`;
    }
    url = url.substr(0, url.length-1);
    console.log(url);
    return new Promise<JSON>((resolve) => {
      this.http
        .get(url)
        .pipe(
          tap((_) => this.log(`got nodes`)),
          catchError(this.handleError<JSON>('getNodes'))
        )
        .subscribe((json: JSON) => {
          resolve(json);
        });
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`NodeService: ${message}`);
  }
}
