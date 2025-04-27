import { BadgeProps } from '@radix-ui/themes';

import {
   BodyStyle,
   CarStatus,
   Currency,
   Drivetrain,
   FuelType,
   ListingOrderBy,
   Transmission,
} from '@/enums/listing';
import { Platform } from '@/enums/scraping';

export const currencyStrMap: Record<Currency, string> = {
   [Currency.Eur]: '€',
   [Currency.Usd]: '$',
   [Currency.Mdl]: 'lei',
};

export const transmissionBadgeColors: Record<
   Transmission,
   BadgeProps['color']
> = {
   [Transmission.Automatic]: 'blue',
   [Transmission.Manual]: 'red',
   [Transmission.Other]: 'gray',
   [Transmission.ContinuouslyVariable]: 'violet',
};

export const fuelTypeBadgeColors: Record<FuelType, BadgeProps['color']> = {
   [FuelType.Electric]: 'cyan',
   [FuelType.Other]: 'gray',
   [FuelType.Diesel]: 'amber',
   [FuelType.Gas]: 'gold',
   [FuelType.Hybrid]: 'mint',
   [FuelType.Petrol]: 'green',
   [FuelType.PluginHybrid]: 'violet',
};

export const bodyStyleBadgeColors: Record<BodyStyle, BadgeProps['color']> = {
   [BodyStyle.Sedan]: 'blue',
   [BodyStyle.Suv]: 'green',
   [BodyStyle.Crossover]: 'mint',
   [BodyStyle.Van]: 'gray',
   [BodyStyle.Minivan]: 'gray',
   [BodyStyle.Hatchback]: 'jade',
   [BodyStyle.Wagon]: 'teal',
   [BodyStyle.Coupe]: 'red',
   [BodyStyle.Pickup]: 'amber',
   [BodyStyle.Convertible]: 'plum',
   [BodyStyle.Other]: 'gray',
};

export const carStatusBadgeColors: Record<CarStatus, BadgeProps['color']> = {
   [CarStatus.New]: 'green',
   [CarStatus.Used]: 'blue',
   [CarStatus.Damaged]: 'red',
};

export const drivetrainBadgeColors: Record<Drivetrain, BadgeProps['color']> = {
   [Drivetrain.FrontWheelDrive]: 'mint',
   [Drivetrain.ReadWheelDrive]: 'teal',
   [Drivetrain.AllWheelDrive]: 'violet',
   [Drivetrain.FourWheelDrive]: 'amber',
   [Drivetrain.Other]: 'gray',
};

export const platformBadgeColors: Record<Platform, BadgeProps['color']> = {
   [Platform.TripleNineMd]: 'green',
   [Platform.Carhive]: 'sky',
   [Platform.DaacHermes]: 'crimson',
};

export const orderByStrMap: Record<ListingOrderBy, string> = {
   [ListingOrderBy.CreatedAtAsc]: 'Create date - oldest first',
   [ListingOrderBy.CreatedAtDesc]: 'Create date - newest first',
   [ListingOrderBy.PriceAsc]: 'Price - cheap first',
   [ListingOrderBy.PriceDesc]: 'Price - expensive first',
   [ListingOrderBy.YearAsc]: 'Production year - old first',
   [ListingOrderBy.YearDesc]: 'Production year - new first',
};
