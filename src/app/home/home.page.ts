import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { TaskService } from '../services/task.service';
import { LocalNotifications } from '@capacitor/local-notifications';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  @ViewChild(IonModal) modal: IonModal | undefined;
  title:string = "";
  content:string = "";
  category:string = "";
  categories : string[] = ['Work','Personal','Shopping','Daily'];
  date:Date = new Date();
  selectedCategory:string = "";
  selectedDate:string = "";
  tasks:any[] = [];
  constructor(private taskService: TaskService) {}

  async ngOnInit(){
    this.tasks = await this.taskService.getTasks();
    this.tasks.forEach(task=>{
      this.scheduleNotification(task);
    })
  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }


  async confirm() {
    const task = {
      title:this.title,
      content:this.content,
      date:this.date,
      category:this.selectedCategory}
      await this.taskService.createTask(task);
      this.tasks = await this.taskService.getTasks();
    this.modal?.dismiss(null, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

  }

  async scheduleNotification(task:any){
    const taskDate = new Date(task.date);
    const notificationDate = new Date(taskDate.getTime()-10*60*1000);

    //const currentDate = new Date();
    //const notificationDate = new Date(currentDate.getTime() + 1 * 60 * 1000); // 1 dakika sonrası

    await LocalNotifications.schedule({
      notifications:[
          {
            title:"Task Reminder",
            body:`${task.title} is coming up in 10 mins`,
            id: task.id,
            schedule: { at: notificationDate}
          }
      ]

    });

  }

}
