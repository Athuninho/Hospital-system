import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientsService {
  private readonly items = [] as any[];

  findAll() {
    return this.items;
  }

  findOne(id: string) {
    return this.items.find((i) => i.id === id) || null;
  }

  create(payload: any) {
    const id = String(this.items.length + 1);
    const record = { id, ...payload };
    this.items.push(record);
    return record;
  }
}
