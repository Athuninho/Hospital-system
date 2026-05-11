import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    list(): any[];
    get(id: string): any;
    create(payload: any): any;
}
