export enum BodyStyle {
   Sedan = 'sedan',
   Suv = 'suv',
   Crossover = 'crossover',
   Van = 'van',
   Minivan = 'minivan',
   Hatchback = 'hatchback',
   Wagon = 'wagon',
   Coupe = 'coupe',
   Pickup = 'pickup',
   Convertible = 'convertible',
   Other = 'other',
}

export enum CarStatus {
   New = 'new',
   Used = 'used',
   Damaged = 'damaged',
}

export enum Currency {
   Mdl = 'mdl',
   Usd = 'usd',
   Eur = 'eur',
}

export enum Drivetrain {
   FrontWheelDrive = 'fwd',
   ReadWheelDrive = 'rwd',
   AllWheelDrive = 'awd',
   FourWheelDrive = '4wd',
   Other = 'other',
}

export enum FuelType {
   Petrol = 'petrol',
   Diesel = 'diesel',
   Hybrid = 'hybrid',
   PluginHybrid = 'plugin_hybrid',
   Electric = 'electric',
   Gas = 'gas',
   Other = 'other',
}

export enum ListingOrderBy {
   CreatedAtAsc = 'createdAtAsc',
   CreatedAtDesc = 'createdAtDesc',
   PriceAsc = 'priceAsc',
   PriceDesc = 'priceDesc',
   YearAsc = 'yearAsc',
   YearDesc = 'yearDesc',
}

export enum ListingStatus {
   Available = 'available',
   Sold = 'sold',
   Deleted = 'deleted',
   Blocked = 'blocked',
   Draft = 'draft',
}

export enum Transmission {
   Manual = 'manual',
   Automatic = 'auto',
   ContinuouslyVariable = 'variable',
   Other = 'other',
}
