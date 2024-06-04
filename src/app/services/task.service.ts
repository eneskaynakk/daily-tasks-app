import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';


interface MyDB extends DBSchema {
  tasks:{
    key: number;
    value: {
      id?: number;
      title: string;
      content: string;
      date: string;
      category:string;
    }
  }
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private dbPromise : Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.dbPromise = openDB<MyDB>('task-db',1,{
      upgrade(db){
        db.createObjectStore('tasks', {
          keyPath:'id',
          autoIncrement:true,
        });
      },
    });
   }

   async createTask(task:{title:string,content:string,date:Date,category:string}){
    const db = await this.dbPromise;
    const id = await db.add('tasks',{
      title: task.title,
      content: task.content,
      date: task.date.toISOString(),
      category:task.category,
    });
    return id;
   }
   async getTasks(){
    const db = await this.dbPromise;
    return db.getAll('tasks');
   }
}
