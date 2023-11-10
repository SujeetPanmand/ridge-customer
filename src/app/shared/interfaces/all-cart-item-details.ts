export interface AllCartItemDetails {
    allCartItemDetails: AllCartItemDetail[];
    statusCode:         number;
    message:            string;
}

export interface AllCartItemDetail {
    productId:      string;
    user:           User;
    productName:    string;
    quantity:       number;
    price:          number;
    totalPrice:     number;
    description:    null;
    availebleStock: number;
    outOfStock:     boolean;
}

export interface User {
    id:   string;
    name: string;
}
