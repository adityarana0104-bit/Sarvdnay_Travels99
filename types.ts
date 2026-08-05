export type VehicleCategory = 'all' | 'traveller' | 'cruiser' | 'car';

export interface Vehicle {
  id: string;
  name: string;
  nameMr: string;
  category: 'traveller' | 'cruiser' | 'car';
  seatingCapacity: number;
  acAvailable: boolean;
  nonAcAvailable: boolean;
  image: string;
  description: string;
  descriptionMr: string;
  features: string[];
  featuresMr: string[];
  idealFor: string;
  idealForMr: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'confirmed' | 'cancelled';

export interface InquiryRecord {
  id?: string;
  vehicleName: string;
  vehicleType: string;
  seatingCapacity?: number;
  fullName: string;
  mobileNumber: string;
  pickupLocation?: string;
  destinationLocation?: string;
  travelDate?: string;
  additionalRequirements?: string;
  status: InquiryStatus;
  createdAt: string;
  source: 'modal' | 'contact_section';
}

export interface InquiryFormData {
  vehicleId: string;
  vehicleName: string;
  seatingCapacity: number;
  vehicleType: 'AC' | 'Non-AC';
  fullName: string;
  mobileNumber: string;
  pickupLocation: string;
  destinationLocation: string;
  travelDate: string;
  additionalRequirements?: string;
}

export interface ContactFormData {
  fullName: string;
  mobileNumber: string;
  message: string;
}

export type Language = 'mr' | 'en';
