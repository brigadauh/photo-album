import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatCardModule } from '@angular/material/card';
import { environment } from '../environments/environment';
import { FileService } from './service/file.service';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { PhotoComponent } from './photo/photo.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'photo', component: AppComponent },
  { path: '**', component: PageNotFoundComponent }
];
//  { path: 'hero/:id',      component: HeroDetailComponent },

@NgModule({
  declarations: [
    AppComponent,
    PhotoComponent,
    PageNotFoundComponent

  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    FileExplorerModule,
    FlexLayoutModule,
    MatCardModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [FileService],
  bootstrap: [AppComponent]
})
export class AppModule {}
