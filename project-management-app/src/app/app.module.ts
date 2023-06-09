import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoRootModule } from './transloco-root.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainPageComponent } from './main-page/main-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { DialogComponent } from './dialog/dialog.component';
import { EditProfilePageComponent } from './edit-profile-page/edit-profile-page.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { CreateBoardComponent } from './create-board/create-board.component';
import { BoardComponent } from './board/board.component';
import { CreateColumnComponent } from './create-column/create-column.component';
import { TaskComponent } from './task/task.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { ColumnComponent } from './column/column.component';
import { EditTaskComponent } from './edit-task/edit-task.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    WelcomePageComponent,
    SignInPageComponent,
    SignUpPageComponent,
    DialogComponent,
    EditProfilePageComponent,
    ConfirmationComponent,
    CreateBoardComponent,
    BoardComponent,
    CreateColumnComponent,
    TaskComponent,
    CreateTaskComponent,
    ColumnComponent,
    EditTaskComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    DragDropModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    TranslocoRootModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
