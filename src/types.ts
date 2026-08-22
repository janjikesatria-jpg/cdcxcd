export interface OrderData {
  orderId: string;
  name: string;
  phone: string;
  email: string;
  paymentMethod: 'qris' | 'bca' | 'mandiri' | 'bri' | 'gopay' | 'dana';
  amount: number;
  createdAt: string;
}
