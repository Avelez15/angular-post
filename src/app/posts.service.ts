import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Post } from './post.model';
import { Subject, map,catchError,throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService {
    error = new Subject<string>();

    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content}
        this.http
        .post<{ name: string }>(
          'https://ng-complete-guide-b9f42-default-rtdb.firebaseio.com/posts.json',
          postData
        )
        .subscribe((responseData) => {
          console.log(responseData);
        }, error => {
            this.error.next(error.message);
        });     
    }

    fetchPosts() {
        return this.http
        .get<{ [key: string]: Post }>(
          'https://ng-complete-guide-b9f42-default-rtdb.firebaseio.com/posts.json',
          {
            headers: new HttpHeaders({"Custom-Header" : "Hello"})
          }
        )
        .pipe(
          map((responseData: { [key: string]: Post }) => {
            const postsArray: Post[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
              }
            }
            return postsArray;
          }), 
          catchError(errorRes => {
            //example of catching an error, can be used to for example send to an analytics server
            return throwError(errorRes);
          })
        );
    }

    deletePosts() {
        return this.http.delete('https://ng-complete-guide-b9f42-default-rtdb.firebaseio.com/posts.json')
    }
}