import { Product } from './Product';

export class OpenedOrder {
    _id: string;
    origin: string;
    amount: number;
    products: Product[];
}