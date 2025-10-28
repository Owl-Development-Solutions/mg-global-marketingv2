import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from 'projects/app.module';

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
