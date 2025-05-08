import { ResultField } from "@aws-sdk/client-cloudwatch-logs";

type TOffer = {
  MRCNumber: string;
  contactEmail: string;
  splitPercentage: string;
  availableVolume: string;
  errorMessage?: string;
};

type TOfferDecoded = {
  MRCNumber: string;
  contactEmail: string;
  msg: string;
  SplitPercentage: string;
  availableVolume: string;
};

type TIncomingFailedOffers = {
  lambdaOffers: ResultField[][],
  offersServiceOffers: ResultField[][]
}

export type {
  TOffer,
  TOfferDecoded,
  TIncomingFailedOffers
};