namespace RogAdmin.Domain.Enums;

public enum StockStatus
{
    InStock = 0,
    OutOfStock = 1,
    PreOrder = 2
}

public enum WarrantyStatus
{
    Active = 0,
    Expired = 1,
    InService = 2
}

public enum CustomerTier
{
    Elite = 0,
    Master = 1,
    Champion = 2
}

public enum OrderStatus
{
    Pending = 0,
    Confirmed = 1,
    Shipping = 2,
    Completed = 3,
    Cancelled = 4
}
