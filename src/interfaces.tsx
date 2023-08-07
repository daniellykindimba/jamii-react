export interface UserData {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegionData {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DistrictData {
  id: number;
  name: string;
  region: RegionData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleData {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaData {
  id: number;
  name: string;
  registrationNumber: string;
  startDate: string;
  endDate: string;
  contributionType: string;
  contributionAmount: number;
  interestRate: number;
  initialShare: number;
  paymentMode: string;
  planType: string;
  allowClientLoanApplication: boolean;
  totalMembers: number;
  region: RegionData;
  district: DistrictData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaExtendedData {
  id: number;
  name: string;
  contributionType: string;
  contributionAmount: number;
  registrationNumber: string;
  startDate: string;
  endDate: string;
  interestRate: number;
  initialShare: number;
  region: RegionData;
  district: DistrictData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaAnalyticsData {
  TotalBalance: number;
  TotalLoans: number;
  TotalPaidLoans: number;
  TotalUnpaidLoans: number;
  TotalCharges: number;
  TotalMembers: number;
  TotalNames: number;
}

export interface KikobaMemberData {
  id: number;
  kikoba: KikobaData;
  member: UserData;
  nickname: string;
  contributionName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaPolicyData {
  id: number;
  content: string;
  kikoba: KikobaData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaScheduleData {
  fullName: string;
  schedule: [number];
}

export interface KikobaContributionData {
  id: number;
  kikoba: KikobaData;
  kikobaMember: KikobaMemberData;
  amount: number;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaTransactionData {
  id: number;
  kikoba: KikobaData;
  kikobaMember: KikobaMemberData;
  author: UserData;
  amount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaLoanApproverData {
  id: number;
  kikoba: KikobaData;
  kikobaMember: KikobaMemberData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaPayoutApproverData {
  id: number;
  kikoba: KikobaData;
  kikobaMember: KikobaMemberData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaLoanRequestData {
  id: number;
  kikoba: KikobaData;
  kikobaMember: KikobaMemberData;
  amount: number;
  isActive: boolean;
  isApproved: boolean;
  isRejected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaLoanData {
  id: number;
  kikoba: KikobaData;
  kikobaMember: KikobaMemberData;
  amount: number;
  paidAmount: number;
  isActive: boolean;
  isApproved: boolean;
  isRejected: boolean;
  isFullyRepaid: boolean;
  isPartially: boolean;
  isFully: boolean;
  isOverPaid: boolean;
  isUnderPaid: boolean;
  isPartiallyPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KikobaLoanRepaymentData {
  id: number;
  kikoba: KikobaData;
  loanRequest: KikobaLoanRequestData;
  amount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingData {
  id: number;
  user: UserData;
  reference: string;
  phone: string;
  amount: number;
  billingStatus: string;
  serviceTag: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationData {
  id: number;
  donationNumber: string;
  title: string;
  description: string;
  totalAmount: number;
  totalDonations: number;
  totalDonators: number;
  totalDisbursements: number;
  user: UserData;
  kikoba: KikobaData;
  deadline: string;
  isPublic: boolean;
  onlineCollection: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationMemberData {
  id: number;
  user: UserData;
  donation: DonationData;
  totalDonations: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationPaymentData {
  id: number;
  user: UserData;
  donation: DonationData;
  amount: number;
  reference: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationDisbursementData {
  id: number;
  user: UserData;
  donation: DonationData;
  amount: number;
  phone: string;
  reference: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
