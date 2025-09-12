import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { venziaDatalinkReducer } from './reducers/venzia-datalink.reducer';
import { EffectsModule } from '@ngrx/effects';
import { VenziaDatalinkEffects } from './effects/venzia-datalink.effects';

@NgModule({
  imports: [StoreModule.forFeature('datalink', venziaDatalinkReducer), EffectsModule.forFeature([VenziaDatalinkEffects])]
})
export class VenziaDatalinkStoreModule {}
