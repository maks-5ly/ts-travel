import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Travel } from '@/travel/entities/travel.entity';
import { HelperStringService } from '@/utils/helper/service';

@EventSubscriber()
export class TravelSubscriber implements EntitySubscriberInterface<Travel> {
  constructor(
    dataSource: DataSource,
    private helperStringService: HelperStringService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Travel;
  }

  beforeUpdate(event: UpdateEvent<Travel>): Promise<void> | void {
    const { databaseEntity, entity } = event;
    if (!entity.name) {
      return;
    }

    if (databaseEntity?.name?.toLowerCase() !== entity.name.toLowerCase()) {
      return this.addSlug(event);
    }
  }

  beforeInsert(event: InsertEvent<Travel>): Promise<any> | void {
    return this.addSlug(event);
  }

  async addSlug(event: InsertEvent<Travel> | UpdateEvent<Travel>) {
    const { entity } = event;
    entity.slug = await this.helperStringService.slugify(entity.name);
  }
}
