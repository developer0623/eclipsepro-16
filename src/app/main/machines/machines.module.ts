import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { PathfinderComponent } from './pathfinder/pathfinder.component';
import { ComponentsModule } from '../shared/components/components.module';
import { MachinesRoutingModule } from './machines-routing.module';
import { Xl200Module } from './xl200/xl200.module';


@NgModule({
  declarations: [PathfinderComponent],
  imports: [CommonModule, MatTabsModule, ComponentsModule, MachinesRoutingModule, Xl200Module],
})
export class MachinesModule {}
